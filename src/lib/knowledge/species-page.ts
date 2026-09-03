/**
 * What a species page is made of.
 *
 * A pure function of (record, overlays). Nothing here fetches, and nothing here
 * writes a fact that is not already in one of those two inputs — the page's
 * whole claim is that it is the reviewed record rendered, so a sentence
 * invented in this file would quietly break that claim.
 *
 * Two ideas shape the model.
 *
 * The first is that the page should read differently for different fish,
 * because the records differ. A species with three agency sources, a thermal
 * band and a full seasonal calendar has a page with a long middle. A species
 * whose seasonal account is one sourced paragraph about pupping has a short
 * one, and says why it is short. Nothing is padded to a template length.
 *
 * The second is that `gaps` is content. Every section carries what it does not
 * know beside what it does, and `allGaps` collects them so the page can give
 * the unknowns a place of their own rather than a footnote. Structural gaps —
 * no thermal band at all, no reviewed presentation family for a water type —
 * are derived here rather than authored, because "the field is absent" is a
 * fact about the record that a reader deserves stated rather than inferred
 * from a section that simply is not there.
 */

import type { SpeciesRecord, TargetStatus } from "../protocol/types.ts";
import type { WaterType } from "../protocol/vocab.ts";
import { isMarine, labelOf } from "../protocol/vocab.ts";
import { PRESENTATIONS } from "./presentations.ts";
import { reviewedHoldingFor, reviewedPresentationsFor } from "../engine/water.ts";
import { SPECIES_WEIGHT_OVERRIDE_RULES } from "../engine/species-weight-overrides-catalog.ts";
import { populationProfilesForSpecies } from "../engine/population-context.ts";
import { ALIASES } from "./aliases.ts";
import { SPECIES } from "./species-catalog.ts";
import { SPECIES_IMAGES_BY_ID, type SpeciesImageRecord } from "./species-images.ts";
import { speciesSlug } from "./species-slug.ts";
import type { SpeciesOverlays } from "./overlays.ts";
import type { DossierSource } from "./dossier-types.ts";

/* -------------------------------------------------------------------------- */

export type SourceEntry = {
  label: string;
  class: "agency" | "peer_reviewed" | "synthesis";
  url?: string;
  /** Which part of the record leaned on it. */
  usedFor: string[];
  reviewedAt: string;
  nextReviewAt?: string;
};

export type GapEntry = {
  /** The section this came from, for grouping. */
  area: string;
  text: string;
  /** Authored gaps were written by a reviewer; derived ones are read off the
   *  shape of the record. Both are true; only one was typed by a person. */
  origin: "declared" | "structural";
  /**
   * Most authored gaps are noun phrases — "seasonal diet emphasis", "a
   * continent-wide mean length" — written to sit after an implied "still
   * needed:". A handful are whole sentences. Printing both as if they were
   * sentences turned half the column into fragments, so the shape travels with
   * the text and the page supplies the lead-in the phrase form assumes.
   */
  phrasing: "sentence" | "phrase";
};

export type PresentationEntry = {
  id: string;
  label: string;
  job: string;
  mechanics: string[];
  requirements: { key: string; label: string; value: string }[];
};

export type WaterSection = {
  waterType: WaterType;
  label: string;
  marine: boolean;
  holding: { id: string; label: string }[];
  presentations: PresentationEntry[];
};

export type OverrideEntry = {
  id: string;
  note: string;
  when: string[];
  families: string[];
  reviewedAt: string;
};

export type StatusBlock = {
  status: TargetStatus;
  label: string;
  /** Short line for a badge. */
  short: string;
  note?: string;
  jurisdictionScope?: string;
  verifyLocalRules: boolean;
  contextNote?: string;
  /**
   * True when the record itself says a person, not the record, has to settle
   * something. Today exactly one species carries it, and the page it produces
   * is the most important page in the catalog.
   */
  unresolved: boolean;
};

