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
  const bulltrout = SPECIES.find((species) => species.id === "salvelinus_confluentus");
  assert.ok(rainbow && bulltrout);

  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  const bulltroutProfile = buildAnglerSpeciesProfile(bulltrout);
  const rainbowId = rainbowProfile.sections.find((section) => section.id === "identification");
  const bulltroutId = bulltroutProfile.sections.find((section) => section.id === "identification");

  assert.equal(identificationDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowId?.status, "reviewed");
  assert.ok(rainbowId?.facts.some((fact) => fact.kind === "comparison"));
  assert.equal(bulltroutId?.status, "reviewed");
  assert.ok(bulltroutId?.facts.some((fact) => fact.kind === "comparison"));
  assert.ok(bulltroutId?.facts.some((fact) => /dorsal/i.test(fact.value)));
});

test("AFP-1.2 uses behavior dossiers when reviewed without converting them into catch claims", () => {
  const whiteBass = SPECIES.find((species) => species.id === "morone_chrysops");
  const bulltrout = SPECIES.find((species) => species.id === "salvelinus_confluentus");
  assert.ok(whiteBass && bulltrout);

  const whiteProfile = buildAnglerSpeciesProfile(whiteBass);
  const bulltroutProfile = buildAnglerSpeciesProfile(bulltrout);
  const whiteBehavior = whiteProfile.sections.find((section) => section.id === "behavior");
  const bulltroutBehavior = bulltroutProfile.sections.find((section) => section.id === "behavior");

  assert.equal(whiteBehavior?.status, "reviewed");
  assert.ok(whiteBehavior?.facts.some((fact) => fact.label === "Social pattern"));
  assert.equal(bulltroutBehavior?.status, "partial");
  assert.ok(bulltroutBehavior?.gaps.includes("schooling versus solitary behavior"));

  const blob = JSON.stringify(whiteProfile);
  assert.doesNotMatch(blob, /best bite|hot bite|catch probability|they will bite/i);
});

test("AFP-1.2 uses diet dossiers when reviewed and does not infer a current hatch", () => {
  const rainbow = SPECIES.find((species) => species.id === "oncorhynchus_mykiss");
  const bulltrout = SPECIES.find((species) => species.id === "salvelinus_confluentus");
  assert.ok(rainbow && bulltrout);

  const rainbowProfile = buildAnglerSpeciesProfile(rainbow);
  const bulltroutProfile = buildAnglerSpeciesProfile(bulltrout);
  const rainbowDiet = rainbowProfile.sections.find((section) => section.id === "diet");
  const bulltroutDiet = bulltroutProfile.sections.find((section) => section.id === "diet");

  assert.equal(dietDossierFor("oncorhynchus_mykiss")?.status, "reviewed");
  assert.equal(rainbowDiet?.status, "reviewed");
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "season"));
  assert.ok(rainbowDiet?.facts.some((fact) => fact.kind === "life_stage"));
  assert.ok(rainbowDiet?.facts.some((fact) => /not proof/i.test(fact.value)));
  assert.equal(bulltroutDiet?.status, "partial");
  assert.ok(bulltroutDiet?.gaps.includes("spring / summer / fall / winter diet shifts"));
});

test("AFP-1.2 uses seasonal calendars when reviewed without turning spawn into a target map", () => {
  const kokanee = SPECIES.find((species) => species.id === "oncorhynchus_nerka_kokanee");
  const bulltrout = SPECIES.find((species) => species.id === "salvelinus_confluentus");
  assert.ok(kokanee && bulltrout);

  const kokaneeProfile = buildAnglerSpeciesProfile(kokanee);
  const bulltroutProfile = buildAnglerSpeciesProfile(bulltrout);
  const kokaneeCal = kokaneeProfile.sections.find((section) => section.id === "seasonal_calendar");
  const bulltroutCal = bulltroutProfile.sections.find((section) => section.id === "seasonal_calendar");

  assert.equal(seasonalCalendarDossierFor("oncorhynchus_nerka_kokanee")?.status, "reviewed");
  assert.equal(kokaneeCal?.status, "reviewed");
  assert.ok(kokaneeCal?.facts.some((fact) => fact.kind === "season"));
  assert.doesNotMatch(JSON.stringify(kokaneeCal), /exact spawning|staging location|migration bottleneck|hotspot/i);
  assert.equal(bulltroutCal?.status, "partial");
  assert.ok(bulltroutCal?.gaps.includes("month-by-month location changes"));
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
    const profile = buildAnglerSpeciesProfile(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const walleye = SPECIES.find((species) => species.id === "sander_vitreus");
  assert.ok(walleye);
  const walleyeId = buildAnglerSpeciesProfile(walleye).sections.find((item) => item.id === "identification");
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
    const profile = buildAnglerSpeciesProfile(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const redear = SPECIES.find((species) => species.id === "lepomis_microlophus");
  assert.ok(redear);
  const redearDiet = buildAnglerSpeciesProfile(redear).sections.find((item) => item.id === "diet");
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
    const profile = buildAnglerSpeciesProfile(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const flier = SPECIES.find((species) => species.id === "centrarchus_macropterus");
  assert.ok(flier);
  const flierId = buildAnglerSpeciesProfile(flier).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(flierId), /teardrop/i);
  const warmouth = SPECIES.find((species) => species.id === "lepomis_gulosus");
  assert.ok(warmouth);
  const warmouthId = buildAnglerSpeciesProfile(warmouth).sections.find((item) => item.id === "identification");
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
    const profile = buildAnglerSpeciesProfile(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const channel = SPECIES.find((species) => species.id === "ictalurus_punctatus");
  assert.ok(channel);
  const channelId = buildAnglerSpeciesProfile(channel).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(channelId), /24|29|convex|round/i);

  const flathead = SPECIES.find((species) => species.id === "pylodictis_olivaris");
  assert.ok(flathead);
  const flatheadDiet = buildAnglerSpeciesProfile(flathead).sections.find((item) => item.id === "diet");
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
    const profile = buildAnglerSpeciesProfile(species);
    for (const sectionId of ["identification", "behavior", "diet", "seasonal_calendar"] as const) {
      const section = profile.sections.find((item) => item.id === sectionId);
      assert.equal(section?.status, "reviewed", `${id} ${sectionId}`);
    }
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const chinook = SPECIES.find((species) => species.id === "oncorhynchus_tshawytscha");
  assert.ok(chinook);
  const chinookId = buildAnglerSpeciesProfile(chinook).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(chinookId), /blackmouth|gum/i);

  const coho = SPECIES.find((species) => species.id === "oncorhynchus_kisutch");
  assert.ok(coho);
  const cohoId = buildAnglerSpeciesProfile(coho).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(cohoId), /gum|upper/i);

  const pink = SPECIES.find((species) => species.id === "oncorhynchus_gorbuscha");
  assert.ok(pink);
  const pinkDiet = buildAnglerSpeciesProfile(pink).sections.find((item) => item.id === "diet");
  assert.match(JSON.stringify(pinkDiet), /do not eat|not eat/i);

  const landlocked = SPECIES.find((species) => species.id === "salmo_salar_landlocked");
  assert.ok(landlocked);
  const landlockedId = buildAnglerSpeciesProfile(landlocked).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(landlockedId), /brown/i);
  assert.match(JSON.stringify(landlockedId), /sea-run|anadromous|endangered/i);
});

