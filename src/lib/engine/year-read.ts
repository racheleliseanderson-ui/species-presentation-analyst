/**
 * The year, and the thermometer that disagrees with it.
 *
 * The seasonal calendar is already reviewed, sourced and good. It is also read
 * one season at a time, which means the single most useful thing in it is
 * invisible: *what actually changes between one season and the next.* An
 * angler who reads the summer entry learns what summer is like. An angler who
 * can see that between spring and summer the depth tendency, the light
 * sensitivity and the presentation implication all move while the cover use
 * does not has learned something about the fish that no individual entry
 * states.
 *
 * Two rules govern how that change map is built, and both are about not
 * inventing:
 *
 *  1. **No prose is parsed into a value.** The dossier's depth notes are
 *     comparative and human — "deeper on bright days", "lower in the column
 *     than spring feeding stations". Turning those into a number would be
 *     making up a fish. The change map compares whether a field is present and
 *     whether its text differs; it never claims to know the direction.
 *  2. **A season the dossier does not cover is absent, not average.** It
 *     appears in the strip as unreviewed, which is a fact about the record
 *     rather than about the animal.
 *
 * The second half of this file is the disagreement. The calendar describes a
 * typical year; a thermometer describes today. When a warm November puts a
 * fish in its preferred band while the calendar's autumn entry is written
 * around cooling water, those two are not both right, and every other app
 * quietly picks one. This one names the conflict, says which governs, and says
 * why — because the reason is the part that transfers to the next trip.
 */

import { pointThermalState } from "./temperature.ts";
import type { SpeciesOverlays } from "../knowledge/overlays.ts";
import type { SeasonalCalendarEntry } from "../knowledge/dossier-types.ts";
import type { ScenarioInput, SpeciesRecord, ThermalState } from "../protocol/types.ts";

/* ------------------------------------------------------------------ */
/* The year                                                            */
/* ------------------------------------------------------------------ */

export const YEAR_ORDER = ["winter", "spring", "summer", "fall"] as const;
export type YearSeason = (typeof YEAR_ORDER)[number];

export const SEASON_LABEL: Record<YearSeason, string> = {
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
};

/** The dossier fields worth watching across the year, in reading order. */
export const TRACKED_FIELDS = [
  { key: "habitatClass", label: "Habitat" },
  { key: "depthTendency", label: "Depth tendency" },
  { key: "movementTendency", label: "Movement" },
  { key: "feedingEmphasis", label: "Feeding" },
  { key: "forageEmphasis", label: "Forage" },
  { key: "thermalContext", label: "Thermal context" },
  { key: "currentUse", label: "Current" },
  { key: "coverUse", label: "Cover" },
  { key: "lightSensitivity", label: "Light" },
  { key: "presentationImplication", label: "Presentation job" },
] as const;

export type TrackedField = (typeof TRACKED_FIELDS)[number]["key"];

export type YearCell = {
  season: YearSeason;
  /** False when the dossier has no entry for this season at all. */
  reviewed: boolean;
  values: Partial<Record<TrackedField, string>>;
  invalidators: string[];
  conservationNote: string | null;
};

export type SeasonTransition = {
  from: YearSeason;
  to: YearSeason;
  /** Fields whose text differs between the two entries. */
  changed: { key: TrackedField; label: string }[];
  /** Fields present in both and identical. The stable spine of the year. */
  held: { key: TrackedField; label: string }[];
  /** Fields the record cannot compare, because one side is missing. */
  uncomparable: { key: TrackedField; label: string }[];
  reading: string;
};

export type YearRead = {
  speciesId: string;
  /** Null when the species has no reviewed calendar at all. */
  overview: string | null;
  cells: YearCell[];
  transitions: SeasonTransition[];
  /** Fields that never change across every reviewed season. */
  constants: { key: TrackedField; label: string }[];
  reviewedSeasons: number;
  /** True when there is not enough reviewed to compare anything. */
  thin: boolean;
};

function cellFor(season: YearSeason, entry: SeasonalCalendarEntry | undefined): YearCell {
  if (!entry) {
    return { season, reviewed: false, values: {}, invalidators: [], conservationNote: null };
  }
  const values: Partial<Record<TrackedField, string>> = {};
  for (const field of TRACKED_FIELDS) {
    const raw = (entry as unknown as Record<string, unknown>)[field.key];
    if (typeof raw === "string" && raw.trim()) values[field.key] = raw.trim();
  }
  /* habitatClass is required on the entry type but read the same way as the
     rest, so a future schema change cannot silently drop it here. */
  return {
    season,
    reviewed: true,
    values,
    invalidators: entry.invalidators ?? [],
    conservationNote: entry.conservationNote ?? null,
  };
}

function transitionReading(
  from: YearSeason,
  to: YearSeason,
  changed: { label: string }[],
  held: { label: string }[],
): string {
  if (!changed.length && !held.length) {
    return `Nothing in the record covers both ${SEASON_LABEL[from].toLowerCase()} and ${SEASON_LABEL[to].toLowerCase()}, so there is nothing to compare — which is a gap in the reviewing, not a quiet season.`;
  }
  if (!changed.length) {
    return `Nothing the record tracks moves between ${SEASON_LABEL[from].toLowerCase()} and ${SEASON_LABEL[to].toLowerCase()}. Either the fish genuinely carries on the same way, or the two entries were written from the same source — worth knowing which before you plan around it.`;
  }
  const moving = changed.map((c) => c.label.toLowerCase()).join(", ");
  const stays = held.length
    ? ` What does not move: ${held.map((h) => h.label.toLowerCase()).join(", ")} — and the things that hold across a season change are usually the ones worth building a plan on.`
    : "";
  return `Between ${SEASON_LABEL[from].toLowerCase()} and ${SEASON_LABEL[to].toLowerCase()}: ${moving} all change.${stays}`;
}

