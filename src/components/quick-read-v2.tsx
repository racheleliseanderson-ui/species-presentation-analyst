import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlternativesPanel } from "@/components/alternatives-panel";
import { Button } from "@/components/ui/button";
import { Handoffs } from "@/components/handoffs";
import { SeasonRead } from "@/components/season-read";
import { TackleRequirements } from "@/components/tackle-requirements";
import {
  assessTemperatureRange,
  coarseHoldingChoices,
  describeRangeAssessment,
  nextAdaptiveQuestion,
  type AdaptiveQuestion,
} from "@/lib/engine/adaptive-guidance";
import { interpret } from "@/lib/engine/infer";
import { normalizeTemperatureRangeF } from "@/lib/engine/temperature";
import { matchesSpecies } from "@/lib/knowledge/aliases";
import { SPECIES, SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { SpeciesThumb } from "@/components/species-thumb";
import { parseEnhancedIncomingPacket } from "@/lib/protocol/enhanced-packet";
import type { ScenarioInput } from "@/lib/protocol/types";
import {
  SEASONS,
  labelOf,
  type Light,
  type Season,
  type WaterType,
} from "@/lib/protocol/vocab";
import { STARTERS, toInput, useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

type QuickReadProps = {
  onOpenFull: () => void;
};

type TempMode = "unknown" | "exact" | "range";
type SeasonSource = "date" | "packet" | "manual" | "unknown";

type QuickContext = {
  tripDate: string;
  timeBand: string | null;
  tempMode: TempMode;
  rangeLow: string;
  rangeHigh: string;
  seasonSource: SeasonSource;
};

type TimeBand = {
  id: string;
  label: string;
  light: Light;
};

const QUICK_KEY = "hth-sp-quick-context-v2";

const TIME_BANDS: TimeBand[] = [
  { id: "dawn", label: "Dawn", light: "low_light" },
  { id: "morning", label: "Morning", light: "mixed" },
  { id: "midday", label: "Midday", light: "bright" },
  { id: "afternoon", label: "Afternoon", light: "mixed" },
  { id: "dusk", label: "Dusk", light: "low_light" },
  { id: "night", label: "Night", light: "night" },
];

function localToday(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function seasonForDate(value: string): Season {
  const date = new Date(`${value}T12:00:00`);
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

function defaultContext(): QuickContext {
  return {
    tripDate: localToday(),
    timeBand: null,
    tempMode: "unknown",
    rangeLow: "",
    rangeHigh: "",
    seasonSource: "date",
  };
}

function loadContext(): QuickContext {
  if (typeof window === "undefined") return defaultContext();
  try {
    const raw = window.localStorage.getItem(QUICK_KEY);
    if (!raw) return defaultContext();
    return { ...defaultContext(), ...(JSON.parse(raw) as Partial<QuickContext>) };
  } catch {
    return defaultContext();
  }
}

function persistContext(context: QuickContext) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUICK_KEY, JSON.stringify(context));
  } catch {
    /* local storage unavailable */
  }
}

function Choice({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-[var(--radius-sm)] px-4 py-2.5 text-left text-sm shadow-[var(--shadow-border)] transition",
        active
          ? "bg-accent text-accent-fg"
          : "bg-subtle text-fg hover:shadow-[var(--shadow-border-hover)]",
      )}
    >
      {children}
    </button>
  );
}

function contextRows(pending: Partial<ScenarioInput>) {
  const rows: Array<{ label: string; value: string }> = [];
  if (pending.speciesId) {
    rows.push({
      label: "Target",
      value: SPECIES_BY_ID[pending.speciesId]?.commonNames[0] ?? pending.speciesId,
    });
  }
  if (pending.waterType) rows.push({ label: "Water", value: labelOf(pending.waterType) });
  if (pending.water?.jurisdiction) rows.push({ label: "Area", value: pending.water.jurisdiction });
  if (pending.water?.waterName) rows.push({ label: "Named water", value: pending.water.waterName });
  const pendingRange = normalizeTemperatureRangeF(pending.tempRangeF);
  if (pending.tempF != null) {
    rows.push({ label: "Water temperature", value: `${pending.tempF}°F` });
  } else if (pendingRange) {
    rows.push({ label: "Water temperature", value: `${pendingRange[0]}–${pendingRange[1]}°F range` });
  }
  if (pending.season) rows.push({ label: "Season", value: labelOf(pending.season) });
  if (pending.light && pending.light !== "unknown") rows.push({ label: "Light", value: labelOf(pending.light) });
  if (pending.flow && pending.flow !== "unknown") rows.push({ label: "Flow", value: labelOf(pending.flow) });
  if (pending.stillState && pending.stillState !== "unknown") {
    rows.push({ label: "Stillwater state", value: labelOf(pending.stillState) });
  }
  if (pending.clarity && pending.clarity !== "unknown") rows.push({ label: "Clarity", value: labelOf(pending.clarity) });
  if (pending.forage) rows.push({ label: "Observed forage", value: labelOf(pending.forage.class) });
  return rows;
}

