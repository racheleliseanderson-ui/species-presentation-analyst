import type {
  PresentationId,
  ScenarioInput,
  ThermalState,
} from "../protocol/types.ts";
import type { ForageClass, Season, WaterType } from "../protocol/vocab.ts";
import {
  matchesOverrideRule,
  type SpeciesWeightOverrideRule,
} from "./species-weight-overrides.ts";

export const SPECIES_OVERRIDE_EXPANSION_VERSION = "SPO-1.1" as const;

type BiasTable = Partial<Record<PresentationId, number>>;

type OverrideWhen = {
  seasons?: Season[];
  thermalStates?: ThermalState[];
  waterTypes?: WaterType[];
  holding?: string[];
  forage?: ForageClass[];
  light?: ScenarioInput["light"][];
};

export type SpeciesOverrideCoverageRecord = {
  speciesId: string;
  /**
   * - `weighted` — reviewed species-specific deltas exist.
   * - `policy_only` — the species gets no presentation guidance at all, because
   *   its conservation or regulatory status suppresses it.
   * - `no_reviewed_rule` — guidance is given normally, but nothing in the
   *   reviewed record justified a species-specific delta.
   *
   * The last two used to share a name, which made twelve saltwater species
   * whose records were simply thin look as though the app was deliberately
   * withholding advice about them. They are different statements and a reader
   * is owed the difference.
   */
  mode: "weighted" | "policy_only" | "no_reviewed_rule";
  note: string;
  reviewedAt: string;
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

/**
 * SPO-1.1 expansion: reviewed species-specific deltas for the 36 catalog records
 * that were not covered by SPO-1.0.
 *
 * Three records are intentionally policy-only because their reviewed catalog
 * entries suppress ordinary presentation guidance: bull trout, wild anadromous
 * Atlantic salmon, and paddlefish. Policy-only coverage is explicit so 60/60
 * catalog coverage does not require fake or unreachable weighting rules.
 */
export const SPECIES_OVERRIDE_EXPANSION_COVERAGE: SpeciesOverrideCoverageRecord[] = [
  { speciesId: "morone_chrysops", mode: "weighted", note: "Schooling interior temperate bass; current-run and pelagic reservoir mechanics are distinct.", reviewedAt: "2026-08-27" },
  { speciesId: "prosopium_williamsoni", mode: "weighted", note: "Benthic western whitefish with drift feeding and cold-season deep-water consolidation.", reviewedAt: "2026-08-27" },
  { speciesId: "thymallus_arcticus", mode: "weighted", note: "Drift- and insect-oriented coldwater salmonid with strong surface response when forage is observed.", reviewedAt: "2026-08-27" },
  { speciesId: "ictalurus_furcatus", mode: "weighted", note: "Blue catfish separate river-bottom stationing from reservoir depth-band movement.", reviewedAt: "2026-08-27" },
  { speciesId: "pylodictis_olivaris", mode: "weighted", note: "Flathead catfish are cover-oriented and strongly piscivorous as adults.", reviewedAt: "2026-08-27" },
  { speciesId: "aplodinotus_grunniens", mode: "weighted", note: "Freshwater drum retain a strong benthic/mollusk identity.", reviewedAt: "2026-08-27" },
  { speciesId: "lepomis_gibbosus", mode: "weighted", note: "Pumpkinseed weighting preserves stronger mollusk/benthic use than generic sunfish logic.", reviewedAt: "2026-08-27" },
  { speciesId: "lepomis_microlophus", mode: "weighted", note: "Redear are especially bottom- and mollusk-oriented.", reviewedAt: "2026-08-27" },
  { speciesId: "lepomis_cyanellus", mode: "weighted", note: "Green sunfish tolerate streams and disturbed/turbid cover better than many Lepomis.", reviewedAt: "2026-08-27" },
  { speciesId: "ambloplites_rupestris", mode: "weighted", note: "Rock bass weighting emphasizes rock, current relief, and crustacean/substrate mechanics.", reviewedAt: "2026-08-27" },
  { speciesId: "esox_niger", mode: "weighted", note: "Chain pickerel remain vegetation/slack-water ambush predators rather than open-pelagic esocids.", reviewedAt: "2026-08-27" },
  { speciesId: "amia_calva", mode: "weighted", note: "Bowfin weighting preserves cover, low-gradient water, and low-light movement without treating air-gulping as feeding.", reviewedAt: "2026-08-27" },
  { speciesId: "lepisosteus_osseus", mode: "weighted", note: "Longnose gar weighting separates mobile prey interception from respiratory surface rolling.", reviewedAt: "2026-08-27" },
  { speciesId: "lepisosteus_oculatus", mode: "weighted", note: "Spotted gar remain vegetation/backwater ambush predators.", reviewedAt: "2026-08-27" },
  { speciesId: "ameiurus_nebulosus", mode: "weighted", note: "Brown bullhead retain nocturnal benthic/scent-oriented mechanics.", reviewedAt: "2026-08-27" },
  { speciesId: "ameiurus_melas", mode: "weighted", note: "Black bullhead weighting emphasizes turbid, soft-bottomed, low-current feeding.", reviewedAt: "2026-08-27" },
  { speciesId: "coregonus_artedi", mode: "weighted", note: "Cisco are pelagic coldwater fish driven by plankton and depth bands.", reviewedAt: "2026-08-27" },
  { speciesId: "osmerus_mordax", mode: "weighted", note: "Rainbow smelt remain cold pelagic fish with diel vertical movement; spawning runs stay excluded.", reviewedAt: "2026-08-27" },
  { speciesId: "morone_americana", mode: "weighted", note: "White perch separate open-water schooling from seasonal river movement.", reviewedAt: "2026-08-27" },
  { speciesId: "anguilla_rostrata", mode: "weighted", note: "American eel remain nocturnal, benthic, shelter-oriented freshwater residents in this model.", reviewedAt: "2026-08-27" },
  { speciesId: "alosa_sapidissima", mode: "weighted", note: "American shad freshwater presentation is migration/interception context, not forage proof.", reviewedAt: "2026-08-27" },
  { speciesId: "salvelinus_confluentus", mode: "policy_only", note: "Conservation-sensitive context-only record; weighting remains intentionally unreachable.", reviewedAt: "2026-08-27" },
  { speciesId: "salmo_salar_anadromous", mode: "policy_only", note: "Protected wild anadromous U.S. Atlantic salmon record; presentation guidance remains disabled.", reviewedAt: "2026-08-27" },
  { speciesId: "acipenser_fulvescens", mode: "weighted", note: "Regulated-context lake sturgeon remain bottom-oriented, and rules vary sharply by jurisdiction.", reviewedAt: "2026-08-27" },
  { speciesId: "polyodon_spathula", mode: "policy_only", note: "Filter-feeding regulated-context record intentionally carries no capture-method weighting.", reviewedAt: "2026-08-27" },
  { speciesId: "lepomis_auritus", mode: "weighted", note: "Redbreast sunfish preserve stronger moving-water use than bluegill-like generic panfish logic.", reviewedAt: "2026-08-27" },
  { speciesId: "lepomis_gulosus", mode: "weighted", note: "Warmouth remain quiet-water cover ambush fish.", reviewedAt: "2026-08-27" },
  { speciesId: "ameiurus_natalis", mode: "weighted", note: "Yellow bullhead preserve bottom-oriented low-light feeding in slow vegetated water.", reviewedAt: "2026-08-27" },
  { speciesId: "lepisosteus_platostomus", mode: "weighted", note: "Shortnose gar emphasize river/backwater prey interception and turbidity tolerance.", reviewedAt: "2026-08-27" },
  { speciesId: "morone_mississippiensis", mode: "weighted", note: "Yellow bass weighting preserves quieter-pool behavior alongside schooling open-water movement.", reviewedAt: "2026-08-27" },
  { speciesId: "morone_hybrid_wiper", mode: "weighted", note: "Wiper logic reflects stocked pelagic/current-oriented hybrid behavior without implying reproduction.", reviewedAt: "2026-08-27" },
  { speciesId: "hiodon_alosoides", mode: "weighted", note: "Goldeye preserve low-light/turbid upper-column feeding distinctions.", reviewedAt: "2026-08-27" },
  { speciesId: "hiodon_tergisus", mode: "weighted", note: "Mooneye preserve clear-water drift and surface feeding distinctions from goldeye.", reviewedAt: "2026-08-27" },
  { speciesId: "ictiobus_cyprinellus", mode: "weighted", note: "Bigmouth buffalo can shift between plankton suspension and benthic feeding; regulated context remains visible.", reviewedAt: "2026-08-27" },
  { speciesId: "ictiobus_bubalus", mode: "weighted", note: "Smallmouth buffalo remain strongly benthic rather than carp-like or plankton-first.", reviewedAt: "2026-08-27" },
  { speciesId: "moxostoma_macrolepidotum", mode: "weighted", note: "Shorthead redhorse weighting emphasizes clean-substrate current and benthic feeding outside spawning aggregations.", reviewedAt: "2026-08-27" },
];

export const SPECIES_WEIGHT_OVERRIDES_EXPANSION: SpeciesWeightOverrideRule[] = [
  rule(
    "white-bass-pelagic-forage",
    "morone_chrysops",
    { waterTypes: ["stillwater"], holding: ["suspended_open", "point", "drop_off"], forage: ["small_forage_fish"] },
    { horizontal_retrieve: 11, stop_and_go: 8, vertical_jig: 6 },
    "White bass are schooling mobile predators; verified fish forage in open water should reinforce horizontal pursuit before bottom logic.",
  ),
  rule(
    "white-bass-current-run",
    "morone_chrysops",
    { waterTypes: ["flowing"], holding: ["tributary_mouth", "run", "tailwater", "current_break"] },
    { cross_current_retrieve: 10, downstream_retrieve: 7, pulse_jig: 5 },
    "River white bass use current during seasonal movement and feeding; favor current-crossing and controlled downstream mechanics without naming aggregation points.",
  ),

  rule(
    "mountain-whitefish-insect-drift",
    "prosopium_williamsoni",
    { waterTypes: ["flowing"], forage: ["aquatic_insects", "emerging_insects"] },
    { dead_drift: 9, tight_line_drift: 8, bottom_contact_drift: 6, suspended_drift: 4 },
    "Observed insect forage reinforces mountain whitefish drift feeding while preserving their lower-column bias.",
  ),
  rule(
    "mountain-whitefish-cold-depth",
    "prosopium_williamsoni",
    { thermalStates: ["cold_refuge", "active"], holding: ["deep_pool", "pool_tail", "basin", "drop_off"] },
    { bottom_contact_drift: 10, slow_drag: 10, vertical_jig: 8, live_natural_bait_suspension: 4 },
    "Cold-season mountain whitefish commonly consolidate lower and deeper; reinforce substrate and lower-column control.",
  ),

  rule(
    "grayling-insect-surface",
    "thymallus_arcticus",
    { seasons: ["summer", "late_summer"], forage: ["emerging_insects", "terrestrial_insects", "aquatic_insects"] },
    { surface_drift: 11, dead_drift: 7, tight_line_drift: 5, surface_retrieve: 9 },
    "Verified insect input is a strong grayling-specific reason to favor surface/drift mechanics when those families are reviewed for the declared water type.",
  ),
  rule(
    "grayling-cold-refuge",
    "thymallus_arcticus",
    { thermalStates: ["cold_refuge"], holding: ["deep_pool", "basin", "drop_off"] },
    { dead_drift: 5, tight_line_drift: 6, drop_presentation: 7, suspend_pause: 6, surface_drift: -5, surface_retrieve: -5 },
    "Cold grayling refuge behavior is more depth-oriented than their warm-season surface identity.",
  ),

  rule(
    "blue-cat-river-channel",
    "ictalurus_furcatus",
    { waterTypes: ["flowing"], holding: ["deep_pool", "run", "current_break", "tributary_mouth", "submerged_wood"] },
    { stationary_bait: 10, bottom_contact_drift: 9, pulse_jig: 4 },
    "Blue catfish in rivers use channel structure and current delivery; keep the species bottom/current oriented.",
  ),
  rule(
    "blue-cat-reservoir-depth-band",
    "ictalurus_furcatus",
    { waterTypes: ["stillwater"], holding: ["suspended_open", "basin", "drop_off"], forage: ["small_forage_fish", "larger_prey_fish"] },
    { vertical_jig: 9, live_natural_bait_suspension: 8, bottom_contact: 4, slow_drag: 3 },
    "Reservoir blue catfish can suspend with mobile forage; reinforce depth-band mechanics without inventing unreviewed trolling or horizontal families.",
  ),

  rule(
    "flathead-cover-station",
    "pylodictis_olivaris",
    { holding: ["submerged_wood", "deep_pool", "wood", "riprap"], light: ["bright", "mixed"] },
    { stationary_bait: 11, bottom_contact: 9, live_natural_bait_suspension: 7, bottom_contact_drift: 6 },
    "Daytime flathead catfish are unusually cover- and cavity-oriented; reinforce precise stationing at reviewed cover classes.",
  ),
  rule(
    "flathead-piscivory",
    "pylodictis_olivaris",
    { forage: ["small_forage_fish", "larger_prey_fish"], light: ["low_light", "night"] },
    { stationary_bait: 10, live_natural_bait_suspension: 10, bottom_contact_drift: 5, slow_drag: 4 },
    "Large flatheads are strongly piscivorous and move from cover in low light; natural/prey-station mechanics outrank insect-scale catfish logic.",
  ),

  rule(
    "freshwater-drum-mollusk-bottom",
    "aplodinotus_grunniens",
    { forage: ["mollusks", "crustaceans"], holding: ["deep_pool", "pool_tail", "basin", "drop_off", "riprap", "point"] },
    { bottom_contact_drift: 10, bottom_contact: 11, slow_drag: 10, stationary_bait: 6, vertical_jig: 5 },
    "Freshwater drum, especially larger adults, can be strongly benthic and mollusk-focused; reinforce substrate contact.",
  ),

  rule(
    "pumpkinseed-mollusk-littoral",
    "lepomis_gibbosus",
    { forage: ["mollusks", "crustaceans"], holding: ["weed_edge", "inside_weedline", "wood", "dock_shade", "shallow_flat"] },
    { slow_drag: 10, drop_presentation: 8, live_natural_bait_suspension: 6, stationary_bait: 5, pulse_jig: 4 },
    "Pumpkinseed carry a stronger benthic/mollusk component than bluegill; favor slow littoral edge mechanics when that forage is observed.",
  ),

  rule(
    "redear-shell-bottom",
    "lepomis_microlophus",
    { forage: ["mollusks"], holding: ["weed_edge", "outside_weedline", "drop_off", "shallow_flat"] },
    { bottom_contact: 12, slow_drag: 11, drop_presentation: 7, live_natural_bait_suspension: 5, bottom_contact_drift: 9 },
    "Mollusk forage is unusually diagnostic for redear sunfish and should strongly reinforce bottom-oriented mechanics.",
  ),
  rule(
    "redear-bright-deeper-edge",
    "lepomis_microlophus",
    { waterTypes: ["stillwater"], light: ["bright"], holding: ["outside_weedline", "drop_off"] },
    { bottom_contact: 8, slow_drag: 7, drop_presentation: 5, live_natural_bait_suspension: 3 },
    "Bright clear conditions often preserve redear bottom association while shifting fish slightly deeper than bluegill-like shallow cover.",
  ),

  rule(
    "green-sunfish-stream-cover",
    "lepomis_cyanellus",
    { waterTypes: ["flowing"], holding: ["eddy", "current_break", "submerged_wood", "deep_pool"], forage: ["aquatic_insects", "crustaceans", "small_forage_fish"] },
    { pulse_jig: 9, cross_current_retrieve: 8, dead_drift: 6, stationary_bait: 5 },
    "Green sunfish are more stream-tolerant than many sunfish; reinforce compact current/cover mechanics rather than treating all Lepomis as stillwater fish.",
  ),

  rule(
    "rock-bass-rock-crustacean",
    "ambloplites_rupestris",
    { forage: ["crustaceans"], holding: ["boulder_pocket", "current_break", "rocky_shoreline", "riprap", "point", "drop_off"] },
    { bottom_contact_drift: 10, pulse_jig: 9, bottom_contact: 10, drop_presentation: 6, cross_current_retrieve: 4 },
    "Rock bass around hard substrate and crustaceans should remain more contact-oriented than generic panfish logic.",
  ),

  rule(
    "chain-pickerel-vegetation-ambush",
    "esox_niger",
    { holding: ["weed_edge", "inside_weedline", "outside_weedline", "wood", "shallow_flat", "side_channel"], forage: ["small_forage_fish", "larger_prey_fish", "amphibians"] },
    { stop_and_go: 11, subsurface_slow_roll: 9, horizontal_retrieve: 8, surface_retrieve: 5, cross_current_retrieve: 7, upstream_retrieve: 4 },
    "Chain pickerel are vegetation/slack-water ambush predators; reinforce pause-and-edge travel rather than open-pelagic search behavior.",
  ),

  rule(
    "bowfin-cover-low-light",
    "amia_calva",
    { light: ["low_light", "night"], holding: ["submerged_wood", "weed_edge", "inside_weedline", "wood", "side_channel", "inlet"] },
    { stop_and_go: 10, subsurface_slow_roll: 9, bottom_contact: 7, live_natural_bait_suspension: 6, cross_current_retrieve: 5, stationary_bait: 5 },
    "Bowfin often leave deeper cover along low-light edges; reinforce prey/cover mechanics without treating respiratory surface gulping as feeding.",
  ),

  rule(
    "longnose-gar-mobile-prey",
    "lepisosteus_osseus",
    { forage: ["small_forage_fish", "larger_prey_fish"], holding: ["run", "current_break", "shallow_flat", "point", "drop_off", "suspended_open"] },
    { cross_current_retrieve: 10, downstream_retrieve: 7, horizontal_retrieve: 10, stop_and_go: 7, live_natural_bait_suspension: 5, surface_retrieve: 2 },
    "Longnose gar are mobile fish predators; favor prey-interception mechanics while keeping surface rolling separate from actual forage evidence.",
  ),

  rule(
    "spotted-gar-vegetated-prey",
    "lepisosteus_oculatus",
    { holding: ["inside_weedline", "weed_edge", "wood", "shallow_flat", "submerged_wood", "side_channel"], forage: ["small_forage_fish", "crustaceans"] },
    { horizontal_retrieve: 9, stop_and_go: 10, live_natural_bait_suspension: 7, cross_current_retrieve: 7, pulse_jig: 4, surface_retrieve: 2 },
    "Spotted gar are more vegetation/backwater oriented than longnose gar; reinforce controlled ambush-lane mechanics.",
  ),

  rule(
    "brown-bullhead-night-bottom",
    "ameiurus_nebulosus",
    { light: ["low_light", "night"], holding: ["deep_pool", "wood", "weed_edge", "basin", "inlet", "submerged_wood"] },
    { stationary_bait: 10, bottom_contact_drift: 8, bottom_contact: 10, slow_drag: 9, live_natural_bait_suspension: 6 },
    "Brown bullhead are strongly nocturnal and bottom-oriented; reinforce scent/bottom mechanics rather than surface movement.",
  ),

  rule(
    "black-bullhead-turbid-bottom",
    "ameiurus_melas",
    { holding: ["eddy", "deep_pool", "side_channel", "basin", "wood", "shallow_flat", "inlet"] },
    { stationary_bait: 11, bottom_contact_drift: 9, bottom_contact: 11, slow_drag: 10, live_natural_bait_suspension: 6 },
    "Black bullhead are especially tolerant of turbid soft-bottom water; keep the record bottom/scent oriented even when visibility is poor.",
  ),

  rule(
    "cisco-plankton-depth-band",
    "coregonus_artedi",
    { forage: ["zooplankton", "crustaceans"], holding: ["suspended_open", "thermocline_edge", "basin"] },
    { suspend_pause: 11, trolling: 10, vertical_jig: 8, horizontal_retrieve: 6 },
    "Cisco position follows coldwater plankton and basin circulation; reinforce suspended depth-band mechanics.",
  ),
  rule(
    "cisco-bright-deeper",
    "coregonus_artedi",
    { light: ["bright"], holding: ["thermocline_edge", "basin", "drop_off"] },
    { vertical_jig: 8, suspend_pause: 7, trolling: 5, horizontal_retrieve: 2 },
    "Bright clear conditions often push cisco deeper in usable coldwater layers.",
  ),

  rule(
    "rainbow-smelt-diel-pelagic",
    "osmerus_mordax",
    { waterTypes: ["stillwater"], holding: ["suspended_open", "thermocline_edge", "basin", "drop_off"] },
    { vertical_jig: 10, suspend_pause: 10, trolling: 8, horizontal_retrieve: 6 },
    "Rainbow smelt are strongly pelagic with diel vertical movement; reinforce depth-band mechanics and keep tributary spawning runs outside the model.",
  ),

  rule(
    "white-perch-open-school",
    "morone_americana",
    { waterTypes: ["stillwater"], holding: ["basin", "drop_off", "point", "suspended_open"], forage: ["small_forage_fish", "zooplankton", "crustaceans"] },
    { horizontal_retrieve: 10, vertical_jig: 9, stop_and_go: 7, drop_presentation: 4 },
    "White perch can school offshore around forage; reinforce mobile mid-column and vertical mechanics.",
  ),
  rule(
    "white-perch-river-movement",
    "morone_americana",
    { waterTypes: ["flowing"], holding: ["tributary_mouth", "run", "deep_pool", "current_break"] },
    { cross_current_retrieve: 9, pulse_jig: 7, bottom_contact_drift: 5 },
    "River white perch use current during seasonal movement but still pause around depth and velocity transitions.",
  ),

  rule(
    "american-eel-nocturnal-cover",
    "anguilla_rostrata",
    { light: ["low_light", "night"], holding: ["deep_pool", "submerged_wood", "undercut_bank", "wood", "weed_edge", "basin", "drop_off"] },
    { stationary_bait: 11, bottom_contact_drift: 9, bottom_contact: 11, slow_drag: 10, live_natural_bait_suspension: 6 },
    "American eel are nocturnal, benthic, and shelter-oriented; reinforce near-bottom food mechanics rather than predator-style open-water search.",
  ),

  rule(
    "american-shad-migration-interception",
    "alosa_sapidissima",
    { waterTypes: ["flowing"], seasons: ["spring", "early_summer"], holding: ["run", "pool_head", "current_break", "tributary_mouth", "tailwater"] },
    { cross_current_retrieve: 11, swing: 9, downstream_retrieve: 8, pulse_jig: 5 },
    "Freshwater adult shad are on an anadromous migration; reinforce interception/reaction mechanics without pretending the run proves active feeding or exposing aggregation sites.",
  ),

  rule(
    "lake-sturgeon-benthic-regulated",
    "acipenser_fulvescens",
    { holding: ["deep_pool", "run", "current_break", "basin", "drop_off", "submerged_hump"] },
    { stationary_bait: 10, bottom_contact_drift: 10, bottom_contact: 11, slow_drag: 10, live_natural_bait_suspension: 5 },
    "Lake sturgeon are strongly benthic; reinforce substrate mechanics while targetContext continues to require current jurisdiction verification.",
  ),

  rule(
    "redbreast-current-insects",
    "lepomis_auritus",
    { waterTypes: ["flowing"], holding: ["pool_tail", "run", "current_break", "boulder_pocket"], forage: ["aquatic_insects", "crustaceans"] },
    { dead_drift: 9, pulse_jig: 8, stationary_bait: 5 },
    "Redbreast sunfish are more comfortable in moving water than bluegill; reinforce current-delivered insect/crustacean mechanics.",
  ),

  rule(
    "warmouth-cover-ambush",
    "lepomis_gulosus",
    { holding: ["submerged_wood", "wood", "weed_edge", "inside_weedline", "dock_shade", "side_channel"], forage: ["small_forage_fish", "crustaceans", "aquatic_insects"] },
    { pulse_jig: 8, cross_current_retrieve: 6, drop_presentation: 10, stop_and_go: 8, slow_drag: 5, surface_retrieve: 3 },
    "Warmouth are cover ambush fish; reinforce precise wood/vegetation placement and short prey movement rather than open-water panfish logic.",
  ),

  rule(
    "yellow-bullhead-night-bottom",
    "ameiurus_natalis",
    { light: ["low_light", "night"], holding: ["eddy", "side_channel", "deep_pool", "submerged_wood", "wood", "weed_edge", "shallow_flat", "basin"] },
    { stationary_bait: 10, bottom_contact_drift: 8, bottom_contact: 10, slow_drag: 9, live_natural_bait_suspension: 6 },
    "Yellow bullhead are bottom-oriented and commonly move shallower at night in slow vegetated water.",
  ),

  rule(
    "shortnose-gar-backwater-prey",
    "lepisosteus_platostomus",
    { forage: ["small_forage_fish", "larger_prey_fish"], holding: ["side_channel", "eddy", "deep_pool", "current_break", "shallow_flat", "weed_edge", "inlet"] },
    { cross_current_retrieve: 10, downstream_retrieve: 7, stationary_bait: 5, horizontal_retrieve: 10, stop_and_go: 8, live_natural_bait_suspension: 5 },
    "Shortnose gar are turbidity-tolerant river/backwater predators; reinforce prey interception in slower margins and open backwater lanes.",
  ),

  rule(
    "yellow-bass-schooling-depth",
    "morone_mississippiensis",
    { holding: ["deep_pool", "eddy", "basin", "suspended_open", "drop_off", "point"], forage: ["small_forage_fish", "zooplankton"] },
    { cross_current_retrieve: 8, pulse_jig: 7, horizontal_retrieve: 10, vertical_jig: 9, stop_and_go: 7 },
    "Yellow bass are schooling mid-column fish but use quieter river pools more than white bass; reinforce depth and school-tracking mechanics within reviewed families.",
  ),

  rule(
    "wiper-pelagic-forage",
    "morone_hybrid_wiper",
    { waterTypes: ["stillwater"], holding: ["suspended_open", "point", "drop_off", "thermocline_edge"], forage: ["small_forage_fish"] },
    { horizontal_retrieve: 11, trolling: 10, stop_and_go: 8, vertical_jig: 7 },
    "Hybrid striped bass are stocked pelagic predators; verified fish forage should strongly reinforce mobile depth-controlled pursuit.",
  ),
  rule(
    "wiper-current-edge",
    "morone_hybrid_wiper",
    { waterTypes: ["flowing"], holding: ["tailwater", "current_break", "run", "tributary_mouth", "deep_pool"] },
    { cross_current_retrieve: 11, downstream_retrieve: 8, swing: 7, pulse_jig: 5 },
    "Wipers strongly use moving-water forage funnels; reinforce current-edge mechanics without inferring natural reproduction from spring movement.",
  ),

  rule(
    "goldeye-lowlight-surface",
    "hiodon_alosoides",
    { light: ["low_light", "night"], forage: ["aquatic_insects", "emerging_insects", "terrestrial_insects"] },
    { surface_drift: 12, swing: 6, cross_current_retrieve: 4, surface_retrieve: 11, horizontal_retrieve: 4 },
    "Goldeye's large light-sensitive eyes and upper-column feeding make verified insect input under low light a strong surface distinction.",
  ),
  rule(
    "goldeye-mobile-prey",
    "hiodon_alosoides",
    { forage: ["small_forage_fish"], holding: ["run", "current_break", "pool_tail", "suspended_open", "drop_off"] },
    { cross_current_retrieve: 10, downstream_retrieve: 7, horizontal_retrieve: 10, stop_and_go: 7 },
    "When fish prey is observed, goldeye can shift from insect drift to mobile mid-column interception.",
  ),

  rule(
    "mooneye-clear-drift",
    "hiodon_tergisus",
    { waterTypes: ["flowing"], forage: ["aquatic_insects", "emerging_insects", "terrestrial_insects"], holding: ["run", "pool_tail", "current_break", "seam"] },
    { dead_drift: 10, surface_drift: 10, swing: 6, cross_current_retrieve: 3 },
    "Mooneye in clearer river habitat retain a stronger conventional drift/surface insect identity than goldeye.",
  ),
  rule(
    "mooneye-mobile-prey",
    "hiodon_tergisus",
    { forage: ["small_forage_fish"], holding: ["current_break", "deep_pool", "drop_off", "shallow_flat"] },
    { cross_current_retrieve: 9, horizontal_retrieve: 9, stop_and_go: 7, swing: 4 },
    "Observed fish forage can move mooneye toward mobile prey mechanics without importing goldeye's turbidity assumptions.",
  ),

  rule(
    "bigmouth-buffalo-plankton",
    "ictiobus_cyprinellus",
    { waterTypes: ["stillwater"], forage: ["zooplankton"], holding: ["basin", "shallow_flat", "inlet", "drop_off"] },
    { suspended_stationary: 12, bottom_contact: 2, slow_drag: 2 },
    "Bigmouth buffalo are unusually plankton-oriented for buffalo fishes; verified zooplankton should strongly elevate suspension mechanics where reviewed.",
  ),
  rule(
    "bigmouth-buffalo-benthic",
    "ictiobus_cyprinellus",
    { forage: ["aquatic_insects", "crustaceans", "worms_annelids"], holding: ["deep_pool", "eddy", "current_break", "weed_edge", "drop_off"] },
    { stationary_bait: 8, bottom_contact_drift: 9, bottom_contact: 10, slow_drag: 9, suspended_stationary: 2 },
    "When benthic forage is observed, bigmouth buffalo should not be forced into a plankton-only interpretation.",
  ),

  rule(
    "smallmouth-buffalo-benthic",
    "ictiobus_bubalus",
    { forage: ["aquatic_insects", "crustaceans", "worms_annelids", "mollusks"], holding: ["deep_pool", "run", "current_break", "pool_tail", "drop_off", "basin", "point"] },
    { bottom_contact_drift: 11, stationary_bait: 8, bottom_contact: 11, slow_drag: 10, live_natural_bait_suspension: 4 },
    "Smallmouth buffalo are strongly benthic and should remain distinct from both common carp and plankton-oriented bigmouth buffalo.",
  ),

  rule(
    "shorthead-redhorse-clean-substrate",
    "moxostoma_macrolepidotum",
    { forage: ["aquatic_insects", "mollusks", "crustaceans", "worms_annelids"], holding: ["riffle_to_run", "run", "pool_tail", "current_break", "deep_pool", "rocky_shoreline", "drop_off"] },
    { bottom_contact_drift: 11, dead_drift: 7, stationary_bait: 6, bottom_contact: 11, slow_drag: 10 },
    "Shorthead redhorse are clean-substrate benthic feeders; reinforce bottom/current mechanics outside spring spawning aggregations.",
  ),
];

export function matchingSpeciesWeightOverrideExpansion(
  input: ScenarioInput,
  thermalState: ThermalState,
): SpeciesWeightOverrideRule[] {
  return SPECIES_WEIGHT_OVERRIDES_EXPANSION.filter((candidate) =>
    matchesOverrideRule(candidate, input, thermalState),
  );
}
