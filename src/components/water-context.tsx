import { ArrowUpRight } from "lucide-react";
import type { WaterContextState } from "@/lib/knowledge/use-species-overlays";
import { labelOf } from "@/lib/protocol/vocab";

/**
 * Where this species is documented, and whose rules apply.
 *
 * Both answers were already in the database the app reads. The species profile
 * had been saying regulations "remain external verification tasks until a live
 * jurisdiction source is integrated" while `agencies` carried the regulations
 * URL for 49 states.
 *
 * The waters are named public waters and their state — no coordinates, no
 * access points, nothing this product refuses to publish elsewhere.
 */
export function WaterContextPanel({
  state,
  speciesName,
  jurisdictionDeclared,
}: {
  state: WaterContextState;
  speciesName: string;
  jurisdictionDeclared: boolean;
}) {
  if (state.status === "idle") return null;

  if (state.status === "loading") {
    return (
      <Shell>
        <p className="text-sm text-muted">Checking the reviewed waterway records…</p>
      </Shell>
    );
  }

  if (state.status === "unavailable" || !state.context) {
    return (
      <Shell>
        <p className="text-sm text-muted">
          The waterway and agency records could not be read right now. Nothing here is being
          withheld — it is a connection problem.
        </p>
      </Shell>
    );
  }

  const { documentedInWaterways, waters, waterCount, agency, unresolvedJurisdiction } =
    state.context;

  return (
    <Shell>
      {documentedInWaterways ? (
        waterCount > 0 ? (
          <>
            <p className="text-sm text-fg">
              {speciesName} is documented in{" "}
              <strong>
                {waterCount} reviewed public water{waterCount === 1 ? "" : "s"}
              </strong>{" "}
              across the Hook the Horizon waterway records.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {waters.map((water) => (
                <li
                  key={water.id}
                  className="rounded-full bg-subtle px-3 py-1.5 text-xs text-fg shadow-[var(--shadow-border)]"
                >
                  {water.name}
                  <span className="text-dim">
                    {" "}
                    · {water.stateCode} · {labelOf(water.waterType)}
                  </span>
                </li>
              ))}
              {waterCount > waters.length && (
                <li className="rounded-full px-3 py-1.5 text-xs text-dim">
                  and {waterCount - waters.length} more in Waterways
                </li>
              )}
            </ul>
            <p className="mt-3 text-xs text-dim">
              Named public waters only. This is a record that the species occurs there — not a
              recommendation, a hotspot, or a claim about today.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">
            Waterways carries a record for {speciesName}, but no reviewed public water currently
            lists it. That is a gap in the waterway records, not a statement about the fish.
          </p>
        )
      ) : (
        <p className="text-sm text-muted">
          Waterways does not carry {speciesName} yet, so there is no documented-waters count for it.
          The reviewed waterway set covers a subset of this catalog.
        </p>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          Rules where you are
        </p>
        {agency ? (
          <>
            <a
              href={agency.regulationsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-fg"
            >
              {agency.name} — fishing regulations
              <ArrowUpRight className="size-4 shrink-0 text-mark" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {agency.accessMapUrl && (
              <a
                href={agency.accessMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block min-h-11 py-2 text-sm text-muted hover:text-fg"
              >
                Public access map <span aria-hidden>↗</span>
              </a>
            )}
            <p className="mt-2 text-xs leading-5 text-dim">
              Link verified {agency.verifiedOn}. Seasons, limits and legal methods change; this app
              does not mirror them, it sends you to the body that sets them.
            </p>
          </>
        ) : unresolvedJurisdiction ? (
          <p className="mt-2 text-sm text-muted">
            “{unresolvedJurisdiction}” did not resolve to a state with an agency record on file. Try
            the state name or its two-letter code — a wrong regulations page would be worse than
            none.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            {jurisdictionDeclared
              ? "No agency record is held for that jurisdiction yet."
              : "Add a state or province above and the regulating agency's current rules are one link away."}
          </p>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6"
      aria-labelledby="water-context-heading"
    >
      <h3 id="water-context-heading" className="font-display text-2xl">
        Where it is documented, and whose rules apply
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
