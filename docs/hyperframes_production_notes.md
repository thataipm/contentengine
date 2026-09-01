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

### Rule 1: registry-first, three device tiers (revised 2026-08-24)

**Revised after a real production run (`hyperframes-your-agent-cant-do-anything`) hit a real
conflict**: the original 95%/5% rule counted real product screenshots as ordinary hand-built,
so an episode that correctly followed the OTHER standing rule (real screenshots at beats where
showing the actual product is the point — CLAUDE.md's "screenshots and real UI over generic
icons/mock UI") got penalized by the ratio gate for following it. Direct correction: "our
engine is registry heavy, we should use real screenshots only where its logically
applicable." Three tiers now, not two:

1. **`registry(...)`** — the default. This engine is registry-heavy on purpose (373+ catalog
   items); reach for it first, every time, per `thataipm-registry-check`'s full-catalog-read
   discovery.
2. **`screenshot(...)`** — a real captured product screenshot, used ONLY at a beat where
   showing the actual UI is the literal point (a tool intro, a real workflow step) — not a
   default, not a substitute for a registry search elsewhere in the same episode. Typically
   1-2 beats per episode, not most of them. Exempt from the ratio target below entirely — it's
   a different, deliberate device choice, not an "avoided the registry" gap.
3. **`hand-built(...) — <why>`** — genuine fallback, only after a real, logged registry search
   (see Rule 1's discovery discipline above) finds no match. This is what the ratio target
   below actually measures.

A fourth tag, **`hand-built-bug-workaround(<item>) — <durable-pitfall reference>`**, covers the
case where a registry item was installed and tried but a CONFIRMED, LOGGED render-engine bug
makes it non-functional (e.g. the nested-paste-in-wrapper-invisible bug, hit 3+ times on this
channel — `cta-close` needs this treatment every time). Also exempt from the ratio — the
registry WAS checked and used, it just doesn't render.

A fifth tag, **`hand-built-real-asset(<item>) — <why>`** (added 2026-08-24, direct instruction
"use actual logo for tools we say out loud"), covers a hand-built device assembled FROM real
captured brand/product imagery (a row of real official app logos, e.g.) where the registry has
no matching device shape — checked and confirmed on `hyperframes-your-agent-cant-do-anything`:
`trust-strip` only does text wordmarks, and `logo-wall`'s own file explicitly states it uses
placeholder lettermarks "WITHOUT using real brand assets." This is the same category as
`screenshot(...)` (real, non-fabricated content, not an avoidable hand-build) and the original
2026-08-15 instruction itself says "use brand logos wherever possible" in the same breath as the
95%/90% target — also exempt from the ratio. Reserve it for devices built from real captured
imagery, not as a general escape hatch for any hand-build.

**Target ratio**: 90% `registry(...)` / 10% ceiling for plain `hand-built(...)`, computed only
from tiers 1 and 3 above (tiers 2, 4, and 5 are exempt, see `check_registry_ratio.mjs`'s own
comment for the exact math). Lowered from the original 95% after this same production run
showed a single confirmed-bug hand-built entry (see the durable-pitfall list) shouldn't
disproportionately sink an otherwise registry-first episode.

Favor real brand/product logos over invented iconography whenever a screenshot or hand-built
slot is used to represent a named tool, company, or product. **`continuous-claude-v3`** hit the
"failed registry attempt" case directly (Frame 4's stat cards, Frame 5's CTA ring, both
hand-built after `mk-progress-stat` confirmed blank-rendering) — a failed registry block should
still trigger a second attempt at a *different* registry block before falling back to
hand-built, not an immediate fallback.

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

## Standing visual defaults (2026-08-21, v2 system — RETIRED 2026-08-31)

**Superseded 2026-08-31 by visual system v3 "Assembly"** (direct instruction, after a real
3-direction bake-off in `hyperframes-visual-directions/`) — see `CLAUDE.md`'s "Standing visual
system v3" section for the current live palette (single electric-blue accent `#3AD1FF`, bold
geometric sans + JetBrains Mono, status-pill motif, full black ground with no grid). This
section's v2 detail stays below as historical record, same "kept for history" treatment v2 itself
gave the 2026-08-13 palette it replaced. Do not build a new episode against the v2 detail below.

**Retired**: the 2026-08-13 cream-ground/no-grid palette (light theme, purple/green/orange/blue
accent rotation, "no grid texture" rule). Fully replaced 2026-08-21 by direct instruction ("apply
it globally... keep this as standard moving forward always") — do not fall back to it. Full text
in git history (`git log -p -- docs/hyperframes_production_notes.md`) if a past episode's exact
old-palette values are ever needed for reference. The caption-band-height correction from that
section still applies unchanged (platform chrome geometry, not palette) — repeated below.

**Current standing palette**: plain black ground (`#0A0A0A`), no grid lines. The
`grid-background` component went through two revisions the same day, 2026-08-21: shipped WITH a
grid overlay at first adoption, grid removed after the first validation episode's feedback round,
then its ground color itself flipped from off-white to black in a THIRD revision the same day
("use black background color as standard to maintain consistency between all videos," direct
instruction) — do not reintroduce either the grid or the light ground. Sage green for device
chrome, red for accents and transitions, off-white text and UI cards floating on the black
ground. **Typography**: mixed serif/sans for kinetic reveals. **Motion**: soft drop-shadow
3D-on-2D depth, red radial-burst scene-transitions. **Black-ground contrast note**: any dark
element (a badge, a card) that read fine via drop-shadow alone on the retired light ground needs
its own light ring/border on black — a shadow doesn't separate a dark shape from a dark backdrop.
Full design rationale and the registry-search log behind each device: see the "Custom devices"
entry below and `hyperframes-visual-system-v2/` itself (the source project — copy components
from its `compositions/components/` into a new episode, no shared library folder, same
per-project convention as every other hand-built device here). Note: the sandbox project's own
palette wasn't flipped to black in this pass (out of scope, no episode currently validating
against it) — flip it too before the next episode starts from it, so the source project and the
live standard don't drift apart.

This is the default for every new episode going forward, same "standing, not per-episode"
status the retired section held — override only on explicit per-episode instruction, and log the
override the same way `hyperframes-what-skills-matter`'s dark-palette exception was logged
against the old default.

**Three more standing requirements, added 2026-08-21 after the first validation episode's
feedback round:**
- **Real screenshots, not hand-built mock UI, whenever a frame depicts a real product.**
  `hyperframes-lead-gen-sales-agent` Frame 4 originally hand-built a Slack/Gmail/Calendar mock
  for its `browser-device-stage` screen slot — flagged directly ("you have not used any
  screenshots, gather visual assets, make it standard"). Fixed by capturing real screenshots of
  the actual product site. See the durable-pitfall entry below for how to capture them when the
  interactive Browser pane isn't displaying (a real, recurring session constraint, not a one-off).
- **Any device mounted inside a frame that also carries captions must clear the caption band
  (y 1305.6-1613.28 on a 1920-tall canvas) with real margin**, not just avoid a hard `check`
  error. The same episode's Frame 4 mounted `browser-device-stage` at `top:260px;height:1200px`
  (bottom edge 1460px) — inside the band, invisible to `hyperframes check`'s layout pass (which
  checks containment/overflow, not band clearance) and only caught by reading real extracted
  frames from the final render.
- **Caption pills must be fully opaque, never translucent**, for the same reason noted in the
  durable-pitfall entry below — a translucent pill's effective contrast depends on whatever v2
  backdrop sits behind it.

- **Caption band sits too low by default** (unchanged from the retired section — platform-chrome
  geometry, not palette). `captionBand()` in the framework's own `lib/dimensions.mjs` reserves
  the bottom 16.67% of the canvas purely from height, with no concept of a specific platform's
  own UI chrome. On a 1080x1920 canvas that gives `--cap-band-top: 1600px`, but this channel's
  established Instagram safe zone reserves roughly the bottom 300px (~y=1650+) for IG's own
  overlay buttons, so the band's bottom edge lands inside that reserved zone. **After every
  `captions.mjs build` run, raise `--cap-band-top` to ~1300px** (keeps the full band's bottom
  at/above y≈1620, clear of platform chrome with margin) — check both the generated
  `compositions/captions.html` and, if it's ever regenerated, reapply.

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

## Durable pitfall: a mismatched host `data-composition-id` (vs. the mounted file's own internal id) breaks `cqw`/`cqh` sizing, not just variable passing

Found 2026-08-21 on `hyperframes-lead-gen-sales-agent` Frame 5, caught only via `/watch` on the
real render (not `hyperframes snapshot`, not `hyperframes check` — both passed clean). Two
`glossy-circle-badge` mounts in one frame need unique host `data-composition-id`s to satisfy the
`duplicate_composition_id` lint rule (see the entry below), so they were given
`glossy-circle-badge-a`/`-b` on the HOST div while both still pointed `data-composition-src` at
the SAME unmodified `glossy-circle-badge.html` (whose own internal `data-composition-id` is the
literal `glossy-circle-badge`, unchanged). Real effect: the badge rendered 3-4x its authored
340px size, off-position, arcing off-canvas — `60cqw` was resolving against something far larger
than the 340x340 host box, even with correct `data-width="340" data-height="340"` explicitly set
on the host. `hyperframes check`'s layout pass didn't catch it (no overflow/containment error
logged), and an earlier `hyperframes snapshot` pass on this exact frame region was apparently
sampled at moments that didn't expose it clearly enough to notice at a glance — only reading real
extracted frames from the actual render at native resolution made it obvious. Fix: same pattern
as the `headline-slam`/`sketch-icon-square` forks elsewhere in this episode — when a component
needs 2+ simultaneous or sequential instances in one frame, fork the FILE itself with a matching
internal `data-composition-id` (`glossy-circle-badge-a.html` declaring
`data-composition-id="glossy-circle-badge-a"` internally, not just on the host wrapper), don't
just rename the host wrapper's id while leaving the file's own internal id mismatched. **The
`duplicate_composition_id` lint fix (make the host id unique) and this sizing bug are two
different problems that look like the same fix but aren't** — renaming only the host side
satisfies the linter while silently breaking the mounted component's own container-query basis.

**Standing rule, direct instruction 2026-08-21: run `/watch` on the actual rendered file before
presenting any render as final**, not just `hyperframes snapshot`/`check`. Both of the real bugs
in this section (this one, and the crossfade double-exposure below) passed every mechanical
check and an earlier snapshot pass clean — `/watch`'s frame extraction against the real MP4 at
native resolution was what actually surfaced them. Added to `/thataipm-assemble`'s own
"review the render" step.

## Durable pitfall: reusing a mounted component's file for a second instance without forking it corrupts BOTH instances, not just the unforked one

Found 2026-08-21 on `hyperframes-lead-gen-sales-agent` Frame 4, caught only via `/watch` on the
real render after a user report ("that checkmark is bleeding off the canvas") — `hyperframes
check` and an earlier `/watch` pass both missed it (the dedup/uniform frame sampling happened to
skip the exact ~0.3s window where it was visible, twice). Two `sketch-icon-square-check` mounts
in one frame: the first used the base file unmodified (`data-composition-id="sketch-icon-square-
check"`, matching the file's own internal id — the "correct" half of the pattern in the entry
above), the second pointed the SAME base file with only the host's `data-composition-id` renamed
to `-2` (the "wrong" half). Real effect: the FIRST instance — the one with matching ids — rendered
oversized and off-canvas, not the second. Two mounts referencing one file, one with a mismatched
id, corrupts the shared registration for both, not just the mismatched one. Fix: same as the
entry above — fork the file itself (`sketch-icon-square-check-2.html`, internal id and
`window.__timelines[...]` key both changed to match) before reusing it a second time in one
frame, never just rename the host.

## Durable pitfall: classes/position placed directly on a `data-composition-src` host div don't reliably survive the mount — position via a plain wrapper div instead

Found 2026-08-21 on the same Frame 4 bug above, discovered while root-causing it: after properly
forking `sketch-icon-square-check-2.html` (fixing the sizing), all four icon mounts in the frame
still rendered at the SAME position regardless of distinct `left` values set via modifier classes
(`.f4-icon-mount--1` through `--5`) applied directly on each `data-composition-src` host div. The
host's own class list does not reliably survive whatever the runtime does when it mounts a sub-
composition into that div — the position rules were syntactically correct CSS and passed
`hyperframes check`, but never took effect. Fix: never put positioning (or any styling meant to
persist) directly on a sub-composition host div's `class`/inline style — wrap it in a plain,
non-host `<div>` that owns the `position: absolute; left/top` and give the host div itself only
`inset: 0` to fill that wrapper. This is now the standing pattern for any frame mounting the same
component more than once at different canvas positions.

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

**Re-confirmed 2026-08-20 on `hyperframes-ask-ai-to-think-first`, now definitely not transient.**
`chat-thread`, `constellation-hub`, and `cta-close` ALL rendered their own default demo content
(a fake "what r u using for the launch video??" text thread, "Product"/"Capture,Compose,Render,
Share", "Make it happen"/"Start now") instead of the real `data-variable-values` supplied on
each mount — caught only because a full-episode snapshot review showed 3 of 7 frames were
literally the wrong content, not a styling issue. This is the exact same failure on three
different components across two separate episodes now (five components total: `cta-close`,
`grid-card-assemble`, `trust-strip`, `chart-story`, `headline-slam`, `browser-device-stage` on
2026-08-15; `chat-thread`, `constellation-hub`, `cta-close` again on 2026-08-20) — treat this as
a confirmed, permanent characteristic of `data-composition-src` + `data-variable-values` at
2-level nesting, not a one-off. **The fix above is now the mandatory first step for every
video-primitive mount, not a fallback to try after something looks wrong**: after installing
any component of this type, immediately edit its own declared JSON default AND JS fallback
constant to the real content before ever mounting it, then verify with a real snapshot. Don't
trust `data-variable-values` alone at this nesting depth on any future episode.

**New durable pitfall (2026-08-23): a live `data-composition-src` mount held on screen past
~5s reliably renders as SOLID BLACK, unrelated to anything above.** Found on
`hyperframes-ai-took-over-my-browser` Frame 4's `browser-device-stage` mount (a 10.95s hold) —
confirmed the break point tracks the mount's OWN start time (~5s after `data-start`, not a
fixed absolute video timestamp) by shifting `data-start` and watching the break point move with
it. Root cause NOT found despite exhausting the obvious suspects one at a time: ruled out 3D
transforms on an ancestor, a sibling's opaque background, the defocus overlay, the camera-move
zoom, `container-type: size` on the mount's own `#root`, a continuous keep-alive opacity pulse
on the held element itself, and the pinned engine version (reproduced identically on both
0.7.107 and 0.8.10). **Working fix, not a root-cause fix**: cap the live mount's
`data-duration` well before the ~5s mark, snapshot the same screen once via `hyperframes
snapshot --zoom <selector>` at the cutoff moment, and lay a plain `<img class="clip">` at the
same position/size/track-index to take over for the rest of the intended hold — a static image
can't suffer this bug since it isn't a live nested composited mount. Any camera-move/transform
on the wrapper still applies correctly to the static image too, since it's a sibling under the
same transformed wrapper div. **Any future episode holding a registry-mounted primitive on
screen for more than ~4-5 seconds should snapshot-verify the full hold range at full resolution
before considering the frame done** — this class of bug is otherwise invisible until someone
actually watches the render.

**Third confirmed instance (2026-08-30), tighter threshold than previously observed:**
`hyperframes-notes-into-a-podcast` Frame 3's `comparison-split` mount (originally 8.0s) went
fully invisible 3.8-4.2s after its own `data-start`, confirmed via a real dense snapshot sweep
(visible and correct at 12.5-15.0s absolute, gone by 15.6s, well before its own scripted
`OUT_BASE` fade which shouldn't start until ~7.5s local time). This is the SAME break point
tracking the mount's own start time, same working fix (cap the mount short, hand-build the
remainder) as the `browser-device-stage` case above — but confirms the real safe threshold is
narrower than "~4-5s," closer to ~3.5s. **Revise the rule of thumb: cap any live nested mount at
3.5s, not 4-5s, unless a fresh snapshot sweep on that specific component confirms it holds
longer.** Fixed here by capping the mount to 3.5s and hand-building a plain-CSS continuation
(two avatar circles + an animated waveform, no nested mount) for the remaining runway.

**Fourth confirmed instance (2026-08-31), caught by real-frame verification before shipping:**
same episode's Frame 6 `spring-pop` mount, authored at 4.55s (5.4s to the frame's 9.95s end) went
fully invisible (a plain black box, no badge/dot/text) by real frame pull at 9.011s local time --
3.611s into the mount, again just past 3.5s. Found via dense `ffmpeg -ss` frame extraction
directly from the real rendered MP4 across the whole 47.2s episode (not `hyperframes snapshot`),
per this episode's own standing rule. Fixed the same way: capped the mount to 3.5s (5.4-8.9s) and
hand-built a static plain-CSS pill (dot + label, matching `spring-pop`'s settled look) for the
final 1.05s. Re-render and re-verify required after this class of fix -- it is not visible in
`hyperframes check`, the registry-ratio/usage checks, or `hyperframes snapshot`.

## Durable pitfall: baking a JS fallback default alone is NOT enough — the real render pipeline can resolve an unset variable to the component's SCHEMA-declared `default` (not null/undefined), silently bypassing the JS fallback entirely; edit BOTH or ship wrong content (2026-08-30)

**Real, confirmed, and shipped once already before being caught.** Every "baked default" fix
this channel has used since cavecrew (edit the installed component's JS fallback constant, e.g.
`vars.text == null ? "my real value" : ...`) was verified via `hyperframes snapshot`, which
apparently does NOT reproduce this bug. It IS reproducible in a real `npm run render` pass,
confirmed twice on `hyperframes-notes-into-a-podcast` (`titlecard-lockup` rendered its stock
"HYPERFRAMES / INTRODUCING / WRITE HTML. RENDER VIDEO." content, not "THE AI UPGRADE / EPISODE",
across TWO separate fresh full renders) via real `ffmpeg` frame extraction directly from the
rendered MP4, not the snapshot tool.

**Root cause (confirmed by inspection, not fully instrumented)**: several components declare a
JSON `"default"` value per variable inside their own `data-composition-variables` schema
attribute, SEPARATELY from the JS fallback the component's own script computes at runtime
(`var wordmarkText = readText(vars.wordmark, "THE AI UPGRADE")` etc.). The real render pipeline
appears to sometimes resolve `window.__hyperframes.getVariables()` to already contain the
SCHEMA's declared defaults for any unset variable (a real, non-null string), not `undefined` —
which means the JS fallback's own null-check (`vars.wordmark == null ? fallback : ...`) never
even triggers, since `vars.wordmark` is already a valid non-null string ("HYPERFRAMES") straight
from the schema. `hyperframes snapshot` does not exhibit this (confirmed both did/didn't diverge
on the same file in the same session), so a snapshot-only verification pass can pass clean while
the real render ships the wrong content. **This is NOT universal to every component** — several
components in this same episode (`typed-prompt`'s `accent`/`exit`/`cadence`, `spring-pop`'s
`overshoot`/`fromScale`) never diverged because their schema default already happened to match
the JS fallback by coincidence, which is exactly why this went unnoticed until a field with a
genuinely DIFFERENT schema-vs-JS value was checked.

**Standing rule, supersedes the "just edit the JS fallback" instruction on every prior
`data_variable_values_unreliable_at_nested_mount` entry in this file**: whenever baking a
default into an installed component to work around the 2-level-nesting variable-passthrough
bug, edit BOTH the JS fallback constant AND the matching `"default"` field inside that same
variable's declaration in `data-composition-variables` — they must always read the same value.
Editing only the JS fallback is an incomplete fix that can pass every mechanical check and a
`hyperframes snapshot` visual pass while still shipping wrong content in the real render.
**Confirmed retroactively on `hyperframes-cavecrew-subagents` (already PUBLISHED — Instagram
and YouTube both confirmed via a real `GET /v1/posts/{id}` call, 2026-08-30/31): `typed-prompt`,
`typed-prompt-2`, `cta-lockup`, and `text-shimmer` all had this exact schema-vs-JS mismatch
(their schema defaults were never updated, only the JS fallback was) — meaning the live,
already-distributed video's Frame 5 (both typed-prompt instances), Frame 6, and Frame 7 likely
show their STOCK demo content, not the real cavecrew script content, despite every check and
verification pass during that build reading clean.** Per this project's own standing rule, a
published video does not get re-edited — this is recorded here as a real, confirmed miss to
learn from, not an action item to fix retroactively. `radial-surround` and `state-chip-rail` on
that same episode were NOT affected (their schema defaults happened to already match). Any
future episode should treat "does the schema default match the JS fallback, field by field" as
part of the same checklist as the passthrough fix itself, not a separate optional step.

## Durable pitfall: mounting the SAME registry component file twice in one episode (two different frames, not nested) can silently break one of the two instances — both share one hardcoded `window.__timelines` key (2026-08-30)

Found on `hyperframes-notes-into-a-podcast`: `notification-pileup` was deliberately reused in
both Frame 1 (the hook) and Frame 4 (the loop-back close) as the SAME literal visual, an
intentional callback, not a habit-default reuse. Frame 1's instance rendered correctly (confirmed
via real snapshot). Frame 4's instance — same file, same `data-composition-src` path, mounted in
a completely different frame later in the video — rendered FULLY BLANK across its entire mount
window, confirmed via a real dense snapshot sweep (nothing but the ambient glow, no cards ever
appeared).

