#!/usr/bin/env node
// Mechanical gate for the "caption-instagram-safe-zone" rule in rules/rules.json.
//
// Direct instruction, 2026-08-15: "Enforce strict instagram framing rule ... subtitles
// are very low right now." Root cause, confirmed by reading the shared engine source
// (faceless-explainer's lib/dimensions.mjs, captionBand()): the DEFAULT caption band is
// `bandTopY = height - bandHeight` -- its bottom edge sits EXACTLY on the frame's bottom
// pixel, zero clearance. On continuous-claude-v3 (1080x1920) that's `top: 1600px; height:
// 320px`, bottom = 1920 = the frame edge -- flush under Instagram's own bottom UI chrome
// (caption/username/audio row + the right-edge like/comment/share/save icon column, which
// together overlay roughly the bottom 300px of a Reel in-app). The reference episode
// (episodes/the-ai-pm-pay-gap/build/) sits with real clearance (~360-380px) instead.
//
// This reads the actual BUILT compositions/captions.html, so it validates whatever
// generated it (default builder or a project skin), not the source template. Supports
// both px-based (`top: 1600px; height: 320px;`) and percentage-based (`top: 68%; height:
// 16%;`) band rules -- a skin fix may reasonably use either.
//
// Usage:
//   node check_caption_safe_zone.mjs --project-dir hyperframes-<episode> [--min-bottom-margin-px 280] [--min-bottom-margin-pct 14]

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { minMarginPx: 280, minMarginPct: 14 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--min-bottom-margin-px") out.minMarginPx = Number(argv[++i]);
    else if (a === "--min-bottom-margin-pct") out.minMarginPct = Number(argv[++i]);
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

// Finds the CSS rule for the element that positions the whole caption band -- the
// container with both a `top` and a `height` declaration and an id/class that reads as
// the band wrapper (not an individual word or group, which have no fixed `top`/`height`
// of their own in either the default template or a percentage-based skin).
function findBandRule(css) {
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = ruleRe.exec(css))) {
    const selector = m[1].trim();
    if (selector === ":root") continue; // custom-property token declarations, not a real element rule
    const decls = m[2];
    // Anchor to a real declaration boundary ({, ;, or string start) so a custom
    // property like `--cap-band-top: 1600px;` (word-boundary matches bare `top:`
    // too -- "-" before "t" is still a boundary) can never be mistaken for the
    // real `top:` property. A genuine declaration is always `top:` immediately
    // after `{`/`;`/whitespace at the start, never `-band-top:`.
    const topMatch = decls.match(/(?:^|[{;])\s*top\s*:\s*(-?[\d.]+)(px|%)\s*;/i);
    const heightMatch = decls.match(/(?:^|[{;])\s*height\s*:\s*([\d.]+)(px|%)\s*;/i);
    if (!topMatch || !heightMatch) continue;
    if (topMatch[2] !== heightMatch[2]) continue; // mixed units, not a coherent band rule
    return { selector, top: parseFloat(topMatch[1]), height: parseFloat(heightMatch[1]), unit: topMatch[2] };
  }
  return null;
}

function main() {
  const { projectDir, minMarginPx, minMarginPct } = parseArgs(process.argv.slice(2));
  const slug = path.basename(projectDir);
  const captionsPath = path.join(projectDir, "compositions", "captions.html");

  console.log(`\nCaption Instagram safe-zone check for "${slug}"`);

  if (!existsSync(captionsPath)) {
    console.log(`  no compositions/captions.html found (silent film, or not built yet) -- nothing to check.`);
    process.exit(0);
  }

  const html = readFileSync(captionsPath, "utf-8");
  const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  const css = styleBlocks.join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
  const heightMatch = html.match(/data-height="(\d+)"/);
  const canvasHeight = heightMatch ? Number(heightMatch[1]) : null;

  const band = findBandRule(css);
  if (!band) {
    console.log(`  could not identify a caption-band rule (top + height on one selector) -- skipping,`);
    console.log(`  not a FAIL, this check only verifies what it can positively locate.`);
    process.exit(0);
  }

  const bottomEdge = band.top + band.height;
  console.log(`  band rule: \`${band.selector}\` { top: ${band.top}${band.unit}; height: ${band.height}${band.unit}; }`);
  console.log(`  band bottom edge: ${bottomEdge}${band.unit}`);

  let marginOk, marginDesc;
  if (band.unit === "px") {
    const canvasH = canvasHeight ?? 1920;
    const margin = canvasH - bottomEdge;
    marginOk = margin >= minMarginPx;
    marginDesc = `${margin}px clearance from the frame bottom (canvas height ${canvasH}px), need >= ${minMarginPx}px`;
  } else {
    const margin = 100 - bottomEdge;
    marginOk = margin >= minMarginPct;
    marginDesc = `${margin.toFixed(1)}% clearance from the frame bottom, need >= ${minMarginPct}%`;
  }
  console.log(`  ${marginDesc}`);

  if (marginOk) {
    console.log(`\n✓ PASS -- caption band clears Instagram's bottom UI chrome.`);
    process.exit(0);
  }

  console.error(`\n✗ FAIL -- caption band sits too low, ${marginDesc.replace("need >=", "required >=")}.`);
  console.error(`  Reference: episodes/the-ai-pm-pay-gap/build/ real caption band clears ~360-380px from`);
  console.error(`  the bottom edge. See docs/hyperframes_production_notes.md's "Standing rules, 2026-08-15"`);
  console.error(`  section, Rule 3 -- Instagram's own caption/username/audio row and the right-edge`);
  console.error(`  like/comment/share/save icon column overlay roughly the bottom 300px of a Reel in-app.`);
  process.exit(1);
}

main();
