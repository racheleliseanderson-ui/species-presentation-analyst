import { Button } from "@/components/ui/button";
import { OwnRecordPanel } from "@/lib/field-plates";
import type { IncomingCarry } from "@/lib/protocol/packet";
import { cn } from "@/lib/utils";

/**
 * What a link from another Hook the Horizon app looks like when it lands.
 *
 * Three states, and all three are on screen:
 *
 *   absent   nothing was attached to the link. Normal. Nothing is drawn.
 *   invalid  something was attached and could not be read. Said plainly, with
 *            the reading left open to fill in by hand.
 *   ok       it was read. Every field is listed before any of it is applied,
 *            the ones this app does not read are listed too, and the reader
 *            can decline the whole thing.
 *
 * A carry that failed used to look exactly like a carry that never happened —
 * the packet silently became null and the reader was left wondering why the
 * water they picked in Field Sense had not come across. That is the state this
 * component exists to stop.
 */
export function CarriedContext({
  carry,
  onApply,
  onDismiss,
  className,
}: {
  carry: IncomingCarry;
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}) {
  if (carry.state === "absent") return null;

  if (carry.state === "invalid") {
    return (
      <section
        className={cn(
          "no-print rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6",
          className,
        )}
        aria-labelledby="carry-failed-heading"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-warn">
          A link tried to hand something over · nothing was applied
        </p>
        <h2 id="carry-failed-heading" className="mt-2 font-display text-2xl">
          That context did not come through
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-fg">{carry.reason}</p>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          The reading still works. Start from the fish and fill the rest in — it takes about a
          minute, and nothing here depends on that link arriving.
        </p>
        <div className="mt-4">
          <Button variant="ghost" onClick={onDismiss} className="min-h-11">
            Fill it in myself
          </Button>
        </div>
      </section>
    );
  }

  const carriedTemp = carry.applied.tempRetained === true;

  return (
    <section
      className={cn(
        "no-print rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6",
        className,
      )}
      aria-labelledby="carry-heading"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
        Sent over by {carry.from} · nothing applied yet
      </p>
      <h2 id="carry-heading" className="mt-2 font-display text-2xl">
        Here is what arrived
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Read it before you use it. If a line looks wrong, start without it — the reading does not
        need any of this to run.
      </p>

      {carry.carried.length > 0 ? (
        <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {carry.carried.map((row) => (
            <div
              key={`${row.label}-${row.value}`}
              className="rounded-[var(--radius-sm)] bg-subtle px-3 py-3"
            >
              <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 text-sm text-fg">
          The packet was readable but held nothing this reading uses. Start from the fish.
        </p>
      )}

      {carry.freshness.severity !== "clear" && (
        <p className="mt-3 text-sm text-warn">{carry.freshness.detail}</p>
      )}

      {carriedTemp && (
        <p className="mt-2 text-sm text-warn">
          That water temperature was already past its own window when it was sent. How much that
          matters depends on the water: a shallow flat moves a few degrees over an afternoon of sun,
          a deep lake barely moves in a day. If you can put a thermometer in, that settles it.
        </p>
      )}

      {carry.normalizations.length > 0 && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-dim">
            Read with these repairs
          </p>
          <ul className="mt-1 space-y-1 text-sm text-muted">
            {carry.normalizations.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {carry.declined.length > 0 && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-dim">
            Came along, not used here
          </p>
          <ul className="mt-1 space-y-1 text-sm text-muted">
            {carry.declined.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 max-w-2xl text-sm text-muted">
        Coordinates get stripped on the way in, whatever the sender claimed about them. Population
        context does not travel at all. Two waters in the same county can run on different
        schedules, so that one is still yours to set. If the reading stops matching what you are
        seeing on the water, it is the first thing worth changing.
      </p>

      {/*
       * What the reader has already written down about this fish on this
       * water. It sits below the carried fields and outside them on purpose:
       * pressing "Use this" applies the packet to the reading, and this is the
       * one part of the packet the reading never touches.
       */}
      <OwnRecordPanel
        record={carry.packet.history}
        from={carry.from}
        instrument="This reading"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onApply} className="min-h-11">
          Use this
        </Button>
        <Button variant="ghost" onClick={onDismiss} className="min-h-11">
          Start without it
        </Button>
      </div>
    </section>
  );
}
