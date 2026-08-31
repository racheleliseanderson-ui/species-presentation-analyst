# Master angler profile coverage

Model: `AFP-1.2`

The Species & Presentation Analyst now treats the complete angler mental model as a separate reference layer rather than adding more required setup controls to Quick Read.

The profile contract is intentionally broader than the presentation engine. It answers ten different questions:

1. Identification — What fish is this?
2. Habitat & location — Where do I find them?
3. Behavior — What is the fish trying to accomplish?
4. Diet — What does it eat?
5. Best fishing methods — How should I fish for it?
6. Seasonal calendar — When should I fish for it?
7. Conditions — What changes the decision?
8. Fight characteristics — What is it like to catch one?
9. Food value — Can I eat it?
10. Regulations & conservation — Can I legally target/keep it, and how do I protect the resource?

## Current coverage

| Layer | Current status | Already structured | Important gaps |
| --- | --- | --- | --- |
| Identification | Reviewed for 30 species (26 lookalikes + wave 02a trout); partial elsewhere | common/scientific names, aliases; AFP-ID-1.0 dossiers with diagnostic traits, lookalike keys, size/age where sourced | remaining 45 species; some subspecies/strain tables |
| Habitat & location | Partial / strong | range, origin context, water type, depth tendency, current preference, thermal bands, light response, holding-water classes | species-specific oxygen/clarity detail, complete movement/migration calendar |
| Behavior | Reviewed for 30 species; partial elsewhere | positioning, thermal state, light response, spawning caution, exceptions, RPC; AFP-BH-1.0 social/feeding/diel/cover dossiers | remaining 45 species; angling-pressure and frontal evidence still sparse |
| Diet | Reviewed for 30 species; partial elsewhere | forage classes, observed-forage packet integration; AFP-DI-1.0 primary/seasonal/life-stage diet | remaining 45 species; prey-size tables by waterbody |
| Best fishing methods | Partial / strong | reviewed presentation families, mechanical equipment job, downstream tackle/knot/rig handoffs | species-profile rod/reel/line ranges, hook reference, bait/lure-family reference, retrieve-speed ranges |
| Seasonal calendar | Reviewed for 30 species; partial elsewhere | season as a core weighting axis; spawning caution; AFP-SC-1.0 habitat-class progression | remaining 45 species; month-by-month location/behavior calendars |
| Conditions | Partial / strong | temperature, flow/still state, clarity, light, weather trend, season, holding water, forage | species-specific wind/rain/water-level evidence, barometric pressure, moon evidence |
| Fight characteristics | Not reviewed | — | fight strength, speed, endurance, jumps, runs, head shakes/surges, landing considerations |
| Food value | Not reviewed | — | table quality, texture/flavor, cleaning/fillet yield, cooking, current waterbody-specific consumption advisories |
| Regulations & conservation | Partial | target status, structured conservation/jurisdiction gates, fail-closed behavior | live size/bag limits, seasons, protected areas, management-unit population health, current consumption advisories |

The status language is deliberate. `AFP-1.2` overlays reviewed identification, behavior, diet, and seasonal-calendar dossiers onto the same ten-question contract. Species without dossiers remain partial. Fight and food value stay unreviewed. The overlay never manufactures generic biology and never feeds presentation-family weighting.


## AFP-ID-1.0 / AFP-BH-1.0 wave 01

The first dossier wave covers the lookalike groups that most often collapse in the field:

- rainbow trout vs cutthroat trout
- kokanee vs anadromous sockeye
- largemouth vs smallmouth vs spotted bass
- striped bass vs white bass vs white perch vs wiper (yellow bass included as a lookalike)
- cisco vs lake whitefish
- goldeye vs mooneye
- common carp vs bigmouth buffalo vs smallmouth buffalo
- longnose vs spotted vs shortnose vs alligator gar
- brown vs black vs yellow bullhead

Characters come from agency, museum, and peer-reviewed keys (TPWD, USFWS, NOAA Fisheries, Minnesota DNR, North Dakota Game and Fish, Florida Museum, FWC, USGS). Generative visual identification is not used as authority. Remaining catalog species keep visible identification and behavior gaps.

## AFP wave 02a — high-use trout

