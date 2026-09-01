import { ALIASES } from "./aliases.ts";
import type { SpeciesOverlays } from "./overlays.ts";
import type {
  BehaviorDossier,
  DietDossier,
  IdentificationDossier,
  SeasonalCalendarDossier,
  SeasonalCalendarEntry,
} from "./dossier-types.ts";
import type { SpeciesRecord } from "../protocol/types.ts";
import { labelOf } from "../protocol/vocab.ts";

export const ANGLER_PROFILE_MODEL_VERSION = "AFP-1.2" as const;

export type AnglerProfileSectionId =
  | "identification"
  | "habitat_location"
  | "behavior"
  | "diet"
  | "methods"
  | "seasonal_calendar"
  | "conditions"
  | "fight"
  | "food_value"
  | "regulations_conservation";

export type AnglerProfileStatus = "reviewed" | "partial" | "not_reviewed";

export type AnglerProfileFactKind = "default" | "trait" | "comparison" | "source" | "season" | "life_stage";

export type AnglerProfileFact = {
  label: string;
  value: string;
  kind?: AnglerProfileFactKind;
};

export type AnglerProfileSection = {
  id: AnglerProfileSectionId;
  label: string;
  question: string;
  status: AnglerProfileStatus;
  summary: string;
  facts: AnglerProfileFact[];
  gaps: string[];
};

export type AnglerSpeciesProfile = {
  modelVersion: typeof ANGLER_PROFILE_MODEL_VERSION;
  speciesId: string;
  sections: AnglerProfileSection[];
  coverage: {
    total: number;
    reviewed: number;
    partial: number;
    notReviewed: number;
  };
};

function labels(values: readonly string[]): string {
  return values.map((value) => labelOf(value)).join(", ");
}

function targetStatusLabel(species: SpeciesRecord): string {
  return labelOf(species.targetStatus ?? "standard");
}

function section(
  id: AnglerProfileSectionId,
  label: string,
  question: string,
  status: AnglerProfileStatus,
  summary: string,
  facts: AnglerProfileFact[],
  gaps: string[],
): AnglerProfileSection {
  return { id, label, question, status, summary, facts, gaps };
}

function feedingModeLabel(mode: BehaviorDossier["feedingStrategy"]["modes"][number]): string {
  return labelOf(mode);
}

function identificationSection(species: SpeciesRecord, dossier: IdentificationDossier | null): AnglerProfileSection {
  const aliases = ALIASES[species.id] ?? [];
  const catalogFacts: AnglerProfileFact[] = [
    { label: "Common name", value: species.commonNames[0] },
    { label: "Scientific name", value: species.scientificName },
    {
      label: "Also called",
      value: aliases.length > 0 ? aliases.join(", ") : "No additional reviewed angler aliases stored",
    },
  ];

  if (!dossier) {
    return section(
      "identification",
      "Identification",
      "What fish is this?",
      "partial",
      "The catalog has authoritative naming and angler aliases, but it does not yet claim a complete visual-identification dossier.",
      catalogFacts,
      [
        "physical description and diagnostic traits",
        "color and regional appearance variation",
        "juvenile versus adult appearance",
        "similar-species comparison keys",
        "average and maximum size / weight",
        "age potential",
      ],
    );
  }

  const facts: AnglerProfileFact[] = [
    ...catalogFacts,
    ...(dossier.regionalNames.length > 0
      ? [{ label: "Regional / local names", value: dossier.regionalNames.join(", ") }]
      : []),
    { label: "Body shape", value: dossier.bodyShape },
    { label: "Adult appearance", value: dossier.adultAppearance },
    { label: "Coloration", value: dossier.coloration },
    ...(dossier.regionalColorVariation
      ? [{ label: "Regional color variation", value: dossier.regionalColorVariation }]
      : []),
    ...(dossier.spawningColoration
      ? [{ label: "Spawning coloration", value: dossier.spawningColoration }]
      : []),
    ...(dossier.juvenileAppearance
      ? [{ label: "Juvenile appearance", value: dossier.juvenileAppearance }]
      : []),
    ...(dossier.sexualDimorphism
      ? [{ label: "Sexual dimorphism", value: dossier.sexualDimorphism }]
      : []),
    ...dossier.identificationTraits.map((trait, index) => ({
      label: dossier.identificationTraits.length === 1 ? "Diagnostic trait" : `Diagnostic trait ${index + 1}`,
      value: trait,
      kind: "trait" as const,
    })),
    ...dossier.similarSpecies.map((item) => ({
      label: `Distinguish from ${item.name}`,
      value: item.distinction,
      kind: "comparison" as const,
    })),
    { label: "Average adult length", value: dossier.averageAdultLength },
    { label: "Common angling size", value: dossier.commonAnglingSize },
    { label: "Typical weight", value: dossier.typicalWeight },
    { label: "Maximum documented size", value: dossier.maximumDocumentedSize },
    ...(dossier.longevity ? [{ label: "Longevity / age potential", value: dossier.longevity }] : []),
    {
      label: "Identification sources",
      value: dossier.sources.map((source) => source.label).join("; "),
      kind: "source",
    },
  ];

  return section(
    "identification",
    "Identification",
    "What fish is this?",
    dossier.status,
    dossier.status === "reviewed"
      ? "Reviewed identification characters, lookalike keys, and size ranges from agency, museum, or peer-reviewed sources. Visual claims are not taken from generative imagery."
      : "A partial identification dossier is on file. Remaining gaps stay visible instead of being filled with generic model text.",
    facts,
    dossier.gaps,
  );
}

