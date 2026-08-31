import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { SPECIES, SPECIES_BY_ID } from "./species-catalog.ts";
import { SPECIES_EXPANSION_03 } from "./species-expansion-03.ts";
import { BEHAVIOR_DOSSIERS } from "./behavior-dossiers.ts";
import { DIET_DOSSIERS } from "./diet-dossiers.ts";
import { IDENTIFICATION_DOSSIERS } from "./identification-dossiers.ts";
import { SEASONAL_CALENDAR_DOSSIERS } from "./seasonal-calendar-dossiers.ts";
import { PRESENTATIONS } from "./presentations.ts";
import {
  BEHAVIOR_DOSSIER_VERSION,
  DIET_DOSSIER_VERSION,
  IDENTIFICATION_DOSSIER_VERSION,
  SEASONAL_CALENDAR_VERSION,
} from "./dossier-types.ts";
import {
  behaviorDossierFor,
  dietDossierFor,
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";
import { FORAGE_CLASSES, SEASONS } from "../protocol/vocab.ts";
import { searchSpecies, ALIASES } from "./aliases.ts";
import { SEED_WAVES, seedWaveForSpecies } from "./seed-queue.ts";

const FORBIDDEN = /best bite|hot bite|catch probability|secret spot|gps coordinate/i;
const LOCATION = /exact spawning|staging location|migration bottleneck|hotspot/i;

const DISTINCTION_GROUPS: Record<string, string[]> = {
  trout: ["oncorhynchus_mykiss", "oncorhynchus_clarkii"],
  inland_trout: ["oncorhynchus_mykiss", "salmo_trutta", "salvelinus_fontinalis"],
  anadromous_rainbow: ["oncorhynchus_mykiss", "oncorhynchus_mykiss_steelhead"],
  char_lakers: ["salvelinus_fontinalis", "salvelinus_namaycush"],
  nerka: ["oncorhynchus_nerka_kokanee", "oncorhynchus_nerka_anadromous"],
  black_bass: ["micropterus_nigricans", "micropterus_dolomieu", "micropterus_punctulatus"],
  morone: [
    "morone_saxatilis",
    "morone_chrysops",
    "morone_americana",
    "morone_hybrid_wiper",
  ],
  coregonine: ["coregonus_artedi", "coregonus_clupeaformis"],
  hiodontid: ["hiodon_alosoides", "hiodon_tergisus"],
  buffalo_carp: ["cyprinus_carpio", "ictiobus_cyprinellus", "ictiobus_bubalus"],
  gar: [
    "lepisosteus_osseus",
    "lepisosteus_oculatus",
    "lepisosteus_platostomus",
    "atractosteus_spatula",
  ],
  bullhead: ["ameiurus_nebulosus", "ameiurus_melas", "ameiurus_natalis"],
  sander: ["sander_vitreus", "sander_canadensis"],
  esox: ["esox_lucius", "esox_masquinongy", "esox_niger"],
  lepomis_core: [
    "lepomis_macrochirus",
    "lepomis_gibbosus",
    "lepomis_microlophus",
    "lepomis_cyanellus",
  ],
  rock_bass_smallmouth: ["ambloplites_rupestris", "micropterus_dolomieu"],
  longear_redbreast: ["lepomis_auritus", "lepomis_megalotis"],
  longear_pumpkinseed: ["lepomis_megalotis", "lepomis_gibbosus"],
  warmouth_lookalikes: ["lepomis_gulosus", "lepomis_cyanellus", "ambloplites_rupestris"],
  flier_crappie: ["centrarchus_macropterus", "pomoxis_spp"],
  ictalurus: ["ictalurus_punctatus", "ictalurus_furcatus"],
  catfish_jobs: ["ictalurus_punctatus", "ictalurus_furcatus", "pylodictis_olivaris"],
  white_cat_channel: ["ameiurus_catus", "ictalurus_punctatus"],
  white_cat_bullhead: ["ameiurus_catus", "ameiurus_natalis"],
  chinook_coho: ["oncorhynchus_tshawytscha", "oncorhynchus_kisutch"],
  pink_chum: ["oncorhynchus_gorbuscha", "oncorhynchus_keta"],
  landlocked_atlantic_brown: ["salmo_salar_landlocked", "salmo_trutta"],
  mountain_lake_whitefish: ["prosopium_williamsoni", "coregonus_clupeaformis"],
  arctic_char_dolly: ["salvelinus_alpinus", "salvelinus_malma"],
  arctic_char_laker: ["salvelinus_alpinus", "salvelinus_namaycush"],
  dolly_bull: ["salvelinus_malma", "salvelinus_confluentus"],
  brook_bull: ["salvelinus_fontinalis", "salvelinus_confluentus"],
  landlocked_vs_wild_atlantic: ["salmo_salar_landlocked", "salmo_salar_anadromous"],
  steelhead_wild_atlantic: ["oncorhynchus_mykiss_steelhead", "salmo_salar_anadromous"],
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[/-]/g, " ").replace(/\s+/g, " ").trim();
}

test("identification, behavior, diet, and seasonal versions are explicit overlays, not a new AFP contract", () => {
  assert.equal(IDENTIFICATION_DOSSIER_VERSION, "AFP-ID-1.0");
  assert.equal(BEHAVIOR_DOSSIER_VERSION, "AFP-BH-1.0");
  assert.equal(DIET_DOSSIER_VERSION, "AFP-DI-1.0");
  assert.equal(SEASONAL_CALENDAR_VERSION, "AFP-SC-1.0");
});

