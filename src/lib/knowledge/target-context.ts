import type { TargetContext } from "../protocol/types.ts";

/**
 * Structured targeting / jurisdiction context for records where biological presence
 * must not be mistaken for ordinary angling permission or ordinary harvest resilience.
 * This is intentionally small and additive; records without an entry remain standard.
 */
export const TARGET_CONTEXT_BY_SPECIES: Partial<Record<string, TargetContext>> = {
  salvelinus_confluentus: {
    jurisdictionScope:
      "Lower 48 United States; status and legal opportunity vary elsewhere in the species range.",
    verifyLocalRules: true,
    note: "Conservation-sensitive context only. No presentation guidance, migration bottlenecks, spawning tributaries, or redd locations.",
  },
  salmo_salar_anadromous: {
    jurisdictionScope:
      "Wild anadromous U.S. Atlantic salmon; this does not describe landlocked or stocked fisheries.",
    verifyLocalRules: true,
    note: "Conservation-sensitive context only. Biological presence is not evidence of a legal recreational fishery.",
  },
  acipenser_fulvescens: {
    jurisdictionScope:
      "Great Lakes and central/eastern North American jurisdictions with sharply different sturgeon seasons and rules.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify current season, legal methods, harvest status, size limits, tags, and closed spawning areas before acting on the reading.",
  },
  polyodon_spathula: {
    jurisdictionScope:
      "Mississippi-basin states and managed reservoirs; special seasons, permits, and legal methods are common.",
    verifyLocalRules: true,
    note: "Regulated biological context. Paddlefish are filter feeders; the app must not manufacture lure-style presentation guidance or convert migration timing into aggregation instructions.",
  },
  ictiobus_cyprinellus: {
    jurisdictionScope:
      "Interior U.S. and Canadian waters; nongame classification, harvest rules, and population resilience vary by jurisdiction.",
    verifyLocalRules: true,
    note: "Regulated-context record. Long lifespan and episodic recruitment make local harvest context materially important even where fish appear abundant.",
  },
  ictiobus_bubalus: {
    jurisdictionScope:
      "Mississippi and Gulf-slope jurisdictions; gear and harvest treatment vary substantially.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify current local harvest and legal-method rules and do not treat buffalo as carp by default.",
  },

  oncorhynchus_nerka_anadromous: {
    jurisdictionScope:
      "Alaska and Pacific Coast sockeye fisheries; some lower-48 ESUs are federally protected.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify current fishery status and population identity. Snake River and Ozette Lake ESA contexts must be explicitly selected rather than inferred from a water name.",
  },
  oncorhynchus_gorbuscha: {
    jurisdictionScope:
      "Pacific coastal and Alaska jurisdictions with season, retention, gear, and run-specific rules.",
    verifyLocalRules: true,
    note: "Regulated-context record. Returning freshwater adults are migration/spawning fish that stop feeding; verify current salmon rules and never convert redds or concentrations into target locations.",
  },
  oncorhynchus_keta: {
    jurisdictionScope:
      "Alaska and Pacific Coast chum fisheries; Hood Canal summer-run and Columbia River ESUs are federally threatened.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify population and current salmon regulations. Listed-ESU contexts must be explicitly declared.",
  },
  stenodus_leucichthys: {
    jurisdictionScope:
      "Northern Alaska and Canadian river/lake systems with local sport, subsistence, and conservation rules.",
    verifyLocalRules: true,
    note: "Regulated-context record. Long-distance migrations and relatively discrete spawning areas must not become aggregation or location guidance.",
  },
  acipenser_transmontanus: {
    jurisdictionScope:
      "Western North American white-sturgeon jurisdictions; legal opportunity and population status differ sharply among basins.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify season, retention/catch-and-release status, size/slot rules, tags, legal methods, and protected populations. Kootenai context must be explicitly declared.",
  },
  atractosteus_spatula: {
    jurisdictionScope:
      "Mississippi/Gulf drainage jurisdictions; harvest and trophy-fish protections vary substantially.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify current legal methods, harvest rules, and local conservation status; flooded spawning habitat and spawning concentrations are not target layers.",
  },
};
