import {
  DOSSIER_NEXT_REVIEW_AT,
  DOSSIER_REVIEWED_AT,
  type BehaviorDossier,
} from "./dossier-types.ts";

const R = {
  reviewedAt: DOSSIER_REVIEWED_AT,
  nextReviewAt: DOSSIER_NEXT_REVIEW_AT,
} as const;

const PRESSURE_GAP = "species-specific angling-pressure response beyond general cover/light notes";
const FRONT_GAP = "cold-front / barometric response with primary-source support";
const LEVEL_GAP = "water-level rise/fall response with primary-source support";

/**
 * AFP-BH-1.0 wave 02 — behavior dossiers for open-first salmonids, pike,
 * walleye, large catfish, and yellow perch.
 *
 * This layer explains plausible mechanics. It does not claim that fish will bite,
 * name aggregation sites, or convert biology into catch probability.
 * Diet, calendar, fight, and food-value overlays are not invented here.
 */
export const BEHAVIOR_DOSSIERS_WAVE_02: BehaviorDossier[] = [
  {
    speciesId: "salmo_trutta",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage: "Juveniles may share nursery water; adults typically hold as individuals on a lie.",
      note: "Adults are more hole-bound than inland rainbows. A group in a pool is usually stacked individuals, not a pelagic school.",
    },
    feedingStrategy: {
      modes: ["drift_feeding", "ambush", "opportunistic"],
      note: "Intercepts drift and also leaves cover to take forage in low light. Large piscivorous adults may ignore insect-scale food. Diet capacity is not proof of a current hatch.",
    },
    territoriality:
      "Holds and defends feeding lies more tightly than inland rainbows, especially undercut banks, wood, and the slow side of a seam.",
    dielTendency: {
      class: "crepuscular",
      note: "MassWildlife: brown trout have more nocturnal habits. Catalog light response: holds deeper than rainbow in daylight and slides shallower in low light. Do not copy this nocturnal identity onto brook trout.",
    },
    seasonalActivity:
      "Fall spawning is conservation/biology context, not a targeting window. Summer thermal refuge is a constraint.",
    thermalDrivenBehavior:
      "Preferred band roughly 50–60°F in the reviewed record. Warmer, more fertile water is tolerated better than brook trout, but warm edges still push fish toward depth, cover, and night.",
    currentFacing:
      "Uses velocity boundaries — seams, pool heads, current breaks — rather than the fastest core. Catalog: balances food delivery against energy cost.",
    depthMovement:
      "Deeper than sympatric rainbows in daylight; shallower in low light. Do not copy lake-trout summer pelagic depth onto this stream and river fish.",
    clarityResponse:
      "Clear water reinforces cover, depth, and night. Stain can allow more daytime movement without implying a surface event.",
    predatorAvoidance:
      "MassWildlife: easily spooked. Uses undercut banks, wood, and depth. Approach and silhouette matter more than for many inland rainbows.",
    coverUse:
      "Undercut banks, submerged wood, deep pools, and the dark side of a current break. Not an open-water default.",
    openWaterBehavior:
      "Lake and reservoir fish use weed edges, drop-offs, inlets, and wood rather than a pelagic thermocline as a default the way lake trout do.",
    spawningBehavior:
      "Fall spawner; fish move onto gravel as days shorten and temperatures drop. Spawning gravel is excluded from target guidance.",
    sources: [
      {
        label: "MassWildlife trout identification and fishing tips (nocturnal habits, easily spooked)",
        class: "agency",
        url: "https://www.mass.gov/info-details/trout-identification-and-fishing-tips",
      },
      { label: "Elliott thermal biology of brown trout", class: "peer_reviewed" },
      { label: "USGS / state brown trout habitat notes", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "salvelinus_fontinalis",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage: "Juveniles in nursery pockets; adults may share a small-water pool without being a pelagic school.",
      note: "A group in a beaver pond or spring creek is cover-and-temperature associated, not a hotspot.",
    },
    feedingStrategy: {
      modes: ["drift_feeding", "opportunistic"],
      note: "Insect and crustacean drift in small water; will take small forage fish. Do not infer a current hatch from diet capacity. Do not copy brown-trout nocturnal hunting as the default.",
    },
    territoriality:
      "Holds pockets and undercuts but is generally less hole-bound and night-cover oriented than brown trout.",
    dielTendency: {
      class: "diurnal",
      note: "Catalog: uses shade and broken water; less nocturnal than brown trout. MassWildlife: wild fish in shaded stream habitats. Daytime feeding in broken light is the default, not a night-only identity.",
    },
    seasonalActivity:
      "Fall spawning over groundwater-influenced gravel is biology, not a targeting window. Summer warm lowland water is often lethal — presence does not imply a workable day.",
    thermalDrivenBehavior:
      "Preferred band roughly 46–56°F. Cooler-leaning than brown trout. Competitive displacement by brown trout is common where the two overlap.",
    currentFacing:
      "Avoids sustained high velocity; uses pockets and cover in small water rather than heavy current lanes.",
    depthMovement:
      "Often shallow relative to other trout when cover is present. Do not copy lake-trout summer pelagic depth onto this stream char.",
    predatorAvoidance:
      "MassWildlife: wild brook trout in shaded stream habitats should be approached so they are not put down. Shade, broken water, and undercuts are the refuge, not depth as a default.",
    coverUse:
      "Undercut banks, wood, deep pockets, and side channels in small water; inlets, weed edges, and wood in ponds.",
    openWaterBehavior:
      "Pond and lake fish still associate with inlets, weeds, and wood more than a pelagic basin. That is not lake-trout identity.",
    spawningBehavior:
      "Fall spawner over groundwater-influenced gravel. Spawning reaches are never named.",
    sources: [
      {
        label: "MassWildlife trout identification and fishing tips (shaded-stream wild fish)",
        class: "agency",
        url: "https://www.mass.gov/info-details/trout-identification-and-fishing-tips",
      },
      { label: "USFWS brook trout conservation summaries", class: "agency" },
      { label: "Raleigh habitat suitability (brook trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "salvelinus_namaycush",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage: "Young-of-year use rocky substrate; adults may group loosely on a thermal/forage band without being a baitfish school.",
      note: "A group on a hump or thermocline edge is a temperature-and-food association, not a named site.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "Piscivorous as adults, with crustaceans and aquatic insects as additional classes. Do not infer a current baitfish event from diet capacity.",
    },
    dielTendency: {
      class: "mixed",
      note: "Catalog: low light and depth; bright midday summer often pushes fish down. Night and shoulder seasons can bring fish shallower without implying a surface event.",
    },
    seasonalActivity:
      "Michigan DNR: in fall, winter, and spring this fish may be found in shallow water (that jurisdiction: 10 to 30 ft). As nearshore water warms in summer it follows cold water deeper. Fall spawning is biology, not a targeting window.",
    thermalDrivenBehavior:
      "Michigan DNR: prefers 40–55°F. Catalog preferred band 42–52°F. Summer surface presence is usually a cold-water exception, not a default pattern. Do not copy this summer pelagic depth onto stream brown or brook trout.",
    currentFacing:
      "Stillwater fish. Uses points and humps, not river current.",
    depthMovement:
      "Michigan DNR: as nearshore waters warm in summer, follows cold water to depths of 100 to 200 ft or more in that jurisdiction. Inland natural lakes are often shallower than Great Lakes basins; RPC, not GPS, chooses the basin class.",
    predatorAvoidance:
      "Depth and pelagic distance more than shoreline wood.",
    coverUse:
      "Thermocline edges, basins, submerged humps, drop-offs, and rocky shoreline — structure as a depth/temperature intersection, not a weed-bed default.",
    openWaterBehavior:
      "This is the default identity: pelagic, deep, cold. Inland-lake versus Great Lakes pelagic is an RPC question.",
    spawningBehavior:
      "Michigan DNR: fall broadcast spawning on shoals or shallow reefs; eggs deposited after dark among cobble and gravel. Homing to previously used spawning substrate is conservation context. Spawning reefs are never named and are not a target layer.",
    sources: [
      {
        label: "Michigan Department of Natural Resources lake trout species account",
        class: "agency",
        url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout",
      },
      { label: "Great Lakes / provincial lake trout assessments", class: "agency" },
      { label: "Martin & Olver lake trout biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "inland-lake versus Great Lakes depth amplitude as a structured field"],
  },
  {
    speciesId: "oncorhynchus_mykiss_steelhead",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage: "Juveniles in natal fresh water; returning adults travel and hold as individuals or loose groups.",
      note: "A group in a run is travel or holding association, not a hotspot. Do not treat returning adults as a feeding trout school.",
    },
    feedingStrategy: {
      modes: ["opportunistic"],
      note: "Catalog forage classes include aquatic insects, eggs, and small forage fish, but many winter fish are not feeding in the inland-rainbow sense. Do not infer a current insect hatch as the reason a winter steelhead is present.",
    },
    dielTendency: {
      class: "mixed",
      note: "Catalog: low light and colored water increase movement; bright low clear water often holds them tight. Light changes travel and holding, not proof of feeding.",
    },
    seasonalActivity:
      "WDFW: like Chinook, steelhead have a summer run and a winter run. Summer-run fish enter fresh water in summer and spawn the following spring; winter-run fish generally need less travel time. Do not collapse those stocks. WDFW: unlike most salmon, steelhead can survive spawning and can spawn in multiple years.",
    thermalDrivenBehavior:
      "Preferred band roughly 42–55°F. Warm, low-clear water is a constraint, not a feeding cue.",
    currentFacing:
      "Travel lanes and holding lies adjacent to strong current, not the fastest core.",
    depthMovement:
      "Often near bottom in winter; higher in the column as water warms within band. This is not inland-rainbow mid-column drift feeding.",
    clarityResponse:
      "Colored water can increase movement; bright low clear water often pins fish to cover and depth.",
    predatorAvoidance:
      "Depth, color, and the broken face of a run. Not a wood-ambush trout.",
    coverUse:
      "Seams, tailouts, current breaks, pool heads, deep pools, and boulder pockets — holding and travel, not a feeding station by default.",
    openWaterBehavior:
      "Ocean or Great Lakes phase is open-water residence. Freshwater adults are river fish in this record.",
    spawningBehavior:
      "Winter and summer-run stocks differ; do not collapse them. Spawning gravel is excluded from target guidance. Iteroparous: surviving spawners are not a Pacific-salmon carcass problem.",
    sources: [
      {
        label: "Washington Department of Fish and Wildlife rainbow trout / steelhead species account",
        class: "agency",
        url: "https://wdfw.wa.gov/species-habitats/species/oncorhynchus-mykiss",
      },
      { label: "NOAA Fisheries steelhead status", class: "agency" },
      { label: "Withler / Quinn anadromous Oncorhynchus reviews", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "stock-specific freshwater holding-depth literature as a structured field"],
  },
  {
    speciesId: "oncorhynchus_tshawytscha",
    status: "reviewed",
    social: {
      pattern: "schooling",
      byLifeStage: "Juveniles may school; returning adults travel in groups. Neither is a hotspot map.",
      note: "Freshwater returning adults are migration/interception context, not proof of feeding.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "NOAA: young Chinook feed on terrestrial and aquatic insects, amphipods, and other crustaceans; older Chinook primarily feed on other fish. Returning freshwater adults are not treated as actively feeding simply because a presentation family exists. Do not copy kokanee zooplankton diet onto returning Chinook.",
    },
    dielTendency: {
      class: "mixed",
      note: "Low light movement; bright conditions push lake fish down along the thermocline. Light does not convert a spawning migration into a feeding event.",
    },
    seasonalActivity:
      "NOAA: spend a few years feeding in the ocean, then return to natal streams to spawn, generally in summer or early fall. Run timing is stock-specific. ESA-listed stocks are a status overlay, not a location.",
    thermalDrivenBehavior:
      "Coldwater fish. Warm travel water is a constraint, especially in some interior systems.",
    currentFacing:
      "River travel and holding in moderate-to-strong lanes; lakes are pelagic. Catalog: often deeper or more travel-oriented than coho in the same system.",
    depthMovement:
      "Often deep or suspended in lakes; river depth follows holding water, not a single number. Do not copy coho’s higher-column lake identity onto Chinook.",
    predatorAvoidance:
      "Depth, turbidity, and grouping during travel. Not a cover-oriented ambush fish.",
    coverUse:
      "Velocity refuge and channel form, not wood as a feeding station.",
    openWaterBehavior:
      "Ocean phase is pelagic. Great Lakes fish use thermocline edges, suspended open water, drop-offs, and points.",
    spawningBehavior:
      "NOAA: Chinook dig gravel nests (redds); all Chinook salmon die after spawning. Staging concentrations, redds, and listed stocks are invalidators, never target layers.",
    sources: [
      {
        label: "NOAA Fisheries Chinook salmon species profile",
        class: "agency",
        url: "https://www.fisheries.noaa.gov/species/chinook-salmon",
      },
      { label: "Healey chinook life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, "stock-specific travel-depth literature as a structured field"],
  },
  {
    speciesId: "oncorhynchus_kisutch",
    status: "reviewed",
    social: {
      pattern: "schooling",
      byLifeStage: "Juveniles in streams; returning adults travel in groups. Neither is a hotspot map.",
      note: "Freshwater returning adults are migration/interception context, not proof of feeding.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "NOAA: in fresh water, young coho feed on plankton and insects; in the ocean they switch to small fishes (herring, sandlance, anchovies, sardines) and may eat juveniles of other salmon. Returning freshwater adults are not feeding trout. Do not copy kokanee zooplankton diet onto returning coho.",
    },
    dielTendency: {
      class: "mixed",
      note: "Low light and overcast favor higher, more aggressive positioning in lakes. Light does not convert a spawning migration into a feeding event.",
    },
    seasonalActivity:
      "NOAA: return to natal streams to spawn, generally in fall or early winter; typically spawn at ages 3–4; all die after spawning. Listed ESUs are a status overlay, not a location. Catalog: do not treat river-mouth presence as a license to crowd spawning tributaries.",
    thermalDrivenBehavior:
      "Coldwater fish. Slightly more willing to use upper-column water than Chinook in the same lake, within a still-cold band.",
    currentFacing:
      "Catalog: willing to use upper-column current and tributary plumes more than Chinook. That is a column difference, not a different species of feeding trout.",
    depthMovement:
      "Often higher in the column than Chinook in lakes; river holding is mid to lower. Do not copy Chinook deep-holding onto coho by default.",
    predatorAvoidance:
      "Depth, turbidity, and grouping during travel.",
    coverUse:
      "Seams, pool heads, current breaks, and tributary-influenced water as travel and holding, not wood as a feeding station.",
    openWaterBehavior:
      "Ocean phase is pelagic. Great Lakes fish use thermocline edges, points, and inlets, often higher than Chinook.",
    spawningBehavior:
      "NOAA: female coho dig gravel nests; all coho salmon die after spawning. Some ESUs are listed. Staging water and redds are invalidators, never target layers.",
    sources: [
      {
        label: "NOAA Fisheries coho salmon species profile",
        class: "agency",
        url: "https://www.fisheries.noaa.gov/species/coho-salmon",
      },
      {
        label: "California Department of Fish and Wildlife coho salmon life history",
        class: "agency",
        url: "https://wildlife.ca.gov/Conservation/Fishes/Coho-Salmon",
      },
      { label: "Sandercock coho life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, "stock-specific travel-depth literature as a structured field"],
  },
  {
    speciesId: "sander_vitreus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage: "Young fish may school more tightly; adults often travel and feed in loose groups along a light-food band.",
      note: "A group on a point or current break is a light-and-forage association, not a hotspot.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "Minnesota DNR: fish-eaters, preying heavily on yellow perch, which cannot see as well as the walleye in low light. Catalog forage also includes larger prey fish, aquatic insects, and crustaceans. Presence of a forage class is not observation of a current event.",
    },
    dielTendency: {
      class: "crepuscular",
      note: "Minnesota DNR: tapetum lucidum helps the fish see and feed at night or in turbid water. Catalog: strong low-light and night feeding. Bright midday in clear water is often a poor feeding window, not a location problem. Dusk is metabolically and optically more plausible — not a claim that fish will bite.",
    },
    seasonalActivity:
      "Early-spring spawning on rock and current is often the first big movement of the year. That movement is biology, not a named site.",
    thermalDrivenBehavior:
      "Preferred band roughly 55–68°F. Southern reservoirs depend on hypolimnion and forage; warm, bright, clear water is an optical and thermal constraint.",
    currentFacing:
      "Uses current and current-washed structure; not a slack-water ambush fish. River versus natural-lake identity is an RPC question.",
    depthMovement:
      "Follows the light-food compromise: deeper in bright clear water, shallower in stain, wind, and low light.",
    clarityResponse:
      "Turbidity reduces the optical penalty of shallower or daylight positions. Clear water pushes the usable window toward low light and depth.",
    predatorAvoidance:
      "Depth and low light more than heavy cover. Not a weed-ambush esocid.",
    coverUse:
      "Points, drop-offs, breaklines, rocky shorelines, inlets, thermocline edges, and current breaks — edges where light and forage meet.",
    openWaterBehavior:
      "Basin and thermocline use is real in some lakes. It is a light-and-forage band, not a pin.",
    spawningBehavior:
      "Early spring on rock and current. Spawning and any run concentrations are excluded from target guidance.",
    sources: [
      {
        label: "Minnesota Department of Natural Resources walleye biology and identification",
        class: "agency",
        url: "https://www.dnr.state.mn.us/fish/walleye/biology.html",
      },
      { label: "GLFC / state walleye assessments", class: "agency" },
      { label: "Colby et al. walleye biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "sander_canadensis",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage: "Adults may group in current-washed holes without being a pelagic school.",
      note: "A group in a deep run is current-and-turbidity associated, not a hotspot. Dam and spawning-run concentrations are not treated as secret aggregation targets.",
    },
    feedingStrategy: {
      modes: ["pursuit", "benthic_feeding"],
      note: "Fish-eater in turbid current, with aquatic insects and crustaceans as additional classes. Do not copy walleye yellow-perch lake identity onto this more riverine record as a default.",
    },
    dielTendency: {
      class: "mixed",
      note: "Minnesota DNR: sauger sees even better than walleye in darkness or turbid water, and this determines their distribution. Turbidity can extend active feeding into daylight by reducing the optical penalty of shallow or current-facing positions.",
    },
    seasonalActivity:
      "Early-spring spawning movement is flow- and temperature-linked. That movement is biology, not a named site.",
    thermalDrivenBehavior:
      "Similar cool-water band to walleye, but distribution is more tightly tied to turbidity and large-river current.",
    currentFacing:
      "More riverine and current-tolerant than walleye; deep runs and pools with meaningful flow are core habitat rather than exceptions.",
    depthMovement:
      "Strong lower-column and bottom association, particularly in daylight and clearer conditions.",
    clarityResponse:
      "Turbidity is a habitat axis, not a stain-as-afterthought. Clear water is often a poorer sauger fit than the same water is for walleye.",
    predatorAvoidance:
      "Depth, turbidity, and the bottom of the column.",
    coverUse:
      "Deep pools, runs, tailwater current, current breaks, drop-offs, and riprap — current-washed bottom, not weed edges as a default.",
    openWaterBehavior:
      "Reservoir fish still tend toward channel and turbid basin water rather than a clear-lake walleye point.",
    spawningBehavior:
      "Early-spring spawning commonly in cold water over rock or gravel in riverine habitat. Spawning and dam-associated concentrations are invalidators, never target layers. Saugeye should not silently inherit this record.",
    sources: [
      {
        label: "Minnesota Department of Natural Resources walleye biology and identification (sauger vision and distribution)",
        class: "agency",
        url: "https://www.dnr.state.mn.us/fish/walleye/biology.html",
      },
      { label: "USGS sauger habitat and movement research", class: "peer_reviewed" },
      { label: "Missouri Department of Conservation sauger species account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "esox_lucius",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage: "Fry may share vegetated shallows briefly; juveniles and adults are typically solitary ambush fish.",
      note: "A fish on a weed edge is cover-associated, not a school.",
    },
    feedingStrategy: {
      modes: ["ambush"],
      note: "Sight ambush from slack adjacent to a food lane. Forage classes are small and larger prey fish plus amphibians. Presence of a forage class is not observation of a current event.",
    },
    territoriality:
      "Home-range ambush lies more than a continuously defended territory outside spawning.",
    dielTendency: {
      class: "mixed",
      note: "Sight ambush predator; uses edges and low light but will eat in daylight in stained water.",
    },
    seasonalActivity:
      "Among the earliest spawners, in ice-out vegetated shallows. That is biology, not a named site. Summer fish slide to deeper weed edges and thermocline as water warms.",
    thermalDrivenBehavior:
      "Preferred band roughly 50–65°F. Casselman thermal ecology is the reviewed authority for temperature response. Warm, weedy southern water may hold pike that are thermally stressed, not feeding fish.",
    currentFacing:
      "Ambush from slack adjacent to a food lane, not the current core.",
    depthMovement:
      "Weeds and shallows in cool water; deeper weed edges and thermocline as summer warms. Do not copy muskellunge open-water size class onto this weed-edge identity, and do not copy this lake-weed identity onto chain pickerel as a size class.",
    predatorAvoidance:
      "Vegetation, wood, and the inside of a weedline. Not pelagic depth as a default.",
    coverUse:
      "Weed edges, inside and outside weedlines, inlets, points, and wood.",
    openWaterBehavior:
      "Not a pelagic default. Open-water fish are usually following a forage edge or a thermal band, not abandoning cover identity.",
    spawningBehavior:
      "Ice-out vegetated shallows; among the earliest spawners. Spawning margins are never named. Conservation issues around muskellunge overlap are a status overlay, not a location.",
    sources: [
      { label: "Provincial / state esocid plans", class: "agency" },
      { label: "Casselman pike thermal ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "esox_masquinongy",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage: "Adults are typically solitary. A pair or small group is not a school and is not a named aggregation.",
      note: "We do not give aggregation or spawning-site recommendations.",
    },
    feedingStrategy: {
      modes: ["ambush", "pursuit"],
      note: "Large-prey ambush and short pursuit along edges and structural funnels. Forage is larger prey fish first, plus smaller fish and amphibians. Do not copy chain-pickerel vegetation-only identity onto this size class.",
    },
    territoriality:
      "Large home-range cover and edge use more than a continuously defended hole.",
    dielTendency: {
      class: "mixed",
      note: "Low light and weather changes matter; bright high-sky days often pin them to cover.",
    },
    seasonalActivity:
      "Spawns shortly after pike, in vegetated shallows and tributary-influenced water. That is biology, not a named site.",
    thermalDrivenBehavior:
      "Preferred band roughly 55–70°F. Slightly warmer-leaning than northern pike in the reviewed record, still a coolwater esocid.",
    currentFacing:
      "Edges of current and large structural funnels; not open-basin wanderers by default.",
    depthMovement:
      "Weed-associated mid-depth; follows forage more than a single contour. Do not copy this size class onto chain pickerel.",
    predatorAvoidance:
      "Cover, depth, and distance. Handling and release of large adults is a conservation overlay, not a fight rating.",
    coverUse:
      "Weed edges, outside weedlines, points, inlets, wood, and drop-offs.",
    openWaterBehavior:
      "May cruise edges and points. Open water is a forage path, not a pelagic schooling identity.",
    spawningBehavior:
      "Spring, shortly after pike, in vegetated shallows and tributary mouths as habitat class — never as named sites. Aggregation and spawning-site recommendations are excluded.",
    sources: [
      { label: "State muskellunge management plans", class: "agency" },
      { label: "Crossman muskellunge biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "esox_niger",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage: "Juveniles and adults typically hold as individuals in vegetation.",
      note: "A fish in a weed pocket is cover-associated, not a pike school and not a muskie size class.",
    },
    feedingStrategy: {
      modes: ["ambush"],
      note: "Sight ambush from vegetation and slack-water cover. Forage classes include small and larger prey fish, amphibians, and crustaceans. Do not copy muskellunge open-water size class onto this vegetation esocid.",
    },
    dielTendency: {
      class: "mixed",
      note: "Sight-oriented ambush; low light and stained water can increase use of open edges while bright conditions reinforce cover.",
    },
    seasonalActivity:
      "Early-spring spawning in flooded vegetation and shallow margins before sustained warmwater patterns develop. Flooded spawning margins are never named as aggregation targets.",
    thermalDrivenBehavior:
      "Preferred band roughly 60–70°F. A warmer, vegetated-water esocid than northern pike as a default, still not a pelagic muskellunge.",
    currentFacing:
      "Ambushes from vegetation and slack-water cover; sustained main-channel current is not the default feeding position.",
    depthMovement:
      "Primarily shallow to mid-depth around weeds and cover, with deeper edge use during bright or warm periods.",
    predatorAvoidance:
      "Weeds, wood, and the inside of a weedline. Not open-water distance.",
    coverUse:
      "Weed edges, inside and outside weedlines, wood, and shallow flats. Catalog: chain pickerel remain vegetation/slack-water ambush predators rather than open-pelagic esocids.",
    openWaterBehavior:
      "Not the default. Open edges are still vegetation-associated.",
    spawningBehavior:
      "Early spring in flooded vegetation and shallow margins. Those margins are never named as aggregation targets.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species chain pickerel profile", class: "agency" },
      { label: "South Carolina Department of Natural Resources chain pickerel account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "ictalurus_punctatus",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage: "Juveniles may aggregate in feeding water; adults typically forage as individuals.",
      note: "A group in a hole is current-and-scent associated, not a school of pelagic bass.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding", "opportunistic"],
      note: "TPWD: adults are largely omnivorous, feeding on insects, mollusks, crustaceans, fish, and even some plant material. Young under 4 in feed primarily on small insects. Scent and current delivery often matter more than a visual forage match. Do not copy flathead piscivore diet onto channel catfish.",
    },
    dielTendency: {
      class: "nocturnal",
      note: "Primarily low light and night in clear water; more daytime activity in stain and current.",
    },
    seasonalActivity:
      "Cavity spawner as water holds in the 70s (TPWD: late spring or early summer near 75°F). Nest cavities are biology, not named targets.",
    thermalDrivenBehavior:
      "Preferred band roughly 70–82°F. Warm-water river and pond fish; cold edges shut down more than they relocate to a trout-like thermal refuge.",
    currentFacing:
      "Uses current-swept holes and the slow side of moving water. Not a slack-only pond fish in rivers.",
    depthMovement:
      "Bottom-oriented; shallower at night and in stained water.",
    predatorAvoidance:
      "Depth, darkness, and the bottom. Not a weed-ambush esocid.",
    coverUse:
      "Deep pools, current breaks, runs, tributary mouths, wood, drop-offs, inlets, and riprap — bottom structure, not a pelagic roam as a default.",
    openWaterBehavior:
      "Not the default. Channel catfish are hole-and-bottom fish more than blue-catfish reservoir roamers.",
    spawningBehavior:
      "TPWD: spawn in late spring or early summer when water temperatures reach 75°F. Males select dark secluded nest sites (cavities in drift, logs, undercut banks, rocks). Males guard the nest. Nest sites are never named.",
    sources: [
      {
        label: "Texas Parks and Wildlife Department channel catfish species account",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/ccf/",
      },
      { label: "USFWS / state catfish management", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "ictalurus_furcatus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage: "Adults may roam and group loosely with forage in reservoirs without being a white-bass school.",
      note: "A group in a channel or along a forage band is movement-associated, not a hotspot.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding", "pursuit", "opportunistic"],
      note: "TPWD: like channel catfish, pursues a varied diet, but tends to eat fish earlier in life. Invertebrates still comprise the major portion of the diet; fish as small as 4 in have been known to consume fish; individuals larger than 8 in eat fish and large invertebrates. Do not copy flathead 'live fish only' identity onto blue catfish, and do not copy this roaming piscivory onto channel catfish as a default.",
    },
    dielTendency: {
      class: "mixed",
      note: "Low light can support shallower movement, but current, forage, temperature, and turbidity can make daytime feeding fully plausible.",
    },
    seasonalActivity:
      "TPWD: tend to move upstream in the summer in search of cooler temperatures, and downstream in the winter in order to find warmer water. That is a seasonal movement class, not a named reach. Spawning similar to channel catfish; most not mature until about 24 in.",
    thermalDrivenBehavior:
      "Preferred band roughly 72–84°F. Large-river and reservoir fish; seasonal movement can be extensive — one depth or channel class is not a year-round rule.",
    currentFacing:
      "Large-river fish use channel current, current breaks, and travel lanes; reservoir fish can roam pelagically with forage rather than remain pinned to cover.",
    depthMovement:
      "Often deep and near bottom, but adults may suspend with open-water forage in reservoirs and shift substantially with season. River versus reservoir identity is an RPC question.",
    predatorAvoidance:
      "Depth, current, and open-water distance more than a single logjam.",
    coverUse:
      "Channel, current breaks, tributary mouths, basins, drop-offs, points, inlets, and riprap. Cover is optional; forage and current are not.",
    openWaterBehavior:
      "Reservoir adults may roam and suspend with forage. That is a reviewed identity, not a flathead cover fish.",
    spawningBehavior:
      "TPWD: spawning behavior appears similar to channel catfish; most are not sexually mature until about 24 in. Cavity/structure spawning in warm water. Nest sites are never named. Introduced-population status varies by jurisdiction and is not a harvest endorsement.",
    sources: [
      {
        label: "Texas Parks and Wildlife Department blue catfish species account",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/blc/",
      },
      { label: "USGS Nonindigenous Aquatic Species blue catfish profile", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "pylodictis_olivaris",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage: "TPWD: fry school together at the nest for several days after hatching, then seek shelter and live independently. Adults are solitary cover-oriented predators.",
      note: "A large fish in a logjam is a home-range predator, not a channel-catfish hole group.",
    },
    feedingStrategy: {
      modes: ["ambush", "pursuit"],
      note: "TPWD: unlike other catfish which are scavengers, flatheads prey only on live fish. Young feed mostly on invertebrates (worms, insects, crayfish); when 10 in or larger, diet consists entirely of fish. Do not copy this live-fish identity onto channel catfish.",
    },
    dielTendency: {
      class: "nocturnal",
      note: "Strong low-light and nocturnal movement pattern, especially for large adults leaving daytime cover to forage.",
    },
    seasonalActivity:
      "TPWD: spawning from late May through August when water is 75–80°F. Deep cover by day; adults often move shallower at night and in summer while remaining structurally oriented.",
    thermalDrivenBehavior:
      "Preferred band roughly 68–82°F. Warm-water river predator; cold edges keep fish in deep cover rather than creating a trout-like feeding window.",
    currentFacing:
      "Uses large-river current but commonly holds on the protected side of wood, scour, or structure rather than in the fastest lane.",
    depthMovement:
      "Deep cover by day; shallower at night while remaining structurally oriented. Not a pelagic blue-catfish roam.",
    predatorAvoidance:
      "Large woody cover, undercut banks, and the dark side of a hole.",
    coverUse:
      "Deep pools, submerged wood, current breaks, and protected cavities. Catalog: cover-oriented and strongly piscivorous as adults.",
    openWaterBehavior:
      "Not the default. Open-water movement is usually a night forage path back to cover.",
    spawningBehavior:
      "TPWD: males select hollow logs, caves, or areas beneath the banks; may improve sites as shallow depressions. Fry school at the nest for several days. Nest cavities are never named. Introduced populations can be invasive; presence is not a conservation or harvest endorsement.",
    sources: [
      {
        label: "Texas Parks and Wildlife Department flathead catfish species account",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/catfish/",
      },
      { label: "USGS Nonindigenous Aquatic Species flathead catfish profile", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "perca_flavescens",
    status: "reviewed",
    social: {
      pattern: "schooling",
      byLifeStage: "Schooling through much of life; schools may break toward shallows in low light.",
      note: "A school is not a hotspot. It is a forage-linked, moving aggregation.",
    },
    feedingStrategy: {
      modes: ["opportunistic"],
      note: "Follows zooplankton, aquatic insects, small forage fish, and crustaceans. Minnesota DNR notes yellow perch cannot see as well as walleye in low light and are easy prey at night — that is walleye optics, not a perch feeding recommendation. Do not infer a current hatch from diet capacity.",
    },
    dielTendency: {
      class: "diurnal",
      note: "Daylight schooling. Low light may break schools toward shallows. This is not walleye tapetum identity.",
    },
    seasonalActivity:
      "Early-spring spawn in shallow vegetation and wood shortly after ice-out. Summer fish follow zooplankton and bait along breaks. Winter schools may use basins. None of those are named sites.",
    thermalDrivenBehavior:
      "Preferred band roughly 54–68°F. Cool-water schooling percid; warm, bright shallows are not a default summer fit.",
    currentFacing:
      "Mild current and current-washed points; schools more than holds a single lie.",
    depthMovement:
      "Follows zooplankton and bait; often mid-depth along a break. Not a walleye light-refuge default.",
    predatorAvoidance:
      "Schooling and the safety of the group. Cover is secondary to the school.",
    coverUse:
      "Weed edges, drop-offs, points, basins, riprap, and inlets as school locations, not as solitary lies.",
    openWaterBehavior:
      "Schools commonly use open water adjacent to a break. That is still a moving forage association.",
    spawningBehavior:
      "Early spring, shallow vegetation and wood shortly after ice-out. Spawning margins are never named.",
    sources: [
      {
        label: "Washington Department of Fish and Wildlife yellow perch species account",
        class: "agency",
        url: "https://wdfw.wa.gov/species-habitats/species/perca-flavescens",
      },
      {
        label: "Minnesota Department of Natural Resources walleye biology (yellow perch as low-light prey)",
        class: "agency",
        url: "https://www.dnr.state.mn.us/fish/walleye/biology.html",
      },
      { label: "Thorpe yellow perch biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
];
