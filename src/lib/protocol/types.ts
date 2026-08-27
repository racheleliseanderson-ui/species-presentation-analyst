import type {
  Clarity,
  Confidence,
  EvidenceClass,
  FlowClass,
  ForageClass,
  Light,
  RiverHolding,
  Season,
  StillHolding,
  StillState,
  TempSource,
  WaterType,
  WeatherTrend,
} from "./vocab.ts";

export type SpeciesGroup = "trout_salmon" | "bass_panfish" | "predator" | "other";

export type TargetStatus =
  | "standard"
  | "regulated_context"
  | "conservation_sensitive"
  | "non_target";

export type TargetContext = {
  jurisdictionScope?: string;
  verifyLocalRules: boolean;
  note: string;
};

export type WeightAxis =
  | "species"
  | "season"
  | "thermal"
  | "water_type"
  | "holding"
  | "forage"
  | "species_override"
  | "light";

export type PresentationWeightReason = {
  axis: WeightAxis;
  delta: number;
  note: string;
};

export type PresentationId =
  | "dead_drift"
  | "tight_line_drift"
  | "swing"
  | "suspended_drift"
  | "bottom_contact_drift"
  | "upstream_retrieve"
  | "downstream_retrieve"
  | "cross_current_retrieve"
  | "pulse_jig"
  | "surface_drift"
  | "wake_skate"
  | "stationary_bait"
  | "horizontal_retrieve"
  | "stop_and_go"
  | "suspend_pause"
  | "vertical_jig"
  | "bottom_contact"
  | "slow_drag"
  | "drop_presentation"
  | "surface_retrieve"
  | "subsurface_slow_roll"
  | "suspended_stationary"
  | "trolling"
  | "live_natural_bait_suspension";

export type SpeciesRecord = {
  id: string;
  scientificName: string;
  commonNames: string[];
  group: SpeciesGroup;
  targetStatus?: TargetStatus;
  targetStatusNote?: string;
  targetContext?: TargetContext;
  nativeContext: string;
  thermal: {
    preferredF: [number, number];
    activeF: [number, number];
    coldEdgeF: number;
    warmEdgeF: number;
  };
  spawning: { seasons: Season[]; note: string };
  habitat: {
    waterTypes: WaterType[];
    riverHolding: RiverHolding[];
    stillHolding: StillHolding[];
    currentPreference: string;
    depthTendency: string;
    lightResponse: string;
  };
  forageClasses: ForageClass[];
  flowingPresentations: PresentationId[];
  stillPresentations: PresentationId[];
  exceptions: string[];
  geographic: string;
  sources: { label: string; class: "agency" | "peer_reviewed" | "synthesis" }[];
  reviewedAt: string;
  nextReviewAt: string;
};

export type ForagePacket = {
  class: ForageClass;
  hypothesis?: string;
  confidence?: number;
  observed?: string[];
  source: "user_observation" | "hatch_match";
};

export type WaterPacket = {
  waterId?: string;
  waterName?: string;
  waterType?: WaterType;
  jurisdiction?: string;
  documentedSpecies?: string[];
  accessContext?: string;
};

export type ScenarioInput = {
  speciesId: string;
  water: WaterPacket;
  waterType: WaterType;
  tempF: number | null;
  tempSource: TempSource;
  tempObservedAt?: string | null;
  flow?: FlowClass;
  stillState?: StillState;
  clarity: Clarity;
  light: Light;
  weather: WeatherTrend;
  season: Season;
  holdingRiver?: RiverHolding | null;
  holdingStill?: StillHolding | null;
  forage?: ForagePacket | null;
};

export type ThermalState =
  | "preferred"
  | "active"
  | "cold_refuge"
  | "warm_stress"
  | "unknown";

export type RankedPresentation = {
  id: PresentationId;
  label: string;
  fit: Confidence;
  weight: number;
  weightReasons: PresentationWeightReason[];
  job: string;
  mechanics: string[];
  system: Record<string, string>;
};

export type Interpretation = {
  species: SpeciesRecord;
  thermalState: ThermalState;
  thermalLabel: string;
  positioning: { text: string; confidence: Confidence }[];
  why: string;
  invalidators: string[];
  forageClasses: ForageClass[];
  forageCertainty: Confidence;
  forageNote: string;
  presentations: RankedPresentation[];
  weightingModel: {
    version: string;
    speciesOverrideVersion?: string;
    appliedSpeciesOverrideIds?: string[];
    coreAxes: WeightAxis[];
    note: string;
  };
  equipment: Record<string, string>;
  connection: {
    job: string;
    priorities: string[];
  };
  rigQuestion: string | null;
  trace: string[];
  confidence: {
    evidence: Confidence;
    environment: Confidence;
    forage: Confidence;
    presentation: Confidence;
  };
  unknowns: string[];
};

export type HthPacket = {
  packetVersion: "HTH-1.0";
  origin: "species-presentation";
  createdAt: string;
  instrumentId: string;
  water: WaterPacket;
  species: {
    id: string;
    scientificName: string;
    commonNames: string[];
    targetStatus?: TargetStatus;
    targetContext?: TargetContext;
  };
  conditions: {
    waterType: WaterType;
    tempF: number | null;
    tempSource: TempSource;
    flow?: FlowClass;
    stillState?: StillState;
    clarity: Clarity;
    light: Light;
    weather: WeatherTrend;
    season: Season;
    holding?: string;
  };
  observations: {
    forage?: ForagePacket | null;
  };
  hypotheses: {
    thermalState: ThermalState;
    positioning: string[];
    why: string;
    invalidators: string[];
  };
  presentationRequirements: {
    families: PresentationId[];
    mechanics: string[];
    weightingModel?: string;
    speciesOverrideModel?: string;
    appliedSpeciesOverrides?: string[];
    weightedFamilies?: { id: PresentationId; weight: number }[];
  };
  equipmentRequirements: Record<string, string>;
  connectionRequirements: {
    job: string;
    priorities: string[];
  };
  deviceQuestions: string[];
  unknowns: string[];
  provenance: { source: string; evidenceClass: EvidenceClass; reviewedAt: string }[];
  privacy: {
    containsCoordinates: false;
    containsPrivateWater: false;
  };
};
