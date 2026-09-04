import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
/**
 * The angler's record is shown, never used.
 *
 * Field Ops sits at the end of the chain and the debrief used to be a sink:
 * somebody wrote down what happened and the six instruments that had each
 * answered a slice of the question went on knowing nothing about it. The
 * packet now carries a little of it forward — a count and at most three
 * sentences in the angler's own words.
 *
 * That is a good thing to show and a dangerous thing to compute with. Four
 * trips is four trips. An instrument that quietly leaned its answer toward
 * what worked last September would be a bite predictor with a diary, which is
 * the one thing this fleet has said from the beginning it will not build — and
 * it would happen by accident, one plausible line at a time, in a file nobody
 * was reading closely.
 *
 * So this reads the real source and holds the line: the carried record reaches
 * exactly one place, the shared panel, which draws it as the angler's and says
 * out loud that nothing here used it.
 */

const SRC = path.resolve(import.meta.dirname, "..");

/** Files that are allowed to know what the block is: the protocol and the kit. */
const EXEMPT = [
  ["lib", "hth-packet.ts"],
  ["lib", "own-record.ts"],
  ["lib", "field-plates"],
];

type Read = { file: string; line: number; text: string };

function walk(dir: string, out: string[]): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "__tests__") continue;
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function exempt(file: string): boolean {
  const rel = path.relative(SRC, file).split(path.sep);
  return EXEMPT.some((parts) => parts.every((part, i) => rel[i] === part));
}

const files = walk(SRC, []).filter((f: string) => !exempt(f));

/** Every read of the carried record, wherever it happens. */
const reads: Read[] = [];
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line: string, i: number) => {
    if (/packet\.history\b/i.test(line)) {
      reads.push({ file: path.relative(SRC, file), line: i + 1, text: line.trim() });
    }
  });
}
const PANELS = [
  "components/carried-context.tsx",
];

// Every read of it is a prop on the shared panel.
for (const hit of reads) {
  assert.ok(
    hit.text.includes("record={"),
    `${hit.file}:${hit.line} reads the carried record outside the panel — ${hit.text}`,
  );
}

// Something actually reads it, so this cannot pass by absence.
assert.ok(reads.length > 0, "nothing in this app reads the carried record");

for (const rel of PANELS) {
  const src = fs.readFileSync(path.join(SRC, rel), "utf8");
  assert.match(
    src,
    /import \{[^}]*OwnRecordPanel[^}]*\} from "@\/lib\/field-plates"/,
    `${rel} does not take the panel from the shared kit`,
  );
  const uses = [...src.matchAll(/<OwnRecordPanel([\s\S]*?)\/>/g)].map((m) => m[1] ?? "");
  assert.ok(uses.length > 0, `${rel} imports the panel and never renders it`);
  for (const props of uses) {
    assert.ok(props.includes("from="), `${rel} renders the record unattributed`);
    assert.ok(
      props.includes("instrument="),
      `${rel} renders the record without saying the instrument did not use it`,
    );
  }
}

console.log(JSON.stringify({ ok: true, reads: reads.length, panels: PANELS.length }));
