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
| Identification | Reviewed for 63 species (26 lookalikes + 02a–02g + two conservation IDs); partial elsewhere | common/scientific names, aliases; AFP-ID-1.0 dossiers with diagnostic traits, lookalike keys, size/age where sourced | remaining 12 species; some subspecies/strain tables |
| Habitat & location | Partial / strong | range, origin context, water type, depth tendency, current preference, thermal bands, light response, holding-water classes | species-specific oxygen/clarity detail, complete movement/migration calendar |
| Behavior | Reviewed for 61 species; partial elsewhere | positioning, thermal state, light response, spawning caution, exceptions, RPC; AFP-BH-1.0 social/feeding/diel/cover dossiers | remaining 14 species (including two conservation IDs that stay recognition-only); angling-pressure and frontal evidence still sparse |
| Diet | Reviewed for 61 species; partial elsewhere | forage classes, observed-forage packet integration; AFP-DI-1.0 primary/seasonal/life-stage diet | remaining 14 species (including two conservation IDs that stay recognition-only); prey-size tables by waterbody |
| Best fishing methods | Partial / strong | reviewed presentation families, mechanical equipment job, downstream tackle/knot/rig handoffs | species-profile rod/reel/line ranges, hook reference, bait/lure-family reference, retrieve-speed ranges |
| Seasonal calendar | Reviewed for 61 species; partial elsewhere | season as a core weighting axis; spawning caution; AFP-SC-1.0 habitat-class progression | remaining 14 species (including two conservation IDs that stay recognition-only); month-by-month location/behavior calendars |
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

## AFP wave 02b — coolwater predators

The next usefulness pass is the coolwater set people actually search after the opener chips:

- walleye vs sauger (and saugeye as a named hybrid, not a silent inherit)
- northern pike vs muskellunge vs chain pickerel
- yellow perch kept off both Sander records

Agency keys: white lower tail tip and rear-base dorsal blotch (walleye, Minnesota DNR) vs spotted first dorsal and saddle marks (sauger, Minnesota DNR / Missouri DNR); light spots on dark, full cheek scales, five or fewer pores (pike, Michigan / Iowa DNR) vs dark marks on light, half-scaled cheek, six or more pores (muskellunge); chain pattern and vertical eye-bar (chain pickerel, South Carolina DNR / North Carolina Wildlife); seven bars and no canines (yellow perch, Michigan DNR). Sauger stay more riverine and benthic than walleye. Pickerel stay cover-oriented and are not open-pelagic pike. Yellow perch remain a schooling insect-to-small-fish diet, not a walleye piscivore.

## AFP wave 02c — core panfish

The pile anglers treat as “sunfish” and “crappie”:

- crappie as a black/white complex (Minnesota DNR dorsal-spine split stays inside one record)
- bluegill vs pumpkinseed vs redear vs green sunfish
- rock bass kept off smallmouth

Agency keys: black 7–8 dorsal spines vs white 5–6 and bars (crappie, Minnesota DNR); soft-dorsal spot, pointed pectorals, plain black ear flap (bluegill, Michigan DNR); red-orange flap spot and wavy blue cheek lines (pumpkinseed); red/orange flap edge and snail-crushing throat teeth (redear, TPWD / Missouri DNR); large mouth and bass-like body, common hybrids (green sunfish, TPWD); six anal spines and red eyes (rock bass, Michigan DNR). Redear stay a benthic mollusk specialist. Bluegill do not inherit a small-fish forage class. Colonial nests stay conservation context.

## AFP wave 02d — remaining sunfish

The leftover Lepomis/Centrarchus set, written as one distinction group after the core panfish pile:

- redbreast vs longear (long ear flap is not one fish)
- warmouth vs rock bass vs green sunfish (large mouth / goggle-eye nicknames)
- flier vs crappie (round body, teardrop, extra spines)

Agency keys: long, entirely black flap no wider than the eye (redbreast, North Carolina Wildlife / South Carolina DNR); elongated black flap often white-edged plus short rounded pectorals (longear, Missouri DNR / Illinois DNR); tongue teeth, three anal spines, eye-streaks (warmouth, TPWD / FWC); 11–13 dorsal spines, 7–8 anal spines, black teardrop (flier, South Carolina DNR / Georgia DNR). Longear do not inherit a mollusk forage class. Warmouth stay solitary cover fish, not rock bass. Flier stay a backwater sunfish, not the crappie complex. Grouped nests stay conservation context.

## AFP wave 02e — catfish

Same family, four different jobs:

- channel vs blue (forked tails, anal-fin shape and ray count, spots)
- flathead kept off both Ictalurus records (square tail, underbite, live-fish diet)
- white catfish kept off channel and off square-tailed bullheads

Agency keys: convex anal fin 24–29 rays and spots that fade on large fish (channel, Missouri DNR / TPWD / North Carolina Wildlife); straight anal fin 30–36 rays, usually unspotted (blue, TPWD / Indiana DNR / North Carolina Wildlife); flattened head, projecting lower jaw, 14–17 anal rays (flathead, Missouri DNR / TPWD); moderately forked rounded lobes, 18–24 anal rays, light chin barbels, wide head (white catfish, Connecticut DEEP / Virginia DWR). Flathead stay solitary live-fish predators, not scavengers. Blue catfish eat fish earlier than channel and can roam in reservoirs; Chesapeake and other Atlantic-slope introductions stay conservation context. White catfish stay a small coastal Ameiurus. Cavity nests stay conservation context.

