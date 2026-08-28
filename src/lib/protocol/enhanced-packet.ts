import { parseIncomingPacket, coerceWaterType } from "./packet";
import type { ScenarioInput } from "./types";
import {
  CLARITY,
  FLOW_CLASSES,
  LIGHT,
  RIVER_HOLDING,
  SEASONS,
  STILL_HOLDING,
  STILL_STATES,
  WEATHER_TRENDS,
  type Clarity,
  type FlowClass,
  type Light,
  type RiverHolding,
  type Season,
  type StillHolding,
  type StillState,
  type WeatherTrend,
} from "./vocab";

function enumValue<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : undefined;
}

/**
 * Quick Read packet hydration.
 *
 * The legacy parser intentionally accepts only a narrow shared subset. Quick Read can
 * safely reuse additional fields that already exist in HTH-1.0 conditions, so this
 * wrapper carries them without changing packet compatibility or weakening the explicit
 * user-review step.
 */
export function parseEnhancedIncomingPacket(hash: string): Partial<ScenarioInput> | null {
  const base = parseIncomingPacket(hash);
  if (!hash.startsWith("#packet=")) return base;

  try {
    const raw = decodeURIComponent(hash.slice("#packet=".length));
    const data = JSON.parse(raw) as Record<string, unknown>;
    const conditions = (data.conditions ?? {}) as Record<string, unknown>;
    const waterType =
      coerceWaterType(conditions.waterType) ?? base?.waterType ?? base?.water?.waterType;

    const holding = typeof conditions.holding === "string" ? conditions.holding : undefined;
    const holdingRiver =
      waterType === "flowing"
        ? enumValue<RiverHolding>(holding, RIVER_HOLDING)
        : undefined;
    const holdingStill =
      waterType === "stillwater"
        ? enumValue<StillHolding>(holding, STILL_HOLDING)
        : undefined;

    return {
      ...(base ?? {}),
      waterType,
      flow: enumValue<FlowClass>(conditions.flow, FLOW_CLASSES),
      stillState: enumValue<StillState>(conditions.stillState, STILL_STATES),
      clarity: enumValue<Clarity>(conditions.clarity, CLARITY),
      light: enumValue<Light>(conditions.light, LIGHT),
      weather: enumValue<WeatherTrend>(conditions.weather, WEATHER_TRENDS),
      season: enumValue<Season>(conditions.season, SEASONS),
      holdingRiver,
      holdingStill,
    };
  } catch {
    return base;
  }
}
