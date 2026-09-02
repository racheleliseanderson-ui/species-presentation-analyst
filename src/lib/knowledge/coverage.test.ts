import assert from "node:assert/strict";
import test from "node:test";

import { SPECIES } from "./species-catalog.ts";
import {
  authoredOverlays,
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
import { identificationDossierFor } from "./dossier-catalog.ts";

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

  // Every wave has landed, so there is no "next". The invariant that still
  // has to hold is the honest one: a wave is only marked landed when its
  // species really do carry the overlays it claims, which the loop above
  // checks for all of them.
  const next = nextSeedWave();
  if (next) {
    for (const id of next.speciesIds) {
      assert.equal(hasCompleteKnowledgeOverlays(id), false, `${id} is queued as next but already complete`);
    }
  }
  for (const species of SPECIES) {
    assert.ok(seedWaveForSpecies(species.id)?.status === "landed" || !hasCompleteKnowledgeOverlays(species.id));
  }
});

test("conservation-sensitive records carry biology but never a targeting calendar", () => {
  const wave = SEED_WAVES.find((item) => item.id === "03");
  assert.ok(wave);
  assert.ok(wave.speciesIds.includes("salvelinus_confluentus"));
  assert.ok(wave.speciesIds.includes("salmo_salar_anadromous"));
  assert.ok(wave.speciesIds.includes("megalops_atlanticus"));

  // The rule that matters is not "identification only" — withholding what a
  // fish is and what it does helps nobody, and the identification overlay is
  // exactly what stops someone killing a bull trout by mistake. The rule is
  // that nothing in these records tells anyone how to present to them.
  for (const species of SPECIES) {
    if (species.targetStatus !== "conservation_sensitive" && species.targetStatus !== "non_target") {
      continue;
    }
    const calendar = authoredOverlays(species.id).seasonalCalendar;
    for (const entry of calendar?.entries ?? []) {
      assert.equal(
        entry.presentationImplication,
        undefined,
        `${species.id} ${entry.season} carries presentation guidance`,
      );
    }
  }
});

test("live coverage is computed from dossiers and does not invent fight or food", () => {
  const coverage = catalogKnowledgeCoverage();
  assert.equal(coverage.speciesTotal, SPECIES.length);
  // Counted, not pinned: research lands and the number moves. What must stay
  // true is that coverage is derived from the records rather than declared.
  assert.equal(coverage.completeOverlays + coverage.remainingOverlays, SPECIES.length);
  for (const overlay of KNOWLEDGE_OVERLAYS) {
    assert.equal(coverage.byOverlay[overlay], coverage.completeOverlays);
  }
  assert.equal(coverage.completeOverlays, SPECIES.length, "every species should now carry all four");
  assert.equal(coverage.fightReviewed, 0);
  assert.equal(coverage.foodReviewed, 0);
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
  // Mountain whitefish is authored in `data/dossiers/`, not in the older
  // in-bundle TypeScript, so the TypeScript catalog does not know it. That is
  // the migration working as intended: JSON is the source of record.
  assert.equal(identificationDossierFor("prosopium_williamsoni"), null);
  assert.ok(authoredOverlays("prosopium_williamsoni").identification);
});
