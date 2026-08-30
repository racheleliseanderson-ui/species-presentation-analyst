import { BEHAVIOR_DOSSIERS } from "./behavior-dossiers.ts";
import { DIET_DOSSIERS } from "./diet-dossiers.ts";
import { FIGHT_DOSSIERS } from "./fight-dossiers.ts";
import { FOOD_VALUE_DOSSIERS } from "./food-dossiers.ts";
import { IDENTIFICATION_DOSSIERS } from "./identification-dossiers.ts";
import { SEASONAL_CALENDAR_DOSSIERS } from "./seasonal-calendar-dossiers.ts";
import type {
  BehaviorDossier,
  DietDossier,
  FightDossier,
  FoodValueDossier,
  IdentificationDossier,
  SeasonalCalendarDossier,
} from "./dossier-types.ts";
import {
  BEHAVIOR_DOSSIER_VERSION,
  DIET_DOSSIER_VERSION,
  FIGHT_DOSSIER_VERSION,
  FOOD_VALUE_DOSSIER_VERSION,
  IDENTIFICATION_DOSSIER_VERSION,
  SEASONAL_CALENDAR_VERSION,
} from "./dossier-types.ts";

export {
  BEHAVIOR_DOSSIER_VERSION,
  DIET_DOSSIER_VERSION,
  FIGHT_DOSSIER_VERSION,
  FOOD_VALUE_DOSSIER_VERSION,
  IDENTIFICATION_DOSSIER_VERSION,
  SEASONAL_CALENDAR_VERSION,
};

export const IDENTIFICATION_BY_SPECIES: Record<string, IdentificationDossier> = Object.fromEntries(
  IDENTIFICATION_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export const BEHAVIOR_BY_SPECIES: Record<string, BehaviorDossier> = Object.fromEntries(
  BEHAVIOR_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export const DIET_BY_SPECIES: Record<string, DietDossier> = Object.fromEntries(
  DIET_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export const SEASONAL_CALENDAR_BY_SPECIES: Record<string, SeasonalCalendarDossier> = Object.fromEntries(
  SEASONAL_CALENDAR_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export const FIGHT_BY_SPECIES: Record<string, FightDossier> = Object.fromEntries(
  FIGHT_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export const FOOD_VALUE_BY_SPECIES: Record<string, FoodValueDossier> = Object.fromEntries(
  FOOD_VALUE_DOSSIERS.map((dossier) => [dossier.speciesId, dossier]),
);

export function identificationDossierFor(speciesId: string): IdentificationDossier | null {
  return IDENTIFICATION_BY_SPECIES[speciesId] ?? null;
}

export function behaviorDossierFor(speciesId: string): BehaviorDossier | null {
  return BEHAVIOR_BY_SPECIES[speciesId] ?? null;
}

export function dietDossierFor(speciesId: string): DietDossier | null {
  return DIET_BY_SPECIES[speciesId] ?? null;
}

export function seasonalCalendarDossierFor(speciesId: string): SeasonalCalendarDossier | null {
  return SEASONAL_CALENDAR_BY_SPECIES[speciesId] ?? null;
}

export function fightDossierFor(speciesId: string): FightDossier | null {
  return FIGHT_BY_SPECIES[speciesId] ?? null;
}

export function foodValueDossierFor(speciesId: string): FoodValueDossier | null {
  return FOOD_VALUE_BY_SPECIES[speciesId] ?? null;
}

export const IDENTIFICATION_COVERAGE_IDS = IDENTIFICATION_DOSSIERS.map((dossier) => dossier.speciesId);
export const BEHAVIOR_COVERAGE_IDS = BEHAVIOR_DOSSIERS.map((dossier) => dossier.speciesId);
export const DIET_COVERAGE_IDS = DIET_DOSSIERS.map((dossier) => dossier.speciesId);
export const SEASONAL_CALENDAR_COVERAGE_IDS = SEASONAL_CALENDAR_DOSSIERS.map((dossier) => dossier.speciesId);
export const FIGHT_COVERAGE_IDS = FIGHT_DOSSIERS.map((dossier) => dossier.speciesId);
export const FOOD_VALUE_COVERAGE_IDS = FOOD_VALUE_DOSSIERS.map((dossier) => dossier.speciesId);