function behaviorSection(species: SpeciesRecord, dossier: BehaviorDossier | null): AnglerProfileSection {
  if (!dossier) {
    return section(
      "behavior",
      "Behavior",
      "What is the fish trying to accomplish?",
      "partial",
      "The decision engine models positioning, thermal state, light response, spawning caution, and population/system context when reviewed. It does not yet maintain a complete behavioral biography for every species.",
      [
        { label: "Light response", value: species.habitat.lightResponse },
        { label: "Spawning context", value: species.spawning.note },
        {
          label: "Important exceptions",
          value: species.exceptions.length > 0 ? species.exceptions.join(" ") : "No additional reviewed exception note",
        },
      ],
      [
        "schooling versus solitary behavior",
        "territoriality / aggression profile",
        "species-specific angling-pressure response",
        "weather-front response beyond generic condition reasons",
        "predator-avoidance behavior",
      ],
    );
  }

  const facts: AnglerProfileFact[] = [
    { label: "Social pattern", value: `${labelOf(dossier.social.pattern)}. ${dossier.social.note}` },
    ...(dossier.social.byLifeStage
      ? [{ label: "Schooling by life stage", value: dossier.social.byLifeStage }]
      : []),
    {
      label: "Feeding strategy",
      value: `${dossier.feedingStrategy.modes.map(feedingModeLabel).join(", ")}. ${dossier.feedingStrategy.note}`,
    },
    { label: "Diel tendency", value: `${labelOf(dossier.dielTendency.class)}. ${dossier.dielTendency.note}` },
    ...(dossier.territoriality ? [{ label: "Territoriality", value: dossier.territoriality }] : []),
    ...(dossier.aggression ? [{ label: "Aggression", value: dossier.aggression }] : []),
    ...(dossier.seasonalActivity ? [{ label: "Seasonal activity", value: dossier.seasonalActivity }] : []),
    ...(dossier.thermalDrivenBehavior
      ? [{ label: "Thermal-driven behavior", value: dossier.thermalDrivenBehavior }]
      : []),
    ...(dossier.currentFacing ? [{ label: "Current-facing behavior", value: dossier.currentFacing }] : []),
    ...(dossier.depthMovement ? [{ label: "Depth movement", value: dossier.depthMovement }] : []),
    ...(dossier.waterLevelResponse ? [{ label: "Water-level response", value: dossier.waterLevelResponse }] : []),
    ...(dossier.flowChangeResponse ? [{ label: "Flow-change response", value: dossier.flowChangeResponse }] : []),
    ...(dossier.clarityResponse ? [{ label: "Clarity response", value: dossier.clarityResponse }] : []),
    ...(dossier.coldFrontResponse ? [{ label: "Cold-front response", value: dossier.coldFrontResponse }] : []),
    ...(dossier.anglingPressureResponse
      ? [{ label: "Angling-pressure response", value: dossier.anglingPressureResponse }]
      : []),
    ...(dossier.predatorAvoidance ? [{ label: "Predator avoidance", value: dossier.predatorAvoidance }] : []),
    ...(dossier.coverUse ? [{ label: "Cover use", value: dossier.coverUse }] : []),
    ...(dossier.openWaterBehavior ? [{ label: "Open-water behavior", value: dossier.openWaterBehavior }] : []),
    { label: "Spawning behavior", value: dossier.spawningBehavior },
    { label: "Light response (catalog)", value: species.habitat.lightResponse },
    {
      label: "Behavior sources",
      value: dossier.sources.map((source) => source.label).join("; "),
      kind: "source",
    },
  ];

  return section(
    "behavior",
    "Behavior",
    "What is the fish trying to accomplish?",
    dossier.status,
    dossier.status === "reviewed"
      ? "Reviewed behavioral mechanics for positioning, feeding mode, social pattern, and conservation-safe spawning context. This is plausibility, not a claim that fish will bite."
      : "A partial behavior dossier is on file. Remaining gaps stay visible instead of being filled with generic model text.",
    facts,
    dossier.gaps,
  );
}

