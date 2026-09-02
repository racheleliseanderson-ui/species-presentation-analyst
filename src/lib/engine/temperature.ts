import type {
  ScenarioInput,
  SpeciesRecord,
  TemperatureRangeF,
  ThermalState,
} from "../protocol/types.ts";
import { labelOf } from "../protocol/vocab.ts";

export const MIN_WATER_TEMP_F = 20;
export const MAX_WATER_TEMP_F = 100;

export type ThermalResolution = {
  state: ThermalState;
  states: ThermalState[];
  exactF: number | null;
  rangeF: TemperatureRangeF | null;
};

export function normalizeTemperatureRangeF(value: unknown): TemperatureRangeF | null {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const a = value[0];
  const b = value[1];
  if (typeof a !== "number" || typeof b !== "number") return null;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  if (low < MIN_WATER_TEMP_F || high > MAX_WATER_TEMP_F) return null;
  return [low, high];
}

/**
 * Does this species have any reviewed temperature figure at all?
 *
 * Half the saltwater catalog does not. Callers use this to say "thermal band
 * not reviewed" rather than quietly reading the temperature axis as unknown,
 * which would look identical to the angler having failed to measure.
 */
export function hasThermalBand(species: SpeciesRecord): boolean {
  const thermal = species.thermal;
  if (!thermal) return false;
  return Boolean(
    thermal.preferredF || thermal.activeF || thermal.coldEdgeF != null || thermal.warmEdgeF != null,
  );
}

/**
 * Where a temperature sits in this species' reviewed band.
 *
 * Written to degrade one field at a time. A record with only a cold edge can
 * still say "below the cold edge"; a record with only a preferred range can
 * still place a reading inside or outside it. What it will not do is guess:
 * with nothing sourced, or with a temperature that lands in a gap the record
 * does not describe, the answer is "unknown" and the thermal axis drops out of
 * the weighting rather than nudging the ranking on an invented number.
 */
export function pointThermalState(tempF: number, species: SpeciesRecord): ThermalState {
  const thermal = species.thermal;
  if (!thermal) return "unknown";

  const preferred = thermal.preferredF;
  const active = thermal.activeF;

  if (preferred && tempF >= preferred[0] && tempF <= preferred[1]) return "preferred";
  if (active && tempF >= active[0] && tempF <= active[1]) return "active";
  if (thermal.coldEdgeF != null && tempF < thermal.coldEdgeF) return "cold_refuge";
  if (thermal.warmEdgeF != null && tempF > thermal.warmEdgeF) return "warm_stress";

  // Outside a known range but inside the edges, or with no edges recorded:
  // the range itself still tells us which side of the fish's window we are on.
  const inner = preferred ?? active;
  if (inner) return tempF < inner[0] ? "cold_refuge" : "warm_stress";

  return "unknown";
}

export function thermalStatesAcrossRange(
  rangeF: TemperatureRangeF,
  species: SpeciesRecord,
): ThermalState[] {
  const [low, high] = rangeF;
  const thermal = species.thermal;
  const boundaries = [
    low,
    high,
    ...(thermal?.preferredF ?? []),
    ...(thermal?.activeF ?? []),
    thermal?.coldEdgeF,
    thermal?.warmEdgeF,
  ]
    .filter((value): value is number => value != null && value >= low && value <= high)
    .sort((a, b) => a - b)
    .filter((value, index, all) => index === 0 || value !== all[index - 1]);

  const probes = [...boundaries];
  for (let index = 0; index < boundaries.length - 1; index += 1) {
    const a = boundaries[index];
    const b = boundaries[index + 1];
    if (b > a) probes.push((a + b) / 2);
  }

  const states: ThermalState[] = [];
  for (const probe of probes.sort((a, b) => a - b)) {
    const state = pointThermalState(probe, species);
    if (!states.includes(state)) states.push(state);
  }
  return states;
}

export function resolveThermalState(
  input: ScenarioInput,
  species: SpeciesRecord,
): ThermalResolution {
  if (input.tempF != null && Number.isFinite(input.tempF)) {
    const state = pointThermalState(input.tempF, species);
    return { state, states: [state], exactF: input.tempF, rangeF: null };
  }

  const rangeF = normalizeTemperatureRangeF(input.tempRangeF);
  if (rangeF) {
    const states = thermalStatesAcrossRange(rangeF, species);
    return {
      state: states.length === 1 ? states[0] : "unknown",
      states,
      exactF: null,
      rangeF,
    };
  }

  return { state: "unknown", states: [], exactF: null, rangeF: null };
}

export function hasTemperatureQuantity(input: ScenarioInput): boolean {
  return (
    (input.tempF != null && Number.isFinite(input.tempF)) ||
    normalizeTemperatureRangeF(input.tempRangeF) != null
  );
}

export function temperatureEvidenceLabel(input: ScenarioInput): string {
  if (input.tempF != null && Number.isFinite(input.tempF)) {
    return `${input.tempF}°F · ${labelOf(input.tempSource)}`;
  }
  const range = normalizeTemperatureRangeF(input.tempRangeF);
  if (range) return `${range[0]}–${range[1]}°F range · ${labelOf(input.tempSource)}`;
  return "temperature unknown";
}