test("every dossier points at a reviewed catalog species and has provenance", () => {
  const identificationOnlyCount = SEED_WAVES.filter(
    (wave) =>
      wave.status === "landed" &&
      wave.overlays.length === 1 &&
      wave.overlays[0] === "identification",
  ).reduce((count, wave) => count + wave.speciesIds.length, 0);
  assert.equal(IDENTIFICATION_DOSSIERS.length, BEHAVIOR_DOSSIERS.length + identificationOnlyCount);
  assert.equal(IDENTIFICATION_DOSSIERS.length, DIET_DOSSIERS.length + identificationOnlyCount);
  assert.equal(IDENTIFICATION_DOSSIERS.length, SEASONAL_CALENDAR_DOSSIERS.length + identificationOnlyCount);

  for (const dossier of IDENTIFICATION_DOSSIERS) {
    assert.ok(SPECIES_BY_ID[dossier.speciesId], `missing catalog species ${dossier.speciesId}`);
    assert.ok(dossier.sources.length > 0, `${dossier.speciesId} identification is missing sources`);
    assert.ok(
      dossier.sources.some((source) => source.class === "agency" || source.class === "peer_reviewed"),
      `${dossier.speciesId} identification needs an agency or peer-reviewed source`,
    );
    assert.ok(dossier.identificationTraits.length >= 3, `${dossier.speciesId} needs diagnostic traits`);
    assert.ok(dossier.similarSpecies.length >= 1, `${dossier.speciesId} needs a lookalike key`);
    assert.equal(dossier.reviewedAt, "2026-08-30");
    assert.doesNotMatch(JSON.stringify(dossier), FORBIDDEN);
  }

  for (const dossier of BEHAVIOR_DOSSIERS) {
    assert.ok(SPECIES_BY_ID[dossier.speciesId], `missing catalog species ${dossier.speciesId}`);
    assert.ok(dossier.sources.length > 0, `${dossier.speciesId} behavior is missing sources`);
    assert.ok(dossier.feedingStrategy.modes.length > 0);
    assert.ok(dossier.spawningBehavior.length > 0);
    assert.ok(
      !LOCATION.test(dossier.spawningBehavior),
      `${dossier.speciesId} spawning behavior names a vulnerable location`,
    );
    assert.doesNotMatch(JSON.stringify(dossier), FORBIDDEN);
  }

  for (const dossier of DIET_DOSSIERS) {
    const species = SPECIES_BY_ID[dossier.speciesId];
    assert.ok(species, `missing catalog species ${dossier.speciesId}`);
    assert.ok(dossier.sources.length > 0, `${dossier.speciesId} diet is missing sources`);
    assert.ok(
      dossier.sources.some((source) => source.class === "agency" || source.class === "peer_reviewed"),
      `${dossier.speciesId} diet needs an agency or peer-reviewed source`,
    );
    assert.ok(dossier.primaryForage.length > 0);
    for (const forage of dossier.primaryForage) {
      assert.ok((FORAGE_CLASSES as readonly string[]).includes(forage), `${dossier.speciesId} has unknown forage ${forage}`);
      assert.ok(
        species.forageClasses.includes(forage),
        `${dossier.speciesId} diet class ${forage} is not on the catalog record`,
      );
    }
    assert.match(dossier.observedForageRule, /not proof/i);
    assert.doesNotMatch(JSON.stringify(dossier), FORBIDDEN);
    assert.doesNotMatch(JSON.stringify(dossier), /they will bite/i);
  }

  for (const dossier of SEASONAL_CALENDAR_DOSSIERS) {
    assert.ok(SPECIES_BY_ID[dossier.speciesId], `missing catalog species ${dossier.speciesId}`);
    assert.ok(dossier.sources.length > 0, `${dossier.speciesId} calendar is missing sources`);
    assert.ok(dossier.entries.length >= 3, `${dossier.speciesId} calendar is too thin`);
    const seasons = dossier.entries.map((entry) => entry.season);
    assert.equal(new Set(seasons).size, seasons.length, `${dossier.speciesId} repeats a season`);
    for (const season of seasons) {
      assert.ok((SEASONS as readonly string[]).includes(season), `${dossier.speciesId} has non-canonical season ${season}`);
      assert.notEqual(season, "unknown");
    }
    assert.doesNotMatch(JSON.stringify(dossier), FORBIDDEN);
    assert.doesNotMatch(JSON.stringify(dossier), LOCATION);
  }
});

test("incomplete research remains explicitly incomplete for species without dossiers", () => {
  for (const species of SPECIES) {
    const identification = identificationDossierFor(species.id);
    const behavior = behaviorDossierFor(species.id);
    const diet = dietDossierFor(species.id);
    const calendar = seasonalCalendarDossierFor(species.id);
    const wave = seedWaveForSpecies(species.id);
    const identificationOnly =
      wave?.overlays.length === 1 && wave.overlays[0] === "identification";
    if (!identification) {
      assert.equal(behavior, null, `${species.id} has behavior without identification`);
      assert.equal(diet, null, `${species.id} has diet without identification`);
      assert.equal(calendar, null, `${species.id} has calendar without identification`);
    } else if (identificationOnly) {
      assert.equal(behavior, null, `${species.id} is identification-only but has behavior`);
      assert.equal(diet, null, `${species.id} is identification-only but has diet`);
      assert.equal(calendar, null, `${species.id} is identification-only but has calendar`);
    } else {
      assert.ok(behavior, `${species.id} has identification without behavior`);
      assert.ok(diet, `${species.id} has identification without diet`);
      assert.ok(calendar, `${species.id} has identification without calendar`);
    }
  }

  const uncovered = SPECIES.filter((species) => !identificationDossierFor(species.id));
  assert.equal(uncovered.length, 12);
  assert.ok(uncovered.some((species) => species.id === "aplodinotus_grunniens"));
});

test("named distinction groups have reciprocal similar-species keys", () => {
  for (const [group, ids] of Object.entries(DISTINCTION_GROUPS)) {
    for (const id of ids) {
      const dossier = identificationDossierFor(id);
      assert.ok(dossier, `missing identification dossier for ${group}:${id}`);
      const pointedAt = new Set(
        dossier.similarSpecies.map((item) => item.speciesId).filter(Boolean),
      );
      const others = ids.filter((other) => other !== id);
      const hits = others.filter((other) => pointedAt.has(other));
      assert.ok(
        hits.length >= 1,
        `${id} in ${group} does not distinguish at least one group-mate`,
      );
    }
  }
});

