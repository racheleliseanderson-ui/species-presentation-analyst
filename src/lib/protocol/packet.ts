import { declaredHolding } from "../engine/water.ts";
import { normalizeTemperatureRangeF } from "../engine/temperature.ts";
import { matchesSpecies } from "../knowledge/aliases.ts";
import { SPECIES, SPECIES_BY_ID } from "../knowledge/species-catalog.ts";
import {
  assessFreshness,
  buildPacket as buildFleetPacket,
  readPacket,
  type FreshnessAssessment,
  type HthPacket as FleetPacket,
  type PacketRead,
} from "../hth-packet.ts";
import { loadIncomingPacket, rememberIncomingPacket } from "./fleet-context.ts";
import {
  CLARITY,
  FLOW_CLASSES,
  FORAGE_CLASSES,
  INSTRUMENT_ID,
  LIGHT,
  RIVER_HOLDING,
  SEASONS,
  STILL_HOLDING,
  STILL_STATES,
  TEMP_SOURCES,
  TIDE_MOVEMENTS,
  TIDE_STRENGTHS,
  WATER_TYPES,
  WEATHER_TRENDS,
  isMarine,
  labelOf,
  type Clarity,
  type FlowClass,
  type ForageClass,
  type Light,
  type RiverHolding,
  type Season,
  type StillHolding,
  type StillState,
  type TempSource,
  type TideMovement,
  type TideStrength,
  type WaterType,
  type WeatherTrend,
} from "./vocab.ts";
import type {
  ForagePacket,
  Interpretation,
  PopulationContextInput,
  ReadingCue,
  ScenarioInput,
  TempStation,
  TemperatureRangeF,
  WaterPacket,
} from "./types.ts";

/** This app's own name in the fleet. Every trail entry it writes says this. */
export const ORIGIN = "species-presentation" as const;

/* ========================================================================== *
 * The vocabulary boundary
 *
 * HTH-1.0 pins the fleet spelling of a temperature source and an evidence class
 * to kebab-case: `official-station`, `user-measured`. Snake-case is still read
 * and normalised by the shared module, but it is never emitted.
 *
 * This app's own vocabulary is snake_case on every axis it has — `slack_high`,
 * `spring_tide`, `frontal_change`, `low_light` — `LABELS` in `vocab.ts` is keyed
 * on those strings, and so is every reading already saved in a reader's
 * browser. So the internal spelling stays snake_case and this file is the one
 * place the two dialects meet: kebab goes out, and kebab comes back in.
 *
 * The alternative was renaming two of this app's fifteen axes, which would have
 * left it with two dialects of its own to fix one at the boundary and would
 * have dropped the temperature source out of every session already stored.
 * ========================================================================== */

/** This app's temperature-source spelling → the fleet's. */
const TEMP_SOURCE_OUT: Record<TempSource, string> = {
  user_measured: "user-measured",
  official_station: "official-station",
  estimated: "estimated",
  unknown: "unknown",
};

/** The fleet's spelling → this app's. The snake spellings are the same string
 *  in both dialects for the two axes that never drifted, so only these two
 *  need a row; anything else falls through to the check against TEMP_SOURCES. */
const TEMP_SOURCE_IN: Record<string, TempSource> = {
  "user-measured": "user_measured",
  "official-station": "official_station",
};

/** The evidence class the fleet expects for a reading of this source. */
function fleetEvidenceClass(source: TempSource): string {
  if (source === "user_measured") return "user-measured";
  if (source === "official_station") return "official-station";
  return source === "unknown" ? "unknown" : "declared";
}

/* ========================================================================== *
 * Outgoing
 * ========================================================================== */

/**
 * Build the packet this app hands to the next step.
 *
 * The envelope, the version stamp, the trail append and the coordinate strip
 * all come from `src/lib/hth-packet.ts`, the file the whole fleet shares.
 * Everything below it is this app's own: which of its results belong in which
 * block, and what its vocabulary calls them.
 *
 * `incoming` is always the ORIGINAL packet that arrived, read back out of
 * session storage — never this app's own previous output. That is what keeps
 * the trail one hop longer than what arrived instead of growing every time the
 * reading re-renders.
 */
