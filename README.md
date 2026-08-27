# Species & Presentation Analyst

**Hook the Horizon · Field Intelligence** · `HTH-SP-001` · app `0.4.0`

TanStack Start + Nitro. Canonical host: [species.hookthehorizon.blog](https://species.hookthehorizon.blog/) (attach the domain on the Vercel project if it is still pending). Live now: [species-presentation-analyst.vercel.app](https://species-presentation-analyst.vercel.app/)

**Mantra:** Biology before bravado. We do not predict whether fish will bite.

## Product boundary (non-negotiable)

- Explains biological and environmental **plausibility**, never catch probability.
- No bite scores, hotspots, coordinates, lure SKUs, or silent tracking.
- Unreviewed species names do not fall through to generic model text.
- Holding-water class is ecological structure, not a pin.
- Temperature provenance stays visible. Air temperature is never substituted silently.
- Packets move only on an explicit user action (`#packet=`). Incoming packets are inspected before they are applied. Outbound carries are inspected before they leave.
- Presentation weighting can re-rank only families already reviewed for the declared species and water type. No condition may introduce an unreviewed family.
- Relative family weights are model mechanics, **not probability, confidence of a bite, or a bite score**.
- Species records may carry target status: `standard`, `regulated_context`, `conservation_sensitive`, or `non_target`.
- `conservation_sensitive` and `non_target` records are biological context only and fail closed before presentation guidance is generated.
- `regulated_context` records remain readable, but jurisdiction/regulation warnings are inserted into the evidence and invalidator chain.

## What a reading is

A first-time user can open a worked example and leave with:

1. a leading presentation family (a job, not a lure),
2. a holding-water class,
3. the variable that would change the answer,
4. a public-safe field brief they can keep.

Change one declared condition and the same reviewed model re-ranks. That is not a new guess.

## Second intelligence layer · `SPW-1.0`

The presentation engine now ranks reviewed families through an explainable additive model:

**species × season × thermal state × water type × holding-water class × forage class → presentation-family weighting**

The species record supplies the only eligible presentation families and their baseline order. The remaining axes may move those reviewed families up or down:

- **Species** — reviewed baseline family order for that species and water type.
- **Season** — seasonal mechanics; spawning overlap is treated as caution, never aggregation opportunity.
- **Thermal state** — preferred, active, cold-refuge, warm-stress, or unknown.
- **Water type** — flowing/stillwater compatibility is explicit rather than assumed.
- **Holding-water class** — ecological structure changes the mechanical job: feeding lane, current refuge, cover edge, structural break, depth band, etc.
- **Forage class** — applied strongly only when forage is observed or carried in from Hatch Match; the engine does not invent a current hatch.

Light remains a modest secondary context modifier so an existing declared condition is not discarded, but it is intentionally weaker than the six core axes and still cannot introduce an unreviewed family.

Each ranked family carries a numeric **relative weight** plus an axis-by-axis delta trace. Those weights are only for ordering mechanical fit inside the reviewed family set. They are never converted into catch probability or bite likelihood.

## Target-status / jurisdiction layer

Target status is deliberately separate from biological suitability:

- `standard` — normal reviewed biological/presentation record.
- `regulated_context` — a reading may be produced, but regulation/jurisdiction verification is part of the invalidator and unknown chain.
- `conservation_sensitive` — biological context is retained, but presentation guidance fails closed.
- `non_target` — no presentation guidance.

Records that need extra control may also carry structured `targetContext` with:

- `jurisdictionScope`
- `verifyLocalRules`
- `note`

The structured layer currently covers bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, bigmouth buffalo, and smallmouth buffalo. It is composed at catalog time so the underlying reviewed seed batches stay auditable.

## Intelligence chain

Field Sense (named public water) → **this instrument** (species + presentation families) → Hatch Match (observed forage) / Tackle Link (system job) / Knot Analyst (connection job) / Rig Signal (device question).

## Packet

Version `HTH-1.0`. Public-safe. `privacy.containsCoordinates` is always `false`.

Inbound hydrate from `window.location.hash` (`#packet=`). Nothing is applied until the user confirms. Outbound carry is a hash on the destination origin — never an automatic POST.

Outbound packets now carry target status/context plus the `SPW-1.0` weighted family order so downstream tools can understand why a family was selected without receiving a bite score.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm test
```

Engine tests cover ordinary cases, six-axis weighting, holding-water re-ranking, observed-forage weighting, fail-closed water-type mismatch, unknown temperature, conservation-sensitive fail-closed behavior, and regulated-context jurisdiction warnings.

## Knowledge

60 reviewed North American records. Informal names (`brownie`, `smallie`, `laker`, `grayling`, `wiper`, `spoonbill`) resolve to reviewed records. Review date and next-review date are printed on the reading. Cadence: 90 days.

The catalog is composed from the original reviewed core plus dated expansion batches so future seeding remains auditable.

- Expansion 01 (2026-08-27): mountain whitefish, Arctic grayling, kokanee, lake whitefish, burbot, sauger, blue catfish, flathead catfish, freshwater drum.
- Expansion 02 (2026-08-27): pumpkinseed, redear sunfish, green sunfish, rock bass, chain pickerel, bowfin, longnose gar, spotted gar, brown bullhead, black bullhead, cisco, rainbow smelt, white perch, American eel, American shad.
- Expansion 03 (2026-08-27): bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, redbreast sunfish, warmouth, yellow bullhead, shortnose gar, yellow bass, hybrid striped bass, goldeye, mooneye, bigmouth buffalo, smallmouth buffalo, shorthead redhorse.

Expansion 03 is the first catalog batch with explicit target-status metadata. Bull trout and wild anadromous Atlantic salmon are context-only. Lake sturgeon, paddlefish, bigmouth buffalo, and smallmouth buffalo are marked regulated-context records.

Instrument ID: `HTH-SP-001` · schema `0.4.0` · app `0.4.0`
