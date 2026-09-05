import {
  CLARITY,
  FLOW_CLASSES,
  INSHORE_HOLDING,
  LIGHT,
  NEARSHORE_HOLDING,
  OFFSHORE_HOLDING,
  RIVER_HOLDING,
  SEASONS,
  STILL_HOLDING,
  STILL_STATES,
  SURF_HOLDING,
  TEMP_SOURCES,
  TIDE_MOVEMENTS,
  TIDE_STRENGTHS,
  WATER_TYPES,
  WEATHER_TRENDS,
} from "./protocol/vocab.ts";
import { SPECIES_BY_ID } from "./knowledge/species-catalog.ts";

/**
 * What a stored reading is allowed to say when it comes back.
 *
 * The reading and the saved scenarios are the only durable record this
 * application keeps. They lived in `localStorage` under a key ending `-v1`,
 * restored with `{ ...defaults, ...JSON.parse(raw) }` and nothing else — which
 * means a value written by a build from six weeks ago was merged straight into
 * the live session no matter what it said.
 *
 * That is not a theoretical risk in this codebase. The vocabularies here are
 * genuinely open and genuinely change: the fleet added a twelfth forage class,
 * the marine holding classes arrived after the freshwater ones, and the salt
 * wave added four water types. Every one of those is a word that could be
 * sitting in somebody's stored reading and no longer be a word the solver
 * knows. The old loader would restore it, the engine would fail to match it,
 * and the reading would quietly come back thinner with nothing anywhere saying
 * why.
 *
 * So a restore now does two things the merge never did:
 *
 *  1. **It carries a version.** `SESSION_SCHEMA` is stamped into the payload.
 *     A payload from an older schema goes through `migrate`; a payload from a
 *     NEWER one (the same person, a device that already ran a later deploy) is
 *     refused rather than half-read, because a forward migration cannot be
 *     written backwards.
 *  2. **It checks each word against the live vocabulary.** A value the current
 *     build does not recognise is dropped back to `unknown` — which is a state
 *     this whole product already knows how to display honestly — instead of
 *     being handed to the engine as if it meant something.
 *
 * Nothing here guesses. A dropped value is dropped, and `sanitizeSession`
 * reports what it dropped so a caller can say so out loud.
 */

export const SESSION_SCHEMA = 2 as const;

/** A stored payload, whatever version wrote it. */
export type StoredEnvelope<T> = { v: number; data: T };

export type SanitizeReport = {
  /** Field names whose stored value the current build does not recognise. */
  dropped: string[];
  /** True when the payload came from an older schema and was migrated. */
  migrated: boolean;
};

const setOf = (values: readonly string[]) => new Set<string>(values);

const VOCAB = {
  waterType: setOf(WATER_TYPES),
  flow: setOf(FLOW_CLASSES),
  stillState: setOf(STILL_STATES),
  clarity: setOf(CLARITY),
  light: setOf(LIGHT),
  weather: setOf(WEATHER_TRENDS),
  season: setOf(SEASONS),
  tempSource: setOf(TEMP_SOURCES),
  tideMovement: setOf(TIDE_MOVEMENTS),
  tideStrength: setOf(TIDE_STRENGTHS),
  holdingRiver: setOf(RIVER_HOLDING),
  holdingStill: setOf(STILL_HOLDING),
  holdingMarine: setOf([
    ...SURF_HOLDING,
    ...INSHORE_HOLDING,
    ...NEARSHORE_HOLDING,
    ...OFFSHORE_HOLDING,
  ]),
} as const;

/** Enumerated fields that fall back to the literal string `unknown`. */
const UNKNOWN_FALLBACK = [
  "waterType",
  "flow",
  "stillState",
  "clarity",
  "light",
  "weather",
  "season",
  "tempSource",
  "tideMovement",
  "tideStrength",
] as const;

/** Enumerated fields that fall back to `null` — an absent holding lie is worse. */
const NULL_FALLBACK = ["holdingRiver", "holdingStill", "holdingMarine"] as const;

const STEPS = setOf(["target", "water", "conditions", "holding", "readout"]);

