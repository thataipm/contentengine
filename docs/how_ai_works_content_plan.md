# "How AI Actually Works" — Content Plan

Locked in 2026-08-06, alongside the visual direction (see CLAUDE.md §1 for the channel brief
this plan implements). 30 episodes banked, 10 per pillar, to be produced in a rotation that
follows the brief's 50/30/20 pillar weighting rather than strict banked order (see §3).

## 1. Visual direction (finalized)

After four rounds of hook concepts (flat CSS chips → bloom-lit 3D orbs → a particle vortex →
a real chat interface), the winner and standing rule for every episode:

- **Pure black background** (`#000000`). No gradient wash, no ambient particle field as the
  default look — those read as decorative, not literal.
- **Show the real thing being talked about, not a metaphor for it.** If the narration is about
  an LLM answering a prompt, show an actual (generic, unbranded — no real logos/wordmarks) dark
  chat interface with the response really streaming in on screen. If it's about infrastructure,
  show a server rack. If it's about code, show a real code editor with text being typed. The
  demonstration should double as the explanation, the same way `HookPreview_ChatUI.tsx`'s
  streamed response ("I'm not thinking — I'm predicting...") proves the episode's own claim by
  actually doing it on screen.
- **Never Let a Frame Sit still applies underneath this** — the literal UI element itself must
  stay in constant motion (text streaming, cursor blinking, a build/reveal happening), not just
  sit there as a static screenshot. A frozen chat panel for 3+ seconds fails the rule just as
  much as a frozen abstract diagram would.
- Fonts: `Bricolage Grotesque` for hook/headline text, `Inter` for any in-UI text (chat
  messages, code, labels) — chosen because it's what real interfaces actually use, not a brand
  choice. Locked into `remotion/src/theme.ts`.
- Accent color: mint `#3ED9A6` for emphasis/interactive elements (cursors, key words, buttons),
  kept singular and restrained — real product UIs are mostly neutral grey/white/black with one
  accent, not a rainbow of functional color-coding. The old blue/amber/mint functional triad
  from earlier passes is retired as the *primary* language; mint alone carries emphasis now.
