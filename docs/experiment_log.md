# That AI PM: Experiment Log

Central, structured log for every content experiment batch under
`thataipm_content_system_operating_spec_v2.md`. Added 2026-08-10 as part of the v2.0 strategy
migration (see `CLAUDE.md`'s migration note). This is the concrete implementation of that
spec's §7 (`HYPOTHESIS -> EXPERIMENT BATCH -> CONTENT -> DISTRIBUTION -> ANALYTICS -> KEEP /
MODIFY / KILL / SCALE -> NEXT BATCH`) and §10 (batch decision rule).

**Why structured fields, not free prose**: so batches can eventually be parsed or automated
without redesigning the format. Keep the fields below consistently populated. A blank field
should read as "not yet known," never be deleted or renamed. Human-readable notes belong
underneath the structured block, not inside it.

**Format rule**: one `## Batch {N}` section per experiment batch, structured fields first,
notes after. Batches are numbered sequentially and never renumbered, even if a batch is
killed early.

---

## Structured field reference

```
batch_id:          BATCH-{NNN}, sequential, never reused
date_started:       YYYY-MM-DD
pillar:              one of: AI PM / AI Workflows & Tools / Build in Public / Opinions & Trends
series:              named series this batch belongs to, or "none" if standalone
hypothesis:          the specific, falsifiable claim this batch tests
target_audience:      who this batch is aimed at (primary/secondary per the spec, or narrower)
concepts:            list of topic candidates, each carrying its own Quality Gate result (see below)
success_metrics:      the specific metrics + thresholds that would count as a pass
status:              PLANNED / IN_PRODUCTION / PUBLISHED / EVALUATING / CLOSED
results:              actual numbers once available (see Analytics Capture Note below)
learning:            what we now know that we didn't before this batch
decision:            KEEP / SCALE / MODIFY / KILL, only set once status is CLOSED
next_action:          the concrete next step this decision implies
```

### Quality Gate sub-schema (required per concept, before it enters production)

Per the spec's inserted stage (`TOPIC CANDIDATES -> STRATEGIC QUALITY GATE -> RESEARCH`), every
candidate in a batch's `concepts:` list must carry this block before research/scripting
starts. A structured Markdown section is sufficient, no separate tracking file.

```
concept:               short name for the idea
pillar_fit:             pass/fail, one line why
audience_fit:           pass/fail, one line why
100k_test:              pass/fail against the 100K test: "if this gets 100,000 views, do we
                        want those 100,000 people?"
pm_question:            which of KNOW / USE / WORK / BUILD it answers (name at least one)
originality:            what makes this not a generic recycled take
payoff:                 the specific, compelling thing the viewer walks away with
brand_value:            does this compound the brand long term, or is it a one off
worth_producing:        pass/fail, is this worth real production time against alternatives
gate_result:            PASS / REJECT / REFRAME
episode_status:         NOT_PRODUCED / PRODUCED (episodes/{slug}/, + schedule/publish state)
                        / BLOCKED (<specific reason, e.g. needs user-provided assets>)
```

Only concepts with `gate_result: PASS` (directly, or after a REFRAME that then passes) proceed
past the gate into research and scripting.

**Why `episode_status` is a separate structured field, not inferred from `next_action` prose**:
added 2026-08-11 after a real gap surfaced -- the automated daily pipeline (see
`automation/daily_pipeline_prompt.md`) needs an unambiguous per-concept signal for "already
made, don't redo this," and free-text `next_action` isn't reliably parseable for that,
especially since a concept's display name and its `episodes/` folder slug can diverge (this
happened for real: "What AI Is Actually Doing to PM Hiring" renamed from its original working
title, but the folder stayed `episodes/the-ai-pm-pay-gap/`, the pre-rename slug). Matching by
name alone would have missed it and risked a duplicate production run. `episode_status` always
names the real folder path directly so there's no matching-by-title guesswork.

### Analytics capture note

**Corrected 2026-08-10** after actually calling the API against real published posts (sd1),
not just reading docs: the initial investigation understated what's available. Real, verified
fields per post via `GET /v1/analytics?postId=...` (`automation/fetch_zernio_analytics.py`):

- **Instagram**: impressions, reach, likes, comments, shares, saves, clicks, views, and
  (confirmed present, contrary to the earlier claim) **`follows`** and Instagram-specific
  average watch time (`igReelsAvgWatchTime` in ms, `igReelsVideoViewTotalTime`,
  `videoDurationSeconds`), all directly attributable to one post.
