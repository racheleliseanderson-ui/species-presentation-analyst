import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Copy, Download, Printer, RotateCcw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatIf } from "@/components/what-if";
import { fieldBrief, freshness, packetSummary } from "@/lib/engine/brief";
import { interpret } from "@/lib/engine/infer";
import { drivingChanges } from "@/lib/engine/sensitivity";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { buildPacket, encodePacketHash, FLEET } from "@/lib/protocol/packet";
import { labelOf } from "@/lib/protocol/vocab";
import {
  deleteScenario,
  loadScenarios,
  saveScenario,
  toInput,
  type NamedScenario,
  type Session,
} from "@/lib/store";
import { cn } from "@/lib/utils";

/** Reader-facing names for the tackle requirements a presentation implies. */
const SYSTEM_LABEL: Record<string, string> = {
  depthControl: "Depth control",
  sensitivity: "Sensitivity",
  castingDistance: "Casting distance",
  lureWeightBand: "Weight range",
  coverResistance: "Cover resistance",
  lineVisibilityPreference: "Line visibility",
  retieFrequency: "How often to retie",
};

/** How the water temperature reaching this reading was obtained. */
const EVIDENCE_WORD: Record<string, string> = {
  high: "Measured",
  moderate: "Estimated",
  low: "Not verified yet",
};

/** How much of the condition picture the angler has filled in. */
const COMPLETENESS_WORD: Record<string, string> = {
  high: "Nearly complete",
  moderate: "Partly complete",
  low: "Mostly still unknown",
};

/** Whether forage was actually seen, and how firmly. */
const FORAGE_WORD: Record<string, string> = {
  high: "Observed and confirmed",
  moderate: "Observed",
  low: "Not observed yet",
};

/** Shorter wording where the badge sits inline beside a sentence. */
const SUPPORT_WORD: Record<string, string> = {
  high: "Well supported",
  moderate: "Likely",
  low: "Unconfirmed",
};

/** How closely a presentation family matches the declared conditions. */
const FIT_WORD: Record<string, string> = {
  high: "Strong",
  moderate: "Reasonable",
  low: "Weaker",
};

/** Reader-facing wording for how current a reviewed record is. */
const RECORD_WORD: Record<string, string> = {
  current: "up to date",
  review_due: "due for review",
  stale: "overdue for review",
};

function Axis({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-subtle px-3 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{label}</div>
      <div className="mt-1 font-sans text-sm text-fg">{value}</div>
    </div>
  );
}

function Layer({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="rounded-[var(--radius-lg)] bg-elevated shadow-[var(--shadow-border)]"
      open={defaultOpen}
    >
      <summary className="cursor-pointer px-6 py-4 font-display text-xl sm:px-8">
        {title}
      </summary>
      <div className="border-t border-line px-6 pb-6 pt-4 sm:px-8 sm:pb-8">{children}</div>
    </details>
  );
}

