export const INSTRUMENT_ID = "HTH-SP-001";
export const INSTRUMENT_NAME = "Species & Presentation Analyst";
export const APP_VERSION = "0.6.1";
export const PACKET_VERSION = "HTH-1.0";
export const SCHEMA_VERSION = "0.6.1";
export const REVIEWED_AT = "2026-08-27";
export const NEXT_REVIEW = "2026-11-27";

export const WATER_TYPES = ["flowing", "stillwater"] as const;
export type WaterType = (typeof WATER_TYPES)[number];

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
  "Automatic secret-spot learning",
  "Automatic exact GPS collection",
  "Best-lure-today catalogs",
  "Black-box recommendations",
  "Exact spawning aggregation locations",
  "Vulnerable-fish targeting",
  "Generic LLM-generated species biology",
  "Rules without citations",
  "Cross-app silent tracking",
] as const;