- **YouTube**: impressions/reach/likes/comments/shares/saves/clicks/views/follows come back in
  the same schema, but were all 0 on the one real post tested, unclear yet whether YouTube
  populates these the same way Instagram does or whether they're placeholders on this
  endpoint for that platform. A **separate** endpoint,
  `GET /v1/analytics/youtube/video-retention` (`automation/fetch_zernio_analytics.py
  --youtube-retention`), returns a real audience-retention curve (up to 100 points across the
  video timeline), confirmed working (`hasAnalyticsScope: true`) but empty on a low-view video,
  YouTube needs enough views plus its own 2-3 day analytics-processing delay before the curve
  populates. A literal "3-second hold rate" isn't a single named field anywhere, but is
  derivable from this curve's early points once it has data.

**Still genuinely unclear, re-verify once the Karpathy post has real traffic**: whether
YouTube's `follows`/watch-time fields on the main endpoint ever populate for real, or whether
YouTube's follow/watch-quality signal only ever comes through the retention-curve endpoint.
Populate `results:` with whatever `fetch_zernio_analytics.py` returns automatically, and only
fall back to manual capture from a platform's native Insights/Studio UI for whatever the script
still can't get once real data exists. Note in `results:` which numbers came from which source.

---

## Batch template (copy for each new batch, delete this comment line)

```
## Batch {N}

batch_id: BATCH-{NNN}
date_started:
pillar:
series:
hypothesis:
target_audience:
concepts:
  - concept:
    pillar_fit:
    audience_fit:
    100k_test:
    pm_question:
    originality:
    payoff:
    brand_value:
    worth_producing:
    gate_result:
    episode_status: NOT_PRODUCED
success_metrics:
status: PLANNED
results:
learning:
decision:
next_action:
```

Notes: (free text once the batch is underway)

---

## Batches

"The Karpathy Skill" predates this system (see `CLAUDE.md`'s legacy/transition note) and is
not retroactively assigned a batch, though its eventual real-world performance is worth
recording here once available as an informal baseline data point for comparison against
Batch 1 below.

## Batch 1

```
batch_id: BATCH-001
date_started: 2026-08-10
pillar: AI PM + Build in Public (two concepts, deliberately different formats)
series: none
hypothesis: First-hand build-in-public content and researched AI-PM authority content pull
  different quality-follower rates. Neither format is assumed better going in; this batch
  establishes the first real baseline for both under v2.0.
target_audience: Primary (PMs and aspiring PMs becoming AI-native)
concepts:
  - concept: "What AI Is Actually Doing to PM Hiring" (originally "The AI PM pay gap is real:
      $245K vs $123K", RENAMED after a correction, see below)
    pillar_fit: PASS, AI PM / authority
    audience_fit: PASS, direct career-stakes relevance to the primary audience
    100k_test: PASS, this is exactly the audience worth having
    pm_question: KNOW
    originality: real, source-verified 2026 data: senior AI-PM hiring +34% vs junior/mid
      -12% over the same period, 61% of senior PM postings now require AI fluency (up from
      23% in 2024), 85% of leadership investing in AI tools vs only 2% in PM talent
      development
    payoff: viewer learns the actual stakes of not becoming AI-native, with real numbers to
      anchor it
    brand_value: high, this is close to the channel's core premise stated as a fact
    worth_producing: PASS
    gate_result: PASS (see correction note)
    sources: https://www.institutepm.com/knowledge-hub/ai-reshaping-pm-role-2026 (BCG's 2026
      workforce report), https://www.productboard.com/blog/ai-in-product-management-cpo-mandates-missteps/
    correction_2026-08-10: the original concept's headline claim ($245K AI-native PM comp
      vs $123K traditional) was bundled by a research agent alongside two real, sourced
      stats. Direct user feedback on thin visuals prompted a source re-check, which found
      the compensation figures don't appear on either cited source or any other real
      citation, only plausible-sounding. Dropped entirely and the episode rebuilt around the
      three stats above, all independently re-verified against primary sources. See
      `CLAUDE.md` for the full incident note. Lesson: verify a research pass's specific
      numbers against the primary source directly before scripting, a citation bundle isn't
      proof every number in it is real.
    episode_status: PRODUCED (episodes/the-ai-pm-pay-gap/ -- NOTE: folder slug predates the
      concept rename above, do not match by title). Scheduled via Zernio for 2026-08-11
      17:00 IST (Instagram + YouTube). Do NOT reproduce this concept.
  - concept: "I built an AI tool because bug priority is political, not factual" (SenseBug AI)
    pillar_fit: PASS, Build in Public / differentiation
    audience_fit: PASS, every PM has lived the "whoever escalates loudest wins" problem
    100k_test: PASS
    pm_question: BUILD, and KNOW (the politics-not-facts framing is a usable mental model
      even for a viewer who never touches the tool)
    originality: first-hand founder story (solo-built, shipped V1 in under a month, Next.js
      14 + Supabase + Claude), not a researched piece
    payoff: a real, validated problem framing plus a real shipped tool
    brand_value: high, this is the Build-in-Public pillar's exact purpose
    worth_producing: PASS
    gate_result: PASS
    sources: user-provided (resume / first-hand account, 2026-08-10)
    episode_status: BLOCKED (needs real screenshots + the specific trigger story from the
      user before scripting can start -- do not attempt to research or invent these details)
success_metrics: follows per 1,000 views (primary, comparing the two concepts against each
  other), saves and comments (secondary), per spec §9
status: IN_PRODUCTION
results:
learning:
decision:
next_action: "What AI Is Actually Doing to PM Hiring" produced, rebuilt, and scheduled
  2026-08-10 (episodes/the-ai-pm-pay-gap/) -- Instagram + YouTube via Zernio, live
  2026-08-11 17:00 IST. Once confirmed published, pull analytics and log results: below;
  status moves to EVALUATING once both this and the-karpathy-skill (informal baseline)
  have real traffic. SenseBug AI concept still needs real details from the user
  (screenshots, the specific trigger story) before scripting.
```

Notes: Reserve candidates from the same research pass, held for Batch 2 rather than crowding
this one: "Why ChatGPT Pulse actually died" (AI PM teardown, real but drop or re-verify the
64.4% interruption-accuracy stat before scripting, the launch/shutdown dates and 96%
search-decline number are independently corroborated and solid as-is), "I installed 65 PM
skills into Claude" (AI Workflows, real verified repo, needs an actual on-screen demo not just
narration) — **used to open Batch 2 below, 2026-08-11**, "Claude Cowork for PM workflows" (AI
Workflows, first-hand angle available since the user already runs this channel's own pipeline
through Cowork) — **checked 2026-08-11 by the daily pipeline run and found NOT verifiable**:
nothing in this project's actual production pipeline (CLAUDE.md §2, the daily
`run_daily_pipeline.ps1` -> headless `claude -p` flow) uses Claude Cowork, so the reserve
note's first-hand premise doesn't hold; still viable as a concept if reframed as a
non-first-hand tool spotlight, or dropped if that framing is judged too generic, GigOS
reframed around the AI-assisted solo build rather than the product itself (Build in Public,
weaker AI-native fit than SenseBug AI). Full research trail and sourcing in this session's
history.

