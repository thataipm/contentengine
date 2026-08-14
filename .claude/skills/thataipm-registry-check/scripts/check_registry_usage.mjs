#!/usr/bin/env node
// Mechanical gate for /thataipm-registry-check's own discipline: a skill that has to be
// remembered to invoke is exactly the failure mode that already shipped this project's
// hand-built-vs-registry mistake twice (hyperframes-had-the-components-i-hand-built,
// hyperframes-what-skills-matter). This script gets wired into thataipm-assemble's
// pipeline so it runs on EVERY episode, unskippably, instead of depending on someone
// remembering to run /thataipm-registry-check by hand.
//
// PASS if either is true:
//   1. At least one registry block is actually installed (paths.components from
//      hyperframes.json is non-empty) -- the registry was checked AND something was used.
//   2. The episode's slug appears in docs/hyperframes_production_notes.md's "Custom
//      devices built for this channel" log -- the registry was checked, genuinely
//      nothing fit, and that was recorded rather than silently skipped.
// FAIL otherwise: no installed blocks and no logged confirmation. That's the
// "never checked" case, indistinguishable from "checked but didn't bother to note it" --
// both get treated as a failure, since an unlogged check has no more evidence behind it
// than no check at all.
//
// Usage:
//   node check_registry_usage.mjs --project-dir hyperframes-<episode> --docs-root <repo-root>

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--docs-root") out.docsRoot = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  out.docsRoot = out.docsRoot ? path.resolve(out.docsRoot) : path.resolve(out.projectDir, "..");
  return out;
}

function main() {
  const { projectDir, docsRoot } = parseArgs(process.argv.slice(2));
  // Raw folder basename, unstripped -- this project's hyperframes-<slug>/ and
  // episodes/<slug>/ names don't map 1:1 (hyperframes-book-to-skill vs
  // episodes/book-to-skill-ai-agent-tool, a known existing inconsistency), so stripping
  // a prefix here would guess at a mapping rather than use the one unambiguous value
  // this script actually has: the exact --project-dir it was called with.
  const slug = path.basename(projectDir);

  let componentsPath = path.join(projectDir, "compositions", "components");
  const hfJsonPath = path.join(projectDir, "hyperframes.json");
  if (existsSync(hfJsonPath)) {
    try {
      const hfJson = JSON.parse(readFileSync(hfJsonPath, "utf-8"));
      if (hfJson.paths?.components) {
        componentsPath = path.join(projectDir, hfJson.paths.components);
      }
    } catch {
      // malformed hyperframes.json isn't this script's problem -- fall through with the default
    }
  }

  const installedBlocks = existsSync(componentsPath)
    ? readdirSync(componentsPath).filter((f) => !f.startsWith("."))
    : [];

  // Only a structured line inside the "### Log" subsection counts -- a slug mentioned
  // anywhere else in the doc (a narrative example, a cautionary tale about NOT checking)
  // must not count as a confirmed entry. Format: "- [YYYY-MM-DD] <slug>: <device> — <why>"
  const notesPath = path.join(docsRoot, "docs", "hyperframes_production_notes.md");
  let loggedInNotes = false;
  if (existsSync(notesPath)) {
    const notes = readFileSync(notesPath, "utf-8");
    const logSection = notes.split(/^### Log$/m)[1]?.split(/^##\s/m)[0] ?? "";
    const entryPattern = new RegExp(`^-\\s*\\[\\d{4}-\\d{2}-\\d{2}\\]\\s*${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:`, "m");
    loggedInNotes = entryPattern.test(logSection);
  }

  console.log(`\nRegistry usage check for "${slug}"`);
  console.log(`  components dir: ${componentsPath}`);
  console.log(`  installed blocks: ${installedBlocks.length ? installedBlocks.join(", ") : "(none)"}`);
  console.log(`  logged in docs/hyperframes_production_notes.md: ${loggedInNotes ? "yes" : "no"}`);

  if (installedBlocks.length > 0) {
    console.log(`\n✓ PASS -- ${installedBlocks.length} registry block(s) installed and in use.`);
    process.exit(0);
  }
  if (loggedInNotes) {
    console.log(`\n✓ PASS -- zero registry blocks, but this episode has a logged, checked confirmation in docs/hyperframes_production_notes.md.`);
    process.exit(0);
  }

  console.error(`\n✗ FAIL -- zero registry blocks installed, and "${slug}" has no entry in`);
  console.error(`  docs/hyperframes_production_notes.md's "Custom devices built for this`);
  console.error(`  channel" section. This means either the registry was never checked, or it`);
  console.error(`  was checked but the result wasn't recorded -- both look identical from here,`);
  console.error(`  and both are exactly the mistake this check exists to catch.`);
  console.error(`\n  Fix: run /thataipm-registry-check now. If a registry block fits, install it`);
  console.error(`  with \`hyperframes add <name>\`. If genuinely nothing fits, add an entry for`);
  console.error(`  "${slug}" to docs/hyperframes_production_notes.md's schema-vocabulary log`);
  console.error(`  before re-running this pipeline.`);
  process.exit(1);
}

main();
