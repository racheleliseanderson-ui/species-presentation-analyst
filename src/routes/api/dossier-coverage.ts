import { createFileRoute } from "@tanstack/react-router";
import { SPECIES } from "@/lib/knowledge/species-catalog";
import { fetchDossierCoverage } from "@/lib/knowledge/dossier-store.server";

/**
 * Catalog-wide overlay coverage: how much of the reviewed catalog is actually
 * knowable today. The limits page prints this, so it has to be counted from the
 * live records rather than hand-maintained.
 */
export const Route = createFileRoute("/api/dossier-coverage")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const coverage = await fetchDossierCoverage();
          return Response.json(
            { speciesTotal: SPECIES.length, coverage },
            {
              headers: {
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
                "content-type": "application/json; charset=utf-8",
              },
            },
          );
        } catch (error) {
          console.error("[dossier-coverage] read failed", error);
          return Response.json(
            { error: "coverage is unavailable" },
            { status: 503, headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});
