import { create } from "zustand";
import type {
  ForagePacket,
  PopulationContextInput,
  ScenarioInput,
  TemperatureRangeF,
  WaterPacket,
} from "@/lib/protocol/types";
import type {
  Clarity,
  FlowClass,
  Light,
  RiverHolding,
  Season,
  StillHolding,
  StillState,
  TempSource,
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
  flow: FlowClass;
  stillState: StillState;
  clarity: Clarity;
  light: Light;
  weather: WeatherTrend;
  season: Season;
  holdingRiver: RiverHolding | null;
  holdingStill: StillHolding | null;
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
  flow: "unknown",
  stillState: "unknown",
  clarity: "unknown",
  light: "unknown",
  weather: "unknown",
  season: "unknown",
  holdingRiver: null,
  holdingStill: null,
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
    flow: session.flow,
    stillState: session.stillState,
    clarity: session.clarity,
    light: session.light,
    weather: session.weather,
    season: session.season,
    holdingRiver: session.holdingRiver,
    holdingStill: session.holdingStill,
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
    flow: session.flow,
    stillState: session.stillState,
    clarity: session.clarity,
    light: session.light,
    weather: session.weather,
    season: session.season,
    holdingRiver: session.holdingRiver,
    holdingStill: session.holdingStill,
    forage: session.forage,
  };
}

function load(): Session {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Partial<Session>) };
  } catch {
    return defaults;
  }
}

function persist(session: Session) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(pick(session)));
  } catch {
    /* device storage unavailable */
  }
}

export function loadScenarios(): NamedScenario[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SCENARIO_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NamedScenario[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_SAVED) : [];
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
    window.localStorage.setItem(SCENARIO_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
  return all;
}

export function deleteScenario(id: string): NamedScenario[] {
  const all = loadScenarios().filter((s) => s.id !== id);
  try {
    window.localStorage.setItem(SCENARIO_KEY, JSON.stringify(all));
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
