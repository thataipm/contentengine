# Claude Just Got 68 Product Management Skills — Script & Shot List

**Pillar**: AI Workflows & Tools (v2.0, ~30% share) — Batch 2, produced by the unattended
daily pipeline 2026-08-11.
**Status**: Produced 2026-08-11, ready for scheduling.
**Target runtime**: ~55s (confirmed comfortable range for this channel, see
`feedback-prefers-substance-over-brevity` memory).

## Verified facts (sourced 2026-08-11, re-verify before reusing this repo in a future episode)

Independently confirmed by downloading the raw README directly (`raw.githubusercontent.com/
product-on-purpose/pm-skills/main/README.md`), not just a research-pass summary, per the
CLAUDE.md §7 "verify against primary source" standing rule.

- Repo: `product-on-purpose/pm-skills`, Apache 2.0, current version `v2.31.1`.
- 530 GitHub stars, 69 forks (via `curl https://api.github.com/repos/product-on-purpose/
  pm-skills`), created 2026-01-09, last updated 2026-08-10 (actively maintained).
- **68 total skills**: 30 phase skills across 6 phases of a "Triple Diamond" product
  lifecycle (Discover 5, Define 5, Develop 4, Deliver 6, Measure 6, Iterate 4), 11 foundation
  skills, 12 utility skills, 15 tool-family skills (7 Foundation Sprint + 7 Design Sprint + 1
  standalone). All confirmed against the README's own table of contents anchors.
- 6 sub-agents per the README's own "At a Glance" stats table (auto-generated from the repo's
  plugin manifest): pm-critic, pm-skill-auditor, pm-changelog-curator, pm-release-conductor,
  pm-workflow-orchestrator, pm-skill-router. Only pm-critic is named in the script (the one
  whose description generalizes cleanly to any PM's own work: "adversarial quality reviewer...
  stress-test a PRD, hypothesis, or opportunity tree before sharing with stakeholders"); the
  others (release-conductor, changelog-curator, etc.) are meta-tooling for maintaining the
  pm-skills repo itself, not generic PM workflow claims, so they're deliberately not
  characterized as general-purpose in the VO.
- Real install command (Claude Code, the "recommended" path per the README):
  `/plugin marketplace add product-on-purpose/agent-plugins` then
  `/plugin install pm-skills@product-on-purpose`.
- Cross-platform: also documented for Cursor, Codex, Windsurf, GitHub Copilot, and Gemini CLI
  (cross-agent installs via `npx skills add product-on-purpose/pm-skills`, the open
  vercel-labs/skills CLI).
- The "mediocre by default" framing in Shot 1 paraphrases the README's own stated rationale:
  "When you ask an AI to write a PRD, the output quality is anchored to its training data
  average. That average is mediocre." Not an invented claim.

## Concept selection note

Batch 1's two concepts were already resolved before this run started ("What AI Is Actually
Doing to PM Hiring" produced and scheduled; SenseBug AI blocked on user-supplied details).
Per the daily pipeline's own instructions, pulled from `docs/experiment_log.md`'s Notes
reserve list instead of generating new candidates from scratch. Two reserve candidates were
viable without needing user-specific input: "I installed 65 PM skills into Claude" and "Claude
Cowork for PM workflows." The Cowork angle was framed in the reserve note as first-hand
("since the user already runs this channel's own pipeline through Cowork"), but nothing in
this project's actual production pipeline (CLAUDE.md §2's `run_daily_pipeline.ps1` -> `claude
-p` headless flow) uses Cowork, so that first-hand claim wasn't verifiable and the concept was
skipped rather than scripted on an unconfirmed premise. The PM-skills concept only needed
public repo research, so it was chosen and re-verified: the reserve note's "65 skills" rounds
to the real, verified 68.

## Quality Gate

- concept: "Claude Just Got 68 Product Management Skills" (pm-skills plugin spotlight)
- pillar_fit: PASS — AI Workflows & Tools, acquisition via a real, installable tool
- audience_fit: PASS — directly useful to the primary audience (PMs using Claude day to day)
- 100k_test: PASS — exactly the audience worth having (PMs evaluating real AI workflow tools)
- pm_question: USE (what an AI-native PM should use) and WORK (a real structural framework,
  not a generic tip)
- originality: leads with the repo's own stated problem (AI output quality is anchored to a
  mediocre training-data average) and its structural answer (a full lifecycle of skills, not a
  prompt pack), not a generic "top tools" listicle
- payoff: a specific, real, installable system with an exact install command, not just a name
  to go look up later
- brand_value: high — concrete "AI-native product thinking" example, product is the lens
  (the video is about the Triple Diamond lifecycle structure, not a bare tool ad)
- worth_producing: PASS
- gate_result: PASS
- episode_status: PRODUCED (episodes/claude-just-got-68-product-management-skills/, ready for
  scheduling)

## Script

**Shot 1 (Hook, ~8s)** — real screenshot of the repo page, zoomed into the skill-count badge
> "Ask Claude to write a PRD, and you'll get the same mediocre draft everyone else gets. This
> repo fixes that with sixty eight real product management skills."

**Shot 2 (~13s)** — the six lifecycle phases building one at a time (PipelineFlow-style reveal)
> "It's built around the real product lifecycle: thirty skills across six phases, discover,
> define, develop, deliver, measure, iterate, plus foundation, utility, and sprint toolkit
> skills that make up the rest of the sixty eight."

**Shot 3 (~10s)** — sub-agent spotlight card (pm-critic only, real description)
> "It also ships specialist sub agents that Claude can spawn on demand. One of them, the
> critic, adversarially reviews your PRD or your hypothesis before stakeholders ever see it."

**Shot 4 (~7s)** — dual stat callout (skills + stars)
> "Sixty eight skills, five hundred thirty GitHub stars, and it's Apache licensed and still
> shipping new updates."

**Shot 5 (~12s, close)** — works-with logos (Claude Code, Cursor, Codex), terminal card with
the real install command, comment CTA
> "It works with Claude Code, Cursor, and Codex. Install it as a plugin, and every future PRD
> starts from real product thinking, not average. Comment PLAYBOOK and I'll send you the
> link."

## Visual component plan

Reuses `RepoScreenshot`, `ToolHeader`, `PipelineFlow`, `TerminalCard`, `CommentCTA`,
`CaptionsPop`, `ContentZone`, `Sfx`, `GridBackground`, `theme_skills.ts` — the same set the
karpathy-skill episode established. New, small builds:
- A phase-reveal variant of `PipelineFlow` showing 6 nodes (the lifecycle phases) instead of a
  linear pipeline, reusing the same component since its API is already generic (label/accent/
  born per node).
- A sub-agent spotlight card for Shot 3 (name + one-line real description, not a fabricated
  quote or demo).
- A dual-stat variant of the Shot 4 stat-callout pattern from the-karpathy-skill (two numbers
  side by side instead of one), varying composition per the "vary composition, not just
  motion" rule rather than reusing the exact single-number layout twice in a row across
  episodes.
