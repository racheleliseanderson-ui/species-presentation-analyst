import { PRESENTATION_BY_ID } from "../knowledge/presentations.ts";
import type {
  PresentationId,
  PresentationWeightReason,
  ScenarioInput,
  SpeciesRecord,
  ThermalState,
  WeightAxis,
} from "../protocol/types.ts";
import type { ForageClass, Season } from "../protocol/vocab.ts";
import { labelOf } from "../protocol/vocab.ts";
import { matchingSpeciesWeightOverrides } from "./species-weight-overrides-catalog.ts";
import { declaredHolding, familyFitsWater, reviewedPresentationsFor } from "./water.ts";
import { isMarine, type TideMovement, type TideStrength } from "../protocol/vocab.ts";

export const WEIGHTING_MODEL_VERSION = "SPW-2.0" as const;
export const CORE_WEIGHT_AXES: WeightAxis[] = [
  "species",
  "season",
  "thermal",
  "water_type",
  "holding",
  "forage",
];

/**
 * Saltwater's movement axis. It sits alongside the six core axes rather than
 * replacing one: on the coast, what the tide is doing decides where fish feed
 * and therefore which family can reach them, the way flow does in a river.
 */
const TIDE_MOVEMENT_BIASES: Record<TideMovement, BiasTable> = {
  flooding: {
    tidal_drift_bait: 8,
    structure_pitch: 6,
    flats_sight_cast: 7,
    surf_swim_retrieve: 5,
    horizontal_retrieve: 4,
    tide_line_drift: 5,
  },
  ebbing: {
    tidal_drift_bait: 9,
    tide_line_drift: 8,
    structure_pitch: 5,
    surf_bait_soak: 6,
    chum_established_drift: 6,
    dock_light_ambush: 5,
  },
  slack_high: {
    flats_sight_cast: 6,
    structure_vertical: 6,
    deep_drop: 6,
    surface_retrieve: 4,
    // Moving-water families lose the water that makes them work.
    tidal_drift_bait: -5,
    tide_line_drift: -5,
  },
  slack_low: {
    structure_vertical: 6,
    deep_drop: 5,
    dock_light_ambush: 4,
    tidal_drift_bait: -5,
    tide_line_drift: -5,
    flats_sight_cast: -3,
  },
  unknown: {},
};

/** How hard the tide runs changes what can hold position in it. */
const TIDE_STRENGTH_BIASES: Record<TideStrength, BiasTable> = {
  spring_tide: {
    tidal_drift_bait: 5,
    tide_line_drift: 5,
    surf_bait_soak: 4,
    structure_vertical: -3,
    flats_sight_cast: -3,
  },
  average_tide: {},
  neap_tide: {
    flats_sight_cast: 5,
    structure_vertical: 4,
    dock_light_ambush: 3,
    tidal_drift_bait: -3,
  },
  unknown: {},
};

export type WeightedPresentationCandidate = {
  id: PresentationId;
  weight: number;
  baseIndex: number;
  reasons: PresentationWeightReason[];
};

type BiasTable = Partial<Record<PresentationId, number>>;

type HoldingBias = {
  holds: string[];
  bias: BiasTable;
  note: string;
};

const SLOW_DEEP: BiasTable = {
  bottom_contact_drift: 7,
  suspended_drift: 5,
  stationary_bait: 5,
  vertical_jig: 7,
  bottom_contact: 7,
  slow_drag: 8,
  suspend_pause: 5,
  suspended_stationary: 5,
};

const MOBILE: BiasTable = {
  cross_current_retrieve: 4,
  upstream_retrieve: 3,
  downstream_retrieve: 3,
  swing: 3,
  horizontal_retrieve: 4,
  stop_and_go: 4,
  trolling: 4,
  subsurface_slow_roll: 3,
};

const SURFACE: BiasTable = {
  surface_drift: 5,
  wake_skate: 5,
  surface_retrieve: 5,
};

const SEASON_BIASES: Record<Season, BiasTable> = {
  winter: { ...SLOW_DEEP, surface_drift: -5, wake_skate: -5, surface_retrieve: -5 },
  early_spring: { ...SLOW_DEEP, dead_drift: 4, tight_line_drift: 4, pulse_jig: 3 },
  spring: {
    dead_drift: 5,
    tight_line_drift: 5,
    suspended_drift: 4,
    bottom_contact_drift: 3,
    horizontal_retrieve: 3,
    stop_and_go: 3,
  },
  early_summer: {
    dead_drift: 3,
    surface_drift: 3,
    cross_current_retrieve: 3,
    horizontal_retrieve: 4,
    stop_and_go: 3,
    trolling: 3,
  },
  summer: {
    ...MOBILE,
    surface_drift: 3,
    wake_skate: 3,
    surface_retrieve: 3,
    drop_presentation: 3,
  },
  late_summer: {
    ...MOBILE,
    surface_drift: 4,
    wake_skate: 4,
    surface_retrieve: 4,
    subsurface_slow_roll: 4,
  },
  fall: {
    ...MOBILE,
    bottom_contact_drift: 3,
    bottom_contact: 3,
    slow_drag: 3,
    pulse_jig: 3,
  },
  late_fall: {
    ...SLOW_DEEP,
    swing: 3,
    cross_current_retrieve: 2,
    horizontal_retrieve: 2,
  },
  unknown: {},
};

