# HyperFrames production notes

Cross-episode lessons and standing defaults for the HyperFrames render engine. **Rescued
2026-08-14** from `hyperframes/CLAUDE.md` — that file lived inside `hyperframes-had-the-
components-i-hand-built`'s own working project folder (confusingly named `hyperframes/` instead
of following the `hyperframes-<slug>/` convention every other episode uses), which got archived
once that episode was confirmed published. This content is genuinely cross-episode, not specific
to that one build, so it moves here instead of disappearing with the archived folder. The rest
of that file (skills routing, npm commands, project structure, linting) was standard HyperFrames
scaffold boilerplate, reproducible via `npx hyperframes docs` or the `/hyperframes` skill router,
and wasn't preserved.

**Root `CLAUDE.md` points here** for this content going forward — see its top-of-file pointer.

## Orchestration discipline — dispatch cost lessons (2026-08-12)

The first real build in this project (`hyperframes-had-the-components-i-hand-built`) used ~43.7M
effective tokens for a single 48-second, 5-frame video. Traced back after the fact, most of the
avoidable cost came from orchestration choices, not the framework itself. Three rules going
forward, learned from what actually happened on that build:

1. **Stage all known-required shared assets before dispatching parallel frame-build workers.**
   `frame.md` already names every required font by role before a single worker is dispatched —
   don't let each of N parallel workers independently discover the same missing-asset gap and
   patch it differently (that build had 5 workers hit the same missing-font problem; 3 improvised
   substitute system fonts, 2 correctly sourced and staged the real files — which then needed a
   whole separate reconciliation pass to fix the inconsistency). Check `frame.md`'s font/asset
   requirements and stage them into `assets/` yourself, once, before dispatch.

2. **Reserve subagent dispatch for work that genuinely needs the full creative/technical
   context.** A frame build from its packet does — the worker needs the role contract, the
   blueprint, the motion rules, real creative judgment. A narrow fix to something already
   diagnosed by `check` (a specific CSS color value, an asset path pattern, a duration
   correction) does not — dispatching a fresh subagent for that means paying to re-read the
   ~19KB role file just to change one line. Edit those directly. On the first build, two
   dispatched "fix this contrast value" agents hit a rate limit before finishing, and the actual
   fixes (once done directly, by reading the flagged file and editing it) took a small fraction
   of the tokens and time the subagent route would have cost.

3. **One frame per worker is a real framework constraint, not an optimization target.**
   `subagent-dispatch.md` is explicit: no "continue run" hands multiple frames to one worker.
   Don't try to batch frame builds to save tokens — that's not where the waste was. The waste
   was in the fix/reconciliation rounds after the builds, which are NOT subject to that
   constraint and should default to direct edits.

## Standing visual defaults (2026-08-13, locked as the core system going forward)

**This project is now the standing production system for @thataipm** — not an experiment, the
default for every new episode. Two corrections apply to every future build, not just the first:

