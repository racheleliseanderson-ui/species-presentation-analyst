#!/usr/bin/env node
/**
 * Turn a list of species names into a research brief. Not into a record.
 *
 * The seeding script on the restaurant side can go and find a website, prove it
 * belongs to the business, and read an address off it. There is no equivalent
 * move here. A species record is a reviewed biological claim assembled from
 * agency and peer-reviewed sources, and the honest automation is everything up
 * to the point where judgment starts: check whether the fish is already in the
 * catalogue under another name, work out which existing records it will be
 * confused with, and lay out exactly what a reviewed record has to contain.
 *
 * The writing is still the writing.
 *
 *   node --experimental-strip-types scripts/species-brief.mjs [--out=reports]
 *
 * Writes one brief per genuinely new species. Never touches data/dossiers.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { ROOT, today } from "./dossier-index.mjs";
import { REQUIRED } from "./validate-dossiers.mjs";

const TARGETS_FILE = join(ROOT, "data", "species-targets.json");

export function normalizeName(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Genus, from a scientific name. The cheapest reliable lookalike signal there is. */
export function genusOf(scientificName) {
  const first = String(scientificName ?? "").trim().split(/\s+/)[0];
  return first ? first.toLowerCase() : null;
}

/**
 * Is this fish already here under a name the catalogue happens to use?
 *
 * Checks the id, the scientific name, every reviewed common name and every
 * informal alias, because the whole reason a species gets requested twice is
 * that somebody typed the name the catalogue does not print.
 */
export function findExisting(target, species, aliases) {
  const wanted = new Set([normalizeName(target.commonName), normalizeName(target.scientificName)].filter(Boolean));
  for (const record of species) {
    const names = [
      record.id.replace(/_/g, " "),
      record.scientificName,
      ...(record.commonNames ?? []),
      ...(aliases[record.id] ?? []),
    ].map(normalizeName);
    if (names.some((name) => name && wanted.has(name))) return record;
  }
  return null;
}

/**
 * Words that place a fish rather than describe it.
 *
 * Without this, every new saltwater species comes back "confused with Atlantic
 * salmon", which is not a field problem anybody has. Colours stay in — black
 * drum and red drum genuinely do get mixed up, and that is the exact collision
 * the identification overlay exists to settle.
 */
const PLACEHOLDER_WORDS = new Set([
  "atlantic", "pacific", "american", "northern", "southern", "eastern", "western",
  "common", "greater", "lesser", "giant", "great", "little", "true", "wild",
  "landlocked", "anadromous", "freshwater", "saltwater", "coastal", "inland",
]);

/**
 * Records the new fish will be mistaken for.
 *
 * Four signals, in the order a person would trust them. The first is whoever
 * asked: if the `why` note names a fish that is already in the catalogue, that
 * is a human saying these two get confused, and no string-similarity trick
 * beats it. Then the same genus, then the same folk name — the last word,
 * croaker, drum, bass, trout, the word that actually does the confusing — and
 * then any other shared descriptive word.
 *
 * Family is deliberately not inferred. Nothing in the catalogue records one,
 * and guessing it from a genus is how a script starts inventing taxonomy.
 */
export function lookalikes(target, species) {
  const genus = genusOf(target.scientificName);
  const words = normalizeName(target.commonName).split(" ").filter(Boolean);
  const folkName = words.length ? words[words.length - 1] : null;
  const tokens = new Set(words.filter((word) => word.length > 3 && !PLACEHOLDER_WORDS.has(word)));
  const why = " " + normalizeName(target.why) + " ";

  const hits = [];
  for (const record of species) {
    const reasons = [];
    let rank = 4;

    for (const name of (record.commonNames ?? []).map(normalizeName)) {
      if (name && why.includes(" " + name + " ")) {
        reasons.push("you named it in the note");
        rank = 0;
      }
    }
    if (genus && genusOf(record.scientificName) === genus) {
      reasons.push("same genus");
      rank = Math.min(rank, 1);
    }
    for (const name of (record.commonNames ?? []).map(normalizeName)) {
      const parts = name.split(" ");
      if (folkName && parts[parts.length - 1] === folkName) {
        reasons.push('also a "' + folkName + '"');
        rank = Math.min(rank, 2);
      }
      for (const token of tokens) {
        if (parts.includes(token) && token !== folkName) {
          reasons.push('shares the word "' + token + '"');
          rank = Math.min(rank, 3);
        }
      }
    }

    if (reasons.length) hits.push({ record, rank, reasons: [...new Set(reasons)] });
  }
  return hits.sort((a, b) => a.rank - b.rank || a.record.id.localeCompare(b.record.id));
}

