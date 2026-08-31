/**
 * AFP-1.1 dossier overlay types.
 *
 * These records populate existing AFP section IDs. They are not a competing
 * profile framework and they never feed presentation-family weighting.
 *
 * Incomplete research stays incomplete. Missing fields are omitted rather than
 * filled with generic model text.
 */

export type DossierSourceClass = "agency" | "peer_reviewed" | "synthesis";

export type DossierSource = {
  label: string;
  class: DossierSourceClass;
  url?: string;
};

export type SimilarSpeciesKey = {
  /** Catalog species id when the lookalike is a reviewed record. */
  speciesId?: string;
  name: string;
  distinction: string;
};

export type IdentificationDossier = {
  speciesId: string;
  status: "reviewed" | "partial";
  regionalNames: string[];
  bodyShape: string;
  identificationTraits: string[];
  coloration: string;
  regionalColorVariation?: string;
  spawningColoration?: string;
  juvenileAppearance?: string;
  adultAppearance: string;
  sexualDimorphism?: string;
  similarSpecies: SimilarSpeciesKey[];
  averageAdultLength: string;
  commonAnglingSize: string;
  typicalWeight: string;
  maximumDocumentedSize: string;
  longevity?: string;
  sources: DossierSource[];
  reviewedAt: string;
  nextReviewAt: string;
  gaps: string[];
};

export type SocialPattern = "schooling" | "solitary" | "loose_aggregation" | "mixed_by_life_stage";

export type FeedingMode =
  | "ambush"
  | "pursuit"
  | "drift_feeding"
  | "benthic_feeding"
  | "filter"
  | "opportunistic";

export type DielClass = "crepuscular" | "diurnal" | "nocturnal" | "mixed";

export type BehaviorDossier = {
  speciesId: string;
  status: "reviewed" | "partial";
  social: {
    pattern: SocialPattern;
    byLifeStage?: string;
    note: string;
  };
  feedingStrategy: {
    modes: FeedingMode[];
    note: string;
  };
  territoriality?: string;
  aggression?: string;
  dielTendency: {
    class: DielClass;
    note: string;
  };
  seasonalActivity?: string;
  thermalDrivenBehavior?: string;
  currentFacing?: string;
  depthMovement?: string;
  waterLevelResponse?: string;
  flowChangeResponse?: string;
  clarityResponse?: string;
  /** Only populated when an agency or peer-reviewed source supports it. */
  coldFrontResponse?: string;
  /** Only populated when an agency or peer-reviewed source supports it. */
  anglingPressureResponse?: string;
  predatorAvoidance?: string;
  coverUse?: string;
  openWaterBehavior?: string;
  /**
   * Biological / conservation context only.
   * Must not name spawning sites, staging concentrations, or migration bottlenecks.
   */
  spawningBehavior: string;
  sources: DossierSource[];
  reviewedAt: string;
  nextReviewAt: string;
  gaps: string[];
};

export const IDENTIFICATION_DOSSIER_VERSION = "AFP-ID-1.0" as const;
export const BEHAVIOR_DOSSIER_VERSION = "AFP-BH-1.0" as const;
export const DOSSIER_REVIEWED_AT = "2026-08-30" as const;
export const DOSSIER_NEXT_REVIEW_AT = "2026-11-28" as const;