export type SpeciesPageModel = {
  species: SpeciesRecord;
  slug: string;
  path: string;
  commonName: string;
  scientificName: string;
  alsoCalled: string[];
  groupLabel: string;
  /** The record's own sourced framing sentence. Not written here. */
  standfirst: string;
  geographic: string;
  waterTypes: { id: WaterType; label: string }[];
  realm: "freshwater" | "saltwater" | "both";
  status: StatusBlock;
  image: SpeciesImageRecord | null;

  thermal: {
    reviewed: boolean;
    rows: { label: string; value: string }[];
    basisNote?: string;
    sourceNote?: string;
  };

  behavior: {
    present: boolean;
    status?: "reviewed" | "partial";
    prose: { label: string; text: string }[];
    social?: string;
    feeding?: string;
    diel?: string;
  };

  positioning: {
    depthTendency: string;
    currentPreference?: string;
    lightResponse?: string;
    water: WaterSection[];
  };

  forage: {
    classes: { id: string; label: string }[];
    present: boolean;
    style?: string;
    zone?: string;
    primaryNote?: string;
    seasonal: { season: string; emphasis: string }[];
    lifeStage: { label: string; text: string }[];
    shifts: { label: string; text: string }[];
    observedForageRule?: string;
  };

  season: {
    present: boolean;
    overview?: string;
    entries: {
      season: string;
      label: string;
      lines: { label: string; text: string }[];
      presentationImplication?: string;
      invalidators: string[];
      conservationNote?: string;
    }[];
    spawning?: { seasons: string[]; note: string };
  };

  identification: {
    present: boolean;
    traits: string[];
    coloration?: string;
    size: { label: string; value: string }[];
    similar: { name: string; distinction: string; slug: string | null }[];
  };

  overrides: OverrideEntry[];
  populations: {
    id: string;
    label: string;
    positioning: string;
    note: string;
    lifeHistory: string;
    origin: string;
    invalidators: string[];
    waterTypes: string[];
  }[];

  exceptions: string[];
  sources: SourceEntry[];
  allGaps: GapEntry[];
  overlayCount: number;
  reviewedAt: string;
  nextReviewAt: string;

  related: {
    heading: string;
    reason: string;
    items: { slug: string; name: string; scientificName: string; detail: string }[];
  }[];

  meta: { title: string; description: string };
};

/* -------------------------------------------------------------------------- */

const GROUP_LABELS: Record<string, string> = {
  trout_salmon: "Trout & salmon",
  bass_panfish: "Bass & panfish",
  predator: "Freshwater predator",
  other: "Other freshwater",
  inshore_surf: "Inshore & surf",
  reef_bottom: "Reef & bottom",
  offshore_pelagic: "Offshore pelagic",
  sharks: "Sharks",
};

const STATUS_LABELS: Record<TargetStatus, { label: string; short: string }> = {
  standard: { label: "Ordinary target", short: "Ordinary target" },
  regulated_context: {
    label: "Regulated context — check the rules for the exact water",
    short: "Regulated context",
  },
  conservation_sensitive: {
    label: "Conservation-sensitive — presence is not permission",
    short: "Conservation-sensitive",
  },
  non_target: { label: "Not a target here", short: "Not a target" },
};

const REQUIREMENT_LABELS: Record<string, string> = {
  depthControl: "Depth control",
  sensitivity: "Sensitivity",
  castingDistance: "Casting distance",
  lureWeightBand: "Weight range",
  coverResistance: "Cover resistance",
  lineVisibilityPreference: "Line visibility",
  retieFrequency: "Retie frequency",
  boatControl: "Boat control",
  dragSmoothness: "Drag smoothness",
  lineCapacity: "Line capacity",
};

const PRESENTATIONS_BY_ID: Record<string, (typeof PRESENTATIONS)[number]> = Object.fromEntries(
  PRESENTATIONS.map((family) => [family.id, family]),
);

/** The marker a reviewer leaves when the record refuses to settle something. */
const UNRESOLVED_MARKER = "A HUMAN SHOULD RULE ON";

