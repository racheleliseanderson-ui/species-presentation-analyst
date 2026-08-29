import type {
  PopulationContextInput,
  PresentationId,
  ScenarioInput,
  SpeciesRecord,
} from "../protocol/types.ts";
import type { WaterType } from "../protocol/vocab.ts";

export const REGIONAL_POPULATION_MODEL_VERSION = "RPC-1.0" as const;

type BiasTable = Partial<Record<PresentationId, number>>;

export type PopulationContextProfile = {
  id: string;
  speciesId: string;
  label: string;
  regionClass: string;
  systemArchetype: string;
  lifeHistory: string;
  populationOrigin: string;
  waterTypes: WaterType[];
  bias: BiasTable;
  positioning: string;
  invalidators: string[];
  note: string;
  sources: { label: string; class: "agency" | "peer_reviewed" | "synthesis" }[];
  reviewedAt: string;
};

/**
 * RPC-1.0 is intentionally coarse and public-safe.
 *
 * Profiles are broad biological/system archetypes, never named reaches, coordinates,
 * spawning sites, or secret locations. They are applied only when explicitly declared
 * by the user or carried in from a reviewed upstream packet. Water names and
 * jurisdictions never auto-resolve to a profile.
 */
export const POPULATION_CONTEXT_PROFILES: PopulationContextProfile[] = [
  {
    id: "striped-atlantic-anadromous",
    speciesId: "morone_saxatilis",
    label: "Atlantic anadromous / coastal-river",
    regionClass: "atlantic_coastal",
    systemArchetype: "coastal_river_estuary",
    lifeHistory: "anadromous",
    populationOrigin: "native",
    waterTypes: ["flowing"],
    bias: { cross_current_retrieve: 10, downstream_retrieve: 8, swing: 7, pulse_jig: 4 },
    positioning:
      "Treat this as a migratory coastal-river population: current, temperature, salinity transition, and migration stage matter more than reservoir-style basin structure.",
    invalidators: [
      "Current Atlantic striped bass regulations and seasonal closures supersede this biological profile.",
      "Spawning reaches, staging concentrations, and migration bottlenecks are never named as target locations.",
    ],
    note:
      "NOAA describes Atlantic striped bass as anadromous, with adults using coastal/estuarine habitat and returning to freshwater or brackish rivers to spawn.",
    sources: [
      { label: "NOAA Fisheries Atlantic striped bass species profile", class: "agency" },
      { label: "Atlantic States Marine Fisheries Commission striped bass management/life history", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "striped-landlocked-reservoir",
    speciesId: "morone_saxatilis",
    label: "Landlocked reservoir",
    regionClass: "inland_reservoir",
    systemArchetype: "reservoir",
    lifeHistory: "landlocked",
    populationOrigin: "stocked_or_established",
    waterTypes: ["stillwater"],
    bias: { trolling: 10, horizontal_retrieve: 9, vertical_jig: 7, stop_and_go: 5 },
    positioning:
      "Treat this as a pelagic reservoir population: forage depth, temperature-oxygen habitat, points, basin edges, and open-water travel matter more than coastal migration logic.",
    invalidators: [
      "Stocking history and current reservoir population status must be verified; habitat alone does not prove striped bass are present.",
      "Summer thermal/oxygen squeeze can turn apparently occupied water into high-stress habitat.",
    ],
    note:
      "Landlocked striped bass populations are management-created in many reservoirs and behave as pelagic forage-followers rather than coastal migrants.",
    sources: [
      { label: "NOAA Fisheries striped bass range/life-history overview", class: "agency" },
      { label: "State reservoir striped bass management literature", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "cutthroat-interior-resident-fluvial",
    speciesId: "oncorhynchus_clarkii",
    label: "Interior resident / fluvial",
    regionClass: "interior_west",
    systemArchetype: "cold_river_stream",
    lifeHistory: "resident_or_fluvial",
    populationOrigin: "native_or_conservation_managed",
    waterTypes: ["flowing"],
    bias: { dead_drift: 8, suspended_drift: 6, surface_drift: 5, swing: 3 },
    positioning:
      "Use river drift lanes, seams, and connected coldwater habitat as the population frame; do not import lake-travel assumptions into a resident/fluvial declaration.",
    invalidators: [
      "Cutthroat subspecies and hybridization status remain basin-specific and must be verified separately.",
      "Spring spawning tributaries and migration bottlenecks are conservation context, not target layers.",
    ],
    note:
      "Westslope cutthroat trout can express resident, fluvial, and adfluvial life histories; this profile represents the river-resident/fluvial side of that split.",
    sources: [
      { label: "U.S. Fish & Wildlife Service Westslope Cutthroat Trout profile", class: "agency" },
      { label: "Montana fisheries management plan cutthroat life-history summary", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "cutthroat-adfluvial-lake",
    speciesId: "oncorhynchus_clarkii",
    label: "Adfluvial / lake-connected",
    regionClass: "interior_west",
    systemArchetype: "natural_lake_connected_tributary",
    lifeHistory: "adfluvial",
    populationOrigin: "native_or_conservation_managed",
    waterTypes: ["stillwater"],
    bias: { horizontal_retrieve: 8, trolling: 7, stop_and_go: 5, surface_retrieve: 4 },
    positioning:
      "Use lake depth edges, inlets/outlets, and mobile forage layers as the adult habitat frame while treating tributary spawning movement as protected context.",
    invalidators: [
      "Do not infer a tributary or spawning destination from the adfluvial label.",
      "Subspecies, lake productivity, and hybridization can materially change this profile's fit.",
    ],
    note:
      "Adfluvial cutthroat migrate between lake habitat and spawning/rearing tributaries; adult lake behavior is distinct from resident stream fish.",
    sources: [
      { label: "U.S. Fish & Wildlife Service Westslope Cutthroat Trout profile", class: "agency" },
      { label: "Montana fisheries management plan cutthroat life-history summary", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "smallmouth-cool-river",
    speciesId: "micropterus_dolomieu",
    label: "Cool clear river",
    regionClass: "interior_north",
    systemArchetype: "rocky_river",
    lifeHistory: "river_resident",
    populationOrigin: "native_or_established",
    waterTypes: ["flowing"],
    bias: { cross_current_retrieve: 10, bottom_contact_drift: 8, pulse_jig: 7, upstream_retrieve: 5 },
    positioning:
      "Current breaks, seams, boulder transitions, and current-delivered crayfish or forage are primary mechanical structure for this population archetype.",
    invalidators: [
      "A river label does not justify fishing spawning beds or known seasonal concentration points.",
      "Very warm or unusually low flow can collapse otherwise typical shallow-current behavior.",
    ],
    note:
      "Smallmouth are strongly associated with cool, clear rocky streams in parts of their range; current-facing mechanics deserve more weight than reservoir offshore logic.",
    sources: [
      { label: "Missouri Department of Conservation smallmouth bass habitat profile", class: "agency" },
      { label: "USGS / provincial smallmouth assessments", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "smallmouth-reservoir-offshore",
    speciesId: "micropterus_dolomieu",
    label: "Rocky reservoir / offshore structure",
    regionClass: "inland_reservoir",
    systemArchetype: "reservoir",
    lifeHistory: "reservoir_resident",
    populationOrigin: "native_or_introduced",
    waterTypes: ["stillwater"],
    bias: { bottom_contact: 8, vertical_jig: 7, horizontal_retrieve: 6, drop_presentation: 5, stop_and_go: 4 },
    positioning:
      "Points, humps, channel-edge breaks, and rocky depth transitions receive more weight than river-current lanes; fish can use substantially deeper structure in stable reservoirs.",
    invalidators: [
      "Reservoir water-level changes can make yesterday's structural edge biologically irrelevant.",
      "Stocking/introduction history matters outside the native range.",
    ],
    note:
      "Reservoir smallmouth retain their rock association but use offshore structure and depth transitions differently from current-oriented river populations.",
    sources: [
      { label: "Missouri Department of Conservation smallmouth bass habitat profile", class: "agency" },
      { label: "State reservoir black-bass management literature", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "walleye-northern-natural-lake",
    speciesId: "sander_vitreus",
    label: "Northern natural lake",
    regionClass: "northern_inland",
    systemArchetype: "natural_lake",
    lifeHistory: "lake_resident",
    populationOrigin: "native_or_established",
    waterTypes: ["stillwater"],
    bias: { bottom_contact: 8, slow_drag: 8, vertical_jig: 6, trolling: 5, live_natural_bait_suspension: 3 },
    positioning:
      "Rock, points, breaklines, basin edges, light penetration, and forage depth define the lake frame; low light can move fish shallower without changing the population archetype.",
    invalidators: [
      "Natural-lake recruitment and forage communities vary sharply among waters; do not infer abundance from habitat quality.",
      "Spawning reefs and spring concentrations remain excluded from target guidance.",
    ],
    note:
      "This profile strengthens structure/depth mechanics for lake-resident walleye without turning low-light biology into a bite prediction.",
    sources: [
      { label: "Great Lakes / state walleye assessments", class: "agency" },
      { label: "Colby et al. walleye biology", class: "peer_reviewed" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "walleye-large-river",
    speciesId: "sander_vitreus",
    label: "Large-river / current population",
    regionClass: "interior_large_river",
    systemArchetype: "large_river",
    lifeHistory: "river_resident_or_migratory",
    populationOrigin: "native_or_established",
    waterTypes: ["flowing"],
    bias: { bottom_contact_drift: 10, pulse_jig: 9, cross_current_retrieve: 5, downstream_retrieve: 4 },
    positioning:
      "Current-washed rock, deep runs, channel edges, and velocity breaks outrank reservoir-style basin searching in this declared population context.",
    invalidators: [
      "Navigation structures and dams may create concentrations; this profile does not name those locations.",
      "Spring migration/spawning concentrations are explicitly excluded from target guidance.",
    ],
    note:
      "Large-river walleye use hard bottom, current breaks, and deeper current habitat differently from lake-resident populations.",
    sources: [
      { label: "Missouri Department of Conservation Upper Mississippi walleye habitat guidance", class: "agency" },
      { label: "Great Lakes / state walleye assessments", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "bluecat-native-large-river",
    speciesId: "ictalurus_furcatus",
    label: "Native large-river",
    regionClass: "interior_large_river",
    systemArchetype: "large_river",
    lifeHistory: "river_resident_migratory",
    populationOrigin: "native",
    waterTypes: ["flowing"],
    bias: { stationary_bait: 9, bottom_contact_drift: 9, pulse_jig: 4 },
    positioning:
      "Channel current, deep pools, current breaks, and silt-free main-river structure define this archetype more than reservoir pelagic roaming.",
    invalidators: [
      "Seasonal river movement can be extensive; one channel/depth class is not a year-round rule.",
      "Do not convert lock, dam, or concentration structure into a hotspot map.",
    ],
    note:
      "Missouri describes blue catfish as a big-river fish favoring current, pools, and silt-free sand/gravel/rubble substrates.",
    sources: [
      { label: "Missouri Department of Conservation blue catfish profile", class: "agency" },
      { label: "USGS blue catfish movement and habitat literature", class: "peer_reviewed" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "bluecat-reservoir-pelagic",
    speciesId: "ictalurus_furcatus",
    label: "Reservoir / forage-roaming",
    regionClass: "inland_reservoir",
    systemArchetype: "reservoir",
    lifeHistory: "reservoir_resident",
    populationOrigin: "stocked_or_established",
    waterTypes: ["stillwater"],
    bias: { live_natural_bait_suspension: 8, vertical_jig: 7, bottom_contact: 4, slow_drag: 3 },
    positioning:
      "Reservoir adults can occupy multiple depths and suspend with forage; do not force every blue catfish reading to the bottom if the declared evidence supports open-water prey.",
    invalidators: [
      "Reservoir populations may be stocked or introduced; verify local ecological and harvest status.",
      "Forage schools are mobile biological structure, not coordinates or a persistent hotspot.",
    ],
    note:
      "State reservoir guidance documents blue catfish using the full water column in large lakes and associating with abundant shad forage.",
    sources: [
      { label: "Missouri Department of Conservation catfish reservoir guidance", class: "agency" },
      { label: "Texas Parks and Wildlife reservoir survey reports for blue catfish and shad forage", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "laketrout-great-lakes-pelagic",
    speciesId: "salvelinus_namaycush",
    label: "Great Lakes pelagic",
    regionClass: "great_lakes",
    systemArchetype: "great_lake",
    lifeHistory: "large_lake_resident",
    populationOrigin: "native_or_restored",
    waterTypes: ["stillwater"],
    bias: { trolling: 10, vertical_jig: 8, suspend_pause: 7, horizontal_retrieve: 6 },
    positioning:
      "Large-scale pelagic depth bands, reefs/humps outside spawning context, and prey distributions deserve more weight than a small-inland-lake shoreline frame.",
    invalidators: [
      "Great Lakes stock, rehabilitation status, and local regulations vary by lake and management unit.",
      "Known spawning reefs are conservation context, not target outputs.",
    ],
    note:
      "Great Lakes lake trout occupy very large depth ranges and track cold water and pelagic prey; summer depth can exceed typical inland-lake scales.",
    sources: [
      { label: "Michigan DNR lake trout species profile", class: "agency" },
      { label: "Great Lakes lake trout assessments", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "laketrout-inland-natural-lake",
    speciesId: "salvelinus_namaycush",
    label: "Inland natural lake",
    regionClass: "northern_inland",
    systemArchetype: "deep_natural_lake",
    lifeHistory: "inland_lake_resident",
    populationOrigin: "native_or_stocked",
    waterTypes: ["stillwater"],
    bias: { vertical_jig: 8, trolling: 6, suspend_pause: 5, horizontal_retrieve: 4 },
    positioning:
      "Coldwater volume can be much smaller than in a Great Lake, so thermocline, oxygen, basin depth, and discrete rocky structure constrain usable habitat more tightly.",
    invalidators: [
      "Cold water without adequate oxygen is not usable habitat.",
      "Small inland populations can be sensitive to warming, exploitation, and introduced forage changes.",
    ],
    note:
      "Minnesota documents naturally reproducing inland lake trout populations as strongly constrained by available cold thermal habitat; Michigan also distinguishes inland lake populations from the Great Lakes fishery.",
    sources: [
      { label: "Minnesota DNR Sentinel Lakes lake trout habitat assessments", class: "agency" },
      { label: "Michigan DNR lake trout species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "cisco-great-lakes",
    speciesId: "coregonus_artedi",
    label: "Great Lakes pelagic",
    regionClass: "great_lakes",
    systemArchetype: "great_lake",
    lifeHistory: "large_lake_pelagic",
    populationOrigin: "native",
    waterTypes: ["stillwater"],
    bias: { vertical_jig: 8, trolling: 8, suspend_pause: 7, horizontal_retrieve: 6 },
    positioning:
      "Treat occupied depth as a moving pelagic layer governed by season, time of day, life stage, plankton, and basin-scale temperature/oxygen rather than shoreline cover.",
    invalidators: [
      "A cisco school is mobile biological structure and never a coordinate output.",
      "Spawning depth varies widely among stocks; spawning concentrations are not a place to target.",
    ],
    note:
      "USFWS describes Great Lakes cisco as pelagic zooplankton feeders that can occupy nearly the full depth range depending on season, time of day, and life stage.",
    sources: [
      { label: "U.S. Fish & Wildlife Service Cisco species profile", class: "agency" },
      { label: "Peer-reviewed cisco oxythermal habitat literature", class: "peer_reviewed" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "cisco-northern-inland-lake",
    speciesId: "coregonus_artedi",
    label: "Northern inland lake",
    regionClass: "northern_inland",
    systemArchetype: "natural_lake",
    lifeHistory: "inland_lake_pelagic",
    populationOrigin: "native_or_established",
    waterTypes: ["stillwater"],
    bias: { suspend_pause: 9, vertical_jig: 8, horizontal_retrieve: 6, trolling: 4 },
    positioning:
      "In a smaller inland system, the usable pelagic layer is more tightly bounded by lake depth, oxygen, and seasonal stratification than in the Great Lakes.",
    invalidators: [
      "Verify that the water actually supports cisco; suitable temperature alone does not establish presence.",
      "Introduced predators or forage competitors can materially change depth use and population viability.",
    ],
    note:
      "The same pelagic biology applies inland, but the physical scale and available oxythermal refuge can compress the population into a narrower usable layer.",
    sources: [
      { label: "U.S. Fish & Wildlife Service Cisco species profile", class: "agency" },
      { label: "State inland cisco and coldwater-lake assessments", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "mountain-whitefish-river",
    speciesId: "prosopium_williamsoni",
    label: "Interior river population",
    regionClass: "interior_west",
    systemArchetype: "cold_river",
    lifeHistory: "river_resident_or_fluvial",
    populationOrigin: "native",
    waterTypes: ["flowing"],
    bias: { bottom_contact_drift: 10, dead_drift: 7, tight_line_drift: 7, suspended_drift: 4 },
    positioning:
      "Benthic food delivery through riffle-run transitions, pool tails, and deeper wintering water is the primary frame for this river population archetype.",
    invalidators: [
      "Late-fall/winter spawning riffles are not target recommendations.",
      "Do not substitute generic trout surface behavior for the species' stronger benthic tendency.",
    ],
    note:
      "Mountain whitefish in rivers are consistently bottom/lower-column oriented and use moderate runs and riffle transitions for feeding.",
    sources: [
      { label: "USGS Mountain Whitefish species and habitat literature", class: "agency" },
      { label: "Idaho Fish and Game mountain whitefish management literature", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
  {
    id: "mountain-whitefish-lake",
    speciesId: "prosopium_williamsoni",
    label: "Interior lake population",
    regionClass: "interior_west",
    systemArchetype: "cold_natural_lake",
    lifeHistory: "lake_resident_or_connected",
    populationOrigin: "native",
    waterTypes: ["stillwater"],
    bias: { slow_drag: 9, vertical_jig: 8, drop_presentation: 5, live_natural_bait_suspension: 4 },
    positioning:
      "Lake populations remain lower-column/benthic but shift the mechanical problem from river drift to depth edges, rocky shoreline, basin, and inlet-associated food delivery.",
    invalidators: [
      "Do not infer a spawning inlet or tributary from the lake profile.",
      "Local lake productivity and depth can materially change seasonal vertical use.",
    ],
    note:
      "The lake profile preserves mountain whitefish's benthic identity while removing river-current assumptions.",
    sources: [
      { label: "USGS Mountain Whitefish species and habitat literature", class: "agency" },
      { label: "Idaho Fish and Game mountain whitefish management literature", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
  },
];

export const POPULATION_CONTEXT_BY_ID = Object.fromEntries(
  POPULATION_CONTEXT_PROFILES.map((profile) => [profile.id, profile]),
) as Record<string, PopulationContextProfile>;

export function populationProfilesForSpecies(
  speciesId: string,
  waterType?: WaterType,
): PopulationContextProfile[] {
  return POPULATION_CONTEXT_PROFILES.filter(
    (profile) =>
      profile.speciesId === speciesId &&
      (!waterType || profile.waterTypes.includes(waterType)),
  );
}

export function resolvePopulationContext(
  input: ScenarioInput,
  species: SpeciesRecord,
): { profile: PopulationContextProfile | null; error?: string } {
  const declared: PopulationContextInput | null | undefined = input.populationContext;
  if (!declared?.profileId) return { profile: null };
  const profile = POPULATION_CONTEXT_BY_ID[declared.profileId];
  if (!profile) {
    return {
      profile: null,
      error: "That regional or population context is not one of our reviewed profiles. We do not infer one from a water name or a location.",
    };
  }
  if (profile.speciesId !== species.id) {
    return {
      profile: null,
      error: `${profile.label} is not a reviewed population context for ${species.commonNames[0]}.`,
    };
  }
  if (!profile.waterTypes.includes(input.waterType)) {
    return {
      profile: null,
      error: `${profile.label} is not reviewed for ${input.waterType}. Change the population context or water type rather than forcing the profile.`,
    };
  }
  return { profile };
}