---

## Batch 2

```
batch_id: BATCH-002
date_started: 2026-08-11
pillar: AI Workflows & Tools
series: none
hypothesis: Real, installable-tool spotlights (a specific repo, real install command, real
  numbers) generate stronger saves and follows-per-1000-views than researched authority
  content (Batch 1's AI PM pillar concept) or first-hand build-in-public content, since the
  payoff is something the viewer can act on immediately.
target_audience: Primary (PMs and aspiring PMs becoming AI-native, specifically those already
  using Claude day to day)
concepts:
  - concept: "Claude Just Got 68 Product Management Skills" (product-on-purpose/pm-skills
      plugin spotlight)
    pillar_fit: PASS, AI Workflows & Tools / acquisition via a real, installable tool
    audience_fit: PASS, directly useful to PMs who already use Claude
    100k_test: PASS, exactly the audience worth having
    pm_question: USE and WORK
    originality: leads with the repo's own stated problem (AI output quality anchored to a
      mediocre training-data average) and structural answer (a full product lifecycle of
      skills, not a prompt pack), not a generic tools listicle
    payoff: a specific, real, installable system with an exact install command
    brand_value: high, concrete AI-native-product-thinking example, product is the lens not
      just a tool ad
    worth_producing: PASS
    gate_result: PASS
    sources: https://github.com/product-on-purpose/pm-skills (README fetched directly via
      raw.githubusercontent.com 2026-08-11, not just a research-pass summary), GitHub API for
      star/fork counts
    episode_status: PRODUCED (episodes/claude-just-got-68-product-management-skills/, ready
      for scheduling)
success_metrics: follows per 1,000 views (primary, compared against Batch 1's two concepts
  once all three have real traffic), saves and comments (secondary), per spec §9
status: IN_PRODUCTION
results:
learning:
decision:
next_action: Episode produced 2026-08-11 by the unattended daily pipeline. Awaiting user
  review and go-ahead before scheduling via Zernio (per the standing rule: automation prepares/
  queues, a human approves the actual publish). Suggested post time proposed in the daily run's
  notification.
```

Notes: (batch opened by the unattended daily pipeline run, 2026-08-11)
