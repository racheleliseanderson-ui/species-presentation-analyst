import type {
  Clarity,
  Confidence,
  EvidenceClass,
  FlowClass,
  ForageClass,
  Light,
  MarineHolding,
  MarineType,
  RiverHolding,
  Season,
  StillHolding,
  StillState,
  TempSource,
  TideMovement,
  TideStrength,
  WaterType,
  WeatherTrend,
} from "./vocab.ts";

export type SpeciesGroup =
  | "trout_salmon"
  | "bass_panfish"
  | "predator"
  | "other"
  // Saltwater. Grouped by the kind of fishing rather than by taxonomy, because
  // an angler picking a species is standing somewhere specific: on a beach, over
  // structure, or offshore. Sharks are separated out because misidentifying one
  // has legal consequences the other groups do not carry.
  | "inshore_surf"
  | "reef_bottom"
  | "offshore_pelagic"
  | "sharks";

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

export type PopulationContextSource = "user_declared" | "field_sense";

export type PopulationContextInput = {
  profileId: string;
  source: PopulationContextSource;
};

export type ResolvedPopulationContext = {
  profileId: string;
  label: string;
  regionClass: string;
  systemArchetype: string;
  lifeHistory: string;
  populationOrigin: string;
  source: PopulationContextSource;
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
  | "population_context"
  | "tide"
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
  | "live_natural_bait_suspension"
  // Saltwater families.
  | "surf_bait_soak"
  | "surf_metal_cast"
  | "surf_swim_retrieve"
  | "flats_sight_cast"
  | "tidal_drift_bait"
  | "structure_pitch"
  | "dock_light_ambush"
  | "structure_vertical"
  | "chum_established_drift"
  | "tide_line_drift"
  | "trolling_spread"
  | "deep_drop"
  | "run_and_gun_cast"
  | "live_bait_slow_troll";

/**
 * Whether a temperature figure describes what the fish prefers or merely where
 * it happens to be caught. Anglers read the two very differently and sources
 * conflate them constantly, so the record says which it has.
 */
export type ThermalBasis = "preference" | "distribution" | "mixed";

export type ThermalBand = {
  /** A sourced preference or optimum range. */
  preferredF?: [number, number];
  /** The range over which the species is reported active and feeding. */
  activeF?: [number, number];
  /** Where it goes inactive, avoids, or suffers cold stress. */
  coldEdgeF?: number;
  /** The same at the top end. */
  warmEdgeF?: number;
  basis?: ThermalBasis;
  /** Where the numbers came from, and any caveat worth showing a reader. */
  note?: string;
};

export type SpeciesRecord = {
  id: string;
  scientificName: string;
  commonNames: string[];
  group: SpeciesGroup;
  targetStatus?: TargetStatus;
  targetStatusNote?: string;
  targetContext?: TargetContext;
  nativeContext: string;
  /**
   * The reviewed temperature band, or absent when nobody has published one.
   *
   * Every field is optional and many marine species carry only one or two of
   * them. That is deliberate: freshwater sport fish have decades of hatchery
   * and lab work behind their preferenda, while for a scamp or a silvergray
   * rockfish the honest answer is that no agency publishes a number. The
   * reading degrades to "thermal band not reviewed" rather than inventing one,
   * because a fabricated preferendum is exactly the failure this product
   * exists to avoid.
   */
  thermal?: ThermalBand;
  /**
   * Conservation context only — never timing or a place to go. Optional
   * because a few reef species have no spawning account that can be written
   * down without describing an aggregation, and silence is the correct
   * outcome there.
   */
  spawning?: { seasons: Season[]; note: string };
  habitat: {
    waterTypes: WaterType[];
    riverHolding: RiverHolding[];
    stillHolding: StillHolding[];
    /**
     * Holding classes per marine water type. Kept as a map rather than a flat
     * list because the four saltwater types do not share a vocabulary — an
     * offshore temperature break is not an answer to a surf question.
     */
    marineHolding?: Partial<Record<MarineType, MarineHolding[]>>;
    /**
     * How the fish uses moving water; tide for the marine types. Optional
     * because it is prose from a source, and a handful of offshore species
     * have none that a review would accept.
     */
    currentPreference?: string;
    depthTendency: string;
    /** Diel and light behaviour, where a source describes it. */
    lightResponse?: string;
  };
  forageClasses: ForageClass[];
  flowingPresentations: PresentationId[];
  stillPresentations: PresentationId[];
  marinePresentations?: Partial<Record<MarineType, PresentationId[]>>;
  exceptions: string[];
  geographic: string;
  /**
   * Where each claim came from. `url` is optional because the freshwater
   * records predate it, but a record that carries one is checkable by the
   * reader, which is the point of insisting on sources in the first place.
   */
  sources: {
    label: string;
    class: "agency" | "peer_reviewed" | "synthesis";
    url?: string;
  }[];
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
  /** The sender's finer class for the same water, kept beside the fleet type
   *  because "tailwater" and "flowing" are not the same sentence. */
  waterClass?: string;
  region?: string;
  state?: string;
  jurisdiction?: string;
  documentedSpecies?: string[];
  /** The one species the reader picked upstream. The fleet's own key for it —
   *  this app used to look under `species.id`, which nothing else wrote. */
  selectedSpecies?: string;
  accessContext?: string;
  managingAgency?: string;
  officialSourceUrl?: string;
};

/** A published station behind a carried water temperature. */
export type TempStation = {
  id: string;
  name?: string;
  agency?: string;
};

/** One thing the water read called out upstream. Titles, not measurements. */
export type ReadingCue = {
  family: string;
  title: string;
};

export type TemperatureRangeF = [number, number];

export type ScenarioInput = {
  speciesId: string;
  water: WaterPacket;
  waterType: WaterType;
  populationContext?: PopulationContextInput | null;
  tempF: number | null;
  tempRangeF?: TemperatureRangeF | null;
  tempSource: TempSource;
  tempObservedAt?: string | null;
  /** True when the sender carried a reading that had already gone past its own
   *  freshness window. Carried, and labelled as carried. */
  tempRetained?: boolean | null;
  tempStation?: TempStation | null;
  /** What the water read upstream called out. Context for the reader; the
   *  weighting engine does not touch it. */
  cues?: ReadingCue[];
  flow?: FlowClass;
  stillState?: StillState;
  /** Saltwater's equivalent of flow and stillwater state. */
  tideMovement?: TideMovement;
  tideStrength?: TideStrength;
  clarity: Clarity;
  light: Light;
  weather: WeatherTrend;
  season: Season;
  holdingRiver?: RiverHolding | null;
  holdingStill?: StillHolding | null;
  /**
   * One field for all four marine types: only one water type is declared at a
   * time, and each carries its own class list, so a per-type field would only
   * ever hold one value between them.
   */
  holdingMarine?: MarineHolding | null;
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
  populationContext?: ResolvedPopulationContext;
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
    regionalPopulationVersion?: string;
    appliedPopulationProfileId?: string;
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
  populationContext?: ResolvedPopulationContext;
  conditions: {
    waterType: WaterType;
    tempF: number | null;
    tempRangeF?: TemperatureRangeF | null;
    tempSource: TempSource;
    flow?: FlowClass;
    stillState?: StillState;
    /**
     * Saltwater movement. Optional so that a Hook app which only knows flowing
     * and stillwater can still read this packet — it sees a water type it does
     * not recognise and falls back, rather than choking on a required field.
     */
    tideMovement?: TideMovement;
    tideStrength?: TideStrength;
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
    regionalPopulationModel?: string;
    appliedPopulationProfileId?: string;
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
    /* Re-asserted false by the shared module on every read and every write,
     * because the coordinate strip has actually run by then. */
    containsCoordinates: false;
    /* NOT false. A private-water warning is OR-ed forward and can never be
     * lowered by a re-emit, so an incoming true arrives here still true. */
    containsPrivateWater: boolean;
  };
};
