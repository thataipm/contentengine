#!/usr/bin/env node
// thataipm-assemble: chains the full HyperFrames build pipeline into one invocation
// instead of 20+ separate tool calls, stopping at the first failure with a clear report.
//
// Stage order: registry blocklist -> VO model -> caption skin -> captions build ->
// caption pill-format + safe-zone -> assemble-index -> transition idempotency ->
// static-gap -> paste-in wiring -> registry usage -> device variety -> registry ratio ->
// sfx presence -> transitions inject -> hyperframes check -> [snapshot] -> [render] ->
// render freeze check -> volumedetect -> [speedup] -> [speedup verify].
//
// Revised 2026-08-24 after a full architecture/bug-history audit found the two checks that
// actually catch this project's most common real failures (a component rendering blank/
// black/frozen while `hyperframes check` reports clean; a render shipped at the wrong speed
// or not sped up at all) existed only as manual steps or in a disconnected orchestrator
// (CC-Agent) that no episode had ever actually run through. Every check below either already
// existed and is now wired in, or is new and targets a bug class with a documented, real,
// repeat-shipped incident in docs/hyperframes_production_notes.md -- see that file and the
// CC-Agent/README.md note on what got archived and why.
//
// Usage:
//   node pipeline.mjs --project-dir hyperframes-<episode> [flags]
//
// Flags (each --skip-* has a real reason to exist -- see that stage's own comment below,
// not a blanket escape hatch):
//   --no-render                       stop after hyperframes check passes
//   --snapshot                        also run `npm run snapshot`
//   --skip-transitions                re-run without re-injecting (timing unchanged since last inject)
//   --skip-gap-check                  static-gap check
//   --skip-registry-check             registry usage accounting
//   --skip-sfx-check                  SFX-presence check
//   --skip-caption-skin               caption skin staging
//   --skip-caption-format-check       caption pill-format + safe-zone checks
//   --skip-captions-build             captions.mjs build (use when captions.html is hand-built)
//   --skip-blocklist-check            registry blocklist (known-broken component/mount combos)
//   --skip-vo-model-check             VO model recorded in audio_meta.json
//   --skip-transition-idempotency-check  pre-inject double-extension check
//   --skip-paste-in-check             paste-in CSS/windowing shape lint
//   --skip-device-variety-check       same content device reused across frames
//   --skip-registry-ratio-check       95% registry / 5% hand-built budget
//   --skip-freeze-check               post-render whole-frame freeze detection
//   --skip-speedup                    skip the automated 1.1x speedup step entirely
//   --speedup-factor <n>              override the speedup factor (default 1.1, this channel's convention)
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
const REPO_ROOT = path.resolve(SELF_DIR, "..", "..", "..", "..");
const REGISTRY_CHECK_SCRIPT = path.resolve(SELF_DIR, "..", "..", "thataipm-registry-check", "scripts", "check_registry_usage.mjs");
const REGISTRY_BLOCKLIST_SCRIPT = path.resolve(SELF_DIR, "..", "..", "thataipm-registry-check", "scripts", "check_registry_blocklist.mjs");
const PASTE_IN_CHECK_SCRIPT = path.resolve(SELF_DIR, "..", "..", "thataipm-visual-plan", "scripts", "check_paste_in_wiring.mjs");
const RENDER_FREEZE_CHECK_SCRIPT = path.join(SELF_DIR, "check_render_freeze.mjs");
const CC_AGENT_CHECKS = path.join(REPO_ROOT, "CC-Agent", "checks");
const CAPTION_SKIN_TEMPLATE = path.join(REPO_ROOT, "docs", "templates", "thataipm-caption-skin.html");

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
    blocklistCheck: true,
    voModelCheck: true,
    transitionIdempotencyCheck: true,
    pasteInCheck: true,
    deviceVarietyCheck: true,
    registryRatioCheck: true,
    freezeCheck: true,
    speedup: true,
    speedupFactor: 1.1,
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
    else if (a === "--skip-blocklist-check") out.blocklistCheck = false;
    else if (a === "--skip-vo-model-check") out.voModelCheck = false;
    else if (a === "--skip-transition-idempotency-check") out.transitionIdempotencyCheck = false;
    else if (a === "--skip-paste-in-check") out.pasteInCheck = false;
    else if (a === "--skip-device-variety-check") out.deviceVarietyCheck = false;
    else if (a === "--skip-registry-ratio-check") out.registryRatioCheck = false;
    else if (a === "--skip-freeze-check") out.freezeCheck = false;
    else if (a === "--skip-speedup") out.speedup = false;
    else if (a === "--speedup-factor") out.speedupFactor = parseFloat(argv[++i]);
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

