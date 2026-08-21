---
name: thataipm-vo
description: "Generate or regenerate @thataipm episode voiceover as ONE continuous ElevenLabs take (eleven_v3, the established voice) on the first try, split into per-frame files at precise silence boundaries, with real forced-alignment word timing, without clobbering audio_meta.json's existing sfx/bgm data. Use whenever a HyperFrames episode needs new or revised VO. Not for script writing (thataipm-script-review) or frame timing resync (thataipm-resync)."
---

# thataipm-vo: correct-model, single-take voiceover generation

## Why this exists

Three real bugs/gaps shipped VO that had to be redone this channel's history:

1. **Wrong model.** The shared `media-use` audio engine's Python TTS path hardcodes
   `model_id="eleven_multilingual_v2"`, with no CLI flag to override it. Every
   established @thataipm episode was cut on `eleven_v3` instead — the mismatch is
   audible (different delivery, pacing, emphasis), and the user caught it immediately
   on the book-to-skill episode ("what have you done to VO, its very different, not
   matching to original").
2. **Silent data loss.** The faceless-explainer wrapper keeps a separate neutral
   sidecar (`audio_engine_meta.json`) as ITS OWN merge base for `audio_meta.json`. If
   you hand-edit `audio_meta.json` directly and later run the wrapper's `fetch-sfx`,
   it merges from the stale sidecar and silently overwrites your hand-added word
   timing.
3. **Per-line take inconsistency.** Generating each frame's line as an independent
   ElevenLabs call (the original method) can produce audible take-to-take drift in
   pacing/energy/texture across frames — flagged directly on the first
   "Navigating the AI Era" episode ("generate one single file of voiceover to
   maintain right consistancy of vo"). `generate_vo_single_take.mjs` fixes this: one
   synthesis call for the WHOLE script, one forced-alignment pass, then sample-
   accurate ffmpeg cuts (`-c copy`, no re-encode) at the midpoint of each real
   inter-line silence. **This is now the default method — use it unless you have a
   specific reason not to.**

`scripts/generate_vo_single_take.mjs` fixes all three: `eleven_v3` hardcoded, writes
straight into `audio_meta.json`'s `voices` array (matched by `frame`) without
touching `bgm`/`bgm_pending`/`sfx` or the sidecar, and generates the whole script as
one take before splitting.

`scripts/generate_vo.mjs` (the older per-line method) still exists for cases where
frames genuinely need independent delivery registers that shouldn't share a single
continuous take — an intentional, stated exception, not the default.

## When to use this

- A new episode needs VO for the first time.
- An existing episode's script changed and VO needs regenerating.
- VO delivery sounds off and you suspect a model mismatch (check `audio_meta.json`
  has no `model_id` field recorded — if unsure, just regenerate, it's cheap).

## Steps

1. **Confirm the script is final.** Run `/thataipm-script-review` first if the script
   hasn't already passed that gate — regenerating VO is the expensive step, don't do
   it against a draft.

2. **Extract lines to JSON.** Pull each frame's voiceover text from `SCRIPT.md` (or
   `STORYBOARD.md`'s `voiceover:` fields — they must match) into a small file, e.g.
   `scratch/lines.json`:
   ```json
   [
     { "frame": 1, "text": "If you're handing Claude Code whole PDFs, stop...", "tags": "[rushed] " },
     { "frame": 2, "text": "Hand an agent a four-hundred-page book..." }
   ]
   ```
   `tags` is optional literal text prepended before synthesis (v3 expressive tags
   like `[rushed]`) — omit it or fold it into `text` directly, either works. Keep
   `text` itself exactly what should be spoken; alignment runs against `text` alone
   (tags are stripped by the model, not spoken).

3. **Run the generator (single-take, the default):**
   ```bash
   node .claude/skills/thataipm-vo/scripts/generate_vo_single_take.mjs \
     --lines scratch/lines.json \
     --project-dir hyperframes-<episode>/
   ```
   This synthesizes the ENTIRE script in one call, runs forced-alignment once, then
   cuts `assets/voice/NN.wav` per frame at the midpoint of each real silence between
   lines (keeps `full-take.wav` alongside for reference/QA). It prints the model and
   voice ID used — confirm `eleven_v3` and `.env`'s `ELEVENLABS_VOICE_ID`. Word
   timestamps in `audio_meta.json` are re-based to each segment's own start, same
   schema as before, nothing downstream needs to change.

   Only fall back to the older per-line method if frames genuinely need
   independent, unrelated delivery registers:
   ```bash
   node .claude/skills/thataipm-vo/scripts/generate_vo.mjs \
     --lines scratch/lines.json --project-dir hyperframes-<episode>/
   ```

4. **Sanity-check levels** before moving on:
   ```bash
   ffmpeg -i hyperframes-<episode>/assets/voice/full-take.wav -af volumedetect -f null - 2>&1 | grep volume
   ```
   Healthy range is roughly -18 to -22 dB mean, max under -1 dB. Silence or clipping
   means the whole take needs redoing (there's no "just redo one line" with a single
   take — that's the tradeoff for consistency).

5. **Hand off to `/thataipm-resync`** — new VO almost always means new per-word
   timing and new frame durations, which is that skill's job, not this one's.

## Requirements

- `.env` (walked up from `--project-dir`) with `ELEVENLABS_API_KEY` and
  `ELEVENLABS_VOICE_ID` — this project's established values, don't regenerate a new
  voice clone without explicit instruction.
- `ffmpeg`/`ffprobe` on PATH.
- Node 18+ (uses global `fetch`/`FormData`/`Blob`).

## Non-goals

- Does not touch `sfx` or `bgm` entries in `audio_meta.json` — use the shared
  `media-use` engine's `--only sfx`/`--only bgm` for those.
- Does not run `sync-durations` or touch any frame `.html` file's timing — that's
  `/thataipm-resync`.
- Does not decide where to split — the split point is always the silence-gap
  midpoint between lines, not a creative choice per episode.
