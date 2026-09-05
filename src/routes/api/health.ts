import { createFileRoute } from "@tanstack/react-router";
import { SPECIES } from "@/lib/knowledge/species-catalog";
import { REVIEWED_AT, SCHEMA_VERSION } from "@/lib/protocol/vocab";
import { deploymentIdentity } from "@/lib/build-info";

/**
 * Is this thing working, and how old is what it knows.
 *
 * Three questions get answered here, and they are genuinely different:
 *
 *  - **Is the server up.** Answered by this route replying at all.
 *  - **How old is the data.** `catalogDate` / `dataMaxAgeHours`, unchanged —
 *    a monitor can decide the catalog has gone stale without knowing anything
 *    about fish.
 *  - **Which build is this.** New. The route used to report the review date and
 *    nothing else, so a deploy that shipped an hour ago and one that shipped in
 *    August described themselves identically and no probe could tell a rollback
 *    from a no-op.
 *
 * `overlays` reports whether the reviewed knowledge store is reachable. It is
 * NOT part of `status`: a Supabase outage degrades this application to its
 * committed records and the pages still render in full, so calling that
 * "unhealthy" would page somebody for a condition the product is designed to
 * survive. It is reported as a fact and left for a human to weigh.
 */
type OverlayProbe = { reachable: boolean; source: string; ms: number };

/**
 * The upstream check, memoized for a minute.
 *
 * A health endpoint is polled. If each poll opened a fresh read against the
 * reviewed store, a monitor on a one-minute schedule would put 1,440 queries a
 * day into Supabase purely to ask whether Supabase answers — and the busier the
 * monitoring, the heavier the load on the thing being monitored, which is the
 * wrong shape entirely. Sixty seconds is far shorter than any outage worth
 * reporting and far longer than any sensible polling interval.
 */
let probeCache: { at: number; value: OverlayProbe } | null = null;
const PROBE_TTL_MS = 60_000;

async function overlayReachability(): Promise<OverlayProbe> {
  const now = Date.now();
  if (probeCache && now - probeCache.at < PROBE_TTL_MS) return probeCache.value;
  const startedAt = Date.now();
  let value: OverlayProbe;
  try {
    const { fetchDossierCoverage } = await import("@/lib/knowledge/dossier-store.server");
    await fetchDossierCoverage();
    value = { reachable: true, source: "live", ms: Date.now() - startedAt };
  } catch {
    value = { reachable: false, source: "committed", ms: Date.now() - startedAt };
  }
  probeCache = { at: now, value };
  return value;
}

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const build = deploymentIdentity();
        const overlays = await overlayReachability();

        return Response.json(
          {
            status: "ok",
            applicationId: "HTH-SP-001",
            schemaVersion: SCHEMA_VERSION,
            catalogDate: REVIEWED_AT,
            recordCount: SPECIES.length,
            lastRefresh: REVIEWED_AT,
            dataMaxAgeHours: 24 * 90,
            build,
            overlays,
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