const HOLDING_BIASES: HoldingBias[] = [
  {
    holds: ["riffle", "riffle_to_run", "run", "seam", "pool_head", "pool_tail"],
    bias: {
      dead_drift: 8,
      tight_line_drift: 7,
      suspended_drift: 5,
      swing: 4,
      cross_current_retrieve: 3,
    },
    note: "current-delivered feeding lane",
  },
  {
    holds: ["deep_pool", "current_break", "eddy", "boulder_pocket", "submerged_wood", "tailwater"],
    bias: {
      bottom_contact_drift: 8,
      pulse_jig: 7,
      stationary_bait: 6,
      tight_line_drift: 4,
      suspended_drift: 4,
    },
    note: "depth / current-refuge holding class",
  },
  {
    holds: ["undercut_bank", "side_channel", "tributary_mouth", "shallow_flat"],
    bias: {
      cross_current_retrieve: 6,
      downstream_retrieve: 5,
      dead_drift: 4,
      surface_drift: 4,
      wake_skate: 3,
      stationary_bait: 3,
    },
    note: "edge / margin holding class",
  },
  {
    holds: ["weed_edge", "inside_weedline", "outside_weedline", "wood", "dock_shade", "shallow_flat"],
    bias: {
      horizontal_retrieve: 7,
      stop_and_go: 6,
      drop_presentation: 7,
      surface_retrieve: 4,
      subsurface_slow_roll: 6,
      live_natural_bait_suspension: 4,
    },
    note: "cover-edge holding class",
  },
  {
    holds: ["point", "secondary_point", "drop_off", "breakline", "submerged_hump", "rocky_shoreline", "riprap"],
    bias: {
      bottom_contact: 8,
      slow_drag: 7,
      horizontal_retrieve: 5,
      stop_and_go: 4,
      vertical_jig: 5,
    },
    note: "structural break / hard-bottom holding class",
  },
  {
    holds: ["basin", "suspended_open", "thermocline_edge"],
    bias: {
      vertical_jig: 8,
      suspended_stationary: 8,
      suspend_pause: 7,
      trolling: 7,
      horizontal_retrieve: 4,
    },
    note: "open-water / depth-band holding class",
  },
  // ------------------------------------------------------------- saltwater
  {
    holds: ["surf_trough", "beach_cut", "rip_channel", "inner_sandbar"],
    bias: {
      surf_bait_soak: 8,
      surf_swim_retrieve: 7,
      surf_metal_cast: 5,
      horizontal_retrieve: 4,
    },
    note: "surf holding class — moving sand and a defined trough",
  },
  {
    holds: ["outer_sandbar", "surf_point", "jetty_wash", "shell_bank"],
    bias: {
      surf_metal_cast: 8,
      surf_swim_retrieve: 5,
      run_and_gun_cast: 5,
      surface_retrieve: 4,
      surf_bait_soak: 3,
    },
    note: "outer surf structure — distance and current",
  },
  {
    holds: ["grass_flat", "sand_hole", "marsh_edge"],
    bias: {
      flats_sight_cast: 9,
      surface_retrieve: 6,
      horizontal_retrieve: 5,
      tidal_drift_bait: 4,
    },
    note: "shallow tidal flat — fish are visible and spooky",
  },
  {
    holds: ["oyster_bar", "mangrove_edge", "bridge_piling", "dock_light"],
    bias: {
      structure_pitch: 9,
      dock_light_ambush: 7,
      live_natural_bait_suspension: 6,
      stop_and_go: 4,
    },
    note: "inshore hard structure — accuracy and abrasion",
  },
  {
    holds: ["tidal_creek", "creek_mouth", "channel_edge"],
    bias: {
      tidal_drift_bait: 9,
      tide_line_drift: 6,
      live_natural_bait_suspension: 5,
      horizontal_retrieve: 4,
    },
    note: "tidal funnel — the water does the delivering",
  },
  {
    holds: ["nearshore_reef", "artificial_reef", "wreck", "rock_pile", "nearshore_hump"],
    bias: {
      structure_vertical: 9,
      bottom_contact: 7,
      vertical_jig: 7,
      drop_presentation: 6,
      live_bait_slow_troll: 4,
    },
    note: "nearshore hard structure — vertical and unforgiving",
  },
  {
    holds: ["kelp_edge", "pier_structure", "inlet_mouth"],
    bias: {
      live_natural_bait_suspension: 7,
      structure_pitch: 6,
      tide_line_drift: 5,
      run_and_gun_cast: 4,
      trolling: 3,
    },
    note: "nearshore edge — structure with water moving past it",
  },
  {
    holds: ["temperature_break", "weed_line", "current_rip", "open_bait_school"],
    bias: {
      trolling_spread: 9,
      tide_line_drift: 8,
      run_and_gun_cast: 7,
      live_bait_slow_troll: 6,
      chum_established_drift: 5,
    },
    note: "offshore water structure — the edge is made of water",
  },
  {
    holds: ["offshore_ledge", "deep_wreck", "seamount", "canyon_edge"],
    bias: {
      deep_drop: 9,
      structure_vertical: 7,
      vertical_jig: 6,
      chum_established_drift: 5,
      trolling_spread: 4,
    },
    note: "offshore bottom structure — depth is most of the work",
  },
  {
    holds: ["inlet", "outlet"],
    bias: {
      horizontal_retrieve: 6,
      stop_and_go: 5,
      vertical_jig: 4,
      live_natural_bait_suspension: 4,
      trolling: 3,
    },
    note: "water-exchange holding class",
  },
];

