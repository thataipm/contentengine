#!/usr/bin/env node
// Mechanical gate for /thataipm-registry-check's own discipline: a skill that has to be
// remembered to invoke is exactly the failure mode that already shipped this project's
// hand-built-vs-registry mistake twice (hyperframes-had-the-components-i-hand-built,
// hyperframes-what-skills-matter). This script gets wired into thataipm-assemble's
// pipeline so it runs on EVERY episode, unskippably, instead of depending on someone
// remembering to run /thataipm-registry-check by hand.
//
// HARD RULE (tightened 2026-08-14, direct instruction: "make a hard rule to build from
// hyperframes library always"): every frame's visual devices must be individually
// accounted for as either a registry item or an explicit, checked-and-confirmed hand-build.
// The original version of this check passed the WHOLE episode the moment a single registry
// block existed anywhere in it -- a real loophole, since an episode could install one
// registry item in Frame 2 while silently hand-building Frames 1/3/4/5 without ever
// checking them, and still pass. "Some frames checked" is not "always."
//
// PASS only if every frame file in compositions/frames/*.html is mentioned by number in
// this episode's docs/hyperframes_production_notes.md log entry -- e.g. "Frame 3" appears
// somewhere in a bullet line for this slug, tagged registry(<item>) or hand-built(<device>)
// -- <why>. FAIL lists exactly which frame numbers are missing.
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

  const framesDir = path.join(projectDir, "compositions", "frames");
  const frameFiles = existsSync(framesDir)
    ? readdirSync(framesDir).filter((f) => f.endsWith(".html")).sort()
    : [];
  const totalFrames = frameFiles.length;

  // Only structured bullets inside the "### Log" subsection count -- a slug mentioned
  // anywhere else in the doc (a narrative example, a cautionary tale about NOT checking)
  // must not count as a confirmed entry. Entries word-wrap across indented continuation
  // lines in the markdown source (this file is hand-edited prose, not machine-generated),
  // so a bullet's full text runs from its "- [date] slug:" line up to (but not including)
  // the next top-level "- " bullet or the end of the section -- capturing only the first
  // physical line would silently miss any "Frame N" mention that happens to land on a
  // wrapped continuation line, which is exactly the bug this comment replaced.
  const notesPath = path.join(docsRoot, "docs", "hyperframes_production_notes.md");
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let entryText = "";
  if (existsSync(notesPath)) {
    const notes = readFileSync(notesPath, "utf-8");
    const logSection = notes.split(/^### Log$/m)[1]?.split(/^##\s/m)[0] ?? "";
    const bulletBlocks = logSection.split(/^(?=- )/m); // each top-level "- " bullet, with its wrapped continuation lines attached
    const slugPattern = new RegExp(`^-\\s*\\[\\d{4}-\\d{2}-\\d{2}\\]\\s*${escapedSlug}:`);
    entryText = bulletBlocks.filter((b) => slugPattern.test(b)).join("\n");
  }
  const mentionedFrames = new Set([...entryText.matchAll(/Frame\s+(\d+)/gi)].map((m) => Number(m[1])));

  console.log(`\nRegistry usage check for "${slug}"`);
  console.log(`  frame files: ${totalFrames ? frameFiles.join(", ") : "(no compositions/frames dir found)"}`);
  console.log(`  installed registry item(s): ${installedBlocks.length ? installedBlocks.join(", ") : "(none)"}`);
  console.log(
    `  frames accounted for in the log: ${mentionedFrames.size ? [...mentionedFrames].sort((a, b) => a - b).join(", ") : "(none)"}`
  );

  // Soft variety nudge (2026-08-21, direct instruction: "use as many as you can please") --
  // NOT a hard gate, since a genuine repeat (the same literal concept recurring, e.g. two
  // percentage-gauge beats both wanting mk-usage-arc) is a legitimate choice. This only flags
  // when one registry item's name shows up in 3+ distinct "Frame N registry(`item`)" mentions
  // for this slug, as a prompt to double-check whether that's a real repeat or just the
  // familiar-default habit the discovery rewrite was meant to break.
  const registryMentions = [...entryText.matchAll(/Frame\s+(\d+)[^;]*?registry\(`([a-z0-9-]+)`/gi)];
  const framesByItem = new Map();
  for (const [, frameNum, item] of registryMentions) {
    if (!framesByItem.has(item)) framesByItem.set(item, new Set());
    framesByItem.get(item).add(Number(frameNum));
  }
  const repeatedItems = [...framesByItem.entries()].filter(([, frames]) => frames.size >= 3);
  if (repeatedItems.length) {
    console.log(`\n  ~ variety nudge (not a failure): ${repeatedItems
      .map(([item, frames]) => `\`${item}\` used in ${frames.size} frames (${[...frames].sort((a, b) => a - b).join(", ")})`)
      .join("; ")}`);
    console.log(`    Confirm this is a genuine repeat, not the familiar-default habit -- see the`);
    console.log(`    variety bias in /thataipm-registry-check.`);
  }

  if (totalFrames === 0) {
    console.log(`\n✓ PASS -- no compositions/frames directory found, nothing to account for.`);
    process.exit(0);
  }

  const missing = [];
  for (let n = 1; n <= totalFrames; n++) {
    if (!mentionedFrames.has(n)) missing.push(n);
  }

  if (missing.length === 0) {
    console.log(`\n✓ PASS -- every frame (1-${totalFrames}) is accounted for in the schema-vocabulary log.`);
    process.exit(0);
  }

  console.error(`\n✗ FAIL -- Frame ${missing.join(", ")} not accounted for in docs/hyperframes_production_notes.md's`);
  console.error(`  "### Log" section for "${slug}". Hard rule: EVERY frame must be individually checked`);
  console.error(`  against the registry and recorded, not just "the episode has one registry item somewhere."`);
  console.error(`\n  Fix: for each missing frame, either install a matching registry item with`);
  console.error(`  \`hyperframes add <name>\` and log it as "Frame ${missing[0]} registry(\`<name>\`)", or confirm`);
  console.error(`  via a real catalog search that nothing fits and log it as "Frame ${missing[0]}`);
  console.error(`  hand-built(<device>) — <why>". Add these to a bullet line for "${slug}" in the Log`);
  console.error(`  section, then re-run this pipeline.`);
  process.exit(1);
}

main();
