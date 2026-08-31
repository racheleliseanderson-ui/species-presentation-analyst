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
  {
    speciesId: "salmo_trutta",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage:
        "Juveniles may share nursery water. Adults typically hold individual lies and become more hole-bound as they grow, especially large piscivores.",
      note: "Adult browns use a defended or repeatedly used lie more than rainbows of the same size. They are not a schooling pelagic species.",
    },
    feedingStrategy: {
      modes: ["ambush", "drift_feeding", "opportunistic"],
      note: "Intercepts drift and emergences, then shifts toward crayfish and fish as gape allows. Catalog exception: large piscivorous adults may ignore insect-scale presentations even when smaller fish are on them.",
    },
    territoriality:
      "More hole-bound and cover-oriented than rainbow. Velocity boundaries, undercut banks, wood, and the slow side of fast water are typical adult lies.",
    aggression:
      "Larger fish can exclude smaller trout from prime lies. That is spacing, not a catch claim.",
    dielTendency: {
      class: "crepuscular",
      note: "Catalog light response: strong low-light and night feeding, especially in clear or pressured water. Daytime feeding still occurs in broken light and stain.",
    },
    seasonalActivity:
      "Fall spawning is conservation context. Summer thermal refuge and winter slowing are constraints. Do not treat fall color as a targeting window.",
    thermalDrivenBehavior:
      "Preferred band roughly 50–60°F. Elliott's thermal work and the catalog put the cold edge near 40°F and the warm edge near 70°F. Warm edges push fish into cover, depth, or faster oxygenated water.",
    currentFacing:
      "Balances food delivery against energy cost. Faces into flow on seams, pool heads, and current breaks rather than occupying the fastest core.",
    depthMovement:
      "Holds deeper than rainbow in daylight; slides shallower in low light.",
    clarityResponse:
      "Very clear water increases nocturnal and cover use. Stain can allow more daylight feeding without implying a surface event.",
    anglingPressureResponse:
      "Catalog already ties pressure to stronger low-light and night feeding in clear water. This is a cover/light shift, not a catch-probability claim.",
    predatorAvoidance:
      "Undercut banks, wood, depth, and darkness. More cover-dependent than rainbow.",
    coverUse:
      "Undercut banks, submerged wood, deep pools, seams, and current breaks.",
    openWaterBehavior:
      "Lake fish use weed edges, drop-offs, inlets, wood, and thermocline edges rather than a river undercut. They still are not pelagic schoolers.",
    spawningBehavior:
      "Fall spawner as days shorten and temperature drops. Fish move onto gravel; spawning substrate and any pre-spawn holding water are excluded from target guidance.",
    sources: [
      { label: "USGS / state brown trout habitat notes", class: "agency" },
      { label: "Elliott thermal biology of brown trout", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "salvelinus_fontinalis",
    status: "reviewed",
    social: {
      pattern: "mixed_by_life_stage",
      byLifeStage:
        "Juveniles often share small pockets. Adults may feed near one another in tiny water without being a pelagic school.",
      note: "A small-water char. Competitive displacement by brown trout is a documented conservation/ecology fact, not a presentation rule.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "drift_feeding"],
      note: "Aquatic insects, terrestrials, and crustaceans; small fish where gape allows. Do not infer a current hatch from that capacity.",
    },
    territoriality:
      "Holds pockets and cover in small water rather than a single large-river hole.",
    dielTendency: {
      class: "diurnal",
      note: "Uses shade and broken water; less nocturnal than brown trout.",
    },
    seasonalActivity:
      "Fall spawning over groundwater-influenced gravel is conservation context. Summer warm lowland water is often lethal — presence does not imply a workable day.",
    thermalDrivenBehavior:
      "Preferred band roughly 46–56°F. Cold edge near 38°F; warm edge near 68°F. Stenothermal relative to brown trout.",
    currentFacing:
      "Avoids sustained high velocity. Uses pockets, undercuts, side channels, and wood in small water.",
    depthMovement:
      "Often shallow relative to other trout when cover is present.",
    predatorAvoidance:
      "Shade, broken water, undercuts, and wood. Small streams provide cover by structure, not depth.",
    coverUse:
      "Undercut banks, deep pockets, seams, side channels, and submerged wood.",
    openWaterBehavior:
      "Pond and high-lake fish use inlets, weed edges, wood, and drop-offs. They are not lake-trout pelagic char.",
    spawningBehavior:
      "Fall spawner over groundwater-influenced gravel. USFWS describes redd digging and male courtship. Redds and spawning gravel are excluded from target guidance.",
    sources: [
      { label: "U.S. Fish and Wildlife Service brook trout species profile", class: "agency" },
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
      byLifeStage:
        "Juveniles may use shallower rocky or shoal habitat. Adults are typically scattered pelagic or basin fish, not a tight bait-chasing school like white bass.",
      note: "A deep-water char. Great Lakes pelagic vs inland natural-lake calendars are RPC overlays and must be declared.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "Michigan DNR: adults feed primarily on other fish — native ciscoes and sculpin, and where available alewives, smelt, gobies, plus crustaceans and insects. That is diet capacity, not a current forage event.",
    },
    territoriality:
      "Not a hole-bound stream trout. Position follows temperature, oxygen, forage, and basin structure.",
    dielTendency: {
      class: "crepuscular",
      note: "Low light and depth. Bright midday summer often pushes fish down. Night and low light can allow shallower movement without proving a surface feed.",
    },
    seasonalActivity:
      "Fall spawning on rocky reefs is conservation context — fish leave the depths, and that substrate is not a target class. Summer is an oxythermal squeeze.",
    thermalDrivenBehavior:
      "Preferred band roughly 42–52°F. Warm edge near 60°F. Summer surface presence is usually a cold-water exception, not a default pattern.",
    currentFacing:
      "Stillwater. Uses points, humps, drop-offs, and basin edges, not river current.",
    depthMovement:
      "Deep and pelagic in summer; shallower in spring/fall and at night.",
    predatorAvoidance:
      "Depth and low light. Bright summer midday is a down-move, not a cover-wood problem.",
    coverUse:
      "Thermocline edge, basin, submerged humps, drop-offs, rocky shoreline, and suspended open water — structure as depth and forage, not stream wood.",
    openWaterBehavior:
      "Default adult mode is pelagic or basin-oriented. Inland vs Great Lakes pelagic detail is RPC.",
    spawningBehavior:
      "Fall spawner on rocky reefs as fish leave summer depth. Spawning substrate is excluded from target guidance. Do not name reefs or concentrations.",
    sources: [
      { label: "Michigan DNR lake trout species account", class: "agency" },
      { label: "Great Lakes / provincial lake trout assessments", class: "agency" },
      { label: "Martin & Olver lake trout biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "species-specific diel vertical-migration amplitudes by lake"],
  },
  {
    speciesId: "oncorhynchus_mykiss_steelhead",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage:
        "Juveniles rear in natal streams like rainbow parr. Returning adults use travel lanes and holding lies, not a feeding school.",
      note: "Adult steelhead are migratory trout in current. They are not inland rainbows that happen to be large.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "drift_feeding"],
      note: "Catalog exception: this record does not imply a hatch match; many winter fish are not feeding in the trout sense. Eggs, insects, and small fish are capacity, not a declared event.",
    },
    territoriality:
      "Holds travel-adjacent lies rather than a defended inland-rainbow feeding station.",
    dielTendency: {
      class: "crepuscular",
      note: "Low light and colored water increase movement. Bright, low, clear water often holds them tight to cover and depth.",
    },
    seasonalActivity:
      "Winter-run and summer-run stocks differ and must not be collapsed. Spawning overlap is conservation context. Listed Pacific DPSs require current NOAA and state rules.",
    thermalDrivenBehavior:
      "Preferred band roughly 42–55°F. Cold edge near 36°F; warm edge near 65°F. Summer low flow and heat are invalidators, not a shallow feeding cue.",
    currentFacing:
      "Travel lanes and holding lies adjacent to strong current, not the fastest core.",
    depthMovement:
      "Often near bottom in winter; higher in the column as water warms within band.",
    flowChangeResponse:
      "Flow pulses can move fish. That is migration/holding mechanics, not a named bottleneck.",
    clarityResponse:
      "Colored water can increase movement. Bright low clear water tightens lies.",
    predatorAvoidance:
      "Depth, current, and broken water. Bright low water is a hold-tight problem.",
    coverUse:
      "Runs, seams, tailwater, current breaks, pool heads, deep pools, and boulder pockets.",
    openWaterBehavior:
      "This catalog record is flowing water only. Stillwater steelhead is a fail-closed mismatch, not a lake-rainbow substitute.",
    spawningBehavior:
      "NOAA: hatch in gravel-bottomed, fast-flowing, well-oxygenated rivers; return to freshwater to spawn; may spawn more than once. Winter and summer-run timing must not be collapsed. Spawning gravel is excluded from target guidance. Listed DPSs are regulatory invalidators, never target layers.",
    sources: [
      { label: "NOAA Fisheries steelhead species profile", class: "agency" },
      { label: "Withler / Quinn anadromous Oncorhynchus reviews", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, "stock-specific winter vs summer run calendars as a structured overlay"],
  },
  {
    speciesId: "sander_vitreus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage:
        "Young fish may group more tightly than adults. Adults often share structure or a depth band without being a white-bass-style school.",
      note: "A group on a breakline is a forage-and-light problem, not a named pin. Northern natural-lake vs large-river calendars are RPC overlays and must be declared.",
    },
    feedingStrategy: {
      modes: ["pursuit", "opportunistic"],
      note: "Minnesota DNR: fish-eaters, preying heavily on yellow perch, which cannot see as well in low light. Insects and crustaceans remain capacity, especially in younger fish. Capacity is not a current forage event.",
    },
    territoriality:
      "Not a hole-bound trout. Position follows the light-food compromise: deeper in bright clear water, shallower in stain, wind, and low light.",
    dielTendency: {
      class: "crepuscular",
      note: "Minnesota DNR: usually feed in shallow water at dawn and dusk; daylight sends them into shade of structure or into deeper water. Turbidity, wave chop, or clouds can keep them active through the day. Catalog exception: dusk is metabolically and optically more plausible — it does not imply a bite.",
    },
    seasonalActivity:
      "Early-spring spawning on rock and current-washed gravel is conservation context. Summer is a light and thermal-depth problem. Fall follows forage and cooling water.",
    thermalDrivenBehavior:
      "Preferred band roughly 55–68°F. Cold edge near 42°F; warm edge near 76°F. Southern reservoirs depend on a cool hypolimnion and forage. Warm, bright surface water is a down-move, not a shallow default.",
    currentFacing:
      "Uses current and current-washed structure; not a slack-water ambush fish. Large-river vs lake-resident positioning is RPC.",
    depthMovement:
      "Follows the light-food compromise. Minnesota DNR: may suspend over deep water to feed on open-water species.",
    clarityResponse:
      "Clear bright water increases depth and shade use. Stain and chop can extend daylight feeding without proving a surface event.",
    predatorAvoidance:
      "Depth, shade, and turbidity. Bright midday in clear water is often a poor feeding window, not a location problem.",
    coverUse:
      "Points, drop-offs, breaklines, rocky shoreline, current breaks, tailwater, and thermocline edges. Wood and weeds are shade, not a pike-style ambush default.",
    openWaterBehavior:
      "Can suspend over basins when forage is pelagic. That is still not a white-bass school. RPC lake vs river must be declared.",
    spawningBehavior:
      "Minnesota DNR: spawn over rock, rubble, or gravel in rivers or windswept shallows as water leaves freezing, peaking near 42–50°F. Neither parent cares for eggs. Spawning substrate and any spring concentration are excluded from target guidance. Do not name reefs or reaches.",
    sources: [
      { label: "Minnesota DNR walleye biology", class: "agency" },
      { label: "Great Lakes / state walleye assessments", class: "agency" },
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
      byLifeStage:
        "Adults often share deep runs and pools without being a pelagic school.",
      note: "More riverine than walleye. A group in current is a habitat class, not a dam-name pin.",
    },
    feedingStrategy: {
      modes: ["pursuit", "benthic_feeding"],
      note: "Missouri DNR: a variety of fish, crustaceans, and insects. Stronger lower-column association than walleye. Capacity is not a current forage event.",
    },
    territoriality:
      "Holds deep runs, pools, and current breaks rather than a single defended hole.",
    dielTendency: {
      class: "crepuscular",
      note: "Missouri DNR: most active during low light, or during daylight in highly turbid water. Minnesota DNR: sauger see even better than walleye in darkness or turbid water, and that determines distribution.",
    },
    seasonalActivity:
      "Early-spring spawning in current is conservation context. Cool-season river use is the default; summer is still a bottom/current problem, not a weed-edge pike problem.",
    thermalDrivenBehavior:
      "Preferred band roughly 55–68°F. Cold edge near 38°F; warm edge near 80°F. More tolerant of turbidity and current than walleye; not a reason to import lake-walleye basin logic.",
    currentFacing:
      "Missouri DNR: principally large, free-flowing streams; found mainly in flowing water and often swift current. Faces into flow on the bottom of runs and pools.",
    depthMovement:
      "Strong lower-column and bottom association, particularly in daylight and clearer water.",
    clarityResponse:
      "More tolerant of turbidity than walleye. Murk can extend daylight feeding in current. Clear water tightens them to depth and bottom.",
    predatorAvoidance:
      "Depth, turbidity, and current. Bright clear shallows are a poor default.",
    coverUse:
      "Deep pools, runs, tailwater, current breaks, and pool heads. Hard bottom and velocity, not vegetation ambush.",
    openWaterBehavior:
      "Stillwater use is secondary and still bottom-oriented (drop-offs, points, basins). Do not import open-pelagic predator logic.",
    spawningBehavior:
      "Missouri DNR: spawning occurs in early spring, often at night, with adhesive eggs on rubble in current. Catalog exception: dam and spawning-run concentrations are not treated as aggregation targets. Spawning substrate is excluded from target guidance.",
    sources: [
      { label: "Missouri Department of Conservation sauger field guide", class: "agency" },
      { label: "Minnesota DNR walleye/sauger biology", class: "agency" },
      { label: "USGS sauger habitat and movement research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "esox_lucius",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage:
        "Young fish may share nursery vegetation. Adults are typically solitary ambush predators.",
      note: "A group of pike is coincidence of habitat, not a school. Overlap with muskellunge is a conservation and identification problem, not a combined targeting layer.",
    },
    feedingStrategy: {
      modes: ["ambush", "opportunistic"],
      note: "Michigan DNR: about 90 percent smaller fish — yellow perch, sunfishes, minnows, and suckers — plus frogs and other living prey the jaws can surround. Crayfish, waterfowl, and small mammals appear in that agency note but are not catalog forage classes here. Capacity is not a current event.",
    },
    territoriality:
      "Ambushes from slack adjacent to a food lane, not the current core. Vegetation, wood, and the slow side of a seam are typical lies.",
    aggression:
      "Can have significant impact on prey species (Michigan DNR). That is ecology, not a catch claim.",
    dielTendency: {
      class: "mixed",
      note: "Sight ambush predator. Uses edges and low light, but will eat in daylight in stained water. Bright, clear, high-sky days often pin fish tighter to cover.",
    },
    seasonalActivity:
      "Michigan DNR: spawn in the shallows right after ice leaves, and before muskellunge. That is conservation context. Summer is a deeper weed-edge and thermal problem. Catalog exception: warm, weedy southern water may hold pike that are thermally stressed, not feeding.",
    thermalDrivenBehavior:
      "Preferred band roughly 50–65°F. Cold edge near 36°F; warm edge near 75°F. Casselman’s thermal ecology and the catalog: as water warms, fish use deeper weed edges and cooler ambush structure.",
    currentFacing:
      "Slack adjacent to a food lane. Not a mid-channel current fish.",
    depthMovement:
      "Weeds and shallows in cool water; deeper weed edges and thermocline as summer warms (Michigan DNR: retreat somewhat deeper in midsummer).",
    clarityResponse:
      "Clear water increases cover dependence. Stain can allow more open-edge daylight feeding without a surface event.",
    predatorAvoidance:
      "Vegetation, wood, and depth. Bright shallow open water in midsummer is a poor default.",
    coverUse:
      "Weed edges, inside and outside weedlines, wood, inlets, points, side channels, and eddies.",
    openWaterBehavior:
      "Not an open-basin wanderer by default. Open water is a travel lane between ambush edges.",
    spawningBehavior:
      "Michigan DNR: Great Lakes-region pike spawn in the shallows in April or May, right after ice-out, and before muskellunge. Vegetated ice-out shallows are excluded from target guidance. Do not name marshes or tributary mouths as pins.",
    sources: [
      { label: "Michigan DNR northern pike species account", class: "agency" },
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
      byLifeStage:
        "Adults are typically solitary and use large structural and vegetation edges as travel and ambush corridors.",
      note: "Catalog exception: we do not give aggregation or spawning-site recommendations. A muskellunge on an edge is a habitat class, not a named pin.",
    },
    feedingStrategy: {
      modes: ["ambush", "pursuit", "opportunistic"],
      note: "Michigan DNR: predominantly fish-eating — suckers, minnows, perch, sunfishes, and other available fish. Amphibians remain capacity. This is adult piscivory, not a declared forage event.",
    },
    territoriality:
      "Uses large edges and funnels more than a single small pike hole. Follows forage along weed edges, points, and drop-offs.",
    dielTendency: {
      class: "crepuscular",
      note: "Low light and weather changes matter. Bright high-sky days often pin them to cover. That is a cover/light shift, not a catch claim.",
    },
    seasonalActivity:
      "Michigan DNR: spawns in early spring shortly after ice-out, but after northern pike. Conservation context. Summer is an edge-and-forage problem. Fall cooling can move fish with forage without becoming a spawn pin.",
    thermalDrivenBehavior:
      "Preferred band roughly 55–70°F. Cold edge near 42°F; warm edge near 80°F. Warm edges push fish to deeper outside weedlines and structural shade.",
    currentFacing:
      "Edges of current and large structural funnels; not open-basin wanderers by default.",
    depthMovement:
      "Weed-associated mid-depth; follows forage more than a single contour.",
    clarityResponse:
      "Clear water increases cover pinning on bright days. Stain can allow more edge travel in daylight.",
    predatorAvoidance:
      "Cover, depth, and low light. Bright open flats are a poor default.",
    coverUse:
      "Weed edges, outside weedlines, points, inlets, wood, and drop-offs.",
    openWaterBehavior:
      "May travel between large structural pieces. That is not a pelagic school and is not a reason to import open-water trolling families this record does not have.",
    spawningBehavior:
      "Michigan DNR: early spring after ice-out, after pike. Vegetated shallows and tributary mouths in the catalog spawning note are biology. They are excluded from target guidance. Do not name aggregation sites.",
    sources: [
      { label: "Michigan DNR muskellunge species account", class: "agency" },
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
      byLifeStage:
        "Adults ambush from vegetation and slack cover. They are not open-pelagic pike.",
      note: "Catalog exception: chain pickerel are cover-oriented esocids; open-pelagic pike logic should not be imported automatically.",
    },
    feedingStrategy: {
      modes: ["ambush"],
      note: "North Carolina Wildlife: young feed mainly on aquatic insects and crustaceans until about 4 in, then primarily fish. Amphibians remain capacity. Capacity is not a current event.",
    },
    territoriality:
      "Ambushes from vegetation and slack-water cover. Sustained main-channel current is not the default feeding position.",
    dielTendency: {
      class: "mixed",
      note: "Sight-oriented ambush predator. Low light and stained water can increase use of open edges; bright conditions reinforce cover.",
    },
    seasonalActivity:
      "Early-spring spawning in flooded vegetation is conservation context. Summer is a weed-and-shade problem. Winter remains a cover-edge problem in ice-free eastern water.",
    thermalDrivenBehavior:
      "Preferred band roughly 60–70°F. Cold edge near 42°F; warm edge near 82°F. More at home in warmer vegetated water than northern pike.",
    currentFacing:
      "Slack, side channels, and the slow side of a seam. Not a mid-channel fish.",
    depthMovement:
      "Primarily shallow to mid-depth around weeds and cover, with deeper edge use during bright or warm periods.",
    clarityResponse:
      "Stain can open the edge. Bright clear water pins fish inside vegetation.",
    predatorAvoidance:
      "Weeds, wood, and shade. Open pelagic water is a mismatch.",
    coverUse:
      "Weed edges, inside and outside weedlines, wood, and shallow flats adjacent to cover.",
    openWaterBehavior:
      "Not an open-water esocid. Open water is a short intercept off a weed edge, not a basin search.",
    spawningBehavior:
      "Early spring in flooded vegetation and shallow margins. Catalog exception: flooded spawning margins are never named as aggregation targets.",
    sources: [
      { label: "South Carolina DNR chain pickerel account", class: "agency" },
      { label: "North Carolina Wildlife chain pickerel species account", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species chain pickerel profile", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "perca_flavescens",
    status: "reviewed",
    social: {
      pattern: "schooling",
      byLifeStage:
        "Schools persist from juvenile through adult. Catalog exception: a school is a forage-linked, moving aggregation — not a named pin.",
      note: "Michigan DNR: perch travel in schools, generally preferring relatively shallow water near shore.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "pursuit"],
      note: "Michigan DNR: adults take immature insects, larger invertebrates (crayfish), and the eggs and young of other fish, from open water and from the bottom. Eggs are an agency diet note, not a catalog forage class on this record. Capacity is not a current hatch.",
    },
    territoriality:
      "Schools more than holds a single lie. Mild current and current-washed points, not a defended hole.",
    dielTendency: {
      class: "diurnal",
      note: "Michigan DNR: tend to travel shoreward each morning and evening to feed; in spring and fall they appear to feed throughout the day. At night they rest on the bottom and refrain from feeding. Low light may break schools toward shallows without turning night into the feeding default.",
    },
    seasonalActivity:
      "Early-spring spawning over vegetation and wood is conservation context. Summer follows cooler, slightly deeper water. Michigan DNR: unlike many Great Lakes species, perch remain active all winter under ice in both shallow and deeper water.",
    thermalDrivenBehavior:
      "Preferred band roughly 54–68°F. Michigan DNR: when given the choice they prefer about 66–70°F and often follow the 68°F level. Cold edge near 40°F; warm edge near 76°F. Summer surface heat is a down-move along a break, not a deep-basin lake-trout problem.",
    currentFacing:
      "Mild current and current-washed points. Schools move; they do not face a trout-style seam as a default.",
    depthMovement:
      "Michigan DNR: rarely taken from waters more than 30 feet deep; spring and fall shallower than in the heat of summer. Follows zooplankton and bait along a break.",
    clarityResponse:
      "Daylight schooling in a wide clarity range. Extreme turbidity is a walleye/sauger optical story, not this one.",
    predatorAvoidance:
      "Schooling and modest depth. Bass, walleye, and pike all prey on perch (Michigan DNR) — that is ecology, not a presentation rule.",
    coverUse:
      "Weed edges, drop-offs, points, basins, riprap, and inlets. Cover is a school location class, not an ambush hole.",
    openWaterBehavior:
      "Often mid-depth along a break or over a basin when following forage. Still a school, not a pelagic white-bass chase.",
    spawningBehavior:
      "Michigan DNR: spawn in the spring, laying eggs in gelatinous strings over dense vegetation, roots, and fallen trees in the shallows. That habitat is excluded from target guidance. Do not convert egg strings into a fishing cue.",
    sources: [
      { label: "Michigan DNR yellow perch species account", class: "agency" },
      { label: "Great Lakes perch assessments", class: "agency" },
      { label: "Thorpe yellow perch biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "pomoxis_spp",
    status: "reviewed",
    social: {
      pattern: "schooling",
      byLifeStage:
        "Minnesota DNR: both species travel open water in schools. A school is a forage-linked, moving aggregation — not a named pin. Catalog exception: a strong year-class can make a water look uniformly sized; that is population structure, not a location.",
      note: "This record is the black/white complex. Black crappie often use deeper, cooler, clearer water than white crappie in the same system. That split is not a separate catalog identity.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "pursuit"],
      note: "Minnesota DNR: young eat small aquatic invertebrates; adults can continue on plankton but usually eat a lot of small fish as well. Capacity is not a current forage event.",
    },
    territoriality:
      "Schools more than holds a single lie. Slack and slow water; river fish use backwaters, not the main current.",
    dielTendency: {
      class: "crepuscular",
      note: "Minnesota DNR: feeding on similar foods at night, dawn, and dusk. Bright clear days push fish tighter to cover or deeper. That is a light/cover shift, not a catch claim.",
    },
    seasonalActivity:
      "Spring spawning in wood and brush as water holds in the upper 50s to mid-60s is conservation context. Winter often deeper timber or basins. Summer follows bait around cover and shade.",
    thermalDrivenBehavior:
      "Preferred band roughly 58–72°F. Cold edge near 44°F; warm edge near 82°F. Black crappie in the complex prefer cooler, clearer water than white crappie.",
    currentFacing:
      "Slack. Backwaters, eddies, and side channels — not the current core.",
    depthMovement:
      "Suspend around cover and follow bait. Winter often deeper timber or basins. Bright midday summer is a down-move or a tighter-to-wood move.",
    clarityResponse:
      "Stain can allow shallower daylight use. Bright clear water increases depth and shade.",
    predatorAvoidance:
      "Wood, docks, shade, and depth. Open bright flats are a poor default.",
    coverUse:
      "Wood, dock shade, weed edges, drop-offs, basins, inlets, and suspended open water around bait.",
    openWaterBehavior:
      "Schools travel open water when following forage. That is still not a white-bass pelagic chase, and it is not a pin.",
    spawningBehavior:
      "Minnesota DNR: spawn in May and June in water in the mid-60s, in water up to several feet deep. Males build and guard nests in colonies. Colonial wood and brush are excluded from target guidance.",
    sources: [
      { label: "Minnesota DNR crappie biology", class: "agency" },
      { label: "State crappie management summaries", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "lepomis_macrochirus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage:
        "Juveniles often share vegetation. Adults feed in loose groups around cover without being a crappie-style open-water school.",
      note: "Colonial nesting is a reproductive state. Catalog exception: bed targeting of spawning colonies is never a recommendation.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "drift_feeding"],
      note: "Michigan DNR: fry eat zooplankton; larger fish add aquatic insects and some plant matter. Small fish appear in that agency note but are not a catalog forage class on this record. Terrestrials and worms remain capacity. Do not infer a current hatch.",
    },
    territoriality:
      "Holds vegetated slack rather than a current core. Nesting males defend a saucer; that is spawning biology.",
    dielTendency: {
      class: "diurnal",
      note: "Daytime sight feeder in and around cover; shade in high sun.",
    },
    seasonalActivity:
      "Michigan DNR: spawns in the shallows in late spring or early summer when water reaches about 65°F, and waves can continue through summer. That is conservation context. Winter may use deeper cover on bright days.",
    thermalDrivenBehavior:
      "Preferred band roughly 68–80°F. Cold edge near 52°F; warm edge near 90°F. Warm still water is the default, not a trout thermal story.",
    currentFacing:
      "Little current. Vegetated slack, eddies, and side channels.",
    depthMovement:
      "Shallow to mid around vegetation; deeper on bright winter days in some lakes.",
    clarityResponse:
      "Clear water increases shade and weed use at high sun. Stain can allow more open-edge daylight feeding.",
    predatorAvoidance:
      "Weeds, docks, wood, and shade. Open bright shallows without cover are a poor default.",
    coverUse:
      "Weed edges, inside weedlines, dock shade, shallow flats, and wood.",
    openWaterBehavior:
      "Not a pelagic schooler. Open water is a short intercept off a weed or dock edge.",
    spawningBehavior:
      "Colonial nests in shallows through much of summer. Males guard eggs and newly hatched young (Michigan DNR). Spawning colonies are excluded from target guidance.",
    sources: [
      { label: "Michigan DNR bluegill species account", class: "agency" },
      { label: "Werner / Mittelbach sunfish foraging ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "lepomis_gibbosus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage:
        "Adults use vegetated margins, often overlapping bluegill without sharing the same benthic emphasis.",
      note: "Catalog exception: pumpkinseed and bluegill frequently overlap, but pumpkinseed generally has a stronger mollusk and benthic-invertebrate component. Do not convert visible nesting colonies into a targeting recommendation.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "benthic_feeding"],
      note: "Insects, mollusks, crustaceans, zooplankton, and some small fish. Molar-like pharyngeal teeth can crack clam and snail shells (NEMESIS / Jenkins & Burkhead). That is capacity, not a current snail event.",
    },
    territoriality:
      "Protected margins, vegetation, and wood. Nesting males defend a saucer.",
    dielTendency: {
      class: "diurnal",
      note: "Primarily a daylight feeder; shade and broken light concentrate cover use on bright days.",
    },
    seasonalActivity:
      "Nesting as littoral water warms into the upper 60s and 70s. Conservation context. Winter remains a vegetated-edge problem, not a basin-crappie problem.",
    thermalDrivenBehavior:
      "Preferred band roughly 68–78°F. Cold edge near 50°F; warm edge near 86°F.",
    currentFacing:
      "Absent to sluggish current. Protected margins rather than a fast core.",
    depthMovement:
      "Mostly shallow to mid-depth around vegetation; deeper edges under bright light or seasonal cooling.",
    predatorAvoidance:
      "Weeds, wood, and dock shade.",
    coverUse:
      "Weed edges, inside weedlines, wood, dock shade, and shallow flats.",
    openWaterBehavior:
      "Not an open-water schooler.",
    spawningBehavior:
      "Early-summer and summer nesting in littoral water. Colonial or concentrated nesting habitat is excluded from target guidance.",
    sources: [
      { label: "National Park Service pumpkinseed species account", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species pumpkinseed profile", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "lepomis_microlophus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage:
        "Adults feed near bottom around vegetation, sand, mud, and shell-bearing substrate, often slightly deeper than bluegill.",
      note: "Mollusks are a defining forage class, but insect and crustacean feeding remains important where snails are sparse. Nesting colonies are never named as target locations.",
    },
    feedingStrategy: {
      modes: ["benthic_feeding"],
      note: "Missouri DNR: carnivorous, feeding primarily on snails and other mollusks — the shellcracker name. Throat teeth crush shells. Insects and crustaceans remain capacity. This is not a current snail declaration.",
    },
    territoriality:
      "Bottom and cover, not a current core. Nesting males defend closely packed saucers.",
    dielTendency: {
      class: "diurnal",
      note: "Missouri DNR: most active in daylight. Bright clear conditions can shift fish deeper while preserving bottom and cover association.",
    },
    seasonalActivity:
      "Spawning commonly in warm shallow water around 70–75°F, often somewhat deeper than bluegill nests. Conservation context. Summer remains a bottom-and-mollusk problem.",
    thermalDrivenBehavior:
      "Preferred band roughly 72–81°F. Cold edge near 52°F; warm edge near 90°F. A warmwater, still-water fish.",
    currentFacing:
      "Still water or protected overflow pools and bays. Avoids sustained main-channel current (Missouri DNR).",
    depthMovement:
      "Often slightly deeper littoral water than bluegill, still near bottom.",
    predatorAvoidance:
      "Depth, vegetation, and bottom. Bright surface water is a poor default.",
    coverUse:
      "Weed edges, outside weedlines, wood, shallow flats, and drop-offs — as bottom, not as a bluegill surface edge.",
    openWaterBehavior:
      "Not a pelagic schooler. Open water is not the job.",
    spawningBehavior:
      "Missouri DNR: nesting in May or June, sometimes again in August; saucer-shaped colonies with rims often almost touching. Colonies are excluded from target guidance.",
    sources: [
      { label: "Missouri Department of Conservation redear sunfish field guide", class: "agency" },
      { label: "Texas Parks and Wildlife redear sunfish account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "lepomis_cyanellus",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage:
        "Juveniles may share cover. Adults are strongly structure-oriented and more territorial than bluegill.",
      note: "Catalog exception: green sunfish readily hybridize with other sunfishes; a hybrid should not silently inherit this record. Introduced populations can affect native fish and amphibians; local status matters.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "ambush"],
      note: "Texas Parks and Wildlife: adults feed on insects and small fish. Crustaceans, terrestrials, and mollusks remain capacity. More piscivorous at typical size than bluegill.",
    },
    territoriality:
      "Pools, margins, wood, and reduced velocity. Nesting males defend closely packed nests for several days after eggs are deposited (Texas Parks and Wildlife).",
    dielTendency: {
      class: "diurnal",
      note: "Daylight feeder that uses shade, cover, and turbidity to reduce exposure.",
    },
    seasonalActivity:
      "Spawning begins as water warms into the upper 60s to low 70s and may repeat through summer. Conservation context. Stream pools remain usable later than many Lepomis.",
    thermalDrivenBehavior:
      "Preferred band roughly 70–82°F. Cold edge near 50°F; warm edge near 90°F. Notably tolerant of turbidity, silt, and variable habitat.",
    currentFacing:
      "More stream-tolerant than many Lepomis but still favors pools, margins, cover, and reduced velocity over a fast current core.",
    depthMovement:
      "Usually shallow to mid-depth and structure-oriented; larger fish use deeper cover when light or pressure increases.",
    clarityResponse:
      "Tolerates turbidity better than pumpkinseed or redear. Murk is not a reason to import walleye optics.",
    predatorAvoidance:
      "Wood, riprap, shade, and undercut margins.",
    coverUse:
      "Wood, weed edges, dock shade, shallow flats, riprap, eddies, and side channels.",
    openWaterBehavior:
      "Not an open-water sunfish.",
    spawningBehavior:
      "Texas Parks and Wildlife: nests in shallow colonies, often closely packed, usually on gravel or rock. Males defend nests. Colonies are excluded from target guidance.",
    sources: [
      { label: "Texas Parks and Wildlife green sunfish account", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species green sunfish profile", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "ambloplites_rupestris",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage:
        "Adults hold rock, wood, and velocity relief. They often coexist with smallmouth without sharing the same prey scale.",
      note: "Catalog exception: rock bass cover use and prey scale should not be treated as identical to smallmouth. Nest guarding is a reproductive state, not a recommendation to target beds.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "ambush"],
      note: "Michigan DNR: smaller fish (including their own young at times), yellow perch, and minnows, plus insects and crustaceans. Equal-opportunity feeders on baitfish, aquatic insects, and crayfish. Occasionally take food from the surface. Capacity is not a current crayfish event.",
    },
    territoriality:
      "Rock, wood, pool structure, and velocity relief rather than the fastest lane. Nesting males aggressively guard a saucer.",
    aggression:
      "Michigan DNR: nesting males can become quite aggressive defending territory. That is spawning biology, not a catch claim.",
    dielTendency: {
      class: "crepuscular",
      note: "Michigan DNR: adult rock bass may eat heavily in the evening and early morning. Shade and rock cover remain useful through the day.",
    },
    seasonalActivity:
      "Spring to early-summer nest spawning over gravel, sand, and rocky littoral habitat. Conservation context. Summer remains a rock-and-crayfish problem.",
    thermalDrivenBehavior:
      "Preferred band roughly 68–76°F. Cold edge near 48°F; warm edge near 84°F. Clear rocky water is the default, not a weedy bluegill pond.",
    currentFacing:
      "Permanent-flow streams, holding around rock, wood, and velocity relief — not the fastest lane.",
    depthMovement:
      "Shallow to mid-depth around rock and cover, moving deeper with high sun, pressure, or seasonal cooling.",
    predatorAvoidance:
      "Rock, shade, and depth. Bright open sand is a poor default.",
    coverUse:
      "Rocky shoreline, riprap, points, wood, drop-offs, boulder pockets, current breaks, and pool heads.",
    openWaterBehavior:
      "Not a pelagic schooler. Open water is a short intercept off rock.",
    spawningBehavior:
      "Michigan DNR: spawning from April to early June as water warms; the male digs a nest near lake shallows and guards eggs and young. Nesting areas may be closely packed. Nests are excluded from target guidance.",
    sources: [
      { label: "Michigan DNR rock bass species account", class: "agency" },
      { label: "Illinois Department of Natural Resources rock bass account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "lepomis_auritus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage:
        "Adults use pools, current margins, wood, and rocky or sandy cover. They overlap other Lepomis without sharing bluegill’s still-water default.",
      note: "Catalog exception: more comfortable in moving water than bluegill. South Carolina DNR nests may be solitary or in groups of more than 80; colonies are never a targeting recommendation.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "benthic_feeding"],
      note: "South Carolina DNR: aquatic and terrestrial insects, crayfish, mollusks, and other fish. North Carolina Wildlife: bottom-dwelling insect larvae, snails, clams, shrimp, crayfish, and small fish. Virginia DWR: opportunistic on what is seasonally available. Capacity is not a current hatch.",
    },
    territoriality:
      "Pools, current breaks, wood, and rocky or sandy margins rather than a fast core. Nesting males guard a saucer.",
    dielTendency: {
      class: "diurnal",
      note: "Catalog light response: daylight sight feeder, with shade and broken light improving shallow cover use.",
    },
    seasonalActivity:
      "South Carolina DNR: spawn late May through July at about 65–75°F. Virginia DWR: May through July. That is conservation context. Stream pools remain usable later than a still-water bluegill pond.",
    thermalDrivenBehavior:
      "Preferred band roughly 68–80°F. Cold edge near 50°F; warm edge near 88°F. Warm river and creek water is the default, not a trout thermal story.",
    currentFacing:
      "Virginia DWR: can inhabit faster flowing waters than many other sunfish species. Still favors pools, current margins, and cover over the fastest lane.",
    depthMovement:
      "Shallow to mid-depth around rock, wood, and vegetation; deeper when bright, cold, or pressured.",
    predatorAvoidance:
      "Wood, boulders, undercut margins, and shade. Bright open sand without cover is a poor default.",
    coverUse:
      "Pool tails, runs, current breaks, boulder pockets, submerged wood, rocky shoreline, weed edges, and dock shade.",
    openWaterBehavior:
      "Not a pelagic schooler. Open water is a short intercept off cover.",
    spawningBehavior:
      "South Carolina DNR: males construct large saucer-shaped nests typically in shallow water on sand or gravel; nests may be solitary or built in groups of more than 80. Males guard. Colonies are excluded from target guidance.",
    sources: [
      { label: "South Carolina DNR redbreast sunfish account", class: "agency" },
      { label: "North Carolina Wildlife Resources Commission redbreast sunfish profile", class: "agency" },
      { label: "Virginia DWR redbreast sunfish account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "lepomis_gulosus",
    status: "reviewed",
    social: {
      pattern: "solitary",
      byLifeStage:
        "Virginia DWR: often solitary, preferring to isolate in thick submerged vegetative cover near hard structure or undercut banks. Juveniles may share cover.",
      note: "Texas Parks and Wildlife: quite secretive. Seek cover in rocky banks, stumps or weeds. Catalog exception: warmouth and rock bass are distinct despite overlapping nicknames such as goggle-eye. Texas Parks and Wildlife: hybridization with bluegill and green sunfish is documented; a hybrid should not silently inherit this record.",
    },
    feedingStrategy: {
      modes: ["ambush", "opportunistic"],
      note: "Texas Parks and Wildlife: sight feeders. FWC: crayfish, shrimp, insects, and small fishes make up the bulk of the diet. Adults also take mollusks (Texas Parks and Wildlife). Capacity is not a current crayfish event.",
    },
    territoriality:
      "Stumps, wood, vegetation, and quiet water. FWC: solitary nesters that prefer to nest adjacent to a submerged object. Nesting males aggressively defend eggs and fry (Texas Parks and Wildlife).",
    dielTendency: {
      class: "diurnal",
      note: "FWC: most feeding is done in the morning; the account describes little night feeding. Shade and cover remain useful through the day.",
    },
    seasonalActivity:
      "Texas Parks and Wildlife: spawn in the spring when water reaches about 71°F and continuing through the summer. FWC: often more than once a year, usually between April and August. Conservation context. Quiet cover remains the job.",
    thermalDrivenBehavior:
      "Preferred band roughly 70–82°F. Cold edge near 52°F; warm edge near 90°F. Texas Parks and Wildlife: can survive in polluted, low-oxygenated waters where other sunfish cannot. That is tolerance, not a targeting cue.",
    currentFacing:
      "Quiet or slow water. Lakes, ponds, swamps, and quiet stream areas with muddy bottoms and vegetation (Texas Parks and Wildlife). Not a current-core fish.",
    depthMovement:
      "Usually shallow to mid-depth tight to cover. FWC: nests over a wide range of water depths; that is spawning biology, not a depth rule.",
    clarityResponse:
      "FWC: more tolerance for muddy water than most species. Murk is not a reason to import walleye optics.",
    predatorAvoidance:
      "Stumps, weeds, undercut banks, and shade. Open bright flats are a poor default.",
    coverUse:
      "Wood, weed edges, inside weedlines, shallow flats, dock shade, eddies, and side channels.",
    openWaterBehavior:
      "Not an open-water sunfish.",
    spawningBehavior:
      "Texas Parks and Wildlife: males construct a disc-shaped nest by fanning silt and debris; after the female deposits eggs the male fertilizes and aggressively defends nest, eggs, and fry. FWC: solitary nesters adjacent to a submerged object. Nests are excluded from target guidance.",
    sources: [
      { label: "Texas Parks and Wildlife warmouth account", class: "agency" },
      { label: "Florida Fish and Wildlife Conservation Commission warmouth profile", class: "agency" },
      { label: "Virginia DWR warmouth account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "lepomis_megalotis",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage:
        "Adults use clear stream pools, inlets, and overflow water adjacent to channels. They overlap other Lepomis without inheriting a bluegill pond default.",
      note: "Missouri DNR: nests in colonies, often so close that rims nearly touch. Colonial nests are never a targeting recommendation. Catalog exception: more stream-associated than bluegill but still avoids the fastest current core.",
    },
    feedingStrategy: {
      modes: ["opportunistic", "benthic_feeding"],
      note: "Missouri DNR: carnivorous, feeding on insects, small crustaceans, and some small fish. Illinois DNR: follows turtles and suckers as they feed on the bottom, eating organisms dislodged from the substrate. That is a feeding mechanic, not a current event and not a recommendation to work nesting colonies of other sunfish.",
    },
    territoriality:
      "Pools, inlets, and protected edges. Nesting males remain with the nest for more than two weeks (Missouri DNR).",
    dielTendency: {
      class: "diurnal",
      note: "Missouri DNR: most active in daytime. Clear water and structure support visual insect and crustacean feeding.",
    },
    seasonalActivity:
      "Missouri DNR: nests in colonies from mid-May to early or mid-August. Illinois DNR: spawns May through August. Conservation context. Summer remains a clear-stream pool problem.",
    thermalDrivenBehavior:
      "Preferred band roughly 68–80°F. Cold edge near 50°F; warm edge near 90°F. Clear permanent-flow water is the default, not a weedy bluegill pond.",
    currentFacing:
      "Missouri DNR: avoids strong currents. Occurs in reservoirs, ponds, and in pools, inlets, and overflow waters adjacent to stream channels. Favors clear, permanent-flowing streams with sandy or rocky bottoms and aquatic vegetation.",
    depthMovement:
      "Primarily shallow-to-mid littoral and pool water around rock, sand, vegetation, and current relief.",
    predatorAvoidance:
      "Pools, vegetation, and current relief. The fastest open lane is a poor default.",
    coverUse:
      "Eddy, side channel, current break, pool tail, submerged wood, weed edge, shallow flat, rocky shoreline, and inlets.",
    openWaterBehavior:
      "Not a pelagic schooler.",
    spawningBehavior:
      "Missouri DNR: evenly rounded nests nearly always fanned over small chert gravel; rims often nearly touch; the male stays with the nest for more than two weeks until fry have hatched and dispersed. Colonies are excluded from target guidance.",
    sources: [
      { label: "Missouri Department of Conservation longear sunfish field guide", class: "agency" },
      { label: "Illinois Department of Natural Resources longear sunfish account", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
  {
    speciesId: "centrarchus_macropterus",
    status: "reviewed",
    social: {
      pattern: "loose_aggregation",
      byLifeStage:
        "Adults use vegetated, tannic or clear backwater rather than a current core. They can overlap crappie cover without sharing Pomoxis schooling language.",
      note: "Catalog exception: habitat is low-gradient backwater; do not apply generic river-current sunfish mechanics simply because the water is technically flowing. South Carolina DNR nests are often in groups; grouped nests are never a targeting recommendation.",
    },
    feedingStrategy: {
      modes: ["opportunistic"],
      note: "South Carolina DNR: small aquatic insects and small fishes. Illinois DNR: insects, fishes, and crustaceans. Catalog also lists mollusks, worms, and zooplankton as capacity. Observed forage still outranks an assumed single prey class.",
    },
    territoriality:
      "Vegetation, wood, and protected backwater. Nesting males build and defend nests (South Carolina DNR).",
    dielTendency: {
      class: "diurnal",
      note: "Cover and tannic water reduce high-sun exposure; insect and invertebrate feeding remains plausible throughout daylight in protected habitat.",
    },
    seasonalActivity:
      "South Carolina DNR: spawning begins earlier than most sunfish, around March to May at about 55–65°F. Illinois DNR: spawns in April. Conservation context. Summer remains a vegetated backwater problem, not a river-current sunfish problem.",
    thermalDrivenBehavior:
      "Preferred band roughly 62–76°F. Cold edge near 46°F; warm edge near 86°F. Cooler and earlier than most Lepomis spawn calendars.",
    currentFacing:
      "Strongest fit is slack to very slow, vegetated backwater. South Carolina DNR: swamps, creeks, ponds, backwaters, sloughs, and low-flowing streams. Not a sustained current fish.",
    depthMovement:
      "Usually shallow-to-mid around vegetation, wood, and protected backwater structure.",
    predatorAvoidance:
      "Weeds, wood, and tannic cover. Bright open water is a poor default.",
    coverUse:
      "Weed edges, inside weedlines, wood, shallow flats, inlets, dock shade, eddies, side channels, and deep pools as slack, not as current.",
    openWaterBehavior:
      "Not a pelagic schooler and not a crappie basin fish.",
    spawningBehavior:
      "South Carolina DNR: males build and defend nests which are often in groups; females deposit 20,000–35,000 eggs. Illinois DNR: male fans a nest. Grouped nests are excluded from target guidance.",
    sources: [
      { label: "South Carolina DNR flier account", class: "agency" },
      { label: "Illinois Department of Natural Resources flier account", class: "agency" },
      { label: "Georgia DNR freshwater fish identification (sluggish lowland habitat)", class: "agency" },
    ],
    ...R,
    gaps: [PRESSURE_GAP, FRONT_GAP, LEVEL_GAP],
  },
];
