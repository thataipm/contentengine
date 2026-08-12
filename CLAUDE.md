# Video Production Engine

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
even while it was still present locally. What survived the reset is the underlying render
engine: the technical machinery for turning a script + VO into a rendered vertical video,
independent of any particular topic or look.

The new project is a **faceless** Instagram page (no on-camera avatar). Its niche, content
pillars, visual direction, and a 30-episode content plan are all decided now (below and
`docs/how_ai_works_content_plan.md`) — don't assume any of it from the archive, that's the old
channel's now-retired identity.

**Sibling project, unrelated brand**: `../ViralRespin/` (started 2026-08-08) sources real viral
long-form videos and rebuilds original short-form Reels from them — different tooling
(video-use + HyperFrames, not this Remotion engine), different visual style, no shared identity
with this channel. See its own `CLAUDE.md` for full context; don't pull its conventions in here
or vice versa.

## 1. Channel brief: "How AI Actually Works"

Delivered by the user 2026-08-06 (`channel-brief-how-ai-works.md`), locked in as the project's
niche and pillars going forward.

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
instead of defaulting to the same few, is worth copying). **Before building a new stat/data
beat, check this list first** — it should grow every time a genuinely new device gets built,
the same way this rule's own "errors not to repeat" pattern already works elsewhere in this
file:

- `components/TrendChart.tsx` — a single line that draws itself (SVG `strokeDasharray`), up or
  down, with a glowing marker riding the tip. For "this metric moved."
- `components/PipelineFlow.tsx` — nodes building themselves in sequence, connected by growing
  stems; supports `slotsVisibleFrom` for a dim pre-reveal state so a long VO preamble before
  the first node's word doesn't leave the content zone empty. For a process/lifecycle/pipeline.
- `components/BarChart.tsx` — labeled columns growing from a shared baseline, real values only.
  For comparing several discrete numbers side by side (distinct from `DisparityBar`, which is
  one horizontal fill framed as "this much of a whole").
- `components/CountUp.tsx` — a number rolling up to its real target instead of just popping in.
  For a single big stat that deserves more weight than a static pop.
- `components/DisparityBar.tsx` — a labeled horizontal fill bar. For "X% vs Y%" gap framing.
- `components/ComparisonCard.tsx` — two labeled values side by side. For a direct A-vs-B stat
  pair when neither a bar nor a line fits better.
- `components/TerminalCard.tsx` — a typed command sequence with a blinking cursor (real motion
  for the whole hold, not just the typing). For install commands, code, CLI output.
- `components/RepoScreenshot.tsx` / `ProductScreenshot.tsx` — a real captured screenshot with a
  camera-push zoom into one real detail, plus a continuous scan-sweep during any hold (see rule
  1 above). For citing real evidence — never fabricate what this shows.
- `components/CommentCTA.tsx` — the closing comment-keyword card with twinkling stars.

Still generic/underused (not yet built as shared components — build one the next time a shot
actually needs it, don't pre-build speculatively): gauge/donut (percent-of-total as a filling
ring), staggered-reveal table (feature/tool comparison rows), timeline (chronological
before/after). Real data only, same as everything else on this list — a chart TYPE is just a
container, it doesn't excuse inventing the numbers inside it.

## 2. What's here

- `remotion/` — the Remotion (React/TypeScript) render engine. Node 18+, npm, ffmpeg required
  (all already set up on this machine). Free under Remotion's individual/≤3-employee license
  (re-check if that changes).
