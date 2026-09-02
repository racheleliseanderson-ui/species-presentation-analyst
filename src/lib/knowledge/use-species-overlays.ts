import { useEffect, useState } from "react";
import {
  EMPTY_COVERAGE,
  EMPTY_OVERLAYS,
  type DossierCoverage,
  type OverlayState,
  type SpeciesOverlays,
} from "./overlays.ts";

/**
 * Fetches the reviewed overlays for the selected species.
 *
 * A deliberately small module-level cache rather than a query library: the app
 * asks for one species at a time, the records are immutable between review
 * cycles, and the point of moving this data out of the bundle was to ship less
 * JavaScript — adding a client cache framework to read it back would undo part
 * of the saving.
 *
 * In-flight requests are shared so a species selected in two panels is fetched
 * once, and a failed fetch is not cached, so it retries on the next selection.
 */

const cache = new Map<string, SpeciesOverlays>();
const inFlight = new Map<string, Promise<SpeciesOverlays>>();

async function load(speciesId: string): Promise<SpeciesOverlays> {
  const cached = cache.get(speciesId);
  if (cached) return cached;

  const existing = inFlight.get(speciesId);
  if (existing) return existing;

  const request = (async () => {
    const response = await fetch(`/api/dossiers/${encodeURIComponent(speciesId)}`, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error(`dossiers ${response.status}`);
    const body = (await response.json()) as { overlays: SpeciesOverlays };
    const overlays = body.overlays ?? EMPTY_OVERLAYS;
    cache.set(speciesId, overlays);
    return overlays;
  })();

  inFlight.set(speciesId, request);
  try {
    return await request;
  } finally {
    inFlight.delete(speciesId);
  }
}

export function useSpeciesOverlays(speciesId: string | null | undefined): OverlayState {
  const [state, setState] = useState<OverlayState>(() =>
    speciesId && cache.has(speciesId)
      ? { status: "ready", overlays: cache.get(speciesId)! }
      : { status: speciesId ? "loading" : "ready", overlays: EMPTY_OVERLAYS },
  );

  useEffect(() => {
    if (!speciesId) {
      setState({ status: "ready", overlays: EMPTY_OVERLAYS });
      return;
    }
    const cached = cache.get(speciesId);
    if (cached) {
      setState({ status: "ready", overlays: cached });
      return;
    }

    let live = true;
    setState({ status: "loading", overlays: EMPTY_OVERLAYS });
    load(speciesId)
      .then((overlays) => {
        if (live) setState({ status: "ready", overlays });
      })
      .catch(() => {
        // Never fall back to EMPTY as if it were an answer: an unreachable
        // record is not the same claim as an unreviewed one.
        if (live) setState({ status: "unavailable", overlays: EMPTY_OVERLAYS });
      });
    return () => {
      live = false;
    };
  }, [speciesId]);

  return state;
}

export type CoverageState = {
  status: "loading" | "ready" | "unavailable";
  speciesTotal: number;
  coverage: DossierCoverage;
};

let coverageCache: { speciesTotal: number; coverage: DossierCoverage } | null = null;

export function useDossierCoverage(speciesTotalFallback: number): CoverageState {
  const [state, setState] = useState<CoverageState>(() =>
    coverageCache
      ? { status: "ready", ...coverageCache }
      : { status: "loading", speciesTotal: speciesTotalFallback, coverage: EMPTY_COVERAGE },
  );

  useEffect(() => {
    if (coverageCache) {
      setState({ status: "ready", ...coverageCache });
      return;
    }
    let live = true;
    fetch("/api/dossier-coverage", { headers: { accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`coverage ${response.status}`);
        return response.json() as Promise<{ speciesTotal: number; coverage: DossierCoverage }>;
      })
      .then((body) => {
        coverageCache = { speciesTotal: body.speciesTotal, coverage: body.coverage };
        if (live) setState({ status: "ready", ...coverageCache });
      })
      .catch(() => {
        if (live) {
          setState({
            status: "unavailable",
            speciesTotal: speciesTotalFallback,
            coverage: EMPTY_COVERAGE,
          });
        }
      });
    return () => {
      live = false;
    };
  }, [speciesTotalFallback]);

  return state;
}

export type WaterContextValue = {
  documentedInWaterways: boolean;
  waters: {
    id: string;
    name: string;
    state: string;
    stateCode: string;
    waterType: string;
    broadRegion: string;
  }[];
  waterCount: number;
  agency: {
    stateCode: string;
    name: string;
    regulationsUrl: string;
    accessMapUrl: string | null;
    verifiedOn: string;
  } | null;
  unresolvedJurisdiction: string | null;
};

export type WaterContextState = {
  status: "idle" | "loading" | "ready" | "unavailable";
  context: WaterContextValue | null;
};

const waterCache = new Map<string, WaterContextValue>();

/**
 * Reviewed public waters that document this species, and the agency whose
 * rules apply where the angler says they are. Keyed on species plus declared
 * jurisdiction, because changing either changes the answer.
 */
export function useWaterContext(
  speciesId: string | null | undefined,
  jurisdiction: string | null | undefined,
): WaterContextState {
  const key = speciesId ? `${speciesId}::${(jurisdiction ?? "").trim().toLowerCase()}` : "";
  const [state, setState] = useState<WaterContextState>(() =>
    key && waterCache.has(key)
      ? { status: "ready", context: waterCache.get(key)! }
      : { status: speciesId ? "loading" : "idle", context: null },
  );

  useEffect(() => {
    if (!speciesId) {
      setState({ status: "idle", context: null });
      return;
    }
    const cached = waterCache.get(key);
    if (cached) {
      setState({ status: "ready", context: cached });
      return;
    }

    let live = true;
    setState({ status: "loading", context: null });
    const query = jurisdiction?.trim()
      ? `?jurisdiction=${encodeURIComponent(jurisdiction.trim())}`
      : "";
    fetch(`/api/water-context/${encodeURIComponent(speciesId)}${query}`, {
      headers: { accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`water-context ${response.status}`);
        return response.json() as Promise<{ context: WaterContextValue }>;
      })
      .then((body) => {
        waterCache.set(key, body.context);
        if (live) setState({ status: "ready", context: body.context });
      })
      .catch(() => {
        if (live) setState({ status: "unavailable", context: null });
      });
    return () => {
      live = false;
    };
  }, [speciesId, jurisdiction, key]);

  return state;
}
