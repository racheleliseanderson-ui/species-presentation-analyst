/**
 * Which build is this.
 *
 * Until now nothing in the running application said. `/api/health` reported the
 * catalog's review date — which is a fact about the DATA and changes on a
 * review cycle — so two deploys a week apart, one of them broken, answered that
 * question identically. When something is wrong in production the first
 * question is always "is the fix even out yet", and there was no way to ask it
 * short of reading a Vercel dashboard.
 *
 * The commit and the build time are stamped in at build time by
 * `vite.config.ts`; the deployment identity comes from Vercel's own runtime
 * environment, which only exists inside the deployed function. A local build
 * therefore says `local` rather than pretending to be a deployment.
 */

declare const __BUILD_COMMIT__: string;
declare const __BUILD_TIME__: string;

export const BUILD_COMMIT: string =
  typeof __BUILD_COMMIT__ === "string" ? __BUILD_COMMIT__ : "unknown";
export const BUILD_TIME: string = typeof __BUILD_TIME__ === "string" ? __BUILD_TIME__ : "unknown";

/** Short form, for anywhere a whole sha is noise. */
export const BUILD_COMMIT_SHORT: string =
  BUILD_COMMIT === "unknown" ? "unknown" : BUILD_COMMIT.slice(0, 7);

function env(name: string): string | null {
  if (typeof process === "undefined" || !process.env) return null;
  const value = process.env[name];
  return value && value.trim() ? value : null;
}

/**
 * What the platform knows about this instance. Server-only in practice — the
 * client bundle has no `process.env` — and every field is nullable on purpose,
 * because a null here is the honest answer for a build running anywhere but
 * Vercel.
 */
export function deploymentIdentity() {
  return {
    commit: BUILD_COMMIT,
    commitShort: BUILD_COMMIT_SHORT,
    builtAt: BUILD_TIME,
    environment: env("VERCEL_ENV") ?? "local",
    deploymentId: env("VERCEL_DEPLOYMENT_ID"),
    branch: env("VERCEL_GIT_COMMIT_REF"),
    region: env("VERCEL_REGION"),
    runtime: typeof process !== "undefined" ? `node ${process.versions?.node ?? "?"}` : "unknown",
  };
}
