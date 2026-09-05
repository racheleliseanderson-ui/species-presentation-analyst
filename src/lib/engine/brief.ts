import { alternatives } from "./alternatives.ts";
import { declaredHolding } from "./water.ts";
import { responseRead, seasonRead } from "./condition-read.ts";
import { EMPTY_OVERLAYS, type SpeciesOverlays } from "../knowledge/overlays.ts";
import type { Interpretation, ScenarioInput } from "../protocol/types.ts";
import { INSTRUMENT_NAME, labelOf } from "../protocol/vocab.ts";
import { temperatureEvidenceLabel } from "./temperature.ts";

/** Reader-facing names for the tackle requirements a presentation implies. */
const SYSTEM_LABEL: Record<string, string> = {
  depthControl: "Depth control",
  sensitivity: "Sensitivity",
  castingDistance: "Casting distance",
  lureWeightBand: "Weight range",
  coverResistance: "Cover resistance",
  lineVisibilityPreference: "Line visibility",
  retieFrequency: "Retie frequency",
};

function wrap(text: string, width = 78): string[] {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function freshness(
  reviewedAt: string,
  nextReviewAt: string,
  now = Date.now(),
): "current" | "review_due" | "stale" {
  const next = Date.parse(nextReviewAt);
  if (!Number.isFinite(next)) return "review_due";
  if (now > next + 90 * 24 * 60 * 60 * 1000) return "stale";
  if (now > next) return "review_due";
  void reviewedAt;
  return "current";
}

/** Reader-facing wording for how well a positioning statement is supported. */
const SUPPORT_WORD: Record<string, string> = {
  high: "well supported",
  moderate: "likely",
  low: "unconfirmed",
};

/** Reader-facing wording for where the water sits against the species' feeding band. */
const THERMAL_WORD: Record<string, string> = {
  preferred: "Inside the preferred band",
  active: "Active, but outside the preferred core",
  cold_refuge: "Cold side of the feeding band",
  warm_stress: "Warm side of the feeding band",
  unknown: "Not known",
};

/** Reader-facing wording for how current a reviewed record is. */
export function freshnessLabel(state: ReturnType<typeof freshness>): string {
  if (state === "current") return "up to date";
  if (state === "review_due") return "due for review";
  return "overdue for review";
}

/**
 * The paper that goes on the water.
 *
 * This is deliberately the whole reading, not a summary of it: it is printed or
 * copied precisely because the water is where there is no signal to re-read the
 * screen. Anything the app is willing to say on screen belongs here too — which
 * is why the season, tackle and fallback layers are in it rather than only in
 * the UI that introduced them.
 */
export function fieldBrief(
  input: ScenarioInput,
  result: Interpretation,
  overlays: SpeciesOverlays = EMPTY_OVERLAYS,
): string {
  const species = result.species;
  const declared = declaredHolding(input);
  const holding = declared ? labelOf(declared) : "not chosen";
  const temp =
    input.tempF == null
      ? "Temperature unknown"
      : `${input.tempF}°F · ${temperatureEvidenceLabel(input).replace("temperature unknown", "UNKNOWN")}`;
  const water = input.water.waterName || "No named public water added";

  const lines = [
    "SPECIES & PRESENTATION — FIELD BRIEF",
    `${species.commonNames[0]} · ${species.scientificName}`,
    `${temp} · ${labelOf(input.waterType)} · ${holding}`,
    water,
    result.populationContext
      ? `Population context · ${result.populationContext.label} · ${result.populationContext.systemArchetype.replaceAll("_", " ")}`
      : "Population context · generic species record",
    "",
    "THE READING (not a bite prediction)",
    result.why.split(/(?<=\.)\s+(?=[A-Z0-9])/).join("\n"),
    "",
    "MOST PLAUSIBLE POSITIONING",
    ...result.positioning.map((p) => `· ${SUPPORT_WORD[p.confidence] ?? p.confidence}: ${p.text}`),
    "",
    "HOW THIS WAS RANKED",
    "Species, season, water temperature, water type, holding water, and observed forage — all from what you declared.",
    result.populationContext
      ? `Regional context · explicitly declared · ${result.populationContext.label}`
      : "Regional context · none declared",
    "Ranking compares reviewed presentation jobs only. It is not a bite score.",
    "",
    ...seasonLines(input, overlays),
    ...responseLines(input, overlays),
    "PRESENTATION FAMILIES (jobs, not lures to buy — in order)",
    ...result.presentations.map((p, i) => `${String.fromCharCode(65 + i)}. ${p.label} — ${p.job}`),
    "",
    ...tackleLines(result),
    ...alternativeLines(input, result, overlays),
    "FORAGE",
    result.forageNote,
    `Classes: ${result.forageClasses.map(labelOf).join(", ")}`,
    "",
    "WHAT WOULD CHANGE THIS",
    ...result.invalidators.map((x) => `· ${x}`),
    "",
    result.unknowns.length
      ? `STILL UNKNOWN: ${result.unknowns.join(", ")}`
      : "STILL UNKNOWN: nothing left undeclared",
    "",
    `Record ${freshnessLabel(freshness(species.reviewedAt, species.nextReviewAt))} · reviewed ${species.reviewedAt} · next review ${species.nextReviewAt}`,
    ...species.sources.map((s) => `Source · ${s.class.replaceAll("_", " ")} · ${s.label}`),
    "",
    `${INSTRUMENT_NAME} · Hook the Horizon · coordinates not stored`,
    "This is an account of plausibility, not a prediction that fish will bite.",
  ];
  return lines.join("\n");
}

/** Where the fish should be this season, from the reviewed calendar. */
function seasonLines(input: ScenarioInput, overlays: SpeciesOverlays): string[] {
  const read = seasonRead(input, overlays);
  if (read.status === "no_season") {
    return [
      "WHERE IT SHOULD BE",
      "Season undeclared, so the reviewed seasonal calendar was not applied.",
      "",
    ];
  }
  if (read.status === "no_calendar") {
    return ["WHERE IT SHOULD BE", "No reviewed seasonal calendar exists for this species yet.", ""];
  }
  if (read.status === "no_entry") {
    return [
      "WHERE IT SHOULD BE",
      `The reviewed calendar covers ${read.covered.map(labelOf).join(", ")} — not the season declared.`,
      "",
    ];
  }
  return [
    `WHERE IT SHOULD BE — ${labelOf(read.declared).toUpperCase()}`,
    ...(read.exact
      ? []
      : wrap(
          `(Nearest reviewed entry: ${labelOf(read.matched)}. Not a statement about ${labelOf(read.declared).toLowerCase()} specifically.)`,
        )),
    ...wrap(read.overview),
    ...read.rows.flatMap((row) => wrap(`· ${row.label}: ${row.value}`)),
    ...(read.presentationImplication
      ? ["", ...wrap(`Implies: ${read.presentationImplication}`)]
      : []),
    ...(read.conservationNote ? ["", ...wrap(`Conservation: ${read.conservationNote}`)] : []),
    "",
  ];
}

/** What it is responding to, for the conditions actually declared. */
function responseLines(input: ScenarioInput, overlays: SpeciesOverlays): string[] {
  const read = responseRead(input, overlays);
  if (read.notes.length === 0) return [];
  return [
    "WHAT IT IS RESPONDING TO",
    ...read.notes.flatMap((note) => wrap(`· ${note.trigger} — ${note.text}`)),
    "",
  ];
}

/** What the tackle has to deliver for the leading family. */
function tackleLines(result: Interpretation): string[] {
  const top = result.presentations[0];
  const equipment = result.equipment as Record<string, string>;
  const rows = Object.entries(equipment).filter(([, value]) => value);
  return [
    "WHAT THE TACKLE HAS TO DO",
    top
      ? `Follows from ${top.label}. Change the family and these change with it.`
      : "No family ranked.",
    ...rows.map(
      ([key, value]) => `· ${SYSTEM_LABEL[key] ?? key}: ${String(value).replaceAll("_", " ")}`,
    ),
    "",
    ...wrap(`Connection: ${result.connection.intent}`),
    ...(result.connection.jobUndeclared
      ? wrap(`Not settled here: ${result.connection.jobUndeclared}`)
      : []),
    ...(result.connection.retieFrequency ? [`Retie: ${result.connection.retieFrequency}`] : []),
    `Priorities: ${result.connection.priorities.map((p) => p.replaceAll("_", " ")).join(" · ")}`,
    ...(result.rigQuestion ? ["", ...wrap(`Check the rig: ${result.rigQuestion}`)] : []),
    "",
  ];
}

/** The ordered fallback plan, cheapest change first. */
function alternativeLines(
  input: ScenarioInput,
  result: Interpretation,
  overlays: SpeciesOverlays,
): string[] {
  const moves = alternatives(input, result, overlays);
  if (moves.length === 0) return [];
  return [
    "IF IT ISN'T WORKING (in order — one change at a time)",
    ...moves.flatMap((move, index) => [
      ...wrap(`${String(index + 1).padStart(2, "0")}. ${move.symptom}`),
      ...wrap(`    → ${move.move}`),
      ...wrap(`    ${move.why}`),
    ]),
    "Give each change a fair trial before the next one.",
    "",
  ];
}

export function packetSummary(
  input: ScenarioInput,
  result: Interpretation,
): { label: string; value: string }[] {
  const declared = declaredHolding(input);
  const holding = declared ? labelOf(declared) : "not chosen";
  return [
    {
      label: "Species",
      value: `${result.species.commonNames[0]} (${result.species.scientificName})`,
    },
    { label: "Water", value: input.water.waterName || "No named public water added" },
    { label: "Water type", value: labelOf(input.waterType) },
    {
      label: "Population context",
      value: result.populationContext
        ? `${result.populationContext.label} · ${result.populationContext.lifeHistory.replaceAll("_", " ")}`
        : "Generic species record",
    },
    {
      label: "Temperature",
      value: temperatureEvidenceLabel(input).replace("temperature unknown", "Unknown"),
    },
    { label: "Holding water", value: holding },
    { label: "Season", value: labelOf(input.season) },
    { label: "Water temperature", value: THERMAL_WORD[result.thermalState] ?? "Not known" },
    { label: "Forage", value: input.forage ? labelOf(input.forage.class) : "Not observed" },
    { label: "Ranking", value: "Reviewed presentations only · no bite score" },
    { label: "Families", value: result.presentations.map((p) => p.label).join(" · ") },
    { label: "Coordinates", value: "Not included" },
    { label: "Bite score", value: "Not included" },
  ];
}
