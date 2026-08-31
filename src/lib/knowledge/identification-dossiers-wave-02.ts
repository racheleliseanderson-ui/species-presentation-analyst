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
 * AFP-ID-1.0 wave 02 — identification dossiers for open-first salmonids,
 * pike, walleye, large catfish, and yellow perch.
 *
 * Visual characters are taken from agency and peer-reviewed keys.
 * AI-generated appearance claims are not used as identification authority.
 * Diet, calendar, fight, and food-value overlays are not invented here.
 */
export const IDENTIFICATION_DOSSIERS_WAVE_02: IdentificationDossier[] = [
  {
    speciesId: "salmo_trutta",
    status: "reviewed",
    regionalNames: ["brownie", "german brown", "Loch Leven"],
    bodyShape:
      "Typical trout fusiform body; caudal fin typically square to only slightly forked, not the wide spotted tail of an inland rainbow.",
    identificationTraits: [
      "MassWildlife: golden to brownish-yellow color, sometimes almost silvery.",
      "MassWildlife: scattered spots with silver halos; spots are darker than the body.",
      "Unlike inland rainbow (MassWildlife: small black spots from head to tail), brown-trout spotting is on the body and typically does not cover the tail.",
      "Lower fins often orange to yellowish. No white leading-edge / black-backing on the lower fins of a brook trout, and no pink lateral band of a rainbow.",
      "A char-style light-on-dark pattern is not present; this is a Salmo, not a Salvelinus.",
    ],
    coloration:
      "Golden-brown, olive, or yellowish sides with dark spots haloed in pale silver or cream. Large fish in fertile water can look almost buttery; silvery lake and sea-run fish occur.",
    regionalColorVariation:
      "Stocked and wild fish both range from pale gold to deep brown. Silvery lake or tidal fish can look trout-like until the haloed spots are checked. Do not treat a silver fish as a rainbow.",
    spawningColoration:
      "Fall spawners may deepen color and develop a kype on males. Spawning dress is not a targeting cue.",
    juvenileAppearance:
      "Parr marks plus developing dark spots. Juveniles lack the brook-trout worm marks and white-edged fins.",
    adultAppearance:
      "A golden-to-brown spotted trout with haloed dark spots and an unspotted or nearly unspotted tail.",
    sexualDimorphism:
      "Breeding males may show a kype and deeper color; size overlap is large and sex is not a species key.",
    similarSpecies: [
      {
        speciesId: "salvelinus_fontinalis",
        name: "Brook trout",
        distinction:
          "Brook trout are char: worm-like vermiculations on the back, red spots with blue halos, and a white leading edge backed by black on the lower fins. Brown trout have dark spots paler-haloed on a golden body and lack those white-and-black fin edges.",
      },
      {
        speciesId: "salvelinus_namaycush",
        name: "Lake trout",
        distinction:
          "Lake trout are deep-bodied char with light spots on a dark body and a deeply forked tail. Brown trout are dark-on-light with a square to shallowly forked tail.",
      },
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows carry a pink-to-red lateral band and small black spots commonly covering the body and tail. Browns lack that band, have haloed dark spots, and typically do not spot the tail the way a rainbow does.",
      },
    ],
    averageAdultLength: "Inland stream adults commonly 12–18 in; productive rivers and lakes produce larger fish.",
    commonAnglingSize: "MassWildlife stocks 9–18 in fish; many wild stream fish are smaller than that hatchery window.",
    typicalWeight: "Often 1–3 lb in inland streams; larger fish occur in fertile rivers and lakes.",
    maximumDocumentedSize:
      "Large river and lake fish substantially exceed typical stream size. A single continent-wide maximum is not claimed here.",
    longevity: "Multi-year freshwater resident; exact mean age is fishery-specific.",
    sources: [
      {
        label: "MassWildlife trout identification and fishing tips (brown trout identifiers)",
        class: "agency",
        url: "https://www.mass.gov/info-details/trout-identification-and-fishing-tips",
      },
      { label: "Elliott thermal biology of brown trout", class: "peer_reviewed" },
      { label: "USGS / state brown trout habitat notes", class: "agency" },
    ],
    ...R,
    gaps: [
      "a continent-wide mean length and weight",
      "sea-run versus inland size table",
    ],
  },
  {
    speciesId: "salvelinus_fontinalis",
    status: "reviewed",
    regionalNames: ["brookie", "squaretail", "speckled trout", "brook char"],
    bodyShape:
      "A small-to-medium char; caudal fin square to only slightly forked — MassWildlife lists square tails among the common names.",
    identificationTraits: [
      "MassWildlife: worm-like markings along the back and head (vermiculations).",
      "MassWildlife: yellow and red spots, the red spots surrounded by blue halos, along the sides; spots lighter than the body.",
      "MassWildlife: white leading edge, backed by black, on the lower fins.",
      "This is a char (Salvelinus): light spots on a darker body, not dark-on-light brown-trout spotting and not a rainbow lateral band.",
      "Fall males often develop a deep reddish tint along the belly and darken on the chin and throat (MassWildlife). That is spawning dress, not a targeting cue.",
    ],
    coloration:
      "Olive, gray, or dark back with worm-like vermiculations; sides with pale spots and red spots in blue halos; lower fins orange to red with a white-then-black leading edge.",
    regionalColorVariation:
      "Wild high-elevation and eastern spring-creek fish are often darker and more vividly marked than hatchery fish. Color intensity is not a subspecies key in this catalog.",
    spawningColoration:
      "MassWildlife: during fall spawning season males often develop a deep reddish tint along the belly and darken to black on the chin and throat.",
    juvenileAppearance:
      "Parr with developing vermiculations and white fin edges. Young brook trout are not brown-trout juveniles with extra color.",
    adultAppearance:
      "A square-tailed char with worm marks on the back, haloed red spots, and white-edged lower fins.",
    sexualDimorphism:
      "Spawning males color up more strongly; size overlap is large.",
    similarSpecies: [
      {
        speciesId: "salmo_trutta",
        name: "Brown trout",
        distinction:
          "Browns have dark spots with pale halos on a golden body and lack vermiculations and the white-then-black lower-fin edge. Brook trout are light-on-dark char.",
      },
      {
        speciesId: "salvelinus_namaycush",
        name: "Lake trout",
        distinction:
          "Lake trout have light spots on a dark body but a deeply forked tail and typically lack the bright red-with-blue-halo flank spots and strong vermiculation pattern of brook trout. Splake (lake trout × brook trout) are a hybrid and should not be forced into either record.",
      },
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows are dark-spotted trout with a pink lateral band and a spotted tail. They lack brook-trout vermiculations, blue-haloed red spots, and white-and-black lower-fin edges.",
      },
    ],
    averageAdultLength:
      "MassWildlife: mature wild brook trout are often less than 8 in; hatchery fish are stocked at 9–18 in.",
    commonAnglingSize: "Wild stream fish commonly 6–10 in; hatchery and some lake fish larger.",
    typicalWeight: "Wild stream fish often well under 1 lb; larger fish occur in lakes and hatchery waters.",
    maximumDocumentedSize:
      "Lake and some large-river fish exceed typical wild-stream size. Do not copy lake-trout size onto this record.",
    longevity: "Typically shorter-lived than lake trout; exact mean age is fishery-specific.",
    sources: [
      {
        label: "MassWildlife trout identification and fishing tips (brook trout identifiers)",
        class: "agency",
        url: "https://www.mass.gov/info-details/trout-identification-and-fishing-tips",
      },
      { label: "USFWS brook trout conservation summaries", class: "agency" },
      { label: "Raleigh habitat suitability (brook trout)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "western introduced-population size table",
      "coaster brook trout versus inland stream size as a structured field",
    ],
  },
  {
    speciesId: "salvelinus_namaycush",
    status: "reviewed",
    regionalNames: ["laker", "mackinaw", "togue"],
    bodyShape:
      "Elongate, deep-bodied char; Michigan DNR: tail fin deeply forked with equal-sized upper and lower lobes.",
    identificationTraits: [
      "Michigan DNR: light spots on a black to gray background, progressively lighter down the side; belly white.",
      "Michigan DNR: tail fin deeply forked with equal-sized upper and lower lobes — the field separator from square-tailed brook trout.",
      "Michigan DNR: lower fins often orange to orange-red with a leading white edge; anal fin 8–10 rays with a leading white edge.",
      "No brook-trout vermiculations and typically no bright red spots with blue halos.",
      "No brown-trout dark-on-light haloed spotting and no rainbow pink band.",
    ],
    coloration:
      "Dark olive, gray, or nearly black back and sides with pale spots; white belly. Lower fins may show orange with a white leading edge.",
    regionalColorVariation:
      "Great Lakes leans, siscowet, and inland-lake forms differ in body depth and fatness. Those forms are not interchangeable size or depth keys.",
    spawningColoration:
      "Fall fish on rocky reefs may darken. Spawning color is not a targeting cue, and spawning reefs are never named.",
    juvenileAppearance:
      "Young fish already show light spots on a darker body; they are not brook-trout parr with vermiculations.",
    adultAppearance:
      "A deeply forked-tailed char with light spots on a dark body, used in deep cold lakes.",
    sexualDimorphism:
      "Sex is not a reliable field ID key at typical angling sizes.",
    similarSpecies: [
      {
        speciesId: "salvelinus_fontinalis",
        name: "Brook trout",
        distinction:
          "Brook trout have vermiculations, red spots with blue halos, and a square to only slightly forked tail. Lake trout are pale-spotted with a deeply forked tail. Splake (lake trout ♀ × brook trout ♂) are a hybrid and should not inherit either record.",
      },
      {
        speciesId: "salmo_trutta",
        name: "Brown trout",
        distinction:
          "Browns are dark-on-light trout with haloed dark spots and a square to shallowly forked tail. Lake trout are light-on-dark char with a deeply forked tail.",
      },
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Rainbow trout",
        distinction:
          "Rainbows have a pink lateral band and dark spots on a lighter body, including the tail. Lake trout are unbanded char with light spots on a dark body.",
      },
    ],
    averageAdultLength: "Inland-lake adults commonly in the mid-teens to low twenties of inches; Great Lakes fish are often larger.",
    commonAnglingSize: "Michigan DNR: the average adult weighs 9 to 10 lb in that jurisdiction’s waters; inland lakes are often smaller.",
    typicalWeight: "Michigan DNR: average adult 9 to 10 lb; some individuals weigh up to 50 lb (Michigan state record 61 lb 8 oz).",
    maximumDocumentedSize:
      "Trophy Great Lakes and large inland-lake fish far exceed typical inland size. Do not copy that mass onto stream brown or brook trout.",
    longevity: "Michigan DNR: lifespan may exceed 25 years.",
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
    gaps: [
      "inland-lake versus Great Lakes size table as a structured field",
      "siscowet / lean form characters beyond the body-depth caveat",
    ],
  },
  {
    speciesId: "oncorhynchus_mykiss_steelhead",
    status: "reviewed",
    regionalNames: ["steelie", "steelhead trout", "anadromous rainbow"],
    bodyShape:
      "Same species as inland rainbow trout. Ocean-phase adults are typically more streamlined and silvery than resident inland fish.",
    identificationTraits: [
      "WDFW: steelhead and rainbow trout are the same species (Oncorhynchus mykiss); rainbows are freshwater only, steelhead are anadromous.",
      "WDFW: dark spots scattered over the entire fish, including the tail, with slight to pronounced rainbow coloring.",
      "Fresh-from-the-ocean fish are silvery and often larger than typical inland rainbows; the pink band may be faint until freshwater residence.",
      "USFWS: the only way to confirm a fish is a steelhead is by examining its scales or the chemical composition of its otoliths (ear bones). Color and size are not proof of anadromy.",
      "Winter-run and summer-run stocks differ in freshwater entry timing (WDFW) and must not be collapsed into one life-history picture.",
    ],
    coloration:
      "Ocean-phase: metallic blue-green to steel-silver with dark spots including the tail. Freshwater-resident time can bring back a more obvious pink band.",
    regionalColorVariation:
      "Great Lakes 'steelhead' are adfluvial rainbows, not Pacific anadromous fish. Treat stocks as geographically limited. Do not copy Pacific ocean-phase color onto every large inland rainbow.",
    spawningColoration:
      "Fish that have been in fresh water may color up toward inland-rainbow dress. Winter and summer runs are not interchangeable spawning calendars.",
    juvenileAppearance:
      "Parr and smolts are not visually separable from resident rainbow juveniles by a field color key. USFWS scale/otolith confirmation applies to anadromy, not to a parr mark.",
    adultAppearance:
      "A spotted, often silvery Oncorhynchus mykiss whose anadromous identity is a life history, not a second species.",
    sexualDimorphism:
      "Males may develop a kype; unlike Pacific salmon, steelhead can survive spawning (WDFW) and are not a semelparous salmon record.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_mykiss",
        name: "Inland rainbow trout",
        distinction:
          "Same species, different life history. Inland rainbows live in fresh water; steelhead go to sea (or, in the Great Lakes, make an adfluvial migration). Do not treat steelhead as inland rainbow with a different name. USFWS: only scales or otolith chemistry confirm anadromy.",
      },
      {
        speciesId: "oncorhynchus_tshawytscha",
        name: "Chinook salmon",
        distinction:
          "Chinook have a black gum line (blackmouth) and spots on both caudal lobes, and they die after spawning. Steelhead have a light mouth like other trout/rainbows and can spawn more than once.",
      },
      {
        speciesId: "oncorhynchus_kisutch",
        name: "Coho salmon",
        distinction:
          "Coho have white/light gums at the tooth base and spots typically on the upper caudal lobe only, and they die after spawning. Steelhead keep a trout mouth and a fully spotted tail.",
      },
    ],
    averageAdultLength: "Often larger than typical inland stream rainbows; length is stock-specific.",
    commonAnglingSize: "WDFW: steelhead average between 8 and 11 lb.",
    typicalWeight: "WDFW: average 8–11 lb; can weigh 40 lb or more.",
    maximumDocumentedSize:
      "Large Pacific and some Great Lakes fish far exceed the WDFW average. Do not copy those maxima onto inland rainbow.",
    longevity: "Iteroparous; fish may spawn in more than one year. Exact mean age is stock-specific.",
    sources: [
      {
        label: "Washington Department of Fish and Wildlife rainbow trout / steelhead species account",
        class: "agency",
        url: "https://wdfw.wa.gov/species-habitats/species/oncorhynchus-mykiss",
      },
      {
        label: "USFWS rainbow trout species profile (scale / otolith confirmation of steelhead)",
        class: "agency",
        url: "https://www.fws.gov/species/rainbow-trout-oncorhynchus-mykiss",
      },
      { label: "NOAA Fisheries steelhead status", class: "agency" },
    ],
    ...R,
    gaps: [
      "stock-by-stock size table",
      "a field key that can replace scale or otolith confirmation of anadromy",
    ],
  },
  {
    speciesId: "oncorhynchus_tshawytscha",
    status: "reviewed",
    regionalNames: ["king", "blackmouth", "tyee", "spring salmon", "quinnat"],
    bodyShape:
      "The largest Pacific salmon; more robust than coho. Ocean-phase fish are deep and silvery before freshwater color change.",
    identificationTraits: [
      "NOAA: black spots on the upper half of the body and on both lobes of the tail fin.",
      "NOAA: black pigment along the gum line — the nickname blackmouth. ODFW: use the gum line on the lower jaw as the primary salmon ID character.",
      "NOAA: Chinook are the largest of the Pacific salmon, hence the name king salmon.",
      "Spots on both caudal lobes separate Chinook from coho (spots typically upper lobe only).",
      "Unlike steelhead/rainbow, Chinook die after spawning (semelparous).",
    ],
    coloration:
      "NOAA: in the ocean, blue-green on the back and top of the head with silvery sides and white bellies. In fresh water they change to olive brown, red, or purplish, particularly in males.",
    regionalColorVariation:
      "Run timing (spring, summer, fall, winter) and Great Lakes versus Pacific stocks change size and color timing. Those stocks are not one fish.",
    spawningColoration:
      "NOAA: freshwater fish about to spawn change to olive brown, red, or purplish. Spawning adult males can be distinguished by their hooked upper jaw. This is biology, not a targeting window.",
    juvenileAppearance:
      "NOAA: fry have well-developed parr marks; before seaward migration they lose parr marks and gain a dark back and light belly.",
    adultAppearance:
      "A large Pacific salmon with black gums and spots on both lobes of the tail.",
    sexualDimorphism:
      "NOAA: spawning males develop a hooked upper jaw; females are more torpedo-shaped with a robust mid-section and blunt nose.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_kisutch",
        name: "Coho salmon",
        distinction:
          "Coho have a lighter gum line (CDFW: white at the base of the teeth) and small black spots on the dorsal fin and upper caudal lobe only, with no spots on the lower lobe. Chinook are blackmouth fish with spots on both caudal lobes.",
      },
      {
        speciesId: "oncorhynchus_nerka_anadromous",
        name: "Anadromous sockeye salmon",
        distinction:
          "Sockeye lack the large black spots of Chinook on the back and both tail lobes. Returning sockeye are not a blackmouth salmon.",
      },
      {
        speciesId: "oncorhynchus_nerka_kokanee",
        name: "Kokanee",
        distinction:
          "Kokanee are the same species as sockeye but landlocked and small (NOAA: rarely exceed 1.2 ft). They are not a feeding Chinook and they lack Chinook spotting.",
      },
    ],
    averageAdultLength: "NOAA: typical length of mature fish is about 3 ft.",
    commonAnglingSize: "NOAA: typical mature weight about 30 lb; many fisheries see smaller returning adults.",
    typicalWeight: "NOAA: typical mature weight about 30 lb.",
    maximumDocumentedSize: "NOAA: they can grow as long as 4.9 ft and up to 129 lb.",
    longevity: "NOAA: sexually mature between ages 2 and 7, typically 3 or 4 when they return; all die after spawning.",
    sources: [
      {
        label: "NOAA Fisheries Chinook salmon species profile",
        class: "agency",
        url: "https://www.fisheries.noaa.gov/species/chinook-salmon",
      },
      {
        label: "Oregon Department of Fish and Wildlife Chinook vs Coho gum-line identification",
        class: "agency",
        url: "https://myodfw.com/articles/it-coho-or-chinook",
      },
    ],
    ...R,
    gaps: [
      "stock-specific mean size table",
      "Great Lakes versus Pacific adult-size comparison as a structured field",
    ],
  },
  {
    speciesId: "oncorhynchus_kisutch",
    status: "reviewed",
    regionalNames: ["silver", "silvers", "medium red salmon"],
    bodyShape:
      "A medium Pacific salmon, slimmer than a typical Chinook of the same length.",
    identificationTraits: [
      "NOAA: small black spots on the back and on the upper lobe of the tail while in the ocean.",
      "CDFW: small black spots on the dorsal fin and upper lobe of the caudal fin, with no spots on the lower lobe of the caudal fin.",
      "CDFW: gums of the lower jaw are usually gray except for the upper area at the base of the teeth, which is white. NOAA: the gumline in the lower jaw has lighter pigment than on Chinook.",
      "ODFW: use the gum line on the lower jaw as the primary salmon ID character.",
      "All coho die after spawning (NOAA). Listed ESUs are a status overlay, not a location.",
    ],
    coloration:
      "NOAA: dark metallic blue or greenish backs with silver sides and a light belly in the ocean. Spawning fish in fresh water are dark with reddish-maroon sides.",
    regionalColorVariation:
      "Great Lakes coho and Pacific ocean-run coho are not identical in size or marine residence. Inland lake behavior is not ocean-run identity.",
    spawningColoration:
      "CDFW: spawning males are dark red on the sides with head and back dark green and belly gray to black. Females are less colorful, often with dark pink sides. Spawning dress is not a targeting cue.",
    juvenileAppearance:
      "NOAA: before seaward migration they lose parr marks and gain ocean coloration. Juvenile coho are not a Chinook parr key.",
    adultAppearance:
      "A silver salmon with light gums at the tooth base and spots typically confined to the upper tail lobe.",
    sexualDimorphism:
      "Spawning males develop a hooked snout and deeper red; females remain duller. Both die after spawning.",
    similarSpecies: [
      {
        speciesId: "oncorhynchus_tshawytscha",
        name: "Chinook salmon",
        distinction:
          "Chinook are blackmouth fish with spots on both caudal lobes and are typically larger. Coho have white/light gums at the tooth base and no spots on the lower caudal lobe.",
      },
      {
        speciesId: "oncorhynchus_nerka_anadromous",
        name: "Anadromous sockeye salmon",
        distinction:
          "Sockeye lack coho’s small black tail-lobe spots and do not share the white-gum / maroon-flank spawning picture of coho.",
      },
      {
        speciesId: "oncorhynchus_mykiss_steelhead",
        name: "Steelhead",
        distinction:
          "Steelhead have a trout mouth and spots over the whole tail, and they can spawn more than once. Coho die after spawning.",
      },
    ],
    averageAdultLength: "NOAA: adult coho are 24 to 30 in.",
    commonAnglingSize: "NOAA: usually 24–30 in and 8–12 lb.",
    typicalWeight: "NOAA: adult coho usually weigh 8 to 12 lb. CDFW (Moyle 2002): spawning adults typically 3 to 6 kg.",
    maximumDocumentedSize:
      "Larger than the NOAA usual range occurs. Do not copy Chinook maxima (NOAA: up to 129 lb) onto coho.",
    longevity: "NOAA: typically spawn between the ages of 3 and 4; all die after spawning.",
    sources: [
      {
        label: "NOAA Fisheries coho salmon species profile",
        class: "agency",
        url: "https://www.fisheries.noaa.gov/species/coho-salmon",
      },
      {
        label: "California Department of Fish and Wildlife coho salmon identification",
        class: "agency",
        url: "https://wildlife.ca.gov/Conservation/Fishes/Coho-Salmon",
      },
      {
        label: "Oregon Department of Fish and Wildlife Chinook vs Coho gum-line identification",
        class: "agency",
        url: "https://myodfw.com/articles/it-coho-or-chinook",
      },
    ],
    ...R,
    gaps: [
      "stock-specific mean size table",
      "Great Lakes versus Pacific adult-size comparison as a structured field",
    ],
  },
  {
    speciesId: "sander_vitreus",
    status: "reviewed",
    regionalNames: ["walleyed pike", "marble-eye"],
    bodyShape:
      "Elongate percid with a large, pearlescent eye and a spiny dorsal fin. Not a pike; the name walleyed pike is an alias, not an Esox identity.",
    identificationTraits: [
      "Minnesota DNR: the lower tip of the walleye’s tail is white, unlike the all-dark lower lobe of the sauger.",
      "Minnesota DNR: unlike the sauger, the walleye lacks spots on its dusky dorsal fin except for a dark splotch at the rear base of the fin — a marking the sauger does not have.",
      "Minnesota DNR: named for its pearlescent eye, caused by the tapetum lucidum, a reflective layer that helps the fish see and feed at night or in turbid water.",
      "Large canine teeth in the jaws. Yellow perch lack those canines and carry vertical bars instead.",
      "Saugeye (walleye × sauger) should not silently inherit this record.",
    ],
    coloration:
      "Olive to gold sides, white belly, dark back. No rows of dark spots on the spiny dorsal. White lower caudal tip is the tail key against sauger.",
    regionalColorVariation:
      "Clear-water fish can be paler gold; turbid-river fish can be darker. Color is not a substitute for the tail-tip and dorsal-fin keys.",
    spawningColoration:
      "Early-spring spawners do not take on a separate dress that replaces the tail and dorsal keys.",
    juvenileAppearance:
      "Young walleye already show the large eye and canines. They are not yellow perch with extra teeth.",
    adultAppearance:
      "A golden percid with a white lower tail tip, a dark blotch at the rear of a mostly unspotted dorsal, and a tapetum-adapted eye.",
    sexualDimorphism:
      "Sex is not a primary field ID key.",
    similarSpecies: [
      {
        speciesId: "sander_canadensis",
        name: "Sauger",
        distinction:
          "Sauger have rows of dark spots on the dorsal fin, lack the dark blotch at the rear dorsal base, and lack the white lower tail tip. They are smaller and more slender (Minnesota DNR: seldom exceeding 3 lb).",
      },
      {
        speciesId: "perca_flavescens",
        name: "Yellow perch",
        distinction:
          "Yellow perch have 6–8 dark vertical bars, no large canine teeth, and no white lower tail tip. They are a schooling panfish, not a Sander.",
      },
    ],
    averageAdultLength: "Commonly 14–22 in in many inland fisheries; larger fish occur.",
    commonAnglingSize: "Minnesota DNR: averages 1 to 2 lb in most waters.",
    typicalWeight: "Minnesota DNR: averages 1 to 2 lb in most waters, though it occasionally exceeds 10 lb.",
    maximumDocumentedSize:
      "Trophy fish substantially exceed the Minnesota DNR typical range. Do not copy those maxima onto sauger or yellow perch.",
    longevity: "Multi-year; exact mean age is fishery-specific.",
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
    gaps: [
      "a continent-wide mean length table",
      "saugeye field characters as a structured hybrid key",
    ],
  },
  {
    speciesId: "sander_canadensis",
    status: "reviewed",
    regionalNames: ["sand pike"],
    bodyShape:
      "Minnesota DNR: smaller and more slender than the walleye. A riverine percid, not a pike.",
    identificationTraits: [
      "Minnesota DNR: dorsal fin marked by rows of dark spots and lacks the dark blotch at the rear base that walleye have.",
      "Minnesota DNR: lacks the white lower tail tip; the lower caudal lobe is all-dark.",
      "More blotched or brassy than a typical walleye, but color is secondary to the dorsal-spot and tail-tip keys.",
      "Minnesota DNR: sauger sees even better than walleye in darkness or turbid water, and this determines their distribution.",
      "Saugeye should not silently inherit this record.",
    ],
    coloration:
      "Dark back, brassy to brownish sides with darker blotches, pale belly. Rows of dark spots on the spiny dorsal. No white lower tail tip.",
    regionalColorVariation:
      "Turbid-river fish can be darker and more blotched. Do not use color alone against walleye.",
    juvenileAppearance:
      "Young sauger already show dorsal spotting. They are not a small walleye.",
    adultAppearance:
      "A slender, blotched Sander with a spotted dorsal fin and no white lower tail tip.",
    sexualDimorphism:
      "Sex is not a primary field ID key.",
    similarSpecies: [
      {
        speciesId: "sander_vitreus",
        name: "Walleye",
        distinction:
          "Walleye have a white lower tail tip and a dusky dorsal that lacks rows of spots except for a dark blotch at the rear base. They average larger (Minnesota DNR: 1–2 lb typical, occasionally over 10 lb).",
      },
      {
        speciesId: "perca_flavescens",
        name: "Yellow perch",
        distinction:
          "Yellow perch have regular dark vertical bars and no Sander canine-tooth profile. Sauger are blotched, not barred like a perch.",
      },
    ],
    averageAdultLength: "Typically smaller than walleye in the same system.",
    commonAnglingSize: "Minnesota DNR: seldom exceeding 3 lb.",
    typicalWeight: "Minnesota DNR: smaller and more slender than walleye; seldom exceeding 3 lb.",
    maximumDocumentedSize:
      "Fish above the Minnesota DNR typical ceiling occur. Do not copy walleye trophy size onto sauger.",
    sources: [
      {
        label: "Minnesota Department of Natural Resources walleye biology and identification (sauger comparison)",
        class: "agency",
        url: "https://www.dnr.state.mn.us/fish/walleye/biology.html",
      },
      { label: "USGS sauger habitat and movement research", class: "peer_reviewed" },
      { label: "Missouri Department of Conservation sauger species account", class: "agency" },
    ],
    ...R,
    gaps: [
      "a structured saugeye hybrid key",
      "a continent-wide mean length table",
    ],
  },
  {
    speciesId: "esox_lucius",
    status: "reviewed",
    regionalNames: ["northern", "jack"],
    bodyShape:
      "Elongate, duck-billed esocid. Light, bean-shaped spots on a darker green-to-olive body — light on dark, the reverse of muskellunge.",
    identificationTraits: [
      "Iowa DNR: a northern pike is primarily bluish green, with light, bean-shaped spots in horizontal rows across the body.",
      "Iowa DNR: a pike will have scales covering its entire cheek, whereas a muskie’s scales only cover the top half.",
      "Iowa DNR: five or fewer submandibular pores on each side of the lower jaw; six or more on either side is a muskie.",
      "Iowa DNR: pike tails split to two rounded portions; a true muskie’s tail fins split out to two points.",
      "Chain-like markings and a fully scaled opercle belong to chain pickerel, not this record.",
    ],
    coloration:
      "Bluish-green to olive back and sides with light bean-shaped spots; white belly. Juveniles have oblique bars of light and dark (Iowa DNR).",
    regionalColorVariation:
      "Clear-water fish can be brighter green; stained-water fish darker. Pattern (light-on-dark beans) remains the color key against muskie.",
    spawningColoration:
      "Ice-out spawners do not replace the cheek-scale, pore, and pattern keys with a separate dress.",
    juvenileAppearance:
      "Iowa DNR: juveniles have oblique bars of light and dark extending up from a white belly. Young pike are not chain pickerel.",
    adultAppearance:
      "A fully-scaled-cheek esocid with light bean spots on a dark body and five or fewer pores per side.",
    sexualDimorphism:
      "Females typically grow larger; sex is not the species key.",
    similarSpecies: [
      {
        speciesId: "esox_masquinongy",
        name: "Muskellunge",
        distinction:
          "Muskie: dark bars or spots on a light body, cheek scaled on the upper half only, six or more pores on a side, pointed tail tips (Iowa DNR). Pike: light beans on dark, fully scaled cheek, five or fewer pores, rounded tail tips. Tiger muskies (pike × muskie hybrids) should not inherit this record.",
      },
      {
        speciesId: "esox_niger",
        name: "Chain pickerel",
        distinction:
          "Chain pickerel have fully scaled cheeks and gill covers and chain-like rectangular markings. They are a smaller, vegetation esocid. Do not copy muskellunge or large-pike size class onto pickerel.",
      },
    ],
    averageAdultLength: "Commonly 18–30 in in many inland fisheries; larger fish occur.",
    commonAnglingSize: "Often 20–28 in where the species is established.",
    typicalWeight: "Often 2–8 lb in inland lakes; larger fish occur in productive northern waters.",
    maximumDocumentedSize:
      "Trophy pike substantially exceed typical inland size. Do not copy that class onto chain pickerel.",
    sources: [
      {
        label: "Iowa Department of Natural Resources pike vs muskie identification",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2016-05-25/know-your-catch-how-id-northern-pike-and-muskies",
      },
      { label: "Provincial / state esocid plans", class: "agency" },
      { label: "Casselman pike thermal ecology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "a continent-wide mean length and weight table",
      "grass / redfin pickerel as a structured lookalike key (not catalog records)",
    ],
  },
  {
    speciesId: "esox_masquinongy",
    status: "reviewed",
    regionalNames: ["muskie", "musky"],
    bodyShape:
      "The largest North American esocid; elongate and duck-billed, typically a heavier fish than pike or pickerel of similar length.",
    identificationTraits: [
      "Iowa DNR: muskies have highly variable dark vertical bars on an olive to dark gray base; juveniles may appear to have dark spots on a silvery base — dark on light, the reverse of pike.",
      "Iowa DNR: a muskie’s scales only cover the top half of the cheek; a pike’s cheek is fully scaled.",
      "Iowa DNR: six or more submandibular pores on either side of the jaw.",
      "Iowa DNR: a true muskie’s tail fins split out to two points; pike and tiger-muskie tails split to rounded portions.",
      "Do not copy this open-water size class onto chain pickerel.",
    ],
    coloration:
      "Olive, gray, or silver ground with dark vertical bars or spots. Pattern is variable; cheek scaling, pores, and tail tips are the structural keys.",
    regionalColorVariation:
      "Clear, barred, and spotted forms occur. Pattern variation is not a license to skip the cheek/pore keys. Tiger muskies (pike × muskie) have dark vertical bars and irregular spots (Iowa DNR) and are a hybrid, not this record.",
    spawningColoration:
      "Spring spawners do not replace the structural keys with a separate dress. Spawning shallows are never named.",
    juvenileAppearance:
      "Iowa DNR: juveniles may appear to have dark spots on a silvery base. Young muskie are not chain pickerel.",
    adultAppearance:
      "A large, dark-on-light esocid with a half-scaled cheek, six or more pores per side, and pointed tail tips.",
    sexualDimorphism:
      "Females typically grow larger; sex is not the species key.",
    similarSpecies: [
      {
        speciesId: "esox_lucius",
        name: "Northern pike",
        distinction:
          "Pike: light bean spots on a dark body, fully scaled cheek, five or fewer pores per side, rounded tail tips. Muskie: dark on light, half-scaled cheek, six or more pores, pointed tail tips.",
      },
      {
        speciesId: "esox_niger",
        name: "Chain pickerel",
        distinction:
          "Chain pickerel have fully scaled cheeks and gill covers and a chain-like pattern. They are a smaller vegetation esocid. Do not copy muskellunge size class onto pickerel.",
      },
    ],
    averageAdultLength: "Managed fisheries commonly see adults well above typical pike or pickerel size; exact means are water-specific.",
    commonAnglingSize: "Often 30–40 in in managed inland waters; smaller and larger fish occur.",
    typicalWeight: "A much larger size class than chain pickerel; do not share one weight line.",
    maximumDocumentedSize:
      "Trophy muskellunge far exceed pike or pickerel typical size. Maximums are fishery-specific and are not a fight rating.",
    sources: [
      {
        label: "Iowa Department of Natural Resources pike vs muskie identification",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2016-05-25/know-your-catch-how-id-northern-pike-and-muskies",
      },
      { label: "State muskellunge management plans", class: "agency" },
      { label: "Crossman muskellunge biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "a structured tiger-muskie hybrid key beyond Iowa DNR’s regulatory note",
      "a continent-wide mean length table",
    ],
  },
  {
    speciesId: "esox_niger",
    status: "reviewed",
    regionalNames: ["chain pike", "eastern pickerel"],
    bodyShape:
      "A smaller, more compressed esocid of vegetated water; duck-billed but not the open-water size class of muskellunge.",
    identificationTraits: [
      "Outdoor Alabama: like the redfin, the chain pickerel has fully scaled cheeks and gill covers and few, if any, scales on top of the head.",
      "Outdoor Alabama: sides marked with greenish, rectangular-shaped patterns that resemble the links of a chain.",
      "Connecticut DEEP: opercle and cheek fully scaled. That fully scaled cheek *and* opercle is the pickerel structural key against pike (full cheek, half opercle) and muskie (half cheek, half opercle).",
      "Typically four submandibular pores per side in standard esocid keys (Scott & Crossman); Iowa DNR’s five-versus-six rule is a pike/muskie split and does not by itself identify pickerel.",
      "Do not copy muskellunge open-water size class onto this record.",
    ],
    coloration:
      "Dark green to brown back; sides with chain-like rectangular markings on a yellow-green to brassy ground; pale belly.",
    regionalColorVariation:
      "Connecticut DEEP notes a bright yellow chain pattern on some adults. Stained swamp water can darken the ground color without erasing the chain.",
    spawningColoration:
      "Early-spring fish in flooded vegetation do not replace the chain and scale keys. Flooded margins are never named as aggregation targets.",
    juvenileAppearance:
      "Young fish already show a chain-like or barred pattern and fully scaled cheeks. They are not grass or redfin pickerel without a snout/ray check, and those species are not catalog records here.",
    adultAppearance:
      "A vegetation esocid with a chain-link pattern and fully scaled cheek and gill cover.",
    sexualDimorphism:
      "Sex is not a primary field ID key.",
    similarSpecies: [
      {
        speciesId: "esox_lucius",
        name: "Northern pike",
        distinction:
          "Pike have light bean spots on a dark body and a fully scaled cheek but only the upper half of the opercle scaled. Chain pickerel have chain markings and a fully scaled cheek *and* opercle.",
      },
      {
        speciesId: "esox_masquinongy",
        name: "Muskellunge",
        distinction:
          "Muskie are a much larger, dark-on-light esocid with only the upper half of the cheek scaled. Do not copy that size class onto chain pickerel.",
      },
    ],
    averageAdultLength: "Outdoor Alabama: adult size 15 to 30 in.",
    commonAnglingSize: "Connecticut DEEP illustrates a 17-in adult as characteristic. Many vegetated waters produce 14–20 in fish.",
    typicalWeight: "A smaller size class than pike or muskellunge; often 1–3 lb.",
    maximumDocumentedSize:
      "Fish toward the 30-in Outdoor Alabama ceiling occur. Do not copy muskellunge mass onto this record.",
    sources: [
      {
        label: "Outdoor Alabama chain pickerel species account (fully scaled cheeks and gill covers)",
        class: "agency",
        url: "https://www.outdooralabama.com/pickerel/chain-pickerel",
      },
      {
        label: "Connecticut DEEP chain pickerel account (opercle and cheek fully scaled)",
        class: "agency",
        url: "https://portal.ct.gov/deep/fishing/freshwater/freshwater-fishes-of-connecticut/chain-pickerel",
      },
      { label: "USGS Nonindigenous Aquatic Species chain pickerel profile", class: "agency" },
      { label: "Scott & Crossman freshwater fishes of Canada (esocid pore / scale keys)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "grass and redfin pickerel as catalog records",
      "a continent-wide mean weight table",
    ],
  },
  {
    speciesId: "ictalurus_punctatus",
    status: "reviewed",
    regionalNames: ["channel cat", "willow cat", "fiddler", "spotted cat"],
    bodyShape:
      "TPWD: easily distinguished from all others, except blue catfish, by their deeply forked tail fin. Unlike flathead catfish, the upper jaw projects beyond the lower jaw.",
    identificationTraits: [
      "TPWD: deeply forked tail fin, shared with blue catfish and not with flathead.",
      "TPWD: unlike flathead catfish, the upper jaw projects beyond the lower jaw.",
      "TPWD: typically numerous small black spots are present, but may be obscured in large adults.",
      "TPWD: anal fin has 24–29 soft rays; blue catfish always has 30 or more. The anal-fin margin is rounded (convex), not straight-edged.",
      "Bullheads have square or rounded tails, not a deep fork. Do not copy bullhead spine-lock notes as a channel-catfish identity.",
    ],
    coloration:
      "TPWD: olive-brown to slate-blue on the back and sides, shading to silvery-white on the belly, often with small black spots.",
    regionalColorVariation:
      "Large adults may lose visible spots and look more like a small blue catfish; anal-ray count (24–29 vs 30+) is the remaining key. Do not treat a spotless adult as a blue catfish by color alone.",
    spawningColoration:
      "Cavity spawners in warm water. Spawning dress is not a species key.",
    juvenileAppearance:
      "Young fish are typically more clearly spotted than large adults. They are not bullheads; the tail is already forked.",
    adultAppearance:
      "A forked-tail catfish with a projecting upper jaw, usually spotted, and a rounded anal fin of 24–29 rays.",
    sexualDimorphism:
      "Breeding males may show a thickened head; sex is not the primary species key.",
    similarSpecies: [
      {
        speciesId: "ictalurus_furcatus",
        name: "Blue catfish",
        distinction:
          "Blue catfish have a forked tail too, but TPWD: only the Rio Grande population has dark spots; anal fin typically 30–35 rays and usually straight-edged; slate blue to white. Channel catfish have 24–29 anal rays, a rounded anal margin, and spots that may fade only in large adults.",
      },
      {
        speciesId: "pylodictis_olivaris",
        name: "Flathead catfish",
        distinction:
          "Flathead: slightly notched (not deeply forked) tail, projecting lower jaw, mottled yellow-brown body. Channel: deeply forked tail, projecting upper jaw, usually spotted.",
      },
      {
        speciesId: "ameiurus_nebulosus",
        name: "Brown bullhead",
        distinction:
          "Bullheads have a square or rounded tail, not a deep fork, and are a different size and habitat class. Do not copy bullhead identity onto channel catfish.",
      },
    ],
    averageAdultLength: "TPWD: most are mature by 12 in. Many fisheries see 12–24 in adults.",
    commonAnglingSize: "Commonly 2–8 lb in inland waters; larger fish occur.",
    typicalWeight: "Often a few pounds in rivers and ponds; larger fish occur in big-river and reservoir water.",
    maximumDocumentedSize:
      "TPWD: channel catfish in excess of 36 lb have been landed in Texas waters. The North American record stands at 58 lb. Do not copy blue-catfish or flathead hundred-pound class onto this record.",
    sources: [
      {
        label: "Texas Parks and Wildlife Department channel catfish species account",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/ccf/",
      },
      { label: "Missouri Department of Conservation channel catfish field guide", class: "agency" },
      { label: "USFWS / state catfish management", class: "agency" },
    ],
    ...R,
    gaps: [
      "a continent-wide mean length table",
    ],
  },
  {
    speciesId: "ictalurus_furcatus",
    status: "reviewed",
    regionalNames: ["blue cat", "humpback blue"],
    bodyShape:
      "A large, forked-tail ictalurid; often a more wedge-shaped, longer-anal-fin profile than channel catfish.",
    identificationTraits: [
      "TPWD: blue catfish have a forked tail and are sometimes very similar to channel catfish.",
      "TPWD: only the Rio Grande population has dark spots on the back and sides.",
      "TPWD: number of rays in the anal fin is typically 30–35; coloration is usually slate blue on the back, shading to white on the belly.",
      "TPWD channel account: blue catfish always has 30 or more anal rays, versus 24–29 on channel catfish. Anal margin typically straighter than the channel’s rounded margin.",
      "Upper jaw projects, as in channel catfish — this is not the flathead’s projecting lower jaw. Tail is deeply forked, not the flathead’s slight notch.",
    ],
    coloration:
      "TPWD: usually slate blue on the back, shading to white on the belly. Spots are not the default; they are a Rio Grande-population exception.",
    regionalColorVariation:
      "TPWD: only the Rio Grande population has dark spots. Do not treat a spotted Texas or Mississippi-basin fish as a blue catfish without the anal-ray key.",
    spawningColoration:
      "TPWD: spawning behavior appears similar to channel catfish. Most are not sexually mature until about 24 in. Cavity/structure spawning is biology, not a targeting cue.",
    juvenileAppearance:
      "Young fish are already unspotted outside the Rio Grande exception. They are not channel-catfish juveniles.",
    adultAppearance:
      "A slate-blue, forked-tail catfish with 30–35 anal rays and, except in the Rio Grande population, no dark spots.",
    sexualDimorphism:
      "Sex is not a primary field ID key.",
    similarSpecies: [
      {
        speciesId: "ictalurus_punctatus",
        name: "Channel catfish",
        distinction:
          "Channel catfish have 24–29 anal rays, a rounded anal margin, and typically small black spots that may fade only in large adults. Blue catfish have 30–35 anal rays and, except the Rio Grande population, no dark spots.",
      },
      {
        speciesId: "pylodictis_olivaris",
        name: "Flathead catfish",
        distinction:
          "Flathead: slightly notched tail, projecting lower jaw, mottled yellow-brown. Blue: deeply forked tail, projecting upper jaw, slate blue to white.",
      },
    ],
    averageAdultLength: "A larger size class than channel catfish in the same large-river water; TPWD: most not mature until about 24 in.",
    commonAnglingSize: "TPWD: commonly attain weights of 20 to 40 lb.",
    typicalWeight: "TPWD: commonly 20 to 40 lb; may reach weights well in excess of 100 lb.",
    maximumDocumentedSize:
      "TPWD: may reach weights well in excess of 100 lb. Historical Mississippi River reports of fish exceeding 350 lb are historical notes, not a current targeting class. Do not copy this mass onto channel catfish or bullheads.",
    sources: [
      {
        label: "Texas Parks and Wildlife Department blue catfish species account",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/blc/",
      },
      { label: "USGS Nonindigenous Aquatic Species blue catfish profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "introduced Atlantic-slope size table",
      "anal-fin photograph key as a field aid",
    ],
  },
  {
    speciesId: "pylodictis_olivaris",
    status: "reviewed",
    regionalNames: ["yellow cat", "mud cat", "shovelhead", "opelousa cat"],
    bodyShape:
      "TPWD: head broadly flattened, with a projecting lower jaw. Tail fin only slightly notched, not deeply forked as in blue and channel catfish.",
    identificationTraits: [
      "TPWD: tail fin is only slightly notched, not deeply forked as is the case with blue and channel catfish.",
      "TPWD: the head is broadly flattened, with a projecting lower jaw — the reverse of channel and blue catfish.",
      "TPWD: typically pale yellow to light brown on the back and sides, highly mottled with black and/or brown; belly pale yellow or cream. Young fish may be very dark, almost black.",
      "Anal fin short and rounded, not the long 24–35-ray anal fin of Ictalurus.",
      "Do not copy blue-catfish forked-tail / anal-fin characters onto flathead. Do not copy bullhead square-tail identity onto this large-river predator.",
    ],
    coloration:
      "TPWD: pale yellow (hence yellow cat) to light brown, highly mottled with black and/or brown; belly pale yellow or cream.",
    regionalColorVariation:
      "Young fish may be almost black (TPWD). Mottling can fade or darken with water color; jaw and tail shape remain the keys.",
    spawningColoration:
      "Late-spring to summer cavity spawners. Nest sites are biology, not named targets.",
    juvenileAppearance:
      "TPWD: young fish may be very dark, almost black. They already show a flattened head and a slightly notched tail, not an Ictalurus fork.",
    adultAppearance:
      "A mottled, shovel-headed catfish with a projecting lower jaw and a slightly notched tail.",
    sexualDimorphism:
      "Sex is not a primary field ID key.",
    similarSpecies: [
      {
        speciesId: "ictalurus_punctatus",
        name: "Channel catfish",
        distinction:
          "Channel: deeply forked tail, projecting upper jaw, usually spotted, anal 24–29 rays. Flathead: slightly notched tail, projecting lower jaw, mottled, short rounded anal fin.",
      },
      {
        speciesId: "ictalurus_furcatus",
        name: "Blue catfish",
        distinction:
          "Blue: deeply forked tail, projecting upper jaw, slate blue, anal typically 30–35 rays. Flathead: slightly notched tail, projecting lower jaw, mottled yellow-brown.",
      },
      {
        speciesId: "ameiurus_nebulosus",
        name: "Brown bullhead",
        distinction:
          "Bullheads are small, square-tailed ictalurids. Flathead is a large, slightly notched-tail river predator. Do not copy bullhead table-fare or spine-lock notes onto flathead identity.",
      },
    ],
    averageAdultLength: "TPWD: reach a length of 3 to 4 ft (0.9 to 1.2 m).",
    commonAnglingSize: "Large-river adults commonly well above channel-catfish pond size; exact means are water-specific.",
    typicalWeight: "TPWD: weight can exceed 100 lb (45 kg).",
    maximumDocumentedSize:
      "TPWD: weight can exceed 100 lb. Do not copy that class onto channel catfish or bullheads.",
    sources: [
      {
        label: "Texas Parks and Wildlife Department flathead catfish species account",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/catfish/",
      },
      { label: "USGS Nonindigenous Aquatic Species flathead catfish profile", class: "agency" },
    ],
    ...R,
    gaps: [
      "a continent-wide mean length table",
    ],
  },
  {
    speciesId: "perca_flavescens",
    status: "reviewed",
    regionalNames: ["ring perch", "striped perch", "raccoon perch"],
    bodyShape:
      "A compressed, small-mouthed percid. Not a Morone white perch and not a Sander.",
    identificationTraits: [
      "WDFW: six to eight broad, dark vertical bands running along the sides; the bands extend over the back and end near the white belly.",
      "Golden-yellow to yellow-green flanks with orange to orange-red lower fins in typical adults (WDFW common names striped / ringed perch; Vermont Fish & Wildlife: golden-yellow flanks with six to eight dark vertical bars and orange lower fins).",
      "No large canine teeth and no white lower tail tip — those are walleye characters.",
      "Not a Morone: white perch lack these yellow bars and are a temperate bass, not a Perca.",
      "A visible school is a forage-linked moving aggregation, not a hotspot.",
    ],
    coloration:
      "Yellow to yellow-green sides with 6–8 dark vertical bars; white belly; lower fins often orange. Bar count and color separate this from white perch and from walleye.",
    regionalColorVariation:
      "Clear-water fish are often brighter gold; stained-water fish can be duller. Bars remain the key.",
    spawningColoration:
      "Early-spring fish in shallow vegetation do not lose the bars. Spawning margins are never named.",
    juvenileAppearance:
      "Young perch already show vertical bars. They are not white-perch juveniles and not baby walleye.",
    adultAppearance:
      "A small yellow-barred percid with orange lower fins, no canine teeth, and no white tail tip.",
    sexualDimorphism:
      "Sex is not a primary field ID key.",
    similarSpecies: [
      {
        speciesId: "morone_americana",
        name: "White perch",
        distinction:
          "White perch are Morone: silvery, deeper-bodied, without yellow-perch vertical bars and orange lower fins. Do not copy white-perch identity onto yellow perch.",
      },
      {
        speciesId: "sander_vitreus",
        name: "Walleye",
        distinction:
          "Walleye have a white lower tail tip, a dark blotch at the rear dorsal base, and large canine teeth. Yellow perch have 6–8 vertical bars and no those Sander keys. Do not copy walleye dorsal-spot / white tail-tip keys onto yellow perch.",
      },
      {
        speciesId: "sander_canadensis",
        name: "Sauger",
        distinction:
          "Sauger are blotched Sander with rows of dorsal spots and no white tail tip. Yellow perch are regularly barred and much smaller.",
      },
    ],
    averageAdultLength: "WDFW: average 7–10 in.",
    commonAnglingSize: "WDFW: yellow perch can grow to 10–14 in in quality waters.",
    typicalWeight: "Often well under 1 lb; larger fish occur in productive cool lakes.",
    maximumDocumentedSize:
      "Quality-water fish into the low teens of inches occur (WDFW 10–14 in). Do not copy walleye size onto this record.",
    sources: [
      {
        label: "Washington Department of Fish and Wildlife yellow perch species account",
        class: "agency",
        url: "https://wdfw.wa.gov/species-habitats/species/perca-flavescens",
      },
      {
        label: "Vermont Fish & Wildlife yellow perch account",
        class: "agency",
        url: "https://www.vtfishandwildlife.com/fish/fishing-opportunities/sportfish-of-vermont/yellow-perch",
      },
      { label: "Great Lakes perch assessments", class: "agency" },
      { label: "Thorpe yellow perch biology", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [
      "a continent-wide mean weight table",
    ],
  },
];
