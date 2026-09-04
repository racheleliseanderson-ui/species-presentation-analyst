import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { TRACKED_FIELDS, YEAR_ORDER, calendarConflict, yearRead } from "./year-read.ts";
import { SPECIES } from "../knowledge/species-catalog.ts";
import type { SeasonalCalendarDossier } from "../knowledge/dossier-types.ts";
import type { SpeciesOverlays } from "../knowledge/overlays.ts";
import type { ScenarioInput } from "../protocol/types.ts";

/**
 * Two things are fenced here, and the first is the one that would do damage.
 *
 * THE RECORD IS NOT PARSED. The seasonal dossier's depth and movement notes are
 * comparative human prose — "deeper on bright days", "lower in the column than
 * spring feeding stations". A change map that claimed to read a direction out
 * of those would be inventing a fish, quietly, in a table that looks
 * authoritative. So the map compares presence and text and nothing else: a
 * season the record does not cover is UNREVIEWED, and a field only one side has
 * is UNCOMPARABLE — never "changed".
 *
 * THE CONFLICT CARD MAKES ONE CLAIM. It fires only when a reviewed entry's own
 * thermal words contradict the band the reading lands in. No entry, no thermal
 * context, or no reading means silence — not a hedge, not a "nothing to report"
 * card. Silence.
 */

const SPECIES_RECORD = SPECIES.find((s) => s.thermal?.preferredF && s.thermal?.coldEdgeF)!;

function dossier(entries: SeasonalCalendarDossier["entries"]): SpeciesOverlays {
  return {
    seasonalCalendar: {
      speciesId: SPECIES_RECORD.id,
      status: "reviewed",
      overview: "Test overview.",
      entries,
      sources: [],
      reviewedAt: "2026-01-01",
      nextReviewAt: "2027-01-01",
      gaps: [],
    },
  } as unknown as SpeciesOverlays;
}

const EMPTY_OVERLAYS = {} as unknown as SpeciesOverlays;

function input(over: Partial<ScenarioInput> = {}): ScenarioInput {
  return {
    speciesId: SPECIES_RECORD.id,
    season: "unknown",
    tempF: null,
    ...over,
  } as ScenarioInput;
}

describe("the year is assembled, not invented", () => {
  it("no calendar means four unreviewed seasons and no claims", () => {
    const read = yearRead(SPECIES_RECORD.id, EMPTY_OVERLAYS);
    assert.equal(read.cells.length, 4);
    assert.equal(
      read.cells.every((c) => !c.reviewed),
      true,
    );
    assert.equal(read.reviewedSeasons, 0);
    assert.equal(read.thin, true);
    assert.equal(read.overview, null);
  });

  it("one reviewed season is not a year", () => {
    const read = yearRead(
      SPECIES_RECORD.id,
      dossier([{ season: "summer", habitatClass: "Open basin" }]),
    );
    assert.equal(read.reviewedSeasons, 1);
    assert.equal(read.thin, true);
  });

  it("every season appears in the strip whether reviewed or not", () => {
    const read = yearRead(
      SPECIES_RECORD.id,
      dossier([
        { season: "summer", habitatClass: "Open basin" },
        { season: "winter", habitatClass: "Deep basin" },
      ]),
    );
    assert.deepEqual(
      read.cells.map((c) => c.season),
      [...YEAR_ORDER],
    );
    assert.equal(read.cells.filter((c) => c.reviewed).length, 2);
    assert.equal(read.cells.find((c) => c.season === "spring")!.reviewed, false);
  });
});

describe("the change map only compares what both sides have", () => {
  const read = yearRead(
    SPECIES_RECORD.id,
    dossier([
      {
        season: "spring",
        habitatClass: "Shallow flats",
        depthTendency: "Higher in the column.",
        coverUse: "Uses wood.",
      },
      {
        season: "summer",
        habitatClass: "Shallow flats",
        depthTendency: "Lower in the column.",
        lightSensitivity: "Avoids bright midday.",
      },
    ]),
  );
  const springToSummer = read.transitions.find((t) => t.from === "spring" && t.to === "summer")!;

  it("a field with different text on both sides is a change", () => {
    assert.ok(springToSummer.changed.some((c) => c.key === "depthTendency"));
  });

  it("a field with identical text on both sides holds", () => {
    assert.ok(springToSummer.held.some((h) => h.key === "habitatClass"));
  });

  it("a field only one side has is uncomparable, never a change", () => {
    const keys = springToSummer.uncomparable.map((u) => u.key);
    assert.ok(keys.includes("coverUse"));
    assert.ok(keys.includes("lightSensitivity"));
    assert.ok(!springToSummer.changed.some((c) => c.key === "coverUse"));
    assert.ok(!springToSummer.held.some((h) => h.key === "coverUse"));
  });

  it("no field is counted twice in one transition", () => {
    for (const t of read.transitions) {
      const all = [...t.changed, ...t.held, ...t.uncomparable].map((x) => x.key);
      assert.equal(new Set(all).size, all.length);
      assert.ok(all.length <= TRACKED_FIELDS.length);
    }
  });

  it("the reading names the fields that move, and never a direction", () => {
    assert.ok(springToSummer.reading.includes("depth tendency"));
    assert.doesNotMatch(
      springToSummer.reading,
      /\bdeeper\b|\bshallower\b|\bmoves up\b|\bmoves down\b/i,
    );
  });

  it("a transition with nothing on both sides says the record is the gap", () => {
    const sparse = yearRead(
      SPECIES_RECORD.id,
      dossier([
        { season: "spring", habitatClass: "Flats" },
        { season: "fall", habitatClass: "Flats" },
      ]),
    );
    const summerToFall = sparse.transitions.find((t) => t.from === "summer" && t.to === "fall")!;
    assert.match(summerToFall.reading, /gap in the reviewing/);
  });
});

