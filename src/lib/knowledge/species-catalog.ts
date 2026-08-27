import type { SpeciesRecord } from "../protocol/types.ts";
import { GROUPS as CORE_GROUPS, SPECIES as CORE_SPECIES } from "./species.ts";
import { SPECIES_EXPANSION } from "./species-expansion.ts";
import { SPECIES_EXPANSION_02 } from "./species-expansion-02.ts";
import { SPECIES_EXPANSION_03 } from "./species-expansion-03.ts";

const SPECIES_EXPANSION_03_NORMALIZED: SpeciesRecord[] = SPECIES_EXPANSION_03.map((species) =>
  species.id === "ameiurus_natalis"
    ? {
        ...species,
        spawning: {
          ...species.spawning,
          seasons: ["spring", "early_summer"] as SpeciesRecord["spawning"]["seasons"],
        },
      }
    : species,
);

export const SPECIES: SpeciesRecord[] = [
  ...CORE_SPECIES,
  ...SPECIES_EXPANSION,
  ...SPECIES_EXPANSION_02,
  ...SPECIES_EXPANSION_03_NORMALIZED,
];

export const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((species) => [species.id, species])) as Record<
  string,
  SpeciesRecord
>;

export const GROUPS = CORE_GROUPS;
