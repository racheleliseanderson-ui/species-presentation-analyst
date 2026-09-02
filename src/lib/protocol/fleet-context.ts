import type { HthPacket } from "./types.ts";

export const FLEET_CONTRACT = "HTH-FLEET-1.0" as const;
const FLEET_SESSION_KEY = "hth-fleet-context-v1";

const BLOCKED_KEYS = new Set([
  "coordinates",
  "coordinate",
  "latitude",
  "longitude",
  "lat",
  "lng",
  "lon",
  "gps",
  "coords",
  "point",
  "position",
  "location",
  "geo",
  "geojson",
  "bbox",
  "centroid",
  "geometry",
]);

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (BLOCKED_KEYS.has(key.toLowerCase())) continue;
    out[key] = sanitizeValue(child);
  }
  return out;
}

function sanitize(packet: Record<string, unknown>): Record<string, unknown> {
  const clean = sanitizeValue(packet) as Record<string, unknown>;
  const privacy =
    clean.privacy && typeof clean.privacy === "object" && !Array.isArray(clean.privacy)
      ? (clean.privacy as Record<string, unknown>)
      : {};
  clean.privacy = {
    ...privacy,
    containsCoordinates: false,
    containsPrivateWater: false,
  };
  return clean;
}

export function rememberIncomingFleetPacket(packet: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FLEET_SESSION_KEY, JSON.stringify(sanitize(packet)));
  } catch {
    /* session storage unavailable */
  }
}

function loadIncoming(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(FLEET_SESSION_KEY);
    return raw ? sanitize(JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function objectPart(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/**
 * Preserve public-safe upstream context while letting Species own every field it
 * actually recalculates. This is additive HTH-1.0 compatibility, not a new packet
 * version; older tools simply ignore the optional fleet metadata.
 */
export function carryFleetContext(packet: HthPacket): HthPacket {
  const base = loadIncoming();
  const now = packet.createdAt;
  const baseFleet = objectPart(base?.fleet);
  const baseTrail = Array.isArray(baseFleet.trail)
    ? baseFleet.trail.filter(
        (entry): entry is { origin: string; at: string } =>
          Boolean(entry) &&
          typeof entry === "object" &&
          typeof (entry as Record<string, unknown>).origin === "string" &&
          typeof (entry as Record<string, unknown>).at === "string",
      )
    : [];
  const trail = [...baseTrail];
  const priorOrigin = typeof base?.origin === "string" ? base.origin : null;
  const priorCreatedAt = typeof base?.createdAt === "string" ? base.createdAt : now;
  if (!trail.length && priorOrigin) trail.push({ origin: priorOrigin, at: priorCreatedAt });
  if (trail.at(-1)?.origin !== "species-presentation") {
    trail.push({ origin: "species-presentation", at: now });
  }

  const merged = sanitize({
    ...(base ?? {}),
    ...packet,
    fleet: {
      contract: FLEET_CONTRACT,
      trail,
      lastUpdatedBy: "species-presentation",
    },
    water: { ...objectPart(base?.water), ...objectPart(packet.water) },
    species: { ...objectPart(base?.species), ...objectPart(packet.species) },
    conditions: { ...objectPart(base?.conditions), ...objectPart(packet.conditions) },
    observations: { ...objectPart(base?.observations), ...objectPart(packet.observations) },
    presentationRequirements: {
      ...objectPart(base?.presentationRequirements),
      ...objectPart(packet.presentationRequirements),
    },
    equipmentRequirements: {
      ...objectPart(base?.equipmentRequirements),
      ...objectPart(packet.equipmentRequirements),
    },
    connectionRequirements: {
      ...objectPart(base?.connectionRequirements),
      ...objectPart(packet.connectionRequirements),
    },
    provenance: [
      ...(Array.isArray(base?.provenance) ? base!.provenance : []),
      ...packet.provenance,
    ],
  });

  return merged as unknown as HthPacket;
}