function run(label, cmd, args, cwd, { optional = false } = {}) {
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
    const marker = optional ? "⚠ WARN (continuing)" : "✗ FAILED";
    console.error(`\n${marker} at: ${label} (exit ${r.status}) -- full output above, also at ${logPath}`);
    if (!optional) process.exit(r.status ?? 1);
    return false;
  }
  const lines = output.split("\n").filter((l) => l.trim().length > 0);
  const tail = lines.slice(-TAIL_LINES);
  if (tail.length) console.log(tail.join("\n"));
  console.log(`✓ ${label} done (full output: ${logPath})`);
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pd = args.projectDir;

  if (!existsSync(path.join(pd, "STORYBOARD.md"))) {
    throw new Error(`${pd} doesn't look like a faceless-explainer project (no STORYBOARD.md)`);
  }

  if (args.blocklistCheck) {
    // Turns "hope the agent read the durable-pitfalls log before wiring a component" into a
    // real gate -- browser-device-stage's hardcoded-duration bug shipped TWICE specifically
    // because the frame was authored without checking that log first. See
    // registry_blocklist.json for the machine-checkable summary of every confirmed-broken
    // component/mount combo on this channel.
    run("1/20 registry blocklist check", "node", [REGISTRY_BLOCKLIST_SCRIPT, "--project-dir", pd], pd);
  } else {
    console.log("\n○ 1/20 registry blocklist check skipped (--skip-blocklist-check passed)");
  }

  if (args.voModelCheck) {
    // Every established episode is supposed to cut on eleven_v3 -- the shared media-use
    // engine's Python path hardcodes the older eleven_multilingual_v2 with no override, and
    // that mismatch shipped once already before anyone checked audio_meta.json's own
    // recorded model_id. Cheap, catches drift at the one place that's always read anyway.
    run(
      "2/20 VO model check",
      "node",
      [path.join(CC_AGENT_CHECKS, "check_vo_model.mjs"), "--project-dir", pd, "--docs-root", REPO_ROOT],
      pd
    );
  } else {
    console.log("\n○ 2/20 VO model check skipped (--skip-vo-model-check passed)");
  }

  {
    // Turns the "-18 to -22dB mean, max under -1dB" prose in thataipm-vo's own SKILL.md
    // into a real PASS/FAIL, checked against the pre-mix full-take.wav (what that threshold
    // was actually calibrated against) BEFORE render, not the post-mix final video. Warn-
    // only: a real test against this channel's own already-shipped, fine-sounding audio
    // failed the max_volume side by 0.1dB (a near-ceiling peak, not real clipping) -- that
    // margin is tight enough that hard-failing on it would just teach people to reach for
    // the skip flag, which defeats the point. Kept as a loud, non-blocking signal instead.
    const fullTakePath = path.join(pd, "assets", "voice", "full-take.wav");
    if (existsSync(fullTakePath)) {
      run("2.5/20 VO audio level check (informational)", "node", [path.join(CC_AGENT_CHECKS, "check_audio_levels.mjs"), "--project-dir", pd, "--docs-root", REPO_ROOT], pd, { optional: true });
    } else {
      console.log("\n○ 2.5/20 VO audio level check skipped -- no assets/voice/full-take.wav found");
    }
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
      console.log(`\n○ 3/20 caption skin stage skipped -- project already has its own caption skin`);
    } else if (!existsSync(CAPTION_SKIN_TEMPLATE)) {
      console.log(`\n○ 3/20 caption skin stage skipped -- template not found at ${CAPTION_SKIN_TEMPLATE}`);
    } else {
      mkdirSync(hiddenSkinDir, { recursive: true });
      copyFileSync(CAPTION_SKIN_TEMPLATE, hiddenSkinPath);
      console.log(`\n▶ 3/20 caption skin stage`);
      console.log(`✓ 3/20 caption skin stage done -- staged thataipm-caption-skin.html to .hyperframes/caption-skin.html`);
    }
  } else {
    console.log("\n○ 3/20 caption skin stage skipped (--skip-caption-skin passed)");
  }

  if (args.captionsBuild) {
    run(
      "4/20 captions build",
      "node",
      [path.join(FE_SCRIPTS, "captions.mjs"), "build", "--storyboard", "STORYBOARD.md", "--audio-meta", "audio_meta.json", "--hyperframes", "."],
      pd
    );
  } else {
    console.log("\n○ 4/20 captions build skipped (--skip-captions-build passed) -- compositions/captions.html left as-is");
  }

  if (args.captionFormatCheck) {
    // Real gates for Rules 2 & 3 -- read the actual BUILT compositions/captions.html
    // (whatever produced it: this skin, a different one, or the engine default), so
    // they validate outcomes, not just that the skin-staging step above ran.
    run("5/20 caption pill-format check", "node", [path.join(CC_AGENT_CHECKS, "check_caption_pill_format.mjs"), "--project-dir", pd], pd);
    run("6/20 caption safe-zone check", "node", [path.join(CC_AGENT_CHECKS, "check_caption_safe_zone.mjs"), "--project-dir", pd], pd);
  } else {
    console.log("\n○ 5/20-6/20 caption format/safe-zone checks skipped (--skip-caption-format-check passed)");
  }

  run("7/20 assemble-index", "node", [path.join(FE_SCRIPTS, "assemble-index.mjs")], pd);

  if (args.transitionIdempotencyCheck) {
    // Runs BEFORE inject, catching a frame that already carries a prior transition
    // extension on disk (VO changed but resync's reset_frame_duration.mjs wasn't run) --
    // injecting again on top of that double-extends it. Skips cleanly on SCRIPT.md-only
    // projects with no STORYBOARD.md to compare against.
    run(
      "8/20 transition idempotency check",
      "node",
      [path.join(CC_AGENT_CHECKS, "check_transition_idempotency.mjs"), "--project-dir", pd, "--docs-root", REPO_ROOT],
      pd
    );
  } else {
    console.log("\n○ 8/20 transition idempotency check skipped (--skip-transition-idempotency-check passed)");
  }

  if (args.gapCheck) {
    // Runs BEFORE transitions inject, against each frame's true (pre-extension)
    // duration -- the Visual Retention Rule gate (CLAUDE.md rule 1). hyperframes
    // check's own Motion section does not catch long static holds at all.
    run("9/20 static-gap check", "node", [path.join(SELF_DIR, "check_static_gaps.mjs"), "--frames", "compositions/frames/*.html"], pd);
  } else {
    console.log("\n○ 9/20 static-gap check skipped (--skip-gap-check passed)");
  }

  if (args.pasteInCheck) {
    // Flags the SHAPE of the two most common paste-in wiring bugs (missing base CSS,
    // windowing on the wrong element) before render. A clean pass does not prove content
    // is visible -- that's still the dense /watch pass's job -- but a failing pass is
    // real signal worth stopping for.
    run("10/20 paste-in wiring check", "node", [PASTE_IN_CHECK_SCRIPT, "--project-dir", pd], pd);
  } else {
    console.log("\n○ 10/20 paste-in wiring check skipped (--skip-paste-in-check passed)");
  }

  if (args.registryCheck) {
    // Hard gate, not a reminder: fails unless a registry block is actually installed,
    // or this episode's slug is logged in docs/hyperframes_production_notes.md as a
    // checked-and-confirmed gap. A skill someone has to remember to invoke is exactly
    // the failure mode that already shipped the hand-built-vs-registry mistake twice.
    run("11/20 registry usage check", "node", [REGISTRY_CHECK_SCRIPT, "--project-dir", pd], pd);
  } else {
    console.log("\n○ 11/20 registry usage check skipped (--skip-registry-check passed)");
  }

  if (args.deviceVarietyCheck) {
    // Catches the same content-carrying device reused across 2+ frames -- real incident:
    // every frame of an episode reused browser-device-stage with only camera moves and
    // content differing, and nothing else in this pipeline checks for that. Depends on the
    // registry-usage Log entry the previous step just verified exists.
    run(
      "12/20 device variety check",
      "node",
      [path.join(CC_AGENT_CHECKS, "check_device_variety.mjs"), "--project-dir", pd, "--docs-root", REPO_ROOT],
      pd
    );
  } else {
    console.log("\n○ 12/20 device variety check skipped (--skip-device-variety-check passed)");
  }

  if (args.registryRatioCheck) {
    // Direct instruction (2026-08-15): "Enforce 95% hyperframes components, leverage all
    // library for entire video." check_registry_usage.mjs already forces every frame to be
    // individually accounted for; this adds the numeric 95%-registry / 5%-hand-built budget
    // on top of that same accounting.
    run(
      "13/20 registry ratio check",
      "node",
      [path.join(CC_AGENT_CHECKS, "check_registry_ratio.mjs"), "--project-dir", pd, "--docs-root", REPO_ROOT],
      pd
    );
  } else {
    console.log("\n○ 13/20 registry ratio check skipped (--skip-registry-ratio-check passed)");
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
    console.log(`\n▶ 14/20 sfx check`);
    if (sfxCount > 0) {
      console.log(`✓ 14/20 sfx check done -- ${sfxCount} cue(s) in audio_meta.json`);
    } else {
      console.error(`\n✗ FAILED at: 14/20 sfx check -- audio_meta.json has zero sfx cues.`);
      console.error(`  This channel's standing convention is real whoosh/ui-pop/chime cues on`);
      console.error(`  transitions and reveals (established since sk1). If this episode`);
      console.error(`  genuinely needs none, re-run with --skip-sfx-check and say why in the`);
      console.error(`  episode's STORYBOARD.md notes -- don't let this go silently missing.`);
      process.exit(1);
    }
  } else {
    console.log("\n○ 14/20 sfx check skipped (--skip-sfx-check passed)");
  }

  if (args.transitions) {
    run(
      "15/20 transitions inject",
      "node",
      [path.join(FE_SCRIPTS, "transitions.mjs"), "inject", "--index", "index.html", "--storyboard", "STORYBOARD.md"],
      pd
    );
  } else {
    console.log("\n○ 15/20 transitions skipped (--skip-transitions passed -- re-running inject on already-extended durations would double-extend them)");
  }

  run("16/20 hyperframes check", "npm", ["run", "check"], pd);

  if (args.snapshot) {
    run("17/20 hyperframes snapshot", "npm", ["run", "snapshot"], pd);
  } else {
    console.log("\n○ 17/20 snapshot skipped (pass --snapshot to run it)");
  }

  if (args.render) {
    run("18/20 render", "npm", ["run", "render", "--", "--skill=faceless-explainer", "--quality", "high", "--output", "renders/video.mp4"], pd);

    const outPath = path.join(pd, "renders", "video.mp4");
    if (existsSync(outPath)) {
      console.log("\n▶ audio sanity check (volumedetect)");
      const r = spawnSync("ffmpeg", ["-i", outPath, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf-8" });
      const lines = (r.stderr || "").split("\n").filter((l) => /mean_volume|max_volume/.test(l));
      lines.forEach((l) => console.log("  " + l.trim()));
      if (!lines.length) console.log("  (volumedetect output not found -- check ffmpeg is on PATH)");

      if (args.freezeCheck) {
        // The highest-leverage new gate: catches the dominant real bug class on this
        // channel (a component rendering blank/black/frozen while hyperframes check
        // reports clean) directly on rendered pixels, via ffmpeg's freezedetect. See
        // check_render_freeze.mjs's own header for what it does and does not catch --
        // it does not replace the dense /watch pass, it makes that pass faster.
        run("19/20 render freeze check", "node", [RENDER_FREEZE_CHECK_SCRIPT, "--video", outPath], pd);
      } else {
        console.log("\n○ 19/20 render freeze check skipped (--skip-freeze-check passed)");
      }

      if (args.speedup) {
        // Automates the step that shipped wrong twice before: once at the wrong factor
        // (1.2 instead of this channel's real 1.1x convention), once not applied at all.
        // Running it here means there's no manual ffmpeg command left to forget or
        // mistype -- the pipeline itself always produces video_rushed.mp4 at the
        // confirmed-correct factor, then verifies its own output.
        const rushedPath = path.join(pd, "renders", "video_rushed.mp4");
        const filterComplex = `[0:v]setpts=PTS/${args.speedupFactor}[v];[0:a]atempo=${args.speedupFactor}[a]`;
        run(
          "20/20 speedup",
          "ffmpeg",
          ["-y", "-i", outPath, "-filter_complex", filterComplex, "-map", "[v]", "-map", "[a]", rushedPath],
          pd
        );
        run(
          "20/20 speedup verify",
          "node",
          [path.join(CC_AGENT_CHECKS, "check_speedup_applied.mjs"), "--project-dir", pd, "--docs-root", REPO_ROOT, "--expected-factor", String(args.speedupFactor)],
          pd
        );
      } else {
        console.log("\n○ 20/20 speedup skipped (--skip-speedup passed) -- renders/video_rushed.mp4 not produced");
      }
    }
  } else {
    console.log("\n○ 18/20-20/20 render, freeze check, and speedup skipped (--no-render passed)");
  }

  console.log("\n✓ pipeline complete");
}

main();
