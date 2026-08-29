import type { TargetStatus } from "../protocol/types.ts";
import type { WaterType } from "../protocol/vocab.ts";

export type PopulationContextCandidate = {
  id: string;
  speciesId: string;
  label: string;
  regionClass: string;
  systemArchetype: string;
  lifeHistory: string;
  populationOrigin: string;
  waterTypes: WaterType[];
  targetStatusEscalation?: TargetStatus;
  rationale: string;
  constraints: string[];
  sources: { label: string; class: "agency" | "peer_reviewed" | "synthesis" }[];
  reviewedAt: string;
  state: "reviewed_candidate";
};

/**
 * RPC candidates created with species expansion 04.
 *
 * These are deliberately NOT part of RPC-1.0's active profile list yet. They
 * document where population/life-history context is biologically material and
 * where a future RPC release should be allowed to become more restrictive.
 * No candidate may relax a species-level target status.
 */
export const POPULATION_CONTEXT_CANDIDATES_04: PopulationContextCandidate[] = [
  {
    id: "sockeye-managed-anadromous",
    speciesId: "oncorhynchus_nerka_anadromous",
    label: "Managed anadromous sockeye fishery",
    regionClass: "north_pacific_managed",
    systemArchetype: "lake_river_anadromous",
    lifeHistory: "anadromous",
    populationOrigin: "native_managed",
    waterTypes: ["flowing", "stillwater"],
    targetStatusEscalation: "regulated_context",
    rationale: "Large Alaska/Pacific sockeye stocks support regulated fisheries and should not inherit the status of listed lower-48 ESUs.",
    constraints: ["Never infer fishery status from a water name.", "Returning freshwater adults are migration context, not a feeding claim."],
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "sockeye-listed-esu-context",
    speciesId: "oncorhynchus_nerka_anadromous",
    label: "ESA-listed sockeye ESU context",
    regionClass: "pacific_northwest_protected",
    systemArchetype: "lake_river_anadromous",
    lifeHistory: "anadromous",
    populationOrigin: "native_protected",
    waterTypes: ["flowing", "stillwater"],
    targetStatusEscalation: "conservation_sensitive",
    rationale: "Snake River sockeye are endangered and Ozette Lake sockeye are threatened under the ESA.",
    constraints: ["Context only — no presentation guidance when explicitly selected.", "No migration bottlenecks, spawning lakes/tributaries, or critical-habitat targeting."],
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon protected-ESU profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "pink-coastal-anadromous",
    speciesId: "oncorhynchus_gorbuscha",
    label: "Coastal anadromous pink salmon",
    regionClass: "north_pacific_coastal",
    systemArchetype: "coastal_river_estuary",
    lifeHistory: "anadromous_two_year",
    populationOrigin: "native_managed",
    waterTypes: ["flowing"],
    targetStatusEscalation: "regulated_context",
    rationale: "Pink salmon's two-year life cycle, rapid fry emigration, and non-feeding freshwater adult return are sufficiently distinctive to warrant explicit RPC context.",
    constraints: ["No odd/even-year abundance prediction from biology alone.", "No spawning reach or redd targeting."],
    sources: [
      { label: "Alaska Department of Fish and Game Pink Salmon species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "chum-managed-anadromous",
    speciesId: "oncorhynchus_keta",
    label: "Managed anadromous chum fishery",
    regionClass: "north_pacific_managed",
    systemArchetype: "coastal_river_estuary",
    lifeHistory: "anadromous",
    populationOrigin: "native_managed",
    waterTypes: ["flowing"],
    targetStatusEscalation: "regulated_context",
    rationale: "Most chum fisheries require ordinary salmon regulation context while remaining biologically distinct from protected ESUs.",
    constraints: ["No population identity inference from geography alone.", "Freshwater migration mechanics are not a feeding claim."],
    sources: [
      { label: "NOAA Fisheries Chum Salmon species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "chum-listed-esu-context",
    speciesId: "oncorhynchus_keta",
    label: "ESA-listed chum ESU context",
    regionClass: "pacific_northwest_protected",
    systemArchetype: "coastal_river_estuary",
    lifeHistory: "anadromous",
    populationOrigin: "native_protected",
    waterTypes: ["flowing"],
    targetStatusEscalation: "conservation_sensitive",
    rationale: "Hood Canal summer-run and Columbia River chum ESUs are ESA-threatened.",
    constraints: ["Context only — no presentation guidance when explicitly selected.", "No critical-habitat, spawning, or migration-concentration guidance."],
    sources: [
      { label: "NOAA Fisheries Chum Salmon protected-ESU profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "landlocked-atlantic-cold-lake",
    speciesId: "salmo_salar_landlocked",
    label: "Cold-lake landlocked Atlantic salmon",
    regionClass: "northeast_inland",
    systemArchetype: "deep_cold_lake_connected_stream",
    lifeHistory: "landlocked_freshwater",
    populationOrigin: "native_or_stocked",
    waterTypes: ["stillwater", "flowing"],
    rationale: "Lake pelagic smelt use and connected-stream drift/spawning habitat are materially different from wild sea-run Atlantic salmon.",
    constraints: ["Never resolve to the wild sea-run Atlantic salmon record.", "Spawning inlet/outlet runs remain invalidators."],
    sources: [
      { label: "Maine Department of Inland Fisheries and Wildlife Landlocked Salmon species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "arctic-char-inland-lake",
    speciesId: "salvelinus_alpinus",
    label: "North American inland-lake Arctic char",
    regionClass: "arctic_subarctic_inland",
    systemArchetype: "cold_natural_lake",
    lifeHistory: "lake_resident",
    populationOrigin: "native",
    waterTypes: ["stillwater"],
    rationale: "ADF&G documents Alaska Arctic char as lake-resident and highly polymorphic among lakes, which should remain separate from anadromous char assumptions elsewhere in the circumpolar range.",
    constraints: ["Do not infer morph or diet from lake name.", "Numeric thermal limits remain species-level until population-specific review."],
    sources: [
      { label: "Alaska Department of Fish and Game Arctic Char species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "dolly-resident-freshwater",
    speciesId: "salvelinus_malma",
    label: "Resident freshwater Dolly Varden",
    regionClass: "alaska_interior_coastal_streams",
    systemArchetype: "cold_stream_lake_network",
    lifeHistory: "resident",
    populationOrigin: "native",
    waterTypes: ["flowing", "stillwater"],
    rationale: "Resident headwater/river/lake fish behave differently from sea-run Dolly Varden and should not inherit estuarine migration assumptions.",
    constraints: ["Distinguish from Arctic char and bull trout by reviewed identification, not geography alone."],
    sources: [
      { label: "Alaska Department of Fish and Game Dolly Varden species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "dolly-anadromous-coastal",
    speciesId: "salvelinus_malma",
    label: "Sea-run / coastal Dolly Varden",
    regionClass: "alaska_coastal",
    systemArchetype: "river_estuary_coastal",
    lifeHistory: "anadromous",
    populationOrigin: "native",
    waterTypes: ["flowing", "stillwater"],
    rationale: "Sea-run fish use estuarine/coastal feeding and distinct overwintering/migration patterns compared with resident Dolly Varden.",
    constraints: ["No migration bottleneck targeting.", "Spawning reaches remain excluded."],
    sources: [
      { label: "Alaska Department of Fish and Game Dolly Varden species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "sheefish-migratory-large-river",
    speciesId: "stenodus_leucichthys",
    label: "Long-distance migratory sheefish",
    regionClass: "alaska_large_river",
    systemArchetype: "large_river_brackish_bay",
    lifeHistory: "migratory",
    populationOrigin: "native",
    waterTypes: ["flowing", "stillwater"],
    targetStatusEscalation: "regulated_context",
    rationale: "Some sheefish travel more than 1,000 miles and use brackish overwintering areas before returning upriver to feed or spawn.",
    constraints: ["Discrete spawning areas are never target outputs.", "Do not infer migration destination from public water name."],
    sources: [
      { label: "Alaska Department of Fish and Game Sheefish species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "sheefish-resident-freshwater",
    speciesId: "stenodus_leucichthys",
    label: "Resident freshwater sheefish",
    regionClass: "alaska_inland",
    systemArchetype: "large_river_lake",
    lifeHistory: "resident",
    populationOrigin: "native",
    waterTypes: ["flowing", "stillwater"],
    targetStatusEscalation: "regulated_context",
    rationale: "ADF&G identifies resident fish that remain in freshwater rather than migrating to bays; they require a different movement frame.",
    constraints: ["Presence and resident status must be verified rather than inferred."],
    sources: [
      { label: "Alaska Department of Fish and Game Sheefish species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "white-sturgeon-western-large-river",
    speciesId: "acipenser_transmontanus",
    label: "Western large-river white sturgeon",
    regionClass: "pacific_west_large_river",
    systemArchetype: "large_river_estuary",
    lifeHistory: "river_resident_or_migratory",
    populationOrigin: "native_managed",
    waterTypes: ["flowing", "stillwater"],
    targetStatusEscalation: "regulated_context",
    rationale: "Managed populations can support regulated fisheries but remain long-lived, late-maturing, and highly jurisdiction-dependent.",
    constraints: ["Current sturgeon rules always supersede biological plausibility.", "No spawning-reach guidance."],
    sources: [
      { label: "U.S. Fish and Wildlife Service White Sturgeon species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "white-sturgeon-kootenai-conservation",
    speciesId: "acipenser_transmontanus",
    label: "Kootenai white sturgeon conservation context",
    regionClass: "kootenai_protected_population",
    systemArchetype: "landlocked_river_lake",
    lifeHistory: "landlocked",
    populationOrigin: "native_protected",
    waterTypes: ["flowing", "stillwater"],
    targetStatusEscalation: "conservation_sensitive",
    rationale: "The Kootenai River white sturgeon population is federally endangered and has severe recruitment constraints.",
    constraints: ["Context only — no presentation guidance when explicitly selected.", "No critical habitat, spawning reach, or migration-location output."],
    sources: [
      { label: "U.S. Fish and Wildlife Service Kootenai River White Sturgeon species/recovery profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
  {
    id: "alligator-gar-large-river-floodplain",
    speciesId: "atractosteus_spatula",
    label: "Large-river / floodplain alligator gar",
    regionClass: "mississippi_gulf",
    systemArchetype: "large_river_floodplain_backwater",
    lifeHistory: "river_floodplain_resident",
    populationOrigin: "native",
    waterTypes: ["flowing", "stillwater"],
    targetStatusEscalation: "regulated_context",
    rationale: "Large-river pools, backwaters, floodplain connectivity, long lifespan, and episodic recruitment materially shape alligator gar behavior and management.",
    constraints: ["Flooded spawning habitat is an invalidator, not a target map.", "Air-gulping never counts as surface-feeding evidence."],
    sources: [
      { label: "U.S. Fish and Wildlife Service Alligator Gar species profile", class: "agency" },
    ],
    reviewedAt: "2026-08-27",
    state: "reviewed_candidate",
  },
];

export const POPULATION_CONTEXT_CANDIDATE_IDS_04 = new Set(
  POPULATION_CONTEXT_CANDIDATES_04.map((candidate) => candidate.id),
);
