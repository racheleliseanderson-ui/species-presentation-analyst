import { PRESENTATION_BY_ID } from "../knowledge/presentations.ts";
import { SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import {
  CORE_WEIGHT_AXES,
  rankPresentationFamilies,
  WEIGHTING_MODEL_VERSION,
} from "./presentation-weighting.ts";
import {
  matchingSpeciesWeightOverrides,
  SPECIES_OVERRIDE_MODEL_VERSION,
} from "./species-weight-overrides-catalog.ts";
import {
  populationProfilesForSpecies,
  REGIONAL_POPULATION_MODEL_VERSION,
  resolvePopulationContext,
} from "./population-context.ts";
import { applyPopulationContextWeighting } from "./population-context-weighting.ts";
import {
  hasTemperatureQuantity,
  resolveThermalState,
  temperatureEvidenceLabel,
  type ThermalResolution,
} from "./temperature.ts";
import type {
  Interpretation,
  RankedPresentation,
  ResolvedPopulationContext,
  ScenarioInput,
} from "../protocol/types.ts";
import type { Confidence, ForageClass } from "../protocol/vocab.ts";
import { labelOf } from "../protocol/vocab.ts";

function thermalLabel(
  resolution: ThermalResolution,
  species: NonNullable<typeof SPECIES_BY_ID[string]>,
): string {
  const band = `${species.thermal.preferredF[0]}–${species.thermal.preferredF[1]}°F preferred`;

  if (resolution.exactF != null) {
    const tempF = resolution.exactF;
    if (resolution.state === "preferred") {
      return `${tempF}°F is inside the preferred band (${band})`;
    }
    if (resolution.state === "active") {
      return `${tempF}°F is metabolically active but outside the preferred core (${band})`;
    }
    if (resolution.state === "cold_refuge") {
      return `${tempF}°F is on the cold side of this species' usual feeding band`;
    }
    if (resolution.state === "warm_stress") {
      return `${tempF}°F is on the warm/stress side of this species' usual feeding band`;
    }
  }

  if (resolution.rangeF) {
    const [low, high] = resolution.rangeF;
    if (resolution.states.length === 1) {
      const state = resolution.states[0];
      if (state === "preferred") {
        return `${low}–${high}°F stays inside the preferred band (${band})`;
      }
      if (state === "active") {
        return `${low}–${high}°F stays inside the active band without crossing the preferred core (${band})`;
      }
      if (state === "cold_refuge") {
        return `${low}–${high}°F stays on the cold side of this species' usual feeding band`;
      }
      if (state === "warm_stress") {
        return `${low}–${high}°F stays on the warm/stress side of this species' usual feeding band`;
      }
    }

    const states = resolution.states
      .map((state) => state.replaceAll("_", " "))
      .join(" / ");
    return `${low}–${high}°F spans ${states || "multiple"} thermal states; the model withholds a single thermal bias rather than inventing a midpoint (${band})`;
  }

  return `Water temperature unknown · ${band}`;
}

function evidenceQuality(input: ScenarioInput): Confidence {
  const src = input.tempSource;
  if (src === "user_measured" || src === "official_station") return "high";
  if (src === "estimated") return "moderate";
  return "low";
}

function envCompleteness(input: ScenarioInput): Confidence {
  const missing: boolean[] = [
    !hasTemperatureQuantity(input),
    input.season === "unknown",
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

function fitForWeight(index: number, weight: number, topWeight: number): Confidence {
  if (index === 0) return "high";
  if (topWeight - weight <= 7) return "moderate";
  return "low";
}

function bump<T>(arr: T[], item: T | undefined): T[] {
  if (!item) return arr;
  return [item, ...arr.filter((x) => x !== item)];
}

export function interpret(input: ScenarioInput): Interpretation | { error: string } {
  const species = SPECIES_BY_ID[input.speciesId];
  if (!species) {
    return { error: "No reviewed record for that species. We will not invent biology to fill the gap." };
  }

  const targetStatus = species.targetStatus ?? "standard";
  if (targetStatus === "conservation_sensitive" || targetStatus === "non_target") {
    const targetNote =
      species.targetContext?.note ??
      species.targetStatusNote ??
      "Presentation guidance is deliberately withheld for this record.";
    return {
      error: `Context only — no presentation guidance. ${species.commonNames[0]} is retained for biological context only. ${targetNote} We do not give presentation guidance for this species.`,
    };
  }

  if (!species.habitat.waterTypes.includes(input.waterType)) {
    return {
      error: `${species.commonNames[0]} has no reviewed ${labelOf(input.waterType)} record here. Choosing a different water type to get an answer would be guessing.`,
    };
  }

  const populationResolution = resolvePopulationContext(input, species);
  if (populationResolution.error) return { error: populationResolution.error };
  const populationProfile = populationResolution.profile;
  const resolvedPopulationContext: ResolvedPopulationContext | undefined = populationProfile
    ? {
        profileId: populationProfile.id,
        label: populationProfile.label,
        regionClass: populationProfile.regionClass,
        systemArchetype: populationProfile.systemArchetype,
        lifeHistory: populationProfile.lifeHistory,
        populationOrigin: populationProfile.populationOrigin,
        source: input.populationContext?.source ?? "user_declared",
        note: populationProfile.note,
      }
    : undefined;

  const thermalResolution = resolveThermalState(input, species);
  const tState = thermalResolution.state;
  const resolvedThermalLabel = thermalLabel(thermalResolution, species);
  const holding = input.waterType === "flowing" ? input.holdingRiver : input.holdingStill;
  const holdingLabel = holding ? labelOf(holding) : "holding water undeclared";

  const preferredHolds = input.waterType === "flowing" ? species.habitat.riverHolding : species.habitat.stillHolding;
  const holdMatch = holding ? preferredHolds.includes(holding as never) : false;

  const positioning: Interpretation["positioning"] = [];
  if (populationProfile) {
    positioning.push({
      text: `${populationProfile.label}: ${populationProfile.positioning}`,
      confidence: "high",
    });
  }
  if (holding && holdMatch) {
    positioning.push({
      text: `${holdingLabel} is inside this species' reviewed holding-water classes for ${labelOf(input.waterType)}.`,
      confidence: "high",
    });
  } else if (holding) {
    positioning.push({
      text: `${holdingLabel} is declared, but it is not one of the primary reviewed classes for this species. Treat it as a secondary lie, not the default one.`,
      confidence: "low",
    });
  }
  for (const h of preferredHolds.slice(0, 4)) {
    if (h === holding) continue;
    positioning.push({
      text: `${labelOf(h)} is also a reviewed holding-water class for this species.`,
      confidence: "moderate",
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
  whyParts.push(resolvedThermalLabel + ".");
  if (input.season === "unknown") {
    whyParts.push("Season is undeclared, so season is not used to rank presentations.");
  }
  if (populationProfile) whyParts.push(populationProfile.note);
  whyParts.push(species.habitat.currentPreference);
  // The species record already states the velocity/energy trade-off for some species.
  // Adding the generic sentence there restates the same idea in longer words, so skip it.
  const speciesStatesVelocityTradeoff = /velocit|energy/i.test(species.habitat.currentPreference);
  if (
    input.waterType === "flowing" &&
    (input.flow === "moderate" || input.flow === "elevated") &&
    !speciesStatesVelocityTradeoff
  ) {
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
    ...(populationProfile?.invalidators ?? []),
    ...species.exceptions,
  ];
  if (targetStatus === "regulated_context") {
    invalidators.unshift(
      species.targetContext?.note ??
        species.targetStatusNote ??
        "Regulations and legal methods vary by jurisdiction; verify current rules before acting on this biological reading.",
    );
  }

  let forageClasses: ForageClass[] = [...species.forageClasses];
  let forageCertainty: Confidence = "low";
  let forageNote = "Nothing observed has been carried in from Hatch Match. These are plausible forage classes, not a confirmed current hatch.";
  if (input.forage) {
    forageClasses = bump(forageClasses, input.forage.class);
    forageCertainty = input.forage.confidence != null && input.forage.confidence >= 0.7 ? "high" : "moderate";
    forageNote = `You observed ${labelOf(input.forage.class)}${
      input.forage.hypothesis ? ` · ${input.forage.hypothesis.replaceAll("_", " ")}` : ""
    }. That observation is what the forage side of this reading rests on — nothing about a hatch is invented.`;
  } else if (input.season === "fall" || input.season === "late_summer") {
    forageNote += " Seasonal terrestrial and baitfish classes may be plausible, but forage does not count toward this reading until you observe one or carry one in.";
  }

  const appliedSpeciesOverrides = matchingSpeciesWeightOverrides(input, tState);
  const weighted = applyPopulationContextWeighting(
    rankPresentationFamilies(input, species, tState),
    populationProfile,
  );
  const topWeight = weighted[0]?.weight ?? 0;
  const presentations: RankedPresentation[] = weighted.slice(0, 4).map((ranked, i) => {
    const p = PRESENTATION_BY_ID[ranked.id];
    return {
      id: ranked.id,
      label: p.label,
      fit: fitForWeight(i, ranked.weight, topWeight),
      weight: ranked.weight,
      weightReasons: ranked.reasons,
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
  if (!hasTemperatureQuantity(input)) unknowns.push("water temperature");
  else if (input.tempSource === "unknown") unknowns.push("water temperature provenance");
  if (input.season === "unknown") unknowns.push("season");
  if (input.clarity === "unknown") unknowns.push("clarity");
  if (input.light === "unknown") unknowns.push("light");
  if (input.weather === "unknown") unknowns.push("weather trend");
  if (!holding) unknowns.push("holding-water class");
  if (!input.forage) unknowns.push("observed forage");
  if (input.waterType === "flowing" && (!input.flow || input.flow === "unknown")) unknowns.push("flow class");
  if (input.waterType === "stillwater" && (!input.stillState || input.stillState === "unknown")) unknowns.push("stillwater state");
  if (species.targetContext?.verifyLocalRules && !input.water.jurisdiction) unknowns.push("current jurisdiction rules");
  if (populationProfilesForSpecies(species.id, input.waterType).length > 0 && !populationProfile) {
    unknowns.push("regional / population context");
  }

  const topWeightTrace = top
    ? top.weightReasons
        .filter((reason) => reason.axis !== "species")
        .map((reason) => `${reason.axis} ${reason.delta >= 0 ? "+" : ""}${reason.delta}`)
        .join(" · ")
    : "no weighted family";

  const thermalTrace = thermalResolution.rangeF && thermalResolution.states.length > 1
    ? `thermal range spans ${thermalResolution.states.map((state) => state.replaceAll("_", " ")).join(" / ")} · single thermal bias withheld`
    : tState === "preferred"
      ? "energy-efficient feeding positions favored"
      : tState === "active"
        ? "active thermal state retained"
        : tState === "cold_refuge"
          ? "compressed, slower lies favored"
          : tState === "warm_stress"
            ? "refuge from heat / low oxygen favored"
            : "thermal state unresolved";
  const trace = [
    species.commonNames[0],
    targetStatus === "regulated_context"
      ? `closely regulated fishery · ${species.targetContext?.jurisdictionScope ?? "verify current local rules"}`
      : "no special conservation or regulatory status on this record",
    populationProfile
      ? `Regional context · ${populationProfile.label} · explicitly ${input.populationContext?.source?.replaceAll("_", " ") ?? "declared"}`
      : populationProfilesForSpecies(species.id, input.waterType).length > 0
        ? "Regional context · none declared; generic species record retained"
        : "Regional context · no reviewed profile applies to this species and water type",
    temperatureEvidenceLabel(input),
    `season · ${labelOf(input.season)}`,
    labelOf(input.waterType),
    input.waterType === "flowing" ? labelOf(input.flow ?? "unknown") : labelOf(input.stillState ?? "unknown"),
    holdingLabel,
    input.forage ? `${labelOf(input.forage.class)} observed` : forageClasses.slice(0, 3).map(labelOf).join(" / ") + " plausible",
    thermalTrace,
    "ranked on species, season, water temperature, water type, holding water, and observed forage",
    appliedSpeciesOverrides.length
      ? "reviewed adjustments for this species under these conditions were applied"
      : "no species-specific adjustment applied",
    top ? `${top.label} ranks first for this combination` : "no reviewed presentation for this water type",
    `weighting for the leading family · ${topWeightTrace}`,
    presentations.map((p) => p.label).join(" + ") || "no reviewed presentation for this water type",
    "ranking compares reviewed presentations only — it is never the chance of a bite",
  ];

  return {
    species,
    populationContext: resolvedPopulationContext,
    thermalState: tState,
    thermalLabel: resolvedThermalLabel,
    positioning: positioning.slice(0, 6),
    why: whyParts.join(" "),
    invalidators,
    forageClasses,
    forageCertainty,
    forageNote,
    presentations,
    weightingModel: {
      version: WEIGHTING_MODEL_VERSION,
      speciesOverrideVersion: SPECIES_OVERRIDE_MODEL_VERSION,
      appliedSpeciesOverrideIds: appliedSpeciesOverrides.map((rule) => rule.id),
      regionalPopulationVersion: REGIONAL_POPULATION_MODEL_VERSION,
      appliedPopulationProfileId: populationProfile?.id,
      coreAxes: CORE_WEIGHT_AXES,
      note: "Families are ranked from reviewed reasons for this species and water type. Unknown season is not used to rank. A temperature range that crosses thermal states is not treated as a single temperature. Species-specific reasons and declared population context adjust that ranking — they do not add new families, locations, or probabilities.",
    },
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
