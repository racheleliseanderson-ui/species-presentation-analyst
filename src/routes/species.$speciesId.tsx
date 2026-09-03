import { createFileRoute, notFound } from "@tanstack/react-router";
import { Chrome } from "@/components/chrome";
import { SpeciesPageView } from "@/components/species/species-page-view";
import { loadCommittedOverlays } from "@/lib/knowledge/species-page.functions";
import { buildSpeciesPage } from "@/lib/knowledge/species-page";
import { speciesJsonLd } from "@/lib/knowledge/species-schema";
import { resolveSpeciesRef } from "@/lib/knowledge/species-slug";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { EMPTY_OVERLAYS } from "@/lib/knowledge/overlays";
import { SITE_ORIGIN, canonicalFor } from "@/lib/site";

/**
 * One species, one URL.
 *
 * The loader resolves the segment before it fetches anything, because the
 * segment can be three things: the slug this app publishes, the catalog id an
 * older link carries, or the scientific name somebody typed. All three serve
 * the same document; only the slug is canonical, and the `canonical` link the
 * head writes points at the slug regardless of which one arrived. That is a
 * redirect in the only sense that matters to a search engine, without breaking
 * a link that is already in somebody's messages.
 *
 * Overlays come from the loader rather than from a browser fetch so the HTML
 * that leaves the server already contains the fish — a crawler that runs no
 * JavaScript still gets the whole record, which is the entire reason these
 * pages exist.
 */
export const Route = createFileRoute("/species/$speciesId")({
  loader: async ({ params }) => {
    const ref = resolveSpeciesRef(params.speciesId);
    if (!ref) throw notFound();
    const { overlays } = await loadCommittedOverlays({
      data: { speciesId: ref.species.id },
    });
    return { speciesId: ref.species.id, slug: ref.slug, overlays: overlays ?? EMPTY_OVERLAYS };
  },
  head: ({ loaderData }) => {
    const species = loaderData ? SPECIES_BY_ID[loaderData.speciesId] : null;
    if (!species || !loaderData) return {};
    const model = buildSpeciesPage(species, loaderData.overlays);
    const url = `${SITE_ORIGIN}${model.path}`;
    return {
      meta: [
        { title: `${model.meta.title} · Hook the Horizon` },
        { name: "description", content: model.meta.description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: `${model.commonName} — ${model.scientificName}` },
        { property: "og:description", content: model.meta.description },
        { property: "og:url", content: url },
        /* A reviewed photograph when one exists, and the site card when one
         * does not. No width or height goes out with a photograph: the reviewed
         * images are whatever shape USFWS or a state agency published, and a
         * declared size that disagrees with the file is worse than none. */
        {
          property: "og:image",
          content: model.image ? `${SITE_ORIGIN}${model.image.canonical}` : `${SITE_ORIGIN}/og.jpg`,
        },
        ...(model.image
          ? []
          : [
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
            ]),
        {
          property: "og:image:alt",
          content: model.image
            ? `${model.commonName}. ${model.image.sourceOrg}, ${model.image.license}.`
            : "Species & Presentation Analyst — Hook the Horizon",
        },
        { name: "twitter:title", content: `${model.commonName} — ${model.scientificName}` },
        { name: "twitter:description", content: model.meta.description },
        {
          name: "twitter:image",
          content: model.image ? `${SITE_ORIGIN}${model.image.canonical}` : `${SITE_ORIGIN}/og.jpg`,
        },
        { "script:ld+json": speciesJsonLd(model) },
      ],
      links: [{ rel: "canonical", href: canonicalFor(model.path) }],
    };
  },
  component: SpeciesRoute,
  notFoundComponent: SpeciesNotFound,
});

function SpeciesRoute() {
  const { speciesId, overlays } = Route.useLoaderData();
  const species = SPECIES_BY_ID[speciesId];
  if (!species) return <SpeciesNotFound />;
  const model = buildSpeciesPage(species, overlays);
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a href="#main" className="skip-link">
        Skip to the record
      </a>
      <Chrome />
      <SpeciesPageView model={model} />
    </div>
  );
}

function SpeciesNotFound() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Chrome />
      <main className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
          No record under that name
        </p>
        <h1 className="mt-4 font-display text-4xl">There is no reviewed record here</h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          That address does not match a species in the catalog, by common name, catalog id or
          scientific name. Rather than serve you the nearest guess — which would look right and be
          wrong — the index is the better place to start.
        </p>
        <a
          href="/species"
          className="mt-8 inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-accent px-4 text-sm text-accent-fg no-underline"
        >
          Open the species index
        </a>
      </main>
    </div>
  );
}
