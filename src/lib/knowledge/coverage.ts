/**
 * Live AFP coverage. Computed from dossiers and the ten-question profile.
 * Do not hand-maintain a parallel status table.
 */

import { SPECIES } from "./species-catalog.ts";
import { buildAnglerSpeciesProfile, type AnglerProfileSectionId } from "./angler-profile.ts";
import {
  behaviorDossierFor,
  dietDossierFor,
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";
import {
  KNOWLEDGE_OVERLAYS,
  nextSeedWave,
  type KnowledgeOverlay,
} from "./seed-queue.ts";

export type OverlayPresence = Record<KnowledgeOverlay, boolean>;

export function overlayPresence(speciesId: string): OverlayPresence {
  return {
    identification: identificationDossierFor(speciesId) != null,
    behavior: behaviorDossierFor(speciesId) != null,
    diet: dietDossierFor(speciesId) != null,
    seasonal_calendar: seasonalCalendarDossierFor(speciesId) != null,
  };
}

export function completeOverlayCount(presence: OverlayPresence): number {
  return KNOWLEDGE_OVERLAYS.filter((overlay) => presence[overlay]).length;
}

export function hasCompleteKnowledgeOverlays(speciesId: string): boolean {
  const presence = overlayPresence(speciesId);
  return KNOWLEDGE_OVERLAYS.every((overlay) => presence[overlay]);
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
    const profile = buildAnglerSpeciesProfile(record);
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
