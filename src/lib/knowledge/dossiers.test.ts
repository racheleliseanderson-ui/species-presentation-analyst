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
  assert.equal(IDENTIFICATION_DOSSIERS.length, BEHAVIOR_DOSSIERS.length);
  assert.equal(IDENTIFICATION_DOSSIERS.length, DIET_DOSSIERS.length);
  assert.equal(IDENTIFICATION_DOSSIERS.length, SEASONAL_CALENDAR_DOSSIERS.length);

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
    if (!identification) {
      assert.equal(behavior, null, `${species.id} has behavior without identification`);
      assert.equal(diet, null, `${species.id} has diet without identification`);
      assert.equal(calendar, null, `${species.id} has calendar without identification`);
    } else {
      assert.ok(behavior, `${species.id} has identification without behavior`);
      assert.ok(diet, `${species.id} has identification without diet`);
      assert.ok(calendar, `${species.id} has identification without calendar`);
    }
  }

  const uncovered = SPECIES.filter((species) => !identificationDossierFor(species.id));
  assert.equal(uncovered.length, 33);
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
