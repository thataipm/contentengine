# Video Production Engine

**Production engine, 2026-08-13: HyperFrames.** The render engine is now **HyperFrames** — an
npm package (`npx hyperframes@<pinned-version> ...`), never vendored into this repo, so there is
no single project-wide "engine folder." Each episode gets its own working project at
`hyperframes-<slug>/` at the repo root (HTML compositions + GSAP timelines, rendered headlessly
to MP4); it replaced the Remotion/React pipeline this file originally documented, after
`hyperframes-had-the-components-i-hand-built` shipped a full episode at a comparable quality bar
with a simpler toolchain and lower per-episode token cost. **`docs/hyperframes_production_notes.md`
is now the canonical cross-episode production doc** — standing visual defaults,
orchestration/token-cost discipline, and durable pitfalls all live there, not here. (That
content originally lived at `hyperframes/CLAUDE.md` — a folder literally named `hyperframes/`
instead of following the `hyperframes-<slug>/` convention, which read as "the engine's own
folder" and got archived along with the rest of that episode's source once it shipped; rescued
2026-08-14 into `docs/` specifically so cross-episode content can't get buried inside a
disposable per-episode folder again — see that file's own folder-structure-convention note.)
`remotion/` and its Remotion-only `automation/` scripts were moved to an external trash folder
(not deleted outright, same never-hard-delete practice already used for content below) —
nothing in this project still depends on them. See the retirement note at the end of §7 for the
full "why" and what changed. Sections §§2-5 below are kept as a **frozen historical record** of
the old engine (useful if old episode source is ever revisited), not current instructions — skip
straight to `docs/hyperframes_production_notes.md` for standing production rules, and the live
`hyperframes-<slug>/` project's own scaffolded docs (or `npx hyperframes docs`) for engine usage.

**Current strategic system, 2026-08-10, revised 2026-08-12**: content strategy for this channel
(still the same `@thataipm` handle) is governed by **That AI PM: Content System Operating Spec
v2.0** (`docs/thataipm_content_system_operating_spec_v2.md`), approved 2026-08-10. Its core
positioning was revised in place 2026-08-12: from PM-focused "AI-native product thinking" to
**building real AI automation systems, in public** — see §7's dated revision note below for why,
and the spec doc itself (same file, still v2.0, edited in place rather than forked) for the full
current positioning, audience, and pillars. Neither version is a revival of the old archived
"That AI PM" content described in the paragraph below; that archive stays retired and unused.
See §7 for the full migration note and the new experiment-log/quality-gate layer added on top of
the production engine this file otherwise describes.

This project was reset on 2026-08-06. Everything from the prior "That AI PM" channel (its
scripts, episodes, content plan, channel identity, and visual theme) was moved to
`archive_thataipm/` for historical reference — **removed from this project entirely 2026-08-10**
(backed up to Google Drive's `Content Engine/archive_thataipm/`, not deleted outright) once
production fully converged on the new system below; it was never a starting point for new work
even while it was still present locally.

The new project is a **faceless** Instagram page (no on-camera avatar). Its niche, content
pillars, visual direction, and a 30-episode content plan are all decided now (below and
`docs/how_ai_works_content_plan.md`) — don't assume any of it from the archive, that's the old
channel's now-retired identity. **Note**: the content-plan pillars named in §1 below were
themselves superseded twice since (§6's pillar pivot, then §7's v2.0 migration) — the spec doc
is the actual current source of truth, §1 is kept for history same as everything else pre-dating
v2.0.

**Sibling project, unrelated brand**: `../ViralRespin/` (started 2026-08-08) sources real viral
long-form videos and rebuilds original short-form Reels from them — different visual style, no
shared identity with this channel, but now the **same core tooling** (video-use + HyperFrames)
since this project retired Remotion. See its own `CLAUDE.md` for full context; don't pull its
conventions in here or vice versa — a shared engine doesn't mean shared brand/content decisions.

## 1. Channel brief: "How AI Actually Works" (historical — pillars retired, craft rules still live)

Delivered by the user 2026-08-06 (`channel-brief-how-ai-works.md`). **The niche/pillars below
are retired** (superseded by §6's pillar pivot, then fully by §7's v2.0 spec) — kept for
history, not current targeting. **The Visual Retention Rule and Schema Vocabulary sections
below them are NOT retired** — they're engine-agnostic craft principles that still govern every
shot design under HyperFrames, same as they did under Remotion.

- **Identity**: faceless explainer channel demystifying how AI actually works under the hood —
  tokens, attention, embeddings, diffusion/image generation, fine-tuning, agents, context
  windows, etc. No mascot/character; identity comes from one consistent locked ElevenLabs voice
  + a consistent visual signature, not a face.
- **Audience**: curious general viewers, not ML engineers. Assume zero prior technical
  background per video — every concept gets a plain-language hook before any jargon.
- **Specs**: 30-60s, vertical 1080x1920 (matches the engine's `W`/`H`).
- **Pillar 1, Core Mechanics (~50%)**: foundational "how it works" explainers (tokens,
  attention/transformers, embeddings, diffusion, fine-tuning, context windows, agents). The
  evergreen backbone.
- **Pillar 2, Then vs Now (~30%)**: real before/after AI output comparisons over time, explained
  through *what mechanically changed*, not just "it got better." Every claim needs a real,
  verifiable source example (screenshot/output + date), not a narrated claim from memory.
- **Pillar 3, Why It Broke (~20%)**: a real, verifiable AI failure (hallucination, six-fingered
  hand, bad math) explained through the mechanics lens. Shareable and relatable, stays
  educational — reinforces "we explain reality," not a mockery/reaction channel.

### Visual retention rule — "Never Let a Frame Sit"

The core visual law for every video on this channel, applied at the shot/visual-cue design
step, not just editing:

1. **Hard limit**: no static frame longer than 2s. A narration beat running longer than that
   needs a secondary motion cue (slow zoom, subtle pulse, particle drift, parallax shift) to
   bridge it. **Applies to real-asset beats too, not just graphics** — added 2026-08-11 after
   direct feedback ("along with screenshots, let's not waste a single frame"): a held
   screenshot is real content, but it's still a frame, and a barely-perceptible zoom-scale
   pulse alone has already been measured (via `automation/check_static_frames.py`) as too
   subtle to register. `components/RepoScreenshot.tsx` now runs a continuous scan-sweep
   (a soft light band crossing the crop window) during any post-zoom hold — reuses rule 2's own
   "moving spotlight" idea rather than inventing a separate device for real assets vs graphics.
   **Tightened 2026-08-13, book-to-skill redo**: a passive pulse on an ALREADY-PRESENT element
   (breathing opacity, a slow scale wobble) is no longer sufficient on its own for a >2s hold —
   direct feedback after a pulse-only fix was still flagged live ("No new visuals after every 2
   seconds... make sure we don't forget this"). A >2s beat needs a genuinely NEW visual element
   or detail appearing (a new chip/tile/stat/icon, not a re-triggered existing one), not just
   motion on what's already on screen; a pulse can still accompany a new element, it just can't
   be the whole fix by itself. **Also learned the same session**: `npx hyperframes check`'s own
   Motion section does NOT catch a long static hold at all (it checks exit-without-hard-kill and
   other runtime issues, not silence duration) — a real ~4.5s dead hold in book-to-skill's Frame
   1 passed that check clean. `hyperframes/CLAUDE.md`'s `thataipm-assemble` skill now runs
   `check_static_gaps.mjs` as a standing mechanical gate for this specific rule (parses each
   frame's GSAP timeline for tween coverage, treating a tween's full `[start, start+duration]`
   span as covered rather than just its start instant, and flags any uncovered stretch over the
   threshold) — run it before every render, the same "turn eyeballing into a checkable command"
   discipline as `check_static_frames.py` originally established. **Known limitation, stated
   honestly in the tool's own output**: it proves something was still animating, not that what
   animated is a genuinely new visual rather than an existing element re-pulsing — that
   distinction still needs a human read of what's actually covering each flagged gap.
2. **Literal visualization**: represent the concept physically, not as a generic diagram —
   tokens = a sentence physically breaking into colored chunks, snapping into place one at a
   time, synced to narration; attention/transformers = a moving spotlight/laser sweeping across
   words to show what's "attending" to what; diffusion/image generation = an image literally
   materializing out of visible noise in real time; agents = a decision tree/flowchart building
   itself live, node by node, "thinking → deciding → acting."
3. **Build/reveal structure**: structure each video as something being built or revealed
   start-to-finish, not flat static explanation.
4. **Sound-synced beats**: a subtle sound effect (click/pop/whoosh) on every discrete visual
   event (token snapping in, node lighting up).
5. **First-frame hook**: the first frame must contain motion or a bold visual/question — never a
   static title card or slow fade-in.
6. **Consistent visual language**: reuse the same color/shape meaning across every video (the
   brief's own example: blue = input data, orange = model processing, green = output) so viewers
   pattern-match the channel's visual grammar without re-explanation each video.

Check any new shot design against these 6 rules directly, not just a general "keep it moving"
instinct — this is the channel's actual retention mechanism, not a nice-to-have.

### Schema vocabulary — reach for a literal device before another stat card

Added 2026-08-11, direct feedback: too many shots were a static card with `breathe()` patched
on afterward to stop it from freezing, rather than a visual that's inherently a build/reveal
device by construction (partly inspired by evaluating `famous-reel-editor`'s own schema
catalog — its talking-head editing pipeline doesn't apply here, faceless with no raw footage,
but its practice of maintaining a growing list of literal chart/graphic TYPES to pick from,
instead of defaulting to the same few, is worth copying). **The principle still applies under
HyperFrames — before building a new stat/data beat, check what's already built first, and grow
the list every time a genuinely new device gets built.**

**The list below is the frozen Remotion-era catalog** (component names like `TrendChart.tsx`
no longer exist in this project — `remotion/` was retired, see the top of this file) — kept as
a reference for the DEVICE TYPES themselves (trend line, pipeline build, bar comparison,
count-up, disparity bar, comparison pair, terminal/CLI, real screenshot), not as literal code
to reuse. HyperFrames' own equivalent catalog lives in `hyperframes/frame.md` and grows the
same way — check there first, and add a new entry every time a genuinely new device gets built
for this project (only 3 exist there so far: an icon-card literal-visualization, a count-up
stat, and a 16-tile schema-device grid, from the first HyperFrames episode).

- `TrendChart` — a single line that draws itself (SVG `strokeDasharray`), up or down, with a
  glowing marker riding the tip. For "this metric moved."
- `PipelineFlow` — nodes building themselves in sequence, connected by growing stems, optional
  dim pre-reveal state so a long VO preamble doesn't leave the content zone empty. For a
  process/lifecycle/pipeline (but check the shape is actually linear — see §5's shot-list rule
  below on why a loop/cycle needs a different device, not this one just because it's built).
- `BarChart` — labeled columns growing from a shared baseline, real values only. For comparing
  several discrete numbers side by side (distinct from a disparity bar, which is one horizontal
  fill framed as "this much of a whole").
- `CountUp` — a number rolling up to its real target instead of just popping in. For a single
  big stat that deserves more weight than a static pop.
- `DisparityBar` — a labeled horizontal fill bar. For "X% vs Y%" gap framing.
- `ComparisonCard` — two labeled values side by side. For a direct A-vs-B stat pair when
  neither a bar nor a line fits better.
- `TerminalCard` — a typed command sequence with a blinking cursor (real motion for the whole
  hold, not just the typing). For install commands, code, CLI output.
- `RepoScreenshot` / `ProductScreenshot` — a real captured screenshot with a camera-push zoom
  into one real detail, plus a continuous scan-sweep during any hold (see rule 1 above). For
  citing real evidence — never fabricate what this shows.
- `CommentCTA` — the closing comment-keyword card with twinkling stars.

Still generic/underused (never built, Remotion or HyperFrames — build one the next time a shot
actually needs it, don't pre-build speculatively): gauge/donut (percent-of-total as a filling
ring), staggered-reveal table (feature/tool comparison rows), timeline (chronological
before/after). Real data only, same as everything else on this list — a chart TYPE is just a
container, it doesn't excuse inventing the numbers inside it.

## 2-5. Retired production engine (Remotion) — frozen historical record

**§§2-5 were the Remotion/React engine's full documentation (~300 lines: `automation/` script
reference, `remotion/src/` component reference, durable technical pitfalls, the VO-first
production workflow). Collapsed to this note 2026-08-13 when the engine was retired** — the
detail itself is still real and correct for anyone who ever needs to touch old Remotion source
again, but it no longer describes how this project makes videos. Full original text lives in
git history (this commit's parent) if it's ever needed; `remotion/` itself lives in an external
trash folder, not deleted.

**What actually carries forward, now living under `hyperframes/CLAUDE.md` instead**:

- The render/check/render loop → `npx hyperframes check` (lint + runtime + layout + motion +
  contrast, one command, replaces the old checkpoint-stills-plus-`check_static_frames.py`
  two-step) → `npx hyperframes snapshot` (visual review) → `npx hyperframes render`.
- VO/SFX generation → the `media-use` skill's shared audio engine, replaces the raw
  `generate_vo.py`/`generate_sfx.py`/`derive_word_timing.py`/`align_shot_audio.py` scripts.
- Real screenshot capture → HyperFrames' own capture tooling (see the `hyperframes` skill's
  routing), replaces `capture_product_screenshot.py`.
- The shot-list discipline (`Concept → Real shape → Device → Why it matches`, the same rule
  §5 used to state) is engine-agnostic and still applies — see §1's Visual Retention Rule and
  Schema Vocabulary above, now HyperFrames' problem to embody, not Remotion's.
- Cover image + platform captions as standing deliverables (§5, steps 6-7 in the old numbering)
  are unchanged in SPIRIT — still a required still image + genuinely distinct per-platform copy
  — just produced via a HyperFrames still-frame render instead of `npx remotion still`. See
  `hyperframes/CLAUDE.md` for the current exact steps.
- ffmpeg/audio pitfalls that are facts about ffmpeg itself, not Remotion (the `-ss` before `-i`
  ordering, the `volumedetect` sanity check) still apply verbatim to any ffmpeg step HyperFrames'
  own render pipeline runs — HyperFrames handles this internally, but if you're ever debugging
  an audio issue by hand, the old §4 pitfall entry (now only in git history) has the details.
- The `.env` `ELEVENLABS_API_KEY`/`ELEVENLABS_VOICE_ID`/`HEYGEN_API_KEY` credentials are
  unaffected by the engine change — HyperFrames' `media-use` skill reads the same `.env`.

**What did NOT carry forward** (Remotion/React-Three-Fiber-specific, no HyperFrames
equivalent needed): `<TransitionSeries>` audio-crossfade handling, `@remotion/media`'s
`<Video>` quirks, the whole `three/SceneRig.tsx`/`BloomRig.tsx` 3D bloom pipeline and its HDR-
material/shape-matching pitfalls, `<Html transform>` not surviving headless export, the
`tsconfig.json`/`remotion.config.ts` 3D-rendering setup requirements. HyperFrames' HTML/CSS/SVG/
GSAP composition model doesn't have these problems in the first place — 3D content, if a shot
ever needs it, goes through `hyperframes-keyframes`'s own Three.js adapter with its own (still
unwritten, since not yet needed) pitfall list.

## 6. Decided 2026-08-06: visual direction, voice, content plan (Remotion-era history)

**Historical record — episodes cm1/tn1/sk1/sd1/the-karpathy-skill were all produced under the
now-retired Remotion engine.** The component names below (`theme.ts`, `PipelineFlow.tsx`,
`CaptionsPop.tsx`, etc.) no longer exist in this project. The DECISIONS (what shipped, why,
what feedback drove each revision) are real history and worth keeping; the file/component
references are not actionable anymore. `hyperframes-had-the-components-i-hand-built` (below,
first HyperFrames-era episode) picks up where this section's last entry left off.

- **Visual direction is locked**: pure black background, real recognizable (generic, unbranded)
  UI/hardware elements standing in for whatever the narration is literally about, picked
  per-topic not from a fixed menu — chat interface, server rack, and code editor were the
  user's original illustrative examples of the STANDARD, not an exhaustive list (confirmed
  explicitly after the first content-plan draft over-defaulted to "chat interface" for concepts
  that needed a different real element, e.g. embeddings needs a scatter-plot map, not a chat
  window). Full element library, picked by actually walking all 30 episodes, in
  `docs/how_ai_works_content_plan.md` §1. Full reasoning trail (four rejected rounds first) also
  there. `theme.ts` now carries the locked colors (`BG`, `INK`, `DIM`, `ACCENT`) and fonts
  (`F_DISPLAY` = Bricolage Grotesque, `F_UI` = Inter). Reference implementation:
  `HookPreview_ChatUI.tsx` (kept as a preview composition, not yet generalized into a reusable
  component — do that before a second episode needs the
  chat-interface set-piece).
- **Voice**: reuses the existing `.env` `ELEVENLABS_VOICE_ID` (the user's own voice clone from
  the old project) — the user confirmed reusing it rather than cutting a new one. Sanity-check
  this is still the right ID before generating real VO for the first episode, it was flagged as
  "pending replacement" until this session's instruction resolved it.
- **Content plan**: 30 episodes banked, 10 per pillar, in `docs/how_ai_works_content_plan.md`.
  **Superseded as the channel's primary focus 2026-08-09** — see the pillar pivot below. This
  plan and its content pillars still exist and will be revisited (title/structure reformat),
  just not right now.
  Publishing rotation follows the brief's 50/30/20 pillar weighting (interleaved, not published
  in blocks) even though the banked count is equal per pillar — see that doc §6. Originally
  planned to open with cm2 (hook already built at planning time), but the user chose to make
  **cm1, "Tokens: How AI Reads Text," the actual first episode instead** — see the dated entry
  below, this shipped 2026-08-06.
- **Pillar pivot, 2026-08-09**: after 6 educational videos underperformed, the channel's primary
  content shifted to a new rotation — 60% trending-Claude-Code-skills content (comment-gate CTA,
  visual style modeled on two real reference videos), 20% the existing educational pillar
  (unchanged for now), 20% personal AI takes drafted from current news. Full plan, locked
  20-idea bank, and sourcing methodology in `docs/thataipm_pillar2_content_plan.md`. This is
  still the same @thataipm channel, not a new one — confirmed 2026-08-09.
- **Visual system unified, 2026-08-10**: after sk1 shipped at a noticeably higher production bar
  (real screenshots, synced SFX, GitHub+Buffer hosting pipeline, a LinkedIn carousel companion),
  the user locked sk1's visual system in as the **one standard for every future video,
  regardless of pillar** — retiring the original per-pillar-identity plan (`theme.ts`'s pure
  black/white system was previously meant to stay Pillar 1's separate look; that separation is
  now retired going forward). `theme_skills.ts`'s dark-grid background, colorful rotating
  `ACCENTS`, tool-header/real-asset approach is the default for all new production. **`cm1` and
  `tn1` are NOT being rebuilt or re-rendered** — both are already published under the old black
  `theme.ts` system and stay exactly as they are; this decision only governs new episodes going
  forward, not existing ones. `theme.ts` itself is untouched (still needed so cm1/tn1's existing
  source keeps compiling) — it's just no longer the default for anything new. Same reasoning
  applies to any already-published episode from this point forward: **once a video is posted,
  don't re-edit or re-render it**, ship the fix in the next one instead.
- **Layout fix, 2026-08-10**: shot content divs were anchoring at a fixed `top` offset instead of
  centering in the real available space, leaving large dead vertical gaps on screen (flagged
  directly from a real exported frame — "so much blank space available in the middle"). Fixed
  via a new shared `components/ContentZone.tsx` (vertically centers children between a `top`/
  `bottom` bound instead of hugging `top`), applied across sk1's Shot1-5 as the reference
  implementation. **Use `ContentZone` for every future shot's main content area** instead of a
  raw absolutely-positioned div with a fixed `top` — this is now the standing layout convention,
  not a one-off sk1 patch.
- **Content-strategy system RETIRED, 2026-08-10**: everything above describing WHAT to make,
  the "Pillar pivot, 2026-08-09" bullet's 60/20/20 split and its later refinement into the
  2-pillar system (60% Trending Claude Code Skills / 40% Best AI Tools) in
  `docs/thataipm_pillar2_content_plan.md`, is retired as the strategic source of truth,
  superseded by **That AI PM: Content System Operating Spec v2.0**. Kept in place for
  audit/history per the migration decision, not deleted. **This retirement is about content
  strategy only** (which pillars, which topics, audience). The PRODUCTION VISUAL SYSTEM
  described in the "Visual system unified, 2026-08-10" bullet above (dark-grid canvas, rotating
  `ACCENTS`, real screenshots, `TerminalCard`/`RepoScreenshot`/`CaptionsPop`) is unaffected and
  stays the default for all new production, it doesn't conflict with v2.0's own format
  principles (§11 of the new spec explicitly wants the same premium/clean/real-asset approach).
  Full migration detail, the new architecture layer, and the Zernio analytics investigation are
  in §7 below.
- Episode/folder naming convention: `episodes/cm{N}/`/`tn{N}` short codes were the original
  pattern (mirroring `remotion/src/episodes/cm{N}/` for shot components/orchestrator, same shape
  as the old project's `da{N}` convention) but both pillars using them are retired (see the
  educational-pillar removal and `sk1`→Best-AI-Tools-listicle reframe below). **Superseded
  2026-08-10, direct instruction ("use episode titles in folder and file names, no more
  shortcuts")**: the top-level `episodes/{id}/` folder now uses a full-title slug instead of a
  short code — e.g. `episodes/best-ai-tools-for-voiceovers/`, not `episodes/sd1/`. Files inside
  that reference the episode itself (the final video, cover, VO script, LinkedIn carousel PDF)
  use the same slug as their prefix; sub-asset files that are already self-descriptive (
  `shot1_vo.wav`, `elevenlabs_full.png`, etc.) don't need the prefix, they were never the
  "shortcut" problem. **Scoped to the top-level `episodes/` folder only** — the Remotion engine's
  internal working copies (`remotion/public/{id}/`, `remotion/src/episodes/{id}/`, composition
  IDs like `Episode-sk1`) still use the original short codes for `sk1`/`sd1` specifically
  (renaming those would mean touching working code on already-rendered/drafted episodes, ruled
  out of scope 2026-08-10) — but **new episodes going forward should use the full slug
  consistently in both places** since there's no "already shipped" constraint blocking it yet.

- **`cm1`, "Tokens: How AI Reads Text" (Core Mechanics, episode 1/30), shipped 2026-08-06:
  `episodes/cm1/build/cm1_tokens.mp4`, ~62s.** The channel's actual first episode (see above).
  Script went through two rounds before approval: a runtime pass (45s draft to ~60s, adding the
  "tokens become numbers" and "charged per token" beats, both real mechanics not padding) and a
  tone pass (stronger contrast-based hook, load-bearing humor with a hook/close callback — see
  memory note on this pattern, it's now the standing script style for this channel). Literal
  element: a plain text-input field (`components/InputFieldFrame.tsx`), not a chat interface —
  cm1 is about one piece of input text, not a conversation, confirmed as the right per-topic
  call in the content-plan revision. New shared components from this build:
  `components/TokenChip.tsx` (neutral by default, `emphasized` prop for the one restrained
  accent, `sublabelBorn` for a data annotation revealing later than the chip itself, e.g. a
  token-ID badge) and `components/Captions.tsx` — the standing karaoke-style word-highlight
  subtitle system, current/past words in `INK`, not-yet-spoken words dimmed, current word in
  `ACCENT`, built once here and meant to run on every future episode's shots, not just cm1's.
  **Captions read directly from each shot's real `shot{N}_words.json`**, copied into
  `remotion/src/episodes/{id}/data/` and imported as JSON (`tsconfig.json` needed
  `resolveJsonModule: true` added for this) — deliberately NOT hand-picking a few named `born`
  constants the way earlier episodes did for keyword pop-ins, since captions need the FULL word
  list, not a handful of markers.
  **Watermark handle confirmed 2026-08-09: `@thataipm`** — this content posts to the existing
  ThatAIPM Instagram channel, not a new separate handle. Fixed in `Cm1Episode.tsx`,
  `Tn1Episode.tsx`, `CoverCm1.tsx`, `CoverTn1.tsx`.

- **`tn1`, "AI Couldn't Do Math (2020 vs. Today)" (Then vs Now, first episode of this pillar),
  shipped 2026-08-07 after 2 revisions: `episodes/tn1/build/tn1_math.mp4`, ~49.3s.** Content
  plan originally banked this slot as the DALL-E 2 "astronaut on a horse" image-gen comparison;
  blocked on sourcing (can't reproduce the actual 2022 copyrighted image), so per instruction
  ("pick a different, easier-to-source comparison") the topic was swapped to the plan's own
  `tn3` premise ("Chatbot Reasoning: Same Question, Years Apart") instead, grounded in a real
  published stat — GPT-3's own 2020 paper (Brown et al., arXiv:2005.14165) reports 29.2%
  accuracy on few-shot 2-digit multiplication — rather than any reproduced screenshot. Zero
  image-copyright exposure: the "then" side is a cited academic number, the "now" side is a
  live, checkable calculation (47×68=3196), not a claimed product screenshot. Pure monochrome
  palette (`theme.ts`'s `ACCENT` retired from mint green to white 2026-08-07) throughout —
  state differentiation (correct/wrong) reads via glyph + DIM/ACCENT brightness only, never hue.
  **Revision 1 built around thin-outlined boxes (`MathField`/`ReasoningStep`) and got rejected**
  ("UI elements are very simple... use rich elements, objects, graphics") — the same abstract-
  stand-in mistake documented twice before under the literal-real-UI rule (see that memory),
  just with cleaner styling. **Revision 2 rebuilt around a real, detailed chat-interface
  set-piece** per the content plan's own prescribed element for this topic: `components/
  ChatWindow.tsx` (app panel, traffic-light header dots, model label), `components/
  ChatBubble.tsx` (avatar, filled/outlined bubbles, bouncing-dots typing indicator), `components/
  ReasoningPanel.tsx` (a real "thinking" drawer like current chat products show, not a plain
  flowchart). Hook also rewritten to lead with contrast instead of flat exposition, per the
  proven cm1 hook formula. Reused proven `GlowBeam3D` bloom (a horizontal failure-strike in
  Shot3, a full-height vertical wipe transition in Shot4). Same watermark placeholder caveat as
  cm1.

- **`sk1`, "3 Claude Code Skills That Turn It Into a Video Editor" (Pillar 2, first episode),
  shipped 2026-08-09 after 4 revisions: `episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/build/3-claude-code-skills-that-turn-it-into-a-video-editor.mp4`, ~46.3s.**
  Features video-use, HyperFrames, and the official Remotion skill — the exact three tools used
  to build the ViralRespin pipeline this same session, chosen because they're verifiable
  first-hand rather than just researched. Real stats cited (20.4k/40.1k GitHub stars, 6M
  launch-demo views in 48 hours), sourced same session, not invented.

  **Revision 1 (v1, retired)**: light grid-paper background, one static `TerminalCard` held per
  tool for 6-9s. Rejected on 4 points after the user reviewed a third reference video
  frame-by-frame: too static (reference cycles a new visual device every ~2-4s, not one held
  shot), captions accumulated previously-spoken words instead of showing only the current
  phrase, background should be dark not light (colorful accents on top, not a muted palette),
  and the script itself was too short relative to how much ground the reference videos cover.

  **Revision 2 (current)**: dark canvas (`theme_skills.ts` reworked — `BG_DARK` not `BG_LIGHT`,
  kept the rotating colorful `ACCENTS` array on top, per direct instruction "keep background
  dark, you can keep rest colorful"). Each tool beat now cycles 3 distinct visuals
  (`components/RepoCard.tsx` — a custom-designed GitHub-repo-style card built from real
  fetched data, since live browser screenshot capture wasn't available this session; then
  `TerminalCard.tsx`'s command demo; then a colorful kinetic stat callout) instead of one
  static hold. New `components/CaptionsPop.tsx` replaces the accumulating caption pattern —
  only the current phrase is ever visible, plain words in `F_UI`, emphasized words (numbers,
  stat units, the CTA keyword) in the added `F_ACCENT` (Bricolage Grotesque) face, matching the
  two-font pairing visible on the reference's own on-screen text. Script expanded with real
  extra detail per tool (attribution, "frame by frame," the 48-hour stat) rather than padding,
  pushing runtime from 33s to 49.5s. Comment-gate CTA ("Comment EDIT") still in place, reversing
  the earlier follow-only rule — see `feedback-follow-only-cta-until-followers` memory. Same
  voice clone and `@thataipm` watermark as Pillar 1, different visual identity per pillar by
  design.

  **Revision 3 (current)**: four more direct fixes. (1) Script reframed first-person as the
  user's own automated pipeline case study ("I automated my entire video pipeline with three
  tools") rather than a generic third-person tool roundup — more authentic, and literally true
  of this same session's work. Every capability claim kept general/accurate (never claims a
  specific tool rendered *this* video unless true). (2) New `components/PipelineFlow.tsx` — a
  real visual hook, not text alone (the prior cut opened on kinetic text with nothing else on
  screen, flagged directly: "never start a video with just captions"). A flowchart builds
  itself node by node (Raw Footage → video-use → HyperFrames → Remotion → Final Video), reusing
  this channel's own established literal-visualization idea for pipeline/agent content, synced
  to real word timing. (3) New `components/StepTracker.tsx` — a persistent top chapter-progress
  bar (Hook/Step 1/Step 2/Step 3/Links), matching the reference video's own numbered-chapter
  tracker device more directly, shown across every shot. (4) `CaptionsPop.tsx` restyled — the
  current word now pops on a colored pill background with a scale-bounce instead of just plain
  text, addressing "style captions, they are looking so simple." Runtime 46.3s.

  **Revision 4 (current), four more direct fixes, shipped 2026-08-09: `episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/build/
  3-claude-code-skills-that-turn-it-into-a-video-editor.mp4`, ~46.3s.** (1) **Real screenshots with a zoom into the real star count.**
  `mcp__Claude_Browser__computer`'s plain `screenshot` action worked this time (earlier failures
  were transient, not a real limitation) but its `zoom` action still doesn't support a region
  crop ("full screenshot returned") — worked around by installing Playwright (`episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/
  assets/capture_screenshot.py`, headless Chromium, `device_scale_factor: 2` for a crisp zoom)
  to capture real, croppable screenshots of all three tools' actual GitHub pages. New
  `components/RepoScreenshot.tsx` shows the real page in a browser-chrome frame, then
  pans+zooms (CSS `transform-origin` anchored on the star badge's real pixel position, plus a
  computed pan so the badge recenters instead of just growing toward a corner) into the real,
  legible star count (20.4k / 40.1k / 4.3k) — replaces the recreated `RepoCard.tsx` (deleted,
  no longer used anywhere) per "use original screenshot where its possible." (2) **Removed
  `StepTracker`** (deleted, no longer used anywhere) per direct instruction ("don't show that
  step bar on top"); replaced with a lighter per-shot `components/ToolHeader.tsx` (the tool's
  real GitHub org-avatar logo + name) that identifies which tool is on screen without tracking
  abstract progress. (3) **Captions repositioned**: `CaptionsPop`'s `bottom` moved from 220 to
  380 — 220 sat inside `SAFE_Y1`'s margin but close enough to read as blocked by IG's own bottom
  UI overlay and disconnected from the visual card above it; 380 keeps real clearance and reads
  as part of the same visual composition, addressing "subtitles blocking graphics... should come
  in visual area of viewer." (4) **Real tool logos + setup info**: each tool's real GitHub org
  avatar (`anthropics`/`browser-use`/`heygen-com`/`remotion-dev`, downloaded directly from
  `github.com/<org>.png`, not fabricated) now appears in `ToolHeader` and inside both
  `RepoScreenshot`'s and `TerminalCard`'s header icon slot. `TerminalCard`'s command lines
  updated to each tool's actual real setup command (fetched from their own READMEs same
  session: `ln -sfn video-use ~/.claude/skills/video-use`, `npx skills add heygen-com/
  hyperframes`, `npx skills add remotion-dev/skills`), plus a new small "Works with: ..." line
  per shot listing the real agents each tool's own README names (Claude Code, Codex, Cursor,
  Gemini CLI, Openclaw, etc. — varies per tool, not a copy-pasted list), addressing "show claude
  code logo, tell where else they can set it up, give a short info on how to set it up."

  **Distribution deliverables, shipped 2026-08-09**: `covers/CoverSk1.tsx` (the episode's own
  three real tool logos in glowing accent-bordered tiles + title, `Cover-sk1` composition,
  rendered to `episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/build/3-claude-code-skills-that-turn-it-into-a-video-editor_cover.png`) and `episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/assets/captions.md` (three
  genuinely distinct platform captions, not the VO script reused — see `CLAUDE.md` §5 steps 6-7
  for the now-standing format this establishes for every future episode). **Posting automation
  is the next open item, not yet built** — see the "Posting automation" note below.

- **`the-karpathy-skill`, "The Karpathy Skill" (Main pillar, single-skill spotlight), produced
  2026-08-10: `episodes/the-karpathy-skill/build/the-karpathy-skill.mp4`, ~54.4s.** Real,
  verified facts: `forrestchang/andrej-karpathy-skills` (a repo now transferred to the
  `multica-ai` org, 201,077 GitHub stars as of production date), a single `CLAUDE.md` file
  encoding four rules derived from an Andrej Karpathy post on AI coding-agent failure patterns
  (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution), works with
  Claude Code and Cursor. Hook went through a real rewrite after direct feedback ("doesn't say
  that video is going to be about"), researching actual Instagram hook mechanics (viewers decide
  in ~1s, lead with the viewer's problem before any stat/artifact fact) rather than assuming,
  documented in the `feedback-hook-must-state-topic` memory's 2026-08-10 extension. Script run
  through the newly-installed `humanizer` skill's real draft-audit-final loop (not just
  eyeballed), which caught and fixed a staccato four-fragment run. First episode built entirely
  under the full-slug naming convention in both the top-level `episodes/` folder AND the
  internal `remotion/src/episodes/`/`remotion/public/` paths (no short-code invention, unlike
  `sk1`/`sd1`), since there was no already-shipped constraint blocking it.

  **Status, 2026-08-10: LEGACY / TRANSITION episode, per explicit decision during the v2.0
  migration (see §7 below).** Fully produced under the now-retired 2-pillar content strategy,
  before the v2.0 positioning existed. It is being **published as-is**, not reframed,
  regenerated, or killed, and is being treated as an informal baseline data point for comparison
  against the first true v2.0 experiment batch once one exists. It is explicitly NOT assigned an
  experiment_log.md batch, since it predates that system. All content produced after this point
  follows v2.0.

- **`hyperframes-had-the-components-i-hand-built` (first HyperFrames-era episode, produced
  2026-08-12/13): `hyperframes/renders/video.mp4`, ~48.2s.** The episode that drove the engine
  switch — see §7's production-engine retirement note for the full "why" (comparable quality,
  meaningfully lower token cost per episode, see `hyperframes/CLAUDE.md`'s own "Orchestration
  discipline" section for the exact lesson: ~43.7M effective tokens on this one build, most of
  it avoidable orchestration overhead, not the framework itself). Content is a self-referential
  case study of the HyperFrames build process (5-frame structure: hook → problem →
  proof/HyperFrames stats → gap/lesson → close), following the `faceless-explainer` workflow.
  Went through the same kind of real, direct-feedback revision cycle every prior episode did:
  captions repositioned higher (too low initially, same class of issue as sk1's caption-
  blocking-content fix), theme flipped dark→colorful-dark→light-with-colorful-accents (final
  call: light theme, colorful accent rotation kept, "I don't mind the color preference, just
  make sure we make best retention holding sexy video"), a literal-icon-visual fix for Frame 2
  (was relying on text alone for named items — the same "show the real thing, not just words"
  rule §1's Visual Retention Rule already states), a bad SFX swap (a "tick" stock cue that read
  as an irritating clock/rhythm sound, replaced with "ui pop" — caught twice, the second time
  because the actual bug was that the fix had only been written to `audio_meta.json` and never
  propagated into `index.html`, the file that actually renders — a real gotcha worth remembering
  for this engine: **always verify a fix landed in `index.html`, not just its source data file**),
  and a background grid-texture removal (the 64px cross-hatch pattern read as "boxes in the
  background," not desired). This episode's production log is the first real evidence this
  channel's craft rules (§1) transfer cleanly to a different render engine.

### Posting automation (not yet built, 2026-08-09)

Requested after sk1's distribution deliverables shipped: automate posting to all 3 platforms
in `docs/posting_platforms.md`. Not started — needs, per platform: Instagram (Graph API via a
connected Business/Creator account + Meta app review for `instagram_content_publish`),
LinkedIn (Marketing/Share API + OAuth app), YouTube (YouTube Data API v3 + OAuth, Shorts is
just a normal upload with a vertical video + `#Shorts`). All three need real API
credentials/app registration the user has to create themselves (Claude cannot self-authorize
API access to the user's own social accounts). Whatever gets built should assemble the post
(video + cover + platform caption from `captions.md`) and hand off to either a scheduling tool
(Buffer/Later/Metricool-style, faster to stand up, no app-review wait) or direct API calls
(more control, slower to get approved) — decide which once the user weighs in. **Regardless of
which path: actually publishing a post is a "send on the user's behalf" / "publish public
content" action per this assistant's own standing rules, so even a fully automated pipeline
still needs an explicit go-ahead per post, not a silent auto-publish** — the automation should
prepare/queue, not fire without confirmation, unless the user later says otherwise explicitly.

### Daily production automation (built 2026-08-10)

Direct request: "set up schedulers now so our system runs automatically." A Windows Task
Scheduler entry ("ThatAIPM Daily Pipeline," registered by the user, not this assistant — OS-level
persistent scheduling is standing configuration the harness itself blocks an agent from creating
unilaterally) runs `automation/run_daily_pipeline.ps1` once a day at 11AM local time. That
wrapper invokes `claude -p` headlessly against `automation/daily_pipeline_prompt.md`, which
encodes the full production cycle (Quality-Gate topic selection, primary-source fact
verification, script, humanizer pass, VO, render applying the "Never Let a Frame Sit"/"vary
composition" rules from the start, captions with real YouTube tags, push to GitHub) and then
**stops** — its own hard limits explicitly forbid calling `schedule_zernio_post.py` or any
Zernio endpoint, honoring the "Posting automation" rule directly above. Notification design
note: the prompt originally called the `PushNotification` tool, but that depends on an active
Claude Code terminal/Remote Control session that doesn't exist for a Task-Scheduler-launched
headless run, so it was switched to a plain Windows Forms balloon-tip notification (no
dependency on Claude Code's own session state), tested and confirmed working before relying on
it. The daily run writes one line to `automation/logs/latest_result.txt` (gitignored,
overwritten each run); the wrapper reads it and pops the notification. Only fires if the
machine is on and the user is logged in at 11AM — no stored credentials for an "unattended,
locked" run, deliberately. A day with no viable topic or a failed fact-check produces no
episode and a one-line blocker notification instead of a forced low-quality output.

**Disabled 2026-08-11, direct decision after live debugging looked unresolved in the moment —
correction same day, it wasn't actually broken.** During live debugging, several triggered runs
showed a blank console with zero visible output for minutes at a stretch, which read as a hang;
went through several real fixes in order (piping the prompt via `|` → switching `claude.cmd` →
`claude.exe` directly → redirecting stdin from the prompt file instead of piping → live-tailing
the redirected stdout/stderr into the wrapper's own visible console) without the visible output
ever appearing in the short window each was watched. **What was actually happening**: a full
production run (research, fact-check, script, ElevenLabs VO, Remotion render) genuinely takes
20-30+ minutes and doesn't produce much console output along the way, so "nothing visible after
a couple minutes" looked identical to "hung" but wasn't. One of the very triggers fired during
this debugging session kept running successfully in the true background the whole time —
confirmed after the fact by real `claude` processes still alive with substantial accumulated CPU
time, and by a genuinely completed episode (`episodes/claude-just-got-68-product-management-skills/`,
Batch 2 in `docs/experiment_log.md`) that this same run produced, unattended, end to end. So the
underlying mechanism does work; the real gap was visibility into "still working" vs. "stuck"
during the first few minutes, not a functional bug. **User's call regardless of this
correction: stop pursuing daily automation, keep it simple, trigger episode production manually
in a live session instead.** `Disable-ScheduledTask` was run (task definition left in place, not
deleted). If picked back up, the actual fix needed is probably just patience (or an early
heartbeat write to the log/result file so "still working" is distinguishable from "stuck"
within the first minute) rather than more stdin/output-plumbing changes — those were never the
real problem.

**Update 2026-08-13**: `automation/daily_pipeline_prompt.md` and `run_daily_pipeline.ps1` were
moved to the external trash folder along with the rest of the Remotion-era `automation/`
scripts (see the production-engine retirement note in §7) — they were already disabled and
written around the old render engine (`daily_pipeline_prompt.md` explicitly encoded a Remotion
render step). Reviving daily automation later means rewriting this prompt around HyperFrames'
own workflow from scratch, not resurrecting the trashed file as-is.

## 7. Strategic system: That AI PM v2.0 (2026-08-10)

**What changed**: the user supplied "That AI PM: Content System Operating Spec v2.0"
(`docs/thataipm_content_system_operating_spec_v2.md`), a formal strategy document positioning
the channel around "AI-native product thinking" for a Product Manager audience. This
**fully supersedes** the 2-pillar content strategy documented earlier in §6 (retirement note
in that section). It did not touch the production engine (Remotion at the time, §§2-5's frozen
record; HyperFrames now, `hyperframes/CLAUDE.md`) — this was, and still is, a strategy-layer
change only, independent of whatever renders the video.

**Architecture principle**: strategy sits ABOVE the production pipeline, not inside it. Nothing
in the distribution-layer `automation/` scripts, the GitHub hosting flow, or the Zernio
scheduling flow changed or needs to change for this migration, or for the later engine swap.
What's new since v2.0 is a thin layer of structured planning/tracking docs the production
pipeline didn't have before:

```
STRATEGY                docs/thataipm_content_system_operating_spec_v2.md (north star)
  |
CONTENT PILLARS          same doc, section 3 (35/30/20/15, hypothesis not fixed)
  |
HYPOTHESIS               docs/experiment_log.md, opened per batch
  |
EXPERIMENT BATCH         same log, grouped entries
  |
TOPIC SELECTION           scored against the 100K test + the 4 AI-native-PM questions
  |
STRATEGIC QUALITY GATE   recorded per concept inside the batch entry (see the log's
                        Quality Gate sub-schema), only PASS concepts proceed
  |
RESEARCH / FACT CHECK    unchanged discipline: live research, cited in the script file
  |
SCRIPT -> PRODUCTION -> RENDER -> CAPTIONS -> DISTRIBUTION   see hyperframes/CLAUDE.md
  |
ANALYTICS                hybrid, see the finding below
  |
LEARNING                 memory system (durable rules) + experiment_log (batch-specific)
  |
KEEP / SCALE / MODIFY / KILL   written into the batch entry, closes it
  |
NEXT EXPERIMENT          new batch opens
```

**Zernio analytics investigation, 2026-08-10, corrected same day**: initially checked Zernio's
own docs (`docs.zernio.com/llms-full.txt`) only, and wrongly concluded follows/watch-time
weren't available per post. Re-checked by actually calling the real API against sd1's already-
published posts, not just reading docs, which is the only reason the mistake got caught. Real
finding, via `automation/fetch_zernio_analytics.py`:

- **Instagram**: `GET /v1/analytics?postId=...` returns impressions, reach, likes, comments,
  shares, saves, views, AND per-post `follows` and average watch time
  (`igReelsAvgWatchTime`/`igReelsVideoViewTotalTime`), confirmed present on a real post
  (`follows: 0, igReelsAvgWatchTime: 6896` on sd1's Reel). The earlier claim that Instagram
  doesn't expose these was wrong.
- **YouTube**: the same endpoint returned all-zero follows/watch-time fields on the one real
  post tested, still unclear whether that's a genuine zero or a platform placeholder. A
  separate endpoint, `GET /v1/analytics/youtube/video-retention`, returns a real
  audience-retention curve once a video clears YouTube's own view-count and 2-3 day
  processing-delay thresholds, confirmed working (`hasAnalyticsScope: true`) but empty on
  sd1's low-view video. No single named "3-second hold rate" field exists, but it's derivable
  from this curve's early points once populated.
- **Practical effect**: automated capture via `fetch_zernio_analytics.py` covers most of the
  spec's metrics, including the previously-assumed-unavailable follows-per-post on Instagram.
  Manual capture from native Insights/Studio UI is now the fallback for whatever the script
  genuinely can't get (confirmed real gaps, not assumed ones), logged into
  `docs/experiment_log.md`'s `results:` field with the source noted per number.

**"The Karpathy Skill" episode**: produced before this migration, under the old strategy.
Explicit decision: publish it as-is, do not reframe/regenerate/kill it, treat it as a legacy/
transition episode and an informal baseline data point. Full detail in its own entry in §6.
All content produced from this point forward follows v2.0.

**Retired docs**: `docs/thataipm_pillar2_content_plan.md` and `docs/30_day_content_calendar.md`
were kept RETIRED-but-present through the initial migration, then **deleted outright 2026-08-10**
during a docs-folder cleanup — fully superseded, nothing in them was still being pointed to as
current, and git history is the audit trail if either is needed again. `docs/channel_bio_copy.md`
stays (its current v2.0 section and the old superseded draft live in the same file).
`docs/posting_platforms.md` is unaffected (distribution mechanics, not strategy) and stays valid
under v2.0 as-is.

**Data-removal practice, added 2026-08-10** (direct instruction: "keep data removal practice
from local and github post so we don't have any data crunch"): every episode's rendered
`build/*.mp4` + cover PNG get force-added to git despite `.gitignore`'s own
`episodes/*/build/` rule, since Zernio needs a real public URL to fetch the video from at
publish time, and GitHub raw hosting is what serves that. At v2.0's target cadence (60-90
pieces over 90 days), keeping every one of those videos permanently git-tracked would grow
this repo without bound. **Standing rule**: once a scheduled post's Zernio status reads
`published` (not just `scheduled`), untrack that episode's `build/*.mp4` and cover from git
(`git rm --cached`, never a plain `rm`, the local file stays on disk) in the next commit, the
existing `.gitignore` rule then keeps it untracked going forward. Applied immediately to `sk1`
and `best-ai-tools-for-voiceovers`, both confirmed published, local files untouched. **Do NOT
untrack an episode before its post is confirmed published.** Note this only bounds the size of
the repo's current tree; git history still retains every blob ever committed (see the standing,
still-unanswered offer to do a full history rewrite, noted elsewhere in this file) unless a
separate, deliberate history-rewrite pass is run.

**"The Karpathy Skill" and "What AI Is Actually Doing to PM Hiring" (the-ai-pm-pay-gap)
confirmed published 2026-08-11** — both platforms live for the former (checked directly via
`GET /v1/posts?status=published`, not assumed from the schedule time passing), untracked from
git per the rule above. The latter's YouTube post is published; Instagram was still mid-fire at
last check (same 17:00 IST slot) — its `build/` stays tracked until that's confirmed too.

**`episodes/scheduled/` index, added 2026-08-11** (direct request: "so i can see scheduled
episodes in one place"): one small manifest file per episode with at least one platform post
still in Zernio's `scheduled` state, not yet `published`. Deliberately an index, not storage —
episode folders never move here, since Zernio holds the exact GitHub raw URL for each scheduled
post and needs it to keep resolving until it fires; moving a folder after scheduling would
break that. Delete an episode's file from here once every platform on it shows `published`. See
`episodes/scheduled/README.md` for the exact format and lifecycle.

**CTA fulfillment, deliberately deferred 2026-08-10**: every episode still closes on "Comment
[KEYWORD] and I'll send you the link" with no actual fulfillment process behind it (see the
"Still open" note under Posting automation below). Direct decision: not worth building yet,
revisit only if a single post crosses 10 real comments. Not an oversight, a threshold.

**Fabricated-stat incident, caught and corrected 2026-08-10**: Batch 1's first concept
(originally scripted, rendered, and shown to the user as "The AI PM Pay Gap," headlined on a
$245K AI-native PM vs $123K traditional PM compensation claim) was produced and only caught as
wrong because the user gave direct feedback that the visuals looked thin ("why have you not
used any screenshots or created something of your own"). Going to find real screenshots to fix
the visuals meant re-reading the actual cited source pages directly, which is what surfaced
that the compensation figures don't appear on either cited source, or anywhere else checkable,
only the episode's other two stats (the +34%/-12% hiring split, the 85%/2% investment gap)
turned out to be real and verbatim on the pages. The research agent that originally supplied
the figure had bundled a plausible-sounding number in with two real, sourced ones under a
single citation pair, and that number was used in a script, a render, a cover, and captions
without ever being independently checked against its primary source.

**The actual failure**: trusting a research agent's citation as proof, rather than opening the
cited URL directly and confirming the specific number is actually printed on the page. This is
exactly the discipline already applied successfully elsewhere this session (the Zernio
analytics correction earlier in this same section came from doing precisely that), it simply
didn't get applied to this one research pass before scripting from it.

**Standing rule, going forward**: before locking a script that cites a specific number from a
research pass (not a well-known, easily-verified fact like a GitHub star count checked via
`gh api`, but any research-agent-supplied statistic), open the actual cited source and confirm
the number is printed on the page, in the same way `WebFetch` was used here to re-check both
sources directly. A citation existing is not the same as a citation being checked. The episode
was fully rebuilt around only re-verified facts, real evidence screenshots of the actual source
pages were added to every stat-bearing shot in the process, which also directly answered the
visual-thinness feedback. See `docs/experiment_log.md`'s Batch 1 entry for the full correction
note, and the episode's own script file for the incident writeup.

**Positioning revised 2026-08-12, direct conversation, two days into the v2.0 window**: the
"AI-native product thinking" / PM-education positioning documented above and in
`docs/thataipm_content_system_operating_spec_v2.md` is superseded by a new core positioning:
**building real AI automation systems, in public**. Full reasoning, the revised north star,
audience, pillars, and newsletter/lead-magnet/monetization sections are all in the spec doc
itself (updated in place, same file, still versioned v2.0 per explicit instruction not to fork
a new document for this). Kept brief here since the spec doc is the source of truth, not this
file, per §21 of that doc.

**Why, briefly**: two things converged. The founder isn't interested in being seen as a PM
educator and the real leverage is the automation system already being built for this channel's
own production (this repo's Remotion/ElevenLabs/agentic pipeline), not PM domain expertise.
Separately, the one real early data point available (the-karpathy-skill, the most
automation/tooling-flavored post so far, meaningfully outperforming the-ai-pm-pay-gap, the most
PM-specific one, on engagement/retention/saves, see `docs/experiment_log.md`) was consistent
with that instinct, though three posts and zero follows anywhere is nowhere near enough
evidence on its own, so this is a founder-conviction call, not a data-driven one, and is logged
honestly as such.

**What does NOT change**: the visual system, the schema vocabulary, the quality-gate PRINCIPLE
(a mechanical PASS/FAIL check over eyeballing — `check_static_frames.py` at the time, now
`npx hyperframes check`, see the production-engine retirement note below), the shot-list
literal-device-justification rule, and the `@thataipm` handle (kept for now, a rename would be
wasted motion before there's an audience to lose, revisit once there is one) are all
unaffected. This is a strategy-layer change only, same as the original v2.0 migration was. (The
production ENGINE itself did later change, 2026-08-13 — see below — but that's a separate,
production-layer event, not part of this positioning revision.)

**What's explicitly deferred, per direct instruction**: monetization shape and the newsletter/
lead-magnet buildout (spec §14-16) are parked until there's a real audience to decide them
against, not abandoned. Full autonomy (the daily pipeline, disabled 2026-08-11, see that
section above) was a real future goal but explicitly not pursued right now either, first
priority is audience building on the existing Instagram + YouTube Shorts format under the new
positioning. **Long-form YouTube, updated 2026-08-13**: no longer indefinitely deferred — see
the production-engine retirement note directly below, once HyperFrames is fully finalized as
the standing production system the plan is to start producing long-form YouTube alongside the
existing Shorts/Reels format. Not started yet as of this note; a real trigger condition (the
finalized system + a first batch of new content through it) gates it, not a fixed date.

**Production engine retired to HyperFrames, 2026-08-13.** The Remotion/React render pipeline
(§§2-5's now-frozen historical record) was fully retired in favor of **HyperFrames** (per-episode
`hyperframes-<slug>/` project folders) — see the top of this file for the full pointer and
reasoning. This is a
PRODUCTION-layer change only, same architectural principle as the paragraph above: strategy
(this section, the v2.0 spec, the experiment log) is completely unaffected, only what renders
the video changed. Direct instruction accompanying the switch: "I like this system, I want you
to discard all old references, and keep this finalized system with hyperframes" — `remotion/`
and its Remotion-only `automation/` scripts moved to an external trash folder (not deleted,
recoverable if ever needed), `docs/technical_architecture.md` and this file were both updated
to point at the new engine instead of the old one. **Repackaging intent, stated same day**: the
user intends to eventually repackage this production system for other people to buy/use once
it's proven out — noted here so future work (naming things, hardcoding brand specifics into
shared docs vs. keeping them separable) can keep that eventual use case in mind, even though
the actual generic/sellable-product restructuring is explicitly not being done yet (the user's
own call, 2026-08-13: clean up first, split later).

**Strategy revised again, 2026-08-14: single automation-building positioning replaced by a
3-pillar experiment.** Full detail in `docs/thataipm_content_system_operating_spec_v2.md` §0/§3
and `docs/experiment_log.md`'s new "Pillar Experiment" section — this is a summary pointer, not
the source of truth. Trigger: real retention data reading flat/generic plus a direct read that
the tool-spotlight/automation-building lane has gotten crowded ("every other person is making
videos like us") and stopped differentiating on its own. Three pillars now tested head to head
at equal weight, 10 videos each (30 total), before committing weight to any one:

1. **AI Tools & Agent Spotlights** (unchanged) — the known-working baseline this test is run
   against.
2. **Navigating the AI Era** (new) — "What can a person do differently with their life,
   career, work, and ambitions now that AI exists?" First-person, in-progress posture ("I'm
   figuring this out too"), explicitly not authority-lecturing — that posture, not the topic
   itself, is the actual differentiator, since "AI and your career" as a bare topic is already
   crowded. Absorbs the old Build-in-Public and Opinions & Trends pillars as **distinct,
   undiluted registers** inside an emotional hook vocabulary (fear / hope / awe / curiosity /
   anger / recognition / inspiration — spec §3 has the full table with example hooks per
   register), rather than folding them into generic career content. Build-in-Public
   specifically lives in the Awe/Hope/Inspiration registers as this pillar's proof-of-work
   engine — this channel's own production system doesn't disappear, it becomes evidence inside
   a bigger story instead of being the story itself.
3. **How AI Systems Actually Work** (unchanged).

**Already-shipped tool-spotlight episodes do not retroactively count** toward the new 10-per-
pillar totals (book-to-skill, pm-skills, the-karpathy-skill,
hyperframes-had-the-components-i-hand-built) — real prior evidence, just not part of this
count, which starts fresh from 2026-08-14. Decision gate is real Instagram/YouTube data per
pillar (follows/1,000 views primary, spec §9), not founder conviction alone this time — a
deliberate difference from the 2026-08-12 revision, which was conviction-led on thin data.

## 8. Working discipline (adapted from the karpathy-skill rules, 2026-08-11)

Direct instruction, prompted by watching this project's own actual failure modes and then
asking whether `multica-ai/andrej-karpathy-skills` (201,420 stars as of 2026-08-11, the same
repo covered in the-karpathy-skill episode) was worth adopting here. Evaluated each of its four
rules against real incidents in this project rather than copying it wholesale — one of them
doesn't fit this codebase and is deliberately NOT adopted; say why, not just what.

**Goal-Driven Execution — adopt fully, already validated in practice.** "Looks right" is not a
success criterion; a check that can print PASS/FAIL is. This is the exact mechanism that fixed
the old Remotion pipeline's static-frame problem (`automation/check_static_frames.py`, now
retired along with the rest of Remotion — the same discipline lives on as `npx hyperframes
check`'s motion/layout/contrast gate): the fix wasn't "try harder," it was turning an
unverifiable feeling into a command with an exit code. Apply this pattern generally: before
calling a subjective judgment call "done" (does this hook state the topic fast enough, is this
motion actually visible, does this fact check out), ask whether it can be turned into something
that can fail loudly instead of just feeling fine. Not everything can (hook clarity is closer
to editorial judgment than a pixel diff), but default to trying before settling for eyeballing.

**Think Before Coding — adopt, with a concrete trigger.** State a visual/creative assumption
out loud when making it, specifically anything with a magnitude nobody supplied (an animation
amplitude, a hold duration, a threshold) — these are exactly the silent judgment calls that
went wrong this session (`breathe()` at 0.02, assumed sufficient, wasn't). Naming the assumption
doesn't make it correct, but it's the difference between a guess that quietly ships and a guess
that gets checked.

**Surgical Changes — already covered, formalizing the existing practice.** This project already
has the equivalent rule in a narrower form (§6: once a video is posted, don't re-edit it; the
old Remotion pipeline's shared-component-fix pattern — e.g. adding `breathe()` to a shared
stat-card component — was fine specifically because it didn't touch already-rendered output,
only future renders; the same logic applies to HyperFrames' shared `hyperframes/frame.md`
components now). No behavior change, just naming the general version of a rule this project
already follows.

**Simplicity First — NOT adopted as written, real conflict with this codebase.** Its own text
says "no abstractions for single-use code," but this project deliberately builds shared,
reusable components from their FIRST use (the old Remotion pipeline's `ComparisonCard`/
`DisparityBar`/`PipelineFlow`/`TerminalCard`; HyperFrames' own schema-vocabulary equivalents
now), because the channel's format guarantees dozens of future episodes will need the same
visual patterns — that's a known, structural requirement here, not speculative gold-plating the
karpathy rule is warning against in general software. Blind adoption would argue against this
project's own working architecture. The part worth keeping: don't add config/flexibility/
error-handling nobody asked for on top of a component — build the reusable shape because it's
genuinely needed, not the unneeded flourishes around it.

## 9. Production-process skills (added 2026-08-13)

Five project-scoped skills in `.claude/skills/` encode this channel's own hard-won production
conventions on top of the generic global HyperFrames skills — built after the book-to-skill
episode's VO-model mismatch and manual frame-timing resync cost real rework. Each is invokable
directly (`/thataipm-vo`, etc.) and independently improvable; add findings/fixes to the
relevant skill's `SKILL.md` rather than re-discovering the same gotcha in a future session.

Standing production order: `/thataipm-script-review` → `/thataipm-vo` → (if VO changed after
frames already existed) `/thataipm-resync` → `/thataipm-assemble` → `/thataipm-distribute`.

- **`thataipm-vo`** — generates VO on the correct `eleven_v3` model (the shared `media-use`
  engine's Python path hardcodes `eleven_multilingual_v2`, the exact bug that shipped
  wrong-sounding VO on book-to-skill's first draft) via a direct ElevenLabs API call, runs real
  forced-alignment for word timing, and writes into `audio_meta.json` without touching the
  faceless-explainer wrapper's separate sidecar (`audio_engine_meta.json`) — the second real bug
  hit this project, where a later `fetch-sfx` run silently overwrote hand-added word timing.
- **`thataipm-script-review`** — chains `/humanizer`'s draft-audit-final loop with this
  channel's own mechanical gates (zero em/en dashes anywhere per the standing hard rule, runtime
  estimate calibrated against real measured episodes, staccato-fragment-run detection) plus a
  manual proper-terms-restoration check, so a script gets reviewed against everything at once
  instead of three separate user-feedback rounds.
- **`thataipm-resync`** — after VO changes, prints every frame's real per-word timeline from
  `audio_meta.json` (the exact manual step done by hand for book-to-skill's pacing revision) and
  mechanically resets each frame's full-span `data-duration` values, leaving scene-specific
  boundary placement as the judgment call it actually is.
- **`thataipm-assemble`** — chains captions build → assemble-index → transitions inject →
  `hyperframes check` → optional snapshot → render → `ffmpeg volumedetect` into one command,
  stopping at the first failure with a clear report instead of six separate manual steps.
- **`thataipm-distribute`** — cover still, platform captions with a mechanical distinctness
  check (word-overlap similarity between platforms, calibrated against a real
  too-similar-caption instance caught in an already-shipped episode), git push + URL
  verification, and Zernio scheduling via the existing `automation/schedule_zernio_post.py`.
  **Preserves the hard publish-confirmation gate** — states the full post plan and waits for
  explicit per-episode confirmation before the actual schedule call, same as the manual process
  it replaces.
