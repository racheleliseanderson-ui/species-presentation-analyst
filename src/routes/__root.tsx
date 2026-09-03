import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { AppearanceControl } from "@/components/appearance-control";
import { FleetFooter } from "@/components/fleet-footer";
import { SupportLink } from "@/components/support-link";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { PwaRegister } from "@/components/pwa-register";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import appCss from "../styles.css?url";

const APP_NAME = "Species & Presentation Analyst";
const APP_ORIGIN = "https://species.hookthehorizon.blog";
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
      { property: "og:url", content: `${APP_ORIGIN}/` },
      { property: "og:image", content: `${APP_ORIGIN}/og.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
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
      { rel: "canonical", href: `${APP_ORIGIN}/` },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" data-theme="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        {import.meta.env.DEV && <PreviewHostBridge />}
        <PwaRegister />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <FleetFooter />
        <SupportLink />
        <AppearanceControl />
        <Scripts />
      </body>
    </html>
  );
}
