#!/usr/bin/env node
// thataipm-assemble: chains the full HyperFrames build pipeline (caption skin stage ->
// captions build -> caption pill-format + safe-zone checks -> assemble-index ->
// static-gap check -> registry usage check -> transitions inject -> hyperframes check ->
// [snapshot] -> [render] -> volumedetect sanity check) into one invocation instead of
// 8+ separate tool calls, stopping at the first failure with a clear report.
//
// Usage:
//   node pipeline.mjs --project-dir hyperframes-<episode> [--no-render] [--snapshot] [--skip-gap-check] [--skip-registry-check] [--skip-caption-skin] [--skip-caption-format-check]
//
// Requires the project's own package.json "check"/"render" scripts (each episode
// pins its own hyperframes CLI version there) and the global faceless-explainer
// skill's scripts (captions.mjs, assemble-index.mjs, transitions.mjs).

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FE_SCRIPTS = "C:\\Users\\Vinay\\.claude\\skills\\faceless-explainer\\scripts";
const SELF_DIR = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_CHECK_SCRIPT = path.resolve(SELF_DIR, "..", "..", "thataipm-registry-check", "scripts", "check_registry_usage.mjs");
const CC_AGENT_CHECKS = path.resolve(SELF_DIR, "..", "..", "..", "..", "CC-Agent", "checks");
const CAPTION_SKIN_TEMPLATE = path.resolve(SELF_DIR, "..", "..", "..", "..", "docs", "templates", "thataipm-caption-skin.html");

