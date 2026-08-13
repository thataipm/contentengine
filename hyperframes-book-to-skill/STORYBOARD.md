---
format: 1080x1920
duration: 40.9s
message: "If your AI agent is choking on huge PDFs, book-to-skill shrinks any book into a skill it can actually use, up to 51x smaller."
arc: story-explainer
audience: people building with AI agents/Claude Code day to day
mode: collaborative
music: none
---

## Video direction (redo, draft 3 — full-dark one-off)

**This is a one-off visual treatment for this episode only.** `frame.md` still
documents the light-theme/cream-ground system as this project's standing default
— this redo does NOT change that default, it's a deliberate departure per direct
instruction ("I want full dark background, with all our work colorful"). Colors
below are authored directly in each frame file, not via a `frame.md` edit.

**Palette (dark-ground, one-off for this episode):**
- Ground: `#101014` (near-black, warm-neutral undertone — not literal pure black).
- Voice/text: `#F5F3ED` (warm off-white, the dark-ground inversion of the brand's
  cream/ink relationship).
- Dim text: `#9A9AA2`.
- Card/tile surface: `#1A1A20`, hairline border `rgba(245,243,237,0.12)`.
- Accent rotation (dark-ground-tuned, brighter than the light-theme darkened
  values — frame.md's own comment on `coral` names `#8C7CFF` as the pre-darkening
  dark-ground value, the others are extended the same way): purple `#8C7CFF`,
  green `#34D399`, orange `#FFA94D`, blue/cyan `#38BDF8`.
