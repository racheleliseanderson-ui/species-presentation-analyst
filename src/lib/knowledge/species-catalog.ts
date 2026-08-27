import type { SpeciesRecord } from "../protocol/types.ts";
import { GROUPS as CORE_GROUPS, SPECIES as CORE_SPECIES } from "./species.ts";
import { SPECIES_EXPANSION } from "./species-expansion.ts";

export const SPECIES: SpeciesRecord[] = [...CORE_SPECIES, ...SPECIES_EXPANSION];

export const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((species) => [species.id, species])) as Record<
  string,
  SpeciesRecord
>;

export const GROUPS = CORE_GROUPS;