function renderBrief({ target, hits, vocab, presentations, todayIso }) {
  const slug = normalizeName(target.scientificName || target.commonName).replace(/\s+/g, "_");
  const out = [];

  out.push("# Drafting brief — " + target.commonName);
  out.push("");
  out.push("Written " + todayIso + ". This is a brief, not a record. Nothing below is sourced yet.");
  out.push("");
  if (target.scientificName) out.push("Scientific name as given: *" + target.scientificName + "*");
  out.push("Proposed species id: `" + slug + "`");
  if (target.why) {
    out.push("");
    out.push("Why it was asked for: " + target.why);
  }
  out.push("");

  out.push("## What it will be confused with");
  out.push("");
  if (!hits.length) {
    out.push(
      "Nothing in the catalogue shares its genus or its common name. Worth a second look rather than a relief — " +
        "a fish with no lookalike in a 111-record North American catalogue is either genuinely distinct or the " +
        "scientific name is wrong.",
    );
  } else {
    out.push(
      "The identification overlay has to separate the new record from each of these in `similarSpecies`, with a " +
        "distinction somebody can use with the fish in their hands. Not a list of adjectives.",
    );
    out.push("");
    for (const { record, reasons } of hits) {
      out.push(
        "- **" + (record.commonNames?.[0] ?? record.id) + "** `" + record.id + "` (*" + record.scientificName +
          "*) — " + reasons.join(", "),
      );
    }
  }
  out.push("");

  out.push("## What the catalogue record needs");
  out.push("");
  out.push("Before any dossier: the species record itself, in a dated expansion module, carrying");
  out.push("");
  out.push("- `scientificName`, `commonNames`, `group`, `nativeContext`, `geographic`");
  out.push(
    "- `targetStatus` — `standard`, `regulated_context`, `conservation_sensitive` or `non_target`. Decide this " +
      "first. It gates everything downstream, and a conservation-sensitive or non-target record produces no " +
      "presentation guidance at all.",
  );
  out.push(
    "- `thermal` — only if an agency or a paper publishes a band. If nobody does, omit it and let the reading say " +
      "the temperature axis is not reviewed. Do not carry a plausible number.",
  );
  out.push("- `habitat.waterTypes` from: " + vocab.WATER_TYPES.join(", "));
  out.push("- holding classes for each water type it uses");
  out.push("- `forageClasses` from the closed list: " + vocab.FORAGE_CLASSES.join(", "));
  out.push("- the reviewed presentation families, in baseline order, drawn only from families that already exist");
  out.push(
    "- `spawning` as conservation context only — seasons and a note, never a site, a staging concentration or a " +
      "migration bottleneck",
  );
  out.push("");

  out.push("## What each of the four overlays needs");
  out.push("");
  out.push(
    "Required fields, enforced by `npm run validate:dossiers`. An empty one is accepted only when `gaps` says out " +
      "loud that it is missing and why.",
  );
  out.push("");
  for (const [kind, fields] of Object.entries(REQUIRED)) {
    out.push("**" + kind + "** — " + fields.join(", "));
    out.push("");
  }
  out.push(
    "Seasons in the calendar come from: " + vocab.SEASONS.filter((s) => s !== "unknown").join(", ") +
      ". One entry each, no repeats.",
  );
  out.push("");

  out.push("## Presentation families that already exist");
  out.push("");
  out.push(
    "`presentationImplication` may name one of these and nothing else. A new family is a separate, reviewed change " +
      "to the engine, not something a species record introduces.",
  );
  out.push("");
  for (const family of presentations) {
    const water = Array.isArray(family.water) ? family.water.join("/") : family.water;
    out.push("- `" + family.id + "` — " + family.label + " (" + water + ")");
  }
  out.push("");

  out.push("## The rules that will fail this record if it breaks them");
  out.push("");
  out.push("- Every claim comes from a named agency or peer-reviewed source. `class` is `agency`, `peer_reviewed` or `synthesis`.");
  out.push(
    "- What is not sourced is omitted and named in `gaps`. `status` is `partial` whenever the sourcing is thin. " +
      "A short honest record beats a complete invented one.",
  );
  out.push("- No locations, no bite prediction, no lure or brand names, no frozen size, bag or season limits.");
  out.push(
    "- Spawning is conservation context. No spawning site, staging concentration, aggregation or migration " +
      "bottleneck is ever named — and for reef and offshore records, no aggregation is described at all.",
  );
  out.push("- If `targetStatus` is `conservation_sensitive` or `non_target`, no `presentationImplication` appears anywhere in the record.");
  out.push(
    "- A thermal band records in `basis` whether it is a measured preference or merely where the fish gets caught. " +
      "Sources conflate the two constantly.",
  );
  out.push("");

  out.push("## Then");
  out.push("");
  out.push("1. Write the species record and the four overlays.");
  out.push("2. `npm run validate:dossiers` until it is clean.");
  out.push("3. `npm test`.");
  out.push("4. Run REVIEW-AND-UPDATE, which checks the new citations along with everything else.");
  out.push("");

  return { slug, markdown: out.join("\n") + "\n" };
}

