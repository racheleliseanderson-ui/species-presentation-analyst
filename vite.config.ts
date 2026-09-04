import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { VitePWA } from "vite-plugin-pwa";
// @ts-expect-error JS plugin alongside the TS vite config
import { appEnvPlugin } from "./scripts/app-env-plugin.mjs";
import { isMigrationFile } from "./scripts/migration-plan.mjs";

/** The files `src/lib/db.ts` globs — same directory, same non-recursive scope. */
function hasGlobbedMigrations(root: string): boolean {
  try {
    return readdirSync(join(root, "migrations")).some(isMigrationFile);
  } catch {
    return false;
  }
}

function pgliteBootstrapPlugin(): Plugin {
  return {
    name: "app-builder:pglite-bootstrap",
    apply: "serve",
    async configureServer(server) {
      if (!hasGlobbedMigrations(server.config.root)) return;
      try {
        const mod = (await server.ssrLoadModule("/src/lib/db.ts")) as {
          ensureDbReady?: () => Promise<void>;
        };
        if (typeof mod.ensureDbReady === "function") {
          await mod.ensureDbReady();
        }
      } catch (err) {
        console.error("[app-builder] DB bootstrap failed:", err);
        throw err;
      }
    },
  };
}

function authPopupPlugin(): Plugin {
  return {
    name: "app-builder:auth-popup",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const rawUrl = req.url ?? "";
          const pathOnly = rawUrl.split("?", 1)[0] ?? "";
          if (pathOnly !== "/auth/popup") {
            next();
            return;
          }
          if ((req.method ?? "GET").toUpperCase() !== "GET") {
            res.statusCode = 405;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("Method Not Allowed");
            return;
          }

          const host = String(
            req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:8080",
          );
          const proto = String(
            req.headers["x-forwarded-proto"] ??
              ((req.socket as { encrypted?: boolean } | undefined)?.encrypted ? "https" : "http"),
          );
          const requestHeaders = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
              for (const v of value) requestHeaders.append(key, v);
            } else {
              requestHeaders.set(key, value);
            }
          }
          if (!requestHeaders.has("host")) requestHeaders.set("host", host);

          const request = new Request(`${proto}://${host}${rawUrl}`, {
            method: "GET",
            headers: requestHeaders,
          });

          const mod = (await server.ssrLoadModule("/src/lib/auth/popup.server.ts")) as {
            handleAuthPopupRequest: (req: Request) => Promise<Response>;
          };
          const response = await mod.handleAuthPopupRequest(request);

          res.statusCode = response.status;
          const setCookies =
            typeof response.headers.getSetCookie === "function"
              ? response.headers.getSetCookie()
              : [];
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "set-cookie") return;
            res.setHeader(key, value);
          });
          for (const cookie of setCookies) {
            res.appendHeader("set-cookie", cookie);
          }
          const body = Buffer.from(await response.arrayBuffer());
          res.end(body);
        } catch (err) {
          console.error("[app-builder] /auth/popup handler failed:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("auth popup failed");
          }
        }
      });
    },
  };
}

/**
 * Routes a manifest shortcut points at, and the revision that keeps them fresh.
 *
 * A shortcut is pressed from a home screen, which is very often a home screen
 * on a bank with no bars — that is the whole reason to have one. Everything
 * this app builds is precached already, but a ROUTE is a document the server
 * renders, so a shortcut into a page nobody had visited yet went to the
 * network and failed in exactly the situation it exists for.
 *
 * They are precached with a revision rather than pinned with `revision: null`.
 * A route's HTML names this build's hashed chunks; an entry that never
 * revalidates would keep serving a document pointing at files the next deploy
 * deleted. With a revision per build, workbox replaces it on activation and
 * `cleanupOutdatedCaches` clears the old one.
 */
const SHORTCUT_ROUTES = ["/species"];
const SHORTCUT_REVISION = String(Date.now());
const shortcutEntries = SHORTCUT_ROUTES.map((url) => ({ url, revision: SHORTCUT_REVISION }));

function fieldWorkboxPlugin(): Plugin {
  return {
    name: "hth:field-workbox",
    apply: "build",
    enforce: "post",
    closeBundle: {
      sequential: true,
      order: "post",
      async handler() {
        const outDir = resolve(".vercel/output/static");
        if (!existsSync(join(outDir, "assets")) || !existsSync(join(outDir, "favicon.svg"))) {
          return;
        }
        const { generateSW } = await import("workbox-build");
        await generateSW({
          globDirectory: outDir,
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,webmanifest,json}"],
          globIgnores: ["**/sw.js", "**/workbox-*.js"],
          swDest: join(outDir, "sw.js"),
          additionalManifestEntries: shortcutEntries,
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
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
              options: { cacheName: "hth-pages", networkTimeoutSeconds: 3 },
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
              urlPattern: ({ request }) =>
                request.destination === "image" || request.destination === "font",
              handler: "CacheFirst",
              options: {
                cacheName: "hth-static",
                expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        });
      },
    },
  };
}

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
  plugins: [
    pgliteBootstrapPlugin(),
    authPopupPlugin(),
    appEnvPlugin(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [
          nitro({
            preset: "vercel",
          }),
        ]
      : []),
    viteReact(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      filename: "sw.js",
      manifest: false,
      includeAssets: [
        "favicon.svg",
        "icon-180.png",
        "icon-192.png",
        "icon-512.png",
        "icon-maskable-512.png",
        "manifest.webmanifest",
      ],
      includeManifestIcons: false,
      integration: {
        closeBundleOrder: "post",
        configureOptions(_viteConfig, options) {
          options.outDir = ".vercel/output/static";
        },
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,webmanifest}"],
        additionalManifestEntries: shortcutEntries,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: null,
        runtimeCaching: [
          {
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
            urlPattern: ({ request }) =>
              request.destination === "image" || request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "hth-static",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
    fieldWorkboxPlugin(),
  ],
}));