**Root cause**: several registry components read their own literal composition id into a fixed
JS variable and register their GSAP timeline under that EXACT string — e.g.
`var compositionId = "notification-pileup";` — rather than reading it off the mounted host's own
`data-composition-id` attribute. The component's own header comment even states why: "after
mount flattening strips data-composition-id" from the mounted root, so the script can't reliably
read it back off the DOM and falls back to a hardcoded literal instead. When the SAME component
file is mounted twice anywhere in one episode (regardless of which frame, nested or sibling),
both instances' scripts execute in the same shared render context and both try to write
`window.__timelines["notification-pileup"]` — the second write clobbers the first, and whichever
instance ends up reading a timeline object that isn't its own goes blank or breaks.

**This is DIFFERENT from, and in addition to, the already-logged
`data_variable_values_unreliable_at_nested_mount` list** — that list is about content/variables
not reaching a 2-levels-deep mount; this is about TWO SEPARATE mounts of the identical file
anywhere in the episode colliding on a shared global key, regardless of nesting depth. A
component can be on neither, either, or both lists.

**Standing rule: any time the SAME registry component file is genuinely needed twice in one
episode (a deliberate callback/loop-echo, not a copy-paste accident), FORK the file** — copy it
to a `-2.html` (or `-3.html`, etc.) filename and rename every literal occurrence of its
composition id inside that copy: the `data-composition-id` attribute(s), any internal element id
that embeds the component name (e.g. `id="notification-pileup-clip"`), and critically the
hardcoded `var compositionId = "..."` (or equivalent) the script itself registers its timeline
under. Verify each renamed id string doesn't appear anywhere else in the file before treating the
rename as complete. This project already applied this fix correctly for `typed-prompt` /
`typed-prompt-2` (cavecrew) and `spring-pop` / `spring-pop-2` (this same episode) — the miss here
was inconsistency, reusing that exact lesson for one component in an episode while forgetting to
apply it to a DIFFERENT component reused the same way in the same episode. **Whenever a registry
component is mounted more than once anywhere in an episode, fork it — no exceptions, don't reason
case by case about whether a particular component "should" be safe.**

**New durable pitfall (2026-08-24): a paste-in component windowed to a NON-ZERO offset within a
longer frame renders completely invisible if the time-offset lives only on the inner clip, not
the paste-in's own outer wrapper.** Found on `hyperframes-ai-cant-grade-its-own-homework` Frame
4's `code-terminal-run` mount: it needed to appear only from frame-relative 2.0s-6.3s inside a
16.11s frame, so the pasted markup was edited to `data-start="2.0"` on the INNER
`#code-terminal-run-clip` while the OUTER `#f4-ctr-root` (the element carrying
`data-composition-id`) kept no `class="clip"` and no `data-start`/`data-duration` of its own —
this mirrors how every zero-offset paste-in in this same episode is structured (root has no
timing, inner clip spans the full local duration from 0), which is exactly why it looked
correct by inspection. The engine never revealed the inner clip at all; the whole terminal card
stayed invisible for the entire frame, confirmed via a real `hyperframes snapshot --at` capture
(not just `/watch`) and cross-checked against a live GSAP-timeline probe showing
`window.__timelines['code-terminal-run'].progress()` stuck at 0. This is a DIFFERENT bug from
the `container-type: size` omission pitfall (that one made a correctly-windowed mount render
mis-sized/invisible; this one is about WHERE the time-window itself lives) — both can look
identical from a `/watch` frame (nothing there), so don't stop investigating after fixing one.
**Fix**: for a paste-in mounted at a non-zero offset within a longer frame, put the windowing
(`class="clip"`, `data-start`, `data-duration`, `data-track-index`) on the OUTER element that
carries `data-composition-id` — exactly the same convention a real `data-composition-src` mount
already uses (see `oscilloscope-trace`'s `#f4-osc` in the same file: `data-start`/`data-duration`
live on the one mounting element). Reset the paste-in's OWN inner clip back to `data-start="0"`
spanning its full local duration (matching the original registry source), and give it a distinct
`data-track-index` from the outer wrapper's — reusing the same index collides and
`assemble-index.mjs` fails loudly (a same-track time-overlap error), which is a useful tripwire
if this fix is applied correctly. Any future non-zero-offset paste-in should default to windowing
the outer element first, not the inner clip, regardless of how the zero-offset paste-ins
elsewhere in the same episode are structured.

