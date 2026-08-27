import { PRESENTATION_BY_ID } from "@/lib/knowledge/presentations";
import { SPECIES_BY_ID } from "@/lib/knowledge/species";
import type {
  Interpretation,
  RankedPresentation,
  ScenarioInput,
  ThermalState,
} from "@/lib/protocol/types";
import type { Confidence, ForageClass } from "@/lib/protocol/vocab";
import { labelOf } from "@/lib/protocol/vocab";

function thermalState(tempF: number | null, species: NonNullable<typeof SPECIES_BY_ID[string]>): ThermalState {
  if (tempF == null) return "unknown";
  const [p0, p1] = species.thermal.preferredF;
  const [a0, a1] = species.thermal.activeF;
  if (tempF >= p0 && tempF <= p1) return "preferred";
  if (tempF >= a0 && tempF <= a1) return "active";
  if (tempF < species.thermal.coldEdgeF) return "cold_refuge";
  if (tempF > species.thermal.warmEdgeF) return "warm_stress";
  if (tempF < p0) return "cold_refuge";
  return "warm_stress";
}

function thermalLabel(state: ThermalState, tempF: number | null, species: NonNullable<typeof SPECIES_BY_ID[string]>): string {
  const band = `${species.thermal.preferredF[0]}–${species.thermal.preferredF[1]}°F preferred`;
  if (tempF == null) return `Water temperature unknown · ${band}`;
  const map: Record<ThermalState, string> = {
    preferred: `${tempF}°F is inside the preferred band (${band})`,
    active: `${tempF}°F is metabolically active but outside the preferred core (${band})`,
    cold_refuge: `${tempF}°F is on the cold side of this species' usual feeding band`,
    warm_stress: `${tempF}°F is on the warm/stress side of this species' usual feeding band`,
    unknown: band,
  };
  return map[state];
}

function evidenceQuality(input: ScenarioInput): Confidence {
  const src = input.tempSource;
  if (src === "user_measured" || src === "official_station") return "high";
  if (src === "estimated") return "moderate";
  return "low";
}

function envCompleteness(input: ScenarioInput): Confidence {
  const missing: boolean[] = [
    input.tempF == null || input.tempSource === "unknown",
    input.clarity === "unknown",
    input.light === "unknown",
    input.weather === "unknown",
    input.waterType === "flowing" ? !input.flow || input.flow === "unknown" : !input.stillState || input.stillState === "unknown",
    input.waterType === "flowing" ? !input.holdingRiver : !input.holdingStill,
  ];
  const n = missing.filter(Boolean).length;
  if (n <= 1) return "high";
  if (n <= 3) return "moderate";
  return "low";
}

function fitFor(index: number): Confidence {
  if (index === 0) return "high";
  if (index === 1) return "moderate";
  return "low";
}

function bump<T>(arr: T[], item: T | undefined): T[] {
  if (!item) return arr;
  return [item, ...arr.filter((x) => x !== item)];
}

