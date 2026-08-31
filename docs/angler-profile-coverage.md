# Master angler profile coverage

Model: `AFP-1.3`

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
| Identification | Reviewed for 41 species (wave 01 lookalikes + wave 02 open-first records); partial elsewhere | common/scientific names, aliases; AFP-ID-1.0 dossiers with diagnostic traits, lookalike keys, size/age where sourced | remaining 34 species; some subspecies/strain tables |
| Habitat & location | Partial / strong | range, origin context, water type, depth tendency, current preference, thermal bands, light response, holding-water classes | species-specific oxygen/clarity detail, complete movement/migration calendar |
| Behavior | Reviewed for 41 species (wave 01 lookalikes + wave 02 open-first records); partial elsewhere | positioning, thermal state, light response, spawning caution, exceptions, RPC; AFP-BH-1.0 social/feeding/diel/cover dossiers | remaining 34 species; angling-pressure and frontal evidence still sparse |
| Diet | Reviewed for 26 high-confusion species; partial elsewhere | forage classes, observed-forage packet integration; AFP-DI-1.0 primary/seasonal/life-stage diet | remaining 49 species including wave 02; prey-size tables by waterbody |
| Best fishing methods | Partial / strong | reviewed presentation families, mechanical equipment job, downstream tackle/knot/rig handoffs | species-profile rod/reel/line ranges, hook reference, bait/lure-family reference, retrieve-speed ranges |
| Seasonal calendar | Reviewed for 26 high-confusion species; partial elsewhere | season as a core weighting axis; spawning caution; AFP-SC-1.0 habitat-class progression | remaining 49 species including wave 02; month-by-month location/behavior calendars |
| Conditions | Partial / strong | temperature, flow/still state, clarity, light, weather trend, season, holding water, forage | species-specific wind/rain/water-level evidence, barometric pressure, moon evidence |
| Fight characteristics | Reviewed or partial for 26 high-confusion species; not reviewed elsewhere | AFP-FT-1.0 descriptive classes (relative strength, acceleration, endurance, runs, jumps, landing, handling). Never a 1–100 score | remaining 49 species; several wave-01 lookalikes stay partial until a species-specific hooked-fight quote exists |
| Food value | Reviewed or partial for 26 high-confusion species; not reviewed elsewhere | AFP-FV-1.0 table character, cooking notes, biological hazards; standing consumption-advisory rule | remaining 49 species; live waterbody contaminant advisories; some flavor/yield tables |
| Regulations & conservation | Partial | target status, structured conservation/jurisdiction gates, fail-closed behavior | live size/bag limits, seasons, protected areas, management-unit population health, current consumption advisories |

The status language is deliberate. `AFP-1.3` overlays reviewed identification, behavior, diet, seasonal-calendar, fight, and food-value dossiers onto the same ten-question contract. Species without dossiers remain partial or not-reviewed. The overlay never manufactures generic biology and never feeds presentation-family weighting.


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

Characters come from agency, museum, and peer-reviewed keys (TPWD, USFWS, NOAA Fisheries, Minnesota DNR, North Dakota Game and Fish, Florida Museum, FWC, USGS). Generative visual identification is not used as authority.

## AFP-ID-1.0 / AFP-BH-1.0 wave 02

The second dossier wave covers the open-first records and the lookalikes that sit next to them:

- brown trout vs brook trout vs lake trout (still distinguish inland rainbow and cutthroat)
- steelhead vs inland rainbow
- Chinook vs Coho (still distinguish sockeye / kokanee)
- walleye vs sauger
- northern pike vs muskellunge vs chain pickerel
- channel vs blue vs flathead catfish (still distinguish bullheads)
- yellow perch vs white perch and walleye

Wave 02 ships identification and behavior only. Diet, seasonal calendar, fight, and food value stay as visible gaps until a later sourced pass. Characters come from MassWildlife, NOAA Fisheries, CDFW, ODFW, WDFW, USFWS, Minnesota DNR, Iowa DNR, TPWD, Michigan DNR, Outdoor Alabama, Connecticut DEEP, and Scott & Crossman. Inland-rainbow leaping notes are not copied onto brown, brook, or lake trout. Steelhead is not inland rainbow with a different name. Chinook blackmouth / both-lobe spots stay separate from coho white gums / upper-lobe spots. Walleye white tail-tip stays off sauger. Esox cheek/opercle/pore keys are not collapsed. Flathead live-fish identity is not copied onto channel catfish.

Remaining catalog species keep visible identification and behavior gaps.

## AFP-DI-1.0 / AFP-SC-1.0 wave 01

The same 26 lookalike species now have diet and seasonal-calendar overlays:

- Diet records primary forage inside catalog classes, plus seasonal and life-stage notes where agency or peer-reviewed sources support them.
- Observed forage still comes from the user or Hatch Match. Diet capacity never infers a current hatch.
- Seasonal calendars describe habitat class, depth, thermal context, and conservation-safe spawning notes. They are not “spring = shallow / summer = deep” tables.
- Presentation notes may only mention already-reviewed families.
- Kokanee remains a zooplankton specialist; anadromous sockeye freshwater adults are not feeding trout. Cisco stays pelagic-plankton; lake whitefish stays benthic. Carp, bigmouth buffalo, and smallmouth buffalo keep distinct feeding identities.

## AFP-FT-1.0 / AFP-FV-1.0 wave 01

The same 26 lookalike species now have fight and food-value overlays:

- Fight records are descriptive classes and agency text. They are never a 1–100 score or a fun rating. Missing classes stay omitted rather than inferred from body shape.
- Rainbow leaping notes are not copied onto cutthroat. Kokanee light-tackle notes are not copied onto anadromous sockeye. Smallmouth aerial-acrobat notes are not copied onto spotted or largemouth. Carp fight notes are not copied onto buffalo.
- Food records describe table character, cleaning, and cooking. They always carry the standing consumption-advisory rule. They never write “this species is safe to eat.”
- Gar eggs are a species-level biological hazard, not a waterbody contaminant advisory. Bullhead spines are a handling/cleaning hazard.
- Harvest-gate notes on anadromous sockeye, buffalo, alligator gar, and similar regulated-context records are conservation/jurisdiction reminders, not keep recommendations.
- Live mercury, PFAS, PCB, and other contaminant guidance stays outside the static catalog.

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

Do not add another flat species expansion. Fill overlays in ranked waves. `AFP-Q-1.0` is the seed contract: distinction groups, required layers, and do-not-copy rules. It does not invent identification or table facts.

| Wave | Status | What it is |
| --- | --- | --- |
| 01 | Shipped | 26 high-confusion lookalikes (ID through food-value) |
| 02 | In progress | Open-first salmonids, pike, walleye/sauger, large catfish, yellow perch (15). Identification and behavior on file; diet, calendar, fight, and food still open |
| 03 | Queued | Sunfish and crappie (10) |
| 04 | Queued | Remaining salmonids, mountain whitefish, grayling, burbot, smelt (10) |
| 05 | Queued | Suckers, white catfish, drum/bowfin/eel/shad, conservation-gated records (14) |

A later dossier PR should take the next queued wave, keep lookalike keys reciprocal, and leave missing fields omitted. Live regulation/consumption connectors and RPC expansion remain separate work.

This preserves the product distinction: novices can ask “what should I use?” while the deeper model continues to answer the more useful question, “what is this fish trying to accomplish under the declared conditions?”
