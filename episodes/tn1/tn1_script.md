# tn1: "AI Couldn't Do Math (2020 vs. Today)"

Pillar 2, Then vs Now. First episode of this pillar — built to test the new standing rule:
"don't use fixed visual for title, decide visuals and UI elements based on the script that
makes sense," applied here for the first time instead of reusing cm1's input-field template.

Status: **RENDERED 2026-08-07, revision 2.** `episodes/tn1/build/tn1_math.mp4`, ~49.3s, real
ElevenLabs VO (existing voice clone) + karaoke captions.

Revision 1 (superseded): built around `MathField`/`ReasoningStep`, thin-outlined boxes and a
plain dot-and-line flowchart. User rejected it: "UI elements are very simple, what did i told
you to use rich elements, objects, graphics" — this was the SAME mistake documented twice
before in [[feedback-literal-real-ui-over-abstract-visuals]] (cm2's rejected rounds 1-2), just
with new styling: a clean outline box is still an abstract stand-in, not a real UI. Also
flagged: the hook opened with flat exposition ("This is GPT-3...") instead of leading with
contrast, breaking the proven hook formula from [[feedback-hook-style-contrast-and-humor]].

Revision 2 (this one): full rebuild around a real, detailed chat-interface set-piece, per the
content plan's own prescribed element for this topic ("Chat interface, two panels side by
side") and the (now three-times-corrected) literal-real-UI rule. New shared components:
`components/ChatWindow.tsx` (rounded app panel, traffic-light header dots, model label),
`components/ChatBubble.tsx` (avatar + rounded message bubble, user bubbles filled/solid,
assistant outlined, a bouncing-dots typing indicator, monochrome correct/wrong states via
glyph + DIM/ACCENT), `components/ReasoningPanel.tsx` (a real "thinking" drawer like current
chat products show, spinning-ring header, steps building line by line). Script hook rewritten
to lead with hyperbolic contrast ("GPT-3 could write you a sonnet, debate philosophy... ask it
to multiply two two-digit numbers, right about one time in three") instead of flat exposition,
still bookended by the same sonnet/hundred callback at the close. Shot3's wrong-guess digit
jitter (inside the assistant bubble now) is still a deterministic sine-hash of frame, not
`Math.random()`. Shot3's failure moment and Shot4's scene-cut still reuse the proven
`GlowBeam3D` bloom technique from cm1.

**Bug caught and fixed during this build**: `&times;`/`&middot;` HTML entities only decode when
written directly as JSX children (e.g. `<div>47 &times; 68</div>`); passed as a plain JS string
into a component prop (`<MathField expression="47 &times; 68" />`), they render as the literal
text "&times;", not the symbol. Fixed by using the actual Unicode characters (×, ·) directly in
every prop string. Now documented in CLAUDE.md's pitfalls list.

## Why this topic (sourcing decision)

Content plan originally banked this slot as `tn1`, "AI Image Generation: 2022 vs. Today" (the
astronaut-on-a-horse DALL-E 2 milestone, April 2022). Blocked on sourcing: reproducing the
actual 2022 image isn't something I can do without rights to it. User's instruction: "Pick a
different, easier-to-source comparison."

Swapped in the content plan's own `tn3` premise instead — "Chatbot Reasoning: Same Question,
Years Apart" — grounded in a concrete, real, dated, citable fact rather than images:

**Source**: Brown et al., "Language Models are Few-Shot Learners" (OpenAI, May 2020,
arXiv:2005.14165) — the original GPT-3 paper. Table showing few-shot arithmetic accuracy:
2-digit multiplication correct only **29.2%** of the time. This is a real, published, dated
benchmark number, not a fabricated transcript — nothing here claims GPT-3 "said" a specific
wrong answer, only that it was reliably unreliable at 2-digit multiplication, which is what the
paper itself reports. The "today" side is a live, real computation (47 x 68 = 3196, checkable by
anyone), not a claimed screenshot from a specific product.

This fully avoids the image-copyright problem: no image is reproduced, the historical claim is a
cited academic statistic, and the modern example is generated live rather than screenshotted
from a real chat product's UI.

## Per-script visual design (not the cm1 template)

cm1's visual world was a text-input field with token chips. This topic isn't about text
splitting, it's about a model attempting a calculation and either guessing or reasoning through
it, so the literal element here is a **math problem resolving inside a prompt/answer field**,
with a distinct build: a wrong digit-by-digit guess (2020) versus a visible step-by-step
reasoning chain (today). Reasoning chain uses the same "flowchart building itself, node by node"
literal-visualization idea called out for agents in CLAUDE.md's visual rules, repurposed here for
arithmetic reasoning steps, not agent decisions.

Monochrome palette throughout (pure black background, white UI, per the Google Flow reference)
per the newest palette instruction. No color accent.

## VO script (8 shots, targeting ~40-45s)

This is GPT-3. In 2020, it was the most advanced AI on Earth. It could write poetry, pass exams, hold a conversation.

Ask it to multiply two two-digit numbers, and it got the answer right about one time in three.

Not because it was calculating. It was guessing, one digit at a time, like autocomplete finishing a sentence.

Same question. Today.

Because modern models don't guess the answer. They work through it, step by step, before they say a word.

That one change, actually reasoning instead of autocompleting, is also why AI got so much better at code, logic, and planning, not just math.

So next time AI solves something instantly, remember: in 2020 it could write you a sonnet. It just couldn't count to a hundred.

Follow for how AI actually works, one real comparison at a time.

## Shot-by-shot visual intent

1. **Hook**: prompt-style UI, label "GPT-3 - 2020" typed in top corner. Bold hook text over it.
   First frame has motion (typing cursor), not static.
2. Math problem types into the field: "47 x 68 =". Field waits, blinking cursor (tension beat).
3. Wrong-guess animation: digits appear one at a time, uncertain/jittery, lands on a wrong total,
   red X. Small stat tag: "2-digit multiplication: correct 29% of the time" with citation
   ("GPT-3, 2020 benchmark") in small type, honors the sourcing requirement on screen.
4. Hard cut: same field, label swaps to "Today". Same prompt re-appears.
5. Reasoning-chain build: three steps appear in sequence, node by node (47x60=2820, 47x8=376,
   2820+376=3196), each with a small connecting line/tick sound, landing on a green check and
   the correct total.
6. Zoom-out beat: small row of icons/labels expanding out from the checkmark (code, logic,
   planning) showing this one mechanic explains more than just math.
7. Payoff/reframe: split composition, "2020: could write a sonnet" one one side, "couldn't count
   to 100" on the other, callback to the hook's contrast.
8. CTA: **follow only, no comment-keyword gate** (same standing rule as cm1, no audience to drive
   comments yet).

## Open items before shots get built

- Confirm this script with the user before touching render code (standing workflow rule).
- Verify 47 x 68 = 3196 is correct before it's locked into a shot (checked by hand above, still
  worth a second check before it's on screen).
- New shot components needed (none of these exist yet): a prompt/answer field component (not
  `InputFieldFrame`, that's cm1's chat-input look; this one needs a labeled model tag + answer
  resolution state), a step-by-step reasoning-chain build component, and a wrong-guess digit
  jitter animation. None should be built until the script above is approved.
