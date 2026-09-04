/**
 * Development-only bridge that lets an external preview pane drive navigation
 * while the app is embedded in one. It noops when the app is not embedded, but
 * it is mounted behind `import.meta.env.DEV` in `__root.tsx` so the deployed
 * app ships no builder-preview listener at all.
 */

import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { collectRoutePathsFromTree, installPreviewHostBridge } from "@/lib/preview-host-bridge";

export function PreviewHostBridge() {
  const router = useRouter();

  useEffect(() => {
    return installPreviewHostBridge({
      navigate: (path) => {
        router.history.push(path);
      },
      getRoutePaths: () => collectRoutePathsFromTree(router.routeTree),
    });
  }, [router]);

  return null;
}