test("kokanee remains separate from anadromous sockeye in identification", () => {
  assert.ok(!(ALIASES.oncorhynchus_nerka_kokanee ?? []).includes("sockeye"));
  const matches = searchSpecies("sockeye").map((species) => species.id);
  assert.ok(matches.includes("oncorhynchus_nerka_anadromous"));
  assert.ok(!matches.includes("oncorhynchus_nerka_kokanee"));

  const kokanee = identificationDossierFor("oncorhynchus_nerka_kokanee");
  const sockeye = identificationDossierFor("oncorhynchus_nerka_anadromous");
  assert.ok(kokanee && sockeye);
  assert.ok(kokanee.similarSpecies.some((item) => item.speciesId === "oncorhynchus_nerka_anadromous"));
  assert.ok(sockeye.similarSpecies.some((item) => item.speciesId === "oncorhynchus_nerka_kokanee"));
  assert.match(kokanee.identificationTraits.join(" "), /1\.2 ft|landlocked|non-anadromous/i);
  assert.match(sockeye.identificationTraits.join(" "), /1\.5|4–15 lb|4-15 lb/i);
});

test("kokanee diet is a zooplankton specialist and sockeye freshwater adults are not feeding trout", () => {
  const kokanee = dietDossierFor("oncorhynchus_nerka_kokanee");
  const sockeye = dietDossierFor("oncorhynchus_nerka_anadromous");
  assert.ok(kokanee && sockeye);
  assert.equal(kokanee.feedingStyle, "specialized");
  assert.equal(kokanee.feedingZone, "pelagic");
  assert.ok(kokanee.primaryForage.includes("zooplankton"));
  assert.match(kokanee.primaryNote, /daphnia|zooplankton/i);
  assert.match(sockeye.primaryNote, /cease feeding|do not feed|typically cease/i);
  assert.match(JSON.stringify(sockeye.lifeStageDiet), /do not feed|cease/i);
});

test("cisco diet stays pelagic-plankton and lake whitefish stays benthic", () => {
  const cisco = dietDossierFor("coregonus_artedi");
  const whitefish = dietDossierFor("coregonus_clupeaformis");
  assert.ok(cisco && whitefish);
  assert.equal(cisco.feedingZone, "pelagic");
  assert.ok(cisco.primaryForage.includes("zooplankton"));
  assert.equal(whitefish.feedingZone, "benthic");
  assert.ok(whitefish.primaryForage.includes("mollusks"));
});

test("carp, bigmouth buffalo, and smallmouth buffalo keep distinct feeding identities", () => {
  const carp = dietDossierFor("cyprinus_carpio");
  const bigmouth = dietDossierFor("ictiobus_cyprinellus");
  const smallmouth = dietDossierFor("ictiobus_bubalus");
  assert.ok(carp && bigmouth && smallmouth);
  assert.equal(carp.feedingZone, "benthic");
  assert.equal(carp.feedingStyle, "opportunistic");
  assert.equal(bigmouth.feedingZone, "pelagic");
  assert.equal(bigmouth.feedingStyle, "specialized");
  assert.ok(bigmouth.primaryForage.includes("zooplankton"));
  assert.equal(smallmouth.feedingZone, "benthic");
  assert.ok(smallmouth.primaryForage.includes("mollusks"));
});

test("wave 02a inland trout use agency tail, vermiculation, and halo characters", () => {
  const brown = identificationDossierFor("salmo_trutta");
  const brook = identificationDossierFor("salvelinus_fontinalis");
  const laker = identificationDossierFor("salvelinus_namaycush");
  assert.ok(brown && brook && laker);
  assert.match(brown.identificationTraits.join(" "), /unspotted|plain tail/i);
  assert.match(brook.identificationTraits.join(" "), /vermiculation/i);
  assert.match(brook.identificationTraits.join(" "), /white/i);
  assert.match(laker.identificationTraits.join(" "), /forked/i);
  assert.match(laker.identificationTraits.join(" "), /light spots/i);
  assert.ok(brown.similarSpecies.some((item) => item.speciesId === "oncorhynchus_mykiss"));
  assert.ok(brook.similarSpecies.some((item) => item.speciesId === "salmo_trutta"));
  assert.ok(laker.similarSpecies.some((item) => item.speciesId === "salvelinus_fontinalis"));
});

test("steelhead stays a separate anadromous record from inland rainbow", () => {
  const matches = searchSpecies("steelhead").map((species) => species.id);
  assert.ok(matches.includes("oncorhynchus_mykiss_steelhead"));
  assert.ok(!matches.includes("oncorhynchus_mykiss"));

  const steelhead = identificationDossierFor("oncorhynchus_mykiss_steelhead");
  const rainbow = identificationDossierFor("oncorhynchus_mykiss");
  assert.ok(steelhead && rainbow);
  assert.ok(steelhead.similarSpecies.some((item) => item.speciesId === "oncorhynchus_mykiss"));
  assert.ok(rainbow.similarSpecies.some((item) => item.speciesId === "oncorhynchus_mykiss_steelhead"));
  assert.match(steelhead.identificationTraits.join(" "), /anadromous/i);
  assert.match(steelhead.identificationTraits.join(" "), /winter-run|summer-run/i);

  const steelheadDiet = dietDossierFor("oncorhynchus_mykiss_steelhead");
  assert.ok(steelheadDiet);
  assert.match(steelheadDiet.primaryNote, /not feeding in the trout sense/i);
  assert.ok(steelheadDiet.primaryForage.includes("eggs"));
  assert.ok(!steelheadDiet.primaryForage.includes("zooplankton"));

  const calendar = seasonalCalendarDossierFor("oncorhynchus_mykiss_steelhead");
  assert.ok(calendar);
  assert.equal(SPECIES_BY_ID.oncorhynchus_mykiss_steelhead.stillPresentations.length, 0);
  assert.match(calendar.overview, /flowing-water only|must not be collapsed/i);
});

