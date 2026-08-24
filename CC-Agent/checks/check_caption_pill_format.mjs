#!/usr/bin/env node
// Mechanical gate for the "caption-pill-emphasis" rule in rules/rules.json.
//
// Direct instruction, 2026-08-15, pointing at episodes/the-ai-pm-pay-gap/build/ as the
// reference: emphasized/keyword caption words render inside a rounded pill/chip with a
// solid accent-color background and dark text -- not a plain color swap on the word.
// Confirmed via ref_8.png/ref_14.png/ref_20.png real extracted frames from that episode.
//
// continuous-claude-v3's compositions/captions.html (the shared faceless-explainer
// captions.mjs's DEFAULT builder, no project skin) only does a dim-to-white color swap
// per word (.caption-word { color: rgba(255,255,255,.55) } -> #ffffff on the active word)
// -- confirmed missing the pill treatment entirely. This check reads the actual BUILT
// compositions/captions.html (not the source generator), so it validates whatever skin
// or default path actually produced it, and will correctly PASS once
// docs/templates/thataipm-caption-skin.html (or an equivalent) is wired in.
//
// PASS requires a CSS rule whose selector reads as a per-WORD class (contains "word",
// "emphasis", "highlight", "chip", or "pill" -- not just the whole caption-group box,
// which already has its own background+radius for a different reason: the dark backing
// plate behind ALL the text) that declares both a background (not none/transparent) and
// a border-radius > 0, AND that class name is actually referenced inside the composition's
// own <script> (so it's wired into real word rendering, not dead unused CSS).
//
// Usage:
//   node check_caption_pill_format.mjs --project-dir hyperframes-<episode>

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project-dir") out.projectDir = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

const WORD_LEVEL_HINT = /word|emphasis|emphasize|highlight|chip|pill/i;

function findPillRule(css) {
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = ruleRe.exec(css))) {
    const selector = m[1].trim();
    const decls = m[2];
    if (!WORD_LEVEL_HINT.test(selector)) continue;
    const bgMatch = decls.match(/background(?:-color)?\s*:\s*([^;]+);/i);
    const radiusMatch = decls.match(/border-radius\s*:\s*([^;]+);/i);
    if (!bgMatch || !radiusMatch) continue;
    const bg = bgMatch[1].trim().toLowerCase();
    if (bg === "none" || bg === "transparent" || /rgba?\([^)]*,\s*0\s*\)/.test(bg)) continue;
    const radiusPx = parseFloat(radiusMatch[1]);
    if (!(radiusPx > 0)) continue;
    return { selector, background: bg, radius: radiusMatch[1].trim() };
  }
  return null;
}

function extractClassNames(selector) {
  return [...selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
}

function main() {
  const { projectDir } = parseArgs(process.argv.slice(2));
  const slug = path.basename(projectDir);
  const captionsPath = path.join(projectDir, "compositions", "captions.html");

  console.log(`\nCaption pill-format check for "${slug}"`);

  if (!existsSync(captionsPath)) {
    console.log(`  no compositions/captions.html found (silent film, or not built yet) -- nothing to check.`);
    process.exit(0);
  }

  const html = readFileSync(captionsPath, "utf-8");
  const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  const css = styleBlocks.join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
  const scriptBlocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const script = scriptBlocks.join("\n");

  const pillRule = findPillRule(css);
  if (!pillRule) {
    console.error(`✗ FAIL -- no word-level pill/chip CSS rule found (a selector matching /word|emphasis|`);
    console.error(`  highlight|chip|pill/ with both a real background color and border-radius > 0).`);
    console.error(`  Reference: episodes/the-ai-pm-pay-gap/build/ -- emphasized words render in a solid`);
    console.error(`  accent-color pill with dark text, not just a plain color swap. See`);
    console.error(`  docs/hyperframes_production_notes.md's "Standing rules, 2026-08-15" section, Rule 2.`);
    process.exit(1);
  }

  const classNames = extractClassNames(pillRule.selector);
  const wired = classNames.length === 0 || classNames.some((c) => script.includes(c));

  console.log(`  found pill rule: \`${pillRule.selector}\` { background: ${pillRule.background}; border-radius: ${pillRule.radius}; }`);
  console.log(`  referenced in composition script: ${wired ? "yes" : "no"}`);

  if (!wired) {
    console.error(`\n✗ FAIL -- the pill rule's class name(s) (${classNames.join(", ")}) never appear in the`);
    console.error(`  composition's own <script> -- the CSS exists but nothing ever assigns it to a word,`);
    console.error(`  so no caption will ever actually render with the pill treatment.`);
    process.exit(1);
  }

  console.log(`\n✓ PASS -- word-level pill/chip styling present and wired into real word rendering.`);
  process.exit(0);
}

main();