export function yearRead(speciesId: string, overlays: SpeciesOverlays): YearRead {
  const dossier = overlays.seasonalCalendar;
  const cells = YEAR_ORDER.map((season) =>
    cellFor(
      season,
      dossier?.entries.find((entry) => entry.season === season),
    ),
  );

  const transitions: SeasonTransition[] = [];
  for (let index = 0; index < YEAR_ORDER.length; index += 1) {
    const from = YEAR_ORDER[index]!;
    const to = YEAR_ORDER[(index + 1) % YEAR_ORDER.length]!;
    const a = cells.find((c) => c.season === from)!;
    const b = cells.find((c) => c.season === to)!;

    const changed: { key: TrackedField; label: string }[] = [];
    const held: { key: TrackedField; label: string }[] = [];
    const uncomparable: { key: TrackedField; label: string }[] = [];

    for (const field of TRACKED_FIELDS) {
      const left = a.values[field.key];
      const right = b.values[field.key];
      if (left == null || right == null) {
        if (left != null || right != null)
          uncomparable.push({ key: field.key, label: field.label });
        continue;
      }
      if (left === right) held.push({ key: field.key, label: field.label });
      else changed.push({ key: field.key, label: field.label });
    }

    transitions.push({
      from,
      to,
      changed,
      held,
      uncomparable,
      reading: transitionReading(from, to, changed, held),
    });
  }

  const reviewed = cells.filter((c) => c.reviewed);
  const constants = TRACKED_FIELDS.filter((field) => {
    const values = reviewed.map((c) => c.values[field.key]).filter((v): v is string => v != null);
    return values.length >= 2 && new Set(values).size === 1;
  }).map((field) => ({ key: field.key, label: field.label }));

  return {
    speciesId,
    overview: dossier?.overview ?? null,
    cells,
    transitions,
    constants,
    reviewedSeasons: reviewed.length,
    thin: reviewed.length < 2,
  };
}

/* ------------------------------------------------------------------ */
/* When the calendar and the thermometer disagree                      */
/* ------------------------------------------------------------------ */

export type CalendarConflict = {
  status: "agree" | "conflict" | "not-enough";
  declaredSeason: string | null;
  thermalState: ThermalState;
  tempF: number | null;
  /** Which season's thermal context the reading actually resembles, if any. */
  resembles: YearSeason | null;
  reading: string;
};

/**
 * Does the temperature the angler measured belong to the season they declared?
 *
 * The test is deliberately weak, because a strong one would be a lie. It does
 * not ask "is this the right temperature for autumn" — nobody knows that for
 * every water on the continent. It asks whether the reviewed calendar entry
 * for the declared season mentions a thermal context at all, and whether the
 * measured reading puts the fish in a band that entry's own words do not
 * describe. Where the record is silent, so is this.
 */
export function calendarConflict(
  input: ScenarioInput,
  species: SpeciesRecord,
  overlays: SpeciesOverlays,
): CalendarConflict {
  const tempF = input.tempF ?? null;
  const declared = input.season && input.season !== "unknown" ? String(input.season) : null;
  const state = tempF != null ? pointThermalState(tempF, species) : "unknown";

  if (tempF == null || !declared || state === "unknown" || !overlays.seasonalCalendar) {
    return {
      status: "not-enough",
      declaredSeason: declared,
      thermalState: state,
      tempF,
      resembles: null,
      reading:
        tempF == null
          ? "No measured temperature, so there is nothing for the calendar to disagree with. The season entry stands on its own — which is a typical year, not this one."
          : "Not enough of the record to compare the reading against the season. The temperature still governs what you do; it just cannot be cross-checked here.",
    };
  }

  const entry = overlays.seasonalCalendar.entries.find((e) => e.season === declared);
  const context = entry?.thermalContext?.toLowerCase() ?? "";

  /* The only claim made here: whether the entry's own thermal words are
     consistent with the band the reading lands in. No entry, no claim. */
  const warmWords = /warm|warming|peak|summer|high/.test(context);
  const coldWords = /cold|cooling|chill|winter|low/.test(context);

  const conflictsWarm = state === "cold_refuge" && warmWords && !coldWords;
  const conflictsCold = state === "warm_stress" && coldWords && !warmWords;

  if (!entry || !context) {
    return {
      status: "not-enough",
      declaredSeason: declared,
      thermalState: state,
      tempF,
      resembles: null,
      reading: `The ${declared} entry carries no thermal context, so there is nothing to check the ${tempF}°F against. Fish the thermometer.`,
    };
  }

  if (conflictsWarm || conflictsCold) {
    return {
      status: "conflict",
      declaredSeason: declared,
      thermalState: state,
      tempF,
      resembles: null,
      reading: `You declared ${declared}, and the reviewed ${declared} entry is written around ${warmWords ? "warming or warm" : "cooling or cold"} water — but ${tempF}°F puts this fish ${state === "cold_refuge" ? "below its cold edge" : "above its warm edge"}. Those are not both true today. The thermometer wins: it describes the water you are standing in, and the calendar describes a typical year that this one is not. Treat the season entry as background and the reading as the instruction.`,
    };
  }

  return {
    status: "agree",
    declaredSeason: declared,
    thermalState: state,
    tempF,
    resembles: null,
    reading: `${tempF}°F and the reviewed ${declared} entry point the same way, which is the ordinary case and worth noting only because it means you can lean on the seasonal reasoning as well as the reading. When they part company, the reading governs.`,
  };
}