test("lake trout diet is adult piscivory and brook trout stays insect-weighted", () => {
  const laker = dietDossierFor("salvelinus_namaycush");
  const brook = dietDossierFor("salvelinus_fontinalis");
  const brown = dietDossierFor("salmo_trutta");
  assert.ok(laker && brook && brown);
  assert.equal(laker.feedingZone, "pelagic");
  assert.ok(laker.primaryForage.includes("larger_prey_fish"));
  assert.match(laker.primaryNote, /cisco/i);
  assert.ok(brook.primaryForage.includes("aquatic_insects"));
  assert.ok(!brook.primaryForage.includes("larger_prey_fish"));
  assert.ok(brown.primaryForage.includes("larger_prey_fish"));
});

test("wave 02b walleye and sauger use agency tail, dorsal, and saddle characters", () => {
  const walleye = identificationDossierFor("sander_vitreus");
  const sauger = identificationDossierFor("sander_canadensis");
  assert.ok(walleye && sauger);
  assert.match(walleye.identificationTraits.join(" "), /white/i);
  assert.match(walleye.identificationTraits.join(" "), /tail/i);
  assert.match(sauger.identificationTraits.join(" "), /spot/i);
  assert.match(sauger.identificationTraits.join(" "), /saddle/i);
  assert.ok(walleye.similarSpecies.some((item) => item.speciesId === "sander_canadensis"));
  assert.ok(sauger.similarSpecies.some((item) => item.speciesId === "sander_vitreus"));
  assert.ok(walleye.similarSpecies.some((item) => /saugeye/i.test(item.name)));
  assert.ok(sauger.similarSpecies.some((item) => /saugeye/i.test(item.name)));

  const walleyeDiet = dietDossierFor("sander_vitreus");
  const saugerDiet = dietDossierFor("sander_canadensis");
  assert.ok(walleyeDiet && saugerDiet);
  assert.ok(walleyeDiet.primaryForage.includes("larger_prey_fish"));
  assert.ok(!saugerDiet.primaryForage.includes("larger_prey_fish"));
  assert.equal(saugerDiet.feedingZone, "benthic");
  assert.match(walleyeDiet.primaryNote, /perch/i);
});

test("wave 02b esocids use light-on-dark vs dark-on-light, pores, and the pickerel chain", () => {
  const pike = identificationDossierFor("esox_lucius");
  const muskie = identificationDossierFor("esox_masquinongy");
  const pickerel = identificationDossierFor("esox_niger");
  assert.ok(pike && muskie && pickerel);
  assert.match(pike.identificationTraits.join(" "), /light/i);
  assert.match(pike.identificationTraits.join(" "), /pore/i);
  assert.match(muskie.identificationTraits.join(" "), /dark/i);
  assert.match(muskie.identificationTraits.join(" "), /pore/i);
  assert.match(pickerel.identificationTraits.join(" "), /chain/i);
  assert.match(pickerel.identificationTraits.join(" "), /eye/i);
  assert.ok(pike.similarSpecies.some((item) => item.speciesId === "esox_masquinongy"));
  assert.ok(muskie.similarSpecies.some((item) => item.speciesId === "esox_lucius"));
  assert.ok(pickerel.similarSpecies.some((item) => item.speciesId === "esox_lucius"));

  const pikeDiet = dietDossierFor("esox_lucius");
  const pickerelDiet = dietDossierFor("esox_niger");
  assert.ok(pikeDiet && pickerelDiet);
  assert.ok(pikeDiet.primaryForage.includes("larger_prey_fish"));
  assert.ok(pickerelDiet.primaryForage.includes("crustaceans"));
  assert.ok(!pikeDiet.primaryForage.includes("crustaceans"));
});

test("yellow perch identification uses bars and no canines, and stays a schooling insect-to-small-fish diet", () => {
  const perch = identificationDossierFor("perca_flavescens");
  const walleye = identificationDossierFor("sander_vitreus");
  assert.ok(perch && walleye);
  assert.match(perch.identificationTraits.join(" "), /bar/i);
  assert.match(perch.identificationTraits.join(" "), /canine/i);
  assert.ok(perch.similarSpecies.some((item) => item.speciesId === "sander_vitreus"));
  assert.ok(walleye.similarSpecies.some((item) => item.speciesId === "perca_flavescens"));

  const diet = dietDossierFor("perca_flavescens");
  const behavior = behaviorDossierFor("perca_flavescens");
  assert.ok(diet && behavior);
  assert.ok(diet.primaryForage.includes("zooplankton"));
  assert.ok(diet.primaryForage.includes("aquatic_insects"));
  assert.ok(!diet.primaryForage.includes("larger_prey_fish"));
  assert.equal(behavior.social.pattern, "schooling");
  assert.match(behavior.spawningBehavior, /gelatinous|vegetation/i);
});

