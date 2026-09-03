/**
 * The URL name of a species.
 *
 * Every record already carries two names: a catalog id (`salmo_trutta`) and a
 * common name ("Brown trout"). The id is what the engine, the packets and the
 * database key on, and none of that changes here. But an id is a poor thing to
 * put in a link — nobody reads `salmo_trutta` and knows what it is, and the
 * underscore reads as a typo in a shared message.
 *
 * So the URL uses a slug of the first common name. Two things made that choice
 * rather than the scientific name:
 *
 * 1. It is the name a person searches for. Almost nobody types "Salmo trutta".
 * 2. `public/species/<slug>/thumb.webp` already uses exactly this form for the
 *    reviewed images, so the convention was in the repository before the pages
 *    were. A second scheme beside it would be one scheme too many.
 *
 * All 111 reviewed common names slugify to distinct strings — `speciesSlugs()`
 * asserts it, and `src/lib/knowledge/species-slug.test.ts` runs that assertion
 * so a future record that collides fails the test suite rather than quietly
 * taking another fish's URL.
 *
 * Old-style ids keep working. `resolveSpeciesRef` accepts a slug, a catalog id
 * or a scientific name and says which form it got, so the page can serve the
 * record and point the canonical at the one true URL instead of 404ing on a
 * link somebody already sent.
 */

import type { SpeciesRecord } from "../protocol/types.ts";
import { SPECIES, SPECIES_BY_ID } from "./species-catalog.ts";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function speciesSlug(species: SpeciesRecord): string {
  return slugify(species.commonNames[0] ?? species.scientificName);
}

function buildSlugIndex(): {
  slugById: Record<string, string>;
  bySlug: Record<string, SpeciesRecord>;
  collisions: string[];
} {
  const slugById: Record<string, string> = {};
  const bySlug: Record<string, SpeciesRecord> = {};
  const collisions: string[] = [];
  for (const species of SPECIES) {
    const slug = speciesSlug(species);
    if (bySlug[slug]) collisions.push(slug);
    else bySlug[slug] = species;
    slugById[species.id] = slug;
  }
  return { slugById, bySlug, collisions };
}

const index = buildSlugIndex();

export const SPECIES_SLUG_BY_ID: Record<string, string> = index.slugById;
export const SPECIES_BY_SLUG: Record<string, SpeciesRecord> = index.bySlug;

/** Slugs that two records both want. Empty today; the test keeps it empty. */
export const SLUG_COLLISIONS: string[] = index.collisions;

export const SPECIES_SLUGS: string[] = Object.keys(index.bySlug).sort();

export function slugForId(speciesId: string): string | null {
  return SPECIES_SLUG_BY_ID[speciesId] ?? null;
}

/** How a link named the fish. Only `slug` is canonical. */
export type SpeciesRefForm = "slug" | "id" | "scientific";

export type SpeciesRef = {
  species: SpeciesRecord;
  slug: string;
  form: SpeciesRefForm;
};

const BY_SCIENTIFIC: Record<string, SpeciesRecord> = Object.fromEntries(
  SPECIES.map((species) => [slugify(species.scientificName), species]),
);

/**
 * Find the record a URL segment means, in the order a link is likely to carry.
 *
 * Returns `null` rather than a nearest guess. Serving the wrong fish for a
 * mistyped name would be worse than a 404: the page would look right.
 */
export function resolveSpeciesRef(param: string | null | undefined): SpeciesRef | null {
  const raw = (param ?? "").trim();
  if (!raw) return null;

  const bySlug = SPECIES_BY_SLUG[slugify(raw)];
  if (bySlug) return { species: bySlug, slug: speciesSlug(bySlug), form: "slug" };

  const byId = SPECIES_BY_ID[raw] ?? SPECIES_BY_ID[raw.toLowerCase()];
  if (byId) return { species: byId, slug: speciesSlug(byId), form: "id" };

  const byScientific = BY_SCIENTIFIC[slugify(raw)];
  if (byScientific)
    return { species: byScientific, slug: speciesSlug(byScientific), form: "scientific" };

  return null;
}

export function speciesPath(speciesOrId: SpeciesRecord | string): string {
  const slug = typeof speciesOrId === "string" ? slugForId(speciesOrId) : speciesSlug(speciesOrId);
  return slug ? `/species/${slug}` : "/species";
}
