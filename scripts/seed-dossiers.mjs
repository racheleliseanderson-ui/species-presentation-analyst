#!/usr/bin/env node
/**
 * Seed (or re-seed) `public.species_dossiers` in Supabase from the reviewed
 * dossier files in this repository.
 *
 * The database is the runtime source of truth — the app reads it and no longer
 * ships these records in the bundle. The files under `src/lib/knowledge/` remain
 * the authored, diffable history, and this script is what keeps the two in step
 * in one direction: repo → database. It is idempotent (`on conflict do update`),
 * so running it twice is safe.
 *
 *   npm run db:seed-dossiers            # dry run, prints digests only
 *   DATABASE_URL='postgres://...' npm run db:seed-dossiers -- --write
 *
 * Use the Supabase connection string with a role that may write (the session
 * pooler string from Project Settings → Database). The anon key cannot write
 * these rows and is not what this script wants.
 *
 * The digests it prints are the same ones the database reports, so a run
 * without `--write` is also the fastest way to check the two are still in step.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Authored records that live as reviewable JSON (see data/dossiers/README.md). */
const JSON_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "dossiers");

function jsonDossiers() {
  if (!existsSync(JSON_DIR)) return {};
  const byKind = { identification: {}, behavior: {}, diet: {}, seasonal_calendar: {} };
  for (const file of readdirSync(JSON_DIR).filter((f) => f.endsWith(".json")).sort()) {
    const bundle = JSON.parse(readFileSync(join(JSON_DIR, file), "utf8"));
    for (const kind of Object.keys(byKind)) {
      const record = bundle[kind];
      if (record) byKind[kind][record.speciesId] = record;
    }
  }
  return byKind;
}

// Writing is opt-in: the default run only prints what it would send, so an
// accidental invocation cannot rewrite the live reference data.
const WRITE = process.argv.includes("--write");

/**
 * Reproduce PostgreSQL's `jsonb::text` output — object keys ordered by (byte
 * length, then bytewise), `", "` and `": "` separators. Used only to fingerprint
 * a payload so a seed run can be verified against the database without pulling
 * every record back down.
 */
export function jsonbText(value) {
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return JSON.stringify(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(jsonbText).join(", ") + "]";
  const keys = Object.keys(value).sort((a, b) => {
    const al = Buffer.byteLength(a);
    const bl = Buffer.byteLength(b);
    return al !== bl ? al - bl : Buffer.compare(Buffer.from(a), Buffer.from(b));
  });
  return "{" + keys.map((k) => JSON.stringify(k) + ": " + jsonbText(value[k])).join(", ") + "}";
}

export function digestOf(records) {
  const md5 = (text) => createHash("md5").update(text).digest("hex");
  const ids = records.map((r) => r.speciesId).sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
  const byId = new Map(records.map((r) => [r.speciesId, r]));
  return md5(ids.map((id) => md5(jsonbText(byId.get(id)))).join(""));
}

async function main() {
  const catalog = await import("../src/lib/knowledge/dossier-catalog.ts");
  // Two homes, one set of records: the legacy TypeScript modules and the JSON
  // directory that replaces them. A species in both would be a mistake, so the
  // JSON wins and the collision is reported rather than silently resolved.
  const json = jsonDossiers();
  const merge = (fromTs, kind) => {
    const merged = { ...fromTs };
    for (const [speciesId, record] of Object.entries(json[kind] ?? {})) {
      if (merged[speciesId]) {
        console.warn(`  note: ${speciesId}/${kind} exists in both TypeScript and JSON — using the JSON record`);
      }
      merged[speciesId] = record;
    }
    return merged;
  };
  const kinds = [
    ["identification", merge(catalog.IDENTIFICATION_BY_SPECIES, "identification"), catalog.IDENTIFICATION_DOSSIER_VERSION],
    ["behavior", merge(catalog.BEHAVIOR_BY_SPECIES, "behavior"), catalog.BEHAVIOR_DOSSIER_VERSION],
    ["diet", merge(catalog.DIET_BY_SPECIES, "diet"), catalog.DIET_DOSSIER_VERSION],
    ["seasonal_calendar", merge(catalog.SEASONAL_CALENDAR_BY_SPECIES, "seasonal_calendar"), catalog.SEASONAL_CALENDAR_VERSION],
  ];

  const plan = kinds.map(([kind, byId, version]) => {
    const records = Object.values(byId);
    return { kind, version, records, digest: digestOf(records) };
  });

  for (const { kind, records, digest } of plan) {
    console.log(`${kind.padEnd(18)} ${String(records.length).padStart(3)} records  digest ${digest}`);
  }

  if (!WRITE) {
    console.log("\nDry run — pass --write (with DATABASE_URL set) to seed the database.");
    return;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Nothing written.");
    process.exitCode = 1;
    return;
  }

  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    await client.query("begin");
    for (const { kind, version, records } of plan) {
      await client.query(
        `insert into public.species_dossiers
           (species_id, kind, status, payload, sources, gaps, reviewed_at, next_review_at, model_version)
         select d->>'speciesId', $1, d->>'status', d,
                coalesce(d->'sources', '[]'::jsonb),
                coalesce(array(select jsonb_array_elements_text(d->'gaps')), '{}'),
                (d->>'reviewedAt')::date, (d->>'nextReviewAt')::date, $2
         from jsonb_array_elements($3::jsonb) as d
         on conflict (species_id, kind) do update set
           status = excluded.status, payload = excluded.payload, sources = excluded.sources,
           gaps = excluded.gaps, reviewed_at = excluded.reviewed_at,
           next_review_at = excluded.next_review_at, model_version = excluded.model_version,
           updated_at = now()`,
        [kind, version, JSON.stringify(records)],
      );
      console.log(`wrote ${records.length} ${kind} records`);
    }
    await client.query("commit");

    // Verify against the database rather than trusting the write.
    const { rows } = await client.query(
      `select kind, count(*)::int as rows,
              md5(string_agg(md5(payload::text), '' order by species_id collate "C")) as digest
       from public.species_dossiers where published group by kind order by kind`,
    );
    let ok = true;
    for (const { kind, version: _v, records, digest } of plan.sort((a, b) => a.kind.localeCompare(b.kind))) {
      const row = rows.find((r) => r.kind === kind);
      const matches = row && row.rows === records.length && row.digest === digest;
      if (!matches) ok = false;
      console.log(`${matches ? "MATCH " : "DIFFER"} ${kind}`);
    }
    console.log(ok ? "\nDatabase matches the authored records." : "\nMISMATCH — investigate before deploying.");
    process.exitCode = ok ? 0 : 1;
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
