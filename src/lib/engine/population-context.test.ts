import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  POPULATION_CONTEXT_PROFILES,
  REGIONAL_POPULATION_MODEL_VERSION,
  populationProfilesForSpecies,
} from "./population-context.ts";
import { interpret } from "./infer.ts";
import { SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import type { ScenarioInput } from "../protocol/types.ts";

const smallmouthRiver: ScenarioInput = {
  speciesId: "micropterus_dolomieu",
  water: { waterName: "Named public river corridor", waterType: "flowing" },
  waterType: "flowing",
  populationContext: null,
  tempF: 62,
  tempSource: "user_measured",
  flow: "moderate",
  stillState: "unknown",
  clarity: "clear",
  light: "mixed",
  weather: "stable",
  season: "early_summer",
  holdingRiver: "current_break",
  holdingStill: null,
  forage: { class: "crustaceans", source: "user_observation", confidence: 0.9 },
};

describe("RPC-1.0 catalog invariants", () => {
  it("contains 16 unique first-wave profiles across eight species", () => {
    assert.equal(REGIONAL_POPULATION_MODEL_VERSION, "RPC-1.0");
    assert.equal(POPULATION_CONTEXT_PROFILES.length, 16);
    assert.equal(new Set(POPULATION_CONTEXT_PROFILES.map((profile) => profile.id)).size, 16);
    assert.equal(new Set(POPULATION_CONTEXT_PROFILES.map((profile) => profile.speciesId)).size, 8);
  });

  it("references only reviewed species, compatible water types, and reviewed presentation families", () => {
    for (const profile of POPULATION_CONTEXT_PROFILES) {
      const species = SPECIES_BY_ID[profile.speciesId];
      assert.ok(species, `missing species ${profile.speciesId}`);
      for (const waterType of profile.waterTypes) {
        assert.ok(
          species.habitat.waterTypes.includes(waterType),
          `${profile.id} uses unsupported water type ${waterType}`,
        );
        const approved = new Set(
          waterType === "flowing" ? species.flowingPresentations : species.stillPresentations,
        );
        for (const family of Object.keys(profile.bias)) {
          assert.ok(
            approved.has(family as never),
            `${profile.id} references unreviewed family ${family}`,
          );
        }
      }
      assert.ok(profile.positioning.length > 20);
      assert.ok(profile.invalidators.length > 0);
      assert.ok(profile.sources.length > 0);
    }
  });
});

describe("RPC-1.0 interpretation behavior", () => {
  it("keeps the generic species record when no profile is declared and reports the missing context", () => {
    const r = interpret(smallmouthRiver);
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.equal(r.populationContext, undefined);
    assert.equal(r.weightingModel.regionalPopulationVersion, "RPC-1.0");
    assert.equal(r.weightingModel.appliedPopulationProfileId, undefined);
    assert.ok(r.unknowns.includes("regional / population context"));
    assert.ok(
      r.presentations.every((p) =>
        p.weightReasons.every((reason) => reason.axis !== "population_context"),
      ),
    );
    assert.match(r.trace.join("\n"), /generic species record retained/i);
  });

  it("applies an explicitly declared river profile without adding presentation families", () => {
    const r = interpret({
      ...smallmouthRiver,
      populationContext: { profileId: "smallmouth-cool-river", source: "user_declared" },
    });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.equal(r.populationContext?.profileId, "smallmouth-cool-river");
    assert.equal(r.populationContext?.systemArchetype, "rocky_river");
    assert.equal(r.weightingModel.appliedPopulationProfileId, "smallmouth-cool-river");
    assert.ok(!r.unknowns.includes("regional / population context"));
    assert.ok(
      r.presentations.some((p) =>
        p.weightReasons.some((reason) => reason.axis === "population_context" && reason.delta > 0),
      ),
    );
    assert.ok(
      r.presentations.every((p) =>
        [
          "cross_current_retrieve",
          "pulse_jig",
          "bottom_contact_drift",
          "upstream_retrieve",
        ].includes(p.id),
      ),
    );
    assert.match(r.positioning.map((x) => x.text).join("\n"), /cool clear river/i);
  });

  it("fails closed when a reviewed profile belongs to another species", () => {
    const r = interpret({
      ...smallmouthRiver,
      populationContext: { profileId: "walleye-large-river", source: "user_declared" },
    });
    assert.ok("error" in r);
    if (!("error" in r)) return;
    assert.match(r.error, /not a reviewed population context for Smallmouth bass/i);
  });

  it("fails closed when a profile is incompatible with the declared water type", () => {
    const r = interpret({
      ...smallmouthRiver,
      speciesId: "morone_saxatilis",
      populationContext: { profileId: "striped-landlocked-reservoir", source: "user_declared" },
    });
    assert.ok("error" in r);
    if (!("error" in r)) return;
    assert.match(r.error, /not reviewed for flowing/i);
  });

  it("carries Field Sense as provenance only when the profile is explicitly supplied", () => {
    const r = interpret({
      ...smallmouthRiver,
      populationContext: { profileId: "smallmouth-cool-river", source: "field_sense" },
    });
    assert.ok(!("error" in r));
    if ("error" in r) return;
    assert.equal(r.populationContext?.source, "field_sense");
    assert.match(r.trace.join("\n"), /field sense/i);
  });

  it("filters profile options by species and water type", () => {
    assert.deepEqual(
      populationProfilesForSpecies("oncorhynchus_clarkii", "flowing").map((x) => x.id),
      ["cutthroat-interior-resident-fluvial"],
    );
    assert.deepEqual(
      populationProfilesForSpecies("oncorhynchus_clarkii", "stillwater").map((x) => x.id),
      ["cutthroat-adfluvial-lake"],
    );
  });
});
