# Species & Presentation Analyst

**Hook the Horizon · Field Intelligence** · `HTH-SP-001`

TanStack Start + Nitro. Primary host: [species.hookthehorizon.blog](https://species.hookthehorizon.blog/)

**Mantra:** Biology before bravado. We do not predict whether fish will bite.

## Product boundary (non-negotiable)

- Explains biological and environmental **plausibility**, never catch probability.
- No bite scores, hotspots, coordinates, lure SKUs, or silent tracking.
- Unreviewed species names do not fall through to generic model text.
- Holding-water class is ecological structure, not a pin.
- Temperature provenance stays visible. Air temperature is never substituted silently.
- Packets move only on an explicit user action (`#packet=`).

## Intelligence chain

Field Sense (named public water) → **this instrument** (species + presentation families) → Hatch Match (observed forage) / Tackle Link (system job) / Knot Analyst (connection job) / Rig Signal (device question).

## Packet

Version `HTH-1.0`. Public-safe. `privacy.containsCoordinates` is always `false`.

Inbound hydrate from `window.location.hash` (`#packet=`). Outbound carry is a hash on the destination origin — never an automatic POST.

## Scripts

```bash
npm install
npm run dev      # 0.0.0.0:8080
npm run build
npm run typecheck
```

## Knowledge

21 reviewed North American records. Review date and next-review date are printed on the instrument. Cadence: 90 days.

Instrument ID: `HTH-SP-001` · schema `0.1.0` · app `0.1.0`
