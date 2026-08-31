# Species & Presentation Analyst

**Hook the Horizon · Field Intelligence** · `HTH-SP-001` · app `0.8.0`

TanStack Start + Nitro. **Live now:** [species-presentation-analyst.vercel.app](https://species-presentation-analyst.vercel.app/). Canonical host `species.hookthehorizon.blog` is not attached to the Vercel project yet — Launch from Ops uses the Vercel URL until it is.

Field PWA: `vite-plugin-pwa` emits `sw.js` (NetworkFirst pages, CacheFirst images). Grok still owns `/__grok/manifest.webmanifest` and `?install=1`.

**Mantra:** Biology before bravado. We do not predict whether fish will bite.

## Product boundary (non-negotiable)

- Explains biological and environmental **plausibility**, never catch probability.
- No bite scores, hotspots, coordinates, lure SKUs, or silent tracking.
- Unreviewed species names do not fall through to generic model text.
- Holding-water class is ecological structure, not a pin.
- Temperature provenance stays visible. Air temperature is never substituted silently.
- Packets move only on an explicit user action (`#packet=`). Incoming packets are inspected before they are applied. Outbound carries are inspected before they leave.
- Presentation weighting can re-rank only families already reviewed for the declared species and water type. No condition, species override, or population profile may introduce an unreviewed family.
- Relative family weights are model mechanics, **not probability, confidence of a bite, or a bite score**.
- Species-specific overrides and regional/population profiles are reviewed deltas inside the existing model, not escape hatches around it.
- Regional/population context is never inferred from a water name, jurisdiction, coordinates, or a user's location. It must be explicitly declared or explicitly carried in a reviewed packet.
- Population profiles are broad biological/system archetypes, never named reaches, spawning sites, migration bottlenecks, or secret locations.
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

## Second intelligence layer · `SPW-1.1`

The presentation engine ranks reviewed families through an explainable additive model:

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

## Species-specific weighting overrides · `SPO-1.2`

`SPO-1.2` composes the original `SPO-1.0` library, the `SPO-1.1` expansion, and expansion 04. The result is explicit coverage for **all 75 species records**.

- **72 records use weighted species-specific rules.** Their reviewed presentation families can receive additional deltas for biologically important combinations of season, thermal state, water type, holding-water class, observed forage, or light.
- **3 records are policy-only coverage:** bull trout, wild anadromous Atlantic salmon, and paddlefish. They are counted deliberately without manufacturing unreachable presentation rules. Bull trout and wild anadromous Atlantic salmon remain context-only; paddlefish remains a regulated filter-feeding record with no capture-method family output.
- Every applied rule ID and reason is written into the weight trace and outbound packet.
- `targetStatus` / `targetContext` evaluate before ordinary presentation guidance, so override coverage cannot bypass conservation or jurisdiction policy.

The first `SPO-1.0` pass covered rainbow trout, brown trout, brook trout, cutthroat trout, lake trout, steelhead, Chinook salmon, Coho salmon, largemouth bass, smallmouth bass, spotted bass, crappie, bluegill, walleye, northern pike, muskellunge, yellow perch, channel catfish, common carp, striped bass, kokanee, lake whitefish, burbot, and sauger.

`SPO-1.1` adds the remaining records: white bass, mountain whitefish, Arctic grayling, blue catfish, flathead catfish, freshwater drum, pumpkinseed, redear sunfish, green sunfish, rock bass, chain pickerel, bowfin, longnose gar, spotted gar, brown bullhead, black bullhead, cisco, rainbow smelt, white perch, American eel, American shad, bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, redbreast sunfish, warmouth, yellow bullhead, shortnose gar, yellow bass, hybrid striped bass, goldeye, mooneye, bigmouth buffalo, smallmouth buffalo, and shorthead redhorse.

`SPO-1.2` adds sockeye salmon (anadromous), pink salmon, chum salmon, landlocked Atlantic salmon, Arctic char, Dolly Varden, sheefish/inconnu, white sturgeon, alligator gar, white sucker, longnose sucker, largescale sucker, white catfish, longear sunfish, and flier. Anadromous sockeye is a separate record from kokanee; `sockeye` no longer aliases to the kokanee record.

Examples of distinctions now encoded:

- **white bass** and **yellow bass** no longer inherit the same schooling/current behavior simply because both are temperate bass;
- **mountain whitefish** preserve a lower-column/benthic identity while **Arctic grayling** can move strongly toward surface/drift mechanics under verified insect input;
- **blue catfish** separate river-channel bottom use from reservoir suspended-forage behavior, while **flathead catfish** remain more cover-bound and piscivorous;
- **redear sunfish** receive a strong mollusk/bottom distinction from bluegill and pumpkinseed;
- **chain pickerel**, **bowfin**, and the gar records retain different cover, backwater, and prey-interception mechanics;
- **cisco** and **rainbow smelt** are explicitly depth-band/pelagic rather than generic small-fish records;
- **goldeye** and **mooneye** separate low-light/turbid upper-column behavior from clearer-water drift behavior;
- **bigmouth buffalo** can move toward suspended plankton mechanics when zooplankton is actually observed, while **smallmouth buffalo** remains strongly benthic;
- **lake sturgeon** receives benthic weighting but remains jurisdiction-gated through `regulated_context`.

The override modules remain separate from the species seed records so reviewed biology stays auditable and weighting revisions can be tested/versioned independently.

## Regional / population context · `RPC-1.0`

`RPC-1.0` is a third, optional contextual refinement layered **after the reviewed species record and `SPO-1.2`**. It answers a different question: not merely “what species is this?” but “which reviewed life-history/system archetype are we actually talking about?”

A population profile may refine the relative weights of the species' already-approved presentation families and may add population-specific positioning notes and invalidators. It **cannot**:

- create a presentation family not already reviewed for that species and water type;
- change `targetStatus` or bypass conservation/jurisdiction policy;
- silently infer a population from a named water, jurisdiction, GPS position, or user location;
- emit a named reach, spawning site, migration bottleneck, or hotspot;
- turn regional biology into catch probability.

If a species/water declaration has reviewed RPC profiles but the user does not declare one, the engine keeps the generic species record and records **regional / population context** as an unresolved variable. A mismatched profile fails closed instead of being coerced onto another species or water type.

Expansion 04 also registers **14 reviewed RPC candidates** for the new species where life-history or population status materially changes interpretation. They are deliberately inactive in `RPC-1.0`: candidates such as managed vs ESA-listed sockeye/chum and western managed vs endangered Kootenai white sturgeon document the next reviewed RPC release without silently changing a live reading. Candidate target status may only become more restrictive; it can never relax the species-level status.

The first wave contains **16 reviewed profiles across 8 species**:

- **Striped bass** — Atlantic anadromous/coastal-river vs landlocked reservoir.
- **Cutthroat trout** — interior resident/fluvial vs adfluvial/lake-connected.
- **Smallmouth bass** — cool clear river vs rocky reservoir/offshore structure.
- **Walleye** — northern natural lake vs large-river/current population.
- **Blue catfish** — native large-river vs reservoir/forage-roaming.
- **Lake trout** — Great Lakes pelagic vs inland natural lake.
- **Cisco** — Great Lakes pelagic vs northern inland lake.
- **Mountain whitefish** — interior river vs interior lake population.

Examples of what this fixes:

- an **Atlantic anadromous striped bass** reading reinforces river-current/migration mechanics, while a **landlocked reservoir striped bass** reading reinforces pelagic depth-band travel;
- **river smallmouth** stay current-facing, while **reservoir smallmouth** receive more offshore rock/depth structure weight;
- **large-river walleye** receive stronger current/bottom mechanics than a **northern natural-lake walleye** profile;
- **reservoir blue catfish** can legitimately receive more suspended-forage weighting without forcing the same behavior onto native big-river fish;
- Great Lakes and inland **lake trout/cisco** retain the same species identity while accounting for radically different system scale and available coldwater volume;
- **mountain whitefish** keep a benthic identity in both contexts, but the river profile is a drift/current problem and the lake profile is a depth/substrate problem.

Numeric thermal bands remain species-level in `RPC-1.0`. Population profiles may explain thermal/oxygen constraints and system scale, but they do not yet rewrite the core species temperature limits. That separation keeps the first RPC release auditable and avoids false precision.

The RPC profile ID, label, life-history/system archetype, declaration source (`user_declared` or `field_sense`), weighting reason, and provenance are carried in the HTH packet. Incoming RPC context is displayed in the packet-inspection UI before the user can apply it.

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

The structured layer covers bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, bigmouth buffalo, smallmouth buffalo, sockeye salmon, pink salmon, chum salmon, sheefish, white sturgeon, and alligator gar. It is composed at catalog time so the underlying reviewed seed batches stay auditable.

## Intelligence chain

Field Sense (named public water + optional explicit population context) → **this instrument** (species + population archetype + presentation families) → Hatch Match (observed forage) / Tackle Link (system job) / Knot Analyst (connection job) / Rig Signal (device question).

## Canonical species images · `IMG-1.0`

Expansion 04 introduces a repository-owned canonical image registry. Each of the 15 new species has an optimized local `canonical.webp` and `thumb.webp` under `public/species/<slug>/`, plus source organization, creator, license, image type, identification confidence, visual-QA note, and review date in `src/lib/knowledge/species-images.ts`.

Identity images are authoritative photographs, federal reference/specimen photographs, or scientifically reliable public-domain/CC0 illustrations. AI imagery is not used as the canonical identification authority. The image importer preserves aspect ratio, does not enlarge small originals, creates a maximum 2200-pixel canonical WebP and 900-pixel thumbnail, and keeps the exact reviewed source provenance in `scripts/species-image-imports-04.json`.

The species picker displays the repository thumbnail when a reviewed image exists. The remaining 60 legacy species stay text-only until their canonical assets receive the same provenance and visual-QA treatment; the UI does not fabricate placeholders.

## Packet

Version `HTH-1.0`. Public-safe. `privacy.containsCoordinates` is always `false`.

Inbound hydrate from `window.location.hash` (`#packet=`). Nothing is applied until the user confirms. Outbound carry is a hash on the destination origin — never an automatic POST.

Outbound packets carry target status/context, the `SPW-1.1` weighted family order, `SPO-1.2`, applied species-override IDs, and—when explicitly declared—`RPC-1.0` population context and provenance. Downstream tools can understand why a family was selected without receiving a bite score or a location layer.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm test
```

Engine tests cover six-axis weighting, AFP identification/behavior dossier integrity, canonical spawning seasons, species-specific distinctions, full 75-record override coverage, policy-only records, expansion-04 alias separation, RPC candidate monotonicity, canonical-image registration, RPC profile integrity and family containment, explicit-vs-undeclared population behavior, profile/species/water mismatch fail-closed behavior, holding-water re-ranking, observed-forage weighting, reviewed-family-only invariants, fail-closed water-type mismatch, unknown temperature, conservation-sensitive fail-closed behavior, and regulated-context jurisdiction warnings.

## Knowledge

The Species Profile is the optional `AFP-1.2` reference layer: the same ten angler questions as `AFP-1.0`. Identification, behavior, diet, and seasonal calendar can be marked reviewed when `AFP-ID-1.0` / `AFP-BH-1.0` / `AFP-DI-1.0` / `AFP-SC-1.0` dossiers exist. Wave 01 covers 26 high-confusion species. Wave 02a adds brown trout, brook trout, lake trout, and steelhead (kept separate from inland rainbow). Wave 02b adds walleye, sauger, northern pike, muskellunge, chain pickerel, and yellow perch. Wave 02c adds crappie, bluegill, pumpkinseed, redear, green sunfish, and rock bass. Remaining species stay explicitly incomplete. Fight and food value stay unreviewed. Dossiers do not feed presentation weighting. Seeding follows a ranked distinction-group queue; live coverage is computed, not hand-maintained.

75 reviewed North American records. Informal names (`brownie`, `smallie`, `laker`, `grayling`, `wiper`, `spoonbill`, `sockeye`, `dolly`, `sheefish`) resolve to reviewed records. Review date and next-review date are printed on the reading. Cadence: 90 days.

The catalog is composed from the original reviewed core plus dated expansion batches so future seeding remains auditable.

- Expansion 01 (2026-08-27): mountain whitefish, Arctic grayling, kokanee, lake whitefish, burbot, sauger, blue catfish, flathead catfish, freshwater drum.
- Expansion 02 (2026-08-27): pumpkinseed, redear sunfish, green sunfish, rock bass, chain pickerel, bowfin, longnose gar, spotted gar, brown bullhead, black bullhead, cisco, rainbow smelt, white perch, American eel, American shad.
- Expansion 03 (2026-08-27): bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, redbreast sunfish, warmouth, yellow bullhead, shortnose gar, yellow bass, hybrid striped bass, goldeye, mooneye, bigmouth buffalo, smallmouth buffalo, shorthead redhorse.
- Expansion 04 (2026-08-27): sockeye salmon (anadromous), pink salmon, chum salmon, landlocked Atlantic salmon, Arctic char, Dolly Varden, sheefish/inconnu, white sturgeon, alligator gar, white sucker, longnose sucker, largescale sucker, white catfish, longear sunfish, flier.

Expansion 03 is the first catalog batch with explicit target-status metadata. Bull trout and wild anadromous Atlantic salmon are context-only. Lake sturgeon, paddlefish, bigmouth buffalo, and smallmouth buffalo are marked regulated-context records.

Instrument ID: `HTH-SP-001` · schema `0.7.0` · app `0.8.0`