function parseArgs(argv) {
  const out = {
    render: true,
    snapshot: false,
    transitions: true,
    gapCheck: true,
    registryCheck: true,
    sfxCheck: true,
    captionSkin: true,
    captionFormatCheck: true,
    captionsBuild: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--no-render") out.render = false;
    else if (a === "--snapshot") out.snapshot = true;
    else if (a === "--skip-transitions") out.transitions = false;
    else if (a === "--skip-gap-check") out.gapCheck = false;
    else if (a === "--skip-registry-check") out.registryCheck = false;
    else if (a === "--skip-sfx-check") out.sfxCheck = false;
    else if (a === "--skip-caption-skin") out.captionSkin = false;
    else if (a === "--skip-caption-format-check") out.captionFormatCheck = false;
    else if (a === "--skip-captions-build") out.captionsBuild = false;
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

// Captures full output to a log file instead of streaming it (stdio: "inherit")
// straight into the caller's context. A forensic token-usage pass on this
// project's own build sessions found raw Bash tool output (render progress
// traces, ffmpeg encoder stats, verbose check dumps) was the single largest
// concrete token category after the base cost of a long session -- see
// docs/hyperframes_production_notes.md's durable-pitfall entry. On success,
// only the last TAIL_LINES lines print (where the step's own PASS/summary line
// usually lives); on failure, the full output prints since it's needed to
// diagnose. Full output is always on disk at the printed log path either way.
const TAIL_LINES = 12;

function run(label, cmd, args, cwd) {
  console.log(`\n▶ ${label}`);
  console.log(`  $ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" });
  const output = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const logDir = path.join(cwd, ".hyperframes", "logs");
  mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, `${label.replace(/[^a-z0-9]+/gi, "_")}.log`);
  writeFileSync(logPath, output);
  if (r.status !== 0) {
    console.error(output);
    console.error(`\n✗ FAILED at: ${label} (exit ${r.status}) -- full output above, also at ${logPath}`);
    process.exit(r.status ?? 1);
  }
  const lines = output.split("\n").filter((l) => l.trim().length > 0);
  const tail = lines.slice(-TAIL_LINES);
  if (tail.length) console.log(tail.join("\n"));
  console.log(`✓ ${label} done (full output: ${logPath})`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pd = args.projectDir;

  if (!existsSync(path.join(pd, "STORYBOARD.md"))) {
    throw new Error(`${pd} doesn't look like a faceless-explainer project (no STORYBOARD.md)`);
  }

  if (args.captionSkin) {
    // Stages this channel's standing caption skin (pill/chip emphasis + real
    // Instagram-safe bottom clearance -- docs/hyperframes_production_notes.md's
    // "Standing rules, 2026-08-15" Rules 2 & 3) into the project BEFORE captions.mjs
    // runs, so captions.mjs's own skin-detection (.hyperframes/caption-skin.html)
    // picks it up automatically. Never overwrites a project that already staged its
    // own skin -- that's a deliberate per-episode override, not a gap to fill.
    const hiddenSkinDir = path.join(pd, ".hyperframes");
    const hiddenSkinPath = path.join(hiddenSkinDir, "caption-skin.html");
    const legacySkinPath = path.join(pd, "caption-skin.html");
    if (existsSync(hiddenSkinPath) || existsSync(legacySkinPath)) {
      console.log(`\n○ 0.5/8 caption skin stage skipped -- project already has its own caption skin`);
    } else if (!existsSync(CAPTION_SKIN_TEMPLATE)) {
      console.log(`\n○ 0.5/8 caption skin stage skipped -- template not found at ${CAPTION_SKIN_TEMPLATE}`);
    } else {
      mkdirSync(hiddenSkinDir, { recursive: true });
      copyFileSync(CAPTION_SKIN_TEMPLATE, hiddenSkinPath);
      console.log(`\n▶ 0.5/8 caption skin stage`);
      console.log(`✓ 0.5/8 caption skin stage done -- staged thataipm-caption-skin.html to .hyperframes/caption-skin.html`);
    }
  } else {
    console.log("\n○ 0.5/8 caption skin stage skipped (--skip-caption-skin passed)");
  }

  if (args.captionsBuild) {
    run(
      "1/8 captions build",
      "node",
      [path.join(FE_SCRIPTS, "captions.mjs"), "build", "--storyboard", "STORYBOARD.md", "--audio-meta", "audio_meta.json", "--hyperframes", "."],
      pd
    );
  } else {
    console.log("\n○ 1/8 captions build skipped (--skip-captions-build passed) -- compositions/captions.html left as-is");
  }

  if (args.captionFormatCheck) {
    // Real gates for Rules 2 & 3 -- read the actual BUILT compositions/captions.html
    // (whatever produced it: this skin, a different one, or the engine default), so
    // they validate outcomes, not just that the skin-staging step above ran.
    run(
      "1.5/8 caption pill-format check",
      "node",
      [path.join(CC_AGENT_CHECKS, "check_caption_pill_format.mjs"), "--project-dir", pd],
      pd
    );
    run(
      "1.6/8 caption safe-zone check",
      "node",
      [path.join(CC_AGENT_CHECKS, "check_caption_safe_zone.mjs"), "--project-dir", pd],
      pd
    );
  } else {
    console.log("\n○ 1.5/8-1.6/8 caption format/safe-zone checks skipped (--skip-caption-format-check passed)");
  }

  run("2/8 assemble-index", "node", [path.join(FE_SCRIPTS, "assemble-index.mjs")], pd);

  if (args.gapCheck) {
    // Runs BEFORE transitions inject, against each frame's true (pre-extension)
    // duration -- the Visual Retention Rule gate (CLAUDE.md rule 1). hyperframes
    // check's own Motion section does not catch long static holds at all.
    run(
      "3/8 static-gap check",
      "node",
      [path.join(SELF_DIR, "check_static_gaps.mjs"), "--frames", "compositions/frames/*.html"],
      pd
    );
  } else {
    console.log("\n○ 3/8 static-gap check skipped (--skip-gap-check passed)");
  }

  if (args.registryCheck) {
    // Hard gate, not a reminder: fails unless a registry block is actually installed,
    // or this episode's slug is logged in docs/hyperframes_production_notes.md as a
    // checked-and-confirmed gap. A skill someone has to remember to invoke is exactly
    // the failure mode that already shipped the hand-built-vs-registry mistake twice.
    run(
      "4/8 registry usage check",
      "node",
      [REGISTRY_CHECK_SCRIPT, "--project-dir", pd],
      pd
    );
  } else {
    console.log("\n○ 4/8 registry usage check skipped (--skip-registry-check passed)");
  }

  if (args.sfxCheck) {
    // Added 2026-08-14 after hyperframes-the-caveman-skill shipped a full
    // render with zero SFX -- nothing anywhere in the pipeline caught it,
    // and the standing whoosh/ui-pop/chime convention (established since
    // sk1) was silently skipped. A skill that could be forgotten is
    // exactly the failure mode this project's other hard gates already
    // exist to close.
    const audioMetaPath = path.join(pd, "audio_meta.json");
    let sfxCount = 0;
    if (existsSync(audioMetaPath)) {
      try {
        sfxCount = (JSON.parse(readFileSync(audioMetaPath, "utf-8")).sfx || []).length;
      } catch {
        // malformed audio_meta.json surfaces later in assemble-index, not here
      }
    }
    console.log(`\n▶ 4.5/8 sfx check`);
    if (sfxCount > 0) {
      console.log(`✓ 4.5/8 sfx check done -- ${sfxCount} cue(s) in audio_meta.json`);
    } else {
      console.error(`\n✗ FAILED at: 4.5/8 sfx check -- audio_meta.json has zero sfx cues.`);
      console.error(`  This channel's standing convention is real whoosh/ui-pop/chime cues on`);
      console.error(`  transitions and reveals (established since sk1). If this episode`);
      console.error(`  genuinely needs none, re-run with --skip-sfx-check and say why in the`);
      console.error(`  episode's STORYBOARD.md notes -- don't let this go silently missing.`);
      process.exit(1);
    }
  } else {
    console.log("\n○ 4.5/8 sfx check skipped (--skip-sfx-check passed)");
  }

  if (args.transitions) {
    run(
      "5/8 transitions inject",
      "node",
      [path.join(FE_SCRIPTS, "transitions.mjs"), "inject", "--index", "index.html", "--storyboard", "STORYBOARD.md"],
      pd
    );
  } else {
    console.log("\n○ 5/8 transitions skipped (--skip-transitions passed -- re-running inject on already-extended durations would double-extend them)");
  }

  run("6/8 hyperframes check", "npm", ["run", "check"], pd);

  if (args.snapshot) {
    run("7/8 hyperframes snapshot", "npm", ["run", "snapshot"], pd);
  } else {
    console.log("\n○ 7/8 snapshot skipped (pass --snapshot to run it)");
  }

  if (args.render) {
    run(
      "8/8 render",
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
    console.log("\n○ 8/8 render skipped (--no-render passed)");
  }

  console.log("\n✓ pipeline complete");
}

main();
