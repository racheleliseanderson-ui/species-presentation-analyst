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
  it("returns an SPW-1.1 preferred-band brown trout reading with species override provenance", () => {
    const r = interpret(brownSeam);
    assert.ok(!("error" in r), "expected a reading");
    if ("error" in r) return;
    assert.equal(r.thermalState, "preferred");
    assert.equal(r.presentations[0]?.id, "dead_drift");
    assert.equal(r.weightingModel.version, "SPW-1.1");
    assert.equal(r.weightingModel.speciesOverrideVersion, "SPO-1.0");
    assert.deepEqual(r.weightingModel.coreAxes, [
      "species",
      "season",
      "thermal",
      "water_type",
      "holding",
      "forage",
    ]);
    assert.ok(r.presentations[0]!.weightReasons.some((x) => x.axis === "species"));
    assert.ok(r.presentations[0]!.weightReasons.some((x) => x.axis === "season"));
    assert.ok(r.presentations[0]!.weightReasons.some((x) => x.axis === "water_type"));
    assert.ok(r.presentations[0]!.weightReasons.some((x) => x.axis === "holding"));
    assert.equal(r.confidence.evidence, "high");
    assert.equal(r.confidence.forage, "low");
    assert.equal(r.species.id, "salmo_trutta");
    assert.match(r.trace.join("\n"), /relative weights are ranking mechanics, never bite probability/i);
  });

  it("changes the leading family when holding water changes from seam to deep pool", () => {
    const seam = interpret(brownSeam);
    const pool = interpret({ ...brownSeam, holdingRiver: "deep_pool" });
    assert.ok(!("error" in seam) && !("error" in pool));
    if ("error" in seam || "error" in pool) return;
    assert.equal(seam.presentations[0]?.id, "dead_drift");
    assert.equal(pool.presentations[0]?.id, "bottom_contact_drift");
    assert.ok(pool.weightingModel.appliedSpeciesOverrideIds?.includes("brown-deep-cover"));
    assert.ok(pool.presentations[0]!.weightReasons.some((x) => x.axis === "species_override"));
  });

  it("distinguishes brown trout from rainbow trout under the same baitfish declaration", () => {
    const forage = { class: "small_forage_fish" as const, source: "user_observation" as const, confidence: 0.9 };
    const brown = interpret({ ...brownSeam, forage });
    const rainbow = interpret({ ...brownSeam, speciesId: "oncorhynchus_mykiss", forage });
    assert.ok(!("error" in brown) && !("error" in rainbow));
    if ("error" in brown || "error" in rainbow) return;
    assert.equal(brown.presentations[0]?.id, "cross_current_retrieve");
    assert.equal(rainbow.presentations[0]?.id, "dead_drift");
    assert.ok(brown.weightingModel.appliedSpeciesOverrideIds?.includes("brown-piscivory"));
    assert.ok(rainbow.weightingModel.appliedSpeciesOverrideIds?.includes("rainbow-flow-feeding-lane"));
    assert.ok(
      brown.presentations.some((p) => p.weightReasons.some((x) => x.axis === "species_override")),
    );
  });

  it("applies observed forage as a real weight axis without introducing an unreviewed family", () => {
    const base = interpret(brownSeam);
    const baitfish = interpret({
      ...brownSeam,
      forage: { class: "small_forage_fish", source: "user_observation", confidence: 0.9 },
    });
    assert.ok(!("error" in base) && !("error" in baitfish));
    if ("error" in base || "error" in baitfish) return;
    const baseCross = base.presentations.find((p) => p.id === "cross_current_retrieve");
    const baitCross = baitfish.presentations.find((p) => p.id === "cross_current_retrieve");
    assert.ok(baseCross && baitCross);
    assert.ok(baitCross.weight > baseCross.weight);
    assert.ok(baitCross.weightReasons.some((x) => x.axis === "forage" && x.delta > 0));
    assert.ok(baitCross.weightReasons.some((x) => x.axis === "species_override" && x.delta > 0));
    assert.ok(
      baitfish.presentations.every((p) =>
        ["dead_drift", "bottom_contact_drift", "cross_current_retrieve", "swing", "surface_drift"].includes(p.id),
      ),
    );
  });

  it("applies largemouth cover overrides without leaking flowing-water families", () => {
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
    assert.ok(r.weightingModel.appliedSpeciesOverrideIds?.includes("largemouth-cover-summer"));
    assert.ok(r.presentations.some((p) => p.weightReasons.some((x) => x.axis === "species_override")));
    assert.ok(r.presentations.every((p) => p.id !== "dead_drift" && p.id !== "bottom_contact_drift"));
  });

  it("applies lake-trout summer depth overrides to reviewed deep-water families", () => {
    const r = interpret({
      speciesId: "salvelinus_namaycush",
      water: { waterName: "Named public lake", waterType: "stillwater" },
      waterType: "stillwater",
      tempF: 48,
      tempSource: "official_station",
      flow: "unknown",
      stillState: "stratified",
      clarity: "clear",
      light: "bright",
      weather: "stable",
      season: "summer",
      holdingRiver: null,
      holdingStill: "thermocline_edge",
      forage: { class: "small_forage_fish", source: "user_observation" },
    });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.ok(r.weightingModel.appliedSpeciesOverrideIds?.includes("lake-trout-summer-depth"));
    assert.ok(["trolling", "vertical_jig", "suspend_pause", "horizontal_retrieve"].includes(r.presentations[0]!.id));
    assert.ok(r.presentations.every((p) => ["vertical_jig", "trolling", "suspend_pause", "horizontal_retrieve"].includes(p.id)));
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

  it("keeps conservation-sensitive bull trout as context only before override evaluation", () => {
    const r = interpret({ ...brownSeam, speciesId: "salvelinus_confluentus", tempF: 48 });
    assert.ok("error" in r);
    if (!("error" in r)) return;
    assert.match(r.error, /biological context only/i);
    assert.match(r.error, /will not emit presentation guidance/i);
  });

  it("allows regulated-context lake sturgeon and requires jurisdiction verification", () => {
    const r = interpret({
      ...brownSeam,
      speciesId: "acipenser_fulvescens",
      tempF: 58,
      holdingRiver: "deep_pool",
      light: "mixed",
    });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.equal(r.species.targetStatus, "regulated_context");
    assert.equal(r.species.targetContext?.verifyLocalRules, true);
    assert.ok(r.invalidators.some((x) => /regulated|regulations|jurisdiction|season|legal/i.test(x)));
    assert.ok(r.unknowns.includes("current jurisdiction rules"));
    assert.match(r.trace[1] ?? "", /regulated context/i);
  });

  it("clears the jurisdiction unknown when a regulated-context water declares it", () => {
    const r = interpret({
      ...brownSeam,
      speciesId: "acipenser_fulvescens",
      water: { ...brownSeam.water, jurisdiction: "Example current state jurisdiction" },
      tempF: 58,
      holdingRiver: "deep_pool",
    });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.ok(!r.unknowns.includes("current jurisdiction rules"));
  });

  it("does not treat unknown temperature as a preferred band", () => {
    const r = interpret({ ...brownSeam, tempF: null, tempSource: "unknown" });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.equal(r.thermalState, "unknown");
    assert.equal(r.confidence.evidence, "low");
    assert.ok(r.unknowns.includes("water temperature"));
  });
});

describe("drivingChanges", () => {
  it("can identify observed forage as a driver when the holding class makes the alternatives close", () => {
    const drivers = drivingChanges({ ...brownSeam, holdingRiver: "deep_pool" });
    assert.ok(
      drivers.some((d) => d.variable === "Observed forage" && d.familyBefore !== d.familyAfter),
      JSON.stringify(drivers),
    );
  });
});

describe("fieldBrief", () => {
  it("is a keepable plain-text brief without coordinates or probability language", () => {
    const r = interpret(brownSeam);
    assert.ok(!("error" in r));
    if ("error" in r) return;
    const text = fieldBrief(brownSeam, r);
    assert.match(text, /Brown trout/);
    assert.match(text, /Dead drift|Bottom-contact drift|Cross-current retrieve/);
    assert.doesNotMatch(text, /\bhotspot\b/i);
    assert.match(text, /coordinates not stored/i);
    assert.match(text, /not a bite prediction/i);
  });
});
