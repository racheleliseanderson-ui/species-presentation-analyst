/**
 * One door onto "which water is this, and what does that imply".
 *
 * Before saltwater, every call site asked `waterType === "flowing"` and treated
 * the `else` as stillwater. That reads fine and compiles fine, and the moment a
 * third water type existed it silently sent surf, inshore, nearshore and
 * offshore readings down the lake branch. These helpers exist so that question
 * is asked in exactly one place, and so adding a seventh water type is a
 * compile error rather than a wrong answer.
 */

import type { ScenarioInput, SpeciesRecord } from "../protocol/types.ts";
import {
  HOLDING_BY_WATER_TYPE,
  isMarine,
  type AnyHolding,
  type MarineHolding,
  type MarineType,
  type PresentationSlot,
  type RiverHolding,
  type StillHolding,
  type WaterType,
} from "../protocol/vocab.ts";
import type { PresentationId } from "../protocol/types.ts";

/**
 * Just the fields this question needs.
 *
 * Widened from `ScenarioInput` so the UI's session object can be asked the same
 * question without first being converted into a full scenario — the components
 * that could not do that were re-deriving the answer by hand, and each hand-
 * written copy read the stillwater field for saltwater.
 */
export type HoldingDeclaration = {
  waterType: WaterType;
  holdingRiver?: ScenarioInput["holdingRiver"];
  holdingStill?: ScenarioInput["holdingStill"];
  holdingMarine?: ScenarioInput["holdingMarine"];
};

/** The holding class the angler declared, whichever water they are on. */
export function declaredHolding(input: HoldingDeclaration): AnyHolding | null {
  if (input.waterType === "flowing") return input.holdingRiver ?? null;
  if (input.waterType === "stillwater") return input.holdingStill ?? null;
  return input.holdingMarine ?? null;
}

/**
 * The patch that records a holding class on the water actually being fished,
 * clearing the other two fields.
 *
 * Three call sites wrote this by hand as `waterType === "flowing" ? {river} :
 * {still}`, which meant every saltwater declaration was silently filed as a
 * lake. Written once, it cannot drift apart again.
 */
export function declareHolding(
  waterType: WaterType,
  holding: AnyHolding | null,
): Pick<HoldingDeclaration, "holdingRiver" | "holdingStill" | "holdingMarine"> {
  return {
    holdingRiver: waterType === "flowing" ? (holding as RiverHolding | null) : null,
    holdingStill: waterType === "stillwater" ? (holding as StillHolding | null) : null,
    holdingMarine: isMarine(waterType) ? (holding as MarineHolding | null) : null,
  };
}

/** The holding classes this water type offers at all. */
export function holdingOptionsFor(waterType: WaterType): readonly string[] {
  return HOLDING_BY_WATER_TYPE[waterType];
}

/** The holding classes this species is reviewed for, in this water. */
export function reviewedHoldingFor(
  species: SpeciesRecord,
  waterType: WaterType,
): readonly string[] {
  if (waterType === "flowing") return species.habitat.riverHolding;
  if (waterType === "stillwater") return species.habitat.stillHolding;
  return species.habitat.marineHolding?.[waterType] ?? [];
}

/** The presentation families this species is reviewed for, in this water. */
export function reviewedPresentationsFor(
  species: SpeciesRecord,
  waterType: WaterType,
): readonly PresentationId[] {
  if (waterType === "flowing") return species.flowingPresentations;
  if (waterType === "stillwater") return species.stillPresentations;
  return species.marinePresentations?.[waterType] ?? [];
}

/**
 * Which family list a presentation belongs to. A family tagged for a marine
 * type is offered in that water; `both` still means both freshwater types, and
 * `saltwater` means every marine type, so a family does not have to be listed
 * four times to be generally applicable.
 */
export function familyFitsWater(
  slot: PresentationSlot | PresentationSlot[],
  waterType: WaterType,
): boolean {
  if (Array.isArray(slot)) return slot.some((entry) => familyFitsWater(entry, waterType));
  if (slot === waterType) return true;
  if (slot === "both") return waterType === "flowing" || waterType === "stillwater";
  if (slot === "saltwater") return isMarine(waterType);
  return false;
}

/**
 * The condition axis this water type is read on: rivers on flow, lakes on
 * their state, saltwater on tide. Used so the reading asks about the variable
 * that actually matters rather than every variable it knows.
 */
export type MovementAxis = "flow" | "still_state" | "tide";

export function movementAxisFor(waterType: WaterType): MovementAxis {
  if (waterType === "flowing") return "flow";
  if (waterType === "stillwater") return "still_state";
  return "tide";
}

/** Whether the angler has declared the movement this water is read on. */
export function movementDeclared(input: ScenarioInput): boolean {
  const axis = movementAxisFor(input.waterType);
  if (axis === "flow") return Boolean(input.flow && input.flow !== "unknown");
  if (axis === "still_state") return Boolean(input.stillState && input.stillState !== "unknown");
  return Boolean(input.tideMovement && input.tideMovement !== "unknown");
}

/** Marine types only, for call sites that genuinely need to narrow. */
export function marineTypeOf(waterType: WaterType): MarineType | null {
  return isMarine(waterType) ? waterType : null;
}