export function Readout({
  session,
  onPatch,
  onReset,
  onBack,
}: {
  session: Session;
  onPatch: (partial: Partial<Session>) => void;
  onReset: () => void;
  onBack: () => void;
}) {
  const input = toInput(session);
  const [copied, setCopied] = useState<"packet" | "brief" | "correction" | null>(null);
  const [inspect, setInspect] = useState<"tackle" | "knot" | "rig" | "hatch" | null>(null);
  const [saved, setSaved] = useState<NamedScenario[]>([]);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    setSaved(loadScenarios());
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setInspect(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!input) return null;
  const result = interpret(input);

  if ("error" in result) {
    return (
      <section className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">We cannot read this combination</p>
        <h2 className="mt-2 font-display text-3xl text-fg">{result.error}</h2>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Change the water type, or pick a species that has a reviewed record for this kind of water. Your selections are still saved on this device.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={onBack}>
            Change your selections
          </Button>
          <Button variant="quiet" onClick={onReset}>
            <RotateCcw className="size-4" />
            New reading
          </Button>
        </div>
      </section>
    );
  }

  const packet = buildPacket(input, result);
  const json = JSON.stringify(packet, null, 2);
  const brief = fieldBrief(input, result);
  const summary = packetSummary(input, result);
  const drivers = drivingChanges(input);
  const hatch = FLEET.find((f) => f.name === "Hatch Match")!;
  const tackle = FLEET.find((f) => f.name === "Tackle Link")!;
  const knot = FLEET.find((f) => f.name === "Knot Analyst")!;
  const rig = FLEET.find((f) => f.name === "Rig Signal")!;
  const species = SPECIES_BY_ID[session.speciesId!];
  const fresh = freshness(species.reviewedAt, species.nextReviewAt);
  const top = result.presentations[0];
  const tempLine =
    session.tempF == null
      ? "temperature unknown"
      : `${session.tempF}°F — ${labelOf(session.tempSource).toUpperCase()}`;

  const carryHref = {
    tackle: `${tackle.href}${encodePacketHash(packet)}`,
    knot: `${knot.href}${encodePacketHash(packet)}`,
    rig: `${rig.href}${encodePacketHash(packet)}`,
    hatch: `${hatch.href}${encodePacketHash(packet)}`,
  };
  const carryLabel = {
    tackle: "Tackle Link",
    knot: "Knot Analyst",
    rig: "Rig Signal",
    hatch: "Hatch Match",
  };

  async function copy(kind: "packet" | "brief" | "correction", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  }

  function downloadJson() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `species-presentation-reading-${packet.species.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onSave() {
    const name =
      saveName.trim() ||
      `${species.commonNames[0]} · ${tempLine} · ${session.waterType === "flowing" ? labelOf(session.holdingRiver ?? "unknown") : labelOf(session.holdingStill ?? "unknown")}`;
    setSaved(saveScenario(name, session));
    setSaveName("");
  }

  const correction = `Record issue — ${species.commonNames[0]} (${species.scientificName})
Reviewed ${species.reviewedAt} · next ${species.nextReviewAt}
What seems wrong:

(This stays on your device until you paste it somewhere. Nothing is sent automatically.)`;

  return (
    <div className="stagger-in space-y-6">
      <section className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          The reading · not a bite prediction
        </p>
        <h2 className="mt-3 font-display text-4xl text-fg sm:text-5xl">{species.commonNames[0]}</h2>
        <p className="mt-2 font-mono text-xs text-muted">
          {species.scientificName} · {tempLine} · {labelOf(session.waterType)}
          {session.water.waterName ? ` · ${session.water.waterName}` : ""}
        </p>
        {top && (
          <p className="mt-5 max-w-3xl font-display text-2xl text-fg sm:text-3xl">
            Most plausible family: {top.label}.
          </p>
        )}
        <p className="mt-3 max-w-3xl text-base text-fg">
          {result.thermalLabel}. {species.habitat.currentPreference}
        </p>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          This is not a prediction that fish will bite. If the temperature, light, or forage declaration is wrong, the family can move — change one thing below.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        <Axis label="Water temperature" value={EVIDENCE_WORD[result.confidence.evidence]} />
        <Axis label="Conditions you declared" value={COMPLETENESS_WORD[result.confidence.environment]} />
        <Axis label="Forage" value={FORAGE_WORD[result.confidence.forage]} />
        <Axis label="Presentation fit" value={FIT_WORD[result.confidence.presentation]} />
      </section>

      <WhatIf session={session} onPatch={onPatch} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 className="font-display text-2xl">Presentation families</h3>
          <p className="text-sm text-muted">Jobs and mechanics. Not lure names.</p>
        </div>
        {result.presentations.map((p, i) => (
          <article
            key={p.id}
            className={cn(
              "rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-7",
              i === 0 && "instrument-rule",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-xl">
                {String.fromCharCode(65 + i)}. {p.label}
              </h4>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark">
                Fit · {FIT_WORD[p.fit]}
              </span>
            </div>
            <p className="mt-3 text-sm text-fg">
              <span className="text-dim">Job. </span>
              {p.job}
            </p>
            <ul className="mt-3 grid gap-1 sm:grid-cols-2">
              {p.mechanics.map((m) => (
                <li key={m} className="font-mono text-xs text-muted">
                  · {m}
                </li>
              ))}
            </ul>
            {i === 0 && result.presentations[1] && (
              <p className="mt-4 text-sm text-muted">
                Trade-off versus {result.presentations[1].label}: {p.label} is the better mechanical match for the declared light, forage, and holding class. {result.presentations[1].label} remains plausible if that declaration is wrong.
              </p>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {Object.entries(p.system).map(([k, v]) => (
                <div key={k} className="rounded-[var(--radius-xs)] bg-subtle px-2.5 py-2">
                  <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">
                    {SYSTEM_LABEL[k] ?? k.replaceAll(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="mt-0.5 text-fg">{v.replaceAll("_", " ")}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>

      <Layer title="Most plausible positioning">
        <ul className="space-y-3">
          {result.positioning.map((p) => (
            <li key={p.text} className="flex gap-3 text-sm">
              <span className="mt-0.5 shrink-0 font-mono text-[10px] uppercase tracking-wider text-mark">
                {SUPPORT_WORD[p.confidence]}
              </span>
              <span className="text-fg">{p.text}</span>
            </li>
          ))}
        </ul>
      </Layer>

      <Layer title="Forage classes">
        <p className="text-sm text-muted">{result.forageNote}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.forageClasses.map((f) => (
            <span
              key={f}
              className="rounded-full bg-subtle px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fg"
            >
              {labelOf(f)}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setInspect("hatch")}
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-fg"
        >
          Observed something? See what Hatch Match would receive
          <ArrowUpRight className="size-4" />
        </button>
      </Layer>

      <Layer title="What would change this answer" defaultOpen>
        {drivers.length > 0 ? (
          <ul className="space-y-3">
            {drivers.map((d) => (
              <li key={`${d.variable}-${d.to}`} className="text-sm text-fg">
                <span className="font-medium">{d.variable}</span>
                <span className="text-muted">
                  {" "}
                  {d.from} → {d.to} moves the leading family from {d.familyBefore} to {d.familyAfter}.
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">
            None of the usual single-variable flips reorder the leading family. Completeness is still limited by whatever is unknown.
          </p>
        )}
        <h4 className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          Signs this reading no longer applies
        </h4>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {result.invalidators.map((x) => (
            <li key={x} className="text-sm text-fg">
              {x}
            </li>
          ))}
        </ul>
        {result.unknowns.length > 0 && (
          <p className="mt-4 text-sm text-muted">Still unknown: {result.unknowns.join(", ")}.</p>
        )}
      </Layer>

      <Layer title="How we reached this, and what it rests on">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-dim">
          Record {RECORD_WORD[fresh]} · reviewed {species.reviewedAt} · next review {species.nextReviewAt}
        </p>
        <ol className="mt-4 space-y-1 font-mono text-xs text-muted">
          {result.trace.map((line, i) => (
            <li key={line}>
              {i > 0 ? "↓ " : ""}
              {line}
            </li>
          ))}
        </ol>
        <ul className="mt-4 space-y-2 text-sm">
          {species.sources.map((s) => (
            <li key={s.label}>
              <span className="font-mono text-[10px] uppercase tracking-wider text-dim">
                {s.class.replaceAll("_", " ")}
              </span>
              <span className="text-fg"> · {s.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{species.nativeContext} {species.geographic}</p>
        <Button
          className="mt-4"
          variant="ghost"
          size="sm"
          onClick={() => copy("correction", correction)}
        >
          <Copy className="size-4" />
          {copied === "correction" ? "Copied report" : "Copy a record-issue note"}
        </Button>
      </Layer>

      <section className="no-print rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h3 className="font-display text-2xl">Keep it, or carry the job</h3>
        <p className="mt-2 text-sm text-muted">
          Nothing leaves this device unless you send it, and what travels carries no coordinates and no bite score.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button onClick={() => setInspect("tackle")}>
            Carry to Tackle
            <ArrowUpRight className="size-4" />
          </Button>
          <Button variant="ghost" onClick={() => setInspect("knot")}>
            Carry connection job to Knot
            <ArrowUpRight className="size-4" />
          </Button>
          {result.rigQuestion && (
            <Button variant="ghost" className="sm:col-span-2" onClick={() => setInspect("rig")}>
              Ask Rig Signal: {result.rigQuestion}
              <ArrowUpRight className="size-4 shrink-0" />
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => copy("brief", brief)}>
            <Copy className="size-4" />
            {copied === "brief" ? "Copied brief" : "Copy field brief"}
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print brief
          </Button>
          <Button variant="ghost" onClick={() => copy("packet", json)}>
            <Copy className="size-4" />
            {copied === "packet" ? "Copied JSON" : "Copy as JSON"}
          </Button>
          <Button variant="ghost" onClick={downloadJson}>
            <Download className="size-4" />
            Download JSON
          </Button>
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Save on this device</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Name this reading"
              aria-label="Name this reading"
              className="min-h-11 min-w-48 flex-1 rounded-[var(--radius-sm)] bg-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-dim"
            />
            <Button variant="ghost" onClick={onSave}>
              <Bookmark className="size-4" />
              Save reading
            </Button>
            <Button variant="quiet" onClick={onReset}>
              <RotateCcw className="size-4" />
              New reading
            </Button>
          </div>
          {saved.length > 0 && (
            <ul className="mt-4 space-y-2">
              {saved.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <button
                    type="button"
                    className="text-left text-fg hover:underline"
                    onClick={() => onPatch(s.session)}
                  >
                    {s.name}
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-dim">
                      {s.savedAt.slice(0, 10)}
                    </span>
                  </button>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => setSaved(deleteScenario(s.id))}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
          Coordinates are never stored · record reviewed {result.species.reviewedAt}
        </p>
      </section>

      {inspect && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="packet-inspect-title"
          className="no-print fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 sm:place-items-center"
          onClick={() => setInspect(null)}
        >
          <div
            className="max-h-[85dvh] w-full max-w-lg overflow-auto rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border-hover)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Check before sending</p>
            <h3 id="packet-inspect-title" className="mt-2 font-display text-2xl">
              Carry to {carryLabel[inspect]}?
            </h3>
            <p className="mt-2 text-sm text-muted">
              Only these fields move. Nothing is sent until you confirm.
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {summary.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-dim">{row.label}</dt>
                  <dd className="text-right text-fg">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={carryHref[inspect]}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 text-sm text-accent-fg no-underline"
              >
                Send these details
                <ArrowUpRight className="size-4" />
              </a>
              <Button variant="ghost" onClick={() => setInspect(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <pre className="hidden print:block whitespace-pre-wrap font-mono text-xs">{brief}</pre>
    </div>
  );
}
