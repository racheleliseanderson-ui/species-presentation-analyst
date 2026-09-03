import { useEffect, useMemo, useState } from "react";
import { ChipGroup } from "@/components/chips";
import { TemperatureInput } from "@/components/temperature-input";
import { inferTempMode, type TempMode } from "@/lib/engine/temp-mode";
import { Plate } from "@/components/plate";
import { Readout } from "@/components/readout";
import { Button } from "@/components/ui/button";
import { interpret } from "@/lib/engine/infer";
import { matchesSpecies } from "@/lib/knowledge/aliases";
import { GROUPS, SPECIES } from "@/lib/knowledge/species-catalog";
import { SPECIES_IMAGES_BY_ID } from "@/lib/knowledge/species-images";
import { SpeciesThumb } from "@/components/species-thumb";
import { readIncoming, type IncomingCarry } from "@/lib/protocol/packet";
import { CarriedContext } from "@/components/carried-context";
import {
  CLARITY,
  FLOW_CLASSES,
  FORAGE_CLASSES,
  HOLDING_BY_WATER_TYPE,
  LIGHT,
  SEASONS,
  STILL_STATES,
  TEMP_SOURCES,
  TIDE_MOVEMENTS,
  TIDE_STRENGTHS,
  WATER_TYPES,
  WEATHER_TRENDS,
  isMarine,
  labelOf,
  type ForageClass,
  type MarineHolding,
  type RiverHolding,
  type StillHolding,
} from "@/lib/protocol/vocab";
import { movementAxisFor } from "@/lib/engine/water";
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
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Example reading</p>
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

