import type { PresentationId, ScenarioInput, ThermalState } from "../protocol/types.ts";
import type { ForageClass, Season, WaterType } from "../protocol/vocab.ts";
import type { SpeciesWeightOverrideRule } from "./species-weight-overrides.ts";
import type { SpeciesOverrideCoverageRecord } from "./species-weight-overrides-expansion.ts";

export const SPECIES_OVERRIDE_EXPANSION_04_VERSION = "SPO-1.2" as const;

type BiasTable = Partial<Record<PresentationId, number>>;
type OverrideWhen = {
  seasons?: Season[];
  thermalStates?: ThermalState[];
  waterTypes?: WaterType[];
  holding?: string[];
  forage?: ForageClass[];
  light?: ScenarioInput["light"][];
};

const rule = (
  id: string,
  speciesId: string,
  when: OverrideWhen,
  bias: BiasTable,
  note: string,
): SpeciesWeightOverrideRule => ({
  id,
  speciesId,
  when,
  bias,
  note,
  reviewedAt: "2026-08-27",
});

export const SPECIES_OVERRIDE_EXPANSION_04_COVERAGE: SpeciesOverrideCoverageRecord[] = [
  { speciesId: "oncorhynchus_nerka_anadromous", mode: "weighted", note: "Anadromous sockeye freshwater mechanics are migration/interception context, not a feeding claim.", reviewedAt: "2026-08-27" },
  { speciesId: "oncorhynchus_gorbuscha", mode: "weighted", note: "Returning pink salmon stop feeding; weighting is restricted to reviewed migration/interception mechanics.", reviewedAt: "2026-08-27" },
  { speciesId: "oncorhynchus_keta", mode: "weighted", note: "Chum salmon freshwater weighting reflects migration/current mechanics while population status remains regulation-gated.", reviewedAt: "2026-08-27" },
  { speciesId: "salmo_salar_landlocked", mode: "weighted", note: "Landlocked Atlantic salmon separate cold pelagic smelt pursuit from river insect/drift use.", reviewedAt: "2026-08-27" },
  { speciesId: "salvelinus_alpinus", mode: "weighted", note: "Arctic char weighting preserves cold-lake polymorphism: benthic/insect versus larger-fish piscivory.", reviewedAt: "2026-08-27" },
  { speciesId: "salvelinus_malma", mode: "weighted", note: "Dolly Varden weighting distinguishes resident drift feeding from mobile fish-prey behavior without targeting spawning aggregations.", reviewedAt: "2026-08-27" },
  { speciesId: "stenodus_leucichthys", mode: "weighted", note: "Adult sheefish are strongly piscivorous and can be either long-distance river migrants or resident lake/river predators.", reviewedAt: "2026-08-27" },
  { speciesId: "acipenser_transmontanus", mode: "weighted", note: "White sturgeon remain strongly benthic and jurisdiction/population gated.", reviewedAt: "2026-08-27" },
  { speciesId: "atractosteus_spatula", mode: "weighted", note: "Alligator gar weighting preserves low-gradient prey interception and rejects respiratory surface rolling as feeding evidence.", reviewedAt: "2026-08-27" },
  { speciesId: "catostomus_commersonii", mode: "weighted", note: "White sucker are adaptable but consistently benthic and avoid the fastest current core.", reviewedAt: "2026-08-27" },
  { speciesId: "catostomus_catostomus", mode: "weighted", note: "Longnose sucker retain colder, cleaner-substrate/current-oriented benthic mechanics.", reviewedAt: "2026-08-27" },
  { speciesId: "catostomus_macrocheilus", mode: "weighted", note: "Largescale sucker remain western substrate generalists in both river and lake settings.", reviewedAt: "2026-08-27" },
  { speciesId: "ameiurus_catus", mode: "weighted", note: "White catfish remain bottom-oriented but are less strictly nocturnal than bullheads.", reviewedAt: "2026-08-27" },
  { speciesId: "lepomis_megalotis", mode: "weighted", note: "Longear sunfish preserve stream-edge insect/crustacean behavior without inheriting strong-current logic.", reviewedAt: "2026-08-27" },
  { speciesId: "centrarchus_macropterus", mode: "weighted", note: "Flier weighting emphasizes vegetated low-current backwater rather than generic open-water sunfish mechanics.", reviewedAt: "2026-08-27" },
];