- `automation/` — VO generation and word-timing tooling, ElevenLabs-backed:
  - `generate_vo.py [--timestamps]` — text-to-speech via the ElevenLabs REST API (`eleven_v3`),
    `--timestamps` also fetches character-level alignment. **VO delivery pace, 2026-08-10**:
    sd1's VO read as slow on direct feedback. The obvious fix — `voice_settings.speed` — does
    **not work here**: that parameter only applies to non-v3 models (range 0.25-4.0 via the raw
    API, 0.7-1.2 on the Agents Platform), and **v3 explicitly does not support it**. v3 also
    doesn't support SSML break tags. The actual v3 mechanism is **inline audio tags in the
    script text itself** — `[rushed]`, `[rapid-fire]`, `[deliberate]`, `[slows down]`, etc. —
    written directly into the text sent to the API, the same as any other v3 expression tag.
    For a faster-reading VO, open the script (or a slow section of it) with a tag like
    `[rushed]` rather than trying to fix this via an API parameter.
  - `derive_word_timing.py` — for a **brand-new** episode: splits a script into shots (blank-line
    separated), cuts precise per-shot audio from a continuous VO take using the real alignment
    data, writes per-shot word timing.
  - `align_shot_audio.py` — for **already-cut** shot audio: forced-alignment against its own
    known line (needs the `forced_alignment` scope on the API key).
  - `generate_sfx.py` — sound effect generation.
  - `capture_product_screenshot.py` — Playwright (headless Chromium) capture of a product's
    public page (a showcase/gallery/pricing page — never a login-gated dashboard, no credential
    handling) plus an optional zoomed crop of one real detail. Generalizes the Claude Code
    skills episode's GitHub-specific
    `episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/assets/capture_screenshot.py`
    for Tool Showdowns, where the subject is any product's own site, not a github.com repo page.
    Two-tier sourcing approach (the source doc this came from, `docs/thataipm_pillar2_content_plan.md`,
    was deleted 2026-08-10 with the rest of the retired pillar-2 strategy — see §7 — but the
    practice itself still applies to any product-screenshot sourcing going forward): **Tier
    A — public showcase pages (automatable, preferred)**, most tools have a public gallery/
    showcase/examples/pricing page with real, attributable content and no login required, capture
    via this script. **Tier B — hands-on product use (stays manual)**: if the compelling shot is
    genuinely "watching a prompt generate inside the tool," that's behind a login and stays a
    manual capture, no credential handling or scripted login of any kind.
  - **`.env` holds `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`.** The voice ID is still the
    old channel's clone — replace it with the new one before generating any real VO.
    `HEYGEN_API_KEY` is also present but unused (this project is faceless); harmless to leave.

## 3. What survived in `remotion/src/` (the bare engine)

- `theme.ts` — **technical constants only**: canvas `W`/`H`/`FPS`, and the Instagram Reels UI
  safe-zone constants (`SAFE_X0`/`SAFE_X1`/`SAFE_Y0`/`SAFE_Y1`/`SAFE_W` — IG's own overlay
  buttons cover roughly the right 120-150px and bottom 300-320px of the canvas; keep
  load-bearing content inside these bounds). No colors, no fonts — that's the new theme,
  decide it explicitly with the user before writing it into this file.
- `motion.ts` — `springIn(frame, fps, delay)` (standard entrance spring) and
  `edgeFadeVolume(frame, durationInFrames, fadeFrames)` (per-shot audio volume envelope, see
  the crossfade pitfall below).
- `Episode.tsx` — the episode-level orchestrator. Takes `shots: ShotDef[]` and sequences them
  via `@remotion/transitions`' `<TransitionSeries>` (crossfade between shots,
  `DEFAULT_TRANSITION_FRAMES = 5`). Exports `totalEpisodeFrames(shots, transitionFrames?)` —
  **any `calculateMetadata` must use this, not a plain sum of shot durations**, since
  transitions make shots overlap and a plain sum renders blank at the tail. Draws `Watermark`/
  `ProgressBar` ONCE at the episode level, outside `<TransitionSeries>` — a shot-local
  `useCurrentFrame()` resets to 0 every shot, so a progress bar drawn inside a shot has no way
  to know its true position in the episode; drawn here it sees the real global frame for free.
  Takes `watermarkHandle`/`watermarkColor`/`accentColor` as required props — no defaults, no
  channel identity baked in, the caller decides.
- `components/Chrome.tsx` — `Watermark` (`handle`/`color`/`opacity` props) and `ProgressBar`
  (`color`/`track` props), both fully generic now.
