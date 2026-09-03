import { createFileRoute } from "@tanstack/react-router";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { fetchSpeciesOverlays } from "@/lib/knowledge/dossier-store.server";

/**
 * The reviewed knowledge overlays for one species.
 *
 * Public reference data, so it is cached hard at the edge — the records change
 * on a review cycle measured in months, not on a request. A species with no
 * reviewed overlays returns 200 with nulls, because "not reviewed yet" is an
 * answer this product gives on purpose.
 *
 * When the live store cannot answer — most often because `SUPABASE_ANON_KEY` is
 * empty, which is what a clean checkout ships with — this falls back to the
 * records committed to this repository rather than returning 503. Those are the
 * same records the seed script pushes to Supabase in the first place, so the
 * fallback is the same writing from an older copy, not a substitute for it.
 *
 * `source` says which one answered, and the UI shows it. A deploy with no
 * database configured therefore renders the whole reviewed record and says the
 * live overlay is unavailable — instead of rendering "could not be loaded" over
 * content that is sitting in the bundle it was served from.
 */
export const Route = createFileRoute("/api/dossiers/$speciesId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const speciesId = params.speciesId;
        if (!SPECIES_BY_ID[speciesId]) {
          return Response.json(
            { error: "unknown species", speciesId },
            { status: 404, headers: { "cache-control": "public, max-age=300" } },
          );
        }
        try {
          const overlays = await fetchSpeciesOverlays(speciesId);
          return Response.json(
            { speciesId, overlays, source: "live" },
            {
              headers: {
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
                "content-type": "application/json; charset=utf-8",
              },
            },
          );
        } catch (error) {
          console.error("[dossiers] live read failed, serving committed records", error);
          const { committedOverlaysFor } = await import("@/lib/knowledge/committed-dossiers.server");
          const { overlays, source } = committedOverlaysFor(speciesId);
          return Response.json(
            { speciesId, overlays, source: `committed:${source}` },
            {
              headers: {
                /* Shorter than the live path on purpose: a configuration fault
                 * should stop mattering as soon as somebody fixes it, and a
                 * day-long edge cache would outlive the fix. */
                "cache-control": "public, max-age=300, s-maxage=300",
                "content-type": "application/json; charset=utf-8",
              },
            },
          );
        }
      },
    },
  },
});
