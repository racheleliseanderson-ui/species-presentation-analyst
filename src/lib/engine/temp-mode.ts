/**
 * Which of the three answers an angler has given about water temperature.
 *
 * Lives beside the engine rather than in the input component so both reading
 * modes can read it back off a stored session without importing UI.
 */
import type { TemperatureRangeF } from "../protocol/types.ts";

export type TempMode = "unknown" | "exact" | "range";

export function inferTempMode(session: {
  tempF: number | null;
  tempRangeF: TemperatureRangeF | null;
}): TempMode {
  if (session.tempF != null) return "exact";
  if (session.tempRangeF) return "range";
  return "unknown";
}
