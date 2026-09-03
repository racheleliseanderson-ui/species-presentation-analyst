/**
 * Write public/sitemap.xml from the reviewed species catalog.
 *
 * Mirrors `field-sense-navigator`'s script deliberately: same shape, same
 * refusal to publish a sitemap that is obviously short, same rule that a route
 * only appears here if the page itself is indexable. The index and the limits
 * page are entry points; every reviewed species is its own document and carries
 * its own `lastmod`, taken from the date its record was last reviewed rather
 * than from the deploy — a sitemap that claims 111 pages changed because a CSS
 * file did is worse than no sitemap.
 *
 * The slug is recomputed here from the same rule `src/lib/knowledge/
 * species-slug.ts` uses. Importing that module would drag the whole catalog
 * through the TypeScript loader for a string transform; the test suite asserts
 * the two agree, which is the part that actually matters.
 *
 * Runs from prebuild so a deploy cannot ship a sitemap older than the catalog.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://species.hookthehorizon.blog";
const out = join(root, "public/sitemap.xml");

const { SPECIES } = await import("../src/lib/knowledge/species-catalog.ts");

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

if (SPECIES.length < 100) {
  console.error(`build-sitemap: refusing to publish a sitemap for ${SPECIES.length} species`);
  process.exit(1);
}

function day(value) {
  if (typeof value !== "string" || !value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

const esc = (value) =>
  String(value).replace(
    /[<>&'"]/g,
    (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char],
  );

const newest =
  SPECIES.map((species) => day(species.reviewedAt))
    .filter(Boolean)
    .sort()
    .at(-1) ?? new Date().toISOString().slice(0, 10);

const entries = [
  { loc: `${SITE}/`, lastmod: newest, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE}/species`, lastmod: newest, changefreq: "weekly", priority: "0.9" },
  { loc: `${SITE}/boundary`, lastmod: newest, changefreq: "monthly", priority: "0.5" },
];

const seen = new Set();
for (const species of SPECIES) {
  const slug = slugify(species.commonNames[0] ?? species.scientificName);
  if (!slug || seen.has(slug)) {
    console.error(`build-sitemap: duplicate or empty slug for ${species.id}`);
    process.exit(1);
  }
  seen.add(slug);
  const lastmod = day(species.reviewedAt);
  entries.push({
    loc: `${SITE}/species/${slug}`,
    ...(lastmod ? { lastmod } : {}),
    changefreq: "monthly",
    priority: "0.8",
  });
}

if (seen.size !== SPECIES.length) {
  console.error(`build-sitemap: ${seen.size} slugs for ${SPECIES.length} species`);
  process.exit(1);
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map(
      (entry) =>
        `  <url>\n` +
        `    <loc>${esc(entry.loc)}</loc>\n` +
        (entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : "") +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        `  </url>\n`,
    )
    .join("") +
  `</urlset>\n`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, xml, "utf8");
console.log(`build-sitemap: ok (${entries.length} urls, ${seen.size} species, newest ${newest})`);