function outDir() {
  const hit = process.argv.find((value) => value.startsWith("--out="));
  return join(ROOT, hit ? hit.slice("--out=".length) : "reports");
}

async function main() {
  if (!existsSync(TARGETS_FILE)) {
    console.log("  data/species-targets.json is missing. That file is the list of species to look for.");
    process.exitCode = 1;
    return;
  }

  const parsed = JSON.parse(readFileSync(TARGETS_FILE, "utf8"));
  const targets = Array.isArray(parsed) ? parsed : (parsed.targets ?? []);
  if (!targets.length) {
    console.log("  No species listed in data/species-targets.json. Add some names and run this again.");
    return;
  }

  const { SPECIES } = await import("../src/lib/knowledge/species-catalog.ts");
  const { ALIASES } = await import("../src/lib/knowledge/aliases.ts");
  const { PRESENTATIONS } = await import("../src/lib/knowledge/presentations.ts");
  const vocab = await import("../src/lib/protocol/vocab.ts");

  const dir = outDir();
  mkdirSync(dir, { recursive: true });
  const todayIso = today();

  let written = 0;
  let already = 0;
  for (const target of targets) {
    if (!target?.commonName && !target?.scientificName) continue;
    const name = target.commonName ?? target.scientificName;
    const existing = findExisting(target, SPECIES, ALIASES);
    if (existing) {
      already += 1;
      console.log("  already here   " + name + " is `" + existing.id + "` (" + existing.scientificName + ")");
      continue;
    }

    const hits = lookalikes(target, SPECIES);
    const { slug, markdown } = renderBrief({ target, hits, vocab, presentations: PRESENTATIONS, todayIso });
    const path = join(dir, "brief-" + slug + ".md");
    writeFileSync(path, markdown);
    written += 1;
    console.log("  brief written  " + name + " — " + hits.length + " lookalike(s) in the catalogue");
    console.log("                 " + path.replace(ROOT, "").replace(/^[\\/]/, ""));
  }

  console.log("");
  console.log("  " + written + " brief(s) written. " + already + " already in the catalogue.");
  if (written) console.log("  No record was created. Hand the brief to Claude and the research starts there.");
  console.log("");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