**Second, distinct bug found the same day on `chat-thread`**: its message-arrival pacing math
uses a hardcoded `var duration = 12` (matching its own `data-composition-duration="12"` demo
default) to decide when to compress the stagger schedule — completely independent of the host
mount's real `data-duration`. Mounted at 18.269s with 4 messages, the component's OWN internal
compression logic squeezed everything to land by ~10.4s regardless, leaving a real ~8s dead tail
even though `class="clip"` visibility itself wasn't the problem this time (unlike
`constellation-hub`'s duration bug below, `#root` here carries no `clip` class, so the DOM stayed
visible — the bug was in the pacing math, not visibility). **Same fix as `constellation-hub`'s
duration bug**: edit the installed copy's `data-composition-duration`, its `#root data-duration`,
and the internal `var duration = 12` constant to the real mount duration. Any video-primitive
component with its own internal pacing/compression math tied to a hardcoded duration constant is
now a suspect by default — grep the installed file for a bare numeric duration literal before
trusting its pacing at a non-default mount length.

**Re-confirmed 2026-08-21 on `hyperframes-lead-gen-sales-agent`, Frame 4** — `browser-device-stage`
(already on the 2026-08-15 list above) was freshly mounted at 16.221s and went through the exact
same failure the log already described: its own `#root data-duration="5"` and inner
`.bds-clip data-duration="5"` stayed at the authored default, so the envelope's HOLD math
computed against 5s, not the real 16.221s mount. Visible symptom differed from the 2026-08-15
write-up (that one was wrong CONTENT; this one was the device visibly SHRINKING then vanishing
entirely partway through its real 16s on-screen window, confirmed via the studio's
`/api/projects/<slug>/thumbnail/index.html?t=<seconds>&format=png` endpoint at several
timestamps, not just `hyperframes snapshot`) but same root cause, same fix: patched
`data-composition-duration`, `#root data-duration`, and the inner clip's own `data-duration` to
16.221 directly in the installed file. **Real process lapse worth naming**: this frame was
authored without checking this durable-pitfall log first, even though `browser-device-stage`
was already named in it from 2026-08-15 — the registry-first hard rule covers checking the
catalog before hand-building, but there's no equivalent forcing function for checking THIS log
before mounting a component that's already a known repeat offender. Until that's automated,
treat any component named in this log as needing the duration-patch applied on sight, before
first mount, not after something looks wrong.

**Separate finding, same debugging pass**: template-slot content (`<template data-slot="...">`
supplying a video-primitive's screen/body content, per `browser-device-stage`'s own slot API)
cannot be choreographed by the HOST FRAME's own `<script>` via `document.getElementById()` —
those nodes are inert inside the `<template>` tag until the sub-component's own mount script
clones them into the live DOM, which runs after the frame's outer script already executed, so
the lookup always returns `null`. Any `tl.fromTo(el, {opacity:0}, {opacity:1}, ...)` guarded by
`if (el)` silently never fires, and if the slot content's CSS default is `opacity:0` it stays
invisible for the entire mount — a third, distinct way this same "outer script runs before inner
content exists" class of bug can manifest (blank content, not blank device). Fix: don't animate
slot content from the host frame's script at all; give it a plain visible-by-default style and
let the sub-component's own entrance (settle/fade on the whole device) carry it on screen as one
unit. A MutationObserver-based workaround was considered and rejected — it isn't seek-safe
against this framework's deterministic-render requirement (a paused GSAP timeline scrubbed to an
arbitrary timestamp, forward or backward, must always produce the same frame).

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

## Durable pitfall: the interactive Browser pane's `screenshot`/`computer` tools can silently be unable to composite frames — use headless Chrome CLI capture instead

Found repeatedly on `hyperframes-lead-gen-sales-agent` (2026-08-21): `mcp__Claude_Browser__computer{action:"screenshot"}` failed with "the Browser pane is not displayed, so the page is not compositing frames" every time it was tried this session, on multiple different pages, regardless of `preview_start`/`navigate`/`tabs_select` order — this is a client-side display state the agent cannot force open. Don't burn retries on it. Real fix: `hyperframes`'s own render pipeline already downloads a real headless Chrome build to `~/.cache/hyperframes/chrome/chrome-headless-shell/<version>/chrome-headless-shell-win64/chrome-headless-shell.exe` (or the equivalent path on other platforms) — call it directly:
```bash
"<path-to>/chrome-headless-shell.exe" --headless --disable-gpu --window-size=1400,2400 \
  --hide-scrollbars --screenshot="out.png" "https://example.com/page"
```
This produces a real, full-page PNG with no interactive-pane dependency. Crop the region you need with `ffmpeg -vf "crop=W:H:X:Y" -update 1`. Used successfully to capture real Lindy product-UI screenshots for `hyperframes-lead-gen-sales-agent` Frame 4 after the interactive pane wouldn't composite. This is now the standing fallback whenever a real screenshot is needed and the Browser pane won't display — don't fall back to a hand-built mock UI just because the interactive route failed.

## Durable pitfall: `assemble-index.mjs` (faceless-explainer's step 2/8) regenerates `index.html` from scratch and silently drops a hand-authored persistent backdrop layer

Found 2026-08-21 on `hyperframes-lead-gen-sales-agent`, caught only by dense real-render
frame extraction (a 25-frame contact sheet built from the actual final MP4 via ffmpeg
`fps=1/2,tile=5x5`, not `hyperframes snapshot`) — the entire video rendered on a plain black
background instead of the v2 system's off-white grid, even though `hyperframes snapshot` and
the studio dev-server thumbnail endpoint both showed the grid correctly right before the
assemble pipeline ran. Root cause: `index.html` had a hand-added `el-grid` mount (the
`grid-background` sub-composition, track-index 0, spanning the full episode) wired in
BEFORE running `/thataipm-assemble`. Step 2/8 (`assemble-index.mjs`) rebuilds `index.html`
from `STORYBOARD.md` + `audio_meta.json` alone — it has no concept of a persistent backdrop
layer (not part of the faceless-explainer schema this script was written for), so it silently
produced a fresh `index.html` with only the 7 frame scenes, captions, voice, and sfx tracks,
and the hand-added grid mount was gone without any warning, error, or log line. Fix applied:
re-added the `el-grid` div (track-index 0, `data-composition-src="compositions/components/
grid-background.html"`, full 54.8s span) to `index.html` by hand AFTER running the pipeline,
then re-rendered directly (`npm run render`) rather than re-running the full 8-step pipeline,
since a second full run would just drop it again. **Same failure class, same fix pattern, as
the `compositions/captions.html`-gets-clobbered pitfall this skill's own SKILL.md already
documents for hand-edited captions** (`--skip-captions-build`) — except there's currently no
equivalent `--skip-assemble-index` flag, so any future full pipeline re-run on a v2-system
episode needs the grid layer manually re-added to `index.html` afterward every time, until
`assemble-index.mjs` itself learns about a backdrop-layer concept. Any v2-system episode with
a persistent backdrop should re-check `index.html` for the `el-grid` mount after every
`/thataipm-assemble` run, not just the first one.

**Related, same debugging pass**: the standard caption skin's `.caption-group` pill background
(`rgba(0, 0, 0, 0.72)`, translucent) composites against whatever sits behind it — against the
channel's old dark-page default this read as effectively near-black regardless, but against the
v2 system's off-white grid it composites to a visibly lighter gray, which drags the karaoke
dim-word state (`rgba(255,255,255,0.55)`) below WCAG AA at the moments `hyperframes check`
samples (mostly the ~0.12-0.18s group fade-in/out windows, a brief transitional dip, not a
steady-state legibility problem). Fixed by making the pill background fully opaque (`#0a0a0a`)
instead of translucent, so its effective color no longer depends on the backdrop. This is now
the standing caption-skin requirement for any v2-system episode — opaque pill, not translucent.

## Durable pitfall: `check_static_gaps.mjs` cannot see motion inside a `data-composition-src`-mounted sub-composition, only inline tweens in the frame's own `<script>`

Found 2026-08-21 on `hyperframes-lead-gen-sales-agent`, the first episode built almost entirely
from v2-system sub-mounted devices (`headline-slam`, `sketch-icon-square`, `glossy-circle-badge`,
`radial-burst`, `browser-device-stage`) rather than hand-coded inline GSAP tweens. Every frame
failed the static-gap check with a single giant "gap" spanning the frame's ENTIRE duration
(`0.00s -> 6.48s`, etc.) — the checker parses only the frame file's own `<script>` block for
`tl.to`/`tl.fromTo` calls, so a frame whose only motion comes from sub-mounted components (each
with its own separate `<script>` in its own file, invisible to a per-frame-file static scan) has
zero visible coverage even when the actual rendered output is continuously changing. Confirmed a
false positive by direct evidence, not assumption: real CLI snapshots (`hyperframes snapshot`,
not the studio preview) at multiple timestamps per frame showed icons/badges/bursts/device swaps
all firing exactly on schedule throughout. Frame 5 illustrates the partial-visibility version of
the same gap: its one inline tween (a hand-built toggle-card entrance + knob flick, not a
sub-mount) WAS correctly seen and covered `0->3.65s`; everything after that point is sub-mounted
device motion (`glossy-circle-badge`, `sketch-icon-square`, `radial-burst`) and reads as one
8.74s gap despite being fully covered in the real render. **This is now a second confirmed blind
spot alongside the tool's own documented non-literal-position-arg limitation** — any episode
built primarily from sub-mounted v2-system devices should expect every frame to fail this check
by default, verify coverage with real `hyperframes snapshot` evidence instead, and pass
`--skip-gap-check` to `pipeline.mjs` with that verification noted (not skipped blind). This
doesn't retire the check for hand-coded-motion episodes (older frames, non-v2 episodes) — it's
specifically the v2 system's sub-mount-heavy authoring style that falls outside what the checker
can see.

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

## Standing rule, 2026-08-24: pipeline hardening after a full architecture/bug-history audit

