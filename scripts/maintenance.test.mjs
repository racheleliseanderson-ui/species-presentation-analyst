/**
 * Tests for the catalogue maintenance scripts.
 *
 * These cover the decisions that would do damage quietly. A redirect rule that
 * is slightly too generous rewrites an agency citation to point at whoever
 * bought the expired domain, and the report still says "fixed". A string
 * replacement that is slightly too eager clips one URL that happens to be a
 * prefix of another. A ranking that puts a declared gap above a dead link puts
 * the wrong work at the top of a person's day. None of those throw.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { classify, isSafeRedirect, registrableDomain, replaceUrlInText } from "./check-sources.mjs";
import { DUE_SOON_DAYS, freshnessBucket, speciesIn, summarize } from "./report-freshness.mjs";
import { aliasCollisions, clonedProse, duplicateIds, labelDrift, sharedRegionalNames } from "./report-duplicates.mjs";
import { gapLoad, statusSplit } from "./report-coverage.mjs";
import { isUrgent, scoreSpecies } from "./review-queue.mjs";
import { findExisting, genusOf, lookalikes, normalizeName } from "./species-brief.mjs";

const TODAY = "2026-09-03";

test("registrableDomain keeps two-part public suffixes together", () => {
  assert.equal(registrableDomain("www.dnr.wisconsin.gov"), "wisconsin.gov");
  assert.equal(registrableDomain("dnr.wisconsin.gov"), "wisconsin.gov");
  assert.equal(registrableDomain("data.marine.gov.uk"), "marine.gov.uk");
  assert.equal(registrableDomain("www.dfo-mpo.gc.ca"), "dfo-mpo.gc.ca");
});

test("a same-site permanent move may be applied without a person", () => {
  assert.ok(isSafeRedirect("https://www.michigan.gov/dnr/a", "https://www.michigan.gov/dnr/b"));
  assert.ok(isSafeRedirect("https://michigan.gov/a", "https://www.michigan.gov/a"));
  assert.ok(isSafeRedirect("http://fws.gov/a", "https://www.fws.gov/a"));
});

test("a move off the domain is never applied automatically", () => {
  // This is the failure that matters: an agency page redirecting somewhere else
  // is usually a real migration and occasionally a lapsed domain somebody else
  // now owns. A script cannot tell those apart, so it does not try.
  assert.equal(isSafeRedirect("https://www.state-fish.gov/a", "https://fishingdeals.example/a"), false);
  assert.equal(isSafeRedirect("https://data.marine.gov.uk/a", "https://other.gov.uk/a"), false);
});

test("https is never downgraded, even on the same domain", () => {
  assert.equal(isSafeRedirect("https://www.fws.gov/a", "http://www.fws.gov/a"), false);
  assert.equal(isSafeRedirect("https://www.fws.gov/a", "ftp://www.fws.gov/a"), false);
});

test("isSafeRedirect refuses anything it cannot parse", () => {
  assert.equal(isSafeRedirect("not a url", "https://www.fws.gov/a"), false);
  assert.equal(isSafeRedirect("https://www.fws.gov/a", "//broken"), false);
});

test("a refused request is not evidence a source died", () => {
  // Academic publishers and several state sites return 403 to anything that
  // looks automated. Calling those "gone" would send somebody re-researching a
  // paper that is sitting right there.
  assert.equal(classify({ status: 403, chain: [], error: null }), "unverifiable");
  assert.equal(classify({ status: 429, chain: [], error: null }), "unverifiable");
  assert.equal(classify({ status: 503, chain: [], error: null }), "unverifiable");
  assert.equal(classify({ status: 404, chain: [], error: null }), "gone");
  assert.equal(classify({ status: 410, chain: [], error: null }), "gone");
  assert.equal(classify({ status: 0, chain: [], error: "getaddrinfo ENOTFOUND" }), "unreachable");
});

test("only a permanent hop counts as a move", () => {
  assert.equal(classify({ status: 200, chain: [], error: null }), "ok");
  assert.equal(classify({ status: 200, chain: [{ status: 302 }], error: null }), "ok");
  assert.equal(classify({ status: 200, chain: [{ status: 301 }], error: null }), "moved");
  assert.equal(classify({ status: 200, chain: [{ status: 302 }, { status: 308 }], error: null }), "moved");
});

test("a URL that is a prefix of another is not clipped", () => {
  const text = '"https://a.gov/lake-sturgeon" and "https://a.gov/lake-sturgeon-facts"';
  const { text: after, count } = replaceUrlInText(text, "https://a.gov/lake-sturgeon", "https://a.gov/sturgeon");
  assert.equal(count, 1);
  assert.equal(after, '"https://a.gov/sturgeon" and "https://a.gov/lake-sturgeon-facts"');
});

test("every citation of the same source in one file is repointed", () => {
  const text = '{"url": "https://a.gov/x"} {"url": "https://a.gov/x"}';
  const { text: after, count } = replaceUrlInText(text, "https://a.gov/x", "https://a.gov/y");
  assert.equal(count, 2);
  assert.ok(!after.includes("a.gov/x"));
});

test("a URL that is not in the file leaves it untouched", () => {
  const text = '{"url": "https://a.gov/x"}';
  const { text: after, count } = replaceUrlInText(text, "https://b.gov/z", "https://b.gov/q");
  assert.equal(count, 0);
  assert.equal(after, text);
});

test("freshness warns before a record is late, not after", () => {
  assert.equal(freshnessBucket("2026-09-02", TODAY), "overdue");
  assert.equal(freshnessBucket("2026-09-03", TODAY), "due_soon");
  assert.equal(freshnessBucket("2026-09-24", TODAY), "due_soon");
  assert.equal(freshnessBucket("2026-09-25", TODAY), "current");
  assert.equal(DUE_SOON_DAYS, 21);
});

test("a record with no review date is called undated, not current", () => {
  assert.equal(freshnessBucket(undefined, TODAY), "undated");
  assert.equal(freshnessBucket("not a date", TODAY), "undated");
});

test("freshness reports the oldest review date it saw", () => {
  const entries = [
    { speciesId: "a", kind: "diet", home: "json", record: { reviewedAt: "2026-08-30", nextReviewAt: "2026-11-28" } },
    { speciesId: "b", kind: "diet", home: "ts", record: { reviewedAt: "2026-01-04", nextReviewAt: "2026-04-04" } },
  ];
  const summary = summarize(entries, TODAY);
  assert.equal(summary.oldest, "2026-01-04");
  assert.equal(summary.buckets.overdue.length, 1);
  assert.equal(summary.buckets.current.length, 1);
  assert.deepEqual(speciesIn(summary.buckets.overdue), [{ speciesId: "b", kinds: ["diet"] }]);
});

test("an informal name resolving to two fish is a defect", () => {
  const collisions = aliasCollisions(
    { sciaenops_ocellatus: ["redfish"], oncorhynchus_nerka_anadromous: ["redfish", "sockeye"] },
    {},
  );
  assert.equal(collisions.length, 1);
  assert.equal(collisions[0].name, "redfish");
  assert.deepEqual(collisions[0].speciesIds, ["oncorhynchus_nerka_anadromous", "sciaenops_ocellatus"]);
});

test("an alias that collides with another fish's reviewed common name is caught too", () => {
  const collisions = aliasCollisions(
    { aplodinotus_grunniens: ["sheepshead"] },
    { archosargus_probatocephalus: { commonNames: ["Sheepshead"] } },
  );
  assert.equal(collisions.length, 1);
  assert.deepEqual(collisions[0].speciesIds, ["aplodinotus_grunniens", "archosargus_probatocephalus"]);
});

test("duplicate species ids are counted", () => {
  assert.deepEqual(duplicateIds([{ id: "a" }, { id: "b" }, { id: "a" }]), [{ id: "a", count: 2 }]);
  assert.deepEqual(duplicateIds([{ id: "a" }, { id: "b" }]), []);
});

test("identical prose about two fish is reported, short shared phrases are not", () => {
  const long = "A copper-cast silver drum with an inferior mouth, no chin barbels, and a black spot at the tail base.";
  const entries = [
    { speciesId: "a", kind: "identification", record: { adultAppearance: long } },
    { speciesId: "b", kind: "identification", record: { adultAppearance: long } },
    { speciesId: "c", kind: "identification", record: { adultAppearance: "Silver." } },
    { speciesId: "d", kind: "identification", record: { adultAppearance: "Silver." } },
  ];
  const clones = clonedProse(entries);
  assert.equal(clones.length, 1);
  assert.deepEqual(clones[0].speciesIds, ["a", "b"]);
});

test("one source label pointing at two addresses is drift", () => {
  const entries = [
    { speciesId: "a", kind: "diet", record: { sources: [{ label: "TPWD account", url: "https://a.gov/1" }] } },
    { speciesId: "b", kind: "diet", record: { sources: [{ label: "TPWD account", url: "https://a.gov/2" }] } },
  ];
  assert.equal(labelDrift(entries).length, 1);
});

test("shared regional names are collected but are not defects", () => {
  const entries = [
    { speciesId: "a", kind: "identification", record: { regionalNames: ["sheephead"] } },
    { speciesId: "b", kind: "identification", record: { regionalNames: ["Sheephead"] } },
    { speciesId: "c", kind: "diet", record: { regionalNames: ["ignored"] } },
  ];
  const shared = sharedRegionalNames(entries);
  assert.equal(shared.length, 1);
  assert.deepEqual(shared[0].speciesIds, ["a", "b"]);
});

test("coverage splits reviewed from partial and counts declared gaps", () => {
  const entries = [
    { speciesId: "a", kind: "diet", record: { status: "reviewed", gaps: ["one"] } },
    { speciesId: "a", kind: "behavior", record: { status: "partial", gaps: ["two", "three"] } },
    { speciesId: "b", kind: "diet", record: { status: "partial", gaps: [] } },
  ];
  const split = statusSplit(entries);
  assert.equal(split.diet.reviewed, 1);
  assert.equal(split.diet.partial, 1);
  assert.equal(split.behavior.partial, 1);
  const gaps = gapLoad(entries);
  assert.equal(gaps.total, 3);
  assert.deepEqual(gaps.ranked[0], { speciesId: "a", gaps: 3 });
});

test("a dead citation outranks every kind of incompleteness", () => {
  const dead = scoreSpecies({ deadSources: 1, movedSources: 0, overdue: 0, dueSoon: 0, partials: 0, gaps: 0, isOpener: false });
  const veryIncomplete = scoreSpecies({ deadSources: 0, movedSources: 0, overdue: 0, dueSoon: 0, partials: 4, gaps: 40, isOpener: true });
  assert.ok(dead > veryIncomplete);
});

test("past due outranks partial status", () => {
  const late = scoreSpecies({ deadSources: 0, movedSources: 0, overdue: 1, dueSoon: 0, partials: 0, gaps: 0, isOpener: false });
  const partial = scoreSpecies({ deadSources: 0, movedSources: 0, overdue: 0, dueSoon: 0, partials: 4, gaps: 12, isOpener: false });
  assert.ok(late > partial);
});

test("declared gaps cannot pile up into an emergency", () => {
  // Gaps are honest statements of incompleteness, not defects. A record with
  // forty of them should never outrank a record with one broken link.
  const capped = scoreSpecies({ deadSources: 0, movedSources: 0, overdue: 0, dueSoon: 0, partials: 0, gaps: 400, isOpener: false });
  assert.ok(capped <= 12);
});

test("urgency means broken or late, never merely incomplete", () => {
  assert.ok(isUrgent({ deadSources: [{}], movedSources: [], overdue: 0 }));
  assert.ok(isUrgent({ deadSources: [], movedSources: [], overdue: 1 }));
  assert.equal(isUrgent({ deadSources: [], movedSources: [], overdue: 0, partials: 4 }), false);
});

test("a species already in the catalogue is found through its informal names", () => {
  const species = [
    { id: "sciaenops_ocellatus", scientificName: "Sciaenops ocellatus", commonNames: ["Red drum"] },
  ];
  const aliases = { sciaenops_ocellatus: ["redfish", "puppy drum"] };
  assert.ok(findExisting({ commonName: "Redfish" }, species, aliases));
  assert.ok(findExisting({ commonName: "red drum" }, species, aliases));
  assert.ok(findExisting({ scientificName: "Sciaenops ocellatus" }, species, aliases));
  assert.equal(findExisting({ commonName: "Cobia" }, species, aliases), null);
});

test("a fish named in the note is the strongest lookalike signal there is", () => {
  const species = [
    { id: "pogonias_cromis", scientificName: "Pogonias cromis", commonNames: ["Black drum"] },
    { id: "megalops_atlanticus", scientificName: "Megalops atlanticus", commonNames: ["Tarpon"] },
  ];
  const hits = lookalikes(
    { commonName: "Atlantic croaker", scientificName: "Micropogonias undulatus", why: "Confused with black drum." },
    species,
  );
  assert.equal(hits.length, 1);
  assert.equal(hits[0].record.id, "pogonias_cromis");
});

test("a place name is not a lookalike", () => {
  // "Atlantic croaker" and "Atlantic salmon" share a word and nothing else.
  const species = [{ id: "salmo_salar_anadromous", scientificName: "Salmo salar", commonNames: ["Atlantic salmon"] }];
  assert.deepEqual(lookalikes({ commonName: "Atlantic croaker", scientificName: "Micropogonias undulatus" }, species), []);
});

test("the folk name and the genus both find a lookalike", () => {
  const species = [
    { id: "pogonias_cromis", scientificName: "Pogonias cromis", commonNames: ["Black drum"] },
    { id: "sciaenops_ocellatus", scientificName: "Sciaenops ocellatus", commonNames: ["Red drum"] },
  ];
  const byFolkName = lookalikes({ commonName: "Freshwater drum", scientificName: "Aplodinotus grunniens" }, species);
  assert.equal(byFolkName.length, 2);
  const byGenus = lookalikes({ commonName: "Something else", scientificName: "Pogonias courbina" }, species);
  assert.equal(byGenus.length, 1);
  assert.deepEqual(byGenus[0].reasons, ["same genus"]);
});

test("name normalising is punctuation and case blind", () => {
  assert.equal(normalizeName("Sac-a-lait"), "sac a lait");
  assert.equal(normalizeName("  Salmo  salar  "), "salmo salar");
  assert.equal(normalizeName(undefined), "");
  assert.equal(genusOf("Sciaenops ocellatus"), "sciaenops");
  assert.equal(genusOf(""), null);
});
