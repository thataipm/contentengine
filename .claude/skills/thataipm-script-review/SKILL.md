---
name: thataipm-script-review
description: "Run an @thataipm episode script through the full standing rule set in one pass: humanizer draft-audit-final loop, no-em-dash hard rule, runtime target, proper-terms check, hook-states-topic check. Use before generating VO or after any script draft/revision. Not for VO generation (thataipm-vo) or frame timing (thataipm-resync)."
---

# thataipm-script-review: one script gate, not five feedback rounds

## Why this exists

The book-to-skill episode went through three separate user-feedback rounds on the
script (confusing, then over-simplified past the point of naming real tools,
then finally right) because each pass only fixed what was flagged, not everything
this channel's standing rules require. This skill runs the full checklist at once.

## Steps

1. **Run humanizer first.** Invoke `/humanizer` on the draft script text — its
   draft-audit-final loop catches AI-writing patterns (em dashes, hedging, inflated
   significance, staccato fragments, etc.) that the mechanical linter below can only
   partially detect on its own.

2. **Restore precision language humanizer may have over-simplified.** This
   channel's audience already works with AI agents day to day — real terms
   ("context window", "fine-tuning", named tools like "Claude Code") are not jargon
   needing a euphemism here, they're what the audience expects. Direct instruction
   from the book-to-skill revision: "keep it informative and simple to understand,
   also use proper tool names where required." After humanizer simplifies sentence
   structure, re-check that no real tool name or technical term got swapped for a
   vague stand-in ("an agent" instead of "Claude Code", etc.) — restore it if so.

3. **Run the mechanical gate:**
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
     frame as a possible staccato pattern worth a second look.

4. **Check the hook by hand** (not mechanically checkable): does the first ~2
   seconds of Frame 1's line state the actual topic, not just build tension? This
   channel's own established rule (flagged directly on `sd1`: "doesn't say what
   video is going to be about") — contrast alone isn't enough, the viewer needs to
   know the subject fast.

5. **Fix, re-run the linter, repeat until PASS.** Only then hand off to
   `/thataipm-vo`.

## Non-goals

- Does not generate or touch audio — that's `/thataipm-vo`.
- Does not touch STORYBOARD.md's visual/timing fields, only SCRIPT.md's voiceover
  text (keep them in sync by hand, or regenerate STORYBOARD's voiceover fields to
  match after a script revision).
