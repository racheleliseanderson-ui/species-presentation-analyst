# Species & Presentation Analyst

**Hook the Horizon · Field Intelligence** · `HTH-SP-001` · app `0.3.0`

TanStack Start + Nitro. Canonical host: [species.hookthehorizon.blog](https://species.hookthehorizon.blog/) (attach the domain on the Vercel project if it is still pending). Live now: [species-presentation-analyst.vercel.app](https://species-presentation-analyst.vercel.app/)

**Mantra:** Biology before bravado. We do not predict whether fish will bite.

## Product boundary (non-negotiable)

- Explains biological and environmental **plausibility**, never catch probability.
- No bite scores, hotspots, coordinates, lure SKUs, or silent tracking.
- Unreviewed species names do not fall through to generic model text.
- Holding-water class is ecological structure, not a pin.
- Temperature provenance stays visible. Air temperature is never substituted silently.
- Packets move only on an explicit user action (`#packet=`). Incoming packets are inspected before they are applied. Outbound carries are inspected before they leave.
- Condition and forage modifiers may re-rank only presentation families already reviewed for the declared species and water type.
- Species records may carry target status: `standard`, `regulated_context`, `conservation_sensitive`, or `non_target`.
- `conservation_sensitive` and `non_target` records are biological context only and fail closed before presentation guidance is generated.
- `regulated_context` records remain readable, but jurisdiction/regulation warnings are inserted into the evidence and invalidator chain.

## What a reading is

A first-time user can open a worked example and leave with:

1. a leading presentation family (a job, not a lure),
2. a holding-water class,
3. the variable that would change the answer,
4. a public-safe field brief they can keep.

Change one declared condition (temperature, light, clarity, holding, forage) and the same model re-ranks. That is not a new guess.

## Intelligence chain

Field Sense (named public water) → **this instrument** (species + presentation families) → Hatch Match (observed forage) / Tackle Link (system job) / Knot Analyst (connection job) / Rig Signal (device question).

## Packet

Version `HTH-1.0`. Public-safe. `privacy.containsCoordinates` is always `false`.

Inbound hydrate from `window.location.hash` (`#packet=`). Nothing is applied until the user confirms. Outbound carry is a hash on the destination origin — never an automatic POST.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm test
```

Engine tests cover ordinary cases, fail-closed water-type mismatch, unknown temperature, light-driven family changes, conservation-sensitive fail-closed behavior, and regulated-context warnings.

## Knowledge

60 reviewed North American records. Informal names (`brownie`, `smallie`, `laker`, `grayling`, `wiper`, `spoonbill`) resolve to reviewed records. Review date and next-review date are printed on the reading. Cadence: 90 days.

The catalog is composed from the original reviewed core plus dated expansion batches so future seeding remains auditable.

- Expansion 01 (2026-08-27): mountain whitefish, Arctic grayling, kokanee, lake whitefish, burbot, sauger, blue catfish, flathead catfish, freshwater drum.
- Expansion 02 (2026-08-27): pumpkinseed, redear sunfish, green sunfish, rock bass, chain pickerel, bowfin, longnose gar, spotted gar, brown bullhead, black bullhead, cisco, rainbow smelt, white perch, American eel, American shad.
- Expansion 03 (2026-08-27): bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, redbreast sunfish, warmouth, yellow bullhead, shortnose gar, yellow bass, hybrid striped bass, goldeye, mooneye, bigmouth buffalo, smallmouth buffalo, shorthead redhorse.

Expansion 03 is the first catalog batch with explicit target-status metadata. Bull trout and wild anadromous Atlantic salmon are context-only. Lake sturgeon, paddlefish, bigmouth buffalo, and smallmouth buffalo are marked regulated-context records.

Instrument ID: `HTH-SP-001` · schema `0.3.0` · app `0.3.0`
