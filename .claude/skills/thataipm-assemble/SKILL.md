---
name: thataipm-assemble
description: "Run the full HyperFrames build chain for an @thataipm episode in one command: captions build, assemble-index, a static-gap check for the Visual Retention Rule, transitions inject, hyperframes check, optional snapshot, render, and an audio volumedetect sanity check. Use after frame edits or a thataipm-resync pass are done and it's time to produce a real MP4. Not for editing frame content or timing."
---

# thataipm-assemble: one command instead of seven tool calls

## Why this exists

Every episode build ends with the same sequence run by hand: rebuild captions from
current word timing, reassemble `index.html`, inject transitions, run the
lint/runtime/layout/motion/contrast check, fix whatever the check finds, snapshot
if wanted, render, then a manual `ffmpeg volumedetect` to confirm audio levels are
healthy. This skill chains it into one invocation with a clear stop-on-first-
failure report.

## Steps

1. **Confirm frame content and timing are settled** — no more edits to make to
   `compositions/frames/*.html` or `STORYBOARD.md`. This skill does not edit
   content, it only assembles and validates what's already there.

2. **Run the pipeline:**
   ```bash
   node .claude/skills/thataipm-assemble/scripts/pipeline.mjs \
     --project-dir hyperframes-<episode>
   ```
   Runs, in order: captions build → assemble-index → **static-gap check** →
   transitions inject → `npm run check` → render → `ffmpeg volumedetect`. Stops
   immediately at the first failing step with the command and exit code, so you
   always know exactly which stage broke.

   Flags:
   - `--no-render` — stop after `check` passes, useful for a fast validate-only
     loop while iterating on a layout/contrast fix.
   - `--snapshot` — also run `npm run snapshot` for visual review before
     rendering.
   - `--skip-transitions` — **only** use this on a re-run where timing hasn't
     changed since the last successful transitions inject (e.g. re-rendering
     after a pure visual/color fix). Re-running `transitions inject` on
     already-extended durations double-extends them — if timing changed at all,
     run `/thataipm-resync` first instead of skipping this step.
   - `--skip-gap-check` — only use once you've manually confirmed a flagged gap
     is a false positive (see below) and don't want to re-verify it on every
     re-run of an otherwise-unchanged frame.

3. **If the static-gap check fails**, this is CLAUDE.md's Visual Retention Rule 1
   (no static frame longer than 2s) — and per the 2026-08-13 tightening, the fix
   must be a genuinely NEW visual element (a new chip/tile/stat/icon), not just a
   breathing pulse on something already on screen. `npx hyperframes check` will
   NOT catch this class of bug on its own — it was specifically added because a
   real ~4.5s dead hold passed that check clean. Two things worth knowing before
   you "fix" a flagged gap:
   - **The tool has a known blind spot**: a position argument that isn't a plain
     number literal (a `forEach` loop variable, a relative `+=0.3`) can't be
     resolved statically and is excluded from coverage — the tool prints these
     as a separate warning rather than silently miscounting them. Read that list
     before assuming a flagged gap is real; a staggered-reveal loop (chapter
     tiles, list items) commonly triggers this false positive since its start
     times live in a variable, not a literal.
   - **The tool proves "not silent," not "genuinely new."** A pulse still shows
     up as a covering tween. If you're closing a gap, add a real new element and
     let the tool confirm coverage as a sanity check, not as design guidance.

4. **If `hyperframes check` fails**, fix the reported issue directly in the frame
   file (common real ones hit on this channel: a nested-positioned-ancestor
   coordinate bug, a GSAP array-target tween applying a property to the wrong
   element, an ancestor-opacity-diluted contrast failure — see
   `hyperframes/CLAUDE.md`'s durable pitfalls list) and re-run the pipeline.
   `data-layout-allow-overflow`/`data-layout-allow-overlap` are for genuinely
   intentional design choices only, not a way to silence a real bug.

5. **Review the volumedetect output** at the end — healthy range is roughly -18 to
   -22 dB mean, max under -1 dB. Anything silent or clipped means a `/thataipm-vo`
   line needs redoing.

6. **Hand off to `/thataipm-distribute`** once the render looks right.

## Non-goals

- Does not edit frame HTML, STORYBOARD.md, or resync timing — that's manual work
  or `/thataipm-resync`.
- Does not generate or touch VO audio — that's `/thataipm-vo`.
- Does not publish anywhere — that's `/thataipm-distribute`, gated on explicit
  confirmation.
- Does not judge whether a covering tween is a genuinely new visual vs. a
  re-pulsed existing element — that's a creative call the static-gap check
  can't make for you.
