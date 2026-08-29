import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { drivingChanges } from "@/lib/engine/sensitivity";
import { interpret } from "@/lib/engine/infer";
import { matchesSpecies } from "@/lib/knowledge/aliases";
import { SPECIES, SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { SPECIES_IMAGES_BY_ID } from "@/lib/knowledge/species-images";
import { parseIncomingPacket } from "@/lib/protocol/packet";
import type { ScenarioInput } from "@/lib/protocol/types";
import { SEASONS, labelOf, type Light, type Season, type WaterType } from "@/lib/protocol/vocab";
import { STARTERS, toInput, useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

type QuickReadProps = {
  onOpenFull: () => void;
};

type TimeBand = {
  id: string;
  label: string;
  light: Light;
};

const TIME_BANDS: TimeBand[] = [
  { id: "dawn", label: "Dawn", light: "low_light" },
  { id: "morning", label: "Morning", light: "mixed" },
  { id: "midday", label: "Midday", light: "bright" },
  { id: "afternoon", label: "Afternoon", light: "mixed" },
  { id: "dusk", label: "Dusk", light: "low_light" },
  { id: "night", label: "Night", light: "night" },
];

function seasonForDate(date: Date): Season {
  const month = date.getMonth() + 1;
  if (month === 12 || month <= 2) return "winter";
  if (month === 3) return "early_spring";
  if (month === 4 || month === 5) return "spring";
  if (month === 6) return "early_summer";
  if (month === 7) return "summer";
  if (month === 8) return "late_summer";
  if (month === 9 || month === 10) return "fall";
  return "late_fall";
}

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-[var(--radius-sm)] px-4 py-2.5 text-left text-sm shadow-[var(--shadow-border)] transition",
        active ? "bg-accent text-accent-fg" : "bg-elevated text-fg hover:shadow-[var(--shadow-border-hover)]",
      )}
    >
      {children}
    </button>
  );
}

