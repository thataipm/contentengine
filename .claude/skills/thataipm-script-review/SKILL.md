---
name: thataipm-script-review
description: "Run an @thataipm episode script through the full standing rule set in one pass: the mandatory first-person creator-voice structure (7-beat template, locked 2026-08-14, no compromise), humanizer draft-audit-final loop, no-em-dash hard rule, runtime target, proper-terms check, hook-states-topic check. Use before generating VO or after any script draft/revision. Not for VO generation (thataipm-vo) or frame timing (thataipm-resync)."
---

# thataipm-script-review: one script gate, not five feedback rounds

## Why this exists

The book-to-skill episode went through three separate user-feedback rounds on the
script (confusing, then over-simplified past the point of naming real tools,
then finally right) because each pass only fixed what was flagged, not everything
this channel's standing rules require. This skill runs the full checklist at once.

## Voice: mandatory reference style (locked 2026-08-14, no compromise)

The user supplied two reference video transcripts (downloaded/transcribed from other
creators, used here purely as a style calibration — not to be reproduced) and gave a
direct, absolute instruction: every future script follows this voice, no compromise.
This supersedes the more formal "mechanism-first explainer" narration voice used on
earlier episodes (cm1, tn1, hyperframes-what-is-mcp) wherever the two conflict. It
does NOT touch: the no-fabrication rule, the no-em-dash rule, or the requirement to
verify every stat against a primary source — if anything this voice raises the bar on
honesty, since its entire structure is a first-person "I did this" demo, and every
such claim must be literally true of what actually happened this episode.

**The 7-beat structure**, read off both reference videos' shape (paraphrased below,
not quoted at length — write fresh lines in this shape, don't lift the source
wording):

1. **Hook — bold claim or direct pain-point, names the actual subject immediately.**
   No slow build, no scene-setting, no withholding the topic for suspense. Either
   open on what the thing now makes possible ("X can now do Y in Z minutes/free/in
   one command") or open on the viewer's frustration ("If you're tired of X..."). The
   subject lands in sentence one or two. This reinforces, not replaces, the existing
   hook-states-topic rule below (step 4) — the reference style is one concrete way to
   satisfy it.
2. **Immediate stakes, one sentence.** Why this matters right now — often a reaction
   ("honestly, I think this changes X") or a concrete value comparison (cost, time,
   effort saved). Not abstract praise, a specific real comparison.
3. **Name the exact thing plainly.** "It's called ___." No drumroll.
4. **Walk through it in first-person-adjacent voice, in real sequence.** Narrate the
   tool's real, verified workflow and capabilities as if walking through them —
   "here's what it does...", "the way it works is...", "so the flow is..." — without
   requiring that a personal hands-on session actually happened. **Changed
   2026-08-15, direct instruction**: the original rule required every beat-4 step to
   be something genuinely, personally done this episode, which doesn't scale to
   producing content at real volume (most tools worth covering need heavier setup
   than a one-line install — Docker, databases, multi-step wizards — that can't
   reasonably be run before every video). What's still absolute, unchanged: every
   fact, number, and claim in this beat must be independently verified against a
   real primary source (the fact_check stage), same as everywhere else in this
   channel's standing rules — this change relaxes the FRAMING (claimed personal
   action) only, never the accuracy bar. Don't claim "I installed X" or "I asked it
   to Y" unless that literally happened this episode; when it didn't, narrate the
   tool's real documented behavior directly instead ("it does X", "the workflow
   handles Y") rather than inventing a fake first-person anecdote to fit the old
   shape.