function titleCase(value: string): string {
  const label = labelOf(value);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dedupeSources(entries: SourceEntry[]): SourceEntry[] {
  const byKey = new Map<string, SourceEntry>();
  for (const entry of entries) {
    const key = `${entry.url ?? ""}::${entry.label.toLowerCase()}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, { ...entry, usedFor: [...entry.usedFor] });
      continue;
    }
    for (const use of entry.usedFor) {
      if (!existing.usedFor.includes(use)) existing.usedFor.push(use);
    }
    if (!existing.url && entry.url) existing.url = entry.url;
    if (entry.reviewedAt > existing.reviewedAt) existing.reviewedAt = entry.reviewedAt;
  }
  // Agency first, then peer-reviewed, then synthesis. Inside a class, the one
  // the most sections lean on goes first — it is the spine of the record.
  const rank = { agency: 0, peer_reviewed: 1, synthesis: 2 } as const;
  return [...byKey.values()].sort(
    (a, b) => rank[a.class] - rank[b.class] || b.usedFor.length - a.usedFor.length,
  );
}

function collect(
  sources: DossierSource[] | SpeciesRecord["sources"] | undefined,
  usedFor: string,
  reviewedAt: string,
  nextReviewAt?: string,
): SourceEntry[] {
  return (sources ?? []).map((source) => ({
    label: source.label,
    class: source.class,
    url: source.url,
    usedFor: [usedFor],
    reviewedAt,
    nextReviewAt,
  }));
}

function line(label: string, text: string | undefined | null) {
  return text ? [{ label, text }] : [];
}

/* -------------------------------------------------------------------------- */

export function buildSpeciesPage(
  species: SpeciesRecord,
  overlays: SpeciesOverlays,
): SpeciesPageModel {
  const slug = speciesSlug(species);
  const identification = overlays.identification;
  const behavior = overlays.behavior;
  const diet = overlays.diet;
  const calendar = overlays.seasonalCalendar;

  const gaps: GapEntry[] = [];
  const phrasingOf = (text: string): GapEntry["phrasing"] => {
    const first = text.trim().charAt(0);
    // A leading capital plus a terminal stop is the sentence form. Anything
    // else was written to follow a lead-in.
    return first === first.toUpperCase() &&
      first !== first.toLowerCase() &&
      /[.!?]$/.test(text.trim())
      ? "sentence"
      : "phrase";
  };
  const pushDeclared = (area: string, list: string[] | undefined) => {
    for (const text of list ?? [])
      gaps.push({ area, text, origin: "declared", phrasing: phrasingOf(text) });
  };
  const pushStructural = (area: string, text: string) =>
    gaps.push({ area, text, origin: "structural", phrasing: "sentence" });

  /* --- names -------------------------------------------------------------- */

  const commonName = species.commonNames[0] ?? species.scientificName;
  const alsoCalled = [
    ...species.commonNames.slice(1),
    ...(identification?.regionalNames ?? []),
    ...(ALIASES[species.id] ?? []),
  ]
    .map((name) => name.trim())
    .filter((name, index, all) => {
      if (!name) return false;
      const lower = name.toLowerCase();
      if (lower === commonName.toLowerCase()) return false;
      return all.findIndex((other) => other.toLowerCase() === lower) === index;
    });

  /* --- status ------------------------------------------------------------- */

  const status: TargetStatus = species.targetStatus ?? "standard";
  const contextNote = species.targetContext?.note;
  const statusBlock: StatusBlock = {
    status,
    label: STATUS_LABELS[status].label,
    short: STATUS_LABELS[status].short,
    note: species.targetStatusNote,
    jurisdictionScope: species.targetContext?.jurisdictionScope,
    verifyLocalRules: species.targetContext?.verifyLocalRules ?? false,
    contextNote,
    unresolved: Boolean(contextNote && contextNote.includes(UNRESOLVED_MARKER)),
  };

  /* --- water -------------------------------------------------------------- */

  const waterTypes = species.habitat.waterTypes.map((id) => ({ id, label: labelOf(id) }));
  const marineCount = species.habitat.waterTypes.filter((w) => isMarine(w)).length;
  const realm: SpeciesPageModel["realm"] =
    marineCount === 0 ? "freshwater" : marineCount === waterTypes.length ? "saltwater" : "both";

  const water: WaterSection[] = species.habitat.waterTypes.map((waterType) => {
    const holdingIds = reviewedHoldingFor(species, waterType) ?? [];
    const families = reviewedPresentationsFor(species, waterType) ?? [];
    const presentations: PresentationEntry[] = families.flatMap((id) => {
      const family = PRESENTATIONS_BY_ID[id];
      if (!family) return [];
      return [
        {
          id: family.id,
          label: family.label,
          job: family.job,
          mechanics: family.mechanics,
          requirements: Object.entries(family.system).map(([key, value]) => ({
            key,
            label: REQUIREMENT_LABELS[key] ?? titleCase(key),
            value: titleCase(String(value)),
          })),
        },
      ];
    });
    if (presentations.length === 0) {
      pushStructural(
        "Presentation",
        `No presentation family is reviewed for ${commonName} in ${labelOf(waterType).toLowerCase()}. The record documents the fish there; it does not yet say how to fish for it there.`,
      );
    }
    if (holdingIds.length === 0) {
      pushStructural(
        "Holding water",
        `No holding-water class is reviewed for ${labelOf(waterType).toLowerCase()}, so the reading cannot narrow position within that water.`,
      );
    }
    return {
      waterType,
      label: labelOf(waterType),
      marine: isMarine(waterType),
      holding: holdingIds.map((id) => ({ id, label: labelOf(id) })),
      presentations,
    };
  });

  /* --- thermal ------------------------------------------------------------ */

  const thermal = species.thermal;
  const thermalRows: { label: string; value: string }[] = [];
  if (thermal?.preferredF)
    thermalRows.push({
      label: "Preferred",
      value: `${thermal.preferredF[0]}–${thermal.preferredF[1]}°F`,
    });
  if (thermal?.activeF)
    thermalRows.push({
      label: "Reported active",
      value: `${thermal.activeF[0]}–${thermal.activeF[1]}°F`,
    });
  if (thermal?.coldEdgeF != null)
    thermalRows.push({ label: "Cold edge", value: `${thermal.coldEdgeF}°F` });
  if (thermal?.warmEdgeF != null)
    thermalRows.push({ label: "Warm edge", value: `${thermal.warmEdgeF}°F` });

  if (thermalRows.length === 0) {
    pushStructural(
      "Water temperature",
      `No agency or peer-reviewed temperature band for ${commonName} was found that a review would accept. The reading runs without one rather than borrowing a number from a related fish.`,
    );
  } else if (thermal?.basis === "distribution") {
    pushStructural(
      "Water temperature",
      "The temperature figures describe where this fish is found and caught, not a measured preference. Those are different claims and the record only has the weaker one.",
    );
  }

  /* --- behaviour ---------------------------------------------------------- */

  const behaviorProse = behavior
    ? [
        ...line("Seasonal activity", behavior.seasonalActivity),
        ...line("Temperature-driven behaviour", behavior.thermalDrivenBehavior),
        ...line("Depth movement", behavior.depthMovement),
        ...line("Facing the current", behavior.currentFacing),
        ...line("Water level", behavior.waterLevelResponse),
        ...line("Change in flow", behavior.flowChangeResponse),
        ...line("Clarity", behavior.clarityResponse),
        ...line("Cold fronts", behavior.coldFrontResponse),
        ...line("Angling pressure", behavior.anglingPressureResponse),
        ...line("Cover", behavior.coverUse),
        ...line("Open water", behavior.openWaterBehavior),
        ...line("Predator avoidance", behavior.predatorAvoidance),
        ...line("Territory", behavior.territoriality),
        ...line("Aggression", behavior.aggression),
        ...line("Spawning (conservation context)", behavior.spawningBehavior),
      ]
    : [];

  if (!behavior) {
    pushStructural(
      "Behaviour",
      `No reviewed behaviour dossier exists for ${commonName}. What the catalog holds about how this fish uses water is limited to the habitat record above.`,
    );
  }
  pushDeclared("Behaviour", behavior?.gaps);
  pushDeclared("Identification", identification?.gaps);
  pushDeclared("Forage", diet?.gaps);
  pushDeclared("Season", calendar?.gaps);

  if (!species.habitat.currentPreference)
    pushStructural(
      "Positioning",
      "How this fish uses moving water is not resolved from a source, so the reading does not weight current or tide for it.",
    );
  if (!species.habitat.lightResponse)
    pushStructural(
      "Positioning",
      "No sourced account of light or time-of-day behaviour. Light stays a declared condition rather than a prediction.",
    );
  if (!species.spawning)
    pushStructural(
      "Spawning",
      "No spawning account is recorded. For some species that is a missing source; for others it is deliberate, because the only available account describes an aggregation and naming one is exactly what gets a population fished out.",
    );

  /* --- forage ------------------------------------------------------------- */

  const forage = {
    classes: species.forageClasses.map((id) => ({ id, label: labelOf(id) })),
    present: Boolean(diet),
    style: diet?.feedingStyle ? titleCase(diet.feedingStyle) : undefined,
    zone: diet?.feedingZone ? titleCase(diet.feedingZone) : undefined,
    primaryNote: diet?.primaryNote,
    seasonal: (diet?.seasonalDiet ?? []).map((entry) => ({
      season: titleCase(entry.season),
      emphasis: entry.emphasis,
    })),
    lifeStage: [
      ...line("Young of year", diet?.lifeStageDiet?.youngOfYear),
      ...line("Juvenile", diet?.lifeStageDiet?.juvenile),
      ...line("Adult", diet?.lifeStageDiet?.adult),
    ],
    shifts: [
      ...line("Prey size", diet?.preySizeShifts),
      ...line("Ontogenetic shift", diet?.ontogeneticShift),
      ...line("Substitutions", diet?.forageSubstitutions),
    ],
    observedForageRule: diet?.observedForageRule,
  };
  if (!diet)
    pushStructural(
      "Forage",
      `No reviewed diet dossier for ${commonName}. The forage classes above come from the species record and are a capacity list, not an account of what is being eaten this week.`,
    );

  /* --- season ------------------------------------------------------------- */

  const season = {
    present: Boolean(calendar),
    overview: calendar?.overview,
    entries: (calendar?.entries ?? []).map((entry) => ({
      season: entry.season,
      label: titleCase(entry.season),
      lines: [
        ...line("Where they sit", entry.habitatClass),
        ...line("Depth", entry.depthTendency),
        ...line("Movement", entry.movementTendency),
        ...line("Feeding", entry.feedingEmphasis),
        ...line("Forage", entry.forageEmphasis),
        ...line("Temperature", entry.thermalContext),
        ...line("Current", entry.currentUse),
        ...line("Cover", entry.coverUse),
        ...line("Light", entry.lightSensitivity),
      ],
      presentationImplication: entry.presentationImplication,
      invalidators: entry.invalidators ?? [],
      conservationNote: entry.conservationNote,
    })),
    spawning: species.spawning
      ? {
          seasons: species.spawning.seasons.map((s) => titleCase(s)),
          note: species.spawning.note,
        }
      : undefined,
  };
  if (!calendar)
    pushStructural(
      "Season",
      `No reviewed seasonal calendar for ${commonName}. Season still changes the reading through temperature and the species record, but there is no month-by-month account to show.`,
    );

  /* --- identification ----------------------------------------------------- */

  const identBlock = {
    present: Boolean(identification),
    traits: identification?.identificationTraits ?? [],
    coloration: identification?.coloration,
    size: identification
      ? [
          { label: "Average adult length", value: identification.averageAdultLength },
          { label: "Common angling size", value: identification.commonAnglingSize },
          { label: "Typical weight", value: identification.typicalWeight },
          { label: "Maximum documented", value: identification.maximumDocumentedSize },
          ...(identification.longevity
            ? [{ label: "Longevity", value: identification.longevity }]
            : []),
        ]
      : [],
    similar: (identification?.similarSpecies ?? []).map((entry) => {
      const match = entry.speciesId
        ? SPECIES.find((candidate) => candidate.id === entry.speciesId)
        : SPECIES.find(
            (candidate) =>
              entry.name.toLowerCase().includes(candidate.scientificName.toLowerCase()) ||
              candidate.commonNames.some((name) => name.toLowerCase() === entry.name.toLowerCase()),
          );
      return {
        name: entry.name,
        distinction: entry.distinction,
        slug: match ? speciesSlug(match) : null,
      };
    }),
  };
  if (!identification)
    pushStructural(
      "Identification",
      `No reviewed identification dossier for ${commonName}. The catalog can name the fish; it cannot yet tell you how to be sure you are holding one.`,
    );
  if (!SPECIES_IMAGES_BY_ID[species.id])
    pushStructural(
      "Identification",
      "No reviewed image. A photograph is only in this catalog when an agency or a named creator labelled the subject, and nobody has cleared one for this species yet.",
    );

  /* --- overrides and populations ------------------------------------------ */

  const overrides: OverrideEntry[] = SPECIES_WEIGHT_OVERRIDE_RULES.filter(
    (rule) => rule.speciesId === species.id,
  ).map((rule) => {
    const when: string[] = [];
    if (rule.when.waterTypes?.length) when.push(rule.when.waterTypes.map(labelOf).join(" or "));
    if (rule.when.seasons?.length) when.push(rule.when.seasons.map(labelOf).join(" or "));
    if (rule.when.thermalStates?.length)
      when.push(rule.when.thermalStates.map(labelOf).join(" or "));
    if (rule.when.holding?.length) when.push(rule.when.holding.map(labelOf).join(", "));
    if (rule.when.forage?.length) when.push(rule.when.forage.map(labelOf).join(", "));
    if (rule.when.light?.length) when.push(rule.when.light.map(labelOf).join(" or "));
    if (rule.when.tideMovements?.length)
      when.push(rule.when.tideMovements.map(labelOf).join(" or "));
    if (rule.when.tideStrengths?.length)
      when.push(rule.when.tideStrengths.map(labelOf).join(" or "));
    return {
      id: rule.id,
      note: rule.note,
      when,
      families: Object.keys(rule.bias).map((id) => PRESENTATIONS_BY_ID[id]?.label ?? labelOf(id)),
      reviewedAt: rule.reviewedAt,
    };
  });
  if (overrides.length === 0)
    pushStructural(
      "Presentation",
      `No species-specific weighting rule is reviewed for ${commonName}. Its ranking comes from the shared model — season, temperature, water type, holding and forage — with nothing added for this fish in particular.`,
    );

  const populations = populationProfilesForSpecies(species.id).map((profile) => ({
    id: profile.id,
    label: profile.label,
    positioning: profile.positioning,
    note: profile.note,
    lifeHistory: titleCase(profile.lifeHistory),
    origin: titleCase(profile.populationOrigin),
    invalidators: profile.invalidators,
    waterTypes: profile.waterTypes.map(labelOf),
  }));
  if (populations.length === 0)
    pushStructural(
      "Population context",
      "No regional population profile is registered. The species-level reading stands on its own; it does not silently become a local one.",
    );

  /* --- sources ------------------------------------------------------------ */

  const sources = dedupeSources([
    ...collect(
      species.sources,
      "Habitat, thermal band and presentation families",
      species.reviewedAt,
      species.nextReviewAt,
    ),
    ...collect(
      identification?.sources,
      "Identification",
      identification?.reviewedAt ?? species.reviewedAt,
      identification?.nextReviewAt,
    ),
    ...collect(
      behavior?.sources,
      "Behaviour",
      behavior?.reviewedAt ?? species.reviewedAt,
      behavior?.nextReviewAt,
    ),
    ...collect(diet?.sources, "Forage", diet?.reviewedAt ?? species.reviewedAt, diet?.nextReviewAt),
    ...collect(
      calendar?.sources,
      "Season",
      calendar?.reviewedAt ?? species.reviewedAt,
      calendar?.nextReviewAt,
    ),
    ...populations.flatMap((profile) =>
      collect(
        populationProfilesForSpecies(species.id).find((p) => p.id === profile.id)?.sources,
        "Population context",
        species.reviewedAt,
      ),
    ),
  ]);

  /* --- related ------------------------------------------------------------ */

  const related = buildRelated(species, slug);

  /* --- meta --------------------------------------------------------------- */

  const waterPhrase = waterTypes.map((w) => w.label.toLowerCase()).join(" and ");
  const description = [
    `${commonName} (${species.scientificName}):`,
    `reviewed behaviour, holding water, forage and presentation families for ${waterPhrase},`,
    `every claim sourced, and the gaps in the record stated rather than filled.`,
  ].join(" ");

  const overlayCount = [identification, behavior, diet, calendar].filter(Boolean).length;

  return {
    species,
    slug,
    path: `/species/${slug}`,
    commonName,
    scientificName: species.scientificName,
    alsoCalled,
    groupLabel: GROUP_LABELS[species.group] ?? titleCase(species.group),
    standfirst: species.nativeContext,
    geographic: species.geographic,
    waterTypes,
    realm,
    status: statusBlock,
    image: SPECIES_IMAGES_BY_ID[species.id] ?? null,
    thermal: {
      reviewed: thermalRows.length > 0,
      rows: thermalRows,
      basisNote:
        thermal?.basis === "preference"
          ? "These are measured preference figures."
          : thermal?.basis === "distribution"
            ? "These describe where the fish is found, not what it prefers."
            : thermal?.basis === "mixed"
              ? "A mix of measured preference and distribution data."
              : undefined,
      sourceNote: thermal?.note,
    },
    behavior: {
      present: Boolean(behavior),
      status: behavior?.status,
      prose: behaviorProse,
      social: behavior?.social.note,
      feeding: behavior?.feedingStrategy.note,
      diel: behavior?.dielTendency.note,
    },
    positioning: {
      depthTendency: species.habitat.depthTendency,
      currentPreference: species.habitat.currentPreference,
      lightResponse: species.habitat.lightResponse,
      water,
    },
    forage,
    season,
    identification: identBlock,
    overrides,
    populations,
    exceptions: species.exceptions,
    sources,
    allGaps: gaps,
    overlayCount,
    reviewedAt: species.reviewedAt,
    nextReviewAt: species.nextReviewAt,
    related,
    meta: {
      title: `${commonName} (${species.scientificName}) — behaviour, holding water and presentation`,
      description: description.length > 300 ? `${description.slice(0, 297)}…` : description,
    },
  };
}

/* -------------------------------------------------------------------------- */

/**
 * Other records worth opening from this one.
 *
 * Three axes, each stating the thing the two fish share, because "related
 * species" with no stated relation is a link nobody has a reason to follow.
 * Species that share water and forage are the ones an angler actually confuses
 * or catches by accident, which is the whole reason to put them next to each
 * other.
 */
function buildRelated(species: SpeciesRecord, slug: string): SpeciesPageModel["related"] {
  const others = SPECIES.filter((candidate) => candidate.id !== species.id);
  const item = (candidate: SpeciesRecord, detail: string) => ({
    slug: speciesSlug(candidate),
    name: candidate.commonNames[0] ?? candidate.scientificName,
    scientificName: candidate.scientificName,
    detail,
  });

  const sharedWater = new Set(species.habitat.waterTypes);
  const sharedForage = new Set(species.forageClasses);

  const sameGroup = others
    .filter((candidate) => candidate.group === species.group)
    .slice(0, 8)
    .map((candidate) =>
      item(
        candidate,
        candidate.thermal?.preferredF
          ? `Prefers ${candidate.thermal.preferredF[0]}–${candidate.thermal.preferredF[1]}°F`
          : "No reviewed temperature band",
      ),
    );

  const sameWaterAndForage = others
    .map((candidate) => {
      const water = candidate.habitat.waterTypes.filter((w) => sharedWater.has(w));
      const food = candidate.forageClasses.filter((f) => sharedForage.has(f));
      return { candidate, water, food, score: water.length * 2 + food.length };
    })
    .filter((entry) => entry.water.length > 0 && entry.food.length >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((entry) =>
      item(
        entry.candidate,
        `Shares ${entry.water.map((w) => labelOf(w).toLowerCase()).join(" and ")} and ${entry.food.length} forage ${entry.food.length === 1 ? "class" : "classes"}`,
      ),
    );

  const groups: SpeciesPageModel["related"] = [];
  if (sameWaterAndForage.length > 0)
    groups.push({
      heading: "Same water, overlapping forage",
      reason:
        "These are the fish most likely to eat the same presentation in the same place. Some of them are what you catch when you were fishing for something else.",
      items: sameWaterAndForage.filter((entry) => entry.slug !== slug),
    });
  if (sameGroup.length > 0)
    groups.push({
      heading: `Others in ${(GROUP_LABELS[species.group] ?? species.group).toLowerCase()}`,
      reason: "Records grouped by the kind of fishing rather than by taxonomy.",
      items: sameGroup.filter((entry) => entry.slug !== slug),
    });
  return groups;
}
