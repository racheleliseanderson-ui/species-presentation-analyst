#!/usr/bin/env node
/**
 * What can the catalogue actually answer?
 *
 * Not "how many records exist" — every species has had four overlays written
 * since wave 08 landed, so a count of records is now a number that can only
 * stay the same. The useful question is how much of each record is *reviewed*
 * rather than partial, how many gaps are declared and where, and which of the
 * ten angler-profile sections a reader would actually find filled in.
 *
 *   node --experimental-strip-types scripts/report-coverage.mjs [--json]
 *
 * Reads only.
 */
import process from "node:process";
import { pathToFileURL } from "node:url";
import { KINDS, loadDossierIndex } from "./dossier-index.mjs";

export function statusSplit(entries) {
  const byKind = {};
  for (const kind of KINDS) byKind[kind] = { reviewed: 0, partial: 0, other: 0 };
  for (const entry of entries) {
    const status = entry.record?.status;
    const slot = status === "reviewed" ? "reviewed" : status === "partial" ? "partial" : "other";
    byKind[entry.kind][slot] += 1;
  }
  return byKind;
}

export function gapLoad(entries) {
  const bySpecies = new Map();
  let total = 0;
  for (const entry of entries) {
    const gaps = entry.record?.gaps ?? [];
    total += gaps.length;
    bySpecies.set(entry.speciesId, (bySpecies.get(entry.speciesId) ?? 0) + gaps.length);
  }
  const ranked = [...bySpecies.entries()]
    .map(([speciesId, gaps]) => ({ speciesId, gaps }))
    .sort((a, b) => b.gaps - a.gaps || a.speciesId.localeCompare(b.speciesId));
  return { total, ranked };
}

/** Species whose every overlay says "reviewed" — the fully-answerable ones. */
export function fullyReviewedSpecies(bySpecies) {
  const out = [];
  for (const [speciesId, kinds] of bySpecies) {
    if (KINDS.every((kind) => kinds[kind]?.record?.status === "reviewed")) out.push(speciesId);
  }
  return out.sort();
}

async function main() {
  const index = await loadDossierIndex();
  const { catalogKnowledgeCoverage } = await import("../src/lib/knowledge/coverage.ts");
  const { SPECIES_IMAGES_BY_ID } = await import("../src/lib/knowledge/species-images.ts");

  const coverage = catalogKnowledgeCoverage();
  const split = statusSplit(index.entries);
  const gaps = gapLoad(index.entries);
  const fullyReviewed = fullyReviewedSpecies(index.bySpecies);

  const withImage = index.species.filter((s) => SPECIES_IMAGES_BY_ID[s.id]).length;
  const withThermal = index.species.filter((s) => s.thermal?.coldEdgeF != null || s.thermal?.warmEdgeF != null).length;
  const byTargetStatus = index.species.reduce((acc, s) => {
    const key = s.targetStatus ?? "standard";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const payload = {
    speciesTotal: coverage.speciesTotal,
    completeOverlays: coverage.completeOverlays,
    fullyReviewedSpecies: fullyReviewed.length,
    reviewedSectionCells: coverage.reviewedSectionCells,
    sectionCells: coverage.sectionCells,
    statusByOverlay: split,
    declaredGaps: gaps.total,
    withCanonicalImage: withImage,
    withThermalBand: withThermal,
    byTargetStatus,
    nextWave: coverage.nextWave?.id ?? null,
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ ...payload, gapsBySpecies: gaps.ranked, fullyReviewed }, null, 2));
    return;
  }

  const pct = (n, d) => `${Math.round((n / d) * 100)}%`;
  console.log(`  ${payload.speciesTotal} reviewed species. ${payload.completeOverlays} carry all four overlays.`);
  console.log(
    `  ${payload.reviewedSectionCells} of ${payload.sectionCells} angler-profile sections are filled (${pct(payload.reviewedSectionCells, payload.sectionCells)}).`,
  );
  console.log("");
  console.log("  Depth of each overlay:");
  for (const kind of KINDS) {
    const s = split[kind];
    console.log(
      `    ${kind.padEnd(19)} ${String(s.reviewed).padStart(3)} reviewed   ${String(s.partial).padStart(3)} partial${s.other ? `   ${s.other} unrecognised status` : ""}`,
    );
  }
  console.log("");
  console.log(`  ${fullyReviewed.length} species are reviewed on all four; the rest carry at least one partial.`);
  console.log(`  ${payload.declaredGaps} gaps are declared out loud across the catalogue.`);
  console.log(`  ${withThermal} species carry a temperature band. ${payload.speciesTotal - withThermal} say so instead.`);
  console.log(`  ${withImage} species have a canonical reviewed image; ${payload.speciesTotal - withImage} stay text-only.`);
  console.log("");
  console.log("  Target status:");
  for (const [status, count] of Object.entries(byTargetStatus).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${status.padEnd(24)} ${count}`);
  }
  console.log("");
  if (gaps.ranked.length) {
    console.log("  Most declared gaps:");
    for (const { speciesId, gaps: n } of gaps.ranked.slice(0, 8)) {
      console.log(`    ${speciesId.padEnd(34)} ${n}`);
    }
    console.log("");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
