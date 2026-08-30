import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { SPECIES, SPECIES_BY_ID } from "./species-catalog.ts";
import { identificationDossierFor } from "./dossier-catalog.ts";
import {
  ENRICHMENT_QUEUE_VERSION,
  ENRICHMENT_WAVES,
  FOLLOW_ON_OVERLAY_LAYERS,
  PRIMARY_OVERLAY_LAYERS,
  queuedSpeciesIds,
  researchAssignmentFor,
  shippedSpeciesIds,
  WAVE_01_GROUPS,
} from "./enrichment-queue.ts";

test("AFP-Q-1.0 is an overlay queue, not a new AFP contract or presentation axis", () => {
  assert.equal(ENRICHMENT_QUEUE_VERSION, "AFP-Q-1.0");
  assert.equal(ENRICHMENT_WAVES[0]?.id, "wave_01");
  assert.equal(ENRICHMENT_WAVES[0]?.status, "shipped");
  assert.ok(ENRICHMENT_WAVES.slice(1).every((wave) => wave.status === "queued"));
});

test("every catalog species belongs to exactly one enrichment wave and one distinction group", () => {
  const assigned = ENRICHMENT_WAVES.flatMap((wave) => wave.speciesIds);
  assert.equal(assigned.length, 75);
  assert.equal(new Set(assigned).size, 75);
  assert.deepEqual(new Set(assigned), new Set(SPECIES.map((species) => species.id)));

  for (const wave of ENRICHMENT_WAVES) {
    const grouped = wave.groups.flatMap((group) => group.speciesIds);
    assert.equal(new Set(grouped).size, grouped.length, `${wave.id} repeats a group member`);
    for (const id of grouped) {
      assert.ok(wave.speciesIds.includes(id), `${id} is grouped in ${wave.id} but missing from speciesIds`);
    }
    for (const id of wave.speciesIds) {
      const hits = wave.groups.filter((group) => group.speciesIds.includes(id));
      assert.equal(hits.length, 1, `${id} in ${wave.id} must belong to exactly one group`);
      assert.ok(SPECIES_BY_ID[id], `queue points at missing catalog species ${id}`);
    }
    for (const group of wave.groups) {
      assert.ok(group.mustNotCopy.length > 0, `${wave.id}:${group.id} needs a do-not-copy contract`);
      for (const covered of group.alreadyCoveredIds ?? []) {
        assert.ok(SPECIES_BY_ID[covered], `${group.id} alreadyCovered ${covered} is not a catalog species`);
        assert.ok(!group.speciesIds.includes(covered), `${group.id} lists ${covered} as both a member and already covered`);
      }
    }
  }
});

test("wave 01 is the shipped lookalike set and matches identification coverage", () => {
  const shipped = shippedSpeciesIds();
  assert.equal(shipped.length, 26);
  for (const id of shipped) {
    assert.ok(identificationDossierFor(id), `${id} is shipped without an identification dossier`);
  }
  assert.equal(WAVE_01_GROUPS.filter((group) => group.speciesIds.length > 1).length, 9);
});

test("queued waves do not invent overlay dossiers", () => {
  const queued = queuedSpeciesIds();
  assert.equal(queued.length, 49);
  for (const id of queued) {
    assert.equal(identificationDossierFor(id), null, `${id} is queued but already has an identification dossier`);
    const assignment = researchAssignmentFor(id);
    assert.ok(assignment);
    assert.equal(assignment.wave.status, "queued");
    assert.deepEqual(assignment.wave.requiredLayers, PRIMARY_OVERLAY_LAYERS);
    assert.deepEqual(assignment.wave.followOnLayers, FOLLOW_ON_OVERLAY_LAYERS);
  }
});

test("wave 02 keeps the open-first lookalikes that still lack dossiers", () => {
  const wave = ENRICHMENT_WAVES.find((item) => item.id === "wave_02");
  assert.ok(wave);
  assert.ok(wave.speciesIds.includes("salmo_trutta"));
  assert.ok(wave.speciesIds.includes("oncorhynchus_mykiss_steelhead"));
  assert.ok(wave.speciesIds.includes("sander_vitreus"));
  assert.ok(wave.speciesIds.includes("esox_lucius"));
  const steelhead = researchAssignmentFor("oncorhynchus_mykiss_steelhead");
  assert.ok(steelhead?.group.alreadyCoveredIds?.includes("oncorhynchus_mykiss"));
  const brown = researchAssignmentFor("salmo_trutta");
  assert.ok(brown?.group.mustNotCopy.some((item) => /rainbow leaping/i.test(item)));
});

test("the enrichment queue is not imported by the presentation engine", () => {
  const engineDir = new URL("../engine/", import.meta.url);
  const files = [
    "infer.ts",
    "presentation-weighting.ts",
    "population-context.ts",
    "species-weight-overrides.ts",
  ];
  for (const file of files) {
    const source = readFileSync(new URL(file, engineDir), "utf8");
    assert.doesNotMatch(source, /enrichment-queue/);
  }
});