function PacketReview({
  pending,
  onApply,
  onDismiss,
}: {
  pending: Partial<ScenarioInput>;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const rows: { label: string; value: string }[] = [];
  if (pending.speciesId) {
    rows.push({
      label: "Target",
      value: SPECIES_BY_ID[pending.speciesId]?.commonNames[0] ?? pending.speciesId,
    });
  }
  const packetWaterType = pending.waterType ?? pending.water?.waterType;
  if (packetWaterType) rows.push({ label: "Water", value: labelOf(packetWaterType) });
  if (pending.water?.jurisdiction) rows.push({ label: "Area", value: pending.water.jurisdiction });
  if (pending.water?.waterName) rows.push({ label: "Named water", value: pending.water.waterName });
  if (pending.tempF != null) rows.push({ label: "Water temperature", value: `${pending.tempF}°F` });
  if (pending.light && pending.light !== "unknown") rows.push({ label: "Light", value: labelOf(pending.light) });
  if (pending.forage) rows.push({ label: "Observed forage", value: labelOf(pending.forage.class) });

  return (
    <section className="mb-6 rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">Context arrived from another Hook tool</p>
      <h2 className="mt-2 font-display text-2xl">Use what we already know?</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Review it once, then continue from the missing pieces. Population context is only carried when it was explicitly reviewed upstream.
      </p>
      {rows.length > 0 && (
        <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={`${row.label}-${row.value}`} className="rounded-[var(--radius-sm)] bg-subtle px-3 py-3">
              <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">{row.label}</dt>
              <dd className="mt-1 text-sm text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onApply}>Use this context</Button>
        <Button variant="ghost" onClick={onDismiss}>Start without it</Button>
      </div>
    </section>
  );
}

export function QuickRead({ onOpenFull }: QuickReadProps) {
  const session = useSession();
  const [query, setQuery] = useState("");
  const [timeBand, setTimeBand] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [pending, setPending] = useState<Partial<ScenarioInput> | null>(null);
  const [seasonWasDerived, setSeasonWasDerived] = useState(false);

  useEffect(() => {
    const api = useSession.getState();
    api.hydrate();
    const hydrated = useSession.getState();

    const isFreshScenario =
      !hydrated.speciesId &&
      !hydrated.water.waterType &&
      !hydrated.water.waterName &&
      hydrated.tempF == null &&
      hydrated.light === "unknown";

    if (isFreshScenario) {
      api.patch({ season: seasonForDate(new Date()) });
      setSeasonWasDerived(true);
    }

    if (typeof window === "undefined") return;
    const incoming = parseIncomingPacket(window.location.hash);
    if (incoming) setPending(incoming);
  }, []);

  const waterDeclared = Boolean(session.water.waterType);
  const filteredSpecies = useMemo(() => {
    const q = query.trim();
    return SPECIES.filter((species) => {
      if (waterDeclared && !species.habitat.waterTypes.includes(session.waterType)) return false;
      return !q || matchesSpecies(species, q);
    }).slice(0, q ? 18 : 0);
  }, [query, session.waterType, waterDeclared]);

  const selectedSpecies = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;
  const input = showResult ? toInput(session) : null;
  const result = input ? interpret(input) : null;
  const drivers = input && result && !("error" in result) ? drivingChanges(input) : [];
  const top = result && !("error" in result) ? result.presentations[0] : null;

  function setWaterType(waterType: WaterType) {
    session.patch({
      waterType,
      water: { ...session.water, waterType },
      holdingRiver: null,
      holdingStill: null,
    });
    setShowResult(false);
  }

  function applyPending() {
    if (!pending) return;
    const current = useSession.getState();
    const nextSpecies = pending.speciesId ?? current.speciesId;
    const nextWaterType = pending.waterType ?? pending.water?.waterType ?? current.waterType;
    const declarationChanged = nextSpecies !== current.speciesId || nextWaterType !== current.waterType;

    current.patch({
      speciesId: nextSpecies,
      waterType: nextWaterType,
      water: { ...current.water, ...pending.water, waterType: nextWaterType },
      populationContext:
        pending.populationContext ?? (declarationChanged ? null : current.populationContext),
      tempF: pending.tempF === undefined ? current.tempF : pending.tempF,
      tempSource: pending.tempSource ?? current.tempSource,
      flow: pending.flow ?? current.flow,
      stillState: pending.stillState ?? current.stillState,
      clarity: pending.clarity ?? current.clarity,
      light: pending.light ?? current.light,
      weather: pending.weather ?? current.weather,
      season: pending.season ?? current.season,
      forage: pending.forage ?? current.forage,
    });
    setPending(null);
    setShowResult(false);
    if (typeof window !== "undefined") window.history.replaceState(null, "", window.location.pathname);
  }

  function dismissPending() {
    setPending(null);
    if (typeof window !== "undefined") window.history.replaceState(null, "", window.location.pathname);
  }

  function openFullAnalysis() {
    if (session.speciesId) session.patch({ step: "readout" });
    onOpenFull();
  }

  const canRead = Boolean(session.speciesId && session.water.waterType);

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pt-10">
      {pending && <PacketReview pending={pending} onApply={applyPending} onDismiss={dismissPending} />}

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">Quick Read · start with what you know</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl text-fg sm:text-5xl">
            Where should I look, and how should I present?
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">
            Pick the fish and the kind of water. Add time or water temperature if you know them. The deeper model stays underneath; you do not have to configure it first.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">What Quick Read skips</p>
          <p className="mt-2 text-sm text-fg">
            No required clarity, weather, forage, flow class, or holding-water taxonomy. Unknown is allowed. Refine only when a missing variable matters.
          </p>
        </div>
      </section>

      <div className="space-y-5">
        <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dim">1 · Target</p>
              <h2 className="mt-1 font-display text-2xl">What are you fishing for?</h2>
            </div>
            {selectedSpecies && (
              <button type="button" className="text-sm text-muted underline" onClick={() => session.patch({ speciesId: null })}>
                Change target
              </button>
            )}
          </div>

          {selectedSpecies ? (
            <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] bg-subtle p-3">
              {SPECIES_IMAGES_BY_ID[selectedSpecies.id] && (
                <img
                  src={SPECIES_IMAGES_BY_ID[selectedSpecies.id].thumb}
                  alt={selectedSpecies.commonNames[0]}
                  className="h-16 w-24 rounded-[var(--radius-sm)] object-contain"
                />
              )}
              <div>
                <p className="font-medium text-fg">{selectedSpecies.commonNames[0]}</p>
                <p className="font-mono text-[11px] text-dim">{selectedSpecies.scientificName}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {STARTERS.map((starter) => {
                  const speciesId = starter.patch.speciesId;
                  const species = speciesId ? SPECIES_BY_ID[speciesId] : null;
                  if (!species) return null;
                  return (
                    <Button
                      key={starter.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        session.patch({ speciesId });
                        setQuery("");
                        setShowResult(false);
                      }}
                    >
                      {species.commonNames[0]}
                    </Button>
                  );
                })}
              </div>
              <label className="mt-4 block max-w-2xl">
                <span className="sr-only">Search species</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search: trout, smallmouth, walleye, pike…"
                  autoComplete="off"
                  className="min-h-12 w-full rounded-[var(--radius-sm)] bg-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-dim"
                />
              </label>
              {query.trim() && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSpecies.map((species) => (
                    <button
                      key={species.id}
                      type="button"
                      onClick={() => {
                        session.patch({ speciesId: species.id });
                        setQuery("");
                        setShowResult(false);
                      }}
                      className="flex min-h-14 items-center gap-2 rounded-[var(--radius-sm)] bg-subtle px-3 py-2 text-left text-sm shadow-[var(--shadow-border)]"
                    >
                      {SPECIES_IMAGES_BY_ID[species.id] && (
                        <img
                          src={SPECIES_IMAGES_BY_ID[species.id].thumb}
                          alt=""
                          className="h-10 w-14 shrink-0 rounded object-contain"
                        />
                      )}
                      <span>{species.commonNames[0]}</span>
                    </button>
                  ))}
                  {filteredSpecies.length === 0 && (
                    <p className="text-sm text-muted">No reviewed species matches this search and water type.</p>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dim">2 · Water</p>
          <h2 className="mt-1 font-display text-2xl">What kind of water are you on?</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <ChoiceButton active={session.water.waterType === "flowing"} onClick={() => setWaterType("flowing")}>
              <span className="block font-medium">River / stream</span>
              <span className="mt-0.5 block text-xs opacity-75">Moving water, current, runs, pools and edges</span>
            </ChoiceButton>
            <ChoiceButton active={session.water.waterType === "stillwater"} onClick={() => setWaterType("stillwater")}>
              <span className="block font-medium">Lake / reservoir</span>
              <span className="mt-0.5 block text-xs opacity-75">Stillwater, basins, shorelines and structure</span>
            </ChoiceButton>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="font-mono text-[9px] uppercase tracking-wider text-dim">State / province · optional</span>
              <input
                value={session.water.jurisdiction ?? ""}
                onChange={(event) => session.patch({ water: { ...session.water, jurisdiction: event.target.value } })}
                placeholder="Montana"
                className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] bg-subtle px-3 text-sm shadow-[var(--shadow-border)]"
              />
            </label>
            <label>
              <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Named public water · optional</span>
              <input
                value={session.water.waterName ?? ""}
                onChange={(event) => session.patch({ water: { ...session.water, waterName: event.target.value } })}
                placeholder="Clark Fork River"
                className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] bg-subtle px-3 text-sm shadow-[var(--shadow-border)]"
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-dim">
            Location is context only. It does not silently assign a population profile or a secret spot.
          </p>
        </section>

        <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dim">3 · When · optional</p>
          <h2 className="mt-1 font-display text-2xl">When are you fishing?</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {TIME_BANDS.map((band) => (
              <ChoiceButton
                key={band.id}
                active={timeBand === band.id}
                onClick={() => {
                  setTimeBand(band.id);
                  session.patch({ light: band.light });
                  setShowResult(false);
                }}
              >
                {band.label}
              </ChoiceButton>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="min-w-48">
              <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Season used in the read</span>
              <select
                value={session.season}
                onChange={(event) => {
                  session.patch({ season: event.target.value as Season });
                  setSeasonWasDerived(false);
                  setShowResult(false);
                }}
                className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] bg-subtle px-3 text-sm shadow-[var(--shadow-border)]"
              >
                {SEASONS.map((season) => (
                  <option key={season} value={season}>{labelOf(season)}</option>
                ))}
              </select>
            </label>
            <p className="max-w-xl pb-2 text-xs text-dim">
              {seasonWasDerived
                ? "Season was derived from today's date for this new reading. Change it if your trip date is different."
                : "Season is visible so it never influences the model silently."}
            </p>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dim">4 · Water temperature · optional</p>
          <h2 className="mt-1 font-display text-2xl">Know the water temperature?</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              aria-label="Water temperature Fahrenheit"
              value={session.tempF ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                session.patch({
                  tempF: value === "" ? null : Number(value),
                  tempSource: value === "" ? "unknown" : "user_measured",
                });
                setShowResult(false);
              }}
              placeholder="°F"
              className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-subtle px-3 font-mono text-sm shadow-[var(--shadow-border)]"
            />
            <Button
              variant={session.tempF == null ? "ghost" : "quiet"}
              onClick={() => {
                session.patch({ tempF: null, tempSource: "unknown" });
                setShowResult(false);
              }}
            >
              I don't know
            </Button>
            {session.tempF != null && <span className="text-sm text-muted">Using {session.tempF}°F as user-entered water temperature.</span>}
          </div>
          <p className="mt-3 text-xs text-dim">Air temperature is never substituted for water temperature.</p>
        </section>
      </div>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] bg-subtle p-4 sm:p-5">
        <Button disabled={!canRead} onClick={() => setShowResult(true)}>
          Show my Quick Read
        </Button>
        {!canRead && <p className="text-sm text-muted">Choose a reviewed species and river/stream or lake/reservoir first.</p>}
        <button type="button" onClick={openFullAnalysis} className="ml-auto min-h-11 text-sm text-muted underline">
          Open Full Analysis
        </button>
      </section>

      {showResult && input && result && (
        <section className="mt-8 space-y-4">
          {"error" in result ? (
            <div className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)]">
              <p className="font-mono text-[10px] uppercase tracking-wider text-dim">This combination needs a different declaration</p>
              <h2 className="mt-2 font-display text-3xl">{result.error}</h2>
              <p className="mt-3 text-sm text-muted">We will not invent a record. Change the water type or target.</p>
            </div>
          ) : (
            <>
              <div className="instrument-rule rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">Start here · not a bite prediction</p>
                <h2 className="mt-2 font-display text-4xl">{result.species.commonNames[0]}</h2>
                {top && <p className="mt-4 max-w-3xl font-display text-2xl">Lead presentation: {top.label}</p>}
                <p className="mt-3 max-w-3xl text-sm text-muted">{result.thermalLabel}. {result.why}</p>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <article className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Look here</p>
                  <ul className="mt-3 space-y-2">
                    {result.positioning.slice(0, 3).map((position) => (
                      <li key={position.text} className="text-sm text-fg">{position.text}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-dim">These are ecological positioning ideas, not coordinates or hotspots.</p>
                </article>

                <article className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Present it like this</p>
                  {top ? (
                    <>
                      <h3 className="mt-2 font-display text-2xl">{top.label}</h3>
                      <p className="mt-2 text-sm text-fg">{top.job}</p>
                      <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                        {top.mechanics.slice(0, 4).map((mechanic) => (
                          <li key={mechanic} className="font-mono text-xs text-muted">· {mechanic}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No presentation family is available for this reviewed record.</p>
                  )}
                </article>
              </div>

              <article className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-dim">What would sharpen or change this?</p>
                {drivers.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-sm text-fg">
                      The next high-value variable is <strong>{drivers[0].variable.toLowerCase()}</strong>. A change from {drivers[0].from} to {drivers[0].to} can move the lead family from {drivers[0].familyBefore} to {drivers[0].familyAfter}.
                    </p>
                    {drivers[0].variable === "Observed forage" && !session.forage && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => session.patch({ forage: { class: "emerging_insects", source: "user_observation" } })}
                        >
                          I see emerging insects
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => session.patch({ forage: { class: "small_forage_fish", source: "user_observation" } })}
                        >
                          I see baitfish
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    None of the usual single-variable checks changes the leading family. You can stop here or open Full Analysis for the evidence trail.
                  </p>
                )}
                {result.unknowns.length > 0 && (
                  <p className="mt-4 text-xs text-dim">Still unknown: {result.unknowns.join(", ")}.</p>
                )}
              </article>

              <div className="flex flex-wrap gap-2">
                <Button onClick={openFullAnalysis}>See Full Analysis</Button>
                <Button variant="ghost" onClick={() => setShowResult(false)}>Adjust Quick Read</Button>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
