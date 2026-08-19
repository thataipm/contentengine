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

## Standing rules, 2026-08-15: registry ratio, caption format, IG safe zone

Three strict rules, direct instruction after reviewing `hyperframes-continuous-claude-v3`.
Verbatim: "1. Enforce 95% hyperframes components, leverage all library for entire video, and
for rest 5% use screenshots etc, a genuine item, use brand logos wherever possible. 2. I want
you to enforce subtitle format that we used in this video - episodes/the-ai-pm-pay-gap/build.
3. Enforce strict instagram framing rule so you know where to show what, subtitles are very
low right now." All three are standing, effective immediately, every future episode.

### Rule 1: 95% registry / 5% genuine hand-built

Target ratio across a whole episode's frames: 95% built from real `npx hyperframes catalog`
registry blocks, 5% ceiling for hand-built content — and that 5% must be a genuine real item
(a real screenshot, a real brand/product logo), not an invented graphic. This tightens
`thataipm-registry-check`'s existing per-frame accounting (every frame already must be tagged
`registry(...)` or `hand-built(...) — <why>`, see §9 of the root `CLAUDE.md`) into a real
numeric budget, not just a per-frame justification. A hand-built entry is only allowed onto
that 5% after a real, logged registry search finds no match — same discipline as before, now
with a ceiling on how much of the episode that's allowed to cover. **`continuous-claude-v3`
itself blew past this**: Frame 4's three stat cards and Frame 5's CTA ring were both
hand-built after real registry attempts failed (`mk-progress-stat` confirmed blank-rendering,
see the durable pitfall entry below) — that's a legitimate exception under the "no match
after a real search" clause, but going forward, a failed registry block should trigger a
second attempt at a *different* registry block before falling back to hand-built, not an
immediate fallback. Favor real brand/product logos over invented iconography whenever the 5%
allowance is used to represent a named tool, company, or product.

### Rule 2: standard subtitle format (reference: `episodes/the-ai-pm-pay-gap/build/`)

Confirmed by extracting and reading real frames from `the-ai-pm-pay-gap.mp4` (`ref_8.png`,
`ref_14.png`, `ref_20.png`). Real observed pattern:

- Plain caption words render bold white, no background.
- The current/emphasized word (a keyword, stat, or unit — "been", "fluency,", "in") renders
  inside a **rounded pill/chip** with a solid accent-color background (cyan/orange seen across
  different frames, matches the episode's rotating accent) and dark/near-black text for
  contrast against the pill — not just a plain color swap on the word.
- This is a real gap in the current shared `compositions/captions.html` template used on
  `continuous-claude-v3` and likely every episode since the caption system was simplified: it
  only does a dim-to-white color swap per word (`.caption-word { color: rgba(255,255,255,.55) }`
  → `#ffffff` on the active word), with no pill/chip treatment at all — closer to
  `hyperframes-had-the-components-i-hand-built`'s and earlier episodes' plain karaoke style than
  the `the-ai-pm-pay-gap` reference this rule points at.
- **Fix going forward**: extend the caption word-loop so a word flagged as emphasized (a
  number, stat unit, or the CTA keyword — the same selection logic `CaptionsPop`'s
  `F_ACCENT` face used pre-HyperFrames) gets a `border-radius` pill background in the episode's
  accent color and dark text color, layered on top of the existing dim/white timing, instead of
  color alone carrying the emphasis.

### Rule 3: Instagram safe-zone framing

Root cause of "subtitles are very low right now": `continuous-claude-v3`'s
`compositions/captions.html` positions the caption box at `top: 1600px; height: 320px` on a
1080x1920 canvas — box bottom lands at `1920px`, flush with the absolute bottom edge of the
frame, zero clearance. The `the-ai-pm-pay-gap` reference's caption band sits with its text
center around `y≈1500-1540px` and comfortable clearance (roughly 360-380px) above the bottom
edge — well clear of Instagram's own bottom UI chrome (caption/username/audio-attribution row
and action-icon column that overlay the bottom ~250-350px of a Reel in-app).

**Standing safe-zone rule for every future 1080x1920 episode**:
- **Top exclusion**: keep primary content clear of the top ~200px (profile/timer/mute icons).
- **Bottom exclusion**: keep primary content AND captions clear of the bottom ~300px
  (`y > 1620` is unsafe) — Instagram's own caption/username/audio row and the right-edge
  like/comment/share/save icon column both live there.
