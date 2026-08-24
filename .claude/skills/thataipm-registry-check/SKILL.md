---
name: thataipm-registry-check
description: "HARD RULE (locked 2026-08-14, no exceptions; discovery method rewritten 2026-08-21): build every @thataipm visual device from the HyperFrames component registry (`hyperframes catalog`) by default -- a chart, transition, lower-third, kinetic-type effect, or any shot device. Discovery is a full-catalog read against the real script, not keyword guessing -- keyword search demonstrably misses real matches when the guessed vocabulary doesn't match the catalog's own wording. Bias toward using MORE distinct registry items across an episode, not the fewest that technically pass. Hand-building requires a real, logged, checked-and-confirmed full-catalog pass per frame; the mechanical gate now fails unless EVERY frame in the episode is individually accounted for, not just one somewhere. Use before writing frame compositions, or the moment a shot needs a device that doesn't already exist elsewhere in the current episode. Not for episode topic selection, script writing, or VO."
---

# thataipm-registry-check: build from the library, always — no exceptions

## Hard rule (locked 2026-08-14, direct instruction; discovery method rewritten 2026-08-21)

**Every visual device in every frame is built from an installed HyperFrames registry block or
component by default.** Hand-building is the exception, not a parallel option — it's only
permitted after a real full-catalog pass (see Step 1 below, not a few guessed keywords) confirms
no match, and every such exception gets logged per-frame in
`docs/hyperframes_production_notes.md`'s Log section. This is enforced mechanically (see
step 3.5 in `/thataipm-assemble` and the "Why this exists" section below) — the check now
requires **every frame in the episode** to be individually accounted for, not just proof that
the episode used a registry item somewhere. An episode that installs one registry block in
Frame 2 while silently hand-building the other four frames used to pass this gate; it no
longer does.

**Second standing bias, direct instruction 2026-08-21 ("use as many as you can please"): prefer
more distinct registry items across an episode over reusing the same one or two everywhere.**
When a beat could plausibly use either a device already picked for an earlier beat or a
different, unused registry item that also fits, pick the unused one — variety is a goal here,
not just "did every frame clear the bar." Reuse is still correct when the SAME literal concept
recurs (e.g. two percentage-gauge beats in one script genuinely both want `mk-usage-arc`) — the
bias is against defaulting to a familiar device out of habit when the catalog has something more
specific sitting unused.

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

**Third incident, and the reason discovery itself changed (`hyperframes-lead-gen-sales-agent`,
2026-08-21):** a real search happened this time, but it was 2-3 guessed keyword queries per
device — a real audit of this channel's whole history found only ~5% of the 373-item catalog has
ever actually been installed anywhere. A forced deeper pass (10+ varied, specific-language
queries) on the SAME episode found `mk-usage-arc`, `badge-pop`, and `native-notification-pop` —
all real, good-fit matches the shallow pass had missed entirely, because the guessed query
wording ("hand drawn sketch line art icon reveal") didn't match the catalog's own vocabulary for
those items. Keyword search has a structural failure mode: it can only surface what your guessed
words happen to hit. **The fix is to stop guessing words and just read the catalog** — Step 1
below.

## When to use this

- Before writing ANY new frame composition's visual devices, at the shot-list stage — ideally
  right after `STORYBOARD.md`'s shot list is drafted, before any HTML/SVG/GSAP gets written.
- The moment a shot needs a device type not already used elsewhere in the current episode (a
  chart, a new transition, a lower-third, a kinetic-type effect, anything beyond reusing an
  already-checked pattern).
