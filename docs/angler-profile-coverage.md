# Master angler profile coverage

Model: `AFP-1.0`

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
| Identification | Partial | common/scientific names, aliases | diagnostic appearance, color variation, juvenile/adult differences, lookalikes, size/weight, age |
| Habitat & location | Partial / strong | range, origin context, water type, depth tendency, current preference, thermal bands, light response, holding-water classes | species-specific oxygen/clarity detail, complete movement/migration calendar |
| Behavior | Partial | positioning, thermal state, light response, spawning caution, exceptions, RPC population/system context when reviewed | schooling, territoriality/aggression, angling-pressure response, predator avoidance, species-specific front/weather response |
| Diet | Partial | forage classes and observed-forage packet integration | seasonal diet, life-stage diet, prey-size preference, regional forage substitutions |
| Best fishing methods | Partial / strong | reviewed presentation families, mechanical equipment job, downstream tackle/knot/rig handoffs | species-profile rod/reel/line ranges, hook reference, bait/lure-family reference, retrieve-speed ranges |
| Seasonal calendar | Partial | season is a core weighting axis; spawning seasons and caution are structured | month-by-month location/behavior calendar and non-aggregation seasonal progression |
| Conditions | Partial / strong | temperature, flow/still state, clarity, light, weather trend, season, holding water, forage | species-specific wind/rain/water-level evidence, barometric pressure, moon evidence |
| Fight characteristics | Not reviewed | — | fight strength, speed, endurance, jumps, runs, head shakes/surges, landing considerations |
| Food value | Not reviewed | — | table quality, texture/flavor, cleaning/fillet yield, cooking, current waterbody-specific consumption advisories |
| Regulations & conservation | Partial | target status, structured conservation/jurisdiction gates, fail-closed behavior | live size/bag limits, seasons, protected areas, management-unit population health, current consumption advisories |

The status language is deliberate. `AFP-1.0` does not convert partial catalog data into a false claim of complete species coverage.

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

## Next research order

The next data work should not be another flat species expansion. It should fill the profile gaps in an order that improves field decisions without encouraging false precision:

1. Identification dossiers: diagnostic traits, life-stage appearance, lookalikes, size/age.
2. Behavior dossiers: schooling/solitary, pressure response, activity period, territoriality, weather sensitivity.
3. Diet calendars: seasonal and life-stage forage, prey-size shifts, regional substitutions.
4. Species-specific methods reference: equipment ranges, hook/rig families, retrieve mechanics, linked to Tackle Link and Knot Analyst rather than duplicating those engines.
5. Seasonal calendars: broad month/season progression by population archetype, with spawning aggregations excluded from targeting guidance.
6. Fight characteristics: descriptive reference only, not a quality score.
7. Food value: table/cooking information kept separate from live contaminant advisories.
8. Live regulation/consumption connectors: jurisdiction and waterbody-aware sources with timestamps; never freeze changing legal limits into the static species catalog.

This preserves the product distinction: novices can ask “what should I use?” while the deeper model continues to answer the more useful question, “what is this fish trying to accomplish under the declared conditions?”
