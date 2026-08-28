import { useEffect, useMemo, useState } from "react";
import { ChipGroup } from "@/components/chips";
import { Plate } from "@/components/plate";
import { Readout } from "@/components/readout";
import { Button } from "@/components/ui/button";
import { interpret } from "@/lib/engine/infer";
import { POPULATION_CONTEXT_BY_ID } from "@/lib/engine/population-context";
import { matchesSpecies } from "@/lib/knowledge/aliases";
import { GROUPS, SPECIES, SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { SPECIES_IMAGES_BY_ID } from "@/lib/knowledge/species-images";
import { parseIncomingPacket } from "@/lib/protocol/packet";
import type { ScenarioInput } from "@/lib/protocol/types";
import {
  CLARITY,
  FLOW_CLASSES,
  FORAGE_CLASSES,
  LIGHT,
  RIVER_HOLDING,
  SEASONS,
  STILL_HOLDING,
  STILL_STATES,
  TEMP_SOURCES,
  WEATHER_TRENDS,
  labelOf,
  type ForageClass,
} from "@/lib/protocol/vocab";
import { STARTERS, useSession, type Step } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS: { id: Step; n: string; label: string }[] = [
  { id: "target", n: "01", label: "Target" },
  { id: "water", n: "02", label: "Water" },
  { id: "conditions", n: "03", label: "Conditions" },
  { id: "holding", n: "04", label: "Holding water" },
  { id: "readout", n: "05", label: "Reading" },
];

function opts<T extends string>(ids: readonly T[]) {
  return ids.map((id) => ({ id, label: labelOf(id) }));
}

function incomingRows(p: Partial<ScenarioInput>): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  if (p.speciesId) {
    const s = SPECIES_BY_ID[p.speciesId];
    rows.push({ label: "Species", value: s ? s.commonNames[0] : p.speciesId });
  }
  if (p.water?.waterName) rows.push({ label: "Water", value: p.water.waterName });
  if (p.waterType) rows.push({ label: "Water type", value: labelOf(p.waterType) });
  if (p.populationContext?.profileId) {
    const profile = POPULATION_CONTEXT_BY_ID[p.populationContext.profileId];
    rows.push({
      label: "Population context",
      value: profile
        ? `${profile.label} · ${p.populationContext.source.replaceAll("_", " ")}`
        : p.populationContext.profileId,
    });
  }
  if (p.tempF != null) rows.push({ label: "Temperature", value: `${p.tempF}°F` });
  if (p.tempSource) rows.push({ label: "Temp source", value: labelOf(p.tempSource) });
  if (p.forage) rows.push({ label: "Forage", value: labelOf(p.forage.class) });
  return rows;
}

function WorkedExample({ onOpen }: { onOpen: () => void }) {
  const result = interpret({
    speciesId: "salmo_trutta",
    water: { waterName: "Named public river corridor", waterType: "flowing" },
    waterType: "flowing",
    tempF: 54,
    tempSource: "user_measured",
    flow: "moderate",
    stillState: "unknown",
    clarity: "clear",
    light: "low_light",
    weather: "stable",
    season: "spring",
    holdingRiver: "seam",
    holdingStill: null,
    forage: null,
  });
  if ("error" in result) return null;
  return (
    <aside className="instrument-rule rounded-[var(--radius-md)] bg-elevated p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">A worked reading</p>
      <p className="mt-2 font-display text-xl text-fg">Brown trout · 54°F seam</p>
      <p className="mt-2 text-sm text-fg">
        Most plausible family: {result.presentations[0]?.label}. Not a lure. Not a bite score.
      </p>
      <Button className="mt-4" variant="ghost" size="sm" onClick={onOpen}>
        Open this reading
      </Button>
    </aside>
  );
}

