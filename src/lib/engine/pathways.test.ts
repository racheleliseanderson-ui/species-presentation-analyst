import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

/**
 * The three pathways name the work, not the reader.
 *
 * They were "Beginner", "Competent" and "Advanced". A rank sorts people, and
 * this one sorted them wrongly in both directions: somebody who has fished for
 * thirty years still wants the one-screen answer standing in a river, and a
 * beginner at a kitchen table on a wet Sunday is entitled to the whole
 * weighting trace. Asking how much of the chain you want to work is a question
 * about this afternoon; asking how good you are gets a defensive answer.
 *
 * The stored ids keep their old spelling on purpose so nobody loses a setting
 * they already chose, which is why this reads the labels rather than the keys.
 */

const src = fs.readFileSync(
  path.join(import.meta.dirname, "..", "..", "routes", "index.tsx"),
  "utf8",
);

const block = src.match(/const PATHS[^=]*=\s*\[([\s\S]*?)\n\];/);

describe("the pathway chooser", () => {
  it("is parsed from the real source", () => {
    assert.ok(block, "could not find PATHS in src/routes/index.tsx");
  });

  it("offers exactly three, each with a description worth reading", () => {
    const entries = [
      ...block![1]!.matchAll(/label:\s*"([^"]+)",\s*\n\s*description:\s*\n?\s*"([^"]+)"/g),
    ];
    assert.equal(entries.length, 3, `parsed ${entries.length} pathways — the parser is stale`);
    for (const [, label, description] of entries) {
      assert.ok(label!.length >= 8, `"${label}" says too little`);
      assert.ok(description!.length > 60, `"${label}" has no description worth reading`);
    }
  });

  it("ranks nobody", () => {
    const labels = [...block![1]!.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]!);
    for (const label of labels) {
      assert.ok(
        !/beginner|novice|competent|advanced|expert|pro\b|intermediate/i.test(label),
        `pathway "${label}" is a rank, and a rank sorts people`,
      );
    }
  });

  it("still asks about the chain rather than about the person", () => {
    assert.match(src, /Choose how much of the chain you want to work/);
    assert.doesNotMatch(src, /aria-label="Experience pathway"/);
  });
});
