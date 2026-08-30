import assert from "node:assert/strict";
import test from "node:test";

import { SPECIES } from "./species-catalog.ts";
import {
  ANGLER_PROFILE_MODEL_VERSION,
  buildAnglerSpeciesProfile,
  type AnglerProfileSectionId,
} from "./angler-profile.ts";
import {
  dietDossierFor,
  fightDossierFor,
  foodValueDossierFor,
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";
import { CONSUMPTION_ADVISORY_RULE } from "./dossier-types.ts";

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

test("AFP-1.3 exposes the complete ten-question angler profile contract for every species", () => {
  assert.equal(ANGLER_PROFILE_MODEL_VERSION, "AFP-1.3");
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

test("AFP-1.3 leaves fight and food unreviewed when no dossier exists instead of manufacturing claims", () => {
  const brook = SPECIES.find((species) => species.id === "salvelinus_fontinalis");
  assert.ok(brook);
  const profile = buildAnglerSpeciesProfile(brook);
  const fight = profile.sections.find((section) => section.id === "fight");
  const food = profile.sections.find((section) => section.id === "food_value");
  assert.equal(fightDossierFor("salvelinus_fontinalis"), null);
  assert.equal(foodValueDossierFor("salvelinus_fontinalis"), null);
  assert.equal(fight?.status, "not_reviewed");
  assert.equal(food?.status, "not_reviewed");
  assert.equal(fight?.facts.length, 0);
  assert.equal(food?.facts.length, 0);
  assert.doesNotMatch(JSON.stringify(profile), /fun rating|1–100|1-100|this species is safe to eat/i);
});

test("AFP-1.3 uses fight dossiers when reviewed without converting them into scores", () => {
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  const cutthroat = SPECIES.find((species) => species.id === "oncorhynchus_clarkii");
  assert.ok(rainbow && cutthroat);

  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  const cutthroatProfile = buildAnglerSpeciesProfile(cutthroat);
  const rainbowFight = rainbowProfile.sections.find((section) => section.id === "fight");
  const cutthroatFight = cutthroatProfile.sections.find((section) => section.id === "fight");

  assert.equal(fightDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowFight?.status, "reviewed");
  assert.ok(rainbowFight?.facts.some((fact) => fact.label === "Jumping"));
  assert.ok(rainbowFight?.facts.some((fact) => /leaping|peeling line/i.test(fact.value)));
  assert.equal(cutthroatFight?.status, "partial");
  assert.ok(cutthroatFight?.gaps.some((gap) => /independent of rainbow/i.test(gap)));
  assert.doesNotMatch(JSON.stringify(cutthroatFight), /peeling line|MassWildlife/);
  assert.ok(!rainbowFight?.facts.some((fact) => /\b\d+\s*\/\s*100\b/.test(fact.value)));
  assert.ok(rainbowFight?.facts.some((fact) => fact.label === "Relative strength" && /powerful/i.test(fact.value)));
});

test("AFP-1.3 uses food dossiers when reviewed without writing a safety claim", () => {
  const kokanee = SPECIES.find((species) => species.id === "oncorhynchus_nerka_kokanee");
  const sockeye = SPECIES.find((species) => species.id === "oncorhynchus_nerka_anadromous");
  const brook = SPECIES.find((species) => species.id === "salvelinus_fontinalis");
  assert.ok(kokanee && sockeye && brook);

  const kokaneeFood = buildAnglerSpeciesProfile(kokanee).sections.find((section) => section.id === "food_value");
  const sockeyeFood = buildAnglerSpeciesProfile(sockeye).sections.find((section) => section.id === "food_value");
  const brookFood = buildAnglerSpeciesProfile(brook).sections.find((section) => section.id === "food_value");

  assert.equal(foodValueDossierFor("oncorhynchus_nerka_kokanee")?.status, "reviewed");
  assert.equal(kokaneeFood?.status, "reviewed");
  assert.ok(kokaneeFood?.facts.some((fact) => fact.kind === "caution" && fact.label === "Consumption advisory"));
  assert.ok(kokaneeFood?.facts.some((fact) => fact.value === CONSUMPTION_ADVISORY_RULE));
  assert.ok(kokaneeFood?.facts.some((fact) => /orange flesh|excellent table fare/i.test(fact.value)));
  assert.equal(sockeyeFood?.status, "reviewed");
  assert.ok(sockeyeFood?.facts.some((fact) => /bold, buttery/i.test(fact.value)));
  assert.ok(sockeyeFood?.facts.some((fact) => fact.label === "Harvest context"));
  assert.doesNotMatch(JSON.stringify(kokaneeFood), /this species is safe to eat/i);
  assert.doesNotMatch(JSON.stringify(sockeyeFood), /this species is safe to eat/i);
  assert.equal(brookFood?.status, "not_reviewed");
});

test("AFP-1.3 keeps exact regulations outside the static species record", () => {
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

test("AFP-1.3 uses identification dossiers when reviewed and leaves remaining species explicitly incomplete", () => {
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  const brook = SPECIES.find((species) => species.id === "salvelinus_fontinalis");
  assert.ok(rainbow && brook);

  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  const brookProfile = buildAnglerSpeciesProfile(brook);
  const rainbowId = rainbowProfile.sections.find((section) => section.id === "identification");
  const brookId = brookProfile.sections.find((section) => section.id === "identification");

  assert.equal(identificationDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowId?.status, "reviewed");
  assert.ok(rainbowId?.facts.some((fact) => fact.kind === "comparison"));
  assert.equal(brookId?.status, "partial");
  assert.ok(brookId?.gaps.includes("similar-species comparison keys"));
});

test("AFP-1.3 uses behavior dossiers when reviewed without converting them into catch claims", () => {
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

test("AFP-1.3 uses diet dossiers when reviewed and does not infer a current hatch", () => {
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  const brook = SPECIES.find((species) => species.id === "salvelinus_fontinalis");
  assert.ok(rainbow && brook);

  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  const brookProfile = buildAnglerSpeciesProfile(brook);
  const rainbowDiet = rainbowProfile.sections.find((section) => section.id === "diet");
  const brookDiet = brookProfile.sections.find((section) => section.id === "diet");

  assert.equal(dietDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowDiet?.status, "reviewed");
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "season"));
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "life_stage"));
  assert.ok(rainbowDiet?.facts.some((fact) => /not proof/i.test(fact.value)));
  assert.equal(brookDiet?.status, "partial");
  assert.ok(brookDiet?.gaps.includes("spring / summer / fall / winter diet shifts"));
});

test("AFP-1.3 uses seasonal calendars when reviewed without turning spawn into a target map", () => {
  const kokanee = SPECIES.find((species) => species.id === "oncorhynchus_nerka_kokanee");
  const brook = SPECIES.find((species) => species.id === "salvelinus_fontinalis");
  assert.ok(kokanee && brook);

  const kokaneeProfile = buildAnglerSpeciesProfile(kokanee);
  const brookProfile = buildAnglerSpeciesProfile(brook);
  const kokaneeCal = kokaneeProfile.sections.find((section) => section.id === "seasonal_calendar");
  const brookCal = brookProfile.sections.find((section) => section.id === "seasonal_calendar");

  assert.equal(seasonalCalendarDossierFor("oncorhynchus_nerka_kokanee")?.status, "reviewed");
  assert.equal(kokaneeCal?.status, "reviewed");
  assert.ok(kokaneeCal?.facts.some((fact) => fact.kind === "season"));
  assert.doesNotMatch(JSON.stringify(kokaneeCal), /exact spawning|staging location|migration bottleneck|hotspot/i);
  assert.equal(brookCal?.status, "partial");
  assert.ok(brookCal?.gaps.includes("month-by-month location changes"));
});

test("AFP-Q-1.0 assigns every species a research wave without filling queued overlay gaps", () => {
  for (const species of SPECIES) {
    const profile = buildAnglerSpeciesProfile(species);
    assert.ok(profile.research.waveId);
    assert.ok(profile.research.groupLabel);
    if (profile.research.waveStatus === "shipped") {
      assert.equal(profile.research.waveId, "wave_01");
      assert.ok(identificationDossierFor(species.id));
    } else {
      assert.equal(identificationDossierFor(species.id), null);
      const fight = profile.sections.find((section) => section.id === "fight");
      const food = profile.sections.find((section) => section.id === "food_value");
      assert.equal(fight?.status, "not_reviewed");
      assert.equal(food?.status, "not_reviewed");
    }
  }

  const brown = SPECIES.find((species) => species.id === "salmo_trutta");
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  assert.ok(brown && rainbow);
  const brownProfile = buildAnglerSpeciesProfile(brown);
  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  assert.equal(brownProfile.research.waveId, "wave_02");
  assert.equal(brownProfile.research.waveStatus, "queued");
  assert.ok(brownProfile.research.groupMateIds.includes("salvelinus_fontinalis"));
  const brownId = brownProfile.sections.find((section) => section.id === "identification");
  assert.ok(brownId?.facts.some((fact) => fact.kind === "source"));
  assert.equal(rainbowProfile.research.waveStatus, "shipped");
});