export function Instrument() {
  const session = useSession();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<Partial<ScenarioInput> | null>(null);
  const [searchReady, setSearchReady] = useState(false);

  useEffect(() => {
    setSearchReady(true);
    const api = useSession.getState();
    api.hydrate();
    if (typeof window === "undefined") return;
    const incoming = parseIncomingPacket(window.location.hash);
    if (!incoming) return;
    if (
      incoming.speciesId ||
      incoming.water?.waterId ||
      incoming.water?.waterName ||
      incoming.populationContext ||
      incoming.forage
    ) {
      setPending(incoming);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [session.step]);

  const species = SPECIES.find((s) => s.id === session.speciesId);
  const filtered = useMemo(
    () => SPECIES.filter((s) => matchesSpecies(s, query)),
    [query],
  );
  const mismatch =
    species && !species.habitat.waterTypes.includes(session.waterType);

  const continueLabel: Partial<Record<Step, { next: Step; label: string }>> = {
    water: { next: "conditions", label: "Continue to conditions" },
    conditions: { next: "holding", label: "Continue to holding water" },
    holding: { next: "readout", label: "Read what's plausible" },
  };

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pt-12">
      {pending && (
        <section className="no-print mb-8 instrument-rule rounded-[var(--radius-lg)] bg-elevated p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            A packet arrived · nothing applied yet
          </p>
          <h2 className="mt-2 font-display text-2xl">Inspect before using these fields</h2>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {incomingRows(pending).map((row) => (
              <div key={row.label}>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-dim">{row.label}</dt>
                <dd className="text-fg">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-muted">
            Coordinates are refused. Population context is never inferred from the water name. Apply only what you recognize.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const cur = useSession.getState();
                const nextSpecies = pending.speciesId ?? cur.speciesId;
                const nextWaterType = pending.waterType ?? cur.waterType;
                const declarationChanged =
                  nextSpecies !== cur.speciesId || nextWaterType !== cur.waterType;
                useSession.getState().patch({
                  speciesId: nextSpecies,
                  water: { ...cur.water, ...pending.water },
                  waterType: nextWaterType,
                  populationContext:
                    pending.populationContext ??
                    (declarationChanged ? null : cur.populationContext),
                  tempF: pending.tempF === undefined ? cur.tempF : pending.tempF,
                  tempSource: pending.tempSource ?? cur.tempSource,
                  forage: pending.forage ?? cur.forage,
                  step: pending.speciesId ? "water" : cur.step,
                });
                setPending(null);
                if (typeof window !== "undefined") window.history.replaceState(null, "", window.location.pathname);
              }}
            >
              Apply these fields
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPending(null);
                if (typeof window !== "undefined") window.history.replaceState(null, "", window.location.pathname);
              }}
            >
              Dismiss
            </Button>
          </div>
        </section>
      )}

      {session.step === "target" && !session.speciesId && (
        <section className="stagger-in mb-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
              HTH-SP-001 · biology before bravado
            </p>
            <h1 className="mt-4 max-w-xl font-display text-5xl text-fg sm:text-6xl">
              What is this species plausibly doing here?
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted">
              You'll leave with a presentation family, a holding-water class, and a packet the rest of the suite can read. Not a lure SKU. Not a bite score.
            </p>
            <div className="mt-6 instrument-rule max-w-xl rounded-[var(--radius-md)] bg-elevated p-5 text-sm text-muted">
              No bite scores. No hotspots. No exact lures. A reviewed record, a declared water, and a reading you can falsify.
            </div>
          </div>
          <div className="hidden space-y-4 lg:block">
            <Plate caption="Seam · velocity boundary · not a coordinate" />
            <WorkedExample onOpen={() => session.patch(STARTERS[0].patch)} />
          </div>
        </section>
      )}

      <nav className="mb-8 flex flex-wrap gap-2 no-print" aria-label="Declaration steps">
        {STEPS.map((s) => {
          const on = session.step === s.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-current={on ? "step" : undefined}
              onClick={() => session.setStep(s.id)}
              className={cn(
                "min-h-11 rounded-full px-3 font-mono text-[10px] uppercase tracking-[0.14em]",
                on ? "bg-accent text-accent-fg" : "bg-subtle text-dim hover:text-fg",
              )}
            >
              {s.n} {s.label}
            </button>
          );
        })}
      </nav>

      {session.step === "target" && (
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Step 01 — Target</p>
          <h2 className="mt-2 font-display text-3xl">Which reviewed species?</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Unreviewed names do not fall through to generic advice. {SPECIES.length} North American records are loaded. Search accepts common names and nicknames.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <Button key={s.id} variant="ghost" size="sm" className="min-h-11" onClick={() => session.patch(s.patch)}>
                Try {s.label}
              </Button>
            ))}
          </div>
          <div className="mt-6 lg:hidden">
            <WorkedExample onOpen={() => session.patch(STARTERS[0].patch)} />
          </div>
          <label className="mt-8 block max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Search species</span>
            {searchReady ? (
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="brownie, smallie, laker, striper…"
                autoComplete="off"
                spellCheck={false}
                className="mt-2 min-h-12 w-full rounded-[var(--radius-sm)] bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-dim"
              />
            ) : (
              <div className="mt-2 min-h-12 w-full rounded-[var(--radius-sm)] bg-elevated shadow-[var(--shadow-border)]" />
            )}
          </label>
          {query.trim() && filtered.length === 0 && (
            <p className="mt-6 max-w-xl text-sm text-muted">
              No reviewed record matches “{query}”. This will not invent biology for an unreviewed name.
            </p>
          )}
          {GROUPS.map((g) => {
            const rows = filtered.filter((s) => s.group === g.id);
            if (rows.length === 0) return null;
            return (
              <div key={g.id} className="mt-8">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">{g.label}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((s) => {
                    const on = session.speciesId === s.id;
                    const image = SPECIES_IMAGES_BY_ID[s.id];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => session.patch({ speciesId: s.id, step: "water" })}
                        className={cn(
                          "flex min-h-20 items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left shadow-[var(--shadow-border)]",
                          on ? "bg-accent text-accent-fg" : "bg-elevated hover:shadow-[var(--shadow-border-hover)]",
                        )}
                      >
                        {image && (
                          <img
                            src={image.thumb}
                            alt={`Reviewed canonical image of ${s.commonNames[0]}`}
                            title={`${image.sourceOrg} · ${image.license}`}
                            loading="lazy"
                            decoding="async"
                            className="h-14 w-20 shrink-0 rounded-[var(--radius-sm)] bg-subtle object-contain p-1 shadow-[var(--shadow-border)]"
                          />
                        )}
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{s.commonNames[0]}</span>
                          <span className={cn("block font-mono text-[11px]", on ? "opacity-70" : "text-dim")}>
                            {s.scientificName}
                          </span>
                          {image && (
                            <span className={cn("mt-1 block font-mono text-[9px] uppercase tracking-wide", on ? "opacity-65" : "text-dim")}>
                              Reviewed image · {image.imageType.replaceAll("_", " ")}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {session.step === "water" && (
        <section className="max-w-3xl space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Step 02 — Water</p>
          <h2 className="font-display text-3xl">
            {species ? species.commonNames[0] : "Declare water"}
          </h2>
          <p className="text-sm text-muted">
            Name a public water if you want the packet to carry it. Water type is required. No coordinates.
          </p>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Named public water
            </span>
            <input
              value={session.water.waterName ?? ""}
              onChange={(e) =>
                session.patch({ water: { ...session.water, waterName: e.target.value } })
              }
              placeholder="South Fork Snake River public corridor"
              className="mt-2 min-h-12 w-full rounded-[var(--radius-sm)] bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-dim"
            />
          </label>
          <ChipGroup
            legend="Water type"
            value={session.waterType}
            onChange={(waterType) => session.patch({ waterType, water: { ...session.water, waterType } })}
            options={[
              { id: "flowing", label: "Flowing" },
              { id: "stillwater", label: "Stillwater" },
            ]}
          />
          {mismatch && (
            <p className="instrument-rule rounded-[var(--radius-md)] bg-elevated px-4 py-3 text-sm">
              {species.commonNames[0]} has no reviewed {labelOf(session.waterType)} record. The reading will refuse rather than guess. Switch type, or pick a different species.
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => session.setStep("target")}>
              Back
            </Button>
            <Button onClick={() => session.setStep("conditions")}>Continue to conditions</Button>
          </div>
        </section>
      )}

      {session.step === "conditions" && (
        <section className="max-w-3xl space-y-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            Step 03 — Conditions
          </p>
          <h2 className="font-display text-3xl">Declare what you know. Leave the rest unknown.</h2>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Water temperature
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                type="number"
                inputMode="decimal"
                aria-label="Water temperature in Fahrenheit"
                value={session.tempF ?? ""}
                onChange={(e) =>
                  session.patch({
                    tempF: e.target.value === "" ? null : Number(e.target.value),
                    tempSource:
                      session.tempSource === "unknown" && e.target.value !== ""
                        ? "user_measured"
                        : session.tempSource,
                  })
                }
                placeholder="°F"
                className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-elevated px-3 font-mono text-sm text-fg shadow-[var(--shadow-border)]"
              />
              <p className="flex min-h-12 items-center font-mono text-xs text-muted">
                {session.tempF == null
                  ? "UNKNOWN"
                  : `${session.tempF}°F — ${labelOf(session.tempSource).toUpperCase()}`}
              </p>
            </div>
            <p className="mt-2 text-xs text-dim">
              Never silently substitute air temperature. Provenance stays visible. Unknown is a valid answer.
            </p>
          </div>
          <ChipGroup
            legend="Temperature provenance"
            value={session.tempSource}
            onChange={(tempSource) => session.patch({ tempSource })}
            options={opts(TEMP_SOURCES)}
            columns={2}
          />
          {session.waterType === "flowing" ? (
            <ChipGroup
              legend="Flow"
              value={session.flow}
              onChange={(flow) => session.patch({ flow })}
              options={opts(FLOW_CLASSES)}
              columns={3}
            />
          ) : (
            <ChipGroup
              legend="Stillwater state"
              value={session.stillState}
              onChange={(stillState) => session.patch({ stillState })}
              options={opts(STILL_STATES)}
              columns={3}
            />
          )}
          <ChipGroup
            legend="Clarity"
            value={session.clarity}
            onChange={(clarity) => session.patch({ clarity })}
            options={opts(CLARITY)}
            columns={3}
          />
          <ChipGroup
            legend="Light"
            value={session.light}
            onChange={(light) => session.patch({ light })}
            options={opts(LIGHT)}
            columns={3}
          />
          <ChipGroup
            legend="Weather trend"
            value={session.weather}
            onChange={(weather) => session.patch({ weather })}
            options={opts(WEATHER_TRENDS)}
            columns={3}
          />
          <ChipGroup
            legend="Season"
            value={session.season}
            onChange={(season) => session.patch({ season })}
            options={opts(SEASONS)}
            columns={4}
          />
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Observed forage — optional
            </p>
            <p className="mb-3 text-sm text-muted">
              Leave this unknown unless you saw it. Hatch Match is the observation instrument.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => session.patch({ forage: null })}
                className={cn(
                  "min-h-11 rounded-[var(--radius-sm)] px-3 text-sm shadow-[var(--shadow-border)]",
                  !session.forage ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                )}
              >
                Not observed
              </button>
              {FORAGE_CLASSES.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    session.patch({ forage: { class: id as ForageClass, source: "user_observation" } })
                  }
                  className={cn(
                    "min-h-11 rounded-[var(--radius-sm)] px-3 text-sm shadow-[var(--shadow-border)]",
                    session.forage?.class === id ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                  )}
                >
                  {labelOf(id)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => session.setStep("water")}>
              Back
            </Button>
            <Button onClick={() => session.setStep("holding")}>Continue to holding water</Button>
          </div>
        </section>
      )}

      {session.step === "holding" && (
        <section className="max-w-4xl space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            Step 04 — Holding water
          </p>
          <h2 className="font-display text-3xl">Classify the structure. Do not drop a pin.</h2>
          <p className="max-w-2xl text-sm text-muted">
            Holding-water class is ecological structure, not a secret spot. Unknown is allowed.
          </p>
          {session.waterType === "flowing" ? (
            <ChipGroup
              legend="River / flowing classes"
              value={session.holdingRiver}
              onChange={(holdingRiver) => session.patch({ holdingRiver })}
              options={opts(RIVER_HOLDING)}
              columns={3}
            />
          ) : (
            <ChipGroup
              legend="Lake / reservoir classes"
              value={session.holdingStill}
              onChange={(holdingStill) => session.patch({ holdingStill })}
              options={opts(STILL_HOLDING)}
              columns={3}
            />
          )}
          <Button
            variant="quiet"
            onClick={() => session.patch({ holdingRiver: null, holdingStill: null })}
          >
            Leave undeclared
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => session.setStep("conditions")}>
              Back
            </Button>
            <Button onClick={() => session.setStep("readout")}>Read what's plausible</Button>
          </div>
        </section>
      )}

      {session.step === "readout" && !session.speciesId && (
        <section className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Cannot answer</p>
          <h2 className="mt-2 font-display text-3xl text-fg">No reviewed species is declared.</h2>
          <p className="mt-4 max-w-xl text-sm text-muted">
            Pick a reviewed record first. Unreviewed names do not fall through to generic advice.
          </p>
          <Button className="mt-6" variant="ghost" onClick={() => session.setStep("target")}>
            Choose a reviewed species
          </Button>
        </section>
      )}

      {session.step === "readout" && session.speciesId && (
        <Readout
          session={session}
          onPatch={(partial) => session.patch(partial)}
          onReset={() => session.reset()}
          onBack={() => session.setStep("water")}
        />
      )}

      {continueLabel[session.step] && (
        <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/92 p-3 backdrop-blur-sm lg:hidden">
          <Button
            className="w-full"
            onClick={() => session.setStep(continueLabel[session.step]!.next)}
          >
            {continueLabel[session.step]!.label}
          </Button>
        </div>
      )}
    </main>
  );
}
