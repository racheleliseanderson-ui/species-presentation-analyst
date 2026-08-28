import { ALIASES } from "./aliases.ts";
import type { SpeciesRecord } from "../protocol/types.ts";
import { labelOf } from "../protocol/vocab.ts";

export const ANGLER_PROFILE_MODEL_VERSION = "AFP-1.0" as const;

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

export type AnglerProfileFact = {
  label: string;
  value: string;
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

/**
 * AFP-1.0 is a coverage-aware reference view over the reviewed species catalog.
 *
 * It deliberately does not fabricate fields that the current catalog has not yet
 * reviewed. Missing identification, fight, table-quality, or regulation facts stay
 * visible as review gaps instead of being filled with generic model text.
 */
export function buildAnglerSpeciesProfile(species: SpeciesRecord): AnglerSpeciesProfile {
  const aliases = ALIASES[species.id] ?? [];
  const flowing = species.flowingPresentations;
  const still = species.stillPresentations;
  const holding = [
    ...species.habitat.riverHolding,
    ...species.habitat.stillHolding,
  ];

  const sections: AnglerProfileSection[] = [
    section(
      "identification",
      "Identification",
      "What fish is this?",
      "partial",
      "The catalog has authoritative naming and angler aliases, but it does not yet claim a complete visual-identification dossier.",
      [
        { label: "Common name", value: species.commonNames[0] },
        { label: "Scientific name", value: species.scientificName },
        {
          label: "Also called",
          value: aliases.length > 0 ? aliases.join(", ") : "No additional reviewed angler aliases stored",
        },
      ],
      [
        "physical description and diagnostic traits",
        "color and regional appearance variation",
        "juvenile versus adult appearance",
        "similar-species comparison keys",
        "average and maximum size / weight",
        "age potential",
      ],
    ),
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
    section(
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
        "weather-front response beyond generic condition weighting",
        "predator-avoidance behavior",
      ],
    ),
    section(
      "diet",
      "Diet",
      "What does it eat?",
      "partial",
      "Primary forage classes are structured and can be strengthened by an observed Hatch Match packet. Seasonal and life-stage diet detail is not yet complete.",
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
    ),
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
    section(
      "seasonal_calendar",
      "Seasonal calendar",
      "When should I fish for them?",
      "partial",
      "Season is already a core weighting axis and spawning overlap is treated as caution, but AFP-1.0 does not yet claim a species-authored month-by-month calendar.",
      [
        { label: "Reviewed spawning seasons", value: labels(species.spawning.seasons) },
        { label: "Spawning note", value: species.spawning.note },
      ],
      [
        "month-by-month location changes",
        "pre-spawn / spawn / post-spawn behavior outside protected aggregation guidance",
        "seasonal feeding windows",
        "winter concentration behavior without hotspot output",
      ],
    ),
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
