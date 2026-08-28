import {
  FORAGE_CLASSES,
  INSTRUMENT_ID,
  PACKET_VERSION,
  TEMP_SOURCES,
  WATER_TYPES,
  type ForageClass,
  type TempSource,
  type WaterType,
} from "./vocab";
import type {
  ForagePacket,
  HthPacket,
  Interpretation,
  PopulationContextInput,
  ScenarioInput,
  WaterPacket,
} from "./types";

export function buildPacket(input: ScenarioInput, result: Interpretation): HthPacket {
  const holding =
    input.waterType === "flowing" ? input.holdingRiver ?? undefined : input.holdingStill ?? undefined;
  return {
    packetVersion: PACKET_VERSION,
    origin: "species-presentation",
    createdAt: new Date().toISOString(),
    instrumentId: INSTRUMENT_ID,
    water: input.water,
    species: {
      id: result.species.id,
      scientificName: result.species.scientificName,
      commonNames: result.species.commonNames,
      targetStatus: result.species.targetStatus ?? "standard",
      targetContext: result.species.targetContext,
    },
    populationContext: result.populationContext,
    conditions: {
      waterType: input.waterType,
      tempF: input.tempF,
      tempSource: input.tempSource,
      flow: input.flow,
      stillState: input.stillState,
      clarity: input.clarity,
      light: input.light,
      weather: input.weather,
      season: input.season,
      holding,
    },
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
    provenance: [
      {
        source: `${result.species.scientificName} reviewed record`,
        evidenceClass: "declared",
        reviewedAt: result.species.reviewedAt,
      },
      {
        source: `${result.weightingModel.version} explainable presentation weighting`,
        evidenceClass: "declared",
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
        source:
          input.tempSource === "user_measured"
            ? "user-measured water temperature"
            : input.tempSource === "official_station"
              ? "official station temperature"
              : "temperature provenance declared",
        evidenceClass:
          input.tempSource === "user_measured"
            ? "user_measured"
            : input.tempSource === "official_station"
              ? "official_station"
              : input.tempSource === "unknown"
                ? "unknown"
                : "declared",
        reviewedAt: result.species.reviewedAt,
      },
    ],
    privacy: {
      containsCoordinates: false,
      containsPrivateWater: false,
    },
  };
}

export function encodePacketHash(packet: HthPacket): string {
  return "#packet=" + encodeURIComponent(JSON.stringify(packet));
}

/** Field Sense lake|reservoir|river and Hatch river|stream|lake-margin|spring → flowing|stillwater. Marine stays unknown. */
export function coerceWaterType(value: unknown): WaterType | undefined {
  if (typeof value !== "string") return undefined;
  if ((WATER_TYPES as readonly string[]).includes(value)) return value as WaterType;
  if (value === "river" || value === "stream" || value === "spring") return "flowing";
  if (value === "lake" || value === "reservoir" || value === "lake-margin") return "stillwater";
  return undefined;
}

function coerceTempSource(value: unknown): TempSource {
  if (typeof value === "string" && (TEMP_SOURCES as readonly string[]).includes(value)) {
    return value as TempSource;
  }
  return "unknown";
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

function coerceWater(raw: unknown): WaterPacket {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const waterType = coerceWaterType(o.waterType);
  const documented = Array.isArray(o.documentedSpecies)
    ? o.documentedSpecies.filter((item): item is string => typeof item === "string")
    : undefined;
  return {
    waterId: typeof o.waterId === "string" ? o.waterId : undefined,
    waterName: typeof o.waterName === "string" ? o.waterName : undefined,
    waterType,
    jurisdiction: typeof o.jurisdiction === "string" ? o.jurisdiction : undefined,
    documentedSpecies: documented,
    accessContext: typeof o.accessContext === "string" ? o.accessContext : undefined,
  };
}

export function parseIncomingPacket(hash: string): Partial<ScenarioInput> | null {
  if (!hash.startsWith("#packet=")) return null;
  try {
    const raw = decodeURIComponent(hash.slice("#packet=".length));
    const data = JSON.parse(raw) as Record<string, unknown>;
    const water = coerceWater(data.water);
    const conditions = (data.conditions ?? {}) as Record<string, unknown>;
    const species = data.species as { id?: string } | undefined;
    const observations = (data.observations ?? {}) as { forage?: unknown };
    const waterType = coerceWaterType(conditions.waterType) ?? water.waterType;
    const speciesId = typeof species?.id === "string" && species.id.trim() ? species.id : undefined;
    const tempF =
      typeof conditions.tempF === "number" && Number.isFinite(conditions.tempF) ? conditions.tempF : null;
    return {
      speciesId,
      water,
      waterType,
      populationContext: coercePopulationContext(data.populationContext),
      tempF,
      tempSource: coerceTempSource(conditions.tempSource),
      forage: coerceForage(observations.forage ?? data.forage),
    };
  } catch {
    return null;
  }
}

export const FLEET = [
  { name: "Field Sense", href: "https://waterways.hookthehorizon.blog/" },
  { name: "Hatch Match", href: "https://hatch.hookthehorizon.blog/" },
  { name: "Tackle Link", href: "https://tackle.hookthehorizon.blog/" },
  { name: "Knot Analyst", href: "https://knot.hookthehorizon.blog/" },
  { name: "Rig Signal", href: "https://rig-signal.hookthehorizon.blog/" },
  { name: "Field Ops Desk", href: "https://ops.hookthehorizon.blog/" },
] as const;
