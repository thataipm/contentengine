---
name: thataipm-registry-check
description: "Check HyperFrames' component registry (`hyperframes catalog`) and this channel's persistent schema-vocabulary log before hand-building any new visual device for an @thataipm episode -- a chart, transition, lower-third, kinetic-type effect, or any shot device. Use before writing frame compositions, or the moment a shot needs a device that doesn't already exist elsewhere in the current episode. Not for episode topic selection, script writing, or VO."
---

# thataipm-registry-check: check before you hand-build

## Why this exists

This channel's production history has hit the same mistake twice, hand-building a visual
device that already existed as a polished, pre-built HyperFrames registry block:

1. **First time** (`hyperframes-had-the-components-i-hand-built`, 2026-08-13): an entire
   episode's premise was discovering, mid-build, that terminal cards, a count-up number, and a
   scanning-light effect had all been hand-coded from scratch when HyperFrames' own registry
   (`hyperframes catalog`) already had 380 components covering the same ground, including all
   three. The lesson was written down in that episode's own `CLAUDE.md`.
2. **Second time** (`hyperframes-what-skills-matter`, 2026-08-14): the literal-word-icon visual
   system for this episode's 5 frames was built entirely from hand-drawn SVG + basic GSAP
   fade/scale tweens, without ever running `hyperframes catalog` first. A same-day audit found
   the registry already has `mk-callout-highlight` (word-by-word emphasis synced to a
   voiceover scalar — functionally the same device, just built by hand instead), plus
   `mk-progress-stat`, `data-chart`, and `bar-chart-race` for devices this channel's own
   schema-vocabulary notes had flagged as "never built" — they were never built because nobody
   checked the registry, not because they don't exist.

The written-down lesson from the first incident did not survive into practice on the second
build. This skill exists to make the check itself a mechanical step, not a habit that has to
survive being remembered session to session — and a skill that still has to be remembered to
*invoke* is only half the fix. `scripts/check_registry_usage.mjs` closes the other half: it's
wired directly into `/thataipm-assemble`'s pipeline as a hard, unskippable gate (step 4/8), so
this check runs on every single episode automatically, whether or not anyone remembers to run
this skill by name. It fails unless at least one registry block is actually installed, or the
episode has a real, structured entry in `docs/hyperframes_production_notes.md`'s log confirming
the registry was checked and genuinely nothing fit. See that file's "Custom devices built for
this channel" section for the exact log format the checker parses.

## When to use this

- Before writing ANY new frame composition's visual devices, at the shot-list stage — ideally
  right after `STORYBOARD.md`'s shot list is drafted, before any HTML/SVG/GSAP gets written.
- The moment a shot needs a device type not already used elsewhere in the current episode (a
  chart, a new transition, a lower-third, a kinetic-type effect, anything beyond reusing an
  already-checked pattern).
- Standing production order: `/thataipm-script-review` → `/thataipm-vo` →
  **`/thataipm-registry-check`** → (frame authoring) → `/thataipm-resync` (if VO changed after
  frames already exist) → `/thataipm-assemble` → `/thataipm-distribute`.

## Steps

1. **Run the real registry**, not memory of what it might contain:
   ```bash
   npx hyperframes@<pinned-version> catalog
   ```
   Filter by tag for a faster scan against a specific need, e.g.
   `npx hyperframes@<pinned-version> catalog --tag data` for chart/stat devices, or
   `--tag transition` for the 12 transition categories. Read `hyperframes-registry`'s own docs
   for the full `catalog`/`add` command surface if a filter isn't obviously matching.

2. **Check the persistent schema-vocabulary log** at `docs/hyperframes_production_notes.md`'s
   "Custom devices built for this channel" section — this is where every device this channel
   has already hand-built (and therefore already confirmed has no good registry match) gets
   logged, so the same gap doesn't get re-investigated from scratch every episode. This log
   lives in `docs/`, not inside any per-episode `hyperframes-<slug>/` folder, specifically so it
   survives that folder being archived after the episode ships — the same failure mode that
   buried the first incident's own written lesson.

3. **For each planned shot device, decide**:
   - A registry block already does this (even approximately) → install and wire it in via
     `hyperframes add <block-name>` (see the `hyperframes-registry` skill for the exact wiring
     steps) instead of hand-building it.
   - The schema-vocabulary log already confirms nothing fits → proceed to hand-build, no need
     to re-check the same gap twice.
   - Neither → this is a genuinely new, newly-confirmed gap. Hand-build it, then log it (step 4).

4. **Log new hand-built devices** in `docs/hyperframes_production_notes.md`'s schema-vocabulary
   section: device name, what it does, why no registry block covered it, which episode built
   it. This is what makes the check compound in value over time instead of resetting every
   episode.

## Non-goals

- Does not decide episode topics, write scripts, or generate VO.
- Does not replace `hyperframes-registry`'s own install/wiring instructions — read that skill
  for the mechanics of `hyperframes add` once a match is found here.
- Does not retroactively rebuild already-shipped episodes' hand-coded devices — this is a
  going-forward discipline, not a cleanup mandate (same "once published, don't re-edit"
  standing rule as everything else in this project).
