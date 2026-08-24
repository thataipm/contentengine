#!/usr/bin/env node
// check_caption_band_collision.mjs
//
// Real, confirmed bug class (hyperframes-your-agent-cant-do-anything, 2026-08-24/25):
// a frame's own hand-positioned element (a kicker, a tag, a wordmark) sits inside the
// standing caption band (68%-84% of frame height, docs/hyperframes_production_notes.md's
// "Standing rules, 2026-08-15" Rule 3) and garbles against the live word captions. Two
// separate frames shipped this in the same episode (Frame 3's kicker/wordmark, Frame 5's
// tag) -- neither hyperframes check, the static-gap check, the freeze check, nor a /watch
// pass caught it; only a direct native-resolution ffmpeg frame pull did, after the user
// flagged it by eye. This turns that manual catch into a mechanical PASS/FAIL run before
// render, against every frame's OWN declared CSS geometry.
//
// Method: for each compositions/frames/*.html, parse the <style> block for rules that
// declare BOTH a pixel `top` AND an `opacity` (the project's own convention for "this is a
// real, animated content element", not a static full-bleed backdrop -- backgrounds/glows in
// every frame this project has ever shipped use inset:0 or omit opacity entirely). Compute
// each such rule's vertical span in the 1920px canvas and flag any that overlaps the
// caption band. A full-bleed rule (top<=0 and height/bottom implying >=90% of the canvas)
// is excluded -- that's a backdrop, not content that could visually collide.
//
// This is a static CSS check, not a real render -- it can't know whether captions are
// actually active at the moment the flagged element is visible (in practice, VO/captions
// run through nearly this entire frame's duration on every episode so far, so "the element
// is ever visible" is already the right proxy). A flagged element that's provably only
// visible during a real caption gap is a legitimate reason to override, not a bug in this
// check -- but that's rare enough on this channel's pacing that it hasn't happened yet.
//
// Usage:
//   node check_caption_band_collision.mjs --project-dir hyperframes-<episode> [--canvas-height 1920] [--band-top 0.68] [--band-height 0.16]

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { canvasHeight: 1920, bandTop: 0.68, bandHeight: 0.16 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--canvas-height") out.canvasHeight = Number(argv[++i]);
    else if (a === "--band-top") out.bandTop = Number(argv[++i]);
    else if (a === "--band-height") out.bandHeight = Number(argv[++i]);
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

// Splits a <style> block into individual rule blocks: { selectors, body }.
// Strips CSS /* */ comments first -- this project's frame files carry real
// multi-line durable-pitfall comments directly above rules, and without
// stripping them their text gets glued onto the following rule's selector.
function parseRules(styleBlock) {
  const cleaned = styleBlock.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(cleaned))) {
    const selectors = m[1].trim();
    const body = m[2];
    if (!selectors || selectors.startsWith("@")) continue;
    rules.push({ selectors, body });
  }
  return rules;
}

// Decorative/ambient elements this project's frames consistently name with these
// suffixes (background washes, blurred glow circles, dim veils) -- translucent,
// non-textual, meant to sit UNDER other content including captions. Excluded so
// the check flags real readable/iconographic content, not intended layering.
const DECORATIVE_RE = /-(bg|glow|veil)\b/;

function pxValue(body, prop) {
  const re = new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*(-?\\d+(?:\\.\\d+)?)px`, "i");
  const m = body.match(re);
  return m ? Number(m[1]) : null;
}

function hasOpacityDecl(body) {
  return /(?:^|[;\s])opacity\s*:/i.test(body);
}

function checkFrame(frameFile, canvasHeight, bandTop, bandBottom) {
  const html = readFileSync(frameFile, "utf-8");
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) return [];
  const rules = parseRules(styleMatch[1]);

  const findings = [];
  for (const rule of rules) {
    if (DECORATIVE_RE.test(rule.selectors)) continue;
    const top = pxValue(rule.body, "top");
    if (top === null) continue;
    if (!hasOpacityDecl(rule.body)) continue; // not a tracked content element by this project's convention

    let bottom = pxValue(rule.body, "bottom");
    const height = pxValue(rule.body, "height");
    let elTop = top;
    let elBottom;
    if (height !== null) elBottom = top + height;
    else if (bottom !== null) elBottom = canvasHeight - bottom;
    else continue; // no way to know vertical extent -- can't judge, skip rather than guess

    // Full-bleed backdrop exclusion: starts at/near the top and spans nearly the whole canvas.
    if (elTop <= 4 && elBottom >= canvasHeight * 0.9) continue;

    const overlaps = elTop < bandBottom && elBottom > bandTop;
    if (overlaps) {
      findings.push({
        selectors: rule.selectors,
        elTop,
        elBottom,
      });
    }
  }
  return findings;
}

function main() {
  const { projectDir, canvasHeight, bandTop, bandHeight } = parseArgs(process.argv.slice(2));
  const framesDir = path.join(projectDir, "compositions", "frames");
  const bandTopPx = canvasHeight * bandTop;
  const bandBottomPx = canvasHeight * (bandTop + bandHeight);

  console.log(
    `\nCaption-band collision check (band: ${bandTopPx.toFixed(0)}px-${bandBottomPx.toFixed(0)}px of ${canvasHeight}px canvas)`
  );

  if (!existsSync(framesDir)) {
    console.log(`  no compositions/frames dir found at ${framesDir} -- nothing to check.`);
    process.exit(0);
  }

  const frameFiles = readdirSync(framesDir)
    .filter((f) => f.endsWith(".html"))
    .sort();

  let anyFailure = false;
  for (const file of frameFiles) {
    const full = path.join(framesDir, file);
    const findings = checkFrame(full, canvasHeight, bandTopPx, bandBottomPx);
    if (findings.length === 0) {
      console.log(`  ✓ ${file}: clear`);
    } else {
      anyFailure = true;
      console.log(`  ✗ ${file}:`);
      for (const f of findings) {
        console.log(
          `      "${f.selectors}" spans ${f.elTop.toFixed(0)}px-${f.elBottom.toFixed(0)}px -- inside the caption band`
        );
      }
    }
  }

  if (anyFailure) {
    console.error(
      `\n✗ FAILED -- one or more frame elements sit inside the caption band and will visually collide`
    );
    console.error(`  with live word captions (confirmed real bug class, not theoretical -- see`);
    console.error(`  docs/hyperframes_production_notes.md's caption-band durable-pitfall entry).`);
    console.error(`  Move the flagged element(s) so their full vertical span sits above`);
    console.error(`  ${bandTopPx.toFixed(0)}px (captions occupy the space below that on this channel's`);
    console.error(`  standard skin) -- do not place new content in the band below either, that`);
    console.error(`  zone is reserved for Instagram's own bottom UI chrome.`);
    process.exit(1);
  }

  console.log(`\n✓ PASS -- no frame element collides with the caption band.`);
}

main();
