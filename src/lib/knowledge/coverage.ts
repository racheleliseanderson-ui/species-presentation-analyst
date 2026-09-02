/**
 * Catalog-wide AFP coverage, computed from the reviewed dossier files in this
 * repository.
 *
 * The running app never reads this module: the dossiers live in Supabase and
 * the app asks `/api/dossier-coverage` for the same counts. What is left here
 * is the seed-time and test-time view — the checks that keep the authored
 * records honest before they are loaded into the database. Because it runs
 * only under Node it reads `data/dossiers/` directly, which matters: that
 * directory is the source of record, and coverage computed from the older
 * in-bundle TypeScript alone would have reported the entire saltwater catalog
 * as unresearched.
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SPECIES } from "./species-catalog.ts";
import { buildAnglerSpeciesProfile, type AnglerProfileSectionId } from "./angler-profile.ts";
import {
  behaviorDossierFor,
  dietDossierFor,
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";
import {
  completeOverlayCount,
  hasCompleteKnowledgeOverlays as hasCompleteOverlays,
  overlayPresence as presenceOf,
  type OverlayPresence,
  type SpeciesOverlays,
} from "./overlays.ts";
import {
  KNOWLEDGE_OVERLAYS,
  nextSeedWave,
  type KnowledgeOverlay,
} from "./seed-queue.ts";

export { completeOverlayCount };
export type { OverlayPresence };

type DossierBundle = {
  identification?: SpeciesOverlays["identification"];
  behavior?: SpeciesOverlays["behavior"];
  diet?: SpeciesOverlays["diet"];
  seasonal_calendar?: SpeciesOverlays["seasonalCalendar"];
};

/**
 * The JSON dossiers, read once. `data/dossiers/` is where reviewed records are
 * authored now; the `*-dossiers.ts` modules are the older 55 that have not been
 * exported yet. Both are read, and the JSON wins on a collision, because that
 * is the direction the migration runs.
 */
const FILE_DOSSIERS: Record<string, DossierBundle> = (() => {
  const dir = fileURLToPath(new URL("../../../data/dossiers/", import.meta.url));
  const out: Record<string, DossierBundle> = {};
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (!name.endsWith(".json")) continue;
    out[name.replace(/\.json$/, "")] = JSON.parse(readFileSync(dir + name, "utf8")) as DossierBundle;
  }
  return out;
})();

/** The authored overlays for one species, as written in this repository. */
export function authoredOverlays(speciesId: string): SpeciesOverlays {
  const file = FILE_DOSSIERS[speciesId];
  return {
    identification: file?.identification ?? identificationDossierFor(speciesId),
    behavior: file?.behavior ?? behaviorDossierFor(speciesId),
    diet: file?.diet ?? dietDossierFor(speciesId),
    seasonalCalendar: file?.seasonal_calendar ?? seasonalCalendarDossierFor(speciesId),
  };
}

export function overlayPresence(speciesId: string): OverlayPresence {
  return presenceOf(authoredOverlays(speciesId));
}

export function hasCompleteKnowledgeOverlays(speciesId: string): boolean {
  return hasCompleteOverlays(authoredOverlays(speciesId));
}

const KNOWLEDGE_SECTION_IDS: AnglerProfileSectionId[] = [
  "identification",
  "behavior",
  "diet",
  "seasonal_calendar",
];

export function catalogOverlaySummary() {
  let complete = 0;
  const byOverlay: Record<KnowledgeOverlay, number> = {
    identification: 0,
    behavior: 0,
    diet: 0,
    seasonal_calendar: 0,
  };

  for (const record of SPECIES) {
    const presence = overlayPresence(record.id);
    if (KNOWLEDGE_OVERLAYS.every((overlay) => presence[overlay])) complete += 1;
    for (const overlay of KNOWLEDGE_OVERLAYS) {
      if (presence[overlay]) byOverlay[overlay] += 1;
    }
  }

  return {
    speciesTotal: SPECIES.length,
    completeOverlays: complete,
    remainingOverlays: SPECIES.length - complete,
    byOverlay,
    nextWave: nextSeedWave(),
  };
}

export function catalogKnowledgeCoverage() {
  const summary = catalogOverlaySummary();
  let fightReviewed = 0;
  let foodReviewed = 0;
  let reviewedSectionCells = 0;

  for (const record of SPECIES) {
    const profile = buildAnglerSpeciesProfile(record, authoredOverlays(record.id));
    reviewedSectionCells += profile.coverage.reviewed;
    if (profile.sections.find((section) => section.id === "fight")?.status === "reviewed") fightReviewed += 1;
    if (profile.sections.find((section) => section.id === "food_value")?.status === "reviewed") foodReviewed += 1;
  }

  return {
    ...summary,
    reviewedSectionCells,
    sectionCells: SPECIES.length * 10,
    fightReviewed,
    foodReviewed,
    knowledgeSectionIds: KNOWLEDGE_SECTION_IDS,
  };
}
