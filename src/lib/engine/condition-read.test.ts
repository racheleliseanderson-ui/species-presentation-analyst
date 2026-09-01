import assert from "node:assert/strict";
import { test } from "node:test";
import { responseRead, seasonRead } from "./condition-read.ts";
import { seasonalCalendarDossierFor } from "../knowledge/dossier-catalog.ts";
import type { ScenarioInput } from "../protocol/types.ts";
import type { Season } from "../protocol/vocab.ts";

/** A brown trout on a river — the record used across the rest of the suite. */
function input(overrides: Partial<ScenarioInput> = {}): ScenarioInput {
  return {
    speciesId: "salmo_trutta",
    water: { waterType: "flowing" },
    waterType: "flowing",
    populationContext: null,
    tempF: 54,
    tempRangeF: null,
    tempSource: "user_measured",
    flow: "moderate",
    stillState: "unknown",
    clarity: "clear",
    light: "low_light",
    weather: "stable",
    season: "spring",
    holdingRiver: "seam",
    holdingStill: null,
    forage: null,
    ...overrides,
  };
}

test("an undeclared season is reported as undeclared, not filled in", () => {
  const read = seasonRead(input({ season: "unknown" }));
  assert.equal(read.status, "no_season");
});

test("a species with no reviewed calendar says so rather than inventing one", () => {
  const withoutCalendar = { ...input(), speciesId: "definitely_not_a_reviewed_species" };
  assert.equal(seasonalCalendarDossierFor(withoutCalendar.speciesId), null);
  assert.equal(seasonRead(withoutCalendar).status, "no_calendar");
});

test("an exactly reviewed season is reported as exact", () => {
  const read = seasonRead(input({ season: "summer" }));
  assert.equal(read.status, "reviewed");
  if (read.status !== "reviewed") return;
  assert.equal(read.exact, true);
  assert.equal(read.matched, "summer");
  assert.ok(read.rows.length > 0);
});

test("a finer season than the calendar covers falls back and admits the fallback", () => {
  // The reviewed brown trout calendar is written against winter/spring/summer/
  // fall/late_fall, so "late summer" has to borrow the adjacent entry.
  const read = seasonRead(input({ season: "late_summer" }));
  assert.equal(read.status, "reviewed");
  if (read.status !== "reviewed") return;
  assert.equal(read.exact, false);
  assert.equal(read.declared, "late_summer");
  assert.ok(["summer", "fall"].includes(read.matched));
});

test("every fallback chain resolves to a season the calendar can actually cover", () => {
  const seasons: Season[] = [
    "winter",
    "early_spring",
    "spring",
    "early_summer",
    "summer",
    "late_summer",
    "fall",
    "late_fall",
  ];
  for (const season of seasons) {
    const read = seasonRead(input({ season }));
    assert.equal(read.status, "reviewed", `no entry resolved for ${season}`);
  }
});

test("season rows never contain an empty value", () => {
  const read = seasonRead(input({ season: "winter" }));
  assert.equal(read.status, "reviewed");
  if (read.status !== "reviewed") return;
  for (const row of read.rows) {
    assert.ok(row.value.trim().length > 0, `${row.label} was blank`);
  }
});

test("response notes only answer conditions that were declared", () => {
  const declaredNothing = responseRead(
    input({ clarity: "unknown", weather: "unknown", flow: "unknown", tempF: null }),
  );
  assert.equal(
    declaredNothing.notes.some((note) => note.trigger.startsWith("Clarity")),
    false,
  );

  const declaredClarity = responseRead(input({ clarity: "turbid" }));
  const clarityNote = declaredClarity.notes.find((note) => note.trigger.startsWith("Clarity"));
  const unreviewed = declaredClarity.unreviewed.some((item) => item.startsWith("Clarity"));
  // Either the record answers for clarity, or it is listed as unreviewed —
  // never silently absent.
  assert.ok(clarityNote != null || unreviewed);
});

test("a front is only discussed when a front was declared", () => {
  assert.equal(
    responseRead(input({ weather: "stable" })).notes.some((note) => note.id === "front"),
    false,
  );
  const front = responseRead(input({ weather: "post_front" }));
  assert.ok(
    front.notes.some((note) => note.id === "front") ||
      front.unreviewed.some((item) => item.startsWith("Weather")),
  );
});

test("time of day is always offered, because it is the cheapest change available", () => {
  const read = responseRead(input({ light: "unknown" }));
  assert.ok(read.notes.some((note) => note.id === "diel"));
});
