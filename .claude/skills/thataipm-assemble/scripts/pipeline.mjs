#!/usr/bin/env node
// thataipm-assemble: chains the full HyperFrames build pipeline (captions build ->
// assemble-index -> static-gap check -> transitions inject -> hyperframes check ->
// [snapshot] -> [render] -> volumedetect sanity check) into one invocation instead
// of 7+ separate tool calls, stopping at the first failure with a clear report.
//
// Usage:
//   node pipeline.mjs --project-dir hyperframes-<episode> [--no-render] [--snapshot] [--skip-gap-check]
//
// Requires the project's own package.json "check"/"render" scripts (each episode
// pins its own hyperframes CLI version there) and the global faceless-explainer
// skill's scripts (captions.mjs, assemble-index.mjs, transitions.mjs).

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FE_SCRIPTS = "C:\\Users\\Vinay\\.claude\\skills\\faceless-explainer\\scripts";
const SELF_DIR = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = { render: true, snapshot: false, transitions: true, gapCheck: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--no-render") out.render = false;
    else if (a === "--snapshot") out.snapshot = true;
    else if (a === "--skip-transitions") out.transitions = false;
    else if (a === "--skip-gap-check") out.gapCheck = false;
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

function run(label, cmd, args, cwd) {
  console.log(`\n▶ ${label}`);
  console.log(`  $ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`\n✗ FAILED at: ${label} (exit ${r.status})`);
    process.exit(r.status ?? 1);
  }
  console.log(`✓ ${label} done`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pd = args.projectDir;

  if (!existsSync(path.join(pd, "STORYBOARD.md"))) {
    throw new Error(`${pd} doesn't look like a faceless-explainer project (no STORYBOARD.md)`);
  }

  run(
    "1/7 captions build",
    "node",
    [path.join(FE_SCRIPTS, "captions.mjs"), "build", "--storyboard", "STORYBOARD.md", "--audio-meta", "audio_meta.json", "--hyperframes", "."],
    pd
  );

  run("2/7 assemble-index", "node", [path.join(FE_SCRIPTS, "assemble-index.mjs")], pd);

  if (args.gapCheck) {
    // Runs BEFORE transitions inject, against each frame's true (pre-extension)
    // duration -- the Visual Retention Rule gate (CLAUDE.md rule 1). hyperframes
    // check's own Motion section does not catch long static holds at all.
    run(
      "3/7 static-gap check",
      "node",
      [path.join(SELF_DIR, "check_static_gaps.mjs"), "--frames", "compositions/frames/*.html"],
      pd
    );
  } else {
    console.log("\n○ 3/7 static-gap check skipped (--skip-gap-check passed)");
  }

  if (args.transitions) {
    run(
      "4/7 transitions inject",
      "node",
      [path.join(FE_SCRIPTS, "transitions.mjs"), "inject", "--index", "index.html", "--storyboard", "STORYBOARD.md"],
      pd
    );
  } else {
    console.log("\n○ 4/7 transitions skipped (--skip-transitions passed -- re-running inject on already-extended durations would double-extend them)");
  }

  run("5/7 hyperframes check", "npm", ["run", "check"], pd);

  if (args.snapshot) {
    run("6/7 hyperframes snapshot", "npm", ["run", "snapshot"], pd);
  } else {
    console.log("\n○ 6/7 snapshot skipped (pass --snapshot to run it)");
  }

  if (args.render) {
    run(
      "7/7 render",
      "npm",
      ["run", "render", "--", "--skill=faceless-explainer", "--quality", "high", "--output", "renders/video.mp4"],
      pd
    );

    const outPath = path.join(pd, "renders", "video.mp4");
    if (existsSync(outPath)) {
      console.log("\n▶ audio sanity check (volumedetect)");
      const r = spawnSync("ffmpeg", ["-i", outPath, "-af", "volumedetect", "-f", "null", "-"], {
        encoding: "utf-8",
      });
      const lines = (r.stderr || "").split("\n").filter((l) => /mean_volume|max_volume/.test(l));
      lines.forEach((l) => console.log("  " + l.trim()));
      if (!lines.length) console.log("  (volumedetect output not found -- check ffmpeg is on PATH)");
    }
  } else {
    console.log("\n○ 7/7 render skipped (--no-render passed)");
  }

  console.log("\n✓ pipeline complete");
}

main();
