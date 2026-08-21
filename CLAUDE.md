# Video Production Engine

**Trimmed 2026-08-20** — this file was 896 lines / 71.5KB, most of it frozen historical
narrative (full per-episode build diaries, superseded strategy-revision writeups) already
explicitly marked "kept for history, not current instructions." A token-usage forensic pass
found root `CLAUDE.md` is loaded every session regardless of task, making it the single largest
structural cost in this project — bigger than any one episode's render habits. Collapsed to
what's actually load-bearing, same treatment §§2-5 already got when Remotion retired. **Nothing
was deleted** — full prior text lives in git history (`git log -- CLAUDE.md`); every collapsed
section below says exactly what was cut and why.

**Production engine: HyperFrames.** An npm package (`npx hyperframes@<pinned-version> ...`),
never vendored into this repo. Each episode gets its own working project at
`hyperframes-<slug>/` (HTML compositions + GSAP timelines, rendered headlessly to MP4).
`docs/hyperframes_production_notes.md` is the canonical cross-episode production doc — standing
visual defaults, orchestration/token-cost discipline, and durable pitfalls all live there, not
here. For engine usage: the live `hyperframes-<slug>/` project's own scaffolded docs, or
`npx hyperframes docs`.

**Current strategy**: `docs/thataipm_content_system_operating_spec_v2.md` is the north star
(content pillars, audience, positioning). `docs/experiment_log.md` tracks the active 3-pillar
experiment and per-episode results. Both are living docs — read them directly rather than a
summary here, since summaries here go stale.

**Sibling project, unrelated brand**: `../ViralRespin/` sources real viral long-form videos and
rebuilds original short-form Reels from them — different visual style, no shared identity with
this channel, but the same core tooling (video-use + HyperFrames). See its own `CLAUDE.md`;
don't cross-pollinate conventions between the two projects.

## 1. Visual craft rules (engine-agnostic, still fully active)

These governed every shot design under Remotion and still do under HyperFrames — not history,
current law.

### Visual retention rule — "Never Let a Frame Sit"

1. **Hard limit**: no static frame longer than 2s. A narration beat running longer needs a
   secondary motion cue to bridge it. **Applies to real-asset beats too** (a held screenshot is
   still a frame — a continuous scan-sweep or equivalent motion during any hold, not just a
   subtle zoom pulse, which measures as too weak to register on its own).
2. **A >2s beat needs a genuinely NEW visual element appearing**, not just motion on what's
   already on screen (a new chip/tile/stat/icon, not a re-triggered existing one). A pulse can
   accompany a new element; it can't be the whole fix. `npx hyperframes check`'s Motion section
   does NOT catch a long static hold on its own (it checks exit-without-hard-kill, not silence
   duration) — `check_static_gaps.mjs` (wired into `/thataipm-assemble`) is the actual mechanical
   gate for this rule. **Known limitation**: it proves something was still animating, not that
   what animated is genuinely new vs. an existing element re-pulsing — that distinction still
   needs a human read of what's covering each flagged gap.
3. **Literal visualization**: represent the concept physically, not as a generic diagram —
   tokens = text physically breaking into colored chunks; attention = a moving spotlight sweeping
   across words; diffusion = an image materializing out of visible noise; agents = a decision
   tree building itself live.
4. **Build/reveal structure**: each video is something being built or revealed start-to-finish,
   not flat static explanation.
5. **Sound-synced beats**: a subtle SFX on every discrete visual event.
6. **First-frame hook**: motion or a bold visual/question in frame one — never a static title
   card or slow fade-in.
7. **Consistent visual language**: reuse the same color/shape meaning across every video so
   viewers pattern-match the channel's visual grammar.
