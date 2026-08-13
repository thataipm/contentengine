---
name: thataipm-resync
description: "Resync a HyperFrames episode's frame timing after VO changes (new script, re-pacing, re-generation): reset stale full-span data-duration values and get the real per-word timeline needed to rescale each frame's internal GSAP scene boundaries. Use after thataipm-vo produces new audio_meta.json, before thataipm-assemble. Not for generating VO or writing scripts."
---

# thataipm-resync: fast, correct frame-timing resync after VO changes

## Why this exists

Any time VO changes (new script, re-pacing, model fix, a line re-take), every
frame's internal timing goes stale: the `<template>`/full-span `data-duration`
values, any already-injected transition extensions, and every scene's internal
GSAP tween offsets. Doing this by hand (the book-to-skill episode's "increase
pacing a bit" revision) means manually diffing old vs new per-word timestamps and
re-deriving scene boundaries for every frame — mechanical, slow, and easy to get
subtly wrong (a missed occurrence, a stale transition-extended duration).

This skill splits the work correctly: the **mechanical** part (resetting full-span
durations, surfacing the real word timeline) is scripted and deterministic. The
**creative** part (deciding which word a scene boundary should land on) stays a
judgment call you make per frame, using the real timeline the script prints.

## Steps

1. **Confirm new audio is in place.** `/thataipm-vo` should have already run and
   updated `audio_meta.json` and `STORYBOARD.md`'s `duration:` fields (via the
   faceless-explainer wrapper's `sync-durations`, or by hand if durations drifted).

2. **Print the real timeline + mismatch report:**
   ```bash
   node .claude/skills/thataipm-resync/scripts/print_word_timeline.mjs \
     --audio-meta hyperframes-<episode>/audio_meta.json \
     --storyboard hyperframes-<episode>/STORYBOARD.md
   ```
   This prints every frame's `word@timestamp` list (use it to decide exactly where
   each Scene boundary should land — e.g. "burns through" landing at 2.66-3.02s
   means the overflow-crack visual should hit right there) and a table flagging
   which frames' STORYBOARD-declared duration no longer matches the real audio
   duration.

3. **For each mismatched frame, reset the mechanical part:**
   ```bash
   node .claude/skills/thataipm-resync/scripts/reset_frame_duration.mjs \
     --frame hyperframes-<episode>/compositions/frames/02-problem.html \
     --old 14.499 --new 14.819 --write
   ```
   Run without `--write` first — it's a dry run by default and reports every
   full-span occurrence it would change, plus every scene-specific
   `data-start`/`data-duration` pair it deliberately did NOT touch (those are the
   ones that need your judgment next). If a transition was already injected on
   this frame, `--old` should be the transition-extended value currently in the
   file, not the pre-transition STORYBOARD duration — check the reported
   `#frame-bg` duration first if unsure.

4. **Manually rescale each scene-specific duration and internal tween offset**,
   using the real word timeline from step 2. Two acceptable approaches, pick per
   frame based on how much the wording actually changed:
   - **Proportional rescale** (wording barely changed, just re-paced): multiply
     every offset within a scene by `new_scene_span / old_scene_span`.
   - **Word-anchored placement** (wording changed meaningfully): place each scene
     boundary and tween landing directly on the real word timestamp it should sync
     to, same as done for Frame 1's compression snap landing on "There's" in the
     book-to-skill resync.
   Update the scene's own `data-start`/`data-duration` on its clip element(s) to
   match your new boundaries, and leave a short comment noting which real word(s)
   each boundary now lands on (existing frames in this project already do this —
   keep it up, it's what makes the next resync fast).

5. **Rebuild everything downstream** — hand off to `/thataipm-assemble`, which
   rebuilds captions from the new word timing, reassembles `index.html`, and
   re-injects transitions (transitions must be re-injected AFTER this resync, not
   before — re-injecting on top of already-extended durations double-extends them).

## Non-goals

- Does not touch `audio_meta.json` or generate audio — that's `/thataipm-vo`.
- Does not rebuild captions, reassemble `index.html`, or re-run `hyperframes
  check`/render — that's `/thataipm-assemble`.
- Does not decide WHERE a scene boundary should land — that stays your judgment
  call using the printed real word timeline.
