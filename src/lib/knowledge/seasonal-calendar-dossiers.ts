import {
  DOSSIER_NEXT_REVIEW_AT,
  DOSSIER_REVIEWED_AT,
  type SeasonalCalendarDossier,
} from "./dossier-types.ts";

const R = {
  reviewedAt: DOSSIER_REVIEWED_AT,
  nextReviewAt: DOSSIER_NEXT_REVIEW_AT,
} as const;

const MONTH_GAP = "month-by-month location changes inside a season, which are waterbody-specific";
const POP_GAP = "population-archetype calendars beyond the species-level overlay (see RPC)";

/**
 * AFP-SC-1.0 wave 01 — seasonal calendars for the highest-confusion groups.
 *
 * Entries describe broad biological progression by canonical season.
 * Spawning is conservation/biology context. Exact aggregation sites, staging
 * concentrations, and migration bottlenecks are excluded. Presentation notes
 * refer only to already-reviewed families.
 */
export const SEASONAL_CALENDAR_DOSSIERS: SeasonalCalendarDossier[] = [
  {
    speciesId: "oncorhynchus_mykiss",
    status: "reviewed",
    overview:
      "Inland rainbows track food delivery and thermal refuge more than a single depth rule. Spring spawning is conservation context. Summer is an oxygen/temperature constraint. Lake and stream calendars differ; RPC does not auto-select them.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper pools, tailwater, and lake basins in the remaining active band.",
        depthTendency: "Lower in the column than spring feeding stations.",
        feedingEmphasis: "Slow subsurface intercept of nymphs and midges.",
        thermalContext: "Near or below the 42°F cold edge, activity compresses.",
        presentationImplication: "Dead-drift and tight-line drift remain the reviewed insect-scale jobs; stillwater leans on suspend-pause rather than fast retrieves.",
        invalidators: ["treating winter as a surface-terrestrial problem", "inventing a hatch from diet capacity"],
      },
      {
        season: "early_spring",
        habitatClass: "Riffle-to-run and seams as flow and temperature rise together.",
        movementTendency: "Fish redistribute onto feeding water. Spawning gravel is not a target class.",
        thermalContext: "Leaving the cold edge toward the 45–65°F active band.",
        conservationNote: "Early-spring spawning overlap is caution, not an aggregation opportunity.",
        presentationImplication: "Dead-drift, tight-line drift, and suspended drift fit rising insect delivery.",
      },
      {
        season: "spring",
        habitatClass: "Runs, seams, boulder pockets; lake inlets and drop-offs.",
        forageEmphasis: "Aquatic insects and emergences where they occur.",
        conservationNote: "Spring spawner in most inland waters. Spawning gravel and staging water are excluded from target guidance.",
        presentationImplication: "Reviewed drift families stay primary; swing is a current-intercept option, not a new family.",
        invalidators: ["using spawning substrate as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Oxygenated current, shade, tailwater, or lake thermocline edges.",
        depthTendency: "Deeper on bright, warm, or pressured days.",
        thermalContext: "Preferred 50–60°F. The 70°F warm edge is a constraint, not a feeding cue.",
        coverUse: "Broken water and depth more than heavy wood.",
        presentationImplication: "Stillwater: horizontal retrieve, stop-and-go, or trolling in the usable band. Flowing: drift remains valid in refuge water.",
        invalidators: ["forcing shallow bright water above the warm edge"],
      },
      {
        season: "fall",
        habitatClass: "Feeding stations reopen as water cools off the summer edge.",
        forageEmphasis: "Opportunistic insects, baitfish, or eggs where those foods exist.",
        presentationImplication: "Cross-current retrieve and swing can rise when fish, not insects, are the observed forage.",
        invalidators: ["assuming an egg event from calendar alone"],
      },
    ],
    sources: [
      { label: "USFWS / state inland trout management summaries", class: "agency" },
      { label: "Raleigh et al. habitat suitability (rainbow trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "oncorhynchus_clarkii",
    status: "reviewed",
    overview:
      "Interior cutthroat calendars are tributary- and inlet-linked. Spring spawning is conservation context. Many forms stay more insect-oriented than rainbow through summer.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper lake basins, inlets, or stream wintering pools.",
        feedingEmphasis: "Subsurface invertebrates.",
        presentationImplication: "Dead-drift and suspended drift in flowing water; horizontal retrieve or trolling in lakes.",
      },
      {
        season: "spring",
        habitatClass: "Tributary-influenced water, seams, and lake inlets.",
        movementTendency: "Many interior forms move into tributaries. That movement is biology, not a pin.",
        conservationNote: "Spring spawner. Tributary spawning water is excluded from target guidance.",
        presentationImplication: "Dead-drift, swing, surface-drift, and suspended drift remain the reviewed flowing families.",
        invalidators: ["naming tributary mouths as secret staging"],
      },
      {
        season: "summer",
        habitatClass: "Moderate current, drop-offs, and shade on bright alpine water.",
        thermalContext: "Preferred 48–58°F; 68°F warm edge is a refuge problem.",
        forageEmphasis: "Terrestrials and aquatic insects in streams; zooplankton possible in lakes.",
        presentationImplication: "Surface-drift is a reviewed option when terrestrials are observed, not assumed.",
      },
      {
        season: "fall",
        habitatClass: "Lake drop-offs and stream feeding water as temperatures ease.",
        presentationImplication: "Horizontal retrieve and stop-and-go in lakes; drift families in rivers.",
      },
    ],
    sources: [
      { label: "State/tribal cutthroat status reviews", class: "agency" },
      { label: "Behnke Oncorhynchus clarkii systematics", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "adfluvial vs resident calendars (RPC overlay)"],
  },
  {
    speciesId: "oncorhynchus_nerka_kokanee",
    status: "reviewed",
    overview:
      "Kokanee are pelagic lake fish. The calendar follows temperature, oxygen, and zooplankton depth — not shoreline cover. Fall spawning on shore or tributary gravel is conservation context. This is not anadromous sockeye migration.",
    entries: [
      {
        season: "winter",
        habitatClass: "Suspended open water and basin, often shallower than summer thermocline use.",
        forageEmphasis: "Zooplankton in the remaining pelagic food layer.",
        presentationImplication: "Trolling, horizontal retrieve, suspend-pause, and vertical jig — the reviewed stillwater set.",
      },
      {
        season: "spring",
        habitatClass: "Upper-column suspended water as lakes mix.",
        depthTendency: "Often higher in the column than midsummer.",
        forageEmphasis: "Zooplankton; insects secondary.",
        presentationImplication: "Trolling and horizontal retrieve in the mixing band.",
        invalidators: ["treating kokanee as shoreline trout"],
      },
      {
        season: "summer",
        habitatClass: "Thermocline edge and suspended open water in the 50–59°F preferred band.",
        depthTendency: "Bright periods commonly push usable depth deeper.",
        thermalContext: "65°F warm edge plus oxygen squeeze can pin fish to a thin layer.",
        presentationImplication: "Trolling and suspend-pause on the usable layer; vertical jig when the band is compact.",
        invalidators: ["forcing surface retrieves above a warm, low-oxygen cap"],
      },
      {
        season: "fall",
        habitatClass: "Fish leave pelagic feeding water as they ripen.",
        conservationNote: "Fall spawner on suitable lake shore or tributary gravel. Mature staging and spawning fish are not a forage-matching problem.",
        presentationImplication: "Reviewed families still describe pelagic mechanics for non-ripe fish; spawning fish are an invalidator.",
        invalidators: ["using spawning shore or tributary gravel as a target class"],
      },
      {
        season: "late_fall",
        habitatClass: "Spawning overlap continues. Remaining pelagic fish are not a separate concentration class.",
        conservationNote: "Late-fall spawning remains excluded from target guidance.",
      },
    ],
    sources: [
      { label: "Washington Department of Fish and Wildlife kokanee profile", class: "agency" },
      { label: "Idaho Department of Fish and Game kokanee management", class: "agency" },
      { label: "Scott & Crossman freshwater fishes synthesis for kokanee/sockeye ecology", class: "synthesis" },
    ],
    ...R,
    gaps: [MONTH_GAP, "reservoir vs natural-lake depth calendars"],
  },
  {
    speciesId: "oncorhynchus_nerka_anadromous",
    status: "reviewed",
    overview:
      "Freshwater adult sockeye are a migration and conservation problem, not a feeding-trout calendar. Ocean feeding is behind them. ESA-listed populations and spawning reaches are invalidators. This record is not kokanee.",
    entries: [
      {
        season: "summer",
        habitatClass: "River travel lanes, velocity relief, and lake/river transitions.",
        movementTendency: "Adults return through freshwater toward lake/tributary spawning systems.",
        feedingEmphasis: "Freshwater adults typically do not feed.",
        presentationImplication: "Swing, cross-current retrieve, downstream retrieve, and pulse-jig remain the reviewed flowing families for lawful, non-listed contexts — they do not imply feeding lies.",
        conservationNote: "Spawning reaches, staging concentrations, and ESA-listed populations are invalidators, never target layers.",
        invalidators: ["converting migration into a trout feeding calendar", "using juvenile lake residence as an adult proxy"],
      },
      {
        season: "late_summer",
        habitatClass: "Continuing freshwater travel and holding in non-target migration water.",
        conservationNote: "Listed ESUs stay fail-closed regardless of season.",
      },
      {
        season: "fall",
        habitatClass: "Spawning systems. Not a presentation problem.",
        conservationNote: "Spawning fish are excluded from target guidance.",
        invalidators: ["naming spawning reaches or bottlenecks"],
      },
    ],
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile", class: "agency" },
      { label: "NOAA Fisheries Sockeye Salmon protected-ESU profile", class: "agency" },
    ],
    ...R,
    gaps: ["stock-specific run timing tables", MONTH_GAP],
  },
  {
    speciesId: "micropterus_nigricans",
    status: "reviewed",
    overview:
      "Largemouth calendars follow vegetation, wood, and shade — not a contour number. Spring nests in protected shallows are conservation context. Reservoir shad populations and vegetated natural lakes do not share one map.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper edges of wood, docks, and outside weedlines rather than featureless basin.",
        feedingEmphasis: "Reduced; remaining crayfish and slower fish near cover.",
        thermalContext: "Below the 48°F cold edge, activity compresses.",
        presentationImplication: "Bottom-contact, drop-presentation, and stationary-bait remain the reviewed slow jobs.",
      },
      {
        season: "early_spring",
        habitatClass: "Transition from winter cover toward protected shallows as water climbs through the 50s.",
        movementTendency: "Fish redistribute with warming; this is not a GPS path.",
        presentationImplication: "Subsurface slow-roll and stop-and-go as fish use mid-depth cover edges.",
      },
      {
        season: "spring",
        habitatClass: "Protected shallows, inside weedline, wood, and docks.",
        conservationNote: "Spawns as water holds in the mid-60s; nests in protected shallows. Nests are not a target class.",
        presentationImplication: "Reviewed stillwater families stay cover-oriented. Do not add an unreviewed sight-fishing family.",
        invalidators: ["publishing nest locations", "treating spawning as a bite window"],
      },
      {
        season: "summer",
        habitatClass: "Weed edges, wood, dock shade, and the outside weedline.",
        depthTendency: "Shallow to mid under cover; bright high-sky days push into shade.",
        thermalContext: "Preferred 65–78°F; 88°F warm edge is a shade/oxygen problem.",
        presentationImplication: "Subsurface slow-roll, stop-and-go, surface-retrieve, and drop-presentation — all already reviewed.",
      },
      {
        season: "fall",
        habitatClass: "Points, weed edges, and remaining vegetation as baitfish group.",
        forageEmphasis: "Baitfish can rise in importance where shad exist. Capacity is not a current event.",
        presentationImplication: "Stop-and-go and subsurface slow-roll on edges; flowing water still uses pulse-jig and stationary-bait.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife largemouth bass species account", class: "agency" },
      { label: "Heidinger largemouth life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "vegetation-lake vs reservoir-structure calendars"],
  },
  {
    speciesId: "micropterus_dolomieu",
    status: "reviewed",
    overview:
      "Smallmouth calendars are rock- and current-shaped. River and reservoir overlays exist in RPC and must be declared. Spring rock nests are conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper rock, channel edges, and the slow side of remaining current.",
        feedingEmphasis: "Reduced crayfish and benthic fish.",
        presentationImplication: "Bottom-contact, vertical jig, and drop-presentation in still water; bottom-contact drift in current.",
      },
      {
        season: "spring",
        habitatClass: "Rocky shoreline, points, boulder pockets, and current breaks.",
        conservationNote: "Spawns on rock in current or on windward lake gravel as water holds near 60°F. Nests are not a target class.",
        lightSensitivity: "Feeds in daylight; wind can move fish shallower on the same rock.",
        presentationImplication: "Cross-current retrieve, pulse-jig, and upstream retrieve in flowing water.",
        invalidators: ["using spawning gravel as a target class"],
      },
      {
        season: "summer",
        habitatClass: "Current breaks, seams, points, and drop-offs.",
        depthTendency: "Slides deeper on bright, calm, or post-front days.",
        thermalContext: "Preferred 60–72°F.",
        currentUse: "Holds on the slow side of fast water, not in dead slack only.",
        presentationImplication: "Cross-current retrieve and pulse-jig in rivers; bottom-contact and stop-and-go on lake rock.",
      },
      {
        season: "fall",
        habitatClass: "Points, secondary points, and current seams as baitfish group.",
        forageEmphasis: "Fish can increase relative to crayfish.",
        presentationImplication: "Horizontal retrieve and stop-and-go when bait is the observed forage.",
      },
    ],
    sources: [
      { label: "USGS / provincial smallmouth assessments", class: "agency" },
      { label: "Coble smallmouth biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "river vs reservoir calendars (RPC)"],
  },
  {
    speciesId: "micropterus_punctulatus",
    status: "reviewed",
    overview:
      "Spotted bass stay more offshore and channel-oriented than largemouth through the year. Spring spawning is often slightly deeper. Do not copy a vegetation-largemouth calendar onto this record.",
    entries: [
      {
        season: "winter",
        habitatClass: "Channel edges, drop-offs, and submerged humps.",
        presentationImplication: "Horizontal retrieve, vertical jig, and drop-presentation.",
      },
      {
        season: "spring",
        habitatClass: "Breaklines and rocky shoreline, often slightly deeper than largemouth.",
        conservationNote: "Spring spawner. Nests are not a target class.",
        presentationImplication: "Drop-presentation and stop-and-go along channel-adjacent structure.",
      },
      {
        season: "summer",
        habitatClass: "Drop-offs, points, breaklines, and outside weedline — more pelagic than largemouth.",
        forageEmphasis: "Shad and other small fish along channel edges.",
        presentationImplication: "Horizontal retrieve, vertical jig, and downstream retrieve in current.",
        invalidators: ["forcing dock-shade largemouth positioning as the default"],
      },
      {
        season: "fall",
        habitatClass: "Channel swings and points following bait.",
        presentationImplication: "Horizontal retrieve and stop-and-go.",
      },
    ],
    sources: [
      { label: "State spotted bass notes (KY, TN, AL, OK)", class: "agency" },
      { label: "Baker & Ross spotted bass habitat", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "morone_saxatilis",
    status: "reviewed",
    overview:
      "Striped bass follow bait in the column. Atlantic anadromous and landlocked reservoir calendars are RPC overlays and must be declared. Spring flowing-water spawning is conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools, tailwaters, or remaining pelagic bait water depending on declared population.",
        presentationImplication: "Trolling, horizontal retrieve, and vertical jig in still water; cross-current retrieve in flow.",
      },
      {
        season: "spring",
        habitatClass: "Flowing water, tailraces, and large tributaries for spawning populations.",
        conservationNote: "Flowing-water spawner. Dam tailraces and tributaries are not named pins; spawning concentrations are excluded.",
        presentationImplication: "Swing, cross-current retrieve, and downstream retrieve — reviewed flowing families only.",
        invalidators: ["naming spawning rivers as target pins"],
      },
      {
        season: "summer",
        habitatClass: "Suspended open water and thermocline edge in reservoirs; current breaks in rivers.",
        depthTendency: "Bright summer midday is often deep.",
        thermalContext: "Preferred 55–70°F; 78°F warm edge plus oxygen squeeze can pin the usable layer.",
        presentationImplication: "Trolling and vertical jig on the bait layer; pulse-jig in current.",
      },
      {
        season: "fall",
        habitatClass: "Points, inlets, and suspended bait water.",
        forageEmphasis: "Clupeids where they concentrate. Not a location map.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and trolling.",
      },
    ],
    sources: [
      { label: "ASMFC / state striped bass plans", class: "agency" },
      { label: "Setzler-Hamilton striped bass life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "anadromous vs landlocked calendars (RPC)"],
  },
  {
    speciesId: "morone_chrysops",
    status: "reviewed",
    overview:
      "White bass are schooling pelagic predators with a short spring river or windblown-shore spawning movement. That run is conservation context. Summer is a bait-following problem, not a cover problem.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper open water and drop-offs with remaining shad.",
        presentationImplication: "Horizontal retrieve and vertical jig.",
      },
      {
        season: "spring",
        habitatClass: "Tributary mouths, runs, and tailwaters during the spawning movement.",
        conservationNote: "Upriver or windblown-shore spawning run; short and crowded by nature. Exact aggregation points are never named.",
        presentationImplication: "Cross-current retrieve, pulse-jig, and downstream retrieve in flow.",
        invalidators: ["publishing run locations", "treating the run as a targeting invitation"],
      },
      {
        season: "summer",
        habitatClass: "Points, suspended open water, and drop-offs following shad.",
        lightSensitivity: "Wind and low light can move the feed shallower.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and vertical jig.",
      },
      {
        season: "fall",
        habitatClass: "Open-water bait schools and points.",
        presentationImplication: "Horizontal retrieve and vertical jig.",
      },
    ],
    sources: [
      { label: "State white bass notes (TX, OK, KS, TN)", class: "agency" },
      { label: "Riggs white bass life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "reservoir vs seasonal-river-movement calendars"],
  },
  {
    speciesId: "morone_americana",
    status: "reviewed",
    overview:
      "White perch use deeper basins by day and seasonally move toward rivers or shallows for spawning. They are more omnivorous and more basin-oriented than white bass.",
    entries: [
      {
        season: "winter",
        habitatClass: "Basin and drop-off.",
        presentationImplication: "Vertical jig, drop-presentation, and horizontal retrieve.",
      },
      {
        season: "spring",
        habitatClass: "Tributary mouths, runs, and shallow lake habitat during spawning movement.",
        conservationNote: "Spring spawning moves fish from deeper water toward rivers, tributaries, or shallow lake habitat. Runs are not secret-location outputs.",
        presentationImplication: "Cross-current retrieve, pulse-jig, and bottom-contact drift.",
      },
      {
        season: "summer",
        habitatClass: "Basin, drop-off, and suspended open water.",
        depthTendency: "Often deeper by day.",
        presentationImplication: "Vertical jig and horizontal retrieve.",
      },
      {
        season: "fall",
        habitatClass: "Basin edges and points.",
        presentationImplication: "Stop-and-go and drop-presentation.",
      },
    ],
    sources: [
      { label: "USGS Nonindigenous Aquatic Species white perch profile", class: "agency" },
      { label: "Great Lakes white perch diet and ecology literature", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "morone_hybrid_wiper",
    status: "reviewed",
    overview:
      "Hybrids follow current edges and pelagic bait. Spring tributary movement with white bass is not a reproductive run. Summer depth is an oxygen–temperature squeeze.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools, tailwaters, and suspended bait water.",
        presentationImplication: "Trolling, horizontal retrieve, and vertical jig.",
      },
      {
        season: "spring",
        habitatClass: "Tailwaters, current breaks, and tributary mouths.",
        conservationNote: "Sterile hybrids may travel with white bass but do not establish a normal reproductive run.",
        presentationImplication: "Cross-current retrieve, downstream retrieve, swing, and pulse-jig.",
      },
      {
        season: "summer",
        habitatClass: "Thermocline edge, points, and suspended open water.",
        thermalContext: "Preferred 60–72°F; warm-edge oxygen squeeze is an invalidator for shallow bright water.",
        presentationImplication: "Trolling and horizontal retrieve on the usable layer.",
      },
      {
        season: "fall",
        habitatClass: "Points, inlets, and bait-following open water.",
        presentationImplication: "Stop-and-go and vertical jig.",
      },
    ],
    sources: [
      { label: "Missouri Department of Conservation hybrid striped bass field guide", class: "agency" },
      { label: "Kansas Department of Wildlife & Parks striped bass hybrid management plan", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "morone_mississippiensis",
    status: "reviewed",
    overview:
      "Yellow bass use quieter pools and backwaters more than white bass, while reservoir fish can still school in open water. Do not copy a white-bass river-run calendar onto this record.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper pools and basins.",
        presentationImplication: "Vertical jig and horizontal retrieve.",
      },
      {
        season: "spring",
        habitatClass: "Tributary mouths or shallow lake zones as water warms.",
        conservationNote: "Spring spawner. Exact aggregation points are never named.",
        presentationImplication: "Cross-current retrieve and pulse-jig.",
      },
      {
        season: "summer",
        habitatClass: "Deep pools, eddies, and suspended open water.",
        presentationImplication: "Horizontal retrieve, vertical jig, and stop-and-go.",
      },
      {
        season: "fall",
        habitatClass: "Basin and drop-off.",
        presentationImplication: "Horizontal retrieve and vertical jig.",
      },
    ],
    sources: [
      { label: "Missouri Department of Conservation yellow bass field guide", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "coregonus_artedi",
    status: "reviewed",
    overview:
      "Cisco calendars are oxythermal. Depth follows cold, oxygenated water and zooplankton, including under ice. Late-fall to winter spawning ranges from shallow shoals to deep offshore habitat depending on stock — never published as a target depth.",
    entries: [
      {
        season: "winter",
        habitatClass: "Suspended open water under ice or in the remaining cold band. Spawning may overlap early winter depending on stock.",
        feedingEmphasis: "Zooplankton; cisco can feed heavily under ice.",
        presentationImplication: "Vertical jig, suspend-pause, and horizontal retrieve.",
        conservationNote: "Winter spawning overlap remains excluded from target guidance.",
        invalidators: ["converting under-ice feeding into a named concentration", "naming shoals or offshore spawning depth as a pin"],
      },
      {
        season: "spring",
        habitatClass: "Mixing pelagic water; sometimes higher in the column than summer.",
        forageEmphasis: "Zooplankton; insects possible during emergences.",
        presentationImplication: "Trolling and horizontal retrieve.",
      },
      {
        season: "summer",
        habitatClass: "Thermocline edge and basin in the 50–60°F preferred band.",
        thermalContext: "Oxythermal squeeze is a hard invalidator. Warm, low-oxygen water is not usable cisco habitat.",
        presentationImplication: "Vertical jig, trolling, and suspend-pause on the remaining cold, oxygenated layer.",
        invalidators: ["forcing shallow summer water above the warm edge"],
      },
      {
        season: "late_fall",
        habitatClass: "Spawning habitat class is stock-specific and is not published as a target.",
        conservationNote: "Fall-to-winter spawning. Spawning depth is never given as a target location.",
        invalidators: ["naming shoals or offshore spawning depth as a pin"],
      },
    ],
    sources: [
      { label: "U.S. Fish and Wildlife Service cisco species account", class: "agency" },
      { label: "Michigan Sea Grant cisco (lake herring) notes", class: "agency" },
      { label: "Peer-reviewed cisco oxythermal habitat literature", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "Great Lakes vs inland calendars (RPC)"],
  },
  {
    speciesId: "coregonus_clupeaformis",
    status: "reviewed",
    overview:
      "Lake whitefish are bottom-associated over much of the year, deeper in summer, and spawn in late fall to early winter over clean rock. That spawn is conservation context. This is not a cisco plankton calendar.",
    entries: [
      {
        season: "winter",
        habitatClass: "Basin and drop-off, still bottom-associated.",
        feedingEmphasis: "Benthic invertebrates.",
        presentationImplication: "Bottom-contact, slow-drag, drop-presentation, and live-natural-bait suspension.",
      },
      {
        season: "spring",
        habitatClass: "Rocky shoreline, drop-offs, and remaining shallow benthos as ice leaves.",
        forageEmphasis: "Benthic crustaceans, mollusks, and eggs of other fishes where those events occur.",
        presentationImplication: "Bottom-contact and slow-drag.",
      },
      {
        season: "summer",
        habitatClass: "Deeper basin, drop-off, and thermocline edge.",
        depthTendency: "Often deeper in summer; may suspend when prey distributions warrant it.",
        thermalContext: "Preferred 46–57°F; 68°F warm edge is a constraint.",
        presentationImplication: "Vertical jig and bottom-contact on the cold benthic layer.",
      },
      {
        season: "late_fall",
        habitatClass: "Clean rock, rubble, gravel, or firm shoals as water cools into the 40s.",
        conservationNote: "Late-fall to early-winter spawner. Spawning shoals are excluded from target guidance.",
        invalidators: ["publishing spawning shoal locations"],
      },
    ],
    sources: [
      { label: "USGS lake whitefish thermal ecology research", class: "agency" },
      { label: "Michigan Department of Natural Resources lake whitefish biology", class: "agency" },
      { label: "Minnesota Department of Natural Resources lake whitefish profile", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, "Great Lakes vs inland calendars"],
  },
  {
    speciesId: "hiodon_alosoides",
    status: "reviewed",
    overview:
      "Goldeye calendars are large-river and surface-column calendars. Large eyes make low light and turbidity plausible feeding windows. Spring spawning is conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper pools and current breaks.",
        presentationImplication: "Swing and cross-current retrieve in remaining flow; horizontal retrieve in still water.",
      },
      {
        season: "spring",
        habitatClass: "Runs, pool tails, and eddies as insects increase.",
        conservationNote: "Spawns in spring to early summer in large-river systems. Spawning concentrations are not used as target recommendations.",
        presentationImplication: "Surface-drift, swing, and cross-current retrieve.",
      },
      {
        season: "summer",
        habitatClass: "Upper-column runs and eddies; surface when terrestrials or emergences occur.",
        lightSensitivity: "Low light and turbid water are especially plausible windows.",
        presentationImplication: "Surface-drift and downstream retrieve. Surface-retrieve in still water.",
        invalidators: ["assuming a surface event from eye size alone"],
      },
      {
        season: "fall",
        habitatClass: "Pool tails and current breaks.",
        presentationImplication: "Swing and cross-current retrieve.",
      },
    ],
    sources: [
      { label: "Government of Alberta goldeye species profile", class: "agency" },
      { label: "Canadian and U.S. hiodontid life-history literature", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "hiodon_tergisus",
    status: "reviewed",
    overview:
      "Mooneye stay with clearer runs and pool margins than goldeye. The calendar is insect-drift shaped rather than turbid-surface shaped.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools.",
        presentationImplication: "Dead-drift and swing.",
      },
      {
        season: "spring",
        habitatClass: "Runs, seams, and pool tails.",
        conservationNote: "Spring to early-summer spawner. Timing varies with latitude and flow.",
        presentationImplication: "Dead-drift, surface-drift, and swing.",
      },
      {
        season: "summer",
        habitatClass: "Clearer runs and current breaks.",
        forageEmphasis: "Drift, emergences, and terrestrials.",
        presentationImplication: "Dead-drift and surface-drift. Surface-retrieve in still water.",
      },
      {
        season: "fall",
        habitatClass: "Pool tails and seams.",
        presentationImplication: "Dead-drift and cross-current retrieve.",
      },
    ],
    sources: [
      { label: "Ontario mooneye species profile", class: "agency" },
      { label: "Hiodontidae life-history synthesis", class: "synthesis" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "cyprinus_carpio",
    status: "reviewed",
    overview:
      "Carp feed on shallow flats as water warms and winter deeper in some systems. Spring vegetation spawning is conservation context. This is not a buffalo calendar.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper basins and slow inside bends.",
        presentationImplication: "Stationary-bait, bottom-contact, and slow-drag.",
      },
      {
        season: "spring",
        habitatClass: "Shallow flats, inlets, and weed edges.",
        conservationNote: "Spawns in shallow vegetation when water holds in the 60s. Vegetation spawning is not a target map.",
        presentationImplication: "Bottom-contact drift and stationary-bait.",
      },
      {
        season: "summer",
        habitatClass: "Shallow flats, inside weedline, and inlets.",
        feedingEmphasis: "Daytime benthic omnivory; more cautious in very clear bright water.",
        presentationImplication: "Bottom-contact, slow-drag, and live-natural-bait suspension.",
      },
      {
        season: "fall",
        habitatClass: "Flats remaining warm enough, then a shift toward deeper wintering water in some systems.",
        presentationImplication: "Stationary-bait and slow-drag.",
      },
    ],
    sources: [
      { label: "USGS NAS carp fact sheet", class: "agency" },
      { label: "Balon carp domestication / biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ictiobus_cyprinellus",
    status: "reviewed",
    overview:
      "Bigmouth buffalo filter zooplankton in slow channels, backwaters, and reservoirs. Spring flooded-margin spawning is conservation context. Extreme longevity means the adult calendar is a plankton problem for decades.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper slow pools and basins.",
        presentationImplication: "Stationary-bait and bottom-contact drift — reviewed families only, not a new filter-net method.",
      },
      {
        season: "spring",
        habitatClass: "Slow channels, side channels, and backwaters as water approaches 60–65°F.",
        conservationNote: "Brief spring spawning in flooded margins, marshes, and tributary habitat. Spawning concentrations are not target outputs.",
        presentationImplication: "Stationary-bait and bottom-contact.",
        invalidators: ["using flooded spawning margins as a target class"],
      },
      {
        season: "summer",
        habitatClass: "Slow river channels, backwaters, and reservoir flats/basins.",
        feedingEmphasis: "Pelagic and mid-depth zooplankton filtering.",
        presentationImplication: "Suspended-stationary and slow-drag in still water.",
      },
      {
        season: "fall",
        habitatClass: "Channels and basins with remaining plankton.",
        presentationImplication: "Bottom-contact and slow-drag.",
      },
    ],
    sources: [
      { label: "USGS Bigmouth Buffalo species profile", class: "agency" },
      { label: "Lackmann et al. validated centenarian longevity research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ictiobus_bubalus",
    status: "reviewed",
    overview:
      "Smallmouth buffalo stay on channel bottoms and pool edges. The calendar is benthic, not a carp-flat calendar and not a plankton-buffalo calendar.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools and channel edges.",
        presentationImplication: "Bottom-contact drift and stationary-bait.",
      },
      {
        season: "spring",
        habitatClass: "Runs, pool tails, and channel edges as water reaches roughly 60–65°F.",
        conservationNote: "Broadcast spawning over vegetation, mud, and flooded margins is conservation context.",
        presentationImplication: "Bottom-contact and slow-drag.",
      },
      {
        season: "summer",
        habitatClass: "Deep pools, current breaks, and reservoir drop-offs.",
        feedingEmphasis: "Channel-bottom invertebrates and mollusks.",
        presentationImplication: "Bottom-contact, slow-drag, and live-natural-bait suspension.",
      },
      {
        season: "fall",
        habitatClass: "Channel edges and basins.",
        presentationImplication: "Bottom-contact and slow-drag.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife smallmouth buffalo species account", class: "agency" },
      { label: "USGS smallmouth buffalo population-demographic research", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepisosteus_osseus",
    status: "reviewed",
    overview:
      "Longnose gar patrol slow or open water and use deep water as a refuge. Near-surface cruising can be respiratory. Spring backwater spawning is conservation context. Eggs are toxic.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools and current margins.",
        presentationImplication: "Stationary-bait and cross-current retrieve.",
      },
      {
        season: "spring",
        habitatClass: "Quiet backwaters and vegetated margins as water warms.",
        conservationNote: "Spring spawning in shallow quiet water. Gar eggs are toxic and should never be treated as forage or food.",
        presentationImplication: "Stationary-bait and downstream retrieve.",
        invalidators: ["using spawning backwaters as a target class"],
      },
      {
        season: "summer",
        habitatClass: "Runs, open flats, and suspended-open patrol water.",
        lightSensitivity: "Visual predator; warm calm periods often produce visible near-surface cruising without implying a feeding event.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and surface-retrieve — surface does not prove feeding.",
      },
      {
        season: "fall",
        habitatClass: "Points, drop-offs, and remaining patrol water.",
        presentationImplication: "Cross-current retrieve and live-natural-bait suspension.",
      },
    ],
    sources: [
      { label: "NOAA Mississippi River longnose gar life-history synthesis", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepisosteus_oculatus",
    status: "reviewed",
    overview:
      "Spotted gar stay with vegetation, timber, and backwaters. The calendar is littoral, not a main-channel longnose calendar.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper edges of wood and remaining vegetation.",
        presentationImplication: "Stationary-bait and pulse-jig.",
      },
      {
        season: "spring",
        habitatClass: "Shallow vegetated margins, flooded timber, or backwater habitat.",
        conservationNote: "Spring spawning. Spawning sites are excluded from target guidance. Eggs are toxic.",
        presentationImplication: "Stationary-bait and cross-current retrieve in slow water.",
      },
      {
        season: "summer",
        habitatClass: "Inside weedline, weed edge, and wood.",
        feedingEmphasis: "Ambush on small fish in vegetation lanes.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and surface-retrieve.",
      },
      {
        season: "fall",
        habitatClass: "Remaining weed edges and wood as vegetation thins.",
        presentationImplication: "Live-natural-bait suspension and stop-and-go.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife Department spotted gar account", class: "agency" },
      { label: "Missouri Department of Conservation spotted gar account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepisosteus_platostomus",
    status: "reviewed",
    overview:
      "Shortnose gar use large-river backwaters and slower margins. Spawning is later than spotted gar. Turbidity is less limiting than for longnose gar.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools.",
        presentationImplication: "Stationary-bait and cross-current retrieve.",
      },
      {
        season: "early_summer",
        habitatClass: "Quiet shallow water, side channels, and vegetated objects.",
        conservationNote: "Late-spring through summer spawning. Adhesive eggs over vegetation are conservation context. Eggs are toxic.",
        presentationImplication: "Stationary-bait and downstream retrieve.",
      },
      {
        season: "summer",
        habitatClass: "Side channels, eddies, and backwater flats.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and live-natural-bait suspension.",
      },
      {
        season: "fall",
        habitatClass: "Deep pools and tributary mouths as water cools.",
        presentationImplication: "Cross-current retrieve.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife shortnose gar species account", class: "agency" },
      { label: "Missouri Department of Conservation shortnose gar field guide", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "atractosteus_spatula",
    status: "reviewed",
    overview:
      "Alligator gar use deep main-channel pools and shift into shallow connected habitat under favorable seasonal flooding. Flooded spawning habitat is an invalidator. Surface air-gulping is respiratory.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep main-channel pools.",
        presentationImplication: "Stationary-bait and live-natural-bait suspension.",
      },
      {
        season: "spring",
        habitatClass: "Connected side channels and backwaters as water warms.",
        conservationNote: "Successful spawning is linked to warm seasonal flooding and vegetated inundated habitat. Flooded spawning habitat is an invalidator, not a target map.",
        presentationImplication: "Stationary-bait and pulse-jig in lawful, non-closed water.",
        invalidators: ["using inundated spawning habitat as a target class"],
      },
      {
        season: "summer",
        habitatClass: "Deep pools, eddies, and open connected water.",
        lightSensitivity: "Surface air-gulping is respiratory behavior and must not be interpreted as surface feeding.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and subsurface slow-roll.",
      },
      {
        season: "fall",
        habitatClass: "Deep pools and drop-offs as water cools.",
        presentationImplication: "Stationary-bait and live-natural-bait suspension.",
      },
    ],
    sources: [
      { label: "U.S. Fish and Wildlife Service Alligator Gar species profile", class: "agency" },
      { label: "State and USFWS alligator gar life-history and floodplain recruitment literature", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, "managed-population calendars"],
  },
  {
    speciesId: "ameiurus_nebulosus",
    status: "reviewed",
    overview:
      "Brown bullhead are nocturnal and bottom-oriented. They move shallower under darkness or stain and winter deeper. Nest guarding is conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper basins and wood.",
        presentationImplication: "Bottom-contact, slow-drag, and live-natural-bait suspension.",
      },
      {
        season: "spring",
        habitatClass: "Protected shallow cavities, wood, and weed edges as water warms.",
        conservationNote: "Spawning in protected shallow cavities or depressions. Parental guarding is not a target cue.",
        presentationImplication: "Stationary-bait and bottom-contact drift.",
      },
      {
        season: "summer",
        habitatClass: "Basin, wood, weed edge, and dock shade by day; shallower at night.",
        lightSensitivity: "Strong low-light and night feeding tendency.",
        presentationImplication: "Bottom-contact and slow-drag. Pulse-jig in flowing water.",
      },
      {
        season: "fall",
        habitatClass: "Inlets and remaining cover before wintering deeper.",
        presentationImplication: "Stationary-bait and live-natural-bait suspension.",
      },
    ],
    sources: [
      { label: "USGS Nonindigenous Aquatic Species brown bullhead profile", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ameiurus_melas",
    status: "reviewed",
    overview:
      "Black bullhead tolerate turbid, soft-bottomed, low-current water that excludes many sight-oriented fishes. The calendar is still nocturnal and benthic.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper basins and cover.",
        presentationImplication: "Bottom-contact and slow-drag.",
      },
      {
        season: "spring",
        habitatClass: "Protected shallow habitat in slow, often turbid water.",
        conservationNote: "Late-spring and summer cavity/depression spawning. Family groups are not target aggregations.",
        presentationImplication: "Stationary-bait and bottom-contact drift.",
      },
      {
        season: "summer",
        habitatClass: "Shallow flats at night; deeper or tighter to cover in bright conditions.",
        lightSensitivity: "Low-light and nocturnal feeding is common; olfaction reduces dependence on visibility.",
        presentationImplication: "Bottom-contact, slow-drag, and live-natural-bait suspension.",
      },
      {
        season: "fall",
        habitatClass: "Inlets and remaining soft-bottom cover.",
        presentationImplication: "Stationary-bait.",
      },
    ],
    sources: [
      { label: "Washington Department of Fish and Wildlife black bullhead sportfish account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ameiurus_natalis",
    status: "reviewed",
    overview:
      "Yellow bullhead use slower, often more vegetated or woody margins than black bullhead. Canonical spawning seasons are spring and early_summer. Both parents guard eggs and fry.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper pools and wood.",
        presentationImplication: "Bottom-contact and slow-drag.",
      },
      {
        season: "spring",
        habitatClass: "Mud or protected shallow habitat, side channels, and weed edges.",
        conservationNote: "Cavity/nest spawner. Both parents guard eggs and fry.",
        presentationImplication: "Stationary-bait and bottom-contact drift.",
      },
      {
        season: "early_summer",
        habitatClass: "Protected shallow habitat while guarding continues.",
        conservationNote: "Early-summer overlap with parental care. Guarding is not a targeting cue.",
        presentationImplication: "Stationary-bait.",
      },
      {
        season: "summer",
        habitatClass: "Wood, weed edge, and shallow flats at night.",
        lightSensitivity: "Low-light and nocturnal feeding are common; turbid water can extend activity into daylight.",
        presentationImplication: "Bottom-contact, slow-drag, and live-natural-bait suspension.",
      },
      {
        season: "fall",
        habitatClass: "Inlets and remaining woody margins.",
        presentationImplication: "Stationary-bait.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife yellow bullhead species account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "salmo_trutta",
    status: "reviewed",
    overview:
      "Browns track cover, low light, and food delivery more than a rainbow-style riffle default. Fall spawning is conservation context. Large piscivores do not share the insect calendar of smaller fish.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools, current breaks, wood, and lake basins in the remaining active band.",
        depthTendency: "Deeper in daylight; shallower in low light.",
        feedingEmphasis: "Slow subsurface intercept.",
        thermalContext: "Near or below the 40°F cold edge, activity compresses.",
        presentationImplication: "Dead-drift and bottom-contact drift in flowing water; suspend-pause or stop-and-go in still water.",
        invalidators: ["treating winter as a surface-terrestrial problem"],
      },
      {
        season: "spring",
        habitatClass: "Seams, pool heads, runs, and wood as water warms.",
        forageEmphasis: "Aquatic insects and emergences where they occur.",
        presentationImplication: "Dead-drift, surface-drift, and swing remain reviewed flowing families.",
        invalidators: ["inventing a hatch from diet capacity"],
      },
      {
        season: "summer",
        habitatClass: "Undercut banks, wood, deep pools, shade, and lake weed edges or drop-offs.",
        depthTendency: "Deeper than rainbow in daylight.",
        thermalContext: "Preferred 50–60°F. The 70°F warm edge is a cover and oxygen constraint.",
        lightSensitivity: "Strong low-light and night feeding in clear or pressured water.",
        coverUse: "Undercuts, wood, and depth.",
        presentationImplication: "Bottom-contact drift and cross-current retrieve in flow; surface-retrieve only when terrestrials are observed, not assumed.",
        invalidators: ["forcing bright shallow water above the warm edge"],
      },
      {
        season: "fall",
        habitatClass: "Feeding water as temperatures ease, then gravel as days shorten.",
        conservationNote: "Fall spawner. Spawning gravel is excluded from target guidance.",
        presentationImplication: "Dead-drift, swing, and cross-current retrieve. Do not convert spawn color into a new family.",
        invalidators: ["using spawning substrate as holding water", "assuming an egg event from calendar alone"],
      },
      {
        season: "late_fall",
        habitatClass: "Spawning overlap continues, then wintering pools.",
        conservationNote: "Late-fall spawning overlap remains caution.",
        presentationImplication: "Bottom-contact drift and dead-drift in remaining feeding water.",
      },
    ],
    sources: [
      { label: "USGS / state brown trout habitat notes", class: "agency" },
      { label: "Elliott thermal biology of brown trout", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "salvelinus_fontinalis",
    status: "reviewed",
    overview:
      "Brook trout calendars are small-water and cold-water calendars. Fall spawning is conservation context. Summer heat in lowland water is often lethal — presence does not imply a workable day.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pockets, groundwater-influenced water, and pond basins.",
        feedingEmphasis: "Slow subsurface invertebrates.",
        presentationImplication: "Dead-drift and tight-line drift.",
      },
      {
        season: "spring",
        habitatClass: "Undercuts, seams, side channels, and pond inlets as water warms off the cold edge.",
        forageEmphasis: "Aquatic insects as capacity, not a declared hatch.",
        presentationImplication: "Dead-drift, tight-line drift, and surface-drift.",
      },
      {
        season: "summer",
        habitatClass: "Shade, broken water, groundwater pockets, and high-elevation inlets.",
        thermalContext: "Preferred 46–56°F. Warm edge near 68°F. Warm lowland water is an invalidator.",
        coverUse: "Undercuts, wood, and shade.",
        presentationImplication: "Surface-drift and dead-drift in remaining cold water; stillwater: horizontal retrieve or surface-retrieve when terrestrials are observed.",
        invalidators: ["treating lowland summer presence as a workable thermal day"],
      },
      {
        season: "fall",
        habitatClass: "Pockets and groundwater-influenced gravel.",
        conservationNote: "Fall spawner over groundwater-influenced gravel. Redds are excluded from target guidance.",
        presentationImplication: "Dead-drift, tight-line drift, and downstream retrieve.",
        invalidators: ["using spawning gravel as holding water"],
      },
    ],
    sources: [
      { label: "U.S. Fish and Wildlife Service brook trout species profile", class: "agency" },
      { label: "Raleigh habitat suitability (brook trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "eastern native vs western introduced seasonal offsets"],
  },
  {
    speciesId: "salvelinus_namaycush",
    status: "reviewed",
    overview:
      "Lake trout follow the cold layer. Summer is an oxythermal squeeze. Fall spawning on rocky reefs is conservation context. Great Lakes pelagic vs inland natural-lake calendars are RPC overlays and must be declared.",
    entries: [
      {
        season: "winter",
        habitatClass: "Shallower relative to summer: basins, humps, and rocky shoreline in ice-influenced lakes.",
        feedingEmphasis: "Fish and remaining invertebrates in the cold column.",
        presentationImplication: "Vertical jig, suspend-pause, and horizontal retrieve.",
      },
      {
        season: "spring",
        habitatClass: "Rocky shoreline, points, drop-offs, and remaining shallow structure before stratification.",
        depthTendency: "Shallower than the summer default.",
        presentationImplication: "Horizontal retrieve, trolling, and vertical jig.",
        invalidators: ["treating spring shallows as a stream-trout riffle problem"],
      },
      {
        season: "summer",
        habitatClass: "Thermocline edge, basin, submerged humps, and suspended open water.",
        depthTendency: "Deep and pelagic. Bright midday summer often pushes fish down.",
        thermalContext: "Preferred 42–52°F. Warm edge near 60°F. Surface presence is usually a cold-water exception.",
        presentationImplication: "Trolling, vertical jig, and suspend-pause on the usable layer.",
        invalidators: ["forcing a summer surface default", "ignoring the temperature-oxygen squeeze"],
      },
      {
        season: "fall",
        habitatClass: "Fish leave summer depth toward rocky structure as water cools.",
        conservationNote: "Fall spawner on rocky reefs. Spawning substrate is excluded from target guidance. Do not name reefs.",
        presentationImplication: "Horizontal retrieve and trolling off the spawning substrate, not on it.",
        invalidators: ["using spawning substrate as a target class"],
      },
    ],
    sources: [
      { label: "Michigan DNR lake trout species account", class: "agency" },
      { label: "Great Lakes / provincial lake trout assessments", class: "agency" },
      { label: "Martin & Olver lake trout biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "Great Lakes pelagic vs inland lake calendars (RPC)"],
  },
  {
    speciesId: "oncorhynchus_mykiss_steelhead",
    status: "reviewed",
    overview:
      "Steelhead calendars are migratory and flowing-water only. Winter-run and summer-run stocks must not be collapsed. Many winter fish are not feeding in the trout sense. Listed Pacific DPSs are regulatory invalidators.",
    entries: [
      {
        season: "winter",
        habitatClass: "Runs, seams, tailwater, deep pools, and boulder pockets adjacent to strong current.",
        depthTendency: "Often near bottom.",
        feedingEmphasis: "Do not convert presence into a hatch match. Many winter fish are not feeding in the trout sense.",
        thermalContext: "Preferred 42–55°F; cold edge near 36°F.",
        conservationNote: "Winter-run spawning overlap is caution. Spawning gravel is excluded from target guidance.",
        presentationImplication: "Swing, bottom-contact drift, dead-drift, and downstream retrieve — the reviewed flowing families only.",
        invalidators: ["treating winter steelhead as inland rainbow nymphing by default", "using spawning gravel as holding water"],
      },
      {
        season: "early_spring",
        habitatClass: "Travel lanes and holding lies as some winter-run fish continue and others spawn.",
        conservationNote: "Early-spring overlap with spawning. Winter and summer-run stocks still must not be collapsed.",
        presentationImplication: "Swing and bottom-contact drift.",
      },
      {
        season: "spring",
        habitatClass: "Holding water adjacent to current as temperatures rise within band.",
        conservationNote: "Spring spawning overlap remains caution for stocks that spawn now.",
        presentationImplication: "Swing, dead-drift, and downstream retrieve.",
      },
      {
        season: "summer",
        habitatClass: "Summer-run stocks may be in river systems; heat and low flow are constraints.",
        thermalContext: "Warm edge near 65°F. Low flow and heat are invalidators, not a shallow feeding cue.",
        currentUse: "Holding lies adjacent to strong remaining current, not the fastest core.",
        presentationImplication: "Swing and downstream retrieve in remaining travel water.",
        invalidators: ["collapsing summer-run into the winter-run calendar", "forcing stillwater families — this record has none"],
      },
      {
        season: "fall",
        habitatClass: "Holding and travel water as some summer-run fish continue and winter-run fish have not yet arrived as a single story.",
        forageEmphasis: "Eggs and insects remain capacity only.",
        presentationImplication: "Swing and bottom-contact drift.",
        invalidators: ["assuming an egg event from calendar alone"],
      },
    ],
    sources: [
      { label: "NOAA Fisheries steelhead species profile", class: "agency" },
      { label: "Withler / Quinn anadromous Oncorhynchus reviews", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "stock-specific winter vs summer run calendars"],
  },
  {
    speciesId: "sander_vitreus",
    status: "reviewed",
    overview:
      "Walleye follow the light-food compromise more than a single depth rule. Early-spring spawning on rock and current is conservation context. Northern natural-lake vs large-river calendars are RPC overlays and must be declared.",
    entries: [
      {
        season: "winter",
        habitatClass: "Basins, drop-offs, breaklines, and deep river pools in the remaining active band.",
        depthTendency: "Deeper in daylight; shallower in low light.",
        feedingEmphasis: "Slow, lower-column intercept of forage fish.",
        thermalContext: "Near or below the 42°F cold edge, activity compresses.",
        presentationImplication: "Vertical jig, slow drag, and bottom contact in still water; bottom-contact drift and pulse / jig in current.",
        invalidators: ["treating winter as a surface-weed problem"],
      },
      {
        season: "early_spring",
        habitatClass: "Current-washed rock, points, and river runs as water leaves freezing.",
        movementTendency: "Fish redistribute with temperature and flow. Rock and gravel are not a target class.",
        thermalContext: "Leaving the cold edge toward the 48–72°F active band. Minnesota DNR: spawning peaks near 42–50°F.",
        conservationNote: "Early-spring spawning overlap is caution. Spawning substrate is excluded from target guidance. Do not name reefs.",
        presentationImplication: "Bottom-contact drift, pulse / jig, and cross-current retrieve in flow; slow drag and bottom contact in still water.",
        invalidators: ["using spawning substrate as holding water"],
      },
      {
        season: "spring",
        habitatClass: "Points, drop-offs, rocky shoreline, inlets, current breaks, and tailwater.",
        forageEmphasis: "Forage fish where they occur. Do not infer a perch event from the calendar.",
        presentationImplication: "Trolling, slow drag, and vertical jig in still water; bottom-contact drift and downstream retrieve in flow.",
      },
      {
        season: "summer",
        habitatClass: "Breaklines, thermocline edges, basins, and current-washed structure.",
        depthTendency: "Deeper in bright clear water; shallower in stain, wind, and low light.",
        thermalContext: "Preferred 55–68°F. Warm edge near 76°F. Southern reservoirs depend on a cool hypolimnion.",
        lightSensitivity: "Strong low-light and night feeding. Bright midday in clear water is often a poor feeding window, not a location problem.",
        presentationImplication: "Vertical jig, trolling, and slow drag on the usable layer; live / natural bait suspension where the band is known. Flowing water: pulse / jig and bottom-contact drift.",
        invalidators: ["forcing a bright shallow default in clear water", "collapsing lake-resident and large-river calendars"],
      },
      {
        season: "fall",
        habitatClass: "Points, rocky shoreline, inlets, and current breaks as water cools.",
        forageEmphasis: "Forage fish continue. Fall is not an egg-forage prescription.",
        presentationImplication: "Trolling, slow drag, and cross-current retrieve. Do not convert cooling water into an unreviewed family.",
      },
    ],
    sources: [
      { label: "Minnesota DNR walleye biology", class: "agency" },
      { label: "Great Lakes / state walleye assessments", class: "agency" },
      { label: "Colby et al. walleye biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "northern natural-lake vs large-river calendars (RPC)"],
  },
  {
    speciesId: "sander_canadensis",
    status: "reviewed",
    overview:
      "Sauger calendars are large-river and bottom-current calendars. Early-spring spawning in current is conservation context. Do not import lake-walleye basin logic or name tailwaters as pins.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools, runs, and current breaks in remaining cold flow.",
        depthTendency: "Lower column and bottom.",
        feedingEmphasis: "Small forage fish and remaining benthic invertebrates.",
        presentationImplication: "Bottom-contact drift and pulse / jig. Still water, where it occurs: vertical jig, slow drag, and bottom contact.",
      },
      {
        season: "early_spring",
        habitatClass: "Deep runs, pool heads, and current-washed rock as flow and temperature rise.",
        conservationNote: "Early-spring spawning overlap is caution. Adhesive eggs on rubble are biology. Dam and spawning-run concentrations are excluded from target guidance.",
        presentationImplication: "Bottom-contact drift, pulse / jig, and cross-current retrieve.",
        invalidators: ["using spawning rubble as holding water", "naming tailwaters as aggregation targets"],
      },
      {
        season: "summer",
        habitatClass: "Deep pools, runs, tailwater, and current breaks.",
        depthTendency: "Strong bottom association, especially in clearer daylight.",
        thermalContext: "Preferred 55–68°F. Turbidity can extend daylight feeding in current.",
        currentUse: "Missouri DNR: mainly flowing water and often swift current.",
        presentationImplication: "Bottom-contact drift and pulse / jig. Still water: vertical jig and bottom contact.",
        invalidators: ["importing a lake-walleye weed-edge or basin default"],
      },
      {
        season: "fall",
        habitatClass: "Runs, current breaks, and pool heads as water cools.",
        presentationImplication: "Bottom-contact drift, pulse / jig, and downstream retrieve.",
      },
    ],
    sources: [
      { label: "Missouri Department of Conservation sauger field guide", class: "agency" },
      { label: "Minnesota DNR walleye/sauger biology", class: "agency" },
      { label: "USGS sauger habitat and movement research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "esox_lucius",
    status: "reviewed",
    overview:
      "Northern pike track vegetation, wood, and the slow side of a food lane. Ice-out spawning is conservation context and happens before muskellunge. Summer is a deeper weed-edge and thermal problem, not a shallow default.",
    entries: [
      {
        season: "winter",
        habitatClass: "Remaining weed edges, wood, and deeper slow water in the active band.",
        feedingEmphasis: "Slow ambush of forage fish.",
        thermalContext: "Near the 36°F cold edge, activity compresses.",
        presentationImplication: "Stop-and-go, subsurface slow-roll, and horizontal retrieve. Flowing water: cross-current retrieve and stationary bait.",
      },
      {
        season: "early_spring",
        habitatClass: "Weedy shallows, inlets, side channels, and eddies as ice leaves.",
        movementTendency: "Fish redistribute into shallow vegetation. That vegetation is not a target class.",
        conservationNote: "Michigan DNR: spawn in the shallows right after ice-out, before muskellunge. Vegetated ice-out water is excluded from target guidance.",
        presentationImplication: "Stop-and-go, horizontal retrieve, and cross-current retrieve.",
        invalidators: ["using ice-out vegetation as a named pin"],
      },
      {
        season: "summer",
        habitatClass: "Outside weedlines, weed edges, points, and wood.",
        depthTendency: "Deeper than the cool-water shallow default. Michigan DNR: retreat somewhat deeper in midsummer.",
        thermalContext: "Preferred 50–65°F. Warm edge near 75°F. Warm weedy southern water may be thermal stress, not feeding.",
        coverUse: "Deeper weed edges and cooler ambush structure.",
        presentationImplication: "Subsurface slow-roll, stop-and-go, and horizontal retrieve. Surface retrieve is not the summer default.",
        invalidators: ["forcing a bright shallow summer default", "treating thermally stressed southern pike as feeding fish"],
      },
      {
        season: "fall",
        habitatClass: "Weed edges, inside weedlines, inlets, and side channels as water cools.",
        forageEmphasis: "Forage fish as water re-enters the preferred band.",
        presentationImplication: "Stop-and-go, horizontal retrieve, subsurface slow-roll, and cross-current retrieve. Surface retrieve only as a reviewed stillwater family, not a new one.",
      },
    ],
    sources: [
      { label: "Michigan DNR northern pike species account", class: "agency" },
      { label: "Casselman pike thermal ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "esox_masquinongy",
    status: "reviewed",
    overview:
      "Muskellunge use large structural and vegetation edges as travel and ambush corridors. They spawn after pike. Aggregation and spawning-site recommendations are excluded.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper edges, wood, and remaining structural funnels.",
        feedingEmphasis: "Slow travel and ambush of forage fish.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and subsurface slow-roll. Flowing water: swing and cross-current retrieve.",
      },
      {
        season: "spring",
        habitatClass: "Weed edges, points, inlets, and current breaks as water leaves ice-out.",
        conservationNote: "Michigan DNR: spawn in early spring after ice-out, after northern pike. Vegetated shallows are excluded from target guidance. Do not name aggregation sites.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and upstream retrieve.",
        invalidators: ["using spawning shallows as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Outside weedlines, points, drop-offs, wood, and inlets.",
        depthTendency: "Weed-associated mid-depth; follows forage more than a single contour.",
        thermalContext: "Preferred 55–70°F. Warm edge near 80°F. Bright high-sky days often pin fish to cover.",
        lightSensitivity: "Low light and weather changes matter more than a noon-flat default.",
        presentationImplication: "Horizontal retrieve, stop-and-go, and subsurface slow-roll. Surface retrieve is not the bright-summer default.",
        invalidators: ["forcing open-basin pelagic families this record does not have"],
      },
      {
        season: "fall",
        habitatClass: "Weed edges, points, and drop-offs as water cools.",
        forageEmphasis: "Larger prey fish continue. Fall is not a spawn map.",
        presentationImplication: "Horizontal retrieve, stop-and-go, subsurface slow-roll, and cross-current retrieve.",
      },
    ],
    sources: [
      { label: "Michigan DNR muskellunge species account", class: "agency" },
      { label: "Crossman muskellunge biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "esox_niger",
    status: "reviewed",
    overview:
      "Chain pickerel calendars are vegetated, slack-water calendars. They are not open-pelagic pike. Early-spring flooded margins are conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Remaining weed edges, wood, and slack pockets in ice-free eastern water.",
        feedingEmphasis: "Ambush of small forage fish along cover.",
        presentationImplication: "Stop-and-go, subsurface slow-roll, and horizontal retrieve. Flowing water: stationary bait and cross-current retrieve.",
      },
      {
        season: "early_spring",
        habitatClass: "Weed edges, inside weedlines, and shallow flats adjacent to cover as water warms.",
        conservationNote: "Early-spring spawning in flooded vegetation. Flooded margins are never named as aggregation targets.",
        presentationImplication: "Stop-and-go, horizontal retrieve, and upstream retrieve.",
        invalidators: ["using flooded spawning margins as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Inside and outside weedlines, wood, and shaded slack.",
        depthTendency: "Shallow to mid-depth around weeds; deeper edges in bright or warm periods.",
        thermalContext: "Preferred 60–70°F. Warm edge near 82°F. More at home in warm vegetated water than northern pike.",
        coverUse: "Vegetation and wood. Open pelagic water is a mismatch.",
        presentationImplication: "Stop-and-go, subsurface slow-roll, and horizontal retrieve. Surface retrieve along weed edges is a reviewed stillwater family, not a new one.",
        invalidators: ["importing open-pelagic pike logic"],
      },
      {
        season: "fall",
        habitatClass: "Weed edges, wood, and slack side channels.",
        presentationImplication: "Stop-and-go, horizontal retrieve, and cross-current retrieve.",
      },
    ],
    sources: [
      { label: "South Carolina DNR chain pickerel account", class: "agency" },
      { label: "North Carolina Wildlife chain pickerel species account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, "eastern coastal-plain vs interior seasonal offsets"],
  },
  {
    speciesId: "perca_flavescens",
    status: "reviewed",
    overview:
      "Yellow perch follow schools, forage, and a modest depth band — rarely the deep-basin lake-trout story. Spring egg strings over vegetation are conservation context. Winter ice activity is capacity, not a catch claim.",
    entries: [
      {
        season: "winter",
        habitatClass: "Basins, drop-offs, and submerged humps; also shallower ice-cover water. Michigan DNR: active under ice in both shallow and deeper water.",
        feedingEmphasis: "Insects, crustaceans, and small fish in the cold column.",
        presentationImplication: "Vertical jig, slow drag, and live / natural bait suspension.",
        invalidators: ["converting winter activity into a catch claim"],
      },
      {
        season: "early_spring",
        habitatClass: "Weed edges, inlets, riprap, and shallow wood as water leaves ice-out.",
        conservationNote: "Michigan DNR: spawn in spring, laying gelatinous egg strings over vegetation, roots, and fallen trees. That habitat is excluded from target guidance.",
        presentationImplication: "Slow drag, drop presentation, and pulse / jig.",
        invalidators: ["converting egg strings into a fishing cue"],
      },
      {
        season: "summer",
        habitatClass: "Weed edges, drop-offs, and points. Michigan DNR: rarely taken from water more than about 30 feet; summer is deeper than spring/fall, not a deep-basin default.",
        depthTendency: "Mid-depth along a break. Follows the cooler band — Michigan DNR notes a preference near 66–70°F.",
        thermalContext: "Preferred 54–68°F. Warm edge near 76°F.",
        presentationImplication: "Vertical jig, slow drag, and drop presentation. Flowing water: bottom-contact drift and pulse / jig.",
        invalidators: ["forcing a lake-trout summer depth story"],
      },
      {
        season: "fall",
        habitatClass: "Shallower than summer heat: weed edges, points, riprap, and inlets.",
        forageEmphasis: "Insects and small forage fish. A school is a moving aggregation, not a named pin.",
        presentationImplication: "Vertical jig, slow drag, drop presentation, and live / natural bait suspension.",
      },
    ],
    sources: [
      { label: "Michigan DNR yellow perch species account", class: "agency" },
      { label: "Great Lakes perch assessments", class: "agency" },
      { label: "Thorpe yellow perch biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "pomoxis_spp",
    status: "reviewed",
    overview:
      "Crappie follow schools, cover, and bait more than a sunfish nest calendar. This record is the black/white complex. Spring colonial nests in wood are conservation context. A school is a moving aggregation, not a named pin.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper timber, basins, and drop-offs in the remaining active band.",
        depthTendency: "Often deeper than the summer cover default.",
        feedingEmphasis: "Slow intercept of remaining plankton and small fish.",
        thermalContext: "Near the 44°F cold edge, activity compresses.",
        presentationImplication: "Vertical jig, suspend / pause, and slow drag. Live / natural bait suspension where the band is known.",
        invalidators: ["treating winter as a shallow-weed bluegill problem"],
      },
      {
        season: "spring",
        habitatClass: "Wood, dock shade, weed edges, and inlets as water holds in the upper 50s to mid-60s.",
        conservationNote: "Minnesota DNR: spawn in May and June in the mid-60s; males guard nests in colonies. Colonial wood is excluded from target guidance.",
        presentationImplication: "Drop presentation, suspend / pause, and pulse / jig. Stationary bait in slack.",
        invalidators: ["using nesting wood as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Wood, dock shade, weed edges, and suspended open water around bait.",
        depthTendency: "Bright clear days push fish tighter to cover or deeper.",
        lightSensitivity: "Night, dawn, and dusk feeding windows are optically more plausible. That does not imply a catch.",
        presentationImplication: "Suspend / pause, drop presentation, and live / natural bait suspension. Vertical jig when fish are marked in the column.",
        invalidators: ["forcing a bright open-flat default", "collapsing black and white habitat splits into one depth rule"],
      },
      {
        season: "fall",
        habitatClass: "Wood, drop-offs, and basins as schools follow bait.",
        forageEmphasis: "Small forage fish. Do not infer a bait event from the calendar.",
        presentationImplication: "Vertical jig, slow drag, and suspend / pause.",
      },
    ],
    sources: [
      { label: "Minnesota DNR crappie biology", class: "agency" },
      { label: "State crappie management summaries", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, "black vs white calendars inside the complex"],
  },
  {
    speciesId: "lepomis_macrochirus",
    status: "reviewed",
    overview:
      "Bluegill calendars are vegetated-slack calendars. Colonial summer nests are conservation context and are never a targeting recommendation. They are not crappie and they are not redear.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper weed edges, wood, and dock shade on bright cold days.",
        feedingEmphasis: "Slow subsurface insects.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension. Flowing slack: dead drift and stationary bait.",
      },
      {
        season: "early_summer",
        habitatClass: "Weed edges, inside weedlines, and shallow flats as water holds near 65°F.",
        conservationNote: "Michigan DNR: spawns in the shallows when water reaches about 65°F. Catalog exception: bed targeting of spawning colonies is never a recommendation.",
        presentationImplication: "Drop presentation and slow drag off the colony, not on it.",
        invalidators: ["using nesting colonies as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Weed edges, inside weedlines, dock shade, and wood.",
        thermalContext: "Preferred 68–80°F. Warm edge near 90°F.",
        lightSensitivity: "Daytime sight feeder; shade in high sun.",
        presentationImplication: "Drop presentation and slow drag. Surface retrieve only when terrestrials are observed, not assumed. Flowing slack: dead drift.",
        invalidators: ["forcing a crappie suspend default this record does not have"],
      },
      {
        season: "fall",
        habitatClass: "Weed edges and remaining docks as water cools.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension.",
      },
    ],
    sources: [
      { label: "Michigan DNR bluegill species account", class: "agency" },
      { label: "Werner / Mittelbach sunfish foraging ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepomis_gibbosus",
    status: "reviewed",
    overview:
      "Pumpkinseed calendars are vegetated-margin calendars with a stronger benthic/mollusk lean than bluegill. Nesting colonies are conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Remaining weed edges, wood, and dock shade.",
        feedingEmphasis: "Benthic invertebrates and remaining insects.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension.",
      },
      {
        season: "early_summer",
        habitatClass: "Weed edges, inside weedlines, and shallow flats as littoral water warms into the upper 60s.",
        conservationNote: "Colonial or concentrated nesting habitat is excluded from target guidance.",
        presentationImplication: "Drop presentation and dead drift in slack. Pulse / jig along cover.",
        invalidators: ["using nesting colonies as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Weed edges, inside weedlines, wood, and shallow flats.",
        thermalContext: "Preferred 68–78°F.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension. Surface retrieve only when terrestrials are observed.",
        invalidators: ["importing a redear shellcracker bottom default wholesale"],
      },
      {
        season: "fall",
        habitatClass: "Weed edges and wood as water cools.",
        presentationImplication: "Drop presentation and slow drag.",
      },
    ],
    sources: [
      { label: "National Park Service pumpkinseed species account", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species pumpkinseed profile", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepomis_microlophus",
    status: "reviewed",
    overview:
      "Redear calendars are bottom-and-mollusk calendars, often slightly deeper than bluegill. They are not a surface sunfish. Nesting colonies are conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper weed edges, drop-offs, and remaining bottom cover in the usable band.",
        feedingEmphasis: "Slow bottom intercept of remaining invertebrates.",
        presentationImplication: "Bottom contact, slow drag, and drop presentation.",
      },
      {
        season: "spring",
        habitatClass: "Weed edges, outside weedlines, and shallow flats as water warms toward 70–75°F.",
        conservationNote: "Spawning commonly in warm shallow water, often somewhat deeper than bluegill nests. Colonies are excluded from target guidance.",
        presentationImplication: "Slow drag, drop presentation, and bottom-contact drift in protected slack.",
        invalidators: ["using nesting colonies as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Weed edges, outside weedlines, wood, and drop-offs — as bottom, not as a surface edge.",
        depthTendency: "Often slightly deeper littoral water than bluegill.",
        thermalContext: "Preferred 72–81°F. Most active in daylight.",
        presentationImplication: "Bottom contact, slow drag, drop presentation, and live / natural bait suspension. Pulse / jig on the bottom of protected water.",
        invalidators: ["forcing a bluegill surface default this record does not have"],
      },
      {
        season: "fall",
        habitatClass: "Outside weedlines and drop-offs as water cools.",
        forageEmphasis: "Mollusks and remaining benthic invertebrates. Do not infer a snail event from the calendar.",
        presentationImplication: "Bottom contact, slow drag, and stationary bait.",
      },
    ],
    sources: [
      { label: "Missouri Department of Conservation redear sunfish field guide", class: "agency" },
      { label: "Texas Parks and Wildlife redear sunfish account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepomis_cyanellus",
    status: "reviewed",
    overview:
      "Green sunfish calendars are cover-and-pool calendars. They tolerate streams and turbidity better than most Lepomis. Hybrids do not inherit this record. Nesting colonies are conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Wood, deep pools, and remaining cover in the usable band.",
        feedingEmphasis: "Insects and remaining small fish in cover.",
        presentationImplication: "Drop presentation, slow drag, and stop-and-go. Flowing water: stationary bait and dead drift.",
      },
      {
        season: "spring",
        habitatClass: "Wood, weed edges, riprap, and stream pools as water warms into the upper 60s.",
        conservationNote: "Nests in shallow colonies on gravel or rock. Colonies are excluded from target guidance.",
        presentationImplication: "Drop presentation, pulse / jig, and cross-current retrieve along cover.",
        invalidators: ["using nesting colonies as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Wood, dock shade, weed edges, riprap, and stream pools.",
        thermalContext: "Preferred 70–82°F. Tolerates turbidity and silt better than pumpkinseed or redear.",
        coverUse: "Structure first. Open flats are a mismatch.",
        presentationImplication: "Drop presentation, stop-and-go, and slow drag. Surface retrieve along cover when terrestrials are observed. Flowing water: dead drift and pulse / jig.",
        invalidators: ["importing a round-pond bluegill default into a stream pool"],
      },
      {
        season: "fall",
        habitatClass: "Wood, riprap, and pools as water cools.",
        presentationImplication: "Drop presentation, stop-and-go, and cross-current retrieve.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife green sunfish account", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species green sunfish profile", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ambloplites_rupestris",
    status: "reviewed",
    overview:
      "Rock bass calendars are rock-and-velocity-relief calendars. They coexist with smallmouth without sharing the same prey scale. Nest guarding is conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper pools, drop-offs, and remaining rock and wood.",
        feedingEmphasis: "Slow intercept of crayfish and remaining small fish.",
        presentationImplication: "Bottom contact, drop presentation, and stop-and-go. Flowing water: bottom-contact drift and stationary bait.",
      },
      {
        season: "spring",
        habitatClass: "Rocky shoreline, riprap, points, boulder pockets, and pool heads as water warms.",
        conservationNote: "Michigan DNR: spawn from April to early June; males guard nests. Nests are excluded from target guidance.",
        presentationImplication: "Cross-current retrieve, pulse / jig, and bottom-contact drift.",
        invalidators: ["using guarded nests as holding water"],
      },
      {
        season: "early_summer",
        habitatClass: "Rock, wood, and current breaks. Nesting overlap may continue.",
        conservationNote: "Early-summer nest guarding remains caution.",
        presentationImplication: "Bottom contact, horizontal retrieve, and stop-and-go.",
      },
      {
        season: "summer",
        habitatClass: "Rocky shoreline, riprap, points, wood, and drop-offs.",
        depthTendency: "Deeper with high sun. Shade and rock remain useful through the day.",
        thermalContext: "Preferred 68–76°F. Evening and early morning feeding is optically more plausible.",
        presentationImplication: "Horizontal retrieve, stop-and-go, bottom contact, and drop presentation. Flowing water: pulse / jig and cross-current retrieve.",
        invalidators: ["treating rock bass as smallmouth", "forcing a bluegill weed-edge default"],
      },
      {
        season: "fall",
        habitatClass: "Rock, points, and wood as water cools.",
        presentationImplication: "Bottom contact, horizontal retrieve, and bottom-contact drift.",
      },
    ],
    sources: [
      { label: "Michigan DNR rock bass species account", class: "agency" },
      { label: "Illinois Department of Natural Resources rock bass account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepomis_auritus",
    status: "reviewed",
    overview:
      "Redbreast calendars are pool-and-current-margin calendars. They use moving water more readily than bluegill. Colonial or grouped nests are conservation context and are never a targeting recommendation. They are not longear and they are not a still-water bluegill.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper pools, wood, and remaining current breaks in the usable band.",
        feedingEmphasis: "Slow intercept of remaining benthic insects and crustaceans.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension. Flowing water: dead drift and stationary bait.",
      },
      {
        season: "spring",
        habitatClass: "Pool tails, current breaks, wood, and rocky or sandy margins as water warms into the 60s.",
        conservationNote: "South Carolina DNR: spawn late May through July at about 65–75°F; nests may be solitary or in groups of more than 80. Colonies are excluded from target guidance.",
        presentationImplication: "Drop presentation, pulse / jig, and dead drift along cover. Stationary bait in slack.",
        invalidators: ["using grouped nests as holding water"],
      },
      {
        season: "early_summer",
        habitatClass: "Pools, current margins, wood, and rocky shoreline. Nesting overlap continues.",
        conservationNote: "Virginia DWR: spawn between May and July; males guard. Guarded nests remain caution.",
        presentationImplication: "Drop presentation, slow drag, and pulse / jig. Flowing water: dead drift.",
      },
      {
        season: "summer",
        habitatClass: "Pool tails, runs as margins, wood, rocky shoreline, and weed edges — as cover, not as a bluegill pond flat.",
        thermalContext: "Preferred 68–80°F. Virginia DWR: can inhabit faster water than many sunfish, still off the fastest lane.",
        lightSensitivity: "Daylight sight feeder; shade and broken light improve shallow cover use.",
        presentationImplication: "Drop presentation and slow drag. Surface retrieve only when terrestrials are observed, not assumed. Flowing water: dead drift and pulse / jig.",
        invalidators: ["importing a still-water bluegill default into a river pool", "collapsing redbreast into longear"],
      },
      {
        season: "fall",
        habitatClass: "Pools, wood, and remaining current breaks as water cools.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension.",
      },
    ],
    sources: [
      { label: "South Carolina DNR redbreast sunfish account", class: "agency" },
      { label: "Virginia DWR redbreast sunfish account", class: "agency" },
      { label: "North Carolina Wildlife Resources Commission redbreast sunfish profile", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepomis_gulosus",
    status: "reviewed",
    overview:
      "Warmouth calendars are stump-and-quiet-cover calendars. They are solitary, secretive, and more mud-and-weed than rock bass. Shared goggle-eye nicknames do not collapse the two. Nesting is conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Wood, deep cover, and remaining weeds in the usable band.",
        feedingEmphasis: "Slow intercept of remaining insects, crayfish, and small fish in cover.",
        presentationImplication: "Drop presentation, slow drag, and stop-and-go. Flowing slack: stationary bait.",
      },
      {
        season: "spring",
        habitatClass: "Wood, weed edges, stumps, and quiet stream margins as water warms toward 71°F.",
        conservationNote: "Texas Parks and Wildlife: spawn when water reaches about 71°F and continuing through summer. FWC: solitary nesters adjacent to a submerged object. Nests are excluded from target guidance.",
        presentationImplication: "Drop presentation, pulse / jig, and stop-and-go. Flowing water: stationary bait and cross-current retrieve along cover.",
        invalidators: ["using guarded nests as holding water"],
      },
      {
        season: "early_summer",
        habitatClass: "Stumps, weeds, wood, and undercut margins. Nesting overlap continues.",
        conservationNote: "FWC: often more than once a year, usually between April and August. Nesting remains caution.",
        presentationImplication: "Drop presentation, stop-and-go, and pulse / jig.",
      },
      {
        season: "summer",
        habitatClass: "Wood, inside weedlines, stumps, and quiet stream margins.",
        thermalContext: "Preferred 70–82°F. FWC: more tolerance for muddy water than most species. FWC: most feeding in the morning.",
        coverUse: "Structure first. Open flats are a mismatch.",
        presentationImplication: "Drop presentation, stop-and-go, and slow drag. Surface retrieve along cover when terrestrials are observed. Flowing water: pulse / jig and cross-current retrieve.",
        invalidators: ["treating warmouth as rock bass", "importing a round-pond bluegill default into stump cover"],
      },
      {
        season: "fall",
        habitatClass: "Wood, weeds, and remaining cover as water cools.",
        presentationImplication: "Drop presentation, stop-and-go, and slow drag.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife warmouth account", class: "agency" },
      { label: "Florida Fish and Wildlife Conservation Commission warmouth profile", class: "agency" },
      { label: "Virginia DWR warmouth account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "lepomis_megalotis",
    status: "reviewed",
    overview:
      "Longear calendars are clear-stream pool calendars. They are more stream-associated than bluegill but still avoid the fastest current core. Colonial nests from mid-May into August are conservation context. They are not redbreast.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deeper pools and remaining current relief in the usable band.",
        feedingEmphasis: "Slow intercept of remaining insects and crustaceans.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension. Flowing water: dead drift and stationary bait.",
      },
      {
        season: "early_summer",
        habitatClass: "Clear stream pools, inlets, overflow water, and vegetated rocky or sandy margins.",
        conservationNote: "Missouri DNR: nests in colonies from mid-May to early or mid-August; rims often nearly touch. Colonies are excluded from target guidance.",
        presentationImplication: "Drop presentation, pulse / jig, and dead drift in slack.",
        invalidators: ["using nesting colonies as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Pools, inlets, overflow water, weed edges, and rocky shoreline adjacent to moving water.",
        thermalContext: "Preferred 68–80°F. Missouri DNR: most active in daytime. Avoids strong currents.",
        lightSensitivity: "Clear water increases visual feeding and shade use at high sun.",
        presentationImplication: "Drop presentation and slow drag. Surface retrieve only when terrestrials are observed. Flowing water: dead drift, pulse / jig, and stationary bait.",
        invalidators: ["collapsing longear into redbreast", "forcing a still-water bluegill pond default"],
      },
      {
        season: "late_summer",
        habitatClass: "Pools and vegetated edges. Nesting overlap may continue into August.",
        conservationNote: "Missouri DNR: male remains with the nest for more than two weeks. Nesting remains caution.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension.",
      },
      {
        season: "fall",
        habitatClass: "Pools, inlets, and remaining wood as water cools.",
        presentationImplication: "Drop presentation, slow drag, and dead drift.",
      },
    ],
    sources: [
      { label: "Missouri Department of Conservation longear sunfish field guide", class: "agency" },
      { label: "Illinois Department of Natural Resources longear sunfish account", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "centrarchus_macropterus",
    status: "reviewed",
    overview:
      "Flier calendars are vegetated coastal-plain backwater calendars. Spawning starts earlier and cooler than most sunfish. They can share cover language with crappie without sharing Pomoxis schooling or spine counts. Grouped nests are conservation context.",
    entries: [
      {
        season: "winter",
        habitatClass: "Vegetated backwater, wood, and remaining slack in the usable band.",
        feedingEmphasis: "Slow intercept of remaining insects and small fish.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension. Flowing slack: dead drift and stationary bait.",
      },
      {
        season: "spring",
        habitatClass: "Weeds, wood, sloughs, and protected backwater as water holds in the mid-50s to mid-60s.",
        conservationNote: "South Carolina DNR: spawning begins earlier than most sunfish, around March to May at about 55–65°F; nests often in groups. Grouped nests are excluded from target guidance.",
        presentationImplication: "Drop presentation, pulse / jig, and live / natural bait suspension. Dead drift in slack.",
        invalidators: ["using grouped nests as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Weed edges, inside weedlines, wood, sloughs, and low-flowing vegetated water.",
        thermalContext: "Preferred 62–76°F. Slack, tannic or clear backwater — not a river-current sunfish problem.",
        coverUse: "Vegetation and wood first. Open current is a mismatch.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension. Surface retrieve along cover when terrestrials are observed. Flowing slack: pulse / jig and dead drift.",
        invalidators: ["treating flier as crappie", "importing a river-current sunfish default into backwater"],
      },
      {
        season: "fall",
        habitatClass: "Weeds, wood, and remaining backwater as water cools.",
        presentationImplication: "Drop presentation, slow drag, and live / natural bait suspension.",
      },
    ],
    sources: [
      { label: "South Carolina DNR flier account", class: "agency" },
      { label: "Illinois Department of Natural Resources flier account", class: "agency" },
      { label: "Georgia DNR freshwater fish identification", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ictalurus_punctatus",
    status: "reviewed",
    overview:
      "Channel catfish calendars are bottom-and-cover calendars with a night shallow move. They use smaller water than blue or flathead. Cavity spawning near 75°F is conservation context. They are omnivores, not live-fish-only flatheads.",
    entries: [
      {
        season: "winter",
        habitatClass: "Deep pools, basins, and current-protected holes.",
        depthTendency: "Minnesota DNR: deep water and protection from current. In large rivers they may winter near flathead without sharing diet.",
        feedingEmphasis: "Slow bottom intercept.",
        presentationImplication: "Bottom contact, slow drag, and live / natural bait suspension. Flowing water: bottom-contact drift and stationary bait.",
        invalidators: ["treating winter as a night-shallow riffle problem"],
      },
      {
        season: "spring",
        habitatClass: "Pools, current breaks, wood, and tributary mouths as water warms. Minnesota DNR: may move far upstream — a movement class, not a named reach.",
        presentationImplication: "Stationary bait, bottom-contact drift, and pulse / jig along cover.",
      },
      {
        season: "early_summer",
        habitatClass: "Deep pools, wood, undercut banks, and current breaks as water holds near 75°F.",
        conservationNote: "Missouri DNR / Texas Parks and Wildlife: male selects a dark secluded cavity; male guards eggs and fry. Cavities are excluded from target guidance.",
        presentationImplication: "Stationary bait and bottom contact off the cavity, not in it.",
        invalidators: ["using nesting cavities as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Day: deep water, drift, and wood. Night: riffles and pool shallows (Missouri DNR).",
        thermalContext: "Preferred 70–82°F. Warm edge near 90°F.",
        lightSensitivity: "Primarily low light and night in clear water; stain and current can extend daytime feeding.",
        presentationImplication: "Bottom contact, slow drag, and live / natural bait suspension. Flowing water: stationary bait, bottom-contact drift, and pulse / jig.",
        invalidators: ["forcing a live-fish-only flathead default", "forcing a reservoir-roaming blue-catfish default"],
      },
      {
        season: "fall",
        habitatClass: "Pools and deeper current protection as fish move downstream (Minnesota DNR).",
        presentationImplication: "Bottom contact, slow drag, and stationary bait.",
      },
    ],
    sources: [
      { label: "Missouri Department of Conservation channel catfish field guide", class: "agency" },
      { label: "Texas Parks and Wildlife channel catfish account", class: "agency" },
      { label: "Minnesota DNR catfish biology", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ictalurus_furcatus",
    status: "reviewed",
    overview:
      "Blue catfish calendars are large-river and reservoir calendars. They do not collapse into channel catfish or solitary flathead. Native-range and introduced-range status stay conservation context. RPC already splits river-channel from reservoir-roaming — this overlay does not auto-select them.",
    entries: [
      {
        season: "winter",
        habitatClass: "Texas Parks and Wildlife: downstream toward warmer water. Deep channels, basins, and current-protected holes.",
        feedingEmphasis: "Remaining fish and invertebrates in the usable band.",
        presentationImplication: "Bottom contact, slow drag, and live / natural bait suspension. Vertical jig when fish are in the column. Flowing water: bottom-contact drift and stationary bait.",
        invalidators: ["treating winter as a shallow-cover pond-channel problem"],
      },
      {
        season: "spring",
        habitatClass: "Channels, current breaks, points, and basins as water warms toward the low 70s.",
        presentationImplication: "Stationary bait, pulse / jig, and bottom-contact drift. Vertical jig in reservoirs when fish are off the bottom.",
      },
      {
        season: "early_summer",
        habitatClass: "Channels, structure, and protected low-current water as water holds about 70–75°F.",
        conservationNote: "Virginia DWR / NOAA: spawn once per year in late spring and early summer. Males are primary nest caretakers. Cavities and smaller tributary nesting water are excluded from target guidance.",
        presentationImplication: "Stationary bait and bottom contact off nesting structure, not on it.",
        invalidators: ["using nesting cavities as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Texas Parks and Wildlife: upstream toward cooler water. Large-river channels and, in reservoirs, forage-linked open water.",
        thermalContext: "Preferred 72–84°F. North Carolina Wildlife: often favor faster currents than other catfish.",
        lightSensitivity: "Virginia DWR: deep holes in peak daylight; shallower moving water in low light. Daytime feeding remains plausible with current and turbidity.",
        presentationImplication: "Bottom contact, slow drag, live / natural bait suspension, and vertical jig. Flowing water: stationary bait, bottom-contact drift, and pulse / jig.",
        invalidators: ["forcing a solitary flathead wood default", "collapsing river-channel and reservoir-roaming jobs into one depth rule"],
      },
      {
        season: "fall",
        habitatClass: "Channels, drop-offs, and basins as water cools.",
        forageEmphasis: "Fish and remaining invertebrates. Do not infer a bait event from the calendar.",
        presentationImplication: "Bottom contact, vertical jig, and slow drag.",
      },
    ],
    sources: [
      { label: "Texas Parks and Wildlife blue catfish account", class: "agency" },
      { label: "Virginia DWR blue catfish account", class: "agency" },
      { label: "NOAA Fisheries blue catfish species page", class: "agency" },
      { label: "North Carolina Wildlife blue catfish account", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species blue catfish profile", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "pylodictis_olivaris",
    status: "reviewed",
    overview:
      "Flathead calendars are solitary wood-and-pool calendars. Adults are live-fish predators, not scavengers. Cavity spawning is conservation context. Introduced status is not a harvest endorsement.",
    entries: [
      {
        season: "winter",
        habitatClass: "Minnesota DNR: deep water with boulders or logs as refuge from current.",
        feedingEmphasis: "Slow intercept of remaining live fish around home cover.",
        presentationImplication: "Bottom contact, slow drag, and live / natural bait suspension. Flowing water: bottom-contact drift and stationary bait.",
        invalidators: ["treating winter as a roaming open-channel problem"],
      },
      {
        season: "spring",
        habitatClass: "Deep pools, wood, and current breaks as water warms.",
        presentationImplication: "Stationary bait, pulse / jig, and bottom-contact drift along cover.",
      },
      {
        season: "early_summer",
        habitatClass: "Wood, cavities, and protected pools as water holds in the low-to-mid 70s, often somewhat later than channel catfish (Missouri DNR).",
        conservationNote: "Cavity nesting; male guards eggs and fry. Cavities and fry schools are excluded from target guidance.",
        presentationImplication: "Stationary bait and bottom contact off the cavity, not in it.",
        invalidators: ["using nesting cavities as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Day: a favorite deep-cover object. Night: shallows and pool edges off that cover (Missouri DNR / Texas Parks and Wildlife).",
        thermalContext: "Preferred 68–82°F. Texas Parks and Wildlife: spawn can continue at 75–80°F.",
        lightSensitivity: "Strong nocturnal default. Bright open sand is a mismatch.",
        coverUse: "One occupied wood or scour object, not a crowd.",
        presentationImplication: "Bottom contact, slow drag, and live / natural bait suspension. Flowing water: stationary bait, bottom-contact drift, and pulse / jig.",
        invalidators: ["forcing a channel-catfish omnivore default", "forcing a reservoir-roaming blue-catfish default"],
      },
      {
        season: "fall",
        habitatClass: "Wood, deep pools, and remaining current relief as water cools.",
        presentationImplication: "Bottom contact, slow drag, and stationary bait.",
      },
    ],
    sources: [
      { label: "Missouri Department of Conservation flathead catfish field guide", class: "agency" },
      { label: "Texas Parks and Wildlife flathead catfish account", class: "agency" },
      { label: "Minnesota DNR catfish biology", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "ameiurus_catus",
    status: "reviewed",
    overview:
      "White catfish calendars are slow-water, wide-head Ameiurus calendars. They are not channel catfish, not blue catfish, and not square-tailed pond bullheads. This record is freshwater only.",
    entries: [
      {
        season: "winter",
        habitatClass: "Basins, deep pools, and remaining wood and riprap.",
        feedingEmphasis: "Slow bottom intercept of remaining invertebrates.",
        presentationImplication: "Bottom contact, slow drag, and live / natural bait suspension. Flowing slack: stationary bait and bottom-contact drift.",
      },
      {
        season: "spring",
        habitatClass: "Backwaters, side channels, wood, and current relief as water warms.",
        presentationImplication: "Stationary bait, pulse / jig, and bottom-contact drift.",
      },
      {
        season: "early_summer",
        habitatClass: "Banks, roots, wood, and slow structure.",
        conservationNote: "Cavity or depression spawning around banks, roots, and structure. Guarded nests are excluded from target guidance. Exact temperature tables remain a gap.",
        presentationImplication: "Stationary bait and bottom contact off nesting structure, not on it.",
        invalidators: ["using nesting cavities as holding water"],
      },
      {
        season: "summer",
        habitatClass: "Connecticut DEEP: backwaters and slow-moving areas of larger rivers and streams, plus lakes and ponds.",
        thermalContext: "Preferred 68–80°F.",
        lightSensitivity: "More daylight-capable than many bullheads; still a bottom-contact fish.",
        presentationImplication: "Bottom contact, slow drag, and live / natural bait suspension. Flowing slack: stationary bait, bottom-contact drift, and pulse / jig.",
        invalidators: ["treating white catfish as channel catfish", "inheriting a bullhead night-only default"],
      },
      {
        season: "fall",
        habitatClass: "Basins, wood, and remaining current relief as water cools.",
        presentationImplication: "Bottom contact, slow drag, and stationary bait.",
      },
    ],
    sources: [
      { label: "Connecticut DEEP white catfish account", class: "agency" },
      { label: "Chesapeake Bay Program white catfish field guide", class: "agency" },
      { label: "Virginia DWR white catfish comparison notes", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, POP_GAP],
  },
  {
    speciesId: "oncorhynchus_tshawytscha",
    status: "reviewed",
    overview:
      "Chinook calendars must not collapse Great Lakes lake feeding into Pacific freshwater return. NOAA: return generally in summer or early fall; all die after spawning. Freshwater spawning adults are interception, not forage matching. Listed ESUs (two endangered, seven threatened as of 2025) are invalidators. Do not target redds.",
    entries: [
      {
        season: "spring",
        habitatClass: "Great Lakes pelagic water — thermocline edges, suspended open water, drop-offs, and points as classes. Pacific ocean feeding is behind or beside this overlay, not a river feeding calendar.",
        feedingEmphasis: "Older fish on other fish where lake fish are still feeding. Capacity is not a current bait event.",
        presentationImplication: "Trolling, Vertical jig, and Horizontal retrieve remain the reviewed stillwater families for lake fish that are feeding. They do not apply to Pacific freshwater spawners.",
        invalidators: ["treating spring Chinook as inland rainbow nymphing", "collapsing Great Lakes feeding into a river-spawn calendar"],
      },
      {
        season: "summer",
        habitatClass: "Lake fish along the cool pelagic layer. Pacific freshwater return has not yet become the default story.",
        depthTendency: "Often deep or suspended; bright conditions push lake fish down along the thermocline.",
        thermalContext: "Preferred 44–55°F; warm edge near 64°F.",
        presentationImplication: "Trolling and Vertical jig on the usable lake layer. Flowing families stay off this lake job.",
        invalidators: ["forcing a river-spawn calendar onto lake fish"],
      },
      {
        season: "late_summer",
        habitatClass: "Pacific freshwater travel lanes, runs, deep pools, seams, tailwater, and current breaks as classes. Great Lakes lake feeding may still be underway elsewhere — do not collapse them.",
        feedingEmphasis: "Pacific freshwater adults are interception, not forage matching.",
        presentationImplication: "Swing, Downstream retrieve, and Bottom-contact drift remain the reviewed flowing families for lawful, non-listed contexts — they do not imply feeding lies.",
        conservationNote: "NOAA: return generally in summer or early fall. Listed ESUs and redds are invalidators, never target layers.",
        invalidators: ["converting migration into a trout feeding calendar", "targeting redds"],
      },
      {
        season: "fall",
        habitatClass: "Spawning systems. Not a feeding-trout problem.",
        conservationNote: "NOAA: all Chinook salmon die after spawning. Redds and listed ESUs stay excluded from target guidance.",
        presentationImplication: "Swing, Downstream retrieve, and Bottom-contact drift remain interception mechanics only where harvest is lawful and the population is not listed.",
        invalidators: ["naming spawning reaches or bottlenecks", "using a hatch match on spawning adults"],
      },
    ],
    sources: [
      { label: "NOAA Fisheries Chinook Salmon species profile", class: "agency", url: "https://www.fisheries.noaa.gov/species/chinook-salmon" },
      { label: "Healey chinook life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [MONTH_GAP, "Pacific vs Great Lakes calendars as a structured RPC split"],
  },
  {
    speciesId: "oncorhynchus_kisutch",
    status: "reviewed",
    overview:
      "Coho calendars must not collapse Great Lakes lake feeding into Pacific freshwater return. NOAA: return generally in fall or early winter. Catalog: often higher in the column than Chinook. Tributary mouths are a habitat class, not a license to crowd spawning tributaries. Listed ESUs are invalidators.",
    entries: [
      {
        season: "spring",
        habitatClass: "Great Lakes pelagic water — thermocline edges, suspended open water, points, and inlets as classes. Not a Pacific river-return calendar.",
        feedingEmphasis: "Small forage fish where lake fish are feeding. Insects remain juvenile capacity.",
        presentationImplication: "Horizontal retrieve, Trolling, and Stop-and-go remain the reviewed stillwater families for lake fish that are feeding.",
        invalidators: ["collapsing Great Lakes feeding into a river-spawn calendar"],
      },
      {
        season: "summer",
        habitatClass: "Lake fish often higher in the column than Chinook. Bright conditions still do not invent a surface event.",
        thermalContext: "Preferred 46–56°F; warm edge near 65°F.",
        presentationImplication: "Horizontal retrieve, Trolling, and Stop-and-go on the usable lake layer.",
        invalidators: ["forcing Chinook deep-trolling language onto coho by default"],
      },
      {
        season: "fall",
        habitatClass: "Pacific freshwater travel lanes — runs, seams, pool heads, current breaks, and tributary mouths as classes.",
        feedingEmphasis: "Pacific freshwater adults are interception, not forage matching.",
        presentationImplication: "Swing, Cross-current retrieve, and Downstream retrieve remain the reviewed flowing families for lawful, non-listed contexts — they do not imply feeding lies.",
        conservationNote: "NOAA: females dig redds; all coho die after spawning. Do not crowd spawning tributaries. California and federal listings stay fail-closed where they apply.",
        invalidators: ["treating tributary-mouth habitat as a targeting prescription", "targeting redds"],
      },
      {
        season: "winter",
        habitatClass: "NOAA: some returns continue into early winter. Remaining Great Lakes lake fish are a separate job from Pacific freshwater travel.",
        conservationNote: "Early-winter spawning overlap is caution. Listed ESUs remain invalidators.",
        presentationImplication: "Swing, Cross-current retrieve, and Downstream retrieve as interception mechanics only where the fishery is lawful.",
        invalidators: ["using stillwater families on this flowing return"],
      },
    ],
    sources: [
      { label: "NOAA Fisheries Coho Salmon species profile", class: "agency", url: "https://www.fisheries.noaa.gov/species/coho-salmon" },
      { label: "California DFW Coho Salmon conservation profile", class: "agency", url: "https://wildlife.ca.gov/Conservation/Fishes/Coho-Salmon" },
    ],
    ...R,
    gaps: [MONTH_GAP, "Pacific vs Great Lakes calendars as a structured RPC split"],
  },
  {
    speciesId: "oncorhynchus_gorbuscha",
    status: "reviewed",
    overview:
      "Pink salmon calendars are flowing-water only. Alaska DFG: adults returning to spawn do not eat. NOAA: independent odd-year and even-year populations; typically spawn at age 2. Presentation is interception/reaction in lawful fisheries. This record must not inherit stillwater families.",
    entries: [
      {
        season: "summer",
        habitatClass: "Coastal river travel lanes — runs, pool heads, pool tails, current breaks, and tributary mouths as classes.",
        feedingEmphasis: "Alaska DFG: adults returning to spawn do not eat. Ocean feeding is behind them.",
        thermalContext: "Preferred 44–58°F.",
        presentationImplication: "Swing, Cross-current retrieve, Downstream retrieve, and Pulse / jig remain the reviewed flowing families — they describe interception/reaction, not feeding lies.",
        conservationNote: "NOAA: odd-year and even-year populations are independent. Abundance must not be inferred from habitat.",
        invalidators: ["treating returning pinks as feeding trout", "adding stillwater families — this record has none"],
      },
      {
        season: "late_summer",
        habitatClass: "Continuing freshwater travel and holding in non-target migration water.",
        feedingEmphasis: "Still not eating. Ripening, not forage matching.",
        presentationImplication: "Swing, Cross-current retrieve, Downstream retrieve, and Pulse / jig as interception mechanics only.",
        invalidators: ["converting presence into a hatch match"],
      },
      {
        season: "fall",
        habitatClass: "Spawning systems. Not a presentation-as-feeding problem.",
        conservationNote: "NOAA: all pink salmon die after they spawn. Redds and concentrated spawning fish are excluded from target guidance.",
        presentationImplication: "Reviewed flowing families remain interception only where harvest is lawful.",
        invalidators: ["naming spawning reaches or bottlenecks", "forcing a stillwater calendar"],
      },
    ],
    sources: [
      { label: "Alaska Department of Fish and Game Pink Salmon species profile", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=pinksalmon.main" },
      { label: "NOAA Fisheries Pink Salmon species profile", class: "agency", url: "https://www.fisheries.noaa.gov/species/pink-salmon" },
    ],
    ...R,
    gaps: [MONTH_GAP, "odd-year vs even-year run calendars as a structured overlay"],
  },
  {
    speciesId: "oncorhynchus_keta",
    status: "reviewed",
    overview:
      "Chum salmon calendars are flowing-water only. Alaska DFG: adults on the spawning run cease feeding. NOAA: spawn from late summer to March; two West Coast ESUs listed as threatened. Presentation is interception in lawful, non-listed contexts. This record must not inherit stillwater families.",
    entries: [
      {
        season: "late_summer",
        habitatClass: "Coastal river travel lanes — runs, current breaks, pool heads, pool tails, and tributary mouths as classes.",
        feedingEmphasis: "Alaska DFG: adults cease feeding and the digestive tract degrades.",
        presentationImplication: "Swing, Cross-current retrieve, Downstream retrieve, and Pulse / jig remain the reviewed flowing families — interception/reaction, not feeding lies.",
        conservationNote: "Hood Canal summer-run and Columbia River ESUs are federally threatened (NOAA). Status is an invalidator, never a target layer.",
        invalidators: ["treating returning chum as feeding trout", "adding stillwater families — this record has none"],
      },
      {
        season: "fall",
        habitatClass: "Continuing freshwater travel. Not a resident-trout calendar.",
        feedingEmphasis: "Still not feeding. Ripening, not forage matching.",
        presentationImplication: "Swing, Cross-current retrieve, Downstream retrieve, and Pulse / jig as interception mechanics only where the fishery is lawful and unlisted.",
        invalidators: ["converting migration into a hatch match"],
      },
      {
        season: "late_fall",
        habitatClass: "Spawning systems in populations that continue into early winter.",
        conservationNote: "NOAA: spawn from late summer to March. Spawning concentrations are excluded from target guidance.",
        presentationImplication: "Reviewed flowing families remain interception only.",
        invalidators: ["naming spawning reaches or bottlenecks"],
      },
      {
        season: "winter",
        habitatClass: "NOAA: peak spawning can be concentrated in early winter when river flows are high. Hydrology, not a named bottleneck.",
        conservationNote: "Listed ESUs stay fail-closed regardless of season. Spawners are not a feeding problem.",
        presentationImplication: "Swing and Pulse / jig remain interception mechanics only where harvest is lawful.",
        invalidators: ["forcing a stillwater calendar", "using listed ESU names as a place to fish"],
      },
    ],
    sources: [
      { label: "NOAA Fisheries Chum Salmon species profile", class: "agency", url: "https://www.fisheries.noaa.gov/species/chum-salmon" },
      { label: "NOAA Fisheries Chum Salmon protected-ESU profile", class: "agency" },
      { label: "Alaska Department of Fish and Game Chum Salmon species profile", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=chumsalmon.main" },
    ],
    ...R,
    gaps: [MONTH_GAP, "listed vs unlisted population calendars as a structured overlay"],
  },
  {
    speciesId: "salmo_salar_landlocked",
    status: "reviewed",
    overview:
      "Landlocked Atlantic salmon still feed. Maine IFW: rainbow smelt are principal lake forage; prefer water below 65°F; wild fish spawn in lake inlets or outlets from mid-October through late November. River insect work and lake pelagic work must not be collapsed. This record is not wild sea-run Atlantic salmon and not a brown trout.",
    entries: [
      {
        season: "winter",
        habitatClass: "Lake basins, thermocline remnants, drop-offs, and suspended open water in the remaining cold band.",
        depthTendency: "Deeper than spring surface water.",
        feedingEmphasis: "Pelagic forage fish. Insects recede.",
        thermalContext: "Near or below the 40°F cold edge, activity compresses.",
        presentationImplication: "Trolling, Vertical jig, and Suspend / pause remain the reviewed stillwater winter jobs.",
        invalidators: ["treating winter as a brown-trout wood problem"],
      },
      {
        season: "spring",
        habitatClass: "Higher pelagic water in lakes; cold river runs, seams, and pool heads in connected flowing water.",
        feedingEmphasis: "Smelt-scale forage in lakes; aquatic and emerging insects in rivers. Capacity is not a hatch.",
        presentationImplication: "Trolling, Horizontal retrieve, and Surface retrieve in still water; Dead drift, Swing, and Surface drift in current.",
      },
      {
        season: "summer",
        habitatClass: "Cold oxygenated lake water — thermocline edges, basins, drop-offs. Rivers that stay cold enough remain usable.",
        depthTendency: "Catalog: commonly descends into cold oxygenated water during summer stratification.",
        thermalContext: "Maine IFW: prefer water temperatures below 65°F. Catalog warm edge near 68°F.",
        presentationImplication: "Trolling, Vertical jig, and Suspend / pause on the usable cold layer. Flowing water: Dead drift and Swing where temperature allows.",
        invalidators: ["forcing a warm surface default", "collapsing this record into brown trout summer cover"],
      },
      {
        season: "fall",
        habitatClass: "Cooling pelagic water; river runs as some fish move toward inlet and outlet spawning systems.",
        forageEmphasis: "Forage continues until spawning overlap. Do not infer a smelt event from the calendar.",
        presentationImplication: "Trolling and Horizontal retrieve in lakes; Dead drift, Swing, Cross-current retrieve, and Surface drift in current.",
        conservationNote: "Maine IFW: wild fish spawn from mid-October through late November in lake inlets or outlets. That window is an invalidator, not a target map.",
        invalidators: ["using inlets or outlets as a targeting prescription during the spawn window"],
      },
      {
        season: "late_fall",
        habitatClass: "Spawning overlap continues. Remaining lake fish that are not on the run stay pelagic.",
        conservationNote: "Spawning runs stay excluded from target guidance. This is not wild sea-run Atlantic salmon.",
        presentationImplication: "Reviewed families remain lawful feeding jobs away from the spawn window; they are not a redd method.",
        invalidators: ["collapsing landlocked salmon into federally endangered sea-run Atlantic salmon"],
      },
    ],
    sources: [
      { label: "Maine Department of Inland Fisheries and Wildlife Landlocked Salmon species profile", class: "agency", url: "https://www.maine.gov/ifw/fish-wildlife/fisheries/species-information/landlocked-salmon.html" },
      { label: "Maine landlocked Atlantic salmon management literature", class: "agency" },
    ],
    ...R,
    gaps: [MONTH_GAP, "smelt-present vs smelt-absent lake calendars as a structured RPC split"],
  },

];
