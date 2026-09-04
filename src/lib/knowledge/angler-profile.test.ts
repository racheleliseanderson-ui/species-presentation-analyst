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
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";
import { authoredOverlays } from "./coverage.ts";
import type { SpeciesRecord } from "../protocol/types.ts";

/**
 * The reviewed overlays now arrive from the database at runtime, so the builder
 * takes them as an argument. These tests are about the records as authored in
 * this repository, which is what gets seeded, so they read them from there.
 */
function profileOf(species: SpeciesRecord) {
  return buildAnglerSpeciesProfile(species, authoredOverlays(species.id));
}

/**
 * A species with nothing researched.
 *
 * These tests used mountain whitefish as the "not yet researched" example.
 * Every species in the catalog now has all four overlays, so that exemplar
 * quietly started testing the opposite of what it was written for. Passing the
 * empty overlay set directly tests the behaviour that actually matters — the
 * profile says "needs research" rather than filling the gap with model text —
 * and cannot go stale as research lands.
 */
function unresearchedProfileOf(species: SpeciesRecord) {
  return buildAnglerSpeciesProfile(species, {
    identification: null,
    behavior: null,
    diet: null,
    seasonalCalendar: null,
  });
}

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
  assert.ok(SPECIES.length >= 111, `catalog has shrunk to ${SPECIES.length}`);

  for (const species of SPECIES) {
    const profile = profileOf(species);
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
    const profile = profileOf(species);
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
    const profile = profileOf(species);
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
  assert.ok(rainbow);

  const rainbowId = profileOf(rainbow).sections.find((section) => section.id === "identification");
  assert.equal(identificationDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowId?.status, "reviewed");
  assert.ok(rainbowId?.facts.some((fact) => fact.kind === "comparison"));

  // Without a dossier the section is "partial", not "not reviewed": the
  // catalog still supplies authoritative naming and angler aliases, and the
  // gap list says exactly what is missing beyond that.
  const bare = unresearchedProfileOf(rainbow).sections.find(
    (section) => section.id === "identification",
  );
  assert.equal(bare?.status, "partial");
  assert.ok(bare?.gaps.includes("similar-species comparison keys"));
  assert.ok(!bare?.facts.some((fact) => fact.kind === "comparison"));
});

test("AFP-1.2 uses behavior dossiers when reviewed without converting them into catch claims", () => {
  const whiteBass = SPECIES.find((species) => species.id === "morone_chrysops");
  assert.ok(whiteBass);

  const whiteProfile = profileOf(whiteBass);
  const whiteBehavior = whiteProfile.sections.find((section) => section.id === "behavior");
  assert.equal(whiteBehavior?.status, "reviewed");
  assert.ok(whiteBehavior?.facts.some((fact) => fact.label === "Social pattern"));

  const bare = unresearchedProfileOf(whiteBass).sections.find(
    (section) => section.id === "behavior",
  );
  assert.ok(bare?.gaps.includes("schooling versus solitary behavior"));

  const blob = JSON.stringify(whiteProfile);
  assert.doesNotMatch(blob, /best bite|hot bite|catch probability|they will bite/i);
});

test("AFP-1.2 uses diet dossiers when reviewed and does not infer a current hatch", () => {
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  assert.ok(rainbow);

  const rainbowDiet = profileOf(rainbow).sections.find((section) => section.id === "diet");
  assert.equal(dietDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowDiet?.status, "reviewed");
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "season"));
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "life_stage"));
  assert.ok(rainbowDiet?.facts.some((fact) => /not proof/i.test(fact.value)));

  const bare = unresearchedProfileOf(rainbow).sections.find((section) => section.id === "diet");
  assert.ok(bare?.gaps.includes("spring / summer / fall / winter diet shifts"));
});

test("AFP-1.2 uses seasonal calendars when reviewed without turning spawn into a target map", () => {
  const kokanee = SPECIES.find((species) => species.id === "oncorhynchus_nerka_kokanee");
  assert.ok(kokanee);

  const kokaneeCal = profileOf(kokanee).sections.find(
    (section) => section.id === "seasonal_calendar",
  );
  assert.equal(seasonalCalendarDossierFor("oncorhynchus_nerka_kokanee")?.status, "reviewed");
  assert.equal(kokaneeCal?.status, "reviewed");
  assert.ok(kokaneeCal?.facts.some((fact) => fact.kind === "season"));
  assert.doesNotMatch(
    JSON.stringify(kokaneeCal),
    /exact spawning|staging location|migration bottleneck|hotspot/i,
  );

  const bare = unresearchedProfileOf(kokanee).sections.find(
    (section) => section.id === "seasonal_calendar",
  );
  assert.ok(bare?.gaps.includes("month-by-month location changes"));
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
    const profile = profileOf(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
  }

  const steelhead = SPECIES.find((species) => species.id === "oncorhynchus_mykiss_steelhead");
  assert.ok(steelhead);
  const steelheadDiet = profileOf(steelhead).sections.find((item) => item.id === "diet");
  assert.match(JSON.stringify(steelheadDiet), /not feeding in the trout sense/i);
});

