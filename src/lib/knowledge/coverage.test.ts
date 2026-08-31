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
  assert.equal(next.id, "04");
  for (const id of next.speciesIds) {
    assert.equal(hasCompleteKnowledgeOverlays(id), false, `${id} is queued as next but already complete`);
  }
});

test("conservation-sensitive records are recognition-only, not a targeting calendar", () => {
  const wave = SEED_WAVES.find((item) => item.id === "03");
  assert.ok(wave);
  assert.equal(wave.status, "landed");
  assert.deepEqual(wave.overlays, ["identification"]);
  assert.ok(wave.speciesIds.includes("salvelinus_confluentus"));
  assert.ok(wave.speciesIds.includes("salmo_salar_anadromous"));
  assert.ok(!wave.overlays.includes("seasonal_calendar"));
  assert.ok(!wave.overlays.includes("diet"));
  assert.ok(!wave.overlays.includes("behavior"));
  for (const id of wave.speciesIds) {
    assert.ok(identificationDossierFor(id), `${id} missing identification`);
    assert.equal(behaviorDossierFor(id), null, `${id} must not have a behavior overlay`);
    assert.equal(dietDossierFor(id), null, `${id} must not have a diet overlay`);
    assert.equal(seasonalCalendarDossierFor(id), null, `${id} must not have a seasonal calendar`);
    const identification = identificationDossierFor(id);
    assert.ok(identification);
    assert.doesNotMatch(JSON.stringify(identification), /presentationImplication/);
    assert.equal(hasCompleteKnowledgeOverlays(id), false);
  }
});

test("live coverage is computed from dossiers and does not invent fight or food", () => {
  const coverage = catalogKnowledgeCoverage();
  assert.equal(coverage.speciesTotal, 75);
  assert.equal(coverage.completeOverlays, 61);
  assert.equal(coverage.remainingOverlays, 14);
  assert.equal(coverage.byOverlay.identification, 63);
  assert.equal(coverage.byOverlay.behavior, 61);
  assert.equal(coverage.byOverlay.diet, 61);
  assert.equal(coverage.byOverlay.seasonal_calendar, 61);
  assert.equal(coverage.fightReviewed, 0);
  assert.equal(coverage.foodReviewed, 0);
  assert.equal(coverage.nextWave?.id, "04");
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
  assert.ok(identificationDossierFor("salvelinus_confluentus"));
  assert.equal(behaviorDossierFor("salvelinus_confluentus"), null);
  assert.equal(dietDossierFor("salvelinus_confluentus"), null);
  assert.equal(seasonalCalendarDossierFor("salvelinus_confluentus"), null);
  assert.equal(identificationDossierFor("aplodinotus_grunniens"), null);
  assert.equal(behaviorDossierFor("aplodinotus_grunniens"), null);
  assert.equal(dietDossierFor("aplodinotus_grunniens"), null);
  assert.equal(seasonalCalendarDossierFor("aplodinotus_grunniens"), null);
});
