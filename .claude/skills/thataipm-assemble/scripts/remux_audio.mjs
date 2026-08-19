#!/usr/bin/env node
// remux_audio.mjs -- rebuild ONLY the audio mix and remux it onto an already-rendered
// video, skipping HyperFrames' full Puppeteer frame-capture pass entirely.
//
// Why this exists: `npx hyperframes render` has no audio-only / incremental mode
// (confirmed against `render --help`, 2026-08-20) -- every invocation recaptures
// every visual frame even when only audio_meta.json's sfx/bgm changed. On the
// hyperframes-claude-code-auto-memory episode this ran 3 full 1560-frame renders
// back to back for two pure-SFX swaps (glitch-1 -> whoosh, key-press -> typing),
// each ~75-80s of compute plus a full verbose render log re-entering the agent's
// context. A forensic pass on the session transcript found Bash tool output
// (renders + ffmpeg + npm checks) was the single largest concrete token category
// at ~22% of the episode's weighted usage. This script is the fix: when the
// composition HTML hasn't changed, only audio_meta.json has, rebuild the mix
// directly with ffmpeg and remux it onto the last good video-only stream.
//
// Usage:
//   node remux_audio.mjs --project-dir <dir> --source-video <path-to-known-good-render.mp4> [--out <path>]
//
// Requires ffmpeg on PATH. Reads audio_meta.json's voices[] (frame order gives
// cumulative absolute start times via duration_s) and sfx[] (frame + offset_s is
// relative to that frame's absolute start, matching how frame compositions author
// their own GSAP cue times) and bgm (if present, spans the full timeline).

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--source-video") out.sourceVideo = argv[++i];
    else if (a === "--out") out.out = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <dir>");
  if (!out.sourceVideo) throw new Error("missing --source-video <path to a known-good render, same visuals>");
  out.projectDir = path.resolve(out.projectDir);
  out.sourceVideo = path.resolve(out.sourceVideo);
  out.out = out.out ? path.resolve(out.out) : path.join(out.projectDir, "renders", "audio_remux.mp4");
  return out;
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
  if (r.status !== 0) {
    console.error(r.stderr?.toString() || r.stdout?.toString() || `${cmd} failed`);
    process.exit(r.status ?? 1);
  }
  return r.stdout?.toString() ?? "";
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pd = args.projectDir;
  const metaPath = path.join(pd, "audio_meta.json");
  if (!existsSync(metaPath)) throw new Error(`no audio_meta.json at ${metaPath}`);
  const meta = JSON.parse(readFileSync(metaPath, "utf-8"));

  const voices = meta.voices ?? [];
  if (!voices.length) throw new Error("audio_meta.json has no voices[] -- nothing to mix");

  // cumulative absolute start per frame, in the order voices[] lists them
  let cursor = 0;
  const frameStart = {}; // frame number -> absolute start seconds
  for (const v of voices) {
    frameStart[v.frame] = cursor;
    cursor += Number(v.duration_s) || 0;
  }
  const totalDuration = cursor;

  const inputs = []; // {path, delayMs, volume}
  for (const v of voices) {
    const abs = frameStart[v.frame];
    inputs.push({ path: path.join(pd, v.path), delayMs: Math.round(abs * 1000), volume: 1.0 });
  }
  for (const s of meta.sfx ?? []) {
    const base = frameStart[s.frame];
    if (base === undefined) {
      console.error(`sfx cue references frame ${s.frame}, not in voices[] -- skipped`);
      continue;
    }
    const abs = base + (Number(s.offset_s) || 0);
    inputs.push({ path: path.join(pd, s.file), delayMs: Math.round(abs * 1000), volume: Number(s.volume) || 0.3 });
  }
  if (meta.bgm?.path) {
    inputs.push({ path: path.join(pd, meta.bgm.path), delayMs: 0, volume: Number(meta.bgm.volume) || 0.15 });
  }

  for (const inp of inputs) {
    if (!existsSync(inp.path)) throw new Error(`referenced audio file missing on disk: ${inp.path}`);
  }

  const work = mkdtempSync(path.join(tmpdir(), "hf-remux-"));
  const mixedWav = path.join(work, "mixed.wav");

  const ffArgs = [];
  for (const inp of inputs) ffArgs.push("-i", inp.path);
  const filterParts = inputs.map(
    (inp, i) => `[${i}:a]adelay=${inp.delayMs}|${inp.delayMs},volume=${inp.volume}[a${i}]`,
  );
  const mixInputs = inputs.map((_, i) => `[a${i}]`).join("");
  // normalize=0: amix's default behavior scales every input down by 1/N, which
  // reads as a much quieter mix than HyperFrames' own assemble step produces --
  // confirmed by a real A/B (this filter with normalize=1 measured -34.3dB mean
  // vs the real pipeline's -21dB mean on the same episode). Off, each source
  // keeps its authored volume and only clips if the mix is genuinely too hot.
  const filter = `${filterParts.join(";")};${mixInputs}amix=inputs=${inputs.length}:duration=longest:dropout_transition=0:normalize=0[mixed]`;
  run("ffmpeg", ["-y", ...ffArgs, "-filter_complex", filter, "-map", "[mixed]", "-t", String(totalDuration), mixedWav]);
  console.log(`mixed audio: ${mixedWav} (${totalDuration.toFixed(2)}s, ${inputs.length} source(s))`);

  const videoOnly = path.join(work, "video_only.mp4");
  run("ffmpeg", ["-y", "-i", args.sourceVideo, "-an", "-c:v", "copy", videoOnly]);

  run("ffmpeg", [
    "-y", "-i", videoOnly, "-i", mixedWav,
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    "-map", "0:v:0", "-map", "1:a:0", "-shortest",
    args.out,
  ]);
  console.log(`remuxed: ${args.out}`);

  rmSync(work, { recursive: true, force: true });
}

main();
