import type {
  PresentationId,
  ScenarioInput,
  ThermalState,
} from "../protocol/types.ts";
import type { ForageClass, Season, WaterType } from "../protocol/vocab.ts";

export const SPECIES_OVERRIDE_MODEL_VERSION = "SPO-1.0" as const;

type BiasTable = Partial<Record<PresentationId, number>>;

type OverrideWhen = {
  seasons?: Season[];
  thermalStates?: ThermalState[];
  waterTypes?: WaterType[];
  holding?: string[];
  forage?: ForageClass[];
  light?: ScenarioInput["light"][];
};

export type SpeciesWeightOverrideRule = {
  id: string;
  speciesId: string;
  when: OverrideWhen;
  bias: BiasTable;
  note: string;
  reviewedAt: string;
};

/**
 * Reviewed species-specific deltas layered on top of SPW-1.x.
 *
 * These rules can only move families already present in the species' reviewed
 * water-type list. They never create a candidate family and never bypass
 * targetStatus / targetContext policy.
 */
export const SPECIES_WEIGHT_OVERRIDES: SpeciesWeightOverrideRule[] = [
  {
    id: "rainbow-flow-feeding-lane",
    speciesId: "oncorhynchus_mykiss",
    when: {
      waterTypes: ["flowing"],
      thermalStates: ["preferred", "active"],
      holding: ["riffle", "riffle_to_run", "run", "seam"],
    },
    bias: { dead_drift: 7, tight_line_drift: 6, suspended_drift: 4, swing: 2 },
    note: "Rainbow trout use food-delivery lanes readily when temperature is workable; reinforce drift mechanics before slower cover-oriented logic.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "rainbow-still-depth-band",
    speciesId: "oncorhynchus_mykiss",
    when: { waterTypes: ["stillwater"], holding: ["thermocline_edge", "drop_off", "inlet", "outlet"] },
    bias: { trolling: 6, suspend_pause: 5, horizontal_retrieve: 4 },
    note: "In stillwater, rainbow trout frequently use mobile depth bands and water-exchange edges rather than staying bottom-bound.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "brown-piscivory",
    speciesId: "salmo_trutta",
    when: { forage: ["small_forage_fish", "larger_prey_fish"] },
    bias: { cross_current_retrieve: 9, swing: 6, stop_and_go: 8, horizontal_retrieve: 7, surface_retrieve: 3, dead_drift: -3 },
    note: "When fish forage is actually observed, brown trout can shift materially toward mobile prey mechanics, especially larger adults.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "brown-deep-cover",
    speciesId: "salmo_trutta",
    when: { waterTypes: ["flowing"], holding: ["deep_pool", "current_break", "submerged_wood", "undercut_bank"] },
    bias: { bottom_contact_drift: 8, cross_current_retrieve: 4, dead_drift: 2, surface_drift: -4 },
    note: "Brown trout are more cover/depth-oriented than rainbow trout in daylight and pressured water; reinforce bottom/cover mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "brook-small-water-cover",
    speciesId: "salvelinus_fontinalis",
    when: { waterTypes: ["flowing"], holding: ["undercut_bank", "side_channel", "submerged_wood", "deep_pool"] },
    bias: { dead_drift: 6, tight_line_drift: 5, downstream_retrieve: 4, surface_drift: 2 },
    note: "Brook trout commonly use compact cover and small-water pockets; favor short controlled passes over broad mobile searching.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "brook-terrestrial-window",
    speciesId: "salvelinus_fontinalis",
    when: { seasons: ["summer", "late_summer"], forage: ["terrestrial_insects"] },
    bias: { surface_drift: 9, dead_drift: 3, surface_retrieve: 8 },
    note: "Observed terrestrial input in summer is a strong species-appropriate surface signal for brook trout where the family is already reviewed.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "cutthroat-flow-surface",
    speciesId: "oncorhynchus_clarkii",
    when: { waterTypes: ["flowing"], seasons: ["summer", "late_summer"], forage: ["emerging_insects", "terrestrial_insects"] },
    bias: { surface_drift: 9, dead_drift: 5, suspended_drift: 3 },
    note: "Cutthroat trout often remain willing daytime surface feeders when verified insect input is present.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "cutthroat-lake-inlet",
    speciesId: "oncorhynchus_clarkii",
    when: { waterTypes: ["stillwater"], holding: ["inlet", "outlet", "drop_off"] },
    bias: { horizontal_retrieve: 5, trolling: 6, stop_and_go: 4, surface_retrieve: 2 },
    note: "Lake cutthroat commonly use water-exchange edges and adjacent depth transitions; reinforce mobile depth-control families.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "lake-trout-summer-depth",
    speciesId: "salvelinus_namaycush",
    when: { waterTypes: ["stillwater"], seasons: ["summer", "late_summer"], holding: ["thermocline_edge", "basin", "suspended_open", "drop_off"] },
    bias: { trolling: 10, vertical_jig: 9, suspend_pause: 7, horizontal_retrieve: 3 },
    note: "Summer lake trout are strongly depth/temperature constrained; reinforce controlled deep and suspended mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "lake-trout-fall-rock",
    speciesId: "salvelinus_namaycush",
    when: { seasons: ["fall"], waterTypes: ["stillwater"], holding: ["rocky_shoreline", "submerged_hump", "drop_off"] },
    bias: { vertical_jig: 6, horizontal_retrieve: 5, trolling: 3 },
    note: "Fall movement toward rocky structure changes depth and travel mechanics, but spawning structure remains context rather than an aggregation target.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "steelhead-winter-bottom",
    speciesId: "oncorhynchus_mykiss_steelhead",
    when: { seasons: ["winter", "early_spring"], thermalStates: ["cold_refuge", "active"], waterTypes: ["flowing"] },
    bias: { bottom_contact_drift: 9, dead_drift: 5, swing: -2, downstream_retrieve: -2 },
    note: "Cold steelhead frequently hold lower and tighter; reinforce near-bottom controlled drift over broad higher-column movement.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "steelhead-workable-run",
    speciesId: "oncorhynchus_mykiss_steelhead",
    when: { thermalStates: ["preferred"], waterTypes: ["flowing"], holding: ["run", "seam", "pool_head", "tailwater"] },
    bias: { swing: 8, bottom_contact_drift: 4, downstream_retrieve: 4 },
    note: "In workable temperatures and classic travel/holding lanes, steelhead can occupy enough of the column for swing mechanics to regain relative fit.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "chinook-lake-pelagic",
    speciesId: "oncorhynchus_tshawytscha",
    when: { waterTypes: ["stillwater"], holding: ["thermocline_edge", "suspended_open", "drop_off"] },
    bias: { trolling: 10, vertical_jig: 5, horizontal_retrieve: 5 },
    note: "Lake/reservoir Chinook are pelagic and depth-band oriented; reinforce controlled travel through the occupied layer.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "coho-lake-mobile",
    speciesId: "oncorhynchus_kisutch",
    when: { waterTypes: ["stillwater"], holding: ["thermocline_edge", "suspended_open", "point", "inlet"] },
    bias: { trolling: 8, horizontal_retrieve: 7, stop_and_go: 5 },
    note: "Open-water coho commonly track mobile forage and depth edges; favor mobile families over stationary bottom mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "largemouth-cover-summer",
    speciesId: "micropterus_nigricans",
    when: { seasons: ["summer", "late_summer"], waterTypes: ["stillwater"], holding: ["weed_edge", "inside_weedline", "outside_weedline", "wood", "dock_shade"] },
    bias: { drop_presentation: 10, subsurface_slow_roll: 8, stop_and_go: 5, bottom_contact: 4, surface_retrieve: 3 },
    note: "Summer largemouth are unusually cover-governed; reinforce penetration and edge-tracking mechanics before open-water search families.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "largemouth-low-light-shallow",
    speciesId: "micropterus_nigricans",
    when: { waterTypes: ["stillwater"], holding: ["shallow_flat", "weed_edge"], light: ["low_light", "night"] },
    bias: { surface_retrieve: 8, subsurface_slow_roll: 6, stop_and_go: 3 },
    note: "Low light can move largemouth out from hard cover and make shallow surface/subsurface edge mechanics more defensible.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "smallmouth-crayfish-rock",
    speciesId: "micropterus_dolomieu",
    when: { forage: ["crustaceans"], holding: ["rocky_shoreline", "point", "secondary_point", "drop_off", "riprap", "submerged_hump", "boulder_pocket", "current_break"] },
    bias: { bottom_contact: 10, bottom_contact_drift: 10, pulse_jig: 7, drop_presentation: 5, vertical_jig: 4 },
    note: "Verified crustacean forage on rock is a particularly strong smallmouth distinction; reinforce substrate-contact mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "smallmouth-current-prey",
    speciesId: "micropterus_dolomieu",
    when: { waterTypes: ["flowing"], forage: ["small_forage_fish"], holding: ["current_break", "seam", "run", "riffle_to_run", "pool_head"] },
    bias: { cross_current_retrieve: 10, upstream_retrieve: 7, pulse_jig: 4, bottom_contact_drift: 2 },
    note: "Smallmouth exploit current boundaries aggressively when mobile fish forage is verified; reinforce cross-current travel mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "spotted-bass-offshore",
    speciesId: "micropterus_punctulatus",
    when: { waterTypes: ["stillwater"], holding: ["drop_off", "breakline", "submerged_hump"] },
    bias: { horizontal_retrieve: 8, vertical_jig: 8, drop_presentation: 4, stop_and_go: 5 },
    note: "Spotted bass are commonly deeper and more pelagic than largemouth in reservoirs; reinforce offshore depth-band mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "crappie-winter-suspend",
    speciesId: "pomoxis_spp",
    when: { seasons: ["winter", "late_fall"], waterTypes: ["stillwater"], holding: ["basin", "suspended_open", "wood"] },
    bias: { vertical_jig: 10, suspend_pause: 9, live_natural_bait_suspension: 6, slow_drag: 2 },
    note: "Cold-season crappie frequently suspend around deeper cover or basins; reinforce precise vertical/suspended mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "crappie-spring-cover",
    speciesId: "pomoxis_spp",
    when: { seasons: ["spring"], waterTypes: ["stillwater"], holding: ["wood", "dock_shade", "weed_edge", "inlet"] },
    bias: { drop_presentation: 9, vertical_jig: 7, live_natural_bait_suspension: 5 },
    note: "Spring crappie use shallow-to-mid cover strongly; reinforce precise cover placement without turning reproductive concentrations into location guidance.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "bluegill-summer-cover",
    speciesId: "lepomis_macrochirus",
    when: { seasons: ["summer", "late_summer"], waterTypes: ["stillwater"], holding: ["weed_edge", "inside_weedline", "dock_shade", "wood"] },
    bias: { drop_presentation: 8, live_natural_bait_suspension: 7, slow_drag: 4, surface_retrieve: 2 },
    note: "Bluegill remain strongly cover-oriented in warm water; favor precise edge and suspension mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "bluegill-terrestrial-edge",
    speciesId: "lepomis_macrochirus",
    when: { forage: ["terrestrial_insects"], waterTypes: ["stillwater"], holding: ["weed_edge", "shallow_flat", "dock_shade"] },
    bias: { surface_retrieve: 9, drop_presentation: 3, live_natural_bait_suspension: 2 },
    note: "Observed terrestrial input at shallow cover creates a species-appropriate surface opportunity without assuming a hatch.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "walleye-bright-depth",
    speciesId: "sander_vitreus",
    when: { waterTypes: ["stillwater"], light: ["bright"], holding: ["drop_off", "breakline", "basin", "thermocline_edge"] },
    bias: { vertical_jig: 9, bottom_contact: 7, slow_drag: 6, trolling: 5 },
    note: "Bright clear conditions strengthen the walleye depth/structure tradeoff; reinforce deeper controlled mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "walleye-low-light-mobile",
    speciesId: "sander_vitreus",
    when: { light: ["low_light", "night"], holding: ["point", "rocky_shoreline", "inlet", "run", "current_break"] },
    bias: { trolling: 9, slow_drag: 5, bottom_contact_drift: 6, cross_current_retrieve: 7, downstream_retrieve: 4 },
    note: "Walleye's low-light advantage supports shallower and more mobile feeding mechanics on structure and current edges.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "pike-cool-shallow",
    speciesId: "esox_lucius",
    when: { seasons: ["early_spring", "spring", "fall"], thermalStates: ["preferred", "active"], holding: ["weed_edge", "inside_weedline", "inlet", "shallow_flat", "side_channel", "eddy"] },
    bias: { stop_and_go: 8, horizontal_retrieve: 7, subsurface_slow_roll: 7, cross_current_retrieve: 7, surface_retrieve: 3 },
    note: "In cool workable water, pike commonly occupy shallower ambush edges and can support more mobile interception mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "pike-summer-weed-edge",
    speciesId: "esox_lucius",
    when: { seasons: ["summer", "late_summer"], waterTypes: ["stillwater"], holding: ["outside_weedline", "weed_edge", "point", "wood"] },
    bias: { subsurface_slow_roll: 9, stop_and_go: 8, horizontal_retrieve: 6, surface_retrieve: -2 },
    note: "As water warms, pike use deeper weed edges and cooler ambush structure; reinforce subsurface edge travel.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "muskie-edge-travel",
    speciesId: "esox_masquinongy",
    when: { waterTypes: ["stillwater"], holding: ["weed_edge", "outside_weedline", "point", "drop_off", "inlet", "wood"] },
    bias: { horizontal_retrieve: 8, stop_and_go: 8, subsurface_slow_roll: 6, surface_retrieve: 3 },
    note: "Muskellunge commonly use large structural and vegetation edges as travel/ambush corridors; reinforce moving search families already reviewed for the record.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "yellow-perch-cold-school",
    speciesId: "perca_flavescens",
    when: { seasons: ["winter", "late_fall"], waterTypes: ["stillwater"], holding: ["basin", "drop_off", "submerged_hump"] },
    bias: { vertical_jig: 10, bottom_contact: 7, live_natural_bait_suspension: 6, slow_drag: 4 },
    note: "Cold-season yellow perch commonly school near bottom or structural depth changes; reinforce vertical and bottom-contact mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "channel-cat-current-bottom",
    speciesId: "ictalurus_punctatus",
    when: { waterTypes: ["flowing"], holding: ["deep_pool", "current_break", "tributary_mouth", "submerged_wood", "run"] },
    bias: { stationary_bait: 10, bottom_contact_drift: 8, pulse_jig: 3 },
    note: "Channel catfish are bottom-oriented in current and use scent/food delivery through pools and breaks; reinforce stationary and bottom-moving mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "channel-cat-warm-night",
    speciesId: "ictalurus_punctatus",
    when: { seasons: ["summer", "late_summer"], light: ["night", "low_light"] },
    bias: { stationary_bait: 8, bottom_contact: 7, slow_drag: 5, live_natural_bait_suspension: 4 },
    note: "Warm-season low light supports broader catfish movement, but the species remains fundamentally bottom/food-station oriented rather than surface-oriented.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "carp-warm-flat",
    speciesId: "cyprinus_carpio",
    when: { seasons: ["summer", "late_summer"], waterTypes: ["stillwater"], holding: ["shallow_flat", "weed_edge", "inlet"] },
    bias: { slow_drag: 9, bottom_contact: 8, live_natural_bait_suspension: 5 },
    note: "Warm-water carp frequently forage over soft shallow flats and edges; reinforce slow substrate-oriented mechanics rather than predator-style travel.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "striped-bass-pelagic",
    speciesId: "morone_saxatilis",
    when: { waterTypes: ["stillwater"], holding: ["suspended_open", "thermocline_edge", "basin", "point"] },
    bias: { trolling: 10, horizontal_retrieve: 9, vertical_jig: 7, stop_and_go: 5 },
    note: "Reservoir striped bass are highly mobile pelagic predators; reinforce depth-controlled pursuit families around open-water prey bands.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "kokanee-zooplankton-band",
    speciesId: "oncorhynchus_nerka_kokanee",
    when: { waterTypes: ["stillwater"], forage: ["zooplankton"], holding: ["suspended_open", "thermocline_edge", "basin"] },
    bias: { trolling: 12, horizontal_retrieve: 6, suspend_pause: 5, vertical_jig: 4 },
    note: "Kokanee are pelagic plankton feeders; verified plankton/open-water context strongly reinforces controlled travel through the occupied depth band.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "lake-whitefish-winter-bottom",
    speciesId: "coregonus_clupeaformis",
    when: { seasons: ["winter", "late_fall"], waterTypes: ["stillwater"], holding: ["basin", "drop_off", "submerged_hump"] },
    bias: { vertical_jig: 10, bottom_contact: 8, slow_drag: 6, drop_presentation: 4 },
    note: "Lake whitefish are strongly benthic in cold water; reinforce vertical and bottom-contact feeding mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "burbot-winter-depth",
    speciesId: "lota_lota",
    when: { seasons: ["winter", "late_fall"], holding: ["deep_pool", "basin", "drop_off", "submerged_hump", "rocky_shoreline"] },
    bias: { vertical_jig: 12, bottom_contact: 10, slow_drag: 8, stationary_bait: 8, bottom_contact_drift: 8 },
    note: "Burbot are cold-active, bottom-oriented predators; winter/deep structure should strongly reinforce vertical and substrate mechanics.",
    reviewedAt: "2026-08-27",
  },
  {
    id: "sauger-river-bottom",
    speciesId: "sander_canadensis",
    when: { waterTypes: ["flowing"], holding: ["deep_pool", "run", "tailwater", "current_break", "pool_head"] },
    bias: { bottom_contact_drift: 10, pulse_jig: 9, cross_current_retrieve: 5, downstream_retrieve: 4 },
    note: "Sauger are especially bottom/current oriented in large rivers; reinforce near-bottom current mechanics over generic pelagic predator logic.",
    reviewedAt: "2026-08-27",
  },
];

