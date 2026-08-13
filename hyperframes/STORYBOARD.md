---
format: 1080x1920
duration: 48s
message: "I hand-built AI video components all session, then found a public registry (HyperFrames itself) that already had 380 of them"
arc: story-explainer
audience: people building AI agents, automation, and tools
mode: collaborative
music: none
---

## Video direction

**Palette system** (from `frame.md`, code-editorial): cream is the ground, ink is the voice, coral is the scarce voltage — exactly ONE coral moment per frame (the hero stat, one accent word, or the CTA). Warm-navy is reserved for the code/terminal surface only (Frame 2's "engine I built myself" beat, Frame 3's terminal-style tiles) — never a fourth brand hue. No pure white, no cool gray, no pure black.

**Motion grammar**: `power3` long-tail settle by default everywhere — no bouncy, no `back.out`/`elastic.out` except the one explicitly-playful icon-puncture beat in Frame 1 (spring-pop entrance is fine there; it's the signature move of `dataviz-countup`'s hook variant). Every frame's reveals are paced to its own voiceover — nothing appears before the VO reaches it, and each frame front-loads only what's being said at t=0.

**Rhythm / held-frame allocation**: Frame 4 is this video's deliberate breather — the honest-gap beat holds mostly still (a held read beats manufactured motion), reading as sincere rather than salesy right before the close. Frame 5 is also a calm, mostly-static `titlecard-reveal` beat by design (its own blueprint's "allocated stillness" contract). Frames 1-3 carry the video's actual kinetic energy; 4-5 intentionally cool down.

**Negative list**: no lazy breathing (no circular scale pulse standing in for "alive"), no slow pan/push in any frame's back half, no floating bokeh or the default purple-blue "AI" gradient cliché, no two coral moments in one frame, no front-loaded-then-frozen frame (every frame's Scene 1 shows only what's spoken at t=0).

## Frame 1 — Hook

- scene: A stat explodes into frame — "380" — while a handful of hand-drawn component icons sit small and effortful beside it
- voiceover: "I wasted hours hand-building AI video components. A public registry already had three hundred eighty of them, ready to install."
- duration: 7.413s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- status: animated
- type: hook
- persuasion: Statistical proof + Stakes/consequence
- beat: surprise + recognition
- blueprint: dataviz-countup (Adapt — hook-counter-burst variant)
- focal: the coral "380" hero number
- roles: 380-number = foreground subject (coral, the one voltage moment) · hand-drawn component icons (terminal card, counting number, container, loop) = supporting, small and scattered · cream ground = background
- sfx: whoosh, chime

narrativeRole: Opens the cognitive gap immediately — states both the cost (wasted hours) and the twist (the number already existed) in the first sentence, no build-up.
keyMessage: The video's whole thesis lands in the first 4 seconds — effort that didn't need to happen.

Adapt: keep the hook-counter-burst signature (icons puncture in, then the number explodes upward as they fling outward) but the icons are this channel's own real hand-built components, not generic thematic icons, and the number is ink until it counts, then locks coral.

Scene 1 (0.0–1.9s): "I wasted hours hand-building AI video components" — cream ground establishes; 4 small hand-drawn component icons (terminal card, counting number, container, loop) puncture in clustered upper-center via **spring-pop entrance** (`spring-pop-entrance`), effortful and small — Centered, ~25% of frame. A slow camera lean-in begins underneath (`multi-phase-camera`).
Scene 2 (1.9–5.9s): "A public registry already had three hundred eighty of them" — on "three hundred eighty," the icons fling outward to small marks at the frame edges (**cluster→outward expansion**, `center-outward-expansion`) while a massive number **counts up** 0→380 dead-center in coral, its transform-scale growing with the value (**value-scaled counter**, `counting-dynamic-scale`) — Centered, ~55% of frame at peak.
Scene 3 (5.9–7.413s): "ready to install" — 380 settles at final size; a small JetBrains Mono unit label ("ready to install") fades up beneath it. Camera lean-in reaches its peak and holds — held read, at most **subtle jitter** (`sine-wave-loop`, low amplitude).

## Frame 2 — The problem

