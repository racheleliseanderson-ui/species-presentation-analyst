#!/usr/bin/env node
/**
 * Turn each reviewed species photograph into the set of files a phone should
 * actually be offered.
 *
 * Before this script there were two files per species: a 2,200px `canonical.webp`
 * and a 900px `thumb.webp`. The page rendered the thumb into an 80–112px slot
 * and never rendered the canonical AT ALL — its only job was to be the
 * `og:image`, which meant every share card was a full-resolution wildlife
 * photograph, one of them 912 kB, sent to a scraper that wanted a 1200×630
 * card. Nearly six megabytes of licensed, provenance-tracked, visually reviewed
 * imagery, and the reader never saw a single pixel of it above thumbnail size.
 *
 * What comes out of here instead:
 *
 *   canonical.webp   ≤1600px  the largest rung, and what a desk browser gets
 *   w800.webp        800px    a phone at 2× on a full-width figure
 *   w400.webp        400px    a phone at 1×, and the small-screen default
 *   thumb.webp       256px    the index row and the page's header slot
 *   share.jpg        1200×630 the share card, in the shape a card is
 *
 * `canonical.webp` is REWRITTEN in place, from itself, once. That is a lossy
 * step over a lossy file and it is still the right call: nothing in this
 * repository is an archive — every record carries `sourcePage`, so the
 * publisher's original is always one link away — and 2,200px at quality 90 was
 * paying archival prices for a file served to a browser.
 *
 * The script is idempotent and safe to re-run: it skips a species whose
 * canonical is already at or under the ceiling, so a second run does not
 * degrade the picture a third time. Pass `--force` to rebuild the derivatives
 * anyway after changing a quality setting.
 *
 *   node scripts/build-species-images.mjs [--force]
 *
 * `sharp` is intentionally NOT a dependency of this application. The outputs
 * are committed reviewed assets, changing only when a picture is reviewed, so
 * making every install and every deploy carry a native image toolchain to
 * produce files that are already in the repository would be paying a daily cost
 * for a quarterly job. Install it for the run: `npm i --no-save sharp`.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const FORCE = process.argv.includes("--force");
const ROOT = path.join("public", "species");

/** The top rung. Past this a fish photograph stops getting better and starts getting heavier. */
const CANONICAL_MAX = 1600;
const CANONICAL_QUALITY = 78;

/** Intermediate rungs, in the widths a `sizes` attribute will actually pick. */
const RUNGS = [
  { name: "w800.webp", width: 800, quality: 78 },
  { name: "w400.webp", width: 400, quality: 78 },
];

/**
 * The header slot is 80px on a phone and 112px from `sm:` up. 256 covers both
 * at 2×. It was 900, which is eight times the pixels of the largest place it
 * has ever been drawn.
 */
const THUMB = { name: "thumb.webp", width: 256, quality: 80 };

/**
 * The share card. 1200×630 because that is the shape every scraper crops to,
 * and JPEG rather than WebP because the long tail of link unfurlers — group
 * chats, mail clients, older platforms — still handle JPEG most reliably and
 * a card nobody can render is worse than a slightly larger one.
 */
