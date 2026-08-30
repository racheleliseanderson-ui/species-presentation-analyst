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
 * AFP-BH-1.0 wave 01 — behavior dossiers for the highest-confusion groups.
 *
 * This layer explains plausible mechanics. It does not claim that fish will bite,
 * name aggregation sites, or convert biology into catch probability.
 */
export const BEHAVIOR_DOSSIERS: BehaviorDossier[] = [
  {
    speciesId: "oncorhynchus_mykiss",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage:
        "Juveniles often aggregate in nursery water; adults may feed in loose groups where food is delivered, but they are not a schooling pelagic species.",
      note: "Adult rainbows use feeding stations and travel lanes more than a single defended hole, especially compared with brown trout.",
    },
    feedingStrategy: {
      modes: ["drift_feeding", "pursuit", "opportunistic"],
      note: "Primarily intercepts drift and emerging insects in current; will chase baitfish and take terrestrials. Less locked to the slowest water than brown trout.",
    },
    territoriality:
      "Holds feeding lies but is generally less hole-bound and nocturnal-cover oriented than brown trout.",
    dielTendency: {
      class: "diurnal",
      note: "Catalog light response: feeds in daylight more readily than brown trout, while still using shade and broken light.",
    },
    seasonalActivity:
      "Spring spawning is a conservation/biology context, not a targeting window. Summer use of thermal refuge is a constraint. Fall feeding on eggs or bait is opportunistic, not a prescribed hatch.",
    thermalDrivenBehavior:
      "Preferred band roughly 50–60°F in the reviewed record. Warm edges push fish toward faster, more oxygenated, or deeper water rather than proving a bite.",
    currentFacing:
      "Willing to use moderate current if food is delivered. Faces into flow and intercepts seams, riffle-to-run water, and boulder pockets.",
    depthMovement:
      "Mid-column to upper when feeding; deeper on bright, warm, or pressured days.",
    clarityResponse:
      "Clear water increases the value of broken light and distance; stain can allow more mid-day water-column feeding without implying a surface event.",
    predatorAvoidance:
      "Uses broken water, depth, and shade. Does not require heavy wood cover the way brown trout often do.",
    coverUse:
      "Boulder pockets, seams, and tailwater structure more than undercut banks as a default.",
    openWaterBehavior:
      "Lake/reservoir fish suspend and cruise along inlets, drop-offs, and thermocline edges rather than holding a river lie.",
    spawningBehavior:
      "Spring spawner in most inland waters as temperature and flow rise together. Spawning gravel and staging water are excluded from target guidance. Steelhead is a separate anadromous record.",
    sources: [
      { label: "USFWS / state inland trout management summaries", class: "agency" },
      { label: "Raleigh et al. habitat suitability (rainbow trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "oncorhynchus_clarkii",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage: "Juveniles in tributary and margin water; adults may be solitary or loosely grouped on food.",
      note: "Interior forms are often more insect-oriented and less competitive than sympatric rainbows where the two overlap.",
    },
    feedingStrategy: {
      modes: ["drift_feeding", "opportunistic"],
      note: "Strong drift and surface-insect identity in many interior streams; lake forms also use zooplankton and baitfish. Do not assume a current hatch from diet capacity.",
    },
    territoriality:
      "Holds feeding water but is generally less aggressively hole-bound than brown trout.",
    dielTendency: {
      class: "diurnal",
      note: "Daytime feeding is common; shade still matters on bright alpine water.",
    },
    seasonalActivity:
      "Spring tributary movement is a biological context. Adfluvial versus resident behavior is an RPC question, not a GPS inference.",
    thermalDrivenBehavior:
      "Slightly cooler-leaning than many inland rainbows in the reviewed thermal bands. Warm, low-oxygen water is a hard constraint for some interior subspecies.",
    currentFacing:
      "Moderate current and tributary-influenced water; less of a heavy-cover fish than brown trout.",
    depthMovement:
      "Near drop-offs and inlets in lakes; mid-depth in rivers when feeding.",
    predatorAvoidance:
      "Uses depth, broken water, and, in lakes, the safety of open-water distance rather than heavy wood.",
    coverUse:
      "Seams, runs, side channels, and tributary mouths more than undercut banks as a default.",
    openWaterBehavior:
      "Adfluvial fish use lake inlets, drop-offs, and points; this is not a river-only species.",
    spawningBehavior:
      "Spring spawner; many interior forms move into tributaries. Subspecies and hybridization with rainbow trout are conservation constraints. Spawning reaches are never named.",
    sources: [
      { label: "State/tribal cutthroat status reviews", class: "agency" },
      { label: "Behnke Oncorhynchus clarkii systematics", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "subspecies-specific behavior table"],
  },
  {
    speciesId: "oncorhynchus_nerka_kokanee",
    status: "reviewed",
    social: {
      pattern: "schooling",
      byLifeStage: "Pelagic schools through much of lake residence; spawning fish leave the pelagic layer.",
      note: "A visible school is a mobile plankton/temperature association, not a hotspot coordinate.",
    },
    feedingStrategy: {
      modes: ["filter", "opportunistic"],
      note: "Reviewed forage is zooplankton first, with emerging and aquatic insects as secondary classes. Do not infer a current plankton bloom from diet capacity.",
    },
    dielTendency: {
      class: "mixed",
      note: "Vertical position can shift with light and plankton movement; bright periods commonly push usable depth deeper.",
    },
    seasonalActivity:
      "Summer is an oxythermal problem as much as a forage problem. Fall color-up is spawning biology, not a feeding recommendation.",
    thermalDrivenBehavior:
      "Narrow coldwater band. Fish track the intersection of temperature, oxygen, and plankton rather than a shoreline cover type.",
    currentFacing:
      "Pelagic lake fish. Position follows basin circulation more than river current.",
    depthMovement:
      "Usually suspended in open water, changing depth seasonally to remain in suitable temperature and food layers.",
    predatorAvoidance:
      "Schooling and depth. Shoreline cover is not the default refuge.",
    coverUse:
      "Open-water depth bands, thermocline edges, and basin structure rather than wood or weeds.",
    openWaterBehavior:
      "This is the default identity: suspended, schooling, plankton-associated.",
    spawningBehavior:
      "Fall spawner on suitable lake shore or tributary gravel. Mature staging and spawning fish are not a forage-matching problem and are excluded from targeting guidance. Semelparous.",
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile", class: "agency" },
      { label: "Washington Department of Fish and Wildlife kokanee profile", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "diel vertical-migration amplitude as a structured field"],
  },
  {
    speciesId: "oncorhynchus_nerka_anadromous",
    status: "reviewed",
    social: {
      pattern: "schooling",
      byLifeStage:
        "Juveniles school in nursery lakes; returning adults travel in groups. Neither is a hotspot map.",
      note: "Freshwater returning adults are modeled as migration/interception context, not proof of feeding.",
    },
    feedingStrategy: {
      modes: ["filter", "pursuit", "opportunistic"],
      note: "NOAA: juveniles in fresh water eat zooplankton, amphipods, and insects; ocean fish continue on zooplankton plus larval/small fishes and occasionally squid. Returning freshwater adults are not treated as actively feeding simply because a presentation family exists.",
    },
    dielTendency: {
      class: "mixed",
      note: "Light can alter travel depth and visibility but does not convert freshwater migration into a feeding event.",
    },
    seasonalActivity:
      "Ocean residence, return timing, and freshwater travel are life-history stages. ESA-listed ESUs are a status overlay, not a location.",
    thermalDrivenBehavior:
      "Coldwater fish. Warm, low-oxygen travel water is a constraint, especially in some interior systems.",
    currentFacing:
      "Migrating adults use river travel lanes and velocity relief rather than establishing trout-like feeding lies.",
    depthMovement:
      "Freshwater adults may move through the column with migration stage, flow, and lake/river transition. Juvenile lake residence is not an adult targeting proxy.",
    predatorAvoidance:
      "Depth, turbidity, and grouping during travel. Not a cover-oriented ambush fish.",
    coverUse:
      "Velocity refuge and channel form, not wood as a feeding station.",
    openWaterBehavior:
      "Ocean phase is pelagic. Nursery-lake juveniles are pelagic planktivores.",
    spawningBehavior:
      "NOAA: typically spawn in summer or fall; females dig redds and both sexes die after spawning. Staging concentrations, redds, and listed ESUs are invalidators, never target layers.",
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile", class: "agency", url: "https://www.fisheries.noaa.gov/species/sockeye-salmon" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, "stock-specific travel-depth literature as a structured field"],
  },
  {
    speciesId: "micropterus_nigricans",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage: "Fry may school briefly; juveniles and adults are typically solitary or loosely associated around cover.",
      note: "Not a pelagic schooling bass. A group on a dock or weed edge is cover-associated, not a white-bass school.",
    },
    feedingStrategy: {
      modes: ["ambush", "opportunistic"],
      note: "Sight ambush from vegetation, wood, and shade. Forage classes include baitfish, crayfish, amphibians, and insects. Presence of a forage class is not observation of a current event.",
    },
    territoriality:
      "Nesting males guard; outside spawning this is home-range cover use more than a continuously defended territory.",
    dielTendency: {
      class: "crepuscular",
      note: "Shade and low light increase shallow positioning; bright high-sky days push fish into cover. Daytime feeding still occurs, especially in stain.",
    },
    seasonalActivity:
      "Shallow cover in cool water; vegetation, wood, and shade remain the organizing idea in summer. Winter is a reduced-metabolism, deeper-or-tighter-cover problem rather than a generic 'deep' slogan.",
    thermalDrivenBehavior:
      "Warmwater fish. Cold water slows movement; extreme heat pushes fish to shade, deeper edges, or oxygenated inflows.",
    currentFacing:
      "Avoids sustained current; uses slack and cover even in rivers.",
    depthMovement:
      "Shallow to mid; follows vegetation, wood, and shade more than a contour number.",
    waterLevelResponse:
      "Rising water can pull fish into newly flooded cover; falling water can concentrate remaining cover. This is a structure-class statement, not a spot.",
    clarityResponse:
      "Clear water increases shade and cover dependence; stain can allow more open-edge positioning without implying a surface bite.",
    predatorAvoidance:
      "Cover first: weeds, wood, docks, shade. Open water is not the default.",
    coverUse:
      "Weed edges, inside and outside weedlines, wood, dock shade, and slow-water wood in rivers.",
    openWaterBehavior:
      "Not the default. Pelagic chasing is more a spotted-bass or temperate-bass problem.",
    spawningBehavior:
      "Nests in protected shallows as water holds in the mid-60s. Colonial or visible beds are a conservation choice, never a recommendation. Northern versus Florida-strain thermal edges differ.",
    sources: [
      { label: "State black bass management plans", class: "agency" },
      { label: "Heidinger largemouth life history", class: "peer_reviewed" },
      { label: "Florida Museum largemouth bass species profile", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "micropterus_dolomieu",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage: "Juveniles may group on shallow rock; adults often use the same rock complex without true pelagic schooling.",
      note: "Multiple fish on a rock pile is structure sharing, not a white-bass school.",
    },
    feedingStrategy: {
      modes: ["pursuit", "ambush", "benthic_feeding"],
      note: "Current-facing and rock-oriented. Catalog exception: forage is often crayfish even when baitfish are visible. Do not let one observation erase the other class.",
    },
    territoriality:
      "Nesting males guard rock or gravel. Outside spawning, they use current breaks more than a weed ambush.",
    dielTendency: {
      class: "diurnal",
      note: "Feeds in daylight; low light and wind often move fish shallower on the same rock.",
    },
    seasonalActivity:
      "Rock and current remain the organizing idea through the open-water year. Post-front bright calm days commonly slide fish deeper on the same structure class.",
    thermalDrivenBehavior:
      "Cooler-leaning than largemouth. Extreme heat in still water pushes toward depth, shade rock, or current-oxygenated water.",
    currentFacing:
      "Uses current; holds on the slow side of fast water, not in dead slack only.",
    depthMovement:
      "Shallow to mid on rock; slides deeper on bright, calm, or post-front days.",
    flowChangeResponse:
      "Elevated, still-fishable flow can pin fish tighter to current breaks; high unfishable flow is an invalidator, not a new family.",
    clarityResponse:
      "Clear water favors sight feeding on rock; stain can pull fish shallower on the same break.",
    predatorAvoidance:
      "Depth, rock, and current rather than vegetation as the default.",
    coverUse:
      "Current breaks, boulder pockets, seams, rocky shorelines, points, riprap, and humps.",
    openWaterBehavior:
      "Reservoir fish will use offshore rock and humps; they remain structure-oriented rather than shad-school pelagic as a default.",
    spawningBehavior:
      "Spawns on rock in current or on windward lake gravel as water holds near 60°F. Beds are not a targeting product.",
    sources: [
      { label: "USGS / provincial smallmouth assessments", class: "agency" },
      { label: "Coble smallmouth biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, "species-specific frontal literature beyond the catalog post-front depth note"],
  },
  {
    speciesId: "micropterus_punctulatus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      note: "More willing than largemouth to roam channel edges and follow bait in the column, still not a Morone-style open-water school as the default.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "Baitfish and crayfish. In reservoirs, more pelagic/channel-oriented than largemouth in the same lake.",
    },
    dielTendency: {
      class: "diurnal",
      note: "Follows bait in the column; less bound to shade docks than largemouth.",
    },
    seasonalActivity:
      "Channel edges, points, and offshore structure remain more important than shallow vegetation through much of the warm season.",
    thermalDrivenBehavior:
      "Warmer-tolerant than smallmouth, more current- and depth-tolerant than largemouth.",
    currentFacing:
      "More current-tolerant than largemouth; uses channel edges in reservoirs.",
    depthMovement:
      "Often deeper and more pelagic than largemouth in the same lake.",
    predatorAvoidance:
      "Depth and channel position more than inside-weed ambush.",
    coverUse:
      "Drop-offs, points, breaklines, humps, rocky shorelines, and outside weedlines rather than inside vegetation.",
    openWaterBehavior:
      "More legitimate than largemouth, still usually tied to a break or bait group rather than basin roaming for its own sake.",
    spawningBehavior:
      "Spring spawner, often slightly deeper / more offshore than largemouth. Alabama/redeye complexes are not this record.",
    sources: [
      { label: "State spotted bass notes (KY, TN, AL, OK)", class: "agency" },
      { label: "Baker & Ross spotted bass habitat", class: "synthesis" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "Alabama bass behavior must not be inferred onto this record"],
  },
  {
    speciesId: "morone_saxatilis",
    status: "reviewed",
    social: {
      pattern: "schooling",
      note: "Pelagic schooling predator. A surface bust is not a license to run at a school, and this reading never includes coordinates.",
    },
    feedingStrategy: {
      modes: ["pursuit"],
      note: "Forage-following piscivore. Presentation families describe mechanical jobs around bait in the column, not a claim that a bust is in progress.",
    },
    dielTendency: {
      class: "crepuscular",
      note: "Low light and current increase surface and shallow feeding plausibility; bright summer midday is often deep.",
    },
    seasonalActivity:
      "Anadromous and landlocked fish do not share one seasonal story. RPC overlays separate coastal-river migration from reservoir pelagic travel. Spawning reaches and staging concentrations are never named.",
    thermalDrivenBehavior:
      "Summer thermal/oxygen squeeze is a conservation and positioning constraint, especially in landlocked reservoirs.",
    currentFacing:
      "Pelagic and current-oriented; uses current breaks as feeding stations, not as cover.",
    depthMovement:
      "Follows bait in the column; summer often on the thermocline in reservoirs.",
    predatorAvoidance:
      "Depth, turbidity, and school cohesion rather than weed cover.",
    coverUse:
      "Points, drop-offs, tailwaters, and open-water depth bands. Not a vegetation ambush fish.",
    openWaterBehavior:
      "Default identity, especially for landlocked fish: suspended, forage-following, basin-traveling.",
    spawningBehavior:
      "Flowing-water spawner. Landlocked fish may use dam tailraces and large tributaries. Spawning water is an invalidator, never a target layer.",
    sources: [
      { label: "ASMFC / NOAA Atlantic striped bass life history", class: "agency" },
      { label: "Setzler-Hamilton striped bass life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "anadromous versus landlocked diel table as a structured field"],
  },
  {
    speciesId: "morone_chrysops",
    status: "reviewed",
    social: {
      pattern: "schooling",
      note: "USFWS: migratory pelagic fish that spend most of their lives in open water chasing schools of baitfish.",
    },
    feedingStrategy: {
      modes: ["pursuit"],
      note: "USFWS: juveniles eat small invertebrates (crustaceans, midge larvae); adults are piscivorous on shad, silversides, and occasionally young sunfish. Shad are described as a favorite — that is diet, not a current hatch inference.",
    },
    dielTendency: {
      class: "crepuscular",
      note: "USFWS: most active during dawn and dusk. Catalog also notes daytime schooling with wind and low light moving the feed shallower.",
    },
    seasonalActivity:
      "Spring upriver or windblown-shore spawning runs are public, crowded, and excluded from secret-spot logic. The rest of the year is open-water forage following.",
    thermalDrivenBehavior:
      "Warmwater pelagic fish. Summer depth tracks bait and oxygen, not a weedline.",
    currentFacing:
      "Uses current during the run; otherwise pelagic around bait.",
    depthMovement:
      "Upper to mid-column when chasing shad; deeper when bait is down.",
    predatorAvoidance:
      "Schooling and the water column. Not cover-bound.",
    coverUse:
      "Points, flats, and open water rather than wood as a default.",
    openWaterBehavior:
      "Default adult identity.",
    spawningBehavior:
      "USFWS: spawn in freshwater tributaries or on rocky shoals at about 57°F; no nest-building or parental care. Exact riffles and access points are never named.",
    sources: [
      { label: "USFWS white bass species account", class: "agency", url: "https://www.fws.gov/species/white-bass-morone-chrysops" },
      { label: "State white bass notes (TX, OK, KS, TN)", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "morone_americana",
    status: "reviewed",
    social: {
      pattern: "schooling",
      note: "Schooling temperate bass, often more inshore/estuarine or lake-margin than striped bass, still not a vegetation-ambush centrarchid.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "Opportunistic on small fish, invertebrates, and available pelagic or nearshore prey. Introduced Great Lakes/inland populations should not inherit Atlantic-estuary assumptions wholesale.",
    },
    dielTendency: {
      class: "mixed",
      note: "Daylight schooling is common; low light can move fish shallower. Not a dedicated nocturnal catfish pattern.",
    },
    seasonalActivity:
      "Spring spawning movement in native tidal rivers is biological context. Inland introduced fish use lake and connecting-river structure.",
    currentFacing:
      "Uses current and tidal flow in the native range; inland fish use points, inlets, and connecting channels.",
    depthMovement:
      "Often shallower than striped bass in the same system, still column-oriented around forage.",
    predatorAvoidance:
      "Schooling and turbidity more than heavy cover.",
    coverUse:
      "Not a weed-edge ambush fish as the default. Channel edges, points, and open nearshore water.",
    openWaterBehavior:
      "Capable of open-water schooling, typically on a smaller geographic scale than striped bass.",
    spawningBehavior:
      "Spring spawner in native coastal/tidal systems. Introduced inland reproduction is a management/biology fact, not a named aggregation product.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species white perch profile", class: "agency" },
      { label: "State temperate-bass management literature (NY, MD, Great Lakes)", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "native estuarine versus introduced inland behavior table"],
  },
  {
    speciesId: "morone_hybrid_wiper",
    status: "reviewed",
    social: {
      pattern: "schooling",
      note: "Stocked pelagic hybrid. Presence is a stocking fact. Spring tributary movement with white bass is not evidence of reproduction.",
    },
    feedingStrategy: {
      modes: ["pursuit"],
      note: "Forage-following piscivore, typically shad-oriented in stocked reservoirs. Diet capacity is not a current hatch.",
    },
    dielTendency: {
      class: "crepuscular",
      note: "Low light, wind, and current can move schools shallower; bright stable periods often push fish and forage deeper.",
    },
    seasonalActivity:
      "Summer is an oxythermal and forage-depth problem. Spring current edges and tailwaters are mechanical context, not a spawning run.",
    thermalDrivenBehavior:
      "Summer depth is constrained by the combined temperature and oxygen squeeze.",
    currentFacing:
      "Strongly attracted to current edges, tailwaters, and feeder-creek plumes where moving water concentrates pelagic forage.",
    depthMovement:
      "Pelagic and forage-following.",
    predatorAvoidance:
      "Depth and schooling.",
    coverUse:
      "Current edges and basin structure, not vegetation ambush.",
    openWaterBehavior:
      "Default identity in reservoirs.",
    spawningBehavior:
      "Common wiper crosses are functionally sterile. They may make spring tributary movements with white bass but do not establish a normal reproductive run. Those movements are not a targeting product.",
    sources: [
      { label: "Missouri Department of Conservation hybrid striped bass field guide", class: "agency" },
      { label: "Kansas Department of Wildlife & Parks striped bass hybrid management plan", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "morone_mississippiensis",
    status: "reviewed",
    social: {
      pattern: "schooling",
      note: "Schooling temperate bass of pools, backwaters, and reservoirs. Do not collapse into white bass.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "Tracks small forage fish, with insects, crustaceans, and zooplankton as reviewed classes for smaller fish.",
    },
    dielTendency: {
      class: "mixed",
      note: "Wind, stain, and low light can bring schools shallower; bright clear conditions commonly reinforce deeper positioning.",
    },
    currentFacing:
      "Often favors quieter pools and backwaters in large rivers, while reservoir fish can school in open water around forage.",
    depthMovement:
      "Schooling mid-column predator; deeper pools and basins become more important outside shallow feeding windows.",
    coverUse:
      "Pools, backwaters, and open-water forage lanes more than weed ambush.",
    openWaterBehavior:
      "Reservoir fish can school pelagically; river fish are more pool-oriented than white bass on a main-channel run.",
    spawningBehavior:
      "Spring spawner that can move into tributaries or shallow lake zones as water warms. Exact aggregation points are never named.",
    sources: [
      { label: "Missouri Department of Conservation yellow bass field guide", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "diet seasonality as a structured field"],
  },
  {
    speciesId: "coregonus_artedi",
    status: "reviewed",
    social: {
      pattern: "schooling",
      note: "Pelagic schooling coregonid. A school is a forage- and temperature-linked aggregation, not a hotspot.",
    },
    feedingStrategy: {
      modes: ["filter", "opportunistic"],
      note: "Zooplankton-oriented pelagic feeder; aquatic insects and small fish appear in some diets. Do not infer a current plankton event.",
    },
    dielTendency: {
      class: "mixed",
      note: "Vertical position commonly tracks light and plankton. Ice fisheries catch them without that implying a winter feeding event.",
    },
    seasonalActivity:
      "Summer is an oxythermal-band problem in inland lakes. Late-fall/winter spawning is biology, not a targeting map. Spawning depth is never given as a location.",
    thermalDrivenBehavior:
      "Coldwater pelagic fish. Warm surface water and oxygen squeeze push usable habitat into a narrowing band.",
    currentFacing:
      "Basin circulation rather than river current. This record is stillwater.",
    depthMovement:
      "Suspended in the column; depth follows temperature, oxygen, and plankton.",
    predatorAvoidance:
      "Depth and schooling. Cisco are themselves major forage for lake trout and other predators.",
    coverUse:
      "Open-water depth bands, not wood or weeds.",
    openWaterBehavior:
      "Default identity.",
    spawningBehavior:
      "Fall-to-winter spawning ranges from shallow shoals to deep offshore habitat depending on stock. Spawning depth is never a target location.",
    sources: [
      { label: "Great Lakes / provincial coregonid assessments", class: "agency" },
      { label: "Minnesota DNR cisco identification and fishery notes", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, "diel vertical-migration amplitude as a structured field"],
  },
  {
    speciesId: "coregonus_clupeaformis",
    status: "reviewed",
    social: {
      pattern: "schooling",
      note: "Schooling coregonid, typically more benthic than cisco in the same waters.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding", "opportunistic"],
      note: "More bottom-oriented than cisco: invertebrates, some small fish, and available benthos. Not a surface-insect trout problem as the default.",
    },
    dielTendency: {
      class: "mixed",
      note: "Low light can lift fish in the column; much feeding remains associated with bottom or near-bottom structure.",
    },
    seasonalActivity:
      "Late-fall to early-winter spawning on rock, rubble, gravel, or firm shoals as water cools. Shoal locations are not a product output.",
    thermalDrivenBehavior:
      "Coldwater fish. Summer use of deep, oxygenated water is a constraint.",
    currentFacing:
      "Large-lake fish use basin circulation and current-washed structure, but this record does not treat them as a river-current species.",
    depthMovement:
      "Deeper and more benthic than cisco as a working contrast, with seasonal lifts toward spawning shoals.",
    predatorAvoidance:
      "Depth and schooling.",
    coverUse:
      "Basin, drop-off, rocky shoreline, humps, and thermocline edges rather than vegetation.",
    openWaterBehavior:
      "Uses open basins but with a stronger substrate association than cisco.",
    spawningBehavior:
      "Late-fall to early-winter spawner over clean rock, rubble, gravel, or firm shoals. Those shoals are excluded from targeting guidance.",
    sources: [
      { label: "Great Lakes / provincial lake whitefish assessments", class: "agency" },
      { label: "Minnesota DNR lake whitefish identification notes", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, "Great Lakes versus inland feeding-depth table"],
  },
  {
    speciesId: "hiodon_alosoides",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      note: "Often encountered as scattered to loosely grouped fish in large-river columns rather than tight pelagic balls.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "pursuit"],
      note: "Upper- to mid-column feeder on drifting and swimming prey: insects, emergers, terrestrials, small fish, crustaceans.",
    },
    dielTendency: {
      class: "crepuscular",
      note: "Large light-sensitive eyes (tapetum) make low light and turbid water especially plausible feeding windows. This is optics, not a bite score.",
    },
    thermalDrivenBehavior:
      "Cool-water large-river fish. Bright or cold conditions can push fish deeper in the same current system.",
    currentFacing:
      "Uses large-river current and eddy systems.",
    depthMovement:
      "Mid-column to near-surface during feeding, with deeper holding in bright or cold conditions.",
    clarityResponse:
      "More at home in stain and turbidity than mooneye. Do not merge the two records.",
    predatorAvoidance:
      "Turbidity, depth, and the water column rather than heavy cover.",
    coverUse:
      "Current, eddies, and the column. Not a wood-ambush fish as the default.",
    openWaterBehavior:
      "Uses open river channel and connected-lake surface/column water.",
    spawningBehavior:
      "Spring to early summer in large river systems. Spawning concentrations are not used as target recommendations.",
    sources: [
      { label: "Government of Alberta goldeye species profile", class: "agency" },
      { label: "Hoover juvenile goldeye identification (eye structure / tapetum)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "hiodon_tergisus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      note: "Loose groups in clear river runs and connected waters; not a cisco-style pelagic school as the default.",
    },
    feedingStrategy: {
      modes: ["drift_feeding", "opportunistic"],
      note: "Visual feeder on drifting insects and available small prey. Minnesota DNR notes fly-caught fish during mayfly hatches on some rivers — that is a documented feeding window class, not an inference that a hatch is occurring.",
    },
    dielTendency: {
      class: "mixed",
      note: "Can use low-light surface windows, but clear-water populations may remain active through daylight.",
    },
    currentFacing:
      "Uses clear river runs, pool margins, and current breaks, generally with less affinity for highly turbid water than goldeye.",
    depthMovement:
      "Upper-to-mid column while feeding, with deeper pool use when bright, cold, or inactive.",
    clarityResponse:
      "Clearer-water identity than goldeye. Superficial similarity does not transfer turbidity preference.",
    predatorAvoidance:
      "Depth and current more than stain, relative to goldeye.",
    coverUse:
      "Runs, seams, and pool tails rather than vegetation ambush.",
    openWaterBehavior:
      "Connected lakes and large pools; still more river-run than pelagic-basin.",
    spawningBehavior:
      "Spring to early-summer spawner in river and connected-water habitat. Timing varies with latitude and flow. Sites are not named.",
    sources: [
      { label: "Ontario mooneye species profile", class: "agency" },
      { label: "Minnesota DNR mooneye notes (Rainy River mayfly window as documented feeding class)", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "cyprinus_carpio",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      note: "Often in groups on feeding flats. Grouping is food- and habitat-linked, not a secret school.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding", "opportunistic"],
      note: "Benthic feeding on worms, mollusks, crustaceans, aquatic insects, and zooplankton. This is a tactile/olfactory bottom problem as much as a visual one.",
    },
    territoriality:
      "Not a nest-guarding centrarchid. Catalog exception: high pressure sensitivity is part of the reviewed identity.",
    anglingPressureResponse:
      "Catalog exception notes pressure sensitivity. Treat this as reduced conspicuous feeding and greater caution in clear, heavily used water — not a catch-probability score.",
    dielTendency: {
      class: "diurnal",
      note: "Daytime visual/tactile feeding on flats; more cautious in very clear bright water.",
    },
    seasonalActivity:
      "Shallow vegetation in spring spawning season is biology. Winter can mean deeper holding in some systems. Neither is a hotspot.",
    thermalDrivenBehavior:
      "Warm, fertile water. Cold water slows benthic feeding movement.",
    currentFacing:
      "Slow water and the inside of bends; feeds on flats more than in current cores.",
    depthMovement:
      "Shallow feeding; winters deeper in some systems.",
    waterLevelResponse:
      "Flooded vegetation and newly covered flats can become feeding habitat. Falling water concentrates remaining soft-bottom feeding ground. Structure class only.",
    predatorAvoidance:
      "Depth, turbidity, and distance from banks in clear water.",
    coverUse:
      "Shallow flats, inlets, weed edges, and slow side-channels — feeding ground more than ambush cover.",
    openWaterBehavior:
      "Uses open flats; not a pelagic predator.",
    spawningBehavior:
      "Shallow vegetation when water holds in the 60s. Spawning groups are excluded from targeting guidance. Invasive status varies by jurisdiction and is not a catch recommendation.",
    sources: [
      { label: "USGS NAS carp fact sheet", class: "agency" },
      { label: "Balon carp domestication / biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [FRONT_GAP],
  },
  {
    speciesId: "ictiobus_cyprinellus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      note: "Can group in slow channels and backwaters. Grouping plus long lifespan makes harvest context important; abundance is not resilience.",
    },
    feedingStrategy: {
      modes: ["filter", "benthic_feeding"],
      note: "Unusually plankton-oriented for a buffalo: zooplankton plus benthic invertebrates. Do not treat as carp. Suspended plankton mechanics apply only when zooplankton is actually observed.",
    },
    dielTendency: {
      class: "mixed",
      note: "Turbidity and plankton distribution generally matter more than light alone.",
    },
    thermalDrivenBehavior:
      "Warm large-river and reservoir fish. Clearer water can reinforce deeper or less exposed positioning.",
    currentFacing:
      "Prefers slow river channels, pools, backwaters, reservoirs, and turbid water rather than sustained fast current.",
    depthMovement:
      "Demersal to mid-depth, often shallower than deep-channel specialists, while filtering plankton or feeding on benthos.",
    predatorAvoidance:
      "Turbidity, depth, and size. Not a cover ambush fish.",
    coverUse:
      "Slow channels, backwaters, and basins more than wood as a feeding station.",
    openWaterBehavior:
      "Can use open, turbid, plankton-rich water; still not a Morone-style chase predator.",
    spawningBehavior:
      "Brief spring spawning in flooded margins, marshes, and tributary habitat around roughly 60–65°F. Spawning concentrations are not target outputs. Jurisdictional harvest rules remain external.",
    sources: [
      { label: "USGS Bigmouth Buffalo species profile", class: "agency" },
      { label: "Lackmann et al. validated centenarian longevity research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "ictiobus_bubalus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      note: "Large-river/reservoir groups associated with bottom feeding habitat, not pelagic bait chasing.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding"],
      note: "Downward sucker mouth and strong benthic identity: insects, crustaceans, worms, mollusks. Not carp, and not the plankton specialist that bigmouth can be.",
    },
    dielTendency: {
      class: "mixed",
      note: "Bottom feeding reduces direct light dependence; low light and turbidity can support shallower movement.",
    },
    currentFacing:
      "Common in large rivers and reservoirs, generally using moderate-to-slow channel water and bottom structure rather than fast riffles.",
    depthMovement:
      "Strong bottom orientation; deeper pools and channel edges are common adult habitat.",
    predatorAvoidance:
      "Depth and turbidity.",
    coverUse:
      "Channel edges, pools, and bottom structure rather than vegetation ambush.",
    openWaterBehavior:
      "Reservoir basins are used as bottom habitat, not as a pelagic chase layer.",
    spawningBehavior:
      "Spring spawning commonly begins around 60–65°F with eggs broadcast over vegetation, mud, and flooded margins. Sites are not named. Long-lived; local resilience should not be assumed.",
    sources: [
      { label: "Texas Parks and Wildlife smallmouth buffalo species account", class: "agency" },
      { label: "USGS smallmouth buffalo population-demographic research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "lepisosteus_osseus",
    status: "reviewed",
    social: {
      pattern: "solitary",
      note: "Typically solitary or loosely spaced patrolling fish, not a bait school.",
    },
    feedingStrategy: {
      modes: ["ambush", "pursuit"],
      note: "Visual predator on fish. Surface rolling or air gulping is not automatically feeding behavior. Gar eggs are toxic and are never forage or food.",
    },
    dielTendency: {
      class: "diurnal",
      note: "Can feed through daylight; warm calm periods often produce visible near-surface cruising without implying a feeding event.",
    },
    thermalDrivenBehavior:
      "Warmwater fish. Air-breathing (vascularized swim bladder) allows use of low-dissolved-oxygen water that excludes many other fishes. That is a habitat fact, not a bite predictor.",
    currentFacing:
      "Uses large-river current margins and backwaters but often patrols slow or open water rather than holding tightly to one piece of cover.",
    depthMovement:
      "Adults can occupy deep water while making shallow or surface-oriented movements; juveniles are more vegetation-associated.",
    predatorAvoidance:
      "Armor, size, and the option to gulp air. Not a hide-in-weeds-only fish.",
    coverUse:
      "Channel margins, points, and open patrol water more than inside-weed largemouth cover as the default.",
    openWaterBehavior:
      "Legitimate open-water cruising, especially in large rivers and reservoirs.",
    spawningBehavior:
      "Spring spawning in shallow quiet backwaters and vegetated margins as water warms. Eggs are toxic. Spawning sites are excluded from target guidance.",
    sources: [
      { label: "Florida Museum longnose gar species profile", class: "agency" },
      { label: "USFWS All About Alligator Gar (gar air-breathing / lateral movements as family context)", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "lepisosteus_oculatus",
    status: "reviewed",
    social: {
      pattern: "solitary",
      note: "Ambush-oriented and more cover-bound than longnose.",
    },
    feedingStrategy: {
      modes: ["ambush"],
      note: "Visual ambush on fish and larger invertebrates around vegetation and timber. Surface breathing is not a bite predictor. Eggs are toxic.",
    },
    dielTendency: {
      class: "diurnal",
      note: "Visual ambush feeding can occur through daylight; vegetation and stain reduce exposure.",
    },
    thermalDrivenBehavior:
      "Warm, low-gradient water. Air-breathing allows occupancy of vegetated, potentially low-oxygen backwaters.",
    currentFacing:
      "Strongly favors slow pools, backwaters, swamps, sloughs, and vegetated margins rather than fast current.",
    depthMovement:
      "Often shallow to mid-depth around vegetation and timber, with surface excursions for air that are not necessarily feeding.",
    predatorAvoidance:
      "Vegetation, stain, and armor.",
    coverUse:
      "Inside weedlines, weed edges, wood, and shallow vegetated flats.",
    openWaterBehavior:
      "Not the default. This is a vegetated backwater ambush fish more than a channel cruiser.",
    spawningBehavior:
      "Spring spawning in shallow vegetated margins, flooded timber, or backwater habitat. Spawning vegetation is not a target recommendation.",
    sources: [
      { label: "Texas Parks and Wildlife spotted gar account", class: "agency" },
      { label: "Illinois DNR / Missouri Department of Conservation spotted gar accounts", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "lepisosteus_platostomus",
    status: "reviewed",
    social: {
      pattern: "solitary",
      note: "Large-river/backwater ambush and patrol fish; more turbidity-tolerant than longnose in the reviewed notes.",
    },
    feedingStrategy: {
      modes: ["ambush", "pursuit"],
      note: "Visual ambush predator on fish. Capable of feeding in daylight; low light and stain can reduce the need for deep or covered positioning.",
    },
    dielTendency: {
      class: "diurnal",
      note: "Daylight ambush is plausible; stain substitutes for cover.",
    },
    currentFacing:
      "Uses large-river backwaters and slower margins rather than sustained fast current.",
    depthMovement:
      "Often shallow to mid-depth near backwaters and prey-rich margins, with access to deeper pools for refuge.",
    clarityResponse:
      "Turbidity is less limiting than for longnose gar in the reviewed record.",
    predatorAvoidance:
      "Turbidity, backwaters, and armor.",
    coverUse:
      "Side channels, eddies, shallow flats, and wood, with deeper pools as refuge.",
    openWaterBehavior:
      "Can patrol open backwater and pool water; not a pelagic basin species.",
    spawningBehavior:
      "Late-spring through summer spawning in quiet shallow water, with adhesive eggs scattered over vegetation or submerged objects. Sites are not named. Legal methods vary by jurisdiction.",
    sources: [
      { label: "Texas Parks and Wildlife shortnose gar species account", class: "agency" },
      { label: "Missouri Department of Conservation shortnose gar field guide", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "atractosteus_spatula",
    status: "reviewed",
    social: {
      pattern: "solitary",
      note: "Large, typically solitary ambush/patrol predator. Grouping on a map would be a hotspot product and is refused.",
    },
    feedingStrategy: {
      modes: ["ambush", "pursuit"],
      note: "Piscivorous ambush predator. Air-breathing is occupancy biology, not a feeding cue. USFWS notes family-level air breathing and lateral movements into connected water — without naming those waters.",
    },
    dielTendency: {
      class: "mixed",
      note: "Large-bodied visual predator capable of daylight feeding; low light and stain can reduce exposure.",
    },
    thermalDrivenBehavior:
      "Warm, large-river and connected backwater fish. Low dissolved oxygen is less of a barrier than for many other large fishes because gars gulp air.",
    currentFacing:
      "Large-river margins, oxbows, and slow connected water rather than high-gradient current.",
    depthMovement:
      "Can occupy deeper channel water and still make shallow movements. Juvenile habitat is more vegetated and is a confusion risk with spotted gar, not a targeting layer.",
    predatorAvoidance:
      "Size, armor, and turbid large-river water.",
    coverUse:
      "Large woody and vegetated edges in connected off-channel water, plus channel margins. Exact sites are not listed.",
    openWaterBehavior:
      "Adults can patrol open large-river water; this is still not a pelagic forage-school species like striped bass.",
    spawningBehavior:
      "Spawning and nursery habitat are conservation context only. Alligator gar is jurisdiction-gated in this catalog. Eggs of gars are toxic. No aggregation locations are published.",
    sources: [
      { label: "Florida Fish and Wildlife Conservation Commission alligator gar profile", class: "agency" },
      { label: "USFWS All About Alligator Gar", class: "agency" },
      { label: "Texas Parks and Wildlife alligator gar identification and management pages", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "system-specific movement literature without naming waters"],
  },
  {
    speciesId: "ameiurus_nebulosus",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage: "Guarded fry schools; adults typically solitary to loosely grouped on bottom habitat.",
      note: "Family groups around a nest are parental care, not a target aggregation.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding", "opportunistic"],
      note: "Bottom-oriented omnivore/predator on worms, insects, crustaceans, mollusks, and small fish. Scent and bottom contact often matter more than visual range.",
    },
    dielTendency: {
      class: "nocturnal",
      note: "Strong low-light and night feeding tendency. Nocturnal activity does not imply surface feeding.",
    },
    thermalDrivenBehavior:
      "Warmwater, tolerant of conditions that exclude many sight-feeders. Extreme cold slows bottom movement.",
    currentFacing:
      "Prefers little to moderate current and soft-bottomed protected water rather than fast river lanes.",
    depthMovement:
      "Bottom-oriented, using deeper water or cover by day and moving shallower under darkness or stain.",
    clarityResponse:
      "Olfaction reduces dependence on visibility. Stain is not an invalidator.",
    predatorAvoidance:
      "Night, depth, and cover. Spines are defensive anatomy, not a presentation note.",
    coverUse:
      "Wood, basins, weed edges, and deep pools — as bottom cover, not ambush vegetation in the largemouth sense.",
    openWaterBehavior:
      "Not pelagic. Open basins are used as bottom habitat.",
    spawningBehavior:
      "Protected shallow cavities or depressions as water warms. Parental guarding is not a target cue. Do not collapse brown, black, and yellow bullheads into one behavior record.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species brown bullhead profile", class: "agency" },
      { label: "EPA freshwater fish temperature criteria synthesis for brown bullhead", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "ameiurus_melas",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage: "Guarded young; adults bottom-oriented and often in groups only where habitat concentrates them.",
      note: "Family groups are not target aggregations.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding", "opportunistic"],
      note: "Strong odor and bottom delivery can matter more than lure-like visual matching. Omnivorous on invertebrates, detritus-associated prey, and small fish.",
    },
    dielTendency: {
      class: "nocturnal",
      note: "Low-light and nocturnal feeding is common; olfaction reduces dependence on visibility.",
    },
    thermalDrivenBehavior:
      "Especially tolerant of warm, turbid, low-gradient water.",
    currentFacing:
      "Slow, turbid, soft-bottomed water with little current.",
    depthMovement:
      "Bottom-oriented, often shallow at night and deeper or tighter to cover in bright conditions.",
    clarityResponse:
      "Turbidity is normal habitat, not a problem to wait out.",
    predatorAvoidance:
      "Night, turbidity, and cover.",
    coverUse:
      "Basins, wood, weed edges, and soft-bottom flats as feeding ground.",
    openWaterBehavior:
      "Not pelagic.",
    spawningBehavior:
      "Late-spring and summer cavity/depression spawning in protected shallow habitat. Family groups are not target aggregations.",
    sources: [
      { label: "Texas Parks and Wildlife black bullhead species account", class: "agency" },
      { label: "Washington Department of Fish and Wildlife black bullhead sportfish account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
  {
    speciesId: "ameiurus_natalis",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage:
        "TPWD: fry school in compact balls guarded by adults until about one inch. Adults are bottom-oriented rather than pelagic.",
      note: "Guarded fry balls are parental care, not a targeting product.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding", "opportunistic"],
      note: "TPWD: omnivorous, feeding on plant and animal material, live and dead; immature aquatic insects and crustaceans often comprise a considerable proportion of the diet.",
    },
    dielTendency: {
      class: "nocturnal",
      note: "Low-light and nocturnal feeding are common, though turbid water can extend activity into daylight.",
    },
    thermalDrivenBehavior:
      "Warm, slow, vegetated, and turbid water is normal, not exceptional.",
    currentFacing:
      "Slow current, backwaters, protected pools, and vegetated or woody margins rather than fast main-channel flow.",
    depthMovement:
      "Bottom-oriented; can move shallower at night and around food-rich margins.",
    predatorAvoidance:
      "Night, turbidity, and cover.",
    coverUse:
      "Wood, weed edges, shallow flats, and protected pools as bottom habitat.",
    openWaterBehavior:
      "Not pelagic.",
    spawningBehavior:
      "TPWD: late spring or early summer, excavate nests in mud bottoms; both parents guard 2,000–12,000 eggs; hatch in four to six days. Canonical season vocabulary stores this as spring and early_summer. Nest sites are not targeting outputs.",
    sources: [
      { label: "Texas Parks and Wildlife yellow bullhead species account", class: "agency", url: "https://tpwd.texas.gov/huntwild/wild/species/ybh/" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP],
  },
];
