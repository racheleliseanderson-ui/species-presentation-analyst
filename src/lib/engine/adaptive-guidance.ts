import { interpret } from "./infer.ts";
import { SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import type {
  Interpretation,
  RankedPresentation,
  ScenarioInput,
} from "../protocol/types.ts";
import type { RiverHolding, StillHolding } from "../protocol/vocab.ts";
import { labelOf } from "../protocol/vocab.ts";

export type AdaptiveQuestionId =
  | "temperature"
  | "time"
  | "holding"
  | "forage"
  | "clarity";

export type AdaptiveQuestion = {
  id: AdaptiveQuestionId;
  prompt: string;
  reason: string;
};

export type RangeAssessment = {
  lowF: number;
  highF: number;
  stable: boolean;
  lowResult: Interpretation | null;
  highResult: Interpretation | null;
  lowTop: RankedPresentation | null;
  highTop: RankedPresentation | null;
};

export type CoarseHoldingChoice = {
  id: string;
  label: string;
  detail: string;
  holding: RiverHolding | StillHolding;
};

function interpretation(input: ScenarioInput): Interpretation | null {
  const result = interpret(input);
  return "error" in result ? null : result;
}

function topId(input: ScenarioInput): string | null {
  return interpretation(input)?.presentations[0]?.id ?? null;
}

function distinctTopIds(inputs: ScenarioInput[]): string[] {
  return [
    ...new Set(
      inputs
        .map((input) => topId(input))
        .filter((id): id is string => Boolean(id)),
    ),
  ];
}

function temperatureCouldMatter(input: ScenarioInput): boolean {
  const species = SPECIES_BY_ID[input.speciesId];
  if (!species) return false;

  const preferredMid = Math.round(
    (species.thermal.preferredF[0] + species.thermal.preferredF[1]) / 2,
  );
  const coldProbe = Math.max(32, Math.round(species.thermal.coldEdgeF - 2));
  const warmProbe = Math.round(species.thermal.warmEdgeF + 2);

  return (
    distinctTopIds([
      { ...input, tempF: coldProbe, tempSource: "estimated" },
      { ...input, tempF: preferredMid, tempSource: "estimated" },
      { ...input, tempF: warmProbe, tempSource: "estimated" },
    ]).length > 1
  );
}

function lightCouldMatter(input: ScenarioInput): boolean {
  return (
    distinctTopIds([
      { ...input, light: "low_light" },
      { ...input, light: "bright" },
      { ...input, light: "night" },
    ]).length > 1
  );
}

function forageCouldMatter(input: ScenarioInput): boolean {
  const species = SPECIES_BY_ID[input.speciesId];
  if (!species) return false;
  const classes = species.forageClasses.slice(0, 5);
  if (classes.length < 2) return false;

  const variants = classes.map(
    (forageClass): ScenarioInput => ({
      ...input,
      forage: { class: forageClass, source: "user_observation" },
    }),
  );
  return distinctTopIds([input, ...variants]).length > 1;
}

function holdingCouldMatter(input: ScenarioInput): boolean {
  const choices = coarseHoldingChoices(input);
  if (choices.length < 2) return false;
  const variants = choices.map((choice): ScenarioInput =>
    input.waterType === "flowing"
      ? {
          ...input,
          holdingRiver: choice.holding as RiverHolding,
          holdingStill: null,
        }
      : {
          ...input,
          holdingRiver: null,
          holdingStill: choice.holding as StillHolding,
        },
  );
  return distinctTopIds([input, ...variants]).length > 1;
}

function clarityCouldMatter(input: ScenarioInput): boolean {
  return (
    distinctTopIds([
      { ...input, clarity: "clear" },
      { ...input, clarity: "stained" },
      { ...input, clarity: "turbid" },
    ]).length > 1
  );
}

export function nextAdaptiveQuestion(
  input: ScenarioInput,
  options: { hasTemperatureRange?: boolean } = {},
): AdaptiveQuestion | null {
  if (input.tempF == null && !options.hasTemperatureRange && temperatureCouldMatter(input)) {
    return {
      id: "temperature",
      prompt: "Do you know roughly how warm the water is?",
      reason:
        "Temperature can change the leading presentation family for this species. An approximate range is enough; an exact number is not required.",
    };
  }

  const holding = input.waterType === "flowing" ? input.holdingRiver : input.holdingStill;
  if (!holding && holdingCouldMatter(input)) {
    return {
      id: "holding",
      prompt: "What kind of water are you actually looking at?",
      reason:
        "The broad structure you are fishing can change the mechanical job. You do not need to classify a technical holding-water term.",
    };
  }

  if (!input.forage && forageCouldMatter(input)) {
    return {
      id: "forage",
      prompt: "Are you seeing an obvious food source?",
      reason:
        "A real forage observation can move the leading family. If you are not seeing anything, leave it unknown.",
    };
  }

  if (input.light === "unknown" && lightCouldMatter(input)) {
    return {
      id: "time",
      prompt: "About what time of day are you fishing?",
      reason:
        "Light is only a secondary modifier, but for this reading it can change the leading family.",
    };
  }

  if (input.clarity === "unknown" && clarityCouldMatter(input)) {
    return {
      id: "clarity",
      prompt: "Is the water mostly clear or stained?",
      reason:
        "Clarity can change the most defensible presentation mechanics here. A broad answer is enough.",
    };
  }

  return null;
}

export function assessTemperatureRange(
  input: ScenarioInput,
  lowF: number,
  highF: number,
): RangeAssessment | null {
  if (!Number.isFinite(lowF) || !Number.isFinite(highF)) return null;
  const low = Math.min(lowF, highF);
  const high = Math.max(lowF, highF);
  if (low < 20 || high > 100 || high - low > 35) return null;

  const lowResult = interpretation({
    ...input,
    tempF: low,
    tempSource: "estimated",
  });
  const highResult = interpretation({
    ...input,
    tempF: high,
    tempSource: "estimated",
  });
  const lowTop = lowResult?.presentations[0] ?? null;
  const highTop = highResult?.presentations[0] ?? null;

  return {
    lowF: low,
    highF: high,
    stable: Boolean(lowTop && highTop && lowTop.id === highTop.id),
    lowResult,
    highResult,
    lowTop,
    highTop,
  };
}

function firstReviewed<T extends string>(
  reviewed: readonly T[],
  candidates: readonly T[],
): T | null {
  return candidates.find((candidate) => reviewed.includes(candidate)) ?? null;
}

export function coarseHoldingChoices(input: ScenarioInput): CoarseHoldingChoice[] {
  const species = SPECIES_BY_ID[input.speciesId];
  if (!species) return [];

  if (input.waterType === "flowing") {
    const reviewed = species.habitat.riverHolding;
    const groups: Array<{
      id: string;
      label: string;
      detail: string;
      candidates: RiverHolding[];
    }> = [
      {
        id: "feeding-lane",
        label: "Current / feeding lane",
        detail: "Run, riffle transition, pool head or other food-delivery water",
        candidates: ["run", "riffle_to_run", "pool_head", "riffle"],
      },
      {
        id: "current-edge",
        label: "Current edge / slower water beside current",
        detail: "Seam, current break, eddy or pocket beside faster water",
        candidates: ["seam", "current_break", "eddy", "boulder_pocket"],
      },
      {
        id: "deep-slow",
        label: "Deep / slower water",
        detail: "Pool, deep pool or slower refuge water",
        candidates: ["deep_pool", "pool_tail", "run"],
      },
      {
        id: "cover-edge",
        label: "Bank / wood / cover",
        detail: "Undercut bank, submerged wood, side channel or protected edge",
        candidates: ["undercut_bank", "submerged_wood", "side_channel"],
      },
    ];

    return groups.flatMap((group) => {
      const holding = firstReviewed(reviewed, group.candidates);
      return holding ? [{ ...group, holding }] : [];
    });
  }

  const reviewed = species.habitat.stillHolding;
  const groups: Array<{
    id: string;
    label: string;
    detail: string;
    candidates: StillHolding[];
  }> = [
    {
      id: "cover",
      label: "Vegetation / wood / shade",
      detail: "Weed edge, wood, dock shade or similar cover",
      candidates: ["weed_edge", "outside_weedline", "wood", "dock_shade"],
    },
    {
      id: "hard-structure",
      label: "Point / rock / break",
      detail: "Point, breakline, drop-off, hump, riprap or rocky shoreline",
      candidates: ["breakline", "point", "drop_off", "submerged_hump", "rocky_shoreline"],
    },
    {
      id: "open-deep",
      label: "Open / deeper water",
      detail: "Suspended fish, basin or thermocline-related water",
      candidates: ["suspended_open", "basin", "thermocline_edge"],
    },
    {
      id: "shallow-edge",
      label: "Shallow / shoreline edge",
      detail: "Flat, inlet, outlet or shallow margin",
      candidates: ["shallow_flat", "inlet", "outlet"],
    },
  ];

  return groups.flatMap((group) => {
    const holding = firstReviewed(reviewed, group.candidates);
    return holding ? [{ ...group, holding }] : [];
  });
}

export function describeRangeAssessment(range: RangeAssessment): string {
  if (!range.lowTop || !range.highTop) {
    return "The range could not be resolved against the reviewed record.";
  }
  if (range.stable) {
    return `${range.lowTop.label} stays the leading family at both ${range.lowF}°F and ${range.highF}°F. The range is useful without inventing an exact midpoint.`;
  }
  return `${range.lowF}°F favors ${range.lowTop.label}, while ${range.highF}°F favors ${range.highTop.label}. This range crosses a decision boundary, so an exact water temperature would materially sharpen the read.`;
}

export function holdingChoiceLabel(choice: CoarseHoldingChoice): string {
  return `${choice.label} · maps to reviewed ${labelOf(choice.holding)} mechanics`;
}