- Standing production order: see `CLAUDE.md` §9 for the full chain — this skill runs at
  frame-authoring time, after `/thataipm-visual-plan` and `/thataipm-vo`, before
  `/thataipm-assemble`. (Fixed 2026-08-24: this line used to restate the full order and had
  drifted a full stage behind `CLAUDE.md` — it predated `/thataipm-visual-plan`'s addition
  and never got updated. Pointing here instead of restating means it can't drift again.)

## Steps

0. **Before picking devices, check what this channel has already leaned on too hard.**
   ```bash
   node .claude/skills/thataipm-registry-check/scripts/report_catalog_breadth.mjs --docs-root .
   ```
   Advisory, not a gate — prints every registry item's real use count across the whole
   channel history (currently ~12% of the 373-item catalog has ever been installed at all)
   and flags anything used 3+ times. Read it before step 1 so the variety bias below has a
   real number behind it, not just a feeling that "we've used this a lot."

1. **Read the real script, then read the WHOLE catalog — this is the primary discovery method,
   not a query.**
   ```bash
   cat hyperframes-<episode>/SCRIPT.md          # every beat, in order, real narration
   npx hyperframes@<pinned-version> catalog     # all ~373 items, one line each, no filter
   ```
   Read every line of the catalog dump against every beat of the script. This is the whole
   point of the 2026-08-21 rewrite: a keyword query can only surface what your guessed words
   happen to match, and this channel's own history shows that undershoots badly (see the third
   incident above). A full read can't miss a match on vocabulary — every item gets genuinely
   considered against every beat, once, per episode. For a normal 5-7 frame episode this is one
   command and one read, not a per-frame search loop.

   `npx hyperframes@<pinned-version> catalog --tag <tag>` narrows to a category (`data`,
   `transition`, etc.) when you already know the shape you need and just want to compare
   options within it — a filter on top of the full read, not a substitute for it.

   `node .claude/skills/thataipm-registry-check/scripts/suggest_registry_matches.mjs
   --project-dir hyperframes-<episode>` (keyword search against each frame's `STORYBOARD.md`
   `Scene:` line) still exists as a secondary tool — useful for a single new beat added
   mid-build when re-reading the full catalog isn't warranted, but not the default entry point
   anymore.

2. **While reading, actively note every plausible candidate per beat, not just the first hit** —
   this is what makes the "use as many distinct items as you can" bias (above) actually
   achievable. A beat with 2-3 real candidates is a chance to pick whichever one isn't already
   used elsewhere in this episode, not just whichever was noticed first.

3. **For each planned shot device, decide**:
   - A registry item from the full read already does this (even approximately) → install and
     wire it in via `hyperframes add <item-name>` (see the `hyperframes-registry` skill for the
     exact wiring steps) instead of hand-building it. Prefer the unused-elsewhere-in-this-
     episode candidate when more than one fits (see the variety bias above).
   - Nothing in the full catalog read fits → check `docs/hyperframes_production_notes.md`'s
     "Custom devices built for this channel" section for this same gap already confirmed by a
     past episode, so it isn't re-investigated from scratch. Still nothing → this is a
     genuinely new, newly-confirmed gap. Hand-build it, then log it (step 5).

4. **Before wiring a CHOSEN registry item, scan `docs/hyperframes_production_notes.md`'s
   durable-pitfall entries for that item's name.** This is the log's other job — not discovery,
   landmine-avoidance for a device already picked. Several real bugs this channel has shipped
   (a host `data-composition-id` mismatched from the file's own internal id breaking `cqw`
   sizing, reusing one file for two mounts without forking it, positioning classes placed
   directly on a sub-composition host not surviving the mount) were all avoidable by checking
   this log before wiring, not after `/watch` caught the broken render.

5. **Log EVERY frame's decision** in `docs/hyperframes_production_notes.md`'s schema-vocabulary
   Log section — not just the hand-built ones. Format:
   ```
   - [YYYY-MM-DD] <episode-slug>: Frame 1 registry(`item-name`); Frame 2 hand-built(<device>) — <why>; Frame 3 registry(`item-name`); ...
   ```
   `registry(...)` for a frame using an installed catalog item, `hand-built(...) — <why>` for a
   frame with a real, confirmed gap. The mechanical gate (`check_registry_usage.mjs`) parses
   this section for every "Frame N" mention under this episode's slug and fails, naming the
   exact missing numbers, if any frame from 1 to the episode's total isn't covered. This is
   what makes the check a true hard rule instead of a one-time pass — and what makes the log
   compound in value over time instead of resetting every episode. The same script also warns
   (not fails) when one registry item covers 3 or more frames — a nudge toward the variety
   bias, not a hard gate, since a genuine repeat (the same literal concept recurring) is fine.

## Non-goals

- Does not decide episode topics, write scripts, or generate VO.
- Does not replace `hyperframes-registry`'s own install/wiring instructions — read that skill
  for the mechanics of `hyperframes add` once a match is found here.
- Does not retroactively rebuild already-shipped episodes' hand-coded devices — this is a
  going-forward discipline, not a cleanup mandate (same "once published, don't re-edit"
  standing rule as everything else in this project).
