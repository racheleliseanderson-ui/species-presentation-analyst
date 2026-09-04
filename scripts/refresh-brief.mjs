#!/usr/bin/env node
/**
 * Build research briefs for existing species that need a substantive refresh.
 *
 * This is deliberately different from check-sources.mjs. A URL returning 200
 * proves only that the page still exists; it does not prove that the biology is
 * current, complete, or still the best evidence. This script ranks overdue,
 * due-soon, partial and high-gap species and writes one research brief per fish.
 * It changes no biological data itself.
 *
 *   node --experimental-strip-types scripts/refresh-brief.mjs
 *   node --experimental-strip-types scripts/refresh-brief.mjs --limit=3
 *   node --experimental-strip-types scripts/refresh-brief.mjs --species=salmo_trutta
 *   node --experimental-strip-types scripts/refresh-brief.mjs --out=reports/runs/refresh-...
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { relative, join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import {
  KINDS,
  ROOT,
  loadDossierIndex,
  sourceUrlIndex,
  today,
} from "./dossier-index.mjs";
import { freshnessBucket } from "./report-freshness.mjs";
import { buildQueue, newestSourceCheck } from "./review-queue.mjs";

function argValue(name) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : null;
}

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function hostname(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function rel(path) {
  return relative(ROOT, path).replaceAll("\\", "/");
}

function sourceDomainRanking(index) {
  const counts = new Map();
  for (const item of sourceUrlIndex(index.entries)) {
    const host = hostname(item.url);
    if (!host) continue;
    const row = counts.get(host) ?? { host, urls: 0, cites: 0, species: new Set() };
    row.urls += 1;
    row.cites += item.cites.length;
    for (const cite of item.cites) row.species.add(cite.speciesId);
    counts.set(host, row);
  }
  for (const species of index.species) {
    for (const source of species.sources ?? []) {
      const host = hostname(source.url);
      if (!host) continue;
      const row = counts.get(host) ?? { host, urls: 0, cites: 0, species: new Set() };
      row.urls += 1;
      row.cites += 1;
      row.species.add(species.id);
      counts.set(host, row);
    }
  }
  return [...counts.values()]
    .map((row) => ({ ...row, speciesCount: row.species.size }))
    .sort((a, b) => b.speciesCount - a.speciesCount || b.cites - a.cites || a.host.localeCompare(b.host));
}

function currentSources(species, overlays) {
  const out = [];
  for (const source of species.sources ?? []) {
    out.push({ kind: "catalog", ...source });
  }
  for (const kind of KINDS) {
    for (const source of overlays[kind]?.record?.sources ?? []) {
      out.push({ kind, ...source });
    }
  }
  return out;
}

function renderBrief({ species, row, overlays, todayIso, domainRanking }) {
  const out = [];
  const sources = currentSources(species, overlays);
  const sourceDomains = [...new Set(sources.map((source) => hostname(source.url)).filter(Boolean))].sort();

  out.push(`# Refresh brief — ${species.commonNames?.[0] ?? species.id}`);
  out.push("");
  out.push(`Generated ${todayIso}. This is a research work order, not evidence.`);
  out.push("");
  out.push(`Species id: \`${species.id}\``);
  out.push(`Scientific name currently in the catalogue: *${species.scientificName}*`);
  out.push(`Target status: \`${species.targetStatus ?? "standard"}\``);
  out.push(`Catalogue reviewed: ${species.reviewedAt ?? "unknown"}; next review: ${species.nextReviewAt ?? "unknown"}.`);
  out.push("");

  out.push("## Why this fish was selected");
  out.push("");
  if (row.reasons.length) {
    for (const reason of row.reasons) out.push(`- ${reason}`);
  } else {
    out.push("- Explicitly requested for refresh.");
  }
  out.push("");

  out.push("## Current overlay state");
  out.push("");
  for (const kind of KINDS) {
    const entry = overlays[kind];
    if (!entry?.record) {
      out.push(`- **${kind}** — missing entirely`);
      continue;
    }
    const record = entry.record;
    const bucket = freshnessBucket(record.nextReviewAt, todayIso);
    out.push(
      `- **${kind}** — ${record.status ?? "unknown"}; reviewed ${record.reviewedAt ?? "unknown"}; ` +
        `next ${record.nextReviewAt ?? "unknown"} (${bucket}); ${(record.gaps ?? []).length} gap(s); home \`${entry.home}\` in \`${rel(entry.file)}\``,
    );
    for (const gap of record.gaps ?? []) out.push(`  - gap: ${gap}`);
  }
  out.push("");

  out.push("## Sources already used");
  out.push("");
  if (!sources.length) {
    out.push("No source objects are attached to the current catalogue or overlays.");
  } else {
    for (const source of sources) {
      out.push(`- **${source.kind}** / ${source.class ?? "unclassified"} — ${source.label ?? "(no label)"}${source.url ? ` — ${source.url}` : ""}`);
    }
  }
  out.push("");
  out.push(`Current source domains: ${sourceDomains.length ? sourceDomains.join(", ") : "none with URLs"}.`);
  out.push("");

  out.push("## Domains the catalogue leans on most heavily");
  out.push("");
  out.push(
    "Do not begin the refresh by reflexively reusing these. They can still be cited when they are the best primary source, " +
      "but this pass must deliberately discover evidence outside the catalogue's usual starting points.",
  );
  out.push("");
  for (const item of domainRanking.slice(0, 10)) {
    out.push(`- ${item.host} — cited across ${item.speciesCount} species (${item.cites} citation uses)`);
  }
  out.push("");

  out.push("## Required fresh-search lanes");
  out.push("");
  out.push("Search these independently. Existing citations are the starting hypothesis, not the search boundary.");
  out.push("");
  out.push("1. Taxonomy, accepted scientific name, synonyms and identification boundaries.");
  out.push("2. Target/conservation/regulatory context at the species level (never copy a frozen bag/size/season limit).");
  out.push("3. Habitat, water type, holding position, depth/current/light use and thermal evidence.");
  out.push("4. Diet, forage classes, feeding zone and feeding mode.");
  out.push("5. Social, diel and broader behavior evidence.");
  out.push("6. Seasonal movement and spawning context, written without actionable aggregation locations.");
  out.push("7. Every declared gap above gets its own targeted search, not a generic species search.");
  out.push("");

  out.push("## Refresh completion rule");
  out.push("");
  out.push(
    "A working URL is not a completed review. The refresh is complete only after new searches have been run, current claims " +
      "have been compared against newer or independent evidence, contradictions have been resolved, and every remaining gap " +
      "records what was actually tried. Do not advance reviewedAt/nextReviewAt merely because the old pages still answer.",
  );
  out.push("");

  return out.join("\n") + "\n";
}

async function main() {
  const index = await loadDossierIndex();
  const sourceCheck = newestSourceCheck();
  const { FIELD_OPENER_IDS } = await import("../src/lib/knowledge/seed-queue.ts");
  const rows = buildQueue(index, sourceCheck, [...FIELD_OPENER_IDS], today());
  const requestedSpecies = argValue("species");
  const limit = positiveInt(argValue("limit"), 3);
  const outPath = argValue("out") ?? join("reports", "refresh-briefs");
  const outDir = join(ROOT, outPath);
  const domainRanking = sourceDomainRanking(index);
  const todayIso = today();

  let candidates;
  if (requestedSpecies) {
    candidates = rows.filter((row) => row.speciesId === requestedSpecies);
    if (!candidates.length) {
      console.error(`  No reviewed species named ${requestedSpecies} exists in the catalogue.`);
      process.exitCode = 1;
      return;
    }
  } else {
    candidates = rows.filter((row) => row.score > 0).slice(0, limit);
  }

  if (!candidates.length) {
    console.log("  Nothing is overdue, due soon, partial or carrying declared gaps. No refresh brief was written.");
    return;
  }

  mkdirSync(outDir, { recursive: true });
  for (const row of candidates) {
    const species = index.speciesById[row.speciesId];
    const overlays = index.bySpecies.get(row.speciesId) ?? {};
    const markdown = renderBrief({ species, row, overlays, todayIso, domainRanking });
    const path = join(outDir, `refresh-${row.speciesId}.md`);
    writeFileSync(path, markdown);
    console.log(`  refresh brief  ${species.commonNames?.[0] ?? species.id}`);
    console.log(`                 ${rel(path)}`);
  }
  console.log("");
  console.log(`  ${candidates.length} substantive refresh brief(s) written.`);
  console.log("  These require fresh web research; check-sources alone does not satisfy them.");
  console.log("");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
