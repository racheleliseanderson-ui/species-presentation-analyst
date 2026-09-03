#!/usr/bin/env node
/**
 * Is anything said twice, or said about the wrong fish?
 *
 * Three different failures hide in a catalogue this size, and none of them is
 * caught by `tsc` or by the dossier validator:
 *
 *   1. Two homes for one record. The migration out of TypeScript is half done;
 *      a species in both files is a record that can silently drift.
 *   2. Two fish answering to one name. An alias that maps to two species, or a
 *      regional name shared across records, is the exact confusion the
 *      identification overlay exists to prevent.
 *   3. A cloned record nobody finished editing. Identical prose under the same
 *      field on two different species is the signature of a copy-paste, and it
 *      reads as fact to somebody standing in a river.
 *
 *   node --experimental-strip-types scripts/report-duplicates.mjs [--json]
 *
 * Reads only. Exits non-zero when it finds a defect (1, 2 or 3 above);
 * shared regional names are reported as context and never fail the run.
 */
import process from "node:process";
import { pathToFileURL } from "node:url";
import { loadDossierIndex } from "./dossier-index.mjs";

/** Prose fields long enough that an exact match between species is a clone. */
const PROSE_FIELDS = {
  identification: ["bodyShape", "coloration", "adultAppearance", "averageAdultLength", "typicalWeight"],
  behavior: ["spawningBehavior", "territoriality", "coverUse", "depthMovement"],
  diet: ["primaryNote", "preySizeShifts", "ontogeneticShift"],
  seasonal_calendar: ["overview"],
};

/** Short enough to be a legitimate coincidence between two records. */
const CLONE_MIN_LENGTH = 80;

export function duplicateIds(species) {
  const seen = new Map();
  for (const record of species) seen.set(record.id, (seen.get(record.id) ?? 0) + 1);
  return [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => ({ id, count: n }));
}

