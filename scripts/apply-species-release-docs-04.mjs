import { readFile, writeFile } from "node:fs/promises";

const file = "README.md";
let source = await readFile(file, "utf8");

const replacements = [
  [
    "**Hook the Horizon · Field Intelligence** · `HTH-SP-001` · app `0.7.0`",
    "**Hook the Horizon · Field Intelligence** · `HTH-SP-001` · app `0.8.0`",
  ],
  [
    "## Species-specific weighting overrides · `SPO-1.1`",
    "## Species-specific weighting overrides · `SPO-1.2`",
  ],
  [
    "`SPO-1.1` composes the original `SPO-1.0` library with a second reviewed expansion. The result is explicit coverage for **all 60 species records**.",
    "`SPO-1.2` composes the original `SPO-1.0` library, the `SPO-1.1` expansion, and expansion 04. The result is explicit coverage for **all 75 species records**.",
  ],
  [
    "- **57 records use weighted species-specific rules.** Their reviewed presentation families can receive additional deltas for biologically important combinations of season, thermal state, water type, holding-water class, observed forage, or light.",
    "- **72 records use weighted species-specific rules.** Their reviewed presentation families can receive additional deltas for biologically important combinations of season, thermal state, water type, holding-water class, observed forage, or light.",
  ],
  [
    "`RPC-1.0` is a third, optional contextual refinement layered **after the reviewed species record and `SPO-1.1`**.",
    "`RPC-1.0` is a third, optional contextual refinement layered **after the reviewed species record and `SPO-1.2`**.",
  ],
  [
    "Outbound packets carry target status/context, the `SPW-1.1` weighted family order, `SPO-1.1`, applied species-override IDs, and—when explicitly declared—`RPC-1.0` population context and provenance.",
    "Outbound packets carry target status/context, the `SPW-1.1` weighted family order, `SPO-1.2`, applied species-override IDs, and—when explicitly declared—`RPC-1.0` population context and provenance.",
  ],
  [
    "Engine tests cover six-axis weighting, species-specific distinctions, full 60-record override coverage, policy-only records, RPC profile integrity and family containment, explicit-vs-undeclared population behavior, profile/species/water mismatch fail-closed behavior, holding-water re-ranking, observed-forage weighting, reviewed-family-only invariants, fail-closed water-type mismatch, unknown temperature, conservation-sensitive fail-closed behavior, and regulated-context jurisdiction warnings.",
    "Engine tests cover six-axis weighting, species-specific distinctions, full 75-record override coverage, policy-only records, expansion-04 alias separation, RPC candidate monotonicity, canonical-image registration, RPC profile integrity and family containment, explicit-vs-undeclared population behavior, profile/species/water mismatch fail-closed behavior, holding-water re-ranking, observed-forage weighting, reviewed-family-only invariants, fail-closed water-type mismatch, unknown temperature, conservation-sensitive fail-closed behavior, and regulated-context jurisdiction warnings.",
  ],
  [
    "60 reviewed North American records. Informal names (`brownie`, `smallie`, `laker`, `grayling`, `wiper`, `spoonbill`) resolve to reviewed records.",
    "75 reviewed North American records. Informal names (`brownie`, `smallie`, `laker`, `grayling`, `wiper`, `spoonbill`, `sockeye`, `dolly`, `sheefish`) resolve to reviewed records.",
  ],
  [
    "Instrument ID: `HTH-SP-001` · schema `0.7.0` · app `0.7.0`",
    "Instrument ID: `HTH-SP-001` · schema `0.7.0` · app `0.8.0`",
  ],
];

for (const [from, to] of replacements) {
  if (source.includes(from)) source = source.replace(from, to);
  else if (!source.includes(to)) throw new Error(`README release anchor not found: ${from.slice(0, 80)}`);
}

const spo11List = "`SPO-1.1` adds the remaining records: white bass, mountain whitefish, Arctic grayling, blue catfish, flathead catfish, freshwater drum, pumpkinseed, redear sunfish, green sunfish, rock bass, chain pickerel, bowfin, longnose gar, spotted gar, brown bullhead, black bullhead, cisco, rainbow smelt, white perch, American eel, American shad, bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, redbreast sunfish, warmouth, yellow bullhead, shortnose gar, yellow bass, hybrid striped bass, goldeye, mooneye, bigmouth buffalo, smallmouth buffalo, and shorthead redhorse.";
const spo12Paragraph = `${spo11List}\n\n\`SPO-1.2\` adds sockeye salmon (anadromous), pink salmon, chum salmon, landlocked Atlantic salmon, Arctic char, Dolly Varden, sheefish/inconnu, white sturgeon, alligator gar, white sucker, longnose sucker, largescale sucker, white catfish, longear sunfish, and flier. Anadromous sockeye is a separate record from kokanee; \`sockeye\` no longer aliases to the kokanee record.`;
if (!source.includes("`SPO-1.2` adds sockeye salmon")) {
  if (!source.includes(spo11List)) throw new Error("SPO expansion list anchor not found");
  source = source.replace(spo11List, spo12Paragraph);
}

