# HyperFrames Composition Project

## Skills — USE THESE FIRST

**Always invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that are NOT in generic web docs. Skipping them produces broken compositions.

**Doing anything with HyperFrames?** Start at `/hyperframes` — it tells you what HyperFrames can do and which skill or workflow handles your intent (make a video, TTS / BGM, prep footage, author / animate, render, install blocks), confirms your brief up front (the intent layer), and routes every "make me a…" request (a video, a deck, a composition port) to the right workflow. Read it first, especially when there's no project context to orient you. The workflows it routes to:

- `/product-launch-video` — any **website** URL or brief / script → a product launch / SaaS / promo video, or a site tour / showcase featuring the site's own captured visuals.
- `/faceless-explainer` — arbitrary text (topic / article / notes), **no URL, no website capture** → 60-90s faceless explainer.
- `/embedded-captions` — an existing talking-head video (MP4) → the same footage with captions / subtitles added (rail + embed, or pure-cinematic embed); the footage itself is untouched.
- `/talking-head-recut` — an existing talking-head / interview / podcast video (MP4) → the same footage **packaged with designed graphic overlays** (kinetic titles, lower-thirds, data callouts, pull-quotes, side panels, pip) synced to the transcript; the clip plays unchanged underneath. (Plain captions/subtitles → `/embedded-captions`.)
- `/pr-to-video` — a GitHub PR (URL / `owner/repo#N` / "this PR") → 30-90s code-change explainer (changelog / feature reveal / fix / refactor).
- `/motion-graphics` — a short (typically under 10s) design-led **motion graphic**, motion-is-the-message, no narration: kinetic type, a stat / number count-up, a chart, a logo sting, a lower-third / overlay, or an animated tweet / headline / captured-page highlight; rendered to MP4 or a transparent overlay. Longer / narrated / custom → `/general-video`.
- `/music-to-video` — a **music track** (audio file, video to pull audio from, or one generated from a mood brief) → beat-synced video (lyric / slideshow / kinetic promo). Music drives pacing; user-supplied images / videos are cut onto the same beat grid.
- `/slideshow` — a **presentation / pitch deck / interactive deck** — discrete slides, fragment reveals, branching, hotspot navigation, presenter mode. Output is a navigable deck, not a rendered video.
- `/general-video` — fallback for any other video (title card, longer brand / sizzle reel, multi-scene montage, static loop, custom composition) and the home of **companion mode** — co-create with the full HyperFrames toolbox; the original hyperframes authoring flow, any length.

**Porting an existing composition?** `/remotion-to-hyperframes` translates a Remotion (React) composition into HyperFrames HTML — a source migration, separate from the creation workflows above.

The domain skills (`/hyperframes-core`, `/hyperframes-animation`, `/hyperframes-keyframes`, `/hyperframes-creative`, `/hyperframes-cli`, `/media-use`, `/hyperframes-registry`, `/figma`) and the full capability map live inside `/hyperframes` — it is the single source of truth for which skill handles which intent.

**Changing how real footage or images look or reveal?** Load `/media-use` and read its `references/media-treatments.md` before editing, even when the request only says dark, flat, boring, retro, private, or “make the reveal cooler.” It governs how footage is treated, never whether media may be used. Use canonical media treatments and seek-safe motion; do not improvise equivalent CSS/SVG filters or overlays.

> **Tailwind v4 projects** (`hyperframes init --tailwind`): see `/hyperframes-core` → `references/tailwind.md`.

> **Skill missing or stale?** Run `npx hyperframes skills update <name>` to install/refresh
> the specific skill you need (the `/hyperframes` router does this automatically before
> entering a workflow), or bare `npx hyperframes skills update` to refresh the core set plus
> everything already installed — neither pulls the full set. Restart the agent session so
> newly installed skills load.

## Commands

```bash
npm run dev          # start the preview server (long-running — keep it alive in background)
npm run check        # lint + runtime + layout + motion + contrast (one command)
npm run render       # render to MP4
npm run publish      # publish and get a shareable link
npx hyperframes lint --verbose  # include info-level findings
npx hyperframes lint --json     # machine-readable output for CI
npx hyperframes docs <topic> # reference docs in terminal
```

> **`npm run dev` is a long-running server, not a one-shot command.** It blocks until stopped.
> In Claude Code, always run it with `run_in_background: true`. Never run it as a foreground
> command — it will time out and the server will die, breaking the browser preview.

> **Pinned CLI version.** These scripts pin an exact `hyperframes@X.Y.Z` so this project re-renders identically over time. Weeks later that pin lags fixes shipped since. To move up: `npx hyperframes@latest upgrade --project . --check` (shows the delta), then `npx hyperframes@latest upgrade --project .` to rewrite the pins. Always unpinned — the pinned script re-runs the old version against itself.

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx hyperframes docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://hyperframes.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`
- `meta.json` — project metadata (id, name)
- `transcript.json` — whisper word-level transcript (if generated)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Warnings should be reviewed before rendering.

## Key Rules

1. Every timed element needs `data-start`, `data-duration`, and `data-track-index`
2. Elements with timing **MUST** have `class="clip"` — the framework uses this for visibility control
3. Timelines must be paused and registered on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
4. Videos use `muted` with a separate `<audio>` element for the audio track
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches

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
