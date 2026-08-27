import type { ScenarioInput, ThermalState } from "../protocol/types.ts";
import {
  matchingSpeciesWeightOverrides as matchingLegacySpeciesWeightOverrides,
  SPECIES_WEIGHT_OVERRIDES,
  type SpeciesWeightOverrideRule,
} from "./species-weight-overrides.ts";
import {
  matchingSpeciesWeightOverrideExpansion,
  SPECIES_OVERRIDE_EXPANSION_COVERAGE,
  SPECIES_WEIGHT_OVERRIDES_EXPANSION,
  type SpeciesOverrideCoverageRecord,
} from "./species-weight-overrides-expansion.ts";

/** Composed species-specific model: SPO-1.0 legacy library + SPO-1.1 expansion. */
export const SPECIES_OVERRIDE_MODEL_VERSION = "SPO-1.1" as const;

const legacyCoverage: SpeciesOverrideCoverageRecord[] = Array.from(
  new Set(SPECIES_WEIGHT_OVERRIDES.map((entry) => entry.speciesId)),
).map((speciesId) => ({
  speciesId,
  mode: "weighted" as const,
  note: "Reviewed species-specific weighting supplied by the SPO-1.0 library.",
  reviewedAt: "2026-08-27",
}));

export const SPECIES_OVERRIDE_COVERAGE: SpeciesOverrideCoverageRecord[] = [
  ...legacyCoverage,
  ...SPECIES_OVERRIDE_EXPANSION_COVERAGE,
];

export const SPECIES_WEIGHT_OVERRIDE_RULES: SpeciesWeightOverrideRule[] = [
  ...SPECIES_WEIGHT_OVERRIDES,
  ...SPECIES_WEIGHT_OVERRIDES_EXPANSION,
];

export function matchingSpeciesWeightOverrides(
  input: ScenarioInput,
  thermalState: ThermalState,
): SpeciesWeightOverrideRule[] {
  return [
    ...matchingLegacySpeciesWeightOverrides(input, thermalState),
    ...matchingSpeciesWeightOverrideExpansion(input, thermalState),
  ];
}

export function speciesOverrideCoverageFor(
  speciesId: string,
): SpeciesOverrideCoverageRecord | undefined {
  return SPECIES_OVERRIDE_COVERAGE.find((entry) => entry.speciesId === speciesId);
}
