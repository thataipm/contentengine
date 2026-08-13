# Script: book-to-skill (AI Tools & Agent Spotlights, Batch 3)

Real facts verified live 2026-08-13, not reused from a prior session or trusted from a search
snippet: GitHub API for `virgiliojr94/book-to-skill` (20,978 stars, 2,212 forks, created
2026-05-01, last pushed 2026-08-12, MIT license), README fetched directly via
raw.githubusercontent.com for the mechanics and the token-reduction claim.

## VO script (draft 2, humanized + proper terms restored, ~50s)

**Frame 1, Hook (0-8s):**
[rushed] If you're handing Claude Code whole PDFs, stop, you're wasting tokens for nothing.
There's a tool that shrinks any book down by up to fifty-one times.

**Frame 2, Problem/mechanics (8-20s):**
Hand an agent a four-hundred-page book, and it burns through its context window before it
even reads your question. book-to-skill fixes that: it keeps a short core file ready at all
times, and only opens a full chapter file when it's actually needed.

**Frame 3, Proof (20-32s):**
It's called book-to-skill. Almost twenty-one thousand stars on GitHub, built in the last
three months. One install command, and it turns any PDF or EPUB into a skill Claude Code
can actually use.

**Frame 4, Gap/honest lesson (32-42s):**
I ran into this same problem making this channel's own videos. Feed an AI too much at once,
and you pay for it, in cost and in time. book-to-skill solves that exact problem, just for
books instead of video.

**Frame 5, Close/CTA (42-50s):**
If you're still feeding agents documents by hand, stop. Follow along, I'm testing tools
like this in public.

### Revision note (draft 1 -> draft 2)

Draft 1 was flagged by direct user feedback as (a) VO not matching the established voice,
root cause: the shared audio engine defaults to ElevenLabs model `eleven_multilingual_v2`,
but this channel's established voice was always generated on `eleven_v3`, fixed by calling
the ElevenLabs API directly with the correct model instead of the shared wrapper's default,
and (b) the script itself too confusing. Ran through the `humanizer` skill's draft-audit-final
loop to simplify without losing real information, then a second pass restored precise/proper
terminology the audience (people already building with Claude Code day to day) actually
wants: "context window" is the real industry term, not jargon needing a euphemism, and
"Claude Code" is named explicitly (matches the README's real supported-agent list: Claude
Code, GitHub Copilot CLI, Amp) instead of a vague "an agent" throughout. No new facts added
in either pass, every number and claim still traces to the original verified sources.

## Notes

- Real install command for the on-screen/caption reference: `npx skills add
  virgiliojr94/book-to-skill`
- Frame 4's callback to this channel's own token-cost lesson is a real, verified connection
  (see `hyperframes/CLAUDE.md`'s "Orchestration discipline" section: ~43.7M effective tokens
  on the first HyperFrames build, mostly avoidable overhead), not a forced tie-in.
- No fabricated numbers: the 24x-51x figure and the two-tier file breakdown (core ~4,000
  tokens, per-chapter ~1,000 tokens each, glossary ~1,500, patterns ~2,000, cheatsheet ~1,000)
  are both verbatim from the README, not estimated.
- Runtime target: comfortably in the 45-60s range this channel has already validated, not
  optimized down for brevity's own sake.