test("wave 02c panfish use agency ear-flap, mouth, spine, and shellcracker characters", () => {
  const crappie = identificationDossierFor("pomoxis_spp");
  const bluegill = identificationDossierFor("lepomis_macrochirus");
  const pumpkinseed = identificationDossierFor("lepomis_gibbosus");
  const redear = identificationDossierFor("lepomis_microlophus");
  const green = identificationDossierFor("lepomis_cyanellus");
  const rock = identificationDossierFor("ambloplites_rupestris");
  assert.ok(crappie && bluegill && pumpkinseed && redear && green && rock);

  assert.match(crappie.identificationTraits.join(" "), /dorsal spine|seven or eight|five or six/i);
  assert.match(crappie.identificationTraits.join(" "), /complex/i);
  assert.match(bluegill.identificationTraits.join(" "), /dorsal/i);
  assert.match(bluegill.identificationTraits.join(" "), /pectoral/i);
  assert.match(pumpkinseed.identificationTraits.join(" "), /orange|red/i);
  assert.match(redear.identificationTraits.join(" "), /red|orange/i);
  assert.match(green.identificationTraits.join(" "), /large mouth|upper jaw/i);
  assert.match(rock.identificationTraits.join(" "), /six/i);
  assert.match(rock.identificationTraits.join(" "), /anal/i);

  assert.ok(crappie.similarSpecies.some((item) => item.speciesId === "lepomis_macrochirus"));
  assert.ok(bluegill.similarSpecies.some((item) => item.speciesId === "lepomis_gibbosus"));
  assert.ok(rock.similarSpecies.some((item) => item.speciesId === "micropterus_dolomieu"));

  const crappieDiet = dietDossierFor("pomoxis_spp");
  const bluegillDiet = dietDossierFor("lepomis_macrochirus");
  const pumpkinDiet = dietDossierFor("lepomis_gibbosus");
  const redearDiet = dietDossierFor("lepomis_microlophus");
  const greenDiet = dietDossierFor("lepomis_cyanellus");
  assert.ok(crappieDiet && bluegillDiet && pumpkinDiet && redearDiet && greenDiet);
  assert.ok(crappieDiet.primaryForage.includes("small_forage_fish"));
  assert.ok(!bluegillDiet.primaryForage.includes("small_forage_fish"));
  assert.ok(pumpkinDiet.primaryForage.includes("mollusks"));
  assert.equal(redearDiet.feedingStyle, "specialized");
  assert.equal(redearDiet.feedingZone, "benthic");
  assert.ok(redearDiet.primaryForage.includes("mollusks"));
  assert.ok(greenDiet.primaryForage.includes("small_forage_fish"));
  assert.equal(behaviorDossierFor("pomoxis_spp")?.social.pattern, "schooling");
});

test("wave 02d remaining sunfish use agency ear-flap, tongue-teeth, and flier-spine characters", () => {
  const redbreast = identificationDossierFor("lepomis_auritus");
  const warmouth = identificationDossierFor("lepomis_gulosus");
  const longear = identificationDossierFor("lepomis_megalotis");
  const flier = identificationDossierFor("centrarchus_macropterus");
  assert.ok(redbreast && warmouth && longear && flier);

  assert.match(redbreast.identificationTraits.join(" "), /entirely black|no wider than the eye/i);
  assert.match(longear.identificationTraits.join(" "), /white/i);
  assert.match(longear.identificationTraits.join(" "), /rounded/i);
  assert.match(warmouth.identificationTraits.join(" "), /tongue/i);
  assert.match(warmouth.identificationTraits.join(" "), /three|3/i);
  assert.match(flier.identificationTraits.join(" "), /teardrop/i);
  assert.match(flier.identificationTraits.join(" "), /11|thirteen|dorsal/i);

  assert.ok(redbreast.similarSpecies.some((item) => item.speciesId === "lepomis_megalotis"));
  assert.ok(longear.similarSpecies.some((item) => item.speciesId === "lepomis_auritus"));
  assert.ok(warmouth.similarSpecies.some((item) => item.speciesId === "ambloplites_rupestris"));
  assert.ok(flier.similarSpecies.some((item) => item.speciesId === "pomoxis_spp"));

  const redbreastDiet = dietDossierFor("lepomis_auritus");
  const warmouthDiet = dietDossierFor("lepomis_gulosus");
  const longearDiet = dietDossierFor("lepomis_megalotis");
  const flierDiet = dietDossierFor("centrarchus_macropterus");
  assert.ok(redbreastDiet && warmouthDiet && longearDiet && flierDiet);
  assert.ok(redbreastDiet.primaryForage.includes("mollusks"));
  assert.ok(!longearDiet.primaryForage.includes("mollusks"));
  assert.ok(warmouthDiet.primaryForage.includes("small_forage_fish"));
  assert.ok(!warmouthDiet.primaryForage.includes("zooplankton"));
  assert.ok(flierDiet.primaryForage.includes("aquatic_insects"));
  assert.equal(behaviorDossierFor("lepomis_gulosus")?.social.pattern, "solitary");
  assert.equal(behaviorDossierFor("centrarchus_macropterus")?.social.pattern, "loose_aggregation");
});

test("wave 02e catfish use agency anal-fin, tail, and jaw characters", () => {
  const channel = identificationDossierFor("ictalurus_punctatus");
  const blue = identificationDossierFor("ictalurus_furcatus");
  const flathead = identificationDossierFor("pylodictis_olivaris");
  const white = identificationDossierFor("ameiurus_catus");
  assert.ok(channel && blue && flathead && white);

  assert.match(channel.identificationTraits.join(" "), /24|29/);
  assert.match(channel.identificationTraits.join(" "), /convex|round/i);
  assert.match(blue.identificationTraits.join(" "), /30/);
  assert.match(blue.identificationTraits.join(" "), /straight/i);
  assert.match(flathead.identificationTraits.join(" "), /lower jaw|project/i);
  assert.match(flathead.identificationTraits.join(" "), /14|17/);
  assert.match(white.identificationTraits.join(" "), /18|24/);
  assert.match(white.identificationTraits.join(" "), /light/i);

  assert.ok(channel.similarSpecies.some((item) => item.speciesId === "ictalurus_furcatus"));
  assert.ok(blue.similarSpecies.some((item) => item.speciesId === "ictalurus_punctatus"));
  assert.ok(flathead.similarSpecies.some((item) => item.speciesId === "ictalurus_punctatus"));
  assert.ok(white.similarSpecies.some((item) => item.speciesId === "ictalurus_punctatus"));
  assert.ok(white.similarSpecies.some((item) => item.speciesId === "ameiurus_natalis"));

  const channelDiet = dietDossierFor("ictalurus_punctatus");
  const blueDiet = dietDossierFor("ictalurus_furcatus");
  const flatheadDiet = dietDossierFor("pylodictis_olivaris");
  const whiteDiet = dietDossierFor("ameiurus_catus");
  assert.ok(channelDiet && blueDiet && flatheadDiet && whiteDiet);
  assert.ok(!channelDiet.primaryForage.includes("larger_prey_fish"));
  assert.ok(blueDiet.primaryForage.includes("larger_prey_fish"));
  assert.equal(flatheadDiet.feedingStyle, "specialized");
  assert.ok(flatheadDiet.primaryForage.includes("larger_prey_fish"));
  assert.ok(!whiteDiet.primaryForage.includes("larger_prey_fish"));
  assert.equal(behaviorDossierFor("pylodictis_olivaris")?.social.pattern, "solitary");
  assert.match(JSON.stringify(flatheadDiet), /not scavenger/i);
});

