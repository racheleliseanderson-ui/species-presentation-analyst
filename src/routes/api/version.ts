import { createFileRoute } from "@tanstack/react-router";
import { deploymentIdentity } from "@/lib/build-info";

/**
 * Which deploy is answering.
 *
 * Deliberately separate from `/api/health`. Health answers "is this thing
 * working", and a monitor may poll it every minute; version answers "which code
 * is this", which is what a person asks once, at the moment something looks
 * wrong. Keeping them apart means the health probe stays a cheap, boring,
 * cacheless yes.
 */
export const Route = createFileRoute("/api/version")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(deploymentIdentity(), {
          headers: {
            "cache-control": "no-store",
            "content-type": "application/json; charset=utf-8",
          },
        }),
    },
  },
});