/**
 * Bring a payload written by an older schema up to the current one.
 *
 * Version 1 is every payload written before 2026-09-05 — including the ones
 * with no version field at all, which is why `readEnvelope` calls an unstamped
 * payload version 1 rather than rejecting it. Nobody's saved readings are
 * thrown away to introduce versioning; that would be a worse first act than the
 * problem being fixed.
 *
 * Version 1 -> 2 is a shape-preserving step. The work is done by
 * `sanitizeSession`, which every restore runs anyway, so there is nothing to
 * rewrite here — and a migration that honestly has no field work to do should
 * say so rather than invent some.
 */
function migrateStep(data: unknown, from: number): unknown {
  switch (from) {
    case 1:
      return data;
    default:
      return data;
  }
}

/** Read a stored string, tolerating the unversioned payloads that predate this. */
export function readEnvelope<T>(raw: string | null): { data: T; version: number } | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object") return null;
  const maybe = parsed as Partial<StoredEnvelope<T>>;
  if (typeof maybe.v === "number" && "data" in maybe) {
    return { data: maybe.data as T, version: maybe.v };
  }
  /* No envelope: written before this module existed. Schema 1 by definition. */
  return { data: parsed as T, version: 1 };
}

/** Wrap a value for storage, stamped with the schema that wrote it. */
export function writeEnvelope<T>(data: T): string {
  return JSON.stringify({ v: SESSION_SCHEMA, data } satisfies StoredEnvelope<T>);
}

/**
 * Run a payload forward to the current schema.
 *
 * A payload claiming a version this build has never heard of is refused. That
 * happens for real — somebody opens the app on a phone that already ran a later
 * deploy, or a rollback puts an older build back in front of newer storage —
 * and reading it optimistically would be the one case where the data really is
 * shaped differently and nothing here knows how.
 */
export function migrate(
  data: unknown,
  version: number,
): { data: unknown; migrated: boolean } | null {
  if (version > SESSION_SCHEMA) return null;
  let current = data;
  for (let v = version; v < SESSION_SCHEMA; v += 1) {
    current = migrateStep(current, v);
  }
  return { data: current, migrated: version < SESSION_SCHEMA };
}

/**
 * Replace every stored word the current build cannot place.
 *
 * Mutates nothing: returns a cleaned copy plus the list of fields that were
 * dropped, so the caller can decide whether the reader needs telling.
 */
export function sanitizeSession<T extends Record<string, unknown>>(
  session: T,
): { session: T; dropped: string[] } {
  const next: Record<string, unknown> = { ...session };
  const dropped: string[] = [];

  for (const field of UNKNOWN_FALLBACK) {
    const value = next[field];
    if (typeof value !== "string" || !VOCAB[field].has(value)) {
      if (value !== undefined && value !== "unknown") dropped.push(field);
      next[field] = "unknown";
    }
  }

  for (const field of NULL_FALLBACK) {
    const value = next[field];
    if (value === null || value === undefined) {
      next[field] = null;
      continue;
    }
    if (typeof value !== "string" || !VOCAB[field].has(value)) {
      dropped.push(field);
      next[field] = null;
    }
  }

  /*
   * A species id that has left the catalog. Rare, but it happened inside this
   * fleet already: largemouth bass moved from `Micropterus salmoides` to
   * `Micropterus nigricans` between two catalogues. A stored id nothing
   * resolves would leave the reading pointing at a fish the app cannot name.
   */
  const speciesId = next.speciesId;
  if (speciesId !== null && speciesId !== undefined) {
    if (typeof speciesId !== "string" || !SPECIES_BY_ID[speciesId]) {
      dropped.push("speciesId");
      next.speciesId = null;
      next.step = "target";
    }
  }

  if (typeof next.step !== "string" || !STEPS.has(next.step)) {
    next.step = next.speciesId ? "water" : "target";
  }

  /* Temperature: a stored number outside anything a thermometer in water can
   * read is a corrupted value, not a cold day. */
  const tempF = next.tempF;
  if (tempF !== null && tempF !== undefined) {
    if (typeof tempF !== "number" || !Number.isFinite(tempF) || tempF < 20 || tempF > 100) {
      dropped.push("tempF");
      next.tempF = null;
    }
  }

  return { session: next as T, dropped };
}
