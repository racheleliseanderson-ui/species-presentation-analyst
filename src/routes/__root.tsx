import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { FIELD_MODE_BOOT_SCRIPT, FieldModeProvider } from "@/lib/field-mode";
import { AuthProvider } from "@/lib/auth/provider";
import { AppearanceControl } from "@/components/appearance-control";
import { FleetFooter } from "@/components/fleet-footer";
import { SupportLink } from "@/components/support-link";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { PwaRegister } from "@/components/pwa-register";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { SITE_ORIGIN } from "@/lib/site";
import appCss from "../styles.css?url";

/**
 * Nothing here declares `rel=canonical` or `og:url`.
 *
 * They used to be here, hardcoded to the origin, which told every crawler that
 * every route in the application was a duplicate of the home page. A canonical
 * tag is a strong signal and search engines honour it, so a site with real
 * documents on 113 routes had exactly one indexable page.
 *
 * They now belong to the routes. Each leaf head calls `canonicalFor()` with its
 * own path, and a per-route `og:url` overrides nothing because there is no
 * longer a site-wide one to override. Head links are not deduplicated by `rel`,
 * so a shared default here plus a per-route one would emit two canonicals and
 * be worse than either alone — which is why the default is gone rather than
 * kept as a fallback.
 */
const APP_NAME = "Species & Presentation Analyst";
const APP_ORIGIN = SITE_ORIGIN;
const APP_DESCRIPTION =
  "Turns species behavior and current water conditions into a presentation you can actually fish — holding water, forage, presentation family and the tackle it requires. Not bite scores, hotspots, or lure catalogs.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "description", content: APP_DESCRIPTION },
      { name: "theme-color", content: "#0c0d0b" },
      { name: "apple-mobile-web-app-title", content: "Species" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "color-scheme", content: "dark light" },
      // First-party share identity. Nothing injects these at the edge any more,
      // so what is written here is what link scrapers actually see.
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Hook the Horizon" },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: APP_DESCRIPTION },
      /* The default card only. Its size is asserted by the routes that
       * actually use it — a species page may swap in a reviewed photograph of
       * the fish, and those are whatever shape the agency published them in.
       * A width and height declared here would follow that image around and be
       * wrong for it. */
      { property: "og:image", content: `${APP_ORIGIN}/og.jpg` },
      { property: "og:image:alt", content: `${APP_NAME} — Hook the Horizon` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: APP_NAME },
      { name: "twitter:description", content: APP_DESCRIPTION },
      { name: "twitter:image", content: `${APP_ORIGIN}/og.jpg` },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Field mode before first paint, so a phone never flashes the desk layout. */}
        <script dangerouslySetInnerHTML={{ __html: FIELD_MODE_BOOT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        {import.meta.env.DEV && <PreviewHostBridge />}
        <PwaRegister />
        <FieldModeProvider>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
          <FleetFooter />
          <SupportLink />
          {/* Inside the provider on purpose: this panel is where reading mode
              is changed, so it needs the same context the pages have. */}
          <AppearanceControl />
        </FieldModeProvider>
        <Scripts />
      </body>
    </html>
  );
}