describe("constants are what holds across every reviewed season", () => {
  it("a field with the same text everywhere is a constant", () => {
    const read = yearRead(
      SPECIES_RECORD.id,
      dossier([
        { season: "spring", habitatClass: "Weed edge", currentUse: "Little." },
        { season: "summer", habitatClass: "Weed edge", currentUse: "Little." },
        { season: "fall", habitatClass: "Weed edge", currentUse: "More." },
      ]),
    );
    assert.ok(read.constants.some((c) => c.key === "habitatClass"));
    assert.ok(!read.constants.some((c) => c.key === "currentUse"));
  });

  it("a field present in only one season is never a constant", () => {
    const read = yearRead(
      SPECIES_RECORD.id,
      dossier([
        { season: "spring", habitatClass: "A", forageEmphasis: "Fry." },
        { season: "summer", habitatClass: "B" },
      ]),
    );
    assert.ok(!read.constants.some((c) => c.key === "forageEmphasis"));
  });
});

describe("the conflict card stays quiet unless it has a real conflict", () => {
  it("no temperature means nothing to disagree with", () => {
    const result = calendarConflict(
      input({ season: "fall" }),
      SPECIES_RECORD,
      dossier([{ season: "fall", habitatClass: "A", thermalContext: "Cooling water." }]),
    );
    assert.equal(result.status, "not-enough");
  });

  it("no declared season means nothing to disagree with", () => {
    const result = calendarConflict(
      input({ tempF: 55 }),
      SPECIES_RECORD,
      dossier([{ season: "fall", habitatClass: "A", thermalContext: "Cooling water." }]),
    );
    assert.equal(result.status, "not-enough");
  });

  it("an entry with no thermal context makes no claim, and says to fish the reading", () => {
    const result = calendarConflict(
      input({ season: "fall", tempF: 55 }),
      SPECIES_RECORD,
      dossier([{ season: "fall", habitatClass: "A" }]),
    );
    assert.equal(result.status, "not-enough");
    assert.match(result.reading, /Fish the thermometer/);
  });

  it("a reading below the cold edge against a warm-worded entry is a conflict", () => {
    const cold = (SPECIES_RECORD.thermal!.coldEdgeF as number) - 10;
    const result = calendarConflict(
      input({ season: "summer", tempF: cold }),
      SPECIES_RECORD,
      dossier([{ season: "summer", habitatClass: "A", thermalContext: "Peak warm water." }]),
    );
    assert.equal(result.status, "conflict");
    assert.match(result.reading, /thermometer wins/);
    assert.match(result.reading, /typical year/);
  });

  it("a reading that matches the entry's own words is agreement, not silence", () => {
    const warm = SPECIES_RECORD.thermal!.preferredF![0];
    const result = calendarConflict(
      input({ season: "summer", tempF: warm }),
      SPECIES_RECORD,
      dossier([{ season: "summer", habitatClass: "A", thermalContext: "Peak warm water." }]),
    );
    assert.equal(result.status, "agree");
    assert.match(result.reading, /the reading governs/);
  });

  it("no reading anywhere predicts a bite", () => {
    const cold = (SPECIES_RECORD.thermal!.coldEdgeF as number) - 10;
    const results = [
      calendarConflict(
        input({ season: "summer", tempF: cold }),
        SPECIES_RECORD,
        dossier([{ season: "summer", habitatClass: "A", thermalContext: "Peak warm water." }]),
      ),
      calendarConflict(input(), SPECIES_RECORD, EMPTY_OVERLAYS),
    ];
    for (const r of results) {
      assert.doesNotMatch(r.reading, /\bwill feed\b|\bwill bite\b|\bthe fish are\b|\bgood day\b/i);
    }
  });
});
