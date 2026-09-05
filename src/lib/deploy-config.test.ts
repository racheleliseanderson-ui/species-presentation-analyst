import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * What actually gets deployed, checked against what somebody meant to deploy.
 *
 * This application publishes through the Build Output API: nitro writes
 * `.vercel/output/config.json` and Vercel serves exactly what that file says.
 * So a header rule is only real if it is in there. Both halves are checked —
 * the intent in `vite.config.ts` (always readable) and the artifact
 * (only after a build) — because a config that stops reaching the output is
 * the failure mode that leaves no trace anywhere else.
 */

const ROOT = process.cwd();
const VITE_CONFIG = readFileSync(join(ROOT, "vite.config.ts"), "utf8");
const OUTPUT_CONFIG = join(ROOT, ".vercel/output/config.json");
const FUNCTION_CONFIG = join(ROOT, ".vercel/output/functions/__server.func/.vc-config.json");

/** Headers that must be on every response, and why one line is not enough. */
const REQUIRED_HEADERS = [
  "content-security-policy",
  "x-content-type-options",
  "referrer-policy",
  "x-frame-options",
  "cross-origin-opener-policy",
  "permissions-policy",
];

describe("the deployment declares its own security posture", () => {
  it("names every required header in the build config", () => {
    for (const header of REQUIRED_HEADERS) {
      assert.ok(VITE_CONFIG.includes(`"${header}"`), `${header} is not declared`);
    }
  });

  it("keeps the frame and object escapes shut", () => {
    assert.match(VITE_CONFIG, /frame-ancestors 'none'/);
    assert.match(VITE_CONFIG, /object-src 'none'/);
    assert.match(VITE_CONFIG, /"x-frame-options": "DENY"/);
  });

  it("does not let the browser talk to anywhere but this origin", () => {
    /*
     * Supabase is read in the server handler, never from the page. If a browser
     * fetch to a third-party host is ever added, this line is what breaks
     * first — which is the entire reason it is this narrow.
     */
    assert.match(VITE_CONFIG, /connect-src 'self'/);
  });

  it("declares the headers in nitro's route rules, not in vercel.json", () => {
    /*
     * `vercel.json` header rules configure a build VERCEL performs. This repo
     * hands Vercel a finished output directory, so the rules have to be inside
     * the generated config or they are a guess that reads like a guarantee.
     */
    assert.match(VITE_CONFIG, /routeRules:/);
    const vercelJson = readFileSync(join(ROOT, "vercel.json"), "utf8");
    assert.ok(
      !vercelJson.includes("Content-Security-Policy") && !vercelJson.includes("headers"),
      "vercel.json has grown a second, unverifiable copy of the header rules",
    );
  });
});

describe(
  "the built output carries what the config promised",
  { skip: !existsSync(OUTPUT_CONFIG) },
  () => {
    const config = JSON.parse(readFileSync(OUTPUT_CONFIG, "utf8")) as {
      routes: { src?: string; headers?: Record<string, string> }[];
    };

    it("puts the headers on the catch-all route", () => {
      const catchAll = config.routes.find((r) => r.src === "/(.*)" && r.headers);
      assert.ok(catchAll, "no catch-all header route in the generated output");
      for (const header of REQUIRED_HEADERS) {
        assert.ok(catchAll.headers?.[header], `${header} never reached the deployed config`);
      }
    });

    it("still serves hashed assets immutably", () => {
      const assets = config.routes.find((r) => r.src === "/assets/(.*)");
      assert.match(assets?.headers?.["cache-control"] ?? "", /immutable/);
    });

    it(
      "gives the server function a deliberate size and ceiling",
      { skip: !existsSync(FUNCTION_CONFIG) },
      () => {
        const fn = JSON.parse(readFileSync(FUNCTION_CONFIG, "utf8")) as Record<string, unknown>;
        assert.equal(fn.runtime, "nodejs22.x");
        assert.equal(typeof fn.memory, "number");
        assert.equal(typeof fn.maxDuration, "number");
      },
    );
  },
);