8. **Revised 2026-08-19, direct instruction**: visuals no longer need to illustrate narration
   word-for-word — pick whatever device genuinely holds retention. **Absolute zero-tolerance for
   any empty screen, not even a microsecond** (tightens rule 1's "no static frame >2s" further).

Check any new shot design against these rules directly — this is the channel's actual retention
mechanism, not a nice-to-have.

### Schema vocabulary — reach for a literal device before another stat card

Before building a new stat/data beat, check what's already built. **Under HyperFrames, check
twice, in order, before hand-building anything**: (1) `npx hyperframes catalog` — 150+ pre-built
registry blocks (charts, transitions, lower-thirds, kinetic type, 3D/depth, shader backgrounds);
(2) the "Custom devices built for this channel" log in `docs/hyperframes_production_notes.md`,
which records devices already confirmed to have no registry match. `/thataipm-registry-check`
runs both in order — use it before writing any new frame composition's visual devices.

Device TYPES worth knowing by name when picking a shot (the registry's own catalog has the real
implementations — these are just the vocabulary): a self-drawing trend line for "this metric
moved," a pipeline/flowchart build for a linear process, a growing bar chart for comparing
discrete numbers, a count-up for one big stat, a horizontal fill bar for "X% of a whole," a
terminal/CLI card with real typing motion for install commands or code, a real screenshot with a
camera-push zoom into one detail, a comment-keyword CTA card. Still generic/underused (build one
only when a shot genuinely needs it, don't pre-build speculatively): gauge/donut, staggered-
reveal comparison table, chronological before/after timeline. Real data only — a chart TYPE is a
container, it doesn't excuse inventing the numbers inside it.

### Standing visual system v2 (adopted 2026-08-21, direct instruction — "apply it globally,
### keep this as standard moving forward always")

**Supersedes** the 2026-08-13 cream/no-grid palette default in
`docs/hyperframes_production_notes.md`'s Standing visual defaults section — that section now
carries a 2026-08-21 entry marking the change; this is the live default for every new episode,
same override precedent as that section's own 2026-08-13 dark→light reversal.

**Palette**: plain black ground (`#0A0A0A` — flipped from off-white 2026-08-21 same day as the
first validation episode shipped, direct instruction: "use black background color as standard to
maintain consistency between all videos," do not reintroduce the light ground), sage green
(device chrome), red (accent/transitions), off-white text and UI cards floating on the black
ground. **Typography**: mixed serif/sans for kinetic reveals. **Motion**: soft drop-shadow
3D-on-2D depth, red radial-burst scene-transitions. On black, dark UI elements (a badge, a card)
need their own light ring/border for definition — a drop-shadow alone won't separate them from
the ground the way it did on the old light palette.

**Screenshots and real UI over generic icons/mock UI**: whenever a frame shows a real product's
interface, capture real screenshots of the actual product (headless-browser CLI capture works
when the interactive Browser pane isn't available — see `docs/hyperframes_production_notes.md`)
rather than hand-building a lookalike mock. For a beat that isn't a specific product screenshot,
reach for a real UI device (a system notification banner, a toggle switch, a status pill) before
a generic icon-in-a-square — pick the device whose real-world meaning matches the line, not
whichever shape is closest to hand (a lightning bolt does not mean "slow"). Standing rule as of
2026-08-21.

Four hand-built devices (registry-checked, no match — full search log in the "Custom devices"
log in `docs/hyperframes_production_notes.md`) live in `hyperframes-visual-system-v2/
compositions/components/`: `grid-background`, `sketch-icon-square`, `glossy-circle-badge`,
`radial-burst`. Copy the needed file(s) into a new episode's own `compositions/components/`
(same per-project copy convention as every other hand-built device on this channel — no shared
library folder) before wiring them into frames. Still registry-first: check `hyperframes catalog`
and the Custom devices log before hand-building anything new even within this system.

## 2-6. Retired production history (Remotion engine, episodes cm1 through hyperframes-had-the-
components-i-hand-built) — collapsed, full text in git history

Sections §§2-5 (Remotion engine reference: `automation/` scripts, `remotion/src/` components,
technical pitfalls, VO-first workflow) and §6 (episode-by-episode build diaries for cm1, tn1,
sk1's four revisions, the-karpathy-skill, hyperframes-had-the-components-i-hand-built) were
collapsed 2026-08-20 — all Remotion-era, all already marked "historical record" in the prior
version of this file, component names (`theme.ts`, `PipelineFlow.tsx`, `CaptionsPop.tsx`, etc.)
that no longer exist in this project. `remotion/` itself lives in an external trash folder, not
deleted. Full text: `git log -p -- CLAUDE.md` on any commit before 2026-08-20.

**What actually carries forward** (durable lessons, still relevant under HyperFrames):

- The render/check/render loop → `npx hyperframes check` → `npx hyperframes snapshot` →
  `npx hyperframes render`.
- VO/SFX/BGM → the `media-use` skill's shared audio engine.
- Real screenshot capture → HyperFrames' own capture tooling.
- Shot-list discipline: `Concept → Real shape → Device → Why it matches`, still applies — see §1.
- Cover image + platform captions are standing deliverables for every episode: a real designed
  still (never a timeline grab) + genuinely distinct per-platform copy (paraphrasing the same
  sentences still counts as "same" — a real word-overlap check exists in `/thataipm-distribute`).
- **Once a video is posted, don't re-edit or re-render it** — ship any fix in the next episode
  instead. Applies to every already-published episode, not just the ones that established it.
- **Always verify a fix actually landed in the file that renders** (`index.html` for HyperFrames),
  not just its source data file (`audio_meta.json`) — a real gotcha that shipped a bad SFX twice
  because a fix was written to the data file but never propagated to the render source.
- ffmpeg facts (not Remotion-specific): the `-ss` before `-i` ordering, `volumedetect` as the
  standing audio sanity check.
- The `.env` `ELEVENLABS_API_KEY`/`ELEVENLABS_VOICE_ID`/`HEYGEN_API_KEY`/`ZERNIO_API_KEY`
  credentials are read by the current skills the same way regardless of engine.
- Episode/folder naming: `episodes/<full-title-slug>/`, not a short code — e.g.
  `episodes/best-ai-tools-for-voiceovers/`, not `episodes/sd1/`. Sub-asset files that are already
  self-descriptive (`shot1_vo.wav`) don't need the episode-slug prefix.
- The `@thataipm` handle is unchanged across every strategy/engine revision to date.

## 7. Strategic architecture and standing operational rules

**Architecture principle**: strategy sits ABOVE the production pipeline. Changing the content
strategy doesn't require changing the render engine or distribution scripts, and vice versa —
confirmed twice already (the v2.0 strategy migration didn't touch production; the Remotion→
HyperFrames engine swap didn't touch strategy).

```
STRATEGY                docs/thataipm_content_system_operating_spec_v2.md (north star)
  |
CONTENT PILLARS / HYPOTHESIS   docs/experiment_log.md (Pillar Experiment section, opened per batch)
  |
TOPIC SELECTION -> QUALITY GATE -> RESEARCH/FACT-CHECK -> SCRIPT -> PRODUCTION -> RENDER
  -> CAPTIONS -> DISTRIBUTION    see docs/hyperframes_production_notes.md + the thataipm-* skills
  |
ANALYTICS               automation/fetch_zernio_analytics.py (real Zernio API — Instagram
                        exposes per-post follows + avg watch time; YouTube retention via a
                        separate endpoint, 2-3 day processing delay)
  |
LEARNING                memory system (durable rules) + experiment_log (batch-specific)
  |
KEEP / SCALE / MODIFY / KILL   written into the batch entry in experiment_log.md, closes it
```

**Current pillar experiment** (opened 2026-08-14, `docs/experiment_log.md` is the live source of
truth for status): three pillars tested head to head at equal weight, 10 episodes each before
committing weight to any one — AI Tools & Agent Spotlights (known-working baseline), Navigating
the AI Era (first-person, in-progress posture on what AI changes about work/career/life —
absorbs Build-in-Public and Opinions/Trends as distinct registers, not folded into generic career
content), How AI Systems Actually Work (real-mechanism explainers). Decision gate is real
Instagram/YouTube data per pillar (follows/1,000 views primary), not founder conviction. Already-
shipped tool-spotlight episodes before 2026-08-14 don't retroactively count toward the 10-per-
pillar totals.

**Standing operational rules**:

- **Data-removal practice**: every episode's rendered `build/*.mp4` + cover PNG get force-added
  to git despite `.gitignore`'s `episodes/*/build/` rule (Zernio needs a real public GitHub raw
  URL to fetch from at publish time). Once a scheduled post's Zernio status reads `published`
  (checked directly via the API, never assumed from time passing), untrack that episode's
  `build/*.mp4` and cover (`git rm --cached`, never a plain `rm` — the local file stays on disk).
  Do NOT untrack before a post is confirmed published.
- **`episodes/scheduled/` index**: one manifest file per episode with at least one platform post
  still `scheduled` (not `published`) in Zernio. An index, not storage — episode folders never
  move here. Delete an episode's file from here once every platform shows `published`. See
  `episodes/scheduled/README.md` for the exact format.
- **CTA fulfillment** (every episode closes on "Comment [KEYWORD] and I'll send you the link")
  has no automated fulfillment behind it, deliberately — not worth building until a single post
  crosses 10 real comments.
- **Before locking a script that cites a specific research-agent-supplied statistic** (not a
  well-known, easily-verified fact like a GitHub star count), open the actual cited source and
  confirm the number is printed on the page. A citation existing is not the same as a citation
  being checked — a fabricated $245K/$123K compensation stat shipped through script, render,
  cover, and captions once before this rule existed, caught only because the visuals looked thin
  and re-sourcing them for real screenshots surfaced the number wasn't real anywhere.
- **Publishing is always confirmation-gated.** Even a fully automated pipeline prepares/queues a
  post, it never fires without an explicit per-episode go-ahead — this is a standing rule, not
  implied by an earlier general approval. `/thataipm-distribute` enforces this as a hard stop
  before the actual Zernio schedule call.
- **Repackaging intent** (noted 2026-08-13, not yet acted on): the user intends to eventually
  repackage this production system for other people to buy/use once it's proven out. Keep that in
  mind for naming/structuring decisions (shared docs vs. brand-specific ones) without doing the
  actual generic-product restructuring yet — that's a deliberate later step, not now.
- **Daily/autonomous production automation was tried and explicitly stopped** (2026-08-11) —
  not a capability gap, a deliberate choice to keep episode production manual/live-session-driven
  for now. Don't rebuild it without a fresh explicit request.

## 8. Working discipline

**Goal-Driven Execution.** "Looks right" is not a success criterion; a check that can print
PASS/FAIL is. Before calling a subjective judgment call "done" (does this hook state the topic
fast enough, is this motion actually visible, does this fact check out), ask whether it can be
turned into something that fails loudly instead of just feeling fine. Not everything can, but
default to trying before settling for eyeballing.

**Think Before Coding.** State a visual/creative assumption out loud when making it, specifically
anything with a magnitude nobody supplied (an animation amplitude, a hold duration, a threshold).
Naming the assumption doesn't make it correct, but it's the difference between a guess that
quietly ships and a guess that gets checked.

**Surgical Changes.** Once a video is posted, don't re-edit it — ship a fix in the next episode.
Shared-component fixes (a registry block, a shared device log entry) are fine specifically
because they don't touch already-rendered output, only future renders.

**Reusable components are the exception to "no premature abstraction."** This project
deliberately builds shared, reusable devices from their first use, because the channel's format
guarantees dozens of future episodes will need the same visual patterns — a known, structural
requirement here, not speculative gold-plating. The part that still applies: don't add config/
flexibility/error-handling nobody asked for on top of a component — build the reusable shape
because it's genuinely needed, not the unneeded flourishes around it.

## 9. Production-process skills

Project-scoped skills in `.claude/skills/` encode this channel's hard-won production conventions
on top of the generic global HyperFrames skills. Each is invokable directly (`/thataipm-vo`,
etc.) and independently improvable — add findings/fixes to the relevant skill's `SKILL.md` rather
than re-discovering the same gotcha in a future session.

**Standing production order**: `/thataipm-script-review` → `/thataipm-vo` →
`/thataipm-registry-check` → (frame authoring) → (if VO changed after frames already existed)
`/thataipm-resync` → `/thataipm-assemble` → `/thataipm-distribute`.

- **`thataipm-vo`** — generates VO on the correct `eleven_v3` model via a direct ElevenLabs API
  call (the shared `media-use` engine's Python path hardcodes an older model), runs real
  forced-alignment for word timing, writes into `audio_meta.json` without touching the
  faceless-explainer wrapper's separate sidecar.
- **`thataipm-script-review`** — chains `/humanizer`'s draft-audit-final loop with this channel's
  own mechanical gates (zero em/en dashes, runtime estimate, staccato-fragment-run detection)
  plus a proper-terms-restoration check.
- **`thataipm-registry-check`** — **hard rule, no exceptions**: build every visual device from
  the registry by default; hand-building is only permitted after a real, logged, per-frame
  registry search confirms no match. `check_registry_usage.mjs` is wired into
  `/thataipm-assemble` as a hard gate — every single frame must be individually accounted for
  (`registry(...)` or `hand-built(...) — <why>`), not just "the episode has one registry item
  somewhere in it."
- **`thataipm-resync`** — after VO changes, prints every frame's real per-word timeline from
  `audio_meta.json` and mechanically resets each frame's full-span `data-duration` values.
- **`thataipm-assemble`** — chains captions build → assemble-index → transitions inject →
  `hyperframes check` → optional snapshot → render → `ffmpeg volumedetect` into one command. **If
  only `audio_meta.json` changed since the last render** (an SFX swap, no frame HTML edited), use
  `scripts/remux_audio.mjs` instead of a full render — `npx hyperframes render` has no
  audio-only mode and recaptures every frame regardless; the remux script rebuilds the mix
  directly from `audio_meta.json` and remuxes it onto the existing video with `-c:v copy`, no
  recapture. See `docs/hyperframes_production_notes.md`'s durable-pitfall entry for the real
  numbers that motivated this.
- **`thataipm-distribute`** — cover still, platform captions with a mechanical distinctness
  check, git push + URL verification, Zernio scheduling. **Preserves the hard
  publish-confirmation gate** — states the full post plan and waits for explicit per-episode
  confirmation before the actual schedule call.
