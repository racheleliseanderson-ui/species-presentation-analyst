import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { SPECIES_IMAGES } from "./knowledge/species-images.ts";
import { SPECIES_IMAGE_LADDERS } from "./knowledge/species-image-ladders.ts";

/**
 * The picture layer, checked against the files that actually deploy.
 *
 * Every claim here was untrue on 2026-09-04. There was no candidate ladder, so
 * a phone was offered whatever single file existed. There were no intrinsic
 * dimensions anywhere, so every `<img>` on the site reflowed its column on
 * arrival. And `og:image` pointed at the full reviewed photograph — the largest
 * of them 912 kB at 5184x3888 — while the head declared it 1200x630, which was
 * a measurement of a different file entirely.
 *
 * These are filesystem assertions on purpose. A ladder that typechecks and does
 * not exist on disk is a broken picture in production and a green test suite.
 */

const ROOT = process.cwd();
const abs = (publicPath: string) => join(ROOT, "public", publicPath.replace(/^\//, ""));
const slugOf = (canonical: string) => canonical.split("/")[2] ?? "";

/** Real pixel size of a JPEG, read out of its own SOF marker. */
function jpegSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  assert.equal(buf[0], 0xff, `${file} is not a JPEG`);
  assert.equal(buf[1], 0xd8, `${file} is not a JPEG`);
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1]!;
    // SOF0..SOF15, excluding the DHT/JPG/DAC markers that share the range.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error(`${file}: no SOF marker`);
}

describe("every reviewed photograph ships as a candidate ladder", () => {
  it("has a ladder entry for each reviewed image", () => {
    for (const image of SPECIES_IMAGES) {
      const slug = slugOf(image.canonical);
      assert.ok(
        SPECIES_IMAGE_LADDERS[slug],
        `${slug} has a reviewed image and no generated ladder — run scripts/build-species-images.mjs`,
      );
    }
  });

  it("has every rung it advertises on disk", () => {
    for (const image of SPECIES_IMAGES) {
      const slug = slugOf(image.canonical);
      const ladder = SPECIES_IMAGE_LADDERS[slug]!;
      const dir = `/species/${slug}`;
      for (const width of ladder.widths) {
        const file =
          width === ladder.intrinsic.width ? `${dir}/canonical.webp` : `${dir}/w${width}.webp`;
        assert.ok(existsSync(abs(file)), `${file} is a srcset candidate that does not exist`);
      }
    }
  });

  it("advertises the largest rung as the canonical's real width", () => {
    for (const slug of Object.keys(SPECIES_IMAGE_LADDERS)) {
      const ladder = SPECIES_IMAGE_LADDERS[slug]!;
      assert.equal(
        Math.max(...ladder.widths),
        ladder.intrinsic.width,
        `${slug}: srcset would let a browser pick a rung wider than the picture`,
      );
    }
  });

  it("never offers a phone more than about a hundred kilobytes", () => {
    /*
     * The smallest rung is what a 390px screen at 1x asks for, and it is the
     * only number in this file that a person on a bank actually feels.
     */
    for (const slug of Object.keys(SPECIES_IMAGE_LADDERS)) {
      const smallest = Math.min(...SPECIES_IMAGE_LADDERS[slug]!.widths);
      const file = abs(`/species/${slug}/w${smallest}.webp`);
      if (!existsSync(file)) continue;
      const bytes = statSync(file).size;
      assert.ok(bytes < 100_000, `${slug}: the smallest rung is ${Math.round(bytes / 1024)} kB`);
    }
  });
});

describe("the share card is a card", () => {
  it("exists for every reviewed photograph", () => {
    for (const image of SPECIES_IMAGES) {
      const card = image.canonical.replace(/canonical\.webp$/, "share.jpg");
      assert.ok(existsSync(abs(card)), `${card} is the declared og:image and does not exist`);
    }
  });

  it("is exactly the size the head says it is", () => {
    /*
     * The head declares 1200x630 for every species. It is allowed to declare it
     * because the card is generated at that size — but a declaration that stops
     * matching the file is worse than no declaration, and nothing else in the
     * pipeline would notice.
     */
    for (const image of SPECIES_IMAGES) {
      const card = abs(image.canonical.replace(/canonical\.webp$/, "share.jpg"));
      if (!existsSync(card)) continue;
      assert.deepEqual(jpegSize(card), { width: 1200, height: 630 }, `${card} is not 1200x630`);
    }
  });

  it("stays inside what a link unfurler will fetch", () => {
    /* Several scrapers give up past a megabyte, and the one this replaced was
     * 912 kB before it was even cropped. */
    for (const image of SPECIES_IMAGES) {
      const card = abs(image.canonical.replace(/canonical\.webp$/, "share.jpg"));
      if (!existsSync(card)) continue;
      assert.ok(statSync(card).size < 600_000, `${card} is too heavy to unfurl reliably`);
    }
  });
});

describe("the picture is on the page", () => {
  it("renders the reviewed photograph in the species document", () => {
    /*
     * The regression this guards is not a crash. Nineteen reviewed
     * photographs existed for weeks and the species page rendered none of
     * them — the only symptom was an absence, which no test can see unless a
     * test is looking for it.
     */
    const view = readFileSync(join(ROOT, "src/components/species/species-page-view.tsx"), "utf8");
    assert.match(view, /<SpeciesPhotograph/);
    const figure = readFileSync(
      join(ROOT, "src/components/species/species-photograph.tsx"),
      "utf8",
    );
    assert.match(figure, /srcSet/, "the figure is not offering a candidate ladder");
    assert.match(figure, /width=\{ladder\?\.intrinsic\.width\}/, "the figure reserves no space");
    assert.match(figure, /image\.visualQa/, "the picture is published without its caveat");
  });
});
