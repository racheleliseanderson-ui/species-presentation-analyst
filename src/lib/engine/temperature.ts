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

export function pointThermalState(tempF: number, species: SpeciesRecord): ThermalState {
  const [p0, p1] = species.thermal.preferredF;
  const [a0, a1] = species.thermal.activeF;
  if (tempF >= p0 && tempF <= p1) return "preferred";
  if (tempF >= a0 && tempF <= a1) return "active";
  if (tempF < species.thermal.coldEdgeF) return "cold_refuge";
  if (tempF > species.thermal.warmEdgeF) return "warm_stress";
  if (tempF < p0) return "cold_refuge";
  return "warm_stress";
}

export function thermalStatesAcrossRange(
  rangeF: TemperatureRangeF,
  species: SpeciesRecord,
): ThermalState[] {
  const [low, high] = rangeF;
  const boundaries = [
    low,
    high,
    species.thermal.preferredF[0],
    species.thermal.preferredF[1],
    species.thermal.activeF[0],
    species.thermal.activeF[1],
    species.thermal.coldEdgeF,
    species.thermal.warmEdgeF,
  ]
    .filter((value) => value >= low && value <= high)
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