const rpcAnchor = "The first wave contains **16 reviewed profiles across 8 species**:";
const rpcCandidateNote = "Expansion 04 also registers **14 reviewed RPC candidates** for the new species where life-history or population status materially changes interpretation. They are deliberately inactive in `RPC-1.0`: candidates such as managed vs ESA-listed sockeye/chum and western managed vs endangered Kootenai white sturgeon document the next reviewed RPC release without silently changing a live reading. Candidate target status may only become more restrictive; it can never relax the species-level status.";
if (!source.includes("**14 reviewed RPC candidates**")) {
  if (!source.includes(rpcAnchor)) throw new Error("RPC anchor not found");
  source = source.replace(rpcAnchor, `${rpcCandidateNote}\n\n${rpcAnchor}`);
}

const targetAnchor = "The structured layer currently covers bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, bigmouth buffalo, and smallmouth buffalo. It is composed at catalog time so the underlying reviewed seed batches stay auditable.";
const targetReplacement = "The structured layer covers bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, bigmouth buffalo, smallmouth buffalo, sockeye salmon, pink salmon, chum salmon, sheefish, white sturgeon, and alligator gar. It is composed at catalog time so the underlying reviewed seed batches stay auditable.";
if (source.includes(targetAnchor)) source = source.replace(targetAnchor, targetReplacement);
else if (!source.includes(targetReplacement)) throw new Error("target-context anchor not found");

const knowledgeAnchor = "- Expansion 03 (2026-08-27): bull trout, wild anadromous Atlantic salmon, lake sturgeon, paddlefish, redbreast sunfish, warmouth, yellow bullhead, shortnose gar, yellow bass, hybrid striped bass, goldeye, mooneye, bigmouth buffalo, smallmouth buffalo, shorthead redhorse.";
const expansion04 = "- Expansion 04 (2026-08-27): sockeye salmon (anadromous), pink salmon, chum salmon, landlocked Atlantic salmon, Arctic char, Dolly Varden, sheefish/inconnu, white sturgeon, alligator gar, white sucker, longnose sucker, largescale sucker, white catfish, longear sunfish, flier.";
if (!source.includes(expansion04)) {
  if (!source.includes(knowledgeAnchor)) throw new Error("knowledge expansion anchor not found");
  source = source.replace(knowledgeAnchor, `${knowledgeAnchor}\n${expansion04}`);
}

const imageSection = `## Canonical species images · \`IMG-1.0\`\n\nExpansion 04 introduces a repository-owned canonical image registry. Each of the 15 new species has an optimized local \`canonical.webp\` and \`thumb.webp\` under \`public/species/<slug>/\`, plus source organization, creator, license, image type, identification confidence, visual-QA note, and review date in \`src/lib/knowledge/species-images.ts\`.\n\nIdentity images are authoritative photographs, federal reference/specimen photographs, or scientifically reliable public-domain/CC0 illustrations. AI imagery is not used as the canonical identification authority. The image importer preserves aspect ratio, does not enlarge small originals, creates a maximum 2200-pixel canonical WebP and 900-pixel thumbnail, and keeps the exact reviewed source provenance in \`scripts/species-image-imports-04.json\`.\n\nThe species picker displays the repository thumbnail when a reviewed image exists. The remaining 60 legacy species stay text-only until their canonical assets receive the same provenance and visual-QA treatment; the UI does not fabricate placeholders.\n\n`;
if (!source.includes("## Canonical species images · `IMG-1.0`")) {
  const packetAnchor = "## Packet\n";
  if (!source.includes(packetAnchor)) throw new Error("packet section anchor not found");
  source = source.replace(packetAnchor, `${imageSection}${packetAnchor}`);
}

await writeFile(file, source);
console.log("README updated for app 0.8.0, 75 species, SPO-1.2, RPC candidates, and IMG-1.0.");
