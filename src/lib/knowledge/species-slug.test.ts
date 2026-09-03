import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { SPECIES } from "./species-catalog.ts";
import {
  SLUG_COLLISIONS,
  SPECIES_SLUGS,
  resolveSpeciesRef,
  slugify,
  speciesSlug,
} from "./species-slug.ts";
import { buildSpeciesPage } from "./species-page.ts";
import { EMPTY_OVERLAYS } from "./overlays.ts";

/**
 * The slug is a public contract. Once a link is in somebody's messages the URL
 * cannot move, so the things that would move it are asserted here rather than
 * discovered in a 404 log.
 */

test("every reviewed species has a distinct slug", () => {
  deepStrictEqual(SLUG_COLLISIONS, []);
  strictEqual(SPECIES_SLUGS.length, SPECIES.length);
});

test("no slug is empty or carries a character a URL would escape", () => {
  for (const slug of SPECIES_SLUGS) {
    ok(slug.length > 0, "empty slug");
    ok(/^[a-z0-9-]+$/.test(slug), `${slug} is not URL-safe`);
    strictEqual(encodeURIComponent(slug), slug);
  }
});

test("a link can name a fish three ways and get the same record", () => {
  for (const species of SPECIES) {
    const slug = speciesSlug(species);
    strictEqual(resolveSpeciesRef(slug)?.species.id, species.id);
    strictEqual(resolveSpeciesRef(species.id)?.species.id, species.id);
    strictEqual(resolveSpeciesRef(species.scientificName)?.species.id, species.id);
    // Only the slug is canonical, and whichever form arrived, the resolver
    // hands back the canonical slug — which is what lets the page point one
    // canonical at one URL without 404ing a link already in circulation.
    strictEqual(resolveSpeciesRef(slug)?.form, "slug");
    strictEqual(resolveSpeciesRef(species.id)?.slug, slug);
    strictEqual(resolveSpeciesRef(species.scientificName)?.slug, slug);
  }
});

test("an unknown name resolves to nothing rather than the nearest fish", () => {
  strictEqual(resolveSpeciesRef("bass-of-some-kind"), null);
  strictEqual(resolveSpeciesRef(""), null);
  strictEqual(resolveSpeciesRef(null), null);
});

test("the sitemap script and the app agree on every slug", () => {
  // The script recomputes the slug rather than importing this module. That is a
  // deliberate trade, and this is the assertion that pays for it.
  const script = readFileSync("scripts/build-sitemap.mjs", "utf8");
  ok(script.includes("function slugify"), "the sitemap script still slugifies");
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  for (const species of SPECIES) {
    const url = `https://species.hookthehorizon.blog/species/${speciesSlug(species)}`;
    ok(sitemap.includes(`<loc>${url}</loc>`), `${species.id} is missing from the sitemap`);
  }
  strictEqual((sitemap.match(/<loc>/g) ?? []).length, SPECIES.length + 3);
});

test("slugify strips accents and apostrophes rather than escaping them", () => {
  strictEqual(slugify("Clark's grebe"), "clarks-grebe");
  strictEqual(slugify("Río Grande cutthroat"), "rio-grande-cutthroat");
  strictEqual(slugify("  Spaced  Out  "), "spaced-out");
});

/**
 * Every species has to survive the page builder with no overlays at all. That
 * is the state a record is in before anyone researches it, and a page that
 * throws there would mean the catalog could never grow.
 */
test("the page model builds for every species, overlays or not", () => {
  for (const species of SPECIES) {
    const model = buildSpeciesPage(species, EMPTY_OVERLAYS);
    strictEqual(model.slug, speciesSlug(species));
    strictEqual(model.path, `/species/${model.slug}`);
    ok(model.commonName.length > 0);
    ok(model.sources.length > 0, `${species.id} renders a page with no sources`);
    ok(model.allGaps.length > 0, `${species.id} claims to know everything`);
    ok(model.meta.description.length <= 300);
  }
});
