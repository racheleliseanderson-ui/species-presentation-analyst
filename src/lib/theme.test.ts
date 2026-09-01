import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_THEME, normalizeTheme, THEMES, THEME_BOOT_SCRIPT } from "./theme.ts";

test("appearance is exactly the three modes the floating control offers", () => {
  assert.deepEqual(
    THEMES.map((theme) => theme.id),
    ["dark", "light", "colorsafe"],
  );
});

test("a stored value from an earlier build maps forward instead of resetting", () => {
  assert.equal(normalizeTheme("atelier"), "light");
  assert.equal(normalizeTheme("bw"), "colorsafe");
});

test("an unrecognized value is rejected rather than applied", () => {
  assert.equal(normalizeTheme("sepia"), null);
  assert.equal(normalizeTheme(null), null);
  assert.equal(normalizeTheme(7), null);
});

test("the pre-paint boot script accepts every id the module accepts", () => {
  for (const theme of THEMES) {
    assert.ok(
      THEME_BOOT_SCRIPT.includes(`'${theme.id}'`),
      `${theme.id} would flash the default before React corrected it`,
    );
  }
  // And it carries the same legacy mapping, or a migrated reader gets one frame
  // of the wrong palette.
  assert.ok(THEME_BOOT_SCRIPT.includes("atelier"));
  assert.ok(THEME_BOOT_SCRIPT.includes("bw"));
});

test("the default is a real mode", () => {
  assert.ok(THEMES.some((theme) => theme.id === DEFAULT_THEME));
});

test("every mode explains itself, so the control is readable without trying it", () => {
  for (const theme of THEMES) {
    assert.ok(theme.label.trim().length > 0);
    assert.ok(theme.hint.trim().length > 10, `${theme.id} has no usable hint`);
  }
});
