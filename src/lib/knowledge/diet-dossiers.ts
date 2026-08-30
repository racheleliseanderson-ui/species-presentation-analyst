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
];
