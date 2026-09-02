#!/usr/bin/env node
/**
 * Validate drafted dossier JSON against the AFP schema and the app's closed
 * vocabularies, before anything is seeded.
 *
 *   node --experimental-strip-types scripts/validate-dossiers.mjs <dir>
 *
 * This exists because a dossier is read as fact by someone standing in a river.
 * A field with the wrong name is silently dropped by the UI; an enum outside the
 * vocabulary renders as raw snake_case; a `presentationImplication` naming a
 * family the engine does not rank is a promise the app cannot keep. None of
 * those are caught by `tsc`, because the records arrive as JSON at runtime.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const KINDS = ["identification", "behavior", "diet", "seasonal_calendar"];

/**
 * Words that must appear in `gaps` for an empty required field to be accepted.
 *
 * The product's promise is not "every field is filled" — for several saltwater
 * species nobody has published a look-alike key or a regional nickname, and
 * inventing one would be the actual defect. The promise is that nothing is
 * missing *silently*. So an empty field is allowed exactly when the record
 * says out loud, in its own gaps, that it is missing and why.
 */
const GAP_KEYWORDS = {
  regionalNames: ["regional", "nickname", "common name", "colloquial"],
  similarSpecies: ["similar", "look-alike", "look alike", "confus", "misidentif"],
  identificationTraits: ["identification", "field mark", "trait"],
  coloration: ["colora", "colour", "color"],
  adultAppearance: ["adult appearance", "appearance"],
  averageAdultLength: ["average", "length"],
  commonAnglingSize: ["angling size", "common size", "typical size"],
  typicalWeight: ["weight"],
  maximumDocumentedSize: ["maximum", "max size"],
  primaryForage: ["forage", "diet", "prey"],
  primaryNote: ["forage", "diet", "prey"],
  observedForageRule: ["forage", "diet", "prey"],
  entries: ["seasonal", "calendar", "season"],
  overview: ["overview", "seasonal"],
  sources: ["source", "no species-specific", "not found", "no data"],
  spawningBehavior: ["spawn"],
  feedingStrategy: ["feeding"],
  dielTendency: ["diel", "light", "time of day"],
  social: ["social", "schooling"],
};

/** Does the record name this empty field in its own gaps? */
function gapExplains(record, field) {
  const gaps = (record?.gaps ?? []).join(" ").toLowerCase();
  if (!gaps) return false;
  const keywords = GAP_KEYWORDS[field] ?? [field.replace(/([A-Z])/g, " $1").toLowerCase()];
  return keywords.some((word) => gaps.includes(word));
}

const REQUIRED = {
  identification: [
    "speciesId", "status", "regionalNames", "bodyShape", "identificationTraits",
    "coloration", "adultAppearance", "similarSpecies", "averageAdultLength",
    "commonAnglingSize", "typicalWeight", "maximumDocumentedSize", "sources",
    "reviewedAt", "nextReviewAt", "gaps",
  ],
  behavior: [
    "speciesId", "status", "social", "feedingStrategy", "dielTendency",
    "spawningBehavior", "sources", "reviewedAt", "nextReviewAt", "gaps",
  ],
  diet: [
    "speciesId", "status", "feedingStyle", "feedingZone", "primaryForage",
    "primaryNote", "observedForageRule", "sources", "reviewedAt",
    "nextReviewAt", "gaps",
  ],
  seasonal_calendar: [
    "speciesId", "status", "overview", "entries", "sources", "reviewedAt",
    "nextReviewAt", "gaps",
  ],
};

const ENUMS = {
  status: ["reviewed", "partial"],
  sourceClass: ["agency", "peer_reviewed", "synthesis"],
  socialPattern: ["schooling", "solitary", "loose_aggregation", "mixed_by_life_stage"],
  feedingMode: ["ambush", "pursuit", "drift_feeding", "benthic_feeding", "filter", "opportunistic"],
  dielClass: ["crepuscular", "diurnal", "nocturnal", "mixed"],
  feedingStyle: ["opportunistic", "specialized", "mixed"],
  feedingZone: ["benthic", "pelagic", "surface", "mixed"],
};

/**
 * Prose in `presentationImplication` may only name a family the engine ranks.
 *
 * Derived from the presentation catalog rather than hand-listed, because the
 * hand-listed version silently went stale the moment saltwater added fourteen
 * families and then warned on every correct marine record. Both sides are
 * normalized so "Live-bait slow troll", "live bait slow troll" and
 * "live_bait_slow_troll" all match the same family.
 */