- scene: A build stage — each named component (terminal card, counting number, a container that holds items) lands one at a time, hand-assembled, on a plain engine backdrop
- voiceover: "Every shot needed its own device. A terminal card. A counting number. A container that holds items. I coded each one from scratch, in an engine I built myself."
- duration: 10.607s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/02-problem.html
- status: animated
- type: pain_point
- persuasion: Concretization + Numbered enumeration
- beat: recognition, mounting effort
- blueprint: kinetic-type-beats (Reproduce — problem-kinetic-type-beats)
- focal: each named component phrase, one at a time
- roles: current phrase = foreground subject (centered, ink) · tile ground = background · a thin warm-navy code-surface strip low in frame = supporting (only in Scene 4, the "engine I built myself" beat)
- sfx: ui pop

narrativeRole: Makes the "wasted hours" claim concrete and specific instead of abstract — names the actual real things that were hand-built, one phrase per item, matching the VO's own cue-by-cue phrasing.
keyMessage: Real, specific effort was spent building things one at a time, by hand.

Scene 1 (0.0–2.2s): "Every shot needed its own device." — first line hard-cut **FLASH-in** (`discrete-text-sequence`) centered on the tile ground, ink EB Garamond. Camera locked, no product visible yet.
Scene 2 (2.2–3.6s): "A terminal card." — hard-cut swap to this phrase alone (**hard-cut flash word-swap**, `discrete-text-sequence`); a small mono-label kicker "1/3" appears beneath, low-key.
Scene 3 (3.6–5.2s): "A counting number." — hard-cut swap (same mechanism); kicker reads "2/3".
Scene 4 (5.2–7.3s): "A container that holds items." — hard-cut swap; kicker reads "3/3". Each of the three items so far has landed and cleared — no accumulation, matching the pain beat's "no product visible yet" register.
Scene 5 (7.3–10.607s): "I coded each one from scratch, in an engine I built myself." — the line clears to a **left→right swipe reveal with leading-edge blur** (`kinetic-type-beats` Problem resolution) of this closing sentence over a thin warm-navy code-surface strip low in frame (`code-surface`, mono chrome only, no real code shown yet); holds the pain on screen to the transition out.

## Frame 3 — The proof

- scene: The same build stage continues — a grid of registry tiles self-assembles behind/beside the hand-built pile, surfacing the real named matches (terminal styles, count-up, scan-band) one at a time
- voiceover: "It's called HyperFrames, forty thousand stars on GitHub. Fourteen terminal card styles. A count-up number, already built. Even the scanning light effect I invented by hand this session, already there."
- duration: 13.08s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/03-proof.html
- status: animated
- type: social_proof
- persuasion: Citation/source + Statistical proof + Before/after contrast
- beat: recognition tipping into mild disbelief
- blueprint: grid-card-assemble (Adapt — social-proof-logo-grid-zoom-out)
- focal: the self-assembling registry tile grid
- roles: registry tiles (named: terminal styles, count-up, scan-band) = foreground subject · "40,680 stars" proof number = supporting, coral, above the grid · tile ground = background
- sfx: ui pop, chime

narrativeRole: Backs up the hook's 380 claim with specific, checkable overlaps rather than asserting it again — the credibility beat.
keyMessage: The overlap isn't vague — it's the exact same things, by name, already built.

Adapt: keep the logo-grid-zoom-out signature (a wall of items builds, a proof number fills in above, camera settles wide) but the "logos" are named registry tiles (real item names, not brand marks), and the proof number is the GitHub star count, not a generic "N+ teams" line.