Direct instruction after a full review of every durable pitfall in this file: "fix everything
that's important... full authority... including removal of dead items." The audit's own finding:
`pipeline.mjs`'s original 6 hard gates were sound, but the two things that actually catch this
channel's most common real bugs — a component rendering blank/black/frozen while `hyperframes
check` reports clean (the dominant failure class in this whole file, ~17 of the ~21 pitfalls
above), and a render shipped at the wrong speed or not sped up at all (shipped twice) — lived
only as manual steps, or in a disconnected orchestrator (`CC-Agent`) that no real episode had
ever actually run through.

**What changed, mechanically:**

- **`check_render_freeze.mjs`** (new) — `ffmpeg freezedetect` directly on the real rendered
  video, catches a whole-frame hold >2s on actual pixels. `blackdetect` was tried first and
  dropped after a real test: this channel's own standing visual system (dominant black
  negative space, small centered devices) makes >95%-black frames the DESIGN on a correctly-
  rendered frame, not a bug signal — it flagged 7.6s of an already-fixed, `/watch`-verified
  frame as a false failure. `freezedetect` at ffmpeg's own default noise floor (-60dB) tested
  clean against that same verified-good render down to a 1.0s hold, so that's what's wired in.
  Honest scope: catches a whole-frame-static bug, not a single dead device next to an
  otherwise-moving caption — `/watch` (below) still catches that narrower case.
- **`registry_blocklist.json` + `check_registry_blocklist.mjs`** (new) — every component named
  in this file as confirmed broken (`data-chart`, `mk-progress-stat` via `data-composition-src`),
  elevated-risk (`mk-specs-list`, `grid-card-assemble`), needing a known manual patch
  (`browser-device-stage`, `chat-thread`'s hardcoded-duration bug), or unreliable with
  `data-variable-values` at a nested mount (the 8 components in that pitfall above) is now a
  hard, checked list instead of something someone has to remember to re-read here.
  `browser-device-stage`'s duration bug shipped a SECOND time specifically because the frame was
  authored without checking this log first — this closes that exact gap.
- **Automated 1.1x speedup** (`pipeline.mjs` stage 20/20) — the manual `ffmpeg setpts/atempo`
  step that shipped at the wrong factor once (1.2 instead of the real 1.1x convention) and was
  skipped entirely once is now part of the pipeline itself, always producing
  `renders/video_rushed.mp4` at a verified-correct factor. No manual step left to get wrong.
- **`check_vo_model.mjs`, `check_audio_levels.mjs`, `check_transition_idempotency.mjs`,
  `check_device_variety.mjs`, `check_registry_ratio.mjs`, `check_paste_in_wiring.mjs`,
  `check_raw_urls.mjs`** — all pre-existed (most in the now-archived `CC-Agent` orchestrator,
  never wired to anything real) or were skill-manual steps; all now run directly from
  `pipeline.mjs` (or, for `check_raw_urls.mjs`, from `/thataipm-distribute`'s own steps).
  `check_transition_idempotency.mjs`'s STORYBOARD.md duration regex required a trailing "s" that
  this episode's own real STORYBOARD.md didn't have — a real false-FAIL caught by testing against
  live data before trusting it as a gate, fixed to make the suffix optional.
- **`report_catalog_breadth.mjs`** (new, advisory) — direct instruction, "make sure we leverage
  hyper frame entire library." Counts real registry-item usage across every logged episode
  against the full ~373-item catalog (currently ~12%) so "use more of the library" is something
  checkable before picking devices, not just a remembered bias.
- **`CC-Agent` archived down to its working checks.** It had grown two things at once: real,
  individually-correct check scripts, and an orchestrator (state machine, stage-agent contracts,
  approval tokens, manifests) that git history shows no real episode ever ran through. A
  half-built parallel QA system sitting unreferenced is worse than not building it — it looks
  like coverage that isn't there. The orchestrator, its agent contracts, schemas, manifests, the
  full `rules.json` registry, and the token-based approval gates (built for an *unattended*
  dispatcher this project doesn't run — see the "Daily/autonomous production automation" note
  above) moved to `archive/CC-Agent-orchestrator/`, not deleted. See `CC-Agent/README.md` for the
  full accounting of what moved and why.
- **Production-order drift fixed**: `thataipm-registry-check/SKILL.md` restated the standing
  production order and had gone stale by a full stage (missing `/thataipm-visual-plan`, added
  2026-08-24) since nobody updates six copies of the same list. It now points at `CLAUDE.md` §9
  instead of restating it.

None of this replaces the mandatory dense `/watch` pass — every new pixel-level check is scoped
honestly in its own header as catching a specific, common bug shape, not a substitute for
actually reading the rendered frames.

## Durable pitfall: `/watch`'s auto-scaled frame extraction can miss full-canvas geometry bugs that native-resolution ffmpeg extraction catches immediately (2026-08-24)

On `hyperframes-your-agent-cant-do-anything`, a dense `/watch` pass at `--detail token-burner
--resolution 1080` on the sped-up render reported nothing wrong. Direct `ffmpeg -ss <t>
-frames:v 1` extraction at native 1080x1920 from the RAW (pre-speedup) `renders/video.mp4` then
found, in a single follow-up pass: a sub-mount going blank for its final ~1s (held past its own
declared `data-composition-duration`), a landscape-native device leaving ~44% of a portrait
frame solid black, a real screenshot panned far enough to expose dead space inside its own
rounded-card border, and text sitting directly inside the live caption band, garbling with real
word captions. None of these are subtle — every one is a full-canvas, easily-visible defect —
yet `/watch`'s own auto-scaling/compression pipeline read as clean. **Root cause not fully
diagnosed, but the practical rule going forward**: after `/watch` passes clean on a render with
ANY sub-composition mount (`data-composition-src`), a real screenshot, or hand-positioned text
near the frame edges/bands, do at least one native-resolution ffmpeg spot-check per frame
(`ffmpeg -y -ss <mid-frame-timestamp> -i renders/video.mp4 -frames:v 1 -q:v 1 out.png`, then
`Read` it) before calling the render done. A 2-second-interval sweep across the whole runtime is
cheap and catches problems a single mid-frame check would miss.

## Durable pitfall: hand-built frame elements must independently clear the caption band, not just the caption system itself

Rule 3 above (`check_caption_safe_zone.mjs`) verifies the CAPTION BOX itself sits in Instagram's
safe zone — it does not, and cannot, know that a frame's own hand-built element (a stat tag, a
kicker line, a wordmark) happens to sit at the same y-coordinates the caption band occupies
(68%-84% of frame height, i.e. `y≈1306-1613` at 1080x1920 per `captions.html`'s own
`--cap-band-top`/`--cap-band-height` tokens). On `hyperframes-your-agent-cant-do-anything`, THREE
separate hand-built elements across two frames (`03-name.html`'s kicker + wordmark,
`05-escalation.html`'s stat-tag pill) were positioned inside that exact band, producing a
double-exposure garble with the live word captions for as long as both were on screen — not a
transient crossfade blend, a real multi-second collision. **Standing rule going forward: when
placing any frame-owned text/pill/badge below roughly `y=1300` at 1080x1920, check it against the
caption band's real bounds (`1920 * 0.68` to `1920 * 0.84`) and keep it clear, same as the
existing top/bottom/right IG-chrome exclusions above** — this is a 4th exclusion zone (the
caption band itself, whenever captions are live for that frame, which is effectively always on
this channel) that Rule 3 doesn't cover because it only inspects the caption renderer's own
position, not everything else sharing the canvas. No mechanical gate exists for this yet; a
future `check_caption_safe_zone.mjs` extension that also scans each frame's own hand-built
element positions against the band would close this gap for good.

## Durable pitfall: a `data-composition-src` mount's own `place-items:center`-driven content does not reliably land inside its host div's declared CSS box, and `data-width`/`data-height` on the host div do not fix it

Two mounts on `hyperframes-your-agent-cant-do-anything` (`count-up.html` inside a `700px`-top/
`520px`-tall host box; `native-notification-pop.html` inside a `0`-top/`900px`-tall host box)
both rendered their internally-centered content dozens to hundreds of pixels away from where the
host div's own CSS box would put it — confirmed via precise grid-overlay frame extraction, not
guesswork (count-up's "1,000+" landed at `y≈1500-1770` against a nominal `700-1220` box;
native-notification-pop's decorative card landed at `y≈710-1205` against a nominal `0-900` box).
**Explicitly adding matching `data-width`/`data-height` attributes to the host mount div had
ZERO effect on either** (tested: re-rendered, re-measured, pixel-identical to before) — this is
NOT the same fix that worked for `halftone-field` in Rule-adjacent pitfalls elsewhere in this
doc, because that component explicitly reads `root.dataset.width`/`height` in its own JS to size
a canvas/WebGL context, while `count-up` and `native-notification-pop` rely purely on CSS
`container-type:size` + `place-items:center`, and something in this pipeline's mount chain
breaks that containment for at least these two components in a way `data-width`/`data-height`
attributes don't touch. **Root cause not diagnosed. Practical fix that DOES work**: don't trust
the host div's declared box to predict where content lands — render once, measure the real pixel
position via a grid-overlay ffmpeg extraction (`drawgrid` + `drawtext` filters, see this
session's technique), then adjust the host div's `top`/`height` by the empirically observed
offset and re-measure. Treat every new `place-items:center`-style mount on this channel as
suspect until measured this way at least once.

## Durable pitfall: a `data-composition-src` mount held past its own declared `data-composition-duration` goes blank for a FIXED-envelope component, but scales gracefully for an ELASTIC-HOLD component — read the component's own script before assuming either

Two components hit the "mounted longer than native duration" bug this episode with different
outcomes: `trust-strip` (native `data-composition-duration="3.5"`, mounted `4.3s`) went
completely blank past `3.5s` — its script authors a FIXED-length reveal sequence with nothing
scheduled after it ends, so GSAP simply holds the timeline's last authored state, which happens
to already be faded/empty by then. `count-up` and `native-notification-pop`, by contrast, both
explicitly read `root.dataset.duration` and compute `HOLD = duration - IN - OUT`, filling that
entire span with either continued drift (`count-up`) or a deliberately static settle
(`native-notification-pop`) — mounting either one 2-2.5x past its own "native" `3`-second default
(as this episode did, `7.32s` and `5.691s` respectively) is by design and renders correctly the
whole time. **Before assuming a long mount duration is either safe or broken, read the
component's own `<script>` for `root.dataset.duration` usage**: if it's read and used to scale an
elastic `HOLD` span, longer-than-native mounting is fine; if the component's timeline is a fixed
sequence with no such read, cap the mount at (or under) its declared
`data-composition-duration` and hand any remaining runway to something else, per the existing
`constellation-hub` entry elsewhere in this doc.

## Durable pitfall: `constellation-hub`, mounted two composition-src levels deep, only ever paints its first node — a real nested-mount compositing failure, not a timing or variable-passthrough issue (2026-08-25)

Found on `hyperframes-your-agent-cant-do-anything` Frame 4, flagged directly by the user watching
the real delivered video ("that workflow is showing half only"). The prior fix for this same
component (capping the mount under its native duration, see the entry above, plus editing its
`hub_label`/`nodes` defaults directly per `data_variable_values_unreliable_at_nested_mount`) was
necessary but not sufficient — even correctly capped and with matching defaults, a real
full-resolution ffmpeg extraction across the ENTIRE mount window showed only the first node
(the one at the "top" angle) and its connector line ever painted. The hub badge and the other 3
nodes never appeared, and the frame looked identical at every sampled timestamp across the whole
window — ruling out a reveal-in-progress read (this isn't "caught mid-animation," nothing after
node 1 ever rendered).

**What isn't the bug**: built a standalone test harness — the component's own template + script,
extracted verbatim, dropped into a plain page with a host `<div>` sized to the exact same 900×780
px box as the real mount, `window.__hyperframes.getVariables` stubbed to return the exact same
variable values, `root.dataset.duration` set to the exact same `4.2`. Ran the real GSAP timeline
to `progress(0.6)` and read `getBoundingClientRect()` on every node: all 4 positioned correctly
in a cross layout around the hub, all `opacity: 1`. The component's OWN code is correct in
isolation — this only breaks under the real render pipeline's actual nested-mount compositing
(`index.html` → `04-walkthrough.html` → `constellation-hub.html`, two `data-composition-src`
levels deep), the same mount depth every other confirmed-blank component on this project's
blocklist shares (`data-chart`, `mk-progress-stat`). Root cause inside the render engine itself
is still unknown — this project's tooling can't instrument the actual headless-capture pass to
say more than "some subtree work past the first painted element doesn't make it into the
captured frame."

**Fix**: stop mounting `constellation-hub` as a nested `data-composition-src` sub-composition at
all — moved from this project's `data_variable_values_unreliable_at_nested_mount` list (a
narrower "variables don't reach it" characterization) to the hard `blocked` list in
`registry_blocklist.json`, same tier as `data-chart`/`mk-progress-stat` ("no known working fix
-- do not mount this way"). Replaced with a hand-built equivalent: the identical hub+4-node cross
layout and connector-draw motion, built as plain positioned `<div>`s and an inline `<svg>` with
`getTotalLength()`-driven line draws, tweened directly on the frame's own outer timeline — no
sub-mount, no container-query sizing, so this entire render-engine failure class doesn't apply.
Logged as `hand-built-bug-workaround(constellation-hub)`, exempt from the registry ratio per
Rule 1's existing fourth tier.

**Takeaway for any future hub/spoke, radial, or multi-node registry device**: a component that
renders correctly in an isolated same-size harness but only partially in the real nested render
is a DIFFERENT failure than a timing or variable-passthrough bug, and capping duration or fixing
variable defaults will not fix it. If a registry component needs a hub/spoke or multi-element
radial layout, check whether it's mountable as a DIRECT frame-level sub-composition (one level
deep) before reaching for a nested one — or default to hand-building that specific shape from the
start, since this project now has two independently-confirmed cases (this one, plus the general
`data-chart`/`mk-progress-stat` pattern) of nested mounts silently dropping most of their own
subtree in the real render.

## Durable pitfall: this channel's caption-band/safe-zone rules are Instagram-vertical-specific, not general -- skip them (with a logged reason) on a landscape episode, don't force-fit the math

Found 2026-08-26 building `hyperframes-7-skills-claude-code-wasnt-enough`, this channel's
first landscape (1920x1080) episode, built for YouTube long-form. Both
`check_caption_band_collision.mjs`'s 68-84% band and `check_caption_safe_zone.mjs`'s
bottom-margin math exist specifically because Instagram Reels overlay real UI chrome
(caption/username/audio row, the right-edge like/comment/share/save icon column) on top of
the bottom ~300px of a 1080x1920 vertical video. A 1920x1080 YouTube video has no
equivalent overlay in that position -- there's no platform chrome sitting on top of the
frame the same way. Running either check against a landscape episode would be testing the
video against a constraint from a completely different platform's UI, not a real
constraint of the format actually being produced for.

**Fix**: use the skip-reason accountability gate (`pipeline.mjs`'s
`checkSkipAccountability`) to skip both checks on a landscape episode, with the reason
written into STORYBOARD.md, same as `hyperframes-7-skills-claude-code-wasnt-enough` does.
Do not attempt to "port" the 68-84%/bottom-margin math to landscape dimensions -- there is
no real YouTube-chrome-overlay constraint to port it to. If a landscape-specific safe-zone
concern ever does surface (e.g. YouTube's own end-screen element placement in the last
5-20s, which DOES occupy real screen space), that would be a genuinely new check built for
that real constraint, not a reuse of the Instagram one.

## Durable pitfall: multiple paste-in components in one frame need ONE consolidated `<script>` tag, not one per component, or `check_static_gaps.mjs` silently checks the wrong one (2026-08-26)

Real bug on `hyperframes-7-skills-claude-code-wasnt-enough`: pasting a registry component's full
snippet (its own `<script src="gsap">` + `<script>(iife)</script>` pair, copied verbatim from the
standalone registry file) directly into a frame produces a file with MULTIPLE `<script>` tags —
one pair per paste-in, plus the frame's own outer script. `check_static_gaps.mjs`'s frame-duration
match is `text.match(/<script>([\s\S]*?)<\/script>/)` with **no `/g` flag**, so it only ever reads
the FIRST `<script>...</script>` in the file — the first pasted-in component's own internal
timeline, not the frame's own outer `tl`. Every one of the frame's own (fully literal, real,
already-correct) caption/tag tweens were invisible to the checker; it reported one giant
0-to-full-duration gap on 7 of 9 frames, indistinguishable at a glance from a genuinely broken
frame. Two-frame control group (03-humanizer, 08-office-skills — no paste-ins, one script tag)
reported real, specific, actionable per-gap output immediately, which is what made the pattern
obvious.

**Fix**: strip every paste-in's own `<script src="...">` tag (the mount runtime already provides
a global `gsap` — confirmed by every real reference frame using this convention already never
including a src tag), and merge ALL inline script bodies — every paste-in's own IIFE plus the
frame's own outer script — into ONE `<script>` tag per frame, in document order. Each paste-in's
IIFE is already function-scoped, so simple concatenation is safe: no shared top-level
`const`/`let`/`var` collides across them. This is also the shape every already-working reference
frame from other episodes used (e.g. `hyperframes-ai-cant-grade-its-own-homework`'s `01-hook.html`
paste-in) — the multi-script-tag shape only ever appeared when copying a component's ENTIRE
original file verbatim instead of just its logic.

## Durable pitfall: paste-in windowing (`class="clip" data-start/data-track-index`) belongs on the element carrying `data-composition-id`, not its inner `-clip` descendant (2026-08-26)

`check_paste_in_wiring.mjs`'s own "Check 2" names this directly, but it's easy to get backwards
by analogy with `assemble-index.mjs`'s flat-timeline model: EVERY `class="clip"` element in a
frame — regardless of DOM nesting depth — shares ONE flat, frame-absolute time/track space for
overlap-checking purposes (confirmed real: a paste-in's own internal `-clip` div left at its
original relative `data-start="0"`/`data-track-index="0"` collides with the frame's own full-span
background layer, which also legitimately owns track 0 from time 0). The instinctive fix — move
the real absolute `data-start`/`data-track-index` onto that inner `-clip` div, since it's the one
whose class literally is `clip` — is exactly backwards. The correct shape: add
`class="clip" data-start="<absolute>" data-track-index="<free lane>"` to the OUTER element that
carries `data-composition-id` (the mount root itself, e.g. `#f2-ctr-root`), and reset the inner
`-clip` descendant back to `data-start="0"` on a different free track (still needs its OWN
distinct track if multiple paste-ins share a frame, so their local-zero windows don't collide
with each other or the frame's own literal-time elements sitting at t=0). Get this backwards and
`check_paste_in_wiring.mjs` fails with the exact message quoting which element and where to move
it — read that message literally, it names the correct target.

## Durable pitfall: a plain-object GSAP tween target (`gsap.to({value:0}, {...})`) trips `hyperframes check`'s `unscoped_gsap_selector` rule under a generic, non-diagnostic label (2026-08-26)

Real, reproducible on THIS channel's install of `decline-chart` and `mk-usage-arc` (both official
registry components, unmodified until this fix): each drives a derived value (a chart's progress,
an arc's percentage) via the common GSAP pattern `var proxy = {value: 0}; tl.to(proxy, {value: 1,
onUpdate: () => /* write proxy.value into several real DOM properties */})`. `hyperframes check`'s
lint flags this as `unscoped_gsap_selector`, quoting a synthetic, non-literal label (`"dwell/hold"`
seen twice, `"proxy → style.opacity"` seen once) that does NOT appear anywhere in the source —
confirmed by exhaustive grep across the raw file, the assembled `index.html`, and the original
registry source. The label is the tool's own internal placeholder for "a tween target that isn't a
DOM element or a CSS-selector string," not a real selector it found; the fix hint ("scope the
selector") is nonsensical for a plain-object target, another tell that this is a heuristic
misclassification, not a real cross-composition-bleed risk (closures already keep these targets
private — the underlying concern the rule exists for doesn't actually apply here).

**Real fix, applied to both `decline-chart.html` and `mk-usage-arc.html`'s installed copies**:
replace `var proxy = {value: 0}; tl.to(proxy, {value: end, onUpdate: () => useProxy(proxy.value)})`
with a tween that targets a REAL DOM element already in scope (e.g. the value-display element
itself) and reads the tween's own eased position via `this.progress()` inside a plain `function` —
never an arrow function, which doesn't bind `this` — onUpdate: `tl.to(realElement, {duration, ease,
onUpdate: function () { useValue(this.progress() * end); }})`. Same visual result, zero behavior
change, and the lint clears. `code-terminal-run`'s caret-blink (`var blink = {p:0}; tl.to(blink,
{p: ..., onUpdate: () => caretEl.style.opacity = Math.sin(blink.p) >= 0 ? "1" : "0"})`) hit the
same rule and was fixed the same family of way (a deterministic `tl.set` loop landing hard on/off
opacity values at each half-period, no proxy object at all) — but ALSO independently flagged
`gsap.set(outputElements, {opacity: 0})` (an ARRAY of real DOM nodes passed directly as a GSAP
target) under the identical rule; converting that one line to `outputElements.forEach(el =>
gsap.set(el, {...}))` did not clear it, and after a full source audit found no further plain-object
or array targets anywhere in the component, this specific instance was left unresolved and the
component was swapped out of the episode entirely instead of continuing to guess against an
opaque, non-literal-backed heuristic — see the schema-vocabulary log's 2026-08-26 entry for
`hyperframes-7-skills-claude-code-wasnt-enough`. If a future episode hits the exact same message on
`code-terminal-run` again, treat it as a known open case, not a new bug to re-diagnose from
scratch.

## Durable pitfall: a frame file with sibling `<template data-slot="...">` tags for a paste-in's custom slot content can make `hyperframes check`'s sub-composition validity check misidentify the frame's own root — remove the slot templates rather than debug the parser (2026-08-26)

`browser-device-stage`'s own documented slot convention (`<template data-slot="browser-device-
stage-screen">`, placed at "host document level" per its own header comment) produced a real,
reproducible `root_missing_composition_id` + `root_missing_dimensions` error pair from `hyperframes
check` when two such slot templates sat as siblings inside the frame's own outer `<template
data-composition-id="...">` wrapper — even though the frame's own `#root` div, with fully correct
`data-composition-id`/`data-width`/`data-height`, was right there as a normal sibling after them.
Confirmed NOT about nesting depth, NOT about the paste-in's own `class="clip"` windowing attributes
(both were independently ruled out by direct test), and NOT reproducible with a control file that
had the same two elements as plain non-`<template>` divs with identical content — only reappeared
once they were genuine `<template>` tags again. The tool's internal `checkSubCompositionUsability`
re-wraps and re-parses the frame's inner content through its own lightweight HTML parser twice
(`compDoc.querySelector("template")` → `.innerHTML` → re-parse), and something in that double
round-trip loses track of `data-composition-id` specifically when the content contains additional
sibling `<template>` elements — root cause not fully isolated within a reasonable time budget, but
the trigger (sibling slot `<template>` tags) is now confirmed and reproducible. **Practical fix**:
don't use the custom-slot-content mechanism for `browser-device-stage` (or any component with the
same "caller templates at host document level" convention) inside a `hyperframes-<slug>` episode
frame — let it render its own default token-styled skeleton screens (still a real, working device,
just without the caller's custom screen content) rather than risk this failure mode. If a future
episode genuinely needs the custom-slot content badly enough to be worth more investigation time,
start by bisecting whether ANY sibling `<template>` (not just `data-slot`-flavored ones) triggers
it, using a minimal reproduction file outside a real episode.

## Durable pitfall: a full-length, many-paste-in render can genuinely exceed `hyperframes render`'s default 45s per-composition player-ready timeout under real multi-worker load — raise `--player-ready-timeout`, don't assume a content bug (2026-08-26)

Real, confirmed on `hyperframes-7-skills-claude-code-wasnt-enough` (this channel's first full-
length episode, ~40+ real paste-in/registry mounts across 9 frames, 5 parallel Chrome capture
workers): two consecutive full renders both completed with `[WARN] ... warningCodes:
["sub_timeline_readiness_timeout"]` / `Sub-composition timelines did not become ready within
45000ms`, and specific compositions (`mk-usage-arc`, `number-wheel`, `browser-device-stage`)
visibly mis-rendered in the ACTUAL video — `mk-usage-arc`'s gauge rendered pinned to the
top-left corner instead of its real inline-styled position, `number-wheel`'s ticker rendered
completely invisible, `browser-device-stage`'s entire device chrome vanished ~9s into a 27s
mount with only the `simulated-cursor` overlay surviving. All three looked like real content
bugs (missing CSS, bad positioning) and `mk-usage-arc`'s CSS genuinely WAS missing at first —
but after fixing that, the SAME top-left-corner mis-position persisted in a THIRD full render.
The decisive test: `npx hyperframes snapshot . --at <timestamp> --timeout 60000` (a single
synchronous page load, no parallel-worker race) rendered the exact same composition PERFECTLY
positioned and styled — proving the content/CSS was correct and the bug was a genuine capture-
time race under multi-worker load, not fixable by editing HTML/CSS at all.

**Real fix**: `hyperframes render` has a dedicated flag for exactly this —
`--player-ready-timeout <ms>` (default 45000; env `PRODUCER_PLAYER_READY_TIMEOUT_MS`) — "Timeout
in ms for the composition player to become ready. Increase for complex compositions on slow
hardware." A full-length episode with dozens of real registry mounts competing for capture
resources across parallel workers is exactly the "complex composition" case this flag exists
for. Bump it (this episode used 180000, 4x default) and re-render before spending any more time
debugging positioning/visibility on a component whose snapshot already proves it renders
correctly in isolation. Two adjacent flags exist for the same class of "heavy composition on this
machine" problem and are worth knowing: `--browser-timeout` (Puppeteer's page.goto navigation
timeout, default 60s — a DIFFERENT budget than player-ready) and `--protocol-timeout` (CDP
protocol timeout, default 5 min). **Diagnostic order for a "component X isn't rendering right in
the real render" bug going forward**: (1) re-read the component's actual embedded CSS/markup for
a real content bug first (this DID catch a genuine missing-CSS bug here), (2) if content looks
correct, snapshot that exact timestamp in isolation before assuming the content fix didn't work —
a snapshot mismatch against the full render is the tell that this is a render-timing issue, not a
content one.

