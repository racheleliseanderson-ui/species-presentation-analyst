import type { TargetContext } from "../protocol/types.ts";

/**
 * Structured targeting / jurisdiction context for records where biological presence
 * must not be mistaken for ordinary angling permission or ordinary harvest resilience.
 * This is intentionally small and additive; records without an entry remain standard.
 */
export const TARGET_CONTEXT_BY_SPECIES: Partial<Record<string, TargetContext>> = {
  salvelinus_confluentus: {
    jurisdictionScope: "Lower 48 United States; status and legal opportunity vary elsewhere in the species range.",
    verifyLocalRules: true,
    note: "Conservation-sensitive context only. No presentation guidance, no migration bottlenecks, no spawning tributaries, no redd locations.",
  },
  salmo_salar_anadromous: {
    jurisdictionScope: "Wild anadromous U.S. Atlantic salmon; this does not describe landlocked or stocked fisheries.",
    verifyLocalRules: true,
    note: "Conservation-sensitive context only. Biological presence is not evidence of a legal recreational fishery.",
  },
  acipenser_fulvescens: {
    jurisdictionScope: "Great Lakes and central/eastern North American jurisdictions with sharply different sturgeon seasons and rules.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify current season, legal methods, harvest status, size limits, tags, and closed spawning areas before acting on the reading.",
  },
  polyodon_spathula: {
    jurisdictionScope: "Mississippi-basin states and managed reservoirs; special seasons, permits, and legal methods are common.",
    verifyLocalRules: true,
    note: "Regulated biological context. Paddlefish are filter feeders; the app must not manufacture lure-style presentation guidance or convert migration timing into aggregation instructions.",
  },
  ictiobus_cyprinellus: {
    jurisdictionScope: "Interior U.S. and Canadian waters; nongame classification, harvest rules, and population resilience vary by jurisdiction.",
    verifyLocalRules: true,
    note: "Regulated-context record. Long lifespan and episodic recruitment make local harvest context materially important even where fish appear abundant.",
  },
  ictiobus_bubalus: {
    jurisdictionScope: "Mississippi and Gulf-slope jurisdictions; gear and harvest treatment vary substantially.",
    verifyLocalRules: true,
    note: "Regulated-context record. Verify current local harvest and legal-method rules and do not treat buffalo as carp by default.",
  },
};