function timeBandForLight(light: Light | undefined): string | null {
  if (light === "night") return "night";
  if (light === "bright") return "midday";
  if (light === "low_light") return "dusk";
  if (light === "mixed") return "morning";
  return null;
}

export function QuickReadV2({ onOpenFull }: QuickReadProps) {
  const session = useSession();
  const [query, setQuery] = useState("");
  const [context, setContext] = useState<QuickContext>(() => defaultContext());
  const [pending, setPending] = useState<Partial<ScenarioInput> | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [followUpsAnswered, setFollowUpsAnswered] = useState(0);

  useEffect(() => {
    const api = useSession.getState();
    api.hydrate();
    const saved = loadContext();
    setContext(saved);

    if (saved.tripDate && saved.seasonSource === "date") {
      api.patch({ season: seasonForDate(saved.tripDate) });
    }
    if (saved.timeBand) {
      const band = TIME_BANDS.find((item) => item.id === saved.timeBand);
      if (band) api.patch({ light: band.light });
    }
    if (saved.tempMode === "range" && saved.rangeLow.trim() && saved.rangeHigh.trim()) {
      const range = normalizeTemperatureRangeF([Number(saved.rangeLow), Number(saved.rangeHigh)]);
      if (range) api.patch({ tempF: null, tempRangeF: range, tempSource: "estimated" });
    }

    if (typeof window === "undefined") return;
    const incoming = parseEnhancedIncomingPacket(window.location.hash);
    if (incoming) setPending(incoming);
  }, []);

  useEffect(() => {
    persistContext(context);
  }, [context]);

  const waterDeclared = Boolean(session.water.waterType);
  const selectedSpecies = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;

  const filteredSpecies = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return SPECIES.filter((species) => {
      if (waterDeclared && !species.habitat.waterTypes.includes(session.waterType)) return false;
      return matchesSpecies(species, q);
    }).slice(0, 18);
  }, [query, session.waterType, waterDeclared]);

  const input = showResult ? toInput(session) : null;
  const result = input ? interpret(input) : null;
  const readableResult = result && !("error" in result) ? result : null;

  const canonicalRange = input ? normalizeTemperatureRangeF(input.tempRangeF) : null;
  const rangeAssessment =
    input && canonicalRange ? assessTemperatureRange(input, canonicalRange[0], canonicalRange[1]) : null;

  const adaptiveQuestion: AdaptiveQuestion | null =
    input && readableResult && followUpsAnswered < 2
      ? nextAdaptiveQuestion(input)
      : null;

  const canRead = Boolean(session.speciesId && session.water.waterType);
  const holdingChoices = input ? coarseHoldingChoices(input) : [];

  function patchContext(partial: Partial<QuickContext>) {
    setContext((current) => ({ ...current, ...partial }));
  }

  function setWaterType(waterType: WaterType) {
    const currentSpecies = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;
    const incompatible = currentSpecies && !currentSpecies.habitat.waterTypes.includes(waterType);
    session.patch({
      speciesId: incompatible ? null : session.speciesId,
      waterType,
      water: { ...session.water, waterType },
      holdingRiver: null,
      holdingStill: null,
    });
    setShowResult(false);
  }

  function chooseTime(band: TimeBand) {
    patchContext({ timeBand: band.id });
    session.patch({ light: band.light });
    setShowResult(false);
  }

  function useTripDate(value: string) {
    if (value) {
      patchContext({ tripDate: value, seasonSource: "date" });
      session.patch({ season: seasonForDate(value) });
    } else {
      patchContext({ tripDate: "", seasonSource: "unknown" });
      session.patch({ season: "unknown" });
    }
    setShowResult(false);
  }

  function syncRange(rangeLow: string, rangeHigh: string) {
    if (!rangeLow.trim() || !rangeHigh.trim()) {
      session.patch({ tempF: null, tempRangeF: null, tempSource: "unknown" });
      return;
    }
    const range = normalizeTemperatureRangeF([Number(rangeLow), Number(rangeHigh)]);
    session.patch({
      tempF: null,
      tempRangeF: range,
      tempSource: range ? "estimated" : "unknown",
    });
  }

  function updateRange(field: "rangeLow" | "rangeHigh", value: string) {
    const nextLow = field === "rangeLow" ? value : context.rangeLow;
    const nextHigh = field === "rangeHigh" ? value : context.rangeHigh;
    patchContext({ [field]: value });
    syncRange(nextLow, nextHigh);
    setShowResult(false);
  }

  function setTempMode(mode: TempMode) {
    patchContext({ tempMode: mode });
    if (mode === "unknown") {
      session.patch({ tempF: null, tempRangeF: null, tempSource: "unknown" });
    } else if (mode === "exact") {
      session.patch({ tempRangeF: null });
    } else {
      syncRange(context.rangeLow, context.rangeHigh);
    }
    setShowResult(false);
  }

  function applyPending() {
    if (!pending) return;
    const current = useSession.getState();
    const nextSpecies = pending.speciesId ?? current.speciesId;
    const nextWaterType = pending.waterType ?? pending.water?.waterType ?? current.waterType;
    const declarationChanged = nextSpecies !== current.speciesId || nextWaterType !== current.waterType;
    const incomingRange = normalizeTemperatureRangeF(pending.tempRangeF);

    current.patch({
      speciesId: nextSpecies,
      waterType: nextWaterType,
      water: { ...current.water, ...pending.water, waterType: nextWaterType },
      populationContext:
        pending.populationContext ?? (declarationChanged ? null : current.populationContext),
      tempF: pending.tempF === undefined ? current.tempF : pending.tempF,
      tempRangeF: pending.tempRangeF === undefined ? current.tempRangeF : incomingRange,
      tempSource: pending.tempSource ?? current.tempSource,
      flow: pending.flow ?? current.flow,
      stillState: pending.stillState ?? current.stillState,
      clarity: pending.clarity ?? current.clarity,
      light: pending.light ?? current.light,
      weather: pending.weather ?? current.weather,
      season: pending.season ?? current.season,
      holdingRiver: pending.holdingRiver ?? current.holdingRiver,
      holdingStill: pending.holdingStill ?? current.holdingStill,
      forage: pending.forage ?? current.forage,
    });

    patchContext({
      timeBand: timeBandForLight(pending.light) ?? context.timeBand,
      tempMode: incomingRange ? "range" : pending.tempF != null ? "exact" : context.tempMode,
      rangeLow: incomingRange ? String(incomingRange[0]) : context.rangeLow,
      rangeHigh: incomingRange ? String(incomingRange[1]) : context.rangeHigh,
      seasonSource: pending.season ? "packet" : context.seasonSource,
      tripDate: pending.season ? "" : context.tripDate,
    });
    setPending(null);
    setShowResult(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function dismissPending() {
    setPending(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function answerFollowUp(patch: Partial<ScenarioInput>) {
    session.patch(patch);
    setFollowUpsAnswered((count) => count + 1);
  }

  function openFullAnalysis() {
    if (session.speciesId) session.patch({ step: "readout" });
    onOpenFull();
  }

  const primaryTop =
    rangeAssessment?.stable && rangeAssessment.lowTop
      ? rangeAssessment.lowTop
      : readableResult?.presentations[0] ?? null;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pt-10">
      {pending && (
        <section className="mb-6 rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
            Context arrived from another Hook tool
          </p>
          <h2 className="mt-2 font-display text-2xl">Use what we already know?</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            One confirmation carries the useful fields forward. Nothing is applied until you approve it, and geography still cannot silently choose a population profile.
          </p>
          <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {contextRows(pending).map((row) => (
              <div key={`${row.label}-${row.value}`} className="rounded-[var(--radius-sm)] bg-subtle px-3 py-3">
                <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">{row.label}</dt>
                <dd className="mt-1 text-sm text-fg">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={applyPending}>Use this context</Button>
            <Button variant="ghost" onClick={dismissPending}>Start without it</Button>
          </div>
        </section>
      )}

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
            Water → Species → Presentation
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl text-fg sm:text-5xl">
            Read the species. Then choose the presentation.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">
            Water sets the situation. Species behavior explains it. Presentation follows from that
            relationship—not from a product ranking.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">How this works</p>
          <p className="mt-2 text-sm text-fg">
            You get the reading first. The app may then ask one high-value follow-up only if changing that answer can materially change the result.
          </p>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dim">1 · Target</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h2 className="font-display text-2xl">What are you fishing for?</h2>
            {selectedSpecies && (
              <button
                type="button"
                className="text-sm text-muted underline"
                onClick={() => {
                  session.patch({ speciesId: null });
                  setShowResult(false);
                }}
              >
                Change
              </button>
            )}
          </div>

          {selectedSpecies ? (
            <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] bg-subtle p-3">
              <SpeciesThumb
                speciesId={selectedSpecies.id}
                commonName={selectedSpecies.commonNames[0]}
                className="h-16 w-24"
              />
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
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search: trout, smallmouth, walleye, pike…"
                autoComplete="off"
                className="mt-4 min-h-12 w-full rounded-[var(--radius-sm)] bg-subtle px-3 text-sm shadow-[var(--shadow-border)] placeholder:text-dim"
              />
              {query.trim() && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                      <SpeciesThumb
                        speciesId={species.id}
                        commonName={species.commonNames[0]}
                        className="h-10 w-14"
                        decorative
                      />
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
            <Choice active={session.water.waterType === "flowing"} onClick={() => setWaterType("flowing")}>
              <span className="block font-medium">River / stream</span>
              <span className="mt-0.5 block text-xs opacity-75">Moving water</span>
            </Choice>
            <Choice active={session.water.waterType === "stillwater"} onClick={() => setWaterType("stillwater")}>
              <span className="block font-medium">Lake / reservoir</span>
              <span className="mt-0.5 block text-xs opacity-75">Stillwater</span>
            </Choice>
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
            Geography helps with context and regulation checks. It never silently assigns a population profile.
          </p>
        </section>

        <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dim">3 · When · optional</p>
          <h2 className="mt-1 font-display text-2xl">When are you fishing?</h2>
          <label className="mt-4 block max-w-xs">
            <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Trip date</span>
            <input
              type="date"
              value={context.tripDate}
              onChange={(event) => useTripDate(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] bg-subtle px-3 text-sm shadow-[var(--shadow-border)]"
            />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TIME_BANDS.map((band) => (
              <Choice key={band.id} active={context.timeBand === band.id} onClick={() => chooseTime(band)}>
                {band.label}
              </Choice>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="min-w-48">
              <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Season</span>
              <select
                value={session.season}
                onChange={(event) => {
                  const season = event.target.value as Season;
                  session.patch({ season });
                  patchContext({
                    seasonSource: season === "unknown" ? "unknown" : "manual",
                    tripDate: "",
                  });
                  setShowResult(false);
                }}
                className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] bg-subtle px-3 text-sm shadow-[var(--shadow-border)]"
              >
                {SEASONS.map((season) => (
                  <option key={season} value={season}>{labelOf(season)}</option>
                ))}
              </select>
            </label>
            <p className="max-w-md pb-2 text-xs text-dim">
              {context.seasonSource === "packet"
                ? "Season was carried from an upstream Hook reading."
                : context.seasonSource === "manual"
                  ? "Season was set manually."
                  : context.seasonSource === "unknown"
                    ? "Season is left open, so it is not used to rank presentations."
                    : `Season is set from ${context.tripDate || "today’s date"}. Change it if that doesn’t match the water.`}
            </p>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dim">4 · Water temperature · optional</p>
          <h2 className="mt-1 font-display text-2xl">What do you actually know?</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Choice active={context.tempMode === "unknown"} onClick={() => setTempMode("unknown")}>
              I don't know
            </Choice>
            <Choice active={context.tempMode === "exact"} onClick={() => setTempMode("exact")}>
              I measured it
            </Choice>
            <Choice active={context.tempMode === "range"} onClick={() => setTempMode("range")}>
              I know roughly
            </Choice>
          </div>

          {context.tempMode === "exact" && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                aria-label="Measured water temperature Fahrenheit"
                value={session.tempF ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  session.patch({
                    tempF: value === "" ? null : Number(value),
                    tempRangeF: null,
                    tempSource: value === "" ? "unknown" : "user_measured",
                  });
                  setShowResult(false);
                }}
                placeholder="°F"
                className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-subtle px-3 font-mono text-sm shadow-[var(--shadow-border)]"
              />
              <span className="text-sm text-muted">Measured water temperature. Air temperature is never substituted.</span>
            </div>
          )}

          {context.tempMode === "range" && (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  aria-label="Approximate low water temperature Fahrenheit"
                  value={context.rangeLow}
                  onChange={(event) => updateRange("rangeLow", event.target.value)}
                  placeholder="Low °F"
                  className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-subtle px-3 font-mono text-sm shadow-[var(--shadow-border)]"
                />
                <span className="text-muted">to</span>
                <input
                  type="number"
                  inputMode="decimal"
                  aria-label="Approximate high water temperature Fahrenheit"
                  value={context.rangeHigh}
                  onChange={(event) => updateRange("rangeHigh", event.target.value)}
                  placeholder="High °F"
                  className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-subtle px-3 font-mono text-sm shadow-[var(--shadow-border)]"
                />
              </div>
              <p className="mt-2 text-xs text-dim">
                The range stays a range. We look at the temperatures it covers — we do not turn it into a single midpoint.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] bg-subtle p-4 sm:p-5">
        <Button
          disabled={!canRead}
          onClick={() => {
            setShowResult(true);
            setFollowUpsAnswered(0);
          }}
        >
          Show my Quick Read
        </Button>
        {!canRead && (
          <p className="text-sm text-muted">Pick a species and river/stream or lake/reservoir to start.</p>
        )}
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
                {rangeAssessment && !rangeAssessment.stable && rangeAssessment.lowTop && rangeAssessment.highTop ? (
                  <div className="mt-4 max-w-3xl">
                    <p className="font-display text-2xl">The temperature range crosses a presentation decision.</p>
                    <p className="mt-2 text-sm text-fg">
                      {rangeAssessment.lowF}°F → {rangeAssessment.lowTop.label} · {rangeAssessment.highF}°F → {rangeAssessment.highTop.label}
                    </p>
                  </div>
                ) : primaryTop ? (
                  <p className="mt-4 max-w-3xl font-display text-2xl">Lead presentation: {primaryTop.label}</p>
                ) : null}
                <p className="mt-3 max-w-3xl text-sm text-muted">{result.why}</p>
                {rangeAssessment && (
                  <p className="mt-3 max-w-3xl rounded-[var(--radius-sm)] bg-subtle px-3 py-3 text-sm text-fg">
                    {describeRangeAssessment(rangeAssessment)}
                  </p>
                )}
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <article className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Look here</p>
                  <ul className="mt-3 space-y-2">
                    {result.positioning.slice(0, 3).map((position) => (
                      <li key={position.text} className="text-sm text-fg">{position.text}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-dim">Ecological positioning, never coordinates or hotspots.</p>
                </article>

                <article className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Present it like this</p>
                  {rangeAssessment && !rangeAssessment.stable && rangeAssessment.lowTop && rangeAssessment.highTop ? (
                    <div className="mt-3 space-y-4">
                      {[rangeAssessment.lowTop, rangeAssessment.highTop].filter((item, index, all) => all.findIndex((x) => x.id === item.id) === index).map((top) => (
                        <div key={top.id}>
                          <h3 className="font-display text-xl">{top.label}</h3>
                          <p className="mt-1 text-sm text-fg">{top.job}</p>
                        </div>
                      ))}
                    </div>
                  ) : primaryTop ? (
                    <>
                      <h3 className="mt-2 font-display text-2xl">{primaryTop.label}</h3>
                      <p className="mt-2 text-sm text-fg">{primaryTop.job}</p>
                      <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                        {primaryTop.mechanics.slice(0, 4).map((mechanic) => (
                          <li key={mechanic} className="font-mono text-xs text-muted">· {mechanic}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No presentation family is available for this reviewed record.</p>
                  )}
                </article>
              </div>

              {adaptiveQuestion && (
                <article className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border-hover)] sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-mark">One thing could sharpen this</p>
                  <h3 className="mt-2 font-display text-2xl">{adaptiveQuestion.prompt}</h3>
                  <p className="mt-2 max-w-3xl text-sm text-muted">{adaptiveQuestion.reason}</p>

                  {adaptiveQuestion.id === "temperature" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="ghost" onClick={() => setTempMode("exact")}>I can measure it</Button>
                      <Button variant="ghost" onClick={() => setTempMode("range")}>I know a rough range</Button>
                      <Button variant="quiet" onClick={() => setFollowUpsAnswered((count) => count + 1)}>I don't know</Button>
                    </div>
                  )}

                  {adaptiveQuestion.id === "time" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {TIME_BANDS.map((band) => (
                        <Button
                          key={band.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            chooseTime(band);
                            setShowResult(true);
                            setFollowUpsAnswered((count) => count + 1);
                          }}
                        >
                          {band.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {adaptiveQuestion.id === "holding" && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {holdingChoices.map((choice) => (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => {
                            answerFollowUp(
                              input.waterType === "flowing"
                                ? { holdingRiver: choice.holding as ScenarioInput["holdingRiver"], holdingStill: null }
                                : { holdingRiver: null, holdingStill: choice.holding as ScenarioInput["holdingStill"] },
                            );
                          }}
                          className="rounded-[var(--radius-sm)] bg-subtle px-3 py-3 text-left shadow-[var(--shadow-border)]"
                        >
                          <span className="block text-sm font-medium text-fg">{choice.label}</span>
                          <span className="mt-1 block text-xs text-muted">{choice.detail}</span>
                        </button>
                      ))}
                      <Button variant="quiet" onClick={() => setFollowUpsAnswered((count) => count + 1)}>I'm not sure</Button>
                    </div>
                  )}

                  {adaptiveQuestion.id === "forage" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.species.forageClasses.slice(0, 5).map((forageClass) => (
                        <Button
                          key={forageClass}
                          variant="ghost"
                          size="sm"
                          onClick={() => answerFollowUp({ forage: { class: forageClass, source: "user_observation" } })}
                        >
                          {labelOf(forageClass)}
                        </Button>
                      ))}
                      <Button variant="quiet" onClick={() => setFollowUpsAnswered((count) => count + 1)}>Nothing obvious</Button>
                    </div>
                  )}

                  {adaptiveQuestion.id === "clarity" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="ghost" onClick={() => answerFollowUp({ clarity: "clear" })}>Mostly clear</Button>
                      <Button variant="ghost" onClick={() => answerFollowUp({ clarity: "stained" })}>Stained</Button>
                      <Button variant="quiet" onClick={() => setFollowUpsAnswered((count) => count + 1)}>I'm not sure</Button>
                    </div>
                  )}
                </article>
              )}

              {!adaptiveQuestion && (
                <article className="rounded-[var(--radius-lg)] bg-subtle p-5 sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Enough to start</p>
                  <p className="mt-2 text-sm text-fg">
                    No additional missing variable currently justifies another required question. You can stop here or inspect the full evidence trail.
                  </p>
                </article>
              )}

              <SeasonRead input={input} compact />

              <TackleRequirements result={readableResult ?? result} />

              <AlternativesPanel input={input} result={readableResult ?? result} />

              <Handoffs
                input={input}
                result={readableResult ?? result}
                heading="Hand this off"
                intro="Quick Read stops at the presentation. These take the next job — where to fish it, what is actually hatching, and what the rig, tackle and connection have to do. Nothing is sent until you check what travels."
              />

              <div className="flex flex-wrap gap-2">
                <Button onClick={openFullAnalysis}>See Full Analysis</Button>
                <Button variant="ghost" onClick={() => setShowResult(false)}>
                  Adjust Quick Read
                </Button>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
