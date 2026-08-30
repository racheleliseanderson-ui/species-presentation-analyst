import { BEHAVIOR_DOSSIERS } from "./behavior-dossiers.ts";
import { IDENTIFICATION_DOSSIERS } from "./identification-dossiers.ts";
import type { BehaviorDossier, IdentificationDossier } from "./dossier-types.ts";
import {
  BEHAVIOR_DOSSIER_VERSION,
  IDENTIFICATION_DOSSIER_VERSION,
} from "./dossier-types.ts";

export { BEHAVIOR_DOSSIER_VERSION, IDENTIFICATION_DOSSIER_VERSION };

export const IDENTIFICATION_BY_SPECIES: Record<string, IdentificationDossier> = Object.fromEntries(
  IDENTIFICATION_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export const BEHAVIOR_BY_SPECIES: Record<string, BehaviorDossier> = Object.fromEntries(
  BEHAVIOR_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export function identificationDossierFor(speciesId: string): IdentificationDossier | null {
  return IDENTIFICATION_BY_SPECIES[speciesId] ?? null;
}

export function behaviorDossierFor(speciesId: string): BehaviorDossier | null {
  return BEHAVIOR_BY_SPECIES[speciesId] ?? null;
}

export const IDENTIFICATION_COVERAGE_IDS = IDENTIFICATION_DOSSIERS.map((dossier) => dossier.speciesId);
export const BEHAVIOR_COVERAGE_IDS = BEHAVIOR_DOSSIERS.map((dossier) => dossier.speciesId);
