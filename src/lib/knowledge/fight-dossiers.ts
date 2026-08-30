import {
  DOSSIER_NEXT_REVIEW_AT,
  DOSSIER_REVIEWED_AT,
  type FightDossier,
} from "./dossier-types.ts";

const R = {
  reviewedAt: DOSSIER_REVIEWED_AT,
  nextReviewAt: DOSSIER_NEXT_REVIEW_AT,
} as const;

const JUMP_GAP = "jumping frequency as a structured field with a primary-source quote";
const SHAKE_GAP = "head-shake tendency as a structured field with a primary-source quote";
const ENDURANCE_GAP = "sustained-endurance class as a structured field with a primary-source quote";

/**
 * AFP-FT-1.0 wave 01 — fight dossiers for the highest-confusion groups.
 *
 * Descriptive mechanics only. Not a 1–100 score, fun rating, or catch claim.
 * Missing fields stay omitted rather than inferred from body shape.
 */
export const FIGHT_DOSSIERS: FightDossier[] = [
  {
    speciesId: "oncorhynchus_mykiss",
    status: "reviewed",
    overview:
      "Agency accounts describe rainbow trout as a leaping fish that can take line. This is a hooked-fish description, not a claim that fish will bite.",
    relativeStrength: "powerful",
    relativeStrengthNote:
      "MassWildlife lists strong leaping ability among the reasons rainbows are popular. NY DEC describes a hooked rainbow peeling line from the reel while leaping.",
    runTendency: "mixed",
    jumping: "frequent",
    aerialBehavior: "often_aerial",
    landingConsiderations:
      "Expect aerial thrashing near the surface. Keep the fish in the water while unhooking when release is the intent. Do not infer fight quality from inland versus steelhead size — steelhead is a separate record.",
    sources: [
      {
        label: "Massachusetts Division of Fisheries and Wildlife trout identification and fishing tips (strong leaping ability)",
        class: "agency",
        url: "https://www.mass.gov/info-details/trout-identification-and-fishing-tips",
      },
      {
        label: "New York State Department of Environmental Conservation Cayuga Inlet (rainbow leaping / peeling line)",
        class: "agency",
        url: "https://dec.ny.gov/places/cayuga-inlet",
      },
    ],
    ...R,
    gaps: [SHAKE_GAP, ENDURANCE_GAP, "stream versus lake fight table as a structured field"],
  },
  {
    speciesId: "oncorhynchus_clarkii",
    status: "partial",
    overview:
      "Cutthroat are a salmonid. Agency pages document spawning leaps at falls, which is migration biology, not a hooked-fight dossier. Inland rainbow leaping notes are not copied onto this record.",
    relativeStrengthNote:
      "No reviewed hooked-fight description is on file that is independent of rainbow trout literature. WDFW notes resident cutthroat as aggressive feeders — that is diet/behavior, not fight class.",
    landingConsiderations:
      "Handle as a trout: keep the fish wet when release is intended. Subspecies conservation status can change legal handling; that is a regulations question, not a fight score.",
    sources: [
      { label: "Washington Department of Fish and Wildlife coastal cutthroat (resident) species account", class: "agency" },
      { label: "National Park Service Yellowstone cutthroat leaping at falls (migration, not hooked fight)", class: "agency" },
    ],
    ...R,
    gaps: [
      "hooked-fight description independent of rainbow trout",
      JUMP_GAP,
      SHAKE_GAP,
      ENDURANCE_GAP,
    ],
  },
  {
    speciesId: "oncorhynchus_nerka_kokanee",
    status: "reviewed",
    overview:
      "Connecticut DEEP describes kokanee as great fighters on light tackle. Size is typically small; this is not anadromous sockeye mass. Fight notes are not a bite claim.",
    relativeStrength: "moderate",
    relativeStrengthNote:
      "CT DEEP: kokanee are great fighters on light tackle. Montana Field Guide: once located they provide excellent sport as well as table fare. That is a light-tackle description, not a striper-scale power claim.",
    jumping: "occasional",
    aerialBehavior: "sometimes_aerial",
    landingConsiderations:
      "CT DEEP notes typical fish are not over 16 inches. Light tackle and a small net are the usual mechanical context. Spawning color-up is biology, not a fight cue.",
    sources: [
      {
        label: "Connecticut Department of Energy and Environmental Protection kokanee salmon program (fighters on light tackle)",
        class: "agency",
        url: "https://portal.ct.gov/deep/fishing/fisheries-management/kokanee-salmon-program",
      },
      { label: "Montana Field Guide kokanee account (excellent sport and table fare)", class: "agency" },
    ],
    ...R,
    gaps: [SHAKE_GAP, ENDURANCE_GAP, "reservoir versus natural-lake fight notes"],
  },
  {
    speciesId: "oncorhynchus_nerka_anadromous",
    status: "partial",
    overview:
      "Anadromous sockeye are a larger Pacific salmon than kokanee. NOAA documents size and harvest importance; a structured hooked-fight class is not yet on file. Do not copy kokanee light-tackle notes onto returning adults.",
    relativeStrengthNote:
      "NOAA adult size (commonly 4–15 lb, 1.5–2.5 ft) is mass context, not a reviewed fight class. Freshwater adults are in a migration/spawning phase; that is conservation context, not a fight recommendation.",
    landingConsiderations:
      "Handle as a salmon. Listed ESUs and spawning fish are invalidators. This dossier does not convert run timing into a targeting product.",
    sources: [
      { label: "NOAA Fisheries Sockeye Salmon species profile (size and life history)", class: "agency" },
    ],
    ...R,
    gaps: [
      "hooked-fight description independent of kokanee light-tackle notes",
      JUMP_GAP,
      SHAKE_GAP,
      ENDURANCE_GAP,
    ],
  },
  {
    speciesId: "micropterus_nigricans",
    status: "partial",
    overview:
      "Largemouth are a highly sought warmwater sport fish. TPWD documents food value and heat-stress handling. A structured fight class independent of smallmouth literature is not yet on file. Do not copy smallmouth aerial-acrobat notes onto this record.",
    relativeStrengthNote:
      "TPWD documents popularity and food value, not a pound-for-pound fight ranking. Iowa DNR’s hardest-fighting note is for smallmouth, not largemouth.",
    landingConsiderations:
      "TPWD catch-and-release guidance notes bass are easily stressed in hot summer months when held for weigh-in. Keep fish in the water when release is the intent. This is handling, not a bite window.",
    handlingSensitivity:
      "Heat and prolonged air exposure are documented handling risks in warmwater bass fisheries (TPWD).",
    sources: [
      {
        label: "Texas Parks and Wildlife largemouth bass species account",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/lmb/",
      },
      { label: "Texas Parks and Wildlife catch-and-release / bass length-weight handling notes (summer stress)", class: "agency" },
    ],
    ...R,
    gaps: [JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP, "cover-oriented surge description as a structured field"],
  },
  {
    speciesId: "micropterus_dolomieu",
    status: "reviewed",
    overview:
      "Multiple agencies describe smallmouth as a strong, often aerial fighter, with current adding difficulty. This is a hooked-fish description, not a catch-probability score.",
    relativeStrength: "powerful",
    relativeStrengthNote:
      "WDFW: experienced anglers agree that pound-for-pound, smallmouth are stronger and more acrobatic fighters than most freshwater sport fish. Iowa DNR: aggressive, scrappy-fighting aerial acrobat; hardest fighting freshwater fish pound per pound. NY DEC: pound for pound among the hardest-fighting freshwater fish in New York; acrobatic leaps. NH Fish and Game: strong fighting fish prone to leaping.",
    initialAcceleration: "abrupt",
    runTendency: "short_surges",
    jumping: "frequent",
    aerialBehavior: "often_aerial",
    landingConsiderations:
      "WDFW: several powerful surges toward the bottom or jumps at the surface are common; current makes getting the fish to the net harder. Expect direction changes. Keep the fish wet when release is intended.",
    sources: [
      {
        label: "Washington Department of Fish and Wildlife smallmouth bass species account",
        class: "agency",
        url: "https://wdfw.wa.gov/species-habitats/species/micropterus-dolomieu",
      },
      {
        label: "Iowa Department of Natural Resources six Iowa fish that put up the biggest fight (2015)",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2015-06-23/six-iowa-fish-put-biggest-fight",
      },
      { label: "New York State Department of Environmental Conservation smallmouth record announcement (acrobatic leaps)", class: "agency" },
      { label: "New Hampshire Fish and Game smallmouth bass species page", class: "agency" },
    ],
    ...R,
    gaps: [SHAKE_GAP, "river versus reservoir fight table as a structured field"],
  },
  {
    speciesId: "micropterus_punctulatus",
    status: "partial",
    overview:
      "Spotted bass are a black bass. Smallmouth aerial-acrobat notes and largemouth cover-surge notes are not copied onto this record without a spotted-bass source.",
    relativeStrengthNote:
      "No reviewed spotted-bass fight description independent of other Micropterus literature is on file.",
    landingConsiderations:
      "Handle as a black bass. Heat-stress caution used for largemouth is plausible in the same warmwater fisheries but is not a spotted-bass-specific quote.",
    sources: [
      { label: "Texas Parks and Wildlife bass identification key (species identity, not fight class)", class: "agency" },
    ],
    ...R,
    gaps: [
      "species-specific hooked-fight description",
      JUMP_GAP,
      SHAKE_GAP,
      ENDURANCE_GAP,
    ],
  },
  {
    speciesId: "morone_saxatilis",
    status: "reviewed",
    overview:
      "Agencies describe striped bass as powerful fighters that often sound for depth after the hookup. Size range is much larger than white bass. This is not a bite score.",
    relativeStrength: "very_powerful",
    relativeStrengthNote:
      "NJDEP: known for powerful fighting ability; mature fish robust and large. Missouri Department of Conservation: anglers prefer striped bass for large growth potential and powerful fighting qualities. Kentucky Fish and Wildlife: striped bass usually nosedive for the depths after striking; landing several fish at once is a mechanical problem of power, not a hotspot.",
    initialAcceleration: "abrupt",
    sustainedEndurance: "prolonged",
    runTendency: "long_runs",
    jumping: "occasional",
    aerialBehavior: "sometimes_aerial",
    deepWaterPressure:
      "Kentucky Fish and Wildlife: fish usually nosedive for the depths after striking. Landing is a pressure-and-direction problem more than a cover-snag problem.",
    landingConsiderations:
      "Expect sustained depth. Do not copy white-bass school-fight notes onto a large striper. Handle large fish in the water when release is intended.",
    sources: [
      { label: "New Jersey Division of Fish and Wildlife striped bass freshwater page (powerful fighting ability)", class: "agency" },
      { label: "Missouri Department of Conservation striped bass field guide (powerful fighting qualities)", class: "agency" },
      { label: "Kentucky Department of Fish and Wildlife Lake Cumberland striped bass notes (nosedive for depths)", class: "agency" },
    ],
    ...R,
    gaps: [SHAKE_GAP, "anadromous versus landlocked fight table as a structured field"],
  },
  {
    speciesId: "morone_chrysops",
    status: "reviewed",
    overview:
      "Iowa DNR describes white bass as aggressive strong swimmers and incredible fighters. This is a schooling Morone, typically much smaller than striped bass. Do not copy striper mass onto this record.",
    relativeStrength: "powerful",
    relativeStrengthNote:
      "Iowa DNR: these fast-growing predators are incredible fighters; they are aggressive strong swimmers. That is a swimming/fight note, not a catch-probability score.",
    initialAcceleration: "abrupt",
    runTendency: "mixed",
    landingConsiderations:
      "Schooling hookups can mean several fish at once, which is a landing-logistics problem. Size is typically panfish-to-small-gamefish, not striper scale.",
    sources: [
      {
        label: "Iowa Department of Natural Resources six Iowa fish that put up the biggest fight (2015)",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2015-06-23/six-iowa-fish-put-biggest-fight",
      },
    ],
    ...R,
    gaps: [JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "morone_americana",
    status: "partial",
    overview:
      "White perch are a smaller, deeper-bodied Morone. NJDEP documents table-fare reputation. A structured fight class independent of white bass is not yet on file.",
    relativeStrengthNote:
      "No reviewed white-perch fight description is on file. Do not copy white-bass or striped-bass power notes onto this record.",
    landingConsiderations:
      "Typically smaller than white bass or striper. Handle as a small Morone. Introduced inland populations do not change fight class.",
    sources: [
      { label: "New Jersey Division of Fish and Wildlife white perch page (table-fare identity, not fight class)", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "morone_hybrid_wiper",
    status: "reviewed",
    overview:
      "Iowa DNR describes hybrid striped bass as strong swimmers and explosive fighters when hooked. Presence is a stocking fact. This is not a reproductive run and not a white-bass size class.",
    relativeStrength: "powerful",
    relativeStrengthNote:
      "Iowa DNR: a cross that can attain weights over twenty pounds; these strong swimmers are explosive fighters when hooked.",
    initialAcceleration: "abrupt",
    runTendency: "mixed",
    landingConsiderations:
      "Expect more mass than white bass in the same water. Current edges and tailwaters add mechanical load, as with other pelagic Morone. Hybrids are not a spawning-run product.",
    sources: [
      {
        label: "Iowa Department of Natural Resources six Iowa fish that put up the biggest fight (2015)",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2015-06-23/six-iowa-fish-put-biggest-fight",
      },
    ],
    ...R,
    gaps: [JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "morone_mississippiensis",
    status: "partial",
    overview:
      "Yellow bass are a smaller temperate bass. White-bass fight notes are not copied onto this record.",
    relativeStrengthNote:
      "No reviewed yellow-bass fight description independent of white bass is on file. Typical size is smaller than white bass.",
    landingConsiderations:
      "Handle as a small Morone. Do not apply striper or wiper mass expectations.",
    sources: [
      { label: "Missouri Department of Conservation yellow bass field guide (identity, not fight class)", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "coregonus_artedi",
    status: "partial",
    overview:
      "Cisco are a coldwater coregonine. Commercial and ice fisheries exist; a structured hooked-fight class is not yet on file.",
    relativeStrengthNote:
      "No reviewed cisco fight description is on file. Do not infer fight from lake-whitefish commercial identity or from trout leaping literature.",
    landingConsiderations:
      "Typically smaller than lake whitefish in the same waters. Handle as a coldwater coregonine; keep fish wet when release is intended.",
    sources: [
      { label: "Minnesota DNR cisco / lake whitefish identification (size contrast, not fight class)", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "coregonus_clupeaformis",
    status: "partial",
    overview:
      "Lake whitefish are a larger, more benthic coregonine than cisco. Culinary reputation is reviewed separately. A structured hooked-fight class is not yet on file.",
    relativeStrengthNote:
      "No reviewed lake-whitefish fight description is on file. Commercial importance is not a fight class.",
    landingConsiderations:
      "Typically larger than cisco. Handle as a coldwater coregonine. Keep fish wet when release is intended.",
    sources: [
      { label: "Michigan EGLE / DNR lake whitefish notes (culinary and commercial identity, not fight class)", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "hiodon_alosoides",
    status: "partial",
    overview:
      "Goldeye are a large-river hiodontid with a smoked-fish culinary identity. A structured hooked-fight class is not yet on file. Do not copy trout leaping notes onto this record.",
    relativeStrengthNote:
      "No reviewed goldeye fight description is on file. Large eyes and surface feeding are optics/diet, not fight class.",
    landingConsiderations:
      "Handle as a compressed, relatively soft-mouthed river fish. Keep wet when release is intended.",
    sources: [
      { label: "Government of Alberta goldeye species profile (identity, not fight class)", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "hiodon_tergisus",
    status: "partial",
    overview:
      "Mooneye are the clearer-water hiodontid. Goldeye notes are not copied onto this record.",
    relativeStrengthNote:
      "No reviewed mooneye fight description is on file.",
    landingConsiderations:
      "Typically similar in size to goldeye or slightly smaller. Handle as a compressed river/lake fish.",
    sources: [
      { label: "Ontario mooneye species profile (identity, not fight class)", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "cyprinus_carpio",
    status: "reviewed",
    overview:
      "Iowa DNR describes common carp as putting up a long, strong fight when hooked, often with current adding load. This is not a jumping-bass description and not a buffalo fight class.",
    relativeStrength: "powerful",
    relativeStrengthNote:
      "Iowa DNR: these large minnows often weigh up to 50 pounds or more and put up a long, strong fight when hooked; you are usually fighting the fish along with the current.",
    sustainedEndurance: "prolonged",
    runTendency: "long_runs",
    jumping: "rare",
    aerialBehavior: "rarely_aerial",
    bulldogging: "high",
    landingConsiderations:
      "Expect duration and current load more than aerial display. Large fish need a net or unhooking in the water. Catalog exception notes pressure sensitivity — that is behavior, not a fight score.",
    sources: [
      {
        label: "Iowa Department of Natural Resources six Iowa fish that put up the biggest fight (2015)",
        class: "agency",
        url: "https://www.iowadnr.gov/news-release/2015-06-23/six-iowa-fish-put-biggest-fight",
      },
    ],
    ...R,
    gaps: [SHAKE_GAP, JUMP_GAP],
  },
  {
    speciesId: "ictiobus_cyprinellus",
    status: "partial",
    overview:
      "Bigmouth buffalo are a long-lived native catostomid. TPWD documents food value and bones. A structured fight class independent of smallmouth buffalo is not yet on file. Do not copy carp fight notes onto this record.",
    relativeStrengthNote:
      "TPWD documents size and food value. Smallmouth buffalo’s “exceptional sport” quote is not copied onto bigmouth without a matching source.",
    landingConsiderations:
      "Large, deep-bodied fish. Harvest is a regulated-context question — longevity research (Lackmann) is conservation context, not a fight rating.",
    sources: [
      { label: "Texas Parks and Wildlife bigmouth buffalo species account (food/bones; not a fight class)", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "ictiobus_bubalus",
    status: "reviewed",
    overview:
      "TPWD: when hooked, smallmouth buffalo provide exceptional sport. This is a native buffalo, not carp. Fight notes are not a harvest recommendation; the record is regulated-context.",
    relativeStrength: "powerful",
    relativeStrengthNote:
      "TPWD: buffalo will sometimes take doughballs, and when hooked provide exceptional sport. Specimens in excess of 82 pounds have been landed by rod and reel in Texas.",
    sustainedEndurance: "sustained",
    runTendency: "mixed",
    jumping: "rare",
    aerialBehavior: "rarely_aerial",
    landingConsiderations:
      "Expect mass more than aerial display. This is not carp. Harvest and legal methods remain jurisdictional.",
    sources: [
      {
        label: "Texas Parks and Wildlife smallmouth buffalo species account (exceptional sport when hooked)",
        class: "agency",
        url: "https://tpwd.texas.gov/huntwild/wild/species/smallmouthbuffalo/",
      },
    ],
    ...R,
    gaps: [SHAKE_GAP, JUMP_GAP],
  },
  {
    speciesId: "lepisosteus_osseus",
    status: "partial",
    overview:
      "Longnose gar are an armored, elongate predator. USFWS family notes describe ganoid scales as interlocking armor. A structured hooked-fight class is not yet on file. Eggs are toxic — that is a food/handling hazard, not fight.",
    relativeStrengthNote:
      "No reviewed longnose-gar fight description is on file. Armor and a bony snout are handling facts, not a power rating.",
    rollingTwisting: "moderate",
    landingConsiderations:
      "USFWS: diamond-shaped armored scales covering the body; face extremely bony; scales interlocking almost like chain mail. Plan for a bony, abrasive fish. Avoid the snout teeth. Do not treat air-gulping as a surface fight cue.",
    handlingSensitivity:
      "Ganoid armor and a long toothy snout are the landing problem. Keep hands clear of the jaws.",
    sources: [
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (family-level ganoid armor / handling)", class: "agency" },
      { label: "Florida Museum longnose gar species profile", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "lepisosteus_oculatus",
    status: "partial",
    overview:
      "Spotted gar share family armor and toxic eggs with other gars. Longnose open-water patrol notes are not copied onto this more vegetation-associated species.",
    relativeStrengthNote:
      "No reviewed spotted-gar fight description is on file.",
    landingConsiderations:
      "Same ganoid-armor and toothy-snout handling as other gars. Typically smaller than longnose or alligator gar.",
    handlingSensitivity:
      "Armor and teeth. Eggs of gars are toxic — a food hazard, not a fight trait.",
    sources: [
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (family-level armor)", class: "agency" },
      { label: "Texas Parks and Wildlife spotted gar account", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "lepisosteus_platostomus",
    status: "partial",
    overview:
      "Shortnose gar are a large-river gar. Family armor and toxic eggs apply. Alligator-gar mass is not copied onto this record.",
    relativeStrengthNote:
      "No reviewed shortnose-gar fight description is on file.",
    landingConsiderations:
      "Ganoid armor and a toothy snout. Smaller and slimmer than alligator gar.",
    handlingSensitivity:
      "Armor and teeth. Eggs of gars are toxic.",
    sources: [
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (family-level armor)", class: "agency" },
      { label: "Texas Parks and Wildlife shortnose gar species account", class: "agency" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, SHAKE_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "atractosteus_spatula",
    status: "partial",
    overview:
      "Alligator gar are the largest North American gar. USFWS describes interlocking ganoid armor. A structured hooked-fight class beyond size and armor is not yet on file. Harvest is jurisdiction-gated. Eggs are toxic.",
    relativeStrength: "very_powerful",
    relativeStrengthNote:
      "Documented adult size (TPWD: up to 10 ft and over 300 lb as maxima) is mass context. A primary-source hooked-fight narrative beyond size and armor is still a gap. Do not invent a sport rating.",
    rollingTwisting: "high",
    aerialBehavior: "rarely_aerial",
    landingConsiderations:
      "USFWS: diamond armored scales, extremely bony face, interlocking almost like chain mail. Plan for mass, armor, and a broad toothy snout. Surface air-gulping is respiratory, not a jump. Flooded spawning habitat is an invalidator, not a landing note.",
    handlingSensitivity:
      "Large teeth, ganoid armor, and mass. This is a regulated-context record — legal methods and harvest rules are external.",
    sources: [
      { label: "U.S. Fish and Wildlife Service All About Alligator Gar (armor, eggs, reputation)", class: "agency" },
      { label: "Texas Parks and Wildlife alligator gar identification and edible-flesh pages (size maxima; not a fight score)", class: "agency" },
    ],
    ...R,
    gaps: ["hooked-fight narrative beyond size and armor", JUMP_GAP, SHAKE_GAP],
  },
  {
    speciesId: "ameiurus_nebulosus",
    status: "partial",
    overview:
      "Brown bullhead are a nocturnal benthic ictalurid. WDFW documents table fare. Fight class is not yet sourced beyond family spine-locking behavior. Do not copy channel-catfish river-current fight notes onto this record.",
    relativeStrengthNote:
      "No reviewed brown-bullhead fight description is on file. Family literature documents locking dorsal and pectoral spines when grasped — that is handling, not a run class.",
    rollingTwisting: "moderate",
    landingConsiderations:
      "Peer-reviewed ictalurid handling: fish lash side to side and lock dorsal and pectoral spines. Grasp behind the pectoral fins and keep the dorsal spine depressed, or use a wet rag/glove. Spines can puncture and the sheath can introduce venom and bacteria.",
    handlingSensitivity:
      "Dorsal and pectoral spines lock when the fish is agitated (Huang et al. 2013, Ictaluridae). This is a handling hazard, not a sport rating.",
    sources: [
      { label: "Washington Department of Fish and Wildlife brown bullhead species account (table fare; not fight class)", class: "agency" },
      { label: "Huang et al. 2013 catfish spine envenomation (Ictaluridae spine-lock handling)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "ameiurus_melas",
    status: "partial",
    overview:
      "Black bullhead share ictalurid spine-lock handling with other bullheads. Brown-bullhead table-fare notes are not automatically a fight class.",
    relativeStrengthNote:
      "No reviewed black-bullhead fight description is on file.",
    landingConsiderations:
      "Same spine-lock handling as other Ameiurus. Typically a small bullhead.",
    handlingSensitivity:
      "Dorsal and pectoral spines lock when agitated. Family-level handling caution applies.",
    sources: [
      { label: "Texas Parks and Wildlife black bullhead species account", class: "agency" },
      { label: "Huang et al. 2013 catfish spine envenomation (Ictaluridae spine-lock handling)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, ENDURANCE_GAP],
  },
  {
    speciesId: "ameiurus_natalis",
    status: "partial",
    overview:
      "Yellow bullhead share ictalurid spine-lock handling. TPWD notes they rarely achieve edible size — that is food, not fight.",
    relativeStrengthNote:
      "No reviewed yellow-bullhead fight description is on file.",
    landingConsiderations:
      "Same spine-lock handling as other Ameiurus. Strongly barbed pectoral spines are an identification character and a handling hazard.",
    handlingSensitivity:
      "Dorsal and pectoral spines lock when agitated. Family-level handling caution applies.",
    sources: [
      { label: "Texas Parks and Wildlife yellow bullhead species account", class: "agency" },
      { label: "Huang et al. 2013 catfish spine envenomation (Ictaluridae spine-lock handling)", class: "peer_reviewed" },
    ],
    ...R,
    gaps: ["species-specific hooked-fight description", JUMP_GAP, ENDURANCE_GAP],
  },
];