const FORAGE_BIASES: Record<ForageClass, BiasTable> = {
  aquatic_insects: {
    dead_drift: 10,
    tight_line_drift: 9,
    suspended_drift: 8,
    surface_drift: 5,
    pulse_jig: 4,
    vertical_jig: 3,
  },
  emerging_insects: {
    surface_drift: 10,
    suspended_drift: 9,
    dead_drift: 7,
    tight_line_drift: 7,
    suspend_pause: 5,
  },
  terrestrial_insects: {
    surface_drift: 10,
    wake_skate: 9,
    surface_retrieve: 10,
    horizontal_retrieve: 3,
  },
  crustaceans: {
    bottom_contact_drift: 10,
    bottom_contact: 10,
    slow_drag: 9,
    pulse_jig: 6,
    stationary_bait: 5,
  },
  small_forage_fish: {
    cross_current_retrieve: 10,
    upstream_retrieve: 7,
    downstream_retrieve: 8,
    swing: 6,
    horizontal_retrieve: 10,
    stop_and_go: 9,
    trolling: 8,
    vertical_jig: 5,
  },
  larger_prey_fish: {
    cross_current_retrieve: 10,
    upstream_retrieve: 8,
    downstream_retrieve: 8,
    horizontal_retrieve: 10,
    stop_and_go: 10,
    trolling: 9,
    subsurface_slow_roll: 7,
  },
  mollusks: {
    bottom_contact_drift: 9,
    stationary_bait: 8,
    bottom_contact: 10,
    slow_drag: 10,
  },
  worms_annelids: {
    bottom_contact_drift: 9,
    stationary_bait: 9,
    bottom_contact: 9,
    slow_drag: 9,
    live_natural_bait_suspension: 6,
  },
  eggs: {
    dead_drift: 8,
    tight_line_drift: 7,
    bottom_contact_drift: 10,
    stationary_bait: 8,
  },
  amphibians: {
    surface_retrieve: 8,
    subsurface_slow_roll: 9,
    stop_and_go: 8,
    horizontal_retrieve: 7,
    cross_current_retrieve: 7,
  },
  zooplankton: {
    suspended_stationary: 10,
    trolling: 9,
    vertical_jig: 7,
    suspend_pause: 8,
    horizontal_retrieve: 4,
  },
};

function addReason(
  candidate: WeightedPresentationCandidate,
  axis: WeightAxis,
  delta: number,
  note: string,
) {
  if (delta === 0) return;
  candidate.weight += delta;
  candidate.reasons.push({ axis, delta, note });
}

function applyBias(
  candidates: WeightedPresentationCandidate[],
  axis: WeightAxis,
  bias: BiasTable | undefined,
  note: string,
) {
  if (!bias) return;
  for (const candidate of candidates) {
    const delta = bias[candidate.id] ?? 0;
    if (delta !== 0) addReason(candidate, axis, delta, note);
  }
}