function calendarEntryValue(entry: SeasonalCalendarEntry): string {
  const parts = [entry.habitatClass];
  if (entry.depthTendency) parts.push(entry.depthTendency);
  if (entry.movementTendency) parts.push(entry.movementTendency);
  if (entry.feedingEmphasis) parts.push(`Feeding: ${entry.feedingEmphasis}`);
  if (entry.forageEmphasis) parts.push(`Forage: ${entry.forageEmphasis}`);
  if (entry.thermalContext) parts.push(`Thermal: ${entry.thermalContext}`);
  if (entry.currentUse) parts.push(`Current: ${entry.currentUse}`);
  if (entry.coverUse) parts.push(`Cover: ${entry.coverUse}`);
  if (entry.lightSensitivity) parts.push(`Light: ${entry.lightSensitivity}`);
  if (entry.presentationImplication) parts.push(`Mechanics: ${entry.presentationImplication}`);
  if (entry.conservationNote) parts.push(entry.conservationNote);
  if (entry.invalidators && entry.invalidators.length > 0) {
    parts.push(`Invalidators: ${entry.invalidators.join("; ")}`);
  }
  return parts.join(" ");
}

function dietSection(species: SpeciesRecord, dossier: DietDossier | null): AnglerProfileSection {
  if (!dossier) {
    return section(
      "diet",
      "Diet",
      "What does it eat?",
      "partial",
      "Primary forage classes are structured and can be strengthened by an observed Hatch Match note. Seasonal and life-stage diet detail is not yet complete.",
      [
        {
          label: "Reviewed forage classes",
          value: species.forageClasses.length > 0 ? labels(species.forageClasses) : "No forage class reviewed",
        },
      ],
      [
        "spring / summer / fall / winter diet shifts",
        "juvenile versus adult diet",
        "prey-size preference",
        "population-specific forage substitutions",
      ],
    );
  }

  const facts: AnglerProfileFact[] = [
    { label: "Feeding style", value: `${labelOf(dossier.feedingStyle)}. ${dossier.primaryNote}` },
    { label: "Feeding zone", value: labelOf(dossier.feedingZone) },
    { label: "Primary forage", value: labels(dossier.primaryForage) },
    ...(dossier.seasonalDiet ?? []).map((item) => ({
      label: labelOf(item.season),
      value: item.emphasis,
      kind: "season" as const,
    })),
    ...(dossier.lifeStageDiet?.youngOfYear
      ? [{ label: "Young-of-year", value: dossier.lifeStageDiet.youngOfYear, kind: "life_stage" as const }]
      : []),
    ...(dossier.lifeStageDiet?.juvenile
      ? [{ label: "Juvenile", value: dossier.lifeStageDiet.juvenile, kind: "life_stage" as const }]
      : []),
    ...(dossier.lifeStageDiet?.adult
      ? [{ label: "Adult", value: dossier.lifeStageDiet.adult, kind: "life_stage" as const }]
      : []),
    ...(dossier.preySizeShifts ? [{ label: "Prey-size shifts", value: dossier.preySizeShifts }] : []),
    ...(dossier.ontogeneticShift ? [{ label: "Ontogenetic shift", value: dossier.ontogeneticShift }] : []),
    ...(dossier.forageSubstitutions
      ? [{ label: "Forage substitutions", value: dossier.forageSubstitutions }]
      : []),
    { label: "Observed forage rule", value: dossier.observedForageRule },
    {
      label: "Diet sources",
      value: dossier.sources.map((source) => source.label).join("; "),
      kind: "source",
    },
  ];

  return section(
    "diet",
    "Diet",
    "What does it eat?",
    dossier.status,
    dossier.status === "reviewed"
      ? "Reviewed diet mechanics from agency or peer-reviewed sources. Diet capacity is not proof that a hatch or prey event is occurring."
      : "A partial diet dossier is on file. Remaining gaps stay visible instead of being filled with generic model text.",
    facts,
    dossier.gaps,
  );
}

