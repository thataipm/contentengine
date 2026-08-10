# The Karpathy Skill — Script & Shot List

**Pillar**: Main (60%, Trending Claude Code skills) — Day 3 of the 30-day calendar
**Status**: Approved 2026-08-10, ready for production
**Target runtime**: 50-60s (confirmed comfortable range for current pillars, see
`feedback-prefers-substance-over-brevity` memory — quality/completeness over hitting the
shortest defensible runtime)

## Verified facts (sourced 2026-08-10, re-verify before scripting anything similar later)

- Repo: `forrestchang/andrej-karpathy-skills`, transferred to the `multica-ai` org (GitHub
  redirects the old path); original author is Forrest Chang, install path in the README still
  reads `forrestchang/andrej-karpathy-skills`.
- **201,077 GitHub stars** as of 2026-08-10 (via `gh api repos/forrestchang/andrej-karpathy-skills`),
  repo created 2026-01-27.
- One `CLAUDE.md` file, zero code. Based on a tweet by Andrej Karpathy (Tesla Autopilot,
  OpenAI co-founder) about AI coding agents' failure patterns.
- Four real rules: Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven
  Execution.
- Compatible with Claude Code (primary) and Cursor (has its own `.cursor/rules/
  karpathy-guidelines.mdc`).
- Install commands (real, from the README):
  - Claude Code plugin: `/plugin marketplace add forrestchang/andrej-karpathy-skills` then
    `/plugin install andrej-karpathy-skills@karpathy-skills`
  - New project: `curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md`

## Hook design notes

Went through two rounds. First draft ("This two hundred thousand star Claude Code file
started as one tweet about AI writing bad code") stated the topic but led with an abstract
fact about the artifact instead of the viewer's problem, rejected directly. Rewritten
problem-first per real Instagram hook research (see `feedback-hook-must-state-topic`
memory's 2026-08-10 extension): lead with the viewer's pain point in direct address, let the
stat land as payoff, not the opener. Also ran through the `humanizer` skill's actual
draft-audit-final loop (not just eyeballed) — caught one staccato-fragment run in Shot 3,
fixed by merging into a single flowing enumerated sentence.

## Script

**Shot 1 (Hook, ~7s)** — real screenshot of the repo page, zoomed on the star count
> "Your AI coding agent keeps rewriting code you never asked it to touch. This file, two
> hundred thousand GitHub stars, fixes exactly that."

**Shot 2 (~9s)** — Karpathy's real GitHub avatar + a summary card (not a direct quote, exact
tweet text isn't accessible to verify)
> "Andrej Karpathy, who built Tesla's Autopilot and co-founded OpenAI, posted about how AI
> coding agents keep making the same mistakes: guessing what you meant, and rewriting code
> nobody asked them to touch."

**Shot 3 (~11s)** — real screenshot of the actual CLAUDE.md file on GitHub, four rules
revealing one by one, synced to word timing
> "A developer named Forrest Chang turned Karpathy's complaints into one file, CLAUDE.md,
> four rules long: think before coding, keep it simple, touch only what you're asked to
> touch, and define what done actually looks like."

**Shot 4 (~7s)** — stat callout, real number
> "That's two hundred and one thousand stars, on a single markdown file, and it's still
> climbing."

**Shot 5 (~8s, close)** — terminal card with the real install command, tool logos (Claude
Code, Cursor), comment CTA
> "It works with Claude Code and Cursor. Drop it in as your CLAUDE.md and the agent stops
> guessing. Comment KARPATHY and I'll send you the link."

## Visual component plan

Reuses existing components: `RepoScreenshot`, `TerminalCard`, `ToolHeader`, `CommentCTA`,
`CaptionsPop`, `ContentZone`. New, small builds needed:
- A four-rule reveal element for Shot 3 (rules pop in one at a time, synced to each clause's
  word-timing `born` frame) — check whether `PipelineFlow`'s node-by-node reveal pattern can
  be adapted before building something new.
- A Karpathy-attribution card for Shot 2 (real avatar + name/role, not a fabricated quote
  block, since the exact tweet text couldn't be verified).
