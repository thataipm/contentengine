#!/usr/bin/env node
// thataipm-vo: generates episode voiceover on the CORRECT model on the first try.
//
// Root cause this encodes a fix for (2026-08-13, book-to-skill episode): the shared
// media-use audio engine's Python TTS path hardcodes model_id="eleven_multilingual_v2"
// with no CLI override, but every @thataipm episode's established voice was cut on
// eleven_v3 -- using the wrong model produces audibly different delivery. This script
// calls the ElevenLabs REST API directly with the correct model, every time.
//
// It also fixes the second real bug hit the same session: the faceless-explainer
// wrapper keeps a SEPARATE neutral sidecar (audio_engine_meta.json) as its own merge
// base for audio_meta.json, so a later `fetch-sfx` run can silently overwrite
// hand-added voice data with stale sidecar content. This script writes directly into
// audio_meta.json's `voices` array (matched by `frame`), leaves `bgm`/`bgm_pending`/
// `sfx` completely untouched, and does not touch the sidecar at all.
//
// Usage:
//   node generate_vo.mjs --lines lines.json --project-dir . [--speed 1.0]
//
// lines.json shape:
//   [{ "frame": 1, "text": "...", "tags": "[rushed] " }, ...]
//   (tags is optional literal text prefixed onto `text` before synthesis, e.g. v3
//   expressive tags like "[rushed]" -- keep it inside `text` yourself if you prefer.)
//
// Requires .env (walked up from --project-dir) with ELEVENLABS_API_KEY and
// ELEVENLABS_VOICE_ID. Requires `ffmpeg` on PATH for mp3->wav conversion.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const MODEL_ID = "eleven_v3";

function parseArgs(argv) {
  const out = { speed: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--lines") out.lines = argv[++i];
    else if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--speed") out.speed = parseFloat(argv[++i]);
    else if (a === "--audio-meta") out.audioMeta = argv[++i];
  }
  if (!out.lines) throw new Error("missing --lines <path>");
  out.projectDir = path.resolve(out.projectDir || ".");
  out.audioMeta = path.resolve(out.audioMeta || path.join(out.projectDir, "audio_meta.json"));
  return out;
}

function findEnvFile(startDir) {
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, ".env");
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function loadEnv(projectDir) {
  const envPath = findEnvFile(projectDir);
  if (!envPath) throw new Error("no .env found walking up from " + projectDir);
  const text = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) {
    throw new Error("ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID missing from " + envPath);
  }
  return env;
}

async function synthesize(apiKey, voiceId, text, speed) {
  const body = { text, model_id: MODEL_ID };
  if (speed) body.voice_settings = { speed };
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`TTS failed (${res.status}): ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function forcedAlignment(apiKey, text, wavPath) {
  const wavBuf = readFileSync(wavPath);
  const form = new FormData();
  form.append("text", text);
  form.append("file", new Blob([wavBuf], { type: "audio/wav" }), path.basename(wavPath));
  const res = await fetch("https://api.elevenlabs.io/v1/forced-alignment", {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  });
  if (!res.ok) throw new Error(`forced-alignment failed (${res.status}): ${await res.text()}`);
  return res.json();
}

function mp3ToWav(mp3Path, wavPath) {
  const r = spawnSync(
    "ffmpeg",
    ["-y", "-i", mp3Path, "-ar", "44100", "-ac", "1", wavPath],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  if (r.status !== 0) throw new Error("ffmpeg mp3->wav failed: " + r.stderr?.toString());
}

function wavDurationSeconds(wavPath) {
  const r = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    wavPath,
  ]);
  return parseFloat(r.stdout.toString().trim());
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = loadEnv(args.projectDir);
  const lines = JSON.parse(readFileSync(path.resolve(args.lines), "utf-8"));

  const voiceDir = path.join(args.projectDir, "assets", "voice");
  mkdirSync(voiceDir, { recursive: true });

  let audioMeta = { bgm: null, bgm_pending: false, voices: [], sfx: [] };
  if (existsSync(args.audioMeta)) {
    audioMeta = JSON.parse(readFileSync(args.audioMeta, "utf-8"));
    audioMeta.voices = audioMeta.voices || [];
    audioMeta.sfx = audioMeta.sfx || [];
  }

  console.log(`Model: ${MODEL_ID} · Voice: ${env.ELEVENLABS_VOICE_ID}`);

  for (const line of lines) {
    const frame = line.frame;
    const text = (line.tags || "") + line.text;
    const mp3Path = path.join(voiceDir, `${String(frame).padStart(2, "0")}.mp3`);
    const wavPath = path.join(voiceDir, `${String(frame).padStart(2, "0")}.wav`);

    process.stdout.write(`  frame ${frame}: synthesizing... `);
    const mp3 = await synthesize(env.ELEVENLABS_API_KEY, env.ELEVENLABS_VOICE_ID, text, args.speed);
    writeFileSync(mp3Path, mp3);
    mp3ToWav(mp3Path, wavPath);
    const duration = wavDurationSeconds(wavPath);

    process.stdout.write("aligning... ");
    const alignment = await forcedAlignment(env.ELEVENLABS_API_KEY, line.text, wavPath);
    const words = (alignment.words || []).map((w) => ({
      text: w.text,
      start: w.start,
      end: w.end,
    }));

    const entry = {
      frame,
      path: path.relative(args.projectDir, wavPath).replace(/\\/g, "/"),
      duration_s: Math.round(duration * 1000) / 1000,
      words,
    };
    const existingIdx = audioMeta.voices.findIndex((v) => v.frame === frame);
    if (existingIdx >= 0) audioMeta.voices[existingIdx] = entry;
    else audioMeta.voices.push(entry);

    console.log(`done (${entry.duration_s}s, ${words.length} words)`);
  }

  audioMeta.voices.sort((a, b) => a.frame - b.frame);
  writeFileSync(args.audioMeta, JSON.stringify(audioMeta, null, 2));
  console.log(`\n✓ wrote ${args.audioMeta} (bgm/sfx untouched, sidecar not touched)`);
}

main().catch((err) => {
  console.error("✗ " + err.message);
  process.exit(1);
});