export const SPECIES_WEIGHT_OVERRIDES_EXPANSION_04: SpeciesWeightOverrideRule[] = [
  rule(
    "sockeye-river-interception",
    "oncorhynchus_nerka_anadromous",
    { waterTypes: ["flowing"], holding: ["run", "current_break", "pool_head", "pool_tail"] },
    { cross_current_retrieve: 10, swing: 9, downstream_retrieve: 7, pulse_jig: 4 },
    "Returning sockeye are being ranked for migration/interception mechanics only; this delta is not evidence that freshwater adults are feeding.",
  ),
  rule(
    "sockeye-lake-transition",
    "oncorhynchus_nerka_anadromous",
    { waterTypes: ["stillwater"], holding: ["inlet", "outlet", "suspended_open", "drop_off"] },
    { horizontal_retrieve: 8, suspend_pause: 7, vertical_jig: 5 },
    "Lake/river transitions and migration depth can change interception mechanics without creating a feeding or aggregation claim.",
  ),
  rule(
    "pink-migration-current",
    "oncorhynchus_gorbuscha",
    { waterTypes: ["flowing"], holding: ["run", "pool_head", "pool_tail", "current_break"] },
    { swing: 10, cross_current_retrieve: 9, downstream_retrieve: 7, pulse_jig: 4 },
    "ADF&G states returning pink salmon stop eating; the model therefore reinforces only reviewed current/interception jobs.",
  ),
  rule(
    "chum-migration-current",
    "oncorhynchus_keta",
    { waterTypes: ["flowing"], holding: ["run", "pool_head", "pool_tail", "current_break"] },
    { swing: 10, cross_current_retrieve: 9, downstream_retrieve: 7, pulse_jig: 4 },
    "Chum freshwater weighting is migration/current mechanics, not proof of active feeding; listed ESU policy remains a separate gate.",
  ),
  rule(
    "landlocked-atlantic-smelt-pelagic",
    "salmo_salar_landlocked",
    { waterTypes: ["stillwater"], forage: ["small_forage_fish"], holding: ["suspended_open", "thermocline_edge", "drop_off", "basin"] },
    { trolling: 11, horizontal_retrieve: 9, suspend_pause: 7, vertical_jig: 5 },
    "Verified small-fish forage strongly reinforces the pelagic smelt-oriented behavior documented for landlocked Atlantic salmon.",
  ),
  rule(
    "landlocked-atlantic-river-insects",
    "salmo_salar_landlocked",
    { waterTypes: ["flowing"], forage: ["aquatic_insects", "emerging_insects", "terrestrial_insects"] },
    { dead_drift: 9, surface_drift: 8, swing: 4, cross_current_retrieve: 2 },
    "In connected rivers, observed insect forage supports trout-like drift/surface mechanics without importing the sea-run Atlantic salmon policy record.",
  ),
  rule(
    "arctic-char-insect-littoral",
    "salvelinus_alpinus",
    { waterTypes: ["stillwater"], forage: ["aquatic_insects", "emerging_insects", "zooplankton"], holding: ["rocky_shoreline", "inlet", "drop_off"] },
    { drop_presentation: 8, surface_retrieve: 7, slow_drag: 6, vertical_jig: 4 },
    "Smaller/insect-oriented Arctic char can move toward littoral and upper-column food when that forage is actually observed.",
  ),
  rule(
    "arctic-char-piscivory-depth",
    "salvelinus_alpinus",
    { forage: ["small_forage_fish", "larger_prey_fish"], holding: ["basin", "drop_off", "submerged_hump", "thermocline_edge"] },
    { trolling: 10, horizontal_retrieve: 8, vertical_jig: 8, slow_drag: 4, surface_retrieve: -5 },
    "Large piscivorous Arctic char can become depth- and fish-prey oriented; lake polymorphism is preserved rather than averaged away.",
  ),
  rule(
    "dolly-resident-drift",
    "salvelinus_malma",
    { waterTypes: ["flowing"], forage: ["aquatic_insects", "emerging_insects"], holding: ["run", "seam", "pool_head", "pool_tail"] },
    { dead_drift: 9, bottom_contact_drift: 7, swing: 4, pulse_jig: 3 },
    "Resident Dolly Varden use cold drift lanes and pools; verified insect forage should preserve drift mechanics.",
  ),
  rule(
    "dolly-mobile-prey",
    "salvelinus_malma",
    { forage: ["small_forage_fish", "larger_prey_fish"] },
    { cross_current_retrieve: 9, swing: 7, horizontal_retrieve: 9, trolling: 7, vertical_jig: 5 },
    "Fish-prey observations support more mobile piscivorous mechanics in both migratory and lake-connected Dolly Varden forms.",
  ),
  rule(
    "sheefish-river-piscivory",
    "stenodus_leucichthys",
    { waterTypes: ["flowing"], forage: ["small_forage_fish", "larger_prey_fish"], holding: ["run", "deep_pool", "current_break", "pool_head", "pool_tail"] },
    { cross_current_retrieve: 11, downstream_retrieve: 8, pulse_jig: 7, swing: 6 },
    "Adult sheefish are strongly piscivorous; verified fish prey in large-river habitat reinforces mobile interception rather than benthic whitefish logic.",
  ),
  rule(
    "sheefish-lake-piscivory",
    "stenodus_leucichthys",
    { waterTypes: ["stillwater"], forage: ["small_forage_fish", "larger_prey_fish"], holding: ["suspended_open", "drop_off", "basin", "inlet", "outlet"] },
    { horizontal_retrieve: 11, trolling: 9, vertical_jig: 7, suspend_pause: 6 },
    "Resident/lake-connected sheefish remain mobile fish predators; pelagic and depth-band jobs outrank bottom-oriented whitefish defaults.",
  ),
  rule(
    "white-sturgeon-benthic-river",
    "acipenser_transmontanus",
    { waterTypes: ["flowing"], holding: ["deep_pool", "run", "current_break", "pool_tail"] },
    { stationary_bait: 11, bottom_contact_drift: 10 },
    "White sturgeon are strongly bottom-oriented in large-river current; regulation and population status continue to gate whether guidance may be used.",
  ),
  rule(
    "white-sturgeon-benthic-lake",
    "acipenser_transmontanus",
    { waterTypes: ["stillwater"], holding: ["basin", "drop_off", "inlet", "outlet", "riprap"] },
    { bottom_contact: 11, slow_drag: 9, stationary_bait: 7 },
    "Lake/impounded white sturgeon remain substrate-oriented; this delta does not relax jurisdiction or endangered-population policy.",
  ),
  rule(
    "alligator-gar-backwater-prey",
    "atractosteus_spatula",
    { holding: ["deep_pool", "eddy", "side_channel", "submerged_wood", "wood", "weed_edge", "inlet"], forage: ["small_forage_fish", "larger_prey_fish", "amphibians"] },
    { live_natural_bait_suspension: 10, horizontal_retrieve: 9, stop_and_go: 8, subsurface_slow_roll: 7, stationary_bait: 6 },
    "Alligator gar are large prey-oriented ambush/interception predators in lower-velocity river and backwater habitat.",
  ),
  rule(
    "alligator-gar-surface-roll-not-feed",
    "atractosteus_spatula",
    { light: ["bright", "mixed", "low_light"] },
    { horizontal_retrieve: 2, live_natural_bait_suspension: 2 },
    "Gar surface air-gulping is respiratory behavior; RPC/SPO never convert a visible roll into a surface-feeding family.",
  ),
  rule(
    "white-sucker-benthic-generalist",
    "catostomus_commersonii",
    { forage: ["aquatic_insects", "worms_annelids", "crustaceans"] },
    { bottom_contact_drift: 9, stationary_bait: 7, bottom_contact: 10, slow_drag: 9, live_natural_bait_suspension: 4 },
    "Observed benthic animal forage reinforces the white sucker's consistent substrate-feeding identity across otherwise broad habitat tolerance.",
  ),
  rule(
    "white-sucker-slow-current",
    "catostomus_commersonii",
    { waterTypes: ["flowing"], holding: ["pool_tail", "current_break", "deep_pool", "side_channel"] },
    { bottom_contact_drift: 10, stationary_bait: 8, pulse_jig: 4 },
    "White sucker tolerate many environments but generally avoid the fastest current core; favor slower bottom delivery.",
  ),
  rule(
    "longnose-sucker-clean-current-bottom",
    "catostomus_catostomus",
    { waterTypes: ["flowing"], holding: ["riffle_to_run", "run", "pool_tail", "current_break"], forage: ["aquatic_insects", "worms_annelids", "crustaceans"] },
    { bottom_contact_drift: 11, stationary_bait: 6, pulse_jig: 5 },
    "Longnose sucker retain a colder, clearer, more current-tolerant benthic identity than white sucker.",
  ),
  rule(
    "longnose-sucker-lake-bottom",
    "catostomus_catostomus",
    { waterTypes: ["stillwater"], holding: ["rocky_shoreline", "drop_off", "inlet", "basin"] },
    { bottom_contact: 10, slow_drag: 9, live_natural_bait_suspension: 4 },
    "In lakes, longnose sucker remain substrate feeders and should not be converted into pelagic whitefish logic.",
  ),
  rule(
    "largescale-sucker-substrate-river",
    "catostomus_macrocheilus",
    { waterTypes: ["flowing"], forage: ["aquatic_insects", "crustaceans", "worms_annelids", "mollusks"] },
    { bottom_contact_drift: 10, stationary_bait: 7, pulse_jig: 5 },
    "Largescale sucker feed broadly on substrate organisms; current delivery matters in rivers without implying spawning-riffle targeting.",
  ),
  rule(
    "largescale-sucker-substrate-lake",
    "catostomus_macrocheilus",
    { waterTypes: ["stillwater"], forage: ["aquatic_insects", "crustaceans", "worms_annelids", "mollusks"] },
    { bottom_contact: 10, slow_drag: 9, live_natural_bait_suspension: 4 },
    "Lake largescale sucker remain generalized benthic feeders rather than pelagic forage followers.",
  ),
  rule(
    "white-catfish-bottom-daylight",
    "ameiurus_catus",
    { holding: ["deep_pool", "current_break", "submerged_wood", "basin", "wood", "riprap", "drop_off"] },
    { stationary_bait: 9, bottom_contact_drift: 8, bottom_contact: 10, slow_drag: 8, live_natural_bait_suspension: 6 },
    "White catfish retain bottom/scent mechanics but do not require the strong nocturnal penalty used for some bullheads.",
  ),
  rule(
    "longear-stream-edge-insects",
    "lepomis_megalotis",
    { waterTypes: ["flowing"], holding: ["eddy", "side_channel", "current_break", "pool_tail", "submerged_wood"], forage: ["aquatic_insects", "terrestrial_insects", "crustaceans"] },
    { dead_drift: 10, pulse_jig: 7, stationary_bait: 6 },
    "Longear sunfish are strongly stream-associated but avoid the current core; protected-edge insect/crustacean delivery is diagnostic.",
  ),
  rule(
    "longear-littoral-daylight",
    "lepomis_megalotis",
    { waterTypes: ["stillwater"], holding: ["weed_edge", "shallow_flat", "rocky_shoreline", "wood", "inlet"] },
    { drop_presentation: 8, slow_drag: 7, surface_retrieve: 5, live_natural_bait_suspension: 4 },
    "Day-active longear sunfish remain shallow/littoral around rock and vegetation when moved out of stream context.",
  ),
  rule(
    "flier-vegetated-backwater",
    "centrarchus_macropterus",
    { holding: ["eddy", "side_channel", "submerged_wood", "weed_edge", "inside_weedline", "wood", "shallow_flat", "dock_shade"] },
    { stationary_bait: 7, pulse_jig: 6, dead_drift: 4, drop_presentation: 9, slow_drag: 7, live_natural_bait_suspension: 6, surface_retrieve: 3 },
    "Flier are low-gradient backwater sunfish; precise protected-cover mechanics outrank open/current searching.",
  ),
];

function matchesRule(
  rule: SpeciesWeightOverrideRule,
  input: ScenarioInput,
  thermalState: ThermalState,
): boolean {
  if (rule.speciesId !== input.speciesId) return false;
  if (rule.when.seasons && !rule.when.seasons.includes(input.season)) return false;
  if (rule.when.thermalStates && !rule.when.thermalStates.includes(thermalState)) return false;
  if (rule.when.waterTypes && !rule.when.waterTypes.includes(input.waterType)) return false;
  const holding = input.waterType === "flowing" ? input.holdingRiver : input.holdingStill;
  if (rule.when.holding && (!holding || !rule.when.holding.includes(holding))) return false;
  if (rule.when.light && !rule.when.light.includes(input.light)) return false;
  if (rule.when.forage && (!input.forage || !rule.when.forage.includes(input.forage.class))) return false;
  return true;
}

export function matchingSpeciesWeightOverrideExpansion04(
  input: ScenarioInput,
  thermalState: ThermalState,
): SpeciesWeightOverrideRule[] {
  return SPECIES_WEIGHT_OVERRIDES_EXPANSION_04.filter((entry) =>
    matchesRule(entry, input, thermalState),
  );
}
