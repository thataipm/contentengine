# That AI PM: Content System Operating Spec

**Version 2.0 | Approved 2026-08-10 | Migrated into the repo as the canonical source of truth**
**Revised 2026-08-12**: positioning shifted from PM-education to AI-automation-building. See
§0's revision note for the full context. Kept as v2.0 (same file, same version number) per
explicit instruction not to fork a new document for this; the file's content is what changed,
not its identity in the repo.
**Revised again 2026-08-14**: replaced the single automation-building positioning with a
formal 3-pillar experiment testing three distinct content territories head-to-head before
committing weight to any one of them. Driven by real retention data reading flat/generic
("every other person is making videos like us") plus a founder-conviction read that the
automation-building/tool-spotlight space is now crowded and under-differentiated. See §0's
2026-08-14 revision note and the new §3 for the full structure. Still v2.0, same file, same
"edit in place" convention as the prior revision.

This is the source of truth for the automated content system. It translates the That AI PM
business strategy into rules the production pipeline follows. It **supersedes** the previous
2-pillar strategy (60% Trending Claude Code Skills / 40% Best AI Tools). See `CLAUDE.md` for
the retirement note and migration history.

## 0. Non-negotiable north star

> That AI PM shows real AI automation systems being built, in public: agents, workflows, and
> tools, demonstrated as they're actually made, not explained from theory.

Core positioning: **building real AI automation, in public**.