test("wave 02f Pacific and landlocked salmon keep chinook off coho, pink off chum, and landlocked off brown and wild Atlantic", () => {
  const chinook = identificationDossierFor("oncorhynchus_tshawytscha");
  const coho = identificationDossierFor("oncorhynchus_kisutch");
  const pink = identificationDossierFor("oncorhynchus_gorbuscha");
  const chum = identificationDossierFor("oncorhynchus_keta");
  const landlocked = identificationDossierFor("salmo_salar_landlocked");
  assert.ok(chinook && coho && pink && chum && landlocked);

  assert.match(chinook.identificationTraits.join(" "), /blackmouth|gum/i);
  assert.match(chinook.identificationTraits.join(" "), /both lobes|both tail/i);
  assert.match(coho.identificationTraits.join(" "), /gum/i);
  assert.match(coho.identificationTraits.join(" "), /upper/i);
  assert.match(pink.identificationTraits.join(" "), /oval/i);
  assert.match(pink.identificationTraits.join(" "), /scale/i);
  assert.match(chum.identificationTraits.join(" "), /spot/i);
  assert.match(chum.identificationTraits.join(" "), /silver/i);
  assert.match(landlocked.identificationTraits.join(" "), /fork/i);
  assert.match(landlocked.identificationTraits.join(" "), /vomer/i);

  assert.ok(chinook.similarSpecies.some((item) => item.speciesId === "oncorhynchus_kisutch"));
  assert.ok(coho.similarSpecies.some((item) => item.speciesId === "oncorhynchus_tshawytscha"));
  assert.ok(pink.similarSpecies.some((item) => item.speciesId === "oncorhynchus_keta"));
  assert.ok(chum.similarSpecies.some((item) => item.speciesId === "oncorhynchus_gorbuscha"));
  assert.ok(landlocked.similarSpecies.some((item) => item.speciesId === "salmo_trutta"));
  assert.ok(
    landlocked.similarSpecies.some(
      (item) => item.speciesId === "salmo_salar_anadromous" || /sea-run|anadromous Atlantic|wild.*Atlantic/i.test(item.name + item.distinction),
    ),
  );

  const chinookDiet = dietDossierFor("oncorhynchus_tshawytscha");
  const cohoDiet = dietDossierFor("oncorhynchus_kisutch");
  const pinkDiet = dietDossierFor("oncorhynchus_gorbuscha");
  const chumDiet = dietDossierFor("oncorhynchus_keta");
  const landlockedDiet = dietDossierFor("salmo_salar_landlocked");
  assert.ok(chinookDiet && cohoDiet && pinkDiet && chumDiet && landlockedDiet);
  assert.ok(chinookDiet.primaryForage.includes("larger_prey_fish"));
  assert.ok(!cohoDiet.primaryForage.includes("larger_prey_fish"));
  assert.match(chinookDiet.primaryNote, /interception|not forage matching/i);
  assert.match(pinkDiet.primaryNote, /do not eat|stop eating|not eat/i);
  assert.match(chumDiet.primaryNote, /cease feeding|ceased feeding|digestive tract/i);
  assert.match(landlockedDiet.primaryNote, /smelt/i);
  assert.match(landlockedDiet.primaryNote, /still feeds/i);
  assert.ok(!landlockedDiet.primaryForage.includes("larger_prey_fish"));

  assert.equal(SPECIES_BY_ID.oncorhynchus_gorbuscha.stillPresentations.length, 0);
  assert.equal(SPECIES_BY_ID.oncorhynchus_keta.stillPresentations.length, 0);

  const pinkCal = seasonalCalendarDossierFor("oncorhynchus_gorbuscha");
  const chumCal = seasonalCalendarDossierFor("oncorhynchus_keta");
  assert.ok(pinkCal && chumCal);
  assert.doesNotMatch(JSON.stringify(pinkCal), /trolling|vertical jig|horizontal retrieve|stop-and-go|suspend \/ pause|surface retrieve/i);
  assert.doesNotMatch(JSON.stringify(chumCal), /trolling|vertical jig|horizontal retrieve|stop-and-go|suspend \/ pause|surface retrieve/i);
  assert.match(pinkCal.overview, /flowing-water only|flowing water only/i);
  assert.match(chumCal.overview, /flowing-water only|flowing water only/i);

  const landlockedCal = seasonalCalendarDossierFor("salmo_salar_landlocked");
  assert.ok(landlockedCal);
  assert.match(JSON.stringify(landlockedCal), /smelt|65/i);
  assert.match(JSON.stringify(landlockedCal), /sea-run|anadromous/i);
});

