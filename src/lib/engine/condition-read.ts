/**
 * The condition layer of the decision chain.
 *
 * `interpret()` answers "what presentation family fits?". This module answers
 * the two questions either side of it: **where should the fish be right now**
 * (season → depth → holding water → forage) and **what is it responding to**
 * (light, clarity, weather, flow, pressure).
 *
 * Every sentence here is lifted from a reviewed dossier. Nothing is generated,
 * nothing is inferred from geography, and a missing field is reported as
 * missing rather than filled in. If no reviewed calendar covers the declared
 * season, that is the answer.
 */

import type {
  DossierSource,
  SeasonalCalendarEntry,
} from "../knowledge/dossier-types.ts";
import type { SpeciesOverlays } from "../knowledge/overlays.ts";
import type { ScenarioInput } from "../protocol/types.ts";
import { labelOf, type Season } from "../protocol/vocab.ts";

export type ReviewedSeason = Exclude<Season, "unknown">;

export type SeasonRow = { label: string; value: string };

export type SeasonRead =
  | { status: "no_season" }
  | { status: "no_calendar" }
  | { status: "no_entry"; overview: string; covered: ReviewedSeason[] }
  | {
      status: "reviewed";
      /** The season the angler declared. */
      declared: ReviewedSeason;
      /** The reviewed entry actually used — may be the adjacent coarse season. */
      matched: ReviewedSeason;
      exact: boolean;
      overview: string;
      rows: SeasonRow[];
      presentationImplication: string | null;
      conservationNote: string | null;
      invalidators: string[];
      sources: DossierSource[];
    };

export type ResponseNote = {
  id: string;
  /** The declared condition this note answers. */
  trigger: string;
  text: string;
  source: "behavior" | "diet" | "seasonal_calendar";
};

export type ResponseRead = {
  notes: ResponseNote[];
  /** Declared conditions with no reviewed response on this record. */
  unreviewed: string[];
  sources: DossierSource[];
};

/**
 * Seasons the reviewed calendars are written against, in order, with the
 * fallbacks used when an angler declares a finer season than the calendar
 * covers. The fallback is always disclosed in the UI — it is never presented
 * as if the reviewed entry named that season itself.
 */
const SEASON_FALLBACKS: Record<ReviewedSeason, ReviewedSeason[]> = {
  winter: ["winter", "late_fall", "early_spring"],
  early_spring: ["early_spring", "spring", "winter"],
  spring: ["spring", "early_spring"],
  early_summer: ["early_summer", "spring", "summer"],
  summer: ["summer", "early_summer"],
  late_summer: ["late_summer", "summer", "fall"],
  fall: ["fall", "late_summer", "late_fall"],
  late_fall: ["late_fall", "fall", "winter"],
};

function row(label: string, value: string | undefined | null): SeasonRow | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? { label, value: text } : null;
}

function rowsFor(entry: SeasonalCalendarEntry): SeasonRow[] {
  return [
    row("Holding water", entry.habitatClass),
    row("Depth", entry.depthTendency),
    row("Movement", entry.movementTendency),
    row("Feeding", entry.feedingEmphasis),
    row("Forage", entry.forageEmphasis),
    row("Water temperature", entry.thermalContext),
    row("Current", entry.currentUse),
    row("Cover", entry.coverUse),
    row("Light", entry.lightSensitivity),
  ].filter((item): item is SeasonRow => item !== null);
}

/** Where the fish should be, for the season the angler declared. */
export function seasonRead(input: ScenarioInput, overlays: SpeciesOverlays): SeasonRead {
  if (input.season === "unknown") return { status: "no_season" };
  const declared = input.season as ReviewedSeason;

  const dossier = overlays.seasonalCalendar;
  if (!dossier) return { status: "no_calendar" };

  const covered = dossier.entries.map((entry) => entry.season);
  const order = SEASON_FALLBACKS[declared] ?? [declared];
  const matchedSeason = order.find((season) => covered.includes(season));
  const entry = matchedSeason
    ? dossier.entries.find((item) => item.season === matchedSeason)
    : undefined;

  if (!entry || !matchedSeason) {
    return { status: "no_entry", overview: dossier.overview, covered };
  }

  return {
    status: "reviewed",
    declared,
    matched: matchedSeason,
    exact: matchedSeason === declared,
    overview: dossier.overview,
    rows: rowsFor(entry),
    presentationImplication: entry.presentationImplication ?? null,
    conservationNote: entry.conservationNote ?? null,
    invalidators: entry.invalidators ?? [],
    sources: dossier.sources,
  };
}