export function buildPacket(
  input: ScenarioInput,
  result: Interpretation,
  options: { intent?: string; incoming?: FleetPacket | PacketRead | null } = {},
): FleetPacket {
  const holding = declaredHolding(input) ?? undefined;
  const tempRangeF = normalizeTemperatureRangeF(input.tempRangeF);
  const incoming = options.incoming === undefined ? loadIncomingPacket() : options.incoming;

  return buildFleetPacket({
    origin: ORIGIN,
    instrumentId: INSTRUMENT_ID,
    intent: options.intent ?? "hatch",
    incoming,

    water: {
      ...input.water,
      waterType: input.waterType,
      /* The fleet's key for the fish the reader actually picked. This app used
       * to write it only under `species.id`, where nothing downstream looked. */
      selectedSpecies: result.species.id,
    },

    conditions: {
      waterType: input.waterType,
      tempF: input.tempF,
      tempRangeF: tempRangeF ? { low: tempRangeF[0], high: tempRangeF[1] } : null,
      tempSource: TEMP_SOURCE_OUT[input.tempSource] ?? "unknown",
      /* Temperature provenance travels with the number. A reading with no
       * observation time is a number someone typed, and the next instrument
       * has no way to tell unless these come along. */
      tempObservedAt: input.tempObservedAt ?? null,
      tempRetained: input.tempRetained ?? null,
      tempStation: input.tempStation ?? null,
      flow: input.flow,
      stillState: input.stillState,
      // Only written when this water is actually read on the tide, so a
      // freshwater packet does not carry an empty saltwater field.
      ...(isMarine(input.waterType)
        ? {
            tideMovement: input.tideMovement ?? "unknown",
            tideStrength: input.tideStrength ?? "unknown",
          }
        : {}),
      clarity: input.clarity,
      light: input.light,
      weather: input.weather,
      season: input.season,
      holding,
    },

    provenance: buildProvenance(input, result),

    blocks: {
      species: {
        id: result.species.id,
        scientificName: result.species.scientificName,
        commonNames: result.species.commonNames,
        targetStatus: result.species.targetStatus ?? "standard",
        targetContext: result.species.targetContext,
      },
      populationContext: result.populationContext,
      observations: { forage: input.forage ?? null },
      hypotheses: {
        thermalState: result.thermalState,
        positioning: result.positioning.map((p) => p.text),
        why: result.why,
        invalidators: result.invalidators,
      },
      presentationRequirements: {
        families: result.presentations.map((p) => p.id),
        mechanics: result.presentations[0]?.mechanics ?? [],
        weightingModel: result.weightingModel.version,
        speciesOverrideModel: result.weightingModel.speciesOverrideVersion,
        appliedSpeciesOverrides: result.weightingModel.appliedSpeciesOverrideIds,
        regionalPopulationModel: result.weightingModel.regionalPopulationVersion,
        appliedPopulationProfileId: result.weightingModel.appliedPopulationProfileId,
        weightedFamilies: result.presentations.map((p) => ({ id: p.id, weight: p.weight })),
      },
      equipmentRequirements: result.equipment,
      connectionRequirements: result.connection,
      deviceQuestions: result.rigQuestion ? [result.rigQuestion] : [],
      unknowns: result.unknowns,
    },
  });
}

