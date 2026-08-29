import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { searchSpecies, ALIASES } from "../knowledge/aliases.ts";
import { SPECIES, SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import { SPECIES_EXPANSION_04 } from "../knowledge/species-expansion-04.ts";
import {
  SPECIES_IMAGES,
  SPECIES_IMAGE_MODEL_VERSION,
} from "../knowledge/species-images.ts";
import {
  SPECIES_OVERRIDE_COVERAGE,
  SPECIES_OVERRIDE_MODEL_VERSION,
} from "./species-weight-overrides-catalog.ts";
import { SPECIES_OVERRIDE_EXPANSION_04_COVERAGE } from "./species-weight-overrides-expansion-04.ts";
import { POPULATION_CONTEXT_CANDIDATES_04 } from "./population-context-candidates-04.ts";
import type { TargetStatus } from "../protocol/types.ts";

const expansionIds = new Set(SPECIES_EXPANSION_04.map((species) => species.id));

const statusRank: Record<TargetStatus, number> = {
  standard: 0,
  regulated_context: 1,
  conservation_sensitive: 2,
  non_target: 3,
};

describe("species expansion 04 catalog invariants", () => {
  it("brings the reviewed catalog to exactly 75 unique species", () => {
    assert.equal(SPECIES_EXPANSION_04.length, 15);
    assert.equal(new Set(SPECIES_EXPANSION_04.map((species) => species.id)).size, 15);
    assert.equal(SPECIES.length, 75);
    assert.equal(new Set(SPECIES.map((species) => species.id)).size, 75);
    for (const species of SPECIES_EXPANSION_04) {
      const catalogRecord = SPECIES_BY_ID[species.id];
      assert.ok(catalogRecord, `catalog is missing ${species.id}`);
      assert.equal(catalogRecord.id, species.id);
      assert.equal(catalogRecord.scientificName, species.scientificName);
      assert.ok(species.sources.length > 0, `${species.id} is missing biology sources`);
      assert.ok(species.exceptions.length > 0, `${species.id} is missing invalidators/exceptions`);
    }
  });

  it("separates anadromous sockeye from kokanee aliases", () => {
    assert.ok(!(ALIASES.oncorhynchus_nerka_kokanee ?? []).includes("sockeye"));
    const matches = searchSpecies("sockeye").map((species) => species.id);
    assert.ok(matches.includes("oncorhynchus_nerka_anadromous"));
    assert.ok(!matches.includes("oncorhynchus_nerka_kokanee"));
  });
});

describe("SPO-1.2 expansion coverage", () => {
  it("provides explicit coverage for every one of the 75 reviewed records", () => {
    assert.equal(SPECIES_OVERRIDE_MODEL_VERSION, "SPO-1.2");
    assert.equal(new Set(SPECIES_OVERRIDE_COVERAGE.map((entry) => entry.speciesId)).size, 75);
    for (const species of SPECIES) {
      assert.ok(
        SPECIES_OVERRIDE_COVERAGE.some((entry) => entry.speciesId === species.id),
        `missing SPO coverage for ${species.id}`,
      );
    }
  });

  it("marks all 15 new records as reviewed weighted coverage", () => {
    assert.equal(SPECIES_OVERRIDE_EXPANSION_04_COVERAGE.length, 15);
    for (const coverage of SPECIES_OVERRIDE_EXPANSION_04_COVERAGE) {
      assert.ok(expansionIds.has(coverage.speciesId));
      assert.equal(coverage.mode, "weighted");
    }
  });
});

describe("RPC candidate safety", () => {
  it("keeps expansion candidates reviewed but inactive and monotonic toward restriction", () => {
    assert.equal(POPULATION_CONTEXT_CANDIDATES_04.length, 14);
    assert.equal(new Set(POPULATION_CONTEXT_CANDIDATES_04.map((candidate) => candidate.id)).size, 14);

    for (const candidate of POPULATION_CONTEXT_CANDIDATES_04) {
      const species = SPECIES_BY_ID[candidate.speciesId];
      assert.ok(species, `RPC candidate has unknown species ${candidate.speciesId}`);
      assert.equal(candidate.state, "reviewed_candidate");
      for (const waterType of candidate.waterTypes) {
        assert.ok(
          species.habitat.waterTypes.includes(waterType),
          `${candidate.id} uses unsupported water type ${waterType}`,
        );
      }
      if (candidate.targetStatusEscalation) {
        const base = species.targetStatus ?? "standard";
        assert.ok(
          statusRank[candidate.targetStatusEscalation] >= statusRank[base],
          `${candidate.id} would relax target status from ${base}`,
        );
      }
    }
  });
});

describe("IMG-1.0 canonical image library", () => {
  it("registers exactly one reviewed canonical image for every new species", () => {
    assert.equal(SPECIES_IMAGE_MODEL_VERSION, "IMG-1.0");
    assert.equal(SPECIES_IMAGES.length, 15);
    assert.equal(new Set(SPECIES_IMAGES.map((image) => image.speciesId)).size, 15);

    for (const image of SPECIES_IMAGES) {
      assert.ok(expansionIds.has(image.speciesId), `image points outside expansion: ${image.speciesId}`);
      assert.equal(image.identificationConfidence, "high");
      assert.match(
        image.sourcePage,
        /^https:\/\/(?:commons\.wikimedia\.org\/wiki\/File:|www\.fws\.gov\/media\/)/,
      );
      assert.ok(image.license.length > 8);
      assert.ok(image.visualQa.length > 30);
      assert.ok(image.canonical.endsWith("/canonical.webp"));
      assert.ok(image.thumb.endsWith("/thumb.webp"));
    }
  });

  it("stores the optimized canonical and thumbnail files inside public/species", () => {
    for (const image of SPECIES_IMAGES) {
      for (const publicPath of [image.canonical, image.thumb]) {
        const filePath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
        assert.ok(existsSync(filePath), `missing repository image asset ${publicPath}`);
      }
    }
  });
});