/**
 * What the fish is responding to, limited to conditions the angler actually
 * declared. Declaring nothing produces no notes rather than a generic list.
 */
export function responseRead(input: ScenarioInput, overlays: SpeciesOverlays): ResponseRead {
  const behavior = overlays.behavior;
  const diet = overlays.diet;
  const notes: ResponseNote[] = [];
  const unreviewed: string[] = [];
  const sources: DossierSource[] = [];

  const add = (
    id: string,
    trigger: string,
    text: string | undefined | null,
    source: ResponseNote["source"],
  ) => {
    const value = typeof text === "string" ? text.trim() : "";
    if (value) notes.push({ id, trigger, text: value, source });
    else unreviewed.push(trigger);
  };

  if (behavior) {
    sources.push(...behavior.sources);

    // Time of day is always worth stating: it is the cheapest thing an angler
    // can change, and the diel note applies whether or not light was declared.
    notes.push({
      id: "diel",
      trigger:
        input.light === "unknown"
          ? "Time of day"
          : `Light · ${labelOf(input.light)}`,
      text: `${labelOf(behavior.dielTendency.class)} tendency. ${behavior.dielTendency.note}`,
      source: "behavior",
    });

    notes.push({
      id: "feeding-mode",
      trigger: "How it feeds",
      text: `${behavior.feedingStrategy.modes.map(labelOf).join(" / ")}. ${behavior.feedingStrategy.note}`,
      source: "behavior",
    });

    if (input.clarity !== "unknown") {
      add("clarity", `Clarity · ${labelOf(input.clarity)}`, behavior.clarityResponse, "behavior");
    }

    if (input.weather === "frontal_change" || input.weather === "post_front") {
      add("front", `Weather · ${labelOf(input.weather)}`, behavior.coldFrontResponse, "behavior");
    }

    if (
      input.waterType === "flowing" &&
      (input.flow === "elevated" || input.flow === "high" || input.flow === "very_low")
    ) {
      add("flow", `Flow · ${labelOf(input.flow)}`, behavior.flowChangeResponse, "behavior");
    }

    if (
      input.waterType === "stillwater" &&
      (input.stillState === "rising" || input.stillState === "falling")
    ) {
      add(
        "level",
        `Water level · ${labelOf(input.stillState)}`,
        behavior.waterLevelResponse,
        "behavior",
      );
    }

    if (input.tempF != null || input.tempRangeF) {
      add("thermal", "Water temperature", behavior.thermalDrivenBehavior, "behavior");
    }

    if (behavior.anglingPressureResponse) {
      notes.push({
        id: "pressure",
        trigger: "Angling pressure",
        text: behavior.anglingPressureResponse,
        source: "behavior",
      });
    }

    if (behavior.depthMovement) {
      notes.push({
        id: "depth",
        trigger: "Depth movement",
        text: behavior.depthMovement,
        source: "behavior",
      });
    }
  }

  if (diet) {
    sources.push(...diet.sources);
    const seasonal =
      input.season !== "unknown"
        ? diet.seasonalDiet?.find((item) => item.season === input.season)
        : undefined;
    if (seasonal) {
      notes.push({
        id: "diet-season",
        trigger: `Diet · ${labelOf(input.season)}`,
        text: seasonal.emphasis,
        source: "diet",
      });
    }
    if (diet.preySizeShifts) {
      notes.push({
        id: "prey-size",
        trigger: "Prey size",
        text: diet.preySizeShifts,
        source: "diet",
      });
    }
    if (!input.forage && diet.observedForageRule) {
      notes.push({
        id: "forage-rule",
        trigger: "Nothing observed yet",
        text: diet.observedForageRule,
        source: "diet",
      });
    }
  }

  return {
    notes,
    unreviewed: [...new Set(unreviewed)],
    sources: dedupeSources(sources),
  };
}

export function dedupeSources(sources: DossierSource[]): DossierSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (seen.has(source.label)) return false;
    seen.add(source.label);
    return true;
  });
}