function currentHolding(input: ScenarioInput): string | undefined {
  return input.waterType === "flowing"
    ? input.holdingRiver ?? undefined
    : input.holdingStill ?? undefined;
}

function matchesRule(
  rule: SpeciesWeightOverrideRule,
  input: ScenarioInput,
  thermalState: ThermalState,
): boolean {
  if (rule.speciesId !== input.speciesId) return false;
  if (rule.when.seasons && !rule.when.seasons.includes(input.season)) return false;
  if (rule.when.thermalStates && !rule.when.thermalStates.includes(thermalState)) return false;
  if (rule.when.waterTypes && !rule.when.waterTypes.includes(input.waterType)) return false;
  if (rule.when.light && !rule.when.light.includes(input.light)) return false;
  if (rule.when.holding) {
    const holding = currentHolding(input);
    if (!holding || !rule.when.holding.includes(holding)) return false;
  }
  if (rule.when.forage) {
    if (!input.forage || !rule.when.forage.includes(input.forage.class)) return false;
  }
  return true;
}

export function matchingSpeciesWeightOverrides(
  input: ScenarioInput,
  thermalState: ThermalState,
): SpeciesWeightOverrideRule[] {
  return SPECIES_WEIGHT_OVERRIDES.filter((rule) => matchesRule(rule, input, thermalState));
}