5. **A second escalation beat mid-script** ("it doesn't stop there", "but that's not
   even the impressive part", "this is where it gets crazy") that resets attention
   before the biggest reveal, instead of one flat build to a single climax.
6. **A closing reflection line, one sentence, genuine-sounding, not a recap** ("this
   genuinely feels like...", "the results look unreal"). React to what just
   happened, don't summarize it.
7. **Comment-keyword CTA**, the channel's existing convention, unchanged in
   substance: "Comment [KEYWORD] below and I'll send you the [link/it]." Keep this
   exact shape — direct address, a single keyword, a concrete promised payoff.

**Voice attributes to hold on every line:**

- Direct address throughout: "you," "you guys." Never third person ("viewers",
  "people watching").
- Contractions always: "it's", "doesn't", "you'll", "I'm".
- Real spoken connectors used ON PURPOSE as voice, not as AI hedging to strip:
  "honestly," "I mean," "so," starting a sentence with "And" or "But." This is the
  one place this project's usual anti-filler instinct inverts — these words are the
  voice, not padding.
- Plain and concrete. No lyrical metaphor reaching for cleverness ("it's the X of
  Y" flourishes) unless the source material itself hands you a real, literal
  comparison — state what happened, not a dressed-up version of it.
- Short reactive sentences clustered around a big reveal are correct here, not a
  staccato problem — see the linter note below.

**Reconciling with existing steps:**

- **Step 1 (humanizer) still runs first**, but read its output afterward and put
  back any "honestly," "I mean," "so," or direct "you guys" address it smoothed
  into more neutral phrasing — humanizer's job is stripping AI writing patterns,
  and it doesn't know this project just adopted a voice that deliberately keeps
  some of what it would otherwise flatten. This is a manual re-check, not
  optional.
- **The staccato-run warning (mechanical gate, below) is advisory, not a violation,
  when it fires on a reaction cluster around beat 5 or 6** — a run of short
  reactive sentences right at the "this is where it gets crazy" beat is the voice
  working as intended, not an AI-writing tell. Use judgment: a staccato run in the
  middle of a plain explanatory passage is still worth a second look; one at an
  escalation beat is not.
- **Runtime target (step 4, mechanical gate) may need to widen for this voice.**
  The reference videos ran 35s and 84s — the first-person walkthrough structure
  (beat 4) naturally runs longer for a topic with more steps to demo. Treat
  45-60s as a soft default, not a ceiling: pass `--target-min`/`--target-max` to
  fit the real content rather than trimming a genuine demo walkthrough down to
  hit the old window.

## Steps

1. **Run humanizer first**, then restore the voice per the reconciliation note
   above. Invoke `/humanizer` on the draft script text — its draft-audit-final
   loop catches AI-writing patterns (em dashes, hedging, inflated significance,
   staccato fragments, etc.) that the mechanical linter below can only partially
   detect on its own — then manually re-check that it didn't also strip the
   deliberate conversational connectors and direct address the reference voice
   requires.

2. **Restore precision language humanizer may have over-simplified.** This
   channel's audience already works with AI agents day to day — real terms
   ("context window", "fine-tuning", named tools like "Claude Code") are not jargon
   needing a euphemism here, they're what the audience expects. Direct instruction
   from the book-to-skill revision: "keep it informative and simple to understand,
   also use proper tool names where required." After humanizer simplifies sentence
   structure, re-check that no real tool name or technical term got swapped for a
   vague stand-in ("an agent" instead of "Claude Code", etc.) — restore it if so.

3. **Check the script against the 7-beat structure above, by hand.** Does it open
   on the subject with a bold claim or pain-point (beat 1), name the thing plainly
   (beat 3), narrate a real first-person walkthrough (beat 4), carry a second
   escalation beat before the biggest reveal (beat 5), close on a genuine reaction
   rather than a recap (beat 6), and end on the exact comment-keyword CTA shape
   (beat 7)? This is the "no compromise" check — a script that passes the
   mechanical gate but skips this structure is not done.

4. **Run the mechanical gate:**
   ```bash
   node .claude/skills/thataipm-script-review/scripts/lint_script.mjs \
     --script hyperframes-<episode>/SCRIPT.md
   ```
   Checks, PASS/FAIL:
   - Zero em dashes or en dashes anywhere in the file (hard rule, applies to all
     writing, not just spoken lines — headers and notes count too).
   - Zero curly quotes.
   - Estimated runtime (word count / 2.9 wps, calibrated against this channel's
     real measured episodes) falls in the target 45-60s window — pass
     `--target-min`/`--target-max` to override for an intentionally shorter/longer
     format.
   - Flags (warning, not hard-fail) any 3+ consecutive very-short-sentence run per
     frame as a possible staccato pattern worth a second look — read this against
     the reconciliation note above before treating it as a problem.

5. **Check the hook by hand** (not mechanically checkable): does the first ~2
   seconds of Frame 1's line state the actual topic, not just build tension? This
   channel's own established rule (flagged directly on `sd1`: "doesn't say what
   video is going to be about") — contrast alone isn't enough, the viewer needs to
   know the subject fast. The reference voice's beat 1 (hook names the subject
   immediately) already satisfies this by construction if step 3 was done
   properly — this is the final by-hand confirmation, not a separate rewrite.

6. **Fix, re-run the linter, repeat until PASS.** Only then hand off to
   `/thataipm-vo`.

## Non-goals

- Does not generate or touch audio — that's `/thataipm-vo`.
- Does not touch STORYBOARD.md's visual/timing fields, only SCRIPT.md's voiceover
  text (keep them in sync by hand, or regenerate STORYBOARD's voiceover fields to
  match after a script revision).
