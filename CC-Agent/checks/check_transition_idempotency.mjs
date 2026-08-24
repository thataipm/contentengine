#!/usr/bin/env node
// Real check for "transition-injection-idempotent", built after actually reading the
// external transitions.mjs (C:\Users\Vinay\.claude\skills\faceless-explainer\scripts\
// transitions.mjs) rather than guessing at its internals -- deferring on that risk was the
// right call earlier, but "properly agentic" means going back and doing the real
// investigation once there's time for it, not leaving it stubbed forever.
//
// What transitions.mjs actually does (confirmed by reading extendFrameTail and the inject
// flow): on each inject, it extends the OUTGOING frame's root data-duration AND every
// internal clip's data-duration by the transition overlap amount, writing the change
// directly into the frame's own .html file on disk (not just index.html). assemble-index
// regenerates index.html from scratch every run (writeFileSync of a freshly-built string),
// so a stale "frame transitions (injected...)" marker in index.html is NEVER the real risk
// -- it's always wiped automatically. The REAL risk lives in the frame files themselves:
// if resync's reset_frame_duration.mjs isn't run between VO changes, a frame's on-disk
// data-duration can already carry a prior extension, and a second inject computes a new
// extension on TOP of that already-extended base.
//
// This check can't perfectly replicate transitions.mjs's own extension math (that would
// need parsing STORYBOARD.md's transition_in/overlap fields plus lib/transitions.json's
// per-type duration table) with full confidence -- so it's honestly scoped as a heuristic
// safety net: it compares each frame's current root data-duration against STORYBOARD.md's
// declared duration for that frame, and flags anything extended by MORE than a single
// plausible transition's worth (default 1.5s, comfortably above every real transition
// duration used on this channel so far, e.g. whip-pan-cut's 0.55s) as likely double-extended.
// An extension within that bound is NOT a failure -- one legitimate inject is expected to
// extend outgoing frames, and this check must not punish that.
//
// Usage: node check_transition_idempotency.mjs --project-dir hyperframes-<episode> --docs-root <repo-root> [--max-transition-extension 1.5]

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { maxExtension: 1.5 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project-dir") out.projectDir = argv[++i];
    else if (argv[i] === "--docs-root") out.docsRoot = argv[++i];
    else if (argv[i] === "--max-transition-extension") out.maxExtension = parseFloat(argv[++i]);
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

// STORYBOARD.md format confirmed by reading real files across multiple episodes: a
// top-level "duration: 87.44s" for the whole episode, then per-frame sections each with
// their own "- duration: 16.559" line, in the same order as compositions/frames/*.html
// sorts alphabetically. The trailing "s" on per-frame lines is inconsistent across real
// episodes (present on some, absent on others -- confirmed 2026-08-24 testing against
// hyperframes-ai-cant-grade-its-own-homework's real STORYBOARD.md, which has none), so the
// suffix is optional here. An earlier, stricter version of this regex required the "s" and
// silently produced a false "0 durations found" FAIL against real, correct data.
function parseStoryboardDurations(storyboardPath) {
  const text = readFileSync(storyboardPath, "utf-8");
  const matches = [...text.matchAll(/^-\s*duration:\s*([\d.]+)s?\s*$/gm)];
  return matches.map((m) => parseFloat(m[1]));
}

function main() {
  const { projectDir, maxExtension } = parseArgs(process.argv.slice(2));
  const storyboardPath = path.join(projectDir, "STORYBOARD.md");
  const framesDir = path.join(projectDir, "compositions", "frames");

  console.log(`\nTransition-idempotency check for "${path.basename(projectDir)}" (max single-transition extension: ${maxExtension}s)`);

  if (!existsSync(framesDir)) {
    console.error(`✗ FAIL -- missing compositions/frames/ at ${projectDir}.`);
    process.exit(1);
  }

  // Fixed 2026-08-22, real incident: hyperframes-ai-took-over-my-browser legitimately uses
  // SCRIPT.md-only (no STORYBOARD.md, a valid alternate plan format this channel already
  // supports) and hit a hard FAIL here with nothing a retry could fix -- no amount of
  // re-authoring frame content makes a STORYBOARD.md appear when the project's real workflow
  // never produced one. This check's whole comparison is STORYBOARD-vs-current-duration, so
  // without one there's genuinely nothing to compare -- that's a missing prerequisite, not a
  // double-injection finding, and must not be reported as the same FAIL a real double-inject
  // would produce.
  if (!existsSync(storyboardPath)) {
    console.log(`○ SKIPPED -- no STORYBOARD.md at ${projectDir} (this project uses SCRIPT.md-only,`);
    console.log(`  a valid alternate plan format). This check compares current frame durations`);
    console.log(`  against STORYBOARD-declared values, so without one there's nothing to compare --`);
    console.log(`  an honest gap, not a double-injection finding. If transitions do get injected`);
    console.log(`  later in this project, verify idempotency manually per thataipm-resync's own`);
    console.log(`  warning until this check grows a SCRIPT.md-only comparison path.`);
    process.exit(0);
  }

  const declaredDurations = parseStoryboardDurations(storyboardPath);
  const frameFiles = readdirSync(framesDir).filter((f) => f.endsWith(".html")).sort();

  if (declaredDurations.length !== frameFiles.length) {
    console.error(`✗ FAIL -- STORYBOARD.md has ${declaredDurations.length} per-frame duration(s) but`);
    console.error(`  compositions/frames/ has ${frameFiles.length} file(s) -- can't reliably pair them up.`);
    process.exit(1);
  }

  const flagged = [];
  frameFiles.forEach((file, i) => {
    const filePath = path.join(framesDir, file);
    const html = readFileSync(filePath, "utf-8");
    const rootMatch = html.match(/data-composition-id="[^"]*"[^>]*\bdata-duration="([\d.]+)"/);
    if (!rootMatch) {
      console.log(`  ${file}: no root data-duration found, skipping`);
      return;
    }
    const current = parseFloat(rootMatch[1]);
    const declared = declaredDurations[i];
    const extension = current - declared;
    const status = extension > maxExtension ? "⚠ LIKELY DOUBLE-EXTENDED" : extension > 0.01 ? "extended once (expected)" : "matches STORYBOARD (clean)";
    console.log(`  ${file}: declared=${declared}s current=${current}s extension=${extension.toFixed(3)}s -- ${status}`);
    if (extension > maxExtension) flagged.push({ file, declared, current, extension });
  });

  if (flagged.length === 0) {
    console.log(`\n✓ PASS -- no frame extended beyond one plausible transition's worth.`);
    process.exit(0);
  }

  console.error(`\n✗ FAIL -- ${flagged.length} frame(s) extended well beyond a single transition, likely double-injected:`);
  for (const f of flagged) {
    console.error(`  ${f.file}: ${f.declared}s -> ${f.current}s (+${f.extension.toFixed(3)}s)`);
  }
  console.error(`  Run /thataipm-resync's reset_frame_duration.mjs against the STORYBOARD-declared value`);
  console.error(`  before re-injecting transitions -- do not inject again on top of this.`);
  process.exit(1);
}

main();
