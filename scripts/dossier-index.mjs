#!/usr/bin/env node
/**
 * One reading of every reviewed dossier in the repository, from both homes.
 *
 * The records live in two places mid-migration: `data/dossiers/*.json` is where
 * new work is authored, and `src/lib/knowledge/*-dossiers.ts` still holds the
 * 55 that have not been exported yet. Every maintenance script needs the same
 * merged view, and each one building its own would guarantee they eventually
 * disagree about what the catalog contains — so they all read this.
 *
 * Nothing here judges a record. It answers "what is written down, where does it
 * live, and when was it last looked at". The judging is in the report scripts.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JSON_DIR = join(ROOT, "data", "dossiers");

export const KINDS = ["identification", "behavior", "diet", "seasonal_calendar"];

/** The four TypeScript modules a record can still live in, for in-place edits. */
export const TS_DOSSIER_FILES = {
  identification: join(ROOT, "src", "lib", "knowledge", "identification-dossiers.ts"),
  behavior: join(ROOT, "src", "lib", "knowledge", "behavior-dossiers.ts"),
  diet: join(ROOT, "src", "lib", "knowledge", "diet-dossiers.ts"),
  seasonal_calendar: join(ROOT, "src", "lib", "knowledge", "seasonal-calendar-dossiers.ts"),
};

export { ROOT, JSON_DIR };

function jsonBundles() {
  if (!existsSync(JSON_DIR)) return {};
  const out = {};
  for (const file of readdirSync(JSON_DIR).filter((f) => f.endsWith(".json")).sort()) {
    out[file.replace(/\.json$/, "")] = {
      file: join(JSON_DIR, file),
      bundle: JSON.parse(readFileSync(join(JSON_DIR, file), "utf8")),
    };
  }
  return out;
}

/**
 * Every dossier record, flattened to one entry per species per overlay.
 *
 * `home` is "json" or "ts" and `file` is the file that would have to be edited
 * to change it. Both matter to the source checker: a JSON record can be
 * rewritten by key, a TypeScript one only by replacing the literal.
 */
export async function loadDossierIndex() {
  const catalogModule = await import("../src/lib/knowledge/species-catalog.ts");
  const dossierModule = await import("../src/lib/knowledge/dossier-catalog.ts");
  const { SPECIES, SPECIES_BY_ID } = catalogModule;

  const ts = {
    identification: dossierModule.IDENTIFICATION_BY_SPECIES,
    behavior: dossierModule.BEHAVIOR_BY_SPECIES,
    diet: dossierModule.DIET_BY_SPECIES,
    seasonal_calendar: dossierModule.SEASONAL_CALENDAR_BY_SPECIES,
  };

  const json = jsonBundles();
  const entries = [];
  const collisions = [];
  const orphans = [];

  for (const [speciesId, { file, bundle }] of Object.entries(json)) {
    if (!SPECIES_BY_ID[speciesId]) orphans.push(speciesId);
    for (const kind of KINDS) {
      const record = bundle[kind];
      if (!record) continue;
      if (ts[kind][speciesId]) collisions.push({ speciesId, kind });
      entries.push({ speciesId, kind, record, home: "json", file });
    }
  }

  for (const kind of KINDS) {
    for (const [speciesId, record] of Object.entries(ts[kind])) {
      if (json[speciesId]?.bundle?.[kind]) continue; // JSON wins, as the migration runs
      entries.push({ speciesId, kind, record, home: "ts", file: TS_DOSSIER_FILES[kind] });
    }
  }

  const bySpecies = new Map();
  for (const entry of entries) {
    if (!bySpecies.has(entry.speciesId)) bySpecies.set(entry.speciesId, {});
    bySpecies.get(entry.speciesId)[entry.kind] = entry;
  }

  return {
    species: SPECIES,
    speciesById: SPECIES_BY_ID,
    entries,
    bySpecies,
    /** A species in both homes for the same overlay — the JSON is used, but say so. */
    collisions,
    /** A dossier file for a species the reviewed catalog does not contain. */
    orphans,
    /** Reviewed species carrying no record at all for an overlay. */
    missing: SPECIES.flatMap((species) =>
      KINDS.filter((kind) => !bySpecies.get(species.id)?.[kind]).map((kind) => ({
        speciesId: species.id,
        kind,
      })),
    ),
  };
}

/** Every distinct source URL, with the records that cite it. */
export function sourceUrlIndex(entries) {
  const byUrl = new Map();
  for (const entry of entries) {
    for (const source of entry.record?.sources ?? []) {
      if (!source?.url) continue;
      const url = source.url.trim();
      if (!byUrl.has(url)) byUrl.set(url, { url, cites: [] });
      byUrl.get(url).cites.push({
        speciesId: entry.speciesId,
        kind: entry.kind,
        home: entry.home,
        file: entry.file,
        label: source.label,
        class: source.class,
      });
    }
  }
  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(fromIso, toIso) {
  const from = Date.parse(fromIso + "T00:00:00Z");
  const to = Date.parse(toIso + "T00:00:00Z");
  if (Number.isNaN(from) || Number.isNaN(to)) return null;
  return Math.round((to - from) / 86_400_000);
}
