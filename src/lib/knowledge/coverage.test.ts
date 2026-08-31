import assert from "node:assert/strict";
import test from "node:test";

import { SPECIES } from "./species-catalog.ts";
import {
  catalogKnowledgeCoverage,
  hasCompleteKnowledgeOverlays,
  overlayPresence,
} from "./coverage.ts";
import {
  FIELD_OPENER_IDS,
  KNOWLEDGE_OVERLAYS,
  SEED_DOCTRINE,
  SEED_WAVES,
  nextSeedWave,
  seedWaveForSpecies,
} from "./seed-queue.ts";
import {
  behaviorDossierFor,
  dietDossierFor,
  identificationDossierFor,
  seasonalCalendarDossierFor,
} from "./dossier-catalog.ts";

test("every catalog species sits in exactly one seed wave", () => {
  const assigned = SEED_WAVES.flatMap((wave) => [...wave.speciesIds]);
  assert.equal(assigned.length, new Set(assigned).size);
  assert.equal(assigned.length, SPECIES.length);
  for (const species of SPECIES) {
    assert.ok(seedWaveForSpecies(species.id), `unassigned ${species.id}`);
  }
});

test("landed waves have every required overlay; the next wave does not pretend to be done", () => {
  for (const wave of SEED_WAVES) {
    for (const id of wave.speciesIds) {
      const presence = overlayPresence(id);
      if (wave.status === "landed") {
        for (const overlay of wave.overlays) {
          assert.equal(presence[overlay], true, `${wave.id} ${id} missing ${overlay}`);
        }
      }
    }
  }

  const next = nextSeedWave();
  assert.ok(next);
  assert.equal(next.id, "02e");
  for (const id of next.speciesIds) {
    assert.equal(hasCompleteKnowledgeOverlays(id), false, `${id} is queued as next but already complete`);
  }
});

test("conservation-sensitive records are recognition-only, not a targeting calendar", () => {
  const wave = SEED_WAVES.find((item) => item.id === "03");
  assert.ok(wave);
  assert.deepEqual(wave.overlays, ["identification"]);
  assert.ok(wave.speciesIds.includes("salvelinus_confluentus"));
  assert.ok(wave.speciesIds.includes("salmo_salar_anadromous"));
  assert.ok(!wave.overlays.includes("seasonal_calendar"));
  assert.ok(!wave.overlays.includes("diet"));
});

test("live coverage is computed from dossiers and does not invent fight or food", () => {
  const coverage = catalogKnowledgeCoverage();
  assert.equal(coverage.speciesTotal, 75);
  assert.equal(coverage.completeOverlays, 46);
  assert.equal(coverage.remainingOverlays, 29);
  assert.equal(coverage.byOverlay.identification, 46);
  assert.equal(coverage.byOverlay.behavior, 46);
  assert.equal(coverage.byOverlay.diet, 46);
  assert.equal(coverage.byOverlay.seasonal_calendar, 46);
  assert.equal(coverage.fightReviewed, 0);
  assert.equal(coverage.foodReviewed, 0);
  assert.equal(coverage.nextWave?.id, "02e");
});

test("Quick Read starters are species that already have the four knowledge overlays", () => {
  assert.ok(FIELD_OPENER_IDS.length >= 3);
  for (const id of FIELD_OPENER_IDS) {
    assert.equal(
      hasCompleteKnowledgeOverlays(id),
      true,
      `opener ${id} is on the home chips without reviewed ID/behavior/diet/season`,
    );
  }
});

test("seed doctrine keeps later layers deferred and refuses catch-prediction enrichment", () => {
  assert.ok(SEED_DOCTRINE.deferUntilHighUseKnowable.includes("fight"));
  assert.ok(SEED_DOCTRINE.deferUntilHighUseKnowable.includes("live_regulations"));
  assert.ok(SEED_DOCTRINE.never.some((rule) => /bite score/i.test(rule)));
  assert.equal(KNOWLEDGE_OVERLAYS.length, 4);
  assert.equal(identificationDossierFor("ictalurus_punctatus"), null);
  assert.equal(behaviorDossierFor("ictalurus_punctatus"), null);
  assert.equal(dietDossierFor("ictalurus_punctatus"), null);
  assert.equal(seasonalCalendarDossierFor("ictalurus_punctatus"), null);
});
