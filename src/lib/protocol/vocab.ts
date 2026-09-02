export const INSTRUMENT_ID = "HTH-SP-001";
export const INSTRUMENT_NAME = "Species & Presentation Analyst";
export const APP_VERSION = "0.8.1";
export const PACKET_VERSION = "HTH-1.0";
export const SCHEMA_VERSION = "0.8.0";
export const REVIEWED_AT = "2026-08-27";
export const NEXT_REVIEW = "2026-11-27";

/**
 * Water types.
 *
 * The four saltwater types are deliberately separate rather than one `marine`
 * value: a surf trough, an oyster bar, a wreck and an offshore temperature
 * break are four different vocabularies, and merging them would give a surf
 * angler a holding-class list mostly about water they cannot reach.
 */
export const FRESHWATER_TYPES = ["flowing", "stillwater"] as const;
export const MARINE_TYPES = ["surf", "inshore", "nearshore", "offshore"] as const;
export const WATER_TYPES = [...FRESHWATER_TYPES, ...MARINE_TYPES] as const;

export type FreshwaterType = (typeof FRESHWATER_TYPES)[number];
export type MarineType = (typeof MARINE_TYPES)[number];
export type WaterType = (typeof WATER_TYPES)[number];

/**
 * Where a presentation family may be offered. `both` is the two freshwater
 * types (its existing meaning, unchanged); `saltwater` is all four marine
 * types, so a family that genuinely works everywhere at sea is not listed four
 * times.
 */
export type PresentationSlot = WaterType | "both" | "saltwater";

export function isMarine(waterType: WaterType): waterType is MarineType {
  return (MARINE_TYPES as readonly string[]).includes(waterType);
}

/**
 * Tide, the saltwater equivalent of river flow and stillwater state.
 *
 * It is a separate axis rather than a renamed one because it is the variable a
 * marine reading turns on: what the water is doing decides where fish feed and
 * therefore which presentation can reach them. Movement and strength are asked
 * separately because a hard-running neap and a lazy spring are different
 * situations that a single "tide" field would blur.
 */
export const TIDE_MOVEMENTS = [
  "flooding",
  "ebbing",
  "slack_high",
  "slack_low",
  "unknown",
] as const;
export type TideMovement = (typeof TIDE_MOVEMENTS)[number];

// Suffixed because a bare `spring` would collide with the season of the same
// name in LABELS, and the season would lose.
export const TIDE_STRENGTHS = ["spring_tide", "average_tide", "neap_tide", "unknown"] as const;
export type TideStrength = (typeof TIDE_STRENGTHS)[number];

export const TEMP_SOURCES = ["user_measured", "official_station", "estimated", "unknown"] as const;
export type TempSource = (typeof TEMP_SOURCES)[number];

export const FLOW_CLASSES = ["very_low", "low", "moderate", "elevated", "high", "unknown"] as const;
export type FlowClass = (typeof FLOW_CLASSES)[number];

export const STILL_STATES = [
  "stable",
  "falling",
  "rising",
  "turnover_suspected",
  "stratified",
  "unknown",
] as const;
export type StillState = (typeof STILL_STATES)[number];

export const CLARITY = [
  "very_clear",
  "clear",
  "lightly_stained",
  "stained",
  "turbid",
  "unknown",
] as const;
export type Clarity = (typeof CLARITY)[number];

export const LIGHT = ["low_light", "mixed", "bright", "night", "unknown"] as const;
export type Light = (typeof LIGHT)[number];

export const WEATHER_TRENDS = [
  "stable",
  "warming",
  "cooling",
  "frontal_change",
  "post_front",
  "unknown",
] as const;
export type WeatherTrend = (typeof WEATHER_TRENDS)[number];

export const SEASONS = [
  "winter",
  "early_spring",
  "spring",
  "early_summer",
  "summer",
  "late_summer",
  "fall",
  "late_fall",
  "unknown",
] as const;
export type Season = (typeof SEASONS)[number];

export const RIVER_HOLDING = [
  "riffle",
  "riffle_to_run",
  "run",
  "pool_head",
  "pool_tail",
  "deep_pool",
  "seam",
  "current_break",
  "eddy",
  "undercut_bank",
  "submerged_wood",
  "boulder_pocket",
  "side_channel",
  "tributary_mouth",
  "tailwater",
  "shallow_flat",
] as const;
export type RiverHolding = (typeof RIVER_HOLDING)[number];