function buildProvenance(input: ScenarioInput, result: Interpretation) {
  const range = normalizeTemperatureRangeF(input.tempRangeF);
  return [
    {
      source: `${result.species.scientificName} reviewed record`,
      evidenceClass: "declared" as const,
      reviewedAt: result.species.reviewedAt,
    },
    {
      source: `${result.weightingModel.version} explainable presentation weighting`,
      evidenceClass: "declared" as const,
      reviewedAt: result.species.reviewedAt,
    },
    ...(result.weightingModel.appliedSpeciesOverrideIds?.length
      ? [
          {
            source: `${result.weightingModel.speciesOverrideVersion ?? "species override"} reviewed species-specific weighting · ${result.weightingModel.appliedSpeciesOverrideIds.join(", ")}`,
            evidenceClass: "declared" as const,
            reviewedAt: result.species.reviewedAt,
          },
        ]
      : []),
    ...(result.populationContext
      ? [
          {
            source: `${result.weightingModel.regionalPopulationVersion ?? "regional population context"} · ${result.populationContext.label} · ${result.populationContext.source}`,
            evidenceClass: "declared" as const,
            reviewedAt: result.species.reviewedAt,
          },
        ]
      : []),
    {
      source: range
        ? "estimated water-temperature range"
        : input.tempSource === "user_measured"
          ? "user-measured water temperature"
          : input.tempSource === "official_station"
            ? `official station temperature${input.tempStation?.name ? ` · ${input.tempStation.name}` : ""}`
            : "temperature provenance declared",
      // Kebab, because that is the only evidence-class spelling HTH-1.0 emits.
      evidenceClass: fleetEvidenceClass(input.tempSource),
      reviewedAt: result.species.reviewedAt,
      /* The record's own review date is not the moment this link was pressed.
       * `builtAt` is left to the shared builder's `createdAt`; nothing here
       * pretends a month-old record was checked this morning. */
      ...(input.tempObservedAt ? { observedAt: input.tempObservedAt } : {}),
    },
  ];
}

/* ========================================================================== *
 * Incoming — this app's vocabulary, the fleet's envelope
 * ========================================================================== */

/** A carried value is used only when it is one this app's vocabulary knows. */
function enumValue<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

/**
 * Water-type names from the other Hook apps, mapped onto this app's vocabulary.
 *
 * The saltwater types are accepted by name, and a handful of coastal words the
 * other apps use are folded onto the nearest reviewed type. Anything else
 * returns undefined and the reading asks rather than assuming — a surf angler
 * silently handed a stillwater reading is worse than one asked a question.
 */
export function coerceWaterType(value: unknown): WaterType | undefined {
  if (typeof value !== "string") return undefined;
  if ((WATER_TYPES as readonly string[]).includes(value)) return value as WaterType;
  if (value === "river" || value === "stream" || value === "spring") return "flowing";
  if (value === "lake" || value === "reservoir" || value === "lake-margin") return "stillwater";
  if (value === "beach" || value === "surfzone" || value === "surf-zone") return "surf";
  if (value === "estuary" || value === "flats" || value === "backcountry" || value === "bay") {
    return "inshore";
  }
  if (value === "coastal" || value === "reef") return "nearshore";
  if (value === "bluewater" || value === "blue-water" || value === "pelagic") return "offshore";
  return undefined;
}

/**
 * A carried temperature source, in this app's spelling.
 *
 * The fleet writes kebab-case, so that is tried first. The snake spellings are
 * still accepted because a packet built before HTH-1.0 pinned the vocabulary
 * can still be sitting in a tab, and reading it as "unknown" would throw away a
 * reading the sender actually took.
 */
function coerceTempSource(value: unknown): TempSource {
  if (typeof value !== "string") return "unknown";
  const fromFleet = TEMP_SOURCE_IN[value];
  if (fromFleet) return fromFleet;
  if ((TEMP_SOURCES as readonly string[]).includes(value)) return value as TempSource;
  return "unknown";
}

/**
 * Tide from an incoming packet.
 *
 * Anything unrecognised becomes "unknown" rather than a guess. The weighting
 * engine treats "unknown" as "do not apply the tide axis", so a packet from an
 * app that does not model tide costs the reading nothing.
 */
function coerceTideMovement(value: unknown): TideMovement {
  if (typeof value === "string" && (TIDE_MOVEMENTS as readonly string[]).includes(value)) {
    return value as TideMovement;
  }
  if (value === "rising" || value === "incoming" || value === "flood") return "flooding";
  if (value === "falling" || value === "outgoing" || value === "ebb") return "ebbing";
  if (value === "high_slack" || value === "high") return "slack_high";
  if (value === "low_slack" || value === "low") return "slack_low";
  return "unknown";
}

function coerceTideStrength(value: unknown): TideStrength {
  if (typeof value === "string" && (TIDE_STRENGTHS as readonly string[]).includes(value)) {
    return value as TideStrength;
  }
  // Other apps say "spring" and "neap" without the suffix this app uses to keep
  // the spring tide distinct from the spring season in one shared label map.
  if (value === "spring") return "spring_tide";
  if (value === "neap") return "neap_tide";
  if (value === "average" || value === "mean") return "average_tide";
  return "unknown";
}