## Known unresolved issue, shipped anyway per direct instruction: `browser-device-stage`'s device chrome vanishes ~9s into a 27s mount and never returns (2026-08-26)

Confirmed real and NOT a capture race (a `hyperframes snapshot` at the exact timestamp, single
synchronous load, shows the same empty result) across three full render attempts on
`hyperframes-7-skills-claude-code-wasnt-enough` Frame 6, even after `--player-ready-timeout
180000` (4x default) — the SAME `sub_timeline_readiness_timeout` warning fired at the SAME
elapsed-wait length every time, meaning something is never signaling ready at all, not just
slow. Real symptom: the browser chrome (settled in correctly, confirmed via snapshot at
mount-relative ~3s) is completely gone by mount-relative ~9s and stays gone through the
19.46s `swap_at` and to the end of the 27.2s mount — narration, captions, and the
`simulated-cursor` overlay (a separate paste-in riding the SAME host timeline) keep running
normally throughout, so this is specific to `browser-device-stage`'s own internal timeline/DOM,
not a frame-wide failure. Working theory, NOT confirmed: this is the longest single paste-in
mount duration used anywhere on this channel to date (27.2s vs. a ~10.83s prior max for
count-up) and the render engine's own readiness-retry logic may re-run the component's mount
IIFE a second time after deciding the first attempt didn't signal ready fast enough — since
`browser-device-stage`'s init does a synchronous `gsap.set(stage, {opacity: 0, ...})` OUTSIDE
its own `tl` (matching the exact "runs immediately, not on a timeline seek" pattern that would
explain a one-way, permanent hide with no error and no visual glitch), a second real IIFE
execution would silently re-hide the stage while the original (visually working) timeline
reference is orphaned. Not verified — the fix this implies (split one long mount into several
shorter ones, all under roughly the same duration ceiling every other working paste-in on this
channel has stayed under) was NOT attempted this session per direct instruction ("ship as-is,
fix later" — the cost of another ~20-25 min render cycle to test an unconfirmed theory wasn't
judged worth it against an already very long session). **If revisiting**: try the split-mount
approach first; if that doesn't reproduce the failure, the duration theory holds and the fix is
mechanical (duplicate the paste-in block, unique composition-id/timeline-key/track per instance
per the collision durable-pitfall above, cut instead of `swap_at` between them).

Also confirmed same session: `mk-usage-arc`'s percentage counter (`.mk-arc-num`) stays frozen
at its initial value through its whole mount, even after switching from an `onUpdate +
this.progress()` read to the same deterministic `tl.set`-per-frame-step technique that fixed
`count-up`'s identical symptom — root cause not found in the time available (structure and
selector both checked correct). Minor in practice: the surrounding caption already states the
real percentage in text, so the number is redundant, not the only place the fact appears — left
as a known cosmetic gap rather than chasing a second unconfirmed theory in the same session.

## Durable pitfall: a live nested mount going invisible can take the WHOLE parent top-level scene down with it, including the parent's own always-visible plain elements — not just the nested content (2026-08-31)

