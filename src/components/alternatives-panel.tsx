import { alternatives } from "@/lib/engine/alternatives";
import { EMPTY_OVERLAYS, type OverlayState } from "@/lib/knowledge/overlays";
import type { Interpretation, ScenarioInput } from "@/lib/protocol/types";

/**
 * The ordered fallback plan, for the hour after the first family did not work.
 *
 * Deliberately ordered cheapest-change-first: presentation before position,
 * position before time of day, and re-declaring the inputs last — because the
 * honest end of the list is "this reading is guessing about something, go and
 * find out which thing".
 */
export function AlternativesPanel({
  input,
  result,
  overlays,
}: {
  input: ScenarioInput;
  result: Interpretation;
  overlays: OverlayState;
}) {
  // Most of the fallback plan comes from the ranked families and the species
  // record, so it is still worth showing while the dossiers are in flight; the
  // one move that needs them simply does not appear until they arrive.
  const moves = alternatives(
    input,
    result,
    overlays.status === "ready" ? overlays.overlays : EMPTY_OVERLAYS,
  );
  if (moves.length === 0) return null;

  return (
    <section
      className="rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8"
      aria-labelledby="alternatives-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 id="alternatives-heading" className="font-display text-2xl">
          If it isn&apos;t working
        </h3>
        <p className="text-sm text-muted">In order. One change at a time.</p>
      </div>
      <ol className="mt-5 space-y-3">
        {moves.map((move, index) => (
          <li
            key={move.id}
            className="rounded-[var(--radius-md)] bg-subtle px-4 py-4 shadow-[var(--shadow-border)]"
          >
            <div className="flex gap-3">
              <span
                aria-hidden
                className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dim"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-muted">{move.symptom}</p>
                <p className="mt-1.5 font-medium text-fg">{move.move}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{move.why}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs leading-5 text-dim">
        Give each change a fair trial before the next one. Running three at once means you learn
        nothing from any of them.
      </p>
    </section>
  );
}
