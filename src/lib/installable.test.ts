import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

/**
 * This was the one app in the fleet nobody could install.
 *
 * It had a manifest, which made it look finished. What it had for icons was a
 * single 180-pixel PNG meant for iOS and an SVG — and an installer looks for a
 * 192 and a 512, so Chrome never offered the install at all, silently, the way
 * everything about manifests fails. There was no maskable icon either, so on
 * the day it did get installed Android would have cropped the square art into
 * a circle and eaten the edges of it.
 *
 * These are the checks a browser makes and never reports.
 */

const PUBLIC = join(import.meta.dirname, "..", "..", "public");
const ROUTES = join(import.meta.dirname, "..", "routes");
const CONFIG = join(import.meta.dirname, "..", "..", "vite.config.ts");

type Manifest = {
  name: string;
  short_name: string;
  start_url: string;
  scope: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: { src: string; sizes: string; type: string; purpose: string }[];
  shortcuts?: { name: string; short_name?: string; url: string }[];
};

const manifest = JSON.parse(readFileSync(join(PUBLIC, "manifest.webmanifest"), "utf8")) as Manifest;

describe("the app can be installed", () => {
  it("declares a standalone window and its own colours", () => {
    assert.equal(manifest.display, "standalone");
    assert.equal(manifest.scope, "/");
    assert.equal(manifest.start_url, "/");
    assert.match(manifest.theme_color, /^#[0-9a-f]{6}$/i);
    assert.match(manifest.background_color, /^#[0-9a-f]{6}$/i);
  });

  it("has a short name that fits under a home screen icon", () => {
    assert.ok(manifest.short_name.length <= 14, manifest.short_name);
  });

  it("names only icons that are actually there", () => {
    for (const icon of manifest.icons) {
      assert.ok(icon.src.startsWith("/"), icon.src);
      assert.ok(existsSync(join(PUBLIC, icon.src.slice(1))), `missing ${icon.src}`);
    }
  });

  it("covers the sizes an installer looks for", () => {
    const sizes = manifest.icons.map((i) => i.sizes);
    assert.ok(sizes.includes("192x192"), "no 192 — Chrome will not offer the install");
    assert.ok(sizes.includes("512x512"), "no 512");
  });

  it("draws a separate maskable icon rather than reusing the square one", () => {
    /*
     * The maskable art has to sit inside the middle 80% or a circular launcher
     * cuts through it. An icon listed as both "any" and "maskable" has been
     * drawn for neither.
     */
    const maskable = manifest.icons.filter((i) => i.purpose.split(/\s+/).includes("maskable"));
    assert.equal(maskable.length, 1, "expected exactly one maskable icon");
    assert.ok(!maskable[0]!.purpose.split(/\s+/).includes("any"), "one file cannot be both");
  });

  it("gives iOS a touch icon, because it ignores the manifest for that", () => {
    const root = readFileSync(join(ROUTES, "__root.tsx"), "utf8");
    assert.match(root, /rel: "apple-touch-icon"/);
    const src = /rel: "apple-touch-icon",\s*href: "([^"]+)"/.exec(root);
    assert.ok(src, "the touch icon has no href");
    assert.ok(existsSync(join(PUBLIC, src[1]!.slice(1))), `missing ${src[1]}`);
    /* iOS will not take an SVG here. It falls back to a screenshot of the
       page, which is how an app ends up with a smeared white tile. */
    assert.ok(src[1]!.endsWith(".png"), "iOS needs a raster");
  });

  it("links the manifest from the head, or none of the above happens", () => {
    const root = readFileSync(join(ROUTES, "__root.tsx"), "utf8");
    assert.match(root, /rel: "manifest"/);
    assert.ok(root.includes("/manifest.webmanifest"));
  });
});

describe("a shortcut works where it is pressed", () => {
  const shortcuts = manifest.shortcuts ?? [];

  it("points at routes this app has", () => {
    assert.ok(shortcuts.length > 0, "a manifest with no shortcuts is a bookmark");
    for (const shortcut of shortcuts) {
      const slug = (shortcut.url.split("?")[0] ?? "/").replace(/^\//, "");
      const file = slug === "" ? "index.tsx" : `${slug}.index.tsx`;
      assert.ok(
        existsSync(join(ROUTES, file)) || existsSync(join(ROUTES, `${slug}.tsx`)),
        `${shortcut.url} has no route`,
      );
    }
  });

  it("is precached by the service worker", () => {
    /*
     * The whole point of a shortcut on a fishing app: it is pressed from a
     * home screen, on a bank, with no bars. Everything this app BUILDS is
     * precached, but a route is a document the server renders, so a shortcut
     * into a page nobody had opened yet went to the network and failed in
     * exactly the situation it exists for.
     */
    const config = readFileSync(CONFIG, "utf8");
    /*
     * The list is derived from this manifest at build time rather than typed
     * out again, so what is checked here is that the derivation is still
     * happening and still covers both halves of it.
     */
    assert.match(config, /manifest\.start_url/, "start_url is not precached");
    assert.match(config, /manifest\.shortcuts/, "the shortcuts are not precached");
    assert.match(
      config,
      /readFileSync\("public\/manifest\.webmanifest"/,
      "the precached document list is no longer read from the manifest, so it can drift from it",
    );
    assert.ok(shortcuts.length > 0);
    /*
     * Exactly one worker generator, and it is the one taking the shortcuts.
     *
     * This repository shipped TWO for a while — `vite-plugin-pwa` and a
     * hand-rolled `workbox-build` pass — both writing `sw.js` into the same
     * directory, so the deployed worker was whichever happened to close its
     * bundle last and the other one's runtime-caching rules were edited by
     * people who thought they were live. Two generators for one file is not
     * redundancy, it is a coin toss.
     */
    assert.equal(
      config.split("additionalManifestEntries: shortcutEntries").length - 1,
      1,
      "the shortcut routes are precached by more or fewer than one worker build",
    );
    assert.equal(
      config.split(/generateSW|VitePWA\(/).length - 1,
      1,
      "a second service-worker generator is back in the build config",
    );
  });

  it("precaches the page the home-screen icon opens", () => {
    /*
     * THE bug this file exists to prevent, found on 2026-09-05 by cutting the
     * network in a real browser and reading the worker's cache keys.
     *
     * The precached list was the shortcuts and nothing else. An installed PWA
     * opens `start_url` — and the first visit to a site is the visit that
     * INSTALLS the worker without being controlled by it, so `/` was never
     * cached on the way in either. The catalogue worked offline. A species
     * already opened worked offline. The page the icon on the home screen
     * actually opens did not, which is the only one that has to.
     *
     * Nothing else could have caught it: the worker generated, the precache
     * manifest was non-empty, the fixtures were green, and the build log said
     * 23 entries.
     */
    const start = (manifest.start_url ?? "/").split("?")[0] || "/";
    const config = readFileSync(CONFIG, "utf8");
    assert.match(config, /manifest\.start_url \?\? "\/"/);
    assert.equal(start, "/", "start_url moved; check the worker still precaches it");
  });

  it("is revisioned, so a deploy does not leave stale HTML pinned forever", () => {
    const config = readFileSync(CONFIG, "utf8");
    assert.match(config, /revision: SHORTCUT_REVISION/);
    /* Comments stripped, so the paragraph explaining why `revision: null` is
       wrong is not read as an instance of it. */
    const code = config.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.ok(
      !/revision: null/.test(code),
      "a pinned entry keeps serving a document that names deleted chunks",
    );
  });
});
