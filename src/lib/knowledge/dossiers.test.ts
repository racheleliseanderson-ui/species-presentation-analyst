import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { SPECIES, SPECIES_BY_ID } from "./species-catalog.ts";
import { SPECIES_EXPANSION_03 } from "./species-expansion-03.ts";
import { BEHAVIOR_DOSSIERS } from "./behavior-dossiers.ts";
import { BEHAVIOR_DOSSIERS_WAVE_02 } from "./behavior-dossiers-wave-02.ts";
import { DIET_DOSSIERS } from "./diet-dossiers.ts";
import { FIGHT_DOSSIERS } from "./fight-dossiers.ts";
import { FOOD_VALUE_DOSSIERS } from "./food-dossiers.ts";
import { IDENTIFICATION_DOSSIERS } from "./identification-dossiers.ts";
import { IDENTIFICATION_DOSSIERS_WAVE_02 } from "./identification-dossiers-wave-02.ts";
import { SEASONAL_CALENDAR_DOSSIERS } from "./seasonal-calendar-dossiers.ts";
import { PRESENTATIONS } from "./presentations.ts";
import {
  BEHAVIOR_DOSSIER_VERSION,
  CONSUMPTION_ADVISORY_RULE,
  DIET_DOSSIER_VERSION,
  FIGHT_DOSSIER_VERSION,
  FOOD_VALUE_DOSSIER_VERSION,
  IDENTIFICATION_DOSSIER_VERSION,
  SEASONAL_CALENDAR_VERSION,
} from "./dossier-types.ts";
import {
  behaviorDossierFor,
  dietDossierFor,
  fightDossierFor,
  foodValueDossierFor,
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";
import { FORAGE_CLASSES, SEASONS } from "../protocol/vocab.ts";
import { searchSpecies, ALIASES } from "./aliases.ts";
import { ENRICHMENT_WAVES } from "./enrichment-queue.ts";

const FORBIDDEN = /best bite|hot bite|catch probability|secret spot|gps coordinate/i;
const LOCATION = /exact spawning|staging location|migration bottleneck|hotspot/i;
const FIGHT_SCORE = /fun rating|1–100|1-100|\b\d+\s*\/\s*100\b/i;
const SAFE_CLAIM = /this species is safe to eat/i;

const DISTINCTION_GROUPS: Record<string, string[]> = Object.fromEntries(
  ENRICHMENT_WAVES.filter((wave) => wave.status !== "queued")
    .flatMap((wave) => wave.groups)
    .filter((group) => group.speciesIds.length > 1)
    .map((group) => [group.id, group.speciesIds]),
);

function normalize(value: string): string {
  return value.toLowerCase().replace(/[/-]/g, " ").replace(/\s+/g, " ").trim();
}

test("identification, behavior, diet, seasonal, fight, and food versions are explicit overlays, not a new AFP contract", () => {
  assert.equal(IDENTIFICATION_DOSSIER_VERSION, "AFP-ID-1.0");
  assert.equal(BEHAVIOR_DOSSIER_VERSION, "AFP-BH-1.0");
  assert.equal(DIET_DOSSIER_VERSION, "AFP-DI-1.0");
  assert.equal(SEASONAL_CALENDAR_VERSION, "AFP-SC-1.0");
  assert.equal(FIGHT_DOSSIER_VERSION, "AFP-FT-1.0");
  assert.equal(FOOD_VALUE_DOSSIER_VERSION, "AFP-FV-1.0");
});

test("every dossier points at a reviewed catalog species and has provenance", () => {
  assert.equal(IDENTIFICATION_DOSSIERS.length, BEHAVIOR_DOSSIERS.length);
  assert.equal(IDENTIFICATION_DOSSIERS.length, DIET_DOSSIERS.length);
  assert.equal(IDENTIFICATION_DOSSIERS.length, SEASONAL_CALENDAR_DOSSIERS.length);
  assert.equal(IDENTIFICATION_DOSSIERS.length, FIGHT_DOSSIERS.length);
  assert.equal(IDENTIFICATION_DOSSIERS.length, FOOD_VALUE_DOSSIERS.length);
  assert.equal(IDENTIFICATION_DOSSIERS.length, 26);
  assert.equal(IDENTIFICATION_DOSSIERS_WAVE_02.length, 15);
  assert.equal(IDENTIFICATION_DOSSIERS_WAVE_02.length, BEHAVIOR_DOSSIERS_WAVE_02.length);

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

  for (const dossier of IDENTIFICATION_DOSSIERS_WAVE_02) {
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

  for (const dossier of BEHAVIOR_DOSSIERS_WAVE_02) {
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

  const STRENGTH = new Set(["light", "moderate", "powerful", "very_powerful"]);
  const ACCEL = new Set(["gradual", "abrupt"]);
  const ENDURANCE = new Set(["brief", "sustained", "prolonged"]);
  const RUN = new Set(["short_surges", "long_runs", "mixed"]);
  const JUMP = new Set(["rare", "occasional", "frequent"]);
  const TENDENCY = new Set(["low", "moderate", "high"]);
  const AERIAL = new Set(["rarely_aerial", "sometimes_aerial", "often_aerial"]);

  for (const dossier of FIGHT_DOSSIERS) {
    assert.ok(SPECIES_BY_ID[dossier.speciesId], `missing catalog species ${dossier.speciesId}`);
    assert.ok(dossier.sources.length > 0, `${dossier.speciesId} fight is missing sources`);
    assert.ok(
      dossier.sources.some((source) => source.class === "agency" || source.class === "peer_reviewed"),
      `${dossier.speciesId} fight needs an agency or peer-reviewed source`,
    );
    assert.ok(dossier.overview.length > 0);
    assert.ok(dossier.relativeStrengthNote.length > 0);
    assert.ok(dossier.landingConsiderations.length > 0);
    if (dossier.relativeStrength) assert.ok(STRENGTH.has(dossier.relativeStrength));
    if (dossier.initialAcceleration) assert.ok(ACCEL.has(dossier.initialAcceleration));
    if (dossier.sustainedEndurance) assert.ok(ENDURANCE.has(dossier.sustainedEndurance));
    if (dossier.runTendency) assert.ok(RUN.has(dossier.runTendency));
    if (dossier.jumping) assert.ok(JUMP.has(dossier.jumping));
    if (dossier.headShaking) assert.ok(TENDENCY.has(dossier.headShaking));
    if (dossier.rollingTwisting) assert.ok(TENDENCY.has(dossier.rollingTwisting));
    if (dossier.bulldogging) assert.ok(TENDENCY.has(dossier.bulldogging));
    if (dossier.aerialBehavior) assert.ok(AERIAL.has(dossier.aerialBehavior));
    if (dossier.status === "reviewed") {
      assert.ok(
        dossier.relativeStrength,
        `${dossier.speciesId} reviewed fight is missing a relative-strength class`,
      );
    }
    assert.doesNotMatch(JSON.stringify(dossier), FORBIDDEN);
    assert.doesNotMatch(JSON.stringify(dossier), FIGHT_SCORE);
  }

  const FREQUENCY = new Set(["commonly_eaten", "sometimes_eaten", "rarely_eaten", "regionally_prized"]);

  for (const dossier of FOOD_VALUE_DOSSIERS) {
    assert.ok(SPECIES_BY_ID[dossier.speciesId], `missing catalog species ${dossier.speciesId}`);
    assert.ok(dossier.sources.length > 0, `${dossier.speciesId} food is missing sources`);
    assert.ok(
      dossier.sources.some((source) => source.class === "agency" || source.class === "peer_reviewed"),
      `${dossier.speciesId} food needs an agency or peer-reviewed source`,
    );
    assert.ok(FREQUENCY.has(dossier.culinaryFrequency));
    assert.ok(dossier.culinaryReputation.length > 0);
    assert.equal(dossier.consumptionAdvisoryRule, CONSUMPTION_ADVISORY_RULE);
    assert.doesNotMatch(JSON.stringify(dossier), FORBIDDEN);
    assert.doesNotMatch(JSON.stringify(dossier), SAFE_CLAIM);
  }
});

test("incomplete research remains explicitly incomplete for species without dossiers", () => {
  for (const species of SPECIES) {
    const identification = identificationDossierFor(species.id);
    const behavior = behaviorDossierFor(species.id);
    const diet = dietDossierFor(species.id);
    const calendar = seasonalCalendarDossierFor(species.id);
    const fight = fightDossierFor(species.id);
    const food = foodValueDossierFor(species.id);
    if (!identification) {
      assert.equal(behavior, null, `${species.id} has behavior without identification`);
      assert.equal(diet, null, `${species.id} has diet without identification`);
      assert.equal(calendar, null, `${species.id} has calendar without identification`);
      assert.equal(fight, null, `${species.id} has fight without identification`);
      assert.equal(food, null, `${species.id} has food without identification`);
    } else {
      assert.ok(behavior, `${species.id} has identification without behavior`);
      const hasLaterLayer = diet || calendar || fight || food;
      if (hasLaterLayer) {
        assert.ok(diet, `${species.id} has a later overlay without diet`);
        assert.ok(calendar, `${species.id} has a later overlay without calendar`);
        assert.ok(fight, `${species.id} has a later overlay without fight`);
        assert.ok(food, `${species.id} has a later overlay without food`);
      } else {
        assert.equal(diet, null, `${species.id} invented diet without the rest of the later overlays`);
        assert.equal(calendar, null, `${species.id} invented calendar without the rest of the later overlays`);
        assert.equal(fight, null, `${species.id} invented fight without the rest of the later overlays`);
        assert.equal(food, null, `${species.id} invented food without the rest of the later overlays`);
      }
    }
  }

  const uncovered = SPECIES.filter((species) => !identificationDossierFor(species.id));
  assert.equal(uncovered.length, 34, "waves 03–05 should still show identification gaps");
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

test("diet, seasonal, fight, and food overlays are not imported by the presentation engine", () => {
  const engineDir = new URL("../engine/", import.meta.url);
  const files = ["infer.ts", "presentation-weighting.ts", "population-context.ts", "species-weight-overrides.ts"];
  for (const file of files) {
    const source = readFileSync(new URL(file, engineDir), "utf8");
    assert.doesNotMatch(source, /diet-dossiers|seasonal-calendar-dossiers|fight-dossiers|food-dossiers|enrichment-queue|identification-dossiers-wave-02|behavior-dossiers-wave-02/);
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

test("lookalike fight notes are not copied across species", () => {
  const rainbow = fightDossierFor("oncorhynchus_mykiss");
  const cutthroat = fightDossierFor("oncorhynchus_clarkii");
  const kokanee = fightDossierFor("oncorhynchus_nerka_kokanee");
  const sockeye = fightDossierFor("oncorhynchus_nerka_anadromous");
  const smallmouth = fightDossierFor("micropterus_dolomieu");
  const spotted = fightDossierFor("micropterus_punctulatus");
  const largemouth = fightDossierFor("micropterus_nigricans");
  const striper = fightDossierFor("morone_saxatilis");
  const yellow = fightDossierFor("morone_mississippiensis");
  const carp = fightDossierFor("cyprinus_carpio");
  const bigmouth = fightDossierFor("ictiobus_cyprinellus");
  assert.ok(rainbow && cutthroat && kokanee && sockeye);
  assert.ok(smallmouth && spotted && largemouth && striper && yellow && carp && bigmouth);

  assert.equal(rainbow.status, "reviewed");
  assert.equal(cutthroat.status, "partial");
  assert.doesNotMatch(JSON.stringify(cutthroat), /peeling line|MassWildlife/);
  assert.equal(kokanee.status, "reviewed");
  assert.equal(sockeye.status, "partial");
  assert.doesNotMatch(JSON.stringify(sockeye), /light tackle/);
  assert.match(JSON.stringify(smallmouth), /aerial acrobat|acrobatic/i);
  assert.equal(spotted.status, "partial");
  assert.equal(spotted.relativeStrength, undefined);
  assert.equal(spotted.jumping, undefined);
  assert.equal(largemouth.status, "partial");
  assert.equal(largemouth.relativeStrength, undefined);
  assert.equal(largemouth.jumping, undefined);
  assert.equal(smallmouth.jumping, "frequent");
  assert.match(JSON.stringify(striper), /nosedive|powerful fighting/i);
  assert.doesNotMatch(JSON.stringify(yellow), /incredible fighters|nosedive/);
  assert.match(JSON.stringify(carp), /long, strong fight/i);
  assert.doesNotMatch(JSON.stringify(bigmouth), /long, strong fight|fighting the fish along with the current/);
});

test("food dossiers keep table character separate from safety claims and lookalike culinary quotes", () => {
  const kokanee = foodValueDossierFor("oncorhynchus_nerka_kokanee");
  const sockeye = foodValueDossierFor("oncorhynchus_nerka_anadromous");
  const cisco = foodValueDossierFor("coregonus_artedi");
  const whitefish = foodValueDossierFor("coregonus_clupeaformis");
  const goldeye = foodValueDossierFor("hiodon_alosoides");
  const mooneye = foodValueDossierFor("hiodon_tergisus");
  const carp = foodValueDossierFor("cyprinus_carpio");
  const alligator = foodValueDossierFor("atractosteus_spatula");
  const longnose = foodValueDossierFor("lepisosteus_osseus");
  const spotted = foodValueDossierFor("lepisosteus_oculatus");
  const shortnose = foodValueDossierFor("lepisosteus_platostomus");
  const bigmouth = foodValueDossierFor("ictiobus_cyprinellus");
  const smallmouthBuffalo = foodValueDossierFor("ictiobus_bubalus");
  assert.ok(kokanee && sockeye && cisco && whitefish && goldeye && mooneye);
  assert.ok(carp && alligator && longnose && spotted && shortnose && bigmouth && smallmouthBuffalo);

  assert.match(kokanee.flavor ?? "", /orange flesh|omega-3/i);
  assert.match(sockeye.flavor ?? "", /bold, buttery flavor similar to Chinook/i);
  assert.notEqual(kokanee.flavor, sockeye.flavor);
  assert.ok(sockeye.harvestGateNote);
  assert.match(whitefish.flavor ?? "", /mild flavor/i);
  assert.equal(cisco.flavor, undefined);
  assert.match(goldeye.culinaryReputation, /Winnipeg goldeye/i);
  assert.equal(mooneye.status, "partial");
  assert.equal(mooneye.flavor, undefined);
  assert.ok(!mooneye.commonCookingMethods);
  assert.match(carp.flavor ?? "", /skin tends to add a strong, fishy flavor/i);
  assert.doesNotMatch(carp.flavor ?? "", /Hypophthalmichthys|silver carp|bighead/);
  assert.ok(bigmouth.harvestGateNote);
  assert.ok(smallmouthBuffalo.harvestGateNote);
  assert.ok(alligator.harvestGateNote);

  for (const dossier of [alligator, longnose, spotted, shortnose]) {
    assert.ok(dossier.biologicalHazards?.some((item) => /egg/i.test(item)));
    assert.match(dossier.biologicalHazards?.join(" ") ?? "", /toxic|poison/i);
  }
});

test("wave 02 inland trout and char keep separate visual and diel identities", () => {
  const brown = identificationDossierFor("salmo_trutta");
  const brook = identificationDossierFor("salvelinus_fontinalis");
  const lake = identificationDossierFor("salvelinus_namaycush");
  const brownBehavior = behaviorDossierFor("salmo_trutta");
  const brookBehavior = behaviorDossierFor("salvelinus_fontinalis");
  const lakeBehavior = behaviorDossierFor("salvelinus_namaycush");
  assert.ok(brown && brook && lake && brownBehavior && brookBehavior && lakeBehavior);

  assert.match(brown.identificationTraits.join(" "), /halo|unspotted|tail/i);
  assert.match(brook.identificationTraits.join(" "), /worm|vermiculation|white leading edge/i);
  assert.match(lake.identificationTraits.join(" "), /forked|light spots/i);
  assert.equal(brownBehavior.dielTendency.class, "crepuscular");
  assert.equal(brookBehavior.dielTendency.class, "diurnal");
  assert.doesNotMatch(JSON.stringify(brookBehavior), /more nocturnal habits/);
  assert.doesNotMatch(JSON.stringify(brownBehavior), /100 to 200/);
  assert.doesNotMatch(JSON.stringify(brookBehavior), /100 to 200/);
  assert.match(lakeBehavior.thermalDrivenBehavior ?? "", /40–55|100 to 200/i);
});

test("steelhead is anadromous rainbow, not inland rainbow with a different name", () => {
  const steelhead = identificationDossierFor("oncorhynchus_mykiss_steelhead");
  const steelheadBehavior = behaviorDossierFor("oncorhynchus_mykiss_steelhead");
  assert.ok(steelhead && steelheadBehavior);
  assert.ok(steelhead.similarSpecies.some((item) => item.speciesId === "oncorhynchus_mykiss"));
  assert.match(steelhead.identificationTraits.join(" "), /otolith|scale/i);
  assert.match(steelhead.identificationTraits.join(" "), /same species|anadromous/i);
  assert.match(steelheadBehavior.feedingStrategy.note, /not feeding|hatch/i);
  assert.match(steelheadBehavior.seasonalActivity ?? "", /summer run|winter run/i);
});

test("Chinook and Coho keep gumline and tail-spot characters apart", () => {
  const chinook = identificationDossierFor("oncorhynchus_tshawytscha");
  const coho = identificationDossierFor("oncorhynchus_kisutch");
  assert.ok(chinook && coho);
  assert.match(chinook.identificationTraits.join(" "), /blackmouth|black pigment|gum/i);
  assert.match(chinook.identificationTraits.join(" "), /both lobes|both caudal/i);
  assert.match(coho.identificationTraits.join(" "), /white|lighter pigment|gum/i);
  assert.match(coho.identificationTraits.join(" "), /upper lobe|no spots on the lower/i);
  assert.ok(chinook.similarSpecies.some((item) => item.speciesId === "oncorhynchus_kisutch"));
  assert.ok(coho.similarSpecies.some((item) => item.speciesId === "oncorhynchus_tshawytscha"));
  assert.doesNotMatch(JSON.stringify(chinook), /zooplankton specialist|daphnia/i);
  assert.doesNotMatch(JSON.stringify(coho), /zooplankton specialist|daphnia/i);
});

test("walleye and sauger keep tail-tip and dorsal-spot keys apart", () => {
  const walleye = identificationDossierFor("sander_vitreus");
  const sauger = identificationDossierFor("sander_canadensis");
  assert.ok(walleye && sauger);
  assert.match(walleye.identificationTraits.join(" "), /white/i);
  assert.match(walleye.identificationTraits.join(" "), /dark splotch|rear base/i);
  assert.match(sauger.identificationTraits.join(" "), /rows of dark spots|spotted/i);
  assert.match(sauger.identificationTraits.join(" "), /lacks the white|all-dark|no white/i);
  assert.doesNotMatch(JSON.stringify(sauger), /white lower tail tip is the tail key against sauger/);
});

test("Esox cheek, opercle, and pore keys stay species-specific", () => {
  const pike = identificationDossierFor("esox_lucius");
  const muskie = identificationDossierFor("esox_masquinongy");
  const pickerel = identificationDossierFor("esox_niger");
  const pickerelBehavior = behaviorDossierFor("esox_niger");
  assert.ok(pike && muskie && pickerel && pickerelBehavior);
  assert.match(pike.identificationTraits.join(" "), /entire cheek|fully scaled cheek|five or fewer/i);
  assert.match(muskie.identificationTraits.join(" "), /top half|six or more/i);
  assert.match(pickerel.identificationTraits.join(" "), /fully scaled cheeks and gill covers|opercle and cheek fully scaled/i);
  assert.match(pickerelBehavior.coverUse ?? "", /vegetation|weed/i);
  assert.doesNotMatch(JSON.stringify(pickerel), /open-water size class of muskellunge is this record/);
});

test("channel, blue, and flathead catfish keep tail, jaw, and anal-ray keys apart", () => {
  const channel = identificationDossierFor("ictalurus_punctatus");
  const blue = identificationDossierFor("ictalurus_furcatus");
  const flathead = identificationDossierFor("pylodictis_olivaris");
  const channelBehavior = behaviorDossierFor("ictalurus_punctatus");
  const flatheadBehavior = behaviorDossierFor("pylodictis_olivaris");
  assert.ok(channel && blue && flathead && channelBehavior && flatheadBehavior);
  assert.match(channel.identificationTraits.join(" "), /24–29|24-29/i);
  assert.match(blue.identificationTraits.join(" "), /30–35|30-35|30 or more/i);
  assert.match(blue.identificationTraits.join(" "), /Rio Grande/i);
  assert.match(flathead.identificationTraits.join(" "), /slightly notched|projecting lower jaw/i);
  assert.match(channelBehavior.feedingStrategy.note, /omnivorous/i);
  assert.match(flatheadBehavior.feedingStrategy.note, /live fish/i);
  assert.doesNotMatch(JSON.stringify(channelBehavior), /prey only on live fish/);
});

test("yellow perch is not white perch and not walleye", () => {
  const perch = identificationDossierFor("perca_flavescens");
  assert.ok(perch);
  assert.match(perch.identificationTraits.join(" "), /six to eight|6–8|vertical/i);
  assert.ok(perch.similarSpecies.some((item) => item.speciesId === "morone_americana"));
  assert.ok(perch.similarSpecies.some((item) => item.speciesId === "sander_vitreus"));
  assert.doesNotMatch(perch.identificationTraits.join(" "), /white lower tail tip is the tail key/);
});
