import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packetSummary } from "@/lib/engine/brief";
import { buildPacket, encodePacketHash, FLEET } from "@/lib/protocol/packet";
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

type HandoffId = "waterways" | "hatch" | "tackle" | "knot" | "rig" | "ops";

type HandoffSpec = {
  id: HandoffId;
  /** Name in FLEET. */
  fleetName: string;
  label: string;
  /** The question the destination answers. */
  purpose: string;
  /** Where this sits in Waterways → Species → Forage → Presentation → Rig → Knot → Field Ops. */
  chainStep: string;
};

const SPECS: HandoffSpec[] = [
  {
    id: "waterways",
    fleetName: "Field Sense",
    label: "Waterways",
    purpose: "Where does water like this exist, and what is it doing right now?",
    chainStep: "Back one step · water",
  },
  {
    id: "hatch",
    fleetName: "Hatch Match",
    label: "Hatch Match",
    purpose: "What is actually hatching or swimming here, so forage stops being an assumption?",
    chainStep: "Forage",
  },
  {
    id: "tackle",
    fleetName: "Tackle Link",
    label: "Tackle Link",
    purpose: "What rod, line and terminal setup delivers this presentation?",
    chainStep: "Tackle",
  },
  {
    id: "rig",
    fleetName: "Rig Signal",
    label: "Rig Signal",
    purpose: "Can this rig and electronics actually fish the depth and speed the family needs?",
    chainStep: "Rig",
  },
  {
    id: "knot",
    fleetName: "Knot Analyst",
    label: "Knot Analyst",
    purpose: "Which connection survives this line class, this cover and these hands?",
    chainStep: "Knot",
  },
  {
    id: "ops",
    fleetName: "Field Ops Desk",
    label: "Field Ops",
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
  const [pending, setPending] = useState<HandoffId | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const packet = useMemo(() => buildPacket(input, result), [input, result]);
  const hash = useMemo(() => encodePacketHash(packet), [packet]);
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

  const specs = SPECS.map((spec) => {
    const target = FLEET.find((item) => item.name === spec.fleetName);
    return target ? { ...spec, href: `${target.href}${hash}` } : null;
  }).filter((item): item is HandoffSpec & { href: string } => item !== null);

  const active = specs.find((spec) => spec.id === pending) ?? null;

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
        {specs.map((spec) => (
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
            <p className="mt-3 text-sm text-fg">Only these fields travel:</p>
            <dl className="mt-3 space-y-2 text-sm">
              {summary.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-dim">{row.label}</dt>
                  <dd className="text-right text-fg">{row.value}</dd>
                </div>
              ))}
            </dl>
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