- Danger red (Frame 1's burn-meter escalation only): `#FF5C5C`.
- "All our work colorful" — every frame uses at least one accent beyond the base
  voice color; Frame 1's meter still gets its own danger→calm arc, but glow/bloom
  effects (which read far better on dark than they did on cream) get used more
  generously than the light version did.

**Motion grammar**: same as before — `power3` long-tail settle by default,
`back.out`/spring on punctuation beats. Reveals paced to the real VO, per-word
timestamps below drive every beat placement (not proportional guessing).

**Pacing**: energetic, `[rushed]` applied uniformly across all 4 lines (see
`SCRIPT.md`) — no mixed rushed/natural registers this time, the actual root cause
of the "VO sounds different per shot" complaint on draft 2.

**Structural change from draft 2**: 4 frames, not 5. The reflective "honest gap"
beat is dropped for this redo — doesn't fit the tighter economy of the reference
script this draft is modeled on.

## Frame 1 — Hook + what it does

- scene: A stack of book pages dumps into an agent icon while a token-cost meter
  spikes toward danger red on a full-dark ground, glowing hard. On "It's called
  book-to-skill," it all collapses into one small glowing green skill-file icon,
  "51x smaller" landing in mono type beneath it.
- voiceover: "If your AI agent keeps choking on huge PDFs and burning through its context window, there's actually a free skill that fixes that. It's called book-to-skill, and it turns any book into a skill your agent can actually use, up to fifty-one times smaller than the original."
- duration: 16.24s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Stakes/consequence + Before/after contrast
- beat: alarm tipping into relief
- blueprint: dataviz-countup (Adapt — literal burn-then-collapse device, reused
  from draft 2's Frame 1, recolored dark and retimed to the new real VO)
- focal: the token-cost meter and the page-stack-to-skill-file compression
- roles: page stack + climbing meter = foreground subject, Scene 1 (danger
  red/orange glow) · compressed skill-file icon + "51x" = foreground subject,
  Scene 2 (green glow, the calm payoff) · near-black ground = background
- sfx: whoosh, ui pop, chime

Real word timing (ElevenLabs forced alignment, this redo's audio):
If@0.12 your@0.28 AI@0.54 agent@0.86 keeps@1.28 choking@1.54 on@1.94 huge@2.18
PDFs@2.52 and@3.28 burning@3.56 through@3.86 its@4.0 context@4.2 window,@4.6
there's@5.56 actually@5.76 a@6.04 free@6.24 skill@6.56 that@6.98 fixes@7.14
that.@7.52 It's@8.32 called@8.48 book-to-skill,@8.76 and@9.7 it@9.88 turns@10.02
any@10.46 book@10.76 into@11.18 a@11.44 skill@11.54 your@11.88 agent@12.1
can@12.44 actually@12.6 use,@13.08 up@13.86 to@14.0 fifty-one@14.12 times@14.78
smaller@15.04 than@15.5 the@15.68 original.@15.76

Scene 1 (0.0–8.3s): page stack drops into the agent icon one page at a time
(stagger-drop-in synced to real word onsets through "huge PDFs"), the meter
climbs and glows danger red-orange, landing full danger right as "burning
through its context window" lands (3.56-4.6s), holding tense danger through
"there's actually a free skill that fixes that" (4.92-7.52s) — Centered, meter
dominant.
Scene 2 (8.3–16.24s): hard compression snap on "It's called" (8.32s) — page
stack + meter collapse inward into a small glowing green skill-file icon, count
visibly dropping in the same motion; "book-to-skill" title settles, "51x
smaller" stat lands in mono type right as "fifty-one times smaller" is spoken
(14.12-15.76s) — Centered, generous dark space around the settled icon.

## Frame 2 — How it works

- scene: A single oversized file gets a quick negation beat (not just one giant
  file), then the real device: a small always-on core file settles glowing
  steady, and chapter tiles stagger-assemble around it, lighting on-demand one
  at a time.
- voiceover: "It doesn't just shrink the whole thing into one file either. It splits the book into a short core file that's always loaded, and separate chapter files that only open when your agent actually needs them."
- duration: 11.44s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/02-mechanism.html
- type: pain_point
- persuasion: Concretization
- beat: correction into clarity
- blueprint: kinetic-type-beats (Adapt — core-file + on-demand-chapter-tiles
  device, reused from draft 2's Frame 2, recolored dark)
- focal: the negated single-file beat, then the core-file + chapter-tiles device
- roles: single oversized file = brief foreground subject, Scene 1 (negated) ·
  core file + chapter tiles = foreground subject, Scene 2 (green glow, orderly,
  on-demand) · near-black ground = background
- sfx: whoosh, ui pop, chime

Real word timing:
It@0.1 doesn't@0.22 just@0.5 shrink@0.66 the@1.04 whole@1.2 thing@1.42 into@1.58
one@1.86 file@2.12 either.@2.34 It@3.1 splits@3.26 the@3.62 book@3.78 into@4.02
a@4.24 short@4.38 core@4.8 file@5.1 that's@5.52 always@5.84 loaded,@6.22
and@6.96 separate@7.24 chapter@7.68 files@8.06 that@8.52 only@8.8 open@9.1
when@9.58 your@9.74 agent@9.94 actually@10.34 needs@10.78 them.@11.06

Scene 1 (0.0–3.1s): one oversized file icon settles center, then gets a quick
red-accent strike-through / negation beat right as "either" lands (2.34s) — a
fast correction, not a held beat.
Scene 2 (3.1–11.44s): the file dissolves into the core-file + chapter-tiles
device — core file settles calm green on "core file" (4.8-5.1s), chapter tiles
stagger-assemble starting after "loaded," (6.22s), each lighting on-demand one
at a time through "actually needs them" (10.34-11.06s) — Centered, core tile
fixed and slightly larger, chapters arranged around it.

## Frame 3 — Install + proof

- scene: The real install command types on in a terminal card first, then a
  real captured screenshot of the actual GitHub repo with a coral count-up to
  the real star count.
- voiceover: "To install it, just run this one command in your Claude Code terminal. It's already sitting at almost twenty-one thousand stars on GitHub, built in the last three months."
- duration: 8.4s
- transition_in: zoom-through
- status: outline
- src: compositions/frames/03-proof.html
- type: social_proof
- persuasion: Citation/source + Statistical proof
- beat: instruction tipping into credibility
- blueprint: grid-card-assemble (Adapt — terminal-then-screenshot order, flipped
  from draft 2 to match the new script's own beat order)
- focal: the terminal install command, then the real GitHub screenshot + star
  count-up
- roles: terminal card = foreground subject, Scene 1 · real repo screenshot +
  star count-up = foreground subject, Scene 2 · near-black ground = background
- sfx: ui pop, chime

Real word timing:
To@0.1 install@0.22 it,@0.58 just@0.76 run@0.94 this@1.12 one@1.34
command@1.56 in@1.92 your@2.04 Claude@2.14 Code@2.42 terminal.@2.66 It's@3.52
already@3.68 sitting@4.0 at@4.32 almost@4.46 twenty-one@4.84 thousand@5.38
stars@5.74 on@6.02 GitHub,@6.16 built@6.72 in@6.98 the@7.08 last@7.2
three@7.6 months.@7.84

Scene 1 (0.0–3.3s): terminal card builds in immediately (hero visible by
t≤0.5s), the real command `npx skills add virgiliojr94/book-to-skill` types on
character by character with a blinking cursor, completing right as "terminal."
lands (2.66s), holding briefly into the cut.
Scene 2 (3.3–8.4s): hard cut to the real captured screenshot of
github.com/virgiliojr94/book-to-skill in a browser-chrome card, camera-push
zoom into the real star badge, a large accent-colored "20,978" counts up timed
to land right as "stars" is spoken (5.74-6.02s), "GitHub stars" in mono beneath.

## Frame 4 — CTA

- scene: A short, punchy sign-off resolving into a comment-gate callout.
- voiceover: "So if you want to try this for yourself, just comment BOOK down below and I'll send it to you directly."
- duration: 4.8s
- transition_in: squeeze
- status: outline
- src: compositions/frames/04-cta.html
- type: cta
- persuasion: Direct address
- beat: resolve, invitation
- blueprint: titlecard-reveal
- focal: the "Comment BOOK" callout
- roles: sign-off line = foreground subject · one accent-callout "Comment BOOK"
  mark = the single voltage moment · near-black ground = background
- sfx: ui pop, chime

Real word timing:
So@0.1 if@0.2 you@0.3 want@0.4 to@0.52 try@0.64 this@0.84 for@1.0
yourself,@1.12 just@1.72 comment@1.9 BOOK@2.32 down@2.74 below@2.94 and@3.32
I'll@3.44 send@3.62 it@3.82 to@3.94 you@4.04 directly.@4.18

Scene 1 (0.0–4.8s): single held scene, short frame — the sign-off line fades in
centered on "So if you want to try this for yourself" (0.1-1.12s), then
translates up as the "Comment BOOK" accent-callout spring-settles right as
"comment BOOK" is spoken (1.9-2.32s), holding static to the final frame.
