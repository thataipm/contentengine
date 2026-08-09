# cm1: "Tokens: How AI Reads Text"

Pillar 1, Core Mechanics. First real episode of "How AI Actually Works."

Status: **RENDERED, revised twice 2026-08-07.** `episodes/cm1/build/cm1_tokens.mp4`, ~62s, real
ElevenLabs VO (existing voice clone) + full karaoke-style word-highlight captions.

Revision 1 fixed: panels enlarged/moved up, chips/text present from frame 0 instead of popping
in late, captions word-paced instead of whole-line-pre-dimmed, smaller caption font.

Revision 2 (the real fix): user feedback made clear the actual problem was compositional, not
motion — every shot reused the same panel in the same position, so it read as one stuck scene
regardless of internal animation ("all i am seeing is stuck screen on word strawberry"),
compounded by "why are you not using screen, so much blank space." Dropped the panel chrome
entirely for shots 1-7, rebuilt each as a genuinely different full-bleed composition (different
scale, position, layout shape — vertical stack, horizontal row, word-to-number conversion rows,
hero-number-with-small-chips) using a consistent top-tag/hero/secondary-stat structure that
spans the full vertical canvas instead of clustering in the middle.

Revision 3 (this one): user shared Google Flow / Veo reference clips and asked to match that
quality. Confirmed via a direct test (`SceneRig` + real bloom beam vs. the reference) that our
own Remotion + React Three Fiber pipeline gets genuinely close using real HDR-emissive light
through `BloomRig`, not CSS approximations — fully automated, no manual per-episode generation
needed. Rebuilt all 9 shots on this: `components/GlowBox.tsx` (outline text box) +
`three/GlowBeam3D.tsx` / `GlowOrb3D.tsx` (real bloom-lit line/point light). Tightened the
script slightly (line 2: "chopped up" → "sliced apart," ties directly to the beam-through-text
visual) and regenerated VO/timing to match.

**Pitfall found and fixed during this pass**: `GlowOrb3D` (a point light) only works when the
thing it's backlighting is itself round (worked great behind the eye icon in Shot8). Behind
wide text, a number, or a button it just renders as a hard ball sitting on/beside the content.
Fixed by using `GlowBeam3D` (line-shaped) for the slicing/scanning beats where that's the
natural shape, and reverting to plain CSS `text-shadow`/`box-shadow` glow for compact text and
buttons. See CLAUDE.md's bloom pitfalls for the full writeup.

Watermark handle used: `@thataipm` — confirmed 2026-08-09, this content posts to the existing
ThatAIPM channel.

## VO script (9 shots, ~156 words, targeting ~60s at natural pace)

Revised for a stronger hook and more humor, while keeping the mechanics accurate.

AI can write your wedding speech and pass the bar exam. Ask it to count letters in "strawberry," and it falls apart.

Here's why. Every sentence you type gets sliced apart before the model ever reads it.

Not into letters. Into tokens: chunks of a few characters each.

So "strawberry" doesn't stay one word. It splits into pieces, something like "straw" and "berry," two chunks that have never met.

Models don't read words either. Every token turns into a number. As far as it's concerned, you never typed a word.

That's also why AI charges you per token, not per word. Even your typos cost something.

The model never actually sees the letters inside those chunks. It's not doing bad math. It's not doing math at all.

So next time AI botches something "simple," don't blame its intelligence. Blame its eyesight.

Follow for how AI actually works, before you ask it to spell anything else.

## Shot-by-shot visual intent (literal element: text-input field, not a chat)

A single text-input field, generic/unbranded, dark editor-style box on pure black, matching
`docs/how_ai_works_content_plan.md`'s cm1 entry (a plain input field, not a full chat, since
this is about a single piece of text, not a conversation).

1. **Hook**: the input field already has "strawberry" typed in it, cursor blinking. Bold hook
   text overlay. First frame has motion (blinking cursor, not static).
2. Text starts visibly breaking into token chunks as it's "typed"/processed.
3. Chunks snap into distinct colored blocks: tokens, not letters.
4. "strawberry" specifically splits on screen into two chunks (something like "straw" and
   "berry"). Verify the exact real split against an actual tokenizer (e.g. `tiktoken`) before
   locking the visual; the script is intentionally worded "something like" so it doesn't
   overclaim an exact split that might differ by model.
5. Each chunk visibly converts into a number/ID next to it (the "tokens become numbers" beat).
6. A small "cost" readout ticks up per chunk (the "charged per token" beat), still inside the
   same input-field world, not a separate UI.
7. Zoom into one chunk showing it has no concept of individual letters inside it (e.g. an "R"
   counter trying and failing to look inside the chunk).
8. Reframe/payoff: this isn't AI being "dumb," it's a mechanical fact about how it reads.
9. CTA: **follow only, no comment-keyword gate** (holding off on the comment-to-unlock mechanic
   until there's an actual audience to drive comments).

## Captions

Full karaoke-style word-highlight subtitles for the whole episode, per your instruction: every
word on screen with the currently-spoken word in the accent color, timed against real
ElevenLabs forced-alignment word data (same system already built for shot timing), not
estimated. New reusable component, not built yet, comes after script approval alongside the
rest of the shots.
