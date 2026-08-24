#!/usr/bin/env node
// Real check for "post-render-speedup". Confirms renders/video_rushed.mp4 exists and its
// real ffprobe duration is genuinely ~1.1x shorter than renders/video.mp4's -- not just
// that a file with the right name exists (a stale copy or a forgotten re-run would pass a
// filename-only check). This is the exact incident that shipped once already: a render
// delivered to the user at its original, un-sped-up length.
//
// Fixed 2026-08-22, direct correction: this default was wrong at 1.2 -- this channel's
// actual established convention (confirmed across real production, e.g.
// hyperframes-lead-gen-sales-agent's entire render history this session) is 1.1x. The 1.2
// figure was carried over into this script and CC-Agent/agents/assemble-qa.md's own prose
// without checking against real practice -- caught only because it produced a real render
// at the wrong speed.
//
// Usage: node check_speedup_applied.mjs --project-dir hyperframes-<episode> --docs-root <repo-root> [--expected-factor 1.1] [--tolerance 0.03]

import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

function parseArgs(argv) {
  const out = { expectedFactor: 1.1, tolerance: 0.03 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project-dir") out.projectDir = argv[++i];
    else if (argv[i] === "--docs-root") out.docsRoot = argv[++i];
    else if (argv[i] === "--expected-factor") out.expectedFactor = parseFloat(argv[++i]);
    else if (argv[i] === "--tolerance") out.tolerance = parseFloat(argv[++i]);
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

function ffprobeDuration(file) {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], {
    encoding: "utf-8",
  });
  return parseFloat(out.trim());
}

function main() {
  const { projectDir, expectedFactor, tolerance } = parseArgs(process.argv.slice(2));
  const original = path.join(projectDir, "renders", "video.mp4");
  const rushed = path.join(projectDir, "renders", "video_rushed.mp4");

  console.log(`\nSpeedup check for "${path.basename(projectDir)}" (expecting ${expectedFactor}x)`);

  if (!existsSync(original) || !existsSync(rushed)) {
    console.error(`✗ FAIL -- missing ${!existsSync(original) ? "renders/video.mp4" : "renders/video_rushed.mp4"}.`);
    process.exit(1);
  }

  const originalDur = ffprobeDuration(original);
  const rushedDur = ffprobeDuration(rushed);
  const actualFactor = originalDur / rushedDur;

  console.log(`  video.mp4: ${originalDur.toFixed(2)}s, video_rushed.mp4: ${rushedDur.toFixed(2)}s, actual factor: ${actualFactor.toFixed(3)}x`);

  if (Math.abs(actualFactor - expectedFactor) <= tolerance) {
    console.log(`✓ PASS -- speedup factor within tolerance of ${expectedFactor}x.`);
    process.exit(0);
  }

  console.error(`✗ FAIL -- actual speedup factor ${actualFactor.toFixed(3)}x is outside tolerance of ${expectedFactor}x ± ${tolerance}.`);
  console.error(`  video_rushed.mp4 may be a stale copy, a re-render of video.mp4 without the`);
  console.error(`  setpts/atempo step, or the wrong file entirely.`);
  process.exit(1);
}

main();