function seasonalCalendarSection(
  species: SpeciesRecord,
  dossier: SeasonalCalendarDossier | null,
): AnglerProfileSection {
  if (!dossier) {
    return section(
      "seasonal_calendar",
      "Seasonal calendar",
      "When should I fish for them?",
      "partial",
      "Season already helps rank presentations, and spawning overlap is treated as caution, but this profile does not yet claim a species-authored month-by-month calendar.",
      [
        { label: "Reviewed spawning seasons", value: labels(species.spawning.seasons) },
        { label: "Spawning note", value: species.spawning.note },
      ],
      [
        "month-by-month location changes",
        "pre-spawn / spawn / post-spawn behavior outside protected aggregation guidance",
        "seasonal feeding windows",
        "winter holding-class behavior without named-concentration output",
      ],
    );
  }

  const facts: AnglerProfileFact[] = [
    { label: "Overview", value: dossier.overview },
    { label: "Reviewed spawning seasons", value: labels(species.spawning.seasons) },
    ...dossier.entries.map((entry) => ({
      label: labelOf(entry.season),
      value: calendarEntryValue(entry),
      kind: "season" as const,
    })),
    {
      label: "Calendar sources",
      value: dossier.sources.map((source) => source.label).join("; "),
      kind: "source",
    },
  ];

  return section(
    "seasonal_calendar",
    "Seasonal calendar",
    "When should I fish for them?",
    dossier.status,
    dossier.status === "reviewed"
      ? "Reviewed seasonal progression by habitat class, depth, and conservation context. Spawning aggregations are excluded from targeting guidance."
      : "A partial seasonal calendar is on file. Remaining gaps stay visible instead of being filled with generic model text.",
    facts,
    dossier.gaps,
  );
}

/**
 * AFP-1.2 is a coverage-aware reference view over the reviewed species catalog.
 *
 * Identification, behavior, diet, and seasonal-calendar dossiers overlay the
 * existing ten-question contract when reviewed. Missing fight, table-quality,
 * or live-regulation facts stay visible as review gaps instead of being filled
 * with generic model text.
 */
/**
 * The ten-question angler profile for one species.
 *
 * `overlays` is passed in rather than looked up: the reviewed dossiers now live
 * in Supabase and arrive per species, so this stays a pure function of the
 * record plus whatever research has actually been reviewed for it.
 */
