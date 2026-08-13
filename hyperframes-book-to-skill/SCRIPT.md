# SCRIPT — book-to-skill-ai-agent-tool (redo, draft 3)

**Voice:** existing ElevenLabs voice (`ELEVENLABS_VOICE_ID` in `.env`,
`skmkySY4PkEDVIFnbSoK`), reused from every prior @thataipm episode.
**Model:** `eleven_v3` explicitly, generated via `/thataipm-vo` (calls the
ElevenLabs API directly with the correct model — the shared engine's default
`eleven_multilingual_v2` is the exact bug that shipped mismatched VO once already).
**Pacing:** energetic, slightly faster than this channel's usual register — the
`[rushed]` tag applied **uniformly to all 4 lines**, not mixed with a natural-pace
register. Draft 2 mixed `[rushed]` (frames 1-3) with plain delivery (frames 4-5)
and the user flagged it as sounding inconsistent shot to shot — a single uniform
tag across every line fixes that and matches the reference sample's own one
continuous, consistently fast take.

## Why this redo

Direct feedback on draft 2: the script itself read as too documentary/reflective
for this channel's actual energy, and the VO's mixed rushed/natural pacing sounded
inconsistent across shots. The user supplied a real reference script (a Humanizer-
skill promo, ~160 words / 35s, one continuous conversational take, direct address,
tool named fast, concrete capability, install command, comment-gate CTA) and asked
for it to be applied to our system. This draft restructures book-to-skill's own
already-verified facts into that shape — same real facts, new voice and pacing.

Structural change from draft 2: **4 frames instead of 5** — the reflective
"honest gap" beat (this channel's own token-cost callback) is dropped for this
redo. It doesn't fit the tighter, punchier economy the reference script models;
this channel's honest-callback device isn't retired, just not used here.

---

## Line 1 — Hook + what it does (Frame 1)

**Delivery:** Rushed, energetic, direct address, tool name lands fast.

    [rushed] If your AI agent keeps choking on huge PDFs and burning through its context window, there's actually a free skill that fixes that. It's called book-to-skill, and it turns any book into a skill your agent can actually use, up to fifty-one times smaller than the original.

## Line 2 — How it works (Frame 2)

**Delivery:** Rushed, same energy, no let-up into a slower explainer register.

    [rushed] It doesn't just shrink the whole thing into one file either. It splits the book into a short core file that's always loaded, and separate chapter files that only open when your agent actually needs them.

## Line 3 — Install + proof (Frame 3)

**Delivery:** Rushed, matter-of-fact confidence on the real numbers.

    [rushed] To install it, just run this one command in your Claude Code terminal. It's already sitting at almost twenty-one thousand stars on GitHub, built in the last three months.

## Line 4 — CTA (Frame 4)

**Delivery:** Rushed, direct address, closes on the same energy it opened with.

    [rushed] So if you want to try this for yourself, just comment BOOK down below and I'll send it to you directly.

---

## Notes

- Real install command for the on-screen/caption reference (not read aloud, same
  choice the reference script makes — it says "run this one command" and lets the
  visual show it): `npx skills add virgiliojr94/book-to-skill`.
- CTA switched to a comment-gate ("comment BOOK") from draft 2's plain follow-only
  close — matches the reference script and matches what `CLAUDE.md`'s posting-
  automation note describes as this channel's actual standing CTA pattern.
- No fabricated numbers: 20,978 GitHub stars, the fifty-one-times reduction claim,
  and the core-file/chapter-file mechanism are all verbatim from the README,
  verified live via the GitHub API, same as draft 2.
- Runtime target: ~30-35s, matching the reference script's own real measured
  length — a deliberate departure from this channel's usual 45-60s, not a mistake.
