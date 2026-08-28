import type { SpeciesRecord } from "../protocol/types.ts";
import { GROUPS as CORE_GROUPS, SPECIES as CORE_SPECIES } from "./species.ts";
import { SPECIES_EXPANSION } from "./species-expansion.ts";
import { SPECIES_EXPANSION_02 } from "./species-expansion-02.ts";
import { SPECIES_EXPANSION_03 } from "./species-expansion-03.ts";
import { SPECIES_EXPANSION_04 } from "./species-expansion-04.ts";
import { TARGET_CONTEXT_BY_SPECIES } from "./target-context.ts";

function normalizeSpecies(species: SpeciesRecord): SpeciesRecord {
  let normalized = species;

  if (species.id === "ameiurus_natalis") {
    normalized = {
      ...normalized,
      spawning: {
        ...normalized.spawning,
        seasons: ["spring", "early_summer"] as SpeciesRecord["spawning"]["seasons"],
      },
    };
  }

  const targetContext = TARGET_CONTEXT_BY_SPECIES[species.id];
  if (targetContext) {
    normalized = {
      ...normalized,
      targetContext,
    };
  }

  return normalized;
}

export const SPECIES: SpeciesRecord[] = [
  ...CORE_SPECIES,
  ...SPECIES_EXPANSION,
  ...SPECIES_EXPANSION_02,
  ...SPECIES_EXPANSION_03,
  ...SPECIES_EXPANSION_04,
].map(normalizeSpecies);

export const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((species) => [species.id, species])) as Record<
  string,
  SpeciesRecord
>;

export const GROUPS = CORE_GROUPS;