const SHARE = { name: "share.jpg", width: 1200, height: 630, quality: 80 };

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} kB`;
}

const slugs = (await readdir(ROOT, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let before = 0;
let after = 0;
const manifest = {};

for (const slug of slugs) {
  const dir = path.join(ROOT, slug);
  const canonicalPath = path.join(dir, "canonical.webp");

  let source;
  try {
    source = await readFile(canonicalPath);
  } catch {
    console.warn(`[images] ${slug}: no canonical.webp, skipped`);
    continue;
  }
  before += source.byteLength;

  const meta = await sharp(source).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`${slug}: canonical.webp has no readable dimensions`);
  }

  /*
   * Re-encode the canonical, and keep the result only if it is a REAL saving.
   *
   * The obvious guard — "only touch files over the pixel ceiling" — turned out
   * to be the wrong test. Several of these were already under 1600px and still
   * enormous, because they were written at quality 90: a 1,410px alligator gar
   * was 352 kB. Size on a phone is bytes, not pixels.
   *
   * So the test is the saving itself, with a floor. A file that is already
   * within 15% of what this encoder would produce is left exactly as it is,
   * which is what makes re-running this safe: the second run finds nothing
   * worth 15% and writes nothing, so the picture never quietly loses a
   * generation of detail to a script somebody ran twice.
   */
  const rebuilt = await sharp(source)
    .resize({
      width: CANONICAL_MAX,
      height: CANONICAL_MAX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: CANONICAL_QUALITY, effort: 6 })
    .toBuffer();
  const saving = 1 - rebuilt.byteLength / source.byteLength;
  if (saving >= 0.15 || (FORCE && rebuilt.byteLength < source.byteLength)) {
    await writeFile(canonicalPath, rebuilt);
    console.log(
      `[images] ${slug.padEnd(30)} canonical ${kb(source.byteLength)} -> ${kb(rebuilt.byteLength)}`,
    );
    source = rebuilt;
  }

  const canonicalMeta = await sharp(source).metadata();
  const intrinsic = { width: canonicalMeta.width, height: canonicalMeta.height };

  for (const rung of [...RUNGS, THUMB]) {
    /* Never upscale: a rung wider than the master would be a bigger file
     * carrying no more picture, and `srcset` would happily choose it. */
    if (rung.width >= intrinsic.width && rung.name !== THUMB.name) continue;
    const out = await sharp(source)
      .resize({ width: rung.width, withoutEnlargement: true })
      .webp({ quality: rung.quality, effort: 6 })
      .toBuffer();
    await writeFile(path.join(dir, rung.name), out);
  }

  /* The card is a CROP, not a fit. A letterboxed card reads as a mistake in
   * every feed that renders it. `attention` keeps the fish rather than the
   * geometric centre, which on an underwater photograph is often water. */
  const card = await sharp(source)
    .resize({
      width: SHARE.width,
      height: SHARE.height,
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .jpeg({ quality: SHARE.quality, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(dir, SHARE.name), card);

  const widths = [];
  for (const rung of RUNGS) {
    try {
      await stat(path.join(dir, rung.name));
      widths.push(rung.width);
    } catch {
      /* rung skipped as an upscale */
    }
  }
  widths.push(intrinsic.width);
  widths.sort((a, b) => a - b);

  manifest[slug] = { intrinsic, widths };

  let slugBytes = 0;
  for (const name of ["canonical.webp", "w800.webp", "w400.webp", "thumb.webp", "share.jpg"]) {
    try {
      slugBytes += (await stat(path.join(dir, name))).size;
    } catch {
      /* not produced */
    }
  }
  after += slugBytes;
  console.log(`[images] ${slug.padEnd(30)} ${intrinsic.width}×${intrinsic.height}  ${kb(slugBytes)}`);
}

const generated = `/* GENERATED by scripts/build-species-images.mjs — do not edit by hand. */

/**
 * The candidate ladder for each reviewed photograph, and the real pixel size of
 * the largest rung.
 *
 * The intrinsic size is here so every \`<img>\` can declare width and height and
 * reserve its own space. Without it, a species page reflowed the moment the
 * photograph arrived — which on a phone on a bad connection is the moment
 * somebody is already reading.
 */
export type SpeciesImageLadder = {
  /** Real pixel dimensions of \`canonical.webp\`. */
  intrinsic: { width: number; height: number };
  /** Every width available as a \`srcset\` candidate, ascending. */
  widths: number[];
};

export const SPECIES_IMAGE_LADDERS: Record<string, SpeciesImageLadder> = ${JSON.stringify(manifest, null, 2)};
`;
await writeFile(path.join("src", "lib", "knowledge", "species-image-ladders.ts"), generated);

console.log(
  `\n[images] ${slugs.length} species — canonical masters ${kb(before)} -> whole set ${kb(after)}`,
);
