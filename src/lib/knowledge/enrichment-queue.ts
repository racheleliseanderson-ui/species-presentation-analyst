/**
 * AFP-Q-1.0 enrichment queue.
 *
 * This is the seed contract for remaining Species Profile overlays.
 * It does not invent identification, diet, fight, or food facts.
 * A queued species keeps visible gaps until a later reviewed dossier wave.
 *
 * Wave 01 is already shipped (26 lookalikes). Waves 02–05 rank the remaining
 * 49 by field confusion and how often anglers actually open the record.
 */

export const ENRICHMENT_QUEUE_VERSION = "AFP-Q-1.0" as const;

export type EnrichmentWaveStatus = "shipped" | "queued";

export type OverlayLayerId =
  | "identification"
  | "behavior"
  | "diet"
  | "seasonal_calendar"
  | "fight"
  | "food_value";

export const PRIMARY_OVERLAY_LAYERS: OverlayLayerId[] = [
  "identification",
  "behavior",
  "diet",
  "seasonal_calendar",
];

export const FOLLOW_ON_OVERLAY_LAYERS: OverlayLayerId[] = ["fight", "food_value"];

export type DistinctionGroup = {
  id: string;
  label: string;
  speciesIds: string[];
  /** Earlier-wave catalog ids this group must still distinguish. */
  alreadyCoveredIds?: string[];
  /**
   * Researcher contract — not field copy.
   * Future dossiers must not inherit these notes across the named boundary.
   */
  mustNotCopy: string[];
};

export type EnrichmentWave = {
  id: string;
  label: string;
  status: EnrichmentWaveStatus;
  rationale: string;
  requiredLayers: OverlayLayerId[];
  followOnLayers: OverlayLayerId[];
  speciesIds: string[];
  groups: DistinctionGroup[];
};

export const WAVE_01_GROUPS: DistinctionGroup[] = [
  {
    id: "trout",
    label: "Rainbow trout vs cutthroat trout",
    speciesIds: ["oncorhynchus_mykiss", "oncorhynchus_clarkii"],
    mustNotCopy: [
      "do not copy inland rainbow leaping notes onto cutthroat",
      "do not invent slash / basibranchial characters from generative imagery",
    ],
  },
  {
    id: "nerka",
    label: "Kokanee vs anadromous sockeye",
    speciesIds: ["oncorhynchus_nerka_kokanee", "oncorhynchus_nerka_anadromous"],
    mustNotCopy: [
      "do not copy kokanee light-tackle notes onto returning sockeye",
      "do not copy NOAA ocean-sockeye flavor onto kokanee",
      "do not treat freshwater sockeye adults as feeding trout",
    ],
  },
  {
    id: "black_bass",
    label: "Largemouth vs smallmouth vs spotted bass",
    speciesIds: ["micropterus_nigricans", "micropterus_dolomieu", "micropterus_punctulatus"],
    mustNotCopy: [
      "do not copy smallmouth aerial-acrobat notes onto spotted or largemouth",
      "do not collapse jaw / dorsal / tongue keys",
    ],
  },
  {
    id: "morone",
    label: "Striped bass vs white bass vs white perch vs wiper",
    speciesIds: ["morone_saxatilis", "morone_chrysops", "morone_americana", "morone_hybrid_wiper"],
    mustNotCopy: [
      "do not copy striper nosedive / mass onto white bass, white perch, or yellow bass",
      "do not collapse tongue-patch and stripe-continuity keys",
    ],
  },
  {
    id: "yellow_bass",
    label: "Yellow bass vs white bass",
    speciesIds: ["morone_mississippiensis"],
    mustNotCopy: [
      "do not copy white-bass or striped-bass fight notes onto yellow bass",
      "do not collapse yellow bass with white bass on stripe count alone",
    ],
  },
  {
    id: "coregonine",
    label: "Cisco vs lake whitefish",
    speciesIds: ["coregonus_artedi", "coregonus_clupeaformis"],
    mustNotCopy: [
      "do not copy lake-whitefish benthic / culinary notes onto cisco",
      "do not copy cisco pelagic-plankton diet onto lake whitefish",
    ],
  },
  {
    id: "hiodontid",
    label: "Goldeye vs mooneye",
    speciesIds: ["hiodon_alosoides", "hiodon_tergisus"],
    mustNotCopy: ["do not copy Winnipeg smoked-goldeye culinary identity onto mooneye"],
  },
  {
    id: "buffalo_carp",
    label: "Common carp vs bigmouth buffalo vs smallmouth buffalo",
    speciesIds: ["cyprinus_carpio", "ictiobus_cyprinellus", "ictiobus_bubalus"],
    mustNotCopy: [
      "do not copy carp fight notes onto buffalo",
      "do not copy USGS Asian-carp flesh notes onto common carp",
      "do not collapse bigmouth filter feeding with smallmouth benthic feeding",
    ],
  },
  {
    id: "gar",
    label: "Longnose vs spotted vs shortnose vs alligator gar",
    speciesIds: [
      "lepisosteus_osseus",
      "lepisosteus_oculatus",
      "lepisosteus_platostomus",
      "atractosteus_spatula",
    ],
    mustNotCopy: [
      "do not copy alligator-gar mass onto shortnose or spotted gar",
      "do not treat toxic eggs as a waterbody contaminant advisory",
    ],
  },
  {
    id: "bullhead",
    label: "Brown vs black vs yellow bullhead",
    speciesIds: ["ameiurus_nebulosus", "ameiurus_melas", "ameiurus_natalis"],
    mustNotCopy: [
      "do not copy brown-bullhead table-fare notes onto black or yellow bullhead",
      "do not copy channel-catfish river-current fight onto bullheads",
    ],
  },
];