- `components/ContentZone.tsx` — vertically centers a shot's main content between a `top`/
  `bottom` bound (defaults 260/560) instead of anchoring at a fixed `top`, fixing the dead-space
  layout issue (see §6's 2026-08-10 entry). Use this for every shot's main content area going
  forward, not a raw absolutely-positioned div.
- `components/Sfx.tsx` — one-shot sound cue (`type: "tick" | "whoosh" | "chime"`, `at: <shot-local
  frame>`) wrapping `<Sequence>` + `<Audio>` for the channel's "sound-synced beats" rule. `tick`
  = small UI pop, `whoosh` = sustained camera-push motion, `chime` = payoff/reveal beat. Volume
  kept to 40-50% per direct instruction — an accent under the VO, not a backing track. Reuses
  `public/sfx/{tick,whoosh,chime}_raw.mp3`.
- `components/ProductScreenshot.tsx` — real browser-chrome-framed product screenshot with a
  pan/zoom "camera push" into one real detail (`highlightBox`), added 2026-08-10 for Tool
  Showdowns. Generalizes `RepoScreenshot` (which assumes a github.com repo page + stars badge)
  for any product's public page — same visual technique, no GitHub-specific assumptions. Pair
  with `automation/capture_product_screenshot.py` for the actual capture. **Zoom-window note
  added 2026-08-10, still good practice but NOT the cause of the "pacing is slow" feedback
  (corrected same day — that was about VO delivery speed, see §2's `generate_vo.py` entry)**:
  don't span `zoomStart`→`zoomEnd` across the whole pre-payoff hold regardless — sd1 used e.g.
  `zoomStart=30, zoomEnd=322` on a beat that didn't land until frame 330, a ~9.7s continuous
  drift that's slower than it needs to be even though it's technically always in motion. Keep
  the zoom window short (roughly 60-90 frames / 2-3s) and position it to land right before the
  payoff beat, so the screenshot holds briefly at its settled pop-in scale first, then the
  push-in itself is a quick, punchy motion rather than a slow continuous drift.
- `three/SceneRig.tsx` — per-shot `<ThreeCanvas>` wrapper for any React Three Fiber content:
  orthographic camera sized so 1 world unit = 1 screen pixel, shared neutral key/fill lighting,
  a local deterministic environment map, bloom post-processing. Wrap any 3D shot content in
  this; it's the reusable rig, not tied to any particular object design. Takes optional `zoom`
  (real camera zoom for a continuous push-in — see this section's pitfall on why this must be a
  camera prop, never a CSS transform on a wrapper div), `vignette`, and `chromaticAberration`
  (both passed through to `BloomRig`, off by default).
- `three/BloomRig.tsx` — the bloom post-processing pass used by `SceneRig`, now also owns
  optional `vignette`/`chromaticAberration` passes (one shared `<EffectComposer>`, see this
  file's own comment on why a second `<EffectComposer>` doesn't layer correctly). Getting bloom
  to actually read as a glow, not a flat shape, needs real HDR-bright material values — see this
  section's pitfall below before reaching for it again.
- `package.json` also has `@remotion/noise` and `@remotion/shapes` installed (official, free
  Remotion packages) but not yet used by anything — pulled in 2026-08-06 for organic
  noise-driven motion and clean procedural vector shapes respectively, available whenever a shot
  needs them.
- **Perspective-camera 3D is possible and works, but needs its own `<ThreeCanvas>`, not
  `SceneRig`.** `SceneRig` is deliberately orthographic (1 world unit = 1 screen pixel, for flat
  2D-style diagram placement via `pxToWorld`) — genuine depth/parallax content (a moving camera,
  a particle field with real perspective falloff) needs a real `fov`-based camera instead, which
  means standing up a `<ThreeCanvas>` directly rather than reusing `SceneRig`. `BloomRig`/
  `EnvironmentSetter` are still reusable as-is in that setup (neither cares which camera type is
  active). Animate the camera every frame via a `<PerspectiveCamera makeDefault position={...}
  rotation={...} />` (drei) with frame-computed prop values, the same "just compute it from
  `useCurrentFrame()`" pattern used everywhere else in this codebase, not imperative `useFrame`
  mutation. First real example: `HookPreview_Vortex.tsx`'s particle-tunnel hook concept
  (2026-08-06).
- **Raw `<points>` with a manually-built `Float32Array` is the right tool for a large animated
  particle field** (hundreds of points, one draw call, arbitrary per-particle HDR color) — build
  positions once in `useMemo` (deterministic, no `Math.random()` per render), then derive a
  second frame-animated array each render for motion (e.g. a looping "flow" offset with modulo
  wraparound) and feed both into `<bufferAttribute>`. This TypeScript/R3F version requires the
  array on `<bufferAttribute args={[array, itemSize]} count={n} />` — passing `array`/`itemSize`
  as separate props compiles fine at the JS level but fails `tsc --noEmit`.
- `three/environment.tsx` — `EnvironmentSetter`, a local `RoomEnvironment`-based env map
  (deliberately NOT drei's `<Environment preset>`, which fetches an HDR from a remote CDN at
  render time — a determinism risk for headless frame-by-frame export).
- `three/coords.ts` — `pxToWorld(x, y, w, h, z?)`, converts top-left pixel coordinates (the
  same numbers used for CSS/DOM layout) into `SceneRig`'s 3D world space, so 3D content can be
  placed with the same numbers as 2D content.
- `public/sfx/` — three raw stock sound effects (chime/tick/whoosh). `public/test/
  placeholder_avatar.mp4` — a generic test clip, not tied to any content.

Nothing else is registered yet: `Composition.tsx` is empty on purpose (no compositions), ready
for the first real shot once there's a script and a theme.

## 4. Durable technical pitfalls (still apply, independent of theme/topic)

These were learned the hard way on the old project but are facts about Remotion/React Three
Fiber/ffmpeg/ElevenLabs, not about the old content, so they'll resurface identically here:

- **`<TransitionSeries>` only crossfades the PICTURE, never the audio.** During a
  `<TransitionSeries.Transition>` overlap, both neighboring shots' `<Audio>`/`<Video>` keep
  playing at full volume, so two lines of dialogue can play simultaneously at a cut. Fix: every
  shot with its own audio track passes `volume={edgeFadeVolume(frame, durationInFrames,
  DEFAULT_TRANSITION_FRAMES)}` on its `<Audio>`/`<Video>` element (needs `durationInFrames`
  threaded in as a prop). Retuning `DEFAULT_TRANSITION_FRAMES` alone does not fix this, it was
  tried and wasn't sufficient — the volume envelope is the actual fix.
- **Use `<Video>` from `@remotion/media`, not `<OffthreadVideo>`.** The latter can fail with
  "No frame found at position N" on a real render (a known frame-cache issue); Remotion's own
  current guidance is `@remotion/media`'s `<Video>` for new projects.
- **Never wrap `<SceneRig>`/`<ThreeCanvas>` in a parent `<div>` with a CSS `transform`** (found
  2026-08-06 chasing a fully-blank 3D layer). Wrapping it in something like `<div style={{
  transform: "scale(1.04)" }}><SceneRig>...</SceneRig></div>` for a cheap "camera zoom" effect
  looks completely correct in Remotion Studio's live preview, but silently renders the WebGL
  canvas as fully blank (not clipped, not misplaced — just empty) in a real headless `render`/
  `still`. Confirmed by isolating it: identical scene content rendered fine with no transformed
  ancestor, and went blank the instant one was added, independent of any other prop (bloom,
  vignette, sibling DOM overlays — none of those were the actual cause despite looking
  suspicious first). **For any zoom/scale effect on 3D content, animate the actual camera**
  (`SceneRig` takes a `zoom` prop for exactly this) instead of scaling a wrapper element. CSS
  `transform` on a plain DOM layer (no canvas involved) is unaffected and safe.
- **Getting real bloom requires genuinely HDR-bright material values, not a normal hex color.**
  A `meshBasicMaterial`/`meshStandardMaterial` using an ordinary color like `#4FA8FF` sits right
  at or barely above typical `luminanceThreshold` settings (~0.35), so `<Bloom>` only produces a
  faint, easy-to-miss effect — it can look like bloom "isn't working" when it's actually just
  underfed. Use `meshStandardMaterial` with a near-black base `color`, a bright `emissive`, and
  `emissiveIntensity` pushed well past 1 (2-4 range reads as a genuine glowing light source, not
  a flat colored shape); keep `toneMapped={false}` so the value isn't clamped back down before
  bloom's extraction pass sees it. Tune the geometry small — bloom's own blur radius does the
  soft spreading, so a large bright sphere reads as "a big flat ball," not "a glow," a common
  overcorrection once bloom starts working (self-caught same session: an initial sphere `scale`
  of 210 with `emissiveIntensity` up to 2 produced an opaque disc covering the frame, not a
  halo — dropping scale to ~15-30 and intensity to ~0.2-1.8 depending on role read correctly).
- **Match the SHAPE of a bloom light source to the shape of the DOM content it's meant to
  backlight — a point-source orb behind wide text just looks like a ball sitting on the
  letters, not a glow.** Found rebuilding cm1 on the real 3D bloom pipeline (2026-08-07): a
  `GlowOrb3D` (sphere) centered behind a full word ("strawberry"), a multi-digit number
  ($0.00038), and a pill-shaped button all rendered as a distracting hard-edged circle
  overlapping or poking out from the content, not ambient backlight — because a sphere is a
  POINT light and DOM text/buttons are WIDE, so there's no position that reads as "glowing
  from behind" rather than "a ball in front of/beside this." The fix in each case was either
  (a) use a bloom-lit **beam** (`GlowBeam3D`, a thin box) instead of an orb when the shape is
  naturally line-like (a vertical slice through text, a scan light), which worked well and
  matched the reference video's own light shapes, or (b) drop the 3D layer entirely and use a
  plain CSS `text-shadow`/`box-shadow` glow, which is what actually looked right for compact
  text (numbers) and shaped buttons. **Orbs only worked where the target was itself round**
  (a glow inside a circular eye icon). Don't reach for a 3D glow orb as a default "make it
  glow more" move — check the target's actual shape first.
- **`@remotion/media`'s `<Video>` reads `objectFit` as a direct PROP, not `style.objectFit`**
  (the latter is silently ignored), and has no `objectPosition` prop at all. For any crop other
  than plain centered cover/contain, render the video at its own native pixel size inside an
  `overflow: hidden` wrapper sized to the visible window, and shift it with `top`/`left` rather
  than fighting the built-in fit modes.
- **Drei's `<Html transform>` does not survive Remotion's headless export** — works fine in
  Studio preview, renders as a completely empty element on a real `npx remotion render`/`still`.
  For text or icons on a 3D face, rasterize onto an offscreen 2D `<canvas>` synchronously
  (`ctx.font`/`fillText`, `Path2D` for icon shapes), wrap in a `THREE.CanvasTexture` with
  `colorSpace = SRGBColorSpace`, apply via `meshBasicMaterial map={...} toneMapped={false}`.
- **`remotion/tsconfig.json` needs `"dom"`/`"dom.iterable"` in `lib`** — three.js/R3F/drei types
  reference `HTMLCanvasElement`/`WebGLRenderingContext` directly, `tsc --noEmit` fails without
  it. **`remotion.config.ts` needs `Config.setChromiumOpenGlRenderer("angle")`** for any 3D
  content — Remotion's own docs: "Three.JS does not render with the default OpenGL renderer."
  Both are already set in this repo; don't remove them if this file is ever regenerated.
- **ffmpeg: `-ss` must be an INPUT option (before `-i`), never an output option (after `-i`,
  paired with `-to`), whenever the command also applies an `-af`/`-vf` filter.** With output
  seeking, a filter like `afade`'s `st=` (start time) reads the segment's timestamps as still
  absolute, not reset to zero by the seek — so a fade scheduled for "near the end of this short
  clip" can fire and finish before the seeked content ever arrives, silencing the whole
  segment. This is silent failure, not an error: the command exits 0 and the file has the right
  duration, just no audible content. **Any ffmpeg cut+filter one-liner needs `-ss` before `-i`
  and `-t` (duration) instead of `-to` (absolute end time).** Sanity-check any audio deliverable
  with `ffmpeg -af volumedetect -f null -` (mean_volume in the normal ~-20dB speech range, not
  the ~-90dB silence floor) before calling it done — a successful exit code alone doesn't prove
  the audio is actually there.
- **ElevenLabs has real forced alignment — use it instead of hand-estimating word timing.**
  `generate_vo.py --timestamps` (brand-new VO) or `align_shot_audio.py` (already-cut audio)
  both give exact word-level start/end frames; don't fall back to "word position in sentence /
  speaking pace" guessing, it was measurably wrong by 10+ frames on real footage. Forced
  alignment needs the `forced_alignment` scope enabled on the API key (a 401 with
  `missing_permissions` means it isn't).
- **A base64-embedded raster image inside 3D/SVG content costs far more per frame than vector
  content** — if a shot ever embeds a real image (logo, photo) into a texture or SVG, expect a
  real per-frame cost hit and chunk render calls smaller accordingly, or decode the image once
  and reuse the decoded surface instead of re-embedding a fresh string per frame.
- **Full-canvas post-processing (blur, bloom, vignette) is expensive; targeted/small-region
  effects are not.** Prefer scoping an effect to the area that needs it.
- **HTML entities like `&times;`/`&middot;` only decode when written directly as JSX children**
  (e.g. `<div>47 &times; 68</div>` correctly renders "×"). Passed as a plain JS string into a
  component prop (e.g. `<MathField expression="47 &times; 68" />`), they render as the literal
  text `&times;`, not the symbol — a JS string has no HTML-entity decoding step. Found building
  tn1 (2026-08-07): `MathField`/`ReasoningStep` props showed literal entity text until fixed by
  using the actual Unicode characters (×, ·) directly in every prop string instead.

## 5. Standing production workflow (VO-first, still applies)

1. Script + shot list first, saved as its own file. Get it approved before touching render code.
   **Each shot in that list, added 2026-08-11 after direct feedback on pm-skills's Shot2/Shot3
   ("use relevant motion graphics... not simple UI buttons/icons"), needs one explicit line
   before any component gets picked**: `Concept → Real shape (what this literally looks like in
   the physical world) → Device (component to use) → Why it matches (how the device's STRUCTURE,
   not just its topic, embodies that real shape)`. This can't be a mechanical PASS/FAIL check the
   way `check_static_frames.py` catches frozen frames — it's editorial judgment — so the shot
   list document is the forcing function instead: if the "why it matches" column can't be
   honestly filled in, that's the signal to design a new device rather than reach for the
   nearest thing already built. This is exactly where pm-skills broke: a product lifecycle's
   real shape is a loop (it ends back where it started), but `PipelineFlow` was picked because it
   was already built and animated, not because a straight left-to-right build matches a cycle.
   Same failure on "Foundation/Utility/Sprint Toolkit" (generic pill chips for what's actually a
   grouping/container of skills) and the subagent card (a decorative shield-checkmark badge for
   what's actually a delegate-and-report-back device). **The schema vocabulary list in §1 is a
   menu to check against defaulting to a static stat card — it is not itself proof of fit.**
   Picking the closest topical entry from that list without checking structural match is the
   same shortcut that produced all three misses above; verify the shape, not just the topic,
   even when reaching for an already-built component.
2. Generate VO via `automation/generate_vo.py --timestamps` (once the new voice ID is in `.env`).
3. Cut per-shot audio + derive word timing via `automation/derive_word_timing.py`.
4. Build shots against real word-level `born` frames from the start, not estimates.
5. Render, verify via checkpoint stills before committing to a full render, especially for any
   new crop/positioning logic — sample a real extracted frame's pixels before trusting a guess.
5b. **Run `py automation/check_static_frames.py episodes/{id}/build/{id}.mp4` on every full
   render before showing it to the user — this is a hard gate, not optional, added 2026-08-11
   after "Never Let a Frame Sit" got violated twice on the same episode despite the rule being
   written down and checkpoint stills having been reviewed.** Eyeballing checkpoint stills
   catches gross errors (wrong content, broken layout) but has repeatedly missed real
   static-frame violations — a shot "has motion in it" reads as fine even when a multi-second
   chunk of it doesn't, and code that animates something can still be too subtle to register
   (confirmed: a `breathe()` amplitude of 0.02 was mathematically live but read as frozen). The
   script uses ffmpeg's `freezedetect`, cropped to the content+caption zone (excluding the
   deliberately-static background/watermark/progress bar, which otherwise dilutes real motion
   into a "looks frozen" false positive) — see the script's own docstring for the exact
   calibration and why it's tuned the way it is, including a real case where the crop itself
   was wrong and produced a confident false failure. On a FAIL, fix the flagged window (usually
   `breathe()` at a bigger amplitude, or a literal device like a blinking cursor / pre-reveal
   placeholder state) and re-render before proceeding — don't ship a render this check hasn't
   passed.
6. **Cover image**, locked in as a standing deliverable 2026-08-09: a `covers/Cover{id}.tsx`
   still (frame 60, no timeline/audio), reusing the episode's own real visual assets (a real
   set-piece from the episode, not a separate template — see `CoverCm1`/`CoverTn1`/`CoverSk1`),
   registered as `Cover-{id}` in `Composition.tsx`, rendered via `npx remotion still` to
   `episodes/{id}/build/{id}_cover.png`.
7. **Platform captions**, locked in as a standing deliverable 2026-08-09: one `episodes/{id}/
   assets/captions.md` with a separate section per posting platform (Instagram, LinkedIn,
   YouTube as of 2026-08-09 — see `docs/posting_platforms.md` if that list changes). **Each
   platform's copy must be written for that platform, never the same block reused three times**
   (flagged directly after sk1's first pass just re-ran the VO script as the caption everywhere)
   — same underlying facts/stats, different structure.
   **Revised 2026-08-10, direct feedback after watching sd1 live** ("you copy script and use it
   as captions, they are almost same... write caption, title description properly"): a caption
   that closely paraphrases the VO script sentence-by-sentence still fails this rule even if the
   wording isn't byte-identical — the standard is genuinely distinct platform-native copy, not a
   rephrased transcript. Concretely:
   - **Instagram**: a real hook (a question or a claim, not "here's what the video says"),
     scannable structure, **3-6 relevant hashtags, not a dense block** — the old ~10-15 tag
     block is retired, it reads as spammy, not searchable.
   - **LinkedIn**: first-person practitioner narrative, real paragraph breaks, 3-5 tags
     (unchanged, this one was already right).
   - **YouTube**: title and description must be **genuinely SEO-considered** — real keyword
     phrases a viewer would actually search (tool names, "vs", "pricing," the year, etc.) placed
     early in the title and description, not just a restated video summary. Keep `#Shorts` plus
     2-3 more targeted tags, not a long list.
   See `episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/assets/captions.md` for
   the reference *structure* (still valid — separate sections, distinct tone per platform); the
   hashtag-count and SEO guidance above supersedes what that specific file did.

## 6. Decided 2026-08-06: visual direction, voice, content plan

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
deleted) and `automation/daily_pipeline_prompt.md`/`run_daily_pipeline.ps1` are kept as-is in
case this gets revisited later, but nothing runs on a schedule currently. If picked back up, the
actual fix needed is probably just patience (or an early heartbeat write to the log/result file
so "still working" is distinguishable from "stuck" within the first minute) rather than more
stdin/output-plumbing changes — those were never the real problem.

## 7. Strategic system: That AI PM v2.0 (2026-08-10)

**What changed**: the user supplied "That AI PM: Content System Operating Spec v2.0"
(`docs/thataipm_content_system_operating_spec_v2.md`), a formal strategy document positioning
the channel around "AI-native product thinking" for a Product Manager audience. This
**fully supersedes** the 2-pillar content strategy documented earlier in §6 (retirement note
in that section). It does not touch the production engine described in §§2-5, which stays
exactly as built.

**Architecture principle**: strategy sits ABOVE the existing production pipeline, not inside
it. Nothing in `automation/`, `remotion/src/`, the GitHub hosting flow, or the Zernio
scheduling flow changed or needs to change for this migration. What's new is a thin layer of
structured planning/tracking docs the production pipeline didn't have before:

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
SCRIPT -> PRODUCTION -> RENDER -> CAPTIONS -> DISTRIBUTION   unchanged, see §§2-5
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

**What does NOT change**: the production pipeline, the visual system, the schema vocabulary,
the quality gates (`check_static_frames.py`, the shot-list literal-device-justification rule),
and the `@thataipm` handle (kept for now, a rename would be wasted motion before there's an
audience to lose, revisit once there is one) are all unaffected. This is a strategy-layer
change only, same as the original v2.0 migration was.

**What's explicitly deferred, per direct instruction**: monetization shape and the newsletter/
lead-magnet buildout (spec §14-16) are parked until there's a real audience to decide them
against, not abandoned. Full autonomy (the daily pipeline, disabled 2026-08-11, see that
section above) and long-form YouTube are both real future goals but explicitly not being
pursued right now either, first priority is audience building on the existing Instagram +
YouTube Shorts format under the new positioning.

## 8. Working discipline (adapted from the karpathy-skill rules, 2026-08-11)

Direct instruction, prompted by watching this project's own actual failure modes and then
asking whether `multica-ai/andrej-karpathy-skills` (201,420 stars as of 2026-08-11, the same
repo covered in the-karpathy-skill episode) was worth adopting here. Evaluated each of its four
rules against real incidents in this project rather than copying it wholesale — one of them
doesn't fit this codebase and is deliberately NOT adopted; say why, not just what.

**Goal-Driven Execution — adopt fully, already validated in practice.** "Looks right" is not a
success criterion; a check that can print PASS/FAIL is. This is the exact mechanism that fixed
the static-frame problem (§5b, `automation/check_static_frames.py`): the fix wasn't "try
harder," it was turning an unverifiable feeling into a command with an exit code. Apply this
pattern generally: before calling a subjective judgment call "done" (does this hook state the
topic fast enough, is this motion actually visible, does this fact check out), ask whether it
can be turned into something that can fail loudly instead of just feeling fine. Not everything
can (hook clarity is closer to editorial judgment than a pixel diff), but default to trying
before settling for eyeballing.

**Think Before Coding — adopt, with a concrete trigger.** State a visual/creative assumption
out loud when making it, specifically anything with a magnitude nobody supplied (an animation
amplitude, a hold duration, a threshold) — these are exactly the silent judgment calls that
went wrong this session (`breathe()` at 0.02, assumed sufficient, wasn't). Naming the assumption
doesn't make it correct, but it's the difference between a guess that quietly ships and a guess
that gets checked.

**Surgical Changes — already covered, formalizing the existing practice.** This project already
has the equivalent rule in a narrower form (§6: once a video is posted, don't re-edit it; the
shared-component-fix pattern used throughout this session — e.g. adding `breathe()` to
`ComparisonCard`/`PipelineFlow`/`TerminalCard` — is fine specifically because it doesn't touch
already-rendered output, only future renders). No behavior change, just naming the general
version of a rule this project already follows.

**Simplicity First — NOT adopted as written, real conflict with this codebase.** Its own text
says "no abstractions for single-use code," but this project deliberately builds shared,
reusable components (`ComparisonCard`, `DisparityBar`, `PipelineFlow`, `TerminalCard`, etc.)
from their FIRST use, because the channel's format guarantees dozens of future episodes will
need the same visual patterns — that's a known, structural requirement here, not speculative
gold-plating the karpathy rule is warning against in general software. Blind adoption would
argue against this project's own working architecture. The part worth keeping: don't add
config/flexibility/error-handling nobody asked for on top of a component — build the reusable
shape because it's genuinely needed, not the unneeded flourishes around it.
