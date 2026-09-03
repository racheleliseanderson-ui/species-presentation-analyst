import { sanitizePacket, type HthPacket } from "../hth-packet.ts";

/**
 * Where the packet that arrived is kept for the rest of the visit.
 *
 * The reason this exists: the reader lands with a packet in the URL fragment,
 * the app clears the fragment once they have accepted or dismissed it, and then
 * they spend ten minutes on the reading. When they press a handoff at the end,
 * the packet that arrived is long gone from the address bar — so the trail it
 * carried would restart here and the route from Field Sense onward would be
 * lost. Session storage holds the ORIGINAL incoming packet, unchanged, so every
 * outgoing link is built from it rather than from this app's last output.
 *
 * The coordinate walker and the privacy re-statement used to live in this file
 * as a private copy. They are `sanitizePacket()` in `src/lib/hth-packet.ts`
 * now — one implementation, shared by the whole fleet.
 */

const FLEET_SESSION_KEY = "hth-fleet-context-v1";

/** Keep what arrived, stripped, for the outgoing carry. */
export function rememberIncomingPacket(packet: HthPacket): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FLEET_SESSION_KEY, JSON.stringify(sanitizePacket(packet)));
  } catch {
    /* session storage unavailable — the carry still works, it just does not
       survive the fragment being cleared */
  }
}

/**
 * The packet that arrived, or null.
 *
 * Stripped again on the way out of storage. Rule 4 of the contract: stripping
 * on read is what stops a stranger's coordinate being adopted, persisted, and
 * re-emitted from a path that never saw the original link.
 */
export function loadIncomingPacket(): HthPacket | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(FLEET_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return sanitizePacket(parsed as HthPacket);
  } catch {
    return null;
  }
}

/** Drop it. Used when the reader says the carried context is not theirs. */
export function forgetIncomingPacket(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(FLEET_SESSION_KEY);
  } catch {
    /* nothing to do */
  }
}