const WAVE_01_SPECIES_IDS = [
  "oncorhynchus_mykiss",
  "oncorhynchus_clarkii",
  "oncorhynchus_nerka_kokanee",
  "oncorhynchus_nerka_anadromous",
  "micropterus_nigricans",
  "micropterus_dolomieu",
  "micropterus_punctulatus",
  "morone_saxatilis",
  "morone_chrysops",
  "morone_americana",
  "morone_hybrid_wiper",
  "morone_mississippiensis",
  "coregonus_artedi",
  "coregonus_clupeaformis",
  "hiodon_alosoides",
  "hiodon_tergisus",
  "cyprinus_carpio",
  "ictiobus_cyprinellus",
  "ictiobus_bubalus",
  "lepisosteus_osseus",
  "lepisosteus_oculatus",
  "lepisosteus_platostomus",
  "atractosteus_spatula",
  "ameiurus_nebulosus",
  "ameiurus_melas",
  "ameiurus_natalis",
];

export const ENRICHMENT_WAVES: EnrichmentWave[] = [
  {
    id: "wave_01",
    label: "Lookalike groups",
    status: "shipped",
    rationale:
      "Highest-confusion pairs and triples that collapse in the field: trout slashes, kokanee vs sockeye, black bass, Morone, coregonines, gars, bullheads, carp vs buffalo.",
    requiredLayers: [...PRIMARY_OVERLAY_LAYERS, ...FOLLOW_ON_OVERLAY_LAYERS],
    followOnLayers: [],
    speciesIds: WAVE_01_SPECIES_IDS,
    groups: WAVE_01_GROUPS,
  },
  {
    id: "wave_02",
    label: "Open-first salmonids, pike, walleye, and large catfish",
    status: "queued",
    rationale:
      "The remaining records people actually open, plus the lookalikes that sit next to them: brown/brook/lake trout, steelhead vs inland rainbow, Chinook vs Coho, walleye vs sauger, pike vs muskie vs pickerel, channel vs blue vs flathead, yellow perch vs white perch.",
    requiredLayers: PRIMARY_OVERLAY_LAYERS,
    followOnLayers: FOLLOW_ON_OVERLAY_LAYERS,
    speciesIds: [
      "salmo_trutta",
      "salvelinus_fontinalis",
      "salvelinus_namaycush",
      "oncorhynchus_mykiss_steelhead",
      "oncorhynchus_tshawytscha",
      "oncorhynchus_kisutch",
      "sander_vitreus",
      "sander_canadensis",
      "esox_lucius",
      "esox_masquinongy",
      "esox_niger",
      "ictalurus_punctatus",
      "ictalurus_furcatus",
      "pylodictis_olivaris",
      "perca_flavescens",
    ],
    groups: [
      {
        id: "inland_trout_char",
        label: "Brown trout vs brook trout vs lake trout",
        speciesIds: ["salmo_trutta", "salvelinus_fontinalis", "salvelinus_namaycush"],
        alreadyCoveredIds: ["oncorhynchus_mykiss", "oncorhynchus_clarkii"],
        mustNotCopy: [
          "do not copy inland rainbow leaping notes onto brown, brook, or lake trout",
          "do not copy brown-trout nocturnal identity onto brook trout",
          "do not copy lake-trout summer pelagic depth onto stream brown or brook trout",
        ],
      },
      {
        id: "steelhead_rainbow",
        label: "Steelhead vs inland rainbow",
        speciesIds: ["oncorhynchus_mykiss_steelhead"],
        alreadyCoveredIds: ["oncorhynchus_mykiss"],
        mustNotCopy: [
          "do not treat steelhead as inland rainbow with a different name",
          "do not infer a current insect hatch as the reason a winter steelhead is present",
        ],
      },
      {
        id: "pacific_kings_coho",
        label: "Chinook vs Coho",
        speciesIds: ["oncorhynchus_tshawytscha", "oncorhynchus_kisutch"],
        alreadyCoveredIds: ["oncorhynchus_nerka_anadromous", "oncorhynchus_nerka_kokanee"],
        mustNotCopy: [
          "do not collapse Chinook and Coho gumline / tail-spot characters",
          "do not copy kokanee zooplankton diet onto returning Chinook or Coho",
        ],
      },
      {
        id: "sander",
        label: "Walleye vs sauger",
        speciesIds: ["sander_vitreus", "sander_canadensis"],
        mustNotCopy: [
          "do not copy walleye white lower-tail-tip onto sauger",
          "do not copy sauger dorsal-spot pattern onto walleye",
        ],
      },
      {
        id: "esox",
        label: "Northern pike vs muskellunge vs chain pickerel",
        speciesIds: ["esox_lucius", "esox_masquinongy", "esox_niger"],
        mustNotCopy: [
          "do not collapse cheek / opercle scale patterns across Esox",
          "do not copy muskellunge open-water size class onto chain pickerel",
        ],
      },
      {
        id: "large_catfish",
        label: "Channel vs blue vs flathead catfish",
        speciesIds: ["ictalurus_punctatus", "ictalurus_furcatus", "pylodictis_olivaris"],
        alreadyCoveredIds: ["ameiurus_nebulosus", "ameiurus_melas", "ameiurus_natalis"],
        mustNotCopy: [
          "do not copy bullhead spine-lock notes as a channel-catfish fight class",
          "do not copy flathead piscivore diet onto channel catfish",
          "do not copy blue-catfish forked-tail / anal-fin characters onto flathead",
        ],
      },
      {
        id: "yellow_perch",
        label: "Yellow perch vs white perch and walleye",
        speciesIds: ["perca_flavescens"],
        alreadyCoveredIds: ["morone_americana"],
        mustNotCopy: [
          "do not copy white-perch Morone identity onto yellow perch",
          "do not copy walleye dorsal-spot / white tail-tip keys onto yellow perch",
        ],
      },
    ],
  },
  {
    id: "wave_03",
    label: "Sunfish and crappie",
    status: "queued",
    rationale:
      "Centrarchid panfish collapse in the picker: bluegill vs pumpkinseed vs redear vs green vs redbreast vs warmouth vs longear vs flier, plus rock bass and crappie.",
    requiredLayers: PRIMARY_OVERLAY_LAYERS,
    followOnLayers: FOLLOW_ON_OVERLAY_LAYERS,
    speciesIds: [
      "pomoxis_spp",
      "lepomis_macrochirus",
      "lepomis_gibbosus",
      "lepomis_microlophus",
      "lepomis_cyanellus",
      "lepomis_auritus",
      "lepomis_gulosus",
      "lepomis_megalotis",
      "centrarchus_macropterus",
      "ambloplites_rupestris",
    ],
    groups: [
      {
        id: "lepomis",
        label: "Bluegill and the Lepomis lookalikes",
        speciesIds: [
          "lepomis_macrochirus",
          "lepomis_gibbosus",
          "lepomis_microlophus",
          "lepomis_cyanellus",
          "lepomis_auritus",
          "lepomis_gulosus",
          "lepomis_megalotis",
        ],
        mustNotCopy: [
          "do not copy bluegill surface-insect identity onto redear",
          "do not collapse ear-flap, pectoral-length, and gill-raker characters",
        ],
      },
      {
        id: "crappie_rock_flier",
        label: "Crappie, rock bass, and flier",
        speciesIds: ["pomoxis_spp", "ambloplites_rupestris", "centrarchus_macropterus"],
        alreadyCoveredIds: ["micropterus_dolomieu"],
        mustNotCopy: [
          "do not copy smallmouth rock identity onto rock bass",
          "do not invent a black-vs-white crappie split that the catalog does not yet carry as separate records",
        ],
      },
    ],
  },
  {
    id: "wave_04",
    label: "Remaining salmonids, whitefish, burbot, and smelt",
    status: "queued",
    rationale:
      "Later salmon and char records, mountain whitefish vs the already-reviewed coregonines, Arctic grayling, burbot, and rainbow smelt.",
    requiredLayers: PRIMARY_OVERLAY_LAYERS,
    followOnLayers: FOLLOW_ON_OVERLAY_LAYERS,
    speciesIds: [
      "prosopium_williamsoni",
      "thymallus_arcticus",
      "oncorhynchus_gorbuscha",
      "oncorhynchus_keta",
      "salmo_salar_landlocked",
      "salvelinus_alpinus",
      "salvelinus_malma",
      "stenodus_leucichthys",
      "lota_lota",
      "osmerus_mordax",
    ],
    groups: [
      {
        id: "mountain_whitefish_grayling",
        label: "Mountain whitefish vs Arctic grayling",
        speciesIds: ["prosopium_williamsoni", "thymallus_arcticus"],
        alreadyCoveredIds: ["coregonus_clupeaformis", "coregonus_artedi"],
        mustNotCopy: [
          "do not copy lake-whitefish culinary notes onto mountain whitefish",
          "do not copy cisco pelagic-plankton diet onto mountain whitefish",
          "do not copy grayling surface/drift identity onto mountain whitefish",
        ],
      },
      {
        id: "pink_chum",
        label: "Pink vs chum salmon",
        speciesIds: ["oncorhynchus_gorbuscha", "oncorhynchus_keta"],
        alreadyCoveredIds: [
          "oncorhynchus_tshawytscha",
          "oncorhynchus_kisutch",
          "oncorhynchus_nerka_anadromous",
        ],
        mustNotCopy: [
          "do not copy Chinook or Coho feeding-trout notes onto returning pink or chum",
          "do not convert listed-ESU context into a targeting product",
        ],
      },
      {
        id: "char_landlocked_sheefish",
        label: "Arctic char, Dolly Varden, landlocked Atlantic salmon, and sheefish",
        speciesIds: [
          "salvelinus_alpinus",
          "salvelinus_malma",
          "salmo_salar_landlocked",
          "stenodus_leucichthys",
        ],
        alreadyCoveredIds: [
          "salvelinus_namaycush",
          "salvelinus_fontinalis",
          "salmo_trutta",
        ],
        mustNotCopy: [
          "do not copy brook-trout or lake-trout notes onto Arctic char or Dolly Varden without a species source",
          "do not copy brown-trout identity onto landlocked Atlantic salmon",
          "do not convert sheefish migration into an aggregation map",
        ],
      },
      {
        id: "burbot_smelt",
        label: "Burbot vs rainbow smelt",
        speciesIds: ["lota_lota", "osmerus_mordax"],
        mustNotCopy: [
          "do not copy burbot benthic winter identity onto rainbow smelt",
          "do not copy smelt pelagic forage identity onto burbot",
        ],
      },
    ],
  },
  {
    id: "wave_05",
    label: "Suckers, remaining ictalurids, and conservation-gated records",
    status: "queued",
    rationale:
      "White catfish vs bullheads, the sucker/redhorse group, drum, bowfin, eel, shad, and records whose first job is conservation or jurisdiction context: bull trout, wild Atlantic salmon, sturgeons, paddlefish.",
    requiredLayers: PRIMARY_OVERLAY_LAYERS,
    followOnLayers: FOLLOW_ON_OVERLAY_LAYERS,
    speciesIds: [
      "salvelinus_confluentus",
      "salmo_salar_anadromous",
      "acipenser_fulvescens",
      "polyodon_spathula",
      "acipenser_transmontanus",
      "ameiurus_catus",
      "catostomus_commersonii",
      "catostomus_catostomus",
      "catostomus_macrocheilus",
      "moxostoma_macrolepidotum",
      "aplodinotus_grunniens",
      "amia_calva",
      "anguilla_rostrata",
      "alosa_sapidissima",
    ],
    groups: [
      {
        id: "white_catfish",
        label: "White catfish vs bullheads and channel catfish",
        speciesIds: ["ameiurus_catus"],
        alreadyCoveredIds: [
          "ameiurus_nebulosus",
          "ictalurus_punctatus",
        ],
        mustNotCopy: [
          "do not copy brown-bullhead table-fare notes onto white catfish",
          "do not copy channel-catfish forked-tail identity onto white catfish without a source",
        ],
      },
      {
        id: "suckers",
        label: "White, longnose, and largescale sucker vs shorthead redhorse",
        speciesIds: [
          "catostomus_commersonii",
          "catostomus_catostomus",
          "catostomus_macrocheilus",
          "moxostoma_macrolepidotum",
        ],
        alreadyCoveredIds: ["ictiobus_cyprinellus", "ictiobus_bubalus"],
        mustNotCopy: [
          "do not copy buffalo identity onto Catostomus or redhorse",
          "do not copy carp fight or culinary notes onto suckers",
        ],
      },
      {
        id: "drum_bowfin_eel_shad",
        label: "Freshwater drum, bowfin, American eel, and American shad",
        speciesIds: ["aplodinotus_grunniens", "amia_calva", "anguilla_rostrata", "alosa_sapidissima"],
        mustNotCopy: [
          "do not copy gar armor / toxic-egg notes onto bowfin",
          "do not convert American shad or eel migration into an aggregation map",
        ],
      },
      {
        id: "conservation_gated",
        label: "Bull trout, wild Atlantic salmon, sturgeons, and paddlefish",
        speciesIds: [
          "salvelinus_confluentus",
          "salmo_salar_anadromous",
          "acipenser_fulvescens",
          "polyodon_spathula",
          "acipenser_transmontanus",
        ],
        alreadyCoveredIds: ["salvelinus_fontinalis", "salvelinus_malma", "salmo_salar_landlocked"],
        mustNotCopy: [
          "do not copy brook-trout identity onto bull trout",
          "do not copy landlocked Atlantic salmon notes onto wild anadromous Atlantic salmon",
          "do not convert conservation-sensitive or regulated-context status into presentation guidance",
          "do not name spawning sites, staging concentrations, or migration bottlenecks",
        ],
      },
    ],
  },
];

export type ResearchAssignment = {
  wave: EnrichmentWave;
  group: DistinctionGroup;
};

const ASSIGNMENT_BY_SPECIES: Record<string, ResearchAssignment> = {};
for (const wave of ENRICHMENT_WAVES) {
  for (const speciesId of wave.speciesIds) {
    const group = wave.groups.find((item) => item.speciesIds.includes(speciesId));
    if (!group) {
      throw new Error(`AFP-Q-1.0: ${speciesId} in ${wave.id} is missing a distinction group`);
    }
    ASSIGNMENT_BY_SPECIES[speciesId] = { wave, group };
  }
}

export function researchAssignmentFor(speciesId: string): ResearchAssignment | null {
  return ASSIGNMENT_BY_SPECIES[speciesId] ?? null;
}

export function queuedSpeciesIds(): string[] {
  return ENRICHMENT_WAVES.filter((wave) => wave.status === "queued").flatMap((wave) => wave.speciesIds);
}

export function shippedSpeciesIds(): string[] {
  return ENRICHMENT_WAVES.filter((wave) => wave.status === "shipped").flatMap((wave) => wave.speciesIds);
}