function thermalBias(state: ThermalState): BiasTable {
  if (state === "cold_refuge") {
    return {
      ...SLOW_DEEP,
      cross_current_retrieve: -4,
      upstream_retrieve: -4,
      horizontal_retrieve: -4,
      wake_skate: -6,
      surface_retrieve: -6,
    };
  }
  if (state === "warm_stress") {
    return {
      bottom_contact_drift: 6,
      suspended_drift: 7,
      pulse_jig: 4,
      vertical_jig: 7,
      bottom_contact: 6,
      slow_drag: 5,
      suspend_pause: 7,
      suspended_stationary: 7,
      surface_drift: -6,
      wake_skate: -6,
      surface_retrieve: -6,
    };
  }
  if (state === "preferred") return { ...MOBILE, ...SURFACE };
  if (state === "active") return { ...MOBILE };
  return {};
}

function secondaryLightBias(light: ScenarioInput["light"]): BiasTable {
  if (light === "night" || light === "low_light") {
    return {
      surface_drift: 4,
      wake_skate: 4,
      surface_retrieve: 4,
      cross_current_retrieve: 2,
      horizontal_retrieve: 2,
      stop_and_go: 2,
    };
  }
  if (light === "bright") {
    return {
      bottom_contact_drift: 2,
      suspended_drift: 2,
      vertical_jig: 2,
      bottom_contact: 2,
      slow_drag: 2,
      surface_drift: -2,
      surface_retrieve: -2,
    };
  }
  return {};
}

export function rankPresentationFamilies(
  input: ScenarioInput,
  species: SpeciesRecord,
  thermalState: ThermalState,
): WeightedPresentationCandidate[] {
  const baseIds = reviewedPresentationsFor(species, input.waterType);
  const candidates: WeightedPresentationCandidate[] = baseIds
    .filter((id) => {
      const family = PRESENTATION_BY_ID[id];
      return family && familyFitsWater(family.water, input.waterType);
    })
    .map((id, baseIndex) => {
      const baseline = 40 - baseIndex * 4;
      return {
        id,
        baseIndex,
        weight: baseline,
        reasons: [
          {
            axis: "species" as const,
            delta: baseline,
            note: `reviewed species baseline position ${baseIndex + 1}`,
          },
        ],
      };
    });

  for (const candidate of candidates) {
    const family = PRESENTATION_BY_ID[candidate.id];
    // A family written for this exact water beats one that merely also works here.
    const exact = Array.isArray(family.water)
      ? family.water.includes(input.waterType)
      : family.water === input.waterType;
    addReason(candidate, "water_type", exact ? 2 : 1, `${labelOf(input.waterType)} compatibility`);
  }

  applyBias(candidates, "season", SEASON_BIASES[input.season], `${labelOf(input.season)} seasonal mechanics`);
  if (input.season !== "unknown" && species.spawning?.seasons.includes(input.season)) {
    for (const candidate of candidates) {
      addReason(
        candidate,
        "season",
        -2,
        "declared season overlaps the reviewed spawning window; do not convert this into aggregation guidance",
      );
    }
  }

  applyBias(candidates, "thermal", thermalBias(thermalState), `${thermalState.replaceAll("_", " ")} thermal state`);

  const holding = declaredHolding(input);
  if (holding) {
    const rule = HOLDING_BIASES.find((entry) => entry.holds.includes(holding));
    applyBias(candidates, "holding", rule?.bias, rule ? `${labelOf(holding)} · ${rule.note}` : labelOf(holding));
  }

  if (isMarine(input.waterType)) {
    const movement = input.tideMovement ?? "unknown";
    const strength = input.tideStrength ?? "unknown";
    applyBias(candidates, "tide", TIDE_MOVEMENT_BIASES[movement], `tide ${labelOf(movement).toLowerCase()}`);
    applyBias(candidates, "tide", TIDE_STRENGTH_BIASES[strength], `${labelOf(strength).toLowerCase()} range`);
  }

  if (input.forage) {
    applyBias(
      candidates,
      "forage",
      FORAGE_BIASES[input.forage.class],
      `${labelOf(input.forage.class)} observed via ${input.forage.source.replaceAll("_", " ")}`,
    );
  }

  for (const rule of matchingSpeciesWeightOverrides(input, thermalState)) {
    applyBias(
      candidates,
      "species_override",
      rule.bias,
      `${rule.id} · ${rule.note}`,
    );
  }

  // Light remains a modest secondary context modifier. It is intentionally weaker
  // than the six requested core axes and cannot introduce an unreviewed family.
  applyBias(candidates, "light", secondaryLightBias(input.light), `${labelOf(input.light)} secondary context`);

  return candidates.sort((a, b) => b.weight - a.weight || a.baseIndex - b.baseIndex);
}