function normalizeProse(value) {
  return value
    .toLowerCase()
    .replaceAll("\u2011", "-")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function familyPhrases(presentations) {
  const phrases = new Set();
  for (const family of presentations) {
    phrases.add(normalizeProse(family.id));
    phrases.add(normalizeProse(family.label));
  }
  // A few families are habitually referred to by a shorter phrase in reviewed
  // prose; these are aliases for existing families, never new ones.
  for (const alias of ["slow roll", "natural bait", "live bait", "stop and go", "dead drift"]) {
    phrases.add(alias);
  }
  return [...phrases];
}

export function validate(record, kind, vocab, catalog, familyWords = []) {
  const errors = [];
  const warnings = [];
  const at = (f) => `${record?.speciesId ?? "?"}/${kind}.${f}`;

  for (const field of REQUIRED[kind]) {
    const value = record?.[field];
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim()) ||
      (Array.isArray(value) && field !== "gaps" && value.length === 0);
    if (empty) {
      if (gapExplains(record, field)) {
        warnings.push(`${at(field)} is empty, declared in gaps`);
      } else {
        errors.push(`${at(field)} is missing or empty and no gap explains it`);
      }
    }
  }

  if (record?.status && !ENUMS.status.includes(record.status)) {
    errors.push(`${at("status")} is "${record.status}"`);
  }

  for (const source of record?.sources ?? []) {
    if (!ENUMS.sourceClass.includes(source?.class)) {
      errors.push(`${at("sources")} has class "${source?.class}"`);
    }
    if (!source?.label?.trim()) errors.push(`${at("sources")} has a source with no label`);
  }

  // A record that claims to be fully reviewed but lists gaps is contradicting
  // itself — the product's whole point is that a gap is stated, not hidden.
  if (record?.status === "reviewed" && (record.gaps ?? []).length === 0) {
    warnings.push(`${at("gaps")} is empty on a "reviewed" record — is nothing outstanding?`);
  }

  if (kind === "behavior") {
    if (record?.social && !ENUMS.socialPattern.includes(record.social.pattern)) {
      errors.push(`${at("social.pattern")} is "${record.social?.pattern}"`);
    }
    if (record?.dielTendency && !ENUMS.dielClass.includes(record.dielTendency.class)) {
      errors.push(`${at("dielTendency.class")} is "${record.dielTendency?.class}"`);
    }
    for (const mode of record?.feedingStrategy?.modes ?? []) {
      if (!ENUMS.feedingMode.includes(mode)) errors.push(`${at("feedingStrategy.modes")} has "${mode}"`);
    }
  }

  if (kind === "diet") {
    if (record?.feedingStyle && !ENUMS.feedingStyle.includes(record.feedingStyle)) {
      errors.push(`${at("feedingStyle")} is "${record.feedingStyle}"`);
    }
    if (record?.feedingZone && !ENUMS.feedingZone.includes(record.feedingZone)) {
      errors.push(`${at("feedingZone")} is "${record.feedingZone}"`);
    }
    for (const forage of record?.primaryForage ?? []) {
      if (!vocab.FORAGE_CLASSES.includes(forage)) errors.push(`${at("primaryForage")} has "${forage}"`);
    }
    for (const item of record?.seasonalDiet ?? []) {
      if (!vocab.SEASONS.includes(item?.season) || item?.season === "unknown") {
        errors.push(`${at("seasonalDiet")} has season "${item?.season}"`);
      }
    }
  }

  if (kind === "seasonal_calendar") {
    const seen = new Set();
    for (const entry of record?.entries ?? []) {
      if (!vocab.SEASONS.includes(entry?.season) || entry?.season === "unknown") {
        errors.push(`${at("entries")} has season "${entry?.season}"`);
      }
      if (seen.has(entry?.season)) errors.push(`${at("entries")} repeats season "${entry.season}"`);
      seen.add(entry?.season);
      if (!entry?.habitatClass?.trim()) {
        errors.push(`${at("entries")} ${entry?.season} has no habitatClass`);
      }
      const implication = entry?.presentationImplication;
      if (implication) {
        const lower = normalizeProse(implication);
        if (!familyWords.some((word) => lower.includes(word))) {
          warnings.push(
            `${at("entries")} ${entry.season}: presentationImplication names no known family — "${implication.slice(0, 60)}"`,
          );
        }
      }
    }
  }

  // The catalog record and the dossier must not contradict each other about
  // what this fish eats; the reading shows both side by side.
  if (kind === "diet" && catalog) {
    const known = new Set(catalog.forageClasses);
    for (const forage of record?.primaryForage ?? []) {
      if (!known.has(forage)) {
        warnings.push(`${at("primaryForage")} has "${forage}", which the catalog record does not list`);
      }
    }
  }

  // Conservation-sensitive and non-target species get no presentation guidance
  // anywhere in the app; a calendar that carries one would contradict the engine.
  if (kind === "seasonal_calendar" && catalog) {
    const status = catalog.targetStatus ?? "standard";
    if (status === "conservation_sensitive" || status === "non_target") {
      for (const entry of record?.entries ?? []) {
        if (entry?.presentationImplication) {
          errors.push(
            `${at("entries")} ${entry.season} carries a presentationImplication, but this species is ${status}`,
          );
        }
      }
    }
  }

  return { errors, warnings };
}

async function main() {
  const dir = process.argv[2] ?? "/tmp/dossiers";
  const vocab = await import("../src/lib/protocol/vocab.ts");
  const { SPECIES_BY_ID } = await import("../src/lib/knowledge/species-catalog.ts");
  const { PRESENTATIONS } = await import("../src/lib/knowledge/presentations.ts");
  const familyWords = familyPhrases(PRESENTATIONS);

  let errors = 0;
  let warnings = 0;
  let records = 0;

  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    const speciesId = file.replace(/\.json$/, "");
    const catalog = SPECIES_BY_ID[speciesId];
    const problems = [];
    if (!catalog) problems.push(`${speciesId} is not in the reviewed catalog`);

    const bundle = JSON.parse(readFileSync(join(dir, file), "utf8"));
    for (const kind of KINDS) {
      const record = bundle[kind];
      if (!record) {
        problems.push(`${speciesId}: no ${kind} record`);
        continue;
      }
      records += 1;
      if (record.speciesId !== speciesId) {
        problems.push(`${speciesId}/${kind}.speciesId is "${record.speciesId}"`);
      }
      const result = validate(record, kind, vocab, catalog, familyWords);
      problems.push(...result.errors);
      for (const warning of result.warnings) console.log(`  warn  ${warning}`);
      warnings += result.warnings.length;
    }

    if (problems.length) {
      errors += problems.length;
      console.log(`FAIL  ${speciesId}`);
      for (const problem of problems) console.log(`  ${problem}`);
    } else {
      console.log(`ok    ${speciesId}`);
    }
  }

  console.log(`\n${records} records · ${errors} errors · ${warnings} warnings`);
  process.exitCode = errors === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
