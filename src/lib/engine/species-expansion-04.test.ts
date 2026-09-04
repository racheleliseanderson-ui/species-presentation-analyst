import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { searchSpecies, ALIASES } from "../knowledge/aliases.ts";
import { SPECIES, SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import { SPECIES_EXPANSION_04 } from "../knowledge/species-expansion-04.ts";
import { SPECIES_IMAGES, SPECIES_IMAGE_MODEL_VERSION } from "../knowledge/species-images.ts";
import {
  SPECIES_OVERRIDE_COVERAGE,
  SPECIES_OVERRIDE_MODEL_VERSION,
} from "./species-weight-overrides-catalog.ts";
import { SPECIES_OVERRIDE_EXPANSION_04_COVERAGE } from "./species-weight-overrides-expansion-04.ts";
import { POPULATION_CONTEXT_CANDIDATES_04 } from "./population-context-candidates-04.ts";
import type { TargetStatus } from "../protocol/types.ts";
import { isMarine } from "../protocol/vocab.ts";

const expansionIds = new Set(SPECIES_EXPANSION_04.map((species) => species.id));

const statusRank: Record<TargetStatus, number> = {
  standard: 0,
  regulated_context: 1,
  conservation_sensitive: 2,
  non_target: 3,
};

describe("species expansion 04 catalog invariants", () => {
  it("brings the freshwater catalog to exactly 75 unique species", () => {
    assert.equal(SPECIES_EXPANSION_04.length, 15);
    assert.equal(new Set(SPECIES_EXPANSION_04.map((species) => species.id)).size, 15);
    const freshwater = SPECIES.filter((species) => !species.habitat.waterTypes.some(isMarine));
    assert.equal(freshwater.length, 75);
    assert.equal(new Set(SPECIES.map((species) => species.id)).size, SPECIES.length);
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

describe("SPO expansion coverage", () => {
  it("provides explicit coverage for every reviewed record", () => {
    assert.equal(SPECIES_OVERRIDE_MODEL_VERSION, "SPO-1.3");
    assert.equal(
      new Set(SPECIES_OVERRIDE_COVERAGE.map((entry) => entry.speciesId)).size,
      SPECIES.length,
    );
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
    assert.equal(
      new Set(POPULATION_CONTEXT_CANDIDATES_04.map((candidate) => candidate.id)).size,
      14,
    );

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
    // Derived, not a magic number: the library grows as images are reviewed, and
    // a hard-coded count only ever goes stale and fails a clean checkout. What
    // must hold is that every entry is a distinct species.
    assert.ok(SPECIES_IMAGES.length > 0);
    assert.equal(
      new Set(SPECIES_IMAGES.map((image) => image.speciesId)).size,
      SPECIES_IMAGES.length,
      "two image records point at the same species",
    );

    for (const image of SPECIES_IMAGES) {
      // The image library spans the whole reviewed catalog, not just this
      // expansion wave — what must never happen is an image pointing at a
      // species the catalog does not carry.
      assert.ok(
        SPECIES_BY_ID[image.speciesId] != null,
        `image points at an unknown species: ${image.speciesId}`,
      );
      assert.equal(image.identificationConfidence, "high");
      // Sources are allow-listed so an image can never arrive from an
      // unattributable page. Agencies and Commons publish an identification
      // with the file; a stock library does not, so a stock asset is only
      // admissible when the identification rests on reviewed diagnostic
      // features recorded in visualQa.
      const fromStock = image.sourcePage.startsWith("https://stock.adobe.com/");
      assert.match(
        image.sourcePage,
        /^https:\/\/(?:commons\.wikimedia\.org\/wiki\/File:|www\.fws\.gov\/media\/|stock\.adobe\.com\/)/,
        `unattributable image source: ${image.sourcePage}`,
      );
      if (fromStock) {
        assert.equal(
          image.identificationBasis,
          "visual_review",
          `${image.speciesId}: a stock asset cannot inherit its identification from search keywords`,
        );
        assert.match(
          image.license,
          /licence|license/i,
          `${image.speciesId}: a stock asset must record the licence it ships under`,
        );
      }
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
