#!/usr/bin/env node
// check_logo_asset_nudge.mjs
//
// WARN-ONLY nudge (never fails the pipeline, never blocks a render). Direct instruction
// (2026-08-25, hyperframes-your-agent-cant-do-anything): "Use actual logo for tools we say
// out loud" -- applied after the episode's first pass already shipped with generic text
// wordmarks for Gmail/Slack/GitHub/Notion despite CLAUDE.md's existing "screenshots and real
// UI over generic icons/mock UI" rule and Rule 1's "favor real brand/product logos over
// invented iconography" line. Both already existed in writing; neither got checked before
// frame authoring. This is a mechanical assist for /thataipm-visual-plan's own checklist,
// not a replacement for the judgment call there -- "should this beat show a real logo" is
// not something text alone can decide (a beat about a CONCEPT mentioning a tool by name in
// passing is different from a beat literally introducing that tool).
//
// Method: scan STORYBOARD.md's voiceover lines for capitalized words that repeat 2+ times
// across the script (recurring named entities read as more likely to be real products than
// a one-off capitalized word), filtered against a stoplist of common English capitals. For
// each candidate, check assets/logos/<lowercased-name>.png|jpg|svg exists. Missing = a
// printed nudge, not a failure -- the episode may already cover that name with a real
// screenshot instead (also a valid "real over generic" choice per Rule 1's screenshot tier).
//
// Usage:
//   node check_logo_asset_nudge.mjs --project-dir hyperframes-<episode>

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const STOPLIST = new Set([
  "I", "AI", "You", "The", "It", "And", "But", "So", "My", "A", "An", "Is", "Are", "Not",
  "No", "Comment", "Watching", "Here's", "That's", "It's", "Your", "You're", "Still",
  "Doesn't", "Feel", "Just", "One", "Over", "From", "With", "To", "It's", "How", "Now",
]);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

function extractVoiceoverLines(storyboard) {
  const lines = [];
  const re = /voiceover:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(storyboard))) lines.push(m[1]);
  return lines;
}

function main() {
  const { projectDir } = parseArgs(process.argv.slice(2));
  const storyboardPath = path.join(projectDir, "STORYBOARD.md");

  console.log(`\nLogo-asset nudge (warn-only, not a gate)`);

  if (!existsSync(storyboardPath)) {
    console.log(`  no STORYBOARD.md found -- nothing to scan.`);
    return;
  }

  const storyboard = readFileSync(storyboardPath, "utf-8");
  const lines = extractVoiceoverLines(storyboard);
  const fullText = lines.join(" ");

  const counts = new Map();
  const wordRe = /\b[A-Z][a-zA-Z]{2,}\b/g;
  let m;
  while ((m = wordRe.exec(fullText))) {
    const w = m[0];
    if (STOPLIST.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }

  const candidates = [...counts.entries()].filter(([, n]) => n >= 2).map(([w]) => w);

  if (candidates.length === 0) {
    console.log(`  no repeated capitalized names found in voiceover -- nothing to nudge on.`);
    return;
  }

  const logosDir = path.join(projectDir, "assets", "logos");
  const screenshotsDir = path.join(projectDir, "assets", "screenshots");
  const logoFiles = existsSync(logosDir) ? readdirSync(logosDir).map((f) => f.toLowerCase()) : [];
  const screenshotFiles = existsSync(screenshotsDir) ? readdirSync(screenshotsDir).map((f) => f.toLowerCase()) : [];

  let anyNudge = false;
  for (const name of candidates) {
    const lower = name.toLowerCase();
    const hasLogo = logoFiles.some((f) => f.startsWith(lower));
    const hasScreenshot = screenshotFiles.some((f) => f.includes(lower));
    if (hasLogo || hasScreenshot) continue;
    anyNudge = true;
    console.log(
      `  ~ "${name}" said ${counts.get(name)}x in voiceover, no assets/logos/${lower}.* or assets/screenshots/*${lower}* found -- if a beat introduces or names this as a real product, consider a real captured logo or screenshot instead of a generic mark`
    );
  }

  if (!anyNudge) {
    console.log(`  every repeated named entity already has a matching real logo or screenshot asset.`);
  }
  console.log(`  (heuristic, non-blocking -- a name mentioned only in passing doesn't need its own asset)`);
}

main();