**Revision note, 2026-08-14**: the single positioning above is now being tested AGAINST two
other territories, not simply superseded — see §3 for the full 3-pillar structure. Trigger:
real retention data on published content reading flat/generic, plus a direct read that the
automation-building/tool-spotlight lane has gotten crowded ("every other person is making
videos like us") and no longer differentiates on its own. The specific gap identified: the
current positioning is a **craft-appreciation** value prop (impressive to watch, useful to
steal from) — informational, third-person, about the CREATOR's system. It was missing an
**identity-and-stakes** value prop — content about the VIEWER's own career, income, and
relevance, which structurally pulls a stronger emotional reason to follow (this pattern holds
broadly: identity/stakes content outperforms craft/utility content almost everywhere it's been
tried, e.g. personal-finance-anxiety content vs. investing tutorials). That gap is now its own
pillar, "Navigating the AI Era" (§3) — not a wholesale positioning swap, since the crowding
argument applies specifically to tool-spotlight content, not to explainer or build content,
which is why this is a 3-way test rather than another full pivot. Explicit decision deferred to
real data per §3's test structure, not decided by founder conviction alone this time.

**Revision note, 2026-08-12**: this supersedes the original "AI-native product thinking"
positioning below, which held for two days (2026-08-10 to 2026-08-12) before a direct
conversation surfaced the actual driver: the founder isn't interested in being seen as a PM
educator, and the real asset is the automation system already being built for this channel's
own production (this repo's own Remotion/ElevenLabs/agentic pipeline), not PM domain expertise.
Two things converged, independent of each other: (1) founder conviction about identity and
where the market's attention actually is (AI agents/automation/workflows, not PM specifically),
and (2) the one real early data point available at the time (see `docs/experiment_log.md`
Batch comparisons) showed the-karpathy-skill, the most automation/tooling-flavored of the three
posts with real traffic, meaningfully outperforming the-ai-pm-pay-gap, the most PM-specific
one, on engagement, retention, and saves. Data alone would not have been sufficient
justification this early (three posts, zero follows anywhere, well inside the 90-day
no-fundamental-repositioning window §8 warns against), so this change is being made on
founder-conviction grounds primarily, with the data noted as consistent rather than
determinative. Original v2.0 text preserved via git history, not inline, per the instruction to
edit in place rather than fork documents.

The brand is NOT an AI news page, a generic AI-tools listicle page, a PM education page, or a
trend-chasing content farm. The distinction from generic "AI content" is authenticity, not
topic: every piece should trace back to something actually built or tested, not researched and
narrated secondhand.

## 1. Target audience

- **Primary**: people interested in AI agents, automation, and building with AI, technical or
  not, who want to see real systems built rather than read theory.
- **Secondary**: founders, product people, and developers exploring AI-assisted building.
  Product/PM background can still flavor how workflows and decisions get framed, it's no longer
  the admission price for the audience.

Audience quality matters more than raw reach. Prefer people likely to care about AI agents,
automation, workflows, and building, not just PM-specific viewers as before. Do not optimize
for viewers who only want generic free AI-tool lists. A smaller, highly relevant audience is
more valuable than a larger irrelevant audience.

## 2. Brand promise

Every content idea should answer at least one:

1. What should someone building with AI **know**?
2. What should someone building with AI **use**?
3. How does a real AI automation system actually **work**?
4. What does building an AI automation system actually look like to **build**?
5. **Added 2026-08-14, for the "Navigating the AI Era" pillar**: what does this mean for
   **my own** work, career, money, relevance, or ambition — the **navigate** question. None of
   KNOW/USE/WORK/BUILD above is about the viewer's own stakes; this is the one that is, and it's
   the pillar 2 concepts should be scored against, not a forced fit into the other four.

If an idea cannot pass at least one of these tests, reject it or reframe it.

## 3. Content hierarchy — 3-pillar experiment (2026-08-14)

**Replaces the prior 4-pillar weighted mix below.** Three content territories, tested head to
head at EQUAL weight, 10 videos each (30 total), before committing weight to any of them. This
is a pillar-LEVEL experiment, one level above the concept-level batches already tracked in
`docs/experiment_log.md` — see that file's new "Pillar Experiment" section for the live count
and the decision gate.

| Pillar | Target Share (test phase) | Strategic Job | Examples |
|---|---|---|---|
| AI Tools & Agent Spotlights | 33% (10 videos) | Acquisition | Claude Code; real installable skills/agents/plugins; n8n; practical workflow tools, not PM-gated. Unchanged from the prior structure — this pillar is not in question, it's the known-working baseline the other two are tested against. |
| Navigating the AI Era | 33% (10 videos) | Differentiation / emotional connection | See below — the new pillar. |
| How AI Systems Actually Work | 33% (10 videos) | Authority | Agents, automation, context windows, evaluation, explained generally, not PM-specific. Unchanged scope from the prior structure. |

**Already-shipped tool-spotlight episodes (book-to-skill, pm-skills, the-karpathy-skill,
hyperframes-had-the-components-i-hand-built) do not retroactively count toward the 10-per-pillar
test counts** — same practice as the karpathy-skill legacy episode's "informal baseline, not
counted in the batch" treatment. They're real prior evidence, just not part of this specific
count, which starts fresh from 2026-08-14.

### Pillar 2: Navigating the AI Era

**Core question**: "What can a person do differently with their life, career, work, and
ambitions now that AI exists?" Not "learn automation" as a subject — the real questions people
carry are personal and stakes-based: will my job still matter, what should I learn now, how do
I stay valuable, can I make more money with AI, what can I build now that wasn't possible
before, how much of my work should I hand to AI, how do I avoid falling behind.

**Posture (the actual differentiator, not the topic)**: first-person, in-progress, honestly
uncertain. "I'm figuring out how to navigate this transition myself, experimenting with AI,
building things, testing ideas, and sharing what I learn" — never "I have the answers." The
topic itself ("AI and your career") is crowded; this posture is not. Most existing content in
this space is confident-authority lecturing ("10 skills to future-proof your career"); this
pillar is honest-in-progress documentation instead, which is the same authenticity discipline
§0 already states as the brand's real differentiator, just applied to the creator's own life
and choices instead of only to a production pipeline.

**Build in Public: The System (the old pillar 1) folds in here, and stays DISTINCT, not
diluted.** This channel's own production system (real fixes, real decisions, real builds) is
this pillar's proof-of-work engine — it does not disappear or become generic career content.
Product/PM background can still flavor the perspective without being the niche.

**Emotional hook vocabulary (this pillar's actual creative engine)** — pick a register per
concept, don't default to the same one every time, the same "reach for a literal device before
another stat card" discipline the schema vocabulary (`hyperframes/frame.md`) already
establishes for visuals. Grow this list the same way, when a genuinely new register earns its
place:

| Register | What it does | Example hook |
|---|---|---|
| Fear | Names the real stake | "What if the career you spent 10 years building disappears?" |
| Hope | New possibility, individual leverage | "For the first time, one person can build something that used to require a company." |
| Awe | Witnessing real capability — **this is where Build-in-Public content lives** | "I gave one AI agent a goal. It built the workflow itself." |
| Curiosity | An open, provocative question | "What skills become more valuable when intelligence gets cheap?" |
| Anger | Names a real, specific wrong | "We're teaching people to use AI completely backwards." |
| Recognition | An unspoken truth the viewer already senses | "Everyone is learning AI tools. Almost nobody is learning when NOT to use them." |
| Inspiration | Permission, agency | "You don't need permission to build anymore." |

The old "Opinions & Trends" pillar (contrarian AI/automation takes) also folds into this
pillar — Anger and Recognition are largely what that pillar already was, just without a name
for the register.

## 4. Building-native rule

**Building is the lens, not a cage — now specifically for Pillar 1 and Pillar 2's
Awe/Hope/Inspiration registers.** Broad AI topics are allowed when they lead naturally into a
real build or workflow. Tool spotlights are an acquisition engine, not the brand identity. When
possible, ground a topic in something actually built or tested, not researched and narrated.
Prefer useful, opinionated, experience-based framing over generic lists.

**Example**:
- Weak: "5 Claude Code skills."
- Strong: "I automated my own content pipeline with these 5 Claude Code skills, here's what
  broke."

Do not overcorrect into a generic AI-news channel either. Reframed examples, adapted from the
original PM-specific framing logged 2026-08-10:
- Potentially strong: "I used Claude Code to automate my entire video production pipeline."
- Potentially strong: "Claude Code can now do this. Here's what I built with it."
- Potentially strong: "I gave an agent my actual production system. Here's what happened."

The goal is the intersection of AI, real building, and honest results, not a generic AI-tools
channel or a tutorial series.

## 5. The 100K test

Before approving an idea, ask: **"If this gets 100,000 views, do I want those 100,000
people?"** If the answer is no, change the topic, framing, or reject the idea.

## 6. Anti-drift rules

The system must NOT drift toward generic viral AI content:

- No generic AI news unless there is a clear automation/building implication.
- No random AI-tool listicles without a useful angle, comparison, workflow, or a real build
  behind it.
- No copying viral topics merely because they are viral.
- No broad productivity content unrelated to AI/automation work.
- No generic motivational content.
- No claims of expertise not supported by actual experience or reliable research.
- Do not sacrifice audience fit for raw view potential.
- Do not repeatedly publish the same idea with superficial wording changes.

## 7. Content experimentation system

Content is experimentation. The system should generate learning, not just volume.

```
HYPOTHESIS -> EXPERIMENT BATCH -> CONTENT -> DISTRIBUTION -> ANALYTICS
-> KEEP / MODIFY / KILL / SCALE -> NEXT BATCH
```

Example hypotheses:
- People want to see real automation systems built more than AI theory.
- Real tool/agent spotlights generate higher-quality followers than researched authority
  content.
- Build-in-public content creates stronger trust than either.
- Contrarian AI/automation opinions create more profile visits.
- Practical frameworks generate more saves than explanations.

See `docs/experiment_log.md` for the structured tracking template.

## 8. 90-day experiment

Commit to the positioning for 90 days. Do not fundamentally reposition the brand during this
period. Experiment freely with topics, hooks, formats, lengths, visual treatments, and content
ratios. Do not change the core audience or positioning because of a small number of weak
posts. Aim for roughly 60-90 pieces of content across the 90-day period, subject to quality.
Every batch must produce a decision and a learning.

**Revised 2026-08-12**: the 90-day clock restarts in spirit from this date, since the
positioning itself changed (§0). Batches 1-2 (2026-08-10/11, under the original PM-specific
positioning) stay on record as real data, not discarded, see `docs/experiment_log.md`.

**Superseded 2026-08-14 — the starting mix below is replaced by the §3 3-pillar test.** Rather
than a gradual month-by-month ratio shift, this is now a hard, explicit test: **10 videos per
pillar (AI Tools & Agent Spotlights, Navigating the AI Era, How AI Systems Actually Work), 30
total, equal weight, no ratio adjustment mid-test.** The decision gate comes AFTER real data
exists for all three, not gradually across three months:

1. Produce and publish 10 videos in each pillar (order can interleave, doesn't need to run
   pillar-by-pillar).
2. Once a pillar has enough real traffic to read signal (per §9's metrics — follows/1,000
   views primary, saves/comments secondary), score it.
3. Apply §10's batch decision rule AT THE PILLAR LEVEL: KEEP/SCALE the pillar(s) that show
   real audience-quality signal, MODIFY a pillar whose hook/format is the likely problem rather
   than its core premise, KILL a pillar only once it has genuinely sufficient evidence, not
   after one or two weak posts.
4. Only after this pillar-level decision does the mix stop being equal-weight — see
   `docs/experiment_log.md`'s "Pillar Experiment" section for the live count and eventual
   decision record.

Old month-by-month mix (2026-08-12, retired 2026-08-14, kept for history): Month 1: 10 Build
in Public: The System, 10 tools/agent spotlights, 5 how-AI-works explainers, 5 opinions/trends.
Month 2: reduce weak concepts and double down on winners. Month 3: move toward roughly 50-70%
build-in-public/system-native, 20-30% tools/workflows, ~10% experiments.

## 9. Content scoring

Do not optimize for views alone. Track:

- **Views**: distribution.
- **3-second hold / hook**: initial attention.
- **Average watch percentage**: content quality.
- **Shares**: resonance and utility.
- **Saves**: utility.
- **Profile visits**: interest.
- **Follows**: audience fit.
- **Comments**: engagement and qualitative insight.
- **Follows per 1,000 views**: key audience-quality metric.

A lower-view post that attracts many relevant followers can beat a viral post that attracts
the wrong audience.

**Analytics reality check (investigated 2026-08-10, corrected same day after testing against
real published posts, see `docs/experiment_log.md`'s Analytics Capture Note for the full
finding)**: Zernio's Analytics API is real and included on its paid Usage plan.
`automation/fetch_zernio_analytics.py` pulls it. Instagram returns impressions, reach, likes,
comments, shares, saves, views, and, confirmed via a real post, per-post follows and average
watch time. YouTube's own follows/watch-time fields on the same endpoint read 0 on the one post
tested (unclear yet if that's real or a platform placeholder), but a separate retention-curve
endpoint gives real audience-retention data once a video has enough views and clears YouTube's
2-3 day processing delay. Manual capture from native Insights/Studio UI is now the fallback for
whatever the script can't get, not the default assumption.

## 10. Batch decision rule

At the end of every experiment batch, classify concepts:

- **KEEP**: evidence of repeatable performance and good audience fit.
- **SCALE**: strong performance; increase frequency and develop a series.
- **MODIFY**: promising but hook/format/topic needs adjustment.
- **KILL**: weak performance and/or poor audience fit after sufficient testing.

Do not kill a concept from one post unless there is a clear strategic problem.

## 11. Content format principles

- Stay faceless for now.
- Maintain a consistent premium, technical, clean visual identity.
- Prefer real product screenshots/assets and verified facts when relevant.
- Use concise hooks with a clear payoff.
- Show practical examples whenever possible.
- Make the viewer learn, rethink, or do something.
- Avoid generic AI-slop aesthetics and filler.

## 12. Automation boundary

Claude Code and the content pipeline should automate production. They should not own
strategy.

| System Can Own | System Can Assist | Human Must Own |
|---|---|---|
| Research; fact checking; topic expansion; scripts; voice; asset capture; rendering; captions; scheduling; reporting | Topic scoring; trend detection; hook suggestions; performance analysis; next-experiment recommendations | Brand positioning; audience definition; editorial taste; final topic approval; strategic interpretation; business direction |

**Rule**: automate the 90% that is repetitive; protect the 10% that determines whether the 90%
matters.

## 13. Existing production pipeline

Retain the existing architecture. This spec adds a strategy layer above it; it does not
replace it:

- Planning, then research/fact checking, then script.
- ElevenLabs voice generation and timing.
- Word-level timing / shot timing.
- Real product screenshots and assets.
- Remotion/React/TypeScript rendering.
- Audio/render checks and cover generation.
- Platform-specific captions.
- GitHub hosting and verification.
- Zernio upload and scheduling.
- Instagram and YouTube distribution; LinkedIn can remain manual.

## 14. Owned audience

**Priority order, revised 2026-08-12 per direct instruction**: audience building comes first.
Monetization shape and the newsletter/lead-magnet buildout are explicitly deferred until
there's a real audience to make that decision against, not skipped, parked. The sections below
stay in the spec as the hypothesis to pick back up, not a current build item.

**Newsletter (draft name, not committed)**: The Automation Brief
**Promise (draft)**: "One practical email a week on real AI automation systems, built and
tested in public."

Start with Substack when this gets picked back up. Keep the email stack simple for the first
~90 days of active use. Weekly cadence (draft):
- What got built or tested this week.
- Tool/agent/workflow tested.
- A real breakdown of an AI system or automation.
- One practical framework/workflow.
- What That AI PM is building/testing next.

Potential future migration: beehiiv if the newsletter becomes a serious media/growth business;
Kit if the business becomes heavily focused on creator products and automations.

## 15. Lead magnet

**Deferred alongside §14, same reasoning.** Draft only, not a current build item.

**Free asset (draft)**: AI Automation Starter Kit
- 25 real AI automation workflows.
- AI agent/tool evaluation checklist.
- A practical framework for deciding what to automate first.
- 20 practical prompts for building with AI.
- The actual tool stack this channel's own production runs on.
- A learning roadmap for building AI automation systems.

**Funnel**: Social content, then Starter Kit, then email, then the newsletter, then trust, then
product, once §14/§15 are actually picked up.

## 16. Monetization hypothesis

**Explicitly deferred, 2026-08-12, per direct instruction**: audience first, monetization
decided only once there's a real audience to decide it against. Kept below as the hypothesis on
record, not a current commitment or build item, do not act on this section without an explicit
go-ahead.

This is a hypothesis, not a fixed destiny:

1. Free content.
2. Owned audience.
3. Low-ticket digital product / toolkit.
4. Flagship AI automation education, or services/consulting building AI automation systems for
   others (the founder's stated draft preference, 2026-08-12, still open which shape this
   takes).
5. B2B AI automation workshops / consulting / done-for-you builds.
6. Software discovered from recurring audience problems, potentially productizing this
   channel's own production system if that pattern holds up.

Do not build the final SaaS now. Use the audience as a product-discovery engine.

## 17. Business flywheel

```
CONTENT -> AUDIENCE -> EMAIL -> LEARN PROBLEMS -> PRODUCTS -> CUSTOMERS
-> DISCOVER RECURRING PAINS -> SOFTWARE -> REVENUE -> BETTER CONTENT
```

Content is distribution. Audience is the asset. Products are the business.

## 18. 12-month direction

- **Months 1-3, DISCOVER**: 60-90 pieces; test pillars/hooks/formats; identify the audience;
  start email list.
- **Months 4-6, FOCUS**: kill weak concepts; establish recurring series; launch Starter Kit;
  begin newsletter; test first digital product.
- **Months 7-9, MONETIZE**: improve product; launch flagship education; collect testimonials;
  test B2B workshops.
- **Months 10-12, BUILD**: study audience problems and validate the strongest software
  opportunity.

## 19. Success definition

The first 90 days are successful if the system can answer:

1. Which 3 topics consistently work?
2. Which 3 hooks consistently work?
3. Who is actually following?
4. Which content generates the most relevant followers?
5. Can social traffic convert into email subscribers?
6. What problems/questions repeatedly appear?
7. Will anyone pay for a solution?

Follower count is a secondary metric. The goal is to reduce uncertainty.

## 20. Content system prompt: execution rules

When generating content for That AI PM:

1. Start from the That AI PM positioning: building real AI automation systems, in public.
2. Prioritize the primary audience: people interested in AI agents, automation, and building
   with AI.
3. Use AI-tool topics for acquisition, but connect them to a real build or workflow whenever
   natural.
4. Prefer original, useful, and opinionated angles over generic summaries.
5. Use real evidence and verify time-sensitive claims.
6. Do not invent product capabilities, pricing, benchmarks, quotes, or experiences.
7. Apply the 100K test before recommending an idea.
8. For experiments, label the hypothesis and what the post is intended to test.
9. After publishing, evaluate performance using audience-quality signals, not views alone.
10. Recommend KEEP / SCALE / MODIFY / KILL after sufficient evidence.
11. Never change the core positioning because of one viral or weak post.
12. Do not let automation decide the brand's strategy.
13. When uncertain, prefer content that strengthens long-term positioning over content that
    merely chases short-term reach.
14. **Added 2026-08-14**: identify which of the 3 pillars (§3) a new concept belongs to BEFORE
    scoring it — the Quality Gate criteria differ (Pillar 2 concepts score against the
    **navigate** question and an emotional register, not KNOW/USE/WORK/BUILD). Don't force a
    Pillar-2-flavored idea into a Pillar-1 or Pillar-3 shape just because those are more
    familiar to produce.

## 21. Source of truth

This document supersedes earlier informal content directions for That AI PM. The production
pipeline may evolve technically, but the strategic rules above should remain stable unless
deliberately changed after evidence.

**90-day commitment**: keep the positioning stable; let the data change the execution.

## 22. North star reminder

**CONTENT IS EXPERIMENTATION.**
**AUTOMATION IS LEVERAGE.**
**AUDIENCE IS THE ASSET.**
**PRODUCTS ARE THE BUSINESS.**