export function interpret(input: ScenarioInput): Interpretation | { error: string } {
  const species = SPECIES_BY_ID[input.speciesId];
  if (!species) {
    return { error: "No reviewed record for that species. This instrument will not invent biology." };
  }
  if (!species.habitat.waterTypes.includes(input.waterType)) {
    return {
      error: `${species.commonNames[0]} has no reviewed ${labelOf(input.waterType)} record in this knowledge base. Declaring a different water type would be guessing.`,
    };
  }

  const tState = thermalState(input.tempF, species);
  const holding =
    input.waterType === "flowing" ? input.holdingRiver : input.holdingStill;
  const holdingLabel = holding ? labelOf(holding) : "holding water undeclared";

  const preferredHolds =
    input.waterType === "flowing" ? species.habitat.riverHolding : species.habitat.stillHolding;
  const holdMatch = holding ? preferredHolds.includes(holding as never) : false;

  const positioning: Interpretation["positioning"] = [];
  if (holding && holdMatch) {
    positioning.push({
      text: `${holdingLabel} is inside this species' reviewed holding-water classes for ${labelOf(input.waterType)}.`,
      confidence: "high",
    });
  } else if (holding) {
    positioning.push({
      text: `${holdingLabel} is declared, but it is not a primary reviewed class for this species. Treat it as a possible edge, not the default lie.`,
      confidence: "low",
    });
  }
  for (const h of preferredHolds.slice(0, 4)) {
    if (h === holding) continue;
    positioning.push({
      text: `${labelOf(h)} is also a reviewed holding-water class for this species.`,
      confidence: holdMatch ? "moderate" : "moderate",
    });
  }
  if (tState === "cold_refuge") {
    positioning.unshift({
      text: "Colder water usually compresses fish into slower, deeper, or more covered water rather than spreading them across feeding lanes.",
      confidence: "moderate",
    });
  }
  if (tState === "warm_stress") {
    positioning.unshift({
      text: "Warmer-than-preferred water usually favors oxygen, shade, depth, or current seams over skinny sunlit water.",
      confidence: "moderate",
    });
  }
  if (input.light === "low_light" || input.light === "night") {
    positioning.push({
      text: "Low light often allows shallower or less-covered positioning than the same water at midday.",
      confidence: "moderate",
    });
  }

  const whyParts: string[] = [];
  whyParts.push(thermalLabel(tState, input.tempF, species) + ".");
  whyParts.push(species.habitat.currentPreference);
  if (input.waterType === "flowing" && (input.flow === "moderate" || input.flow === "elevated")) {
    whyParts.push(
      "In moving water of this class, fish generally balance food delivery against energy expenditure, making velocity boundaries more defensible than uniform fast water.",
    );
  }
  if (input.clarity === "very_clear" || input.clarity === "clear") {
    whyParts.push("Clear water increases the value of cover, depth, and low-light edges.");
  }
  if (input.clarity === "stained" || input.clarity === "turbid") {
    whyParts.push("Reduced visibility often lets fish sit closer to the food lane and tolerate more presentation bulk.");
  }
  whyParts.push(species.habitat.lightResponse);

  const invalidators = [
    "rapid temperature movement",
    "substantial flow or level change",
    species.spawning.note,
    "heavy angling pressure",
    "unusually high turbidity",
    "forage concentrated somewhere else in the system",
    ...species.exceptions,
  ];

  let forageClasses: ForageClass[] = [...species.forageClasses];
  let forageCertainty: Confidence = "low";
  let forageNote =
    "No field observation carried from Hatch Match. These are plausible forage classes, not a current hatch.";
  if (input.forage) {
    forageClasses = bump(forageClasses, input.forage.class);
    forageCertainty = input.forage.confidence != null && input.forage.confidence >= 0.7 ? "high" : "moderate";
    forageNote = `Observed forage packet: ${labelOf(input.forage.class)}${
      input.forage.hypothesis ? ` · ${input.forage.hypothesis.replaceAll("_", " ")}` : ""
    }. Presentation logic is using the observation, not an inferred hatch.`;
  } else if (input.season === "fall" || input.season === "late_summer") {
    forageNote += " Seasonal terrestrial and baitfish classes are more plausible than they are in mid-winter, still unverified.";
  }

  const baseIds =
    input.waterType === "flowing" ? species.flowingPresentations : species.stillPresentations;
  let ordered = [...baseIds];

  if (input.forage?.class === "aquatic_insects" || input.forage?.class === "emerging_insects") {
    ordered = bump(bump(ordered, "dead_drift" as const), "tight_line_drift" as const);
    ordered = bump(ordered, "surface_drift" as const);
  }
  if (input.forage?.class === "small_forage_fish" || input.forage?.class === "larger_prey_fish") {
    ordered = bump(bump(ordered, "cross_current_retrieve" as const), "stop_and_go" as const);
    ordered = bump(ordered, "horizontal_retrieve" as const);
  }
  if (input.forage?.class === "crustaceans") {
    ordered = bump(bump(ordered, "bottom_contact_drift" as const), "bottom_contact" as const);
  }
  if (tState === "cold_refuge") {
    ordered = bump(bump(ordered, "bottom_contact_drift" as const), "slow_drag" as const);
    ordered = bump(ordered, "suspended_drift" as const);
  }
  if (input.light === "night" || input.light === "low_light") {
    ordered = bump(bump(ordered, "surface_retrieve" as const), "surface_drift" as const);
  }

  const presentations: RankedPresentation[] = ordered
    .filter((id) => PRESENTATION_BY_ID[id])
    .filter((id) => {
      const w = PRESENTATION_BY_ID[id].water;
      return w === "both" || w === input.waterType;
    })
    .slice(0, 4)
    .map((id, i) => {
      const p = PRESENTATION_BY_ID[id];
      return {
        id,
        label: p.label,
        fit: fitFor(i),
        job: p.job,
        mechanics: p.mechanics,
        system: p.system,
      };
    });

  const top = presentations[0];
  const equipment = top?.system ?? {
    depthControl: "undeclared",
    sensitivity: "undeclared",
  };
  const connection = {
    job: "Match line to leader so the presentation can do the mechanical job without advertising hardware.",
    priorities: [
      "compact passage through guides",
      "repeatable field retie",
      input.season === "winter" || input.season === "late_fall"
        ? "cold / wet-hand constraint"
        : "moderate field constraint",
      equipment.lineVisibilityPreference === "low"
        ? "low-visibility terminal"
        : "visibility secondary to strength",
    ],
  };

  const rigQuestion =
    input.waterType === "stillwater" &&
    (holding === "suspended_open" || holding === "thermocline_edge" || holding === "basin")
      ? "Is this sonar configuration capable of resolving suspended targets at the stated depth and boat speed?"
      : null;

  const unknowns: string[] = [];
  if (input.tempF == null || input.tempSource === "unknown") unknowns.push("water temperature");
  if (input.clarity === "unknown") unknowns.push("clarity");
  if (input.light === "unknown") unknowns.push("light");
  if (input.weather === "unknown") unknowns.push("weather trend");
  if (!holding) unknowns.push("holding-water class");
  if (!input.forage) unknowns.push("observed forage");
  if (input.waterType === "flowing" && (!input.flow || input.flow === "unknown")) unknowns.push("flow class");
  if (input.waterType === "stillwater" && (!input.stillState || input.stillState === "unknown"))
    unknowns.push("stillwater state");

  const trace = [
    species.commonNames[0],
    input.tempF != null
      ? `${input.tempF}°F · ${labelOf(input.tempSource)}`
      : "temperature unknown",
    labelOf(input.waterType),
    input.waterType === "flowing" ? labelOf(input.flow ?? "unknown") : labelOf(input.stillState ?? "unknown"),
    holdingLabel,
    forageClasses.slice(0, 3).map(labelOf).join(" / ") + " plausible",
    tState === "preferred"
      ? "energy-efficient feeding positions favored"
      : tState === "cold_refuge"
        ? "compressed, slower lies favored"
        : tState === "warm_stress"
          ? "refuge from heat / low oxygen favored"
          : "thermal state unresolved",
    presentations.map((p) => p.label).join(" + ") || "no reviewed presentation for this water type",
    "depth control and line management required",
  ];

  return {
    species,
    thermalState: tState,
    thermalLabel: thermalLabel(tState, input.tempF, species),
    positioning: positioning.slice(0, 6),
    why: whyParts.join(" "),
    invalidators,
    forageClasses,
    forageCertainty,
    forageNote,
    presentations,
    equipment,
    connection,
    rigQuestion,
    trace,
    confidence: {
      evidence: evidenceQuality(input),
      environment: envCompleteness(input),
      forage: forageCertainty,
      presentation: presentations[0]?.fit ?? "low",
    },
    unknowns,
  };
}
