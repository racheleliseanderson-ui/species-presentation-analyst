import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { VitePWA } from "vite-plugin-pwa";
// @ts-expect-error JS plugin alongside the TS vite config
import { appEnvPlugin } from "./scripts/app-env-plugin.mjs";

/**
 * Where nitro's Vercel preset actually puts the deployable site.
 *
 * This matters more than it looks. `vite-plugin-pwa` generates its worker
 * against Vite's own `outDir`, and under this preset that is not the directory
 * Vercel serves — so a worker generated in the default place precaches a build
 * nobody downloads. Pointing the plugin at the preset's static root is the
 * whole reason the PWA works here.
 */
const VERCEL_STATIC_DIR = ".vercel/output/static";

/**
 * The commit this build came from, stamped into the bundle.
 *
 * Vercel exports the sha to the build environment; a local build asks git. A
 * checkout with no git and no Vercel says `unknown`, which is the honest answer
 * and is still distinguishable from a stale deploy claiming a sha it does not
 * have.
 */
function buildCommit(): string {
  const fromVercel = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromVercel && fromVercel.trim()) return fromVercel.trim();
  try {
    return execSync("git rev-parse HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

/**
 * Response headers for every route.
 *
 * The application shipped with none of these. See `docs/security-headers.md`
 * for what each one is buying and, more usefully, what the CSP is NOT buying:
 * `script-src` has to carry `'unsafe-inline'` while the two pre-paint boot
 * scripts and the framework's hydration payload are inlined without a nonce.
 */
const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy":
    "geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()",
};

/**
 * The documents the worker precaches, read out of the web app manifest itself.
 *
 * A shortcut is pressed from a home screen, which is very often a home screen
 * on a bank with no bars — that is the whole reason to have one. Everything
 * this app BUILDS is precached already, but a ROUTE is a document the server
 * renders, so a route nobody had visited yet went to the network and failed in
 * exactly the situation it exists for.
 *
 * `start_url` is in this list, and it was the bug. The list used to be the
 * shortcuts alone, which meant the one document with no offline copy was the
 * app's own front door: an installed PWA opens `start_url`, and the FIRST visit
 * to a site is the visit that installs the worker without being controlled by
 * it — so `/` was never cached on the way in, and never precached either. The
 * catalogue worked offline, a species already opened worked offline, and the
 * page the home-screen icon actually opens did not. Found by cutting the
 * network in a real browser and reading the cache keys; nothing in a build log,
 * a typecheck or the fixtures could have said so.
 *
 * Read from the manifest rather than typed here twice. A second copy of a list
 * is a list that will disagree with itself the first time somebody adds a
 * shortcut.
 *
 * Precached with a revision rather than pinned with `revision: null`. A route's
 * HTML names this build's hashed chunks; an entry that never revalidates would
 * keep serving a document pointing at files the next deploy deleted. With a
 * revision per build, workbox replaces it on activation and
 * `cleanupOutdatedCaches` clears the old one.
 */
const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8")) as {
  start_url?: string;
  shortcuts?: { url: string }[];
};
const PRECACHED_DOCUMENTS = [
  ...new Set(
    [manifest.start_url ?? "/", ...(manifest.shortcuts ?? []).map((s) => s.url)].map(
      (url) => url.split("?")[0] || "/",
    ),
  ),
];
const SHORTCUT_REVISION = String(Date.now());
const shortcutEntries = PRECACHED_DOCUMENTS.map((url) => ({ url, revision: SHORTCUT_REVISION }));

export default defineConfig(({ command, isPreview }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  define: {
    __BUILD_COMMIT__: JSON.stringify(buildCommit()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    appEnvPlugin(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [
          nitro({
            preset: "vercel",
            /*
             * Response headers belong HERE, not in `vercel.json`.
             *
             * This project deploys through the Build Output API — nitro writes
             * `.vercel/output/config.json` and Vercel serves what that file
             * says. Header rules written in `vercel.json` are project
             * configuration applied to a build Vercel itself performed, and
             * relying on them for a prebuilt output is a guess. Nitro's route
             * rules end up inside the generated `config.json`, which is the
             * artifact actually being served, so what is written here is
             * verifiable by reading the build output — and
             * `src/lib/deploy-config.test.ts` does exactly that.
             */
            routeRules: {
              "/**": { headers: SECURITY_HEADERS },
              "/api/**": { headers: { ...SECURITY_HEADERS, "cache-control": "no-store" } },
            },
            vercel: {
              functions: {
                /*
                 * The server function renders species documents and reads a
                 * reviewed store. 1 GB is generous for that and buys CPU share
                 * on Vercel's allocation curve; 15 s is far past any real
                 * render and exists only so a hung upstream read fails as a
                 * timeout rather than hanging a reader's tab.
                 */
                memory: 1024,
                maxDuration: 15,
              },
            },
          }),
        ]
      : []),
    viteReact(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      filename: "sw.js",
      manifest: false,
      /* Nothing here that `globPatterns` below does not already match from the
       * static root. `includeAssets` used to list the icons and the manifest as
       * well, and workbox precached each of them TWICE — once from the glob and
       * once from this list. */
      includeAssets: [],
      includeManifestIcons: false,
      integration: {
        closeBundleOrder: "post",
        configureOptions(_viteConfig, options) {
          options.outDir = VERCEL_STATIC_DIR;
        },
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,webmanifest}"],
        /* Source maps are deployed for debugging but must never be precached:
         * workbox's own map alone is 218 kB, which is larger than the entire
         * rest of the shell, and no angler ever reads it. */
        globIgnores: ["**/sw.js", "**/workbox-*.js", "**/*.map"],
        additionalManifestEntries: shortcutEntries,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: null,
        runtimeCaching: [
          {
            // Reviewed dossiers change on a review cycle measured in months,
            // and the app is meant to stay readable when the radio drops, so
            // a species that has been opened once stays available offline.
            urlPattern: ({ url }) => url.pathname.startsWith("/api/dossiers"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "hth-dossiers",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "hth-pages",
              networkTimeoutSeconds: 3,
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "worker",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "hth-shell" },
          },
          {
            /* Reviewed species photographs. A fish you have looked at once is
             * a fish you can look at again on the bank with no bars, and the
             * candidate ladder means the entry cached is the size that device
             * actually asked for rather than the largest file in the set. */
            urlPattern: ({ request }) =>
              request.destination === "image" || request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "hth-static",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 180 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
}));
