#!/usr/bin/env node
// thataipm-resync: prints each frame's real per-word timeline from audio_meta.json
// in a compact copy-paste form, plus a STORYBOARD.md old-vs-new duration table.
// This is the exact manual step done by hand every time VO changes (a `py -c`
// one-liner in the book-to-skill session) -- encoded here so it's one command.
//
// Usage: node print_word_timeline.mjs --audio-meta audio_meta.json --storyboard STORYBOARD.md

import { readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--audio-meta") out.audioMeta = argv[++i];
    else if (a === "--storyboard") out.storyboard = argv[++i];
  }
  if (!out.audioMeta) throw new Error("missing --audio-meta <path>");
  return out;
}

function storyboardDurations(text) {
  // Pulls each "## Frame N — ..." block's "- duration: X.Ys" field.
  const frames = [];
  const blocks = text.split(/^## Frame \d+/m).slice(1);
  blocks.forEach((block, i) => {
    const m = block.match(/-\s*duration:\s*([\d.]+)s/);
    if (m) frames.push({ frame: i + 1, duration: parseFloat(m[1]) });
  });
  return frames;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const audioMeta = JSON.parse(readFileSync(path.resolve(args.audioMeta), "utf-8"));

  console.log("Real per-word timelines (from audio_meta.json forced alignment):\n");
  for (const v of audioMeta.voices || []) {
    console.log(`=== frame ${v.frame} (${v.duration_s}s) ===`);
    const line = (v.words || [])
      .map((w) => `${w.text}@${Math.round(w.start * 100) / 100}`)
      .join(" ");
    console.log(line + "\n");
  }

  if (args.storyboard) {
    const sbText = readFileSync(path.resolve(args.storyboard), "utf-8");
    const sbDurations = storyboardDurations(sbText);
    console.log("STORYBOARD.md declared durations vs real audio_meta.json durations:");
    for (const sb of sbDurations) {
      const real = (audioMeta.voices || []).find((v) => v.frame === sb.frame);
      const realDur = real ? real.duration_s : null;
      const flag = realDur !== null && Math.abs(realDur - sb.duration) > 0.01 ? "  <- MISMATCH, resync needed" : "  ok";
      console.log(`  frame ${sb.frame}: storyboard=${sb.duration}s  audio=${realDur ?? "?"}s${flag}`);
    }
  }
}

main();
