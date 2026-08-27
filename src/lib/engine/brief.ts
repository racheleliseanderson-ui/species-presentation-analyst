import type { Interpretation, ScenarioInput } from "../protocol/types.ts";
import { INSTRUMENT_ID, PACKET_VERSION, labelOf } from "../protocol/vocab.ts";

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
  const temp =
    input.tempF == null ? "UNKNOWN" : `${input.tempF}°F · ${labelOf(input.tempSource)}`;
  const water = input.water.waterName || "Named public water undeclared";

  const lines = [
    "SPECIES & PRESENTATION — FIELD BRIEF",
    `${species.commonNames[0]} · ${species.scientificName}`,
    `${temp} · ${labelOf(input.waterType)} · ${holding}`,
    water,
    "",
    "THE READING (not a bite prediction)",
    result.why.split(/(?<=\.)\s+(?=[A-Z0-9])/).join("\n"),
    "",
    "MOST PLAUSIBLE POSITIONING",
    ...result.positioning.map((p) => `· ${p.confidence}: ${p.text}`),
    "",
    "PRESENTATION FAMILIES (jobs, not lure SKUs)",
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
    result.unknowns.length ? `STILL UNKNOWN: ${result.unknowns.join(", ")}` : "STILL UNKNOWN: none declared",
    "",
    `Record ${freshness(species.reviewedAt, species.nextReviewAt)} · reviewed ${species.reviewedAt} · next ${species.nextReviewAt}`,
    ...species.sources.map((s) => `Source · ${s.class.replaceAll("_", " ")} · ${s.label}`),
    "",
    `${INSTRUMENT_ID} · packet ${PACKET_VERSION} · coordinates not stored`,
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
      label: "Temperature",
      value: input.tempF == null ? "Unknown" : `${input.tempF}°F · ${labelOf(input.tempSource)}`,
    },
    { label: "Holding", value: holding },
    { label: "Families", value: result.presentations.map((p) => p.label).join(" · ") },
    { label: "Coordinates", value: "Not included" },
    { label: "Bite score", value: "Not included" },
  ];
}