test("wave 02g remaining salmonids and burbot keep whitefish off trout, char pairs apart, and sheefish as an adult piscivore", () => {
  const whitefish = identificationDossierFor("prosopium_williamsoni");
  const grayling = identificationDossierFor("thymallus_arcticus");
  const burbot = identificationDossierFor("lota_lota");
  const arcticChar = identificationDossierFor("salvelinus_alpinus");
  const dolly = identificationDossierFor("salvelinus_malma");
  const sheefish = identificationDossierFor("stenodus_leucichthys");
  assert.ok(whitefish && grayling && burbot && arcticChar && dolly && sheefish);

  assert.match(whitefish.identificationTraits.join(" "), /small mouth|toothless/i);
  assert.match(whitefish.identificationTraits.join(" "), /adipose/i);
  assert.match(grayling.identificationTraits.join(" "), /sail/i);
  assert.match(grayling.identificationTraits.join(" "), /slash/i);
  assert.match(burbot.identificationTraits.join(" "), /barbel/i);
  assert.match(burbot.identificationTraits.join(" "), /eel/i);
  assert.match(arcticChar.identificationTraits.join(" "), /fork/i);
  assert.match(arcticChar.identificationTraits.join(" "), /spot/i);
  assert.match(dolly.identificationTraits.join(" "), /spot/i);
  assert.match(dolly.identificationTraits.join(" "), /stream|sea-run|ocean/i);
  assert.match(sheefish.identificationTraits.join(" "), /jaw/i);

  assert.ok(whitefish.similarSpecies.some((item) => item.speciesId === "coregonus_clupeaformis"));
  assert.ok(arcticChar.similarSpecies.some((item) => item.speciesId === "salvelinus_malma"));
  assert.ok(dolly.similarSpecies.some((item) => item.speciesId === "salvelinus_alpinus"));
  assert.ok(dolly.similarSpecies.some((item) => item.speciesId === "salvelinus_confluentus"));
  assert.ok(arcticChar.similarSpecies.some((item) => item.speciesId === "salvelinus_namaycush"));

  const whitefishDiet = dietDossierFor("prosopium_williamsoni");
  const graylingDiet = dietDossierFor("thymallus_arcticus");
  const burbotDiet = dietDossierFor("lota_lota");
  const charDiet = dietDossierFor("salvelinus_alpinus");
  const dollyDiet = dietDossierFor("salvelinus_malma");
  const sheeDiet = dietDossierFor("stenodus_leucichthys");
  assert.ok(whitefishDiet && graylingDiet && burbotDiet && charDiet && dollyDiet && sheeDiet);
  assert.ok(!whitefishDiet.primaryForage.includes("small_forage_fish"));
  assert.ok(whitefishDiet.primaryForage.includes("aquatic_insects"));
  assert.ok(graylingDiet.primaryForage.includes("aquatic_insects"));
  assert.ok(burbotDiet.primaryForage.includes("larger_prey_fish"));
  assert.equal(burbotDiet.feedingZone, "benthic");
  assert.ok(charDiet.primaryForage.includes("zooplankton"));
  assert.match(dollyDiet.primaryNote, /redd|hatch|scavenge/i);
  assert.equal(sheeDiet.feedingStyle, "specialized");
  assert.match(sheeDiet.primaryNote, /exclusively on other fish|almost exclusively/i);
  assert.ok(sheeDiet.primaryForage.includes("larger_prey_fish"));

  assert.equal(SPECIES_BY_ID.salvelinus_alpinus.flowingPresentations.length, 0);
  const charCal = seasonalCalendarDossierFor("salvelinus_alpinus");
  assert.ok(charCal);
  assert.match(charCal.overview, /stillwater only/i);
  assert.doesNotMatch(JSON.stringify(charCal), /dead drift|tight-line drift|swing|bottom-contact drift/i);

  const graylingCal = seasonalCalendarDossierFor("thymallus_arcticus");
  assert.ok(graylingCal);
  assert.doesNotMatch(JSON.stringify(graylingCal), /trolling|vertical jig|bottom-contact drift/i);
});

test("wave 03 conservation IDs keep bull trout off Dolly and brook, and wild Atlantic off landlocked, steelhead, and brown", () => {
  const bull = identificationDossierFor("salvelinus_confluentus");
  const atlantic = identificationDossierFor("salmo_salar_anadromous");
  assert.ok(bull && atlantic);

  assert.match(bull.identificationTraits.join(" "), /dorsal/i);
  assert.match(bull.identificationTraits.join(" "), /spot/i);
  assert.match(bull.identificationTraits.join(" "), /fork/i);
  assert.match(bull.identificationTraits.join(" "), /white/i);
  assert.match(bull.identificationTraits.join(" "), /threatened|ESA/i);
  assert.ok(bull.similarSpecies.some((item) => item.speciesId === "salvelinus_malma"));
  assert.ok(bull.similarSpecies.some((item) => item.speciesId === "salvelinus_fontinalis"));
  assert.ok(bull.similarSpecies.some((item) => item.speciesId === "salvelinus_namaycush"));

  assert.match(atlantic.identificationTraits.join(" "), /illegal|prohibited/i);
  assert.match(atlantic.identificationTraits.join(" "), /Gulf of Maine|endangered/i);
  assert.match(atlantic.identificationTraits.join(" "), /X-mark|x-shaped|fork/i);
  assert.ok(atlantic.similarSpecies.some((item) => item.speciesId === "salmo_salar_landlocked"));
  assert.ok(atlantic.similarSpecies.some((item) => item.speciesId === "oncorhynchus_mykiss_steelhead"));
  assert.ok(atlantic.similarSpecies.some((item) => item.speciesId === "salmo_trutta"));

  assert.equal(behaviorDossierFor("salvelinus_confluentus"), null);
  assert.equal(dietDossierFor("salvelinus_confluentus"), null);
  assert.equal(seasonalCalendarDossierFor("salvelinus_confluentus"), null);
  assert.equal(behaviorDossierFor("salmo_salar_anadromous"), null);
  assert.equal(dietDossierFor("salmo_salar_anadromous"), null);
  assert.equal(seasonalCalendarDossierFor("salmo_salar_anadromous"), null);

  assert.equal(SPECIES_BY_ID.salvelinus_confluentus.flowingPresentations.length, 0);
  assert.equal(SPECIES_BY_ID.salvelinus_confluentus.stillPresentations.length, 0);
  assert.equal(SPECIES_BY_ID.salmo_salar_anadromous.flowingPresentations.length, 0);
  assert.equal(SPECIES_BY_ID.salmo_salar_anadromous.stillPresentations.length, 0);

  assert.doesNotMatch(JSON.stringify(bull), LOCATION);
  assert.doesNotMatch(JSON.stringify(atlantic), LOCATION);
  assert.doesNotMatch(JSON.stringify(bull), /Dennys|Machias|Penobscot|Sheepscot|Ducktrap|Narraguagus/i);
  assert.doesNotMatch(JSON.stringify(atlantic), /Dennys|Machias|Penobscot|Sheepscot|Ducktrap|Narraguagus/i);
  assert.doesNotMatch(JSON.stringify(bull), /presentationImplication|trolling|vertical jig|horizontal retrieve/i);
  assert.doesNotMatch(JSON.stringify(atlantic), /presentationImplication|trolling|vertical jig|horizontal retrieve/i);
});


