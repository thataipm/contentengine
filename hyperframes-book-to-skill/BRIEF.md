---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "There's a tool that turns any technical book into an AI skill using up to 51x fewer tokens than dumping the PDF into context, book-to-skill, 20,978 real GitHub stars"
destination: instagram-reels
aspect: 1080x1920
language: en
audience: people building with AI agents/Claude Code day to day, AI Tools & Agent Spotlights pillar (@thataipm channel, v2.0 spec)
length: 50s
angle: tool-spotlight, honest build-in-public callback
vo_mode: verbatim
---

## Intent

An AI Tools & Agent Spotlight for a real, currently-trending, verified tool: `book-to-skill`
(github.com/virgiliojr94/book-to-skill). Real facts only, checked live 2026-08-13 via the
GitHub API and the README fetched directly (not a search-snippet summary): 20,978 stars, 2,212
forks, created 2026-05-01, last pushed 2026-08-12, MIT license. Real, verbatim claim from the
README: "24x-51x fewer tokens than dumping the book into context." Install command: `npx
skills add virgiliojr94/book-to-skill`.

Script is already approved by the user (`episodes/book-to-skill-ai-agent-tool/script.md`),
5-frame structure matching this channel's established shape (hook -> problem/mechanics ->
proof -> gap/honest-lesson -> close/CTA). Frame 4's callback to this channel's own token-cost
lesson (documented in `../hyperframes/CLAUDE.md`'s "Orchestration discipline" section, ~43.7M
effective tokens on the first HyperFrames build, mostly avoidable overhead) is a real, verified
connection, not a forced tie-in.

**Frame 1's hook needs a STRONG, literal visual, not just text** (direct instruction, twice):
the verbal hook is "If you're burning tokens feeding an agent entire PDFs, stop. There's a
tool that turns any book into a skill, for up to fifty-one times less context." The visual
should literally show the waste (a full PDF/book dumped into an agent, a token-cost meter
spiking/burning) and then the fix (the same book compressing into a small skill file, the
meter collapsing), synced to the VO. This is the first frame of the video, per this channel's
own "Never Let a Frame Sit" rule it must contain motion or a bold visual from frame one, never
a static title card.

## Design system

Reuse this channel's now-standing visual system exactly, copied from the shipped
`hyperframes-had-the-components-i-hand-built` episode for cross-episode brand consistency:
light theme (warm cream ground `#FAF9F5`, ink `#141413`), the multi-accent rotation
(purple/green/orange/blue, darkened for light-ground text/stroke contrast, brighter as fills
under dark text), EB Garamond display / Inter body / JetBrains Mono index+code, no grid
texture on backgrounds (removed by direct instruction on the last episode). `frame.md` in this
project root is already copied from that episode as the starting point; adjust only if a
specific shot genuinely needs something the existing tokens don't cover, don't redesign the
system.

## Assets

- `episodes/book-to-skill-ai-agent-tool/script.md` (project root's sibling `episodes/`
  folder) — the approved script, read directly.
- Fonts and proven SFX (`ui-pop`, `chime`, `whoosh`) already copied into `assets/` from the
  prior episode.

## Customizations

- Frame 3 (proof) should include a real screenshot of the actual GitHub repo
  (github.com/virgiliojr94/book-to-skill), same discipline as the last episode: capture live,
  verify the star count matches what's cited in the VO before locking it in, never recreate a
  screenshot from memory.
- Follow-along CTA on the close, no comment-keyword gate (matches the approved script).
- Vary the cut transitions between frames rather than repeating one type (crossfade |
  blur-crossfade | push-slide | zoom-through | squeeze all available via `transitions.mjs`).
- SFX should cover every discrete visual beat, not just frame starts (this channel's own
  standing rule after direct feedback on the last episode).

## Notes

- No invented stats or capabilities. Every number in the script is independently verified
  against a primary source (GitHub API + README fetched directly) — do not add a new claim
  without the same verification.
- This is a separate HyperFrames project from `../hyperframes/` (that one belongs to the
  already-shipped/scheduled `hyperframes-had-the-components-i-hand-built` episode and must not
  be touched or reused for this build).