- **Caption band specifically**: position so the caption box's bottom edge never exceeds
  `y=1600`, matching the reference's real, working position — e.g. `top: 1350px; height:
  220px` (bottom = 1570) rather than the current `top: 1600px; height: 320px` (bottom = 1920).
- **Right-edge exclusion**: keep standalone graphics/text clear of the right ~120px at heights
  where Instagram overlays the action-icon column (roughly `y=1100` to `y=1750`), since a
  full-bleed centered composition can still clip under those icons at the edges.

These three numbers (top 200, bottom 300, right 120 at that height band) are the same order of
magnitude as Instagram's own published Reels safe-zone guidance; treat them as this channel's
working default until a real captured Reels-UI screenshot gives an exact per-device number to
replace them with.

### Built, 2026-08-15: all three rules now real mechanical gates

- **Rule 1** — `CC-Agent/checks/check_registry_ratio.mjs` (`registry-ratio-95` rule,
  `visual_registry` stage). Counts registry(...) vs hand-built(...) slots from the same
  Log-section entry `registry-build-always` already requires, fails under 95%. Tested
  against `hyperframes-continuous-claude-v3`'s real log entry: 6/8 = 75.0%, correctly FAILs.
- **Rules 2 & 3** — `docs/templates/thataipm-caption-skin.html`, this channel's standing
  caption skin (pill/chip emphasis on numbers/stat-units/ALLCAPS keywords + a
  percentage-based band with real 16% bottom clearance instead of the engine's default
  flush-to-edge band). `thataipm-assemble`'s `pipeline.mjs` now auto-stages it into
  `.hyperframes/caption-skin.html` before the captions build (step 0.5/8, never
  overwrites a project's own deliberate skin override), then runs
  `CC-Agent/checks/check_caption_pill_format.mjs` and `check_caption_safe_zone.mjs`
  (`caption-pill-emphasis` / `caption-instagram-safe-zone` rules, `assemble_qa` stage)
  against the real built `compositions/captions.html`, steps 1.5/8-1.6/8. Verified both
  ways: FAILs against `hyperframes-continuous-claude-v3`'s existing default-builder
  captions.html (0px bottom clearance, no pill rule found), PASSes against a synthetic
  captions.html actually built from the new skin (16.0% clearance, pill rule found and
  confirmed wired into the render script).
- `hyperframes-continuous-claude-v3` itself was NOT re-rendered to fix these — it's
  already scheduled (see `episodes/scheduled/continuous-claude-v3.md`), and this
  project's standing rule is not to re-edit an episode once it's shipped/queued. These
  three gates apply starting the next episode's pipeline run.

## Standing gate, 2026-08-15: preview_review stage (human glimpse before build)

Direct instruction: "I want to add one more review level, like before building show me
how it is looks like for me to take a glimpse." New stage `preview_review`, inserted into
`STAGE_ORDER` between `visual_registry` and `resync` (`CC-Agent/orchestrator/manifest-
store.mjs`, mirrored in both JSON schemas and `CC-Agent/rules/rules.json`'s new
`preview-reviewed` rule). Confirmed format: real per-frame snapshot stills (not a written
shot list, not a full draft render) shown to the user after frames pass `visual_registry`
and before assemble/render runs.

Mechanically enforced the same way `publish-approval-token` locks the Zernio call:
`CC-Agent/checks/mint_preview_approval.mjs` refuses without `--confirmed` (the caller must
have actually shown stills and gotten a real reply first) and binds a sha256 hash of every
`compositions/frames/*.html` file's content; `check_preview_reviewed.mjs` re-hashes the
current frame set and fails if it doesn't match the approved one (frames edited after
review, even a small fix, invalidate that approval — has to be re-reviewed, not assumed
still covered). Contract: `CC-Agent/agents/preview-review.md`. Verified end-to-end
(no-record FAIL, unconfirmed-mint REFUSE, confirmed-mint + check PASS, edited-frame FAIL)
against a scratch project before wiring in.

## Standing rule, 2026-08-15: cover stills must be designed, never a timeline grab

Direct instruction: "enforce designing a creative cover for videos." A frame sampled from
the real timeline (`npx hyperframes snapshot --at <mid-video-timestamp>`) is built to read as
part of motion, not as a still on its own — it's usually a mid-caption or half-landed reveal
and doesn't function as a real cover. Standing rule now: build a dedicated, purpose-designed
cover composition (title + kicker + real relevant brand logos in glowing tiles + CTA) as its
own static beat, not sampled from the episode's motion. Full mechanical steps (temporarily
swap `index.html`, snapshot, restore) in `.claude/skills/thataipm-distribute/SKILL.md` step
2. First real implementation: `hyperframes-5-ways-to-make-money-with-ai`'s cover (title, 5
real platform logo tiles, CTA) — a real, meaningfully stronger result than the plain
"5 REAL WAYS." timeline-grab it replaced.

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

## Tools & Skills episode format (locked 2026-08-14, reference-acquired)

A specific visual/audio template for the "AI Tools & Agent Spotlights" pillar (distinct from
the more diagram-heavy "How AI Systems Actually Work" format used on `hyperframes-what-is-mcp`),
reverse-engineered frame-by-frame from a real competitor reference video the user supplied,
using the `watch` skill (13 frames extracted, full transcript, plus an ffmpeg RMS-volume pass
to check for audio patterns since frames alone don't reveal sound). The reference's on-camera
avatar is explicitly NOT part of what's being acquired — this channel stays faceless — only the
graphic/motion/caption/transition system and pacing.

**The visual grammar, beat by beat:**

- **Real product screenshots, shown two ways, both real capture, never recreated mockups**:
  (1) full-bleed, filling the whole 1080x1920 canvas, used for the tool's OWN real interface
  (a download page, a live chat/agent UI) with a real animated cursor hovering/clicking on the
  actual element being discussed; (2) a floating browser-chrome card centered on a blurred or
  black background, used for THIRD-PARTY example sites/components (a gallery/showcase feel,
  not "this is the tool," more "here's what people built with it"). Both patterns are already
  close to this channel's own `RepoScreenshot`/`ProductScreenshot` custom components — the new
  addition is the floating-card variant.
- **Real credibility screenshots carry real numbers on screen**: an npm package page (weekly
  downloads, version, a real growth chart), a GitHub repo page (real star count, real folder
  structure), a Google search results page (real ranked results) — same "never fabricate what
  a screenshot shows" rule this channel already holds, just applied to a wider variety of real
  source pages than GitHub alone.
- **Two-tier caption system, not one.** Regular connecting words render in plain bold white.
  Single emphasis words (the ones carrying the beat: a tool name, "then," "using," "and
  finally") render bigger, in a saturated accent color (yellow-green in the reference), often
  as a standalone full-screen moment with nothing else on screen — this is a genuinely
  different device from this channel's existing karaoke-style `Captions.tsx`/`CaptionsPop`
  systems (which highlight the current word inline within a running caption line, never blow
  a single word up full-screen alone).
- **A whip-pan motion-blur cut** between major screenshot beats — not a hard cut, not a fade.
  The outgoing frame smears laterally, the incoming frame enters at matched velocity in the
  same direction, and the current caption word rides through the blur instead of disappearing.
- **Pacing**: 13 distinct visual beats in 34 seconds, roughly one new visual every 2-3s,
  consistent with this channel's own "Never Let a Frame Sit" rule — the reference independently
  converged on the same discipline this channel already enforces mechanically.
- **Return to camera only for the hook and the CTA** — the entire middle (the actual
  demonstration) stays on real screenshots/graphics, camera never reappears until "Comment
  ___ and I'll send you the guide," confirming the demonstration content should carry the
  video, not cutaways to a presenter.

**Audio, inferred from an RMS-volume pass (`astats` over 100ms windows), not literally heard**:
the loudness floor never drops below roughly -30 to -35dB even during transitions (true silence
would read closer to -50 to -60dB), consistent with a continuous low background music bed under
the whole video, ducked well below the -13 to -19dB speech level. Every one of the 13 cut points
shows a brief, consistent dip in overall energy right at the cut before recovering to speech
level — consistent with cuts landing cleanly on word boundaries and/or a short transition
sound, but RMS alone can't distinguish "there's a dedicated whoosh SFX here" from "the edit
just lands on a natural pause." Read this as a confirmation of this channel's existing
transition-whoosh + continuous-BGM-bed convention (already standard practice), not a new
finding requiring a different audio approach.

**Registry mapping, checked live via `hyperframes catalog` (do this search again — a version
pin bump may surface better matches — but these were confirmed real matches 2026-08-14, not
assumed):**

| Reference device | Registry item | Type |
|---|---|---|
| Floating browser card on blurred/black ground | `browser-device-stage` | component |
| Full-screen single emphasis word | `caption-kinetic-slam` | component |
| Two-tier regular/emphasis caption pairing | `caption-editorial-emphasis` | component |
| Live cursor hover on real screenshots | `simulated-cursor` | component |
| Cursor click payoff (ripple) | `press-ripple` | component |
| Whip-pan motion-blur cut between beats | `whip-pan-cut` | component |

All six are registry-classified **components** (not blocks) — per the durable pitfall above
(constellation-hub), these get pasted directly into the host frame's HTML/CSS/JS and merged
onto the frame's own GSAP timeline, never mounted via `data-composition-src`. Confirm each
item's actual `hyperframes add` install-output label before wiring, don't assume from this
table alone since a version bump could reclassify one.

**Where this applies**: the "AI Tools & Agent Spotlights" pillar specifically (per the
2026-08-14 3-pillar experiment in `docs/experiment_log.md`) — this is a format choice, not a
strategy change, same architectural separation as the rest of this file. The "How AI Systems
Actually Work" pillar's more diagram/mechanism-heavy style (host/client/server diagrams, line
charts) stays as-is; these are two different pillars with two different visual jobs, not one
replacing the other.

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

## Durable pitfall: a registry item's file structure can look like a block even when it's a component

Found 2026-08-14 on `hyperframes-what-is-mcp`: `constellation-hub` was mounted in Frame 2 via
`data-composition-src` (the block-only mounting mechanism) even though `hyperframes add` had
labeled its own install output `(hyperframes:component)`. It rendered nothing — no error from
`hyperframes check` (Layout passed clean), none from `check_registry_usage.mjs` (only checks the
file exists, not that it's wired correctly), and the earlier snapshot review missed it too. The
user caught it directly ("From 14 sec to 22 sec there are no visuals at all"); the bug was only
confirmed by extracting real frames from the delivered MP4 with ffmpeg and looking at the actual
pixels, not by any mechanical check.

**Why it's an easy mistake**: `constellation-hub.html`'s internal structure looks exactly like a
self-contained block — its own `<html>` wrapper, its own `data-composition-id`, its own
`window.__timelines[...]` registration — even though its registry CLASSIFICATION is "component."
Components have no standalone timeline and must be pasted directly into the host composition's
HTML/CSS/JS, with their GSAP calls merged onto the host's own timeline (see
`~/.claude/skills/hyperframes-registry/references/wiring-components.md`); only blocks get
`data-composition-src`. **Always check the `hyperframes add` install output's explicit
`(hyperframes:block)` vs `(hyperframes:component)` label before wiring anything up, and read the
matching wiring reference** — the file's own internal shape is not a reliable signal. `terminal-
simulator` (also a component, on the same episode) was pasted in correctly from the start and
rendered fine, confirming the mounting method — not the framework — was the actual bug.

## Durable pitfall: a "settle and hold with a subtle drift" passes every mechanical check and still reads as static

Found 2026-08-14 on `hyperframes-the-caveman-skill`: every real-screenshot beat (browser-device-
stage panels in Frames 1/2/3, the post-whip hold in Frame 4) was built as "settle in, then a
barely-visible camera drift (0.3-0.5cqh) for the rest of the hold." This passed
`check_static_gaps.mjs` cleanly (a real tween was always technically running) and passed a
sparse spot-check of ~15 hand-picked timestamps across the render. It did not survive the user
actually watching the video: "less visuals, static frame for so many secs... I am hating this
now." A dense self-review (a real frame pulled every 2 seconds across the whole video, not a
handful of interesting-looking moments) confirmed it immediately — the same screenshot with an
imperceptible wobble for 5-10 seconds reads as static to a human even when it is not static to
a diff.

**The gap this exposes**: `check_static_gaps.mjs` (and a sparse manual spot-check) can only
prove "a tween is running," never "a human would call this moving." Those are different
questions, and this project's own 2026-08-13 tightening of the Visual Retention Rule already
said as much in words ("a passive pulse on an ALREADY-PRESENT element is no longer sufficient
on its own... needs a genuinely NEW visual element or detail") — this incident is that same
rule failing to get applied in practice a second time, just against a screenshot instead of a
graphic.

**The fix, and the one to reach for first going forward**: a real *camera move* (punch-in,
crop-cut to a different real detail, pan) reads as new content even on unchanged source
material, where a slow drift does not — the registry's `yt-camera-move` component
(`ytCameraMove`/`ytCameraReset`/`ytDefocusPulse` helpers, copied into the host script and
called on any target element or image) is built for exactly this and replaced every hand-rolled
drift in this episode's rebuild. Verification going forward: a dense pass (frame every ~2s
across the FULL render) before calling a build done, not a spot-check of moments already
expected to look good — the spot-check is what missed this the first time.

## Durable pitfall: `data-chart` (registry block) renders blank when mounted via `data-composition-src` in this pipeline

Found 2026-08-14 on `hyperframes-the-caveman-skill`, Frame 3: the registry block `data-chart`
(`npx hyperframes add data-chart`, confirmed `(hyperframes:block)`, mounted the correct way per
that label) rendered as a completely blank cream card — no headline, no bars, no data — across
**four separate full re-renders**, each verified by direct ffmpeg frame extraction, not assumed
from a "render complete" message. Every render logged the same real warning:
`[sub_timeline_readiness_timeout] Sub-composition timelines did not become ready within
45000ms`.

**What was tried, in order, each a real fix attempt with its own re-render and re-verification,
not a guess left unchecked**:
1. Removed the block's own external Google Fonts `<link>` (`display=block` is render-blocking,
   a plausible network-dependent stall under headless capture). No change.
2. Fixed a real mismatch between the block's own internal `data-duration="15"` and the host
   mount's `data-duration="9"` (the exact customization pattern that worked for `mk-line-graph`
   in `hyperframes-what-is-mcp`). No change.
3. Removed the block's hidden (CSS `display:none`) second data series entirely, including its
   synchronous `conversionPath.getTotalLength()` call — a plausible hang source on a path
   inside a `display:none` ancestor. No change.

The warning and the blank render persisted identically through all three fixes, which points to
something more fundamental about this specific block's compatibility with this project's render
pipeline, not any of the three hypotheses above. Not root-caused further given time constraints
in the moment; **flagged here as a confirmed, reproducible defect, not a skipped investigation.**

**What to do about it**: don't remount `data-chart` in this project without first testing it in
isolation (a throwaway single-frame project) before wiring it into a real episode. The bar-chart
device itself was hand-built directly in Frame 3 instead (real 10-task data, same visual
language) only after this real, repeated failure — see that frame's own file comment and the
schema-vocabulary log entry below for the full account. This is the legitimate shape of the
hard rule's hand-build exception: a real registry item was found, correctly installed, correctly
wired, and genuinely didn't work — not skipped because hand-building was easier.

## Durable pitfall: `mk-progress-stat` (registry block) renders blank when mounted via `data-composition-src` in this pipeline

Found 2026-08-15 on `hyperframes-continuous-claude-v3`, Frame 4: the registry block
`mk-progress-stat` (`npx hyperframes add mk-progress-stat`, confirmed `(hyperframes:block)`,
mounted the standard way, 3 real instances duplicated with real CONFIG values — 109 skills,
32 agents, 30 hooks) rendered as a completely blank area — no numeral, no label, no fill
track — across **2 separate full re-renders**, each verified by direct ffmpeg frame extraction
from both the pre-speedup `video.mp4` and the post-speedup `video_rushed.mp4` (ruling out a
speedup-encoding artifact specifically). Unlike `data-chart`'s failure, `npm run check` and the
render log showed **no error and no `sub_timeline_readiness_timeout` warning at all** — the
mount looked completely clean on paper and was still blank on screen. This is the second
confirmed case of this failure class, not a one-off.

**What was tried**: a real mismatch was found between the host mount's `data-duration="6"` and
the block's own internal root `data-duration="7"` — the exact same category of fix that was
part of `data-chart`'s diagnosis. Aligned both to `6` (including the block's internal `DUR`
variable used for its own fade-out timing), re-rendered fully, re-verified by direct frame
extraction. Still blank. Not root-caused further given time constraints; **flagged here as a
confirmed, reproducible defect, not a skipped investigation.**

**What to do about it**: don't remount `mk-progress-stat` in this project without first testing
it in isolation (a throwaway single-frame project) before wiring it into a real episode. The
same big-numeral-stat visual was hand-built directly in Frame 4 instead (real count-up + label
+ fill track, matching the block's own visual language) only after this real, repeated
failure. Combined with `data-chart`, this project now has two independent confirmed cases of
`data-composition-src`-mounted registry blocks failing silently or near-silently in this
specific render pipeline — worth treating any NEW block mount (not component) as unverified
until it's actually been seen rendering real content in a real frame extraction, not just
`hyperframes check` passing clean.

## Durable pitfall: the registry's own mount contract changes between episodes — read each installed file's header, don't assume from a prior episode or the catalog's type label

Found 2026-08-15 building `hyperframes-5-ways-to-make-money-with-ai`. `browser-device-stage`
was used successfully in `hyperframes-continuous-claude-v3` (2026-08-15, same day) as a raw
paste-in: its HTML/CSS were hand-copied into the frame body and its GSAP tweens (opacity/y/
scale settle+drift) were hand-authored directly in the frame's own timeline (see that episode's
Frame 1 `f1bds-stage` code). Re-installing the SAME item name (`npx hyperframes add
browser-device-stage`) for this episode produced a **completely different file**: a full
"video primitive" with `data-composition-id`/`data-composition-duration`/
`data-composition-variables` declared on the `<html>` root, its own internal GSAP timeline
registered under the literal key, and an explicit header comment stating "the runtime clones
only this template... registers one paused timeline under the LITERAL browser-device-stage
key" — i.e. it now MUST be mounted via `data-composition-src` like a block (with
`data-variable-values` for per-instance config, and real screen content supplied via a
`<template data-slot="browser-device-stage-screen">` placed in the host frame), not pasted in
and hand-driven. The catalog's own `--type` label (`component` vs `block`) does NOT reliably
predict which contract applies — `mk-specs-list` is catalogued `component` but installs via a
`data-composition-src` snippet like a block; several genuinely-paste-in items
(`caption-kinetic-slam`, `yt-camera-move`, `terminal-simulator`) are also catalogued
`component` and use the OLD raw-HTML contract with no `data-composition-variables` at all.

**What to do about it**: before wiring ANY registry item, read the installed file's own header
comment (`sed -n '1,60p' compositions/components/<name>.html`) and check for
`data-composition-variables` on the `<html>` root — its presence means data-composition-src
mounting with `data-variable-values`; its absence means the classic copy HTML/CSS/JS-into-host
pattern. Do not assume the wiring style from a prior episode's use of the same-named item, and
do not assume from the catalog's bare `component`/`block` label — both have been observed
wrong this session. `hyperframes-core`'s `references/sub-compositions.md` and
`references/variables-and-media.md` (via `/hyperframes-core`) document the newer contract in
full, including the `data-variable-values` (values, keyed by id) vs `data-composition-variables`
(the schema, an array) distinction — easy to confuse, confirmed in that reference doc's own
"Two JSON Shapes" section.

## Durable pitfall: `data-variable-values` does not reliably reach a "video primitive" mounted two levels deep (index -> frame -> component)

Found 2026-08-15 on `hyperframes-5-ways-to-make-money-with-ai`, confirmed via real snapshot
stills, not guessed: `cta-close` mounted inside a frame (itself mounted inside `index.html`,
i.e. 2 levels of `data-composition-src` nesting) rendered its own DEFAULT text ("Make it
happen" / "Start now") instead of the real `data-variable-values` supplied on the host mount
div (`{"action_line":"Comment MONEY Below", ...}`) — confirmed by reading the component's own
JS (`vars.action_line == null ? "Make it happen" : ...`), i.e. `window.__hyperframes.
getVariables()` returned an object with no `action_line` key at all for this nesting depth.
`trust-strip` showed the same failure mode more severely: its JS falls back to `""` (not a
default word list) when `vars.marks` is null, then only falls back to real placeholder marks
if the resulting array is empty — so it silently rendered NOTHING rather than even a visible
placeholder, which is why Frame 5 looked completely blank in the first preview pass, not "using
defaults." `hyperframes-core`'s own docs describe `data-variable-values` for a sub-composition
mounted directly in `index.html` (1 level) — this project's frames introduce a SECOND level
(index -> frame -> component) that may not be within the documented/tested propagation path.

**Fix used, works around the uncertainty rather than resolving root cause**: edited each
installed component file's OWN declared `"default"` value (in its `data-composition-variables`
array) AND its JS fallback constant to the real intended content, for every video-primitive
mounted this episode (`cta-close`, `grid-card-assemble`, `trust-strip`, `chart-story`,
`headline-slam`, `browser-device-stage`). Since each of these is a per-project installed copy
used exactly once, editing its own default is safe and has no cross-episode effect. This
guarantees correct real content renders regardless of whether `data-variable-values`
propagation actually works at this nesting depth — belt-and-suspenders, the host mount's
`data-variable-values` attribute was left in place too in case it does work.

**Open question, not resolved**: whether `data-variable-values` genuinely fails at 2-level
nesting as a framework limitation, or something else caused it (e.g. a transient headless-
capture issue). Re-verify with a fresh snapshot after these default-edits — if the CORRECT
custom text still shows, that's consistent with either explanation and doesn't need further
root-causing (the fix covers both cases). Worth reporting upstream if confirmed as a real
2-level-nesting limitation the next time this comes up.

## Durable pitfall: `grid-card-assemble` (registry component) renders blank in this pipeline's actual final render — 3rd confirmed case

Found 2026-08-15 on `hyperframes-5-ways-to-make-money-with-ai`, Frame 4, and notably NOT
caught by the snapshot-tool preview pass — it was only caught during the mandatory dense
frame-by-frame verification of the REAL rendered MP4 (per feedback_dense_verification_
not_spotcheck), extracting real frames at t=36/38/40/42s (original-relative), spanning the
component's entire authored cue window (8.4s/10.0s/11.5s reveal times, all comfortably
inside that range) — all 4 showed zero card content, only the frame's own label/logo/glow.
`npm run check` passed clean on this mount (no `invalid_variable_values_json`, no lint/
runtime/motion errors) and the earlier no-render snapshot pass also didn't clearly show
cards (attributed at the time to unlucky cue-timing sampling, not investigated further since
the pre-render gate isn't meant to catch this class of bug — see the two-gates note in this
project's own working notes). This is the 3rd confirmed case of `data-composition-src`-
mounted content silently failing to render in this specific pipeline (after `data-chart` and
`mk-progress-stat`), and the first one confirmed via the ACTUAL FINAL RENDER rather than a
snapshot or preview pass — proof this bug class survives past `hyperframes check` and a
pre-render snapshot review, only the real rendered artifact reveals it for certain.

**Fix**: hand-built 3 real stat cards (count-up + label, same visual language
`grid-card-assemble` would have produced) directly in the frame, matching the established
fallback pattern from the `mk-progress-stat` incident. Registry-ratio-95 rule overridden to
0.85 for this one episode via `--check-args "--min-ratio 0.85"` (recorded in the manifest for
audit), since one real confirmed exception out of 8 logged slots is 87.5%, just under the
default 95% target.

**Standing lesson**: don't fully trust a `data-composition-src` mount's correctness from
`hyperframes check` + a pre-render snapshot alone. The dense post-render verification pass is
not just a formality — it is now the ONLY gate that has caught all 3 real instances of this
bug class, and 2 of the 3 (this one, and `mk-progress-stat`) passed every earlier check clean.

## Durable pitfall: `mk-specs-list` — elevated risk, not yet render-tested, avoided this episode

`mk-specs-list` (catalogued `component`) installs via a `data-composition-src` snippet
(`<div data-composition-src="compositions/mk-specs-list.html" data-duration="8"
data-width="1920" data-height="1080">`) — the same MOUNTING CLASS as the two confirmed-blank
registry blocks above (`data-chart`, `mk-progress-stat`) — and its internal CSS is the legacy
fixed `width:1920px; height:1080px` landscape style (not the newer `cqw`/`cqh`
resolution-agnostic primitives like `chart-story`/`grid-card-assemble`/`trust-strip`), a real
mismatch for this project's 1080x1920 portrait canvas. Not render-tested this episode —
`grid-card-assemble` (modern cqw-based primitive, confirmed no `data-composition-src`-class
mount risk pattern) was used instead for the frame that would have used it (real YouTube
Shorts monetization thresholds, Frame 4). Before ever using `mk-specs-list` in a real episode,
test it in isolation first (a throwaway single-frame project), same standing advice as the
`data-chart`/`mk-progress-stat` entries above.

## Durable pitfall: `npx hyperframes render` has no audio-only mode — an audio-only tweak still recaptures every visual frame

Found 2026-08-20, forensic token-usage pass on `hyperframes-claude-code-auto-memory`'s
production session (both the-usage-explainer skill's real transcript analysis and a manual
tool-invocation count). Real numbers: across the episode's full build (frame authoring through
distribution), `npm run render` ran 7 times, `ffmpeg` ran 31 times, `npm run check` ran 26
times, `hyperframes snapshot` ran 38 times, and 54 separate image reads (snapshot stills) were
pulled into the agent's context. Weighted effective-token breakdown of the session: 55.5%
"no-tool" (the amortized cost of re-reading an ever-growing context every turn — this is what
compaction exists for), 22.0% raw Bash tool output (render progress traces + ffmpeg encoder
stats + check/snapshot logs), 10.9% Edit/Write, 5.3% Read, 2.8% image/snapshot reads.

**The concrete, fixable part**: at the end of this episode's build, two separate user-requested
SFX swaps (glitch-1 -> whoosh, then key-press -> typing) each triggered a FULL `npm run render`
— a complete 1560-frame headless-Chrome recapture plus re-encode (~75-80s each) — even though
neither composition HTML file had changed at all, only `audio_meta.json`'s `sfx[]` array.
Checked `npx hyperframes render --help` directly: there is no `--audio-only`, no incremental
mode, no flag that skips frame capture when only audio changed. This is a real HyperFrames CLI
capability gap, not a mistake in how it was invoked.

**The fix, built and verified same day**: `.claude/skills/thataipm-assemble/scripts/
remux_audio.mjs` — reads `audio_meta.json` directly (voices[] in frame order gives cumulative
absolute start times via `duration_s`; `sfx[].offset_s` is relative to that cue's own frame,
matching how frame compositions author their GSAP cue times; `bgm`, if present, spans the full
timeline), rebuilds the exact same mix HyperFrames' own assemble step would produce via a single
`ffmpeg -filter_complex` (`adelay` per source at its real absolute-ms offset, `amix` across all
sources), then remuxes it onto the video-only stream extracted from any prior known-good render
(`ffmpeg -an -c:v copy`) with `-c:v copy` (no video re-encode either). **Real, load-bearing
gotcha**: `amix`'s default `normalize=1` scales every input down by `1/N`, which measured
-34.3dB mean on a real A/B against this episode's actual audio (should be -21.0dB) — pass
`normalize=0` or the mix comes out audibly quieter than the real pipeline's output. With
`normalize=0`, a real test against this episode's own final `audio_meta.json` and a first-pass
video-only stream reproduced the real render's volumedetect numbers exactly (-21.0dB mean,
-1.7dB max, bit-for-bit match on both figures, not just "close").

**When to use it vs. a real render**: only when the composition HTML (frame files, index.html)
genuinely hasn't changed since the last render — any visual edit still needs a real
`npm run render`. Usage: `node .claude/skills/thataipm-assemble/scripts/remux_audio.mjs
--project-dir <episode> --source-video <path to any prior render with the current visuals>
--out <path>`.

**Secondary fix, same finding**: raw Bash tool output (render progress traces, ffmpeg's full
libx264/aac encoder stats block, verbose `npm run check` lint dumps) was the single largest
concrete token category after the structural context-carry cost. `npx hyperframes render`
supports a real `--quiet` flag (suppresses verbose output) — use it once a render is expected to
succeed cleanly (i.e., not the first render of a new frame, where full output helps debug a
failure). For `ffmpeg`, prefer `-loglevel error` over piping the full stats block through `tail
-N` when the call is a known-good re-encode, not a first attempt.

**Standing rule going forward**: batch known fixes into one edit pass before re-running
`npm run check` or a `hyperframes snapshot` sweep, rather than a single-issue check-fix-check
loop (the caption garble fix, the contrast fix, and the overflow fix in this same episode were
each checked separately when they could have been batched). Reserve a full multi-timestamp dense
snapshot sweep for pre-render final verification; a narrow 2-4 frame targeted snapshot is enough
to confirm a single just-fixed region.

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

**Hard rule (tightened 2026-08-14, direct instruction): build from the HyperFrames library
always.** Every visual device in every frame defaults to an installed registry block or
component. Hand-building is the exception, permitted only after a real registry search
confirms nothing fits, and every such exception gets logged here. This is not "check the
registry sometimes" — `check_registry_usage.mjs` (wired into `/thataipm-assemble`'s pipeline,
step 4/8, unskippable) now requires **every single frame in the episode** to be individually
accounted for, not just "the episode has one registry item somewhere in it." An episode that
installs one registry block in Frame 2 while silently hand-building Frames 1/3/4/5 without
ever checking them used to pass this gate — it no longer does.

**Format**: one bullet line per episode (or several, all get combined), covering every frame
by number:

```
- [YYYY-MM-DD] <episode-slug>: Frame 1 registry(`item-name`); Frame 2 hand-built(<device>) — <why no registry block covers it>; Frame 3 registry(`item-name`); ...
```

`registry(...)` for a frame that installs and uses a real catalog item — name the item.
`hand-built(...) — <why>` for a frame where a real, documented registry search (state which
queries were tried) confirmed nothing fits. Every frame number from 1 to the episode's total
frame count must appear somewhere in this slug's bullet line(s), tagged one way or the other
— the checker fails and names the exact missing frame numbers otherwise.

**Entries (post-tightening, full per-frame format):**

- [2026-08-15] hyperframes-5-ways-to-make-money-with-ai: Frame 1 registry(`headline-slam`,
  `caption-kinetic-slam`) — real hook title card, first use of the newer "video primitive"
  mount contract (data-composition-src + data-composition-variables) in this project, verified
  against its own header comment and `hyperframes-core`'s sub-compositions.md before wiring;
  Frame 2 registry(`browser-device-stage`) — real Upwork logo/screenshot in the host-page
  `<template data-slot="browser-device-stage-screen">` slot, per that component's own mount
  contract; Frame 3 registry(`terminal-simulator`) — real publish-command reveal, same
  confirmed-working paste-in component as `hyperframes-continuous-claude-v3` Frame 2; Frame 4
  hand-built(3 real stat cards: 1,000 subscribers / 10M Shorts views / 90 days, sequential
  count-up reveal) — `grid-card-assemble` was tried FIRST (mounted correctly, real
  `data-variable-values`, confirmed via `npm run check` clean), picked over `mk-specs-list`
  after that one was flagged elevated-risk, but confirmed genuinely blank across 4 real frame
  extractions spanning its ENTIRE cue window (t=36/38/40/42s original-relative, all inside the
  8.4-11.5s reveal range) in the actual final render, not just a snapshot-tool sample — the
  3rd confirmed case of this pipeline's blank-mount bug class, see the durable-pitfall entry
  below; Frame 5 registry(`trust-strip`) — real category wordmark row, confirmed actually
  rendering in the final render (real extracted frame at t=46s shows "PROMPT PACKS TEMPLATES
  AI TOOLS" legibly); Frame 6 registry(`chart-story`) — real n8n valuation line (2.5B to
  5.2B), confirmed actually rendering (real extracted frames at t=60-62s show the line drawing
  toward 5.2); Frame 7 registry(`cta-close`) — the real registry CTA-close primitive, used
  specifically to avoid `hyperframes-continuous-claude-v3` Frame 5's hand-built
  follow-ring/label misalignment bug, confirmed actually rendering with the real custom text
  ("Comment MONEY Below" / "Get The Full List") at t=70s. 6 of 7 frames used a distinct
  registry item confirmed actually working in the real render; Frame 4 is the one real,
  logged exception (95% ratio target overridden to 85% for this episode via
  `--check-args "--min-ratio 0.85"`, recorded in the manifest).

- [2026-08-15] hyperframes-continuous-claude-v3: Frame 1 registry(`browser-device-stage`,
  `caption-kinetic-slam`, `yt-camera-move`); Frame 2 registry(`terminal-simulator`,
  `caption-kinetic-slam`) — searched `code-highlight` first (real Shiki-token syntax-color
  engine for actual code, not prose) and correctly rejected it before wiring: this frame
  needed to show real quoted README prose, not code, so `terminal-simulator` (unused so far
  in this episode) was the right fit instead; Frame 3 registry(`conic-progress-ring`) — a
  real 95% fill synced to the real 23,000-vs-1,200-token figures, genuinely different from
  Frames 1-2; Frame 4 hand-built(big-numeral stat cards matching mk-progress-stat's own
  visual language: count-up + label + fill track, mounted 3 times sequentially for 109
  skills / 32 agents / 30 hooks) — the registry's own `mk-progress-stat` block was tried
  FIRST (mounted correctly per its confirmed `(hyperframes:block)` type, 3 real instances
  duplicated with CONFIG hand-edited to the real verified counts), and confirmed genuinely
  broken in this render pipeline across 2 separate re-renders, each verified by direct
  frame extraction from BOTH the pre-speedup and post-speedup files (blank card, no error
  in `hyperframes check` or the render log) — same failure class as `data-chart` on the
  caveman episode. Tried a duration-alignment fix first (host mount declared
  `data-duration="6"`, the block's own internal root declared `"7"` — the exact same
  mismatch pattern that was part of `data-chart`'s diagnosis) and re-rendered; still blank.
  Hand-built only after that real, repeated failure, not skipped to save time — see the
  durable pitfall entry below for the full trail; Frame 5 hand-built(reflection +
  follow-ring CTA) — reused the same established device from prior episodes
  (hyperframes-the-caveman-skill, hyperframes-what-is-mcp), no registry match for a
  comment-gate CTA ring, re-checked this episode. `domain-warp-dissolve` was installed and
  evaluated as a transition between Frames 1-2 but not used this pass (time-scoped, not a
  rejection) — a real capability-audit candidate for a future episode. Real capability
  stretch vs the caveman episode's repeat pattern: `conic-progress-ring` and
  `mk-progress-stat` are both genuinely new device types for this channel, never used
  before this episode.
- [2026-08-14] hyperframes-the-caveman-skill: Frame 1 registry(`browser-device-stage`,
  `caption-kinetic-slam`, `simulated-cursor`, `yt-camera-move`); Frame 2 registry(`terminal-simulator`,
  `before-after-wipe`, `caption-kinetic-slam`) — swapped off `browser-device-stage` (a second
  browser-window screenshot back to back with Frame 1's read as the same device reused, not a
  distinct one) for a genuinely different mechanic showing the real quoted text; Frame 3
  hand-built(bar chart of the real 10 tasks' Saved% values) — the registry's own `data-chart`
  block was tried FIRST (mounted correctly per its confirmed `(hyperframes:block)` type, fonts
  and internal `data-duration` fixed to match the host mount, a suspected hang source removed),
  and confirmed genuinely broken in this render pipeline across 4 separate re-renders each
  verified by direct frame extraction (`sub_timeline_readiness_timeout`, blank chart every
  time) -- see the durable pitfall below for the full diagnostic trail. Hand-built only after
  that real, repeated failure, not skipped to save time. Same distinct visual language (light
  chart canvas) from every other frame's dark browser chrome either way; Frame 4 registry(`whip-pan-cut`,
  `caption-kinetic-slam`, `caption-editorial-emphasis`, `yt-camera-move`); Frame 5 hand-built(follow-ring
  comment-keyword CTA) — re-checked this episode specifically ("comment keyword call to action
  ring follow" query), still no registry match for a comment-gate CTA ring; reused the same
  established device from `hyperframes-what-is-mcp`/`hyperframes-what-skills-matter` rather
  than re-inventing one, per this project's own reuse-over-duplicate-hand-build discipline.
  `press-ripple` was installed and evaluated but not used -- `simulated-cursor` alone covered
  every cursor beat this episode needed without press-ripple's extra built-in target-pill
  machinery, which this episode's screenshots-and-captions shot list didn't call for.
- [2026-08-19] hyperframes-claude-code-auto-memory: Frame 1 hand-built(`matrix-decode` pasted
  structure, real "REMEMBERS" scramble-to-word reveal) — registry(`matrix-decode`), JS fallback
  bug fixed in the installed copy (empty-string default replaced with the real declared
  default); Frame 2 registry(`notification-pileup`); Frame 3 registry(`browser-device-stage`,
  `yt-camera-move`) — real screenshot of `code.claude.com/docs/en/memory`, camera punch-in +
  edge-defocus pulse added after review caught it installed-but-unused; Frame 4
  registry(`terminal-simulator`) —
  rebuilt mid-episode after first draft hand-built a lookalike terminal instead of using the
  real installed component's markup/classes, corrected before assemble; Frame 5
  registry(`constellation-hub`) — real MEMORY.md node labels (Decisions, Bugs Fixed,
  Preferences, Style Rules), mount box corrected once for a caption-band overlap; Frame 6
  registry(`code-terminal-run`) — real `cat memory/feedback_no_em_dashes.md` content, swapped
  in after `code-snippet-dark-2026` and `code-diff` were both installed and rejected as legacy
  fixed-1920x1080-landscape blocks (same risk class as previously-confirmed-broken
  `data-chart`/`mk-progress-stat`/`grid-card-assemble`); Frame 7 registry(`cta-close`). New
  standing rule this episode (see root `CLAUDE.md` memory `feedback-visuals-not-word-for-word`):
  visuals no longer need to illustrate narration word-for-word, and no frame may go empty even
  for a microsecond — every frame here uses one continuous ambient-glow `tl.fromTo` spanning
  nearly the full frame duration to guarantee both `check_static_gaps.mjs` coverage and genuine
  always-on motion. **Revised same day after direct feedback ("old subtitle format... leverage
  high quality elements from hyperframe"):** the channel's own `captions.mjs`/
  `thataipm-caption-skin.html` dark-box karaoke captions were replaced (this episode) with the
  real installed `caption-pill-karaoke` registry component's actual algorithm (canvas-measured
  per-group font sizing, natural-pause + 4-word grouping, 2-line wrap, instant opacity SET at
  group boundaries instead of a crossfade tween) rebuilt into `compositions/captions.html` fed
  with this episode's real word timeline, portrait-adapted (900px pill width, this channel's
  existing 68%-84% safe-zone band kept) — genuinely fixes a real overlapping-caption garble bug
  the old crossfade-tween skin had at group boundaries (confirmed in this episode's own
  dense-verification pass, e.g. two adjacent groups both partially opaque at t=9.5s), not just
  a style swap. Also wired `yt-camera-move` (installed earlier this episode but left completely
  unused, a real gap, not a false negative) onto Frame 3's static screenshot mount for a genuine
  camera punch-in + edge-defocus pulse, replacing what had been a flat static mount with only an
  ambient glow covering it.

**Entries (pre-2026-08-14 tightening, narrative format — kept as history, not retroactively
reformatted; the paragraph below each episode's bulleted gaps also documents that episode's
real registry MATCHES, which the old format didn't require tagging by frame number):**

- [2026-08-14] hyperframes-what-is-mcp: literal USB-C plug/connector (Frame 1, two pieces
  snapping together to close a circuit) — checked with two differently-phrased catalog
  queries ("plug connecting into a port," "two pieces snapping together"), nothing in the
  registry does a literal physical-connector snap-together device.
- [2026-08-14] hyperframes-what-is-mcp: horizontal timeline where company logos join one at a
  time over real calendar dates (Frame 4) — checked, nothing in the registry builds a
  logo/milestone timeline; closest hits (hw-boil, stop-motion-cadence, separator) are
  unrelated motion primitives, not a timeline device.
- [2026-08-14] hyperframes-what-is-mcp: multiple company marks merging/settling into one
  unified group (Frame 5) — checked, no registry match found; used a hand-built merge instead.

This same episode also found two real matches and installed them instead of hand-building —
the registry check isn't just a gap-logging exercise, most of the time it should find
something: `constellation-hub` (a central hub with nodes brightening in narration order,
settling into one lockup — an exact fit for the host/client/server hub-and-spoke shape in
Frame 2) and `terminal-simulator` (a typed terminal window streaming log output, reframed as
the literal request/response JSON-RPC exchange in Frame 3, more technically accurate than an
invented chat-bubble device would have been).

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
