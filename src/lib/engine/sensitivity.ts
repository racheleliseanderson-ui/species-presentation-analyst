import { interpret } from "./infer.ts";
import type { ScenarioInput } from "../protocol/types.ts";
import { labelOf } from "../protocol/vocab.ts";

export type Driver = {
  variable: string;
  from: string;
  to: string;
  familyBefore: string;
  familyAfter: string;
};

function topFamily(input: ScenarioInput): string | null {
  const r = interpret(input);
  if ("error" in r) return null;
  return r.presentations[0]?.label ?? null;
}

/** Single-variable flips that actually change the leading presentation family. */
export function drivingChanges(input: ScenarioInput): Driver[] {
  const before = topFamily(input);
  if (!before) return [];

  const variants: { variable: string; from: string; to: string; next: ScenarioInput }[] = [];

  if (input.tempF != null) {
    variants.push({
      variable: "Water temperature",
      from: `${input.tempF}°F`,
      to: `${input.tempF + 8}°F`,
      next: { ...input, tempF: input.tempF + 8 },
    });
    variants.push({
      variable: "Water temperature",
      from: `${input.tempF}°F`,
      to: `${input.tempF - 8}°F`,
      next: { ...input, tempF: input.tempF - 8 },
    });
  }

  if (input.light === "low_light" || input.light === "night") {
    variants.push({
      variable: "Light",
      from: labelOf(input.light),
      to: "Bright",
      next: { ...input, light: "bright" },
    });
  } else if (input.light === "bright") {
    variants.push({
      variable: "Light",
      from: "Bright",
      to: "Low light",
      next: { ...input, light: "low_light" },
    });
  }

  if (input.clarity === "clear" || input.clarity === "very_clear") {
    variants.push({
      variable: "Clarity",
      from: labelOf(input.clarity),
      to: "Stained",
      next: { ...input, clarity: "stained" },
    });
  } else if (input.clarity === "stained" || input.clarity === "turbid") {
    variants.push({
      variable: "Clarity",
      from: labelOf(input.clarity),
      to: "Clear",
      next: { ...input, clarity: "clear" },
    });
  }

  if (!input.forage) {
    variants.push({
      variable: "Observed forage",
      from: "Not observed",
      to: "Emerging insects",
      next: { ...input, forage: { class: "emerging_insects", source: "user_observation" } },
    });
    variants.push({
      variable: "Observed forage",
      from: "Not observed",
      to: "Small forage fish",
      next: { ...input, forage: { class: "small_forage_fish", source: "user_observation" } },
    });
  }

  const seen = new Set<string>();
  const out: Driver[] = [];
  for (const v of variants) {
    const after = topFamily(v.next);
    if (!after || after === before) continue;
    const key = `${v.variable}:${v.to}:${after}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      variable: v.variable,
      from: v.from,
      to: v.to,
      familyBefore: before,
      familyAfter: after,
    });
    if (out.length >= 4) break;
  }
  return out;
}
