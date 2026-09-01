/**
 * The four reviewed knowledge overlays for one species, as the app consumes
 * them.
 *
 * These records used to be compiled into the client bundle — roughly 10,500
 * lines of TypeScript, ~530 KB of JSON, every species downloaded by every
 * visitor in order to read one. They now live in Supabase
 * (`public.species_dossiers`, public reference data readable anonymously) and
 * arrive per species.
 *
 * Everything downstream of here is a pure function of this bundle, so the
 * reading logic is identical whether the overlays came from the database, a
 * test fixture, or nothing at all.
 */

import type {
  BehaviorDossier,
  DietDossier,
  IdentificationDossier,
  SeasonalCalendarDossier,
} from "./dossier-types.ts";
import { KNOWLEDGE_OVERLAYS, type KnowledgeOverlay } from "./seed-queue.ts";

export type SpeciesOverlays = {
  identification: IdentificationDossier | null;
  behavior: BehaviorDossier | null;
  diet: DietDossier | null;
  seasonalCalendar: SeasonalCalendarDossier | null;
};

export const EMPTY_OVERLAYS: SpeciesOverlays = {
  identification: null,
  behavior: null,
  diet: null,
  seasonalCalendar: null,
};

/**
 * Why a species has no overlays right now.
 *
 * The distinction matters more here than in most apps: "this fish has not been
 * reviewed yet" is a deliberate editorial statement this product makes, while
 * "the reviewed record could not be loaded" is a failure. Collapsing the two
 * would have the app claim a research gap that does not exist.
 */
export type OverlayStatus = "loading" | "ready" | "unavailable";

export type OverlayState = {
  status: OverlayStatus;
  overlays: SpeciesOverlays;
};

export type OverlayPresence = Record<KnowledgeOverlay, boolean>;

export function overlayPresence(overlays: SpeciesOverlays): OverlayPresence {
  return {
    identification: overlays.identification != null,
    behavior: overlays.behavior != null,
    diet: overlays.diet != null,
    seasonal_calendar: overlays.seasonalCalendar != null,
  };
}

export function completeOverlayCount(presence: OverlayPresence): number {
  return KNOWLEDGE_OVERLAYS.filter((overlay) => presence[overlay]).length;
}

export function hasCompleteKnowledgeOverlays(overlays: SpeciesOverlays): boolean {
  const presence = overlayPresence(overlays);
  return KNOWLEDGE_OVERLAYS.every((overlay) => presence[overlay]);
}

/** Catalog-wide counts, from `public.species_dossier_coverage`. */
export type DossierCoverage = {
  identification: number;
  behavior: number;
  diet: number;
  seasonal_calendar: number;
  completeOverlays: number;
  speciesWithAny: number;
};

export const EMPTY_COVERAGE: DossierCoverage = {
  identification: 0,
  behavior: 0,
  diet: 0,
  seasonal_calendar: 0,
  completeOverlays: 0,
  speciesWithAny: 0,
};

/** Row shape returned by the API routes, kept in one place so both ends agree. */
export type DossierRow = {
  species_id: string;
  kind: KnowledgeOverlay;
  payload: unknown;
};

export function overlaysFromRows(rows: DossierRow[]): SpeciesOverlays {
  const overlays: SpeciesOverlays = { ...EMPTY_OVERLAYS };
  for (const row of rows) {
    if (row.kind === "identification") {
      overlays.identification = row.payload as IdentificationDossier;
    } else if (row.kind === "behavior") {
      overlays.behavior = row.payload as BehaviorDossier;
    } else if (row.kind === "diet") {
      overlays.diet = row.payload as DietDossier;
    } else if (row.kind === "seasonal_calendar") {
      overlays.seasonalCalendar = row.payload as SeasonalCalendarDossier;
    }
  }
  return overlays;
}
