import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import { encodePacketHash, readPacket } from "../hth-packet.ts";
import { applyIncoming, buildPacket } from "../protocol/packet.ts";
import type { ScenarioInput, TemperatureRangeF } from "../protocol/types.ts";
import { interpret } from "./infer.ts";

const brown = SPECIES_BY_ID.salmo_trutta;

// Brown trout is one of the best-sourced records in the catalog; if its band
// ever goes missing, that is a catalog regression and not something this test
// should paper over.
const brownThermal = brown.thermal;
if (!brownThermal?.preferredF || !brownThermal.activeF) {
  throw new Error("salmo_trutta must carry a full reviewed thermal band");
}
const brownPreferred = brownThermal.preferredF;
const brownActive = brownThermal.activeF;

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
    const range: TemperatureRangeF = [...brownPreferred];
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
      brownActive[0],
      brownPreferred[0],
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
    const range: TemperatureRangeF = [...brownPreferred];
    const input = scenario(range);
    const result = interpret(input);
    assert.ok(!("error" in result), "expected a reading");
    if ("error" in result) return;

    const packet = buildPacket(input, result, { incoming: null });
    assert.deepEqual(packet.conditions?.tempRangeF, { low: range[0], high: range[1] });
    assert.equal(packet.conditions?.tempF, null);
    assert.equal(packet.privacy?.containsCoordinates, false);

    const read = readPacket(encodePacketHash(packet));
    assert.equal(read.state, "ok");
    if (read.state !== "ok") return;
    const parsed = applyIncoming(read.packet);
    assert.deepEqual(parsed.tempRangeF, range);
    assert.equal(parsed.tempF, null);
    // The fish the reader picked travels under the fleet's own key, so the next
    // instrument does not have to know this app's internal shape to find it.
    assert.equal(read.packet.water?.selectedSpecies, "salmo_trutta");
    assert.equal(parsed.speciesId, "salmo_trutta");
  });

  it("resolves a Field Ops species slug through the carried common name", () => {
    const packet = {
      packetVersion: "HTH-1.0",
      origin: "field-ops-desk",
      fleet: { contract: "HTH-FLEET-1.0", trail: [], lastUpdatedBy: "field-ops-desk" },
      species: { speciesId: "brown-trout", commonNames: ["Brown trout"] },
      water: { waterName: "Named public river", waterType: "flowing" },
      conditions: { waterType: "flowing" },
      privacy: { containsCoordinates: false, containsPrivateWater: false },
    };

    const read = readPacket(`#packet=${encodeURIComponent(JSON.stringify(packet))}`);
    assert.equal(read.state, "ok");
    if (read.state !== "ok") return;
    assert.equal(applyIncoming(read.packet).speciesId, "salmo_trutta");
  });

  it("prefers the fleet key over this app's older one when both arrive", () => {
    const packet = {
      packetVersion: "HTH-1.0",
      origin: "field-sense",
      fleet: { contract: "HTH-FLEET-1.0", trail: [], lastUpdatedBy: "field-sense" },
      // An older Species packet sitting in a tab still says `species.id`. The
      // fleet's `water.selectedSpecies` is what the water tool actually writes,
      // and it is the one that should win.
      species: { id: "salmo_trutta" },
      water: { waterName: "Named public river", selectedSpecies: "micropterus_dolomieu" },
      conditions: { waterType: "stillwater" },
    };

    const read = readPacket(`#packet=${encodeURIComponent(JSON.stringify(packet))}`);
    assert.equal(read.state, "ok");
    if (read.state !== "ok") return;
    assert.equal(applyIncoming(read.packet).speciesId, "micropterus_dolomieu");
  });

  it("says so when a packet arrives that it cannot honour", () => {
    const stale = { packetVersion: "HTH-0.9", origin: "field-sense" };
    const read = readPacket(`#packet=${encodeURIComponent(JSON.stringify(stale))}`);
    assert.equal(read.state, "invalid");
    if (read.state !== "invalid") return;
    assert.match(read.reason, /HTH-0\.9/);
    assert.match(read.reason, /Nothing has been carried across/);
  });
});
