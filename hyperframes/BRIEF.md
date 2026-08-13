---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "I hand-built AI video components all session, then found a public registry (HyperFrames itself) that already had 380 of them"
destination: instagram-reels
aspect: 1080x1920
language: en
audience: people building AI agents, automation, and tools; faceless channel, no on-camera avatar
length: 48s
angle: build-in-public
vo_mode: verbatim
---

## Intent

A first-hand, build-in-public account: this session hand-built a Remotion component library
(terminal cards, count-up numbers, connected diagrams) one piece at a time, then discovered
HyperFrames' own registry already had most of it pre-built. Tone: honest, a little
self-deprecating about the wasted effort, not a sales pitch for the tool. Real numbers only,
verified directly, not researched secondhand. This is also the channel's first episode produced
with HyperFrames itself, so the making of it is part of the story.

## Assets

- `elevenlabs_full.wav` (project root, copied by init) — full VO, 48.16s, real ElevenLabs
  narration, already generated, do not regenerate.
- `C:\Users\Vinay\Documents\ThatAIPM\insideaiagents\episodes\hyperframes-had-the-components-i-hand-built\assets\shot1_vo.wav`
  through `shot5_vo.wav` — per-shot cut audio, real forced-alignment word timing in the sibling
  `shot{N}_words.json` files, 30fps. Use these for shot-level timing instead of re-deriving.
- `C:\Users\Vinay\Documents\ThatAIPM\insideaiagents\episodes\hyperframes-had-the-components-i-hand-built\script.md`
  — full script, 5-shot breakdown (Concept -> Real shape -> Device -> Why it matches per shot),
  and verified sources (GitHub stars, registry item counts, confirmed named overlaps and gaps).
  Read directly rather than re-deriving the story.

## Customizations

- Candidate registry items per shot (confirm actual current fit, don't assume the names still
  match today's catalog): Shot 1 `comparison-split`/`before-after-wipe`; Shot 2
  `grid-card-assemble`/`stagger-cascade`; Shot 3 `dynamic-grid`/`grid-pixelate-wipe` plus named
  callouts of `code-snippet-apple-terminal-*`, `count-up`, `scan-band`; Shot 5
  `instagram-follow`/`cta-close`/`cta-lockup`.
- Follow-only CTA on the close. No comment-keyword gate.
- `count-up` on the 380 stat and the 40,680-star stat if a beat carries it.

## Notes

- No invented stats or capabilities. Every number in the script is independently verified
  against a primary source (see script.md's Sources section) — do not add a new claim without
  the same verification.
- First HyperFrames build for this channel — review pass by pass on the storyboard rather than
  a single-shot render.
- Existing sibling Remotion pipeline (`../remotion/`) is unrelated and must not be touched.
