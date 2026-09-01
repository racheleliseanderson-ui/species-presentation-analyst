/**
 * Server-side reader for the reviewed dossiers in Supabase.
 *
 * These are public reference rows — `public.species_dossiers` carries a SELECT
 * policy for the `anon` role gated on `published`, exactly like `species`,
 * `waters` and `agencies`. No sign-in is involved, and no user data is touched.
 *
 * Read over PostgREST with plain `fetch` rather than through the app's Postgres
 * pool: that pool falls back to an embedded PGLite when `DATABASE_URL` is
 * unset, and a fallback that quietly returns zero rows would make the app claim
 * a research gap that does not exist. A missing configuration throws here
 * instead, and the route turns it into an honest "could not load".
 */

import { overlaysFromRows, type DossierRow, type SpeciesOverlays } from "./overlays.ts";
import type { KnowledgeOverlay } from "./seed-queue.ts";

export class DossierSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DossierSourceError";
  }
}

function config(): { url: string; key: string } {
  const url = (process.env.SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  const key = (process.env.SUPABASE_ANON_KEY ?? "").trim();
  if (!url || !key) {
    throw new DossierSourceError(
      "SUPABASE_URL and SUPABASE_ANON_KEY must be set for the reviewed dossiers to load.",
    );
  }
  return { url, key };
}

async function rest<T>(path: string): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new DossierSourceError(
      `Supabase returned ${response.status} for ${path}: ${(await response.text()).slice(0, 200)}`,
    );
  }
  return (await response.json()) as T;
}

/** Every reviewed overlay for one species. Missing overlays come back as null. */
export async function fetchSpeciesOverlays(speciesId: string): Promise<SpeciesOverlays> {
  const rows = await rest<DossierRow[]>(
    `species_dossiers?select=species_id,kind,payload&published=is.true&species_id=eq.${encodeURIComponent(speciesId)}`,
  );
  return overlaysFromRows(rows);
}

type CoverageRow = {
  identification: number;
  behavior: number;
  diet: number;
  seasonal_calendar: number;
  complete_overlays: number;
  species_with_any: number;
};

/** Catalog-wide overlay counts, for the limits page and the species profile. */
export async function fetchDossierCoverage() {
  const rows = await rest<CoverageRow[]>("species_dossier_coverage?select=*&limit=1");
  const row = rows[0];
  if (!row) throw new DossierSourceError("species_dossier_coverage returned no row.");
  return {
    identification: Number(row.identification),
    behavior: Number(row.behavior),
    diet: Number(row.diet),
    seasonal_calendar: Number(row.seasonal_calendar),
    completeOverlays: Number(row.complete_overlays),
    speciesWithAny: Number(row.species_with_any),
  };
}

/** Which species carry which overlays — used by the seeding/coverage checks. */
export async function fetchOverlayIndex(): Promise<Record<string, KnowledgeOverlay[]>> {
  const rows = await rest<{ species_id: string; kind: KnowledgeOverlay }[]>(
    "species_dossiers?select=species_id,kind&published=is.true",
  );
  const index: Record<string, KnowledgeOverlay[]> = {};
  for (const row of rows) {
    (index[row.species_id] ??= []).push(row.kind);
  }
  return index;
}