function coerceTempRange(value: unknown): TemperatureRangeF | null {
  /* The fleet writes `{ low, high }`; this app's engine works in `[low, high]`.
   * Both shapes are accepted so a packet from either dialect lands. */
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const o = value as Record<string, unknown>;
    if (typeof o.low === "number" && typeof o.high === "number") {
      return normalizeTemperatureRangeF([o.low, o.high]);
    }
  }
  return normalizeTemperatureRangeF(value);
}

function coerceTempStation(value: unknown): TempStation | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const o = value as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id.trim()) return null;
  return {
    id: o.id.trim(),
    name: typeof o.name === "string" ? o.name : undefined,
    agency: typeof o.agency === "string" ? o.agency : undefined,
  };
}

function coerceCues(value: unknown): ReadingCue[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const o = entry as Record<string, unknown>;
      if (typeof o.family !== "string" || typeof o.title !== "string") return null;
      return { family: o.family, title: o.title };
    })
    .filter((cue): cue is ReadingCue => cue !== null)
    .slice(0, 12);
}

function coerceForage(raw: unknown): ForagePacket | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.class !== "string" || !(FORAGE_CLASSES as readonly string[]).includes(o.class)) {
    return null;
  }
  const observed = Array.isArray(o.observed)
    ? o.observed.filter((item): item is string => typeof item === "string")
    : undefined;
  return {
    class: o.class as ForageClass,
    hypothesis: typeof o.hypothesis === "string" ? o.hypothesis : undefined,
    confidence: typeof o.confidence === "number" ? o.confidence : undefined,
    observed,
    source: o.source === "hatch_match" ? "hatch_match" : "user_observation",
  };
}

function coercePopulationContext(raw: unknown): PopulationContextInput | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const profileId =
    typeof o.profileId === "string" && o.profileId.trim() ? o.profileId.trim() : null;
  if (!profileId) return null;
  return {
    profileId,
    source: o.source === "field_sense" ? "field_sense" : "user_declared",
  };
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function coerceWater(raw: unknown): WaterPacket {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const documented = Array.isArray(o.documentedSpecies)
    ? o.documentedSpecies.filter((item): item is string => typeof item === "string")
    : undefined;
  return {
    waterId: text(o.waterId),
    waterName: text(o.waterName),
    waterType: coerceWaterType(o.waterType),
    waterClass: text(o.waterClass),
    region: text(o.region),
    state: text(o.state),
    jurisdiction: text(o.jurisdiction),
    documentedSpecies: documented,
    selectedSpecies: text(o.selectedSpecies),
    accessContext: text(o.accessContext),
    managingAgency: text(o.managingAgency),
    officialSourceUrl: text(o.officialSourceUrl),
  };
}

/**
 * Resolve the fish the reader already picked upstream.
 *
 * `water.selectedSpecies` is the fleet's key and is tried first: it is the one
 * the reader chose in Field Sense, which is why they should not have to choose
 * again here. `species.id` / `species.speciesId` are this app's own older keys
 * and the Field Ops slug, kept so a packet from either still resolves. Common
 * names go through the alias table last, because a name match is a guess where
 * an id is not — and nothing is inferred from `documentedSpecies`, which is a
 * list of what lives there, not a choice.
 */
function resolveSpeciesId(packet: FleetPacket): string | undefined {
  const water = (packet.water ?? {}) as Record<string, unknown>;
  const species = (packet.species ?? {}) as Record<string, unknown>;
  const candidates = [text(water.selectedSpecies), text(species.id), text(species.speciesId)];
  for (const candidate of candidates) {
    if (candidate && SPECIES_BY_ID[candidate]) return candidate;
  }
  const names = [
    ...(Array.isArray(species.commonNames)
      ? species.commonNames.filter((name): name is string => typeof name === "string")
      : []),
    ...(text(species.commonName) ? [text(species.commonName) as string] : []),
    ...candidates.filter((value): value is string => Boolean(value)),
  ];
  return SPECIES.find((candidate) => names.some((name) => matchesSpecies(candidate, name)))?.id;
}

