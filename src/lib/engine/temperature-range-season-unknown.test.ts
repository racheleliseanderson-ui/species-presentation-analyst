import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import { buildPacket, encodePacketHash, parseIncomingPacket } from "../protocol/packet.ts";
import type { ScenarioInput, TemperatureRangeF } from "../protocol/types.ts";
import { interpret } from "./infer.ts";

const brown = SPECIES_BY_ID.salmo_trutta;

function scenario(range: TemperatureRangeF): ScenarioInput {
  return {
    speciesId: "salmo_trutta",
    water: { waterName: "Named public river corridor", waterType: "flowing" },
    waterType: "flowing",
    populationContext: null,
    tempF: null,
    tempRangeF: range,
    tempSource: "estimated",
    flow: "moderate",
    stillState: "unknown",
    clarity: "clear",
    light: "low_light",
    weather: "stable",
    season: "unknown",
    holdingRiver: "seam",
    holdingStill: null,
    forage: null,
  };
}

describe("temperature ranges and unknown season", () => {
  it("uses a range that stays wholly inside one thermal state without inventing a midpoint", () => {
    const range: TemperatureRangeF = [...brown.thermal.preferredF];
    const result = interpret(scenario(range));
    assert.ok(!("error" in result), "expected a reading");
    if ("error" in result) return;

    assert.equal(result.thermalState, "preferred");
    assert.match(result.thermalLabel, /stays inside the preferred band/i);
    assert.ok(!result.unknowns.includes("water temperature"));
    assert.ok(result.unknowns.includes("season"));
    assert.ok(
      result.presentations.every((presentation) =>
        presentation.weightReasons.every((reason) => reason.axis !== "season"),
      ),
      "unknown season must contribute no seasonal weighting delta",
    );
  });

  it("withholds a single thermal bias when a range crosses thermal states", () => {
    const range: TemperatureRangeF = [
      brown.thermal.activeF[0],
      brown.thermal.preferredF[0],
    ];
    const result = interpret(scenario(range));
    assert.ok(!("error" in result), "expected a reading");
    if ("error" in result) return;

    assert.equal(result.thermalState, "unknown");
    assert.match(result.thermalLabel, /withholds a single thermal bias rather than inventing a midpoint/i);
    assert.ok(
      result.presentations.every((presentation) =>
        presentation.weightReasons.every((reason) => reason.axis !== "thermal"),
      ),
      "a mixed range must not apply one exact thermal-state delta",
    );
  });

  it("round-trips a temperature range through the HTH packet without coordinates or midpoint synthesis", () => {
    const range: TemperatureRangeF = [...brown.thermal.preferredF];
    const input = scenario(range);
    const result = interpret(input);
    assert.ok(!("error" in result), "expected a reading");
    if ("error" in result) return;

    const packet = buildPacket(input, result);
    assert.deepEqual(packet.conditions.tempRangeF, range);
    assert.equal(packet.conditions.tempF, null);
    assert.equal(packet.privacy.containsCoordinates, false);

    const parsed = parseIncomingPacket(encodePacketHash(packet));
    assert.deepEqual(parsed?.tempRangeF, range);
    assert.equal(parsed?.tempF, null);
  });
});
