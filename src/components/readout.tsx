import { ArrowUpRight, Copy, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interpret } from "@/lib/engine/infer";
import { SPECIES_BY_ID } from "@/lib/knowledge/species";
import { buildPacket, encodePacketHash, FLEET } from "@/lib/protocol/packet";
import { labelOf } from "@/lib/protocol/vocab";
import type { Session } from "@/lib/store";
import { cn } from "@/lib/utils";

function Axis({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-subtle px-3 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{label}</div>
      <div className="mt-1 font-sans text-sm capitalize text-fg">{value}</div>
    </div>
  );
}

export function Readout({
  session,
  onReset,
  onBack,
}: {
  session: Session;
  onReset: () => void;
  onBack: () => void;
}) {
  if (!session.speciesId) return null;
  const result = interpret({
    speciesId: session.speciesId,
    water: session.water,
    waterType: session.waterType,
    tempF: session.tempF,
    tempSource: session.tempSource,
    flow: session.flow,
    stillState: session.stillState,
    clarity: session.clarity,
    light: session.light,
    weather: session.weather,
    season: session.season,
    holdingRiver: session.holdingRiver,
    holdingStill: session.holdingStill,
    forage: session.forage,
  });

  if ("error" in result) {
    return (
      <section className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Fail closed</p>
        <h2 className="mt-2 font-display text-3xl text-fg">{result.error}</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={onBack}>
            Change the declaration
          </Button>
          <Button variant="quiet" onClick={onReset}>
            <RotateCcw className="size-4" />
            New scenario
          </Button>
        </div>
      </section>
    );
  }

  const packet = buildPacket(
    {
      speciesId: session.speciesId,
      water: session.water,
      waterType: session.waterType,
      tempF: session.tempF,
      tempSource: session.tempSource,
      flow: session.flow,
      stillState: session.stillState,
      clarity: session.clarity,
      light: session.light,
      weather: session.weather,
      season: session.season,
      holdingRiver: session.holdingRiver,
      holdingStill: session.holdingStill,
      forage: session.forage,
    },
    result,
  );
  const json = JSON.stringify(packet, null, 2);
  const hatch = FLEET.find((f) => f.name === "Hatch Match")!;
  const tackle = FLEET.find((f) => f.name === "Tackle Link")!;
  const knot = FLEET.find((f) => f.name === "Knot Analyst")!;
  const rig = FLEET.find((f) => f.name === "Rig Signal")!;

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      /* ignore */
    }
  }

  function downloadJson() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hth-species-packet-${packet.species.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const species = SPECIES_BY_ID[session.speciesId];
  const tempLine =
    session.tempF == null
      ? "UNKNOWN"
      : `${session.tempF}°F — ${labelOf(session.tempSource).toUpperCase()}`;

  return (
    <div className="stagger-in space-y-6">
      <section className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Behavior hypothesis</p>
        <h2 className="mt-3 font-display text-4xl text-fg sm:text-5xl">
          {species.commonNames[0]}
        </h2>
        <p className="mt-2 font-mono text-xs text-muted">
          {species.scientificName} · {tempLine} · {labelOf(session.waterType)}
          {session.water.waterName ? ` · ${session.water.waterName}` : ""}
        </p>
        {result.why.split(/(?<=\.)\s+(?=[A-Z0-9])/).map((sentence) => (
          <p key={sentence} className="mt-3 max-w-3xl text-base text-fg first:mt-5">
            {sentence}
          </p>
        ))}
        <p className="mt-4 max-w-3xl text-sm text-muted">
          This is not a prediction that fish will bite. It is an account of what the declared conditions make more or less plausible.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        <Axis label="Evidence quality" value={result.confidence.evidence} />
        <Axis label="Environmental completeness" value={result.confidence.environment} />
        <Axis label="Forage certainty" value={result.confidence.forage} />
        <Axis label="Presentation fit" value={result.confidence.presentation} />
      </section>

      <section className="rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h3 className="font-display text-2xl">Most plausible positioning</h3>
        <ul className="mt-4 space-y-3">
          {result.positioning.map((p) => (
            <li key={p.text} className="flex gap-3 text-sm">
              <span className="mt-0.5 shrink-0 font-mono text-[10px] uppercase tracking-wider text-mark">
                {p.confidence}
              </span>
              <span className="text-fg">{p.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h3 className="font-display text-2xl">Forage classes</h3>
        <p className="mt-2 text-sm text-muted">{result.forageNote}</p>
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
        <a
          href={`${hatch.href}${encodePacketHash(packet)}`}
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-fg no-underline"
        >
          Observed something? Open Hatch Match
          <ArrowUpRight className="size-4" />
        </a>
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-2xl">Presentation families</h3>
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
                Best fit · {p.fit}
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
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {Object.entries(p.system).map(([k, v]) => (
                <div key={k} className="rounded-[var(--radius-xs)] bg-subtle px-2.5 py-2">
                  <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">
                    {k.replaceAll(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="mt-0.5 text-fg">{v.replaceAll("_", " ")}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>

      <section className="rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h3 className="font-display text-2xl">Why this conclusion exists</h3>
        <ol className="mt-4 space-y-1 font-mono text-xs text-muted">
          {result.trace.map((line, i) => (
            <li key={line}>
              {i > 0 ? "↓ " : ""}
              {line}
            </li>
          ))}
        </ol>
        <h4 className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          What would change the answer
        </h4>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {result.invalidators.map((x) => (
            <li key={x} className="text-sm text-fg">
              {x}
            </li>
          ))}
        </ul>
        {result.unknowns.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            Still unknown: {result.unknowns.join(", ")}.
          </p>
        )}
      </section>

      <section className="rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h3 className="font-display text-2xl">Carry the job, not a lure</h3>
        <p className="mt-2 text-sm text-muted">
          Nothing moves automatically. Each carry is a public-safe packet — no coordinates, no bite score.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <a
            href={`${tackle.href}${encodePacketHash(packet)}`}
            className="inline-flex min-h-12 items-center justify-between rounded-[var(--radius-sm)] bg-accent px-4 text-sm text-accent-fg no-underline"
          >
            Carry to Tackle
            <ArrowUpRight className="size-4" />
          </a>
          <a
            href={`${knot.href}${encodePacketHash(packet)}`}
            className="inline-flex min-h-12 items-center justify-between rounded-[var(--radius-sm)] bg-subtle px-4 text-sm text-fg no-underline shadow-[var(--shadow-border)]"
          >
            Carry connection job to Knot
            <ArrowUpRight className="size-4" />
          </a>
          {result.rigQuestion && (
            <a
              href={`${rig.href}${encodePacketHash(packet)}`}
              className="inline-flex min-h-12 items-center justify-between rounded-[var(--radius-sm)] bg-subtle px-4 text-sm text-fg no-underline shadow-[var(--shadow-border)] sm:col-span-2"
            >
              Ask Rig Signal: {result.rigQuestion}
              <ArrowUpRight className="size-4 shrink-0" />
            </a>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={copyJson}>
            <Copy className="size-4" />
            Copy packet
          </Button>
          <Button variant="ghost" onClick={downloadJson}>
            <Download className="size-4" />
            Download JSON
          </Button>
          <Button variant="quiet" onClick={onReset}>
            <RotateCcw className="size-4" />
            New scenario
          </Button>
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
          Packet HTH-1.0 · coordinates not stored · {result.species.reviewedAt}
        </p>
      </section>
    </div>
  );
}