/** Map a validated fleet packet onto this app's scenario vocabulary. */
export function applyIncoming(packet: FleetPacket): Partial<ScenarioInput> {
  const water = coerceWater(packet.water);
  const conditions = (packet.conditions ?? {}) as Record<string, unknown>;
  const reading = (packet.reading ?? {}) as Record<string, unknown>;
  const observations = (packet.observations ?? {}) as { forage?: unknown };
  const waterType = coerceWaterType(conditions.waterType) ?? water.waterType;

  const exactTempF =
    typeof conditions.tempF === "number" && Number.isFinite(conditions.tempF)
      ? conditions.tempF
      : null;
  const tempRangeF = exactTempF == null ? coerceTempRange(conditions.tempRangeF) : null;

  /* Holding water belongs to the water type it was declared on. A "seam" from
   * a river packet means nothing on a flat, so it is only kept when the water
   * type that arrived is the one that class belongs to. */
  const holding = text(conditions.holding);
  const holdingRiver =
    waterType === "flowing" ? enumValue<RiverHolding>(holding, RIVER_HOLDING) : undefined;
  const holdingStill =
    waterType === "stillwater" ? enumValue<StillHolding>(holding, STILL_HOLDING) : undefined;

  return {
    speciesId: resolveSpeciesId(packet),
    water,
    waterType,
    populationContext: coercePopulationContext(packet.populationContext),
    tempF: exactTempF,
    tempRangeF,
    tempSource: coerceTempSource(conditions.tempSource),
    tempObservedAt: text(conditions.tempObservedAt) ?? null,
    tempRetained: typeof conditions.tempRetained === "boolean" ? conditions.tempRetained : null,
    tempStation: coerceTempStation(conditions.tempStation),
    cues: coerceCues(reading.cues),
    flow: enumValue<FlowClass>(conditions.flow, FLOW_CLASSES),
    stillState: enumValue<StillState>(conditions.stillState, STILL_STATES),
    clarity: enumValue<Clarity>(conditions.clarity, CLARITY),
    light: enumValue<Light>(conditions.light, LIGHT),
    weather: enumValue<WeatherTrend>(conditions.weather, WEATHER_TRENDS),
    season: enumValue<Season>(conditions.season, SEASONS),
    holdingRiver,
    holdingStill,
    ...(waterType && isMarine(waterType)
      ? {
          tideMovement: coerceTideMovement(conditions.tideMovement),
          tideStrength: coerceTideStrength(conditions.tideStrength),
        }
      : {}),
    forage: coerceForage(observations.forage),
  };
}

/* ========================================================================== *
 * The three-state read
 * ========================================================================== */

export type CarriedRow = { label: string; value: string };

/**
 * What this app does with a link it was handed.
 *
 * Three states, all of them visible. `absent` is the ordinary case and not an
 * error. `invalid` says so in words the reader can act on and leaves them to
 * fill the reading in by hand. `ok` shows what arrived and what was left on the
 * floor, and applies nothing until they say so.
 */
export type IncomingCarry =
  | { state: "absent" }
  | { state: "invalid"; reason: string }
  | {
      state: "ok";
      packet: FleetPacket;
      applied: Partial<ScenarioInput>;
      carried: CarriedRow[];
      declined: string[];
      normalizations: string[];
      freshness: FreshnessAssessment;
      from: string;
    };

/** Blocks this app knowingly does not read, named on screen when they arrive. */
function declinedBlocks(packet: FleetPacket): string[] {
  const out: string[] = [];
  const conditions = (packet.conditions ?? {}) as Record<string, unknown>;
  if (typeof conditions.airTempF === "number") {
    out.push("Air temperature — this reading works off water temperature, and the two are not interchangeable");
  }
  if (Array.isArray(packet.openChecks) && packet.openChecks.length) {
    const count = packet.openChecks.length;
    out.push(
      `${count === 1 ? "One open check" : `${count} open checks`} — open checks belong to the water record, and Field Ops is where they get worked through`,
    );
  }
  if (packet.logistics) {
    out.push("Launches, access and amenities — that is Field Ops' side of the trip, not this one");
  }
  if (packet.readiness) {
    out.push("A readiness score — how ready a trip is says nothing about what the fish are doing");
  }
  if (packet.privacy) {
    out.push("The sender's privacy claim — coordinates are stripped here on arrival either way, so the claim is not relied on");
  }
  return out;
}