Confirmed on `hyperframes-notes-into-a-podcast`, Frame 5 (`05-generalize.html`, mounted as a
top-level scene in `index.html`, not nested inside anything else). This frame live-mounted
`radial-surround-2` (a `data-composition-src` component) for its first ~2.4s. Direct user
report ("28 to 31 sec are blank frames") led to a dense frame-by-frame extraction directly from
the real rendered MP4 (both the raw `video.mp4` and the 1.1x-sped `video_rushed.mp4` — same
window, proportionally, in both, ruling out the speedup re-encode as the cause). Found: from
roughly local frame-time 3.0s to 5.8s (well AFTER the nested `radial-surround-2` mount's own
0.4-2.8s window had already ended), the ENTIRE frame went blank — not just the expected
hand-built label that should have appeared at 2.9s, but the frame's own `#f5-bg`/`#f5-glow`
divs too, plain `class="clip"` elements with no nested mount involvement at all, present and
correctly authored in the frame's own HTML from `data-start="0"` for the frame's whole
duration. The outer page's own ambient background showed through instead — meaning the
frame's `#root` itself was not being composited for that ~2.8s stretch, not just one child
element within it.

**This is a broader failure surface than every previously-logged nested-mount pitfall in this
file**, which were all about content invisible WITHIN an otherwise-fine parent (`browser-device-
stage`'s chrome vanishing, `comparison-split`/`spring-pop` going invisible past ~3.5s while the
frame around them stayed fine). Here the parent frame's own unrelated, non-mount content
vanished too, well after the risky nested mount had already finished its own window. Root cause
not confirmed (this is a capture/compositing-pipeline issue, not something visible in the
frame's own HTML/CSS/JS) — but the practical, now-proven fix: **don't rely on a live
`data-composition-src` mount at all for a beat that needs multi-second reliability. Hand-build
the equivalent visual directly on the frame's own timeline** (plain divs + GSAP, no nested
mount) exactly as already established for `browser-device-stage` avoidance elsewhere in this
file. Frames 3 and 5 were rewritten this way — a center card + staggered chip pills, styled to
match `radial-surround`'s visual language, built with zero `data-composition-src` — and a
`registry(shimmer-sweep)` utility pass (a paste-in component, not a mount, so it carries none of
this risk) kept genuine registry credit on both frames without touching the broken mount class.
`radial-surround` and `radial-surround-2` were removed from the project entirely rather than
kept capped-and-hoped; this failure was not fixed by capping duration the way the earlier
~3.5s-family bugs were (the gap here started well after the cap already applied).

**Standing rule going forward**: treat ANY live nested `data-composition-src` mount as carrying
this risk, regardless of how short it's capped — the previously-assumed "cap it short enough
and it's safe" mitigation is not fully reliable. Prefer hand-building over a nested mount for
any beat where reliability matters more than the marginal registry-ratio credit, and always
verify with a real dense frame extraction from the actual rendered MP4 (not `hyperframes
snapshot`) across the WHOLE runtime, not just spot-checks near known mount boundaries — this bug
sat well outside every mount window this session had been treating as the risk zone.

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
- [YYYY-MM-DD] <episode-slug>: Frame 1 registry(`item-name`); Frame 2 hand-built(<device>) — <why no registry block covers it>; Frame 3 screenshot(<real source>); Frame 4 hand-built-bug-workaround(`item-name`) — <durable-pitfall reference>; ...
```

Four tags, see Rule 1 above for the full reasoning on why there are four, not two:
`registry(...)` for a frame that installs and uses a real catalog item — name the item.
`screenshot(...)` for a real captured product screenshot at a beat where showing the actual UI
is the point — name the real source (e.g. a URL or "composio.dev homepage"). `hand-built(...)
— <why>` for a frame where a real, documented registry search (state which queries were tried)
confirmed nothing fits. `hand-built-bug-workaround(...) — <durable-pitfall reference>` for a
frame where a real registry item was installed and tried, but a confirmed, already-logged
render-engine bug makes it non-functional — point at the exact durable-pitfall entry. Every
frame number from 1 to the episode's total frame count must appear somewhere in this slug's
bullet line(s), tagged one of the four — the checker fails and names the exact missing frame
numbers otherwise. Only `registry(...)` and plain `hand-built(...)` compete for Rule 1's ratio
target — `screenshot(...)` and `hand-built-bug-workaround(...)` are exempt from it.

**Entries (post-tightening, full per-frame format):**

- [2026-08-31] hyperframes-notes-into-a-podcast: THIRD PASS (supersedes Frames 3, 5, and 7 of
  the second-redo entry below; Frames 1, 2, 4, 6 unchanged from it) -- direct feedback: a real
  blank window at ~28-31s in the delivered render, confirmed via dense frame extraction to be
  `radial-surround`/`radial-surround-2` taking the whole parent scene down with it (see this
  file's matching durable-pitfall entry and the registry blocklist's new `radial-surround`
  entry) -- both components removed from the project entirely. Frame 3 and Frame 5 rewritten as
  hand-built clusters (center card + staggered chip pills, plain divs + GSAP on the frame's own
  timeline, no `data-composition-src` at all) + registry(`shimmer-sweep`) utility pass on the
  center card for genuine registry credit without the mount risk -- same real content as before
  (Frame 3: "One project" + 40-page report/Article 1/2/3; Frame 5: "Anything you read" + class
  readings/contracts/meeting notes). Also, direct instruction: CTA changed from the prior pass's
  real-actionable-steps close ("Free at notebook.google") back to this channel's DEFAULT comment-
  keyword gate ("Comment notebook, I'll send the setup guide") -- an explicit, scoped override of
  this series' own real-actionable-steps CTA convention for this one episode; VO Line 7 rewritten
  and the whole episode's VO regenerated as a fresh single take (changes every frame's exact
  duration slightly). Frame 7's `spring-pop` rebaked again (schema+JS) to "Comment: notebook".
  Registry ratio unaffected: still 6/6 non-exempt slots registry-tagged (100%), since
  `shimmer-sweep` replaces `radial-surround`/`radial-surround-2` as Frames 3 and 5's registry
  device. Verified via dense real-frame extraction across the WHOLE runtime this time (not just
  spot-checks near known mount boundaries) on the actual rendered MP4, per this entry's own
  standing-rule addition to the durable-pitfalls doc.

- [2026-08-31] hyperframes-notes-into-a-podcast: SECOND REDO (RETIRED for Frames 3/5/7, see the
  THIRD PASS entry above -- Frames 1/2/4/6 below are still current; supersedes the earlier
  same-day first-redo entry, whose distinct content -- `titlecard-lockup`, `stagger-cascade`,
  `state-chip-rail`, `spring-pop-2` -- is retired along with those files; full text in git
  history on this file) -- direct feedback: "CTA is missing, choice of visuals are very poor,
  check library and add more motion graphics, use actual google notebook logo or add appropriate
  screenshot". Also caught and fixed a real, unrelated fact error before locking: the product has
  been rebranded NotebookLM -> "Gemini Notebook" (verified live via headless capture of
  notebook.google and its /app page, not memory -- confirmed with the user via AskUserQuestion
  before touching VO). Script, VO, and every frame updated to the new name; real how-to URL
  corrected to the actual bare domain `notebook.google` (no `.com`, no `lm`), confirmed by
  direct navigation. Real assets captured via the documented headless-Chrome-CLI fallback
  (`docs/hyperframes_production_notes.md`'s own durable-pitfall entry for when the interactive
  Browser pane can't composite) into `assets/screenshots/`: `logo_lockup.png` (real wordmark+icon,
  cropped from the marketing header), `phone_hero.png` and `phone_tight.png` (real in-app UI --
  the notebook list with Audio Overview play buttons -- cropped from the official app-download
  page's device mockup). All three placed on the black v3 ground inside a light `#F7F8FA` rounded
  card (real screenshot content stays unedited; only the surrounding chrome is hand-built), per
  the standing "screenshots over generic mock UI" rule -- no image editing/background removal
  attempted. Full catalog re-read for stronger motion-graphic variety; installed `radial-surround`,
  `shimmer-sweep`, plus two now-abandoned installs (`weight-wave`, `logo-outro`) removed before
  wiring -- `weight-wave` because its internal duration-passthrough behavior when mounted as a
  fixed-size block inside a short (~2.4s) window was untested and risky given this episode's own
  nested-mount history; `logo-outro` because its SVG paths are literally Figma's own logo geometry
  (hardcoded piece shapes), not a generic reusable mark, so repurposing it for a different brand
  would have meant redrawing a competitor's mark under a real one's name -- correctly not reused.
  `constellation-hub` was NOT used per its own hard-block entry below. `locked-nucleus-orbit`
  was installed, then dropped before wiring: its satellite chip text is hardcoded
  (`signal/motion/frames/output/sync/lock`) with no variable to override per-chip content, so it
  could not carry this episode's real "class readings / contracts / meeting notes" content --
  logged here so a future episode doesn't reach for it expecting labeled satellites.
  `browser-device-stage` was deliberately NOT used despite fitting the "show a real screenshot in
  device chrome" need -- its own durable-pitfall history in this file includes an UNRESOLVED,
  shipped-anyway bug (chrome vanishes ~9s into any long hold) on top of the hardcoded-duration and
  nested-mount-invisibility issues already logged for it; a plain hand-positioned `<img>` with a
  continuous push-zoom (no nested mount at all) sidesteps every one of those failure classes and
  is what actually shipped.

  Frame 1 registry(`notification-pileup`, capped 3.5s) + registry(`shimmer-sweep`, utility accent
  on the headline payoff, paste-in, no mount risk). Frame 2 screenshot(real Gemini Notebook logo)
  + registry(`shimmer-sweep`) sweeping it -- replaces the prior build's hand-built/registry
  wordmark entirely. Frame 3 (SUPERSEDED, see the THIRD PASS entry above -- was a now-removed
  registry item, now registry(`shimmer-sweep`) over a hand-built cluster). Frame 4
  registry(`comparison-split`, capped 3.5s, unchanged from the prior
  build) + screenshot(real Gemini Notebook app, the Audio Overview play-button list -- literally
  "two AI hosts") replacing the prior build's abstract "AI 1 / AI 2" avatar card, continuous
  push-zoom through the whole hold, plus a mid-hold pill badge as the required second new element.
  Frame 5 (SUPERSEDED, see the THIRD PASS entry above -- was a second, forked instance of that
  same now-removed registry item, now registry(`shimmer-sweep`) over a hand-built cluster). Frame 6
  registry(`typed-prompt`, capped 3.5s, retyped to the corrected `notebook.google` domain) +
  screenshot(real Gemini Notebook app, the Create-new-notebook flow) replacing the prior build's
  abstract "Generate ->" badge entirely, continuous push-zoom. Frame 7 (SUPERSEDED, see the THIRD
  PASS entry above -- CTA text changed from "Free at notebook.google" to the comment-keyword
  gate "Comment: notebook"). Every nested mount capped per this file's own thresholds; every
  baked default edited in BOTH the schema `default` and the JS fallback (see the 2026-08-30
  entry on why both are required); verify against real rendered frames pulled from the actual
  MP4, not `hyperframes snapshot`, before calling this build done -- same discipline as the
  first redo (this exact discipline is what caught the THIRD PASS's radial-surround bug).

- [2026-08-30] hyperframes-notes-into-a-podcast (RETIRED, superseded by the 2026-08-31 entry
  above -- kept for history, not current): portrait short (~27s, 4 lines, first episode
  of "The AI Upgrade" series, first episode built with the meme/sticker + motion-graphics
  density direction). Full catalog read against all 4 script beats. Frame 1
  registry(`notification-pileup`) -- literal "forty tabs piling up" overload visual -- plus
  registry(`spring-pop`) as the meme-sticker moment (an emoji badge popping in as a reaction,
  the closest real registry match to "meme sticker" without reproducing a copyrighted meme
  template/character). Frame 2 registry(`number-pop-in`) for the big "02" episode number plus
  registry(`titlecard-lockup`) for "THE AI UPGRADE" series wordmark, plus registry
  (`svg-mask-reveal`) for the "A FREE TOOL" tease beat -- re-read the component's own doc
  comment before assuming it needed a real image asset: `text` IS the wordmark being revealed
  through a traveling sweep, not an external media slot, so no screenshot was needed. Frame 3
  registry(`comparison-split`), capped to a 3.5s mount, for the literal
  old-way/new-way contrast (labelA "Skim for an hour" vs labelB "Two AI hosts, one chat"), plus
  hand-built-bug-workaround(two-AI-hosts avatar+waveform card) for the beat's back half -- real
  snapshot confirmed `comparison-split` goes fully invisible 3.8-4.2s into its own mount, well
  before its own scripted OUT fade, the SAME nested-mount render-engine failure class as the
  already-logged "held past ~5s reliably renders solid black" pitfall (`browser-device-stage`,
  2026-08-23) but with a tighter observed threshold this time -- revised that entry's rule of
  thumb to ~3.5s. Fixed by capping the mount short and hand-building the remainder, plus registry
  (`typed-prompt`) for the real how-to (types "notebook.google.com"). `chat-thread` was
  installed and considered for a "two AI hosts talking" visual but dropped for timing (it's
  a multi-message beat-paced thread, doesn't fit inside this frame's compressed budget) and
  removed rather than left unwired. Frame 4
  registry(`spring-pop`, forked as `spring-pop-2.html` for distinct text) for the resolution
  badge, plus registry(`notification-pileup`) reused deliberately as the loop-back echo of
  Frame 1's same visual (the SAME literal concept recurring on purpose, per the variety bias's
  own reuse exception, not a habit default). 7 distinct registry items across 4 frames.
  `notification-pileup` and `spring-pop` each cover 2 of the 4 frames -- both are the
  variety-checker's advisory reuse case (deliberate loop-echo / same-item-different-instance),
  not a fail.

