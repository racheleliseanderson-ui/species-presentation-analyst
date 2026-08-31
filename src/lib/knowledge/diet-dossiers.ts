import {
  DOSSIER_NEXT_REVIEW_AT,
  DOSSIER_REVIEWED_AT,
  type DietDossier,
} from "./dossier-types.ts";

const R = {
  reviewedAt: DOSSIER_REVIEWED_AT,
  nextReviewAt: DOSSIER_NEXT_REVIEW_AT,
} as const;

const OBSERVED =
  "Diet capacity is not proof that a hatch or prey event is occurring. Observed current forage still comes from a user observation or Hatch Match.";

const SEASONAL_GAP = "finer month-by-month diet inside a season, which is waterbody-specific";
const SUB_GAP = "complete regional forage-substitution table";

/**
 * AFP-DI-1.0 wave 01 — diet dossiers for the highest-confusion groups.
 *
 * Primary forage stays inside the reviewed catalog classes. Seasonal and
 * life-stage notes are included only where agency or peer-reviewed sources
 * support them. This layer never infers a current hatch.
 */
export const DIET_DOSSIERS: DietDossier[] = [
  {
    speciesId: "oncorhynchus_mykiss",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: [
      "aquatic_insects",
      "emerging_insects",
      "terrestrial_insects",
      "crustaceans",
      "small_forage_fish",
      "worms_annelids",
    ],
    primaryNote:
      "Inland rainbows intercept drift and emergences, take terrestrials, and will eat crustaceans and small fish as gape allows. Stream diets are often insect-weighted; lake fish add more fish and crustaceans.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Lower metabolic demand; nymphs, midges, and other slow-moving benthic prey dominate over surface events.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects and emergences increase in many streams as water warms. This is capacity, not a declared hatch.",
      },
      {
        season: "summer",
        emphasis: "Terrestrials and subsurface insects in streams; lake fish often use a mix of insects, crustaceans, and baitfish in the usable thermal band.",
      },
      {
        season: "fall",
        emphasis: "Opportunistic shift toward eggs, baitfish, or remaining insects depending on the system. Do not assume an egg event from this capacity.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Mostly aquatic invertebrates and zooplankton-scale prey.",
      juvenile: "Aquatic insects, emergences, and small crustaceans.",
      adult: "Insects remain important; larger fish add crustaceans and small forage fish.",
    },
    preySizeShifts: "Prey length generally tracks gape. Large lake and residualized fish can take baitfish that stream parr cannot.",
    ontogeneticShift: "Insectivory to a mixed insect–crustacean–fish diet as size increases, especially in lakes.",
    forageSubstitutions:
      "Stream fish substitute hatches and terrestrials; lake/reservoir fish substitute Mysis, scuds, or baitfish when those taxa dominate. Substitution is system-specific.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USFWS / state inland trout management summaries", class: "agency" },
      { label: "Raleigh et al. habitat suitability (rainbow trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "oncorhynchus_clarkii",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: [
      "aquatic_insects",
      "emerging_insects",
      "terrestrial_insects",
      "crustaceans",
      "small_forage_fish",
      "zooplankton",
    ],
    primaryNote:
      "Interior cutthroat are often more insect- and zooplankton-oriented than sympatric rainbows. Lake forms can still take fish. Do not treat that capacity as a current hatch.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Subsurface invertebrates in ice-influenced lakes and wintering stream habitat.",
      },
      {
        season: "spring",
        emphasis: "Insect drift and lake zooplankton as water warms. Tributary spawning is conservation context, not a diet event.",
      },
      {
        season: "summer",
        emphasis: "Terrestrials and aquatic insects in streams; zooplankton and baitfish possible in lakes.",
      },
      {
        season: "fall",
        emphasis: "Remaining insects and opportunistic fish or egg items where those foods exist. Not a prescribed forage event.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and tiny aquatic invertebrates.",
      juvenile: "Aquatic insects and crustaceans.",
      adult: "Insects remain central in many interior streams; lake adults may add fish.",
    },
    ontogeneticShift: "Weaker piscivory than many rainbow populations at the same size in interior streams; lake adults may still shift toward fish.",
    forageSubstitutions: "Alpine lakes may emphasize zooplankton; connected lakes can add forage fish. Stream diets stay insect-heavy unless sculpins or bait are abundant.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "State/tribal cutthroat status reviews", class: "agency" },
      { label: "Behnke Oncorhynchus clarkii systematics", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "strain-specific piscivory rates"],
  },
  {
    speciesId: "oncorhynchus_nerka_kokanee",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "pelagic",
    primaryForage: ["zooplankton", "emerging_insects", "aquatic_insects"],
    primaryNote:
      "Kokanee are landlocked sockeye that feed primarily on zooplankton, especially Daphnia, in open water. Insects are secondary. This is a plankton specialist, not a generalist trout diet.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Zooplankton remains the core diet; depth follows the usable cold-water food layer rather than shoreline insects.",
      },
      {
        season: "spring",
        emphasis: "Upper-column zooplankton as lakes mix and warm. Insect items remain secondary.",
      },
      {
        season: "summer",
        emphasis: "Follows Daphnia and other zooplankton in the cool, oxygenated layer, often near the thermocline.",
      },
      {
        season: "fall",
        emphasis: "Mature fish reduce feeding as they allocate to spawning. Spawning fish are not a forage-matching problem.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Smaller zooplankton such as copepods before shifting toward Daphnia as gape allows.",
      juvenile: "Daphnia and other large zooplankton.",
      adult: "Zooplankton specialist; insects are incidental. Anadromous sockeye ocean diets do not apply here.",
    },
    preySizeShifts: "Gape limits which zooplankton taxa are usable; this is not a shift into baitfish as a default inland diet.",
    ontogeneticShift: "Copepods and small zooplankton in fry; Daphnia-dominated in older fish where that taxon is available.",
    forageSubstitutions:
      "Some lakes substitute other zooplankton taxa when Daphnia is scarce. That does not convert kokanee into a baitfish predator like anadromous sockeye at sea.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Idaho Department of Fish and Game kokanee management (plankton diet)", class: "agency" },
      { label: "Washington Department of Fish and Wildlife kokanee profile", class: "agency" },
      { label: "Scott & Crossman freshwater fishes synthesis for kokanee/sockeye ecology", class: "synthesis" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "lake-specific Daphnia vs copepod dominance"],
  },
  {
    speciesId: "oncorhynchus_nerka_anadromous",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "pelagic",
    primaryForage: ["zooplankton", "aquatic_insects", "small_forage_fish"],
    primaryNote:
      "Ocean-phase sockeye feed on zooplankton, squid, and small fishes. Freshwater adults returning to spawn typically cease feeding. Juvenile lake residence is not an adult targeting proxy and is not a current-hatch claim.",
    seasonalDiet: [
      {
        season: "summer",
        emphasis: "Returning adults in freshwater are not treated as feeding trout. Ocean feeding is behind them.",
      },
      {
        season: "late_summer",
        emphasis: "Migration and ripening, not a forage-matching problem.",
      },
      {
        season: "fall",
        emphasis: "Spawning fish do not establish feeding lies. Diet guidance for freshwater adults stays conservation-first.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Lake-rearing juveniles feed on zooplankton and aquatic invertebrates.",
      juvenile: "Smolts leaving lakes still reflect a plankton-based freshwater diet before ocean entry.",
      adult: "Ocean diet is pelagic zooplankton, squid, and small fishes. Freshwater adults generally do not feed.",
    },
    ontogeneticShift: "Freshwater plankton feeding in juveniles; marine pelagic feeding in adults; feeding largely stops on the spawning migration.",
    forageSubstitutions: "Do not substitute inland kokanee Daphnia feeding for ocean-phase sockeye, or vice versa.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile", class: "agency" },
      { label: "NOAA Fisheries Sockeye Salmon protected-ESU profile", class: "agency" },
    ],
    ...R,
    gaps: ["ocean prey-taxa tables by stock", SEASONAL_GAP],
  },
  {
    speciesId: "micropterus_nigricans",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "crustaceans", "amphibians", "aquatic_insects", "larger_prey_fish"],
    primaryNote:
      "Adults feed largely on other fish and large invertebrates such as crayfish. Insects and amphibians matter more for smaller fish and in vegetated shallows. TPWD: adults feed almost exclusively on other fish and large invertebrates such as crayfish.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Fewer prey items; remaining crayfish and slower fish near cover rather than open-water bait chases.",
      },
      {
        season: "spring",
        emphasis: "Fish and crayfish as water warms. Nesting is conservation context, not a diet event.",
      },
      {
        season: "summer",
        emphasis: "Bluegill, shad, and other littoral fishes plus crayfish around vegetation and wood.",
      },
      {
        season: "fall",
        emphasis: "Baitfish become more important where shad or other schooling forage concentrate. Not a named-concentration claim.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton then aquatic insects and tiny fish.",
      juvenile: "Insects, crayfish, and small fish.",
      adult: "Mostly fish and crayfish; amphibians and large insects remain possible.",
    },
    preySizeShifts: "Adults take larger sunfish, shad, and crayfish as gape grows. Cannibalism of smaller bass is documented.",
    ontogeneticShift: "Insectivory in YOY to a fish–crayfish diet in adults.",
    forageSubstitutions:
      "Vegetated natural lakes emphasize sunfish, amphibians, and crayfish. Reservoirs with pelagic shad can shift adults toward open-water baitfish without abandoning cover-oriented feeding.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife largemouth bass species account (adult fish and crayfish diet)", class: "agency" },
      { label: "Heidinger largemouth life history", class: "peer_reviewed" },
      { label: "State black bass management plans", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "micropterus_dolomieu",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["crustaceans", "small_forage_fish", "aquatic_insects"],
    primaryNote:
      "Crayfish are often the energetic core on rock. Insects and small fish fill the rest. This is more benthic than largemouth in the same season.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Reduced feeding; remaining crayfish and sculpins or other benthic prey in deeper rock.",
      },
      {
        season: "spring",
        emphasis: "Insects and crayfish as water nears the 60°F spawning band. Nests on rock are conservation context.",
      },
      {
        season: "summer",
        emphasis: "Crayfish on rock plus small fish. River fish intercept current-delivered prey.",
      },
      {
        season: "fall",
        emphasis: "Fish can increase in the diet as crayfish activity drops and baitfish group. Not a prescribed chase.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Aquatic insects and tiny crustaceans.",
      juvenile: "Insects and small crayfish.",
      adult: "Crayfish-weighted, with small forage fish as a regular complement.",
    },
    ontogeneticShift: "Insect to crayfish/fish. Large river adults may take more fish than lake fish of the same length.",
    forageSubstitutions: "Rivers with sculpins or madtoms substitute those fishes. Lakes without crayfish shift toward fish and insects.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS / provincial smallmouth assessments", class: "agency" },
      { label: "Coble smallmouth biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "crayfish-percent tables by waterbody"],
  },
  {
    speciesId: "micropterus_punctulatus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "crustaceans", "aquatic_insects"],
    primaryNote:
      "More baitfish- and channel-oriented than largemouth in the same reservoir. Crayfish and insects remain in the diet, but spotted bass more often track pelagic forage along breaklines.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Deeper channel and bait-following rather than heavy vegetation.",
      },
      {
        season: "spring",
        emphasis: "Fish and crayfish. Spawning is often slightly deeper / more offshore than largemouth and is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Shad and other small fish along channel edges and offshore structure.",
      },
      {
        season: "fall",
        emphasis: "Schooling baitfish can dominate where present. Do not infer a current bait event from this capacity.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Insects and tiny fish.",
      juvenile: "Insects, crayfish, and small fish.",
      adult: "Small forage fish weighted, with crayfish still important on rock.",
    },
    ontogeneticShift: "Earlier shift toward pelagic baitfish than largemouth in many reservoirs.",
    forageSubstitutions: "Highland reservoirs with threadfin or gizzard shad emphasize fish. Creek systems with crayfish stay more benthic.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "State spotted bass notes (KY, TN, AL, OK)", class: "agency" },
      { label: "Baker & Ross spotted bass habitat", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "morone_saxatilis",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "larger_prey_fish"],
    primaryNote:
      "A pelagic piscivore. Adults track clupeids and other schooling fishes (menhaden, herring, shad, alewife depending on system). Insects are not a meaningful adult diet.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Forage-following in remaining usable thermal water; coastal and landlocked patterns differ by RPC profile, not by a generic table.",
      },
      {
        season: "spring",
        emphasis: "Anadromous fish are in spawning rivers; feeding is secondary to migration. Landlocked fish may still track shad. Spawning flow is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Follows bait in the column, often on or below the thermocline in reservoirs.",
      },
      {
        season: "fall",
        emphasis: "Baitfish concentrations can dominate diet where they exist. This is not a location map.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and small invertebrates, then larval/juvenile fish.",
      juvenile: "Small forage fish.",
      adult: "Schooling fishes; larger prey fish as size allows.",
    },
    preySizeShifts: "Adults take larger clupeids and other fishes as gape and energy demand grow.",
    ontogeneticShift: "Plankton and invertebrates in larvae to almost exclusive piscivory in adults.",
    forageSubstitutions:
      "Atlantic anadromous fish substitute menhaden/herring/anchovy. Landlocked reservoirs substitute gizzard or threadfin shad and alewife. RPC selects the population overlay; geography does not.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "ASMFC / state striped bass plans", class: "agency" },
      { label: "Setzler-Hamilton striped bass life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: ["stock-specific clupeid identity", SEASONAL_GAP],
  },
  {
    speciesId: "morone_chrysops",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "aquatic_insects"],
    primaryNote:
      "Schooling open-water predator of shad and other small fishes. Insects matter more for small fish and when bait is scarce. This is not white perch omnivory and not striped-bass-scale prey.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Remaining shad or other small fish in deeper open water.",
      },
      {
        season: "spring",
        emphasis: "Upriver or windblown-shore spawning is conservation context. Diet remains small fish and insects, not a targeting cue.",
      },
      {
        season: "summer",
        emphasis: "Threadfin or gizzard shad in the column when those taxa are present.",
      },
      {
        season: "fall",
        emphasis: "Schooling baitfish where they concentrate. Capacity is not a current event.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and aquatic insects.",
      juvenile: "Insects and tiny fish.",
      adult: "Small forage fish, especially shad.",
    },
    ontogeneticShift: "Insect/plankton to shad-weighted piscivory.",
    forageSubstitutions: "Reservoirs with threadfin shad differ from river systems with emerald shiners or other small cyprinids. White perch egg-eating is not a white-bass default.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "State white bass notes (TX, OK, KS, TN)", class: "agency" },
      { label: "USFWS / Riggs white bass life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "morone_americana",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "crustaceans", "aquatic_insects", "zooplankton", "eggs"],
    primaryNote:
      "More omnivorous than white bass or striped bass. Zooplankton, insects, crustaceans, small fish, and fish eggs all appear in reviewed diets. Egg predation is an ecological concern in some introduced waters, not a recommended forage event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Benthic invertebrates and remaining small fish in deeper basins.",
      },
      {
        season: "spring",
        emphasis: "Insects, zooplankton, and eggs where spawning of other fishes overlaps. Egg items are an ecological note, not targeting guidance.",
      },
      {
        season: "summer",
        emphasis: "Mixed zooplankton, insects, crustaceans, and small fish.",
      },
      {
        season: "fall",
        emphasis: "Small fish can increase where bait is available.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton.",
      juvenile: "Insects, crustaceans, and zooplankton.",
      adult: "Mixed; small fish and eggs can become important in introduced Great Lakes and reservoir populations.",
    },
    ontogeneticShift: "Plankton to a broad omnivorous diet. This is the ecological distinction from white bass.",
    forageSubstitutions: "Native Atlantic slope diets are more estuarine-invertebrate. Introduced inland populations add more fish eggs and inland zooplankton.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS Nonindigenous Aquatic Species white perch profile", class: "agency" },
      { label: "Great Lakes white perch diet and ecology literature", class: "peer_reviewed" },
    ],
    ...R,
    gaps: ["native vs introduced diet contrast by watershed", SEASONAL_GAP],
  },
  {
    speciesId: "morone_hybrid_wiper",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "crustaceans", "aquatic_insects"],
    primaryNote:
      "Stocked Morone hybrid. Adult diet is shad- and baitfish-weighted like striped bass, with more insect and crustacean use than a large striper. Hybrids do not establish a normal reproductive run, so spring tributary movement is not a spawning-diet event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Bait-following in remaining open water.",
      },
      {
        season: "spring",
        emphasis: "May travel with white bass; feeding still tracks small fish. Not a reproductive diet shift.",
      },
      {
        season: "summer",
        emphasis: "Pelagic shad in the combined temperature–oxygen band.",
      },
      {
        season: "fall",
        emphasis: "Schooling baitfish where present.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and insects in hatchery-to-wild transition.",
      juvenile: "Insects, crustaceans, and tiny fish.",
      adult: "Small forage fish, especially shad.",
    },
    ontogeneticShift: "Rapid shift toward piscivory relative to white bass of the same age in many stocking programs.",
    forageSubstitutions: "Gizzard vs threadfin shad substitutions follow the stocked water, not a statewide default.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Missouri Department of Conservation hybrid striped bass field guide", class: "agency" },
      { label: "Kansas Department of Wildlife & Parks striped bass hybrid management plan", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "morone_mississippiensis",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "aquatic_insects", "crustaceans", "zooplankton"],
    primaryNote:
      "Smaller temperate bass. Insects, zooplankton, and small fish all matter. Do not copy white-bass shad specialization or striped-bass prey size onto this record.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Deeper pools and remaining small prey.",
      },
      {
        season: "spring",
        emphasis: "Insects and small fish. Spawning movement is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Small forage fish plus insects in quieter pools or open-water schools.",
      },
      {
        season: "fall",
        emphasis: "Small fish where bait is available.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and tiny insects.",
      juvenile: "Insects, crustaceans, and tiny fish.",
      adult: "Small forage fish with a larger invertebrate fraction than white bass.",
    },
    ontogeneticShift: "Plankton/insects to a mixed small-fish diet. Prey remains smaller than striped bass.",
    forageSubstitutions: "Backwater insect diets vs reservoir small-fish diets. Not interchangeable with white perch egg predation.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Missouri Department of Conservation yellow bass field guide", class: "agency" },
      { label: "State temperate-bass management literature", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "coregonus_artedi",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "pelagic",
    primaryForage: ["zooplankton", "crustaceans", "small_forage_fish", "aquatic_insects"],
    primaryNote:
      "Cisco primarily feed on microscopic zooplankton. Aquatic insect larvae, adult mayflies and stoneflies, and other invertebrates are also eaten by adults. Michigan Sea Grant: cisco feeds heavily under ice. This is not lake-whitefish benthic mollusk feeding.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Zooplankton and under-ice feeding in coldwater lakes. This is a feeding-window description, not a catch claim.",
      },
      {
        season: "spring",
        emphasis: "Zooplankton in mixing water; insects possible during emergences.",
      },
      {
        season: "summer",
        emphasis: "Pelagic zooplankton in the cold, oxygenated layer. Oxythermal squeeze can separate cisco from warmer forage fish.",
      },
      {
        season: "late_fall",
        emphasis: "Spawning is conservation context. Diet remains zooplankton/invertebrates, not a shallow-water bait event.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small zooplankton.",
      juvenile: "Zooplankton and small invertebrates.",
      adult: "Zooplankton core; insects and occasional small fish in some stocks.",
    },
    ontogeneticShift: "Remains largely planktivorous. Occasional fish in large adults does not convert cisco into a whitefish or trout diet.",
    forageSubstitutions: "Great Lakes stocks may include more Mysis or other crustaceans. Inland tullibee lakes stay Daphnia/copepod weighted.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "U.S. Fish and Wildlife Service cisco species account", class: "agency" },
      { label: "Michigan Sea Grant cisco (lake herring) diet notes", class: "agency" },
      { label: "USGS cisco and bloater culture / ecology manual", class: "agency" },
    ],
    ...R,
    gaps: ["Great Lakes vs inland prey-taxa table", SEASONAL_GAP],
  },
  {
    speciesId: "coregonus_clupeaformis",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["crustaceans", "mollusks", "aquatic_insects", "small_forage_fish", "eggs"],
    primaryNote:
      "Bottom-associated invertivore. Diporeia, other amphipods, mollusks, and aquatic insects are the historical core. Fish eggs and small fish appear seasonally. This is not cisco planktivory.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Benthic invertebrates on the lake bed.",
      },
      {
        season: "spring",
        emphasis: "Benthic crustaceans and mollusks; eggs of other fishes where those events occur. Egg items are not a targeting cue.",
      },
      {
        season: "summer",
        emphasis: "Deeper benthic invertebrates; some suspension when prey distributions warrant it.",
      },
      {
        season: "late_fall",
        emphasis: "Spawning over clean rock/gravel is conservation context, not a diet map.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small benthic invertebrates and zooplankton.",
      juvenile: "Amphipods, insects, and small mollusks.",
      adult: "Benthic crustaceans and mollusks; fish and eggs as supplements.",
    },
    ontogeneticShift: "Zooplankton/tiny benthos in YOY to a mollusk- and amphipod-weighted adult diet.",
    forageSubstitutions:
      "Great Lakes diets shifted after Diporeia declines, with more mollusks or alternative benthos. Inland lakes substitute available amphipods and insects. Do not freeze a historical Diporeia diet as current fact for every water.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS lake whitefish thermal ecology research", class: "agency" },
      { label: "Michigan Department of Natural Resources lake whitefish biology", class: "agency" },
      { label: "Minnesota Department of Natural Resources lake whitefish profile", class: "agency" },
    ],
    ...R,
    gaps: ["post-Diporeia diet by lake", SEASONAL_GAP],
  },
  {
    speciesId: "hiodon_alosoides",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "surface",
    primaryForage: ["aquatic_insects", "emerging_insects", "terrestrial_insects", "small_forage_fish", "crustaceans"],
    primaryNote:
      "Large-eyed, often surface-oriented river predator of drifting and flying insects, with small fish and crustaceans as complements. More turbidity-tolerant and more surface-fish oriented than mooneye.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Reduced surface feeding; remaining invertebrates and small fish in deeper holds.",
      },
      {
        season: "spring",
        emphasis: "Insects as water warms. Spawning in large-river systems is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Emerging and terrestrial insects plus small fish in the upper column.",
      },
      {
        season: "fall",
        emphasis: "Remaining insects and small fish.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and tiny insects.",
      juvenile: "Aquatic and emerging insects.",
      adult: "Insects with regular small-fish complements.",
    },
    ontogeneticShift: "Plankton/insects to a mixed insect–fish surface diet.",
    forageSubstitutions: "Prairie rivers with high terrestrial input vs clearer systems with more aquatic emergences. Not interchangeable with mooneye’s clearer-water insect diet.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Government of Alberta goldeye species profile", class: "agency" },
      { label: "Canadian and U.S. hiodontid life-history literature", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "hiodon_tergisus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "surface",
    primaryForage: ["aquatic_insects", "emerging_insects", "terrestrial_insects", "small_forage_fish", "crustaceans"],
    primaryNote:
      "More insectivorous and more associated with clearer water than goldeye. Small fish remain possible but are not the default adult identity.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Subsurface invertebrates in pools.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects as water warms. Spawning is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Drift, emergences, and terrestrials in runs and pool tails.",
      },
      {
        season: "fall",
        emphasis: "Remaining insects.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and tiny insects.",
      juvenile: "Aquatic insects.",
      adult: "Aquatic, emerging, and terrestrial insects; small fish less central than in goldeye.",
    },
    ontogeneticShift: "Remains insect-weighted more than goldeye at comparable size.",
    forageSubstitutions: "Clearer rivers keep insect identity. Do not copy goldeye’s stronger fish fraction onto this record.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Ontario mooneye species profile", class: "agency" },
      { label: "Hiodontidae life-history synthesis", class: "synthesis" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "quantified goldeye vs mooneye fish-fraction comparison"],
  },
  {
    speciesId: "cyprinus_carpio",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["worms_annelids", "mollusks", "crustaceans", "aquatic_insects", "zooplankton"],
    primaryNote:
      "Benthic omnivore. Feeds by rooting in sediment for annelids, mollusks, crustaceans, insect larvae, plant material, and detritus. This is not buffalo filter-feeding.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Reduced feeding in deeper basins; remaining benthic items.",
      },
      {
        season: "spring",
        emphasis: "Shallow-flat benthos as water warms. Vegetation spawning is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Active benthic omnivory on flats, weed edges, and inlets.",
      },
      {
        season: "fall",
        emphasis: "Continued benthic feeding before wintering deeper in some systems.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and tiny benthos.",
      juvenile: "Insect larvae, worms, and small mollusks.",
      adult: "Broad benthic omnivory including mollusks, annelids, crustaceans, and plant material.",
    },
    ontogeneticShift: "Plankton in larvae to sediment-rooting omnivory in adults.",
    forageSubstitutions: "Agricultural drains emphasize detritus and oligochaetes. Clearer lakes may show more mollusks and insects. Plant material is used but is not a catalog forage class.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS NAS carp fact sheet", class: "agency" },
      { label: "Balon carp domestication / biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: ["plant/detritus fraction (no catalog forage class)", SEASONAL_GAP],
  },
  {
    speciesId: "ictiobus_cyprinellus",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "pelagic",
    primaryForage: ["zooplankton", "aquatic_insects", "crustaceans", "worms_annelids"],
    primaryNote:
      "Bigmouth buffalo is a filter feeder. The large terminal mouth is used to strain zooplankton; benthic invertebrates are secondary. This is the ecological opposite of carp rooting and of smallmouth buffalo’s bottom feeding.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Reduced filtering in deeper slow water.",
      },
      {
        season: "spring",
        emphasis: "Zooplankton as water warms. Flooded-margin spawning is conservation context, not a feeding map.",
      },
      {
        season: "summer",
        emphasis: "Pelagic and mid-depth zooplankton filtering in slow channels, backwaters, and reservoirs.",
      },
      {
        season: "fall",
        emphasis: "Continued zooplankton with some benthos.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small zooplankton.",
      juvenile: "Zooplankton and tiny invertebrates.",
      adult: "Zooplankton specialist with incidental benthos.",
    },
    ontogeneticShift: "Remains a filter feeder. Longevity (Lackmann) means adults can persist on plankton for decades.",
    forageSubstitutions: "Turbid, productive systems emphasize zooplankton. Clearer water may increase benthic complements without converting the species into a carp.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS Bigmouth Buffalo species profile", class: "agency" },
      { label: "USGS/FWS Bigmouth Buffalo habitat suitability literature", class: "agency" },
      { label: "Lackmann et al. validated centenarian longevity research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "ictiobus_bubalus",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "benthic",
    primaryForage: ["aquatic_insects", "crustaceans", "worms_annelids", "mollusks"],
    primaryNote:
      "Smallmouth buffalo is a benthic invertivore. The subterminal mouth works the bottom for insect larvae, crustaceans, annelids, and mollusks. It is not a carp and not a plankton-filtering bigmouth buffalo.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Benthic feeding in deeper pools and channel edges.",
      },
      {
        season: "spring",
        emphasis: "Benthos as water warms. Broadcast spawning over vegetation/mud is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Channel-bottom invertebrates and mollusks.",
      },
      {
        season: "fall",
        emphasis: "Continued benthic feeding.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small benthic invertebrates.",
      juvenile: "Insect larvae and crustaceans.",
      adult: "Benthic invertebrates and mollusks.",
    },
    ontogeneticShift: "Remains benthic. Mollusk fraction can increase with size.",
    forageSubstitutions: "Large-river mollusk beds vs reservoir soft-bottom insect larvae. Do not substitute carp plant-rooting or bigmouth buffalo plankton feeding.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife smallmouth buffalo species account", class: "agency" },
      { label: "USGS smallmouth buffalo population-demographic research", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepisosteus_osseus",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "crustaceans"],
    primaryNote:
      "Piscivorous ambush/patrol predator. Fish dominate the adult diet; crustaceans are secondary. Gar eggs are toxic and must never be treated as forage or food.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Deeper holding; reduced feeding.",
      },
      {
        season: "spring",
        emphasis: "Fish along warming margins. Shallow vegetated spawning is conservation context; eggs are toxic.",
      },
      {
        season: "summer",
        emphasis: "Fish in open or slow water; near-surface cruising can be respiratory, not feeding.",
      },
      {
        season: "fall",
        emphasis: "Remaining fish prey as water cools.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Invertebrates then tiny fish. Juveniles more vegetation-associated.",
      juvenile: "Small fish and crustaceans.",
      adult: "Fish, including larger prey fish as size allows.",
    },
    ontogeneticShift: "Invertebrates in YOY to piscivory in adults.",
    forageSubstitutions: "Large-river fish assemblages vs lake/backwater fishes. Do not treat air-gulping as a surface-forage event.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "NOAA Mississippi River longnose gar life-history synthesis", class: "agency" },
      { label: "State warmwater fish temperature syntheses for longnose gar", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepisosteus_oculatus",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "crustaceans", "aquatic_insects"],
    primaryNote:
      "Vegetation-associated piscivore. Smaller prey and more invertebrate complements than alligator gar. Eggs are toxic.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Deeper or tighter to vegetated cover.",
      },
      {
        season: "spring",
        emphasis: "Fish in vegetated margins. Spawning in flooded timber/backwaters is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Ambush feeding on small fish around weeds and wood.",
      },
      {
        season: "fall",
        emphasis: "Remaining small fish as vegetation thins.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Insects and tiny fish in vegetation.",
      juvenile: "Small fish and crustaceans.",
      adult: "Small forage fish with crustacean and insect complements.",
    },
    ontogeneticShift: "Invertebrates to small-fish piscivory, remaining more littoral than longnose gar.",
    forageSubstitutions: "Swamp and backwater fishes vs open-lake littoral fishes. Less current-oriented than longnose gar.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife Department spotted gar account", class: "agency" },
      { label: "Illinois Department of Natural Resources spotted gar account", class: "agency" },
      { label: "Missouri Department of Conservation spotted gar account", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepisosteus_platostomus",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "aquatic_insects", "crustaceans"],
    primaryNote:
      "Piscivore of large-river backwaters. Turbidity is less limiting than for longnose gar. Eggs are toxic.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Deeper pools.",
      },
      {
        season: "early_summer",
        emphasis: "Fish in quiet shallow water. Spawning over vegetation is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Fish along backwater and side-channel margins.",
      },
      {
        season: "fall",
        emphasis: "Remaining fish prey.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Insects and tiny fish.",
      juvenile: "Small fish and invertebrates.",
      adult: "Fish, including larger prey as size allows.",
    },
    ontogeneticShift: "Invertebrates to piscivory.",
    forageSubstitutions: "Backwater fish assemblages vs main-channel margins. More turbidity-tolerant than longnose gar.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife shortnose gar species account", class: "agency" },
      { label: "Missouri Department of Conservation shortnose gar field guide", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "atractosteus_spatula",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "mixed",
    primaryForage: ["larger_prey_fish", "small_forage_fish", "crustaceans", "amphibians"],
    primaryNote:
      "Apex freshwater piscivore. Adults take large fish; crustaceans and amphibians are secondary. Surface air-gulping is respiratory. Eggs and flooded spawning habitat are invalidators, not forage or target layers.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Deep main-channel pools; reduced feeding.",
      },
      {
        season: "spring",
        emphasis: "Fish in connected habitat as water warms. Flooded vegetated spawning is an invalidator.",
      },
      {
        season: "summer",
        emphasis: "Large fish in pools, backwaters, and open water.",
      },
      {
        season: "fall",
        emphasis: "Remaining large-fish prey as water cools.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Invertebrates and tiny fish in vegetated inundated habitat.",
      juvenile: "Small fish, crustaceans, and amphibians.",
      adult: "Larger prey fish as the energetic core.",
    },
    preySizeShifts: "Adults regularly take fish far larger than other gar diets. This is size ecology, not a sport rating.",
    ontogeneticShift: "Invertebrates in YOY to large-fish piscivory in adults.",
    forageSubstitutions: "River fish assemblages vs reservoir forage. Do not invent a lure-family diet from this prey list.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "U.S. Fish and Wildlife Service Alligator Gar species profile", class: "agency" },
      { label: "State and USFWS alligator gar life-history and floodplain recruitment literature", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "ameiurus_nebulosus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["worms_annelids", "aquatic_insects", "crustaceans", "mollusks", "small_forage_fish"],
    primaryNote:
      "Nocturnal benthic omnivore. Scent and barbels matter more than vision. Diet is worms, insect larvae, crustaceans, mollusks, and small fish — not a pelagic baitfish specialist.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Reduced feeding in deeper basins or cover.",
      },
      {
        season: "spring",
        emphasis: "Benthos as water warms. Cavity nesting and parental guarding are conservation context.",
      },
      {
        season: "summer",
        emphasis: "Night and low-light benthic feeding on insects, worms, crustaceans, and small fish.",
      },
      {
        season: "fall",
        emphasis: "Continued benthic omnivory before wintering.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Tiny invertebrates; family groups are not target aggregations.",
      juvenile: "Insects, worms, and crustaceans.",
      adult: "Broad benthic omnivory including mollusks and small fish.",
    },
    ontogeneticShift: "Invertebrates to a mixed benthic diet with more fish in large adults.",
    forageSubstitutions: "Weedy lakes emphasize insects and crustaceans. Soft-bottom ponds add oligochaetes. Small fish increase where they are available at night.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS Nonindigenous Aquatic Species brown bullhead profile", class: "agency" },
      { label: "EPA freshwater fish temperature criteria synthesis for brown bullhead", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "ameiurus_melas",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["worms_annelids", "aquatic_insects", "crustaceans", "mollusks", "small_forage_fish"],
    primaryNote:
      "Highly tolerant benthic omnivore of turbid, soft-bottomed water. Diet overlaps brown bullhead; habitat tolerance is the distinction, not a unique prey list.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Deeper or tighter to cover; reduced feeding.",
      },
      {
        season: "spring",
        emphasis: "Benthos as water warms. Cavity/depression spawning is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Night feeding on worms, insects, crustaceans, mollusks, and small fish.",
      },
      {
        season: "fall",
        emphasis: "Continued benthic omnivory.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Tiny invertebrates. Family groups are not target aggregations.",
      juvenile: "Insects and worms.",
      adult: "Broad benthic omnivory.",
    },
    ontogeneticShift: "Invertebrates to mixed benthic omnivory.",
    forageSubstitutions: "Turbid ponds and sloughs emphasize detritus-associated invertebrates. Clearer lakes overlap brown bullhead diets.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Washington Department of Fish and Wildlife black bullhead sportfish account", class: "agency" },
      { label: "North American bullhead life-history syntheses", class: "synthesis" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "quantified diet overlap with brown bullhead"],
  },
  {
    speciesId: "ameiurus_natalis",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["aquatic_insects", "crustaceans", "worms_annelids", "mollusks", "small_forage_fish"],
    primaryNote:
      "Benthic omnivore of slower, often clearer or more vegetated water than black bullhead. Insects and crustaceans are prominent. Both parents guard eggs and fry — conservation context, not a forage event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Reduced benthic feeding.",
      },
      {
        season: "spring",
        emphasis: "Insects and crustaceans as water warms. Canonical spawning seasons are spring and early_summer.",
      },
      {
        season: "early_summer",
        emphasis: "Parental guarding overlaps continued benthic feeding nearby, not a targeting cue.",
      },
      {
        season: "summer",
        emphasis: "Night and low-light benthic omnivory.",
      },
      {
        season: "fall",
        emphasis: "Continued benthic feeding.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Guarded fry feeding on tiny invertebrates.",
      juvenile: "Insects, crustaceans, and worms.",
      adult: "Benthic omnivory including mollusks and small fish.",
    },
    ontogeneticShift: "Invertebrates to mixed benthic omnivory.",
    forageSubstitutions: "Vegetated clear-water margins emphasize insects and crayfish-scale crustaceans relative to black bullhead in turbid mud.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife yellow bullhead species account", class: "agency" },
      { label: "State bullhead management and identification literature", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "salmo_trutta",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: [
      "aquatic_insects",
      "emerging_insects",
      "terrestrial_insects",
      "crustaceans",
      "small_forage_fish",
      "larger_prey_fish",
      "worms_annelids",
    ],
    primaryNote:
      "Browns take drift, emergences, terrestrials, crayfish-scale crustaceans, and fish. Catalog exception: large piscivorous adults may ignore insect-scale foods even when smaller trout are on them. Capacity is not a current hatch.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Lower metabolic demand; nymphs, midges, and other slow subsurface prey. Night and cover feeding remain plausible in clear water.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects and emergences as water warms. This is capacity, not a declared hatch.",
      },
      {
        season: "summer",
        emphasis: "Terrestrials, crayfish, and subsurface insects in the usable thermal band. Large fish add baitfish.",
      },
      {
        season: "fall",
        emphasis: "Opportunistic insects, crayfish, and fish. Fall spawning is conservation context, not an egg-forage prescription. Do not assume an egg event.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Aquatic invertebrates and drift-scale prey.",
      juvenile: "Aquatic insects, emergences, and small crustaceans.",
      adult: "Insects remain important; larger fish add crayfish and forage fish, then larger prey fish.",
    },
    preySizeShifts: "Prey length tracks gape. The catalog larger_prey_fish class belongs to large adults, not to parr.",
    ontogeneticShift: "Insectivory to mixed insect–crustacean–fish, with some adults becoming primarily piscivorous.",
    forageSubstitutions:
      "Streams substitute hatches and terrestrials. Fertile rivers and lakes substitute crayfish and baitfish. Substitution is system-specific.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS / state brown trout habitat notes", class: "agency" },
      { label: "Elliott thermal biology of brown trout", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "salvelinus_fontinalis",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "terrestrial_insects", "crustaceans", "small_forage_fish"],
    primaryNote:
      "Small-water char diet: aquatic insects, terrestrials, crustaceans, and some small fish. Less piscivorous at typical angling size than brown trout or lake trout.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Slow subsurface invertebrates in remaining cold water.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects as water warms. Capacity, not a hatch declaration.",
      },
      {
        season: "summer",
        emphasis: "Terrestrials and aquatic insects in shaded or high-elevation water. Warm lowland water can be lethal regardless of forage.",
      },
      {
        season: "fall",
        emphasis: "Remaining insects and opportunistic small fish. Fall spawning is conservation context, not a forage event.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Tiny aquatic invertebrates.",
      juvenile: "Aquatic insects and small crustaceans.",
      adult: "Insects and terrestrials remain central; small fish where gape allows.",
    },
    ontogeneticShift: "Weaker shift to piscivory than brown trout at the same length in most streams.",
    forageSubstitutions: "High lakes may add crustaceans; tiny streams stay insect-heavy. Brown trout competition can change who occupies a food-rich lie, not the brook diet list.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "U.S. Fish and Wildlife Service brook trout species profile", class: "agency" },
      { label: "Raleigh habitat suitability (brook trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "salvelinus_namaycush",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "crustaceans", "aquatic_insects"],
    primaryNote:
      "Michigan DNR: adults feed primarily on other fish — native ciscoes and sculpin, and where available alewives, smelt, gobies — and will also take crustaceans, terrestrial insects, and plankton. That is adult capacity. Observed forage still has to be declared.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Fish and remaining invertebrates in the cold column. Shallower relative to summer without becoming a stream-trout diet.",
      },
      {
        season: "spring",
        emphasis: "Forage fish as lakes warm and before summer stratification pins the usable layer.",
      },
      {
        season: "summer",
        emphasis: "Piscivory on the usable oxythermal layer. Crustaceans (including Mysis where present) can matter in the same band.",
      },
      {
        season: "fall",
        emphasis: "Forage fish continue. Fall spawning is conservation context, not a forage map.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton-scale prey and small invertebrates.",
      juvenile: "Aquatic insects, crustaceans, and small fish.",
      adult: "Primarily fish; crustaceans and insects remain possible.",
    },
    preySizeShifts: "Adult gape supports larger prey fish. Juvenile diets are not a proxy for adult trolling forage.",
    ontogeneticShift: "Invertebrates and small fish to primarily piscivory.",
    forageSubstitutions:
      "Great Lakes substitutions (alewife, smelt, goby) differ from inland cisco/sculpin lakes. RPC overlays that split; this species diet does not auto-select them.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Michigan DNR lake trout species account (adult piscivory: cisco, sculpin, alewife, smelt, goby)", class: "agency" },
      { label: "Martin & Olver lake trout biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "waterbody-specific prey-size table for Great Lakes vs inland"],
  },
  {
    speciesId: "oncorhynchus_mykiss_steelhead",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "eggs", "small_forage_fish"],
    primaryNote:
      "USFWS: steelhead feed on aquatic and terrestrial invertebrates and small fish. Catalog exception: many winter fish are not feeding in the trout sense. Eggs are a reviewed forage class here, not proof that an egg event is occurring.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Returning winter-run fish may take little. Do not convert presence into a nymph or egg hatch.",
      },
      {
        season: "early_spring",
        emphasis: "Insects and eggs remain capacity only. Spawning overlap is conservation context.",
      },
      {
        season: "spring",
        emphasis: "Same rule: forage classes exist; a hatch is not inferred. Summer-run stocks are not on this spring feeding story.",
      },
      {
        season: "summer",
        emphasis: "Summer-run adults may be in river systems. Heat and low flow are constraints. Still not an inland-rainbow hatch match.",
      },
      {
        season: "fall",
        emphasis: "Eggs and insects remain possible foods in some systems. Do not assume an egg event from the calendar.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "USFWS notes zooplankton-scale feeding when young; natal-stream parr then take aquatic invertebrates.",
      juvenile: "Aquatic insects and crustaceans in freshwater rearing, then ocean prey after emigration — ocean diet is not this freshwater record's job.",
      adult: "Returning adults may take insects, eggs, and small fish, or may not be feeding in the trout sense.",
    },
    ontogeneticShift:
      "Freshwater insectivory to marine fish/invertebrate growth, then a freshwater return that is often not a feeding problem in the inland-rainbow sense.",
    forageSubstitutions: "Great Lakes vs Pacific prey fields differ. This species overlay does not auto-select them.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "NOAA Fisheries steelhead species profile", class: "agency" },
      { label: "U.S. Fish and Wildlife Service rainbow / steelhead species profile (invertebrates and small fish)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "ocean vs freshwater adult diet as a structured split beyond the catalog exception"],
  },
  {
    speciesId: "sander_vitreus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "aquatic_insects", "crustaceans"],
    primaryNote:
      "Minnesota DNR: walleye are fish-eaters, preying heavily on yellow perch. Insects and crustaceans remain capacity, especially before the shift to fish. Observed forage still has to be declared.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Forage fish in the remaining active band. Shallower relative to bright summer without becoming a perch-school diet.",
      },
      {
        season: "spring",
        emphasis: "Fish remain primary. Insects and crustaceans are capacity for smaller fish. Spawning overlap is conservation context, not a forage map.",
      },
      {
        season: "summer",
        emphasis: "Piscivory on the usable light and thermal layer. Perch and other forage fish where they occur. Do not infer a current bait event.",
      },
      {
        season: "fall",
        emphasis: "Forage fish continue as water cools. Fall is not an egg-forage prescription.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton-scale and insect prey before the fish shift. Zooplankton is not a catalog forage class on this record.",
      juvenile: "Aquatic insects, crustaceans, and small forage fish.",
      adult: "Primarily fish, including yellow perch where they occur; larger prey fish as gape allows.",
    },
    preySizeShifts: "Prey length tracks gape. The larger_prey_fish class belongs to adults, not to young-of-year.",
    ontogeneticShift: "Invertebrates and small fish to primarily piscivory.",
    forageSubstitutions:
      "Lake forage (perch, cisco-scale pelagic fish) differs from large-river forage. RPC lake vs river overlays that split; this species diet does not auto-select them.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Minnesota DNR walleye biology (piscivory, yellow perch as primary prey)", class: "agency" },
      { label: "Colby et al. walleye biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "sander_canadensis",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["small_forage_fish", "aquatic_insects", "crustaceans"],
    primaryNote:
      "Missouri DNR: a variety of fish, crustaceans, and insects. More lower-column than walleye. Larger prey fish are not a catalog forage class on this record — do not import adult-walleye piscivory wholesale.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Small forage fish and remaining benthic invertebrates in deep runs and pools.",
      },
      {
        season: "spring",
        emphasis: "Fish, insects, and crustaceans as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Small forage fish along the bottom of current. Not a weed-edge pike diet.",
      },
      {
        season: "fall",
        emphasis: "Small forage fish continue in current and on the bottom.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Insects and small crustaceans.",
      juvenile: "Aquatic insects, crustaceans, and small fish.",
      adult: "Small forage fish with insects and crustaceans still in the mix.",
    },
    ontogeneticShift: "Invertebrates to small fish. Weaker shift to large piscivory than walleye because that class is not on this record.",
    forageSubstitutions: "Large-river forage fields differ from reservoir sauger. This overlay does not auto-select them.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Missouri Department of Conservation sauger field guide (fish, crustaceans, insects)", class: "agency" },
      { label: "USGS sauger habitat and movement research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "esox_lucius",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "amphibians"],
    primaryNote:
      "Michigan DNR: about 90 percent smaller fish — yellow perch, sunfishes, minnows, and suckers — plus frogs and other living prey the jaws can surround. Crayfish, waterfowl, and small mammals appear in that agency note but are not catalog forage classes here.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Fish in remaining cold, weedy, or wooded water. Activity compresses near the cold edge.",
      },
      {
        season: "early_spring",
        emphasis: "Fish and amphibians as ice leaves. Spawning overlap is conservation context, not a frog-hatch declaration.",
      },
      {
        season: "summer",
        emphasis: "Fish along deeper weed edges. Warm weedy water can be a thermal stressor, not a feeding cue.",
      },
      {
        season: "fall",
        emphasis: "Forage fish as water cools back into the preferred band.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Michigan DNR: young pike grow rapidly. Invertebrates and tiny fish; invertebrates are not a catalog class here beyond later amphibians and fish.",
      juvenile: "Small forage fish.",
      adult: "Fish, including larger prey fish, plus amphibians.",
    },
    preySizeShifts: "Gape supports large prey. Juvenile diets are not a proxy for adult ambush forage.",
    ontogeneticShift: "Small fish to larger piscivory, with amphibians as a reviewed supplement.",
    forageSubstitutions: "Perch, sunfish, minnow, and sucker substitutions are waterbody-specific. Do not invent a current bait from this list.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Michigan DNR northern pike species account (90 percent fish; perch, sunfish, minnow, sucker, frogs)", class: "agency" },
      { label: "Casselman pike thermal ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "esox_masquinongy",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["larger_prey_fish", "small_forage_fish", "amphibians"],
    primaryNote:
      "Michigan DNR: predominantly a fish-eating fish — suckers, minnows, perch, sunfishes, and other available fish. Larger prey fish are the adult center of gravity. Amphibians remain capacity. Not a declared forage event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Forage fish in remaining cold structure. Activity compresses.",
      },
      {
        season: "spring",
        emphasis: "Fish as water leaves ice-out. Spawning overlap after pike is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Larger prey fish along weed edges, points, and drop-offs.",
      },
      {
        season: "fall",
        emphasis: "Forage fish as water cools. Fall is not a spawn-forage map.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small fish and invertebrates; invertebrates are not a catalog class on this record.",
      juvenile: "Small forage fish.",
      adult: "Primarily larger prey fish; small forage fish and amphibians remain possible.",
    },
    preySizeShifts: "Adult gape supports large prey. Do not treat a perch-school diet as the muskellunge problem.",
    ontogeneticShift: "Small fish to primarily large piscivory.",
    forageSubstitutions: "Sucker, perch, and sunfish substitutions are waterbody-specific. This overlay does not auto-select them.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Michigan DNR muskellunge species account (suckers, minnows, perch, sunfishes)", class: "agency" },
      { label: "Crossman muskellunge biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "esox_niger",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "amphibians", "crustaceans"],
    primaryNote:
      "North Carolina Wildlife: young feed mainly on aquatic insects and crustaceans until about 4 in, then primarily fish, and will eat other small prey. Insects are an agency juvenile note; they are not a catalog forage class on this record. Adult center of gravity is small forage fish in vegetation.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Small forage fish along remaining weed and wood edges in ice-free eastern water.",
      },
      {
        season: "spring",
        emphasis: "Fish, crustaceans, and amphibians as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Small forage fish inside and along weed edges. Not an open-pelagic pike diet.",
      },
      {
        season: "fall",
        emphasis: "Small forage fish continue around vegetation.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "North Carolina Wildlife: aquatic insects and crustaceans until about 4 in. Insects stay an agency note, not a catalog class here.",
      juvenile: "Crustaceans and small forage fish.",
      adult: "Primarily small forage fish; larger prey fish and amphibians where gape allows.",
    },
    ontogeneticShift: "Invertebrates and crustaceans to fish around 4 in (North Carolina Wildlife).",
    forageSubstitutions: "Vegetated eastern waters substitute different small fish than northern pike lakes. Do not import a Great Lakes perch story wholesale.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "North Carolina Wildlife chain pickerel species account (insects and crustaceans to fish near 4 in)", class: "agency" },
      { label: "South Carolina DNR chain pickerel account", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "perca_flavescens",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["zooplankton", "aquatic_insects", "small_forage_fish", "crustaceans"],
    primaryNote:
      "Michigan DNR: adults dine primarily on immature insects, larger invertebrates (crayfish), and the eggs and young of other fish, taken from open water and from the bottom. Eggs are an agency note, not a catalog forage class here. Young-of-year add zooplankton. Capacity is not a current hatch.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Insects, crustaceans, and small fish in the cold column. Michigan DNR: remain active under ice — that is winter capacity, not a bite claim.",
      },
      {
        season: "spring",
        emphasis: "Insects, crustaceans, and small fish as water warms. Spawning overlap is conservation context, not an egg-forage prescription.",
      },
      {
        season: "summer",
        emphasis: "Insects and small forage fish along breaks and weed edges. Follows forage and the cooler band, not a deep-basin default.",
      },
      {
        season: "fall",
        emphasis: "Insects and small forage fish as schools use shallower structure than in summer heat.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton-scale prey.",
      juvenile: "Aquatic insects, crustaceans, and zooplankton.",
      adult: "Immature insects, crayfish-scale crustaceans, and young of other fish (small_forage_fish).",
    },
    preySizeShifts: "Typical angling-size perch do not take larger_prey_fish. That class is not on this record.",
    ontogeneticShift: "Zooplankton to insects and crustaceans to small fish.",
    forageSubstitutions: "Great Lakes vs inland prey fields differ. Stunted populations stay insect-heavy. This overlay does not auto-select them.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Michigan DNR yellow perch species account (insects, crayfish, eggs and young of other fish)", class: "agency" },
      { label: "Thorpe yellow perch biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "pomoxis_spp",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "zooplankton", "aquatic_insects", "crustaceans"],
    primaryNote:
      "Minnesota DNR: young eat small aquatic invertebrates; adults can continue on plankton but usually eat a lot of small fish as well. Observed forage still has to be declared.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Zooplankton and remaining invertebrates in deeper timber or basins, with small fish where they occur.",
      },
      {
        season: "spring",
        emphasis: "Insects, crustaceans, and small fish as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Small forage fish around cover and suspended bait. Zooplankton remains capacity, especially for smaller fish.",
      },
      {
        season: "fall",
        emphasis: "Small forage fish continue as schools follow bait.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small aquatic invertebrates and zooplankton.",
      juvenile: "Zooplankton, insects, and crustaceans.",
      adult: "Usually a lot of small fish, with plankton still possible (Minnesota DNR).",
    },
    ontogeneticShift: "Invertebrates and zooplankton to small forage fish.",
    forageSubstitutions:
      "Black vs white forage fields in the same lake can differ with depth and clarity. This complex overlay does not auto-select them.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Minnesota DNR crappie biology (invertebrates then small fish and plankton)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepomis_macrochirus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "zooplankton", "crustaceans", "terrestrial_insects", "worms_annelids"],
    primaryNote:
      "Michigan DNR: fry eat zooplankton; larger fish add aquatic insects. Small fish and some plant matter appear in that agency note; small fish are not a catalog forage class on this record. Terrestrials and worms remain capacity. Do not infer a current hatch.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Slow subsurface insects and remaining invertebrates around deeper cover.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects and zooplankton as water warms. Capacity, not a hatch declaration.",
      },
      {
        season: "summer",
        emphasis: "Insects, crustaceans, and terrestrials around weeds and docks. Surface foods are capacity only when observed.",
      },
      {
        season: "fall",
        emphasis: "Insects and remaining terrestrials along edges.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton.",
      juvenile: "Zooplankton, aquatic insects, and small crustaceans.",
      adult: "Aquatic insects, crustaceans, terrestrials, and worms. Small fish stay an agency note off this catalog list.",
    },
    ontogeneticShift: "Zooplankton to insects and crustaceans. Weaker piscivory than green sunfish or crappie because that class is not on this record.",
    forageSubstitutions: "Weed ponds substitute insects and terrestrials. Do not invent a hatch from this list.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Michigan DNR bluegill species account (zooplankton then insects)", class: "agency" },
      { label: "Werner / Mittelbach sunfish foraging ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepomis_gibbosus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "mollusks", "crustaceans", "zooplankton", "small_forage_fish"],
    primaryNote:
      "Stronger mollusk and benthic-invertebrate component than bluegill, weaker snail specialization than redear. Insects remain central. Capacity is not a current snail event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Benthic invertebrates and remaining insects around cover.",
      },
      {
        season: "spring",
        emphasis: "Insects, crustaceans, and mollusks as water warms.",
      },
      {
        season: "summer",
        emphasis: "Insects and mollusks in vegetation. Small fish where gape allows.",
      },
      {
        season: "fall",
        emphasis: "Insects and remaining mollusks along edges.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Zooplankton and tiny invertebrates.",
      juvenile: "Aquatic insects and crustaceans.",
      adult: "Insects, mollusks, and crustaceans; some small fish.",
    },
    ontogeneticShift: "Zooplankton to insects and mollusks.",
    forageSubstitutions: "Lakes with snails add mollusks; snail-poor ponds stay insect-heavy. Do not import a redear shellcracker diet wholesale.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "USGS Nonindigenous Aquatic Species pumpkinseed profile", class: "agency" },
      { label: "Smithsonian NEMESIS pumpkinseed summary (insects, crustaceans, clams and snails)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepomis_microlophus",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "benthic",
    primaryForage: ["mollusks", "aquatic_insects", "crustaceans", "worms_annelids"],
    primaryNote:
      "Missouri DNR: feeding primarily on snails and other mollusks — the shellcracker name. Insects, crustaceans, and worms remain important where snails are sparse. Zooplankton and small forage fish are not catalog classes on this record.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Remaining benthic invertebrates on the bottom of the usable band.",
      },
      {
        season: "spring",
        emphasis: "Mollusks and insects as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Snails and other mollusks on vegetation, sand, mud, and shell substrate. Insects where snails are sparse.",
      },
      {
        season: "fall",
        emphasis: "Mollusks and remaining benthic invertebrates.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Agency pond notes describe zooplankton-scale feeding in fry; zooplankton is not a catalog class here. Insects follow.",
      juvenile: "Small mollusks and insect larvae.",
      adult: "Primarily snails and other mollusks; insects and crustaceans remain possible.",
    },
    ontogeneticShift: "Insects to primarily mollusks.",
    forageSubstitutions: "Snail-poor water substitutes insects and crustaceans. That does not turn this record into a bluegill.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Missouri Department of Conservation redear sunfish field guide (snails and other mollusks; shellcracker)", class: "agency" },
      { label: "NC State Extension redear sunfish pond-management guidance", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "snail-density diet tables by waterbody"],
  },
  {
    speciesId: "lepomis_cyanellus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "terrestrial_insects", "crustaceans", "small_forage_fish", "mollusks"],
    primaryNote:
      "Texas Parks and Wildlife: adults feed on insects and small fish. More piscivorous at typical angling size than bluegill. Mollusks and terrestrials remain capacity. Capacity is not a current event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Insects and remaining small fish in cover.",
      },
      {
        season: "spring",
        emphasis: "Insects and small fish as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Insects, terrestrials, and small forage fish around wood and shade.",
      },
      {
        season: "fall",
        emphasis: "Insects and small fish along cover.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Aquatic insects and small crustaceans.",
      juvenile: "Insects and crustaceans.",
      adult: "Insects and small forage fish.",
    },
    ontogeneticShift: "Insects to mixed insect–fish, stronger piscivory than bluegill at the same length.",
    forageSubstitutions: "Streams substitute different small fish than ponds. Hybrids should not inherit this list.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife green sunfish account (insects and small fish)", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species green sunfish profile", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "ambloplites_rupestris",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["crustaceans", "aquatic_insects", "small_forage_fish", "mollusks"],
    primaryNote:
      "Michigan DNR: smaller fish, yellow perch, and minnows, plus insects and crustaceans; equal-opportunity feeders on baitfish, aquatic insects, and crayfish. Crayfish-scale crustaceans are central. This is not a smallmouth diet copy, and it is not a current crayfish event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Crustaceans and remaining fish around deeper rock and wood.",
      },
      {
        season: "spring",
        emphasis: "Insects, crayfish, and small fish as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Crayfish and small forage fish around rock. Surface foods are occasional agency notes, not a catalog surface default.",
      },
      {
        season: "fall",
        emphasis: "Crustaceans and small fish along rocky structure.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Aquatic insects and small crustaceans.",
      juvenile: "Insects and crayfish-scale crustaceans.",
      adult: "Crayfish, insects, and small forage fish.",
    },
    ontogeneticShift: "Insects to mixed crustacean–fish.",
    forageSubstitutions: "Rocky rivers substitute crayfish; lakes substitute other small fish. Do not import a smallmouth forage table wholesale.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Michigan DNR rock bass species account (fish, insects, crustaceans, crayfish)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepomis_auritus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "crustaceans", "mollusks", "small_forage_fish", "worms_annelids"],
    primaryNote:
      "South Carolina DNR: predominantly aquatic and terrestrial insects, crayfish, mollusks, and other fish. North Carolina Wildlife: bottom-dwelling insect larvae, snails, clams, shrimp, crayfish, and small fish. Delaware DNREC: mainly insects, also crayfish, leeches, snails, and small fishes. Terrestrial insects are an agency note; they sit beside aquatic insects on this mixed record. Capacity is not a current hatch.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Remaining benthic insects, worms, and crustaceans around deeper pools and cover.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects, crustaceans, and mollusks as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Insects, crayfish, mollusks, and small forage fish around wood and current margins. Terrestrials are capacity when observed.",
      },
      {
        season: "fall",
        emphasis: "Insects and remaining small fish along cover.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small aquatic insects and invertebrates.",
      juvenile: "Aquatic insects, crustaceans, and small mollusks.",
      adult: "Insects, crayfish, mollusks, worms, and small forage fish.",
    },
    ontogeneticShift: "Insects to mixed insect–crustacean–mollusk, with small fish where gape allows.",
    forageSubstitutions: "Sandy rivers substitute different mollusks and crayfish than vegetated reservoirs. Do not import a bluegill pond diet wholesale.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "South Carolina DNR redbreast sunfish account (insects, crayfish, mollusks, other fish)", class: "agency" },
      { label: "North Carolina Wildlife Resources Commission redbreast sunfish profile (insect larvae, snails, clams, shrimp, crayfish, small fish)", class: "agency" },
      { label: "Delaware DNREC Fish Facts redbreast sunfish (insects, crayfish, leeches, snails, small fishes)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepomis_gulosus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "crustaceans", "mollusks", "small_forage_fish"],
    primaryNote:
      "Texas Parks and Wildlife: adults feed on insects, mollusks, and small fish. FWC: crayfish, shrimp, insects, and small fishes. Virginia DWR also lists terrestrial insects and snails; terrestrials are not a catalog class here and stay an agency note. Young zooplankton (Texas Parks and Wildlife) is likewise off this catalog list. Capacity is not a current crayfish event.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Insects, remaining crayfish, and small fish in cover.",
      },
      {
        season: "spring",
        emphasis: "Insects, crayfish, and small fish as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Crayfish, insects, mollusks, and small forage fish around stumps and weeds.",
      },
      {
        season: "fall",
        emphasis: "Insects, crayfish, and remaining small fish in cover.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Texas Parks and Wildlife: zooplankton and small insects. Zooplankton is not a catalog class on this record.",
      juvenile: "Insects and small crustaceans.",
      adult: "Insects, crayfish, mollusks, and small forage fish.",
    },
    ontogeneticShift: "Small invertebrates to mixed insect–crayfish–fish, stronger piscivory than bluegill at the same length.",
    forageSubstitutions: "Swamps substitute crayfish and insects; ponds substitute different small fish. Hybrids should not inherit this list.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife warmouth account (young zooplankton and insects; adults insects, mollusks, small fish)", class: "agency" },
      { label: "Florida Fish and Wildlife Conservation Commission warmouth profile (crayfish, shrimp, insects, small fishes)", class: "agency" },
      { label: "Virginia DWR warmouth account (insects, snails, crayfish, small fishes)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "lepomis_megalotis",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "terrestrial_insects", "crustaceans", "small_forage_fish"],
    primaryNote:
      "Missouri DNR: insects, small crustaceans, and some small fish. Illinois DNR: insects, fishes, and crayfish. Mollusks are not a catalog class on this record — do not import a pumpkinseed or redear snail diet. Capacity is not a current hatch.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Remaining insects and crustaceans in deeper pools.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects and crustaceans as water warms.",
      },
      {
        season: "summer",
        emphasis: "Insects, terrestrials, crayfish, and some small forage fish in clear stream pools. Surface foods are capacity when observed.",
      },
      {
        season: "late_summer",
        emphasis: "Insects and remaining terrestrials along pool edges. Nesting overlap may continue; that is conservation context.",
      },
      {
        season: "fall",
        emphasis: "Insects and remaining small fish along cover.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small aquatic insects and crustaceans.",
      juvenile: "Insects and small crustaceans.",
      adult: "Insects, terrestrials, crayfish-scale crustaceans, and some small forage fish.",
    },
    ontogeneticShift: "Small invertebrates to mixed insect–crustacean, with small fish where gape allows.",
    forageSubstitutions: "Clear rocky streams substitute crayfish and insects. Do not import a mollusk specialist diet this record does not have.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Missouri Department of Conservation longear sunfish field guide (insects, small crustaceans, some small fish)", class: "agency" },
      { label: "Illinois Department of Natural Resources longear sunfish account (insects, fishes, crayfish)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "centrarchus_macropterus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["aquatic_insects", "small_forage_fish", "crustaceans"],
    primaryNote:
      "South Carolina DNR: small aquatic insects and small fishes. Illinois DNR: insects, fishes, and crustaceans. Catalog also lists mollusks, worms, and zooplankton as capacity; they are not treated as primary without a matching agency emphasis. Observed forage still outranks an assumed single prey class.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Remaining insects and small fish in vegetated backwater.",
      },
      {
        season: "spring",
        emphasis: "Aquatic insects, crustaceans, and small fish as water warms. Early spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Insects, crustaceans, and small forage fish in weeds and wood.",
      },
      {
        season: "fall",
        emphasis: "Insects and remaining small fish along vegetated edges.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Small aquatic insects. Zooplankton is catalog capacity, not a sourced primary class here.",
      juvenile: "Insects and small crustaceans.",
      adult: "Insects, crustaceans, and small forage fish.",
    },
    ontogeneticShift: "Small insects to mixed insect–fish in vegetated backwater.",
    forageSubstitutions: "Tannic swamps substitute different insects than clear oxbows. Do not import a crappie plankton-and-schooling diet wholesale.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "South Carolina DNR flier account (small aquatic insects and small fishes)", class: "agency" },
      { label: "Illinois Department of Natural Resources flier account (insects, fishes, crustaceans)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "ictalurus_punctatus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["aquatic_insects", "small_forage_fish", "crustaceans", "mollusks", "worms_annelids"],
    primaryNote:
      "Missouri DNR: omnivorous — fish, insects, crayfish, mollusks, and plant material. North Carolina Wildlife: adults eat plant material, insect larvae, crayfish, mollusks, small fish, and even dead fish. Minnesota DNR: snails, crayfish, aquatic insects, other invertebrates, and small fish; more likely than flathead to take carrion. Larger-prey-fish is not a catalog class on this record.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Slow bottom intercept of remaining invertebrates and fish in deep, current-protected water.",
      },
      {
        season: "spring",
        emphasis: "Insects, crustaceans, and small fish as water warms. Upstream movement is a class, not a hatch declaration.",
      },
      {
        season: "early_summer",
        emphasis: "Omnivory around cover and night shallows. Spawning overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Insects, crayfish, mollusks, worms, and small forage fish on the bottom of the usable band. Night shallows are a delivery window, not a current event.",
      },
      {
        season: "fall",
        emphasis: "Remaining fish and invertebrates as fish move toward deeper current protection.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Missouri DNR: less than 4 in feed almost entirely on small insects. North Carolina Wildlife notes plankton in young; zooplankton is not a catalog class here.",
      juvenile: "Aquatic insects, crustaceans, and small invertebrates.",
      adult: "Omnivorous: insects, mollusks, crustaceans, worms, small forage fish, and carrion. Not a live-fish-only flathead diet.",
    },
    ontogeneticShift: "Insects to mixed benthic omnivory. Weaker early piscivory than blue catfish.",
    forageSubstitutions: "Ponds substitute prepared and invertebrate foods; large rivers substitute different small fish and mollusks. Do not import a flathead live-fish diet wholesale.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Missouri Department of Conservation channel catfish field guide (omnivory, insects to fish, night feeding)", class: "agency" },
      { label: "Texas Parks and Wildlife channel catfish account (insects, mollusks, crustaceans, fish, some plant material)", class: "agency" },
      { label: "North Carolina Wildlife channel catfish account (omnivory including dead fish)", class: "agency" },
      { label: "Minnesota DNR catfish biology (invertebrates and small fish; more carrion than flathead)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "ictalurus_furcatus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "crustaceans", "mollusks", "aquatic_insects"],
    primaryNote:
      "Texas Parks and Wildlife: varied diet but eats fish earlier than channel catfish; individuals larger than 8 in eat fish and large invertebrates. Virginia DWR: trophic generalist — small fish, crayfish, mollusks, and plant matter, becoming increasingly piscivorous at large size. USGS NAS: highly omnivorous, including scavenged items. Worms are not a catalog class on this record.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Texas Parks and Wildlife: downstream toward warmer water. Remaining fish and invertebrates in the usable band.",
      },
      {
        season: "spring",
        emphasis: "Fish, crustaceans, and insects as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "early_summer",
        emphasis: "Mixed fish and invertebrate feeding. Nesting is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Texas Parks and Wildlife: upstream toward cooler water. Large fish emphasize piscivory. Reservoir roamers may suspend with forage — that is not a current bait event.",
      },
      {
        season: "fall",
        emphasis: "Fish and remaining invertebrates along channel and basin structure.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Texas Parks and Wildlife: invertebrates still the major portion, but fish as small as 4 in have consumed fish.",
      juvenile: "Fish and large invertebrates.",
      adult: "Increasingly piscivorous; crustaceans, mollusks, and insects remain possible. NOAA / North Carolina Wildlife: large fish consume native fishes in introduced Atlantic-slope waters — conservation context, not a targeting list.",
    },
    ontogeneticShift: "Invertebrates to mixed fish earlier than channel catfish, then larger prey fish at adult size.",
    forageSubstitutions: "Native large-river diets differ from introduced tidal-river diets. Do not import a flathead live-fish-only rule or a channel carrion default wholesale. RPC already splits river-channel vs reservoir-roaming.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Texas Parks and Wildlife blue catfish account (earlier piscivory, 4 in and 8 in diet notes)", class: "agency" },
      { label: "Virginia DWR blue catfish account (omnivory to piscivory)", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species blue catfish profile (highly omnivorous diet composition)", class: "agency" },
      { label: "NOAA Fisheries blue catfish species page (opportunistic generalist; Chesapeake native-fish predation as conservation context)", class: "agency" },
      { label: "North Carolina Wildlife blue catfish account (piscivorous when large)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "introduced-range vs native-range prey tables"],
  },
  {
    speciesId: "pylodictis_olivaris",
    status: "reviewed",
    feedingStyle: "specialized",
    feedingZone: "mixed",
    primaryForage: ["larger_prey_fish", "small_forage_fish", "crustaceans"],
    primaryNote:
      "Missouri DNR: adults prefer fish and crayfish; unlike channel catfish they are not scavengers and rarely eat dead or decaying material. Texas Parks and Wildlife: from about 10 in, diet consists entirely of live fish — shad, carp, suckers, sunfish, bass, and other catfish. Minnesota DNR: primarily other fish, hunted by smell and vibration. Aquatic insects are an agency young-of-year note off this catalog list.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Remaining live fish around deep wood and current refuge. Not a carrion default.",
      },
      {
        season: "spring",
        emphasis: "Live fish and crayfish as water warms. Spawning overlap is conservation context.",
      },
      {
        season: "early_summer",
        emphasis: "Live prey around wood and pools. Nesting is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Night intercept of live fish off deep cover. Crayfish remain capacity. This is not a current baitfish declaration.",
      },
      {
        season: "fall",
        emphasis: "Live fish along wood, pools, and remaining structure.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Missouri DNR: smaller than 4 in eat insect larvae. Texas Parks and Wildlife: young feed mostly on invertebrates. Insects are not a catalog class here.",
      juvenile: "Texas Parks and Wildlife: invertebrates, then live fish by about 10 in.",
      adult: "Live fish and crayfish. Not scavengers.",
    },
    ontogeneticShift: "Invertebrates to live-fish specialization. Stronger piscivory than channel catfish at the same length.",
    forageSubstitutions: "Rivers substitute different live fish than reservoirs. Do not import channel-catfish carrion or insect defaults. Introduced-range diets stay waterbody-specific.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Missouri Department of Conservation flathead catfish field guide (night forage, live fish and crayfish, not scavengers)", class: "agency" },
      { label: "Texas Parks and Wildlife flathead catfish account (live fish from about 10 in)", class: "agency" },
      { label: "Minnesota DNR catfish biology (primarily other fish; shun dead bait relative to channel catfish)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "ameiurus_catus",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "benthic",
    primaryForage: ["aquatic_insects", "crustaceans", "small_forage_fish", "mollusks", "worms_annelids"],
    primaryNote:
      "Smithsonian NEMESIS: omnivorous — aquatic plants, benthic invertebrates, and small fishes. Chesapeake Bay Program: adults favor other fish but also consume crustaceans, insects, and aquatic plants. Larger-prey-fish is not a catalog class. Plant material is an agency note off this catalog list.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Slow bottom intercept of remaining invertebrates in holes and basins.",
      },
      {
        season: "spring",
        emphasis: "Insects, crustaceans, and small fish as water warms.",
      },
      {
        season: "early_summer",
        emphasis: "Mixed benthic omnivory. Nesting overlap is conservation context.",
      },
      {
        season: "summer",
        emphasis: "Insects, crustaceans, mollusks, worms, and small forage fish around wood and current relief. Daylight feeding is more plausible than a bullhead night-only default.",
      },
      {
        season: "fall",
        emphasis: "Remaining invertebrates and small fish along structure.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Smithsonian NEMESIS: small invertebrates (amphipods, mysids, midge larvae in estuary notes). Freshwater young stay insect- and invertebrate-weighted.",
      juvenile: "Benthic invertebrates and small crustaceans.",
      adult: "Insects, crustaceans, mollusks, worms, and small forage fish. Not a blue-catfish piscivore.",
    },
    ontogeneticShift: "Small invertebrates to mixed benthic omnivory with some small fish.",
    forageSubstitutions: "Coastal rivers substitute different invertebrates than inland ponds. Do not inherit a bullhead night-only diet or a channel-catfish carrion story wholesale.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Smithsonian NEMESIS white catfish summary (omnivory: plants, benthic invertebrates, small fishes)", class: "agency" },
      { label: "Chesapeake Bay Program white catfish field guide (omnivory; adults favor fish plus crustaceans and insects)", class: "agency" },
      { label: "Connecticut DEEP white catfish account (slow-water habitat)", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP],
  },
  {
    speciesId: "oncorhynchus_tshawytscha",
    status: "reviewed",
    feedingStyle: "mixed",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "larger_prey_fish", "aquatic_insects"],
    primaryNote:
      "NOAA: young Chinook feed on terrestrial and aquatic insects, amphipods, and other crustaceans; older Chinook primarily feed on other fish. Terrestrial insects and crustaceans are not catalog forage classes on this record. Catalog exception: spawning adults are interception, not forage matching. Great Lakes lake adults still feed; Pacific freshwater returning adults are not treated as feeding trout.",
    seasonalDiet: [
      {
        season: "spring",
        emphasis: "Great Lakes and ocean feeding remain piscivorous capacity where those fish are in open water. Aquatic insects remain juvenile/young capacity. Do not infer a current bait event.",
      },
      {
        season: "summer",
        emphasis: "Older fish on other fish. Lake fish track the cool pelagic layer. Pacific freshwater return is not this feeding story.",
      },
      {
        season: "late_summer",
        emphasis: "Pacific freshwater adults are interception, not forage matching. Great Lakes lake feeding may still be underway. Do not collapse the two.",
      },
      {
        season: "fall",
        emphasis: "Spawning adults are not a feeding-trout problem. Redds are excluded. Diet capacity does not license targeting spawners.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "NOAA: terrestrial and aquatic insects, amphipods, and other crustaceans. Terrestrial insects and crustaceans stay off the catalog forage list here.",
      juvenile: "Aquatic insects remain; fish enter as gape allows.",
      adult: "Older Chinook primarily feed on other fish (NOAA). Freshwater spawning adults are interception, not forage matching.",
    },
    preySizeShifts: "Gape tracks the shift from insects to fish. Large adults take larger prey fish; that does not apply to spawning freshwater adults as a feeding model.",
    ontogeneticShift: "Insects/crustaceans in young fish to piscivory in older fish, then feeding largely stops as a model for Pacific freshwater spawners.",
    forageSubstitutions:
      "Great Lakes alewife/smelt fields vs Pacific herring-scale forage are not interchangeable. This species overlay does not auto-select them. Do not import an inland-rainbow hatch match.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "NOAA Fisheries Chinook Salmon species profile (young insects/crustaceans; older fish; ESA counts)", class: "agency", url: "https://www.fisheries.noaa.gov/species/chinook-salmon" },
      { label: "Healey chinook life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "Pacific vs Great Lakes adult diet as a structured split", "terrestrial insects / crustaceans fraction (no catalog forage class here)"],
  },
  {
    speciesId: "oncorhynchus_kisutch",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "aquatic_insects", "terrestrial_insects"],
    primaryNote:
      "NOAA: while in fresh water, young coho feed on plankton and insects; in the ocean they switch to small fishes such as herring, sandlance, anchovies, and sardines, and may eat juveniles of other salmon. Zooplankton is not a catalog forage class here. Larger prey fish is not a catalog class on this record — do not import Chinook piscivory. Pacific freshwater adults are interception, not forage matching.",
    seasonalDiet: [
      {
        season: "spring",
        emphasis: "Great Lakes and ocean fish on small forage fish where those fish are in open water. Insects remain juvenile/young capacity.",
      },
      {
        season: "summer",
        emphasis: "Small fishes in the usable pelagic band. Catalog: often higher in the column than Chinook. Capacity is not a current bait event.",
      },
      {
        season: "fall",
        emphasis: "Pacific freshwater adults are interception, not forage matching. Do not treat tributary-mouth habitat as a license to crowd spawning tributaries.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "NOAA: plankton and insects in fresh water. Zooplankton stays off the catalog forage list here.",
      juvenile: "Insects and, as gape allows, small fish before ocean or lake entry.",
      adult: "Ocean and Great Lakes adults on small fishes. Freshwater spawning adults are not a feeding-trout model. They do not inherit Chinook larger-prey-fish forage.",
    },
    ontogeneticShift: "Plankton/insects in freshwater young to small-fish feeding in ocean/lake adults; Pacific freshwater return is not a forage-matching problem.",
    forageSubstitutions:
      "Great Lakes vs Pacific small-fish fields differ. Do not substitute Chinook larger-prey-fish forage, and do not substitute an inland-rainbow hatch match.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "NOAA Fisheries Coho Salmon species profile (young plankton and insects; ocean small fishes)", class: "agency", url: "https://www.fisheries.noaa.gov/species/coho-salmon" },
      { label: "Sandercock coho life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "Pacific vs Great Lakes adult diet as a structured split", "zooplankton fraction in young fish (no catalog forage class here)"],
  },
  {
    speciesId: "oncorhynchus_gorbuscha",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "pelagic",
    primaryForage: ["aquatic_insects", "zooplankton", "small_forage_fish"],
    primaryNote:
      "Alaska DFG: adults returning to spawn do not eat. Young salmon migrating to the ocean may eat aquatic insects and zooplankton. NOAA: pink salmon feed on small crustaceans, zooplankton, squid, and small fish — crustaceans are not a catalog forage class here. Freshwater adult diet is interception/reaction, not forage matching.",
    seasonalDiet: [
      {
        season: "summer",
        emphasis: "Returning freshwater adults do not eat (Alaska DFG). Ocean feeding is behind them. Odd/even year structure is not a diet event.",
      },
      {
        season: "late_summer",
        emphasis: "Migration and ripening, not a forage-matching problem.",
      },
      {
        season: "fall",
        emphasis: "Spawning fish do not establish feeding lies. Diet guidance for freshwater adults stays conservation-first.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Alaska DFG: aquatic insects and zooplankton on the way to the ocean. They leave gravel quickly.",
      juvenile: "Short freshwater residence; ocean entry on plankton, shrimp/krill, and small fish.",
      adult: "Alaska DFG: adults returning to spawn do not eat. As with the pink freshwater record, presentation describes interception/reaction mechanics only.",
    },
    ontogeneticShift: "Brief freshwater insect/zooplankton feeding, marine pelagic feeding, then feeding stops on the freshwater return.",
    forageSubstitutions:
      "Do not substitute a trout hatch match, a Chinook piscivore diet, or a stillwater pelagic diet — this record is flowing-only and freshwater adults do not eat.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Alaska Department of Fish and Game Pink Salmon species profile (adults returning to spawn do not eat; young insects and zooplankton)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=pinksalmon.main" },
      { label: "NOAA Fisheries Pink Salmon species profile (zooplankton, small crustaceans, small fish)", class: "agency", url: "https://www.fisheries.noaa.gov/species/pink-salmon" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "crustacean fraction (no catalog forage class here)"],
  },
  {
    speciesId: "oncorhynchus_keta",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "pelagic",
    primaryForage: ["small_forage_fish", "crustaceans", "zooplankton"],
    primaryNote:
      "Alaska DFG: adults on the spawning run cease feeding and their digestive tract degrades. At sea they feed on copepods, tunicates, mollusks, and a variety of fishes. NOAA: young feed on insects as they migrate downriver — aquatic insects are not a catalog forage class on this record. Freshwater adult diet is interception, not forage matching.",
    seasonalDiet: [
      {
        season: "late_summer",
        emphasis: "Returning freshwater adults have ceased feeding (Alaska DFG). Ocean feeding is behind them.",
      },
      {
        season: "fall",
        emphasis: "Migration and ripening, not a forage-matching problem. Listed ESUs remain conservation context.",
      },
      {
        season: "late_fall",
        emphasis: "NOAA: spawning continues toward early winter in some populations. Spawners are not feeding trout.",
      },
      {
        season: "winter",
        emphasis: "Peak spawning can be concentrated in early winter (NOAA). Diet guidance stays conservation-first.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "NOAA / Alaska DFG: insects on the seaward movement. That insect fraction is not a catalog forage class here; crustaceans and zooplankton are.",
      juvenile: "Nearshore crustaceans and small fishes after ocean entry (Alaska DFG).",
      adult: "Ocean: copepods, fishes, mollusks, squid, and tunicates (NOAA / Alaska DFG). Freshwater adults cease feeding.",
    },
    ontogeneticShift: "Brief freshwater insect feeding off-catalog, marine crustacean/fish feeding, then digestive-tract shutdown on the spawning run.",
    forageSubstitutions:
      "Do not substitute a trout hatch match or a pink small-scale diet as if they were the same fish. Do not add stillwater families — this record is flowing-only.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Alaska Department of Fish and Game Chum Salmon species profile (cease feeding; ocean copepods, tunicates, mollusks, fishes)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=chumsalmon.main" },
      { label: "NOAA Fisheries Chum Salmon species profile (young insects off-catalog; adult marine diet; threatened ESUs)", class: "agency", url: "https://www.fisheries.noaa.gov/species/chum-salmon" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, "aquatic insect fraction in young fish (no catalog forage class here)"],
  },
  {
    speciesId: "salmo_salar_landlocked",
    status: "reviewed",
    feedingStyle: "opportunistic",
    feedingZone: "mixed",
    primaryForage: ["small_forage_fish", "aquatic_insects", "emerging_insects", "terrestrial_insects"],
    primaryNote:
      "Maine IFW: rainbow smelt are the principal forage for landlocked salmon in Maine lakes; growth can be poor without adequate smelt. River fish take aquatic, emerging, and terrestrial insects. Unlike Pacific salmon freshwater adults, this form still feeds. Larger prey fish is not a catalog class here — do not import lake trout or brown-trout piscivory wholesale.",
    seasonalDiet: [
      {
        season: "winter",
        emphasis: "Pelagic forage fish in the remaining cold band. Insects recede. Capacity is not a current smelt event.",
      },
      {
        season: "spring",
        emphasis: "Smelt-scale forage in lakes as water leaves winter; insects and emergences in connected rivers. Do not infer a hatch.",
      },
      {
        season: "summer",
        emphasis: "Maine IFW: prefer water below 65°F. Lake fish follow cold oxygenated water and pelagic forage. Surface insects are capacity, not a default.",
      },
      {
        season: "fall",
        emphasis: "Forage continues until spawning overlap. Maine IFW: mid-October through late November spawn window is an invalidator, not a forage map.",
      },
    ],
    lifeStageDiet: {
      youngOfYear: "Stream insects during the one-to-four-year river residence (Maine IFW).",
      juvenile: "Aquatic and emerging insects in streams, then a shift toward pelagic forage after lake entry.",
      adult: "Maine IFW: rainbow smelt principal lake forage. Insects remain river capacity. This is not wild sea-run Atlantic salmon, and it is not a non-feeding Pacific spawner.",
    },
    ontogeneticShift: "Stream insectivory to lake pelagic smelt-linked feeding. Absence of smelt or equivalent pelagic forage can materially change growth (catalog).",
    forageSubstitutions:
      "Lakes substitute other pelagic forage fish when smelt are scarce; growth often suffers. Rivers substitute hatches and terrestrials. Do not substitute a brown-trout hole diet or a steelhead egg diet as the default.",
    observedForageRule: OBSERVED,
    sources: [
      { label: "Maine Department of Inland Fisheries and Wildlife Landlocked Salmon species profile (rainbow smelt principal lake forage; <65°F)", class: "agency", url: "https://www.maine.gov/ifw/fish-wildlife/fisheries/species-information/landlocked-salmon.html" },
      { label: "Maine landlocked Atlantic salmon management literature", class: "agency" },
    ],
    ...R,
    gaps: [SEASONAL_GAP, SUB_GAP, "smelt-present vs smelt-absent diet as a structured split"],
  },

];
