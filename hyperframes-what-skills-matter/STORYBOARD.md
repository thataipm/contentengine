---
format: 1080x1920
duration: 51.04s
message: "The skill that matters now isn't speed, it's judgment: knowing what's real, what's good, and what's actually you."
arc: story-explainer
audience: people building with AI who are also quietly asking what it means for their own work and relevance
mode: collaborative
music: none
---

## Video direction — Pillar 2 launch, draft 4 (approved), single-take VO, literal-icon rebuild

**Draft 4 script, as approved.** Three standing changes this pass:

1. **VO is now ONE continuous ElevenLabs take, split into per-frame files afterward**, not 5
   independent API calls ("generate one single file of voiceover to maintain right consistency
   of vo"). `/thataipm-vo`'s new `generate_vo_single_take.mjs` does this: single synthesis,
   single forced-alignment, then sample-accurate ffmpeg cuts at the midpoint of each inter-line
   silence. This is now the standing method for every future episode. Durations below are the
   real split-segment lengths (51.04s total).
2. **Visual density tightened**: no stretch sits still more than ~1.9s without a new visual
   event, verified with `check_static_gaps.mjs --threshold 1.9`.
3. **Abstract ember/motes symbolic system replaced with literal, per-word icons** ("please
   create use visuals matching each word of script, rather than these generic animations").
   Every frame now runs the same device: a small, quiet ember anchor stays present in the
   background (unobtrusive, not the visual carrier anymore), while a set of ~96x96px SVG icons
   pop in one at a time, each timed to the exact onset of the real word it represents (a wrench
   for "building," a chip for "AI," an X mark for "wrong," a checkmark for "correct," and so
   on), then settle to a dimmed 0.55-opacity "accumulated" state rather than disappearing, so
   the frame visibly fills up with a growing set of literal marks that trace the sentence being
   spoken. Each icon carries a small mono-font label naming the word. Color coding is
   consistent across every frame: gold (`#F0B860`) = human/true/positive, blue (`#7FA8C9`) =
   AI/machine/neutral, green (`#34D399`) = good/success, red (`#C65A5A`, new this pass) =
   wrong/negative. Negative-beat icons (the X marks, the struck-through lightning bolt) get a
   slightly larger `overScale` pop for emphasis.

**Palette**: `#101014` ground, `#F5F3ED` voice/ink, `#F0B860` gold (human/true), `#7FA8C9` blue
(AI/neutral), `#34D399` green (good), `#C65A5A` red (wrong, new this pass).

## Frame 1 — Hook

- voiceover: "If you're building with AI, you've probably noticed something. It does the work faster than you ever could. So here's the real question: what's actually left for you to be good at?"
- duration: 10.979s
- transition_in: cut
- src: compositions/frames/01-hook.html
- sfx: ui-pop x4 (building/AI/noticed/work icons land, 0.38/0.9/2.18/3.94s), chime (faster, gold, 4.26s), whoosh (question glyph lands, 7.32s), chime (good/star closes the frame, 10.04s)

Real word timing (from the single-take split): If@0.12 you're@0.22 building@0.38 with@0.68
AI,@0.9 you've@1.6 probably@1.78 noticed@2.18 something.@2.46 It@3.44 does@3.6 the@3.78
work@3.94 faster@4.26 than@4.58 you@4.84 ever@5.08 could.@5.34 So@6.56 here's@6.7 the@6.94
real@7.06 question:@7.32 what's@8.46 actually@8.74 left@9.16 for@9.42 you@9.62 to@9.78
be@9.9 good@10.04 at?@10.24

Scene: quiet ember anchor settles in first (0-0.6s). Seven literal icons pop in one at a time on
their real word: a wrench for "building" (0.38s), a chip for "AI" (0.9s), an eye for "noticed"
(2.18s), a gear for "work" (3.94s), a lightning bolt for "faster" (4.26s), a literal serif "?"
glyph for the "real question" beat (7.32s), a star for "good" (10.04s). Each pops in with a
back-out scale bounce, then dims to 0.55 opacity, accumulating into a scattered field of marks
across the frame rather than clearing between beats.

## Frame 2 — Verification

- voiceover: "It can sound completely confident about something that's totally wrong. It doesn't know true from convincing. That part's still on you."
- duration: 9.48s
- transition_in: blur-crossfade
- src: compositions/frames/02-verification.html
- sfx: ui-pop x2 (sound/confident icons, 0.88/1.78s), whoosh (wrong X mark, negative emphasis pop, 3.62s), chime (true, gold, 5.54s), ui-pop (convincing, 6.02s), chime (you closes the frame, gold, 8.7s)

Real word timing: It@0.54 can@0.68 sound@0.88 completely@1.18 confident@1.78 about@2.22
something@2.46 that's@2.82 totally@3.22 wrong.@3.62 It@4.8 doesn't@4.96 know@5.28 true@5.54
from@5.8 convincing.@6.02 That@7.38 part's@7.68 still@8.26 on@8.52 you.@8.7

Scene: six literal icons build the frame: a soundwave for "sound" (0.88s), a shield-check for
"confident" (1.78s), a large red X for "wrong" (3.62s, emphasis pop), a gold checkmark for
"true" (5.54s), a speech bubble for "convincing" (6.02s), a person silhouette for "you" (8.7s).
The red X is the frame's one negative beat, given a bigger overscale pop than the rest so it
reads as the pivot the sentence turns on.

## Frame 3 — Taste

- voiceover: "It can pass every check you give it, and the result can still feel empty. Passing a test and being good were never the same thing."
- duration: 9.17s
- transition_in: blur-crossfade
- src: compositions/frames/03-taste.html
- sfx: ui-pop (pass, 0.9s), chime (check, green, 1.58s), whoosh (empty, negative emphasis, 4.0s), ui-pop (test, 5.78s), chime (good, green, closes the frame, 6.82s)

Real word timing: It@0.58 can@0.7 pass@0.9 every@1.28 check@1.58 you@1.82 give@1.96 it,@2.14
and@2.56 the@2.68 result@2.78 can@3.16 still@3.4 feel@3.72 empty.@4.0 Passing@5.28 a@5.64
test@5.78 and@6.28 being@6.5 good@6.82 were@7.36 never@7.62 the@7.84 same@7.98 thing.@8.24

Scene: five literal icons: a forward arrow for "pass" (0.9s), a green checkmark for "check"
(1.58s), a dashed hollow red box for "empty" (4.0s, the frame's negative beat), a clipboard for
"test" (5.78s), a green star for "good" (6.82s), tracing the sentence's own pass/check-versus-
empty/good contrast directly in the icon set rather than a separate device.

## Frame 4 — Voice

- voiceover: "It can write something with nothing wrong in it, and it still won't sound like you. Correct was never the same as yours."
- duration: 8.37s
- transition_in: blur-crossfade
- src: compositions/frames/04-voice.html
- sfx: ui-pop (write, 0.89s), whoosh (wrong, negative emphasis, 2.11s), ui-pop x2 (sound/you, 3.83/4.37s), chime (correct, gold, 5.47s), chime (yours closes the frame, gold, 7.39s)

Real word timing: It@0.61 can@0.73 write@0.89 something@1.17 with@1.51 nothing@1.75 wrong@2.11
in@2.37 it,@2.51 and@2.97 it@3.09 still@3.23 won't@3.55 sound@3.83 like@4.11 you.@4.37
Correct@5.47 was@6.21 never@6.49 the@6.73 same@6.89 as@7.17 yours.@7.39

Scene: six literal icons: a pen for "write" (0.89s), a red X for "wrong" (2.11s, negative
emphasis), a soundwave for "sound" (3.83s), a person for "you" (4.37s), a gold checkmark for
"correct" (5.47s), a fingerprint for "yours" (7.39s) — the frame's closing image, standing in
for the one thing correctness alone can't fake.

## Frame 5 — Close + invitation

- voiceover: "So the skill that actually matters now isn't speed. It's judgment: knowing what's real, what's good, and what's actually you. Follow along, I'm figuring this out in real time too."
- duration: 13.041s
- transition_in: blur-crossfade
- src: compositions/frames/05-close.html
- sfx: ui-pop (skill, 0.8s), whoosh (speed, struck-through, negative emphasis, 2.92s), ui-pop x2 (judgment/real, 4.16/6.18s), chime x2 (good/you, gold, 7.22/8.94s), whoosh (follow ring draws on, 10.2s), ui-pop x3 (ring pulses on "figuring"/"out"/"time", 11.2/11.94/12.56s)

Real word timing: So@0.56 the@0.66 skill@0.8 that@1.06 actually@1.32 matters@1.72 now@2.1
isn't@2.56 speed.@2.92 It's@3.9 judgment:@4.16 knowing@5.52 what's@5.84 real,@6.18 what's@6.9
good,@7.22 and@7.96 what's@8.14 actually@8.46 you.@8.94 Follow@10.2 along,@10.5 I'm@11.2
figuring@11.4 this@11.72 out@11.94 in@12.16 real@12.32 time@12.56 too.@12.84

Scene: six literal icons build first: a badge for "skill" (0.8s), a red struck-through
lightning bolt for "speed" (2.92s, the negative beat, "isn't speed"), a scale for "judgment"
(4.16s), a diamond for "real" (6.18s), a green star for "good" (7.22s), a person for "you"
(8.94s). Then the frame's one recurring device — a circular "Follow" ring — draws itself on at
10.2s as the CTA lands, with the label fading in on "along." Through the closing line ("I'm
figuring this out in real time too," 11.2-12.84s) the ring pulses outward three times, once per
beat, so the hold keeps producing new motion through the very end of the video.