export const STILL_HOLDING = [
  "shallow_flat",
  "weed_edge",
  "inside_weedline",
  "outside_weedline",
  "point",
  "secondary_point",
  "drop_off",
  "breakline",
  "submerged_hump",
  "rocky_shoreline",
  "riprap",
  "wood",
  "dock_shade",
  "basin",
  "suspended_open",
  "inlet",
  "outlet",
  "thermocline_edge",
] as const;
export type StillHolding = (typeof STILL_HOLDING)[number];

/** Beach and breaking water. Structure here is sand, and it moves. */
export const SURF_HOLDING = [
  "surf_trough",
  "inner_sandbar",
  "outer_sandbar",
  "rip_channel",
  "beach_cut",
  "surf_point",
  "jetty_wash",
  "shell_bank",
] as const;
export type SurfHolding = (typeof SURF_HOLDING)[number];

/** Estuary, bay, flat and marsh — the water tide moves most visibly. */
export const INSHORE_HOLDING = [
  "grass_flat",
  "sand_hole",
  "oyster_bar",
  "marsh_edge",
  "mangrove_edge",
  "tidal_creek",
  "creek_mouth",
  "channel_edge",
  "bridge_piling",
  "dock_light",
] as const;
export type InshoreHolding = (typeof INSHORE_HOLDING)[number];

/** Hard structure within sight of the beach. */
export const NEARSHORE_HOLDING = [
  "nearshore_reef",
  "artificial_reef",
  "wreck",
  "rock_pile",
  "kelp_edge",
  "pier_structure",
  "inlet_mouth",
  "nearshore_hump",
] as const;
export type NearshoreHolding = (typeof NEARSHORE_HOLDING)[number];

/** Open water, where the structure is made of water rather than bottom. */
export const OFFSHORE_HOLDING = [
  "temperature_break",
  "weed_line",
  "current_rip",
  "offshore_ledge",
  "deep_wreck",
  "seamount",
  "canyon_edge",
  "open_bait_school",
] as const;
export type OffshoreHolding = (typeof OFFSHORE_HOLDING)[number];

export type MarineHolding =
  | SurfHolding
  | InshoreHolding
  | NearshoreHolding
  | OffshoreHolding;

/** Every holding class, whatever the water. */
export type AnyHolding = RiverHolding | StillHolding | MarineHolding;

export const HOLDING_BY_WATER_TYPE = {
  flowing: RIVER_HOLDING,
  stillwater: STILL_HOLDING,
  surf: SURF_HOLDING,
  inshore: INSHORE_HOLDING,
  nearshore: NEARSHORE_HOLDING,
  offshore: OFFSHORE_HOLDING,
} as const satisfies Record<WaterType, readonly string[]>;

export const FORAGE_CLASSES = [
  "aquatic_insects",
  "emerging_insects",
  "terrestrial_insects",
  "crustaceans",
  "small_forage_fish",
  "larger_prey_fish",
  "mollusks",
  "worms_annelids",
  "eggs",
  "amphibians",
  "zooplankton",
] as const;
export type ForageClass = (typeof FORAGE_CLASSES)[number];

export const CONFIDENCE = ["high", "moderate", "low"] as const;
export type Confidence = (typeof CONFIDENCE)[number];

export const EVIDENCE_CLASS = [
  "probed",
  "declared",
  "device",
  "user_measured",
  "official_station",
  "unknown",
] as const;
export type EvidenceClass = (typeof EVIDENCE_CLASS)[number];

