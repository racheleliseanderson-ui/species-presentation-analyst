import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { SPECIES, SPECIES_BY_ID } from "./species-catalog.ts";
import { SPECIES_EXPANSION_03 } from "./species-expansion-03.ts";
import { BEHAVIOR_DOSSIERS } from "./behavior-dossiers.ts";
import { IDENTIFICATION_DOSSIERS } from "./identification-dossiers.ts";
import {
  BEHAVIOR_DOSSIER_VERSION,
  IDENTIFICATION_DOSSIER_VERSION,
} from "./dossier-types.ts";
import { behaviorDossierFor, identificationDossierFor } from "./dossier-catalog.ts";
import { SEASONS } from "../protocol/vocab.ts";
import { searchSpecies, ALIASES } from "./aliases.ts";

const FORBIDDEN = /best bite|hot bite|catch probability|secret spot|gps coordinate/i;

const DISTINCTION_GROUPS: Record<string, string[]> = {
  trout: ["oncorhynchus_mykiss", "oncorhynchus_clarkii"],
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
};

test("identification and behavior dossier versions are explicit overlays, not a new AFP contract", () => {
  assert.equal(IDENTIFICATION_DOSSIER_VERSION, "AFP-ID-1.0");
  assert.equal(BEHAVIOR_DOSSIER_VERSION, "AFP-BH-1.0");
});

test("every dossier points at a reviewed catalog species and has provenance", () => {
  assert.equal(IDENTIFICATION_DOSSIERS.length, BEHAVIOR_DOSSIERS.length);

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
      !/exact spawning|staging location|migration bottleneck|hotspot/i.test(dossier.spawningBehavior),
      `${dossier.speciesId} spawning behavior names a vulnerable location`,
    );
    assert.doesNotMatch(JSON.stringify(dossier), FORBIDDEN);
  }
});

test("incomplete research remains explicitly incomplete for species without dossiers", () => {
  for (const species of SPECIES) {
    const identification = identificationDossierFor(species.id);
    const behavior = behaviorDossierFor(species.id);
    if (!identification) {
      assert.equal(behavior, null, `${species.id} has behavior without identification`);
    } else {
      assert.ok(behavior, `${species.id} has identification without behavior`);
    }
  }

  const uncovered = SPECIES.filter((species) => !identificationDossierFor(species.id));
  assert.ok(uncovered.length >= 40, "most of the catalog should still show identification gaps");
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
});
