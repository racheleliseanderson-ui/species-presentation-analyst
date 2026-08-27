import { createFileRoute } from "@tanstack/react-router";
import { SPECIES } from "@/lib/knowledge/species-catalog";
import { REVIEWED_AT, SCHEMA_VERSION } from "@/lib/protocol/vocab";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(
          {
            schemaVersion: SCHEMA_VERSION,
            catalogDate: REVIEWED_AT,
            recordCount: SPECIES.length,
            lastRefresh: REVIEWED_AT,
            dataMaxAgeHours: 24 * 90,
            status: "ok",
            applicationId: "HTH-SP-001",
          },
          {
            headers: {
              "cache-control": "no-store",
              "content-type": "application/json; charset=utf-8",
            },
          },
        );
      },
    },
  },
});
