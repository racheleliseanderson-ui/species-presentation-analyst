#!/usr/bin/env node
/**
 * What should actually be re-reviewed next, and why.
 *
 * The three read-only reports each answer one question. This turns all three
 * into one ordered list of work, because "34 seasonal calendars are partial"
 * is not a task and "these four records are past due and two of their agency
 * links are dead" is.
 *
 *   node --experimental-strip-types scripts/review-queue.mjs
 *
 * Reads the newest reports/source-check-*.json if one exists, and says so when
 * there isn't one rather than quietly ranking without it. Writes a dated
 * markdown worklist. Changes no dossier.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { KINDS, ROOT, loadDossierIndex, today } from "./dossier-index.mjs";
import { freshnessBucket } from "./report-freshness.mjs";

const REPORT_DIR = join(ROOT, "reports");

/**
 * Weights, in the order a person would actually care.
 *
 * A dead citation outranks everything: the record may be perfectly correct and
 * still be unverifiable, which is the one failure this catalogue treats as
 * disqualifying. Past due comes next because the app prints the review date as
 * a promise. Partial status and declared gaps are last — they are honest
 * statements of incompleteness, not defects, and a record can sit at partial
 * for a long time without being wrong.
 *
 * The bands are far apart on purpose. No amount of declared incompleteness
 * should climb above one broken citation, and four records falling due next
 * week should not outrank one that is already late.
 */
export const WEIGHTS = {
  deadSource: 50_000,
  movedOffDomain: 3_000,
  overdue: 500,
  dueSoon: 100,
  partial: 5,
  perGap: 0.5,
  gapCap: 20,
  opener: 3,
};

export function scoreSpecies({ deadSources, movedSources, overdue, dueSoon, partials, gaps, isOpener }) {
  return (
    deadSources * WEIGHTS.deadSource +
    movedSources * WEIGHTS.movedOffDomain +
    overdue * WEIGHTS.overdue +
    dueSoon * WEIGHTS.dueSoon +
    partials * WEIGHTS.partial +
    Math.min(gaps, WEIGHTS.gapCap) * WEIGHTS.perGap +
    (isOpener ? WEIGHTS.opener : 0)
  );
}

export function newestSourceCheck(dir = REPORT_DIR) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter((name) => /^source-check-\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();
  if (!files.length) return null;
  const file = files[files.length - 1];
  return { file, ...JSON.parse(readFileSync(join(dir, file), "utf8")) };
}

/**
 * Broken citations for one species, one entry per address.
 *
 * A single agency page is usually cited by all four overlays, and listing it
 * four times turns a two-link problem into what looks like an eight-link
 * emergency. The count that matters is how many addresses need finding again.
 */
export function brokenSourcesBySpecies(sourceCheck) {
  const bad = new Map();
  for (const result of sourceCheck?.results ?? []) {
    const bucket =
      result.verdict === "gone" ? "dead" : result.verdict === "moved" && !result.safeToFix ? "moved" : null;
    if (!bucket) continue;
    for (const cite of result.cites) {
      if (!bad.has(cite.speciesId)) bad.set(cite.speciesId, { dead: new Map(), moved: new Map() });
      const byUrl = bad.get(cite.speciesId)[bucket];
      if (!byUrl.has(result.url)) {
        byUrl.set(result.url, { url: result.url, finalUrl: result.finalUrl, label: cite.label, kinds: [] });
      }
      byUrl.get(result.url).kinds.push(cite.kind);
    }
  }
  const out = new Map();
  for (const [speciesId, buckets] of bad) {
    out.set(speciesId, {
      dead: [...buckets.dead.values()],
      moved: [...buckets.moved.values()],
    });
  }
  return out;
}

export function buildQueue(index, sourceCheck, openerIds, todayIso) {
  const broken = brokenSourcesBySpecies(sourceCheck);
  const rows = [];

  for (const species of index.species) {
    const overlays = index.bySpecies.get(species.id) ?? {};
    const sources = broken.get(species.id) ?? { dead: [], moved: [] };

    let overdue = 0;
    let dueSoon = 0;
    let partials = 0;
    let gaps = 0;
    const reasons = [];

    for (const kind of KINDS) {
      const record = overlays[kind]?.record;
      if (!record) {
        reasons.push("no " + kind + " record at all");
        continue;
      }
      const bucket = freshnessBucket(record.nextReviewAt, todayIso);
      if (bucket === "overdue") {
        overdue += 1;
        reasons.push(kind + " was due " + record.nextReviewAt);
      } else if (bucket === "due_soon") {
        dueSoon += 1;
        reasons.push(kind + " is due " + record.nextReviewAt);
      }
      if (record.status === "partial") partials += 1;
      gaps += (record.gaps ?? []).length;
    }

    if (sources.dead.length) {
      reasons.unshift(
        sources.dead.length + (sources.dead.length === 1 ? " source no longer resolves" : " sources no longer resolve"),
      );
    }
    if (sources.moved.length) {
      reasons.unshift(sources.moved.length + " source(s) moved to another domain");
    }
    if (partials) reasons.push(partials + " of four overlays still partial");

    const score = scoreSpecies({
      deadSources: sources.dead.length,
      movedSources: sources.moved.length,
      overdue,
      dueSoon,
      partials,
      gaps,
      isOpener: openerIds.includes(species.id),
    });

    rows.push({
      speciesId: species.id,
      commonName: species.commonNames?.[0] ?? species.id,
      targetStatus: species.targetStatus ?? "standard",
      score,
      overdue,
      dueSoon,
      partials,
      gaps,
      deadSources: sources.dead,
      movedSources: sources.moved,
      reasons,
    });
  }

  return rows.sort((a, b) => b.score - a.score || a.speciesId.localeCompare(b.speciesId));
}