export function buildAnglerSpeciesProfile(
  species: SpeciesRecord,
  overlays: SpeciesOverlays,
): AnglerSpeciesProfile {
  const flowing = species.flowingPresentations;
  const still = species.stillPresentations;
  const holding = [
    ...species.habitat.riverHolding,
    ...species.habitat.stillHolding,
  ];
  const identification = overlays.identification;
  const behavior = overlays.behavior;
  const diet = overlays.diet;
  const calendar = overlays.seasonalCalendar;

  const sections: AnglerProfileSection[] = [
    identificationSection(species, identification),
    section(
      "habitat_location",
      "Habitat & location",
      "Where do I find them?",
      "partial",
      "This is one of the strongest existing layers: range, origin context, water type, thermal bands, depth tendency, current preference, light response, and reviewed holding-water classes are already structured.",
      [
        { label: "Range", value: species.geographic },
        { label: "Native / introduced context", value: species.nativeContext },
        { label: "Water types", value: labels(species.habitat.waterTypes) },
        {
          label: "Preferred water temperature",
          value: `${species.thermal.preferredF[0]}–${species.thermal.preferredF[1]}°F`,
        },
        { label: "Depth tendency", value: species.habitat.depthTendency },
        { label: "Current preference", value: species.habitat.currentPreference },
        {
          label: "Reviewed structure / holding water",
          value: holding.length > 0 ? labels(holding) : "No holding-water class reviewed",
        },
      ],
      [
        "species-specific oxygen thresholds",
        "species-specific clarity preferences",
        "complete seasonal movement calendar",
        "migration detail at population scale where appropriate",
      ],
    ),
    behaviorSection(species, behavior),
    dietSection(species, diet),
    section(
      "methods",
      "Best fishing methods",
      "How should I fish for them?",
      "partial",
      "The application already reviews presentation families and then derives the mechanical equipment job. It intentionally avoids a generic best-lure catalog.",
      [
        {
          label: "Flowing-water presentations",
          value: flowing.length > 0 ? labels(flowing) : "No flowing-water presentation family reviewed",
        },
        {
          label: "Stillwater presentations",
          value: still.length > 0 ? labels(still) : "No stillwater presentation family reviewed",
        },
      ],
      [
        "species-profile rod power / action ranges",
        "reel and line / leader ranges",
        "hook-type reference",
        "rigging-method reference",
        "bait / lure family reference separate from presentation mechanics",
        "retrieve-speed ranges where defensible",
      ],
    ),
    seasonalCalendarSection(species, calendar),
    section(
      "conditions",
      "Conditions",
      "What conditions change the decision?",
      "partial",
      "The live scenario already accepts water temperature, flow or stillwater state, clarity, light, weather trend, season, holding water, and observed forage. Species-specific effects are strongest for thermal and light biology today.",
      [
        {
          label: "Active thermal band",
          value: `${species.thermal.activeF[0]}–${species.thermal.activeF[1]}°F`,
        },
        { label: "Cold edge", value: `${species.thermal.coldEdgeF}°F` },
        { label: "Warm edge", value: `${species.thermal.warmEdgeF}°F` },
        { label: "Light response", value: species.habitat.lightResponse },
      ],
      [
        "species-specific wind response",
        "species-specific rain / snow response",
        "barometric-pressure evidence",
        "moon phase / moonrise evidence",
        "species-specific water-level response",
      ],
    ),
    section(
      "fight",
      "Fight characteristics",
      "What is it like to catch one?",
      "not_reviewed",
      "Fight behavior is not currently a reviewed data layer. The app should not infer it from body shape, reputation, or generic gamefish language.",
      [],
      [
        "fight strength",
        "speed and endurance",
        "jumping tendency",
        "head-shake / surge / running behavior",
        "landing considerations",
      ],
    ),
    section(
      "food_value",
      "Food value",
      "Can I eat it?",
      "not_reviewed",
      "Table quality and consumption safety are not currently modeled. Consumption advisories must remain jurisdiction- and waterbody-aware rather than becoming a static species claim.",
      [],
      [
        "table quality / flavor / texture",
        "cleaning difficulty and fillet yield",
        "cooking-method guidance",
        "current mercury / contaminant advisories by jurisdiction and waterbody",
      ],
    ),
    section(
      "regulations_conservation",
      "Regulations & conservation",
      "Can I legally target or keep it, and how do I protect the resource?",
      "partial",
      "Target-status and conservation gates are already structured. Exact seasons, size limits, bag limits, and consumption advisories must come from current jurisdictional sources rather than a static catalog record.",
      [
        { label: "Target status", value: targetStatusLabel(species) },
        {
          label: "Jurisdiction verification",
          value: species.targetContext?.verifyLocalRules ? "Required" : "Check current local regulations before fishing",
        },
        {
          label: "Conservation / regulation note",
          value: species.targetContext?.note ?? species.targetStatusNote ?? "Use current local regulations and species-specific stewardship guidance.",
        },
      ],
      [
        "live size limits",
        "live bag / possession limits",
        "open / closed seasons",
        "water-specific protected areas",
        "current population-health status by management unit",
        "waterbody-specific consumption advisories",
      ],
    ),
  ];

  return {
    modelVersion: ANGLER_PROFILE_MODEL_VERSION,
    speciesId: species.id,
    sections,
    coverage: {
      total: sections.length,
      reviewed: sections.filter((item) => item.status === "reviewed").length,
      partial: sections.filter((item) => item.status === "partial").length,
      notReviewed: sections.filter((item) => item.status === "not_reviewed").length,
    },
  };
}