## AFP wave 02f — Pacific and landlocked salmon

Keep chinook, coho, pink, chum, and landlocked Atlantic from collapsing into trout or steelhead:

- chinook vs coho (blackmouth / both-lobe tail spots vs white-at-tooth-base gums / upper-lobe spots)
- pink vs chum (large oval spots, small scales, no silver on the tail vs unspotted with silver on the tail rays and calico spawners)
- landlocked Atlantic vs brown trout (slight fork, single-row vomer, short maxillary, dark adipose) and named as not wild sea-run Atlantic salmon

Agency keys: NOAA black gums and spots on both tail lobes, typical 3 ft / 30 lb, two endangered and seven threatened ESUs as of 2025 (chinook); NOAA lighter gumline, upper-lobe spots, 8–12 lb / 24–30 in, one endangered and three threatened ESUs (coho); Oregon DFW lower-jaw gum line as the enforcement split; California DFW white at the tooth base and no lower-tail spots; ADF&G pink adults do not eat in freshwater, two-year odd/even cycle, large oval spots on the entire tail, very small scales, no silver on the tail; ADF&G chum cease feeding on the spawning run, no dark spots, silver streaks along tail rays; NOAA two threatened chum ESUs; Maine IFW smelt as principal lake forage, prefer water below 65°F, slightly forked tail vs square brown tail, single-row vs zig-zag vomerine teeth.

Pacific freshwater spawning adults are interception, not forage matching. Great Lakes chinook and coho still feed in lakes — the species overlay does not auto-select those jobs. Pink and chum are flowing-only. Landlocked Atlantic still feeds and stays off the fail-closed wild sea-run Atlantic record. Redds stay excluded.

## AFP wave 02g — remaining salmonids and burbot

After the trout and Pacific salmon people actually open, finish the leftover salmonids and the coldwater cod:

- mountain whitefish vs lake whitefish vs trout (small toothless overhung mouth, adipose fin, not a sucker)
- Arctic grayling (sail dorsal, black jaw slash) kept off whitefish and trout; lower-48 remnants stay conservation-sensitive
- burbot (single chin barbel, eel-like, nocturnal, winter spawn)
- Arctic char vs Dolly Varden (fewer larger spots and a deep fork vs many small spots and a thick peduncle; Alaska char are lake-resident)
- sheefish as the large piscivorous coregonine (projecting lower jaw), not a mountain whitefish

Agency keys: Idaho Fish and Game / Montana Field Guide (mountain whitefish); ADF&G grayling, Arctic char, Dolly Varden, and sheefish profiles; Minnesota DNR burbot. Arctic char calendars are stillwater only. Dolly Varden egg feeding is scavenged drift, never a redd method. Bull trout stay fail-closed. Sheefish long-distance movement and broadcast spawning stay conservation context. Fight and food stay unreviewed.

## AFP wave 03 — recognition-only conservation records

Bull trout and wild anadromous Atlantic salmon stay fail-closed. Identification helps people not confuse them. Behavior, diet, and seasonal calendars are not a how-to-target layer:

- bull trout vs Dolly Varden vs brook trout vs lake trout (unmarked dorsal, pale orange/pink/yellow spots, slightly forked tail, white leading fin edges)
- wild Gulf of Maine Atlantic salmon vs landlocked Atlantic vs steelhead vs brown trout (same Salmo keys as landlocked; ESA endangered; U.S. fishing prohibited)

Agency keys: USFWS olive/drab with pale orange round spots, common 25 in, max 40.5 in / 31 lb 15 oz, ESA threatened lower 48; Montana FWP unmarked dorsal / pale spots / slightly forked tail / white fin edges; Oregon DFW dorsal fin lacks markings vs brook solid-black markings (≥125 mm). NOAA Gulf of Maine DPS endangered, remaining wild U.S. populations in rivers in central and eastern Maine, commercial and recreational fishing prohibited; Maine IFW illegal to fish for or possess wild sea-run Atlantic salmon. Named Maine rivers are not locations. Redds stay excluded. Presentation families stay empty.

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

Landed: wave 01 (26 lookalikes), wave 02a (brown, brook, lake trout, steelhead), wave 02b (walleye, sauger, northern pike, muskellunge, chain pickerel, yellow perch), wave 02c (crappie, bluegill, pumpkinseed, redear, green sunfish, rock bass), wave 02d (redbreast, warmouth, longear, flier), wave 02e (channel catfish, blue catfish, flathead, white catfish), wave 02f (chinook, coho, pink, chum, landlocked Atlantic), wave 02g (mountain whitefish, Arctic grayling, burbot, Arctic char, Dolly Varden, sheefish), wave 03 (identification-only: bull trout, wild anadromous Atlantic salmon).
Next: wave 04 — remaining catalog (drum, bowfin, smelt, eel, shad, sturgeons, paddlefish, suckers).

## Next research order

The next data work follows `SEED_WAVES`, not a flat 75-species dump:

1. Wave 04 remaining catalog.
2. Methods ranges, then fight, then food, then live regulation connectors — after the high-use set is knowable.

This preserves the product distinction: novices can ask “what should I use?” while the deeper model continues to answer the more useful question, “what is this fish trying to accomplish under the declared conditions?”
