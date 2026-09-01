import { createFileRoute } from "@tanstack/react-router";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { fetchSpeciesOverlays } from "@/lib/knowledge/dossier-store.server";

/**
 * The reviewed knowledge overlays for one species.
 *
 * Public reference data, so it is cached hard at the edge — the records change
 * on a review cycle measured in months, not on a request. A species with no
 * reviewed overlays returns 200 with nulls, because "not reviewed yet" is an
 * answer this product gives on purpose; only an actual failure returns 503, so
 * the UI can tell a research gap apart from a broken read.
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
            { speciesId, overlays },
            {
              headers: {
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
                "content-type": "application/json; charset=utf-8",
              },
            },
          );
        } catch (error) {
          console.error("[dossiers] read failed", error);
          return Response.json(
            { error: "reviewed records are unavailable", speciesId },
            { status: 503, headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});
