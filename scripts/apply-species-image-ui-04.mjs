import { readFile, writeFile } from "node:fs/promises";

const file = "src/components/instrument.tsx";
let source = await readFile(file, "utf8");

const importNeedle = 'import { GROUPS, SPECIES, SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";';
const importReplacement = `${importNeedle}\nimport { SPECIES_IMAGES_BY_ID } from "@/lib/knowledge/species-images";`;

if (!source.includes('from "@/lib/knowledge/species-images"')) {
  if (!source.includes(importNeedle)) throw new Error("species catalog import anchor not found");
  source = source.replace(importNeedle, importReplacement);
}

const mapNeedle = `                  {rows.map((s) => {\n                    const on = session.speciesId === s.id;\n                    return (`;
const mapReplacement = `                  {rows.map((s) => {\n                    const on = session.speciesId === s.id;\n                    const image = SPECIES_IMAGES_BY_ID[s.id];\n                    return (`;

if (!source.includes("const image = SPECIES_IMAGES_BY_ID[s.id];")) {
  if (!source.includes(mapNeedle)) throw new Error("species card map anchor not found");
  source = source.replace(mapNeedle, mapReplacement);
}

const cardNeedle = `                        className={cn(\n                          "min-h-16 rounded-[var(--radius-md)] px-4 py-3 text-left shadow-[var(--shadow-border)]",\n                          on ? "bg-accent text-accent-fg" : "bg-elevated hover:shadow-[var(--shadow-border-hover)]",\n                        )}\n                      >\n                        <span className="block text-sm font-medium">{s.commonNames[0]}</span>\n                        <span className={cn("block font-mono text-[11px]", on ? "opacity-70" : "text-dim")}>\n                          {s.scientificName}\n                        </span>\n                      </button>`;

const cardReplacement = `                        className={cn(\n                          "flex min-h-20 items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left shadow-[var(--shadow-border)]",\n                          on ? "bg-accent text-accent-fg" : "bg-elevated hover:shadow-[var(--shadow-border-hover)]",\n                        )}\n                      >\n                        {image && (\n                          <img\n                            src={image.thumb}\n                            alt={\`Reviewed canonical image of \${s.commonNames[0]}\`}\n                            title={\`\${image.sourceOrg} · \${image.license}\`}\n                            loading="lazy"\n                            decoding="async"\n                            className="h-14 w-20 shrink-0 rounded-[var(--radius-sm)] bg-subtle object-contain p-1 shadow-[var(--shadow-border)]"\n                          />\n                        )}\n                        <span className="min-w-0">\n                          <span className="block text-sm font-medium">{s.commonNames[0]}</span>\n                          <span className={cn("block font-mono text-[11px]", on ? "opacity-70" : "text-dim")}>\n                            {s.scientificName}\n                          </span>\n                          {image && (\n                            <span className={cn("mt-1 block font-mono text-[9px] uppercase tracking-wide", on ? "opacity-65" : "text-dim")}>\n                              Reviewed image · {image.imageType.replaceAll("_", " ")}\n                            </span>\n                          )}\n                        </span>\n                      </button>`;

if (!source.includes("Reviewed canonical image of")) {
  if (!source.includes(cardNeedle)) throw new Error("species card markup anchor not found");
  source = source.replace(cardNeedle, cardReplacement);
}

await writeFile(file, source);
console.log("Species picker now renders reviewed local canonical thumbnails when available.");
