#!/usr/bin/env node
// Real check for "vo-level-healthy". Runs ffmpeg volumedetect on the full VO take and
// gates on the exact threshold thataipm-vo/thataipm-assemble's own SKILL.md docs already
// state by hand ("roughly -18 to -22 dB mean, max under -1 dB") -- this was previously
// printed for a human/agent to eyeball and never actually gated.
//
// Usage: node check_audio_levels.mjs --project-dir hyperframes-<episode> --docs-root <repo-root>

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project-dir") out.projectDir = argv[++i];
    else if (argv[i] === "--docs-root") out.docsRoot = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

function findAudioFile(projectDir) {
  const candidates = [
    path.join(projectDir, "assets", "voice", "full-take.wav"),
    path.join(projectDir, "renders", "video_rushed.mp4"),
    path.join(projectDir, "renders", "video.mp4"),
  ];
  return candidates.find((p) => existsSync(p));
}

function main() {
  const { projectDir } = parseArgs(process.argv.slice(2));
  const audioFile = findAudioFile(projectDir);

  console.log(`\nAudio level check for "${path.basename(projectDir)}"`);

  if (!audioFile) {
    console.error(`✗ FAIL -- no full-take.wav or rendered video found under ${projectDir}.`);
    process.exit(1);
  }
  console.log(`  checking: ${audioFile}`);

  const r = spawnSync("ffmpeg", ["-i", audioFile, "-af", "volumedetect", "-f", "null", "-"], {
    encoding: "utf-8",
  });
  const output = (r.stderr || "") + (r.stdout || "");

  const meanMatch = output.match(/mean_volume:\s*(-?[\d.]+)\s*dB/);
  const maxMatch = output.match(/max_volume:\s*(-?[\d.]+)\s*dB/);

  if (!meanMatch || !maxMatch) {
    console.error(`✗ FAIL -- could not parse volumedetect output. Raw tail:\n${output.slice(-500)}`);
    process.exit(1);
  }

  const mean = parseFloat(meanMatch[1]);
  const max = parseFloat(maxMatch[1]);
  console.log(`  mean_volume: ${mean} dB, max_volume: ${max} dB`);

  const meanHealthy = mean >= -22 && mean <= -18;
  const maxHealthy = max < -1;

  if (meanHealthy && maxHealthy) {
    console.log(`✓ PASS -- levels in the healthy range.`);
    process.exit(0);
  }

  console.error(`✗ FAIL -- mean should be -22 to -18 dB (got ${mean}), max should be under -1 dB (got ${max}).`);
  console.error(`  Silence or clipping means the VO take needs redoing -- see thataipm-vo SKILL.md step 4.`);
  process.exit(1);
}

main();
