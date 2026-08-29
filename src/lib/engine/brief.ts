import type { Interpretation, ScenarioInput } from "../protocol/types.ts";
import { INSTRUMENT_NAME, labelOf } from "../protocol/vocab.ts";
import { temperatureEvidenceLabel } from "./temperature.ts";

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

export function fieldBrief(input: ScenarioInput, result: Interpretation): string {
  const species = result.species;
  const holding =
    input.waterType === "flowing"
      ? input.holdingRiver
        ? labelOf(input.holdingRiver)
        : "not chosen"
      : input.holdingStill
        ? labelOf(input.holdingStill)
        : "not chosen";
  const temp =
    input.tempF == null ? "Temperature unknown" : `${input.tempF}°F · ${temperatureEvidenceLabel(input).replace("temperature unknown", "UNKNOWN")}`;
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
    "PRESENTATION FAMILIES (jobs, not lures to buy — in order)",
    ...result.presentations.map(
      (p, i) => `${String.fromCharCode(65 + i)}. ${p.label} — ${p.job}`,
    ),
    "",
    "FORAGE",
    result.forageNote,
    `Classes: ${result.forageClasses.map(labelOf).join(", ")}`,
    "",
    "WHAT WOULD CHANGE THIS",
    ...result.invalidators.map((x) => `· ${x}`),
    "",
    result.unknowns.length ? `STILL UNKNOWN: ${result.unknowns.join(", ")}` : "STILL UNKNOWN: nothing left undeclared",
    "",
    `Record ${freshnessLabel(freshness(species.reviewedAt, species.nextReviewAt))} · reviewed ${species.reviewedAt} · next review ${species.nextReviewAt}`,
    ...species.sources.map((s) => `Source · ${s.class.replaceAll("_", " ")} · ${s.label}`),
    "",
    `${INSTRUMENT_NAME} · Hook the Horizon · coordinates not stored`,
    "This is an account of plausibility, not a prediction that fish will bite.",
  ];
  return lines.join("\n");
}

export function packetSummary(input: ScenarioInput, result: Interpretation): { label: string; value: string }[] {
  const holding =
    input.waterType === "flowing"
      ? input.holdingRiver
        ? labelOf(input.holdingRiver)
        : "not chosen"
      : input.holdingStill
        ? labelOf(input.holdingStill)
        : "not chosen";
  return [
    { label: "Species", value: `${result.species.commonNames[0]} (${result.species.scientificName})` },
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
