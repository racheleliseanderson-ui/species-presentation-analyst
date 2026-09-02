/**
 * Interactive QA pass over a running preview, used while refining the app.
 * Not part of `npm test` — it needs a server on 127.0.0.1:8081.
 *
 *   npx vite preview & node scripts/qa-smoke.mjs
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const URL = process.env.QA_URL ?? "http://127.0.0.1:8081/";
const OUT = "/tmp/qa";
mkdirSync(OUT, { recursive: true });

const problems = [];
const note = (m) => problems.push(m);

// The sandbox image pins a Chromium build that may not match this
// Playwright's expected revision; QA_CHROMIUM points at the one on disk.
const executablePath = process.env.QA_CHROMIUM || undefined;
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath });

async function session(width, height, label) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const consoleErrors = [];
  // Blocked outbound requests (web fonts on an offline machine) are an
  // environment fact, not an app defect, so they must not turn this red.
  const networkNoise = /ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|fonts\.(googleapis|gstatic)\.com/;
  page.on("console", (m) => {
    if (m.type() === "error" && !networkNoise.test(m.text())) consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  await page.goto(URL, { waitUntil: "networkidle" });
  return { context, page, consoleErrors, label };
}

// ---------------------------------------------------------------- desktop
{
  const { context, page, consoleErrors } = await session(1280, 900, "desktop");

  // The single appearance control exists, and there is exactly one of it.
  const controls = page.getByRole("button", { name: /Appearance and accessibility/i });
  if ((await controls.count()) !== 1) note(`expected 1 appearance control, found ${await controls.count()}`);
  await controls.first().click();
  const modes = page.getByRole("radio", { name: /Dark|Light|Color-safe/ });
  if ((await modes.count()) !== 3) note(`expected 3 appearance modes, found ${await modes.count()}`);
  await page.getByRole("radio", { name: /Color-safe/ }).click();
  const themeAttr = await page.locator("html").getAttribute("data-theme");
  if (themeAttr !== "colorsafe") note(`color-safe did not apply (data-theme=${themeAttr})`);
  await page.screenshot({ path: `${OUT}/desktop-colorsafe.png`, fullPage: false });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Appearance and accessibility/i }).click();
  await page.getByRole("radio", { name: /^Dark/ }).click();
  await page.keyboard.press("Escape");

  // Quick Read: species + water → reading.
  await page.getByRole("button", { name: "Brown trout", exact: true }).click();
  await page.getByRole("button", { name: /River \/ stream/ }).click();
  await page.getByRole("button", { name: "Show my Quick Read" }).click();
  await page.waitForTimeout(400);

  for (const heading of [
    /Where it should be/,
    /What the tackle has to do/,
    /If it isn.t working/,
    /Hand this off/,
  ]) {
    if ((await page.getByRole("heading", { name: heading }).count()) === 0) {
      note(`Quick Read is missing a section: ${heading}`);
    }
  }
  // The reviewed dossiers now arrive from the database, so the reading must
  // actually contain them — not a spinner, and not the "unavailable" wording,
  // which would mean the app is claiming a research gap that is really a
  // failed fetch.
  await page.waitForFunction(
    () => !document.body.innerText.includes("Reading the reviewed record"),
    null,
    { timeout: 10_000 },
  ).catch(() => note("the reviewed record never finished loading"));

  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.includes("could not be loaded")) {
    note("the reviewed record could not be loaded from the database");
  }
  if (!/Where it should be · /.test(bodyText)) {
    note("the seasonal read did not render a reviewed season");
  }
  if (!/What it is responding to/.test(bodyText)) {
    note("the condition response section is missing");
  }

  // The waterway / agency bridge answers a question rather than carrying a packet.
  if ((await page.getByRole("heading", { name: /Where it is documented/ }).count()) === 0) {
    note("the water-context panel is missing");
  }

  // The field brief is what goes on the water, so it must carry the layers the
  // screen gained — not just the seven sections it shipped with.
  const briefText = await page.evaluate(() => document.querySelector("pre.print-only")?.textContent ?? "");
  for (const section of [
    "WHERE IT SHOULD BE",
    "WHAT IT IS RESPONDING TO",
    "WHAT THE TACKLE HAS TO DO",
    "IF IT ISN'T WORKING",
    "PRESENTATION FAMILIES",
  ]) {
    if (!briefText.includes(section)) note(`the field brief is missing "${section}"`);
  }
  if (briefText && briefText.length < 1500) note(`the field brief looks truncated (${briefText.length} chars)`);

  await page.screenshot({ path: `${OUT}/desktop-quickread.png`, fullPage: true });

  // Handoffs reach every app in the chain, including Waterways.
  for (const app of ["Waterways", "Hatch Match", "Tackle Link", "Rig Signal", "Knot Analyst", "Field Ops"]) {
    if ((await page.getByRole("button", { name: new RegExp(app) }).count()) === 0) {
      note(`no handoff to ${app}`);
    }
  }
  await page.getByRole("button", { name: /Waterways/ }).first().click();
  await page.waitForTimeout(250);
  const href = await page.getByRole("link", { name: /Open Waterways/ }).getAttribute("href");
  if (!href?.startsWith("https://waterways.hookthehorizon.blog/#packet=")) {
    note(`Waterways handoff carries no packet: ${href?.slice(0, 60)}`);
  }
  // The packet declares `containsCoordinates:false`; what must never appear is
  // an actual latitude/longitude value.
  const carried = href ? decodeURIComponent(href.split("#packet=")[1] ?? "") : "";
  if (/"(lat|lng|lon|longitude|latitude)"\s*:\s*-?\d/i.test(carried)) {
    note("a handoff packet carries a coordinate value");
  }
  if (/"containsCoordinates"\s*:\s*true/.test(carried)) {
    note("a handoff packet declares that it carries coordinates");
  }
  await page.screenshot({ path: `${OUT}/desktop-handoff-dialog.png` });
  await page.keyboard.press("Escape");

  // Full analysis path. It must not be weaker than Quick Read on temperature.
  await page.getByRole("radio", { name: /Advanced/ }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /^03 Conditions/ }).click().catch(() => {});
  await page.waitForTimeout(300);
  const tempModes = page.getByRole("radio", { name: /I don.t know|I measured it|I know roughly/ });
  if ((await tempModes.count()) < 3) {
    note(`full analysis offers ${await tempModes.count()} temperature answers, expected 3`);
  }
  await page.getByRole("radio", { name: /I know roughly/ }).click().catch(() => {});
  await page.waitForTimeout(200);
  if ((await page.getByLabel(/Approximate low water temperature/).count()) === 0) {
    note("full analysis has no temperature range input");
  }
  await page.screenshot({ path: `${OUT}/desktop-advanced.png`, fullPage: true });

  if (consoleErrors.length) note(`desktop console errors: ${consoleErrors.slice(0, 3).join(" | ")}`);
  await context.close();
}

// ----------------------------------------------------------------- mobile
{
  const { context, page, consoleErrors } = await session(390, 844, "mobile");
  await page.screenshot({ path: `${OUT}/mobile-home.png`, fullPage: false });

  // The floating control must not sit under the sticky mobile action bar.
  await page.getByRole("button", { name: "Brown trout", exact: true }).click();
  await page.getByRole("button", { name: /River \/ stream/ }).click();
  await page.getByRole("button", { name: "Show my Quick Read" }).click();
  await page.waitForTimeout(400);
  const control = await page
    .getByRole("button", { name: /Appearance and accessibility/i })
    .boundingBox();
  if (!control) note("appearance control is not visible on mobile");
  else if (control.width < 44 || control.height < 44) {
    note(`appearance control touch target is ${control.width}x${control.height}`);
  }

  // Nothing may scroll the page sideways.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) note(`mobile page scrolls horizontally by ${overflow}px`);

  await page.screenshot({ path: `${OUT}/mobile-quickread.png`, fullPage: true });

  // Full analysis, on the step that shows the sticky continue bar.
  await page.getByRole("radio", { name: /Competent/ }).click();
  await page.waitForTimeout(400);
  const stickyOverlap = await page.evaluate(() => {
    const bar = document.querySelector(".fixed.inset-x-0.bottom-0");
    const dock = document.querySelector('[aria-label^="Appearance and accessibility"]');
    if (!bar || !dock) return null;
    const b = bar.getBoundingClientRect();
    const d = dock.getBoundingClientRect();
    return !(d.bottom <= b.top || d.top >= b.bottom || d.right <= b.left || d.left >= b.right);
  });
  if (stickyOverlap === true) note("the appearance control overlaps the sticky mobile action bar");
  await page.screenshot({ path: `${OUT}/mobile-competent.png`, fullPage: false });

  if (consoleErrors.length) note(`mobile console errors: ${consoleErrors.slice(0, 3).join(" | ")}`);
  await context.close();
}

// --------------------------------------------------------------- boundary
{
  const { context, page, consoleErrors } = await session(1280, 900, "boundary");
  await page.goto(new global.URL("/boundary", URL).href, { waitUntil: "networkidle" });
  if ((await page.getByRole("heading", { name: /What we will not tell you/ }).count()) === 0) {
    note("the limits page did not render");
  }
  await page.screenshot({ path: `${OUT}/boundary.png`, fullPage: true });
  if (consoleErrors.length) note(`boundary console errors: ${consoleErrors.slice(0, 3).join(" | ")}`);
  await context.close();
}

await browser.close();

console.log(
  JSON.stringify({ ok: problems.length === 0, problems, screenshots: OUT }, null, 2),
);
process.exitCode = problems.length === 0 ? 0 : 1;
