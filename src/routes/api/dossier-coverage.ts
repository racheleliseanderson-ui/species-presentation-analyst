import { createFileRoute } from "@tanstack/react-router";
import { SPECIES } from "@/lib/knowledge/species-catalog";
import { fetchDossierCoverage } from "@/lib/knowledge/dossier-store.server";

/**
 * Catalog-wide overlay coverage: how much of the reviewed catalog is actually
 * knowable today. The limits page prints this, so it has to be counted from the
 * records rather than hand-maintained.
 *
 * If the live store cannot answer, the same count is taken from the records
 * committed here. A number that is one review cycle old is a far better answer
 * than a page that says its own coverage is unknown.
 */
export const Route = createFileRoute("/api/dossier-coverage")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const coverage = await fetchDossierCoverage();
          return Response.json(
            { speciesTotal: SPECIES.length, coverage, source: "live" },
            {
              headers: {
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
                "content-type": "application/json; charset=utf-8",
              },
            },
          );
        } catch (error) {
          console.error("[dossier-coverage] live read failed, counting committed records", error);
          const { committedCoverage } = await import("@/lib/knowledge/committed-dossiers.server");
          return Response.json(
            { speciesTotal: SPECIES.length, coverage: committedCoverage(), source: "committed" },
            {
              headers: {
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
