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
      {
        speciesId: "salvelinus_fontinalis",
        name: "Brook trout",
        distinction:
          "Brook trout are char: worm-like vermiculations on the back, red spots with blue halos, a square tail, and white-then-black leading edges on the lower fins. Rainbows have a spotted tail, a pink lateral band, and lack those vermiculations.",
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
  {
    speciesId: "salmo_trutta",
    status: "reviewed",
    regionalNames: ["brownie", "german brown", "browns"],
    bodyShape:
      "Trout fusiform body, often slightly deeper than a rainbow of the same length. Caudal fin square to shallowly forked.",
    identificationTraits: [
      "Caudal fin is largely unspotted — a plain tail — unlike rainbow and cutthroat, whose tails carry black spots.",
      "Sides show a mix of dark spots and red-to-orange spots, the red spots commonly ringed by pale halos.",
      "Dark spots typically mark the operculum / gill cover.",
      "Adipose and anal fins are often orange or yellow-tinted; there is no pink lateral stripe.",
      "Maxillary commonly reaches past the eye in adults.",
    ],
    coloration:
      "Golden-brown to olive back and sides, creamy or yellow belly. Spotting is coarser than a rainbow and includes the red haloed spots that give the species its field look.",
    regionalColorVariation:
      "Peaty or stained water often produces deeper gold. Lake and sea-run fish can be silvery until handled. Local spotting pattern is population-specific and is not a subspecies key in this catalog.",
    spawningColoration:
      "Fall spawners intensify gold, orange, and the kype on males. That color change is biology, not a targeting cue.",
    juvenileAppearance:
      "Parr marks along the side; red spotting develops with age. Juveniles can be confused with other salmonid parr until the unspotted tail and haloed red spots are clear.",
    adultAppearance:
      "A golden-to-olive spotted trout with a plain tail and mixed black and haloed-red spotting. Large fish may look more brassy or silvery in lakes.",
    sexualDimorphism:
      "Breeding males develop a stronger kype and deeper color. Size overlap is large; sex is not a field ID key.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows have a pink-to-red lateral stripe and black spots on the caudal fin. Browns have a plain tail, haloed red spots, and no pink stripe.",
      },
      {
        speciesId: "salvelinus_fontinalis",
        name: "Brook trout",
        distinction:
          "Brook trout are char with worm-like vermiculations on the back, red spots with blue halos, a square tail, and white-then-black leading edges on the lower fins. Browns lack vermiculations and have a spotted-side / plain-tail trout look.",
      },
      {
        speciesId: "salmo_salar_landlocked",
        name: "Landlocked Atlantic salmon",
        distinction:
          "Landlocked Atlantic salmon have a more forked tail, smaller spots, and a different body language in lakes. They are a separate catalog record, not a large brown.",
      },
      {
        name: "Tiger trout (brown × brook hybrid)",
        distinction:
          "Tiger trout show worm-like vermiculations wrapping onto the sides without the brook’s blue-haloed red spots. Treat as a hybrid; do not force the fish into either parent record.",
      },
    ],
    averageAdultLength: "Stream adults commonly 10–16 in; many fertile rivers and lakes produce 16–22 in fish.",
    commonAnglingSize: "12–18 in in most inland fisheries.",
    typicalWeight: "Often 0.75–3 lb in streams; large piscivorous fish are much heavier.",
    maximumDocumentedSize:
      "Large lake and tailwater fish far exceed typical stream size. Continent-wide maxima are fishery-specific and are not a single catalog number.",
    longevity: "Commonly 5–8 years in inland waters; older fish occur in some lakes and cold tailwaters.",
    sources: [
      { label: "USGS / state brown trout habitat notes", class: "agency" },
      { label: "Elliott thermal biology of brown trout", class: "peer_reviewed" },
      { label: "State inland trout identification keys (unspotted caudal, haloed red spots, opercular spotting)", class: "agency" },
    ],
    ...R,
    gaps: [
      "sea-run vs inland color maps as a structured field",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "salvelinus_fontinalis",
    status: "reviewed",
    regionalNames: ["brookie", "speckled trout", "squaretail", "speckled"],
    bodyShape:
      "Char body, typically deeper than a slim rainbow of the same length. Caudal fin square or only slightly emarginate — the squaretail name.",
    identificationTraits: [
      "Worm-like pale vermiculations on the olive-to-green back and upper sides. CDFW: the only trout in California with this maze pattern.",
      "Red spots along the sides, commonly ringed by blue halos, on an olive-to-orange flank.",
      "Pectoral, pelvic, and anal fins with a white leading edge, then a black streak, then orange or red — a char fin recipe, not a trout stripe.",
      "Caudal fin square to barely notched, not the deep fork of lake trout.",
      "Maxillary typically extends past the eye.",
    ],
    coloration:
      "Olive-green back with vermiculations, flanks olive to orange-red with haloed red spots, milky or cream belly. Lower fins orange or red with the white-then-black leading edge.",
    regionalColorVariation:
      "High-elevation western introductions can look paler. Native eastern fish often show the strongest orange. Hatchery fish may be duller but still carry vermiculations and the fin recipe.",
    spawningColoration:
      "USFWS: as spawning approaches, colors intensify, especially in males whose flanks and belly become orange-red with a dark lateral stripe. That is biology, not a targeting cue.",
    juvenileAppearance:
      "Parr marks plus developing vermiculations. The white fin edges appear early and are a better juvenile key than adult orange.",
    adultAppearance:
      "A square-tailed char with vermiculated back, haloed red spots, and white-black-orange lower fins.",
    sexualDimorphism:
      "Spawning males deepen orange-red and the dark lateral stripe. Size overlap is large.",
    similarSpecies: [
      {
        speciesId: "salmo_trutta",
        name: "Brown trout",
        distinction:
          "Browns have a plain, unspotted tail, haloed red-and-black side spots, and no vermiculations or white-black-orange fin sandwich. Brook trout are char.",
      },
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows have a pink lateral band and a spotted tail. They lack vermiculations and the char fin recipe.",
      },
      {
        speciesId: "salvelinus_namaycush",
        name: "Lake trout",
        distinction:
          "Lake trout have light spots on a dark body and a deeply forked tail. They lack brook vermiculations and the blue-haloed red side spots.",
      },
      {
        speciesId: "salvelinus_confluentus",
        name: "Bull trout",
        distinction:
          "Bull trout are a conservation-sensitive char with a larger head, paler spots, and no brook vermiculation maze. They remain a separate, fail-closed record.",
      },
      {
        speciesId: "salvelinus_alpinus",
        name: "Arctic char",
        distinction:
          "Arctic char lack the brook vermiculation maze and are a northern/lake record. Do not collapse the two chars.",
      },
      {
        name: "Splake (brook × lake trout hybrid)",
        distinction:
          "Splake can mix a slightly forked tail with intermediate spotting. Treat as a hybrid; do not force either parent record.",
      },
    ],
    averageAdultLength: "Wild stream adults commonly 6–12 in; pond and lake fish 10–16 in.",
    commonAnglingSize: "7–12 in in most small-stream fisheries.",
    typicalWeight: "Often well under 1 lb in streams; larger pond fish occur where summer temperatures allow.",
    maximumDocumentedSize:
      "Large lake and pond fish exceed typical stream size. Small-stream maxima are not a continent-wide number.",
    longevity: "Often 3–5 years in streams; older fish occur in cold lakes.",
    sources: [
      { label: "U.S. Fish and Wildlife Service brook trout species profile", class: "agency", url: "https://www.fws.gov/species/brook-trout-salvelinus-fontinalis" },
      { label: "California DFW brook trout identification (vermiculations, white fin edges, maxillary)", class: "agency", url: "https://wildlife.ca.gov/Fishing/Inland/Brook-Trout" },
      { label: "Raleigh habitat suitability (brook trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "eastern native vs western introduced color tables",
      "splake meristics as a structured hybrid key",
    ],
  },
  {
    speciesId: "salvelinus_namaycush",
    status: "reviewed",
    regionalNames: ["laker", "mackinaw", "togue", "grey trout"],
    bodyShape:
      "Elongate char body with a long head. Caudal fin deeply forked, lobes of similar size — the primary field split from brook trout.",
    identificationTraits: [
      "Michigan DNR: light spots on a dark gray-to-black background, progressively paler toward a white belly.",
      "Tail deeply forked with equal upper and lower lobes. Brook trout are square-tailed.",
      "Lower fins often orange to orange-red with a white leading edge; the anal fin has 8–10 rays.",
      "Back is dark with a dorsal and adipose fin; it does not carry brook-style vermiculations or blue-haloed red side spots.",
      "Stillwater specialist in this catalog; river-current trout keys do not apply.",
    ],
    coloration:
      "Dark olive, gray, or nearly black back and sides with pale spots; white belly. Fins may show orange with a white leading edge.",
    regionalColorVariation:
      "Great Lakes fish are often more silvery-gray. Inland lake fish can be darker. Siscowet and other deep-water forms are not separate catalog records and should not be forced from a photograph.",
    spawningColoration:
      "Fall spawners may darken. Color change on rocky spawning substrate is biology, not a targeting cue.",
    juvenileAppearance:
      "Younger fish already show light spots on a dark ground and a forked tail. They are not vermiculated brook parr.",
    adultAppearance:
      "A deeply forked, light-spotted char of cold lakes. Large adults look more pike-like in the head than a stream trout.",
    sexualDimorphism:
      "Males may darken toward spawning. Size overlap is large; sex is not a field ID key.",
    similarSpecies: [
      {
        speciesId: "salvelinus_fontinalis",
        name: "Brook trout",
        distinction:
          "Brook trout have vermiculations, blue-haloed red spots, and a square tail. Lake trout have light spots on dark and a deep fork.",
      },
      {
        speciesId: "salmo_salar_landlocked",
        name: "Landlocked Atlantic salmon",
        distinction:
          "Landlocked Atlantic salmon have a different spotting language (x-marks / sparse dark spots) and are Salmo, not a pale-spotted char. Forked tails overlap; spotting and mouth do not.",
      },
      {
        speciesId: "salvelinus_alpinus",
        name: "Arctic char",
        distinction:
          "Arctic char have fewer, larger cream-to-orange spots, a slimmer caudal peduncle, and a gold-to-rose spawning dress. Lake trout have many small light spots on a dark body. ADF&G treats Alaska Arctic char as lake-resident; do not collapse the two lake chars.",
      },
      {
        speciesId: "coregonus_clupeaformis",
        name: "Lake whitefish",
        distinction:
          "Lake whitefish are coregonines with an overhanging snout, silvery unspotted sides, and a terminal-to-inferior mouth — not a spotted char.",
      },
      {
        name: "Splake (brook × lake trout hybrid)",
        distinction:
          "Splake tails are intermediate and spotting can mix both parents. Do not force the hybrid into either char record.",
      },
    ],
    averageAdultLength: "Inland-lake adults commonly 18–26 in; Great Lakes fish are often larger.",
    commonAnglingSize: "20–30 in in many inland and Great Lakes fisheries.",
    typicalWeight: "Often 3–8 lb inland; Great Lakes fish commonly heavier.",
    maximumDocumentedSize:
      "Large Great Lakes and big-lake fish far exceed inland pond size. Maxima are waterbody-specific.",
    longevity: "Slow-growing and long-lived relative to stream trout; decades are documented in some northern lakes.",
    sources: [
      { label: "Michigan DNR lake trout species account (forked tail, light spots, white fin edges, adult piscivory)", class: "agency", url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout" },
      { label: "Great Lakes / provincial lake trout assessments", class: "agency" },
      { label: "Martin & Olver lake trout biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "siscowet / lean / inland morphometrics as structured forms",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "oncorhynchus_mykiss_steelhead",
    status: "reviewed",
    regionalNames: ["steelie", "steelhead trout", "steelhead"],
    bodyShape:
      "Same meristic trout body as inland rainbow, typically more elongate in ocean-grown adults. Caudal fin more forked than many inland rainbows.",
    identificationTraits: [
      "NOAA: steelhead are the anadromous life history of Oncorhynchus mykiss; fish that remain in fresh water are rainbow trout. This catalog keeps the two as separate records.",
      "Fresh-from-the-ocean adults are chrome-silvery with a faint or absent pink stripe and sparse spotting until freshwater residence darkens them.",
      "Typically larger than sympatric inland rainbows. Size is supporting context, not a species key by itself.",
      "USFWS: scale or otolith chemistry is the laboratory confirmation of anadromy. In the field, treat run context, silvery ocean growth, and the steelhead record rather than forcing an inland rainbow ID.",
      "Winter-run and summer-run stocks are the same species record and must not be collapsed into one calendar.",
    ],
    coloration:
      "Ocean-bright fish are metallic silver with a bluish back. The pink lateral band and heavy spotting of inland rainbows develop or intensify after time in fresh water.",
    regionalColorVariation:
      "Great Lakes fish are anadromous into the lakes, not the Pacific. Pacific DPS appearance overlaps; geography and run timing are not read from color.",
    spawningColoration:
      "Freshwater adults darken, show more spots and a stronger pink band, and males may kype. Color is not a targeting cue.",
    juvenileAppearance:
      "Parr in natal streams look like rainbow parr. Juvenile appearance does not decide whether the fish will become a steelhead or a resident rainbow.",
    adultAppearance:
      "A large, often silvery Oncorhynchus mykiss in flowing water. Treat ocean- or Great Lakes-run adults as this record, not inland rainbow.",
    sexualDimorphism:
      "Spawning males kype and darken. Sex is not the record split; life history is.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout (inland)",
        distinction:
          "Same species, resident life history. Inland rainbows are typically smaller, more heavily spotted, and show a clear pink band in fresh water. Anadromous fish belong on this steelhead record.",
      },
      {
        speciesId: "oncorhynchus_kisutch",
        name: "Coho salmon",
        distinction:
          "Coho have a white gum line, a different tail-spot language, and are semelparous Pacific salmon. Steelhead are iteroparous trout (NOAA: they can spawn more than once).",
      },
      {
        speciesId: "oncorhynchus_tshawytscha",
        name: "Chinook salmon",
        distinction:
          "Chinook are larger-bodied salmon with a black gum line and a different spot pattern on the back and tail. They are not anadromous rainbow trout.",
      },
      {
        speciesId: "salmo_salar_anadromous",
        name: "Atlantic salmon",
        distinction:
          "Atlantic salmon are Salmo, conservation-sensitive in this catalog, and a separate fail-closed record. Do not treat a chrome Pacific or Great Lakes steelhead as Atlantic salmon.",
      },
    ],
    averageAdultLength: "Returning adults commonly 24–34 in; inland residuals and half-pounders are smaller.",
    commonAnglingSize: "26–32 in in many Pacific and Great Lakes fisheries.",
    typicalWeight: "Often 6–12 lb; larger fish occur. Inland rainbow weight bands do not apply.",
    maximumDocumentedSize:
      "Ocean- and Great Lakes-grown maxima far exceed inland rainbow size. Those maxima belong here, not on the inland rainbow dossier.",
    longevity:
      "NOAA: unlike most Pacific salmon, steelhead can spawn more than once. Age is stock-specific.",
    sources: [
      { label: "NOAA Fisheries steelhead species profile (anadromy vs resident rainbow, iteroparity)", class: "agency", url: "https://www.fisheries.noaa.gov/species/steelhead" },
      { label: "U.S. Fish and Wildlife Service rainbow / steelhead species profile (otolith/scale confirmation of anadromy)", class: "agency", url: "https://www.fws.gov/species/rainbow-trout-oncorhynchus-mykiss" },
      { label: "Withler / Quinn anadromous Oncorhynchus reviews", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "winter-run vs summer-run as a structured ID field — they are the same species",
      "Pacific DPS vs Great Lakes run as a color key — they are not",
    ],
  },
  {
    speciesId: "sander_vitreus",
    status: "reviewed",
    regionalNames: ["walleyed pike", "marble-eye"],
    bodyShape:
      "Torpedo-shaped percid with two separate dorsal fins, a large mouth, and a distinctly forked tail. The eye is large and pearlescent.",
    identificationTraits: [
      "Minnesota DNR: the lower tip of the caudal fin — the tail — is white. Sauger’s lower lobe is dark, or the white mark is reduced.",
      "Minnesota DNR: the spinous dorsal is dusky and lacks rows of dark spots, except for a dark splotch at the rear base of that fin — a mark sauger does not have.",
      "Pearlescent eye from the tapetum lucidum, a reflective layer that aids night and turbid-water vision (Minnesota DNR).",
      "Olive-brown to yellowish gold with brassy flecks. Sides lack the distinct dark saddle blotches of sauger.",
      "Canine teeth in the jaws. Yellow perch of similar size have no canines and carry regular vertical bars.",
    ],
    coloration:
      "Dark olive-brown to yellowish gold, brassy flecks on the sides, white belly. The eye looks milky or glowing in a beam of light.",
    regionalColorVariation:
      "Clear lakes often produce more gold. Turbid rivers can look darker and closer to sauger until the tail tip and dorsal characters are checked. Color is not the species key.",
    spawningColoration:
      "Early-spring spawners do not take on a trout-style breeding dress. Presence on rock or current-washed gravel is biology, not a targeting cue.",
    juvenileAppearance:
      "Young fish already show the large eye and canines. They can be confused with yellow perch until the bars (perch) versus canines and unmarked dorsal (walleye) are checked.",
    adultAppearance:
      "A golden-olive percid with a glowing eye, a white lower tail tip, and a dusky first dorsal with a rear blotch rather than rows of spots.",
    sexualDimorphism:
      "Females commonly grow larger. Sex is not a field ID key; the tail and dorsal characters are.",
    similarSpecies: [
      {
        speciesId: "sander_canadensis",
        name: "Sauger",
        distinction:
          "Sauger have rows of dark spots on the first dorsal, distinct saddle blotches on the sides, and no (or a reduced) white lower tail tip. Walleye have the white tail tip, a rear-base dorsal blotch rather than spotted rows, and lack those saddles. Missouri DNR: sauger cheeks are scaled; hybrids exist.",
      },
      {
        name: "Saugeye (walleye × sauger hybrid)",
        distinction:
          "Saugeye mix both parents — often a spotted dorsal plus a white tail mark. Missouri DNR: identification can be difficult. Do not force the hybrid into either parent record.",
      },
      {
        speciesId: "perca_flavescens",
        name: "Yellow perch",
        distinction:
          "Yellow perch have about seven blackish vertical bars, no canine teeth, and a smaller eye. Walleye are larger-mouthed percids with canines and no regular bar pattern.",
      },
      {
        speciesId: "morone_chrysops",
        name: "White bass",
        distinction:
          "White bass are temperate bass with horizontal stripes, a deeper body, and no tapetum eye. They are not percids.",
      },
    ],
    averageAdultLength: "Commonly 15–22 in in inland waters; many fisheries produce larger fish.",
    commonAnglingSize: "16–22 in in most inland and Great Lakes fisheries.",
    typicalWeight: "Minnesota DNR: averages 1 to 2 lb in most waters; fish over 10 lb occur.",
    maximumDocumentedSize:
      "Large lake and river fish far exceed the 1–2 lb average. Maxima are waterbody-specific and are not a single catalog number.",
    longevity: "Related Missouri DNR life-cycle notes put typical walleye longevity around 7–10 years; older fish occur.",
    sources: [
      {
        label: "Minnesota DNR walleye biology (white lower tail tip, dorsal blotch vs sauger spots, tapetum, 1–2 lb average)",
        class: "agency",
        url: "https://www.dnr.state.mn.us/fish/walleye/biology.html",
      },
      { label: "Great Lakes / state walleye assessments", class: "agency" },
      { label: "Colby et al. walleye biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "saugeye meristics as a structured hybrid key",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "sander_canadensis",
    status: "reviewed",
    regionalNames: ["sand pike", "jack salmon", "spotted jack"],
    bodyShape:
      "More slender than walleye of the same length. Two separate dorsal fins, large mouth with the upper jaw reaching about the hind edge of the eye, distinctly forked tail (Missouri DNR).",
    identificationTraits: [
      "Missouri DNR: distinct dark blotches or saddle marks on the sides — the primary body split from walleye.",
      "Minnesota DNR / Missouri DNR: first dorsal marked by rows of dark spots and lacking the dark blotch at the rear base that walleye show.",
      "Lower caudal lobe lacks a white blotch, or the blotch is reduced (Minnesota DNR; Missouri DNR).",
      "Missouri DNR: scales present on the cheek; hind edge of the preopercle strongly saw-toothed.",
      "Generally smaller than sympatric walleye. Size supports the ID; it is not the key by itself.",
    ],
    coloration:
      "Darker, more brassy-brown than a typical walleye, with obvious saddle blotches and a spotted first dorsal. Belly paler.",
    regionalColorVariation:
      "Turbid-river fish can look uniformly dark until the saddles and dorsal spots are lit. Clear-water fish show the saddles more cleanly. Color is not a lake-versus-river key.",
    spawningColoration:
      "Early-spring spawners do not take on a bright breeding dress. Presence on rubble in current is biology, not a targeting cue.",
    juvenileAppearance:
      "Saddles and dorsal spotting appear early. Young sauger can still be confused with young walleye and with yellow perch until canines, saddles, and the dorsal recipe are checked.",
    adultAppearance:
      "A slender river percid with saddle blotches, a spotted first dorsal, and a dark lower tail tip.",
    sexualDimorphism:
      "Females commonly grow larger. Sex is not the field key.",
    similarSpecies: [
      {
        speciesId: "sander_vitreus",
        name: "Walleye",
        distinction:
          "Walleye have a white lower tail tip, a dusky first dorsal with a rear-base blotch rather than spotted rows, and no distinct saddles. Sauger are the spotted-dorsal, saddled, usually smaller river fish.",
      },
      {
        name: "Saugeye (walleye × sauger hybrid)",
        distinction:
          "Missouri DNR: sauger occasionally interbreed with walleye; the hybrid shares both parents and should not silently inherit this record.",
      },
      {
        speciesId: "perca_flavescens",
        name: "Yellow perch",
        distinction:
          "Yellow perch have regular vertical bars and no canine teeth. Sauger have canines, saddles rather than even bars, and a spotted first dorsal.",
      },
    ],
    averageAdultLength: "Missouri DNR: total length commonly 12–15 in.",
    commonAnglingSize: "12–18 in in large-river fisheries.",
    typicalWeight: "Minnesota DNR: seldom exceeds 3 lb. Missouri DNR: weight commonly about 2½ lb, with a maximum around 4 lb.",
    maximumDocumentedSize:
      "River maxima exceed the 12–15 in typical band. Continent-wide records are fishery-specific.",
    longevity: "Shorter-lived than the largest walleye in many systems; a single continent-wide age table is not reviewed here.",
    sources: [
      {
        label: "Missouri Department of Conservation sauger field guide (saddles, spotted dorsal, cheek scales, size, river habitat)",
        class: "agency",
        url: "https://mdc.mo.gov/discover-nature/field-guide/sauger",
      },
      {
        label: "Minnesota DNR walleye/sauger biology (dorsal spots, no white tail tip, seldom exceeds 3 lb, turbid-water vision)",
        class: "agency",
        url: "https://www.dnr.state.mn.us/fish/walleye/biology.html",
      },
      { label: "USGS sauger habitat and movement research", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "saugeye meristics as a structured hybrid key",
      "basin-specific mean length tables",
    ],
  },
  {
    speciesId: "esox_lucius",
    status: "reviewed",
    regionalNames: ["northern", "pike", "jack"],
    bodyShape:
      "Elongate esocid with a duckbill snout, a single soft dorsal fin set far back, and a long cylindrical body.",
    identificationTraits: [
      "Michigan DNR: light-colored spots on a darker body — light on dark, the reverse of muskellunge.",
      "Michigan DNR: entire cheek scaled; only the upper half of the gill cover (opercle) scaled.",
      "Michigan DNR: five to six submandibular pores on the underside of each lower jaw. Iowa DNR: five or fewer per side is pike; six or more is muskellunge.",
      "Iowa DNR: bluish-green ground with light, bean-shaped spots in horizontal rows. Juveniles show oblique light-and-dark bars, not an adult chain pattern.",
      "Tail lobes are more rounded than the pointed, more forked muskellunge tail (Iowa DNR).",
    ],
    coloration:
      "Dark green to bluish-green back and sides with rows of light bean-shaped spots; pale belly. Lower fins often reddish or orange-tinted.",
    regionalColorVariation:
      "Stained water can mute the spots. Juveniles are barred and must not be forced into a chain-pickerel ID. Color pattern plus pores and cheek scaling is the key, not geography.",
    spawningColoration:
      "Ice-out fish do not take on a trout-style dress. Vegetated shallows at ice-out are biology, not a targeting cue.",
    juvenileAppearance:
      "Iowa DNR: juveniles have oblique bars of light and dark. Those bars are not the chain-pickerel chain, and they are not muskellunge dark-on-light marks.",
    adultAppearance:
      "A duck-billed esocid with light spots on a dark ground, a fully scaled cheek, and five or fewer pores per side.",
    sexualDimorphism:
      "Females grow larger and mature later (Michigan DNR: females at about three or four years, males at two to three). Size overlap is large; sex is not the field key.",
    similarSpecies: [
      {
        speciesId: "esox_masquinongy",
        name: "Muskellunge",
        distinction:
          "Muskellunge have dark marks on a lighter ground, scales on only the upper half of the cheek and gill cover, and six or more pores per side (Michigan DNR). Pike are light-on-dark with a fully scaled cheek and five or fewer pores.",
      },
      {
        speciesId: "esox_niger",
        name: "Chain pickerel",
        distinction:
          "Chain pickerel have a chain-like dark pattern, a dark bar streaming down from the eye, and a fully scaled cheek and opercle. They are a smaller eastern vegetated-water esocid, not a light-spotted northern.",
      },
      {
        name: "Tiger muskellunge (northern pike × muskellunge hybrid)",
        distinction:
          "Tiger muskies mix both parents — often dark bars on a light ground with intermediate scaling and pores. Treat as a hybrid; do not force either parent record.",
      },
      {
        name: "Grass pickerel (Esox americanus vermiculatus)",
        distinction:
          "Michigan DNR lists grass pickerel as a pike-family cousin. It is a small, fully scaled, worm-marked esocid and is not this catalog record.",
      },
    ],
    averageAdultLength: "Inland adults commonly 18–28 in; larger fish occur in fertile northern waters.",
    commonAnglingSize: "20–30 in in many inland and Great Lakes fisheries.",
    typicalWeight: "Often 2–8 lb; large fish are much heavier. Michigan DNR notes continued weight gain after maturity, more slowly.",
    maximumDocumentedSize:
      "Large northern waters produce fish far above typical inland size. Maxima are waterbody-specific.",
    longevity: "Michigan DNR: average life span six to eight years; some live as long as 15.",
    sources: [
      {
        label: "Michigan DNR northern pike species account (light spots on dark, full cheek scales, 5–6 pores)",
        class: "agency",
        url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/pike",
      },
      {
        label: "Iowa DNR pike vs muskellunge identification (pores, cheek scales, tail shape, color reverse)",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2016-05-25/know-your-catch-how-id-northern-pike-and-muskies",
      },
      { label: "Casselman pike thermal ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "a single continent-wide mean length",
      "grass pickerel meristics as a structured lookalike key",
    ],
  },
  {
    speciesId: "esox_masquinongy",
    status: "reviewed",
    regionalNames: ["muskie", "musky", "muskellunge"],
    bodyShape:
      "The largest North American esocid: long cylindrical body, duckbill jaws with large teeth, single soft dorsal set far back. Tail more pointed/forked than northern pike (Iowa DNR).",
    identificationTraits: [
      "Michigan DNR: dark spots on a lighter background on the body and dorsal fin — dark on light, the reverse of pike.",
      "Michigan DNR: scales on only the upper half of the cheek and the upper half of the gill cover.",
      "Michigan DNR: six to 10 submandibular pores per side. Iowa DNR: six or more on either side is muskellunge.",
      "Michigan DNR treats clear, barred, and spotted color patterns as the same species (northern vs Great Lakes strain is management, not a catalog split).",
      "Iowa DNR: a true muskellunge tail splits to two points. Color alone is not enough when barred, spotted, and clear fish all occur.",
    ],
    coloration:
      "Olive, silver, or gray ground with dark bars, spots, or an almost clear pattern. Michigan DNR: Great Lakes fish more often spotted; some inland fish more barred or clear.",
    regionalColorVariation:
      "Barred, spotted, and clear fish are the same species record. Do not split them into separate catalog identities from a photograph.",
    spawningColoration:
      "Early-spring fish after ice-out, and after pike. Vegetated shallows are biology, not a targeting cue.",
    juvenileAppearance:
      "Iowa DNR: juveniles may show dark spots on a silvery ground. They are not light-spotted pike, and they are not chain pickerel.",
    adultAppearance:
      "A large duck-billed esocid with dark marks on a light ground, half-scaled cheek and opercle, and six or more pores per side.",
    sexualDimorphism:
      "Females grow larger. Size overlap is large; pores and scaling remain the key.",
    similarSpecies: [
      {
        speciesId: "esox_lucius",
        name: "Northern pike",
        distinction:
          "Pike are light-on-dark with a fully scaled cheek and five or fewer pores per side. Muskellunge are dark-on-light with a half-scaled cheek and six or more pores.",
      },
      {
        speciesId: "esox_niger",
        name: "Chain pickerel",
        distinction:
          "Chain pickerel have a chain pattern, a dark bar down from the eye, and a fully scaled cheek and opercle. They are much smaller eastern fish. North Carolina Wildlife: muskellunge lack that suborbital bar.",
      },
      {
        name: "Tiger muskellunge (northern pike × muskellunge hybrid)",
        distinction:
          "Tiger muskies show intermediate bars, scaling, and pores. Treat as a hybrid. Do not force either parent.",
      },
    ],
    averageAdultLength:
      "Michigan muskellunge management literature: about 32 in at age 4 and exceeding 40 in at age 8 in Michigan waters.",
    commonAnglingSize: "34–42 in in many managed fisheries.",
    typicalWeight: "Often well above typical pike weight at the same water; large fish are common in managed waters.",
    maximumDocumentedSize:
      "Managed waters produce fish far above inland pike size. Maxima are waterbody-specific. Live size limits are jurisdiction rules, not this overlay.",
    longevity: "Longer-lived than typical pike in many waters; age is stock-specific.",
    sources: [
      {
        label: "Michigan DNR muskellunge species account (dark on light, half-scaled cheek and opercle, 6–10 pores, spawn after pike)",
        class: "agency",
        url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/muskie",
      },
      {
        label: "Iowa DNR pike vs muskellunge identification",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2016-05-25/know-your-catch-how-id-northern-pike-and-muskies",
      },
      { label: "Crossman muskellunge biology", class: "peer_reviewed" },
      { label: "Michigan DNR muskellunge management plan (color patterns as one species; growth to 40 in)", class: "agency" },
    ],
    ...R,
    gaps: [
      "barred vs spotted vs clear as a structured ID field — they are the same species",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "esox_niger",
    status: "reviewed",
    regionalNames: ["pickerel", "chain pickerel"],
    bodyShape:
      "Narrowly elongated esocid with a long, narrow duckbill snout — smaller than pike or muskellunge at typical angling size (South Carolina DNR).",
    identificationTraits: [
      "South Carolina DNR: olive-green body with rows of a chain-like pattern along the side.",
      "South Carolina DNR: a black bar streams straight down from the eye. North Carolina Wildlife: muskellunge do not have that suborbital bar.",
      "Cheek and opercle both mostly scaled — the pickerel facial-scale recipe, unlike muskellunge (half-scaled) and unlike pike (cheek full, opercle half).",
      "Typically four submandibular pores per side, fewer than pike or muskellunge.",
      "South Carolina DNR: snout longer than redfin pickerel; the eye-bar streams straight down.",
    ],
    coloration:
      "Olive to yellowish-green with a dark chain or reticulated network on the sides; cream belly; dark teardrop under the eye.",
    regionalColorVariation:
      "Stained swamp water can darken the chain. Juveniles may show a different teardrop slant than adults; the chain and fully scaled face remain the key.",
    spawningColoration:
      "Early-spring fish in flooded vegetation. That habitat is biology, not a targeting cue.",
    juvenileAppearance:
      "Young fish already show a chain or reticulated pattern and the eye bar. They are not light-spotted pike juveniles.",
    adultAppearance:
      "A small-to-moderate duck-billed esocid with a chain pattern, a vertical eye-bar, and a fully scaled cheek and opercle.",
    sexualDimorphism:
      "Females may grow larger. Size overlap is large; the chain and eye-bar are the key.",
    similarSpecies: [
      {
        speciesId: "esox_lucius",
        name: "Northern pike",
        distinction:
          "Pike have light spots on a dark ground and only the upper half of the opercle scaled. Chain pickerel have a chain pattern, a vertical eye-bar, and a fully scaled opercle.",
      },
      {
        speciesId: "esox_masquinongy",
        name: "Muskellunge",
        distinction:
          "Muskellunge are much larger, dark-on-light, half-scaled on cheek and opercle, and lack the pickerel eye-bar (North Carolina Wildlife).",
      },
      {
        name: "Redfin / grass pickerel (Esox americanus)",
        distinction:
          "South Carolina DNR: redfin pickerel have a shorter snout; the chain pickerel’s eye-bar streams straight down. Do not collapse the two pickerels. Grass/redfin are not this catalog record.",
      },
    ],
    averageAdultLength: "South Carolina DNR: average length 14–15 in.",
    commonAnglingSize: "12–18 in in vegetated eastern waters.",
    typicalWeight: "South Carolina DNR: average size 12–14 oz.",
    maximumDocumentedSize:
      "Large chain pickerel exceed the 14–15 in average. They remain far smaller than typical muskellunge. Maxima are waterbody-specific.",
    sources: [
      {
        label: "South Carolina DNR chain pickerel account (chain pattern, vertical eye-bar, 14–15 in / 12–14 oz)",
        class: "agency",
        url: "https://www.dnr.sc.gov/fish/species/chainpickerel.html",
      },
      {
        label: "North Carolina Wildlife chain pickerel species account (eye-bar vs muskellunge)",
        class: "agency",
        url: "https://www.ncwildlife.gov/species/chain-pickerel",
      },
      { label: "USGS Nonindigenous Aquatic Species chain pickerel profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "redfin vs grass pickerel meristics as a structured lookalike key",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "perca_flavescens",
    status: "reviewed",
    regionalNames: ["perch", "ring perch", "yellow perch"],
    bodyShape:
      "Laterally compressed perciform, deeper than a slim walleye of the same length, with two clearly separated dorsal fins.",
    identificationTraits: [
      "Michigan DNR: two dorsal fins separated into a spiny and a soft-rayed portion; yellow sides; seven blackish bars on the sides; no canine teeth.",
      "The even vertical bars are the field look. Walleye and sauger of similar size have canines and do not carry this regular bar pattern.",
      "Lower fins often orange to red-orange. The eye is not the pearlescent tapetum eye of walleye.",
      "Mouth is smaller and more terminal than Sander; the upper jaw does not give the walleye canine profile.",
      "A schooling fish. A single fish is still this species; a group is not a location pin.",
    ],
    coloration:
      "Olive to golden-yellow sides with about seven dark vertical bars, white belly, orange-red lower fins.",
    regionalColorVariation:
      "Clear lakes can look more gold. Stained water can mute the bars. Great Lakes and inland fish share the same bar recipe; geography is not the key.",
    spawningColoration:
      "Spring fish laying gelatinous egg strings over vegetation, roots, and wood. That habitat is biology, not a targeting cue.",
    juvenileAppearance:
      "Bars appear early. Young perch can be confused with young walleye until the canines (walleye) versus bars-and-no-canines (perch) are checked.",
    adultAppearance:
      "A yellow-sided, seven-barred perch with two dorsal fins and no canine teeth.",
    sexualDimorphism:
      "Michigan DNR: males mature at about three years, females at four. Females commonly grow larger. Sex is not the field key.",
    similarSpecies: [
      {
        speciesId: "sander_vitreus",
        name: "Walleye",
        distinction:
          "Walleye have canine teeth, a pearlescent tapetum eye, and no regular seven-bar pattern. Yellow perch have the bars and no canines.",
      },
      {
        speciesId: "sander_canadensis",
        name: "Sauger",
        distinction:
          "Sauger have canines, saddle blotches, and a spotted first dorsal. They are not a barred yellow perch.",
      },
      {
        speciesId: "morone_americana",
        name: "White perch",
        distinction:
          "White perch are Morone: deeper-bodied temperate bass without the yellow-perch bar recipe. Do not collapse the two “perch” names.",
      },
    ],
    averageAdultLength: "Michigan DNR: average adult length four to 10 in. Crowded waters may never exceed six in.",
    commonAnglingSize: "6–10 in in many inland and Great Lakes fisheries; larger fish occur where density allows.",
    typicalWeight: "Michigan DNR: four to 10 oz at typical adult size.",
    maximumDocumentedSize:
      "Large Great Lakes and productive inland fish exceed the 4–10 in average. Stunting is density- and habitat-dependent (Michigan DNR).",
    longevity: "Michigan DNR notes maturity at about three to four years; a continent-wide maximum age is not reviewed here.",
    sources: [
      {
        label: "Michigan DNR yellow perch species account (seven bars, no canines, 4–10 in / 4–10 oz, schooling, ice activity)",
        class: "agency",
        url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/yellow-perch",
      },
      { label: "Great Lakes perch assessments", class: "agency" },
      { label: "Thorpe yellow perch biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "Great Lakes vs inland mean-size tables",
      "stunting thresholds by waterbody",
    ],
  },
  {
    speciesId: "pomoxis_spp",
    status: "reviewed",
    regionalNames: ["specks", "sac-a-lait", "papermouth"],
    bodyShape:
      "Deep, compressed centrarchid with a large mouth for a panfish and a distinctly concave forehead. Longer and less round than a bluegill of the same length.",
    identificationTraits: [
      "Minnesota DNR: this catalog record is the black/white crappie complex, not a subspecies key. Black crappie are generally darker with seven or eight dorsal spines; white crappie often show vertical bars and usually have five or six dorsal spines.",
      "Mouth is large relative to Lepomis sunfish — the upper jaw reaches well under the eye. Bluegill and pumpkinseed mouths are small.",
      "Irregular dark speckling (black crappie) or faint vertical bars (white crappie) on a silvery-green to olive ground. Not the even sunfish bar recipe of bluegill.",
      "Dorsal fin is long, with the spinous and soft portions connected. Spines are the in-complex split, not a sunfish-versus-crappie key.",
      "Catalog exception: black and white habitat splits in the same lake. Do not force a fish into a species that is not a separate catalog record.",
    ],
    coloration:
      "Silvery-green to olive with dark speckles or bars. Black crappie look darker and more mottled; white crappie look paler with more regular bars.",
    regionalColorVariation:
      "Clear lakes produce more contrast. Turbid reservoirs wash out the pattern until the dorsal-spine count is checked. Color is not the species key, and it is not a lake-versus-river key.",
    spawningColoration:
      "Spring nesting males darken. Colonial wood and brush in the upper 50s to mid-60s is biology, not a targeting cue.",
    juvenileAppearance:
      "Young fish already show the large mouth and speckled or barred sides. They are not round, small-mouthed bluegill fry.",
    adultAppearance:
      "A deep, large-mouthed panfish, silvery-olive, speckled or barred. Treat black and white as this complex unless a future reviewed split exists.",
    sexualDimorphism:
      "Males darken on the nest. Size overlap is large; sex is not the field key.",
    similarSpecies: [
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a small mouth, a dark ear flap, a soft-dorsal spot, and even vertical bars. Crappie have a much larger mouth and the Pomoxis speckle/bar language, not a Lepomis ear flap.",
      },
      {
        speciesId: "morone_chrysops",
        name: "White bass",
        distinction:
          "White bass are temperate bass with continuous horizontal stripes and a deeper, more predatory body. They are not speckled Pomoxis.",
      },
      {
        speciesId: "perca_flavescens",
        name: "Yellow perch",
        distinction:
          "Yellow perch have about seven regular blackish bars, two clearly separated dorsal fins, and no canine-free crappie mouth. They are percids, not centrarchids.",
      },
      {
        speciesId: "centrarchus_macropterus",
        name: "Flier",
        distinction:
          "Fliers are almost circular, carry a black teardrop under the eye, and have 11–13 dorsal spines — more than either crappie. They are a coastal-plain swamp sunfish, not this Pomoxis complex.",
      },
    ],
    averageAdultLength: "Commonly 8–12 in. Minnesota DNR: the two species are similar in size.",
    commonAnglingSize: "9–12 in in many reservoirs and lakes.",
    typicalWeight: "Minnesota DNR: a 2-pound fish is unusually large.",
    maximumDocumentedSize:
      "Fish over 2 lb occur. Maxima are waterbody-specific and are not a single catalog number.",
    sources: [
      {
        label: "Minnesota DNR crappie biology (dorsal-spine split, 2 lb unusually large, schooling, nest colonies)",
        class: "agency",
        url: "https://www.dnr.state.mn.us/fish/crappie/biology.html",
      },
      { label: "State crappie management summaries", class: "agency" },
      { label: "Trautman / Scott & Crossman perciform notes", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "black vs white as separate catalog records — they are a complex here",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "lepomis_macrochirus",
    status: "reviewed",
    regionalNames: ["gill", "bream", "brim", "sunfish"],
    bodyShape:
      "Deep, compressed Lepomis with a small mouth and long, pointed pectoral fins. Rounder than green sunfish or rock bass of the same length.",
    identificationTraits: [
      "Michigan DNR: two broadly joined dorsal fins; small mouth; long pointed pectoral fins; a faint black spot toward the rear of the soft dorsal that other sunfish lack.",
      "Dark opercular (ear) flap without a red or orange spot. Pumpkinseed and redear carry color on that flap; bluegill’s flap is black.",
      "Five to nine faint vertical bars on the sides. Breeding males show blue on the gill cover and an orange to copper breast — color is not the species key by itself.",
      "Upper jaw does not reach past the front of the eye. Green sunfish and warmouth mouths are much larger.",
      "Michigan DNR notes hybridization with pumpkinseed and green sunfish. Hybrids should not be forced into this record.",
    ],
    coloration:
      "Olive to bronze back, yellow to copper sides, dark ear flap, bluish cheek in many adults. Vertical bars vary with water color.",
    regionalColorVariation:
      "Clear water produces more blue and copper. Stained ponds look darker. Southern ‘coppernose’ appearance is a regional morph, not a separate catalog record.",
    spawningColoration:
      "Colonial nesters as water holds near 65°F and through summer. Catalog exception: bed targeting of spawning colonies is a conservation choice, never a recommendation.",
    juvenileAppearance:
      "Bars and the dark ear flap appear early. The soft-dorsal spot is the juvenile split from pumpkinseed more than adult orange is.",
    adultAppearance:
      "A round, small-mouthed sunfish with a black ear flap, a soft-dorsal spot, and long pointed pectorals.",
    sexualDimorphism:
      "Nesting males darken and show more orange on the breast. Size overlap is large.",
    similarSpecies: [
      {
        speciesId: "lepomis_gibbosus",
        name: "Pumpkinseed",
        distinction:
          "Pumpkinseed have a bright red or orange spot on a white-margined ear flap and wavy blue lines on the cheek. Bluegill have a plain black flap and a soft-dorsal spot.",
      },
      {
        speciesId: "lepomis_microlophus",
        name: "Redear sunfish",
        distinction:
          "Redear have a red or orange edge on the ear flap and lack the bluegill soft-dorsal spot. They are more slab-sided and bottom-oriented.",
      },
      {
        speciesId: "lepomis_cyanellus",
        name: "Green sunfish",
        distinction:
          "Green sunfish have a large mouth, a more elongated bass-like body, rounded pectorals, and often a dark spot at the dorsal base with pale fin margins. Bluegill mouths are small.",
      },
      {
        speciesId: "pomoxis_spp",
        name: "Crappie",
        distinction:
          "Crappie have a much larger mouth and Pomoxis speckling or bars, not a Lepomis ear flap or a round bluegill body.",
      },
    ],
    averageAdultLength: "Commonly 6–9 in; crowded ponds stunt well below that.",
    commonAnglingSize: "6–8 in in most warm still waters.",
    typicalWeight: "Often 4–8 oz; a 1 lb fish is a large inland bluegill.",
    maximumDocumentedSize:
      "Fish well over 1 lb occur in fertile waters. Stunting is density-dependent. Maxima are waterbody-specific.",
    sources: [
      {
        label: "Michigan DNR bluegill species account (joined dorsals, small mouth, pointed pectorals, soft-dorsal spot, 65°F spawn)",
        class: "agency",
        url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/bluegill",
      },
      { label: "State inland panfish notes", class: "agency" },
      { label: "Werner / Mittelbach sunfish foraging ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "coppernose vs inland morphometrics as a structured field",
      "hybrid meristics as a structured key",
    ],
  },
  {
    speciesId: "lepomis_gibbosus",
    status: "reviewed",
    regionalNames: ["pumpkinseed sunfish", "sunny"],
    bodyShape:
      "Deep, compressed Lepomis, similar in outline to bluegill, with a small mouth and long pectoral fins.",
    identificationTraits: [
      "Ear flap black with a bright red or orange spot and a pale to white margin — the primary field split from bluegill’s plain black flap.",
      "Wavy blue and orange lines on the cheek and gill cover. Redear lack that cheek maze.",
      "Sides often carry orange, gold, or copper spots on an olive-to-brassy ground.",
      "Small mouth; upper jaw does not reach past the eye. Pectorals are long, as in bluegill, not the rounded green-sunfish pectoral.",
      "Three anal spines, as in other Lepomis. Rock bass have six.",
    ],
    coloration:
      "Olive to brassy sides with orange or gold spotting, a colorful cheek, and a red-orange ear-flap spot on a pale margin.",
    regionalColorVariation:
      "Northern fish often show the strongest orange. Introduced western fish can look paler but still carry the flap spot and cheek lines.",
    spawningColoration:
      "Early-summer and summer nesters as littoral water warms into the upper 60s and 70s. Colonial nesting habitat is conservation context, not a place to target.",
    juvenileAppearance:
      "The ear-flap spot and cheek lines develop with size. Small fish can still be separated from bluegill once the flap color is visible.",
    adultAppearance:
      "A round sunfish with a red-orange ear-flap spot, wavy blue cheek lines, and orange body spotting.",
    sexualDimorphism:
      "Males intensify color on the nest. Size overlap is large.",
    similarSpecies: [
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a plain black ear flap and a soft-dorsal spot. Pumpkinseed have the red-orange flap spot and wavy blue cheek lines.",
      },
      {
        speciesId: "lepomis_microlophus",
        name: "Redear sunfish",
        distinction:
          "Redear have a red or orange edge on the flap, not a discrete spot with a white margin, and they lack pumpkinseed’s wavy blue cheek lines. Redear are the snail specialist.",
      },
      {
        speciesId: "lepomis_cyanellus",
        name: "Green sunfish",
        distinction:
          "Green sunfish have a large mouth and an elongated body. Pumpkinseed mouths are small.",
      },
      {
        speciesId: "lepomis_megalotis",
        name: "Longear sunfish",
        distinction:
          "Longear have a much longer opercular flap, often white-edged. Pumpkinseed’s flap is short, with a discrete red-orange spot and a white margin.",
      },
    ],
    averageAdultLength: "Commonly 5–8 in; often smaller than sympatric bluegill.",
    commonAnglingSize: "5–7 in in vegetated lakes and ponds.",
    typicalWeight: "Often well under 8 oz.",
    maximumDocumentedSize:
      "Large pumpkinseed exceed the 5–8 in band but remain smaller than trophy bluegill or redear in most waters.",
    sources: [
      { label: "National Park Service pumpkinseed species account", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species pumpkinseed profile", class: "agency" },
      { label: "Smithsonian NEMESIS pumpkinseed summary (ear-flap spot, white margin, wavy cheek lines, mollusk feeding)", class: "agency" },
    ],
    ...R,
    gaps: [
      "eastern native vs introduced western color tables",
      "longevity as a structured field",
    ],
  },
  {
    speciesId: "lepomis_microlophus",
    status: "reviewed",
    regionalNames: ["shellcracker", "chinquapin", "georgia bream"],
    bodyShape:
      "Deep, slab-sided Lepomis with a small mouth. Missouri DNR: upper jaw not reaching past the front of the eye.",
    identificationTraits: [
      "Texas Parks and Wildlife: the most distinct character is the red edge on the opercle flap of the male (orange on the female). The flap is never greatly elongated.",
      "Missouri DNR: ear flap black with a whitish border and a prominent orange or red spot/edge. Pumpkinseed’s flap is a discrete red spot with a white margin plus wavy blue cheek lines — redear lack that cheek maze.",
      "No bluegill-style black spot at the rear of the soft dorsal. Pectorals long; mouth small.",
      "Texas Parks and Wildlife: typically 10 dorsal spines and three anal spines. Sides often show faint vertical bars on olive-to-gold ground.",
      "Pharyngeal (throat) teeth are broad and flattened for crushing mollusk shells (Missouri DNR). That is diet anatomy, not a field-visible ID for most anglers.",
    ],
    coloration:
      "Dark olive above to yellow or orange-yellow on the belly; sides yellow-green, often with faint bars. The red or orange flap edge is the namesake mark.",
    regionalColorVariation:
      "Southern native fish often show the strongest flap color. Stocked ponds elsewhere can look paler until the flap edge is checked.",
    spawningColoration:
      "Missouri DNR: nesting in May or June, sometimes again in August; colonies with nest rims often almost touching. Nesting colonies are never named as target locations.",
    juvenileAppearance:
      "The flap edge color develops with size. Young redear can be confused with bluegill until the dorsal spot (bluegill) versus flap edge (redear) is clear.",
    adultAppearance:
      "A slab-sided, small-mouthed sunfish with a red or orange ear-flap edge and no bluegill dorsal spot.",
    sexualDimorphism:
      "Texas Parks and Wildlife: red edge on the male flap, orange on the female. Size overlap is large.",
    similarSpecies: [
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a plain black ear flap and a soft-dorsal spot. Redear have the colored flap edge and lack that dorsal spot.",
      },
      {
        speciesId: "lepomis_gibbosus",
        name: "Pumpkinseed",
        distinction:
          "Pumpkinseed have a discrete red-orange flap spot, a white margin, and wavy blue cheek lines. Redear have a colored flap edge and lack the cheek maze.",
      },
      {
        speciesId: "lepomis_cyanellus",
        name: "Green sunfish",
        distinction:
          "Green sunfish have a large mouth and an elongated body. Redear mouths are small.",
      },
    ],
    averageAdultLength: "Missouri DNR: total length commonly 8–10½ in.",
    commonAnglingSize: "8–11 in in ponds and reservoirs where snails are present.",
    typicalWeight: "Missouri DNR: commonly 6½–12 oz.",
    maximumDocumentedSize:
      "Missouri DNR: can be more than 12 in and more than 4 lb. Those maxima are waterbody-specific.",
    longevity: "Missouri DNR: individuals can live for 6 years.",
    sources: [
      {
        label: "Missouri Department of Conservation redear sunfish field guide (flap edge, small mouth, mollusk diet, size)",
        class: "agency",
        url: "https://mdc.mo.gov/discover-nature/field-guide/redear-sunfish",
      },
      {
        label: "Texas Parks and Wildlife redear sunfish account (red/orange opercle edge, 10 dorsal spines)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/sunfish/",
      },
      { label: "USGS Nonindigenous Aquatic Species redear sunfish profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "snail-density vs body-size tables by waterbody",
    ],
  },
  {
    speciesId: "lepomis_cyanellus",
    status: "reviewed",
    regionalNames: ["greenie"],
    bodyShape:
      "Texas Parks and Wildlife: a large mouth and a heavy, black-bass body shape — more elongated than bluegill or pumpkinseed.",
    identificationTraits: [
      "Mouth large: the upper jaw reaches to or past the eye, unlike bluegill, pumpkinseed, and redear.",
      "Texas sunfish key: dark (often orange-edged) ear flap; dark spot at the base of the dorsal fin; rounded pectoral fins; white margins on the fins.",
      "Body dark green, almost blue, on the back, fading to lighter green on the sides and yellow to white on the belly (Texas Parks and Wildlife).",
      "More stream-tolerant than most Lepomis. That is habitat, not an ID key by itself.",
      "Texas Parks and Wildlife: hybridization with other sunfish is very common. A hybrid should not silently inherit this record. Warmouth also has a large mouth and is a leftover-wave lookalike.",
    ],
    coloration:
      "Dark green to bluish back, lighter green sides, yellow breast. Pale fin margins and a dark dorsal-base spot are supporting marks.",
    regionalColorVariation:
      "Turbid-water fish can look uniformly dark. Clear-stream fish show more blue-green. Color is not a native-versus-introduced key.",
    spawningColoration:
      "Nests in shallow colonies on gravel or rock as water warms into the upper 60s and 70s, and may repeat through summer. Colonial nests are conservation context.",
    juvenileAppearance:
      "The large mouth is already the split from bluegill fry. Fin margins and the dorsal-base spot develop with size.",
    adultAppearance:
      "An elongated, large-mouthed sunfish with pale fin edges and a dark ear flap — the most bass-like Lepomis in this wave.",
    sexualDimorphism:
      "Males defend nests. Size overlap is large; the mouth, not color, is the key.",
    similarSpecies: [
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a small mouth, long pointed pectorals, and a soft-dorsal spot. Green sunfish have a large mouth, rounded pectorals, and a more elongated body.",
      },
      {
        speciesId: "lepomis_gibbosus",
        name: "Pumpkinseed",
        distinction:
          "Pumpkinseed have a small mouth and a red-orange ear-flap spot with wavy blue cheek lines. Green sunfish do not.",
      },
      {
        speciesId: "lepomis_microlophus",
        name: "Redear sunfish",
        distinction:
          "Redear have a small mouth and a red/orange flap edge. Green sunfish mouths are large.",
      },
      {
        speciesId: "lepomis_gulosus",
        name: "Warmouth",
        distinction:
          "Warmouth also have a large mouth and a bass-like body, often with streaks through the eye, tongue teeth, and more mottling. Do not collapse the two large-mouthed sunfish.",
      },
    ],
    averageAdultLength: "Commonly 5–8 in; large stream fish exceed that.",
    commonAnglingSize: "5–7 in in ponds and small streams.",
    typicalWeight: "Often well under 8 oz; large fish occur in fertile cover.",
    maximumDocumentedSize:
      "Large green sunfish exceed typical pond size. They remain smaller than adult bass. Maxima are waterbody-specific.",
    sources: [
      {
        label: "Texas Parks and Wildlife green sunfish account (large mouth, bass-like body, hybridization, insect and small-fish diet)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/greensunfish/",
      },
      { label: "USGS Nonindigenous Aquatic Species green sunfish profile", class: "agency" },
      { label: "USFWS green sunfish habitat-use synthesis", class: "agency" },
    ],
    ...R,
    gaps: [
      "hybrid meristics as a structured key",
      "warmouth vs green sunfish as a structured leftover-wave split",
    ],
  },
  {
    speciesId: "ambloplites_rupestris",
    status: "reviewed",
    regionalNames: ["red eye", "redeye", "goggle-eye"],
    bodyShape:
      "Michigan DNR: elongated in shape with a large mouth — deeper than a slim smallmouth of the same length, more bass-like than a round Lepomis.",
    identificationTraits: [
      "Michigan DNR: six spines on the anal fin, as opposed to other sunfish which only have three. Iowa DNR: six anal spines and about 12 dorsal spines distinguish this fish from other sunfish.",
      "Michigan DNR: red eyes. The eye color is a supporting mark, not the only key.",
      "Large mouth. Rows of dark spots or mottling on golden-brown to olive sides, not Lepomis vertical bars and not smallmouth bronze bars.",
      "Michigan DNR: an uncanny ability to change color to match surroundings. Color is therefore a poor single key.",
      "Not Micropterus: the body is deeper, the anal-spine count is six, and the eye is red. Smallmouth mouths stop at the eye and show vertical bronze bars.",
    ],
    coloration:
      "Golden brown to olive with a white to silver belly and rows of dark spots. Color can shift quickly toward the background.",
    regionalColorVariation:
      "Clear rocky rivers produce more gold. Stained lakes look darker. Color change on the fish is a behavior, not a population key.",
    spawningColoration:
      "Spring to early-summer nest spawning over gravel, sand, and rocky littoral habitat. Nest guarding is a reproductive state, not a recommendation to target beds.",
    juvenileAppearance:
      "Red eyes and mottling appear early. Young rock bass can be confused with young smallmouth until the anal-spine count and bar language are checked.",
    adultAppearance:
      "A red-eyed, large-mouthed, mottled sunfish with six anal spines — a goggle-eye, not a smallmouth and not a bluegill.",
    sexualDimorphism:
      "Males guard nests. Size overlap is large; spines and the eye are the key.",
    similarSpecies: [
      {
        speciesId: "micropterus_dolomieu",
        name: "Smallmouth bass",
        distinction:
          "Smallmouth have vertical bronze bars, a Micropterus profile, and three anal spines. Rock bass have six anal spines, red eyes, and mottled sides rather than bronze bars.",
      },
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a small mouth, three anal spines, and a round Lepomis body. Rock bass have a large mouth, six anal spines, and red eyes.",
      },
      {
        speciesId: "lepomis_cyanellus",
        name: "Green sunfish",
        distinction:
          "Green sunfish have three anal spines and Lepomis fin language. Rock bass have six anal spines and red eyes.",
      },
      {
        speciesId: "lepomis_gulosus",
        name: "Warmouth",
        distinction:
          "Warmouth share the goggle-eye nickname and a large mouth, but have three anal spines and teeth on the tongue. Rock bass have six anal spines and lack that tongue-tooth key.",
      },
    ],
    averageAdultLength: "Commonly 6–10 in in rocky streams and lake shores.",
    commonAnglingSize: "7–10 in in Great Lakes and interior rocky water.",
    typicalWeight: "Often 4–10 oz; larger fish occur around rock and wood.",
    maximumDocumentedSize:
      "Large rock bass exceed typical stream size but remain far smaller than adult smallmouth. Maxima are waterbody-specific.",
    sources: [
      {
        label: "Michigan DNR rock bass species account (six anal spines, red eyes, large mouth, color change, crayfish and fish diet)",
        class: "agency",
        url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/rock-bass",
      },
      { label: "Illinois Department of Natural Resources rock bass account", class: "agency" },
      { label: "Iowa DNR rock bass identification (six anal spines, ~12 dorsal spines)", class: "agency" },
    ],
    ...R,
    gaps: [
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "lepomis_auritus",
    status: "reviewed",
    regionalNames: ["redbelly sunfish", "redbreast", "robin"],
    bodyShape:
      "South Carolina DNR: laterally compressed like other sunfishes, but more elongated than bluegill or pumpkinseed of the same length.",
    identificationTraits: [
      "North Carolina Wildlife: the most distinguishing character is a long, narrow (no wider than the eye) extension of the gill cover. These flaps may exceed a length of 1 inch and are entirely black.",
      "South Carolina DNR: blue lines on the face or cheek; teeth present on the roof of the mouth; caudal fin generally orange-red.",
      "Delaware DNREC: bright bluish-green stripes originate near the mouth and extend backward toward the base of the elongated black ear flap. Vertical rows of red-brown to orange spots on the sides (South Carolina DNR).",
      "Three anal spines, as in other Lepomis. Rock bass have six. The mouth is moderate — larger than bluegill, smaller than warmouth or green sunfish.",
      "Longear also have a long flap, but longear flaps are often white-edged and longear pectorals are short and rounded. Redbreast flaps are entirely black.",
    ],
    coloration:
      "Olive to bluish-green back fading to a bright orange-yellow belly in females and a deep orange-red belly in males (South Carolina DNR). North Carolina Wildlife: green-to yellow-brown sides with reddish spots and a reddish-orange belly.",
    regionalColorVariation:
      "Atlantic-slope fish often show the strongest breast color. Color is not a native-versus-introduced key (USGS NAS documents introduced occurrences west of the native Atlantic/Gulf slope range).",
    spawningColoration:
      "Breeding males have a bright orange-red breast (Delaware DNREC). South Carolina DNR: spawn late May through July at about 65–75°F; nests may be solitary or in groups of more than 80. Colonies are conservation context.",
    juvenileAppearance:
      "The long black flap and cheek lines develop with size. Small fish can still be split from bluegill once the flap length is visible.",
    adultAppearance:
      "An elongated sunfish with a long, entirely black ear flap, blue cheek lines, and an orange to red breast.",
    sexualDimorphism:
      "Males deepen the orange-red breast; females stay orange-yellow. Size overlap is large; the flap, not color, is the key.",
    similarSpecies: [
      {
        speciesId: "lepomis_megalotis",
        name: "Longear sunfish",
        distinction:
          "Longear flaps are elongated and often white-edged; pectorals are short and rounded; the head has sky-blue vermiculations. Redbreast flaps are entirely black and no wider than the eye; the body is more elongated than a slab-sided longear.",
      },
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a short black ear flap, a soft-dorsal spot, and long pointed pectorals. Redbreast have a long entirely black flap and lack that dorsal spot.",
      },
      {
        speciesId: "lepomis_gibbosus",
        name: "Pumpkinseed",
        distinction:
          "Pumpkinseed have a short flap with a discrete red-orange spot and a white margin. Redbreast flaps are long and entirely black.",
      },
      {
        speciesId: "lepomis_microlophus",
        name: "Redear sunfish",
        distinction:
          "Redear have a short flap with a red or orange edge and lack blue cheek lines. Redbreast have a long black flap and blue cheek lines.",
      },
    ],
    averageAdultLength: "South Carolina DNR: commonly 2–9 in. Virginia DWR: adults typically 3.5–8+ in.",
    commonAnglingSize: "5–8 in in warm rivers, creeks, and connected reservoirs.",
    typicalWeight: "South Carolina DNR: commonly 3–8 oz.",
    maximumDocumentedSize:
      "South Carolina DNR notes a state record of 2 lb (1975). Large fish exceed typical creek size. Maxima are waterbody-specific.",
    longevity: "South Carolina DNR / Virginia DWR: approximately 8 years.",
    sources: [
      {
        label: "North Carolina Wildlife Resources Commission redbreast sunfish profile (long narrow entirely black flap)",
        class: "agency",
        url: "https://www.ncwildlife.gov/species/redbreast-sunfish",
      },
      {
        label: "South Carolina DNR redbreast sunfish account (elongated body, long black lobe, cheek lines, diet, 65–75°F spawn)",
        class: "agency",
        url: "https://www.dnr.sc.gov/fish/species/redbreastsunfish.html",
      },
      {
        label: "Virginia DWR redbreast sunfish account (3 anal spines, faster-water use than many sunfish)",
        class: "agency",
        url: "https://dwr.virginia.gov/wildlife/information/redbreast-sunfish/",
      },
      {
        label: "Delaware DNREC Fish Facts redbreast sunfish (bluish-green cheek stripes to elongated black flap)",
        class: "agency",
      },
    ],
    ...R,
    gaps: [
      "native Atlantic-slope vs introduced interior morphometrics as a structured field",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "lepomis_gulosus",
    status: "reviewed",
    regionalNames: ["stumpknocker", "mud bass", "goggle-eye", "weed bass", "warmouth bass"],
    bodyShape:
      "Texas Parks and Wildlife: large-mouthed and heavy-bodied, somewhat larger than either rock bass or green sunfish with which it is often confused. Florida Museum: relatively thick compared with other sunfishes.",
    identificationTraits: [
      "Texas Parks and Wildlife: three anal spines, 10 dorsal spines, and small teeth present on the tongue. Rock bass have six anal spines and lack that tongue-tooth key.",
      "Florida Museum: upper jaw extends beyond the pupil of the eye. Three to five reddish-brown streaks radiate from the eyes (Texas Parks and Wildlife). FWC: three or four dark stripes radiating back from the eye across the cheek and gill cover.",
      "Adults dark and mottled brown; belly generally golden; gill flaps often red (Texas Parks and Wildlife). FWC: red eye and large mouth are conspicuous field marks.",
      "Males may show a bright orange spot at the base of the dorsal fin (Texas Parks and Wildlife). Virginia DWR: dark opercular flap with a small off-color margin that is often white and red.",
      "Texas Parks and Wildlife lists regional nicknames that collide with rock bass (goggle-eye, rock bass). Anal-spine count and tongue teeth split them. Do not collapse the two.",
    ],
    coloration:
      "Mottled tan to dark brown with gold on the belly and streaks through the eye. Color is a supporting mark; spines and tongue teeth are the key.",
    regionalColorVariation:
      "Southern fish often show the strongest red eye and cheek streaks. Turbid swamp fish can look uniformly dark until the mouth and anal spines are checked.",
    spawningColoration:
      "Texas Parks and Wildlife: when in breeding condition the males' eyes turn red. Virginia DWR: spawning individuals often have a peppering of green spots along the sides. Nesting is conservation context.",
    juvenileAppearance:
      "The large mouth and eye streaks appear early. Young warmouth can be confused with green sunfish until tongue teeth and mottling are checked.",
    adultAppearance:
      "A thick, large-mouthed, mottled sunfish with eye-streaks, often a red eye, three anal spines, and teeth on the tongue.",
    sexualDimorphism:
      "Texas Parks and Wildlife: males may show a bright orange spot at the base of the dorsal fin. Size overlap is large.",
    similarSpecies: [
      {
        speciesId: "ambloplites_rupestris",
        name: "Rock bass",
        distinction:
          "Texas Parks and Wildlife: the difference is the anal fin — warmouth have three spines, rock bass have six. Warmouth also have teeth on the tongue. Shared nicknames (goggle-eye) are not an ID.",
      },
      {
        speciesId: "lepomis_cyanellus",
        name: "Green sunfish",
        distinction:
          "Green sunfish also have a large mouth and a bass-like body, but they lack warmouth’s tongue teeth and the strong eye-streak / mottled-brown recipe. Texas Parks and Wildlife: hybridization with green sunfish is documented; a hybrid should not silently inherit this record.",
      },
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a small mouth, a round body, and a soft-dorsal spot. Warmouth mouths are large and the body is thick and mottled.",
      },
    ],
    averageAdultLength: "Texas Parks and Wildlife: commonly 4–10 in. Virginia DWR: quality specimens typically 6–8 in; can reach about 10 in.",
    commonAnglingSize: "5–8 in around wood, weeds, and swampy cover.",
    typicalWeight: "Often well under 1 lb; large fish occur in fertile cover.",
    maximumDocumentedSize:
      "Texas Parks and Wildlife: can grow to more than 12 in and weigh up to 2.25 lb. FWC notes a Florida state record of 2.44 lb. Maxima are waterbody-specific.",
    longevity: "Virginia DWR: up to 8 years.",
    sources: [
      {
        label: "Texas Parks and Wildlife warmouth account (tongue teeth, 3 anal / 10 dorsal spines, eye streaks, low-oxygen tolerance)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/war/",
      },
      {
        label: "Florida Fish and Wildlife Conservation Commission warmouth profile (red eye, war-paint cheek streaks, solitary nesting)",
        class: "agency",
        url: "https://myfwc.com/wildlifehabitats/profiles/freshwater/warmouth/",
      },
      {
        label: "Florida Museum warmouth species profile (jaw past pupil, dark lines from red eye)",
        class: "agency",
        url: "https://www.floridamuseum.ufl.edu/discover-fish/florida-fishes-gallery/warmouth/",
      },
      {
        label: "Virginia DWR warmouth account (solitary cover use, acidic swamp habitat)",
        class: "agency",
        url: "https://dwr.virginia.gov/wildlife/information/warmouth/",
      },
    ],
    ...R,
    gaps: [
      "hybrid meristics as a structured key",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "lepomis_megalotis",
    status: "reviewed",
    regionalNames: ["creek perch", "sun perch", "longear"],
    bodyShape:
      "Missouri DNR: deep-bodied, slab-sided, with a moderate-sized mouth, the upper jaw nearly reaching the front of the eye.",
    identificationTraits: [
      "Missouri DNR: the ear (gill) flap is elongated, black, and often bordered in white. Illinois DNR: the black flap on the gill cover is very long and white-edged.",
      "Missouri DNR / Illinois DNR: pectoral fin is rounded and short — not the long pointed bluegill or pumpkinseed pectoral.",
      "Missouri DNR: side of the head olive or light orange with sky-blue vermiculations (undulating, worm-like markings).",
      "Back and sides blue-green speckled with yellow and emerald; belly yellow or orange (Missouri DNR). Breeding males show a bright red-orange belly (Illinois DNR).",
      "The long flap is the namesake mark, but the white edge plus short rounded pectorals split this fish from redbreast, whose flap is entirely black.",
    ],
    coloration:
      "Blue-green sides speckled with yellow and emerald, orange or yellow belly, and a sky-blue maze on the cheek. Color intensifies on nesting males and is not the only key.",
    regionalColorVariation:
      "Ozark and clear-stream fish often show the strongest blue and orange. Turbid water washes the vermiculations until the flap and pectorals are checked.",
    spawningColoration:
      "Illinois DNR: breeding male has a bright red-orange belly. Missouri DNR: courting males tilt to display brightly colored sides. Colonial nests are conservation context.",
    juvenileAppearance:
      "The long flap and cheek vermiculations develop with size. Small fish can still be split from pumpkinseed once flap length is visible.",
    adultAppearance:
      "A slab-sided, short-pectoral sunfish with a very long, often white-edged black ear flap and sky-blue head markings.",
    sexualDimorphism:
      "Males intensify belly and side color on the nest. Size overlap is large; the flap, not color, is the key.",
    similarSpecies: [
      {
        speciesId: "lepomis_auritus",
        name: "Redbreast sunfish",
        distinction:
          "Redbreast flaps are entirely black and no wider than the eye; the body is more elongated. Longear flaps are often white-edged; pectorals are short and rounded; the body is deep and slab-sided.",
      },
      {
        speciesId: "lepomis_gibbosus",
        name: "Pumpkinseed",
        distinction:
          "Pumpkinseed have a short flap with a discrete red-orange spot and a white margin, plus long pectorals. Longear have a much longer, often white-edged flap and short rounded pectorals.",
      },
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a short plain black flap, a soft-dorsal spot, and long pointed pectorals. Longear have a very long white-edged flap and rounded pectorals.",
      },
      {
        speciesId: "lepomis_cyanellus",
        name: "Green sunfish",
        distinction:
          "Green sunfish have a large mouth and an elongated body. Longear mouths are moderate; the body is deep and slab-sided.",
      },
    ],
    averageAdultLength: "Missouri DNR: total length commonly 5–6 in. Illinois DNR: typically about 6–7 in.",
    commonAnglingSize: "4–7 in in clear rocky or sandy streams and connected pools.",
    typicalWeight: "Missouri DNR: maximum about 7 in and 4.5 oz in that account. Typical fish are lighter.",
    maximumDocumentedSize:
      "Large longear exceed the 5–7 in band in some waters but remain smaller than trophy bluegill or redear. Maxima are waterbody-specific.",
    longevity: "Missouri DNR: individuals can live for 6 years.",
    sources: [
      {
        label: "Missouri Department of Conservation longear sunfish field guide (white-edged elongated flap, rounded pectoral, vermiculations, size)",
        class: "agency",
        url: "https://mdc.mo.gov/discover-nature/field-guide/longear-sunfish",
      },
      {
        label: "Illinois Department of Natural Resources longear sunfish account (very long white-edged flap, short rounded pectorals)",
        class: "agency",
        url: "https://dnr.illinois.gov/education/wildaboutpages/wildaboutfishes/wafsunfish/waflongearsunfish.html",
      },
    ],
    ...R,
    gaps: [
      "eastern vs interior subspecies / form tables as a structured field",
      "a single continent-wide mean length",
    ],
  },
  {
    speciesId: "centrarchus_macropterus",
    status: "reviewed",
    regionalNames: ["flier sunfish"],
    bodyShape:
      "South Carolina DNR: the flier looks almost circular. Florida Museum: strongly compressed, deep body.",
    identificationTraits: [
      "South Carolina DNR: a distinct, large black teardrop-shaped marking below the eye. Florida Museum: a large black teardrop.",
      "South Carolina DNR: the most dorsal-fin spines of any sunfish, usually 11–13. Georgia DNR: long anal fin with 7–8 anal spines. Crappie have 5–8 dorsal spines and three anal spines — not this count.",
      "South Carolina DNR / Florida Museum: interrupted rows of black spots along the side. Georgia DNR: scales marked with a brown spot forming a series of horizontal lines.",
      "Young fliers have a dark spot outlined in an orange ring on the dorsal fin; these spots fade and disappear with age (South Carolina DNR). Do not use the juvenile dorsal spot as an adult key.",
      "Operculum lobe is black (South Carolina DNR). The body is olive green to silver, not a Lepomis ear-flap sunfish and not a Pomoxis speckle pattern.",
    ],
    coloration:
      "Olive green to silver with interrupted rows of dark spots and a black teardrop under the eye. Young fish may show an orange-ringed dorsal spot that adults lose.",
    regionalColorVariation:
      "Tannic coastal-plain water can darken the ground color. The teardrop and spine counts remain the key.",
    spawningColoration:
      "South Carolina DNR: spawning begins earlier than most sunfish, around March to May at about 55–65°F; males build and defend nests, often in groups. Grouped nests are conservation context.",
    juvenileAppearance:
      "South Carolina DNR: young have a dark spot outlined in an orange ring on the dorsal fin. That mark fades. The teardrop is already useful.",
    adultAppearance:
      "An almost circular, deep-bodied sunfish with a black teardrop under the eye, interrupted rows of dark spots, and more dorsal spines than a crappie.",
    sexualDimorphism:
      "Illinois DNR: females grow larger than males. Size overlap is still large; spines and the teardrop are the key.",
    similarSpecies: [
      {
        speciesId: "pomoxis_spp",
        name: "Crappie",
        distinction:
          "Crappie have 5–8 dorsal spines and a concave Pomoxis forehead, without a black teardrop under the eye. Fliers have 11–13 dorsal spines, 7–8 anal spines, and the teardrop. They are not this crappie complex.",
      },
      {
        speciesId: "lepomis_macrochirus",
        name: "Bluegill",
        distinction:
          "Bluegill have a small mouth, a dark ear flap, a soft-dorsal spot, and three anal spines. Fliers are almost circular, carry a teardrop, and have 11–13 dorsal spines.",
      },
      {
        speciesId: "lepomis_gulosus",
        name: "Warmouth",
        distinction:
          "Warmouth are thick, large-mouthed, and mottled, with tongue teeth and three anal spines. Fliers are round, teardrop-marked, and high-spined.",
      },
    ],
    averageAdultLength: "South Carolina DNR: average about 5 in. Illinois DNR: averages about 7 in.",
    commonAnglingSize: "4–7 in in vegetated coastal-plain backwater.",
    typicalWeight: "South Carolina DNR: average about 3 oz. Georgia DNR: most less than ½ lb.",
    maximumDocumentedSize:
      "South Carolina DNR notes a state record of 1 lb 4 oz (1977). Large fish remain small compared with adult crappie. Maxima are waterbody-specific.",
    longevity: "South Carolina DNR: approximately 8 years.",
    sources: [
      {
        label: "South Carolina DNR flier account (almost circular, teardrop, 11–13 dorsal spines, early 55–65°F spawn)",
        class: "agency",
        url: "https://www.dnr.sc.gov/fish/species/flier.html",
      },
      {
        label: "Georgia DNR freshwater fish identification (7–8 anal spines, horizontal scale-spot rows, sluggish lowland habitat)",
        class: "agency",
        url: "https://georgiawildlife.com/fishing/identification",
      },
      {
        label: "Florida Museum flier species profile (large black teardrop, interrupted rows of black spots)",
        class: "agency",
        url: "https://www.floridamuseum.ufl.edu/discover-fish/florida-fishes-gallery/flier/",
      },
      {
        label: "Illinois Department of Natural Resources flier account (teardrop, April spawn, vegetated low-current water)",
        class: "agency",
        url: "https://dnr.illinois.gov/education/wildaboutpages/wildaboutfishes/wafsunfish/wafflier.html",
      },
    ],
    ...R,
    gaps: [
      "a single continent-wide mean length",
      "black vs white crappie confusion tables by drainage",
    ],
  },
  {
    speciesId: "ictalurus_punctatus",
    status: "reviewed",
    regionalNames: ["channel cat", "catfish", "forked-tail cat"],
    bodyShape:
      "Elongate ictalurid with a deeply forked tail. Missouri DNR: the back from the dorsal fin forward is gently sloping and slightly rounded, less wedge-shaped than a blue catfish.",
    identificationTraits: [
      "Missouri DNR / Texas Parks and Wildlife: deeply forked tail — the split from bullheads and from flathead, which have a square or only slightly notched tail.",
      "Missouri DNR / Indiana DNR / North Carolina Wildlife: outer margin of the anal fin rounded outward (convex), usually 24–29 rays, with a relatively shorter anal-fin base than blue catfish.",
      "Scattered dark spots on the back and sides. Missouri DNR: spots are often absent in the smallest young and in large adults. Spots are not a blue-catfish mark.",
      "Texas Parks and Wildlife: upper jaw projects beyond the lower jaw. Flathead have the reverse — a projecting lower jaw.",
      "Olive-brown to slate-blue back and sides, silvery-white belly. Breeding males may darken and show a swollen, knobby head (Missouri DNR). Color is not the species key by itself.",
    ],
    coloration:
      "Olive-brown to slate-blue with a white belly. Small and mid-size fish usually show roundish black spots; large adults often lose them.",
    regionalColorVariation:
      "Turbid prairie rivers produce paler, less spotted fish. Clearer streams hold more contrast. Color is not a native-versus-stocked key.",
    spawningColoration:
      "Missouri DNR: breeding males a deep blue-black on the back and sides, head swollen and knobby, lips thickened. That is a reproductive state, not a targeting cue.",
    juvenileAppearance:
      "Young fish are often steel-gray and peppered with dark spots (Minnesota DNR). They already have a forked tail and are not square-tailed bullheads.",
    adultAppearance:
      "A spotted-or-plain, deeply forked-tail catfish with a rounded anal fin of 24–29 rays — not a blue, not a flathead, not a bullhead.",
    sexualDimorphism:
      "Missouri DNR: nesting males darken and the head swells. Size overlap is large; the anal fin, not color, is the key.",
    similarSpecies: [
      {
        speciesId: "ictalurus_furcatus",
        name: "Blue catfish",
        distinction:
          "Blue catfish also have a deeply forked tail but a straight-edged anal fin with 30 or more rays, a longer anal-fin base, a more wedge-shaped nape, and (except the Rio Grande population noted by Texas Parks and Wildlife) no dark spots. Channel catfish have a convex anal fin of 24–29 rays and usually carry spots until large.",
      },
      {
        speciesId: "pylodictis_olivaris",
        name: "Flathead catfish",
        distinction:
          "Flathead have a broad flattened head, a projecting lower jaw, a square to slightly notched tail, and 14–17 anal rays. Channel catfish have a forked tail and an overbite.",
      },
      {
        speciesId: "ameiurus_catus",
        name: "White catfish",
        distinction:
          "White catfish are an Ameiurus: moderately forked tail with rounded lobes, a wider head and mouth, 18–24 anal rays, and light chin barbels. Channel catfish are more slender, more deeply forked, and usually spotted when young.",
      },
      {
        speciesId: "ameiurus_nebulosus",
        name: "Brown bullhead",
        distinction:
          "Bullheads have a square to slightly notched tail, not a deep fork. Channel catfish are not pond bullheads.",
      },
    ],
    averageAdultLength: "Missouri DNR: commonly 12–32 in. Minnesota DNR: stream fish often much smaller than lake-stocked fish.",
    commonAnglingSize: "12–24 in in rivers, reservoirs, and ponds.",
    typicalWeight: "Minnesota DNR: commonly 1–10 lb and rarely exceeds 20 lb in many waters. Missouri DNR: commonly 1–15 lb.",
    maximumDocumentedSize:
      "Missouri DNR: specimens as large as 45 lb are uncommon there. Texas Parks and Wildlife: fish in excess of 36 lb have been landed in Texas. Maxima are waterbody-specific and are not a blue-catfish number.",
    longevity:
      "Missouri DNR: mature at about 4–5 years or 12–15 in; lifespan usually does not exceed 6 or 7 years, though some live more than 10. Texas Parks and Wildlife: natural populations mature at 3–6 years.",
    sources: [
      {
        label: "Missouri Department of Conservation channel catfish field guide (forked tail, convex anal 24–29 rays, spots, cavity spawn)",
        class: "agency",
        url: "https://mdc.mo.gov/discover-nature/field-guide/channel-catfish",
      },
      {
        label: "Texas Parks and Wildlife channel catfish account (forked tail, 24–29 anal rays, overbite, omnivory)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/ccf/",
      },
      {
        label: "North Carolina Wildlife channel catfish account (rounded anal 24–29 vs blue 30–36 straight)",
        class: "agency",
        url: "https://www.ncwildlife.gov/species/channel-catfish",
      },
      { label: "Indiana DNR catfish identification (channel vs blue anal-fin shape and ray counts)", class: "agency" },
      { label: "Minnesota DNR catfish biology (forked tail, spots fade with age, size band)", class: "agency" },
    ],
    ...R,
    gaps: [
      "stocked-pond vs large-river mean length tables",
    ],
  },
  {
    speciesId: "ictalurus_furcatus",
    status: "reviewed",
    regionalNames: ["blue cat", "forked-tail cat", "humpback blue"],
    bodyShape:
      "Heavy-bodied Ictalurus with a deeply forked tail. Virginia DWR: wide head and a dorsal hump — deepest just in front of the dorsal fin. Missouri DNR: more distinctly wedge-shaped nape than channel catfish.",
    identificationTraits: [
      "Deeply forked tail, shared with channel catfish and not with flathead or bullheads.",
      "Indiana DNR / North Carolina Wildlife / Texas Parks and Wildlife: anal fin straight-edged (not rounded), 30–36 rays, relatively long base, tapering like a barber’s comb or razor. Channel catfish have a convex anal fin of 24–29 rays.",
      "Body without dark spots. Texas Parks and Wildlife: only the Rio Grande population has dark spots on the back and sides. Do not use spots as a universal blue-catfish mark.",
      "Slate blue on the back, shading to white on the belly (Texas Parks and Wildlife / North Carolina Wildlife). NOAA Fisheries: four pairs of barbels around the mouth.",
      "USGS NAS / Virginia DWR: native to the Mississippi–Missouri–Ohio and Gulf drainages. Chesapeake and many Atlantic-slope populations are introduced; Virginia DWR and NOAA treat Chesapeake tributary populations as invasive. Status is jurisdiction-specific and is not a targeting endorsement.",
    ],
    coloration:
      "Slate-blue to silvery-blue back, white belly, usually unspotted. Large fish can look uniformly steel-blue.",
    regionalColorVariation:
      "Texas Parks and Wildlife: the Rio Grande population can show dark spots. Turbid large-river fish look paler. Color is not a native-versus-introduced key.",
    spawningColoration:
      "Cavity spawning as water holds in the low-to-mid 70s. Nesting is conservation context, not a place to target.",
    juvenileAppearance:
      "Young already lack the channel-catfish spot recipe (except the Rio Grande note). The straight anal-fin margin is the split even at small size.",
    adultAppearance:
      "A large, usually unspotted, deeply forked-tail catfish with a straight, long anal fin of 30 or more rays — not a channel catfish and not a flathead.",
    sexualDimorphism:
      "Virginia DWR: both sexes tend the nest, males as primary caretakers. Size overlap is large; the anal fin is the key.",
    similarSpecies: [
      {
        speciesId: "ictalurus_punctatus",
        name: "Channel catfish",
        distinction:
          "Channel catfish have a rounded (convex) anal fin of 24–29 rays, a shorter anal-fin base, a gentler nape, and usually dark spots until large. Blue catfish have a straight anal fin of 30 or more rays and usually no spots.",
      },
      {
        speciesId: "pylodictis_olivaris",
        name: "Flathead catfish",
        distinction:
          "Flathead have a flattened head, a projecting lower jaw, a square to slightly notched tail, and 14–17 anal rays. Blue catfish are forked-tailed Ictalurus with an overbite.",
      },
      {
        speciesId: "ameiurus_catus",
        name: "White catfish",
        distinction:
          "Virginia DWR: white catfish have a more emarginate (less forked) caudal fin, a rounded anal fin, a bulbous head, and in Virginia typically do not exceed 15 in. They are an Ameiurus, not a large-river blue catfish.",
      },
    ],
    averageAdultLength: "North Carolina Wildlife: commonly reach 36 in. NOAA Fisheries: adults usually less than 2 ft, with much larger fish documented.",
    commonAnglingSize: "20–40 in in large rivers and reservoirs where the species is established.",
    typicalWeight: "Texas Parks and Wildlife: commonly 20–40 lb in waters that grow large fish. Many fisheries see much smaller averages.",
    maximumDocumentedSize:
      "Texas Parks and Wildlife: may reach well in excess of 100 lb. Virginia DWR cites a 143 lb record fish. USGS NAS: to about 165 cm. Historical Mississippi-River maxima are not a current-waterbody promise.",
    longevity: "Virginia DWR: average life span about 9–10 years; maximum about 25 years.",
    sources: [
      {
        label: "Texas Parks and Wildlife blue catfish account (30–35 anal rays, unspotted except Rio Grande, large-river habitat)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/blc/",
      },
      {
        label: "Texas Parks and Wildlife catfish comparison (straight anal 30–36 rays, no spots)",
        class: "agency",
        url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/freshwater-fishing/catfish-identification",
      },
      {
        label: "North Carolina Wildlife blue catfish account (straight anal 30–36 rays, invasive in NC, piscivorous when large)",
        class: "agency",
        url: "https://www.ncwildlife.gov/species/blue-catfish",
      },
      {
        label: "Virginia DWR blue catfish account (straight anal, dorsal hump, Chesapeake introduced/invasive status, omnivory to piscivory)",
        class: "agency",
        url: "https://dwr.virginia.gov/wildlife/information/blue-catfish/",
      },
      {
        label: "USGS Nonindigenous Aquatic Species blue catfish profile (native vs introduced range, anal-fin shape vs channel)",
        class: "agency",
        url: "https://nas.er.usgs.gov/queries/FactSheet.aspx?SpeciesID=740",
      },
      { label: "NOAA Fisheries blue catfish species page (Chesapeake invasive context, large-river habitat)", class: "agency" },
      { label: "Indiana DNR catfish identification (straight anal 30–35 rays, barber’s-comb edge)", class: "agency" },
    ],
    ...R,
    gaps: [
      "Rio Grande spotted-population meristics as a structured field",
      "Chesapeake vs native-range mean size tables",
    ],
  },
  {
    speciesId: "pylodictis_olivaris",
    status: "reviewed",
    regionalNames: ["flathead", "mud cat", "shovelhead", "yellow cat", "opelousas cat"],
    bodyShape:
      "Broad, flattened head with small eyes on top and a projecting lower jaw (Missouri DNR / Texas Parks and Wildlife). Body deeper and more mottled than a forked-tail Ictalurus of the same length.",
    identificationTraits: [
      "Missouri DNR: lower jaw projects far beyond the upper jaw except in the smallest young. Channel and blue catfish have the reverse overbite.",
      "Tail mostly squared off with a slight notch — not deeply forked (Missouri DNR / Texas Parks and Wildlife / Indiana DNR).",
      "Missouri DNR / Indiana DNR: anal fin rounded, 14–17 rays — far fewer than channel or blue.",
      "Body often strongly mottled with brown or black. Texas Parks and Wildlife: pale yellow to light brown, highly mottled; young may be almost black. Mottling can be weak in turbid-water adults (Missouri DNR).",
      "Missouri DNR: upper tip of the tail fin lighter than the rest of the fin; adipose a free lobe widely separate from the tail. Those are supporting marks, not the only key.",
    ],
    coloration:
      "Pale yellow to olive-brown, mottled with darker brown or black, cream to yellow belly. Young can be nearly black.",
    regionalColorVariation:
      "Clear rivers hold stronger mottling. Turbid large-river adults can look plain brown. Color is not a native-versus-introduced key.",
    spawningColoration:
      "Late-spring to summer cavity nesting. Nesting is conservation context, not a place to target.",
    juvenileAppearance:
      "Missouri DNR: young often on riffles among rocks. The flattened head and underbite develop early. They are not madtoms and not channel-cat fry.",
    adultAppearance:
      "A mottled, flat-headed catfish with a projecting lower jaw and a square, slightly notched tail — a shovelhead, not a forked-tail Ictalurus.",
    sexualDimorphism:
      "Males guard eggs and fry. Size overlap is large; jaw and tail, not color, are the key.",
    similarSpecies: [
      {
        speciesId: "ictalurus_punctatus",
        name: "Channel catfish",
        distinction:
          "Channel catfish have a deeply forked tail, an overbite, and 24–29 anal rays. Flathead have a square tail, an underbite, and 14–17 anal rays.",
      },
      {
        speciesId: "ictalurus_furcatus",
        name: "Blue catfish",
        distinction:
          "Blue catfish are forked-tailed, usually unspotted, with a straight anal fin of 30 or more rays. Flathead are mottled, square-tailed, and under-jawed.",
      },
      {
        speciesId: "ameiurus_natalis",
        name: "Yellow bullhead",
        distinction:
          "Yellow bullhead are small square-tailed Ameiurus with white chin barbels. They are not a 20–40 in shovelhead. Do not collapse ‘yellow cat’ nicknames.",
      },
    ],
    averageAdultLength: "Missouri DNR: commonly 15–45 in. National Park Service / Minnesota DNR: often larger-bodied than sympatric channel catfish.",
    commonAnglingSize: "18–36 in in large rivers and reservoirs with wood and deep pools.",
    typicalWeight: "Missouri DNR: commonly 1–45 lb in the documented adult band. Texas Parks and Wildlife: 50-pounders are not unusual where mature populations exist.",
    maximumDocumentedSize:
      "Missouri DNR / Texas Parks and Wildlife / Minnesota DNR: about 100 lb class, with larger commercial reports. Maxima are waterbody-specific.",
    longevity:
      "Texas Parks and Wildlife: average lifespan 12–14 years; one recorded fish lived 24 years. Mature at about 4–5 years or about 18 in (Missouri DNR).",
    sources: [
      {
        label: "Missouri Department of Conservation flathead catfish field guide (flattened head, underbite, square tail, 14–17 anal rays, solitary cover)",
        class: "agency",
        url: "https://mdc.mo.gov/discover-nature/field-guide/flathead-catfish",
      },
      {
        label: "Texas Parks and Wildlife flathead catfish account (projecting lower jaw, slightly notched tail, live-fish diet)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/catfish/",
      },
      { label: "Indiana DNR catfish identification (square tail, 14–17 anal rays, mottling)", class: "agency" },
      { label: "Minnesota DNR catfish biology (largest native MN catfish, live-fish diet, cavity spawn)", class: "agency" },
      { label: "USGS Nonindigenous Aquatic Species flathead catfish profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "introduced-range vs native-range mean length tables",
    ],
  },
  {
    speciesId: "ameiurus_catus",
    status: "reviewed",
    regionalNames: ["white cat", "white bullhead"],
    bodyShape:
      "Stockier than a channel catfish of the same length, with a broader, more bulbous head (Connecticut DEEP / Virginia DWR). Tail moderately forked with rounded lobes — deeper than a bullhead, shallower than a channel.",
    identificationTraits: [
      "Connecticut DEEP: tail fin forked; upper lobe may be slightly longer than the lower; lobes rounded rather than the pointed lobes of channel catfish. Virginia DWR: more emarginate (less forked) than blue catfish.",
      "Connecticut DEEP: anal fin shorter than channel catfish, 18–24 rays. Channel catfish 24–29; blue catfish 30 or more.",
      "Connecticut DEEP: chin barbels light. Chesapeake Bay Program: white chin with barbels. That is a bullhead-family mark, not a channel-catfish mark.",
      "Connecticut DEEP: head and mouth generally larger and wider than channel catfish; no black spots on young fish; outer edges of adult eyes often blue.",
      "Virginia DWR: in Virginia they typically do not exceed 15 in. They are an Ameiurus, not a small channel catfish and not a yellow bullhead.",
    ],
    coloration:
      "Connecticut DEEP: typically dark gray, sometimes brownish on the back, fading to light gray on the sides and white on the belly.",
    regionalColorVariation:
      "Coastal-river fish can look bluish-gray (Chesapeake Bay Program). Pond fish look duskier. Color is not a tidal-versus-freshwater key, and this record does not cover saltwater.",
    spawningColoration:
      "Late-spring to summer cavity or depression spawning around banks, roots, and structure. Guarded nests are not target cues.",
    juvenileAppearance:
      "Connecticut DEEP: no black spots on young fish — a practical split from young channel catfish. The moderate fork and wide head are already visible.",
    adultAppearance:
      "A gray, wide-headed Ameiurus with a moderately forked, round-lobed tail and light chin barbels — not a channel catfish and not a square-tailed pond bullhead.",
    sexualDimorphism:
      "Size overlap is large. Head width, anal-ray count, and tail fork, not color, are the key.",
    similarSpecies: [
      {
        speciesId: "ictalurus_punctatus",
        name: "Channel catfish",
        distinction:
          "Channel catfish are more slender, more deeply forked with pointed tail lobes, usually spotted when young, and have 24–29 anal rays. White catfish have a wider head, 18–24 anal rays, light chin barbels, and no juvenile spots.",
      },
      {
        speciesId: "ameiurus_natalis",
        name: "Yellow bullhead",
        distinction:
          "Yellow bullhead have white chin barbels like white catfish, but a square to slightly rounded, un-notched tail. White catfish have a moderately forked tail.",
      },
      {
        speciesId: "ictalurus_furcatus",
        name: "Blue catfish",
        distinction:
          "Virginia DWR: blue catfish are deeply forked with a straight anal fin and a dorsal hump. White catfish are a small, rounded-head Ameiurus with a less forked tail.",
      },
      {
        speciesId: "ameiurus_nebulosus",
        name: "Brown bullhead",
        distinction:
          "Brown bullhead have dark chin barbels and a square to slightly notched tail. White catfish have light chin barbels and a moderate fork.",
      },
    ],
    averageAdultLength: "Connecticut DEEP: commonly 8–17 in. Virginia DWR: in Virginia typically do not exceed 15 in.",
    commonAnglingSize: "8–16 in in coastal rivers, reservoirs, and slow tributaries.",
    typicalWeight: "Usually well under 3 lb. They are not a blue-catfish weight class.",
    maximumDocumentedSize:
      "Connecticut DEEP: state survey max 21.7 in; max reported size 37 in; listed world record 18.9 lb. Those maxima are not typical.",
    sources: [
      {
        label: "Connecticut DEEP white catfish account (forked rounded lobes, 18–24 anal rays, wide head, light chin barbels)",
        class: "agency",
        url: "https://portal.ct.gov/deep/fishing/freshwater/freshwater-fishes-of-connecticut/white-catfish",
      },
      {
        label: "Virginia DWR blue catfish account (white catfish comparison: emarginate tail, rounded anal, bulbous head, ≤15 in in VA)",
        class: "agency",
        url: "https://dwr.virginia.gov/wildlife/information/blue-catfish/",
      },
      {
        label: "Chesapeake Bay Program white catfish field guide (white chin barbels, moderately forked rounded lobes, omnivory)",
        class: "agency",
        url: "https://www.chesapeakebay.net/discover/field-guide/entry/white-catfish",
      },
      { label: "Smithsonian NEMESIS white catfish summary (broad head, omnivory, sluggish habitat)", class: "agency" },
    ],
    ...R,
    gaps: [
      "a single continent-wide mean length",
      "exact spawn-temperature table with primary-source support",
    ],
  },
  {
    speciesId: "oncorhynchus_tshawytscha",
    status: "reviewed",
    regionalNames: ["king", "kings", "tyee", "blackmouth", "chinook"],
    bodyShape:
      "The largest Pacific salmon: deep-bodied, heavy-shouldered, with a thick caudal peduncle. Caudal fin moderately forked. Not a trout body.",
    identificationTraits: [
      "NOAA: black pigment along the gum line, thus the nickname blackmouth. Oregon DFW: the lower jaw is a uniform dark coloration (in some cases mottled). Gum line on the LOWER jaw is the enforcement split from coho.",
      "NOAA: black spots on the upper half of the body and on both lobes of the tail fin.",
      "Oregon DFW: do not rely on ocean-phase body color or spots alone — all ocean salmon are primarily silver, and spots vary within and between species. Use the lower-jaw gum line.",
      "NOAA: typical mature length and weight about 3 ft and 30 lb; can grow as long as 4.9 ft and up to 129 lb.",
      "Semelparous Pacific salmon (all die after spawning). Do not treat as steelhead. Great Lakes fish belong on this record, not on coho or inland trout.",
    ],
    coloration:
      "Ocean and Great Lakes phase: metallic green-blue over silver. Freshwater adults darken toward olive, maroon, or brown. Color is not the gum-line key and is not a targeting cue.",
    regionalColorVariation:
      "Pacific ocean-bright fish are silver until freshwater residence. Great Lakes fish share the gum-line and tail-spot characters. Color does not split Pacific from Great Lakes.",
    spawningColoration:
      "Adults darken; males kype. NOAA: all Chinook salmon die after spawning. Color change is biology, not a targeting cue.",
    juvenileAppearance:
      "Parr in natal streams are not an adult targeting proxy. Young fish do not carry the adult blackmouth gum-line key as a field default.",
    adultAppearance:
      "A large, black-gummed Pacific salmon with spots on both tail lobes. Size supports the ID; gum line decides it against coho.",
    sexualDimorphism:
      "Spawning males kype and deepen. Jacks (early-returning males) occur and are smaller; they are still this record.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_kisutch",
        name: "Coho salmon",
        distinction:
          "Oregon DFW: coho lower jaw shows a dark-light-dark band at the tooth base; Chinook is uniform dark. NOAA: coho have a lighter gumline and spots on the upper tail lobe only. Chinook spots both lobes and are typically much larger.",
      },
      {
        speciesId: "oncorhynchus_nerka_anadromous",
        name: "Sockeye salmon",
        distinction:
          "Sockeye lack large black spots on back and tail. Chinook are spotted on both tail lobes and have black gums. Do not collapse a large unspotted red/green spawner into Chinook.",
      },
      {
        speciesId: "oncorhynchus_mykiss_steelhead",
        name: "Steelhead",
        distinction:
          "Steelhead are iteroparous anadromous rainbow trout, not blackmouth salmon. They lack the Chinook black gum line as a salmon key and can spawn more than once (NOAA).",
      },
      {
        speciesId: "oncorhynchus_gorbuscha",
        name: "Pink salmon",
        distinction:
          "Pink are much smaller (ADF&G: 3.5–5 lb, 20–25 in) with large oval spots on the entire tail, very small scales, and no silver on the tail. Chinook are the large blackmouth.",
      },
    ],
    averageAdultLength: "NOAA: typical mature about 3 ft. Common returning adults often 28–40 in depending on stock.",
    commonAnglingSize: "28–40 in in many Pacific and Great Lakes fisheries.",
    typicalWeight: "NOAA: typical mature about 30 lb. Many fisheries see smaller adults; stock means vary.",
    maximumDocumentedSize:
      "NOAA: as long as 4.9 ft and up to 129 lb. Those maxima are not typical and are not a Great Lakes mean.",
    longevity:
      "NOAA: sexually mature between ages 2 and 7, typically 3 or 4 when they return; all die after spawning.",
    sources: [
      { label: "NOAA Fisheries Chinook Salmon species profile (black gums / blackmouth, spots on both tail lobes, typical 3 ft / 30 lb, ESA counts)", class: "agency", url: "https://www.fisheries.noaa.gov/species/chinook-salmon" },
      { label: "Oregon Department of Fish and Wildlife Chinook vs coho gum-line key (lower-jaw uniform dark vs banding; enforcement character)", class: "agency", url: "https://myodfw.com/articles/it-coho-or-chinook" },
      { label: "Healey chinook life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "stock-specific mean length tables",
      "ocean vs Great Lakes appearance as a structured split",
    ],
  },
  {
    speciesId: "oncorhynchus_kisutch",
    status: "reviewed",
    regionalNames: ["silver", "silvers", "coho"],
    bodyShape:
      "A medium Pacific salmon, slimmer and typically much smaller than Chinook, with a more moderate caudal peduncle. Not a steelhead trout body.",
    identificationTraits: [
      "NOAA: the gumline in the lower jaw has lighter pigment than on Chinook salmon. California DFW: gums of the lower jaw are usually gray except the upper area at the base of the teeth, which is white.",
      "Oregon DFW: lower jaw shows a distinct banding pattern — dark outside the teeth, white or very light at the base of the teeth, dark inside. Gum line on the LOWER jaw is the enforcement split from Chinook.",
      "NOAA: small black spots on the back and on the upper lobe of the tail while in the ocean. California DFW: no spots on the lower lobe of the caudal fin.",
      "Oregon DFW: do not rely on ocean-phase spots or body color alone. All ocean salmon are primarily silver.",
      "NOAA: adult coho usually weigh 8 to 12 lb and are 24 to 30 in long. They are not a Chinook size class.",
    ],
    coloration:
      "Ocean and Great Lakes phase: bright silver with a metallic blue-green back. Freshwater adults may show maroon or dark sides. Color is not the gum-line key.",
    regionalColorVariation:
      "California, Pacific Northwest, Alaska, and Great Lakes fish share the white-at-tooth-base gum character. Geography is not read from color. California ESUs are listed; that is status, not a color key.",
    spawningColoration:
      "Adults darken; males may show red-maroon sides and a kype. NOAA: all coho salmon die after spawning. Color is not a targeting cue.",
    juvenileAppearance:
      "NOAA: while in fresh water, young coho feed on plankton and insects. Parr are not an adult targeting proxy.",
    adultAppearance:
      "A medium silver salmon with a lighter/white gum line at the tooth base and spots on the upper tail lobe only.",
    sexualDimorphism:
      "Spawning males kype and deepen. Size overlap with females is large; gum line, not sex, is the field key.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_tshawytscha",
        name: "Chinook salmon",
        distinction:
          "Chinook have a uniform dark lower jaw / black gums and spots on both tail lobes, and are typically much larger. Coho have the dark-light-dark gum band and upper-lobe-only tail spots (Oregon DFW / NOAA / California DFW).",
      },
      {
        speciesId: "oncorhynchus_nerka_anadromous",
        name: "Sockeye salmon",
        distinction:
          "Sockeye tails are unspotted and the spawning dress is red body / green head. Coho have upper-lobe tail spots and a white gum line at the tooth base.",
      },
      {
        speciesId: "oncorhynchus_mykiss_steelhead",
        name: "Steelhead",
        distinction:
          "Steelhead are iteroparous trout (NOAA: they can spawn more than once). Coho are semelparous Pacific salmon with the white-at-tooth-base gum line.",
      },
      {
        speciesId: "oncorhynchus_gorbuscha",
        name: "Pink salmon",
        distinction:
          "Pink have large oval spots on both tail lobes, very small scales, and no silver on the tail. Coho spots are small and restricted to the upper tail lobe.",
      },
    ],
    averageAdultLength: "NOAA: 24–30 in. California DFW (Moyle): spawning adults typically 55–70 cm fork length.",
    commonAnglingSize: "22–30 in in many Pacific and Great Lakes fisheries.",
    typicalWeight: "NOAA: 8–12 lb. California DFW (Moyle): 3–6 kg for spawning adults.",
    maximumDocumentedSize:
      "Oregon DFW notes coho have been observed in the 25–30 lb range. Those fish are not typical and do not convert the record into Chinook.",
    longevity:
      "NOAA: about 1½ years feeding in the ocean, then return; all die after spawning.",
    sources: [
      { label: "NOAA Fisheries Coho Salmon species profile (lighter gumline, upper-lobe tail spots, 8–12 lb / 24–30 in, ESA counts)", class: "agency", url: "https://www.fisheries.noaa.gov/species/coho-salmon" },
      { label: "Oregon Department of Fish and Wildlife Chinook vs coho gum-line key (dark-light-dark banding; lower-jaw enforcement character)", class: "agency", url: "https://myodfw.com/articles/it-coho-or-chinook" },
      { label: "California DFW Coho Salmon conservation profile (white at tooth base, no lower-tail spots, California listing)", class: "agency", url: "https://wildlife.ca.gov/Conservation/Fishes/Coho-Salmon" },
      { label: "Sandercock coho life history", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "stock-specific mean length tables",
      "ocean vs Great Lakes appearance as a structured split",
    ],
  },
  {
    speciesId: "oncorhynchus_gorbuscha",
    status: "reviewed",
    regionalNames: ["pink", "humpy", "humpback", "humpback salmon"],
    bodyShape:
      "The smallest North American Pacific salmon. Ocean fish are relatively slender; spawning males develop a very large dorsal hump. Caudal fin with large oval spots on both lobes.",
    identificationTraits: [
      "Alaska DFG ocean-phase key: large oval spots on both lobes of the tail; large black spots on the back; no silver on the tail; very small scales compared with other salmon of similar size.",
      "Alaska DFG: mouth is white with a black gum line; very small or almost no teeth; no teeth on the tongue; pointed lower jaw.",
      "NOAA: large dark oval spots on the back and the entire tail fin. Males develop a hump on their back — the humpy name.",
      "Alaska DFG / NOAA: smallest Pacific salmon in North America, averaging 3.5–5 lb and 20–25 in.",
      "Two-year life cycle with independent odd-year and even-year populations (NOAA). That cycle is biology, not an abundance claim from habitat.",
    ],
    coloration:
      "Alaska DFG: ocean adults bright greenish-blue on top and silvery on the sides. Approaching fresh water, males turn brown to black on the back with a bright white belly; females olive with dusky bars or patches.",
    regionalColorVariation:
      "NOAA: in the southern part of the range they usually spawn in odd years in most river systems; some even-year runs occur. Northwestern Alaska even-year runs can predominate. Color does not read the cycle.",
    spawningColoration:
      "Males develop a very large hump and hooked jaws. NOAA: all pink salmon die after they spawn. Color and hump are not targeting cues.",
    juvenileAppearance:
      "Alaska DFG: young pink salmon are completely silver without dark vertical bars or spots. They move quickly toward estuary and ocean; they are not an adult targeting proxy.",
    adultAppearance:
      "A small Pacific salmon with large oval spots on the entire tail, very small scales, and no silver on the tail. Spawning males are the humpy.",
    sexualDimorphism:
      "Males develop the large hump and kype. Females remain more fusiform with olive and dusky bars. Both die after spawning.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_keta",
        name: "Chum salmon",
        distinction:
          "Chum have no dark spots on back or tail and show silver streaks along the tail-fin rays (Alaska DFG). Pink have large oval spots on both tail lobes, no silver on the tail, and very small scales. Chum are also much larger.",
      },
      {
        speciesId: "oncorhynchus_tshawytscha",
        name: "Chinook salmon",
        distinction:
          "Chinook are the large blackmouth with spots on both tail lobes but ordinary salmon scales and a heavy body. Pink are small, oval-spotted, small-scaled, and lack silver on the tail.",
      },
      {
        speciesId: "oncorhynchus_kisutch",
        name: "Coho salmon",
        distinction:
          "Coho have small spots on the upper tail lobe only and a white band at the tooth base. Pink spots are large ovals on the entire tail.",
      },
    ],
    averageAdultLength: "Alaska DFG / NOAA: 20–25 in (Alaska DFG fast facts also 18–25 in).",
    commonAnglingSize: "18–25 in in coastal river fisheries where harvest is lawful.",
    typicalWeight: "Alaska DFG / NOAA: 3.5–5 lb (fast facts 3–5.5 lb).",
    maximumDocumentedSize:
      "Occasional larger fish occur; they remain far below Chinook and typical chum size. Maxima are not a continent-wide catalog number.",
    longevity:
      "Alaska DFG: shortest Pacific salmon lifespan in North America; they mature and complete the entire life cycle in two years. NOAA: typically spawn at age 2.",
    sources: [
      { label: "Alaska Department of Fish and Game Pink Salmon species profile (ocean-phase ID, small scales, no silver on tail, adults do not eat in freshwater, two-year cycle)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=pinksalmon.main" },
      { label: "NOAA Fisheries Pink Salmon species profile (oval spots on entire tail, 3.5–5 lb / 20–25 in, odd/even year structure)", class: "agency", url: "https://www.fisheries.noaa.gov/species/pink-salmon" },
    ],
    ...R,
    gaps: [
      "odd-year vs even-year mean size as a structured split",
    ],
  },
  {
    speciesId: "oncorhynchus_keta",
    status: "reviewed",
    regionalNames: ["chum", "dog salmon", "calico salmon", "keta"],
    bodyShape:
      "A large Pacific salmon, second only to Chinook in typical size (Alaska DFG). More slab-sided than coho; spawning males develop enlarged canine-like teeth.",
    identificationTraits: [
      "Alaska DFG: unlike Chinook, coho, pink, and steelhead, chum salmon have no dark spots on their back or tail. Tiny speckles may be present and are not those large spots.",
      "Alaska DFG: the tail has silver streaks along (but not between) the fin rays — a split from sockeye, which lack those silver streaks.",
      "NOAA: spawning males develop enormous canine-like fangs and a striking calico pattern, with a bold jagged reddish line on the front of the flank and a jagged black line aft. Both sexes can show a tiger-stripe pattern of bold red and black.",
      "Alaska DFG: average 24–28 in and 10–13 lb. NOAA: can grow up to 3.6 ft and 30–35 lb; average weight 8–15 lb. They are not pinks.",
      "Hood Canal summer-run and Columbia River ESUs are federally threatened (NOAA). That is conservation status, not a field-ID key and not a target.",
    ],
    coloration:
      "Alaska DFG: ocean-stage fish metallic bluish-green along the back with a silvery side. Freshwater adults take on calico or tiger-stripe marks. Color is not a targeting cue.",
    regionalColorVariation:
      "Calico intensity varies by maturity and sex. Listed Pacific ESUs are a status overlay; appearance does not declare listing.",
    spawningColoration:
      "Calico / tiger stripes; males with canine-like fangs. NOAA: they spawn from late summer to March, with peak spawning concentrated in early winter. Color change is biology, not a targeting cue.",
    juvenileAppearance:
      "NOAA: when juvenile chum are about to migrate to sea they lose parr marks and gain the dark-back / light-belly of open water. Juveniles are not an adult targeting proxy.",
    adultAppearance:
      "An unspotted Pacific salmon with silver on the tail-fin rays. Spawning fish may be calico. They are not pinks and not sockeye.",
    sexualDimorphism:
      "Males develop the fangs and stronger calico marks and are usually larger than females (Alaska DFG). Both sexes can show bars.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_gorbuscha",
        name: "Pink salmon",
        distinction:
          "Pink have large oval spots on both tail lobes, very small scales, and no silver on the tail. Chum have no dark spots and silver streaks along the tail rays, and they are much larger.",
      },
      {
        speciesId: "oncorhynchus_nerka_anadromous",
        name: "Sockeye salmon",
        distinction:
          "Both can lack large black spots. Alaska DFG: chum have silver streaks along the tail-fin rays; sockeye do not. Sockeye spawning dress is red body / green head, not calico bars.",
      },
      {
        speciesId: "oncorhynchus_tshawytscha",
        name: "Chinook salmon",
        distinction:
          "Chinook have black gums and black spots on both tail lobes. Chum have no dark spots on back or tail.",
      },
      {
        speciesId: "oncorhynchus_kisutch",
        name: "Coho salmon",
        distinction:
          "Coho have small spots on the upper tail lobe and a white band at the tooth base. Chum are unspotted with silver on the tail rays.",
      },
    ],
    averageAdultLength: "Alaska DFG: 24–28 in. NOAA working range extends toward 3.6 ft at the documented maximum.",
    commonAnglingSize: "24–30 in in lawful coastal fisheries.",
    typicalWeight: "Alaska DFG: 10–13 lb. NOAA: average 8–15 lb.",
    maximumDocumentedSize:
      "NOAA: 30–35 lb class at 3.6 ft. Those maxima are not typical and are not a pink-salmon number.",
    longevity:
      "Anadromous; NOAA notes spawning from late summer into March depending on population. All die after spawning. Age is stock-specific.",
    sources: [
      { label: "NOAA Fisheries Chum Salmon species profile (calico / tiger stripes, size, two threatened ESUs, spawn timing)", class: "agency", url: "https://www.fisheries.noaa.gov/species/chum-salmon" },
      { label: "NOAA Fisheries Chum Salmon protected-ESU profile (Hood Canal summer-run and Columbia River threatened ESUs)", class: "agency" },
      { label: "Alaska Department of Fish and Game Chum Salmon species profile (no dark spots, silver on tail rays, cease feeding on the spawning run)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=chumsalmon.main" },
    ],
    ...R,
    gaps: [
      "stock-specific mean length tables",
      "gum-line character with a primary-source key beyond the no-spot / silver-tail split",
    ],
  },
  {
    speciesId: "salmo_salar_landlocked",
    status: "reviewed",
    regionalNames: ["landlocked salmon", "sebago", "ouananiche", "landlocked atlantic"],
    bodyShape:
      "A fusiform Salmo with a slightly forked caudal fin and a relatively thin caudal peduncle. Not the square-tailed brown trout body and not a pale-spotted lake trout.",
    identificationTraits: [
      "Maine IFW: salmon have a slightly forked caudal fin; brown trout have a square tail with almost no fork. The caudal peduncle on salmon is thinner; brown trout tend to be thick there.",
      "Maine IFW: salmon vomerine teeth are small and arranged in a single row on the shaft, few to none on the vomerine head. Brown trout have well-developed teeth on both vomerine head and shaft, in a zig-zag row on the shaft.",
      "Maine IFW: the maxillary on salmon typically will not extend much past the eye; brown trout often have a maxillary that slightly extends past the eye.",
      "Maine IFW: adults are generally silvery with small X-shaped markings on the back and upper sides. Spots are smaller and less defined than brown trout, which usually have more spots and a few more reddish spots.",
      "Maine IFW: salmon usually have a dark adipose fin; if spotted, the spots are harder to see. Brown trout tend to have larger adipose fins, often orange-tinted and obviously spotted.",
    ],
    coloration:
      "Maine IFW: adults generally silvery with small X-shaped markings on the back and upper sides. Juveniles have a dark red spot between each pair of parr marks.",
    regionalColorVariation:
      "Lake fish can be brighter silver. River fish may look duskier. Color does not split this freshwater form from wild sea-run Atlantic salmon — life history and listing status do.",
    spawningColoration:
      "Maine IFW: wild fish spawn in lake inlets or outlets from mid-October through late November. Color change on the run is biology, not a targeting cue.",
    juvenileAppearance:
      "Maine IFW: juveniles have a dark red spot between each pair of parr marks. Young wild fish spend one to four years in a stream (about 75% spend two years) before migrating to a lake.",
    adultAppearance:
      "A slightly forked, silvery Salmo with small X-marks, a short maxillary, a dark adipose, and single-row vomerine teeth. Not a brown trout and not wild sea-run Atlantic salmon.",
    sexualDimorphism:
      "Maine IFW: males usually spawn first at age 3–4, females at 4–5. Size overlap is large; tail, vomer, and maxillary, not sex, are the key.",
    similarSpecies: [
      {
        speciesId: "salmo_trutta",
        name: "Brown trout",
        distinction:
          "Maine IFW: brown trout have a square unforked tail, a zig-zag vomerine row with teeth on the vomerine head, a maxillary that often extends past the eye, more and redder spots, and a larger often orange-tinted spotted adipose. Landlocked salmon are the slightly forked, small-X, dark-adipose Salmo.",
      },
      {
        speciesId: "salvelinus_namaycush",
        name: "Lake trout",
        distinction:
          "Lake trout are char with light spots on a dark body and a deeply forked tail. Landlocked salmon have small dark X-marks on silver and a slight fork. Mouth and spotting, not fork alone, split them.",
      },
      {
        speciesId: "salmo_salar_anadromous",
        name: "Wild anadromous Atlantic salmon",
        distinction:
          "Same species complex, different life history and status. Wild Gulf of Maine sea-run Atlantic salmon are federally endangered and remain a fail-closed catalog record. Do not treat a managed landlocked lake fish as that fish, and do not use this overlay as a how-to-target layer for sea-run Atlantic salmon.",
      },
      {
        speciesId: "oncorhynchus_mykiss_steelhead",
        name: "Steelhead",
        distinction:
          "Steelhead are anadromous rainbow trout with a spotted tail and, often, a pink band after freshwater residence. Landlocked Atlantic salmon are Salmo with X-marks and a slight fork, not an Oncorhynchus.",
      },
    ],
    averageAdultLength: "Maine lake adults commonly 16–22 in; larger fish occur where smelt forage is adequate.",
    commonAnglingSize: "16–22 in in many northeastern managed lakes.",
    typicalWeight: "Often 1.5–4 lb. Maine IFW: growth can be poor without adequate smelt.",
    maximumDocumentedSize:
      "Large lake fish exceed typical size where pelagic forage is strong. Maxima are waterbody-specific and are not a sea-run Atlantic number.",
    longevity:
      "Maine IFW: landlocked salmon may spawn more than once (iteroparous), in consecutive or alternate years. Most fish observed on spawning runs are spawning for the first time.",
    sources: [
      { label: "Maine Department of Inland Fisheries and Wildlife Landlocked Salmon species profile (smelt forage, <65°F, spawn timing, iteroparity)", class: "agency", url: "https://www.maine.gov/ifw/fish-wildlife/fisheries/species-information/landlocked-salmon.html" },
      { label: "Maine IFW identification of salmon and brown trout (vomerine row, slightly forked vs square tail)", class: "agency", url: "https://www.maine.gov/ifw/fish-wildlife/fisheries/species-information/difference-salmon-brown-trout.html" },
      { label: "Maine IFW landlocked salmon vs brown trout field tips (maxillary, X-spots, dark adipose, caudal peduncle)", class: "agency", url: "https://www.maine.gov/ifw/blogs/mdifw-blog/landlocked-salmon-and-brown-trout-tips-identifying-your-catch" },
    ],
    ...R,
    gaps: [
      "a single northeastern mean length",
      "ouananiche vs sebago form tables as structured fields",
    ],
  },

  {
    speciesId: "prosopium_williamsoni",
    status: "reviewed",
    regionalNames: ["whitefish", "rocky mountain whitefish", "mountain herring"],
    bodyShape:
      "Slender, nearly cylindrical salmonid with an adipose fin and a forked tail. The head is short; the snout overhangs a small round mouth.",
    identificationTraits: [
      "Idaho Fish and Game: small mouth without teeth; light grayish-blue back, silvery sides, dull whitish belly. An adipose fin is present — this is a salmonid, not a sucker or large minnow.",
      "Idaho Fish and Game: larger scales and a lack of trout coloration are why anglers misread them as suckers. The adipose fin and small toothless mouth are the split.",
      "Montana Field Guide: pointed snout and small round mouth; mouth overhung by the snout. That vacuuming mouth is not a trout gape.",
      "Montana Field Guide: typical fish are cylindrical 10–16 in; they can reach 5 lb. They are an interior-West Prosopium, not a Great Lakes Coregonus.",
      "Do not collapse this record into trout behavior. They are more consistently benthic than sympatric trout.",
    ],
    coloration:
      "Idaho Fish and Game: light grayish-blue on the back, silvery on the sides, dull whitish on the belly. Little trout spotting. Scales can look large and pale compared with a trout of the same length.",
    regionalColorVariation:
      "Clear western rivers often look brighter silver. Lake and reservoir fish can be duskier. Color is not a basin key.",
    spawningColoration:
      "Late-fall to winter broadcast spawners. There is no salmon-red dress. Congregations on gravel are conservation context, not a target class.",
    juvenileAppearance:
      "Small silvery salmonids with the same small overhung mouth. They are not trout parr.",
    adultAppearance:
      "A cylindrical, small-mouthed, adipose-finned whitefish of cold western rivers and connected lakes — not a sucker and not a lake whitefish.",
    sexualDimorphism:
      "Size overlap is large. Snout, mouth, and adipose fin, not color, are the key.",
    similarSpecies: [
      {
        speciesId: "coregonus_clupeaformis",
        name: "Lake whitefish",
        distinction:
          "Lake whitefish are a deeper-bodied Coregonus of Great Lakes and boreal lakes with a blunt, overhanging snout. Mountain whitefish are an interior river/lake Prosopium with a more pointed snout and a smaller mouth.",
      },
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows have a larger toothed mouth, spotting on the body and tail, and often a pink band. Mountain whitefish have a small toothless overhung mouth and little spotting.",
      },
      {
        speciesId: "thymallus_arcticus",
        name: "Arctic grayling",
        distinction:
          "Grayling have a large sail-like dorsal fin and a black slash on each side of the lower jaw. Mountain whitefish have a short dorsal and a small overhung mouth.",
      },
      {
        speciesId: "catostomus_commersonii",
        name: "White sucker",
        distinction:
          "White suckers lack an adipose fin and have a fleshy ventral sucker mouth. Mountain whitefish are salmonids with an adipose fin and a small terminal-to-inferior round mouth.",
      },
    ],
    averageAdultLength: "Montana Field Guide: typically 10–16 in.",
    commonAnglingSize: "10–16 in in western rivers and connected lakes.",
    typicalWeight: "Often well under 2 lb; Montana Field Guide notes fish can reach 5 lb.",
    maximumDocumentedSize:
      "Montana Field Guide: can reach a weight of 5 lb. Continent-wide maxima are waterbody-specific.",
    sources: [
      { label: "Idaho Fish and Game resident fish identification (small toothless mouth, adipose fin, gray-blue back)", class: "agency", url: "https://idfg.idaho.gov/fish/identification/resident" },
      { label: "Idaho Fish and Game lesser-known species notes (larger scales, small mouth, not a sucker)", class: "agency", url: "https://idfg.idaho.gov/blog/2021/05/what-fish-identifying-some-lesser-known-species-anglers-catch-southwest-idaho" },
      { label: "Montana Field Guide mountain whitefish (pointed snout, overhung mouth, 10–16 in, broadcast spawn)", class: "agency", url: "https://fieldguide.mt.gov/speciesDetail.aspx?elcode=AFCHA03060" },
      { label: "Boyer et al. mountain whitefish reproductive ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "a single interior-West mean length table",
      "lake-form zooplankton fraction (no catalog forage class on this record)",
    ],
  },
  {
    speciesId: "thymallus_arcticus",
    status: "reviewed",
    regionalNames: ["grayling", "arctic grayling"],
    bodyShape:
      "Salmonid with a large, sail-like dorsal fin that is the field mark. Body thicker than a slim trout of the same length. Adipose fin present. Tail forked.",
    identificationTraits: [
      "Alaska Department of Fish and Game: the most striking physical feature is the large, sail-like dorsal fin, typically fringed in red and dotted with large iridescent red, aqua, or purple spots.",
      "ADF&G: a black slash lies on each side of the lower jaw. Pelvic fins are striated with iridescent orange, red, or pink. The iris is often gold.",
      "ADF&G: sides of the body and head can be freckled with black spots. Backs are usually dark; sides can be black, silver, gold, or blue.",
      "ADF&G: largest measured in Alaska 24 in and 5 lb 1 oz. This is not a trout with an oversized dorsal.",
      "Many lower-48 populations are conservation-sensitive. Geographic presence must be verified, not inferred from habitat.",
    ],
    coloration:
      "ADF&G: coloration varies from stream to stream. Dark back; sides black, silver, gold, or blue, often with a gold band above a white belly. Dorsal fin is the color plate.",
    regionalColorVariation:
      "ADF&G: color can vary from stream to stream. Large fish show the most dramatic dorsal markings. Color is not a stock key and is not a lower-48 versus Alaska split by itself.",
    spawningColoration:
      "Spring spawners. Color intensification is biology, not a targeting cue. Lower-48 remnant and reintroduced populations remain conservation context.",
    juvenileAppearance:
      "ADF&G: fry are about ½ in at hatch and grow to about 2–4 in by the end of summer. The sail dorsal develops with age; small fish can still be told from trout by the dorsal and jaw slash when those marks are visible.",
    adultAppearance:
      "A sail-dorsal salmonid with a black lower-jaw slash and colorful pelvic fins. Not a mountain whitefish and not a trout.",
    sexualDimorphism:
      "Large adults show the strongest dorsal color. Size overlap is large; the sail, not sex, is the key.",
    similarSpecies: [
      {
        speciesId: "prosopium_williamsoni",
        name: "Mountain whitefish",
        distinction:
          "Mountain whitefish have a short dorsal, a small overhung toothless mouth, and little color. Grayling have a sail-like dorsal and a black slash on the lower jaw.",
      },
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows have a spotted body and tail and a pink band. They lack the grayling sail dorsal and the black lower-jaw slash.",
      },
      {
        speciesId: "salvelinus_alpinus",
        name: "Arctic char",
        distinction:
          "Arctic char are lake-resident chars with light spots and no sail dorsal. Grayling are a Thymallus of rivers and cold lakes.",
      },
    ],
    averageAdultLength: "Adults commonly 10–16 in in many northern fisheries; ADF&G notes first spawn around 10–12 in.",
    commonAnglingSize: "10–16 in.",
    typicalWeight: "Often 0.5–2 lb; large northern fish are heavier.",
    maximumDocumentedSize:
      "ADF&G: largest measured in Alaska 610 mm (24 in) and 2.3 kg (5 lb 1 oz).",
    longevity: "ADF&G: can live up to 32 years in Alaska and may spawn many times.",
    sources: [
      { label: "Alaska Department of Fish and Game Arctic grayling species profile (sail dorsal, jaw slash, diet, lower-48 decline)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=arcticgrayling.main" },
      { label: "USGS Arctic Grayling species profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "interior-West remnant versus Alaska mean-size tables",
    ],
  },
  {
    speciesId: "lota_lota",
    status: "reviewed",
    regionalNames: ["eelpout", "ling", "mariah", "lawyer"],
    bodyShape:
      "Elongate, eel-like freshwater cod. Single chin barbel. Two dorsal fins, the second long. Pelvic fins forward. Tail rounded, not forked.",
    identificationTraits: [
      "Minnesota DNR: resembles an eel more than other freshwater fish. Scales small; skin has a slimy feel.",
      "Minnesota DNR: large chin barbel with tubular nostrils similar to catfish, for detecting food. That is a single barbel, not a catfish cluster.",
      "Minnesota DNR: coloration yellow-brown to brown or dark olive with black mottling and blotching — a camouflage look.",
      "Minnesota DNR: typically under 8 lb and less than 28 in. State record 19 lb 3 oz.",
      "This is a coldwater benthic predator, not a bowfin and not a snakehead.",
    ],
    coloration:
      "Minnesota DNR: yellow-brown to brown or even dark olive with black mottling and blotching.",
    regionalColorVariation:
      "Lake Superior and deep northern-lake fish can look darker. River fish can look more mottled. Color is not a basin key.",
    spawningColoration:
      "Minnesota DNR: mid-winter into early spring, before ice-off. No nest. Spawning groups are conservation context, never a map.",
    juvenileAppearance:
      "Minnesota DNR: hatch at about 0.15 in — among the smallest freshwater larvae. Young fish already show the barbel and elongate body.",
    adultAppearance:
      "A mottled, slimy, single-barbel eel-shaped cod of cold lakes and rivers. Night and bottom are the organizing ideas, not a surface predator.",
    sexualDimorphism:
      "A single female can lay as many as 1 million eggs (Minnesota DNR). Size overlap is large; barbel and body, not color, are the key.",
    similarSpecies: [
      {
        speciesId: "amia_calva",
        name: "Bowfin",
        distinction:
          "Bowfin have a long dorsal fin, a bony gular plate, and no chin barbel. Burbot are a mottled freshwater cod with a single chin barbel. Do not collapse the two ‘eel-like’ fish.",
      },
      {
        speciesId: "ictalurus_punctatus",
        name: "Channel catfish",
        distinction:
          "Channel catfish have eight barbels, a forked tail, and an adipose fin. Burbot have one chin barbel, a rounded tail, and no adipose fin.",
      },
      {
        name: "Northern snakehead (invasive)",
        distinction:
          "Snakeheads have a long anal fin and no chin barbel. Burbot are a native coldwater cod. Treat snakehead as a separate invasive ID problem.",
      },
    ],
    averageAdultLength: "Minnesota DNR: typically less than 28 in.",
    commonAnglingSize: "18–26 in in many northern lakes and rivers.",
    typicalWeight: "Minnesota DNR: typically under 8 lb.",
    maximumDocumentedSize:
      "Minnesota DNR: state record 19 lb 3 oz (Lake of the Woods). Maxima are waterbody-specific.",
    longevity: "Minnesota DNR: can live up to 15 years.",
    sources: [
      { label: "Minnesota DNR burbot species profile (eel shape, chin barbel, mottling, winter spawn, perch/walleye diet)", class: "agency", url: "https://www.dnr.state.mn.us/minnaqua/speciesprofile/burbot.html" },
      { label: "USGS Great Lakes burbot thermal-distribution research", class: "peer_reviewed" },
      { label: "USGS Lake Superior burbot life-history literature", class: "agency" },
    ],
    ...R,
    gaps: [
      "a single continent-wide mean length",
      "meristic dorsal-ray table as a structured field",
    ],
  },
  {
    speciesId: "salvelinus_alpinus",
    status: "reviewed",
    regionalNames: ["arctic char", "arctic charr", "char"],
    bodyShape:
      "Lake-resident char with a relatively slim caudal peduncle and a noticeably forked tail. Adipose fin present. This catalog record is stillwater.",
    identificationTraits: [
      "ADF&G: fewer and larger spots (larger than the pupil), a more deeply forked tail, and a narrower caudal peduncle than Dolly Varden.",
      "ADF&G: bronzish-yellow body with cream-to-orange spots is the usual contrast with Dolly Varden’s greenish body and many small spots.",
      "ADF&G: spawning fish are usually gold, orange, yellow, or rose and only infrequently red. Spawning male kype is much smaller than in Dolly Varden.",
      "ADF&G: in Alaska, all known populations appear to spend their entire lives in lakes and do not migrate. This record is not a sea-run char.",
      "Polymorphic: ADF&G notes dwarf and normal forms in some lakes, with different habitat, food, growth, and size at maturity. Do not force one size story.",
    ],
    coloration:
      "ADF&G: generally bronzish-yellow with fewer, larger cream-to-orange spots. Spawning dress gold to rose more often than bright red.",
    regionalColorVariation:
      "Lake-to-lake color and spot size vary with form. Eurasian anadromous char are outside this record. Do not infer form from a photograph of color alone.",
    spawningColoration:
      "ADF&G: spawning takes place in lakes between August and October over gravel/rubble. Shoals are not target locations. Color change is biology.",
    juvenileAppearance:
      "Young char already show light spots on a darker ground. They are not vermiculated brook parr and not Dolly Varden of streams.",
    adultAppearance:
      "A lake-resident char with large light spots, a slim peduncle, and a deep fork. Not Dolly Varden and not a lake trout.",
    sexualDimorphism:
      "ADF&G: spawning male kype is much smaller than in Dolly Varden. Most fish spawn only every other year.",
    similarSpecies: [
      {
        speciesId: "salvelinus_malma",
        name: "Dolly Varden",
        distinction:
          "ADF&G: Dolly Varden generally have a greenish body with many small spots (smaller than the pupil), a thick caudal peduncle, and a slightly forked tail. Arctic char have fewer larger spots, a slim peduncle, and a deeper fork. In Alaska, Dolly Varden use streams and may go to sea; Arctic char complete their lives in lakes.",
      },
      {
        speciesId: "salvelinus_namaycush",
        name: "Lake trout",
        distinction:
          "Lake trout have many small light spots on a dark body and a deeply forked tail, but they lack Arctic char’s cream-to-orange large spots and spawning gold/rose dress. They are a different char record.",
      },
      {
        speciesId: "salvelinus_fontinalis",
        name: "Brook trout",
        distinction:
          "Brook trout have vermiculations and blue-haloed red spots on a square tail. Arctic char lack the vermiculation maze and are a northern lake record.",
      },
    ],
    averageAdultLength: "Highly lake-dependent. ADF&G: some lakes do not produce fish over 2 lb even at great age; others commonly exceed 10 lb.",
    commonAnglingSize: "12–24 in depending on the lake form.",
    typicalWeight: "ADF&G: highly variable; over 10 lb is not uncommon in some Alaska lakes.",
    maximumDocumentedSize:
      "ADF&G: up to 38 in and 15 lb, varying with lake productivity and other fishes present.",
    sources: [
      { label: "Alaska Department of Fish and Game Arctic Char species profile (lake-resident, spots vs Dolly Varden, dwarf/normal forms)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=arcticchar.main" },
    ],
    ...R,
    gaps: [
      "dwarf versus normal form meristics as a structured overlay",
      "Eurasian anadromous forms, which are outside this record",
    ],
  },
  {
    speciesId: "salvelinus_malma",
    status: "reviewed",
    regionalNames: ["dolly", "dollies", "dolly varden"],
    bodyShape:
      "Char with a relatively thick caudal peduncle and a slightly forked tail. Adipose fin present. Resident stream fish are often small; sea-run and lake-wintering fish are larger.",
    identificationTraits: [
      "ADF&G: greenish body with many small spots (smaller than the pupil of the eye), a relatively thick caudal peduncle, and a slightly forked tail.",
      "ADF&G: spawning fish are usually red or pink on the lower abdomen with bright red spots. Spawning males usually develop a distinct kype, which is absent or reduced in Arctic char.",
      "ADF&G: in Alaska, Dolly Varden spawn and usually live in streams and rivers (southern form often overwinters in lakes) and may migrate to and from the ocean. Arctic char in Alaska generally complete their lives in lakes.",
      "Northern and southern forms differ in vertebrae and chromosomes. Resident versus sea-run life histories must be declared through RPC, not inferred from a water name.",
      "Bull trout remain a separate, fail-closed conservation record. Do not treat a Dolly Varden as a bull trout or the reverse.",
    ],
    coloration:
      "ADF&G: generally greenish with many small spots. Spawning fish red or pink on the lower abdomen with bright red spots.",
    regionalColorVariation:
      "Sea-run fish can be silvery until freshwater residence colors them. Resident dwarfs in small headwaters may stay small and dark. Color is not the northern/southern form key.",
    spawningColoration:
      "Fall spawners, generally September through November. Redds and concentrations are excluded from target guidance.",
    juvenileAppearance:
      "ADF&G: juveniles feed in slow water near banks. Small char without brook vermiculations. Form (resident vs sea-run) is not decided from a juvenile photograph.",
    adultAppearance:
      "A small-spotted, thick-peduncle char of cold streams, rivers, and connected lakes. Not Arctic char and not bull trout.",
    sexualDimorphism:
      "ADF&G: spawning males usually develop a distinct kype. Resident dwarfs may mature at 3–6 in.",
    similarSpecies: [
      {
        speciesId: "salvelinus_alpinus",
        name: "Arctic char",
        distinction:
          "ADF&G: Arctic char have fewer, larger spots, a slim caudal peduncle, and a noticeably forked tail, and in Alaska they live in lakes. Dolly Varden have many small spots, a thick peduncle, a slight fork, and use streams, with sea-run forms.",
      },
      {
        speciesId: "salvelinus_confluentus",
        name: "Bull trout",
        distinction:
          "Bull trout are a conservation-sensitive char and a fail-closed record in this catalog. Identification helps people not confuse them with Dolly Varden. Behavior, diet, and calendars are not a how-to-target layer for bull trout.",
      },
      {
        speciesId: "salvelinus_fontinalis",
        name: "Brook trout",
        distinction:
          "Brook trout have vermiculations and white-then-black lower-fin edges. Dolly Varden lack that maze pattern.",
      },
    ],
    averageAdultLength: "Resident dwarfs may mature at 3–6 in (ADF&G). Sea-run and lake-wintering fish are much larger.",
    commonAnglingSize: "10–22 in for many stream and sea-run fisheries; dwarfs are smaller.",
    typicalWeight: "ADF&G: southern form up to about 10 lb; northern form commonly larger.",
    maximumDocumentedSize:
      "ADF&G: can grow to lengths over 30 in and weigh nearly 30 lb. Northern form up to 27 lb; southern form rarely longer-lived than 8 years, up to 28 in and 10 lb.",
    longevity: "ADF&G: southern form rarely longer than 8 years; northern form up to 16 years.",
    sources: [
      { label: "Alaska Department of Fish and Game Dolly Varden species profile (spots vs Arctic char, forms, diet, fall spawn)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=dollyvarden.main" },
    ],
    ...R,
    gaps: [
      "southern versus northern form as a structured RPC split",
      "bull trout meristic field split as a dedicated conservation overlay (wave 03)",
    ],
  },
  {
    speciesId: "stenodus_leucichthys",
    status: "reviewed",
    regionalNames: ["inconnu", "shee", "sheefish"],
    bodyShape:
      "The largest coregonine: elongate, large-scaled, predatory whitefish with a projecting lower jaw. Adipose fin present. Not a trout body and not a small mountain whitefish.",
    identificationTraits: [
      "ADF&G: the lower jaw extends beyond the upper jaw and the mouth is full of small densely packed teeth.",
      "ADF&G: white or silvery without spots or other markings, with very large scales. The largest member of the whitefish subfamily.",
      "This is a piscivorous adult predator, not a benthic insect whitefish. Juvenile insectivory does not apply to adults.",
      "Regulated-context record. Long-distance migrations and relatively discrete spawning areas must not become location guidance.",
      "Interior river fish tend to be much smaller than the largest northwestern Alaska fish. Size is not a species key by itself.",
    ],
    coloration:
      "ADF&G: white or silvery without spots or other markings. Large scales.",
    regionalColorVariation:
      "Glacial, silt-laden rivers can produce a duskier silver. Color is not a resident-versus-migratory key.",
    spawningColoration:
      "ADF&G: broadcast spawners from late September to early October. They do not dig nests. Known spawning areas are excluded from target guidance.",
    juvenileAppearance:
      "Young sheefish are smaller-mouthed insect feeders. They are not adult piscivores and not mountain whitefish.",
    adultAppearance:
      "A large, silvery, undershot-jaw whitefish of northern rivers and lakes. The jaw and scale size separate it from mountain and lake whitefish.",
    sexualDimorphism:
      "Size overlap is large. Projecting lower jaw and large scales, not color, are the key.",
    similarSpecies: [
      {
        speciesId: "coregonus_clupeaformis",
        name: "Lake whitefish",
        distinction:
          "Lake whitefish have a subterminal, overhung snout and a smaller, less toothy mouth. Sheefish have a projecting lower jaw and are the largest coregonine.",
      },
      {
        speciesId: "prosopium_williamsoni",
        name: "Mountain whitefish",
        distinction:
          "Mountain whitefish have a small toothless overhung mouth and are an interior-West river insectivore. Sheefish are a large northern piscivore with an undershot jaw.",
      },
      {
        speciesId: "esox_lucius",
        name: "Northern pike",
        distinction:
          "Pike have a duckbill, light spots on a dark ground, and no adipose fin. Sheefish are a silvery coregonine with an adipose fin.",
      },
    ],
    averageAdultLength: "ADF&G: can grow to about 1 m (~42 in). Interior rivers tend to produce much smaller fish.",
    commonAnglingSize: "20–36 in in many northern fisheries; interior fish run smaller.",
    typicalWeight: "ADF&G: anything over 13.6 kg (30 lb) is considered large. Interior fish are often much lighter.",
    maximumDocumentedSize:
      "ADF&G: in some northwestern Alaska waters may weigh up to ~27 kg (~60 lb) and exceed ~42 in. Record sport-caught fish 24 kg (53 lb). Those maxima are not interior-river size.",
    sources: [
      { label: "Alaska Department of Fish and Game Sheefish species profile (projecting jaw, broadcast spawn, adult piscivory, long migrations)", class: "agency", url: "https://www.adfg.alaska.gov/index.cfm?adfg=sheefish.main" },
    ],
    ...R,
    gaps: [
      "resident versus long-distance migrant size tables as a structured RPC split",
    ],
  },

];
