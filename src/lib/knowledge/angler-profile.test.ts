import assert from "node:assert/strict";
import test from "node:test";

import { SPECIES } from "./species-catalog.ts";
import {
  ANGLER_PROFILE_MODEL_VERSION,
  buildAnglerSpeciesProfile,
  type AnglerProfileSectionId,
} from "./angler-profile.ts";
import { dietDossierFor, identificationDossierFor, seasonalCalendarDossierFor } from "./dossier-catalog.ts";

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

test("AFP-1.2 exposes the complete ten-question angler profile contract for every species", () => {
  assert.equal(ANGLER_PROFILE_MODEL_VERSION, "AFP-1.2");
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

test("AFP-1.2 marks fight and food value as unreviewed instead of manufacturing generic claims", () => {
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

test("AFP-1.2 keeps exact regulations outside the static species record", () => {
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

test("AFP-1.2 uses identification dossiers when reviewed and leaves remaining species explicitly incomplete", () => {
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  const bluegill = SPECIES.find((species) => species.id === "lepomis_macrochirus");
  assert.ok(rainbow && bluegill);

  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  const bluegillProfile = buildAnglerSpeciesProfile(bluegill);
  const rainbowId = rainbowProfile.sections.find((section) => section.id === "identification");
  const bluegillId = bluegillProfile.sections.find((section) => section.id === "identification");

  assert.equal(identificationDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowId?.status, "reviewed");
  assert.ok(rainbowId?.facts.some((fact) => fact.kind === "comparison"));
  assert.equal(bluegillId?.status, "partial");
  assert.ok(bluegillId?.gaps.includes("similar-species comparison keys"));
});

test("AFP-1.2 uses behavior dossiers when reviewed without converting them into catch claims", () => {
  const whiteBass = SPECIES.find((species) => species.id === "morone_chrysops");
  const bluegill = SPECIES.find((species) => species.id === "lepomis_macrochirus");
  assert.ok(whiteBass && bluegill);

  const whiteProfile = buildAnglerSpeciesProfile(whiteBass);
  const bluegillProfile = buildAnglerSpeciesProfile(bluegill);
  const whiteBehavior = whiteProfile.sections.find((section) => section.id === "behavior");
  const bluegillBehavior = bluegillProfile.sections.find((section) => section.id === "behavior");

  assert.equal(whiteBehavior?.status, "reviewed");
  assert.ok(whiteBehavior?.facts.some((fact) => fact.label === "Social pattern"));
  assert.equal(bluegillBehavior?.status, "partial");
  assert.ok(bluegillBehavior?.gaps.includes("schooling versus solitary behavior"));

  const blob = JSON.stringify(whiteProfile);
  assert.doesNotMatch(blob, /best bite|hot bite|catch probability|they will bite/i);
});

test("AFP-1.2 uses diet dossiers when reviewed and does not infer a current hatch", () => {
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  const bluegill = SPECIES.find((species) => species.id === "lepomis_macrochirus");
  assert.ok(rainbow && bluegill);

  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  const bluegillProfile = buildAnglerSpeciesProfile(bluegill);
  const rainbowDiet = rainbowProfile.sections.find((section) => section.id === "diet");
  const bluegillDiet = bluegillProfile.sections.find((section) => section.id === "diet");

  assert.equal(dietDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowDiet?.status, "reviewed");
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "season"));
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "life_stage"));
  assert.ok(rainbowDiet?.facts.some((fact) => /not proof/i.test(fact.value)));
  assert.equal(bluegillDiet?.status, "partial");
  assert.ok(bluegillDiet?.gaps.includes("spring / summer / fall / winter diet shifts"));
});

test("AFP-1.2 uses seasonal calendars when reviewed without turning spawn into a target map", () => {
  const kokanee = SPECIES.find((species) => species.id === "oncorhynchus_nerka_kokanee");
  const bluegill = SPECIES.find((species) => species.id === "lepomis_macrochirus");
  assert.ok(kokanee && bluegill);

  const kokaneeProfile = buildAnglerSpeciesProfile(kokanee);
  const bluegillProfile = buildAnglerSpeciesProfile(bluegill);
  const kokaneeCal = kokaneeProfile.sections.find((section) => section.id === "seasonal_calendar");
  const bluegillCal = bluegillProfile.sections.find((section) => section.id === "seasonal_calendar");

  assert.equal(seasonalCalendarDossierFor("oncorhynchus_nerka_kokanee")?.status, "reviewed");
  assert.equal(kokaneeCal?.status, "reviewed");
  assert.ok(kokaneeCal?.facts.some((fact) => fact.kind === "season"));
  assert.doesNotMatch(JSON.stringify(kokaneeCal), /exact spawning|staging location|migration bottleneck|hotspot/i);
  assert.equal(bluegillCal?.status, "partial");
  assert.ok(bluegillCal?.gaps.includes("month-by-month location changes"));
});

test("AFP-1.2 wave 02a marks brown, brook, lake trout, and steelhead as reviewed without collapsing steelhead into rainbow", () => {
  const ids = [
    "salmo_trutta",
    "salvelinus_fontinalis",
    "salvelinus_namaycush",
    "oncorhynchus_mykiss_steelhead",
  ];
  for (const id of ids) {
    const species = SPECIES.find((item) => item.id === id);
    assert.ok(species, id);
    const profile = buildAnglerSpeciesProfile(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
  }

  const steelhead = SPECIES.find((species) => species.id === "oncorhynchus_mykiss_steelhead");
  assert.ok(steelhead);
  const steelheadDiet = buildAnglerSpeciesProfile(steelhead).sections.find((item) => item.id === "diet");
  assert.match(JSON.stringify(steelheadDiet), /not feeding in the trout sense/i);
});
