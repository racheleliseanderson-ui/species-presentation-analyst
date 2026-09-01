/**
 * "It isn't working — now what?"
 *
 * The reading ranks families by plausibility. This module answers the question
 * an angler actually asks an hour later: given a symptom on the water, which
 * reviewed change is the next one to make, and why.
 *
 * Every move here is assembled from records that already exist — the ranked
 * families, the species' reviewed holding-water classes, and the reviewed
 * behavior dossier. No new family, location or tactic is invented, and when a
 * record has nothing to say the alternative is simply not offered.
 */

import type { SpeciesOverlays } from "../knowledge/overlays.ts";
import type { Interpretation, RankedPresentation, ScenarioInput } from "../protocol/types.ts";
import { labelOf } from "../protocol/vocab.ts";

export type Alternative = {
  id: string;
  /** What the angler is seeing. */
  symptom: string;
  /** The single change to make. */
  move: string;
  /** The reviewed reason the change is worth making. */
  why: string;
  /** The family this move switches to, when it switches family at all. */
  family?: { id: string; label: string };
};

/** The axis on which two families differ most, in reader-facing words. */
function contrast(a: RankedPresentation, b: RankedPresentation): string | null {
  const axes: [keyof typeof a.system & string, string][] = [
    ["depthControl", "how precisely depth is held"],
    ["castingDistance", "how far from the fish you stay"],
    ["coverResistance", "how much cover it can be fished in"],
    ["lureWeightBand", "how much weight it carries"],
    ["lineVisibilityPreference", "how visible the terminal end is"],
  ];
  for (const [key, phrase] of axes) {
    const left = a.system[key];
    const right = b.system[key];
    if (left && right && left !== right) {
      return `${phrase} (${String(left).replaceAll("_", " ")} → ${String(right).replaceAll("_", " ")})`;
    }
  }
  return null;
}

export function alternatives(
  input: ScenarioInput,
  result: Interpretation,
  overlays: SpeciesOverlays,
): Alternative[] {
  const out: Alternative[] = [];
  const [first, second, third] = result.presentations;
  if (!first) return out;

  // 1. Right water, wrong presentation. The next-ranked family is the cheapest
  //    change because the holding-water read does not have to be wrong.
  if (second) {
    const axis = contrast(first, second);
    out.push({
      id: "next-family",
      symptom: "You are covering the water you meant to cover and nothing is responding.",
      move: `Switch to ${second.label} before you move your feet.`,
      why: `${second.job} It differs from ${first.label} mainly in ${axis ?? "the job it asks the bait to do"}, so it tests a different explanation of the same water.`,
      family: { id: second.id, label: second.label },
    });
  }

  // 2. Right presentation, wrong water. Reviewed holding classes the angler has
  //    not declared — never a coordinate, always a class of structure.
  const declared = input.waterType === "flowing" ? input.holdingRiver : input.holdingStill;
  const reviewed =
    input.waterType === "flowing"
      ? result.species.habitat.riverHolding
      : result.species.habitat.stillHolding;
  const untried = reviewed.filter((item) => item !== declared).slice(0, 3);
  if (untried.length > 0) {
    out.push({
      id: "next-water",
      symptom: "The presentation looks right but you are not finding fish at all.",
      move: `Move to ${untried.map((item) => labelOf(item)).join(", ")} before changing anything else.`,
      why: declared
        ? `These are also reviewed holding-water classes for this species in ${labelOf(input.waterType)}. ${labelOf(declared)} may simply not be holding fish today.`
        : `You have not declared a holding-water class yet, so the reading is ranking on everything except position. These are the reviewed classes for this species in ${labelOf(input.waterType)}.`,
    });
  }

  // 3. Time of day, from the reviewed diel note — the change that costs nothing
  //    but patience, and the one anglers skip most often.
  const behavior = overlays.behavior;
  if (behavior && (input.light === "bright" || input.light === "mixed")) {
    out.push({
      id: "time-of-day",
      symptom: "Everything looks right and the water is still dead.",
      move: "Fish the same water again at the edges of the day rather than changing tactics.",
      why: `${labelOf(behavior.dielTendency.class)} tendency. ${behavior.dielTendency.note}`,
    });
  }

  // 4. A third mechanical option, offered only when it is genuinely different
  //    from the first two rather than a near-duplicate of the runner-up.
  if (third && second && contrast(second, third)) {
    out.push({
      id: "third-family",
      symptom: "Both of the first two families have had a fair, uninterrupted trial.",
      move: `Try ${third.label}.`,
      why: `${third.job} This is the last family the reviewed record ranks for these conditions — past this point the declaration itself is more likely wrong than the presentation.`,
      family: { id: third.id, label: third.label },
    });
  }

  // 5. Stop and re-declare. The honest end of the list.
  const missing = result.unknowns.slice(0, 3);
  if (missing.length > 0) {
    out.push({
      id: "redeclare",
      symptom: "Nothing above has changed the result.",
      move: `Measure or observe ${missing.join(", ")}, then read it again.`,
      why: "These are the inputs this reading is currently guessing around. Filling one of them in changes the ranking honestly, where trying another lure does not.",
    });
  }

  return out;
}