- **Growing literal-element library, picked per-topic, not from a fixed set.** "Chat interface,
  server rack, code editor" (the user's original examples) were there to convey the STANDARD —
  real, recognizable, and actually relevant to *that* episode's concept — not an exhaustive menu
  to default into. Build each real-world set-piece once, reuse whenever an episode's narration
  genuinely calls for it (same "episode-scoped until second use, then promote to `components/`"
  convention as the old project). Elements identified so far by walking the full 30-episode plan
  (§3-§5), not guessed in the abstract:
  - **Chat interface** (built, `HookPreview_ChatUI.tsx`) — user message bubble + streaming
    assistant response. Needs generalizing into a real reusable component (prompt text,
    response words, and timing as props) before a second episode uses it. Right fit for anything
    that's actually a conversational Q&A (prediction, context windows, RLHF ratings, math,
    hallucination, most of Pillar 3).
  - **Server rack** — infrastructure/training-cost/inference-hardware beats (cm5).
  - **Code editor** — real syntax-colored text being typed at speed, for anything code-related
    (tn5's coding comparison). NOT the right fit for cm1's tokenization, which is about plain
    text input, not code.
  - **Text-input field** (distinct from a full chat interface) — for tokenization (cm1), where
    the concept is about a single piece of input text, not a back-and-forth.
  - **Document/text viewer with connection lines** — for attention (cm3), matching how real
    attention-visualization tools actually look, not a chat window.
  - **Embedding map (2D scatter-plot panel)** — for embeddings (cm4), a data-visualization
    element, not a chat UI at all.
  - **Training dashboard (progress bar / loss curve)** — for fine-tuning (cm7), distinct from
    the chat interface used to show its *result*.
  - **Image-generation panel** — for diffusion (cm9) and any image-based Then-vs-Now/Why-It-Broke
    episode (tn1, tn2, wb2, wb5).
  - **Video panel** — for tn4.
  - **Audio waveform/scrubber panel** — for tn6 (voice cloning); this pillar isn't purely visual
    for that episode, needs an audio-scrub element specifically.
  - **Translation panel** (source/target side by side) — for tn7, distinct from a chat window.
  - More set-pieces get added here as specific episodes need them — don't design one
    speculatively before an episode actually calls for it, and don't reach for chat interface by
    default just because it's the one that's already built.

## 2. Voice

Reuses the existing ElevenLabs voice already configured (`.env`'s `ELEVENLABS_VOICE_ID`) — the
user's own voice clone, not a new one. **Confirm this is still correct before generating VO for
the first real episode**, since CLAUDE.md previously flagged this ID as inherited from the old
"That AI PM" project and pending replacement; the user's instruction this session was to just
reuse it, which resolves that open item, but it's worth one explicit check before spending API
calls on it.

## 3. Pillar 1 — Core Mechanics (10 episodes, ~50% of rotation)

The evergreen "how it works" backbone. Ordered roughly by natural teaching sequence (later
episodes assume earlier concepts as background, though each stands alone).

Literal elements are picked per-topic, not from a fixed set — "chat interface, server rack,
code editor" in the brief were examples to convey the STANDARD (real, recognizable, relevant
to *this* concept), not the only three allowed. The table below picks whatever real thing an
episode's specific concept actually maps to, even where that's a different UI entirely.

| # | Title | Core claim | Literal element |
|---|---|---|---|
| cm1 | Tokens: How AI Reads Text | Text isn't read letter by letter — it's chopped into subword tokens first | Plain text-input field: a typed sentence visibly breaking into colored token chips as it's typed, no chat back-and-forth needed |
| cm2 | It's Not Writing, It's Predicting | Every word is a probability guess over the whole vocabulary, one token at a time | Chat interface, response streaming live (built — see `HookPreview_ChatUI.tsx`) |
| cm3 | Attention: How AI Knows What Matters | Every word "looks at" every other word to decide relevance before answering | Document/text viewer (not chat) — a real attention-visualization pattern: a paragraph with animated connection lines linking related words as each new word is produced |
| cm4 | Embeddings: Turning Words Into Coordinates | Meaning gets stored as a point in space — similar meanings sit near each other | Embedding map: a real 2D scatter-plot panel (like an ML embedding visualizer), words plotting as points that cluster by meaning — not a chat UI at all |
| cm5 | Training vs. Inference: Learned Once, Used Forever | The expensive learning phase and the cheap answering phase are completely different processes | Server rack (training, heavy/loud) cutting to a single chat response (inference, instant) |
| cm6 | Context Windows: Why AI "Forgets" Mid-Chat | There's a hard token ceiling — older messages literally fall out of view | Chat interface scrolling, early messages visibly greying out/dropping off top |
| cm7 | Fine-Tuning: Teaching a Generalist a Specialty | Same base model, retrained on a narrow dataset to specialize | Training dashboard (progress bar / loss curve dropping, processing a narrow dataset file) cutting to a chat response that's now visibly specialized |
| cm8 | RLHF: How AI Learned to Be Helpful | Human ratings, not just text prediction, shape the final behavior | Chat interface showing two candidate responses with a real thumbs up/down rating control deciding between them |
| cm9 | Diffusion: Drawing a Picture Out of Noise | Image generation starts as pure static and gets denoised toward a target | Real image-generation panel materializing from visible noise, step counter ticking |
| cm10 | Agents: When AI Takes Actions, Not Just Answers | The loop is observe → decide → act → repeat, not a single reply | Chat interface that visibly hands off to a distinct tool panel (a code-execution or search panel popping up) mid-response, then returns |

## 4. Pillar 2 — Then vs Now (10 episodes, ~30% of rotation)

Real, dated before/after comparisons. **Every one of these needs an actual sourced example
(real screenshot/output + date) gathered before scripting** — the premises below are the
comparison angle, not verified claims yet. Don't script from memory; go find the real artifact
first.

| # | Title | Comparison angle | Literal element |
|---|---|---|---|
| tn1 | AI Image Generation: 2022 vs. Today | Same prompt, early diffusion model vs. current, side by side | Split-screen image panel, old (noisy/warped) vs. new (clean) |
| tn2 | Why AI Hands Used to Break | The specific structural fix that solved the "six fingers" problem | Before/after image panel, hands specifically |
| tn3 | Chatbot Reasoning: Same Question, Years Apart | Early LLM vs. current model, identical prompt, real transcripts | Chat interface, two panels side by side |
| tn4 | AI Video: From Flicker to Real Motion | Early text-to-video output vs. current | Video panel comparison |
| tn5 | AI Coding: From Autocomplete to Full Features | Real before/after code-generation output on the same task | Code editor, old broken output vs. new working output |
| tn6 | Voice Cloning: Robotic to Indistinguishable | Early TTS sample vs. current, same script | Audio waveform panel, not a visual-only beat — needs a waveform/scrubber element |
| tn7 | AI Translation: Then vs. Now | Same sentence, real output comparison | Translation panel (source/target side by side, not a chat) — matches what a real translation tool looks like |
| tn8 | Context Windows: From a Page to a Book | Real token-limit numbers, then vs. now | Chat interface scroll length comparison (literal length of visible history) |
| tn9 | AI Math: From Constant Errors to Real Reasoning | Real before/after on the same math problem | Chat interface, worked solution comparison (math is asked conversationally, so chat is the honest fit here) |
| tn10 | Response Speed: From Minutes to Instant | Real latency numbers, then vs. now | Chat interface with a visible timer/loading state comparison |

## 5. Pillar 3 — Why It Broke (10 episodes, ~20% of rotation)

Real, verifiable AI failures explained through mechanics, not mockery. The incidents below are
broadly publicly documented (real news stories), but **still verify the specific facts/dates and
find a real source before scripting** — don't narrate details from memory.

| # | Title | Real incident (verify before scripting) | Literal element |
|---|---|---|---|
| wb1 | Why AI Hallucinates Fake Facts | A lawyer's court filing cited fake, AI-invented case law (2023) | Chat interface generating a citation, then a "does this exist?" check failing |
| wb2 | Why AI Used to Draw Six-Fingered Hands | Structural limitation in early diffusion models | Image panel, generation with visibly wrong hand structure |
| wb3 | Why a Chatbot Promised a Fake Refund | Airline chatbot's promise was upheld as binding despite being wrong (2024) | Chat interface, a policy answer that turns out fabricated |
| wb4 | Why AI Can't Always Do Basic Math | Numbers get tokenized in ways that break simple arithmetic | Chat interface, a wrong arithmetic answer traced back to token splitting |
| wb5 | Why an AI Image Tool Rewrote History | A major image generator's historical-accuracy controversy (2024) | Image panel, a historically inaccurate generation |
| wb6 | Why a Chatbot Had a Public Meltdown | An early conversational AI's unstable long-session behavior (2023) | Chat interface, a conversation visibly degrading over many turns |
| wb7 | Why AI Confidently Gets Dates Wrong | Training data has a real cutoff date, but the model doesn't "know" that | Chat interface, a confident wrong answer about a recent event |
| wb8 | Why AI Sometimes Repeats Itself in Loops | A real decoding/sampling failure mode | Chat interface, visible repeating loop in a response |
| wb9 | Why a Jailbreak Prompt Works | The real mechanics behind a documented prompt-injection bypass | Chat interface, a prompt visibly reframing context to bypass a rule |
| wb10 | Why AI Sometimes Refuses Harmless Requests | Over-cautious alignment producing false-positive refusals | Chat interface, an obviously harmless request getting an incorrect refusal |

## 6. Production rotation

Bank size is equal (10/10/10) but publishing follows the brief's 50/30/20 weighting, so the
Core Mechanics bank gets consumed roughly 2.5x faster than the other two. Rotation pattern per
10 published videos: **5 Core Mechanics, 3 Then vs Now, 2 Why It Broke**, interleaved rather
than published in blocks (so the feed doesn't run 5 mechanics episodes in a row). Suggested
interleave order for the first 10:

cm1 → tn1 → cm2 → wb1 → cm3 → tn2 → cm4 → wb2 → cm5 → tn3

When a pillar's bank of 10 runs out before the others, that's the trigger to plan its next 10,
not a hard stop.

## 7. First video

**cm2, "It's Not Writing, It's Predicting."** Not cm1 (Tokens), even though tokens is the more
foundational concept — the hook for cm2 is already built and approved (`HookPreview_ChatUI.tsx`,
this session), so it's the one real episode where the hardest creative decision is already made
and rendered. Starting here preserves that work instead of shelving it. cm1 is the natural
second episode once this one ships.
