import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fieldBrief } from "./brief.ts";
import { interpret } from "./infer.ts";
import { drivingChanges } from "./sensitivity.ts";
import type { ScenarioInput } from "../protocol/types.ts";

const brownSeam: ScenarioInput = {
  speciesId: "salmo_trutta",
  water: { waterName: "Named public river corridor", waterType: "flowing" },
  waterType: "flowing",
  tempF: 54,
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
};

describe("interpret", () => {
  it("returns a preferred-band brown trout reading on a measured 54°F seam", () => {
    const r = interpret(brownSeam);
    assert.ok(!("error" in r), "expected a reading");
    if ("error" in r) return;
    assert.equal(r.thermalState, "preferred");
    assert.equal(r.presentations[0]?.id, "surface_drift");
    assert.equal(r.confidence.evidence, "high");
    assert.equal(r.confidence.forage, "low");
    assert.equal(r.species.id, "salmo_trutta");
  });

  it("fail-closes steelhead on stillwater instead of inventing biology", () => {
    const r = interpret({
      ...brownSeam,
      speciesId: "oncorhynchus_mykiss_steelhead",
      waterType: "stillwater",
    });
    assert.ok("error" in r);
    if (!("error" in r)) return;
    assert.match(r.error, /no reviewed Stillwater record/i);
  });

  it("fail-closes an unreviewed species id", () => {
    const r = interpret({ ...brownSeam, speciesId: "salmo_inventus" });
    assert.ok("error" in r);
  });

  it("ranks stillwater families for largemouth on a weed edge", () => {
    const r = interpret({
      speciesId: "micropterus_nigricans",
      water: { waterName: "Named public reservoir", waterType: "stillwater" },
      waterType: "stillwater",
      tempF: 74,
      tempSource: "user_measured",
      flow: "unknown",
      stillState: "stable",
      clarity: "lightly_stained",
      light: "low_light",
      weather: "stable",
      season: "summer",
      holdingRiver: null,
      holdingStill: "weed_edge",
      forage: null,
    });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.ok(r.presentations.length >= 2);
    assert.ok(r.presentations.every((p) => p.id !== "dead_drift"));
  });

  it("does not treat unknown temperature as a preferred band", () => {
    const r = interpret({ ...brownSeam, tempF: null, tempSource: "unknown" });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.equal(r.thermalState, "unknown");
    assert.equal(r.confidence.evidence, "low");
    assert.ok(r.unknowns.includes("water temperature"));
  });

  it("changes the leading family when low light is removed", () => {
    const dim = interpret(brownSeam);
    const bright = interpret({ ...brownSeam, light: "bright" });
    assert.ok(!("error" in dim) && !("error" in bright));
    if ("error" in dim || "error" in bright) return;
    assert.equal(dim.presentations[0]?.id, "surface_drift");
    assert.notEqual(bright.presentations[0]?.id, dim.presentations[0]?.id);
  });
});

describe("drivingChanges", () => {
  it("reports light as a driver on the brown trout starter", () => {
    const drivers = drivingChanges(brownSeam);
    assert.ok(
      drivers.some((d) => d.variable === "Light" && d.familyBefore !== d.familyAfter),
      JSON.stringify(drivers),
    );
  });
});

describe("fieldBrief", () => {
  it("is a keepable plain-text brief without coordinates or scores", () => {
    const r = interpret(brownSeam);
    assert.ok(!("error" in r));
    if ("error" in r) return;
    const text = fieldBrief(brownSeam, r);
    assert.match(text, /Brown trout/);
    assert.match(text, /Surface drift|Dead drift/);
    assert.doesNotMatch(text, /\bhotspot\b/i);
    assert.match(text, /coordinates not stored/i);
    assert.match(text, /not a bite prediction/i);
  });
});