The usefulness pass starts with the trout people actually open:

- brown trout
- brook trout
- lake trout
- steelhead (kept separate from inland rainbow)

Agency keys: unspotted caudal and haloed red spots (brown); vermiculations and white-then-black fin edges (brook, USFWS/CDFW); deeply forked tail and light-on-dark spotting (lake trout, Michigan DNR); anadromy vs residency (steelhead, NOAA/USFWS). Winter-run and summer-run steelhead are not collapsed. Many winter steelhead are not treated as feeding inland rainbows. Lake trout adult piscivory (cisco, sculpin, and substitutions) stays distinct from brook insectivory.

## AFP-DI-1.0 / AFP-SC-1.0 wave 01

The same 26 lookalike species now have diet and seasonal-calendar overlays:

- Diet records primary forage inside catalog classes, plus seasonal and life-stage notes where agency or peer-reviewed sources support them.
- Observed forage still comes from the user or Hatch Match. Diet capacity never infers a current hatch.
- Seasonal calendars describe habitat class, depth, thermal context, and conservation-safe spawning notes. They are not “spring = shallow / summer = deep” tables.
- Presentation notes may only mention already-reviewed families.
- Kokanee remains a zooplankton specialist; anadromous sockeye freshwater adults are not feeding trout. Cisco stays pelagic-plankton; lake whitefish stays benthic. Carp, bigmouth buffalo, and smallmouth buffalo keep distinct feeding identities.

## Regional / population context

Regional/population context is already live as `RPC-1.0` and remains an overlay rather than a new core weighting axis. It can re-rank only already-reviewed presentation families and can add population-specific positioning and invalidators.

Current live RPC wave: 16 profiles across 8 species:

- striped bass — Atlantic anadromous/coastal-river vs landlocked reservoir
- cutthroat trout — interior resident/fluvial vs adfluvial/lake-connected
- smallmouth bass — cool clear river vs rocky reservoir/offshore structure
- walleye — northern natural lake vs large river/current population
- blue catfish — native large river vs reservoir/forage-roaming
- lake trout — Great Lakes pelagic vs inland natural lake
- cisco — Great Lakes pelagic vs northern inland lake
- mountain whitefish — interior river vs interior lake population

Expansion 04 also registers 14 reviewed RPC candidates that remain inactive until a future reviewed release.

RPC guardrails remain unchanged:

- no automatic inference from a water name, jurisdiction, GPS position, or user location;
- no named reaches, spawning sites, migration bottlenecks, or hotspots;
- no relaxation of species-level target status;
- no new presentation family outside the reviewed species/water-type set;
- no catch probability or bite score.

## Seeding doctrine

Enrichment is a ranked queue (`src/lib/knowledge/seed-queue.ts`). Live coverage is computed from dossiers (`src/lib/knowledge/coverage.ts`), never copied by hand.

Rules:

- The unit of work is a **distinction group**, with identification, behavior, diet, and seasonal calendar written together.
- High-use / opener species before rare leftovers.
- Agency or peer-reviewed sources. Visible gaps beat generic model text.
- Conservation-sensitive records (bull trout, wild anadromous Atlantic salmon) may receive identification only. They do not get a how-to-target calendar.
- Fight, food value, gear ranges, and live regulations wait until the high-use set is knowable.
- A wave is `landed` only when tests show every required overlay exists.

Landed: wave 01 (26 lookalikes), wave 02a (brown, brook, lake trout, steelhead).
Next: wave 02b — walleye, sauger, northern pike, muskellunge, chain pickerel, yellow perch.

## Next research order

The next data work follows `SEED_WAVES`, not a flat 75-species dump:

1. Wave 02b coolwater predators (walleye, sauger, pike, muskie, pickerel, perch) — all four overlays together.
2. Waves 02c–02e panfish then catfish.
3. Waves 02f–02g remaining salmon and salmonids.
4. Wave 03 identification-only for fail-closed conservation records.
5. Wave 04 remaining catalog.
6. Methods ranges, then fight, then food, then live regulation connectors — after the high-use set is knowable.

This preserves the product distinction: novices can ask “what should I use?” while the deeper model continues to answer the more useful question, “what is this fish trying to accomplish under the declared conditions?”
