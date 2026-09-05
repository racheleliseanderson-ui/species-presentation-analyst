import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The template this application grew out of is not this application.
 *
 * It arrived with a Better Auth stack, an embedded PGLite/Neon database layer,
 * an "app data" tool client that could search a Google Drive, and the
 * app-builder sandbox's own install page served from `/public/__grok/`. None of
 * it was ever reachable from a route. All of it shipped: five heavy runtime
 * dependencies, a WASM Postgres that booted on module load, a second web app
 * manifest on the origin, and nine sandbox assets precached onto the home
 * screen of anybody who installed the app.
 *
 * It was removed on 2026-09-05. This fixture is here because dead scaffolding
 * does not announce itself — it typechecks, it lints, the tests pass, and the
 * only symptom is a slower cold start and a bigger install. The rule is
 * therefore written down rather than remembered.
 *
 * If a real product need for accounts ever arrives, delete this file in the
 * same commit that adds them. Deleting a fixture on purpose is a decision;
 * drifting past one is an accident.
 */

const ROOT = process.cwd();
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

const BANISHED_PATHS = [
  "src/lib/auth",
  "src/lib/app-data",
  "src/lib/db.ts",
  "src/lib/preview-host-bridge.ts",
  "src/components/preview-host-bridge.tsx",
  "public/__grok",
  "migrations",
  "scripts/migrate.mjs",
];

const BANISHED_DEPENDENCIES = [
  "better-auth",
  "@electric-sql/pglite",
  "pg",
  "kysely",
  "jose",
  "@tanstack/react-query",
  "recharts",
  "react-hook-form",
];

describe("the app-builder scaffolding stays gone", () => {
  it("has none of the removed files back", () => {
    for (const path of BANISHED_PATHS) {
      assert.ok(!existsSync(join(ROOT, path)), `${path} is back`);
    }
  });

  it("declares none of the removed runtime dependencies", () => {
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const dep of BANISHED_DEPENDENCIES) {
      assert.ok(!(dep in all), `${dep} is back in package.json`);
    }
  });

  it("ships no dependency nothing imports", () => {
    /*
     * The template left 33 unused packages in `dependencies` — every Radix
     * primitive, a table library, a charting library, two date pickers. They
     * tree-shook out of the bundle, which is exactly why nobody noticed: the
     * cost was install time, audit surface and a lockfile that had stopped
     * describing the application.
     *
     * Types-only and build-time packages are exempt because they are legitimately
     * never imported by name from source.
     */
    const exempt = new Set([
      "tailwindcss",
      "@tailwindcss/vite",
      "@tanstack/router-plugin",
      "@tanstack/react-start",
      /* The renderer. Nothing writes `import "react-dom"` because the
       * framework owns the mount, but removing it removes React. */
      "react-dom",
    ]);
    const sources: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx|mjs|css)$/.test(entry.name)) sources.push(readFileSync(full, "utf8"));
      }
    };
    walk(join(ROOT, "src"));
    walk(join(ROOT, "scripts"));
    const haystack = sources.join("\n");

    const orphans = Object.keys(pkg.dependencies).filter(
      (dep) => !exempt.has(dep) && !haystack.includes(dep),
    );
    assert.deepEqual(orphans, [], `dependencies nothing imports: ${orphans.join(", ")}`);
  });

  it("keeps one web app manifest on the origin", () => {
    const manifests = readdirSync(join(ROOT, "public"), {
      recursive: true,
      encoding: "utf8",
    }).filter((name) => name.endsWith(".webmanifest"));
    assert.deepEqual(manifests, ["manifest.webmanifest"]);
  });
});