Scene 1 (0.0–2.8s): "It's called HyperFrames, forty thousand stars on GitHub." — kicker-spike "HYPERFRAMES" fades up top-left (mono, coral ✱); beneath it a coral "40,680" **counts up** (`counting-dynamic-scale`) with "GitHub stars" in mono unit type — Centered-upper, ~30% of frame.
Scene 2 (2.8–6.0s): "Fourteen terminal card styles." — an empty tile grid region establishes below the stat; 14 small labeled tiles **stagger-assemble into slot** (`center-outward-expansion`, short-path direct-into-slot form, dense so no center-burst) reading real names from the registry (`code-snippet-apple-terminal-*` family) — asymmetric, tiles fill the lower 60% of frame.
Scene 3 (6.0–9.5s): "A count-up number, already built." — one tile in the grid gets a coral highlight ring and its label reads "count-up"; the rest of the grid dims slightly (**selective dim/blur**, `depth-of-field-blur`) to spotlight it.
Scene 4 (9.5–13.08s): "Even the scanning light effect I invented by hand this session, already there." — a second tile highlights coral, labeled "scan-band"; a thin diagonal light band sweeps once across that tile only (**SVG self-draw** style sweep, `svg-path-draw`); camera settles to a slightly wider hold on the full grid — held read.

## Frame 4 — The honest gap

- scene: Same tile grid from Frame 3, holding — but one slot stays visibly empty where a loop/cycle icon would sit
- voiceover: "One thing wasn't in it either: a circular loop diagram. Even the best library has real gaps. Check first. Don't assume."
- duration: 8.888s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-gap.html
- status: animated
- type: pain_point
- persuasion: Counterexample + Distillation
- beat: unease (caveat) tipping into clarity
- blueprint: compose (no golden-clip shape fits an honesty/caveat beat)
- focal: the one empty grid slot
- roles: empty slot outline = foreground subject (dashed ink outline, no fill) · Frame 3's grid (now dimmed, static) = background · closing line = supporting, appears last
- sfx: none

narrativeRole: Keeps the piece honest instead of turning into a pitch — shows the one real limitation in the same visual system used to show abundance.
keyMessage: The generalizable lesson: check what already exists before assuming, in either direction.

Compose: this is the video's deliberate held/breather beat (see Video direction) — continues Frame 3's grid stage for continuity but does almost nothing new until the closing line.

Scene 1 (0.0–3.0s): "One thing wasn't in it either: a circular loop diagram." — Frame 3's tile grid holds, dimmed ~40% (background now); one slot that was never filled gets a dashed ink outline **drawn on** (`svg-path-draw`) with a faint loop-glyph ghost inside it — camera fully static, no push, no pan.
Scene 2 (3.0–5.6s): "Even the best library has real gaps." — nothing new enters; the dashed outline holds. This is the allocated stillness — no manufactured motion.
Scene 3 (5.6–8.888s): "Check first. Don't assume." — the grid fades out entirely (crossfade); the line lands centered in EB Garamond italic (a stance) as a **pull-quote** (`discrete-text-sequence`), alone on cream, and holds to the transition out.

## Frame 5 — Close / CTA

- scene: The build stage clears to a simple sign-off — a handoff mark (old tool to new) resolving into a plain follow prompt, no comment-keyword gate
- voiceover: "This channel is switching to it, starting with this video. If you're building your own AI systems, follow along, it's happening in public."
- duration: 8.171995s
- transition_in: crossfade
- status: outline
- src: compositions/frames/05-close.html
- status: animated
- type: cta
- persuasion: Direct address
- beat: resolve, invitation
- blueprint: titlecard-reveal (Adapt — social-proof-reveal-card)
- focal: the follow prompt
- roles: sign-off line = foreground subject · one coral-callout follow mark = the single voltage moment · cream ground = background
- sfx: chime

narrativeRole: Closes the loop — states the real decision (switching tools) and makes a plain, low-pressure ask.
keyMessage: Follow to see the process, not a hard sell.

Adapt: keep the calm one-move-then-hold contract, but the reveal is a plain handoff line, not a logo lockup — no comment-keyword gate, matching this channel's standing follow-only CTA rule.

Scene 1 (0.0–2.0s): "This channel is switching to it, starting with this video." — cream ground; the line fades in centered with a subtle scale-up settle (~95%→100%, `scale-swap-transition`) — the ONE restrained move. Camera static.
Scene 2 (2.0–8.472s): "If you're building your own AI systems, follow along, it's happening in public." — the first line translates up and fades (**slide-up crossfade**, `discrete-text-sequence`) as this line takes center; beneath it, ONE coral-callout "Follow" mark spring-settles (`spring-pop-entrance`) and holds static to the final frame — the video's last coral moment.
