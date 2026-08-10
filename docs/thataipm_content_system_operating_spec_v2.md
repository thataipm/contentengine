# That AI PM: Content System Operating Spec

**Version 2.0 | Approved 2026-08-10 | Migrated into the repo as the canonical source of truth**

This is the source of truth for the automated content system. It translates the That AI PM
business strategy into rules the production pipeline follows. It **supersedes** the previous
2-pillar strategy (60% Trending Claude Code Skills / 40% Best AI Tools). See `CLAUDE.md` for
the retirement note and migration history.

## 0. Non-negotiable north star

> That AI PM helps product people become AI-native through practical AI workflows, product
> thinking, and real-world experiments.

Core positioning: **AI-native product thinking**.

The brand is NOT an AI news page, generic AI-tools page, generic PM education page, or
trend-chasing content farm.

## 1. Target audience

- **Primary**: Product Managers and aspiring PMs who want to become AI-native.
- **Secondary**: founders, product designers, and product-minded developers.

Audience quality matters more than raw reach. Prefer people likely to care about AI products,
AI workflows, product strategy, building, and the future of PM work. Do not optimize for
viewers who only want generic free AI-tool lists. A smaller, highly relevant audience is more
valuable than a larger irrelevant audience.

## 2. Brand promise

Every content idea should answer at least one:

1. What should an AI-native PM **know**?
2. What should an AI-native PM **use**?
3. How does an AI-native PM actually **work**?
4. What does an AI-native PM **build**?

If an idea cannot pass at least one of these tests, reject it or reframe it.

## 3. Content hierarchy

| Pillar | Target Share | Strategic Job | Examples |
|---|---|---|---|
| AI PM | 35% | Authority | AI agents for PMs; RAG/LLMs for PMs; AI product strategy; evaluation; product teardowns |
| AI Workflows & Tools | 30% | Acquisition | Claude Code; ChatGPT; Cursor; n8n; AI research/building tools; practical workflows |
| Build in Public | 20% | Differentiation | SenseBug AI; experiments; builds; failures; lessons; decisions |
| Opinions & Trends | 15% | Personality | Contrarian AI/PM takes; meaningful launches; what AI changes for product work |

These percentages are a starting hypothesis, not permanent rules. The 90-day experiment
determines the eventual mix.

## 4. Product-native rule

**Product is the lens, not a cage.** Broad AI topics are allowed when they lead naturally into
product thinking. AI-tool content is an acquisition engine, not the brand identity. When
possible, explain why a tool/technology matters to product people. Avoid making every headline
say "for Product Managers." The PM/product perspective can emerge through the substance.
Prefer useful, opinionated, experience-based framing over generic lists.

**Example**:
- Weak: "5 Claude Code skills."
- Strong: "5 Claude Code workflows that make me a faster PM."

Do not overcorrect into a PM-tutorial channel either. Additional real examples logged during
the 2026-08-10 approval conversation, kept here as reference framing:
- Potentially strong: "I used Claude Code to automate my product research workflow."
- Potentially strong: "Claude Code can now do this. Here's why PMs should care."
- Potentially strong: "I gave Claude my product backlog. Here's what happened."

The goal is the intersection of AI, product, and building, not a generic PM tutorial channel.

## 5. The 100K test

Before approving an idea, ask: **"If this gets 100,000 views, do I want those 100,000
people?"** If the answer is no, change the topic, framing, or reject the idea.

## 6. Anti-drift rules

The system must NOT drift toward generic viral AI content:

- No generic AI news unless there is a clear product/PM implication.
- No random AI-tool listicles without a useful angle, comparison, workflow, or product
  implication.
- No copying viral topics merely because they are viral.
- No broad productivity content unrelated to AI/product work.
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
- PMs want practical Claude Code workflows more than AI theory.
- AI product teardowns generate higher-quality followers.
- Build-in-public content creates stronger trust.
- Contrarian AI/PM opinions create more profile visits.
- Practical frameworks generate more saves than explanations.

See `docs/experiment_log.md` for the structured tracking template.

## 8. 90-day experiment

Commit to the positioning for 90 days. Do not fundamentally reposition the brand during this
period. Experiment freely with topics, hooks, formats, lengths, visual treatments, and content
ratios. Do not change the core audience or positioning because of a small number of weak
posts. Aim for roughly 60-90 pieces of content across the 90-day period, subject to quality.
Every batch must produce a decision and a learning.

**Starting mix**:
- Month 1: 10 AI PM, 10 workflows/tools, 5 build-in-public, 5 opinions/trends.
- Month 2: reduce weak concepts and double down on winners.
- Month 3: move toward roughly 50-70% product-native, 20-30% tools/workflows, ~10% experiments.

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

**Analytics reality check (investigated 2026-08-10, see `CLAUDE.md`'s migration note for the
full finding)**: Zernio's Analytics API is real and included on its paid Usage plan, and does
return post-level views/likes/comments/shares/saves for Instagram and views/likes/comments for
YouTube. It does **not** expose follows attributable to a specific post, 3-second hold, or
average watch percentage for either platform. No known public API for Instagram or YouTube
exposes those at the post level. Those four metrics need manual capture from each platform's
native Insights/Studio UI for now, logged by hand into `docs/experiment_log.md`.

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

**Newsletter**: The AI PM Brief
**Promise**: "One practical email a week for product people navigating the AI shift."

Start with Substack. Keep the email stack simple for the first ~90 days. Weekly cadence:
- AI PM insight.
- Tool/workflow tested.
- Interesting AI product breakdown.
- One practical framework/workflow.
- What That AI PM is building/testing.

Potential future migration: beehiiv if the newsletter becomes a serious media/growth business;
Kit if the business becomes heavily focused on creator products and automations.

## 15. Lead magnet

**Free asset**: AI PM Starter Kit
- 25 AI workflows for PMs.
- AI product discovery checklist.
- AI feature evaluation framework.
- 20 practical prompts.
- AI PM tool stack.
- AI-native PM learning roadmap.

**Funnel**: Social content, then Starter Kit, then email, then AI PM Brief, then trust, then
product.

## 16. Monetization hypothesis

This is a hypothesis, not a fixed destiny:

1. Free content.
2. Owned audience.
3. Low-ticket digital product / toolkit.
4. Flagship AI-native PM education.
5. B2B AI-native PM workshops / consulting.
6. Software discovered from recurring audience problems.

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

1. Start from the That AI PM positioning: AI-native product thinking.
2. Prioritize the primary audience: PMs and aspiring PMs becoming AI-native.
3. Use AI-tool topics for acquisition, but connect them to practical product work whenever
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
