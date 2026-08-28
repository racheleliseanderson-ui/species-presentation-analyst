import type { PresentationWeightReason } from "../protocol/types.ts";
import type { WeightedPresentationCandidate } from "./presentation-weighting.ts";
import type { PopulationContextProfile } from "./population-context.ts";

/**
 * RPC deltas are applied only to candidates already emitted by SPW/SPO.
 * A population profile cannot add a presentation family that the species record
 * did not approve for the declared water type.
 */
export function applyPopulationContextWeighting(
  candidates: WeightedPresentationCandidate[],
  profile: PopulationContextProfile | null,
): WeightedPresentationCandidate[] {
  if (!profile) return candidates;

  const next = candidates.map((candidate) => {
    const delta = profile.bias[candidate.id] ?? 0;
    if (!delta) return candidate;
    const reason: PresentationWeightReason = {
      axis: "population_context",
      delta,
      note: `${profile.id} · ${profile.label} · ${profile.note}`,
    };
    return {
      ...candidate,
      weight: candidate.weight + delta,
      reasons: [...candidate.reasons, reason],
    };
  });

  return next.sort((a, b) => b.weight - a.weight || a.baseIndex - b.baseIndex);
}
