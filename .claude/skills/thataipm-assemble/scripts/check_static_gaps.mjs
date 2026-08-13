#!/usr/bin/env node
// thataipm-assemble: catches the "no static frame longer than 2s" rule
// (CLAUDE.md's Visual Retention Rule, rule 1) mechanically instead of by
// eyeballing a render. `npx hyperframes check`'s Motion section does NOT
// catch this class of bug -- it checks for exit-without-hard-kill and other
// runtime issues, not for long stretches with zero GSAP activity.
//
// Method: parses each frame's <script> block for every tl.to/tl.fromTo/
// tl.set call, extracts its position argument (start time) AND its
// `duration` field, and treats [start, start+duration] as a COVERED range,
// not just a point -- a continuous 4.5s zoom or a character-by-character
// typing tween counts as motion for its whole span, not just its start
// instant. Gaps are computed on the UNION of covered ranges. Position
// arguments that aren't a plain number literal (a loop variable like `t`,
// a relative "+=0.5", a label ref) can't be resolved statically and are
// reported separately rather than silently dropped -- always check that
// list before trusting a PASS.
//
// IMPORTANT CAVEAT: this only proves "something was still animating," not
// that what animated counts as a genuinely NEW visual vs. an existing
// element re-pulsing in place. This channel's standing rule (tightened
// 2026-08-13) wants new visual elements/details for a >2s beat, not a
// passive breathing pulse alone -- that distinction is a creative judgment
// this script cannot make. Treat a PASS here as "not silent," and still
// read through what's actually covering each gap before calling it done.
//
// Usage: node check_static_gaps.mjs --frames compositions/frames/*.html [--threshold 2.0]

import { readFileSync, globSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { threshold: 2.0, frames: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--threshold") out.threshold = parseFloat(argv[++i]);
    else if (a === "--frames") {
      while (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        out.frames.push(argv[++i]);
      }
    }
  }
  if (out.frames.length === 0) throw new Error("missing --frames <path...>");
  return out;
}

function splitTopLevelArgs(argsStr) {
  const args = [];
  let depth = 0;
  let cur = "";
  for (const ch of argsStr) {
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    if (ch === ")" || ch === "}" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      args.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) args.push(cur);
  return args;
}

function extractRanges(scriptBody) {
  const ranges = [];
  const unresolved = [];
  const callRe = /tl\.(to|fromTo|set)\(/g;
  let m;
  while ((m = callRe.exec(scriptBody))) {
    const method = m[1];
    const start = m.index + m[0].length - 1;
    let depth = 0;
    let end = -1;
    for (let i = start; i < scriptBody.length; i++) {
      if (scriptBody[i] === "(") depth++;
      else if (scriptBody[i] === ")") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end === -1) continue;
    const argsStr = scriptBody.slice(start + 1, end);
    const args = splitTopLevelArgs(argsStr);

    const posArg = args[args.length - 1]?.trim();
    // duration lives in the vars object -- for .to()/.set() that's args[1],
    // for .fromTo() the TO-vars is args[2] (duration belongs on the end state).
    const varsArg = method === "fromTo" ? args[2] : args[1];
    const durMatch = varsArg?.match(/duration:\s*([\d.]+)/);
    const duration = durMatch ? parseFloat(durMatch[1]) : 0;

    if (posArg && /^-?\d+(\.\d+)?$/.test(posArg)) {
      const s = parseFloat(posArg);
      ranges.push([s, s + duration]);
    } else if (posArg && posArg.length < 40) {
      unresolved.push(posArg);
    }
  }
  return { ranges, unresolved };
}

function mergeRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of sorted) {
    if (merged.length && s <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    } else {
      merged.push([s, e]);
    }
  }
  return merged;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let failed = false;

  for (const framePattern of args.frames) {
    const files = framePattern.includes("*") ? globSync(framePattern) : [framePattern];
    for (const file of files) {
      const text = readFileSync(path.resolve(file), "utf-8");
      const durMatch = text.match(/<template[^>]*data-duration="([\d.]+)"/);
      const duration = durMatch ? parseFloat(durMatch[1]) : null;
      const scriptMatch = text.match(/<script>([\s\S]*?)<\/script>/);
      if (!scriptMatch) continue;

      const { ranges, unresolved } = extractRanges(scriptMatch[1]);
      const covered = mergeRanges(ranges);

      const gaps = [];
      let prev = 0;
      for (const [s, e] of covered) {
        if (s - prev > args.threshold) gaps.push([prev, s]);
        prev = Math.max(prev, e);
      }
      if (duration !== null && duration - prev > args.threshold) {
        gaps.push([prev, duration]);
      }

      const label = path.basename(file);
      if (gaps.length === 0) {
        console.log(`✓ ${label}: no uncovered gap > ${args.threshold}s (covered to ${prev.toFixed(2)}s, duration ${duration ?? "?"}s)`);
      } else {
        failed = true;
        console.log(`✗ ${label}: ${gaps.length} gap(s) > ${args.threshold}s with no covering tween:`);
        gaps.forEach(([a, b]) => console.log(`    ${a.toFixed(2)}s -> ${b.toFixed(2)}s (${(b - a).toFixed(2)}s)`));
      }
      if (unresolved.length) {
        console.log(`  ⚠ ${unresolved.length} position arg(s) not statically resolvable (loop var / relative / label), NOT counted as coverage -- verify by hand: ${unresolved.slice(0, 4).join(", ")}${unresolved.length > 4 ? "…" : ""}`);
      }
    }
  }

  console.log(
    `\n${failed ? "✗ FAIL" : "✓ PASS (mechanical only)"} — ${failed ? "close each gap, then re-run" : "no silent stretch found, but confirm covering tweens are genuinely NEW visuals, not just an existing element pulsing"}`
  );
  process.exit(failed ? 1 : 0);
}

main();
