import { readFile, writeFile } from "node:fs/promises";

await upgradeImageManifest();
await upgradeImageRegistry();
await normalizeInferTests();
await constrainLegacyYellowPerchOverride();

async function upgradeImageManifest() {
  const file = "scripts/species-image-imports-04.json";
  const manifest = JSON.parse(await readFile(file, "utf8"));

  const updates = {
    oncorhynchus_nerka_anadromous: {
      downloadUrl: "https://www.fws.gov/sites/default/files/images/2024-03-6/30592.jpg",
      sourcePage: "https://www.fws.gov/media/sockeye-salmon-68",
      sourceOrg: "U.S. Fish and Wildlife Service",
      creator: "Ryan Hagerty / USFWS",
      license: "Public Domain — U.S. federal government work",
      imageType: "photograph",
      identificationConfidence: "high",
      visualQa: "USFWS species-labeled underwater photograph of migrating sockeye salmon. Adult body, caudal profile and salmon morphology are visible in natural river habitat; the image is identity/context evidence, not a location or run-strength recommendation.",
    },
    oncorhynchus_keta: {
      downloadUrl: "https://www.fws.gov/sites/default/files/2021-07/chum-salmon-ryan-hagerty-usfws.jpg",
      sourcePage: "https://www.fws.gov/media/chum-salmon",
      sourceOrg: "U.S. Fish and Wildlife Service",
      creator: "Ryan Hagerty / USFWS",
      license: "Public Domain — U.S. federal government work",
      imageType: "photograph",
      identificationConfidence: "high",
      visualQa: "USFWS species-labeled underwater chum salmon photograph. The characteristic adult freshwater body pattern and full lateral form are visible in natural habitat; background fish do not change the identity assignment.",
    },
  };

  for (const record of manifest) {
    const update = updates[record.speciesId];
    if (update) Object.assign(record, update);
  }

  await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function upgradeImageRegistry() {
  const file = "src/lib/knowledge/species-images.ts";
  let source = await readFile(file, "utf8");

  source = source
    .replace(
      'sourcePage: "https://commons.wikimedia.org/wiki/File:Oncorhynchus_nerka.jpg",',
      'sourcePage: "https://www.fws.gov/media/sockeye-salmon-68",',
    )
    .replace('creator: "Timothy Knepp / USFWS",', 'creator: "Ryan Hagerty / USFWS",')
    .replace(
      'imageType: "scientific_illustration",\n    identificationConfidence: "high",\n    visualQa: "Featured full-lateral identity image; body and fin morphology unobstructed. Coloration is not a population or run-timing assertion.",',
      'imageType: "photograph",\n    identificationConfidence: "high",\n    visualQa: "USFWS species-labeled underwater photograph of migrating sockeye salmon. Adult body and salmon morphology are visible in natural river habitat; the image is identity/context evidence, not a location or run-strength recommendation.",',
    )
    .replace(
      'sourcePage: "https://commons.wikimedia.org/wiki/File:Salmon_chum_fish_oncorhynchus_keta.jpg",',
      'sourcePage: "https://www.fws.gov/media/chum-salmon",',
    )
    .replace('creator: "Timothy Knepp / USFWS",', 'creator: "Ryan Hagerty / USFWS",')
    .replace(
      'imageType: "scientific_illustration",\n    identificationConfidence: "high",\n    visualQa: "Clean full-lateral chum illustration. A conflicting Commons file whose description identified coho was explicitly rejected.",',
      'imageType: "photograph",\n    identificationConfidence: "high",\n    visualQa: "USFWS species-labeled underwater chum salmon photograph. The characteristic adult freshwater body pattern and lateral form are visible in natural habitat.",',
    );

  await writeFile(file, source);
}

async function normalizeInferTests() {
  const file = "src/lib/engine/infer.test.ts";
  let source = await readFile(file, "utf8");
  source = source.replaceAll("SPO-1.1", "SPO-1.2");
  source = source.replace(
    "assert.equal(new Set(coverageIds).size, 60);",
    "assert.equal(new Set(coverageIds).size, 75);",
  );
  await writeFile(file, source);
}

async function constrainLegacyYellowPerchOverride() {
  const file = "src/lib/engine/species-weight-overrides.ts";
  let source = await readFile(file, "utf8");
  const before = "bias: { vertical_jig: 10, bottom_contact: 7, live_natural_bait_suspension: 6, slow_drag: 4 },";
  const after = "bias: { vertical_jig: 10, slow_drag: 7, live_natural_bait_suspension: 6, drop_presentation: 4 },";
  if (source.includes(before)) source = source.replace(before, after);
  else if (!source.includes(after)) throw new Error("yellow-perch override anchor not found");
  await writeFile(file, source);
}

console.log("Expansion 04 release cleanups applied: photos upgraded, SPO tests normalized, yellow-perch family leak removed.");
