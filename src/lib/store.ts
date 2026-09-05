import { create } from "zustand";
import { migrate, readEnvelope, sanitizeSession, writeEnvelope } from "@/lib/session-schema";
import type {
  ForagePacket,
  PopulationContextInput,
  ReadingCue,
  ScenarioInput,
  TempStation,
  TemperatureRangeF,
  WaterPacket,
} from "@/lib/protocol/types";
import type {
  Clarity,
  FlowClass,
  Light,
  MarineHolding,
  RiverHolding,
  Season,
  StillHolding,
  StillState,
  TempSource,
  TideMovement,
  TideStrength,
  WaterType,
  WeatherTrend,
} from "@/lib/protocol/vocab";

const KEY = "hth-sp-session-v1";
const SCENARIO_KEY = "hth-sp-scenarios-v1";
const MAX_SAVED = 12;

export type Step = "target" | "water" | "conditions" | "holding" | "readout";

export type Session = {
  step: Step;
  speciesId: string | null;
  water: WaterPacket;
  waterType: WaterType;
  populationContext: PopulationContextInput | null;
  tempF: number | null;
  tempRangeF: TemperatureRangeF | null;
  tempSource: TempSource;
  /* Where a carried temperature came from, kept beside the number. A reading
   * with no observation time is a number somebody typed, and nothing
   * downstream can tell the difference unless these travel with it. */
  tempObservedAt: string | null;
  tempRetained: boolean | null;
  tempStation: TempStation | null;
  /** What the water read upstream called out. Shown, never weighted. */
  cues: ReadingCue[];
  flow: FlowClass;
  stillState: StillState;
  clarity: Clarity;
  light: Light;
  weather: WeatherTrend;
  season: Season;
  holdingRiver: RiverHolding | null;
  holdingStill: StillHolding | null;
  holdingMarine: MarineHolding | null;
  tideMovement: TideMovement;
  tideStrength: TideStrength;
  forage: ForagePacket | null;
};

export type NamedScenario = {
  id: string;
  name: string;
  savedAt: string;
  session: Session;
};

const defaults: Session = {
  step: "target",
  speciesId: null,
  water: {},
  waterType: "flowing",
  populationContext: null,
  tempF: null,
  tempRangeF: null,
  tempSource: "unknown",
  tempObservedAt: null,
  tempRetained: null,
  tempStation: null,
  cues: [],
  flow: "unknown",
  stillState: "unknown",
  clarity: "unknown",
  light: "unknown",
  weather: "unknown",
  season: "unknown",
  holdingRiver: null,
  holdingStill: null,
  holdingMarine: null,
  tideMovement: "unknown",
  tideStrength: "unknown",
  forage: null,
};

export function toInput(session: Session): ScenarioInput | null {
  if (!session.speciesId) return null;
  return {
    speciesId: session.speciesId,
    water: session.water,
    waterType: session.waterType,
    populationContext: session.populationContext,
    tempF: session.tempF,
    tempRangeF: session.tempRangeF,
    tempSource: session.tempSource,
    tempObservedAt: session.tempObservedAt,
    tempRetained: session.tempRetained,
    tempStation: session.tempStation,
    cues: session.cues,
    flow: session.flow,
    stillState: session.stillState,
    clarity: session.clarity,
    light: session.light,
    weather: session.weather,
    season: session.season,
    holdingRiver: session.holdingRiver,
    holdingStill: session.holdingStill,
    holdingMarine: session.holdingMarine,
    tideMovement: session.tideMovement,
    tideStrength: session.tideStrength,
    forage: session.forage,
  };
}

function pick(session: Session): Session {
  return {
    step: session.step,
    speciesId: session.speciesId,
    water: session.water,
    waterType: session.waterType,
    populationContext: session.populationContext,
    tempF: session.tempF,
    tempRangeF: session.tempRangeF,
    tempSource: session.tempSource,
    tempObservedAt: session.tempObservedAt,
    tempRetained: session.tempRetained,
    tempStation: session.tempStation,
    cues: session.cues,
    flow: session.flow,
    stillState: session.stillState,
    clarity: session.clarity,
    light: session.light,
    weather: session.weather,
    season: session.season,
    holdingRiver: session.holdingRiver,
    holdingStill: session.holdingStill,
    holdingMarine: session.holdingMarine,
    tideMovement: session.tideMovement,
    tideStrength: session.tideStrength,
    forage: session.forage,
  };
}

/**
 * What a restore had to drop, so the reading can say so rather than come back
 * quietly thinner. Read once on hydrate; never persisted.
 */
export type RestoreNotice = { dropped: string[]; migrated: boolean };

let lastRestore: RestoreNotice = { dropped: [], migrated: false };

/** What the most recent hydrate had to discard. */
export function lastRestoreNotice(): RestoreNotice {
  return lastRestore;
}

function load(): Session {
  lastRestore = { dropped: [], migrated: false };
  if (typeof window === "undefined") return defaults;
  try {
    const stored = readEnvelope<Partial<Session>>(window.localStorage.getItem(KEY));
    if (!stored) return defaults;
    const stepped = migrate(stored.data, stored.version);
    /* A payload from a schema this build has never seen. Start clean rather
     * than read a shape nothing here understands. */
    if (!stepped) return defaults;
    const merged = { ...defaults, ...(stepped.data as Partial<Session>) };
    const { session, dropped } = sanitizeSession(merged as unknown as Record<string, unknown>);
    lastRestore = { dropped, migrated: stepped.migrated };
    return session as unknown as Session;
  } catch {
    return defaults;
  }
}

