import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const manifestPath = process.argv[2] ?? "scripts/species-image-imports-04.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const commonsRedirect = (file) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;

const minBytes = 20_000;
const interRequestDelayMs = 1_500;

for (const [index, image] of manifest.entries()) {
  const dir = path.join("public", "species", image.slug);
  const temp = path.join(dir, "source-download");
  const canonical = path.join(dir, "canonical.webp");
  const thumb = path.join(dir, "thumb.webp");
  await mkdir(dir, { recursive: true });

  if (index > 0) await sleep(interRequestDelayMs);
  const sourceUrl = image.downloadUrl ?? commonsRedirect(image.commonsFile);
  if (!sourceUrl) {
    throw new Error(`${image.speciesId}: reviewed source URL is missing`);
  }
  const response = await fetchWithRetry(sourceUrl, image.speciesId);
  const bytes = Buffer.from(await response.arrayBuffer());

  if (bytes.byteLength < minBytes) {
    throw new Error(`${image.speciesId}: source image is unexpectedly small (${bytes.byteLength} bytes)`);
  }

  await writeFile(temp, bytes);

  const metadata = await sharp(temp).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`${image.speciesId}: source image dimensions could not be read`);
  }

  await sharp(temp)
    .rotate()
    .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, effort: 5 })
    .toFile(canonical);

  await sharp(temp)
    .rotate()
    .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86, effort: 5 })
    .toFile(thumb);

  const canonicalSize = (await stat(canonical)).size;
  const thumbSize = (await stat(thumb)).size;
  if (canonicalSize < 5_000 || thumbSize < 3_000) {
    throw new Error(`${image.speciesId}: optimized output is unexpectedly small`);
  }

  await rm(temp, { force: true });
  console.log(
    `${image.speciesId}: ${metadata.width}x${metadata.height} -> canonical ${canonicalSize} bytes; thumb ${thumbSize} bytes`,
  );
}

async function fetchWithRetry(url, speciesId) {
  const delays = [0, 2_500, 5_000, 10_000];
  let lastStatus = 0;

  for (const delay of delays) {
    if (delay) await sleep(delay);
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "HookTheHorizon-SpeciesImageImporter/1.0 (+https://species.hookthehorizon.blog)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (response.ok) return response;
    lastStatus = response.status;
    if (![429, 500, 502, 503, 504].includes(response.status)) break;
    console.warn(`${speciesId}: HTTP ${response.status}; retrying reviewed source`);
  }

  throw new Error(`${speciesId}: image download failed with HTTP ${lastStatus}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
