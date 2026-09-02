import { createFileRoute } from "@tanstack/react-router";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { fetchWaterContext } from "@/lib/knowledge/water-context.server";

/**
 * Reviewed public waters that document a species, and the agency that sets the
 * rules where the angler says they are fishing.
 *
 * Cached less aggressively than the dossiers: waters and agency URLs are
 * maintained on a shorter cycle than a species review, and a stale regulations
 * link is worse than a slow one.
 */
export const Route = createFileRoute("/api/water-context/$speciesId")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const speciesId = params.speciesId;
        if (!SPECIES_BY_ID[speciesId]) {
          return Response.json(
            { error: "unknown species", speciesId },
            { status: 404, headers: { "cache-control": "public, max-age=300" } },
          );
        }
        const jurisdiction = new URL(request.url).searchParams.get("jurisdiction");
        try {
          const context = await fetchWaterContext(speciesId, jurisdiction);
          return Response.json(
            { speciesId, context },
            {
              headers: {
                "cache-control": "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400",
                "content-type": "application/json; charset=utf-8",
              },
            },
          );
        } catch (error) {
          console.error("[water-context] read failed", error);
          return Response.json(
            { error: "water context is unavailable", speciesId },
            { status: 503, headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});