export function aliasCollisions(aliases, speciesById) {
  const byName = new Map();
  for (const [speciesId, names] of Object.entries(aliases)) {
    for (const name of names) {
      const key = name.trim().toLowerCase();
      if (!byName.has(key)) byName.set(key, new Set());
      byName.get(key).add(speciesId);
    }
  }
  for (const [speciesId, record] of Object.entries(speciesById)) {
    for (const name of record.commonNames ?? []) {
      const key = name.trim().toLowerCase();
      if (byName.has(key)) byName.get(key).add(speciesId);
    }
  }
  return [...byName.entries()]
    .filter(([, ids]) => ids.size > 1)
    .map(([name, ids]) => ({ name, speciesIds: [...ids].sort() }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function sharedRegionalNames(entries) {
  const byName = new Map();
  for (const entry of entries) {
    if (entry.kind !== "identification") continue;
    for (const name of entry.record?.regionalNames ?? []) {
      const key = name.trim().toLowerCase();
      if (!byName.has(key)) byName.set(key, new Set());
      byName.get(key).add(entry.speciesId);
    }
  }
  return [...byName.entries()]
    .filter(([, ids]) => ids.size > 1)
    .map(([name, ids]) => ({ name, speciesIds: [...ids].sort() }))
    .sort((a, b) => b.speciesIds.length - a.speciesIds.length || a.name.localeCompare(b.name));
}

export function clonedProse(entries, minLength = CLONE_MIN_LENGTH) {
  const byText = new Map();
  for (const entry of entries) {
    for (const field of PROSE_FIELDS[entry.kind] ?? []) {
      const value = entry.record?.[field];
      if (typeof value !== "string") continue;
      const text = value.trim();
      if (text.length < minLength) continue;
      const key = entry.kind + "." + field + " " + text;
      if (!byText.has(key)) byText.set(key, { kind: entry.kind, field, text, speciesIds: new Set() });
      byText.get(key).speciesIds.add(entry.speciesId);
    }
  }
  return [...byText.values()]
    .filter((item) => item.speciesIds.size > 1)
    .map((item) => ({ ...item, speciesIds: [...item.speciesIds].sort() }))
    .sort((a, b) => b.speciesIds.length - a.speciesIds.length);
}

export function labelDrift(entries) {
  const byLabel = new Map();
  for (const entry of entries) {
    for (const source of entry.record?.sources ?? []) {
      if (!source?.label || !source?.url) continue;
      const key = source.label.trim();
      if (!byLabel.has(key)) byLabel.set(key, new Set());
      byLabel.get(key).add(source.url.trim());
    }
  }
  return [...byLabel.entries()]
    .filter(([, urls]) => urls.size > 1)
    .map(([label, urls]) => ({ label, urls: [...urls].sort() }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

async function main() {
  const index = await loadDossierIndex();
  const { ALIASES } = await import("../src/lib/knowledge/aliases.ts");

  const findings = {
    twoHomes: index.collisions,
    orphanDossiers: index.orphans,
    missingOverlays: index.missing,
    duplicateSpeciesIds: duplicateIds(index.species),
    aliasCollisions: aliasCollisions(ALIASES, index.speciesById),
    clonedProse: clonedProse(index.entries),
    sharedRegionalNames: sharedRegionalNames(index.entries),
    sourceLabelDrift: labelDrift(index.entries),
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(findings, null, 2));
  } else {
    const line = (n, text) => console.log("  " + String(n).padStart(4) + "  " + text);
    line(findings.duplicateSpeciesIds.length, "species ids appearing twice in the catalogue");
    line(findings.twoHomes.length, "records living in both JSON and TypeScript");
    line(findings.orphanDossiers.length, "dossier files for a species not in the catalogue");
    line(findings.missingOverlays.length, "reviewed species missing an overlay");
    line(findings.aliasCollisions.length, "informal names that resolve to more than one fish");
    line(findings.clonedProse.length, "blocks of prose written identically about two species");
    line(findings.sourceLabelDrift.length, "source labels pointing at more than one address");
    line(findings.sharedRegionalNames.length, "regional names shared between species (context, not a defect)");
    console.log("");

    for (const item of findings.duplicateSpeciesIds) {
      console.log("  DUPLICATE  " + item.id + " appears " + item.count + " times");
    }
    for (const item of findings.twoHomes) {
      console.log("  TWO HOMES  " + item.speciesId + "/" + item.kind + " — JSON is used, the TypeScript copy is dead weight");
    }
    for (const id of findings.orphanDossiers) {
      console.log("  ORPHAN     " + id + " has a dossier but is not a reviewed species");
    }
    for (const item of findings.missingOverlays) {
      console.log("  MISSING    " + item.speciesId + " has no " + item.kind + " record");
    }
    for (const item of findings.aliasCollisions) {
      console.log('  COLLISION  "' + item.name + '" resolves to ' + item.speciesIds.join(" and "));
    }
    for (const item of findings.clonedProse) {
      console.log("  CLONED     " + item.kind + "." + item.field + " is identical across " + item.speciesIds.join(", "));
      console.log('             "' + item.text.slice(0, 90) + '..."');
    }
    for (const item of findings.sourceLabelDrift) {
      console.log('  DRIFT      "' + item.label.slice(0, 70) + '" cites ' + item.urls.length + " different addresses");
    }
    if (findings.sharedRegionalNames.length) {
      console.log("");
      console.log("  Shared regional names — expected in a real vocabulary, listed so a review can see them:");
      for (const item of findings.sharedRegionalNames.slice(0, 12)) {
        console.log('    "' + item.name + '" — ' + item.speciesIds.join(", "));
      }
      if (findings.sharedRegionalNames.length > 12) {
        console.log("    ...and " + (findings.sharedRegionalNames.length - 12) + " more.");
      }
    }
    console.log("");
  }

  const defects =
    findings.duplicateSpeciesIds.length +
    findings.twoHomes.length +
    findings.orphanDossiers.length +
    findings.missingOverlays.length +
    findings.aliasCollisions.length +
    findings.clonedProse.length;
  process.exitCode = defects === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
