import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

/**
 * Every instrument says so when the radio goes.
 *
 * An offline sweep of all seven apps — production builds, a real service
 * worker, the network cut, every route reloaded — found all seven rendering
 * completely with no connection. That is the good half. The other half was
 * that some of them never mentioned it: the reader got a page that looks
 * exactly like a page served a second ago, with no way to tell which parts of
 * it could be stale. Hatch Match said nothing at all on any route, and Species
 * said it on the reading page but not on the catalogue — which is the page
 * somebody actually opens standing in water.
 *
 * Working offline and saying so are two features, and the second one is the
 * one that makes the first trustworthy. So: the notice exists, it is mounted
 * above the pages rather than inside whichever page somebody remembered, it
 * disappears when the signal comes back, and it listens for both edges rather
 * than reading the radio once at mount.
 */

const SRC = path.resolve(import.meta.dirname, "..");

function walk(dir: string, out: string[]): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "__tests__") continue;
      walk(full, out);
    } else if (/\.tsx$/.test(entry.name) && !/\.test\.tsx$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(SRC, []);
const banners = files.filter((f: string) =>
  fs.readFileSync(f, "utf8").includes('data-testid="offline-banner"'),
);
const root = fs.readFileSync(path.join(SRC, "routes", "__root.tsx"), "utf8");

describe("the reader is told when the signal goes", () => {
  it("has exactly one component drawing the notice", () => {
    assert.equal(banners.length, 1, "no component carries the offline banner testid");
  });

  it("watches both edges, so it clears itself when the signal returns", () => {
    const src = fs.readFileSync(banners[0]!, "utf8");
    assert.ok(src.includes('addEventListener("online"'));
    assert.ok(src.includes('addEventListener("offline"'));
  });

  it("draws nothing at all while there is a signal", () => {
    const src = fs.readFileSync(banners[0]!, "utf8");
    assert.match(src, /if \(!?(offline|online)\) return null;/);
  });

  it("is mounted above the pages, not inside one of them", () => {
    const component = /export function (\w*(?:Offline|Connection)\w*)\(/.exec(
      fs.readFileSync(banners[0]!, "utf8"),
    );
    assert.ok(component, "no offline component is exported");
    assert.ok(root.includes(`<${component[1]!} />`), "the root does not render the offline notice");
  });
});
