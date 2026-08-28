import type { Interpretation, ScenarioInput } from "../protocol/types.ts";
import { labelOf } from "../protocol/vocab.ts";
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

export function fieldBrief(input: ScenarioInput, result: Interpretation): string {
  const species = result.species;
  const holding =
    input.waterType === "flowing"
      ? input.holdingRiver
        ? labelOf(input.holdingRiver)
        : "undeclared"
      : input.holdingStill
        ? labelOf(input.holdingStill)
        : "undeclared";
  const temp = temperatureEvidenceLabel(input).replace("temperature unknown", "UNKNOWN");
  const water = input.water.waterName || "Named public water undeclared";

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
    ...result.positioning.map((p) => `· ${p.confidence}: ${p.text}`),
    "",
    "RANKED BY species, season, water temperature, water type, holding water, and forage",
    result.populationContext
      ? `Declared population context · ${result.populationContext.label}`
      : "No extra regional population context applied",
    "Relative family ranks are reasons to prefer one job over another. They are not a bite score.",
    "",
    "PRESENTATION FAMILIES (jobs, not lure SKUs)",
    ...result.presentations.map(
      (p, i) => `${String.fromCharCode(65 + i)}. ${p.label} — ${p.job} · rank ${p.weight}`,
    ),
    "",
    "FORAGE",
    result.forageNote,
    `Classes: ${result.forageClasses.map(labelOf).join(", ")}`,
    "",
    "WHAT WOULD CHANGE THIS",
    ...result.invalidators.map((x) => `· ${x}`),
    "",
    result.unknowns.length ? `STILL UNKNOWN: ${result.unknowns.join(", ")}` : "STILL UNKNOWN: none declared",
    "",
    `Record ${freshness(species.reviewedAt, species.nextReviewAt)} · reviewed ${species.reviewedAt} · next ${species.nextReviewAt}`,
    ...species.sources.map((s) => `Source · ${s.class.replaceAll("_", " ")} · ${s.label}`),
    "",
    "Coordinates not stored",
    "This is an account of plausibility, not a prediction that fish will bite.",
  ];
  return lines.join("\n");
}

export function packetSummary(input: ScenarioInput, result: Interpretation): { label: string; value: string }[] {
  const holding =
    input.waterType === "flowing"
      ? input.holdingRiver
        ? labelOf(input.holdingRiver)
        : "undeclared"
      : input.holdingStill
        ? labelOf(input.holdingStill)
        : "undeclared";
  return [
    { label: "Species", value: `${result.species.commonNames[0]} (${result.species.scientificName})` },
    { label: "Water", value: input.water.waterName || "Undeclared named public water" },
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
    { label: "Holding", value: holding },
    { label: "Season", value: labelOf(input.season) },
    { label: "Thermal", value: result.thermalState.replaceAll("_", " ") },
    { label: "Forage", value: input.forage ? labelOf(input.forage.class) : "undeclared" },
    {
      label: "Ranked by",
      value: "species, season, water temperature, water type, holding water, and forage",
    },
    { label: "Families", value: result.presentations.map((p) => p.label).join(" · ") },
    { label: "Coordinates", value: "Not included" },
    { label: "Bite score", value: "Not included" },
  ];
}
