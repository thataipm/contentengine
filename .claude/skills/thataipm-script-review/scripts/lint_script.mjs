#!/usr/bin/env node
// thataipm-script-review: mechanical PASS/FAIL checks for a SCRIPT.md, run AFTER
// the humanizer draft-audit-final loop. Turns this channel's own standing rules
// (no em dashes, ever; realistic runtime; no staccato fragment runs) into a command
// with an exit code instead of eyeballing, per this project's own "Goal-Driven
// Execution" working-discipline rule.
//
// Usage: node lint_script.mjs --script SCRIPT.md [--target-min 45] [--target-max 60]

import { readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { targetMin: 45, targetMax: 60 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--script") out.script = argv[++i];
    else if (a === "--target-min") out.targetMin = parseFloat(argv[++i]);
    else if (a === "--target-max") out.targetMax = parseFloat(argv[++i]);
  }
  if (!out.script) throw new Error("missing --script <path>");
  return out;
}

// Extracts each "## Line N — ..." section's indented VO paragraph. Strips
// bracketed v3 delivery tags (e.g. "[rushed]") for word-count/speech purposes,
// since those are directives, not spoken text.
function extractLines(text) {
  const sections = text.split(/^## Line \d+/m).slice(1);
  const lines = [];
  for (const section of sections) {
    const match = section.match(/^\s{2,}(\S.*(?:\n\s{2,}\S.*)*)/m);
    if (!match) continue;
    const raw = match[1].replace(/\n\s+/g, " ").trim();
    const spoken = raw.replace(/\[[a-z ]+\]\s*/gi, "").trim();
    lines.push({ raw, spoken });
  }
  return lines;
}

function findDashHits(text) {
  const hits = [];
  const re = /[—–]|--/g;
  let m;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/[—–]/.test(line) || / -- /.test(line)) {
      hits.push({ lineNo: i + 1, text: line.trim() });
    }
  });
  return hits;
}

function findCurlyQuotes(text) {
  return (text.match(/[‘’“”]/g) || []).length;
}

// Rough speaking-rate estimate, calibrated against the book-to-skill episode's
// real ElevenLabs forced-alignment data (159 words / 54.216s measured render =
// 2.93 wps, mixed rushed/natural pacing across frames). Treat this as an
// estimate, not ground truth -- real runtime comes from forced alignment in
// /thataipm-vo.
const WORDS_PER_SECOND = 2.9;

function estimateRuntime(lines) {
  const totalWords = lines.reduce((sum, l) => sum + l.spoken.split(/\s+/).filter(Boolean).length, 0);
  return { totalWords, estSeconds: Math.round((totalWords / WORDS_PER_SECOND) * 10) / 10 };
}

// Flags 3+ consecutive short sentences (<=4 words) within a single line, one
// of the two staccato patterns this channel's humanizer pass has caught before
// (the other, AI-vocabulary/em-dash patterns, is humanizer's own job upstream).
function findStaccatoRuns(lines) {
  const hits = [];
  lines.forEach((l, idx) => {
    const sentences = l.spoken.split(/(?<=[.!?])\s+/).filter(Boolean);
    let run = 0;
    for (const s of sentences) {
      const wc = s.split(/\s+/).filter(Boolean).length;
      if (wc <= 4) run++;
      else run = 0;
      if (run >= 3) {
        hits.push({ frame: idx + 1, sentence: s });
        break;
      }
    }
  });
  return hits;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const text = readFileSync(path.resolve(args.script), "utf-8");
  const lines = extractLines(text);

  if (lines.length === 0) {
    console.error("✗ no '## Line N' sections found -- is this a SCRIPT.md in the expected format?");
    process.exit(1);
  }

  let failed = false;
  console.log(`Checking ${path.resolve(args.script)} (${lines.length} line(s))\n`);

  const dashHits = findDashHits(text);
  if (dashHits.length) {
    failed = true;
    console.log(`✗ em/en dash found (${dashHits.length}) — hard rule, no em dashes ever:`);
    dashHits.forEach((h) => console.log(`    L${h.lineNo}: ${h.text}`));
  } else {
    console.log("✓ no em/en dashes");
  }

  const curly = findCurlyQuotes(text);
  if (curly) {
    failed = true;
    console.log(`✗ ${curly} curly quote(s) found — use straight quotes`);
  } else {
    console.log("✓ no curly quotes");
  }

  const { totalWords, estSeconds } = estimateRuntime(lines);
  const inRange = estSeconds >= args.targetMin && estSeconds <= args.targetMax;
  console.log(
    `${inRange ? "✓" : "✗"} estimated runtime ~${estSeconds}s (${totalWords} words @ ${WORDS_PER_SECOND}wps) — target ${args.targetMin}-${args.targetMax}s`
  );
  if (!inRange) failed = true;

  const staccato = findStaccatoRuns(lines);
  if (staccato.length) {
    console.log(`⚠ possible staccato fragment run(s) (review, not a hard fail):`);
    staccato.forEach((h) => console.log(`    frame ${h.frame}: "...${h.sentence}"`));
  } else {
    console.log("✓ no staccato fragment runs detected");
  }

  console.log(`\n${failed ? "✗ FAIL" : "✓ PASS"} — ${failed ? "fix the above before generating VO" : "clear to run /thataipm-vo"}`);
  process.exit(failed ? 1 : 0);
}

main();
