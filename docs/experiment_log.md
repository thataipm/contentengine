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
```

Only concepts with `gate_result: PASS` (directly, or after a REFRAME that then passes) proceed
past the gate into research and scripting.

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

No batch has been opened yet. The first batch opens once topic selection begins for the first
episode produced under v2.0. "The Karpathy Skill" predates this system (see `CLAUDE.md`'s
legacy/transition note) and is not retroactively assigned a batch, though its eventual
real-world performance is worth recording here once available as an informal baseline data
point for comparison against the first true v2.0 batch.
