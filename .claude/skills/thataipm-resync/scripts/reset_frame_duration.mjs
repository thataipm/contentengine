#!/usr/bin/env node
// thataipm-resync: resets a frame composition's full-span data-duration values
// (the <template> tag and every clip whose data-duration equals the OLD base
// duration -- i.e. the full-span background/foreground clips, not scene-specific
// sub-durations) to the NEW base duration. This is the purely mechanical first
// step of resyncing a frame after VO changes; it deliberately does NOT touch
// scene-specific data-start/data-duration values (a chapter tile's own start
// time, a Scene 2 boundary, etc.) or any internal GSAP tween offset -- those
// require real per-word timing judgment (see print_word_timeline.mjs output)
// and stay a manual/creative edit.
//
// Usage: node reset_frame_duration.mjs --frame compositions/frames/02-problem.html
//          --old 14.499 --new 14.819 [--write]
//
// Without --write, runs as a dry-run report only.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { write: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--frame") out.frame = argv[++i];
    else if (a === "--old") out.old = argv[++i];
    else if (a === "--new") out.newVal = argv[++i];
    else if (a === "--write") out.write = true;
  }
  if (!out.frame || !out.old || !out.newVal) {
    throw new Error("usage: --frame <path> --old <n> --new <n> [--write]");
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const filePath = path.resolve(args.frame);
  let text = readFileSync(filePath, "utf-8");

  const oldStr = args.old;
  const newStr = args.newVal;
  const oldPattern = new RegExp(`data-duration="${oldStr.replace(".", "\\.")}"`, "g");
  const matches = text.match(oldPattern) || [];

  const replaced = text.replace(oldPattern, `data-duration="${newStr}"`);

  // Report every remaining data-start/data-duration pair so the caller knows
  // exactly what still needs manual/creative resync against real word timing.
  const clipPattern = /<div\s+[^>]*?id="([^"]+)"[^>]*?class="[^"]*clip[^"]*"[^>]*?>/gs;
  const remaining = [];
  let m;
  const startRe = /data-start="([\d.]+)"/;
  const durRe = /data-duration="([\d.]+)"/;
  while ((m = clipPattern.exec(text))) {
    const tag = m[0];
    const start = tag.match(startRe)?.[1];
    const dur = tag.match(durRe)?.[1];
    if (dur && dur !== oldStr) {
      remaining.push({ id: m[1], start, dur });
    }
  }

  console.log(`${args.frame}: ${matches.length} full-span data-duration="${oldStr}" occurrence(s) -> "${newStr}"`);
  if (matches.length === 0) {
    console.log("  (nothing matched -- check --old is exactly right, e.g. from print_word_timeline.mjs's storyboard comparison)");
  }
  if (remaining.length) {
    console.log(`\n  ${remaining.length} scene-specific clip(s) NOT touched (need manual resync against real word timing):`);
    remaining.forEach((r) => console.log(`    #${r.id}: data-start="${r.start}" data-duration="${r.dur}"`));
  }

  if (args.write) {
    writeFileSync(filePath, replaced);
    console.log(`\n✓ wrote ${filePath}`);
  } else {
    console.log("\n(dry run -- pass --write to apply)");
  }
}

main();
