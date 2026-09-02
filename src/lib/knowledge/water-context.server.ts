/**
 * The bridge to Waterways and to the agencies that actually set the rules.
 *
 * Two facts the app was missing while the answers sat in the same database:
 *
 * 1. **Where a species is documented.** `public.waters` carries 236 reviewed
 *    public waters, each listing the species documented in it. That turns the
 *    Waterways handoff from "here is a packet" into an answer.
 * 2. **What the regulations actually are.** The species profile has been saying
 *    that current rules "remain external verification tasks until a live
 *    jurisdiction source is integrated" — but `public.agencies` has carried the
 *    regulations URL for 49 states the whole time.
 *
 * The two apps use different species id schemes (`brown-trout` against
 * `salmo_trutta`), so the join is on scientific name, which is exact. Waterways
 * covers a subset of this catalog; a species it does not carry returns no
 * waters, and the UI says so rather than implying the fish is undocumented.
 *
 * No coordinates are read or returned. A named public water and its state are
 * exactly what the rest of the fleet already publishes.
 */

import { SPECIES_BY_ID } from "./species-catalog.ts";
import { STATE_CODE_BY_NAME } from "./jurisdictions.ts";

export class WaterContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WaterContextError";
  }
}

export type DocumentedWater = {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  waterType: string;
  broadRegion: string;
};

export type AgencyContact = {
  stateCode: string;
  name: string;
  regulationsUrl: string;
  accessMapUrl: string | null;
  verifiedOn: string;
};

export type WaterContext = {
  /** False when Waterways carries no record for this species at all. */
  documentedInWaterways: boolean;
  waters: DocumentedWater[];
  /** Total documented waters, before the sample below was trimmed. */
  waterCount: number;
  agency: AgencyContact | null;
  /** What the angler typed, when it could not be resolved to a state. */
  unresolvedJurisdiction: string | null;
};

function config(): { url: string; key: string } {
  const url = (process.env.SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  const key = (process.env.SUPABASE_ANON_KEY ?? "").trim();
  if (!url || !key) {
    throw new WaterContextError("SUPABASE_URL and SUPABASE_ANON_KEY must be set.");
  }
  return { url, key };
}

async function rest<T>(path: string): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, authorization: `Bearer ${key}`, accept: "application/json" },
  });
  if (!response.ok) {
    throw new WaterContextError(
      `Supabase returned ${response.status} for ${path}: ${(await response.text()).slice(0, 200)}`,
    );
  }
  return (await response.json()) as T;
}

/**
 * `Salmo salar (anadromous)` and `Salmo salar` are the same fish to Waterways.
 * The catalog qualifies some records by life history; the join should not care.
 */
export function normalizeScientificName(value: string): string {
  return value
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Free text to a state code. Anglers type "Montana", "MT", or the agency's
 * name; anything else resolves to nothing rather than to a guess.
 */
export function resolveStateCode(
  jurisdiction: string,
  agencies: { state_code: string; name: string }[],
): string | null {
  const text = jurisdiction.trim().toLowerCase();
  if (!text) return null;

  if (/^[a-z]{2}$/.test(text)) {
    const code = text.toUpperCase();
    if (agencies.some((agency) => agency.state_code === code)) return code;
  }

  const byName = STATE_CODE_BY_NAME[text];
  if (byName && agencies.some((agency) => agency.state_code === byName)) return byName;

  const agency = agencies.find((item) => item.name.toLowerCase().includes(text));
  return agency?.state_code ?? null;
}

export async function fetchWaterContext(
  speciesId: string,
  jurisdiction: string | null,
  sampleSize = 6,
): Promise<WaterContext> {
  const record = SPECIES_BY_ID[speciesId];
  if (!record) throw new WaterContextError(`unknown species ${speciesId}`);

  const scientific = normalizeScientificName(record.scientificName);
  const remote = await rest<{ id: string; scientific_name: string }[]>(
    "species?select=id,scientific_name&published=is.true",
  );
  // A scientific name can map to more than one Waterways record (rainbow trout
  // and steelhead are both Oncorhynchus mykiss), so take every match.
  const remoteIds = remote
    .filter((item) => normalizeScientificName(item.scientific_name) === scientific)
    .map((item) => item.id);

  let waters: DocumentedWater[] = [];
  if (remoteIds.length > 0) {
    const filter = remoteIds.map((id) => `species_ids.cs.{${id}}`).join(",");
    const rows = await rest<
      {
        id: string;
        name: string;
        state: string;
        state_code: string;
        water_type: string;
        broad_region: string;
      }[]
    >(
      `waters?select=id,name,state,state_code,water_type,broad_region&published=is.true&or=(${filter})&order=name.asc`,
    );
    waters = rows.map((row) => ({
      id: row.id,
      name: row.name,
      state: row.state,
      stateCode: row.state_code,
      waterType: row.water_type,
      broadRegion: row.broad_region,
    }));
  }

  let agency: AgencyContact | null = null;
  let unresolvedJurisdiction: string | null = null;
  if (jurisdiction?.trim()) {
    const agencies = await rest<
      {
        state_code: string;
        name: string;
        regulations_url: string;
        access_map_url: string | null;
        verified_on: string;
      }[]
    >("agencies?select=state_code,name,regulations_url,access_map_url,verified_on");
    const code = resolveStateCode(jurisdiction, agencies);
    const match = code ? agencies.find((item) => item.state_code === code) : undefined;
    if (match) {
      agency = {
        stateCode: match.state_code,
        name: match.name,
        regulationsUrl: match.regulations_url,
        accessMapUrl: match.access_map_url,
        verifiedOn: match.verified_on,
      };
    } else {
      unresolvedJurisdiction = jurisdiction.trim();
    }
  }

  return {
    documentedInWaterways: remoteIds.length > 0,
    waters: waters.slice(0, sampleSize),
    waterCount: waters.length,
    agency,
    unresolvedJurisdiction,
  };
}
