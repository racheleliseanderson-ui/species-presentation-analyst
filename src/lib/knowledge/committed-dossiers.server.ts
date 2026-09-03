/**
 * The reviewed overlays as they exist in this repository, with no network call.
 *
 * The app reads its dossiers from Supabase, and that is still the right place
 * for them: they left the client bundle for a reason and a review cycle updates
 * a row rather than a deploy. But two things follow from a read that can fail.
 *
 * First, a species page is a document. If the only copy of the writing lives
 * behind a database that a fresh checkout has no key for, then a clean deploy
 * publishes 111 pages that say the record could not be loaded — which is the
 * one thing this product must never look like, because "could not be loaded"
 * and "nobody has researched this" are indistinguishable to a reader and only
 * one of them is a claim we are entitled to make.
 *
 * Second, the writing is already here. 56 species are authored as JSON under
 * `data/dossiers/`, the other 55 still live as TypeScript, and both are what
 * the seed script pushes to Supabase in the first place. So this module reads
 * the same two sources the seeder does, in the same precedence — the JSON
 * directory wins on a collision, exactly as `data/dossiers/README.md` says —
 * and hands back a bundle in the shape the rest of the app already consumes.
 *
 * Server-only. The glob below inlines roughly a megabyte of reviewed JSON, and
 * shipping that to a browser is what moving to Supabase was meant to stop.
 * Reach it through `species-page.functions.ts`, never from a component.
 */

import { EMPTY_OVERLAYS, type SpeciesOverlays } from "./overlays.ts";
import {
  behaviorDossierFor,
  dietDossierFor,
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";
import type {
  BehaviorDossier,
  DietDossier,
  IdentificationDossier,
  SeasonalCalendarDossier,
} from "./dossier-types.ts";
import { SPECIES } from "./species-catalog.ts";

type AuthoredFile = {
  identification?: IdentificationDossier;
  behavior?: BehaviorDossier;
  diet?: DietDossier;
  seasonal_calendar?: SeasonalCalendarDossier;
};

/**
 * Every authored record, keyed by species id.
 *
 * `eager` because the alternative is 111 dynamic imports on a cold start, and
 * these files never change between deploys. The key is the file's basename,
 * which the validator already requires to be the species id.
 */
const authoredModules = import.meta.glob<AuthoredFile>("../../../data/dossiers/*.json", {
  eager: true,
  import: "default",
});

const AUTHORED: Record<string, AuthoredFile> = Object.fromEntries(
  Object.entries(authoredModules).map(([path, value]) => [
    path.slice(path.lastIndexOf("/") + 1).replace(/\.json$/, ""),
    value,
  ]),
);

/** Where a species' overlays came from, so a page can say which. */
export type CommittedOverlaySource = "authored_json" | "typescript" | "mixed" | "none";

export type CommittedOverlays = {
  overlays: SpeciesOverlays;
  source: CommittedOverlaySource;
};

export function committedOverlaysFor(speciesId: string): CommittedOverlays {
  const authored = AUTHORED[speciesId];
  const ts = {
    identification: identificationDossierFor(speciesId),
    behavior: behaviorDossierFor(speciesId),
    diet: dietDossierFor(speciesId),
    seasonalCalendar: seasonalCalendarDossierFor(speciesId),
  };

  const overlays: SpeciesOverlays = {
    identification: authored?.identification ?? ts.identification ?? null,
    behavior: authored?.behavior ?? ts.behavior ?? null,
    diet: authored?.diet ?? ts.diet ?? null,
    seasonalCalendar: authored?.seasonal_calendar ?? ts.seasonalCalendar ?? null,
  };

  const fromAuthored = [
    authored?.identification,
    authored?.behavior,
    authored?.diet,
    authored?.seasonal_calendar,
  ].filter(Boolean).length;
  const total = [
    overlays.identification,
    overlays.behavior,
    overlays.diet,
    overlays.seasonalCalendar,
  ].filter(Boolean).length;

  const source: CommittedOverlaySource =
    total === 0
      ? "none"
      : fromAuthored === total
        ? "authored_json"
        : fromAuthored === 0
          ? "typescript"
          : "mixed";

  return { overlays: total === 0 ? EMPTY_OVERLAYS : overlays, source };
}

/** Catalog-wide overlay counts computed from what is committed here. */
export function committedCoverage() {
  let identification = 0;
  let behavior = 0;
  let diet = 0;
  let seasonalCalendar = 0;
  let complete = 0;
  let any = 0;

  for (const species of SPECIES) {
    const { overlays } = committedOverlaysFor(species.id);
    const present = [
      overlays.identification,
      overlays.behavior,
      overlays.diet,
      overlays.seasonalCalendar,
    ].filter(Boolean).length;
    if (overlays.identification) identification += 1;
    if (overlays.behavior) behavior += 1;
    if (overlays.diet) diet += 1;
    if (overlays.seasonalCalendar) seasonalCalendar += 1;
    if (present === 4) complete += 1;
    if (present > 0) any += 1;
  }

  return {
    identification,
    behavior,
    diet,
    seasonal_calendar: seasonalCalendar,
    completeOverlays: complete,
    speciesWithAny: any,
  };
}