test("AFP-1.2 wave 02g marks mountain whitefish, grayling, burbot, Arctic char, Dolly Varden, and sheefish as reviewed without collapsing char or whitefish pairs", () => {
  const ids = [
    "prosopium_williamsoni",
    "thymallus_arcticus",
    "lota_lota",
    "salvelinus_alpinus",
    "salvelinus_malma",
    "stenodus_leucichthys",
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
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
  }

  const whitefish = SPECIES.find((species) => species.id === "prosopium_williamsoni");
  assert.ok(whitefish);
  const whitefishId = buildAnglerSpeciesProfile(whitefish).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(whitefishId), /small mouth|toothless|adipose/i);

  const grayling = SPECIES.find((species) => species.id === "thymallus_arcticus");
  assert.ok(grayling);
  const graylingId = buildAnglerSpeciesProfile(grayling).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(graylingId), /sail/i);

  const burbot = SPECIES.find((species) => species.id === "lota_lota");
  assert.ok(burbot);
  const burbotId = buildAnglerSpeciesProfile(burbot).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(burbotId), /barbel/i);

  const dolly = SPECIES.find((species) => species.id === "salvelinus_malma");
  assert.ok(dolly);
  const dollyId = buildAnglerSpeciesProfile(dolly).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(dollyId), /bull trout/i);
});

test("AFP-1.2 wave 03 marks bull trout and wild Atlantic identification reviewed while behavior, diet, and calendar stay incomplete", () => {
  const ids = ["salvelinus_confluentus", "salmo_salar_anadromous"];
  for (const id of ids) {
    const species = SPECIES.find((item) => item.id === id);
    assert.ok(species, id);
    const profile = buildAnglerSpeciesProfile(species);
    assert.equal(profile.sections.find((item) => item.id === "identification")?.status, "reviewed", `${id} identification`);
    assert.equal(profile.sections.find((item) => item.id === "behavior")?.status, "partial", `${id} behavior`);
    assert.equal(profile.sections.find((item) => item.id === "diet")?.status, "partial", `${id} diet`);
    assert.equal(profile.sections.find((item) => item.id === "seasonal_calendar")?.status, "partial", `${id} calendar`);
    assert.equal(profile.sections.find((item) => item.id === "fight")?.status, "not_reviewed");
    assert.equal(profile.sections.find((item) => item.id === "food_value")?.status, "not_reviewed");
    assert.equal(species.flowingPresentations.length, 0);
    assert.equal(species.stillPresentations.length, 0);
  }

  const bull = SPECIES.find((species) => species.id === "salvelinus_confluentus");
  assert.ok(bull);
  const bullId = buildAnglerSpeciesProfile(bull).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(bullId), /dorsal/i);
  assert.match(JSON.stringify(bullId), /Dolly Varden|brook trout/i);
  assert.doesNotMatch(JSON.stringify(bullId), /presentationImplication|how to catch|best lure/i);

  const atlantic = SPECIES.find((species) => species.id === "salmo_salar_anadromous");
  assert.ok(atlantic);
  const atlanticId = buildAnglerSpeciesProfile(atlantic).sections.find((item) => item.id === "identification");
  assert.match(JSON.stringify(atlanticId), /illegal|prohibited/i);
  assert.match(JSON.stringify(atlanticId), /landlocked/i);
  assert.doesNotMatch(JSON.stringify(atlanticId), /Dennys|Machias|Penobscot/i);
});

