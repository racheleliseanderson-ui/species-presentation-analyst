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
