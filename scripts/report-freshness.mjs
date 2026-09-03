#!/usr/bin/env node
/**
 * How old is the information?
 *
 * Every dossier carries `reviewedAt` and `nextReviewAt`, and the product prints
 * both on the reading. The cadence is 90 days. That promise is only worth
 * anything if somebody is counting, and nothing in the repository was counting
 * — so a record could pass its review date and the app would keep printing the
 * date as though it were a guarantee.
 *
 *   node --experimental-strip-types scripts/report-freshness.mjs [--json]
 *
 * Reads only.
 */
import process from "node:process";
import { pathToFileURL } from "node:url";
import { KINDS, daysBetween, loadDossierIndex, today } from "./dossier-index.mjs";

/** Warn before a record is late, not after: a review takes longer than a day. */
export const DUE_SOON_DAYS = 21;

export function freshnessBucket(nextReviewAt, todayIso) {
  const days = daysBetween(todayIso, nextReviewAt);
  if (days === null) return "undated";
  if (days < 0) return "overdue";
  if (days <= DUE_SOON_DAYS) return "due_soon";
  return "current";
}

export function summarize(entries, todayIso) {
  const buckets = { overdue: [], due_soon: [], current: [], undated: [] };
  for (const entry of entries) {
    const bucket = freshnessBucket(entry.record?.nextReviewAt, todayIso);
    buckets[bucket].push({
      speciesId: entry.speciesId,
      kind: entry.kind,
      reviewedAt: entry.record?.reviewedAt ?? null,
      nextReviewAt: entry.record?.nextReviewAt ?? null,
      days: daysBetween(todayIso, entry.record?.nextReviewAt),
      home: entry.home,
    });
  }
  for (const list of Object.values(buckets)) {
    list.sort((a, b) => (a.days ?? 0) - (b.days ?? 0) || a.speciesId.localeCompare(b.speciesId));
  }
  const oldest = entries
    .map((e) => e.record?.reviewedAt)
    .filter(Boolean)
    .sort()[0] ?? null;
  return { buckets, oldest, total: entries.length };
}

/** Species with at least one record in a bucket, so the worklist is per fish. */
export function speciesIn(bucketList) {
  const bySpecies = new Map();
  for (const item of bucketList) {
    if (!bySpecies.has(item.speciesId)) bySpecies.set(item.speciesId, []);
    bySpecies.get(item.speciesId).push(item.kind);
  }
  return [...bySpecies.entries()]
    .map(([speciesId, kinds]) => ({ speciesId, kinds: KINDS.filter((k) => kinds.includes(k)) }))
    .sort((a, b) => a.speciesId.localeCompare(b.speciesId));
}

async function main() {
  const index = await loadDossierIndex();
  const todayIso = today();
  const summary = summarize(index.entries, todayIso);

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ today: todayIso, ...summary }, null, 2));
    return;
  }

  const { overdue, due_soon: dueSoon, current, undated } = summary.buckets;
  console.log(`  ${summary.total} reviewed records across ${index.species.length} species.`);
  console.log(`  Oldest review date on any record: ${summary.oldest ?? "unknown"}.`);
  console.log("");
  console.log(`  ${String(overdue.length).padStart(4)}  past their review date`);
  console.log(`  ${String(dueSoon.length).padStart(4)}  due within ${DUE_SOON_DAYS} days`);
  console.log(`  ${String(current.length).padStart(4)}  current`);
  if (undated.length) console.log(`  ${String(undated.length).padStart(4)}  carry no review date at all`);
  console.log("");

  if (overdue.length) {
    const species = speciesIn(overdue);
    console.log(`  Past due — ${species.length} species:`);
    for (const { speciesId, kinds } of species.slice(0, 25)) {
      console.log(`    ${speciesId.padEnd(34)} ${kinds.join(", ")}`);
    }
    if (species.length > 25) console.log(`    ...and ${species.length - 25} more.`);
  } else if (dueSoon.length) {
    const next = dueSoon[0];
    console.log(`  Nothing is late. The first record due is ${next.speciesId}/${next.kind} on ${next.nextReviewAt}.`);
  } else {
    const soonest = current[0];
    console.log(`  Nothing is late or due soon. The next review falls on ${soonest?.nextReviewAt ?? "unknown"}.`);
  }
  console.log("");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