export function Instrument({ advanced = false }: { advanced?: boolean } = {}) {
  const session = useSession();
  const [query, setQuery] = useState("");
  const [carry, setCarry] = useState<IncomingCarry>({ state: "absent" });
  const [searchReady, setSearchReady] = useState(false);
  const [tempMode, setTempMode] = useState<TempMode>("unknown");

  // The stored session decides which answer is already on record, so returning
  // to this step shows what was declared rather than resetting to "unknown".
  useEffect(() => {
    setTempMode(inferTempMode(useSession.getState()));
  }, []);

  useEffect(() => {
    setSearchReady(true);
    const api = useSession.getState();
    api.hydrate();
    if (typeof window === "undefined") return;
    /* Every one of the three read states is put on screen. A packet that could
     * not be read is not the same thing as no packet, and collapsing the two is
     * what left readers staring at an empty form after a handoff. */
    const incoming = readIncoming(window.location.hash);
    if (incoming.state === "ok" && incoming.carried.length === 0) return;
    setCarry(incoming);
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
  const movementAxis = movementAxisFor(session.waterType);

  function clearFragment() {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function applyCarry() {
    if (carry.state !== "ok") return;
    const incoming = carry.applied;
    const cur = useSession.getState();
    const nextSpecies = incoming.speciesId ?? cur.speciesId;
    const nextWaterType = incoming.waterType ?? cur.waterType;
    const declarationChanged =
      nextSpecies !== cur.speciesId || nextWaterType !== cur.waterType;
    cur.patch({
      speciesId: nextSpecies,
      water: { ...cur.water, ...incoming.water, selectedSpecies: nextSpecies ?? undefined },
      waterType: nextWaterType,
      populationContext:
        incoming.populationContext ?? (declarationChanged ? null : cur.populationContext),
      tempF: incoming.tempF === undefined ? cur.tempF : incoming.tempF,
      tempRangeF: incoming.tempRangeF === undefined ? cur.tempRangeF : incoming.tempRangeF,
      tempSource: incoming.tempSource ?? cur.tempSource,
      // The number and where it came from travel together, or the next tool has
      // no way to tell a station reading from something someone typed.
      tempObservedAt: incoming.tempObservedAt ?? cur.tempObservedAt,
      tempRetained: incoming.tempRetained ?? cur.tempRetained,
      tempStation: incoming.tempStation ?? cur.tempStation,
      cues: incoming.cues?.length ? incoming.cues : cur.cues,
      tideMovement: incoming.tideMovement ?? cur.tideMovement,
      tideStrength: incoming.tideStrength ?? cur.tideStrength,
      // Holding water belongs to the water it was declared on, and an incoming
      // packet can change the water type underneath it.
      holdingRiver: declarationChanged ? (incoming.holdingRiver ?? null) : cur.holdingRiver,
      holdingStill: declarationChanged ? (incoming.holdingStill ?? null) : cur.holdingStill,
      holdingMarine: declarationChanged ? null : cur.holdingMarine,
      forage: incoming.forage ?? cur.forage,
      step: incoming.speciesId ? "water" : cur.step,
    });
    setCarry({ state: "absent" });
    clearFragment();
  }

  function dismissCarry() {
    setCarry({ state: "absent" });
    clearFragment();
  }

  const continueLabel: Partial<Record<Step, { next: Step; label: string }>> = {
    water: { next: "conditions", label: "Continue to conditions" },
    conditions: { next: "holding", label: "Continue to holding water" },
    holding: { next: "readout", label: "Read what's plausible" },
  };

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pt-12">
      <CarriedContext
        carry={carry}
        className="mb-8"
        onApply={applyCarry}
        onDismiss={dismissCarry}
      />

      {session.step === "target" && !session.speciesId && (
        <section className="stagger-in mb-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
              Start with the fish
            </p>
            <h1 className="mt-4 max-w-xl font-display text-5xl text-fg sm:text-6xl">
              What is this species plausibly doing here?
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted">
              You'll leave with a presentation family, a holding-water class, and a brief the rest of the Hook the Horizon apps can read. Not a lure to buy. Not a bite score.
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

      <nav className="mb-8 flex flex-wrap gap-2 no-print" aria-label="Reading steps">
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
            {SPECIES.length} North American records are loaded. A name that isn't in them never falls through to generic advice. Search accepts common names and nicknames.
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
              No reviewed record matches “{query}”. Try another common name or nickname. Nothing here invents biology for a fish that hasn't been reviewed.
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
                        <SpeciesThumb
                          speciesId={s.id}
                          commonName={s.commonNames[0]}
                          className="h-14 w-20"
                        />
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
            Name a public water if you want it carried with your reading. Water type is required. No coordinates, ever.
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
            onChange={(waterType) =>
              session.patch({
                waterType,
                water: { ...session.water, waterType },
                // Holding water belongs to the water it was declared on. Carrying
                // a grass flat across to a river would quietly rank the reading
                // on structure the angler is no longer standing in.
                holdingRiver: waterType === "flowing" ? session.holdingRiver : null,
                holdingStill: waterType === "stillwater" ? session.holdingStill : null,
                holdingMarine: isMarine(waterType) ? session.holdingMarine : null,
              })
            }
            options={WATER_TYPES.map((id) => ({ id, label: labelOf(id) }))}
            columns={3}
          />
          {mismatch && (
            <p className="instrument-rule rounded-[var(--radius-md)] bg-elevated px-4 py-3 text-sm">
              {species.commonNames[0]} has no reviewed {labelOf(session.waterType)} record. Saying so is the honest answer; guessing one would read the same and be wrong. Switch the water type, or pick a different species.
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
          <TemperatureInput
            session={session}
            onPatch={(partial) => session.patch(partial)}
            mode={tempMode}
            onModeChange={setTempMode}
          />
          <p className="font-mono text-xs text-muted">
            {session.tempF != null
              ? `${session.tempF}°F — ${labelOf(session.tempSource).toUpperCase()}`
              : session.tempRangeF
                ? `${session.tempRangeF[0]}–${session.tempRangeF[1]}°F — ${labelOf(session.tempSource).toUpperCase()}`
                : "NOT MEASURED YET"}
          </p>
          {tempMode !== "unknown" && (
            <ChipGroup
              legend="Temperature provenance"
              value={session.tempSource}
              onChange={(tempSource) => session.patch({ tempSource })}
              options={opts(TEMP_SOURCES)}
              columns={2}
            />
          )}
          {movementAxis === "flow" && (
            <ChipGroup
              legend="Flow"
              value={session.flow}
              onChange={(flow) => session.patch({ flow })}
              options={opts(FLOW_CLASSES)}
              columns={3}
            />
          )}
          {movementAxis === "still_state" && (
            <ChipGroup
              legend="Stillwater state"
              value={session.stillState}
              onChange={(stillState) => session.patch({ stillState })}
              options={opts(STILL_STATES)}
              columns={3}
            />
          )}
          {movementAxis === "tide" && (
            <>
              <ChipGroup
                legend="Tide"
                value={session.tideMovement ?? "unknown"}
                onChange={(tideMovement) => session.patch({ tideMovement })}
                options={opts(TIDE_MOVEMENTS)}
                columns={3}
              />
              <ChipGroup
                legend="Tide range"
                value={session.tideStrength ?? "unknown"}
                onChange={(tideStrength) => session.patch({ tideStrength })}
                options={opts(TIDE_STRENGTHS)}
                columns={2}
              />
            </>
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
              Leave this unknown unless you actually saw it. Hatch Match is where you record what you observed.
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
          {session.waterType === "flowing" && (
            <ChipGroup
              legend="River / flowing classes"
              value={session.holdingRiver}
              onChange={(holdingRiver) => session.patch({ holdingRiver })}
              options={opts(HOLDING_BY_WATER_TYPE.flowing as readonly RiverHolding[])}
              columns={3}
            />
          )}
          {session.waterType === "stillwater" && (
            <ChipGroup
              legend="Lake / reservoir classes"
              value={session.holdingStill}
              onChange={(holdingStill) => session.patch({ holdingStill })}
              options={opts(HOLDING_BY_WATER_TYPE.stillwater as readonly StillHolding[])}
              columns={3}
            />
          )}
          {isMarine(session.waterType) && (
            <ChipGroup
              legend={`${labelOf(session.waterType)} classes`}
              value={session.holdingMarine ?? null}
              onChange={(holdingMarine) => session.patch({ holdingMarine })}
              options={opts(
                HOLDING_BY_WATER_TYPE[session.waterType] as readonly MarineHolding[],
              )}
              columns={3}
            />
          )}
          <Button
            variant="quiet"
            onClick={() =>
              session.patch({ holdingRiver: null, holdingStill: null, holdingMarine: null })
            }
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
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Nothing evaluated yet</p>
          <h2 className="mt-2 font-display text-3xl text-fg">Add a species to begin.</h2>
          <p className="mt-4 max-w-xl text-sm text-muted">
            Pick a reviewed species first and the reading fills in from there. A name that isn't in the catalog never falls through to generic advice.
          </p>
          <Button className="mt-6" variant="ghost" onClick={() => session.setStep("target")}>
            Choose a species
          </Button>
        </section>
      )}

      {session.step === "readout" && session.speciesId && (
        <Readout
          session={session}
          advanced={advanced}
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