/** Work that cannot wait for the next cadence: a broken citation, or a late record. */
export function isUrgent(row) {
  return row.deadSources.length > 0 || row.movedSources.length > 0 || row.overdue > 0;
}

function renderMarkdown({ rows, sourceCheck, todayIso, coverage }) {
  const urgent = rows.filter(isUrgent);
  const soon = rows.filter((row) => !isUrgent(row) && row.dueSoon > 0);
  const backlog = rows.filter((row) => !isUrgent(row) && row.dueSoon === 0 && row.partials > 0).slice(0, 15);

  const out = [];
  out.push("# Review queue — " + todayIso);
  out.push("");

  if (!sourceCheck) {
    out.push(
      "No source check has been run, so nothing here knows whether the citations still resolve. " +
        "Run REVIEW-AND-UPDATE if you want that in the ranking.",
    );
  } else {
    out.push(
      "Citations last checked " + sourceCheck.checkedAt + ". " + sourceCheck.counts.gone + " gone, " +
        sourceCheck.counts.moved + " moved, " + sourceCheck.counts.unverifiable +
        " refused to answer an automated request — that last group is not evidence of anything and was not counted against any record.",
    );
  }
  out.push("");
  out.push(
    coverage.reviewedSectionCells + " of " + coverage.sectionCells + " angler-profile sections are filled across " +
      coverage.speciesTotal + " species.",
  );
  out.push("");

  if (!urgent.length && !soon.length) {
    out.push("## Nothing is late and nothing is broken");
    out.push("");
    out.push(
      "Every citation that could be checked answered, and no record has passed its review date. " +
        "The backlog below is the honest incompleteness the records already declare — worth working through, " +
        "but none of it is a defect.",
    );
    out.push("");
  }

  const renderRow = (row) => {
    out.push("### " + row.commonName + " — `" + row.speciesId + "`");
    out.push("");
    if (row.targetStatus !== "standard") {
      out.push("Target status: **" + row.targetStatus + "**.");
      out.push("");
    }
    for (const reason of row.reasons) out.push("- " + reason);
    out.push("");
    for (const source of row.deadSources) {
      out.push("**Dead** — cited by " + source.kinds.join(", "));
      out.push("");
      out.push("- " + (source.label || "(no label)"));
      out.push("- " + source.url);
      out.push("");
    }
    for (const source of row.movedSources) {
      out.push("**Moved off-domain** — cited by " + source.kinds.join(", "));
      out.push("");
      out.push("- " + (source.label || "(no label)"));
      out.push("- was: " + source.url);
      out.push("- now: " + source.finalUrl);
      out.push("");
    }
    out.push(row.gaps + " gaps declared across the four overlays.");
    out.push("");
  };

  if (urgent.length) {
    out.push("## Needs a person now");
    out.push("");
    out.push(
      "A citation that no longer resolves does not make the biology wrong. It makes the claim uncheckable, " +
        "which this catalogue treats as the same problem. Either find the source again or move the claim into `gaps`.",
    );
    out.push("");
    for (const row of urgent) renderRow(row);
  }

  if (soon.length) {
    out.push("## Due inside three weeks");
    out.push("");
    for (const row of soon) renderRow(row);
  }

  if (backlog.length) {
    out.push("## Backlog, ranked");
    out.push("");
    out.push("Records that say out loud they are incomplete. Most partial overlays and highest declared gaps first.");
    out.push("");
    for (const row of backlog) {
      out.push(
        "- **" + row.commonName + "** `" + row.speciesId + "` — " + row.partials + " partial overlay(s), " +
          row.gaps + " declared gaps",
      );
    }
    out.push("");
  }

  return out.join("\n") + "\n";
}

async function main() {
  const index = await loadDossierIndex();
  const { FIELD_OPENER_IDS } = await import("../src/lib/knowledge/seed-queue.ts");
  const { catalogKnowledgeCoverage } = await import("../src/lib/knowledge/coverage.ts");

  const todayIso = today();
  const sourceCheck = newestSourceCheck();
  const rows = buildQueue(index, sourceCheck, [...FIELD_OPENER_IDS], todayIso);
  const markdown = renderMarkdown({ rows, sourceCheck, todayIso, coverage: catalogKnowledgeCoverage() });

  mkdirSync(REPORT_DIR, { recursive: true });
  const path = join(REPORT_DIR, "review-queue-" + todayIso + ".md");
  writeFileSync(path, markdown);

  const urgent = rows.filter(isUrgent);
  const soon = rows.filter((row) => !isUrgent(row) && row.dueSoon > 0);
  const deadAddresses = new Set(urgent.flatMap((row) => row.deadSources.map((s) => s.url))).size;
  console.log("  " + urgent.length + " species need a person now (" + deadAddresses + " dead addresses between them).");
  console.log("  " + soon.length + " fall due inside three weeks.");
  if (!sourceCheck) console.log("  No source check on file — citations were not part of this ranking.");
  console.log("  Written to " + path.replace(ROOT, "").replace(/^[\\/]/, ""));
  console.log("");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