function persist(session: Session) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, writeEnvelope(pick(session)));
  } catch {
    /* device storage unavailable */
  }
}

/**
 * The saved readings, each one run forward and checked on the way out.
 *
 * A named scenario is the longest-lived thing this application stores — it is
 * meant to be reopened next season — so it is the payload most likely to
 * contain a word the current build has stopped using. Each one is sanitized
 * individually: one scenario carrying a retired holding class must not cost
 * somebody the other eleven.
 */
export function loadScenarios(): NamedScenario[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = readEnvelope<NamedScenario[]>(window.localStorage.getItem(SCENARIO_KEY));
    if (!stored) return [];
    const stepped = migrate(stored.data, stored.version);
    if (!stepped) return [];
    const list = stepped.data as NamedScenario[];
    if (!Array.isArray(list)) return [];
    return list.slice(0, MAX_SAVED).map((scenario) => ({
      ...scenario,
      session: sanitizeSession({
        ...defaults,
        ...scenario.session,
      } as unknown as Record<string, unknown>).session as unknown as Session,
    }));
  } catch {
    return [];
  }
}

export function saveScenario(name: string, session: Session): NamedScenario[] {
  const next: NamedScenario = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim() || "Untitled reading",
    savedAt: new Date().toISOString(),
    session: pick({ ...session, step: "readout" }),
  };
  const all = [next, ...loadScenarios()].slice(0, MAX_SAVED);
  try {
    window.localStorage.setItem(SCENARIO_KEY, writeEnvelope(all));
  } catch {
    /* ignore */
  }
  return all;
}

export function deleteScenario(id: string): NamedScenario[] {
  const all = loadScenarios().filter((s) => s.id !== id);
  try {
    window.localStorage.setItem(SCENARIO_KEY, writeEnvelope(all));
  } catch {
    /* ignore */
  }
  return all;
}

type Store = Session & {
  hydrated: boolean;
  hydrate: () => void;
  patch: (partial: Partial<Session>) => void;
  reset: () => void;
  setStep: (step: Step) => void;
};

export const useSession = create<Store>((set, get) => ({
  ...defaults,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ ...load(), hydrated: true });
  },
  patch: (partial) => {
    const current = get();
    const speciesChanged =
      partial.speciesId !== undefined && partial.speciesId !== current.speciesId;
    const waterTypeChanged =
      partial.waterType !== undefined && partial.waterType !== current.waterType;
    let normalized: Partial<Session> =
      (speciesChanged || waterTypeChanged) && partial.populationContext === undefined
        ? { ...partial, populationContext: null }
        : { ...partial };

    // Exact and ranged temperature evidence are mutually exclusive. An explicit exact
    // value wins if a caller accidentally supplies both in one patch.
    if (partial.tempF != null && Number.isFinite(partial.tempF)) {
      normalized = { ...normalized, tempRangeF: null };
    } else if (partial.tempRangeF != null) {
      normalized = { ...normalized, tempF: null };
    }

    const next = { ...current, ...normalized };
    persist(next);
    set(next);
  },
  reset: () => {
    persist(defaults);
    set({ ...defaults, hydrated: true });
  },
  setStep: (step) => {
    const next = { ...get(), step };
    persist(next);
    set(next);
  },
}));

export const STARTERS: { id: string; label: string; patch: Partial<Session> }[] = [
  {
    id: "bnt-seam",
    label: "Brown trout · seam · 54°F measured",
    patch: {
      speciesId: "salmo_trutta",
      waterType: "flowing",
      water: { waterName: "Named public river corridor", waterType: "flowing" },
      populationContext: null,
      tempF: 54,
      tempSource: "user_measured",
      flow: "moderate",
      clarity: "clear",
      light: "low_light",
      weather: "stable",
      season: "spring",
      holdingRiver: "seam",
      holdingStill: null,
      forage: null,
      step: "readout",
    },
  },
  {
    id: "smb-break",
    label: "Smallmouth · current break · 62°F",
    patch: {
      speciesId: "micropterus_dolomieu",
      waterType: "flowing",
      water: { waterName: "Named public river corridor", waterType: "flowing" },
      populationContext: { profileId: "smallmouth-cool-river", source: "user_declared" },
      tempF: 62,
      tempSource: "user_measured",
      flow: "moderate",
      clarity: "clear",
      light: "mixed",
      weather: "stable",
      season: "early_summer",
      holdingRiver: "current_break",
      holdingStill: null,
      forage: null,
      step: "readout",
    },
  },
  {
    id: "lmb-weed",
    label: "Largemouth · weed edge · 74°F",
    patch: {
      speciesId: "micropterus_nigricans",
      waterType: "stillwater",
      water: { waterName: "Named public reservoir", waterType: "stillwater" },
      populationContext: null,
      tempF: 74,
      tempSource: "user_measured",
      stillState: "stable",
      clarity: "lightly_stained",
      light: "low_light",
      weather: "stable",
      season: "summer",
      holdingRiver: null,
      holdingStill: "weed_edge",
      forage: null,
      step: "readout",
    },
  },
];
