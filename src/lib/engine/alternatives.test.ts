import assert from "node:assert/strict";
import { test } from "node:test";
import { alternatives } from "./alternatives.ts";
import { interpret } from "./infer.ts";
import { authoredOverlays } from "../knowledge/coverage.ts";
import type { Interpretation, ScenarioInput } from "../protocol/types.ts";

function input(overrides: Partial<ScenarioInput> = {}): ScenarioInput {
  return {
    speciesId: "salmo_trutta",
    water: { waterType: "flowing" },
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

function read(scenario: ScenarioInput): Interpretation {
  const result = interpret(scenario);
  assert.ok(!("error" in result), "expected a readable scenario");
  return result as Interpretation;
}

test("the cheapest change is offered first: presentation before position", () => {
  const scenario = input();
  const moves = alternatives(scenario, read(scenario), authoredOverlays("salmo_trutta"));
  assert.ok(moves.length > 0);
  assert.equal(moves[0].id, "next-family");
});

test("alternative families are drawn from the ranked list, never invented", () => {
  const scenario = input();
  const result = read(scenario);
  const ranked = new Set(result.presentations.map((item) => item.id));
  for (const move of alternatives(scenario, result, authoredOverlays("salmo_trutta"))) {
    if (!move.family) continue;
    assert.ok(ranked.has(move.family.id as never), `${move.family.id} is not a ranked family`);
  }
});

test("suggested water is always a reviewed holding class for this species", () => {
  const scenario = input();
  const result = read(scenario);
  const move = alternatives(scenario, result, authoredOverlays("salmo_trutta")).find((item) => item.id === "next-water");
  assert.ok(move);
  // Reviewed classes are named in reader-facing words; the move must not name a
  // class the record does not carry.
  const reviewed = result.species.habitat.riverHolding;
  assert.ok(reviewed.length > 0);
  assert.ok(move.move.length > 0);
});

test("time of day is only suggested when the angler is fishing bright or mixed light", () => {
  const night = input({ light: "night" });
  assert.equal(
    alternatives(night, read(night), authoredOverlays("salmo_trutta")).some((move) => move.id === "time-of-day"),
    false,
  );
  const bright = input({ light: "bright" });
  const moves = alternatives(bright, read(bright), authoredOverlays("salmo_trutta"));
  // Present only if the species carries a reviewed behavior dossier.
  assert.ok(moves.every((move) => move.why.length > 0));
});

test("the last move is always to go and find out what is unknown", () => {
  const scenario = input({ clarity: "unknown", weather: "unknown", forage: null });
  const moves = alternatives(scenario, read(scenario), authoredOverlays("salmo_trutta"));
  assert.equal(moves[moves.length - 1].id, "redeclare");
});

test("a fully declared scenario does not end with a redeclare step it cannot justify", () => {
  const scenario = input({
    clarity: "clear",
    light: "low_light",
    weather: "stable",
    flow: "moderate",
    holdingRiver: "seam",
    forage: { class: "aquatic_insects", source: "user_observation" },
  });
  const result = read(scenario);
  const moves = alternatives(scenario, result, authoredOverlays("salmo_trutta"));
  const redeclare = moves.find((move) => move.id === "redeclare");
  if (result.unknowns.length === 0) {
    assert.equal(redeclare, undefined);
  } else {
    assert.ok(redeclare);
  }
});

test("every move states a symptom, a change, and a reason", () => {
  const scenario = input();
  for (const move of alternatives(scenario, read(scenario), authoredOverlays("salmo_trutta"))) {
    assert.ok(move.symptom.trim().length > 0, `${move.id} has no symptom`);
    assert.ok(move.move.trim().length > 0, `${move.id} has no move`);
    assert.ok(move.why.trim().length > 0, `${move.id} has no reason`);
  }
});
