import { SPECIES } from "./species-catalog.ts";
import type { SpeciesRecord } from "../protocol/types.ts";

/** Informal names anglers actually type. Keys are species ids. */
export const ALIASES: Record<string, string[]> = {
  oncorhynchus_mykiss: ["bow", "rainbow", "bows", "redside"],
  salmo_trutta: ["brownie", "brown", "german brown"],
  salvelinus_fontinalis: ["brookie", "brookies", "speckled", "squaretail"],
  oncorhynchus_clarkii: ["cutt", "cutthroat", "cuttbow"],
  salvelinus_namaycush: ["laker", "lakers", "mackinaw", "togue"],
  oncorhynchus_mykiss_steelhead: ["steelie", "steelies", "steelhead"],
  oncorhynchus_tshawytscha: ["king", "kings", "chinook", "tyee"],
  oncorhynchus_kisutch: ["silver", "silvers", "coho"],
  micropterus_nigricans: ["lmb", "largemouth", "bucketmouth"],
  micropterus_dolomieu: ["smb", "smallie", "smallmouth", "bronzeback"],
  micropterus_punctulatus: ["kentucky", "spots", "spotted bass"],
  pomoxis_spp: ["crappie", "specks", "sac-a-lait", "papermouth"],
  lepomis_macrochirus: ["gill", "gills", "bream", "brim", "sunfish"],
  sander_vitreus: ["walleye", "walleyed pike", "marble-eye"],
  esox_lucius: ["pike", "northern", "jack"],
  esox_masquinongy: ["muskie", "musky", "muskellunge"],
  perca_flavescens: ["perch", "yellow perch", "ring perch"],
  ictalurus_punctatus: ["channel cat", "catfish", "channel"],
  cyprinus_carpio: ["carp", "common carp"],
  morone_saxatilis: ["striper", "stripers", "rockfish", "striped bass"],
  morone_chrysops: ["white bass", "sand bass", "stripes"],
  prosopium_williamsoni: ["whitefish", "mountain whitefish", "rocky mountain whitefish"],
  thymallus_arcticus: ["grayling", "arctic grayling"],
  oncorhynchus_nerka_kokanee: ["kokanee", "sockeye", "koke"],
  coregonus_clupeaformis: ["lake whitefish", "humpback whitefish"],
  lota_lota: ["burbot", "eelpout", "ling", "mariah"],
  sander_canadensis: ["sauger", "sand pike"],
  ictalurus_furcatus: ["blue cat", "blue catfish"],
  pylodictis_olivaris: ["flathead", "flathead catfish", "mud cat", "shovelhead"],
  aplodinotus_grunniens: ["drum", "freshwater drum", "sheepshead", "gaspergou"],
  lepomis_gibbosus: ["pumpkinseed", "pumpkinseed sunfish"],
  lepomis_microlophus: ["redear", "shellcracker", "shell cracker", "chinquapin"],
  lepomis_cyanellus: ["green sunfish", "greenie"],
  ambloplites_rupestris: ["rock bass", "red eye", "redeye", "goggle-eye", "goggle eye"],
  esox_niger: ["chain pickerel", "pickerel"],
  amia_calva: ["bowfin", "dogfish", "grinnel", "mudfish"],
  lepisosteus_osseus: ["longnose gar", "longnose", "needle nose gar"],
  lepisosteus_oculatus: ["spotted gar"],
  ameiurus_nebulosus: ["brown bullhead", "hornpout"],
  ameiurus_melas: ["black bullhead"],
  coregonus_artedi: ["cisco", "lake herring"],
  osmerus_mordax: ["smelt", "rainbow smelt"],
  morone_americana: ["white perch"],
  anguilla_rostrata: ["eel", "american eel"],
  alosa_sapidissima: ["shad", "american shad", "white shad"],
  salvelinus_confluentus: ["bull trout", "bull char"],
  salmo_salar_anadromous: ["atlantic salmon", "sea-run salmon", "sea run salmon"],
  acipenser_fulvescens: ["lake sturgeon", "sturgeon", "rock sturgeon"],
  polyodon_spathula: ["paddlefish", "spoonbill", "spoonbill cat"],
  lepomis_auritus: ["redbreast", "redbreast sunfish", "redbelly sunfish"],
  lepomis_gulosus: ["warmouth", "stumpknocker", "mud bass", "warmouth bass"],
  ameiurus_natalis: ["yellow bullhead", "yellow bull", "mudcat", "chucklehead"],
  lepisosteus_platostomus: ["shortnose gar", "shortnose", "billy gar"],
  morone_mississippiensis: ["yellow bass"],
  morone_hybrid_wiper: ["wiper", "wipers", "hybrid striper", "hybrid striped bass", "whiterock bass"],
  hiodon_alosoides: ["goldeye", "gold eye"],
  hiodon_tergisus: ["mooneye", "moon eye"],
  ictiobus_cyprinellus: ["bigmouth buffalo", "bigmouth", "buffalo fish", "buffalo"],
  ictiobus_bubalus: ["smallmouth buffalo", "smallmouth buff", "buffalo sucker"],
  moxostoma_macrolepidotum: ["shorthead redhorse", "redhorse", "redfin sucker", "shorthead"],
};

export function matchesSpecies(s: SpeciesRecord, q: string): boolean {
  const n = q.trim().toLowerCase();
  if (!n) return true;
  if (s.commonNames.some((c) => c.toLowerCase().includes(n))) return true;
  if (s.scientificName.toLowerCase().includes(n)) return true;
  if (s.id.replaceAll("_", " ").includes(n)) return true;
  return (ALIASES[s.id] ?? []).some((a) => a.includes(n) || n.includes(a));
}

export function searchSpecies(q: string): SpeciesRecord[] {
  return SPECIES.filter((s) => matchesSpecies(s, q));
}
