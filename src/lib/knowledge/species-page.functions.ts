import { createServerFn } from "@tanstack/react-start";
import { EMPTY_OVERLAYS, type SpeciesOverlays } from "./overlays.ts";

/**
 * The reviewed overlays for one species, read from what is committed here.
 *
 * A server function rather than a browser fetch because the alternative is a
 * page that renders its own subject only after a round trip — which is a blank
 * document to a crawler and a flash of nothing to a reader on a phone. Running
 * it in the loader means the HTML that leaves the server already contains the
 * fish.
 *
 * The dynamic import keeps `committed-dossiers.server` out of the client
 * bundle. That file inlines every authored dossier; shipping it to a browser
 * would undo the reason the overlays left the bundle in the first place.
 */
export const loadCommittedOverlays = createServerFn({ method: "GET" })
  .validator((input: { speciesId: string }) => ({
    speciesId: String(input?.speciesId ?? "").slice(0, 80),
  }))
  .handler(async ({ data }): Promise<{ overlays: SpeciesOverlays; source: string }> => {
    if (!data.speciesId) return { overlays: EMPTY_OVERLAYS, source: "none" };
    const { committedOverlaysFor } = await import("./committed-dossiers.server.ts");
    const { overlays, source } = committedOverlaysFor(data.speciesId);
    return { overlays, source };
  });