export const LABELS: Record<string, string> = {
  flowing: "Flowing water",
  stillwater: "Stillwater",
  surf: "Surf",
  inshore: "Inshore",
  nearshore: "Nearshore",
  offshore: "Offshore",
  flooding: "Flooding",
  ebbing: "Ebbing",
  slack_high: "Slack high",
  slack_low: "Slack low",
  spring_tide: "Spring tide",
  neap_tide: "Neap tide",
  average_tide: "Average tide",
  surf_trough: "Surf trough",
  inner_sandbar: "Inner sandbar",
  outer_sandbar: "Outer sandbar",
  rip_channel: "Rip channel",
  beach_cut: "Beach cut",
  surf_point: "Surf point",
  jetty_wash: "Jetty wash",
  shell_bank: "Shell bank",
  grass_flat: "Grass flat",
  sand_hole: "Sand hole",
  oyster_bar: "Oyster bar",
  marsh_edge: "Marsh edge",
  mangrove_edge: "Mangrove edge",
  tidal_creek: "Tidal creek",
  creek_mouth: "Creek mouth",
  channel_edge: "Channel edge",
  bridge_piling: "Bridge piling",
  dock_light: "Dock light",
  nearshore_reef: "Nearshore reef",
  artificial_reef: "Artificial reef",
  wreck: "Wreck",
  rock_pile: "Rock pile",
  kelp_edge: "Kelp edge",
  pier_structure: "Pier structure",
  inlet_mouth: "Inlet mouth",
  nearshore_hump: "Nearshore hump",
  temperature_break: "Temperature break",
  weed_line: "Weed line",
  current_rip: "Current rip",
  offshore_ledge: "Offshore ledge",
  deep_wreck: "Deep wreck",
  seamount: "Seamount",
  canyon_edge: "Canyon edge",
  open_bait_school: "Open-water bait school",
  user_measured: "User measured",
  official_station: "Official station",
  estimated: "Estimated",
  unknown: "Unknown",
  very_low: "Very low",
  low: "Low",
  moderate: "Moderate",
  elevated: "Elevated",
  high: "High",
  stable: "Stable",
  falling: "Falling",
  rising: "Rising",
  turnover_suspected: "Turnover suspected",
  stratified: "Stratified / thermocline known",
  very_clear: "Very clear",
  clear: "Clear",
  lightly_stained: "Lightly stained",
  stained: "Stained",
  turbid: "Turbid",
  low_light: "Low light",
  mixed: "Mixed",
  bright: "Bright",
  night: "Night",
  warming: "Warming",
  cooling: "Cooling",
  frontal_change: "Frontal change",
  post_front: "Post-front",
  winter: "Winter",
  early_spring: "Early spring",
  spring: "Spring",
  early_summer: "Early summer",
  summer: "Summer",
  late_summer: "Late summer",
  fall: "Fall",
  late_fall: "Late fall",
  riffle: "Riffle",
  riffle_to_run: "Riffle-to-run transition",
  run: "Run",
  pool_head: "Pool head",
  pool_tail: "Pool tail",
  deep_pool: "Deep pool",
  seam: "Seam",
  current_break: "Current break",
  eddy: "Eddy",
  undercut_bank: "Undercut bank",
  submerged_wood: "Submerged wood",
  boulder_pocket: "Boulder pocket",
  side_channel: "Side channel",
  tributary_mouth: "Tributary mouth",
  tailwater: "Tailwater",
  shallow_flat: "Shallow flat",
  weed_edge: "Weed edge",
  inside_weedline: "Inside weedline",
  outside_weedline: "Outside weedline",
  point: "Point",
  secondary_point: "Secondary point",
  drop_off: "Drop-off",
  breakline: "Breakline",
  submerged_hump: "Submerged hump",
  rocky_shoreline: "Rocky shoreline",
  riprap: "Riprap",
  wood: "Wood",
  dock_shade: "Dock / shade",
  basin: "Basin",
  suspended_open: "Suspended / open water",
  inlet: "Inlet",
  outlet: "Outlet",
  thermocline_edge: "Thermocline edge",
  aquatic_insects: "Aquatic insects",
  emerging_insects: "Emerging insects",
  terrestrial_insects: "Terrestrial insects",
  crustaceans: "Crustaceans",
  small_forage_fish: "Small forage fish",
  larger_prey_fish: "Larger prey fish",
  mollusks: "Mollusks",
  worms_annelids: "Worms / annelids",
  eggs: "Eggs",
  amphibians: "Amphibians",
  zooplankton: "Zooplankton",
  schooling: "Schooling",
  solitary: "Solitary",
  loose_aggregation: "Loose aggregation",
  mixed_by_life_stage: "Mixed by life stage",
  ambush: "Ambush",
  pursuit: "Pursuit",
  drift_feeding: "Drift feeding",
  benthic_feeding: "Benthic feeding",
  filter: "Filter / plankton feeding",
  opportunistic: "Opportunistic",
  crepuscular: "Crepuscular",
  diurnal: "Diurnal",
  nocturnal: "Nocturnal",
  specialized: "Specialized",
  benthic: "Benthic",
  pelagic: "Pelagic",
  surface: "Surface",
};

export function labelOf(id: string): string {
  return LABELS[id] ?? id.replaceAll("_", " ");
}

export const REFUSES = [
  "AI-generated bite scores",
  "Catch probability",
  "Hotspot maps",
  "Social catch feeds",
  "Anonymous crowdsourced locations",
  "Quietly learning your secret spots",
  "Automatic exact GPS collection",
  "Best-lure-today catalogs",
  "Recommendations we cannot explain",
  "Exact spawning aggregation locations",
  "Vulnerable-fish targeting",
  "Species biology written by a general-purpose chatbot",
  "Reasoning without a cited source",
  "Cross-app silent tracking",
] as const;
