import type { SpeciesRecord } from "../protocol/types.ts";

const SRC = {
  agency: "agency" as const,
  peer: "peer_reviewed" as const,
  syn: "synthesis" as const,
};

/**
 * Reviewed expansion batch added 2026-08-27.
 *
 * Scope: panfish, warmwater predators, large-river / coastal-freshwater migrants,
 * and pelagic forage-linked species that fill distinct ecological jobs in the
 * existing Species & Presentation Analyst vocabulary.
 *
 * Listed / highly conservation-sensitive species are intentionally deferred
 * until the schema can carry explicit target-status and regulatory context.
 */
export const SPECIES_EXPANSION_02: SpeciesRecord[] = [
  {
    id: "lepomis_gibbosus",
    scientificName: "Lepomis gibbosus",
    commonNames: ["Pumpkinseed"],
    group: "bass_panfish",
    nativeContext:
      "Native to much of the Great Lakes, upper Mississippi, and Atlantic-slope region; widely moved beyond its native range.",
    thermal: { preferredF: [68, 78], activeF: [58, 82], coldEdgeF: 50, warmEdgeF: 86 },
    spawning: {
      seasons: ["early_summer", "summer"],
      note: "Nesting begins as littoral water warms into the upper 60s and 70s; colonial or concentrated nesting habitat is a conservation concern, not a place to target.",
    },
    habitat: {
      waterTypes: ["stillwater", "flowing"],
      riverHolding: ["eddy", "side_channel", "submerged_wood", "current_break"],
      stillHolding: ["weed_edge", "inside_weedline", "wood", "dock_shade", "shallow_flat"],
      currentPreference:
        "Favors absent to sluggish current and uses protected margins, vegetation, wood, and other littoral cover.",
      depthTendency:
        "Mostly shallow to mid-depth around vegetation and cover; deeper edges become more useful under bright light or seasonal cooling.",
      lightResponse:
        "Primarily a daylight feeder, but shade and broken light concentrate use of cover on bright days.",
    },
    forageClasses: [
      "aquatic_insects",
      "mollusks",
      "crustaceans",
      "zooplankton",
      "small_forage_fish",
    ],
    flowingPresentations: ["dead_drift", "stationary_bait", "pulse_jig"],
    stillPresentations: [
      "drop_presentation",
      "slow_drag",
      "live_natural_bait_suspension",
      "surface_retrieve",
    ],
    exceptions: [
      "Pumpkinseed and bluegill frequently overlap, but pumpkinseed generally has a stronger mollusk and benthic-invertebrate component.",
      "Do not convert visible nesting colonies into a targeting recommendation.",
    ],
    geographic:
      "Northern and eastern North America, especially vegetated lakes, ponds, reservoirs, and sluggish river margins.",
    sources: [
      { label: "National Park Service pumpkinseed species account", class: SRC.agency },
      { label: "USGS Nonindigenous Aquatic Species pumpkinseed profile", class: SRC.agency },
      { label: "Freshwater sunfish habitat and thermal syntheses", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "lepomis_microlophus",
    scientificName: "Lepomis microlophus",
    commonNames: ["Redear sunfish", "Shellcracker"],
    group: "bass_panfish",
    nativeContext:
      "Native to the southeastern and south-central United States; widely stocked in warm ponds, lakes, and reservoirs.",
    thermal: { preferredF: [72, 81], activeF: [60, 86], coldEdgeF: 52, warmEdgeF: 90 },
    spawning: {
      seasons: ["spring", "early_summer", "summer"],
      note: "Spawning commonly occurs in warm shallow water around roughly 70-75°F, often in colonies and somewhat deeper than bluegill nests.",
    },
    habitat: {
      waterTypes: ["stillwater", "flowing"],
      riverHolding: ["eddy", "side_channel", "submerged_wood"],
      stillHolding: ["weed_edge", "outside_weedline", "wood", "shallow_flat", "drop_off"],
      currentPreference:
        "Prefers still water or protected overflow pools and bays; avoids sustained main-channel current.",
      depthTendency:
        "Often uses slightly deeper littoral water than bluegill and feeds near bottom around vegetation, sand, mud, and shell-bearing substrate.",
      lightResponse:
        "Mostly active in daylight; bright clear conditions can shift fish deeper while preserving bottom and cover association.",
    },
    forageClasses: ["mollusks", "aquatic_insects", "crustaceans", "worms_annelids"],
    flowingPresentations: ["stationary_bait", "bottom_contact_drift", "pulse_jig"],
    stillPresentations: [
      "bottom_contact",
      "slow_drag",
      "drop_presentation",
      "live_natural_bait_suspension",
    ],
    exceptions: [
      "Mollusks are a defining forage class, but insect and crustacean feeding remains important where snails are sparse.",
      "Nesting colonies are never named as target locations.",
    ],
    geographic:
      "Warm clear ponds, reservoirs, lakes, marshes, and slow protected river habitat of the South and stocked waters elsewhere.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species redear sunfish profile", class: SRC.agency },
      { label: "Missouri Department of Conservation redear sunfish account", class: SRC.agency },
      { label: "NC State Extension redear sunfish pond-management guidance", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "lepomis_cyanellus",
    scientificName: "Lepomis cyanellus",
    commonNames: ["Green sunfish"],
    group: "bass_panfish",
    nativeContext:
      "Native across a broad central North American range and widely introduced; notably tolerant of turbidity, silt, and variable habitat.",
    thermal: { preferredF: [70, 82], activeF: [58, 86], coldEdgeF: 50, warmEdgeF: 90 },
    spawning: {
      seasons: ["spring", "early_summer", "summer"],
      note: "Spawning begins as water warms into roughly the upper 60s to low 70s and may repeat through summer; nests occur near firm substrate, rock, wood, or vegetation.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["eddy", "side_channel", "submerged_wood", "current_break", "deep_pool"],
      stillHolding: ["wood", "weed_edge", "dock_shade", "shallow_flat", "riprap"],
      currentPreference:
        "More stream-tolerant than many Lepomis but still favors pools, margins, cover, and reduced velocity over a fast current core.",
      depthTendency:
        "Usually shallow to mid-depth and strongly structure-oriented; larger fish use deeper cover when pressure or light increases.",
      lightResponse: "Daylight feeder that uses shade, cover, and turbidity to reduce exposure.",
    },
    forageClasses: [
      "aquatic_insects",
      "terrestrial_insects",
      "crustaceans",
      "small_forage_fish",
      "mollusks",
    ],
    flowingPresentations: ["dead_drift", "pulse_jig", "stationary_bait", "cross_current_retrieve"],
    stillPresentations: ["drop_presentation", "stop_and_go", "slow_drag", "surface_retrieve"],
    exceptions: [
      "Green sunfish readily hybridize with other sunfishes; a hybrid should not silently inherit this record.",
      "Introduced populations can have ecological impacts on native fish and amphibians; local status matters.",
    ],
    geographic:
      "Central North America plus widespread introductions; streams, ponds, lakes, marshes, and disturbed warmwater habitat.",
    sources: [
      { label: "USFWS green sunfish habitat-use synthesis", class: SRC.agency },
      { label: "USGS Nonindigenous Aquatic Species green sunfish profile", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "ambloplites_rupestris",
    scientificName: "Ambloplites rupestris",
    commonNames: ["Rock bass"],
    group: "bass_panfish",
    nativeContext:
      "Native to Great Lakes, St. Lawrence, Ohio, and Mississippi-basin waters; commonly associated with clear rocky streams and lake shorelines.",
    thermal: { preferredF: [68, 76], activeF: [55, 80], coldEdgeF: 48, warmEdgeF: 84 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spring to early-summer nest spawning occurs over gravel, sand, and rocky littoral habitat; nest guarding should not become bed-targeting advice.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["current_break", "boulder_pocket", "pool_head", "deep_pool", "submerged_wood"],
      stillHolding: ["rocky_shoreline", "riprap", "point", "wood", "drop_off"],
      currentPreference:
        "Uses permanent-flow streams but typically holds around rock, wood, pool structure, and velocity relief rather than the fastest lane.",
      depthTendency:
        "Shallow to mid-depth around rock and cover, moving deeper with high sun, pressure, or seasonal cooling.",
      lightResponse:
        "Often feeds most actively in early morning and evening; shade and rock cover remain useful through the day.",
    },
    forageClasses: ["crustaceans", "aquatic_insects", "small_forage_fish", "mollusks"],
    flowingPresentations: [
      "cross_current_retrieve",
      "pulse_jig",
      "bottom_contact_drift",
      "stationary_bait",
    ],
    stillPresentations: [
      "bottom_contact",
      "stop_and_go",
      "drop_presentation",
      "horizontal_retrieve",
    ],
    exceptions: [
      "Rock bass often coexist with smallmouth bass, but their cover use and prey scale should not be treated as identical.",
      "Nest guarding is a reproductive state, not a recommendation to target beds.",
    ],
    geographic:
      "Clear rocky rivers, streams, lake shores, and reservoirs of the Great Lakes and interior East/Central regions.",
    sources: [
      { label: "Michigan Department of Natural Resources rock bass account", class: SRC.agency },
      { label: "Illinois Department of Natural Resources rock bass account", class: SRC.agency },
      { label: "NOAA Great Lakes fish life-history synthesis", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "esox_niger",
    scientificName: "Esox niger",
    commonNames: ["Chain pickerel"],
    group: "predator",
    nativeContext:
      "Eastern North American esocid of vegetated lakes, swamps, backwaters, and sluggish streams; introduced in some inland basins.",
    thermal: { preferredF: [60, 70], activeF: [50, 78], coldEdgeF: 42, warmEdgeF: 82 },
    spawning: {
      seasons: ["early_spring", "spring"],
      note: "Early spring spawning occurs in flooded vegetation and shallow margins before sustained warmwater patterns develop.",
    },
    habitat: {
      waterTypes: ["stillwater", "flowing"],
      riverHolding: ["eddy", "side_channel", "submerged_wood", "current_break", "shallow_flat"],
      stillHolding: ["weed_edge", "inside_weedline", "outside_weedline", "wood", "shallow_flat"],
      currentPreference:
        "Ambushes from vegetation and slack-water cover; sustained main-channel current is not the default feeding position.",
      depthTendency:
        "Primarily shallow to mid-depth around weeds and cover, with deeper edge use during bright or warm periods.",
      lightResponse:
        "Sight-oriented ambush predator; low light and stained water can increase use of open edges while bright conditions reinforce cover.",
    },
    forageClasses: ["small_forage_fish", "larger_prey_fish", "amphibians", "crustaceans"],
    flowingPresentations: ["cross_current_retrieve", "upstream_retrieve", "stationary_bait"],
    stillPresentations: [
      "stop_and_go",
      "horizontal_retrieve",
      "subsurface_slow_roll",
      "surface_retrieve",
    ],
    exceptions: [
      "Chain pickerel are cover-oriented esocids; open-pelagic pike logic should not be imported automatically.",
      "Flooded spawning margins are never named as aggregation targets.",
    ],
    geographic:
      "Atlantic slope and eastern interior waters, especially vegetated lakes, swamps, ponds, and sluggish rivers.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species chain pickerel profile", class: SRC.agency },
      {
        label: "South Carolina Department of Natural Resources chain pickerel account",
        class: SRC.agency,
      },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "amia_calva",
    scientificName: "Amia calva",
    commonNames: ["Bowfin"],
    group: "predator",
    nativeContext:
      "Ancient native predator of eastern North American low-gradient rivers, floodplains, swamps, backwaters, lakes, and bayous.",
    thermal: { preferredF: [68, 80], activeF: [55, 86], coldEdgeF: 48, warmEdgeF: 90 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Late-spring spawning occurs in shallow vegetated nests built and guarded by males; nest and fry-guarding behavior is not a target cue.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["eddy", "side_channel", "submerged_wood", "deep_pool", "undercut_bank"],
      stillHolding: ["weed_edge", "inside_weedline", "wood", "basin", "inlet"],
      currentPreference:
        "Strong fit is slack, backwater, and low-gradient habitat with vegetation or wood; not a sustained-current specialist.",
      depthTendency:
        "Often deeper or more covered by day, then moves shallower along weed and wood edges at night.",
      lightResponse:
        "Low light and night favor shallower feeding; daylight commonly reinforces depth and cover.",
    },
    forageClasses: [
      "small_forage_fish",
      "larger_prey_fish",
      "crustaceans",
      "amphibians",
      "aquatic_insects",
    ],
    flowingPresentations: ["stationary_bait", "cross_current_retrieve", "pulse_jig"],
    stillPresentations: [
      "stop_and_go",
      "bottom_contact",
      "subsurface_slow_roll",
      "live_natural_bait_suspension",
    ],
    exceptions: [
      "Surface air-gulping is respiratory behavior and should not be interpreted as surface feeding.",
      "Male nest and fry guarding is a reproductive state, not a recommendation.",
    ],
    geographic:
      "Eastern North America from the Great Lakes region to Gulf drainages in slow rivers, backwaters, swamps, lakes, and bayous.",
    sources: [
      { label: "Texas Parks and Wildlife Department bowfin species account", class: SRC.agency },
      { label: "Freshwater fish life-history synthesis for bowfin", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "lepisosteus_osseus",
    scientificName: "Lepisosteus osseus",
    commonNames: ["Longnose gar"],
    group: "predator",
    nativeContext:
      "Native widespread gar of large rivers, reservoirs, lakes, backwaters, and connected low-gradient freshwater systems.",
    thermal: { preferredF: [75, 86], activeF: [60, 90], coldEdgeF: 50, warmEdgeF: 95 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spring spawning occurs in shallow quiet backwaters and vegetated margins as water warms; gar eggs are toxic and should never be treated as forage or food.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["run", "deep_pool", "current_break", "side_channel", "tributary_mouth"],
      stillHolding: ["shallow_flat", "point", "drop_off", "inlet", "suspended_open"],
      currentPreference:
        "Uses large-river current margins and backwaters but often patrols slow or open water rather than holding tightly to one piece of cover.",
      depthTendency:
        "Adults can occupy deep water while making shallow or surface-oriented foraging movements; juveniles are more vegetation-associated.",
      lightResponse:
        "Visual predator that can feed through daylight; warm calm periods often produce visible near-surface cruising without implying a feeding event.",
    },
    forageClasses: ["small_forage_fish", "larger_prey_fish", "crustaceans"],
    flowingPresentations: ["cross_current_retrieve", "stationary_bait", "downstream_retrieve"],
    stillPresentations: [
      "horizontal_retrieve",
      "stop_and_go",
      "live_natural_bait_suspension",
      "surface_retrieve",
    ],
    exceptions: [
      "Surface rolling or air gulping is not automatically feeding behavior.",
      "Gar eggs are toxic; this record never recommends consuming eggs or using spawning aggregations as a target cue.",
    ],
    geographic:
      "Large rivers, reservoirs, lakes, and backwaters across much of eastern and central North America.",
    sources: [
      { label: "NOAA Mississippi River longnose gar life-history synthesis", class: SRC.syn },
      { label: "State warmwater fish temperature syntheses for longnose gar", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "lepisosteus_oculatus",
    scientificName: "Lepisosteus oculatus",
    commonNames: ["Spotted gar"],
    group: "predator",
    nativeContext:
      "Native primarily to Mississippi and Gulf drainages, with limited Great Lakes occurrence; strongly associated with vegetated low-gradient water.",
    thermal: { preferredF: [72, 84], activeF: [60, 88], coldEdgeF: 52, warmEdgeF: 92 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spring spawning occurs in shallow vegetated margins, flooded timber, or backwater habitat; spawning sites are excluded from target guidance.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["eddy", "side_channel", "submerged_wood", "shallow_flat"],
      stillHolding: ["inside_weedline", "weed_edge", "wood", "shallow_flat", "inlet"],
      currentPreference:
        "Strongly favors slow pools, backwaters, swamps, sloughs, and vegetated margins rather than fast current.",
      depthTendency:
        "Often shallow to mid-depth around vegetation and timber, with surface excursions for air that are not necessarily feeding.",
      lightResponse:
        "Visual ambush feeding can occur through daylight; vegetation and stain reduce exposure and define approach lanes.",
    },
    forageClasses: ["small_forage_fish", "crustaceans", "aquatic_insects"],
    flowingPresentations: ["stationary_bait", "cross_current_retrieve", "pulse_jig"],
    stillPresentations: [
      "horizontal_retrieve",
      "stop_and_go",
      "live_natural_bait_suspension",
      "surface_retrieve",
    ],
    exceptions: [
      "Surface breathing is not a bite predictor.",
      "Spotted gar eggs are toxic and spawning vegetation is not a target recommendation.",
    ],
    geographic:
      "Low-gradient rivers, lakes, swamps, sloughs, and vegetated backwaters of the central and southern United States.",
    sources: [
      { label: "Texas Parks and Wildlife Department spotted gar account", class: SRC.agency },
      { label: "Illinois Department of Natural Resources spotted gar account", class: SRC.agency },
      { label: "Missouri Department of Conservation spotted gar account", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "ameiurus_nebulosus",
    scientificName: "Ameiurus nebulosus",
    commonNames: ["Brown bullhead"],
    group: "other",
    nativeContext:
      "Native to much of eastern North America and widely introduced; tolerant warmwater bottom feeder of ponds, lakes, reservoirs, and slow rivers.",
    thermal: { preferredF: [70, 80], activeF: [55, 86], coldEdgeF: 45, warmEdgeF: 90 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spawning occurs in protected shallow cavities or depressions as water warms; parental guarding is not a target cue.",
    },
    habitat: {
      waterTypes: ["stillwater", "flowing"],
      riverHolding: ["deep_pool", "eddy", "submerged_wood", "side_channel"],
      stillHolding: ["basin", "wood", "weed_edge", "inlet", "dock_shade"],
      currentPreference:
        "Prefers little to moderate current and soft-bottomed protected water rather than fast river lanes.",
      depthTendency:
        "Bottom-oriented, using deeper water or cover by day and moving shallower under darkness or stain.",
      lightResponse:
        "Strong low-light and night feeding tendency; scent and bottom contact often matter more than visual range.",
    },
    forageClasses: [
      "worms_annelids",
      "aquatic_insects",
      "crustaceans",
      "mollusks",
      "small_forage_fish",
    ],
    flowingPresentations: ["stationary_bait", "bottom_contact_drift", "pulse_jig"],
    stillPresentations: ["bottom_contact", "slow_drag", "live_natural_bait_suspension"],
    exceptions: [
      "Bullhead species are frequently misidentified; black, yellow, and brown bullheads should not silently share one record.",
      "Nocturnal activity does not imply surface feeding; this remains a bottom-oriented record.",
    ],
    geographic:
      "Ponds, lakes, reservoirs, oxbows, and slow rivers across eastern/central North America and introduced western waters.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species brown bullhead profile", class: SRC.agency },
      {
        label: "EPA freshwater fish temperature criteria synthesis for brown bullhead",
        class: SRC.agency,
      },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "ameiurus_melas",
    scientificName: "Ameiurus melas",
    commonNames: ["Black bullhead"],
    group: "other",
    nativeContext:
      "Native central North American bullhead with broad introductions; especially tolerant of warm, turbid, low-gradient water.",
    thermal: { preferredF: [72, 82], activeF: [58, 88], coldEdgeF: 48, warmEdgeF: 92 },
    spawning: {
      seasons: ["spring", "early_summer", "summer"],
      note: "Late-spring and summer cavity/depression spawning occurs in protected shallow habitat; family groups are not target aggregations.",
    },
    habitat: {
      waterTypes: ["stillwater", "flowing"],
      riverHolding: ["eddy", "deep_pool", "side_channel", "submerged_wood"],
      stillHolding: ["basin", "wood", "weed_edge", "shallow_flat", "inlet"],
      currentPreference:
        "Strong fit is slow, turbid, soft-bottomed water with little current; highly tolerant of conditions that exclude many sight-oriented fishes.",
      depthTendency:
        "Bottom-oriented, often shallow at night and deeper or tighter to cover in bright conditions.",
      lightResponse:
        "Low-light and nocturnal feeding is common; olfaction reduces dependence on visibility.",
    },
    forageClasses: [
      "worms_annelids",
      "aquatic_insects",
      "crustaceans",
      "mollusks",
      "small_forage_fish",
    ],
    flowingPresentations: ["stationary_bait", "bottom_contact_drift"],
    stillPresentations: ["bottom_contact", "slow_drag", "live_natural_bait_suspension"],
    exceptions: [
      "Strong odor and bottom delivery can matter more than lure-like visual matching.",
      "Do not collapse all bullheads into this thermal and habitat profile.",
    ],
    geographic:
      "Warm ponds, lakes, reservoirs, backwaters, and sluggish rivers across the central continent and introduced ranges.",
    sources: [
      {
        label: "Washington Department of Fish and Wildlife black bullhead sportfish account",
        class: SRC.agency,
      },
      { label: "North American bullhead life-history syntheses", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "coregonus_artedi",
    scientificName: "Coregonus artedi",
    commonNames: ["Cisco", "Lake herring"],
    group: "trout_salmon",
    nativeContext:
      "Native pelagic coregonid of the Great Lakes and northern inland lakes; a major forage species with recreational value in some regions.",
    thermal: { preferredF: [50, 60], activeF: [40, 65], coldEdgeF: 34, warmEdgeF: 70 },
    spawning: {
      seasons: ["late_fall", "winter"],
      note: "Fall-to-winter spawning ranges from shallow shoals to deep offshore habitat depending on stock; spawning depth is never given as a target location.",
    },
    habitat: {
      waterTypes: ["stillwater"],
      riverHolding: [],
      stillHolding: ["suspended_open", "thermocline_edge", "basin", "drop_off", "submerged_hump"],
      currentPreference:
        "Pelagic lake fish whose position follows temperature, oxygen, plankton, prey fields, and basin circulation rather than cover.",
      depthTendency:
        "Highly depth-variable by season, time of day, and life stage; often suspended and capable of broad diel vertical movement.",
      lightResponse:
        "Light and plankton movement can shift schools vertically; bright conditions commonly reinforce deeper usable layers in clear water.",
    },
    forageClasses: ["zooplankton", "crustaceans", "small_forage_fish", "aquatic_insects"],
    flowingPresentations: [],
    stillPresentations: ["vertical_jig", "horizontal_retrieve", "suspend_pause", "trolling"],
    exceptions: [
      "Cisco are a major prey species for other predators; predator presence should not be inferred from a cisco record alone.",
      "A pelagic school is mobile biological structure, not a hotspot coordinate.",
    ],
    geographic:
      "Great Lakes and cool northern inland lakes with adequate oxygenated coldwater habitat.",
    sources: [
      { label: "U.S. Fish and Wildlife Service cisco species account", class: SRC.agency },
      { label: "USGS cisco and bloater culture / ecology manual", class: SRC.agency },
      { label: "Peer-reviewed cisco oxythermal habitat literature", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "osmerus_mordax",
    scientificName: "Osmerus mordax",
    commonNames: ["Rainbow smelt"],
    group: "other",
    nativeContext:
      "Native to Atlantic coastal drainages and landlocked in some northern lakes; introduced through much of the Great Lakes and other inland systems.",
    thermal: { preferredF: [42, 55], activeF: [34, 62], coldEdgeF: 32, warmEdgeF: 68 },
    spawning: {
      seasons: ["early_spring", "spring"],
      note: "Spawning follows ice-out in very cold tributaries or shoreline habitat; this record excludes tributary aggregation targeting from its reviewed presentation set.",
    },
    habitat: {
      waterTypes: ["stillwater"],
      riverHolding: [],
      stillHolding: ["suspended_open", "thermocline_edge", "basin", "inlet", "drop_off"],
      currentPreference:
        "Reviewed here as a lake / reservoir pelagic fish; spawning runs are intentionally not modeled as flowing-water targets.",
      depthTendency:
        "Adults use cool pelagic water and can make strong diel vertical movements; seasonal depth may range from nearshore to very deep basins.",
      lightResponse:
        "Low light often permits higher positioning while clear bright conditions favor deeper pelagic layers.",
    },
    forageClasses: ["zooplankton", "crustaceans", "aquatic_insects", "small_forage_fish"],
    flowingPresentations: [],
    stillPresentations: ["vertical_jig", "suspend_pause", "horizontal_retrieve", "trolling"],
    exceptions: [
      "Tributary spawning concentrations are intentionally excluded from this angling presentation record.",
      "In many inland systems rainbow smelt are nonnative and can alter native food webs; local status matters.",
    ],
    geographic:
      "Atlantic coastal waters and northern inland lakes, including introduced Great Lakes populations and other coldwater systems.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species rainbow smelt profile", class: SRC.agency },
      { label: "Maine Department of Marine Resources rainbow smelt biology", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "morone_americana",
    scientificName: "Morone americana",
    commonNames: ["White perch"],
    group: "other",
    nativeContext:
      "Atlantic-slope euryhaline species that also supports established landlocked freshwater populations, including Great Lakes and inland reservoirs.",
    thermal: { preferredF: [60, 72], activeF: [48, 80], coldEdgeF: 42, warmEdgeF: 84 },
    spawning: {
      seasons: ["spring"],
      note: "Spring spawning moves fish from deeper water toward rivers, tributaries, or shallow lake habitat; runs and spawning areas are not secret-location outputs.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["tributary_mouth", "run", "deep_pool", "current_break"],
      stillHolding: ["basin", "drop_off", "point", "inlet", "suspended_open"],
      currentPreference:
        "Uses moderate river current during seasonal movement but otherwise behaves as a schooling open-water or basin-edge fish.",
      depthTendency:
        "Often deeper by day and seasonally offshore, with shallower movement around forage, wind, low light, and spawning migrations.",
      lightResponse:
        "Schooling feed can move shallower under low light or wind; bright clear conditions commonly favor depth.",
    },
    forageClasses: ["small_forage_fish", "crustaceans", "aquatic_insects", "zooplankton", "eggs"],
    flowingPresentations: ["cross_current_retrieve", "pulse_jig", "bottom_contact_drift"],
    stillPresentations: ["vertical_jig", "horizontal_retrieve", "stop_and_go", "drop_presentation"],
    exceptions: [
      "White perch can be invasive outside its native range; local regulations and ecological status supersede generic sportfish assumptions.",
      "Egg predation is an ecological fact, not a recommendation to fish active spawning grounds of other species.",
    ],
    geographic:
      "Atlantic coastal rivers and estuaries plus landlocked freshwater populations in the Great Lakes and other inland systems.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species white perch profile", class: SRC.agency },
      { label: "Great Lakes white perch diet and ecology literature", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "anguilla_rostrata",
    scientificName: "Anguilla rostrata",
    commonNames: ["American eel"],
    group: "other",
    nativeContext:
      "Catadromous Atlantic-drainage fish that spends much of its growth phase in freshwater rivers, streams, lakes, and estuaries before migrating to sea to spawn.",
    thermal: { preferredF: [58, 68], activeF: [45, 78], coldEdgeF: 40, warmEdgeF: 82 },
    spawning: {
      seasons: ["fall"],
      note: "American eels do not spawn in freshwater. Fall is used here to flag downstream silver-eel migration toward the ocean, not a freshwater spawning event.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: [
        "deep_pool",
        "submerged_wood",
        "undercut_bank",
        "current_break",
        "side_channel",
      ],
      stillHolding: ["wood", "basin", "drop_off", "weed_edge", "inlet"],
      currentPreference:
        "Smaller eels can use stronger current, while larger yellow eels more often occupy slower deep water, cover, soft bottom, and margins.",
      depthTendency:
        "Benthic and shelter-oriented by day; emerges from cover and may move shallower at night to feed.",
      lightResponse:
        "Strongly nocturnal; daylight usually favors snags, plants, burrows, tubes, depth, and other shelter.",
    },
    forageClasses: [
      "crustaceans",
      "aquatic_insects",
      "worms_annelids",
      "small_forage_fish",
      "mollusks",
      "amphibians",
    ],
    flowingPresentations: ["stationary_bait", "bottom_contact_drift", "pulse_jig"],
    stillPresentations: ["bottom_contact", "slow_drag", "live_natural_bait_suspension"],
    exceptions: [
      "Local harvest rules vary substantially because American eel abundance and management status vary by jurisdiction.",
      "Downstream silver-eel migration is not a spawning-site targeting cue.",
    ],
    geographic:
      "Atlantic and Gulf coastal drainages from Canada through the eastern United States, with freshwater residency extending far inland where passage remains connected.",
    sources: [
      { label: "U.S. Fish and Wildlife Service American eel species account", class: SRC.agency },
      {
        label: "USGS Nonindigenous Aquatic Species American eel ecology profile",
        class: SRC.agency,
      },
      { label: "Peer-reviewed American eel temperature-preference literature", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "alosa_sapidissima",
    scientificName: "Alosa sapidissima",
    commonNames: ["American shad"],
    group: "other",
    nativeContext:
      "Anadromous Atlantic-coast clupeid with introduced Pacific populations; adults ascend freshwater rivers in spring to spawn.",
    thermal: { preferredF: [50, 65], activeF: [45, 70], coldEdgeF: 40, warmEdgeF: 75 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Adults ascend rivers to broadcast-spawn in spring, with peak spawning near the mid-60s°F in many systems. River presence is migration biology, not a forage-match assumption.",
    },
    habitat: {
      waterTypes: ["flowing"],
      riverHolding: ["run", "pool_head", "current_break", "tributary_mouth", "tailwater"],
      stillHolding: [],
      currentPreference:
        "Migratory adults travel through sustained river flow and pause in velocity transitions, current breaks, and staging water as conditions change.",
      depthTendency:
        "Often mid-column to lower during river migration, shifting with flow, temperature, turbidity, and daylight.",
      lightResponse:
        "Spawning activity is often strongest from dusk into darkness, but migration and angling encounters occur throughout the day depending on flow and turbidity.",
    },
    forageClasses: ["zooplankton", "crustaceans", "small_forage_fish"],
    flowingPresentations: ["cross_current_retrieve", "downstream_retrieve", "swing", "pulse_jig"],
    stillPresentations: [],
    exceptions: [
      "Freshwater adults are primarily on a spawning migration; presentation logic is interception / reaction, not proof of active feeding.",
      "Dams, fishways, and known spawning concentrations are not treated as secret aggregation targets.",
    ],
    geographic:
      "Atlantic coastal rivers from Florida to Canada, with established introduced populations along the Pacific coast.",
    sources: [
      { label: "U.S. Fish and Wildlife Service American shad species account", class: SRC.agency },
      {
        label: "Atlantic-coast American shad management and life-history syntheses",
        class: SRC.syn,
      },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
];
