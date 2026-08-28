import assert from "node:assert/strict";
import test from "node:test";

import { SPECIES } from "./species-catalog.ts";
import {
  ANGLER_PROFILE_MODEL_VERSION,
  buildAnglerSpeciesProfile,
  type AnglerProfileSectionId,
} from "./angler-profile.ts";

const EXPECTED_SECTIONS: AnglerProfileSectionId[] = [
  "identification",
  "habitat_location",
  "behavior",
  "diet",
  "methods",
  "seasonal_calendar",
  "conditions",
  "fight",
  "food_value",
  "regulations_conservation",
];

test("AFP-1.0 exposes the complete ten-question angler profile contract for every species", () => {
  assert.equal(ANGLER_PROFILE_MODEL_VERSION, "AFP-1.0");
  assert.equal(SPECIES.length, 75);

  for (const species of SPECIES) {
    const profile = buildAnglerSpeciesProfile(species);
    assert.equal(profile.speciesId, species.id);
    assert.deepEqual(
      profile.sections.map((section) => section.id),
      EXPECTED_SECTIONS,
    );
    assert.equal(profile.coverage.total, 10);
    assert.equal(
      profile.coverage.reviewed + profile.coverage.partial + profile.coverage.notReviewed,
      10,
    );
  }
});

test("AFP-1.0 marks fight and food value as unreviewed instead of manufacturing generic claims", () => {
  for (const species of SPECIES) {
    const profile = buildAnglerSpeciesProfile(species);
    const fight = profile.sections.find((section) => section.id === "fight");
    const food = profile.sections.find((section) => section.id === "food_value");
    assert.equal(fight?.status, "not_reviewed");
    assert.equal(food?.status, "not_reviewed");
    assert.equal(fight?.facts.length, 0);
    assert.equal(food?.facts.length, 0);
  }
});

test("AFP-1.0 keeps exact regulations outside the static species record", () => {
  for (const species of SPECIES) {
    const profile = buildAnglerSpeciesProfile(species);
    const regulations = profile.sections.find(
      (section) => section.id === "regulations_conservation",
    );
    assert.equal(regulations?.status, "partial");
    assert.ok(regulations?.gaps.includes("live size limits"));
    assert.ok(regulations?.gaps.includes("live bag / possession limits"));
    assert.ok(regulations?.gaps.includes("open / closed seasons"));
  }
});