- **Caption band sits too low by default.** `captionBand()` in the framework's own
  `lib/dimensions.mjs` reserves the bottom 16.67% of the canvas purely from height — it has no
  concept of a specific platform's own UI chrome. On this project's 1080x1920 canvas that gives
  `--cap-band-top: 1600px`, but this channel's established Instagram safe zone (same constant as
  the Remotion pipeline's `SAFE_Y1`) reserves roughly the bottom 300px (~y=1650+) for IG's own
  overlay buttons — so the band's bottom edge, and the text centered in it, lands inside that
  reserved zone. **After every `captions.mjs build` run, raise `--cap-band-top` to ~1300px**
  (keeps the full band's bottom at/above y≈1620, clear of the platform chrome with margin) —
  check both the generated `compositions/captions.html` and, if it's ever regenerated, reapply.
- **Light theme (warm cream ground), colorful accents on top, is the standing palette —
  reversed from the dark-theme note this section originally shipped with, same day
  (2026-08-13).** Direct instruction after watching the dark-theme render: "if video looks
  good, use light theme, I don't mind the color preference, just make sure we make best
  retention holding sexy video" — the actual bar is retention/visual quality, not a specific
  palette, and light theme is the confirmed pick. Ground is `frame.md`'s `cream` (`#FAF9F5`),
  voice is `ink` (`#141413`), the multi-accent rotation stays (purple/green/orange/blue) but
  each accent is a DARKENED, light-ground-safe variant when used as text/stroke/border color
  (e.g. `#6952D6` not `#8C7CFF`) — the brighter un-darkened hue is still fine as a FILL with
  dark text on top (a CTA pill), since contrast there comes from the text, not the fill. The
  **code/terminal surface stays dark** (`navy` token) even on a light page — a real terminal
  is dark regardless of the surrounding theme, this is a deliberate exception, not an
  inconsistency. See `frame.md`'s `colors:` block for the full current token set and the
  reasoning comment above it. Don't default back to the dark-ground remix this note originally
  described — that was a same-day intermediate step, not the final call.

  **Note added 2026-08-14**: `hyperframes-what-skills-matter` (the first "Navigating the AI
  Era" pillar episode) shipped on a dark palette instead (`#101014` ground), per direct
  instruction for that specific episode's tone. This standing default is a per-episode starting
  point, not an unconditional rule — override it when the episode brief calls for a different
  palette, same as this note's own light-vs-dark reversal above shows the default itself has
  moved before.
- **Clean background, no grid texture, added 2026-08-13** (direct feedback: "instead of showing
  those boxes in background, have a clean background without grid"). Every frame's `.xxx-bg`
  ground had picked up a subtle 64px cross-hatch `linear-gradient` grid pattern during an
  earlier "make it look more finished" pass — read as visible "boxes" on a real render, not the
  intended subtle texture. Removed from all 5 frames; ground is now just the solid cream +
  ambient radial-gradient color glow, no grid lines. Don't reintroduce a grid pattern as a
  default "make it look more complete" move — if a shot genuinely feels empty, reach for a
  literal device (per the schema vocabulary) or the ambient glow, not a texture layer.

## Durable pitfall: `audio_meta.json` is not what renders — `index.html` is

Found 2026-08-13 chasing a bad SFX cue that survived a "fix": the cue's source (`STORYBOARD.md`)
and its derived data (`audio_meta.json`) were both correctly updated to the new SFX file, but
the render still played the OLD sound — because `index.html`'s own `<audio>` tags (assembled
from `audio_meta.json` by `assemble-index.mjs` at an earlier point) were never regenerated after
the fix, so they still pointed at the stale file with a stale duration (0.576s of a one-shot pop
had drifted to a hardcoded 7.778s left over from an earlier design, which is why the bad cue
read as a sustained background rhythm, not a short pop). **`index.html` is the file that
actually renders — a fix to `STORYBOARD.md` or `audio_meta.json` alone does NOT propagate
automatically.** After any SFX/duration/audio change, either re-run the assembly step
(`sync-durations` → `assemble-index.mjs` → `transitions.mjs inject/verify`) or, for a narrow
single-value fix already diagnosed, hand-verify the corresponding `<audio>` tag in `index.html`
directly — don't assume editing the source data was sufficient.

## Custom devices built for this channel (added 2026-08-14)

A running log of visual devices hand-built for an @thataipm episode specifically BECAUSE no
`hyperframes catalog` registry block covered the need — check this list before hand-building
something new, so an already-settled gap doesn't get re-investigated from scratch every
episode. Add an entry every time a genuine gap is confirmed (registry checked, nothing fit).
See `/thataipm-registry-check` for the standing process this log feeds.

**Why this exists**: this channel hand-built the same kind of thing the registry already had,
twice. First on `hyperframes-had-the-components-i-hand-built` (2026-08-13) — terminal cards, a
count-up number, and a scanning-light effect, all already in the registry as polished blocks,
discovered only after the fact. Second on `hyperframes-what-skills-matter` (2026-08-14) — a
full literal-word-icon system (pop-in-on-word-onset, dim-to-accumulate) hand-built from raw SVG
+ GSAP, without ever running `hyperframes catalog` first. A same-day audit found the registry
already has `mk-callout-highlight` (word-by-word emphasis driven by a single scalar, built to
sync with a voiceover) — functionally the same device, likely more polished, sitting unused.
The first incident's own written lesson did not survive into the second build, which is why
this log exists as a mechanical artifact instead of a memory to carry forward by habit.

### Log

Structured, machine-checked format — `check_registry_usage.mjs` (wired into
`/thataipm-assemble`'s pipeline) parses ONLY lines in this exact shape as a confirmed,
registry-checked entry. A slug mentioned elsewhere in this file (a narrative example, a
cautionary tale) does not count and will not pass the check — only a real logged line here
does. One line per confirmed gap:

```
- [YYYY-MM-DD] <episode-slug>: <device> — <why no registry block covers it>
```

**Entries — none logged yet.** Every device built in this channel's episodes so far was built
without first checking the registry, so none of them can honestly be logged here as a
*confirmed* gap — including `hyperframes-what-skills-matter`, cited above as the cautionary
example of skipping the check, which is the opposite of a confirmed entry. Run
`/thataipm-registry-check` before the next episode's frame authoring begins, and add a real
line here, in the exact format above, as gaps get genuinely confirmed going forward.

**Known registry blocks directly relevant to this channel's schema vocabulary** (from the
2026-08-14 audit, `npx hyperframes catalog`) — check these specifically before reaching for a
hand-built equivalent:
- `mk-callout-highlight` — word-by-word emphasis on a single scalar, built to sync with a
  voiceover. Matches this channel's literal-word-icon/caption-sync pattern directly.
- `mk-progress-stat`, `data-chart`, `bar-chart-race`, `mk-line-graph` — count-up stats, bar
  charts, line graphs. Covers the "gauge/donut" and count-up devices the old (pre-HyperFrames)
  schema vocabulary list called "never built" — they exist, they were just never checked.
- `flowchart` / `flowchart-vertical` — polished decision-tree/pipeline device with SVG
  connectors, an upgrade over any hand-rolled pipeline-build device from earlier episodes.
- 12 full transition categories (blur, dissolve, mechanical, radial, push, scale, distortion,
  light, grid, cover, destruction, 3D) — every episode so far has used exactly one
  (blur-crossfade). Worth varying per episode instead of defaulting to the same one.
- `halftone-field`, `cosmic-orb`, `vfx-anamorphic-flare` — shader/WebGL ambient backgrounds,
  richer than a blurred CSS radial-gradient glow.
- `split-flap-board`, `weight-wave` — mechanical/variable-font kinetic typography, alternatives
  to a plain fade+scale pop-in for a title or callout beat.

## Folder-structure convention (added 2026-08-14, why this file exists here and not in a project folder)

Every episode's working project should live at `hyperframes-<slug>/` at the repo root — never
bare `hyperframes/`, which reads as (and in practice became) "the engine's own folder" even
though HyperFrames itself is just an npm package (`npx hyperframes@<pinned-version> ...`), never
vendored into this repo. That exact collision — episode 1's working folder was left named
`hyperframes/` instead of `hyperframes-had-the-components-i-hand-built/` — is what buried this
file's genuinely cross-episode content inside a folder that looked disposable and got archived
along with the rest of that episode's source once it shipped. Any documentation meant to outlive
a single episode belongs in `docs/`, not inside a `hyperframes-<slug>/` project folder, so it
can't get swept up the same way again.

**Working-folder lifecycle**: once an episode's final video + cover are copied into
`episodes/<slug>/build/` and pushed, and every platform post is confirmed `published` (not just
`scheduled`) via the Zernio API, the raw `hyperframes-<slug>/` working folder (compositions, VO
takes, snapshots, caches) is archived to `_trash_insideaiagents/<date>_<reason>/` — never
deleted outright, same practice as `remotion/`. Don't archive before publish is confirmed, same
rule as the build-artifact untracking practice in the root `CLAUDE.md`.
