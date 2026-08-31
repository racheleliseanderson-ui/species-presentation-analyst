/**
 * AFP seeding doctrine.
 *
 * Enrichment is a ranked queue of distinction groups, not a race to fill 75
 * encyclopedia pages. A wave lands only when every listed species has the
 * required overlays from agency or peer-reviewed sources. Missing research
 * stays missing. This file is the plan; live coverage is computed from the
 * dossier catalogs, never copied by hand.
 */

export const KNOWLEDGE_OVERLAYS = [
  "identification",
  "behavior",
  "diet",
  "seasonal_calendar",
] as const;

export type KnowledgeOverlay = (typeof KNOWLEDGE_OVERLAYS)[number];

export type SeedWaveStatus = "landed" | "next" | "queued";

export type SeedWave = {
  id: string;
  status: SeedWaveStatus;
  title: string;
  reason: string;
  speciesIds: readonly string[];
  overlays: readonly KnowledgeOverlay[];
};

export const SEED_DOCTRINE = {
  unit: "A distinction group, with every required overlay written together.",
  usefulFirst:
    "Openers and high-use targets before rare, regulated, or lookalike-only leftovers.",
  sources: "Agency or peer-reviewed. Visible gaps beat generic model text.",
  never: [
    "bite scores or catch probability",
    "hotspots, GPS inference, or named spawning concentrations",
    "invented hatches from diet capacity",
    "frozen size/bag/season limits",
    "lure SKUs or a competing profile framework",
    "four-overlay dumps for conservation-sensitive records that must stay fail-closed",
  ],
  deferUntilHighUseKnowable: ["fight", "food_value", "methods_ranges", "live_regulations"] as const,
} as const;

export const SEED_WAVES: readonly SeedWave[] = [
  {
    id: "01",
    status: "landed",
    title: "High-confusion lookalikes",
    reason:
      "Field ID collisions that collapse the catalog: trout, kokanee/sockeye, black bass, Morone, cisco/whitefish, goldeye/mooneye, carp/buffalo, gars, bullheads.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: [
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
    ],
  },
  {
    id: "02a",
    status: "landed",
    title: "High-use trout",
    reason: "The trout people actually open: brown, brook, lake trout, and steelhead kept off inland rainbow.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: [
      "salmo_trutta",
      "salvelinus_fontinalis",
      "salvelinus_namaycush",
      "oncorhynchus_mykiss_steelhead",
    ],
  },
  {
    id: "02b",
    status: "landed",
    title: "Coolwater predators",
    reason:
      "Walleye/sauger and the Esox/perch set are the next search targets. They collapse in the field and they drive Quick Read after the opener chips.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: [
      "sander_vitreus",
      "sander_canadensis",
      "esox_lucius",
      "esox_masquinongy",
      "esox_niger",
      "perca_flavescens",
    ],
  },
  {
    id: "02c",
    status: "landed",
    title: "Core panfish",
    reason: "Crappie and sunfish that anglers treat as one pile.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: [
      "pomoxis_spp",
      "lepomis_macrochirus",
      "lepomis_gibbosus",
      "lepomis_microlophus",
      "lepomis_cyanellus",
      "ambloplites_rupestris",
    ],
  },
  {
    id: "02d",
    status: "landed",
    title: "Remaining sunfish",
    reason: "After the core panfish set, finish the Lepomis/Centrarchus leftovers as one group.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: ["lepomis_auritus", "lepomis_gulosus", "lepomis_megalotis", "centrarchus_macropterus"],
  },
  {
    id: "02e",
    status: "landed",
    title: "Catfish",
    reason: "Same family, four different jobs.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: ["ictalurus_punctatus", "ictalurus_furcatus", "pylodictis_olivaris", "ameiurus_catus"],
  },
  {
    id: "02f",
    status: "landed",
    title: "Pacific and landlocked salmon",
    reason: "Keep chinook, coho, pink, chum, and landlocked Atlantic from collapsing into trout or steelhead.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: [
      "oncorhynchus_tshawytscha",
      "oncorhynchus_kisutch",
      "oncorhynchus_gorbuscha",
      "oncorhynchus_keta",
      "salmo_salar_landlocked",
    ],
  },
  {
    id: "02g",
    status: "next",
    title: "Remaining salmonids and burbot",
    reason: "Whitefish, grayling, chars, sheefish, and burbot after the trout people actually open.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: [
      "prosopium_williamsoni",
      "thymallus_arcticus",
      "lota_lota",
      "salvelinus_alpinus",
      "salvelinus_malma",
      "stenodus_leucichthys",
    ],
  },
  {
    id: "03",
    status: "queued",
    title: "Recognition-only conservation records",
    reason:
      "Bull trout and wild anadromous Atlantic salmon stay fail-closed. Identification helps people not confuse them. Behavior, diet, and seasonal calendars are not a how-to-target layer.",
    overlays: ["identification"],
    speciesIds: ["salvelinus_confluentus", "salmo_salar_anadromous"],
  },
  {
    id: "04",
    status: "queued",
    title: "Remaining catalog",
    reason:
      "Drum, bowfin, smelt, eel, shad, sturgeons, paddlefish, and suckers after the fish people actually search.",
    overlays: KNOWLEDGE_OVERLAYS,
    speciesIds: [
      "aplodinotus_grunniens",
      "amia_calva",
      "osmerus_mordax",
      "anguilla_rostrata",
      "alosa_sapidissima",
      "acipenser_fulvescens",
      "polyodon_spathula",
      "acipenser_transmontanus",
      "catostomus_commersonii",
      "catostomus_catostomus",
      "catostomus_macrocheilus",
      "moxostoma_macrolepidotum",
    ],
  },
];

export const FIELD_OPENER_IDS = [
  "salmo_trutta",
  "micropterus_dolomieu",
  "micropterus_nigricans",
] as const;

export function nextSeedWave(): SeedWave | null {
  return SEED_WAVES.find((wave) => wave.status === "next") ?? null;
}

export function seedWaveForSpecies(speciesId: string): SeedWave | null {
  return SEED_WAVES.find((wave) => wave.speciesIds.includes(speciesId)) ?? null;
}
