import { interpret } from "./infer.ts";
import { declareHolding, declaredHolding } from "./water.ts";
import { normalizeTemperatureRangeF } from "./temperature.ts";
import { SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import type { Interpretation, RankedPresentation, ScenarioInput } from "../protocol/types.ts";
import { isMarine } from "../protocol/vocab.ts";
import type { MarineHolding, RiverHolding, StillHolding } from "../protocol/vocab.ts";
import { labelOf } from "../protocol/vocab.ts";

export type AdaptiveQuestionId = "temperature" | "time" | "holding" | "forage" | "clarity" | "tide";

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
  holding: RiverHolding | StillHolding | MarineHolding;
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
    ...new Set(inputs.map((input) => topId(input)).filter((id): id is string => Boolean(id))),
  ];
}

function temperatureCouldMatter(input: ScenarioInput): boolean {
  const species = SPECIES_BY_ID[input.speciesId];
  if (!species?.thermal) return false;

  // Probe the reviewed band at three points and see whether the ranking moves.
  // With no band there is nothing to probe: measuring the water would change
  // nothing about this reading, so the app must not ask the angler to go and
  // do it. Where only part of the band is reviewed, probe from what exists —
  // an edge alone still tells us which temperatures are worth testing.
  const thermal = species.thermal;
  const inner = thermal.preferredF ?? thermal.activeF;
  const cold = thermal.coldEdgeF ?? inner?.[0];
  const warm = thermal.warmEdgeF ?? inner?.[1];
  if (cold == null && warm == null) return false;

  const preferredMid = inner
    ? Math.round((inner[0] + inner[1]) / 2)
    : Math.round(((cold ?? warm!) + (warm ?? cold!)) / 2);
  const coldProbe = Math.max(32, Math.round((cold ?? preferredMid) - 2));
  const warmProbe = Math.round((warm ?? preferredMid) + 2);

  return (
    distinctTopIds([
      { ...input, tempF: coldProbe, tempRangeF: null, tempSource: "estimated" },
      { ...input, tempF: preferredMid, tempRangeF: null, tempSource: "estimated" },
      { ...input, tempF: warmProbe, tempRangeF: null, tempSource: "estimated" },
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

  const variants = classes.map((forageClass): ScenarioInput => ({
    ...input,
    forage: { class: forageClass, source: "user_observation" },
  }));
  return distinctTopIds([input, ...variants]).length > 1;
}

function holdingCouldMatter(input: ScenarioInput): boolean {
  const choices = coarseHoldingChoices(input);
  if (choices.length < 2) return false;
  const variants = choices.map((choice): ScenarioInput => ({
    ...input,
    ...declareHolding(input.waterType, choice.holding),
  }));
  return distinctTopIds([input, ...variants]).length > 1;
}

function tideCouldMatter(input: ScenarioInput): boolean {
  if (!isMarine(input.waterType)) return false;
  return (
    distinctTopIds([
      { ...input, tideMovement: "flooding" },
      { ...input, tideMovement: "ebbing" },
      { ...input, tideMovement: "slack_low" },
    ]).length > 1
  );
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
  const hasRange = normalizeTemperatureRangeF(input.tempRangeF) != null;
  if (
    input.tempF == null &&
    !hasRange &&
    !options.hasTemperatureRange &&
    temperatureCouldMatter(input)
  ) {
    return {
      id: "temperature",
      prompt: "Do you know roughly how warm the water is?",
      reason:
        "Temperature can change the leading presentation family for this species. An approximate range is enough; an exact number is not required.",
    };
  }

  // Asked before holding water on saltwater, because on the marine records the
  // tide is what most often changes the answer — and because an angler knows
  // what the tide is doing without having to classify anything.
  if (
    isMarine(input.waterType) &&
    (!input.tideMovement || input.tideMovement === "unknown") &&
    tideCouldMatter(input)
  ) {
    return {
      id: "tide",
      prompt: "What is the tide doing?",
      reason:
        "On saltwater the tide is the movement this reading is ranked on, the way flow is on a river. It changes the leading family for this species.",
    };
  }

  const holding = declaredHolding(input);
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
  const range = normalizeTemperatureRangeF([lowF, highF]);
  if (!range) return null;
  const [low, high] = range;

  const lowResult = interpretation({
    ...input,
    tempF: low,
    tempRangeF: null,
    tempSource: "estimated",
  });
  const highResult = interpretation({
    ...input,
    tempF: high,
    tempRangeF: null,
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

  if (input.waterType === "stillwater") {
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

  // Saltwater. Quick Read exists for someone who does not yet know the
  // vocabulary, so these are the shapes of water a person can actually see from
  // where they are standing, each mapping onto a reviewed holding class.
  const reviewed = species.habitat.marineHolding?.[input.waterType] ?? [];
  const marineGroups: Array<{
    id: string;
    label: string;
    detail: string;
    candidates: MarineHolding[];
  }> = [
    {
      id: "shallow-feeding-ground",
      label: "Shallow feeding ground",
      detail: "Grass flat, sand hole or open shallow bottom",
      candidates: ["grass_flat", "sand_hole", "shell_bank"],
    },
    {
      id: "moving-water-edge",
      label: "Where the water is moving",
      detail: "Creek mouth, channel edge, rip, inlet or cut",
      candidates: [
        "creek_mouth",
        "tidal_creek",
        "channel_edge",
        "rip_channel",
        "beach_cut",
        "inlet_mouth",
        "current_rip",
      ],
    },
    {
      id: "hard-structure",
      label: "Hard structure",
      detail: "Reef, wreck, rock, jetty, piling or dock",
      candidates: [
        "nearshore_reef",
        "artificial_reef",
        "wreck",
        "rock_pile",
        "jetty_wash",
        "bridge_piling",
        "pier_structure",
        "oyster_bar",
        "deep_wreck",
        "offshore_ledge",
      ],
    },
    {
      id: "vegetated-edge",
      label: "Vegetated or overhanging edge",
      detail: "Marsh grass, mangrove, kelp or a weed line",
      candidates: ["marsh_edge", "mangrove_edge", "kelp_edge", "weed_line"],
    },
    {
      id: "beach-bar",
      label: "Bar or trough off the beach",
      detail: "The trough at your feet, or the bar beyond it",
      candidates: ["surf_trough", "inner_sandbar", "outer_sandbar", "surf_point"],
    },
    {
      id: "open-water-sign",
      label: "Open water with something showing",
      detail: "Bait on the surface, a colour change or a rip line",
      candidates: [
        "open_bait_school",
        "temperature_break",
        "nearshore_hump",
        "seamount",
        "canyon_edge",
      ],
    },
    {
      id: "light-edge",
      label: "A light on the water after dark",
      detail: "Dock or bridge light throwing a shadow line",
      candidates: ["dock_light"],
    },
  ];

  return marineGroups.flatMap((group) => {
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
