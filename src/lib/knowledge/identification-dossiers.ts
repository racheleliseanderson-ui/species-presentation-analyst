import {
  DOSSIER_NEXT_REVIEW_AT,
  DOSSIER_REVIEWED_AT,
  type IdentificationDossier,
} from "./dossier-types.ts";

const R = {
  reviewedAt: DOSSIER_REVIEWED_AT,
  nextReviewAt: DOSSIER_NEXT_REVIEW_AT,
} as const;

/**
 * AFP-ID-1.0 wave 01 — identification dossiers for the highest-confusion groups.
 *
 * Visual characters are taken from agency, museum, and peer-reviewed keys.
 * AI-generated appearance claims are not used as identification authority.
 */
export const IDENTIFICATION_DOSSIERS: IdentificationDossier[] = [
  {
    speciesId: "oncorhynchus_mykiss",
    status: "reviewed",
    regionalNames: ["bow", "redside", "rainbow"],
    bodyShape:
      "Typical trout fusiform body; moderately deep; caudal fin shallowly forked to nearly square in inland fish.",
    identificationTraits: [
      "Broad pink-to-red lateral stripe from gill cover to caudal peduncle in most inland fish.",
      "Black spots commonly cover the back, sides, and caudal fin; spotting is usually more even than cutthroat.",
      "No red-orange hyoid (throat) slash; the floor of the mouth is not a cutthroat mark.",
      "Basibranchial (hyoid) teeth at the tongue base are usually absent; maxillary typically does not extend far past the eye in the way many cutthroat do.",
      "Steelhead is the anadromous life-history form and is a separate catalog record.",
    ],
    coloration:
      "Olive to blue-green back, silvery to brassy sides, white belly, with the namesake pink/red lateral band. Spotting is typically fine and widespread.",
    regionalColorVariation:
      "Coastal rainbows and some Columbia redband fish can show faint reddish throat marks that are not the cutthroat slash. Lake and hatchery strains vary from pale silver to deep rose.",
    spawningColoration:
      "Spring spawners intensify the lateral band and opercular pink; males may deepen color and develop a modest kype. This is not a targeting cue.",
    juvenileAppearance:
      "Parr carry 8–13 oval parr marks along the side; the lateral stripe is often faint until smolt or adult color develops.",
    adultAppearance:
      "Stream adults are usually spotted trout with a clear lateral band. Large lake fish can be more silvery until handled.",
    sexualDimorphism:
      "Breeding males may show a stronger kype and deeper color; size overlap is large and sex is not a field ID key.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_clarkii",
        name: "Cutthroat trout",
        distinction:
          "Cutthroat show a red-orange slash under the jaw and usually have basibranchial teeth; many interior forms concentrate spots toward the posterior. Rainbows lack the slash and typically lack those tongue-base teeth. Hybrids (cuttbows) can carry both a rainbow stripe and a slash and should not be forced into either record.",
      },
      {
        speciesId: "oncorhynchus_mykiss_steelhead",
        name: "Steelhead",
        distinction:
          "Same species, anadromous life history. Fresh-from-the-ocean fish are more silvery, often larger, and should be treated as the steelhead record, not inland rainbow.",
      },
      {
        speciesId: "salmo_trutta",
        name: "Brown trout",
        distinction:
          "Browns have a plain, unspotted tail, orange/yellow adipose and anal-fin highlights, and red-orange spots with pale halos on the sides rather than a pink lateral band.",
      },
    ],
    averageAdultLength: "Inland stream adults commonly 10–16 in; many lake and reservoir fish 16–22 in.",
    commonAnglingSize: "10–18 in in most inland fisheries.",
    typicalWeight: "Often under 2 lb in streams; 2–5 lb is common in productive lakes.",
    maximumDocumentedSize:
      "Large lake and anadromous fish far exceed typical inland stream size. Anadromous maxima belong to the steelhead record rather than this inland rainbow dossier.",
    longevity: "Commonly 4–7 years in inland waters; older fish occur in some lakes.",
    sources: [
      { label: "USFWS / state inland trout management summaries", class: "agency" },
      { label: "Behnke Oncorhynchus clarkii systematics (rainbow vs cutthroat dentition and maxillary)", class: "peer_reviewed" },
      { label: "Raleigh et al. habitat suitability (rainbow trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "subspecies/strain color maps beyond the coastal-redband throat-mark caveat",
      "a single continent-wide mean length — inland size is fishery-specific",
    ],
  },
  {
    speciesId: "oncorhynchus_clarkii",
    status: "reviewed",
    regionalNames: ["cutt", "cutthroat", "native trout"],
    bodyShape:
      "Trout-like, often slightly more elongate than hatchery rainbows; maxillary commonly long relative to the eye.",
    identificationTraits: [
      "Red, pink, or orange slash on the inner fold of the lower jaw — the namesake cutthroat mark.",
      "Basibranchial teeth present at the base of the tongue in true cutthroat; a reliable internal check against rainbow.",
      "Maxillary typically extends beyond the posterior edge of the eye.",
      "Spots often larger and more posterior than on rainbow; many interior forms are lightly spotted on the anterior body.",
      "Subspecies (westslope, Yellowstone, coastal, Lahontan, and others) are not interchangeable; treat geography as a hard constraint.",
    ],
    coloration:
      "Greenish, brassy, or golden sides depending on subspecies, fading to yellow or silver below. Lower fins often yellowish to orange without rainbow-style white fin tips.",
    regionalColorVariation:
      "Coastal cutthroat can look very silvery. Interior forms range from golden Yellowstone fish to green-olive westslope fish. Spot size and density are subspecies characters, not a single pattern.",
    spawningColoration:
      "Spring spawners intensify the jaw slash and lower-fin color. Slash can be faint on some fish until the mouth is opened.",
    juvenileAppearance:
      "Parr marks plus a developing jaw slash. Juvenile coastal cutthroat and rainbow are easy to confuse; dentition and maxillary are more reliable than color.",
    adultAppearance:
      "The jaw slash plus posterior spotting is the field picture; large lake fish (Lahontan and some adfluvial forms) can be silvery and sparsely spotted.",
    sexualDimorphism:
      "Males may show a stronger kype and deeper spawning color; not a primary species key.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows usually lack the jaw slash and basibranchial teeth, carry a stronger pink lateral band, and have more uniform spotting onto the tail. Hybrids are common where the two overlap.",
      },
      {
        speciesId: "salvelinus_confluentus",
        name: "Bull trout",
        distinction:
          "Bull trout are char: light spots on a darker body, no cutthroat slash, white leading edges on the fins, and a conservation-sensitive catalog status.",
      },
    ],
    averageAdultLength: "Many interior stream adults 8–14 in; adfluvial and large-lake forms substantially larger.",
    commonAnglingSize: "8–16 in in most interior streams.",
    typicalWeight: "Often under 1.5 lb in small interior streams; lake forms can weigh several pounds.",
    maximumDocumentedSize:
      "Lahontan and some large-lake adfluvial fish historically reached trophy sizes far above typical interior stream fish. Subspecies must not share one maximum.",
    longevity: "Often 5–8 years in interior streams; large-lake forms can live longer.",
    sources: [
      { label: "State/tribal cutthroat status reviews", class: "agency" },
      { label: "Behnke Oncorhynchus clarkii systematics", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "subspecies-by-subspecies size and longevity table",
      "a complete coastal-cutthroat versus steelhead juvenile key",
    ],
  },
  {
    speciesId: "oncorhynchus_nerka_kokanee",
    status: "reviewed",
    regionalNames: ["koke", "kickininee", "little redfish", "silver trout", "landlocked sockeye"],
    bodyShape:
      "Salmonid with a relatively slender, compressed body and an adipose fin. Anal fin typically with 13 or more rays, unlike most trout.",
    identificationTraits: [
      "Same species as anadromous sockeye (Oncorhynchus nerka), but a non-anadromous / landlocked life history.",
      "NOAA: kokanee rarely exceed 1.2 ft in length, far smaller than sea-run sockeye.",
      "No large black spots on the back or tail (unlike rainbow, cutthroat, or Chinook).",
      "Ocean-phase analog is metallic blue-green over silver; freshwater adults are silvery until spawning.",
      "Anal-fin ray count (>12) separates kokanee from trout when the two are mixed in a lake.",
    ],
    coloration:
      "Non-spawning fish are silver with a dark blue or green-blue back and small speckling at most. They lack the large spots of trout and most other Pacific salmon.",
    spawningColoration:
      "Body turns bright red and the head green; males develop a humped back and hooked jaws. Spawning color is shared with anadromous sockeye and is not a license to treat the two records as one.",
    juvenileAppearance:
      "Lake-resident fry and smolt-like juveniles are small, silvery, and pelagic; they are not a separate species from sockeye juveniles.",
    adultAppearance:
      "A small, unspotted, silvery salmonid in open water until the fall color change.",
    sexualDimorphism:
      "Spawning males develop a hump and kype; females remain more fusiform. Both die after spawning (semelparous).",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_nerka_anadromous",
        name: "Anadromous sockeye salmon",
        distinction:
          "Same species, different life history. NOAA describes sea-going sockeye as 1.5–2.5 ft and 4–15 lb; kokanee rarely exceed 1.2 ft. Freshwater-returning sockeye are a regulated migratory record, not this landlocked lake fish.",
      },
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows are spotted on the body and tail and have fewer anal rays. Kokanee lack those large spots.",
      },
      {
        speciesId: "coregonus_artedi",
        name: "Cisco",
        distinction:
          "Cisco are coregonines with larger scales, no salmon-red spawning dress, and a terminal mouth without a salmon kype.",
      },
    ],
    averageAdultLength: "NOAA: rarely exceed 1.2 ft. Many fisheries see 8–12 in adults.",
    commonAnglingSize: "8–14 in in most stocked and native lakes.",
    typicalWeight: "Often well under 2 lb; a 2 lb fish is large in many waters.",
    maximumDocumentedSize:
      "Some productive lakes produce fish into the high teens of inches and occasional multi-pound trophies, still far below typical anadromous sockeye size.",
    longevity: "Semelparous; commonly mature and die around age 3–5, similar in structure to sockeye.",
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile (kokanee size and life history)", class: "agency", url: "https://www.fisheries.noaa.gov/species/sockeye-salmon" },
      { label: "Washington Department of Fish and Wildlife kokanee profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "lake-by-lake size variation beyond the NOAA ceiling",
    ],
  },
  {
    speciesId: "oncorhynchus_nerka_anadromous",
    status: "reviewed",
    regionalNames: ["red salmon", "blueback", "redfish", "sockeye"],
    bodyShape:
      "A relatively small-bodied Pacific salmon; more compressed than Chinook, without the large spots of Chinook, coho, or pink.",
    identificationTraits: [
      "NOAA: 1.5–2.5 ft and 4–15 lb as sea-going adults — the size contrast with kokanee is the practical field split.",
      "Metallic green-blue back, iridescent silver flanks, white belly at sea; large spots absent from back and fins, including the tail.",
      "Fine black speckling may occur on the back; this is not the large oval spotting of Chinook or rainbow.",
      "Spawning fish turn red-bodied with green heads; males develop a hump and hooked jaws.",
      "This record is explicitly not kokanee. The alias 'sockeye' must not resolve to the landlocked record.",
    ],
    coloration:
      "Ocean phase: blue-green over silver ('blueback'). Freshwater spawning phase: red body, green head.",
    spawningColoration:
      "Bright red body, olive-green head; males humped and kyped. Color does not identify a feeding fish.",
    juvenileAppearance:
      "Fry typically rear in lakes 1–3 years. Juveniles are not an adult targeting proxy.",
    adultAppearance:
      "A medium Pacific salmon without large spots; size and life history, not color alone, separate it from kokanee.",
    sexualDimorphism:
      "Males develop hump, kype, and visible teeth on the spawning grounds. Jacks (early-returning males) occur.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_nerka_kokanee",
        name: "Kokanee",
        distinction:
          "Landlocked/non-anadromous O. nerka. NOAA: kokanee rarely exceed 1.2 ft, while anadromous sockeye are 1.5–2.5 ft and 4–15 lb. Treat them as separate catalog records.",
      },
      {
        speciesId: "oncorhynchus_kisutch",
        name: "Coho salmon",
        distinction:
          "Coho have spots on the upper half of the tail and white gums; sockeye tails are unspotted and the spawning dress is red/green rather than coho maroon/black.",
      },
      {
        speciesId: "oncorhynchus_tshawytscha",
        name: "Chinook salmon",
        distinction:
          "Chinook are larger, with large black spots on back and both lobes of the tail and black gums.",
      },
    ],
    averageAdultLength: "NOAA: 1.5–2.5 ft.",
    commonAnglingSize: "18–28 in for returning adults in many fisheries.",
    typicalWeight: "NOAA: 4–15 lb.",
    maximumDocumentedSize:
      "Occasional larger fish occur, but NOAA's 4–15 lb band is the reviewed working range for this dossier.",
    longevity:
      "NOAA: typically mature around age 4–5 after 1–3 years in fresh water and 2–3 years at sea; all die after spawning.",
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile", class: "agency", url: "https://www.fisheries.noaa.gov/species/sockeye-salmon" },
      { label: "NOAA Fisheries Sockeye Salmon protected-ESU profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "stock-specific mean size tables",
    ],
  },
  {
    speciesId: "micropterus_nigricans",
    status: "reviewed",
    regionalNames: ["bucketmouth", "largemouth", "Florida bass (strain/context)", "green bass"],
    bodyShape:
      "Deep, compressed centrarchid body; the largest mouth of the common black basses.",
    identificationTraits: [
      "TPWD: upper jaw extends well behind the back margin of the eye when the mouth is closed.",
      "Spiny and soft dorsal fins are nearly separated by a deep notch; they are not a continuous fin.",
      "A definite dark lateral stripe along the side.",
      "Tongue typically lacks the sandpaper tooth patch of spotted bass.",
      "Catalog scientific name follows the northern largemouth (Micropterus nigricans) treatment; Florida-strain fish are a thermal/identity caveat, not a second record.",
    ],
    coloration:
      "Light to dark green back, white belly, dark horizontal band. Belly white extends higher on the side than in smallmouth.",
    regionalColorVariation:
      "Clear-water fish can be pale with a crisp stripe; tannic or vegetated water produces darker green fish. Florida-strain and northern fish are not visually identical in all waters.",
    spawningColoration:
      "Nesting fish darken; this is not a targeting recommendation.",
    juvenileAppearance:
      "Young fish show a strong lateral stripe and a more proportionally large eye and mouth; they can be confused with spotted bass until jaw and dorsal notch are checked.",
    adultAppearance:
      "The overshot jaw plus nearly divided dorsal fins is the adult field picture.",
    sexualDimorphism:
      "Nesting males guard; sex is not a reliable color key for anglers.",
    similarSpecies: [
      {
        speciesId: "micropterus_punctulatus",
        name: "Spotted bass",
        distinction:
          "Spotted bass: jaw does not extend beyond the eye, dorsal fins are connected, rows of spots form stripes on the lower side, and a tooth patch is usually present on the tongue.",
      },
      {
        speciesId: "micropterus_dolomieu",
        name: "Smallmouth bass",
        distinction:
          "Smallmouth: jaw does not extend beyond the eye, vertical bars rather than a horizontal stripe, bronze-brown color, connected dorsals.",
      },
    ],
    averageAdultLength: "Common adults 12–18 in in many fisheries.",
    commonAnglingSize: "12–18 in.",
    typicalWeight: "1–4 lb in many waters; productive southern lakes produce larger averages.",
    maximumDocumentedSize:
      "Trophy fish regularly exceed 10 lb in Florida-strain and some southern fisheries; world-class sizes are documented in agency trophy programs. Northern-strain maxima are typically lower.",
    longevity: "Often 6–10 years; older fish occur in lightly exploited waters.",
    sources: [
      { label: "Texas Parks and Wildlife bass comparison and identification key", class: "agency", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/bass-identification" },
      { label: "Florida Museum largemouth bass species profile", class: "agency" },
      { label: "Heidinger largemouth life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "northern versus Florida-strain size table as a structured field",
    ],
  },
  {
    speciesId: "micropterus_dolomieu",
    status: "reviewed",
    regionalNames: ["smallie", "bronzeback", "brown bass"],
    bodyShape:
      "More cylindrical than largemouth; bronze rather than green; mouth moderate.",
    identificationTraits: [
      "TPWD: jaw does not extend beyond the back margin of the eye when the mouth is closed.",
      "Vertical barring along the sides rather than a single horizontal stripe.",
      "Brownish-green to bronze color; the white belly does not extend high on the sides.",
      "Spiny and soft dorsal fins connected (shallow notch).",
      "No rows of spots forming horizontal stripes on the lower side.",
    ],
    coloration:
      "Bronze, brown, or olive with darker vertical bars. Eyes often red-orange.",
    regionalColorVariation:
      "Clear, rocky rivers produce the classic bronzeback. Stained lakes can look darker and lose bar contrast.",
    spawningColoration:
      "Nesting males darken; not a targeting recommendation.",
    juvenileAppearance:
      "Strong vertical bars and a bronze cast even at small sizes; orange eyes develop early.",
    adultAppearance:
      "Bronze fish with vertical bars and a mouth that stops at the eye.",
    similarSpecies: [
      {
        speciesId: "micropterus_nigricans",
        name: "Largemouth bass",
        distinction:
          "Largemouth jaw extends well behind the eye; dorsal fins nearly separate; horizontal stripe rather than vertical bars.",
      },
      {
        speciesId: "micropterus_punctulatus",
        name: "Spotted bass",
        distinction:
          "Spotted bass have a more horizontal / blotched stripe and rows of spots on the lower side, plus a tongue tooth patch. They are not bronze-barred like smallmouth.",
      },
      {
        speciesId: "ambloplites_rupestris",
        name: "Rock bass",
        distinction:
          "Rock bass are deeper-bodied sunfish with red eyes and rows of dark spots on the sides, not a Micropterus profile.",
      },
    ],
    averageAdultLength: "Common adults 10–16 in.",
    commonAnglingSize: "11–17 in in many rivers and rocky lakes.",
    typicalWeight: "1–3 lb is typical; 4–5 lb is a large fish in most waters.",
    maximumDocumentedSize:
      "Fish over 6–7 lb are exceptional; agency trophy programs document the upper tail. Do not treat world-record size as a typical expectation.",
    longevity: "Often 6–12 years in northern waters.",
    sources: [
      { label: "Texas Parks and Wildlife bass comparison and identification key", class: "agency", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/bass-identification" },
      { label: "USGS / provincial smallmouth assessments", class: "agency" },
      { label: "Coble smallmouth biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "river versus reservoir mean-size split as a structured field",
    ],
  },
  {
    speciesId: "micropterus_punctulatus",
    status: "reviewed",
    regionalNames: ["kentucky bass", "spot", "spots"],
    bodyShape:
      "Intermediate between largemouth and smallmouth; more fusiform than largemouth, not bronze-barred.",
    identificationTraits: [
      "TPWD: jaw does not extend beyond the back margin of the eye when the mouth is closed.",
      "Irregular lateral stripe, more broken than in largemouth.",
      "Spots on scales form rows of stripes on the whitish belly area — the namesake character.",
      "Spiny and soft dorsal fins connected.",
      "A rough tooth patch is usually present on the tongue (sandpaper feel), unlike typical largemouth.",
    ],
    coloration:
      "Green to olive with a blotched lateral band and horizontal rows of spots below it on a pale lower side.",
    regionalColorVariation:
      "Highland-reservoir fish can look sleek and pelagic. Creek fish may be darker. Alabama bass and related forms are not this record.",
    juvenileAppearance:
      "Rows of spots on the lower side are often already visible; jaw and dorsal connection separate them from young largemouth.",
    adultAppearance:
      "A spotted, connected-dorsal black bass whose jaw stops at the eye.",
    similarSpecies: [
      {
        speciesId: "micropterus_nigricans",
        name: "Largemouth bass",
        distinction:
          "Largemouth: jaw past the eye, nearly divided dorsal fins, definite lateral stripe, usually no tongue tooth patch, no rows of spots on the lower side.",
      },
      {
        speciesId: "micropterus_dolomieu",
        name: "Smallmouth bass",
        distinction:
          "Smallmouth are bronze with vertical bars and lack the horizontal spot-rows on the lower side.",
      },
    ],
    averageAdultLength: "Common adults 10–16 in; often smaller-bodied than largemouth in the same reservoir.",
    commonAnglingSize: "10–15 in.",
    typicalWeight: "Often 1–2.5 lb; larger fish occur in highland reservoirs.",
    maximumDocumentedSize:
      "Agency trophy fish exceed typical angling size, but spotted bass do not match largemouth trophy mass. Alabama-bass complexes are excluded from this record.",
    sources: [
      { label: "Texas Parks and Wildlife bass comparison and identification key", class: "agency", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/bass-identification" },
      { label: "State spotted bass notes (KY, TN, AL, OK)", class: "agency" },
    ],
    ...R,
    gaps: [
      "Alabama bass / redeye complex comparison as its own reviewed record",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "morone_saxatilis",
    status: "reviewed",
    regionalNames: ["striper", "rockfish", "linesider"],
    bodyShape:
      "Elongate temperate bass; TPWD: body slender, depth less than 1/3 of length.",
    identificationTraits: [
      "TPWD: stripes distinct, several extending to the tail.",
      "TPWD: two distinct tooth patches near the midline toward the back of the tongue.",
      "Body more elongate than white bass, wiper, or white perch.",
      "Dorsal fins separate.",
      "Second anal spine shorter relative to the third than in white perch.",
    ],
    coloration:
      "Olive to steel-blue back, silvery sides, 7–8 continuous dark horizontal stripes.",
    regionalColorVariation:
      "Atlantic anadromous fish and landlocked reservoir fish share the same species identity; color is not a population key. RPC overlays handle system archetype separately.",
    spawningColoration:
      "No dramatic salmon-like dress. Spring fish can look fuller-bodied; this is not a targeting cue.",
    juvenileAppearance:
      "Young fish already show stripes; they can be confused with white bass and wipers until body depth and tongue patches are checked.",
    adultAppearance:
      "A long, striped Morone with two tongue tooth patches and stripes that continue to the tail.",
    similarSpecies: [
      {
        speciesId: "morone_chrysops",
        name: "White bass",
        distinction:
          "USFWS / TPWD: white bass have a single tongue tooth patch, a deeper body (depth more than 1/3 length), and stripes that are faint, with only one typically reaching the tail.",
      },
      {
        speciesId: "morone_hybrid_wiper",
        name: "Hybrid striped bass (wiper)",
        distinction:
          "TPWD: wipers have a deep body like white bass, usually broken stripes, and two tongue tooth patches that may be distinct or close together. Use the combination of characters; TPWD notes individual hybrids vary.",
      },
      {
        speciesId: "morone_americana",
        name: "White perch",
        distinction:
          "White perch lack distinct longitudinal stripes, are deeper-bodied, and have connected dorsal fins. They are not an elongate striped Morone.",
      },
      {
        speciesId: "morone_mississippiensis",
        name: "Yellow bass",
        distinction:
          "TPWD: yellow bass have joined dorsal fins, a silvery-yellow cast, stripes broken above the anal fin, and no midline tongue tooth patch.",
      },
    ],
    averageAdultLength: "Landlocked adults commonly 18–30 in; Atlantic fish span a wider range by stock and year class.",
    commonAnglingSize: "20–30 in in many reservoir fisheries; coastal fish vary widely by regulation and year class.",
    typicalWeight: "Landlocked fish often 4–12 lb; coastal fish vary with stock status.",
    maximumDocumentedSize:
      "Atlantic fish historically reached much larger sizes than typical landlocked fish. Do not apply one maximum across both life histories.",
    sources: [
      { label: "Texas Parks and Wildlife bass comparison and identification key", class: "agency", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/bass-identification" },
      { label: "USFWS white bass species account (striped bass / hybrid tongue-patch contrast)", class: "agency", url: "https://www.fws.gov/species/white-bass-morone-chrysops" },
      { label: "ASMFC / NOAA Atlantic striped bass life history", class: "agency" },
    ],
    ...R,
    gaps: [
      "Atlantic versus landlocked size table as a structured field",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "morone_chrysops",
    status: "reviewed",
    regionalNames: ["sand bass", "sandie", "stripes"],
    bodyShape:
      "Deep-bodied temperate bass; TPWD: body depth more than 1/3 of length.",
    identificationTraits: [
      "USFWS: distinguishable from striped bass and hybrids by a singular tooth patch on the tongue.",
      "TPWD: stripes faint, only one extending to the tail.",
      "Deep body relative to striped bass.",
      "Dorsal fins separate, unlike yellow bass and white perch.",
    ],
    coloration:
      "Silver with dark back and faint horizontal stripes; only the uppermost stripe typically reaches the tail.",
    spawningColoration:
      "No salmon-like dress. Spring fish may be fuller; not a targeting cue.",
    juvenileAppearance:
      "Young fish are already deep-bodied silvery Morone; tongue patch and stripe count separate them from stripers.",
    adultAppearance:
      "A deep, short Morone with one tongue patch and incomplete stripes.",
    similarSpecies: [
      {
        speciesId: "morone_saxatilis",
        name: "Striped bass",
        distinction:
          "Striped bass are more slender, have several stripes reaching the tail, and two distinct tongue tooth patches.",
      },
      {
        speciesId: "morone_hybrid_wiper",
        name: "Hybrid striped bass (wiper)",
        distinction:
          "Wipers also have a deep body but usually show broken, more distinct stripes and two tongue tooth patches.",
      },
      {
        speciesId: "morone_americana",
        name: "White perch",
        distinction:
          "White perch lack distinct stripes and have connected dorsal fins; they are not a striped open-water Morone.",
      },
      {
        speciesId: "morone_mississippiensis",
        name: "Yellow bass",
        distinction:
          "Yellow bass have joined dorsals, a yellow cast, stripes broken above the anal fin, and no midline tongue tooth patch.",
      },
    ],
    averageAdultLength: "USFWS common length about 12.5 in; maximum reported about 17.7 in.",
    commonAnglingSize: "10–15 in.",
    typicalWeight: "USFWS: commonly around 1 lb.",
    maximumDocumentedSize: "USFWS maximum recorded weight 6.8 lb.",
    longevity: "USFWS: juveniles may reach adulthood in about two years in southern climates, longer in the north.",
    sources: [
      { label: "USFWS white bass species account", class: "agency", url: "https://www.fws.gov/species/white-bass-morone-chrysops" },
      { label: "Texas Parks and Wildlife bass comparison and identification key", class: "agency", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/bass-identification" },
    ],
    ...R,
    gaps: [
      "northern versus southern mean longevity as a structured field",
    ],
  },
  {
    speciesId: "morone_americana",
    status: "reviewed",
    regionalNames: ["white perch", "silver perch"],
    bodyShape:
      "The deepest-bodied common Morone; more panfish-like than striped bass.",
    identificationTraits: [
      "No distinct continuous dark longitudinal stripes on the side (faint bars or a dusky mottling may be present).",
      "Dorsal fins connected or only narrowly separated — unlike striped bass and white bass.",
      "Second anal spine relatively long, approaching the third.",
      "Smaller adult size than striped bass, wiper, or many white bass.",
      "Native Atlantic coastal/estuarine fish; Great Lakes and inland occurrences are introduced.",
    ],
    coloration:
      "Olive to dark gray-green back, silvery sides, white belly. Sides may show faint pale bars but not the striped-bass line pattern.",
    regionalColorVariation:
      "Estuarine fish can look greener; inland lake fish more silver. Color is not a population overlay.",
    juvenileAppearance:
      "Young fish are deep-bodied and unstriped; they are often miscalled white bass in inland waters.",
    adultAppearance:
      "A deep, unstriped temperate bass with connected dorsals.",
    similarSpecies: [
      {
        speciesId: "morone_chrysops",
        name: "White bass",
        distinction:
          "White bass have separate dorsal fins and faint horizontal stripes with one stripe often reaching the tail, plus a single tongue tooth patch. White perch lack that striped pattern.",
      },
      {
        speciesId: "morone_saxatilis",
        name: "Striped bass",
        distinction:
          "Striped bass are elongate with several distinct stripes to the tail and two tongue tooth patches.",
      },
      {
        speciesId: "morone_hybrid_wiper",
        name: "Hybrid striped bass (wiper)",
        distinction:
          "Wipers show distinct, usually broken stripes and two tongue tooth patches on a deep body.",
      },
    ],
    averageAdultLength: "Common adults 8–12 in.",
    commonAnglingSize: "8–11 in in many inland and tidal fisheries.",
    typicalWeight: "Often 0.4–1.0 lb.",
    maximumDocumentedSize:
      "Fish over 15 in and 2 lb are large. Do not apply striped-bass size expectations to this species.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species white perch profile", class: "agency" },
      { label: "State temperate-bass identification literature (NY, MD, Great Lakes)", class: "agency" },
    ],
    ...R,
    gaps: [
      "tongue-patch character as a primary-source quote",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "morone_hybrid_wiper",
    status: "reviewed",
    regionalNames: ["wiper", "whiterock bass", "hybrid striper", "palmetto bass", "sunshine bass"],
    bodyShape:
      "Deep-bodied like white bass, not the slender striped-bass profile. TPWD: body depth more than 1/3 of length.",
    identificationTraits: [
      "Artificial white bass × striped bass hybrid; presence is a stocking fact, not a habitat inference.",
      "TPWD: stripes distinct, usually broken, several extending to the tail.",
      "TPWD: two tooth patches on the tongue; patches may be distinct or close together.",
      "TPWD: for hybrids, all characters should be considered together because individuals vary.",
      "Common crosses are functionally sterile; spring tributary movement is not evidence of a reproducing population.",
    ],
    coloration:
      "Silvery with a dark back and 7–8 stripes that are typically interrupted, especially below the lateral line.",
    juvenileAppearance:
      "Already striped and deep-bodied; easy to call a white bass or a small striper until tongue patches and stripe continuity are checked.",
    adultAppearance:
      "A deep Morone with broken stripes and two tongue patches, typically larger than white bass in the same water.",
    similarSpecies: [
      {
        speciesId: "morone_chrysops",
        name: "White bass",
        distinction:
          "White bass: one tongue tooth patch, faint stripes with only one usually reaching the tail, generally smaller.",
      },
      {
        speciesId: "morone_saxatilis",
        name: "Striped bass",
        distinction:
          "Striped bass: slender body, continuous stripes, two distinct tongue patches. Wipers are deeper-bodied with broken stripes.",
      },
      {
        speciesId: "morone_americana",
        name: "White perch",
        distinction:
          "White perch lack distinct stripes and have connected dorsal fins.",
      },
    ],
    averageAdultLength: "Common adults 16–24 in in many stocked reservoirs.",
    commonAnglingSize: "16–22 in.",
    typicalWeight: "Often 2–6 lb; larger fish occur in forage-rich reservoirs.",
    maximumDocumentedSize:
      "Agency trophy programs document fish well above typical angling size, still generally below the largest Atlantic striped bass.",
    sources: [
      { label: "Texas Parks and Wildlife bass comparison and identification key", class: "agency", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/bass-identification" },
      { label: "Missouri Department of Conservation hybrid striped bass field guide", class: "agency" },
      { label: "Kansas Department of Wildlife & Parks striped bass hybrid management plan", class: "agency" },
    ],
    ...R,
    gaps: [
      "palmetto versus sunshine cross as a structured field",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "morone_mississippiensis",
    status: "reviewed",
    regionalNames: ["yellow bass", "barfish", "streaker"],
    bodyShape: "A small, deep-bodied temperate bass, more compact than white bass.",
    identificationTraits: [
      "TPWD: dorsal fins joined.",
      "TPWD: stripes distinct and broken above the anal fin.",
      "TPWD: silvery yellow color.",
      "TPWD: no tooth patch near the midline toward the back of the tongue.",
      "Smaller than white bass, wiper, or striped bass in the same region.",
    ],
    coloration:
      "Silvery yellow with dark horizontal stripes that break up above the anal fin.",
    adultAppearance:
      "A small yellow-cast Morone with joined dorsals and broken lower stripes.",
    similarSpecies: [
      {
        speciesId: "morone_chrysops",
        name: "White bass",
        distinction:
          "White bass have separate dorsals, a single tongue tooth patch, and a silver rather than yellow cast. Only one white-bass stripe typically reaches the tail.",
      },
      {
        speciesId: "morone_saxatilis",
        name: "Striped bass",
        distinction:
          "Striped bass are much more elongate, have separate dorsals, two tongue patches, and continuous stripes.",
      },
    ],
    averageAdultLength: "Common adults 6–10 in.",
    commonAnglingSize: "7–11 in.",
    typicalWeight: "Often well under 1 lb.",
    maximumDocumentedSize:
      "Fish approaching 2 lb are large for the species. Do not apply white-bass or striper size expectations.",
    sources: [
      { label: "Texas Parks and Wildlife bass comparison and identification key", class: "agency", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/bass-identification" },
      { label: "Missouri Department of Conservation yellow bass field guide", class: "agency" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "coregonus_artedi",
    status: "reviewed",
    regionalNames: ["lake herring", "tullibee", "cisco"],
    bodyShape:
      "A slender coregonine whitefish with an adipose fin and relatively large eye.",
    identificationTraits: [
      "Minnesota DNR / North Dakota GF: mouth terminal — the lower jaw extends up to or beyond the tip of the snout.",
      "More slender, larger-eyed profile than lake whitefish.",
      "Typically smaller at adulthood than lake whitefish in the same waters.",
      "Adipose fin present (trout/salmon family), unlike mooneye.",
    ],
    coloration:
      "Silvery sides, green to blue-green or gray-green back, white belly. No salmon-red spawning dress.",
    spawningColoration:
      "Late-fall and winter spawners may show a darker back and fuller body; they do not turn red.",
    juvenileAppearance:
      "Small pelagic silvery coregonines; not a field split from young whitefish without the mouth character.",
    adultAppearance:
      "A terminal-mouthed, large-eyed whitefish, more herring-like than the blunt-snouted lake whitefish.",
    similarSpecies: [
      {
        speciesId: "coregonus_clupeaformis",
        name: "Lake whitefish",
        distinction:
          "Lake whitefish have a subterminal mouth: the snout overhangs the lower jaw. They are deeper-bodied and typically grow larger. Minnesota DNR treats snout position as the main distinguishing feature.",
      },
      {
        speciesId: "hiodon_tergisus",
        name: "Mooneye",
        distinction:
          "Mooneye lack an adipose fin, have a large silvery eye, and are not coregonines. Minnesota DNR notes the similarity in silver color and large eyes.",
      },
      {
        speciesId: "oncorhynchus_nerka_kokanee",
        name: "Kokanee",
        distinction:
          "Kokanee are Pacific salmon with a different anal-fin count and a red/green spawning dress; they are not terminal-mouthed whitefish.",
      },
    ],
    averageAdultLength: "Common inland and Great Lakes adults often 8–14 in; larger fish occur.",
    commonAnglingSize: "8–13 in, including many ice fisheries.",
    typicalWeight: "Often well under 2 lb.",
    maximumDocumentedSize:
      "Minnesota DNR: state-record cisco 5 lb 11.8 oz. Lake whitefish in the same waters grow larger.",
    sources: [
      { label: "Minnesota DNR cisco / lake whitefish / mooneye identification", class: "agency", url: "https://www.dnr.state.mn.us/areas/fisheries/baudette/whitefish.html" },
      { label: "North Dakota Game and Fish cisco vs lake whitefish identification", class: "agency", url: "https://gf.nd.gov/wildlife/id/cisco-vs-lake-whitefish" },
    ],
    ...R,
    gaps: [
      "Great Lakes versus inland mean-size table",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "coregonus_clupeaformis",
    status: "reviewed",
    regionalNames: ["humpback whitefish", "labrador whitefish", "whitefish"],
    bodyShape:
      "Deeper-bodied coregonine with a blunt snout and adipose fin; more 'whitefish' than 'herring' in profile.",
    identificationTraits: [
      "Minnesota DNR: snout overhangs the lower jaw (subterminal mouth).",
      "Smaller eye relative to cisco; deeper body.",
      "Typically grows larger than cisco in the same waters.",
      "Adipose fin present; this is not a mooneye.",
    ],
    coloration:
      "Olive to green-brown back, silvery sides, white belly. Adults can show a darker dorsal 'hump' impression.",
    spawningColoration:
      "Late-fall to early-winter spawners; no salmon-red dress.",
    adultAppearance:
      "A blunt-snouted, subterminal-mouthed whitefish, deeper than cisco.",
    similarSpecies: [
      {
        speciesId: "coregonus_artedi",
        name: "Cisco",
        distinction:
          "Cisco have a terminal mouth — lower jaw to or beyond the snout tip — and a more slender, large-eyed profile.",
      },
      {
        speciesId: "prosopium_williamsoni",
        name: "Mountain whitefish",
        distinction:
          "Mountain whitefish have a more pointed snout, smaller mouth, and are an interior river/lake Prosopium, not a Coregonus of the Great Lakes/boreal lakes.",
      },
      {
        speciesId: "hiodon_tergisus",
        name: "Mooneye",
        distinction:
          "Mooneye lack an adipose fin and have a very large silvery eye.",
      },
    ],
    averageAdultLength: "Common adults often 15–22 in in productive northern lakes.",
    commonAnglingSize: "16–22 in.",
    typicalWeight: "Often 1.5–4 lb.",
    maximumDocumentedSize:
      "Minnesota DNR: state-record lake whitefish 12 lb 4.5 oz (Leech Lake). Great Lakes commercial and assessment fish can exceed typical inland angling size.",
    sources: [
      { label: "Minnesota DNR cisco / lake whitefish / mooneye identification", class: "agency", url: "https://www.dnr.state.mn.us/areas/fisheries/baudette/whitefish.html" },
      { label: "North Dakota Game and Fish cisco vs lake whitefish identification", class: "agency", url: "https://gf.nd.gov/wildlife/id/cisco-vs-lake-whitefish" },
    ],
    ...R,
    gaps: [
      "Great Lakes versus inland mean-size and longevity table",
    ],
  },
  {
    speciesId: "hiodon_alosoides",
    status: "reviewed",
    regionalNames: ["gold eye", "winnipeg goldeye"],
    bodyShape:
      "Compressed, herring-like body with a large eye; no adipose fin. Keel along the belly.",
    identificationTraits: [
      "Golden iris — the namesake character.",
      "Dorsal fin usually 9–10 rays, originating opposite or behind the anal-fin origin.",
      "Ventral keel extends forward beyond the pelvic fins (fleshy keel from pectoral region to vent).",
      "Large eye with a tapetum, adapted to dim and turbid water.",
      "Lateral line present, unlike true herrings/shads.",
    ],
    coloration:
      "Blue-green to olive back, silvery-gold sides, pale belly. The gold iris is the field flash.",
    adultAppearance:
      "A gold-eyed, keeled, compressed river fish without an adipose fin.",
    similarSpecies: [
      {
        speciesId: "hiodon_tergisus",
        name: "Mooneye",
        distinction:
          "Mooneye: silvery-white iris, usually 11–12 dorsal rays set ahead of the anal origin, and a shorter ventral keel that does not extend to the pelvic fins. Hoover (USACE) and Page & Burr treat dorsal-ray count, keel length, and iris color as the field split.",
      },
      {
        speciesId: "coregonus_artedi",
        name: "Cisco",
        distinction:
          "Cisco have an adipose fin and lack the goldeye keel/iris combination.",
      },
    ],
    averageAdultLength: "Common adults often 12–16 in.",
    commonAnglingSize: "12–15 in.",
    typicalWeight: "Often 0.7–1.5 lb.",
    maximumDocumentedSize:
      "Fish over 2 lb are large. Minnesota DNR's listed mooneye record is not this species.",
    sources: [
      { label: "Fishes of Texas goldeye account (Page & Burr counts)", class: "agency" },
      { label: "Hoover juvenile goldeye identification (USACE / peer literature)", class: "peer_reviewed" },
      { label: "Government of Alberta goldeye species profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "hiodon_tergisus",
    status: "reviewed",
    regionalNames: ["moon eye", "toothed herring (misapplied)"],
    bodyShape:
      "Compressed, herring-like, often slightly deeper than goldeye; large silvery eye; no adipose fin.",
    identificationTraits: [
      "Silvery-white iris rather than gold.",
      "Dorsal fin usually 11–12 rays, originating ahead of the anal-fin origin.",
      "Ventral keel shorter — does not extend forward to the pelvic fins.",
      "Generally associated with clearer water than goldeye.",
    ],
    coloration:
      "Silver sides, darker back, large pale eye. No gold iris.",
    adultAppearance:
      "A large-eyed, un-adipose river/lake fish with a silver iris and a short keel.",
    similarSpecies: [
      {
        speciesId: "hiodon_alosoides",
        name: "Goldeye",
        distinction:
          "Goldeye: gold iris, 9–10 dorsal rays, keel extending beyond the pelvics, more turbidity-tolerant.",
      },
      {
        speciesId: "coregonus_artedi",
        name: "Cisco",
        distinction:
          "Cisco have an adipose fin and a terminal mouth without a hiodontid keel.",
      },
    ],
    averageAdultLength: "Common adults often 9–14 in.",
    commonAnglingSize: "10–13 in.",
    typicalWeight: "Often well under 1.5 lb.",
    maximumDocumentedSize:
      "Minnesota DNR: state-record mooneye 1 lb 15 oz (Minnesota River). This is not a goldeye maximum.",
    sources: [
      { label: "Hoover juvenile goldeye identification (goldeye vs mooneye key)", class: "peer_reviewed" },
      { label: "Minnesota DNR cisco / lake whitefish / mooneye identification", class: "agency", url: "https://www.dnr.state.mn.us/areas/fisheries/baudette/whitefish.html" },
      { label: "Ontario mooneye species profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "cyprinus_carpio",
    status: "reviewed",
    regionalNames: ["German carp", "common carp", "mirror carp (variant)", "leather carp (variant)"],
    bodyShape:
      "Heavy, deep-bodied cyprinid with a long dorsal fin and a serrated leading spine.",
    identificationTraits: [
      "Two barbels on each side of the upper jaw (four barbels total) — absent in buffalo.",
      "Long dorsal fin with a stout, serrated leading spine; anal fin also with a serrated spine.",
      "Large scales; mouth is inferior/subterminal but not a true sucker mouth.",
      "USGS NAS treats this as an introduced Eurasian species, not a native buffalo.",
    ],
    coloration:
      "Brassy to olive-brown back and sides, yellow to cream belly. Wild fish are fully scaled; mirror and leather variants occur in some fisheries.",
    spawningColoration:
      "Spring fish in flooded vegetation can look darker and fuller; not a targeting cue.",
    juvenileAppearance:
      "Young carp already show barbels; they can be confused with small buffalo only if barbels are not checked.",
    adultAppearance:
      "A barbelled, large-scaled, saw-spined cyprinid — not a sucker.",
    similarSpecies: [
      {
        speciesId: "ictiobus_cyprinellus",
        name: "Bigmouth buffalo",
        distinction:
          "Bigmouth buffalo have no barbels, a large oblique mouth, and a long dorsal without carp's serrated spine-and-barbel combination. They are native catostomids, not cyprinids.",
      },
      {
        speciesId: "ictiobus_bubalus",
        name: "Smallmouth buffalo",
        distinction:
          "Smallmouth buffalo have a downward sucker mouth, no barbels, and a more subterminal feeding posture. They are not carp.",
      },
    ],
    averageAdultLength: "Common adults 18–28 in in many North American waters.",
    commonAnglingSize: "18–26 in.",
    typicalWeight: "Often 5–15 lb in established waters.",
    maximumDocumentedSize:
      "Fish well over 20–30 lb occur in productive systems. USGS NAS and state records document the upper tail; do not treat trophy size as typical.",
    sources: [
      { label: "USGS NAS carp fact sheet", class: "agency" },
      { label: "Balon carp domestication / biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "ictiobus_cyprinellus",
    status: "reviewed",
    regionalNames: ["buffalo fish", "bigmouth", "gourdhead"],
    bodyShape:
      "Deep, hump-backed catostomid with a large, oblique, terminal-to-upturned mouth — the most plankton-oriented buffalo.",
    identificationTraits: [
      "No barbels — immediately separates buffalo from common carp.",
      "Large, oblique mouth; the gape is much more terminal than in smallmouth buffalo.",
      "Long dorsal fin without carp's pair of fleshy barbels and without the same serrated-spine cyprinid look.",
      "Native sucker-family fish; USGS species profile.",
      "Exceptionally long-lived; Lackmann et al. documented centenarian fish.",
    ],
    coloration:
      "Gray to olive or bronze back, paler sides, light belly. Not the brassy carp gold.",
    adultAppearance:
      "A deep, barbel-less buffalo with a large oblique mouth.",
    similarSpecies: [
      {
        speciesId: "cyprinus_carpio",
        name: "Common carp",
        distinction:
          "Carp have four barbels, a serrated dorsal spine, and large cyprinid scales. Buffalo have none of the barbels.",
      },
      {
        speciesId: "ictiobus_bubalus",
        name: "Smallmouth buffalo",
        distinction:
          "Smallmouth buffalo have a smaller, more subterminal/downward sucker mouth and a stronger benthic identity. Bigmouth is the plankton-capable buffalo.",
      },
    ],
    averageAdultLength: "Common adults often 18–30 in.",
    commonAnglingSize: "20–28 in where harvest is legal.",
    typicalWeight: "Often 5–15 lb.",
    maximumDocumentedSize:
      "Very large, long-lived fish occur. Longevity research (Lackmann et al.) is the reviewed authority for age potential, not a harvest recommendation.",
    longevity:
      "Validated ages exceeding 100 years in some populations (Lackmann et al.). Recruitment can be episodic; abundance is not proof of resilience.",
    sources: [
      { label: "USGS Bigmouth Buffalo species profile", class: "agency" },
      { label: "Lackmann et al. validated centenarian longevity research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "black buffalo (Ictiobus niger) comparison as its own reviewed record",
    ],
  },
  {
    speciesId: "ictiobus_bubalus",
    status: "reviewed",
    regionalNames: ["smallmouth buff", "razorback buffalo (misapplied)", "buffalo sucker"],
    bodyShape:
      "Deep catostomid with a more conical head and a small, downward, subterminal sucker mouth.",
    identificationTraits: [
      "No barbels.",
      "Mouth small and subterminal / inferior — clearly a sucker feeding posture, not the large oblique gape of bigmouth buffalo.",
      "Body often appears more 'keel-backed' than carp.",
      "Native large-river/reservoir buffalo of the Mississippi and Gulf-slope drainages.",
    ],
    coloration:
      "Olive-bronze to dark gray back, paler below. Not carp-gold.",
    adultAppearance:
      "A barbel-less, subterminal-mouthed buffalo, more benthic in look than bigmouth.",
    similarSpecies: [
      {
        speciesId: "ictiobus_cyprinellus",
        name: "Bigmouth buffalo",
        distinction:
          "Bigmouth buffalo have a large oblique mouth and a more plankton-capable feeding identity.",
      },
      {
        speciesId: "cyprinus_carpio",
        name: "Common carp",
        distinction:
          "Carp have barbels and a serrated dorsal spine. Smallmouth buffalo do not.",
      },
    ],
    averageAdultLength: "Common adults often 16–26 in.",
    commonAnglingSize: "18–24 in where harvest is legal.",
    typicalWeight: "Often 4–12 lb.",
    maximumDocumentedSize:
      "Large multi-decade fish occur. USGS demographic work is the reviewed authority for longevity, not a size-to-catch claim.",
    longevity: "Multi-decade longevity documented in USGS age-validation / demographic research.",
    sources: [
      { label: "Texas Parks and Wildlife smallmouth buffalo species account", class: "agency" },
      { label: "USGS smallmouth buffalo age-validation research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "black buffalo comparison as its own reviewed record",
    ],
  },
  {
    speciesId: "lepisosteus_osseus",
    status: "reviewed",
    regionalNames: ["needlenose gar", "longnose", "billy gar (misapplied)"],
    bodyShape:
      "Torpedo-shaped gar with ganoid scales; snout extremely long and narrow.",
    identificationTraits: [
      "Florida Museum: snout more than twice the length of the rest of the head.",
      "A single row of teeth in the upper jaw — not the alligator gar's double row.",
      "TPWD: much longer, narrower snout than other gars; sometimes called needlenose.",
      "Kentucky DFWR: can grow to about 6 ft.",
    ],
    coloration:
      "Olive to brown back, paler below; dark spots typically on the unpaired fins and often the posterior body.",
    juvenileAppearance:
      "Young fish already show the needle snout; they are not easily confused with alligator gar if snout proportion is checked.",
    adultAppearance:
      "A long, needle-snouted gar with one row of upper-jaw teeth.",
    similarSpecies: [
      {
        speciesId: "atractosteus_spatula",
        name: "Alligator gar",
        distinction:
          "Alligator gar have a short, broad, alligator-like snout and two rows of teeth in the upper jaw. For fish of the same length they are much wider (TPWD).",
      },
      {
        speciesId: "lepisosteus_oculatus",
        name: "Spotted gar",
        distinction:
          "Spotted gar have a much shorter snout and dark spots on the head, body, and fins.",
      },
      {
        speciesId: "lepisosteus_platostomus",
        name: "Shortnose gar",
        distinction:
          "Shortnose gar have a short, wide snout and lack the needle profile. They also lack the heavy head spotting of spotted gar.",
      },
    ],
    averageAdultLength: "Common adults often 2–4 ft.",
    commonAnglingSize: "24–48 in.",
    typicalWeight: "Often 5–20 lb.",
    maximumDocumentedSize:
      "TPWD: adults can reach 6 ft and up to 80 lb. Kentucky DFWR cites about 6 ft and 50 lb as a working upper description.",
    sources: [
      { label: "Texas Parks and Wildlife how to identify alligator gar (gar comparison)", class: "agency", url: "https://tpwd.texas.gov/fishboat/fish/management/alligator-gar/identify-gar.phtml" },
      { label: "Florida Museum longnose gar species profile", class: "agency", url: "https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/longnose-gar/" },
      { label: "Kentucky Department of Fish & Wildlife gar family key", class: "agency" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "lepisosteus_oculatus",
    status: "reviewed",
    regionalNames: ["spotted gar"],
    bodyShape:
      "A shorter-snouted gar than longnose; still elongate with ganoid scales.",
    identificationTraits: [
      "TPWD: dark spots on the head, body, and fins — the easiest adult field mark among common gars.",
      "Snout much shorter than longnose; not alligator-broad.",
      "One row of upper-jaw teeth (not alligator gar).",
      "TPWD: juveniles of alligator gar can be confused with spotted gar without close examination.",
    ],
    coloration:
      "Olive to brown with distinct dark spots on head, body, and fins over a paler ground.",
    juvenileAppearance:
      "Already spotted; TPWD warns that juvenile alligator gar can resemble spotted gar until snout breadth and tooth rows are checked.",
    adultAppearance:
      "A moderately short-snouted gar with spots on the head as well as the body.",
    similarSpecies: [
      {
        speciesId: "lepisosteus_platostomus",
        name: "Shortnose gar",
        distinction:
          "TPWD: shortnose gar are similar in size but lack dark spots on the top of the head and paired fins.",
      },
      {
        speciesId: "lepisosteus_osseus",
        name: "Longnose gar",
        distinction:
          "Longnose snout is more than twice the rest of the head; spotted gar is not needle-faced.",
      },
      {
        speciesId: "atractosteus_spatula",
        name: "Alligator gar",
        distinction:
          "Alligator gar: broad alligator snout, two tooth rows, much heavier body. Juveniles are the confusion risk, not typical adults.",
      },
    ],
    averageAdultLength: "Common adults often 18–30 in.",
    commonAnglingSize: "20–32 in.",
    typicalWeight: "Often 2–8 lb.",
    maximumDocumentedSize:
      "TPWD: reaching just under four feet and about 15 lb. Kentucky DFWR: usually less than 3 ft and 5–10 lb as a typical upper description.",
    sources: [
      { label: "Texas Parks and Wildlife how to identify alligator gar (gar comparison)", class: "agency", url: "https://tpwd.texas.gov/fishboat/fish/management/alligator-gar/identify-gar.phtml" },
      { label: "Texas Parks and Wildlife spotted gar account", class: "agency" },
      { label: "Kentucky Department of Fish & Wildlife gar family key", class: "agency" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "lepisosteus_platostomus",
    status: "reviewed",
    regionalNames: ["shortnose", "billy gar"],
    bodyShape:
      "A short, wide-snouted gar; more compact than longnose, slimmer than alligator.",
    identificationTraits: [
      "Snout short and wide, but not the heavy alligator profile.",
      "TPWD: lacks dark spots on the top of the head and paired fins (the split from spotted gar).",
      "One row of upper-jaw teeth.",
      "More turbidity-tolerant than longnose in large-river literature.",
    ],
    coloration:
      "Olive to brown, paler below; spotting is weaker on the head and paired fins than in spotted gar.",
    adultAppearance:
      "A short-snouted, relatively unspotted-headed gar of large rivers and backwaters.",
    similarSpecies: [
      {
        speciesId: "lepisosteus_oculatus",
        name: "Spotted gar",
        distinction:
          "Spotted gar have dark spots on the head, body, and fins. Shortnose lack those head and paired-fin spots.",
      },
      {
        speciesId: "atractosteus_spatula",
        name: "Alligator gar",
        distinction:
          "Alligator gar are far heavier, with a broader snout and two upper-jaw tooth rows.",
      },
      {
        speciesId: "lepisosteus_osseus",
        name: "Longnose gar",
        distinction:
          "Longnose snout is needle-like and more than twice the rest of the head.",
      },
    ],
    averageAdultLength: "Common adults often 18–28 in.",
    commonAnglingSize: "20–30 in.",
    typicalWeight: "Often 2–8 lb.",
    maximumDocumentedSize:
      "TPWD: similar to spotted gar in size and weight (spotted gar just under four feet / about 15 lb). Kentucky DFWR: usually less than 3 ft and 5–10 lb.",
    sources: [
      { label: "Texas Parks and Wildlife how to identify alligator gar (gar comparison)", class: "agency", url: "https://tpwd.texas.gov/fishboat/fish/management/alligator-gar/identify-gar.phtml" },
      { label: "Texas Parks and Wildlife shortnose gar species account", class: "agency" },
      { label: "Missouri Department of Conservation shortnose gar field guide", class: "agency" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "atractosteus_spatula",
    status: "reviewed",
    regionalNames: ["gator gar", "giant gar"],
    bodyShape:
      "The largest North American gar: heavy, broad-headed, ganoid-scaled, with an alligator-like snout.",
    identificationTraits: [
      "TPWD: distinct short, wide snout, alligator-like from above; much wider than longnose at the same length.",
      "Two rows of teeth in the upper jaw — unique among the common U.S. gars.",
      "FWC: torpedo body, diamond ganoid scales, fins set far back, rounded caudal fin.",
      "TPWD: juveniles can be confused with spotted gar without close examination.",
    ],
    coloration:
      "FWC: brown to olive with a paler underside (countershading).",
    juvenileAppearance:
      "Young fish can look spotted; tooth rows and snout breadth, not spots alone, separate them from spotted gar (TPWD).",
    adultAppearance:
      "A heavy, broad-snouted gar that does not look needle-faced.",
    similarSpecies: [
      {
        speciesId: "lepisosteus_osseus",
        name: "Longnose gar",
        distinction:
          "Longnose: needle snout more than twice the rest of the head, one tooth row, slimmer body.",
      },
      {
        speciesId: "lepisosteus_oculatus",
        name: "Spotted gar",
        distinction:
          "Spotted gar are much smaller as adults, with spots on the head/body/fins and one tooth row. Juvenile alligator gar are the confusion risk.",
      },
      {
        speciesId: "lepisosteus_platostomus",
        name: "Shortnose gar",
        distinction:
          "Shortnose are similar in snout shortness only at a glance; they lack the mass, alligator head, and double tooth row.",
      },
    ],
    averageAdultLength: "Adults of several feet are typical where the species persists; this is not a panfish-scale gar.",
    commonAnglingSize: "4–6 ft in fisheries where harvest is legal and populations persist.",
    typicalWeight: "Tens to more than 100 lb for large adults; highly system-dependent.",
    maximumDocumentedSize:
      "TPWD: up to 10 ft and over 300 lb; Texas rod-and-reel record 279 lb; cited world record 327 lb. FWC: 8 ft and over 300 lb. Kentucky DFWR: to 9 ft and 300 lb. Use as documented maxima, not a typical fish.",
    sources: [
      { label: "Texas Parks and Wildlife how to identify alligator gar", class: "agency", url: "https://tpwd.texas.gov/fishboat/fish/management/alligator-gar/identify-gar.phtml" },
      { label: "Florida Fish and Wildlife Conservation Commission alligator gar profile", class: "agency", url: "https://myfwc.com/wildlifehabitats/profiles/freshwater/alligator-gar/" },
      { label: "USFWS All About Alligator Gar", class: "agency" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "ameiurus_nebulosus",
    status: "reviewed",
    regionalNames: ["hornpout", "mudcat", "brown cat"],
    bodyShape:
      "Stocky ictalurid with a squarish to slightly notched tail; no deeply forked caudal like channel catfish.",
    identificationTraits: [
      "Dark (dusky to black) chin barbels — not the white chin barbels of yellow bullhead.",
      "Mottled brown to olive-brown sides; the mottling is the practical split from black bullhead.",
      "Caudal fin square to slightly notched.",
      "Pectoral spines strongly barbed (Noble / regional keys), unlike the weakly barbed black bullhead.",
      "USGS NAS is a reviewed introduction/range source.",
    ],
    coloration:
      "Yellow-brown to dark brown, typically mottled or clouded, with a paler belly.",
    juvenileAppearance:
      "Young fish already show mottling and dark chin barbels; they are not channel-catforktails.",
    adultAppearance:
      "A mottled, dark-chinned, square-tailed bullhead.",
    similarSpecies: [
      {
        speciesId: "ameiurus_melas",
        name: "Black bullhead",
        distinction:
          "Black bullhead: dark chin barbels like brown, but body usually unmottled dark, and pectoral spines weakly barbed/almost smooth. Tail slightly notched.",
      },
      {
        speciesId: "ameiurus_natalis",
        name: "Yellow bullhead",
        distinction:
          "Yellow bullhead: white or cream chin barbels, yellowish-olive often mottled body, tail not notched and may be slightly rounded (TPWD).",
      },
      {
        speciesId: "ictalurus_punctatus",
        name: "Channel catfish",
        distinction:
          "Channel catfish have a deeply forked tail and, except in some dark individuals, a more elongate spotted body. They are not bullheads.",
      },
    ],
    averageAdultLength: "Common adults often 8–14 in.",
    commonAnglingSize: "8–12 in.",
    typicalWeight: "Often 0.5–1.5 lb.",
    maximumDocumentedSize:
      "Fish of several pounds occur. Do not apply channel-catfish size expectations.",
    sources: [
      { label: "USGS Nonindigenous Aquatic Species brown bullhead profile", class: "agency" },
      { label: "Noble Research Institute bullhead identification notes", class: "synthesis" },
    ],
    ...R,
    gaps: [
      "anal-ray count as a structured primary-source field",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "ameiurus_melas",
    status: "reviewed",
    regionalNames: ["polliwog", "chucklehead cat"],
    bodyShape:
      "Stocky bullhead with a slightly notched tail; TPWD notes Ameiurus refers to that slight caudal notch.",
    identificationTraits: [
      "TPWD: chin barbels dark or black, never white.",
      "TPWD: typically black to greenish-black on the back, white on the belly; in muddy water the back may be yellowish-brown.",
      "Body generally unmottled compared with brown bullhead.",
      "Pectoral spines weakly barbed / almost smooth (Noble / regional keys), unlike brown and yellow.",
      "Caudal slightly notched.",
    ],
    coloration:
      "Dark olive-black to yellowish-brown in turbid water; belly paler. Chin barbels remain dark.",
    adultAppearance:
      "A dark-chinned, usually unmottled bullhead with a slightly notched tail.",
    similarSpecies: [
      {
        speciesId: "ameiurus_nebulosus",
        name: "Brown bullhead",
        distinction:
          "Brown bullhead are mottled and have strongly barbed pectoral spines. Both have dark chin barbels.",
      },
      {
        speciesId: "ameiurus_natalis",
        name: "Yellow bullhead",
        distinction:
          "Yellow bullhead have white chin barbels and a square to slightly rounded, un-notched tail (TPWD).",
      },
    ],
    averageAdultLength: "Common adults often 8–12 in.",
    commonAnglingSize: "8–11 in.",
    typicalWeight: "Often 0.4–1.2 lb.",
    maximumDocumentedSize:
      "Fish of a few pounds occur. TPWD treats them as typically smaller than important game catfishes.",
    sources: [
      { label: "Texas Parks and Wildlife black bullhead species account", class: "agency", url: "https://tpwd.texas.gov/huntwild/wild/species/bigfish/" },
      { label: "Washington Department of Fish and Wildlife black bullhead sportfish account", class: "agency" },
    ],
    ...R,
    gaps: [
      "anal-ray count as a structured primary-source field",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "ameiurus_natalis",
    status: "reviewed",
    regionalNames: ["yellow bull", "mudcat", "chucklehead", "polliwog", "butter cat"],
    bodyShape:
      "Stocky bullhead; TPWD: tail is not notched and may be slightly rounded.",
    identificationTraits: [
      "TPWD: chin barbels white — the most reliable split from brown and black bullhead.",
      "TPWD: light yellow to olive-green on the back, often somewhat mottled; belly yellowish to white.",
      "TPWD: anal fin with 23–27 rays.",
      "Caudal square to slightly rounded, not notched.",
      "Pectoral spines strongly barbed (Noble / regional keys).",
    ],
    coloration:
      "Yellow to olive-green, often mottled, with a yellowish or white belly and white chin barbels.",
    adultAppearance:
      "A pale-chinned, yellowish bullhead with an un-notched tail.",
    similarSpecies: [
      {
        speciesId: "ameiurus_nebulosus",
        name: "Brown bullhead",
        distinction:
          "Brown bullhead have dark chin barbels and a mottled brown body; tail square to slightly notched.",
      },
      {
        speciesId: "ameiurus_melas",
        name: "Black bullhead",
        distinction:
          "Black bullhead have dark chin barbels and a usually unmottled dark body; caudal slightly notched.",
      },
      {
        speciesId: "ameiurus_catus",
        name: "White catfish",
        distinction:
          "White catfish are a larger-bodied Ameiurus with a moderately forked tail and a pale-to-gray look; they are not a yellow-barbel pond bullhead.",
      },
    ],
    averageAdultLength: "Common adults often 8–14 in.",
    commonAnglingSize: "8–12 in.",
    typicalWeight: "Often 0.5–1.5 lb.",
    maximumDocumentedSize:
      "TPWD: some individuals may exceed four pounds; largest reported in Texas 5.59 lb. TPWD notes they rarely achieve edible size as a typical expectation — that is a size note, not a consumption-safety claim.",
    sources: [
      { label: "Texas Parks and Wildlife yellow bullhead species account", class: "agency", url: "https://tpwd.texas.gov/huntwild/wild/species/ybh/" },
      { label: "Noble Research Institute bullhead identification notes", class: "synthesis" },
    ],
    ...R,
    gaps: [
      "longevity as a structured field",
    ],
  },
];
