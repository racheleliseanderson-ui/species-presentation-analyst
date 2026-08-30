import {
  CONSUMPTION_ADVISORY_RULE,
  DOSSIER_NEXT_REVIEW_AT,
  DOSSIER_REVIEWED_AT,
  type FoodValueDossier,
} from "./dossier-types.ts";

const R = {
  reviewedAt: DOSSIER_REVIEWED_AT,
  nextReviewAt: DOSSIER_NEXT_REVIEW_AT,
  consumptionAdvisoryRule: CONSUMPTION_ADVISORY_RULE,
} as const;

const FLAVOR_GAP = "a primary-source flavor description independent of generic trout/bass language";
const YIELD_GAP = "fillet-yield percentage as a structured field";
const BONE_GAP = "bone-structure / pin-bone description as a structured field";

/**
 * AFP-FV-1.0 wave 01 — food-value dossiers for the highest-confusion groups.
 *
 * Table character is reference data. It is never a consumption-safety claim
 * and never replaces waterbody-specific advisories. Toxic eggs and venomous
 * spines are biological hazards, not contaminant advisories.
 */
export const FOOD_VALUE_DOSSIERS: FoodValueDossier[] = [
  {
    speciesId: "oncorhynchus_mykiss",
    status: "partial",
    culinaryFrequency: "commonly_eaten",
    culinaryReputation:
      "Inland rainbow trout are widely kept as table fish in stocked and wild fisheries. MassWildlife documents popularity from appearance, leaping, and size, not a culinary paragraph. A sourced flavor/texture note is still a gap.",
    preparationNotes:
      "Standard trout handling: gut and ice promptly. Steelhead culinary notes belong to the anadromous record, not this inland rainbow dossier.",
    commonCookingMethods: ["pan-fry", "bake", "grill"],
    harvestGateNote:
      "Harvest is an ordinary fisheries question in many inland waters and a conservation question in some native or wild-trout jurisdictions. Check current rules.",
    sources: [
      { label: "Massachusetts Division of Fisheries and Wildlife trout identification and fishing tips", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "oncorhynchus_clarkii",
    status: "partial",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "Cutthroat are eaten in some interior fisheries. Many interior subspecies are conservation-constrained. Rainbow culinary notes are not copied onto this record.",
    harvestGateNote:
      "Subspecies and hybridization with rainbow trout are conservation constraints. Harvest opportunity is jurisdictional and often more restricted than inland rainbow.",
    sources: [
      { label: "State/tribal cutthroat status reviews (harvest is a conservation overlay, not a recipe)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP, "subspecies-specific harvest-table notes"],
  },
  {
    speciesId: "oncorhynchus_nerka_kokanee",
    status: "reviewed",
    culinaryFrequency: "regionally_prized",
    culinaryReputation:
      "Idaho Fish and Game: kokanee make excellent table fare. Connecticut DEEP: excellent table fare that rivals wild-caught salmon in a high-end market; one of the state’s best tasting freshwater fish. This is landlocked sockeye, not anadromous sockeye size or ocean diet.",
    flavor:
      "CT DEEP: delicate flavor; IDFG: dark orange flesh, full of fat and omega-3 oils. Do not copy NOAA’s ocean-sockeye “bold, buttery” sentence onto this smaller lake fish without a kokanee-specific quote — IDFG’s orange/fat note is the kokanee source.",
    texture:
      "IDFG notes fat and omega-3 oils that suit barbecuing and smoking. CT DEEP: care after the catch is critical to preserving texture and taste.",
    filletYield:
      "CT DEEP: typically not over 16 inches, so fish can be cooked whole, butterflied, or filleted.",
    preparationNotes:
      "CT DEEP: like all fish, care after catching is critical. Ice promptly. Spawning color-up is not a culinary cue; IDFG notes not to wait past the spawn if table quality is the intent — that is a quality note, not a targeting map.",
    commonCookingMethods: ["barbecue", "smoke", "grill", "cook whole"],
    sources: [
      {
        label: "Idaho Department of Fish and Game Dworshak kokanee notes (excellent table fare; dark orange flesh; omega-3)",
        class: "agency",
        url: "https://idfg.idaho.gov/press/don%E2%80%99t-wait-dworshak-kokanee",
      },
      {
        label: "Connecticut Department of Energy and Environmental Protection kokanee salmon program",
        class: "agency",
        url: "https://portal.ct.gov/deep/fishing/fisheries-management/kokanee-salmon-program",
      },
    ],
    ...R,
    gaps: [BONE_GAP, "lake-specific fat/color variation"],
  },
  {
    speciesId: "oncorhynchus_nerka_anadromous",
    status: "reviewed",
    culinaryFrequency: "regionally_prized",
    culinaryReputation:
      "NOAA Fisheries: sockeye has a bold, buttery flavor similar to Chinook and is rich in omega-3. This is a premier commercial and subsistence salmon. It is not kokanee. Harvest is regulated; some ESUs are listed.",
    flavor:
      "NOAA: bold, buttery flavor similar to Chinook; rich in omega-3.",
    commonCookingMethods: ["grill", "smoke", "bake", "raw preparations where lawful"],
    harvestGateNote:
      "Regulated-context record. Some lower-48 ESUs are federally protected. This culinary note is not a keep recommendation and does not identify a fishery.",
    sources: [
      {
        label: "NOAA Fisheries Sockeye Salmon seafood / recipes page (bold, buttery flavor; omega-3)",
        class: "agency",
        url: "https://www.fisheries.noaa.gov/species/sockeye-salmon/seafood",
      },
      { label: "NOAA Fisheries Sockeye Salmon species profile (harvest and ESU context)", class: "agency" },
    ],
    ...R,
    gaps: [YIELD_GAP, "stock-specific fat tables"],
  },
  {
    speciesId: "micropterus_nigricans",
    status: "reviewed",
    culinaryFrequency: "commonly_eaten",
    culinaryReputation:
      "TPWD: largemouth bass are highly prized for their value as food. Catch-and-release culture is a social fact, not a culinary prohibition. TPWD has separately noted that bass taste good.",
    preparationNotes:
      "Standard warmwater fillet. Ice promptly. Summer air exposure is a quality and survival issue (TPWD handling notes), not a flavor claim.",
    commonCookingMethods: ["pan-fry", "bake", "grill"],
    sources: [
      {
        label: "Texas Parks and Wildlife largemouth bass species account (highly prized as food)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/lmb/",
      },
      { label: "Texas Parks and Wildlife catch-and-release essay (bass taste good — culinary, not a safety claim)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "micropterus_dolomieu",
    status: "reviewed",
    culinaryFrequency: "commonly_eaten",
    culinaryReputation:
      "WDFW: although smallmouth bass make excellent table fare, most anglers in Washington pursue them for sport. Culinary reputation and sport reputation are separate facts.",
    commonCookingMethods: ["pan-fry", "bake"],
    sources: [
      {
        label: "Washington Department of Fish and Wildlife smallmouth bass species account (excellent table fare)",
        class: "agency",
        url: "https://wdfw.wa.gov/species-habitats/species/micropterus-dolomieu",
      },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "micropterus_punctulatus",
    status: "partial",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "Spotted bass are a black bass and are eaten in some fisheries. Largemouth and smallmouth culinary quotes are not copied onto this record without a spotted-bass source.",
    sources: [
      { label: "Texas Parks and Wildlife bass identification key (identity, not a culinary paragraph)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP, "species-specific table-fare quote"],
  },
  {
    speciesId: "morone_saxatilis",
    status: "reviewed",
    culinaryFrequency: "commonly_eaten",
    culinaryReputation:
      "Missouri Department of Conservation: many anglers also like the flavorful flesh. This is a large Morone. Atlantic and landlocked fish share species identity; contaminant load is waterbody-specific, not a species safety rating.",
    flavor: "MDC: flavorful flesh. A more detailed texture/fat note is still a gap.",
    commonCookingMethods: ["grill", "bake", "smoke"],
    harvestGateNote:
      "Coastal striped bass fisheries are tightly managed. This culinary note is not a keep recommendation.",
    sources: [
      { label: "Missouri Department of Conservation striped bass field guide (flavorful flesh)", class: "agency" },
    ],
    ...R,
    gaps: [YIELD_GAP, BONE_GAP, "Atlantic versus landlocked fat/flavor table"],
  },
  {
    speciesId: "morone_chrysops",
    status: "reviewed",
    culinaryFrequency: "commonly_eaten",
    culinaryReputation:
      "TPWD reservoir notes describe white bass as great table fare and as tasty as crappie. That is a culinary reputation, not a current-hatch claim and not a striped-bass size class.",
    commonCookingMethods: ["pan-fry", "bake"],
    sources: [
      { label: "Texas Parks and Wildlife Lake Fork fishing page (white bass great table fare; tasty as crappie)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "morone_americana",
    status: "reviewed",
    culinaryFrequency: "regionally_prized",
    culinaryReputation:
      "New Jersey Division of Fish and Wildlife: known for their table fare qualities. White perch are a smaller Morone. Introduced inland populations do not inherit a different culinary identity.",
    commonCookingMethods: ["pan-fry", "bake"],
    sources: [
      { label: "New Jersey Division of Fish and Wildlife white perch page (table fare qualities)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "morone_hybrid_wiper",
    status: "partial",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "Wipers are a stocked Morone hybrid and are kept in many reservoirs. Striped-bass and white-bass culinary quotes are not copied onto this record without a hybrid-specific source.",
    harvestGateNote:
      "Presence is a stocking fact. Harvest rules follow the stocking jurisdiction.",
    sources: [
      { label: "Missouri Department of Conservation hybrid striped bass field guide (identity, not a culinary paragraph)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP, "hybrid-specific table-fare quote"],
  },
  {
    speciesId: "morone_mississippiensis",
    status: "partial",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "Yellow bass are a small temperate bass and are eaten in some interior fisheries. White-bass culinary quotes are not copied onto this record.",
    sources: [
      { label: "Missouri Department of Conservation yellow bass field guide", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP, "species-specific table-fare quote"],
  },
  {
    speciesId: "coregonus_artedi",
    status: "partial",
    culinaryFrequency: "regionally_prized",
    culinaryReputation:
      "Cisco (tullibee / lake herring) have a commercial and smoked-fish history in the Great Lakes and inland lakes. Lake-whitefish “finest flavor” notes are not copied onto cisco. FDA seafood-hazard tables list cisco/tullibee as a smoked-fish species — process identity, not a flavor paragraph.",
    commonCookingMethods: ["smoke", "pan-fry"],
    sources: [
      { label: "FDA Fish and Fishery Products Hazards and Controls (cisco or tullibee as a smoked-fish species)", class: "agency" },
      { label: "Minnesota DNR cisco identification notes", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, "Great Lakes versus inland culinary contrast"],
  },
  {
    speciesId: "coregonus_clupeaformis",
    status: "reviewed",
    culinaryFrequency: "regionally_prized",
    culinaryReputation:
      "Michigan EGLE: prized for its mild flavor; long-standing tribal, commercial, and restaurant staple of the Great Lakes. NOAA Sea Grant / Wisconsin commercial notes have described lake whitefish as having the finest flavor of any of Wisconsin’s commercial fishes, with higher omega-3 fatty acid content. This is not cisco.",
    flavor:
      "Michigan EGLE: mild flavor. Wisconsin Sea Grant commercial literature: finest flavor among that state’s commercial fishes; omega-3 content noted.",
    commonCookingMethods: ["bake", "pan-fry", "smoke"],
    harvestGateNote:
      "Great Lakes commercial and tribal fisheries are managed stocks. This culinary note is not a keep recommendation for every inland lake.",
    sources: [
      {
        label: "Michigan EGLE lake whitefish feature (prized for mild flavor; tribal and commercial staple)",
        class: "agency",
        url: "https://www.michigan.gov/egle/newsroom/mi-environment/2026/08/06/lake-whitefish",
      },
      { label: "NOAA Sea Grant / Wisconsin commercial lake whitefish notes (finest flavor; omega-3)", class: "agency" },
    ],
    ...R,
    gaps: [YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "hiodon_alosoides",
    status: "reviewed",
    culinaryFrequency: "regionally_prized",
    culinaryReputation:
      "Smoked “Winnipeg goldeye” is a documented Canadian commercial product. DFO historical literature: by 1910 dealers in Winnipeg were processing most of the smoked goldeye under that name. Montana FWP commercial-fish notes: goldeye shipped to Winnipeg buyers where they are smoked and considered a great delicacy. Mooneye is not this product.",
    flavor:
      "The reviewed culinary identity is smoked goldeye, not a generic whitefish fry. Fresh unsmoked flavor is not sourced here and stays a gap.",
    preparationNotes:
      "The documented high-value product is cold-smoked. That is a preparation tradition, not a safety claim.",
    commonCookingMethods: ["smoke"],
    sources: [
      { label: "Fisheries and Oceans Canada goldeye in Canada (Winnipeg goldeye smoked product)", class: "agency" },
      { label: "Montana Fish, Wildlife & Parks markets for Montana commercial fish (smoked Winnipeg goldeye delicacy)", class: "agency" },
    ],
    ...R,
    gaps: ["fresh (unsmoked) flavor as a structured field", YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "hiodon_tergisus",
    status: "partial",
    culinaryFrequency: "rarely_eaten",
    culinaryReputation:
      "Mooneye are not the Winnipeg goldeye smoked product. No reviewed culinary paragraph is on file. Do not copy goldeye smoking notes onto this record.",
    sources: [
      { label: "Ontario mooneye species profile (identity, not a culinary paragraph)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP, "species-specific table-fare quote"],
  },
  {
    speciesId: "cyprinus_carpio",
    status: "reviewed",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "TPWD: in many parts of the world carp is held in high esteem as a food fish; if properly cared for it can make a delicious addition to the menu. North American reputation is more mixed. This is not buffalo and not invasive carp (Hypophthalmichthys / Ctenopharyngodon) — USGS “Asian carp” flesh notes are not copied here.",
    flavor:
      "TPWD: skin tends to add a strong, fishy flavor; flavor is improved by bleeding and by removing the dark meat along the side.",
    boneStructure:
      "TPWD: many small bones. Scoring lets heat and cooking oils penetrate and soften those bones. Vinegar in pickled recipes is described as breaking down bones.",
    cleaningDifficulty:
      "TPWD: gut, gill, and ice within a short time. Remove blood along the backbone and from the body cavity because that blood causes faster spoilage. Skin the fish. Remove dark lateral meat.",
    skinConsiderations:
      "TPWD: most people agree the skin adds a strong, fishy flavor — skin the carp.",
    preparationNotes:
      "TPWD methods include scoring and deep-frying, baking with basting, cakes after separating meat from bones, chowder, and pickling. Scoring is a bone-management step, not a lure note.",
    commonCookingMethods: ["deep-fry after scoring", "bake", "smoke is not the TPWD default", "pickle"],
    sources: [
      {
        label: "Texas Parks and Wildlife how to cook a carp",
        class: "agency",
        url: "https://tpwd.texas.gov/fishboat/fish/didyouknow/inland/carp_recipes.phtml",
      },
    ],
    ...R,
    gaps: [YIELD_GAP],
  },
  {
    speciesId: "ictiobus_cyprinellus",
    status: "reviewed",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "TPWD: many people consider it quite a food fish despite its many bones; some even relish the bony nature. This is not carp. Harvest is a regulated-context question because of extreme longevity.",
    boneStructure:
      "TPWD: many bones. Bone count is a cleaning fact, not a reason to treat the fish as a pest.",
    harvestGateNote:
      "Regulated-context record. Long lifespan and episodic recruitment make local harvest context material even where fish appear abundant. This culinary note is not a keep recommendation.",
    commonCookingMethods: ["bake", "grind / cake after bone removal"],
    sources: [
      {
        label: "Texas Parks and Wildlife bigmouth buffalo species account (food fish despite many bones)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/sucker/",
      },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP],
  },
  {
    speciesId: "ictiobus_bubalus",
    status: "reviewed",
    culinaryFrequency: "regionally_prized",
    culinaryReputation:
      "TPWD: many people may be unaware that smallmouth buffalo is quite a food fish; it is the number one species sold by commercial freshwater fishermen. Although some anglers consider it a rough fish, in many areas the species is highly prized. This is not carp.",
    harvestGateNote:
      "Regulated-context record. Verify current local harvest and legal-method rules. Commercial importance is not a sport-harvest instruction.",
    commonCookingMethods: ["bake", "pan-fry", "commercial processing"],
    sources: [
      {
        label: "Texas Parks and Wildlife smallmouth buffalo species account (food fish; leading commercial freshwater species)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/smallmouthbuffalo/",
      },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "lepisosteus_osseus",
    status: "reviewed",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "California Department of Fish and Wildlife: although the flesh of gars is edible, their eggs are poisonous to humans, birds, and other mammals. USFWS: humans should not eat gar eggs — they cause violent illness. Flesh edibility is not a contaminant-safety claim.",
    biologicalHazards: [
      "Gar eggs are toxic to humans, birds, and other mammals (CDFW; USFWS). This is a species-level biological hazard, not a waterbody advisory.",
    ],
    cleaningDifficulty:
      "Ganoid scales are interlocking armor (USFWS). Cleaning is a scale-and-armor problem more than a typical trout fillet.",
    skinConsiderations:
      "Diamond ganoid scales do not skin like a trout. Plan for armor.",
    harvestGateNote:
      "Legal methods for gar vary by jurisdiction. Eggs must never be treated as food or forage.",
    sources: [
      { label: "California Department of Fish and Wildlife invasive gar page (flesh edible; eggs poisonous)", class: "agency" },
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (do not eat gar eggs)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP],
  },
  {
    speciesId: "lepisosteus_oculatus",
    status: "reviewed",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "Family-level sources: gar flesh is edible; gar eggs are poisonous. Spotted-gar-specific flavor notes are not on file. Alligator-gar “mild, white, firm” quotes are not copied onto this smaller species.",
    biologicalHazards: [
      "Gar eggs are toxic to humans, birds, and other mammals (CDFW; USFWS). Species-level biological hazard, not a waterbody advisory.",
    ],
    cleaningDifficulty:
      "Ganoid armor. Smaller than alligator or longnose gar, still not a typical scale-fish fillet.",
    harvestGateNote:
      "Legal methods vary. Eggs must never be treated as food.",
    sources: [
      { label: "California Department of Fish and Wildlife invasive gar page (family flesh/egg note)", class: "agency" },
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (egg toxicity)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, "species-specific culinary paragraph"],
  },
  {
    speciesId: "lepisosteus_platostomus",
    status: "reviewed",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "Family-level sources: gar flesh is edible; gar eggs are poisonous. Shortnose-specific flavor notes are not on file.",
    biologicalHazards: [
      "Gar eggs are toxic to humans, birds, and other mammals (CDFW; USFWS). Species-level biological hazard, not a waterbody advisory.",
    ],
    cleaningDifficulty: "Ganoid armor.",
    harvestGateNote:
      "Legal methods vary. Eggs must never be treated as food.",
    sources: [
      { label: "California Department of Fish and Wildlife invasive gar page (family flesh/egg note)", class: "agency" },
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (egg toxicity)", class: "agency" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, "species-specific culinary paragraph"],
  },
  {
    speciesId: "atractosteus_spatula",
    status: "reviewed",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "TPWD: flesh is white and firm with a mild taste, comparable to many sport fishes; commercial fisheries exist in some southern states. USFWS: Native peoples used and still use gar as food; eggs must not be eaten. This is not a keep recommendation.",
    flavor: "TPWD: mild taste, comparable to the flesh of many sport fishes that anglers eat.",
    texture: "TPWD: white and firm.",
    biologicalHazards: [
      "TPWD: eggs of the alligator gar are toxic and may cause sickness if eaten.",
      "USFWS: do not eat gar eggs; they cause violent illness.",
    ],
    cleaningDifficulty:
      "Ganoid interlocking armor and a heavy bony head. Cleaning is not a typical scale-fish fillet.",
    harvestGateNote:
      "Regulated-context record. Verify current legal methods and harvest rules. TPWD notes consumption advisories for alligator gar (and other gar species) on a number of systems — those advisories are waterbody-specific and are not encoded here as a static safety rating.",
    commonCookingMethods: ["firm white-flesh methods used for other large sport fish"],
    sources: [
      {
        label: "Texas Parks and Wildlife alligator gar edible-flesh page (flesh description; toxic eggs; waterbody advisories)",
        class: "agency",
        url: "https://tpwd.texas.gov/fishboat/fish/management/alligator-gar/edible.phtml",
      },
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (food use; do not eat eggs)", class: "agency" },
    ],
    ...R,
    gaps: [YIELD_GAP],
  },
  {
    speciesId: "ameiurus_nebulosus",
    status: "reviewed",
    culinaryFrequency: "commonly_eaten",
    culinaryReputation:
      "WDFW: bullheads also make excellent table fare; many anglers consider catfish taken from cool, clean water to be the ultimate in piscatorial cuisine. Water quality affects culinary reputation — that is not a contaminant-safety rating for a named water.",
    flavor:
      "WDFW ties better table quality to cool, clean water. That is a handling/habitat quality note, not a claim that any particular water is safe.",
    biologicalHazards: [
      "Ictalurid dorsal and pectoral spines can puncture and the sheath can introduce venom and bacteria (Huang et al. 2013). A handling hazard during cleaning, not a table-flavor note.",
    ],
    cleaningDifficulty:
      "Skin rather than scale. Avoid spines while cleaning.",
    commonCookingMethods: ["pan-fry", "skin and fry"],
    sources: [
      {
        label: "Washington Department of Fish and Wildlife brown bullhead species account (excellent table fare; cool clean water)",
        class: "agency",
        url: "https://wdfw.wa.gov/species-habitats/species/ameiurus-nebulosus",
      },
      { label: "Huang et al. 2013 catfish spine envenomation (cleaning/handling hazard)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [YIELD_GAP, BONE_GAP],
  },
  {
    speciesId: "ameiurus_melas",
    status: "partial",
    culinaryFrequency: "sometimes_eaten",
    culinaryReputation:
      "Black bullhead are eaten in some warm, turbid fisheries. WDFW’s brown-bullhead table-fare paragraph is not copied onto this species. TPWD treats them as typically smaller than important game catfishes.",
    biologicalHazards: [
      "Ictalurid dorsal and pectoral spines can puncture (Huang et al. 2013).",
    ],
    cleaningDifficulty: "Skin rather than scale. Avoid spines.",
    sources: [
      { label: "Texas Parks and Wildlife black bullhead species account", class: "agency" },
      { label: "Huang et al. 2013 catfish spine envenomation", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [FLAVOR_GAP, YIELD_GAP, "species-specific table-fare quote independent of brown bullhead"],
  },
  {
    speciesId: "ameiurus_natalis",
    status: "reviewed",
    culinaryFrequency: "rarely_eaten",
    culinaryReputation:
      "TPWD: although yellow bullheads rarely achieve edible size, some individuals may exceed four pounds. That is a size/yield note, not a flavor paragraph and not a consumption-safety claim.",
    filletYield:
      "TPWD: rarely achieve edible size; some individuals may exceed four pounds; largest reported in Texas 5.59 lb.",
    biologicalHazards: [
      "Ictalurid dorsal and pectoral spines can puncture (Huang et al. 2013).",
    ],
    cleaningDifficulty: "Skin rather than scale. Avoid spines.",
    sources: [
      {
        label: "Texas Parks and Wildlife yellow bullhead species account (rarely achieve edible size)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/ybh/",
      },
      { label: "Huang et al. 2013 catfish spine envenomation", class: "peer_reviewed" },
    ],
    ...R,
    gaps: [FLAVOR_GAP],
  },
];