- [2026-08-27] hyperframes-cavecrew-subagents: portrait short (60s, 7 lines). Full catalog read
  (372 items) against all 7 script beats before picking, biased toward variety per the standing
  bias -- no registry item repeated across frames (the one intra-frame repeat, Frame 5's two
  typed-prompt mounts, is the explicitly-fine same-literal-concept case, two real trigger
  phrases). Frame 1 registry(`radial-surround`) -- "one agent" center card with 3 chips
  (Investigator/Builder/Reviewer) assembling and converging, literal fit for "splits one agent
  into three." Frame 2 registry(`code-scroll`) -- fixed 1920x1080 block, fit-scaled (not
  cover-cropped, unlike halftone-field's use elsewhere -- cropping a code editor's sides would
  cut real text) to a 1080x608 device card for "reads a dozen files hunting a bug." Frame 3
  registry(`code-highlight`) -- same fit-scale mount, highlight band for "just the file and line
  numbers that matter." Frame 4 registry(`code-diff`) for the builder's surgical edit (same
  fit-scale block pattern) plus registry(`state-chip-rail`) for the reviewer's severity flags
  (Low/Medium/High chips, badge on High) -- two distinct devices in one frame for two distinct
  sub-beats (builder, then reviewer), not a repeat. Frame 5 registry(`typed-prompt`) x2 -- "use
  cavecrew" and "delegate to subagent," the real verified trigger phrases (no slash command
  exists; confirmed against the actual cavecrew README before writing this beat, alongside
  catching a contaminated 60%-context stat that belongs to a sibling caveman feature, not
  cavecrew -- excluded). Frame 6 registry(`text-shimmer`) -- single specular sweep on the closing
  reflection line. Frame 7 registry(`cta-lockup`) -- canonical action-line + capsule + microcopy
  CTA lockup, comment-keyword close. `grid-card-assemble` was the first candidate for Frame 1 (3
  cards from one) but is on `registry_blocklist.json`'s elevated_risk list (confirmed blank in 3
  real renders) -- swapped to `radial-surround` before wiring, per the blocklist's own
  landmine-avoidance purpose. code-scroll/code-highlight/code-diff are untested on this channel's
  pipeline (not yet on the blocklist either way) -- flagged here for whoever hits them next: if
  any renders blank, log it to `registry_blocklist.json` immediately, don't just fix it locally.
  **Real bug hit and fixed this episode, add to the
  data_variable_values_unreliable_at_nested_mount list**: every one of the 5 elastic components
  above (`radial-surround`, `state-chip-rail`, `typed-prompt` x2, `text-shimmer`, `cta-lockup`)
  is mounted TWO levels deep (index.html -> frame file -> component file) -- exactly the
  known-broken depth. A real snapshot at t=3.33s on Frame 1 confirmed it directly:
  `radial-surround` rendered its stock demo content ("Your team" /
  Docs,Tickets,Dashboards,Inbox,Chat,Sheets) despite a correct `data-variable-values` attribute
  on the host. Fixed the way the list's own note prescribes -- edited each installed component
  file's own JSON schema default AND JS fallback constant directly instead of relying on the
  attribute. Since two `typed-prompt` mounts in Frame 5 need DIFFERENT baked text ("use
  cavecrew" vs "delegate to subagent") and baking defaults into one shared file would make both
  mounts show the same string, forked a second copy
  (`compositions/components/typed-prompt-2.html`, distinct internal `data-composition-id` too)
  rather than fighting the passthrough bug further. Verified with real snapshots (not just the
  check's informational overflow note) at representative timestamps across all 7 frames -- every
  baked default now shows correctly. Add `radial-surround`, `state-chip-rail`, `typed-prompt`,
  `cta-lockup`, `text-shimmer` to the affected-components list below; this confirms the bug is a
  real two-level-nesting engine characteristic, not specific to the 8 components already logged.

- [2026-08-26] hyperframes-7-skills-claude-code-wasnt-enough: this channel's first landscape
  (1920x1080) full-length (7-8 min) episode — "full treatment" visual density (every registry
  device paired with hand-built connective beats so no >2s static hold survives the frames'
  33-83s real durations, per direct instruction). Frame 1 registry(`radial-surround`) — Claude
  Code center card with 4 real-gap chips cued to real word timestamps, close-in convergence —
  plus registry(`count-up`) for the "Seven of them" reveal, plus hand-built(gap-fix-ship 3-node
  pipeline) for the "someone builds the fix" escalation — catalog checked, no pipeline/flow item
  matched this specific 3-beat "hit a wall / fix built / shipped free" shape as well as a plain
  hand-built node row. Frame 2 registry(`number-wheel`) — rolling token-cost ticker;
  registry(`mk-usage-arc`) — 65% tokens-cut gauge; registry(`decline-chart`) — 33% fewer input
  tokens decline; hand-built(bordered kinetic name card) for the "caveman" skill-name reveal —
  originally `code-terminal-run` (a real, checked, working registry component), swapped out
  same day after it (and, independently, `mk-usage-arc`'s `mkArcIn` helper and `decline-chart`'s
  own progress-object tween) tripped `hyperframes check`'s `unscoped_gsap_selector` rule on a
  plain-object GSAP tween target every one of them used internally; the `mk-usage-arc`/
  `decline-chart` instances were fixed in place (tween a real DOM element and read
  `this.progress()` in `onUpdate` instead of a plain `{value: 0}` proxy object — see both
  files' own source, already patched this episode), but `code-terminal-run` kept tripping the
  same rule under a generic, non-diagnostic "dwell/hold" label pointing at no resolvable literal
  source text even after the same class of fix and a full source audit; swapped to a hand-built
  card (same visual pattern as Frame 4's skill-creator name reveal) rather than keep guessing at
  a tool-internal heuristic. Plus
  registry(`count-up`) for the 101,000-star reveal. Frame 3 registry(`before-after-wipe`) — AI
  commit message vs. humanized commit message comparison, real wipe-reveal. Frame 4
  registry-block(`hw-pipeline`, data-composition-src, relabeled its hardcoded node text from the
  block's own generic "Idea/Record/Shine!" demo copy to "Trigger/Structure/Skill!" to match the
  skill-creator scaffold narrative — the file is this project's own local copy, not shared, so
  editing its CONFIG in place is safe), surrounded by this channel's standard plain-caption
  connective narration (not counted as a separate device — same convention as every prior
  episode's captions, not a chart/pipeline/terminal-class device the registry-first rule targets).
  Frame 5 registry(`tracing-beam`) — names the three cavecrew
  subagents (Investigator/Editor/Reviewer) — swapped in for `constellation-hub`, which the
  blocklist below already confirms hard-broken for nested mounts; plus hand-built(context-bar
  fill/drain + file-tile pile) for the "12 files dumped into context" vs. "just 2 file:line refs"
  contrast beat — catalog checked, nothing in the data-viz category models a context-window
  fill/drain metaphor as directly as a plain bar. Frame 6 registry(`browser-device-stage`) with
  a custom login-form screen slot + success-screen swap (`swap_at`), plus registry
  (`simulated-cursor`) overlay choreographed to navigate/click/type/submit — the actual
  Playwright MCP demo beat. Frame 7 registry(`beat-timeline`) — Planning/Architecture/
  Implementation phase reveal; plus registry(`count-up`) again for the 52,000-star reveal (same
  literal GitHub-star-count concept as Frame 2/Frame 1's "seven", not a habit-reuse — see Rule
  1's variety bias, which explicitly allows this). Frame 8 hand-built(3 file-format cards:
  Word/PowerPoint/Excel, real product colors) — catalog checked (`document file type icons
  reveal grid word excel powerpoint export`), closest hits were generic reveal transitions
  (`stagger-lattice`, `caption-clip-wipe`, etc.), none built for content-specific format icons;
  `mk-specs-list` was considered and explicitly rejected for this frame instead of Frame 8's
  original plan — see the blocklist note below, this avoids the same confirmed-risky
  data-composition-src mount class as two already-blank blocks rather than gambling an
  untested case on a first-of-its-kind full-length render. Frame 9 registry(`count-up`) a third
  time — deliberate bookend to Frame 1's opening "Seven of them," 0->7 again over "Seven real
  problems, seven real people" — plus registry(`cta-lockup`) for the closing comment-keyword CTA.
  Registry blocklist checked before wiring (2026-08-26): `constellation-hub` (hard-blocked,
  confirmed nested-mount failure) and `grid-card-assemble` (elevated-risk, blank 3x) were both in
  the original device plan and swapped out — `tracing-beam` and (for the ORIGINAL Frame 8 plan)
  `mk-specs-list` respectively — before any wiring happened. `mk-specs-list` was then itself
  dropped from the final plan (see Frame 8 above) once its blocklist entry was reread closely:
  "same mount class as the two confirmed-blank blocks above... never actually render-tested" is
  a real risk on a first-of-its-kind long-form render, not worth gambling one frame's own
  render just to avoid a quick hand-built fallback. `browser-device-stage`'s blocklist entry
  (claims a hardcoded `var duration` constant) was checked against the actually-installed file,
  which already reads `root.dataset.duration` correctly — concluded fixed upstream since the
  entry was written, used as planned.
- [2026-08-22] hyperframes-ai-took-over-my-browser: Frame 1 registry(`toggle-flip`,
  `char-slam-explode`, `simulated-cursor` paste-in); hand-built(`radial-burst`) — established v2
  visual-system custom device (registry-checked gap already confirmed and logged under
  "Custom devices built for this channel" above), reused as-is, no new search needed.
  **Revised 2026-08-22, retry after device-variety FAIL**: Frame 1 originally used
  `browser-device-stage` here too, duplicating its Frame 4 content-carrying use (the
  persistent walkthrough screen) — swapped for `toggle-flip` (an "Agent Access" toggle
  flipping OFF→ON, synced so the flip lands on the word "control" at 1.639s), a genuinely
  different registry device that's a literal fit for "I gave an AI agent full control of my
  Chrome browser" as a hand-off/permission-grant beat, distinct from Frame 4's own device;
  Frame 2
  registry(`chat-message`, `strikethrough-replace` paste-in); hand-built(`radial-burst`) — same
  reused device; Frame 3 registry(`matrix-decode` paste-in);
  hand-built(`radial-burst`, real Playwright logo + attribution row) — the logo/text row was
  originally `trust-strip` (registry). **Revised 2026-08-22, direct feedback**: swapped for a
  hand-built row using the real Playwright logo (captured from playwright.dev, same
  headless-chrome CLI method as this doc's durable-pitfall entry) because two separate direct
  CSS overrides on `trust-strip`'s `--ts-tone` never actually took effect (confirmed via
  `/watch` — text stayed dim both times), a real gap in this project's CSS-custom-property
  inheritance into registry-mounted sub-compositions that going hand-built sidesteps entirely
  rather than a third override attempt; also fixed the same feedback's "very small text" —
  subtitle 26px→40px, attribution text 34px (trust-strip's own text had rendered notably
  small). Frame 4 registry(`typed-prompt`,
  `browser-device-stage`, `onboarding-stepper-flow` paste-in, `press-ripple`, `simulated-cursor`
  paste-in, `yt-camera-move` paste-in helpers); Frame 5 registry(`signup-flow` paste-in,
  `typewriter` paste-in, `touch-indicator`, `ui-focus-zoom`); Frame 6 registry(`oversized-cursor`);
  hand-built(single-word "STRANGE." slam) — reuses `caption-kinetic-slam`'s fit-canvas +
  back.out landing mechanic by hand instead of mounting the registry component directly, since
  that component ships in Anton (no `@font-face` declared in this project, same substitution
  already used on prior episodes) and this beat needed a single word in portrait/Inter to match
  the rest of the episode; Frame 7 registry(`cta-close`).

- [2026-08-23] hyperframes-ai-cant-grade-its-own-homework: full-catalog read against all 7
  script lines before authoring (per the 2026-08-21 discovery rewrite), zero hand-built devices
  needed. Frame 1 registry(`state-chip-rail`) — literal fit for "every stage lied," a pipeline
  status rail; Frame 2 registry(`chat-message`) — literal fit for "ask an agent... it will tell
  you yes," a received bubble replying yes; Frame 3 registry(`ticker-takeover`) — name-reveal
  beat, ticker locks on "INDEPENDENT VERIFICATION" and promotes to full-frame headline; Frame 4
  registry(`code-terminal-run`, `oscilloscope-trace`, `success-check`) — three distinct devices
  for the three real examples (a source-check terminal command, a literal audio-waveform
  clipping trace, a checkmark that gets struck through as false); Frame 5
  registry(`camera-scan-gate`) — literal fit for "the supervisor... checked the real files
  itself," a scan/verify gesture; Frame 6 registry(`titlecard-calm`) — restrained single-line
  reflection beat; Frame 7 registry(`cta-close`) — reused from a prior episode's Frame 7 (same
  literal end-card concept, not a variety violation). **`cta-close` has a confirmed pitfall
  logged above** (renders its own default demo content instead of supplied
  `data-variable-values` at this nesting depth) — edited its own declared JSON default AND JS
  fallback constant to the real "Follow for more real AI agent breakdowns" text before ever
  mounting it, per that entry's mandatory-first-step fix, then verified with a real snapshot.

- [2026-08-21] hyperframes-lead-gen-sales-agent: the first real validation episode for the v2
  visual system, see "Standing visual defaults" above. **Superseded 2026-08-21, second direct
  feedback round** ("that badge is of no fucking use... scour hyperframes library") — every
  `glossy-circle-badge` mount (Frames 1, 5, 6) dropped from the episode entirely and the now-
  unused files (`glossy-circle-badge.html` + `-a`/`-b`/`-f6` forks) deleted, replaced by a
  fresh 10+-query registry scour and a designer-approved plan, approved before implementation.
  **Final shipped device accounting** (per-frame, replaces the entry below it): Frame 1
  registry(`headline-slam` forked as `headline-slam-hook`, `native-notification-pop` forked as
  `native-notification-pop-f1`, `radial-burst`, `badge-pop` paste-in); hand-built(`.f1-lead-card`
  + `.f1-lead-stamp` — lead-intake card with a checkmark stamp, literal for "finds your leads,
  qualifies them"). Frame 2 registry(`native-notification-pop` forked as
  `native-notification-pop-f2`, `mk-usage-arc` paste-in, `radial-burst`); hand-built(`.f2-wait-
  pill` — "Still unanswered, 3 days later"); dropped `sketch-icon-square-bolt`/`-star` (a
  lightning bolt reads as FAST, backwards for a "too slow" beat — swapped for the real
  notification + wait pill instead). Frame 3 registry(`headline-slam` forked as `headline-slam-
  name`, `radial-burst`); hand-built(`.f3-code-card` — code brackets + a red strike-through SVG,
  literal for "without writing a single line of code"); dropped `sketch-icon-square-agent`.
  Frame 4 hand-built(real-screenshot card mount, now a 3-way sequential swap — alert, digest,
  AND a third card, the live pipeline dashboard, all captured from lindy.ai/use-cases/sales via
  the headless-chrome CLI method in the durable-pitfall entry above; added the third card and
  the `yt-camera-move` tail punch-in on it after "use more visuals" feedback); registry
  (`sketch-icon-square-check` x2 — the second instance properly forked to `sketch-icon-square-
  check-2.html` with a matching internal id, `sketch-icon-square-arrow`, `sketch-icon-square-
  star`), all four now positioned via a plain `.f4-icon-wrap` wrapper div rather than classes on
  the sub-composition host itself — see the durable-pitfall entry below on why; hand-built
  (`.f4-sort-pill` — WARM/COLD flip). Frame 5 hand-built(`.f5-toggle-card` — approval toggle
  switch, "Outside impact waits for you"; `.f5-flag-tag` — "Flagged for review", added to bridge
  a ~6s dead-black gap between the toggle card and the approve card, caught only via `/watch` on
  the real render, not `hyperframes check`; `.f5-approve-card` — real two-button Approve/Reject
  request card, literal for "waits for you to approve it first"); registry(`mk-usage-arc` paste-
  in — Control gauge, `radial-burst`); dropped `glossy-circle-badge` x2 and `sketch-icon-square-
  check`. Frame 6 registry(`headline-slam` forked as `headline-slam-reflection`, `radial-
  burst`); hand-built(`.f6-id-card` — a real ID/employee-badge card, "Lindy · SALES REP", literal
  for "hiring your first sales rep"); dropped `glossy-circle-badge-f6`. Frame 7
  registry(`cta-close`), unchanged throughout. `headline-slam`, `native-notification-pop`, and
  `sketch-icon-square` each forked into per-instance-content copies (unique composition-id/
  timeline-key, hardcoded text/icon defaults) rather than relying on `data-variable-values` at
  2-level nesting, per the existing durable pitfall above.

- [2026-08-21] hyperframes-visual-system-v2 (device-library build, not an episode — see
  "Standing visual defaults" above): `grid-background` — query "grid paper background subtle
  graph lines", results stop-motion-cadence/spiral-galaxy/camera-dolly-zoom, none relevant;
  `sketch-icon-square` — query "hand drawn sketch line art icon reveal", results
  color-grading-adjacent/native-notification-pop/social-proof-card/iris-reveal, none relevant;
  `radial-burst` — queries "radial burst explosion pulse ring shockwave" and "shockwave ring
  impact expanding circle", results logo-sting/yt-circle-pointer/success-check/icon-morph-beat/
  yt-camera-move/mk-background, no exact match (borrows `logo-sting`'s accent-ring-on-impact
  technique as a base); `glossy-circle-badge` — query "glossy 3D circular icon badge glass
  sphere", results grid-card-assemble/facet-morph/chat-thread, none relevant. All 4 hand-built,
  `hyperframes check` clean (0 errors/warnings), snapshot-verified. Source files:
  `hyperframes-visual-system-v2/compositions/components/{grid-background,sketch-icon-square,
  radial-burst,glossy-circle-badge}.html` — copy into a new episode's own
  `compositions/components/` before use, same convention as every other entry below.

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
- [2026-08-20] hyperframes-ask-ai-to-think-first: Frame 1 registry(`matrix-decode`,
  `yt-camera-move`) — word "WRONG" scramble-to-reveal, real script hook, plus real ChatGPT/Claude
  name pills and a camera punch-in added after direct feedback ("very less visuals... did not
  apply visual change after every 2 sec rule") caught a real ~5.75s stretch covered only by the
  ambient glow, not a genuinely new element; Frame 2 registry(caption-kinetic-slam technique,
  ported to Inter since Anton has no @font-face declaration in this project) — word "NOTHING."
  slam plus a hand-built X/check mark pair (checked, no registry match for a simple two-icon
  wrong/right comparison); Frame 3 registry(`matrix-decode`) — word "REASONING"; Frame 4
  registry(`chat-thread`, `yt-camera-move`) — real illustrative exchange of the web-verified
  "strawberry" R-count failure mode (verified via search before scripting, not assumed; not
  claimed as a literal screenshot, an honest chat-UI depiction of a real, documented behavior),
  extended to 7 messages plus a closing camera punch-in after the same feedback caught a real
  ~10s gap once the 4-message version finished landing; Frame 5 registry(`constellation-hub`,
  `yt-camera-move`) — same duration-clip and hub-width/font-size fixes from the prior episode
  reapplied preemptively on this project's fresh install, confirmed still necessary (each
  project's copy is independent, per the standing durable-pitfall note), plus a camera punch-in
  added to cover a real ~5s post-settle gap; Frame 6 registry(caption-kinetic-slam technique) —
  word "EASIEST." plus an added underline-draw beat closing a borderline 2.4s gap; Frame 7
  registry(`cta-close`). This episode also reused the prior episode's `caption-pill-karaoke`-
  based captions.html directly (same real algorithm, this episode's own word timing) rather than
  re-deriving it. See the durable-pitfall entry below for the real `chat-thread` bug this episode
  found (hardcoded internal duration silently capped message pacing regardless of mount length).

- [2026-08-24] hyperframes-your-agent-cant-do-anything: **Revised same day** after the first
  pass (5 hand-built real-screenshot slots) correctly failed the registry-ratio gate at 37.5%
  — see Rule 1's 2026-08-24 revision above for the resulting three-tier tag model this entry
  now uses. Frame 1 **revised 2026-08-24, direct instruction "use actual logo for tools we
  say out loud"**: replaced `registry(trust-strip)`'s text wordmarks with
  hand-built-real-asset(logo row) — a row of 4 real official app icons (Gmail, Slack, GitHub,
  Notion) fading in in sync with each name's own spoken timestamp; registry checked first
  (`hyperframes catalog`), no match — `trust-strip` is text-wordmarks only, `logo-wall`'s own
  file states it uses placeholder lettermarks "WITHOUT using real brand assets." Logos captured
  via headless-Chrome from each product's official Google Play listing (github.com/logos for
  GitHub) into `assets/logos/`, same real-asset-capture technique as this episode's real
  screenshots, not fabricated icons. See Rule 1's 2026-08-24 fifth-tag addition for why this is
  ratio-exempt. Frame 2 registry(`halftone-field`) — shader noise field
  (recolored to the v2 palette via its own real color variables) as an ambient "hidden
  complexity" backdrop under a kinetic "the part nobody shows" line; `code-typing` and
  `code-snippet-flight` were checked first and rejected (zero `data-composition-variables`,
  fully hardcoded per-character token demo content, no real substitution path), and
  `flowchart-vertical` was checked and rejected too — its installed demo content is a
  "should you learn to code" decision tree (Yes/Not sure/Python/No-code/Website/Course), a
  real, unrelated topic that would visibly confuse this episode's narration, not just an
  abstract stand-in. Frame 3 screenshot(composio.dev real homepage, camera-push zoom into the
  hero + "1,000+ integrations" line) — the one beat where showing the actual product is the
  literal point (naming the tool), direct instruction. Frame 4 **revised 2026-08-24/25**:
  screenshot(composio.dev real Slack OAuth 2.0 connection panel) for the opening beat, the
  second and last logically-applicable screenshot slot this episode (direct instruction: "cut
  it back to 1-2 real-screenshot beats"). Hub visual was `registry(constellation-hub)` with
  the `data_variable_values_unreliable_at_nested_mount` workaround applied (`hub_label`/`nodes`
  defaults edited directly) — that fixed the variable-passthrough concern but NOT the actual
  render: a real full-resolution frame extraction across the whole mount window showed only the
  first node and its connector ever painted, hub and the other 3 nodes never appeared, static
  the whole window (not a timing issue). An isolated standalone harness with the identical host
  box and variables proved the component's own code is correct — this is the render engine
  failing to fully composite this nested sub-mount, same failure class as `data-chart`/
  `mk-progress-stat`. Now hand-built-bug-workaround(`constellation-hub`) — see the durable
  pitfall entry below and `registry_blocklist.json`'s new `blocked` entry for it. Replaced with
  a hand-built hub+4-node cross layout (plain divs, SVG line connectors, GSAP on the frame's own
  timeline, no nested mount) using the same real Gmail/Slack/GitHub/Notion logo assets as Frame
  1 instead of text labels. Frame 5
  registry(`count-up`) — 0 to 1,000+ count, literal match for "over a thousand"; `logo-wall`
  was checked and rejected on purpose: its own installed file states "Use when: a scene needs
  a compact trusted-by beat WITHOUT using real brand assets" — placeholder lettermark logos,
  wrong tier entirely for a real-product episode. Frame 6 registry(`native-notification-pop`)
  — a real Slack-style OS notification banner, literal match for "watching an agent just use
  Slack, with nothing else set up." Frame 7 hand-built-bug-workaround(`cta-close`) — see the
  "nested paste-in wrapper subtree invisible" durable pitfall (2026-08-24 entry, this same
  file) — same confirmed bug as this project's prior episode, same proven fix (plain direct
  children of `#root`, tweened on the frame's own outer `tl`, no nested wrapper); content
  changed from "Follow for more" to "Comment COMPOSIO," this episode's own approved CTA
  reversal (see `feedback_follow_only_cta_until_followers.md`). Final tally (post-logo-swap,
  post-constellation-hub-swap): 3 registry, 2 screenshot (exempt), 2 hand-built-bug-workaround
  (exempt: `cta-close`, `constellation-hub`), 1 hand-built-real-asset (exempt), 0 plain
  hand-built — 3/3 = 100% of the ratio-eligible slots, which is the exact outcome the
  2026-08-24 rule revisions above were meant to produce: a registry-first episode that also
  uses real screenshots and real brand logos where logically applicable, and has to work
  around two confirmed engine bugs, should not be penalized by the ratio gate for any of that.

  **Post-render QA addendum, same day**: a full pipeline pass and a dense `/watch` pass both
  read clean, but a direct user frame-by-frame review found 6 real geometry/collision bugs
  `/watch` missed entirely — see the three new durable-pitfall entries above (native-resolution
  extraction gap, caption-band collisions, `place-items:center` mount-position drift, fixed vs.
  elastic mount-duration envelopes) for the mechanics. Fixed on this same episode before
  shipping: Frame 1 `trust-strip` mount capped to its native `3.5s` (was `4.3s`, went blank past
  it); Frame 2 `halftone-field` mounted at native `1920x1080` + scaled via CSS transform instead
  of a mismatched portrait box (was leaving ~44% of the frame solid black); Frame 3's real
  screenshot pan bounds recalculated (was exposing dead space inside the card), and its kicker/
  wordmark moved out of the caption band (was garbling with live captions); Frame 4
  `constellation-hub` mount capped to `4.2s` (was `9.53s`, went blank past ~4.7s); Frame 5's
  stat-tag pill moved out of the caption band, and `count-up`'s host box repositioned after its
  real rendered position was measured via grid-overlay extraction (was landing ~800px lower than
  its nominal box, dipping into Instagram's bottom chrome zone); Frame 6's reflection line moved
  into the real clear gap between the notification banner and its background card (was
  overlapping the card's placeholder skeleton). All six verified via native-resolution ffmpeg
  frame extraction after a real re-render, not by inspection of source alone.

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