test("rainbow and cutthroat identification uses slash / dentition characters rather than invented visuals", () => {
  const rainbow = identificationDossierFor("oncorhynchus_mykiss");
  const cutthroat = identificationDossierFor("oncorhynchus_clarkii");
  assert.ok(rainbow && cutthroat);
  assert.match(cutthroat.identificationTraits.join(" "), /slash|basibranchial/i);
  assert.match(rainbow.similarSpecies.map((item) => item.distinction).join(" "), /slash|basibranchial|hybrid/i);
});

test("black bass identification uses jaw and dorsal / tongue characters from agency keys", () => {
  const largemouth = identificationDossierFor("micropterus_nigricans");
  const smallmouth = identificationDossierFor("micropterus_dolomieu");
  const spotted = identificationDossierFor("micropterus_punctulatus");
  assert.ok(largemouth && smallmouth && spotted);
  assert.match(largemouth.identificationTraits.join(" "), /jaw/i);
  assert.match(smallmouth.identificationTraits.join(" "), /jaw/i);
  assert.match(spotted.identificationTraits.join(" "), /tongue|rows of stripes|jaw/i);
});

test("Morone identification uses tongue tooth patches and stripe continuity", () => {
  const striper = identificationDossierFor("morone_saxatilis");
  const white = identificationDossierFor("morone_chrysops");
  const wiper = identificationDossierFor("morone_hybrid_wiper");
  const perch = identificationDossierFor("morone_americana");
  assert.ok(striper && white && wiper && perch);
  assert.match(striper.identificationTraits.join(" "), /two|2/i);
  assert.match(white.identificationTraits.join(" "), /singular|single|one/i);
  assert.match(wiper.identificationTraits.join(" "), /broken|two/i);
  assert.match(perch.identificationTraits.join(" "), /stripe/i);
});

test("seasonal calendars do not introduce unreviewed presentation families", () => {
  for (const dossier of SEASONAL_CALENDAR_DOSSIERS) {
    const species = SPECIES_BY_ID[dossier.speciesId];
    const reviewed = new Set([...species.flowingPresentations, ...species.stillPresentations]);
    for (const entry of dossier.entries) {
      const text = entry.presentationImplication;
      if (!text) continue;
      const normalized = normalize(text);
      const mentioned = PRESENTATIONS.filter((family) => {
        const label = normalize(family.label);
        return label.length >= 5 && normalized.includes(label);
      });
      for (const family of mentioned) {
        const label = normalize(family.label);
        const coveredByLonger = mentioned.some(
          (other) => other.id !== family.id && normalize(other.label).includes(label),
        );
        if (coveredByLonger) continue;
        assert.ok(
          reviewed.has(family.id),
          `${dossier.speciesId} ${entry.season} mentions ${family.id} (${family.label}) which is not reviewed for this species`,
        );
      }
    }
  }
});

test("diet and seasonal overlays are not imported by the presentation engine", () => {
  const engineDir = new URL("../engine/", import.meta.url);
  const files = ["infer.ts", "presentation-weighting.ts", "population-context.ts", "species-weight-overrides.ts"];
  for (const file of files) {
    const source = readFileSync(new URL(file, engineDir), "utf8");
    assert.doesNotMatch(source, /diet-dossiers|seasonal-calendar-dossiers/);
  }
});

test("all 75 species remain resolvable and spawning seasons stay inside the canonical vocabulary", () => {
  assert.equal(SPECIES.length, 75);
  assert.equal(new Set(SPECIES.map((species) => species.id)).size, 75);
  for (const species of SPECIES) {
    assert.ok(species.id);
    for (const season of species.spawning.seasons) {
      assert.ok(
        (SEASONS as readonly string[]).includes(season),
        `${species.id} has non-canonical season ${season}`,
      );
    }
  }
});

test("yellow bullhead source record uses canonical seasons without a catalog workaround", () => {
  const source = SPECIES_EXPANSION_03.find((species) => species.id === "ameiurus_natalis");
  assert.ok(source);
  assert.deepEqual(source.spawning.seasons, ["spring", "early_summer"]);
  assert.ok(!(source.spawning.seasons as string[]).includes("late_spring"));

  const catalogSource = readFileSync(new URL("./species-catalog.ts", import.meta.url), "utf8");
  assert.doesNotMatch(catalogSource, /ameiurus_natalis/);
  assert.doesNotMatch(catalogSource, /late_spring/);

  const yellow = SPECIES_BY_ID.ameiurus_natalis;
  assert.ok(yellow);
  assert.deepEqual(yellow.spawning.seasons, ["spring", "early_summer"]);

  const calendar = seasonalCalendarDossierFor("ameiurus_natalis");
  assert.ok(calendar);
  const seasons = calendar.entries.map((entry) => entry.season);
  assert.ok(seasons.includes("spring"));
  assert.ok(seasons.includes("early_summer"));
});