/** An ISO stamp is not something to put in front of a reader. */
function readableTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return value;
  try {
    return new Date(ms).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function carriedRows(applied: Partial<ScenarioInput>): CarriedRow[] {
  const rows: CarriedRow[] = [];
  if (applied.speciesId) {
    const species = SPECIES_BY_ID[applied.speciesId];
    rows.push({
      label: "Species picked upstream",
      value: species ? species.commonNames[0] : applied.speciesId,
    });
  }
  if (applied.water?.waterName) rows.push({ label: "Water", value: applied.water.waterName });
  if (applied.water?.waterClass) {
    rows.push({ label: "Water class", value: applied.water.waterClass });
  }
  if (applied.waterType) rows.push({ label: "Water type", value: labelOf(applied.waterType) });
  if (applied.water?.jurisdiction) {
    rows.push({ label: "Area", value: applied.water.jurisdiction });
  }
  if (applied.tempF != null) {
    rows.push({ label: "Water temperature", value: `${applied.tempF}°F` });
  } else if (applied.tempRangeF) {
    rows.push({
      label: "Water temperature",
      value: `${applied.tempRangeF[0]}–${applied.tempRangeF[1]}°F range`,
    });
  }
  if (applied.tempSource && applied.tempSource !== "unknown") {
    rows.push({ label: "Where that reading came from", value: labelOf(applied.tempSource) });
  }
  if (applied.tempStation?.name || applied.tempStation?.id) {
    rows.push({
      label: "Station",
      value: [applied.tempStation.name ?? applied.tempStation.id, applied.tempStation.agency]
        .filter(Boolean)
        .join(" · "),
    });
  }
  const observed = readableTime(applied.tempObservedAt);
  if (observed) rows.push({ label: "Reading taken", value: observed });
  if (applied.tempRetained) {
    rows.push({
      label: "Heads up",
      value: "That temperature was already past its own freshness window when it was sent",
    });
  }
  if (applied.tideMovement && applied.tideMovement !== "unknown") {
    rows.push({ label: "Tide", value: labelOf(applied.tideMovement) });
  }
  if (applied.tideStrength && applied.tideStrength !== "unknown") {
    rows.push({ label: "Tide range", value: labelOf(applied.tideStrength) });
  }
  if (applied.forage) rows.push({ label: "Forage", value: labelOf(applied.forage.class) });
  if (applied.populationContext?.profileId) {
    rows.push({
      label: "Population context",
      value: `${applied.populationContext.profileId} · ${applied.populationContext.source.replaceAll("_", " ")}`,
    });
  }
  for (const cue of applied.cues ?? []) {
    rows.push({ label: `Water read · ${cue.family}`, value: cue.title });
  }
  return rows;
}

/**
 * Read the packet on the way in.
 *
 * One function, used by every screen that can be landed on with a link, so the
 * incoming packet is remembered for the outgoing carry no matter which screen
 * the reader arrived at. It used to be remembered in only one of the three
 * entry paths, which is why a trail that came through "Advanced" survived and
 * the same trail through the ordinary reading did not.
 */
export function readIncoming(source?: string | null): IncomingCarry {
  const read = readPacket(source);
  if (read.state === "absent") return { state: "absent" };
  if (read.state === "invalid") return { state: "invalid", reason: read.reason };

  rememberIncomingPacket(read.packet);
  const applied = applyIncoming(read.packet);
  return {
    state: "ok",
    packet: read.packet,
    applied,
    carried: carriedRows(applied),
    declined: declinedBlocks(read.packet),
    normalizations: read.normalizations,
    freshness: assessFreshness(read.packet),
    from: text(read.packet.fleet?.lastUpdatedBy) ?? text(read.packet.origin) ?? "another Hook tool",
  };
}
