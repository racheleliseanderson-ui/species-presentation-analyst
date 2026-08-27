import { useEffect } from "react";
import { ChipGroup } from "@/components/chips";
import { Plate } from "@/components/plate";
import { Readout } from "@/components/readout";
import { Button } from "@/components/ui/button";
import { GROUPS, SPECIES } from "@/lib/knowledge/species-catalog";
import { parseIncomingPacket } from "@/lib/protocol/packet";
import {
  CLARITY,
  FLOW_CLASSES,
  LIGHT,
  RIVER_HOLDING,
  SEASONS,
  STILL_HOLDING,
  STILL_STATES,
  TEMP_SOURCES,
  WEATHER_TRENDS,
  labelOf,
} from "@/lib/protocol/vocab";
import { STARTERS, useSession, type Step } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS: { id: Step; n: string; label: string }[] = [
  { id: "target", n: "01", label: "Target" },
  { id: "water", n: "02", label: "Water" },
  { id: "conditions", n: "03", label: "Conditions" },
  { id: "holding", n: "04", label: "Holding water" },
  { id: "readout", n: "05", label: "Hypothesis" },
];

function opts<T extends string>(ids: readonly T[]) {
  return ids.map((id) => ({ id, label: labelOf(id) }));
}

export function Instrument() {
  const session = useSession();

  useEffect(() => {
    const api = useSession.getState();
    api.hydrate();
    if (typeof window === "undefined") return;
    const incoming = parseIncomingPacket(window.location.hash);
    if (!incoming) return;
    const cur = useSession.getState();
    if (incoming.speciesId || incoming.water?.waterId || incoming.water?.waterName || incoming.forage) {
      useSession.getState().patch({
        speciesId: incoming.speciesId ?? cur.speciesId,
        water: { ...cur.water, ...incoming.water },
        waterType: incoming.waterType ?? cur.waterType,
        tempF: incoming.tempF === undefined ? cur.tempF : incoming.tempF,
        tempSource: incoming.tempSource ?? cur.tempSource,
        forage: incoming.forage ?? cur.forage,
        step: incoming.speciesId ? "water" : cur.step,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [session.step]);

  const species = SPECIES.find((s) => s.id === session.speciesId);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
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
              We do not predict whether fish will bite. We explain what biological and environmental
              conditions make particular behavior and presentation families more or less plausible.
            </p>
            <div className="mt-6 instrument-rule max-w-xl rounded-[var(--radius-md)] bg-elevated p-5 text-sm text-muted">
              No bite scores. No hotspots. No exact lures. A reviewed record, a declared water, and a
              hypothesis you can falsify.
            </div>
          </div>
          <div className="hidden lg:block">
            <Plate caption="Seam · velocity boundary · not a coordinate" />
          </div>
        </section>
      )}

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Declaration steps">
        {STEPS.map((s) => {
          const on = session.step === s.id;
          return (
            <button
              key={s.id}
              type="button"
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
            Unreviewed names do not fall through to generic advice. {SPECIES.length} North American
            records are loaded.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <Button key={s.id} variant="ghost" size="sm" className="min-h-11" onClick={() => session.patch(s.patch)}>
                Try {s.label}
              </Button>
            ))}
          </div>
          {GROUPS.map((g) => (
            <div key={g.id} className="mt-8">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">{g.label}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {SPECIES.filter((s) => s.group === g.id).map((s) => {
                  const on = session.speciesId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => session.patch({ speciesId: s.id, step: "water" })}
                      className={cn(
                        "min-h-16 rounded-[var(--radius-md)] px-4 py-3 text-left shadow-[var(--shadow-border)]",
                        on ? "bg-accent text-accent-fg" : "bg-elevated hover:shadow-[var(--shadow-border-hover)]",
                      )}
                    >
                      <span className="block text-sm font-medium">{s.commonNames[0]}</span>
                      <span className={cn("block font-mono text-[11px]", on ? "opacity-70" : "text-dim")}>
                        {s.scientificName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {session.step === "water" && (
        <section className="max-w-3xl space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Step 02 — Water</p>
          <h2 className="font-display text-3xl">
            {species ? species.commonNames[0] : "Declare water"}
          </h2>
          <p className="text-sm text-muted">
            Carry a public-safe Field Sense packet, or declare the water type by hand. No coordinates.
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
              Never silently substitute air temperature. Provenance stays visible.
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
            Holding-water class is ecological structure, not a secret spot. The engine needs a class, not a
            coordinate.
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
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => session.setStep("conditions")}>
              Back
            </Button>
            <Button onClick={() => session.setStep("readout")}>Read the hypothesis</Button>
          </div>
        </section>
      )}

      {session.step === "readout" && !session.speciesId && (
        <section className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Fail closed</p>
          <h2 className="mt-2 font-display text-3xl text-fg">No reviewed species is declared.</h2>
          <p className="mt-4 max-w-xl text-sm text-muted">
            This instrument will not invent biology. Pick a reviewed record first.
          </p>
          <Button className="mt-6" variant="ghost" onClick={() => session.setStep("target")}>
            Choose a reviewed species
          </Button>
        </section>
      )}

      {session.step === "readout" && session.speciesId && (
        <Readout
          session={session}
          onReset={() => session.reset()}
          onBack={() => session.setStep("water")}
        />
      )}
    </main>
  );
}
