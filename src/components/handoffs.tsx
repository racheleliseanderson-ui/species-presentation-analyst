import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packetSummary } from "@/lib/engine/brief";
import { FLEET_TARGETS, packetUrl, type FleetTargetKey } from "@/lib/hth-packet";
import { buildPacket } from "@/lib/protocol/packet";
import type { Interpretation, ScenarioInput } from "@/lib/protocol/types";
import { cn } from "@/lib/utils";

/**
 * The one place the app hands work to the rest of Hook the Horizon.
 *
 * Both reading modes use this, so a handoff offered in Quick Read behaves
 * exactly like the same handoff in the full reading: same packet, same
 * check-before-sending step, same guarantee about what does not travel.
 *
 * Each destination states the job it takes over. A link that only said the app
 * name left the reader to guess why they would follow it.
 */

type HandoffSpec = {
  /** The key in the shared fleet registry. One list of addresses, not two —
   *  the name and the URL both come from `FLEET_TARGETS`. */
  id: FleetTargetKey;
  /** The question the destination answers. */
  purpose: string;
  /** Where this sits in Water → Species → Forage → Tackle → Knot → Field Ops. */
  chainStep: string;
};

const SPECS: HandoffSpec[] = [
  {
    id: "water",
    purpose: "Where does water like this exist, and what is it doing right now?",
    chainStep: "Back one step · water",
  },
  {
    id: "hatch",
    purpose: "What is actually hatching or swimming here, so forage stops being an assumption?",
    chainStep: "Forage",
  },
  {
    id: "tackle",
    purpose: "What rod, line and terminal setup delivers this presentation?",
    chainStep: "Tackle",
  },
  {
    id: "rig",
    purpose: "Can this rig and electronics actually fish the depth and speed the family needs?",
    chainStep: "Optional · rig",
  },
  {
    id: "knot",
    purpose: "Which connection survives this line class, this cover and these hands?",
    chainStep: "Knot",
  },
  {
    id: "ops",
    purpose: "Keep this reading with the rest of the trip.",
    chainStep: "Field ops",
  },
];

export function Handoffs({
  input,
  result,
  heading = "Carry this to the next step",
  intro = "Each of these takes over one job in the chain. Nothing is sent until you check what travels — and coordinates, saved readings and bite scores never do.",
  className,
}: {
  input: ScenarioInput;
  result: Interpretation;
  heading?: string;
  intro?: string;
  className?: string;
}) {
  const [pending, setPending] = useState<FleetTargetKey | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  /* One link per destination, each built from the packet that arrived rather
   * than from the previous link — that is what keeps the trail one hop longer
   * instead of one hop longer every time this re-renders. */
  const links = useMemo(
    () =>
      SPECS.map((spec) => ({
        ...spec,
        label: FLEET_TARGETS[spec.id].name,
        href: packetUrl(spec.id, buildPacket(input, result, { intent: spec.id })),
      })),
    [input, result],
  );
  const summary = useMemo(() => packetSummary(input, result), [input, result]);

  useEffect(() => {
    if (!pending) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setPending(null);
    }
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [pending]);

  function close() {
    setPending(null);
    openerRef.current?.focus();
  }

  const active = links.find((spec) => spec.id === pending) ?? null;

  return (
    <section
      className={cn(
        "no-print rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6",
        className,
      )}
      aria-labelledby="handoff-heading"
    >
      <h3 id="handoff-heading" className="font-display text-2xl">
        {heading}
      </h3>
      <p className="mt-2 max-w-3xl text-sm text-muted">{intro}</p>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {links.map((spec) => (
          <li key={spec.id}>
            <button
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setPending(spec.id);
              }}
              className="flex min-h-20 w-full flex-col items-start gap-1 rounded-[var(--radius-md)] bg-subtle px-4 py-3 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                {spec.chainStep}
              </span>
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-medium text-fg">{spec.label}</span>
                <ArrowUpRight className="size-4 shrink-0 text-mark" aria-hidden />
              </span>
              <span className="text-xs leading-snug text-muted">{spec.purpose}</span>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          className="fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 sm:place-items-center"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="handoff-dialog-title"
            tabIndex={-1}
            className="max-h-[85dvh] w-full max-w-lg overflow-auto rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border-hover)] outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Check before sending
            </p>
            <h4 id="handoff-dialog-title" className="mt-2 font-display text-2xl">
              Send this reading to {active.label}?
            </h4>
            <p className="mt-2 text-sm text-muted">{active.purpose}</p>
            <p className="mt-3 text-sm text-fg">What the link carries:</p>
            <dl className="mt-3 space-y-2 text-sm">
              {summary.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-dim">{row.label}</dt>
                  <dd className="text-right text-fg">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Under those rows the packet also holds the presentation families and the
              reasoning behind each one, the equipment and connection notes, the record
              sources this reading leaned on, and the route the context took to get here.
              If you arrived from another Hook tool, what it sent is still in there. What
              is not: coordinates, which get stripped on the way in and again on the way
              out, and anything resembling a bite score. Saved readings stay on this
              device.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={active.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 text-sm text-accent-fg no-underline"
              >
                Open {active.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