test("AFP-1.2 wave 02b marks walleye, sauger, pike, muskie, pickerel, and yellow perch as reviewed without inventing fight or food", () => {
  const ids = [
    "sander_vitreus",
    "sander_canadensis",
    "esox_lucius",
    "esox_masquinongy",
    "esox_niger",
    "perca_flavescens",
  ];
  for (const id of ids) {
    const species = SPECIES.find((item) => item.id === id);
    assert.ok(species, id);
    const profile = profileOf(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const walleye = SPECIES.find((species) => species.id === "sander_vitreus");
  assert.ok(walleye);
  const walleyeId = profileOf(walleye).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(walleyeId), /sauger/i);
});

test("AFP-1.2 wave 02c marks core panfish as reviewed without collapsing redear into bluegill or rock bass into smallmouth", () => {
  const ids = [
    "pomoxis_spp",
    "lepomis_macrochirus",
    "lepomis_gibbosus",
    "lepomis_microlophus",
    "lepomis_cyanellus",
    "ambloplites_rupestris",
  ];
  for (const id of ids) {
    const species = SPECIES.find((item) => item.id === id);
    assert.ok(species, id);
    const profile = profileOf(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const redear = SPECIES.find((species) => species.id === "lepomis_microlophus");
  assert.ok(redear);
  const redearDiet = profileOf(redear).sections.find((item) => item.id === "diet");
  assert.match(JSON.stringify(redearDiet), /mollusk|snail|shellcracker/i);
});

test("AFP-1.2 wave 02d marks remaining sunfish as reviewed without collapsing longear into redbreast or flier into crappie", () => {
  const ids = [
    "lepomis_auritus",
    "lepomis_gulosus",
    "lepomis_megalotis",
    "centrarchus_macropterus",
  ];
  for (const id of ids) {
    const species = SPECIES.find((item) => item.id === id);
    assert.ok(species, id);
    const profile = profileOf(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const flier = SPECIES.find((species) => species.id === "centrarchus_macropterus");
  assert.ok(flier);
  const flierId = profileOf(flier).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(flierId), /teardrop/i);
  const warmouth = SPECIES.find((species) => species.id === "lepomis_gulosus");
  assert.ok(warmouth);
  const warmouthId = profileOf(warmouth).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(warmouthId), /tongue/i);
});

test("AFP-1.2 wave 02e marks catfish as reviewed without collapsing channel into blue or flathead into a scavenger", () => {
  const ids = [
    "ictalurus_punctatus",
    "ictalurus_furcatus",
    "pylodictis_olivaris",
    "ameiurus_catus",
  ];
  for (const id of ids) {
    const species = SPECIES.find((item) => item.id === id);
    assert.ok(species, id);
    const profile = profileOf(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const channel = SPECIES.find((species) => species.id === "ictalurus_punctatus");
  assert.ok(channel);
  const channelId = profileOf(channel).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(channelId), /24|29|convex|round/i);

  const flathead = SPECIES.find((species) => species.id === "pylodictis_olivaris");
  assert.ok(flathead);
  const flatheadDiet = profileOf(flathead).sections.find((item) => item.id === "diet");
  assert.match(JSON.stringify(flatheadDiet), /not scavenger|live fish/i);
});

test("AFP-1.2 wave 02f marks chinook, coho, pink, chum, and landlocked Atlantic as reviewed without collapsing coho into chinook or landlocked into wild Atlantic", () => {
  const ids = [
    "oncorhynchus_tshawytscha",
    "oncorhynchus_kisutch",
    "oncorhynchus_gorbuscha",
    "oncorhynchus_keta",
    "salmo_salar_landlocked",
  ];
  for (const id of ids) {
    const species = SPECIES.find((item) => item.id === id);
    assert.ok(species, id);
    const profile = profileOf(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const chinook = SPECIES.find((species) => species.id === "oncorhynchus_tshawytscha");
  assert.ok(chinook);
  const chinookId = profileOf(chinook).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(chinookId), /blackmouth|gum/i);

  const coho = SPECIES.find((species) => species.id === "oncorhynchus_kisutch");
  assert.ok(coho);
  const cohoId = profileOf(coho).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(cohoId), /gum|upper/i);

  const pink = SPECIES.find((species) => species.id === "oncorhynchus_gorbuscha");
  assert.ok(pink);
  const pinkDiet = profileOf(pink).sections.find((item) => item.id === "diet");
  assert.match(JSON.stringify(pinkDiet), /do not eat|not eat/i);

  const landlocked = SPECIES.find((species) => species.id === "salmo_salar_landlocked");
  assert.ok(landlocked);
  const landlockedId = profileOf(landlocked).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(landlockedId), /brown/i);
  assert.match(JSON.stringify(landlockedId), /sea-run|anadromous|endangered/i);
});
