# Video Production Engine

This project was reset on 2026-08-06. Everything from the prior "That AI PM" channel (its
scripts, episodes, content plan, channel identity, and visual theme) has been moved to
`archive_thataipm/` for historical reference only — **it is not a starting point for new work**.
What survived the reset is the underlying render engine: the technical machinery for turning a
script + VO into a rendered vertical video, independent of any particular topic or look.

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
   bridge it.
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

## 2. What's here

- `remotion/` — the Remotion (React/TypeScript) render engine. Node 18+, npm, ffmpeg required
  (all already set up on this machine). Free under Remotion's individual/≤3-employee license
  (re-check if that changes).
- `automation/` — VO generation and word-timing tooling, ElevenLabs-backed:
  - `generate_vo.py [--timestamps]` — text-to-speech via the ElevenLabs REST API (`eleven_v3`),
    `--timestamps` also fetches character-level alignment.
  - `derive_word_timing.py` — for a **brand-new** episode: splits a script into shots (blank-line
    separated), cuts precise per-shot audio from a continuous VO take using the real alignment
    data, writes per-shot word timing.
  - `align_shot_audio.py` — for **already-cut** shot audio: forced-alignment against its own
    known line (needs the `forced_alignment` scope on the API key).
  - `generate_sfx.py` — sound effect generation.
  - **`.env` holds `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`.** The voice ID is still the
    old channel's clone — replace it with the new one before generating any real VO.
    `HEYGEN_API_KEY` is also present but unused (this project is faceless); harmless to leave.
- `archive_thataipm/` — everything retired in the reset: old `docs/`, `episodes/`, the
  superseded Python/cairosvg `pipeline/`, `generate_avatar.py` (HeyGen, not needed for a
  faceless project), the old `CLAUDE.md` (renamed `CLAUDE_that_ai_pm.md`), and the archived
  Remotion theme/content (`remotion_src/`, `remotion_public/`, `remotion_out/`). Read it if you
  need to see how a past problem was solved in detail; don't copy its content/theme decisions
  into new work without the user explicitly asking to revive something specific.

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
2. Generate VO via `automation/generate_vo.py --timestamps` (once the new voice ID is in `.env`).
3. Cut per-shot audio + derive word timing via `automation/derive_word_timing.py`.
4. Build shots against real word-level `born` frames from the start, not estimates.
5. Render, verify via checkpoint stills before committing to a full render, especially for any
   new crop/positioning logic — sample a real extracted frame's pixels before trusting a guess.
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
   — same underlying facts/stats, different structure: Instagram leads with a fast hook + emoji
   scan + a dense hashtag block (~10-15 tags), LinkedIn is a first-person practitioner narrative
   with real paragraph breaks and only 3-5 tags, YouTube is a searchable title + keyword-dense
   description with `#Shorts`. See `episodes/sk1/assets/captions.md` for the reference shape.

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
- Episode/folder naming convention is now confirmed by actual use: `episodes/cm{N}/` (assets,
  build/audio, script) mirroring `remotion/src/episodes/cm{N}/` (shot components, orchestrator),
  same shape as the old project's `da{N}` convention. `tn{N}`/`wb{N}` for the other two pillars,
  unconfirmed until one of those actually gets built.

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
  shipped 2026-08-09 after 4 revisions: `episodes/sk1/build/sk1_video_tools.mp4`, ~46.3s.**
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

  **Revision 4 (current), four more direct fixes, shipped 2026-08-09: `episodes/sk1/build/
  sk1_video_tools.mp4`, ~46.3s.** (1) **Real screenshots with a zoom into the real star count.**
  `mcp__Claude_Browser__computer`'s plain `screenshot` action worked this time (earlier failures
  were transient, not a real limitation) but its `zoom` action still doesn't support a region
  crop ("full screenshot returned") — worked around by installing Playwright (`episodes/sk1/
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
  rendered to `episodes/sk1/build/sk1_cover.png`) and `episodes/sk1/assets/captions.md` (three
  genuinely distinct platform captions, not the VO script reused — see `CLAUDE.md` §5 steps 6-7
  for the now-standing format this establishes for every future episode). **Posting automation
  is the next open item, not yet built** — see the "Posting automation" note below.

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
