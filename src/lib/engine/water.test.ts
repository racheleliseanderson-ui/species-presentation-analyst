import assert from "node:assert/strict";
import { test } from "node:test";
import {
  declaredHolding,
  familyFitsWater,
  holdingOptionsFor,
  movementAxisFor,
  movementDeclared,
  reviewedHoldingFor,
  reviewedPresentationsFor,
} from "./water.ts";
import { PRESENTATIONS } from "../knowledge/presentations.ts";
import { SPECIES } from "../knowledge/species-catalog.ts";
import {
  HOLDING_BY_WATER_TYPE,
  MARINE_TYPES,
  WATER_TYPES,
  isMarine,
  labelOf,
  type WaterType,
} from "../protocol/vocab.ts";
import type { ScenarioInput } from "../protocol/types.ts";

function input(overrides: Partial<ScenarioInput> = {}): ScenarioInput {
  return {
    speciesId: "salmo_trutta",
    water: {},
    waterType: "flowing",
    populationContext: null,
    tempF: 54,
    tempRangeF: null,
    tempSource: "user_measured",
    flow: "moderate",
    stillState: "unknown",
    clarity: "clear",
    light: "low_light",
    weather: "stable",
    season: "spring",
    holdingRiver: "seam",
    holdingStill: null,
    forage: null,
    ...overrides,
  };
}

test("every water type has its own holding vocabulary, and they do not overlap by accident", () => {
  for (const waterType of WATER_TYPES) {
    assert.ok(holdingOptionsFor(waterType).length > 0, `${waterType} has no holding classes`);
  }
  // The four marine lists are the point of having four marine types: a surf
  // angler must not be offered an offshore canyon edge.
  for (const a of MARINE_TYPES) {
    for (const b of MARINE_TYPES) {
      if (a === b) continue;
      const shared = holdingOptionsFor(a).filter((item) => holdingOptionsFor(b).includes(item));
      assert.equal(shared.length, 0, `${a} and ${b} share ${shared.join(", ")}`);
    }
  }
});

test("every holding class is labelled for a reader", () => {
  for (const waterType of WATER_TYPES) {
    for (const holding of HOLDING_BY_WATER_TYPE[waterType]) {
      assert.notEqual(
        labelOf(holding),
        holding.replaceAll("_", " ").replace(/^./, (c) => c),
        `${holding} has no label`,
      );
    }
  }
});

test("the declared holding comes from the water actually being fished", () => {
  assert.equal(declaredHolding(input({ waterType: "flowing", holdingRiver: "seam" })), "seam");
  assert.equal(
    declaredHolding(
      input({ waterType: "stillwater", holdingRiver: "seam", holdingStill: "weed_edge" }),
    ),
    "weed_edge",
  );
  // The bug this helper exists to prevent: marine reading the stillwater field.
  assert.equal(
    declaredHolding(
      input({ waterType: "surf", holdingStill: "weed_edge", holdingMarine: "surf_trough" }),
    ),
    "surf_trough",
  );
  assert.equal(declaredHolding(input({ waterType: "offshore", holdingStill: "basin" })), null);
});

test("each water type is read on the movement axis that governs it", () => {
  assert.equal(movementAxisFor("flowing"), "flow");
  assert.equal(movementAxisFor("stillwater"), "still_state");
  for (const marine of MARINE_TYPES) assert.equal(movementAxisFor(marine), "tide");
});

test("a marine reading counts tide, not flow, as the movement it is missing", () => {
  // Flow declared but irrelevant: the tide is what is undeclared here.
  assert.equal(movementDeclared(input({ waterType: "inshore", flow: "moderate" })), false);
  assert.equal(movementDeclared(input({ waterType: "inshore", tideMovement: "ebbing" })), true);
  assert.equal(movementDeclared(input({ waterType: "flowing", flow: "moderate" })), true);
});

test("family water slots resolve correctly for every water type", () => {
  assert.ok(familyFitsWater("both", "flowing"));
  assert.ok(familyFitsWater("both", "stillwater"));
  assert.equal(familyFitsWater("both", "surf"), false, "`both` must stay freshwater-only");

  for (const marine of MARINE_TYPES) assert.ok(familyFitsWater("saltwater", marine));
  assert.equal(familyFitsWater("saltwater", "flowing"), false);

  assert.ok(familyFitsWater(["stillwater", "nearshore"], "nearshore"));
  assert.equal(familyFitsWater(["stillwater", "nearshore"], "surf"), false);
});

test("every water type can actually be fished — it offers families and they exist", () => {
  for (const waterType of WATER_TYPES) {
    const families = PRESENTATIONS.filter((family) => familyFitsWater(family.water, waterType));
    assert.ok(
      families.length >= 5,
      `${waterType} offers only ${families.length} families; a reading there would be threadbare`,
    );
  }
});

test("a species is only offered water it is reviewed for, and holding classes from that water", () => {
  for (const species of SPECIES) {
    for (const waterType of species.habitat.waterTypes as WaterType[]) {
      const holding = reviewedHoldingFor(species, waterType);
      const permitted = holdingOptionsFor(waterType);
      for (const item of holding) {
        assert.ok(
          permitted.includes(item),
          `${species.id} lists ${item} for ${waterType}, which is not a ${waterType} class`,
        );
      }
      if (isMarine(waterType)) {
        const withheld =
          species.targetStatus === "conservation_sensitive" ||
          species.targetStatus === "non_target";
        const presentations = reviewedPresentationsFor(species, waterType);
        if (withheld) {
          // Tarpon and anything else in this class get no presentation
          // guidance anywhere in the app. A record that carried some would be
          // a leak, not an omission, so this is the stricter assertion.
          assert.equal(
            presentations.length,
            0,
            `${species.id} is ${species.targetStatus} but lists ${waterType} presentations`,
          );
        } else {
          assert.ok(
            presentations.length > 0,
            `${species.id} claims ${waterType} but lists no presentations for it`,
          );
        }
      }
    }
  }
});
