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
pillar:                 which of the 3 pillars (spec §3): tools / navigate / how-it-works
                        (added 2026-08-14 — tag every concept explicitly, don't infer it)
pillar_fit:             pass/fail, one line why
audience_fit:           pass/fail, one line why
100k_test:              pass/fail against the 100K test: "if this gets 100,000 views, do we
                        want those 100,000 people?"
pm_question:            which of KNOW / USE / WORK / BUILD / NAVIGATE it answers (name at
                        least one — NAVIGATE added 2026-08-14 for the "Navigating the AI Era"
                        pillar, spec §2 item 5; score pillar-2 concepts against NAVIGATE, not
                        a forced KNOW/USE/WORK/BUILD fit)
emotional_register:     required for pillar: navigate concepts only (spec §3's vocabulary) —
                        fear / hope / awe / curiosity / anger / recognition / inspiration.
                        Note which register and vary it across concepts, don't default to one.
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

## Pillar Experiment: 3×10 test (opened 2026-08-14)

**This is a pillar-LEVEL experiment, one level above the concept-level batches below.** See
`docs/thataipm_content_system_operating_spec_v2.md` §3/§8 for the full rationale and structure.
Three content territories, tested head to head at equal weight, 10 videos each (30 total),
before committing weight to any one of them:

1. **AI Tools & Agent Spotlights** — unchanged pillar, the known-working baseline.
2. **Navigating the AI Era** — new pillar. First-person, in-progress documentation of what AI
   means for one person's own work/career/money/ambition. Absorbs the old Build-in-Public and
   Opinions & Trends pillars as distinct registers (see spec §3's emotional hook vocabulary),
   not diluted into generic career content.
3. **How AI Systems Actually Work** — unchanged pillar.

**Trigger**: real retention data on published content reading flat/generic, plus a founder
read that the tool-spotlight/automation-building lane has gotten crowded and stopped
differentiating on its own (see spec §0's 2026-08-14 revision note).

**Already-shipped episodes do not retroactively count** toward the 10-per-pillar counts below
— book-to-skill, pm-skills, the-karpathy-skill, and hyperframes-had-the-components-i-hand-built
are real prior tool-spotlight evidence, just not part of this specific count, which starts
fresh from 2026-08-14 (same practice as treating the-karpathy-skill itself as an informal,
uncounted baseline).

| Pillar | Published | Scheduled (not yet published) | Remaining | Follows/1,000 views | Saves (agg.) | Status |
|---|---|---|---|---|---|---|
| AI Tools & Agent Spotlights | 0 | 1 | 9 | — | — | IN_PROGRESS |
| Navigating the AI Era | 0 | 2 | 8 | — | — | IN_PROGRESS |
| How AI Systems Actually Work | 0 | 2 | 8 | — | — | IN_PROGRESS |

**Real per-episode pillar tagging (checked against `episodes/scheduled/*.md` and git history,
2026-08-15)** — none of these are confirmed `published` by Zernio yet, all are `scheduled`
(or, for the newest one, not yet scheduled at all):

- `hyperframes-what-skills-matter` ("What Skills Matter When Intelligence Gets Cheap?"),
  2026-08-14 → **Navigating the AI Era** (career/skills-implications framing).
- `hyperframes-what-is-mcp` ("MCP: The Standard That Lets AI Actually Touch Your Tools and
  Data"), 2026-08-14 → **How AI Systems Actually Work** (technical protocol explainer).
- `continuous-claude-v3`, 2026-08-15 → **AI Tools & Agent Spotlights** (tool spotlight).
- `5-ways-to-make-money-with-ai`, scheduled 2026-08-16T09:00 Asia/Kolkata → **Navigating the
  AI Era**, direct instruction. Scheduled for real via Zernio (IG post
  `6a80ac7bb078353c96fa12d3`, YouTube post `6a80ac7bb078353c96fa1318`), verified via
  `GET /v1/posts?status=scheduled`. See `episodes/scheduled/5-ways-to-make-money-with-ai.md`.
- `claude-code-auto-memory` ("Claude Code Has Real Memory Now"), scheduled 2026-08-20T10:00
  Asia/Kolkata → **How AI Systems Actually Work** (real mechanism explainer, same register as
  `hyperframes-what-is-mcp`). Scheduled for real via Zernio (IG post
  `6a86035b3a904242ba1fa546`, YouTube post `6a86035c3a904242ba1fa594`), verified via
  `GET /v1/posts?status=scheduled`. See `episodes/scheduled/claude-code-auto-memory.md`.

**Decision gate**: once a pillar has enough real traffic to read signal (spec §9's metrics),
apply spec §10's batch decision rule AT THE PILLAR LEVEL — KEEP/SCALE the pillar(s) with real
audience-quality signal, MODIFY a pillar whose hook/format looks like the actual problem rather
than its core premise, KILL only with genuinely sufficient evidence, not one or two weak posts.
Update the table above as each video publishes; log the final decision here once all three
pillars have enough data to compare.

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

**Positioning revised 2026-08-12** (see `CLAUDE.md` §7 and
`docs/thataipm_content_system_operating_spec_v2.md`'s §0 revision note): the spec's core
positioning shifted from PM-education to building real AI automation systems in public.
Batches 1-2 below were run under the original PM-specific positioning and stay on the record
as real data, not discarded or retroactively reclassified. One concrete read worth noting: the
karpathy-skill legacy episode (automation/tooling-flavored) meaningfully outperformed
Batch 1's the-ai-pm-pay-gap concept (PM-hiring-stats-flavored) on engagement, retention, and
saves, an early signal consistent with the revised positioning, though far short of real
evidence on three posts with zero follows anywhere. Batch 1's "What AI Is Actually Doing to PM
Hiring" concept is now off-direction under the revised positioning, do not reproduce that
angle; Batch 2's pm-skills concept (a real installable-tool spotlight) already fits the revised
positioning fine without any reframing. Future batches should be scoped against the revised
pillars in the spec doc's §3.

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
      17:00 IST (Instagram + YouTube); YouTube confirmed published 2026-08-11, Instagram was
      still mid-fire at last check (same slot). Do NOT reproduce this concept.
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
  2026-08-10 (episodes/the-ai-pm-pay-gap/) -- YouTube confirmed published 2026-08-11 17:00
  IST, Instagram mid-fire at last check. Once both platforms confirm published, pull
  analytics and log results: below; status moves to EVALUATING once this, the-karpathy-skill,
  and Batch 2's pm-skills concept all have real traffic. SenseBug AI concept still needs real
  details from the user (screenshots, the specific trigger story) before scripting.
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
    episode_status: PRODUCED (episodes/claude-just-got-68-product-management-skills/).
      Scheduled via Zernio for 2026-08-12 19:00 IST (Instagram + YouTube).
success_metrics: follows per 1,000 views (primary, compared against Batch 1's two concepts
  once all three have real traffic), saves and comments (secondary), per spec §9
status: IN_PRODUCTION
results:
learning:
decision:
next_action: Episode produced 2026-08-11 by the unattended daily pipeline (killed mid-render,
  finished in a live session -- see the episode's own script.md "Revision 1" for the
  hook/static-frame/pace fixes applied after review). Scheduled 2026-08-11 for 2026-08-12
  19:00 IST. Once confirmed published, pull analytics and log results below.
```

Notes: (batch opened by the unattended daily pipeline run, 2026-08-11)

## Batch 3

```
batch_id: BATCH-003
date_started: 2026-08-13
pillar: AI Tools & Agent Spotlights
series: none
hypothesis: A currently-trending, verified-real installable tool spotlight (not researched
  from a stale bank, actually checked against live GitHub data the same session it's produced)
  performs at least as well as Batch 2's pm-skills concept on saves/follows-per-1000-views,
  now under the revised v2.0 positioning (building-in-public lens, not PM-education framing).
target_audience: Builders already using Claude Code day to day, who want a real installable
  tool with a concrete payoff, not a generic AI-news roundup
concepts:
  - concept: "book-to-skill: Turn Any Technical Book Into a Claude Code Skill"
    pillar_fit: PASS, real installable Claude Code skill, exact install command
    audience_fit: PASS, directly useful to anyone feeding reference material to an agent
    100k_test: PASS, broad builder audience worth having
    pm_question: USE (install and run it) and WORK (the map-reduce/two-tier skill-generation
      mechanics -- why a 400-page book compresses to a few thousand tokens)
    originality: leads with the real mechanical problem (dumping a whole book into context vs.
      a compact on-demand skill) and a real measured number, not a generic "cool tool" listicle
    payoff: a specific, real, installable tool with an exact install command and a concrete,
      source-verified stat
    brand_value: ties into this channel's own real context-cost problem (documented in
      hyperframes/CLAUDE.md's orchestration-discipline section), a genuine callback, not a
      forced connection
    worth_producing: PASS
    gate_result: PASS
    sources: https://github.com/virgiliojr94/book-to-skill (README fetched directly via
      raw.githubusercontent.com 2026-08-13, not just a search-result summary), GitHub API for
      stars/forks/dates (20,978 stars, 2,212 forks, created 2026-05-01, pushed 2026-08-12,
      MIT license, checked live 2026-08-13, not reused from a prior session)
    episode_status: NOT_PRODUCED
success_metrics: follows per 1,000 views (primary, compared against Batch 2's pm-skills
  concept once both have real traffic under the same v2.0 positioning), saves and comments
  (secondary), per spec §9
status: PLANNED
results:
learning:
decision:
next_action: Topic confirmed by user 2026-08-13. Proceeding to production via the
  faceless-explainer HyperFrames workflow.
```

Notes: topic surfaced via live web research (GitHub trending signals, not a pre-banked idea),
cross-checked against 2-3 other real trending candidates (claude-video-vision, oh-my-pi,
n8n-flavored tools) before the user confirmed this one, per the spec's human-owns-topic-
approval boundary.

## Batch 4

```
batch_id: BATCH-004
date_started: 2026-08-14
pillar: How AI Systems Actually Work
series: none
hypothesis: The first video in this pillar's 3x10 pillar experiment (0/10 published as of
  2026-08-14) -- a mechanically accurate, primary-source-verified explainer of a real, current
  AI infrastructure standard (MCP) -- establishes a real baseline for this pillar's
  follows/1,000-views against the other two pillars, none of which have published yet either.
target_audience: Curious builders and general AI-interested viewers who want to understand a
  system they've heard the name of but not the mechanism -- zero assumed technical background,
  per this channel's original channel-brief audience definition (still valid craft rule).
concepts:
  - concept: "MCP: the USB-C standard for AI (host/client/server, tools/list -> tools/call, and
    how one company's protocol became an industry standard co-governed by its former
    competitors in about a year)"
    pillar: how-it-works
    pillar_fit: PASS -- direct fit, this pillar's entire mandate is mechanism-first explainers
    audience_fit: PASS -- MCP is now genuinely relevant (broad ecosystem adoption, real
      builder relevance) but under-explained mechanically for a general audience
    100k_test: PASS -- 100K viewers who now understand what MCP actually does is exactly this
      pillar's target audience, not a mismatch
    pm_question: KNOW (what MCP is and how the request/response mechanism actually works)
    originality: leads with Anthropic's own "USB-C for AI" analogy (real, from the primary
      source, not invented) but earns it by then showing the real host/client/server mechanism
      and the tools/list -> tools/call exchange, not just repeating the metaphor; closes on a
      verified, compelling adoption-timeline arc most explainers of MCP skip
    payoff: viewer understands the actual mechanism (not just "it connects AI to tools") and
      leaves with one real, checkable governance fact (Anthropic donated MCP to a neutral
      foundation co-founded with OpenAI, Dec 2025) that most surface-level MCP content omits
    brand_value: this pillar's first real entry -- sets the mechanical-accuracy bar the other
      9 videos in this pillar get measured against
    worth_producing: PASS
    gate_result: PASS
    sources: all fetched directly this session, not from memory or aggregator summaries --
      https://www.anthropic.com/news/model-context-protocol (announcement, Nov 25 2024,
      creators David Soria Parra & Justin Spahr-Summers, early adopters Block/Apollo),
      https://modelcontextprotocol.io/introduction and
      https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture (host/client/server
      architecture, JSON-RPC 2.0 data layer, tools/resources/prompts primitives, the
      tools/list -> tools/call example flow), and
      https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
      (Dec 9 2025 donation to the Agentic AI Foundation under the Linux Foundation, co-founded
      by Anthropic/Block/OpenAI, supported by Google/Microsoft/AWS/Cloudflare/Bloomberg).
      OpenAI's March 2025 and Google DeepMind's April 2025 adoption dates corroborated across
      multiple independent secondary sources (not a single aggregator), flagged in the script
      as slightly less rigorously sourced than the three primary-source facts above.
    episode_status: SCHEDULED (episodes/hyperframes-what-is-mcp/build/hyperframes-what-is-mcp.mp4,
      66.83s post-speedup -- Instagram + YouTube scheduled via Zernio for 2026-08-14T17:00:00
      Asia/Kolkata, see episodes/scheduled/hyperframes-what-is-mcp.md; LinkedIn caption drafted,
      posted manually per standing convention)
success_metrics: follows per 1,000 views (primary, this pillar's own baseline -- nothing to
  compare against yet since this is the pillar's first video), saves and comments (secondary),
  per spec §9
status: IN_PRODUCTION
results:
learning: Real single-take VO ran 76.56s against a 53.4s word-count estimate (2.9wps
  heuristic) -- the natural pauses around dates/emphasis in a fact-dense script (frame 4's
  adoption timeline alone ran 20.4s) blow past the linter's estimate more than a typical
  narrative script does. Worth a wider target range for date/stat-heavy scripts specifically.
  Also: this episode was the first real test of /thataipm-registry-check's mechanical gate --
  found 2 real registry matches (constellation-hub, terminal-simulator) and confirmed 3 genuine
  gaps (logged in docs/hyperframes_production_notes.md), and separately surfaced two new
  static-gap-checker blind spots (GSAP repeat/yoyo duration under-counted; cross-file
  sub-composition timelines invisible to the checker) beyond the already-known loop-var one.
decision:
next_action: Rendered, then revised three times on direct feedback: (1) all 5 frames'
  background swapped from near-black (#0b0d12) to pure #000000, accents kept colorful; (2) a
  real animated line chart (mk-line-graph, a second registry block) added as a silent proof
  beat appended to Frame 4 (24.0s, up from the real VO length 20.439s) -- three live-verified
  MCP server counts (100 launch/19,831 Mar 2026/72,300 today, glama.ai/mcp/servers, fetched
  live this session) plotted as a real draw-on chart, not asserted in text, after direct
  feedback that the video had "no animated graphs or motion graphics"; a real content-overlap
  bug this introduced (the chart's new position collided with the foundation badge) was caught
  by hyperframes check and fixed by clearing the earlier timeline content before the chart
  takes that screen region, not by silencing the check; (3) whoosh SFX added at every frame
  transition (previously only used for in-frame emphasis). Total on-screen duration now 80.06s
  (76.56s real VO + 3.5s silent chart beat). Final render sped up 1.2x via ffmpeg (video
  setpts + audio atempo together) -- 80.12s down to 66.83s, delivered as
  renders/video_rushed.mp4, audio re-verified after speed-up (-20.1dB mean, -0.6dB max).
  Awaiting user review before /thataipm-distribute (cover, platform captions, Zernio
  scheduling) -- note the cover-still timestamp and STORYBOARD.md's timing notes reference the
  pre-speedup cut if distribution proceeds from here.

  (4) Critical bug caught by the user after the third render: "From 14 sec to 22 sec there are
  no visuals at all" (Frame 2, the host/client/server architecture beat). Root cause, confirmed
  by reading compositions/frames/02-architecture.html directly rather than guessing: Frame 2
  mounted constellation-hub via data-composition-src, the mounting mechanism for a registry
  BLOCK (a standalone sub-composition with its own timeline). constellation-hub is registry-
  classified as a COMPONENT (confirmed from the original `hyperframes add` install output:
  "(hyperframes:component)") -- components have no standalone timeline and must be pasted
  directly into the host composition's HTML/CSS/JS and merged onto the host's own GSAP
  timeline (see ~/.claude/skills/hyperframes-registry/references/wiring-components.md).
  Mounted the wrong way, it silently renders nothing -- no error from `hyperframes check`
  (Layout passed clean), no error from check_registry_usage.mjs (only checks the file exists,
  not that it's wired correctly), and the earlier snapshot review also missed it. Only caught
  by extracting real frames from the delivered MP4 with ffmpeg and looking at the actual
  pixels. Frame 3's terminal-simulator (also a component) was unaffected -- it was pasted in
  correctly from the start, confirmed by the same frame-extraction method.

  Fix: rewrote Frame 2 to paste constellation-hub's markup/CSS/JS directly into its own
  composition, hardcoding the values that would have been getVariables() reads (hub_label "AI
  App", nodes Filesystem/Database/Slack, cues 10.11/11.21/12.13 synced to real word timing,
  accent blue) and merging its GSAP calls onto Frame 2's own `tl`. While in there, also
  unrolled two other real static-gap-checker blind spots into explicit literal-time tweens
  instead of leaning on the documented exception: a forEach loop using a loop variable as the
  tween position (unresolvable to the checker), and a yoyo/repeat tween whose real duration
  the checker's regex undercounts (does not multiply by repeat+1) -- both in Frame 2's own new
  code and, for consistency and real certainty rather than assumed correctness, in Frame 5's
  pre-existing chip-entrance and follow-pulse loops too. Frame 4's chart still trips the
  checker's one remaining known blind spot (cross-file sub-composition timelines are invisible
  to it) -- that one was left as a documented skip since mk-line-graph is a confirmed genuine
  block, not a component, and was re-verified correct by direct frame extraction after this
  render, not assumed from the earlier snapshot review alone. Re-rendered, re-sped-up
  (renders/video_rushed.mp4, 80.1s -> 66.83s, audio -20.1dB mean/-0.1dB max), and every claim
  above re-checked against real extracted frames (t=12/15/17/18/19/20/21s and t=52/55s on the
  sped-up cut) before delivery, not asserted from the code alone.
```

Notes: this is the first video in the "How AI Systems Actually Work" pillar under the
2026-08-14 pillar experiment (spec §3/§8) -- 0/10 published in this pillar before this batch.
Topic assigned directly by the user, not sourced from a candidate list this session; the
Quality Gate above was still run in full against the assigned topic rather than skipped, per
the spec's own requirement that every concept carries this block before production starts.

## Batch 5

```
batch_id: BATCH-005
date_started: 2026-08-14
pillar: AI Tools & Agent Spotlights
series: none
hypothesis: First test of the new registry-first visual template acquired 2026-08-14 from a
  real competitor reference video (see docs/hyperframes_production_notes.md's "Tools & Skills
  episode format" section) -- browser-device-stage, caption-kinetic-slam,
  caption-editorial-emphasis, simulated-cursor, press-ripple, whip-pan-cut. Also the first
  episode produced under the newly-tightened per-frame registry hard rule and the locked
  7-beat creator-voice script structure, both same-day additions.
target_audience: Claude Code / AI-agent users already burning real token budget, who want a
  concrete, verified fix rather than a vague "use fewer tokens" tip.
concepts:
  - concept: "Caveman: the 98k-star Claude Code skill that makes agents answer in caveman-speak
    to cut real, benchmarked token usage, then goes further with an input-side proxy layer"
    pillar: tool-spotlight
    pillar_fit: PASS -- direct fit, a real, currently-trending tool with a concrete before/after
    audience_fit: PASS -- token cost is a live, named concern (user's own: "token usage is going
      alot"), not a hypothetical pain point
    100k_test: PASS -- 100K viewers who install a tool that measurably cuts their own AI costs
      is a strong, self-interested payoff, not just curiosity
    pm_question: DO (install and use a specific tool to cut a specific, measurable cost)
    originality: leads with the tool's own real before/after example (69 -> 19 tokens) rather
      than a generic "it saves tokens" claim, and includes the escalation beat (input-side
      proxy, 33.2% fewer input tokens, 54-run benchmark) most surface coverage of this tool
      skips; also self-referential -- this channel installed and is using the tool itself,
      not narrating a tool it never touched
    payoff: viewer gets one real, installable fix for a cost problem they likely already have,
      plus two distinct verified numbers (65% output-token cut per the tool's own 10-task
      benchmark; 33.2% input-token cut per its own 54-run proxy benchmark) instead of one
      vague stat
    brand_value: first real test of the new visual template and the new voice structure
      together -- the result is the actual baseline for whether both hold up outside the
      episode that established them
    worth_producing: PASS
    gate_result: PASS
    sources: fetched directly this session, not from memory or a search snippet alone --
      https://api.github.com/repos/JuliusBrussee/caveman (real star count, 98,135 at fetch
      time) and https://raw.githubusercontent.com/JuliusBrussee/caveman/main/README.md (the
      69/19 token example, the 10-task benchmark table averaging 65% output-token savings,
      the 54-run Proxy benchmark at 33.2% fewer input tokens passing all 18 exact-answer
      checks). Note: GitHub's own search-result description snippet for this repo claimed
      "cuts 65% of tokens" as a blanket figure -- the actual README states 65% is an
      OUTPUT-token benchmark average specifically, with its own "honest number warning" that
      whole-session savings run smaller; the script keeps this distinction (says "response,"
      not "session" or "total") rather than repeating the flattened search-snippet framing.
    episode_status: PRODUCED (hyperframes-the-caveman-skill/renders/video_rushed.mp4, 72.93s
      post-speedup, rendered 2026-08-14 -- not yet in episodes/ or distributed, awaiting user
      review)
success_metrics: follows per 1,000 views (primary), saves and comments (secondary), per spec §9
status: IN_PRODUCTION
results:
learning: First full build under both the tightened per-frame registry hard rule and the new
  7-beat voice, together. Two real integration bugs caught by direct frame extraction (not by
  any mechanical check) after the first render: (1) terminal-simulator's markup was pasted into
  Frame 2 without its own <style> block, so the whole terminal rendered invisible except a
  custom-added blinking cursor floating with no visible container -- fixed by pasting the
  component's CSS, which had simply been forgotten, not a wiring-method error this time. (2)
  caption-editorial-emphasis's text in Frame 4 was positioned inside the standard caption
  band's real screen area, producing visible duplicate text (the custom caption and the
  standard word-by-word caption showing the same phrase in the same region at once) -- fixed by
  moving it well clear of the band.

  Second, more serious round after user feedback ("Very bad, you broke so many rules... I am
  hating this now"): the first delivered render had zero SFX (nothing in the pipeline gated
  this -- fixed by adding a real sfx-presence check to thataipm-assemble's pipeline.mjs), no
  1.2x post-render speed-up (established convention from hyperframes-what-is-mcp, simply not
  applied), and long real-screenshot holds built as "settle in, then a barely-visible camera
  drift" -- this passed check_static_gaps.mjs and a ~15-timestamp spot-check cleanly but read
  as static to an actual viewer. A dense self-review (a real frame every 2s across the FULL
  render, not hand-picked moments) confirmed it immediately. Fixed by replacing every hand-
  rolled drift with the registry's own `yt-camera-move` component (ytCameraMove/ytCameraReset/
  ytDefocusPulse helpers) for genuine punch-ins and crop-cuts to different real details, per
  direct instruction to use registry components rather than hand-coded motion. Full writeup in
  docs/hyperframes_production_notes.md's "settle and hold with a subtle drift" durable pitfall.
  Third round, escalated user feedback ("use fucking distinct visuals from hyperframes...
  I will destroy this pipeline if you don't get it this time"): the yt-camera-move fix solved
  motion but not the real complaint -- every real-screenshot frame still used the same
  `browser-device-stage` component, only re-cropped/zoomed differently. Same failure class as
  [[feedback_vary_composition_not_just_motion]], one level up (device TYPE repetition, not
  position/motion repetition). Fixed by searching the registry for genuinely different devices
  per frame: Frame 2 swapped to `before-after-wipe` (real wipe-reveal comparing the actual
  quoted 69-token vs 19-token text); Frame 3 attempted the registry's `data-chart` block first
  (mounted correctly, real data substituted, three real fix attempts for a
  `sub_timeline_readiness_timeout` blank-render bug) but it stayed genuinely broken across 4
  verified re-renders, so the same bar-chart visual was hand-built directly in the frame's own
  file instead -- logged as a legitimate hard-rule exception, not a shortcut, in
  docs/hyperframes_production_notes.md. Final static-gap-checker finding on the hand-built
  chart (a 5.18s-10.20s bridging beat with position-arg unroll issues) required unrolling all
  20 bar/value tweens into literal per-call timeline entries before the checker could verify
  coverage, plus a mid-hold pulse tween to close the last gap.
decision:
next_action: Full pipeline passed clean on the final round (static-gap check zero real gaps
  outside the one already-accepted yt-camera-move blind spot on Frame 4, registry usage check
  with every frame accounted for, hyperframes check, render, 1.2x speedup, audio sanity, sfx-
  presence gate). Every claimed visual verified by direct ffmpeg frame extraction across three
  full passes now -- an initial spot-check (caught 2 integration bugs), a dense every-2s pass
  after round two (caught the same-device-type problem itself, since a "not static" render can
  still look repetitive), and a final dense every-2s pass across the full 73s runtime after the
  device-variety fix (confirmed all 5 frames now use genuinely distinct devices, chart renders
  correctly, no static holds, two apparent caption "glitches" investigated frame-by-frame and
  confirmed to be normal karaoke-caption crossfades, not bugs). Delivered to user via
  SendUserFile 2026-08-14; awaiting review before proceeding to /thataipm-distribute.
```

Notes: topic approved directly by the user in this session, following on from the reference-style
acquisition work earlier in the same day. The `caveman` skill was also installed into this
project itself via Claude Code's own plugin manager (`claude plugin marketplace add
JuliusBrussee/caveman && claude plugin install caveman@caveman`), per direct request -- separate
from, but the reason for, this episode.
