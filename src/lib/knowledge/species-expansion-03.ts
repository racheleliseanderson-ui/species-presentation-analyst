import type { SpeciesRecord } from "../protocol/types.ts";

const SRC = {
  agency: "agency" as const,
  peer: "peer_reviewed" as const,
  syn: "synthesis" as const,
};

/**
 * Reviewed expansion batch added 2026-08-27.
 *
 * Scope: additional North American game, nongame, migratory, and conservation-sensitive
 * species. Target-status metadata separates biological context from ordinary angling guidance.
 */
export const SPECIES_EXPANSION_03: SpeciesRecord[] = [
  {
    id: "salvelinus_confluentus",
    scientificName: "Salvelinus confluentus",
    commonNames: ["Bull trout"],
    group: "trout_salmon",
    targetStatus: "conservation_sensitive",
    targetStatusNote:
      "Lower-48 U.S. bull trout remain listed as threatened under the Endangered Species Act. Context only — no presentation guidance.",
    nativeContext:
      "Native coldwater char of northwestern North America with resident, fluvial, adfluvial, and anadromous life-history forms.",
    thermal: { preferredF: [44, 54], activeF: [38, 60], coldEdgeF: 34, warmEdgeF: 64 },
    spawning: {
      seasons: ["late_summer", "fall", "late_fall"],
      note: "Late-summer through fall spawning in very cold, clean, connected tributary habitat; redds and spawning concentrations are never targeting outputs.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["deep_pool", "pool_head", "run", "seam", "boulder_pocket", "tributary_mouth"],
      stillHolding: ["drop_off", "inlet", "basin", "thermocline_edge", "rocky_shoreline"],
      currentPreference:
        "Uses cold connected rivers and tributaries with complex cover; migratory adults may move between large rivers or lakes and spawning tributaries.",
      depthTendency:
        "Often associated with depth, cover, and cold-water refuge; larger migratory fish can be strongly piscivorous.",
      lightResponse:
        "Low light can support shallower movement, but habitat temperature and connectivity are more important constraints than light alone.",
    },
    forageClasses: ["small_forage_fish", "larger_prey_fish", "aquatic_insects", "crustaceans"],
    flowingPresentations: [],
    stillPresentations: [],
    exceptions: [
      "Do not use this record to infer targetable spawning tributaries, redds, or migration bottlenecks.",
      "Dolly Varden is a different species and must not resolve to this record.",
    ],
    geographic:
      "Pacific Northwest and western Canada, with lower-48 populations concentrated in portions of Washington, Oregon, Idaho, Montana, and Nevada; legal protections vary by jurisdiction.",
    sources: [
      { label: "U.S. Fish & Wildlife Service bull trout species profile and 5-year status review", class: SRC.agency },
      { label: "USFWS bull trout Species Status Assessment", class: SRC.agency },
      { label: "Rieman & McIntyre bull trout habitat and conservation literature", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "salmo_salar_anadromous",
    scientificName: "Salmo salar (anadromous)",
    commonNames: ["Atlantic salmon"],
    group: "trout_salmon",
    targetStatus: "conservation_sensitive",
    targetStatusNote:
      "Wild sea-run Atlantic salmon are protected in the United States and commercial and recreational fishing is prohibited. This record is context-only and intentionally separate from landlocked Atlantic salmon fisheries.",
    nativeContext:
      "Anadromous Atlantic salmon hatch and rear in freshwater, migrate to sea, and return to natal river systems to spawn.",
    thermal: { preferredF: [45, 57], activeF: [38, 62], coldEdgeF: 34, warmEdgeF: 68 },
    spawning: {
      seasons: ["fall", "late_fall"],
      note: "Adults return to cold gravel-bed rivers and streams to spawn in fall; migratory holding pools and redds are conservation context, not fishing guidance.",
    },
    habitat: {
      waterTypes: ["flowing"],
      riverHolding: ["riffle_to_run", "run", "pool_head", "deep_pool", "tributary_mouth"],
      stillHolding: [],
      currentPreference:
        "Juveniles use well-oxygenated riffle-run habitat; returning adults require connected river corridors, pools, and suitable gravel spawning habitat.",
      depthTendency:
        "Life stage governs depth: parr use shallow fast nursery water while returning adults use deeper pools and runs between migration movements.",
      lightResponse:
        "Light affects movement and cover use, but migration stage, discharge, temperature, and connectivity dominate freshwater positioning.",
    },
    forageClasses: ["aquatic_insects", "emerging_insects", "terrestrial_insects", "small_forage_fish", "crustaceans"],
    flowingPresentations: [],
    stillPresentations: [],
    exceptions: [
      "This record covers wild anadromous Atlantic salmon, not stocked or landlocked Atlantic salmon fisheries.",
      "Do not infer legal fishing opportunity from biological presence.",
    ],
    geographic:
      "North Atlantic drainages; the remaining native U.S. wild anadromous populations are in Maine and are protected under the Endangered Species Act.",
    sources: [
      { label: "NOAA Fisheries Atlantic Salmon protected species profile", class: SRC.agency },
      { label: "NOAA Atlantic Salmon conservation and management program", class: SRC.agency },
      { label: "Atlantic salmon freshwater habitat literature synthesis", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "acipenser_fulvescens",
    scientificName: "Acipenser fulvescens",
    commonNames: ["Lake sturgeon"],
    group: "other",
    targetStatus: "regulated_context",
    targetStatusNote:
      "Lake sturgeon harvest and angling are heavily regulated and differ sharply by jurisdiction. Verify current regulations before treating this biological record as a legal fishing opportunity.",
    nativeContext:
      "Long-lived native sturgeon of large lakes and river systems in central and eastern North America; populations recover slowly from overharvest and habitat fragmentation.",
    thermal: { preferredF: [50, 66], activeF: [40, 76], coldEdgeF: 34, warmEdgeF: 82 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Adults migrate into rocky, swift river habitat to spawn as spring water warms; spawning aggregations are never emitted as targeting locations.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["deep_pool", "run", "current_break", "pool_tail", "tailwater"],
      stillHolding: ["basin", "drop_off", "rocky_shoreline", "submerged_hump", "inlet"],
      currentPreference:
        "Bottom-oriented in large rivers and lakes; outside spawning movement, adults commonly use deep runs, channels, and current-influenced benthic habitat.",
      depthTendency:
        "Strong benthic association, often in deeper main-channel or lake-bottom habitat with seasonal movements between feeding and spawning areas.",
      lightResponse:
        "Bottom orientation and depth reduce the importance of surface light; low light can support movement but substrate and flow dominate habitat use.",
    },
    forageClasses: ["aquatic_insects", "crustaceans", "mollusks", "worms_annelids", "small_forage_fish", "eggs"],
    flowingPresentations: ["stationary_bait", "bottom_contact_drift"],
    stillPresentations: ["bottom_contact", "slow_drag", "live_natural_bait_suspension"],
    exceptions: [
      "Extreme longevity and late maturity make local population status more important than generic abundance assumptions.",
      "Spawning migrations and known spawning reefs/riffles are not target layers.",
    ],
    geographic:
      "Great Lakes, Mississippi, Hudson Bay, and connected central/eastern North American basins; restoration and fishery status vary widely.",
    sources: [
      { label: "U.S. Fish & Wildlife Service lake sturgeon species profile", class: SRC.agency },
      { label: "State and tribal lake sturgeon restoration plans", class: SRC.agency },
      { label: "Lake sturgeon movement and benthic-feeding literature", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "polyodon_spathula",
    scientificName: "Polyodon spathula",
    commonNames: ["Paddlefish"],
    group: "other",
    targetStatus: "regulated_context",
    targetStatusNote:
      "Paddlefish fisheries often use special seasons, permits, and legal methods. This record provides biology and positioning context but intentionally emits no presentation or capture-method guidance.",
    nativeContext:
      "Ancient native filter-feeding fish of the Mississippi River basin, dependent on large connected rivers and reservoirs.",
    thermal: { preferredF: [58, 74], activeF: [48, 82], coldEdgeF: 40, warmEdgeF: 86 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spring high-water cues trigger long migrations to silt-free gravel spawning habitat; aggregation routes are not targeting outputs.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["deep_pool", "run", "current_break", "tailwater", "tributary_mouth"],
      stillHolding: ["suspended_open", "basin", "inlet", "drop_off"],
      currentPreference:
        "Uses large deep slow-to-moderate river corridors and reservoir open water; movement can track discharge and plankton-rich water masses.",
      depthTendency:
        "Pelagic to mid-depth rather than structure-bound; depth follows flow, plankton distribution, and seasonal movement.",
      lightResponse:
        "Light is secondary to plankton and hydrology, though vertical distribution can shift through the day.",
    },
    forageClasses: ["zooplankton"],
    flowingPresentations: [],
    stillPresentations: [],
    exceptions: [
      "Paddlefish are filter feeders; lure-style forage matching is not biologically appropriate.",
      "Do not convert migration timing into snagging or aggregation instructions.",
    ],
    geographic:
      "Mississippi River basin and connected reservoirs, with restoration and stocking in portions of the historical range.",
    sources: [
      { label: "U.S. Fish & Wildlife Service paddlefish species profile", class: SRC.agency },
      { label: "USFWS paddlefish conservation and hatchery literature", class: SRC.agency },
      { label: "Paddlefish movement and filter-feeding ecology literature", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "lepomis_auritus",
    scientificName: "Lepomis auritus",
    commonNames: ["Redbreast sunfish"],
    group: "bass_panfish",
    nativeContext:
      "Native eastern North American sunfish common in warm rivers, creeks, and lakes with rock, sand, vegetation, and moderate cover.",
    thermal: { preferredF: [68, 80], activeF: [58, 84], coldEdgeF: 50, warmEdgeF: 88 },
    spawning: {
      seasons: ["spring", "early_summer", "summer"],
      note: "Spawns in protected sand or gravel shallows as water warms through roughly the upper 60s into the 70s.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["pool_tail", "run", "current_break", "boulder_pocket", "submerged_wood"],
      stillHolding: ["rocky_shoreline", "weed_edge", "wood", "shallow_flat", "dock_shade"],
      currentPreference:
        "More comfortable in moving water than bluegill; often uses rocky or sandy pools, moderate current margins, and cover edges.",
      depthTendency:
        "Shallow to mid-depth around rock, wood, and vegetation; deeper when bright, cold, or pressured.",
      lightResponse:
        "Daylight sight feeder, with shade and broken light improving shallow cover use.",
    },
    forageClasses: ["aquatic_insects", "crustaceans", "mollusks", "small_forage_fish", "worms_annelids"],
    flowingPresentations: ["dead_drift", "stationary_bait", "pulse_jig"],
    stillPresentations: ["drop_presentation", "slow_drag", "surface_retrieve", "live_natural_bait_suspension"],
    exceptions: ["Bed colonies are a seasonal reproductive condition, not a default location recommendation."],
    geographic: "Atlantic-slope and eastern interior waters from southern Canada through much of the southeastern United States.",
    sources: [
      { label: "North Carolina Wildlife Resources Commission redbreast sunfish profile", class: SRC.agency },
      { label: "South Carolina DNR redbreast sunfish habitat and diet summary", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "lepomis_gulosus",
    scientificName: "Lepomis gulosus",
    commonNames: ["Warmouth"],
    group: "bass_panfish",
    nativeContext:
      "Native southeastern and central North American sunfish strongly associated with woody debris, vegetation, swamps, ponds, and quiet stream margins.",
    thermal: { preferredF: [70, 82], activeF: [60, 86], coldEdgeF: 52, warmEdgeF: 90 },
    spawning: {
      seasons: ["spring", "early_summer", "summer"],
      note: "Spawning begins as water reaches about 71°F and may continue through summer around protected cover.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["eddy", "side_channel", "submerged_wood", "current_break", "deep_pool"],
      stillHolding: ["wood", "weed_edge", "inside_weedline", "shallow_flat", "dock_shade"],
      currentPreference:
        "Prefers quiet or slow water and uses stumps, woody debris, vegetation, and other cover as ambush habitat.",
      depthTendency:
        "Usually shallow to mid-depth tight to cover; can use deeper wood or vegetation edges during bright or cool periods.",
      lightResponse:
        "A sight-feeding ambush fish; shade and structural cover are especially important under high sun.",
    },
    forageClasses: ["aquatic_insects", "crustaceans", "mollusks", "small_forage_fish"],
    flowingPresentations: ["stationary_bait", "pulse_jig", "cross_current_retrieve"],
    stillPresentations: ["drop_presentation", "slow_drag", "stop_and_go", "surface_retrieve"],
    exceptions: ["Warmouth and rock bass are distinct despite overlapping regional nicknames such as goggle-eye."],
    geographic: "Great Lakes, Mississippi, Atlantic, and Gulf drainages, strongest in warm low-gradient waters of the South and lower Midwest.",
    sources: [
      { label: "Texas Parks and Wildlife warmouth species account", class: SRC.agency },
      { label: "Florida Museum warmouth species profile", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "ameiurus_natalis",
    scientificName: "Ameiurus natalis",
    commonNames: ["Yellow bullhead"],
    group: "other",
    nativeContext:
      "Native central and eastern North American bullhead tolerant of warm, slow, vegetated, and turbid water.",
    thermal: { preferredF: [68, 80], activeF: [58, 86], coldEdgeF: 50, warmEdgeF: 90 },
    spawning: {
      seasons: ["late_spring", "early_summer"].filter(() => true) as never,
      note: "Late-spring to early-summer cavity/nest spawner in mud or protected shallow habitat; both parents guard eggs and fry.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["eddy", "side_channel", "deep_pool", "submerged_wood", "current_break"],
      stillHolding: ["wood", "weed_edge", "shallow_flat", "basin", "inlet"],
      currentPreference:
        "Favors slow current, backwaters, protected pools, and vegetated or woody margins rather than fast main-channel flow.",
      depthTendency:
        "Bottom-oriented; can move shallower at night and around food-rich margins.",
      lightResponse:
        "Low-light and nocturnal feeding are common, though turbid water can extend activity into daylight.",
    },
    forageClasses: ["aquatic_insects", "crustaceans", "worms_annelids", "mollusks", "small_forage_fish"],
    flowingPresentations: ["stationary_bait", "bottom_contact_drift"],
    stillPresentations: ["bottom_contact", "slow_drag", "live_natural_bait_suspension"],
    exceptions: ["Do not assume every mud-bottom bullhead is yellow bullhead; chin-barbel color and local range matter."],
    geographic: "Central and eastern United States into portions of southern Canada, with introduced populations beyond parts of the native range.",
    sources: [
      { label: "Texas Parks and Wildlife yellow bullhead species account", class: SRC.agency },
      { label: "State bullhead management and identification literature", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "lepisosteus_platostomus",
    scientificName: "Lepisosteus platostomus",
    commonNames: ["Shortnose gar"],
    group: "predator",
    nativeContext:
      "Native Mississippi-basin gar adapted to large rivers, backwaters, oxbows, and large pools; more turbidity-tolerant than several other gar species.",
    thermal: { preferredF: [68, 80], activeF: [58, 86], coldEdgeF: 50, warmEdgeF: 90 },
    spawning: {
      seasons: ["early_summer", "summer"],
      note: "Late-spring through summer spawning in quiet shallow water, with adhesive eggs scattered over vegetation or submerged objects.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["side_channel", "eddy", "deep_pool", "current_break", "tributary_mouth"],
      stillHolding: ["shallow_flat", "weed_edge", "inlet", "wood", "basin"],
      currentPreference:
        "Uses large-river backwaters and slower margins rather than sustained fast current; turbidity is less limiting than for longnose gar.",
      depthTendency:
        "Often shallow to mid-depth near backwaters and prey-rich margins, with access to deeper pools for refuge.",
      lightResponse:
        "Visual ambush predator capable of feeding in daylight; low light and stain can reduce the need for deep or covered positioning.",
    },
    forageClasses: ["small_forage_fish", "larger_prey_fish", "aquatic_insects", "crustaceans"],
    flowingPresentations: ["cross_current_retrieve", "downstream_retrieve", "stationary_bait"],
    stillPresentations: ["horizontal_retrieve", "stop_and_go", "live_natural_bait_suspension"],
    exceptions: ["Gar regulations and legal methods vary significantly by jurisdiction; verify local rules."],
    geographic: "Mississippi River drainage from the Gulf Coast north into the central Great Plains and Ohio River system.",
    sources: [
      { label: "Texas Parks and Wildlife shortnose gar species account", class: SRC.agency },
      { label: "Missouri Department of Conservation shortnose gar field guide", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "morone_mississippiensis",
    scientificName: "Morone mississippiensis",
    commonNames: ["Yellow bass"],
    group: "other",
    nativeContext:
      "Native temperate bass of the central Mississippi Valley, occupying large streams, backwaters, lakes, reservoirs, and oxbows.",
    thermal: { preferredF: [60, 74], activeF: [50, 80], coldEdgeF: 44, warmEdgeF: 84 },
    spawning: {
      seasons: ["spring"],
      note: "Spring spawner that can move into tributaries or shallow lake zones as water warms; exact aggregation points are not emitted.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["deep_pool", "eddy", "current_break", "tributary_mouth", "run"],
      stillHolding: ["basin", "suspended_open", "drop_off", "point", "inlet"],
      currentPreference:
        "Often favors quieter pools and backwaters in large rivers, while reservoir fish can school in open water around forage.",
      depthTendency:
        "Schooling mid-column predator that tracks small forage fish; deeper pools and basins become more important outside shallow feeding windows.",
      lightResponse:
        "Wind, stain, and low light can bring schools shallower; bright clear conditions commonly reinforce deeper positioning.",
    },
    forageClasses: ["small_forage_fish", "aquatic_insects", "crustaceans", "zooplankton"],
    flowingPresentations: ["cross_current_retrieve", "pulse_jig", "downstream_retrieve"],
    stillPresentations: ["horizontal_retrieve", "vertical_jig", "stop_and_go"],
    exceptions: ["Do not collapse yellow bass into white bass; habitat overlap does not erase species-level differences."],
    geographic: "Central Mississippi Valley and associated lowland river-reservoir systems, with scattered introduced populations.",
    sources: [
      { label: "Missouri Department of Conservation yellow bass field guide", class: SRC.agency },
      { label: "State temperate-bass management literature", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "morone_hybrid_wiper",
    scientificName: "Morone chrysops × Morone saxatilis",
    commonNames: ["Hybrid striped bass", "Wiper"],
    group: "other",
    nativeContext:
      "Artificial white bass × striped bass hybrid stocked in reservoirs and rivers to provide a pelagic predator and sport fishery.",
    thermal: { preferredF: [60, 72], activeF: [50, 78], coldEdgeF: 44, warmEdgeF: 82 },
    spawning: {
      seasons: ["spring"],
      note: "Sterile hybrids may make spring tributary movements with white bass but do not establish a normal reproductive run.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["tailwater", "current_break", "run", "tributary_mouth", "deep_pool"],
      stillHolding: ["suspended_open", "point", "drop_off", "inlet", "thermocline_edge"],
      currentPreference:
        "Strongly attracted to current edges, tailwaters, feeder-creek plumes, and other places where moving water concentrates pelagic forage.",
      depthTendency:
        "Pelagic and forage-following; summer depth is constrained by the combined temperature-oxygen envelope.",
      lightResponse:
        "Low light, wind, and current can move schools shallower; bright stable periods often push fish and forage deeper.",
    },
    forageClasses: ["small_forage_fish", "crustaceans", "aquatic_insects"],
    flowingPresentations: ["cross_current_retrieve", "downstream_retrieve", "swing", "pulse_jig"],
    stillPresentations: ["horizontal_retrieve", "trolling", "stop_and_go", "vertical_jig"],
    exceptions: [
      "Stocking determines presence; habitat alone does not establish that a water contains hybrid striped bass.",
      "Do not infer reproduction from spring upstream movement; common wiper crosses are functionally sterile.",
    ],
    geographic: "Stocked reservoirs and river systems across much of the United States; distribution is management-created rather than naturally continuous.",
    sources: [
      { label: "Missouri Department of Conservation hybrid striped bass field guide", class: SRC.agency },
      { label: "Kansas Department of Wildlife & Parks striped bass hybrid management plan", class: SRC.agency },
      { label: "Kentucky hybrid striped bass management literature", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "hiodon_alosoides",
    scientificName: "Hiodon alosoides",
    commonNames: ["Goldeye"],
    group: "other",
    nativeContext:
      "Native cool-water hiodontid of large interior rivers and some connected lakes, with eyes adapted to dim and turbid water.",
    thermal: { preferredF: [55, 68], activeF: [46, 74], coldEdgeF: 40, warmEdgeF: 78 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spawns in spring to early summer in large river systems; exact spawning concentrations are not used as target recommendations.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["run", "deep_pool", "current_break", "pool_tail", "eddy"],
      stillHolding: ["shallow_flat", "suspended_open", "inlet", "drop_off"],
      currentPreference:
        "Uses large-river current and eddy systems, often feeding in the upper or middle water column where drifting or swimming prey is available.",
      depthTendency:
        "Mid-column to near-surface during feeding, with deeper holding in bright or cold conditions.",
      lightResponse:
        "Large light-sensitive eyes make low light and turbid water especially plausible feeding windows.",
    },
    forageClasses: ["aquatic_insects", "emerging_insects", "terrestrial_insects", "small_forage_fish", "crustaceans"],
    flowingPresentations: ["surface_drift", "cross_current_retrieve", "swing", "downstream_retrieve"],
    stillPresentations: ["horizontal_retrieve", "surface_retrieve", "stop_and_go"],
    exceptions: ["Goldeye and mooneye overlap geographically but should not be silently merged."],
    geographic: "Large rivers of central and western Canada and the north-central United States, including major Prairie and Mississippi-basin systems.",
    sources: [
      { label: "Government of Alberta goldeye species profile", class: SRC.agency },
      { label: "Canadian and U.S. hiodontid life-history literature", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "hiodon_tergisus",
    scientificName: "Hiodon tergisus",
    commonNames: ["Mooneye"],
    group: "other",
    nativeContext:
      "Native cool-water hiodontid of clear rivers and shallow lake waters in central and eastern North America.",
    thermal: { preferredF: [55, 68], activeF: [46, 74], coldEdgeF: 40, warmEdgeF: 78 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spring to early-summer spawner in river and connected-water habitat; timing varies with latitude and flow.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["run", "pool_tail", "current_break", "seam", "deep_pool"],
      stillHolding: ["shallow_flat", "rocky_shoreline", "inlet", "drop_off"],
      currentPreference:
        "Uses clear river runs, pool margins, and current breaks, generally with less affinity for highly turbid water than goldeye.",
      depthTendency:
        "Upper-to-mid column while feeding, with deeper pool use when bright, cold, or inactive.",
      lightResponse:
        "Feeds visually and can use low-light surface windows, but clear-water populations may remain active through daylight.",
    },
    forageClasses: ["aquatic_insects", "emerging_insects", "terrestrial_insects", "small_forage_fish", "crustaceans"],
    flowingPresentations: ["dead_drift", "surface_drift", "swing", "cross_current_retrieve"],
    stillPresentations: ["horizontal_retrieve", "surface_retrieve", "stop_and_go"],
    exceptions: ["Do not infer goldeye-style turbidity preference from superficial similarity."],
    geographic: "Southern Ontario and connected central/eastern North American river systems, including portions of the Great Lakes and Mississippi basins.",
    sources: [
      { label: "Ontario mooneye species profile", class: SRC.agency },
      { label: "Hiodontidae life-history synthesis", class: SRC.syn },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "ictiobus_cyprinellus",
    scientificName: "Ictiobus cyprinellus",
    commonNames: ["Bigmouth buffalo"],
    group: "other",
    targetStatus: "regulated_context",
    targetStatusNote:
      "Bigmouth buffalo can live for more than a century and some populations show prolonged recruitment failure. Regulations and harvest norms vary; verify jurisdiction and avoid assuming high resilience from local abundance.",
    nativeContext:
      "Native large-bodied sucker-family fish of the Hudson Bay, lower Great Lakes, and Mississippi basins; unusually plankton-oriented for a buffalo fish.",
    thermal: { preferredF: [64, 78], activeF: [54, 84], coldEdgeF: 46, warmEdgeF: 88 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Brief spring spawning in flooded margins, marshes, and tributary habitat around roughly 60–65°F; spawning concentrations are not target outputs.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["deep_pool", "eddy", "side_channel", "current_break", "run"],
      stillHolding: ["shallow_flat", "basin", "inlet", "weed_edge", "drop_off"],
      currentPreference:
        "Prefers slow river channels, pools, backwaters, reservoirs, and turbid water rather than sustained fast current.",
      depthTendency:
        "Demersal to mid-depth, often in water shallower than deep-channel species, while filtering plankton or feeding on benthos.",
      lightResponse:
        "Turbidity and plankton distribution generally matter more than light alone; clearer water can reinforce deeper or less exposed positioning.",
    },
    forageClasses: ["zooplankton", "aquatic_insects", "crustaceans", "worms_annelids"],
    flowingPresentations: ["stationary_bait", "bottom_contact_drift"],
    stillPresentations: ["bottom_contact", "slow_drag", "suspended_stationary"],
    exceptions: [
      "Do not treat buffalo as carp; feeding ecology and anatomy differ.",
      "Long lifespan and episodic recruitment make harvest context materially important.",
    ],
    geographic: "Hudson Bay, lower Great Lakes, Mississippi, and connected interior basins, with some introduced populations beyond the native range.",
    sources: [
      { label: "USGS Bigmouth Buffalo species profile", class: SRC.agency },
      { label: "USGS/FWS Bigmouth Buffalo habitat suitability literature", class: SRC.agency },
      { label: "Lackmann et al. validated centenarian longevity research", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "ictiobus_bubalus",
    scientificName: "Ictiobus bubalus",
    commonNames: ["Smallmouth buffalo"],
    group: "other",
    targetStatus: "regulated_context",
    targetStatusNote:
      "Smallmouth buffalo are long-lived native nongame fish in many jurisdictions and management status varies. Verify local harvest and gear rules before treating this record as a fishing recommendation.",
    nativeContext:
      "Native large-river and reservoir buffalo fish of the Mississippi and Gulf-slope drainages, with a downward-oriented sucker mouth and strong benthic feeding behavior.",
    thermal: { preferredF: [64, 78], activeF: [54, 84], coldEdgeF: 46, warmEdgeF: 88 },
    spawning: {
      seasons: ["spring", "early_summer"],
      note: "Spring spawning commonly begins around 60–65°F with eggs broadcast over vegetation, mud, and flooded margins.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["deep_pool", "run", "current_break", "pool_tail", "eddy"],
      stillHolding: ["drop_off", "basin", "point", "inlet", "shallow_flat"],
      currentPreference:
        "Common in large rivers and reservoirs, generally using moderate-to-slow channel water and bottom structure rather than fast riffles.",
      depthTendency:
        "Strong bottom orientation while feeding on benthic material; deeper pools and channel edges are common adult habitat.",
      lightResponse:
        "Bottom feeding reduces direct light dependence; low light and turbidity can support shallower movement.",
    },
    forageClasses: ["aquatic_insects", "crustaceans", "worms_annelids", "mollusks"],
    flowingPresentations: ["bottom_contact_drift", "stationary_bait"],
    stillPresentations: ["bottom_contact", "slow_drag", "live_natural_bait_suspension"],
    exceptions: [
      "Smallmouth buffalo are not common carp and should not inherit carp habitat assumptions wholesale.",
      "Recent demographic work shows multi-decade longevity; local population resilience should not be assumed.",
    ],
    geographic: "Large tributaries of the Mississippi basin and Gulf-slope drainages, with reservoirs and major rivers forming the core habitat.",
    sources: [
      { label: "Texas Parks and Wildlife smallmouth buffalo species account", class: SRC.agency },
      { label: "USGS smallmouth buffalo population-demographic research", class: SRC.peer },
      { label: "USGS smallmouth buffalo age-validation research", class: SRC.peer },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
  {
    id: "moxostoma_macrolepidotum",
    scientificName: "Moxostoma macrolepidotum",
    commonNames: ["Shorthead redhorse"],
    group: "other",
    nativeContext:
      "Native adaptable redhorse sucker of medium to large rivers across central and eastern North America, favoring silt-free sand, gravel, and rubble.",
    thermal: { preferredF: [55, 70], activeF: [45, 76], coldEdgeF: 40, warmEdgeF: 82 },
    spawning: {
      seasons: ["spring"],
      note: "Spring spawning migrations can create dense concentrations on shallow gravel riffles; those concentrations are explicitly not targeting outputs.",
    },
    habitat: {
      waterTypes: ["flowing", "stillwater"],
      riverHolding: ["riffle_to_run", "run", "pool_tail", "current_break", "deep_pool"],
      stillHolding: ["rocky_shoreline", "drop_off", "inlet", "shallow_flat"],
      currentPreference:
        "Most abundant in medium to moderately large rivers with strong flow and extensive clean sand, gravel, and rubble; can also use pools in smaller streams.",
      depthTendency:
        "Bottom-oriented in runs and pools, moving onto shallower gravel during seasonal spawning movement.",
      lightResponse:
        "Benthic feeding makes substrate and current more important than light; bright clear conditions can reinforce depth.",
    },
    forageClasses: ["aquatic_insects", "mollusks", "crustaceans", "worms_annelids"],
    flowingPresentations: ["bottom_contact_drift", "dead_drift", "stationary_bait"],
    stillPresentations: ["bottom_contact", "slow_drag"],
    exceptions: [
      "Do not convert spring tributary migrations into aggregation recommendations.",
      "Redhorse identification matters; similar sucker species can carry different conservation status.",
    ],
    geographic: "Broadly distributed across Mississippi, Great Lakes, St. Lawrence, Hudson Bay, and connected central/eastern river systems.",
    sources: [
      { label: "Missouri Department of Conservation shorthead redhorse field guide", class: SRC.agency },
      { label: "Minnesota river-fish habitat synthesis for redhorse species", class: SRC.agency },
    ],
    reviewedAt: "2026-08-27",
    nextReviewAt: "2026-11-27",
  },
];
