# ThatAIPM — Content Pillars (locked 2-pillar system, 2026-08-10)

Originally locked 2026-08-09 after 6 educational "How AI Actually Works" videos didn't get the
traction expected. **Simplified to exactly 2 pillars 2026-08-10**: the educational pillar was
removed entirely (`how_ai_works_content_plan.md` deleted by the user), and the "Personal AI
takes" pillar (planned as a 20% slot, never built out) was also dropped in favor of a second
concrete pillar with its own locked idea bank, for a cleaner two-pillar system. This is still
the same **@thataipm** channel. See `CLAUDE.md` §1 for the original channel brief.

## Rotation

- **60% — Main pillar: Trending Claude Code skills/plugins.** Sourced via continuous research
  (GitHub stars, community roundups, viral moments), not invented topics. Format modeled
  directly on two reference videos the user supplied and analyzed frame-by-frame (2026-08-09):
  hook-threat opener → per-tool beat (name, one-line value, real screenshot, concrete stat
  payoff) → "Comment [KEYWORD] and I'll send you the link" close. See
  [[feedback-follow-only-cta-until-followers]] memory — comment-gate CTA is back for this pillar
  specifically, reversing the earlier follow-only rule.
- **40% — Second pillar: Tool Showdowns.** Head-to-head comparisons of famous, widely-recognized
  consumer AI products, organized by industry category (voice, video gen, image gen, avatar,
  coding, chat, music, presentations, search, meetings) — not the dev-tool/GitHub-stars bank
  above, a deliberately different, broader-recognition angle ("ElevenLabs vs PlayHT" already
  means something to a viewer before the hook even lands). Locked bank below. **Shares the main
  pillar's practitioner voice and no-invented-claims discipline, but NOT its production
  components** — these are real commercial product UIs (a voice studio, a video generator), not
  GitHub repo pages, so `RepoScreenshot` (built specifically for github.com pages with a stars
  badge) doesn't fit; needs a more general real-product-screenshot component before the first
  Showdown episode gets built. **Every matchup needs an actual sourced comparison before
  scripting** (same voice line run through both tools, same prompt through both generators) —
  same rule this channel already applies everywhere else (tn1's whole premise change existed
  specifically to avoid a claim that couldn't be verified), not narrated specs from memory.

## Pillar 1 (60%, main pillar) — locked idea bank, 2026-08-09

All real, sourced 2026-08-09 via web research, not invented. Re-verify stats before using if
much time has passed — this ecosystem moves fast and star counts/rankings shift.

**Story-driven (strongest hooks):**
1. **The Karpathy skill** — a single CLAUDE.md file, zero code, hit 144k-220k GitHub stars in
   weeks after Andrej Karpathy (Tesla Autopilot, OpenAI co-founder) publicly ranted about AI
   coding-agent failure patterns and a developer (Forrest Chang) turned it into 4 rules.
   `github.com/forrestchang/andrej-karpathy-skills`
2. **Superpowers** (obra / Jesse Vincent) — 200k+ stars, a full dev methodology (plan → test →
   review) as composable skills, works across Claude Code, Cursor, Codex, Copilot.
3. **UI/UX Pro Max** — 94k stars, one of the most-starred design-quality skills.
4. **Context7** (Upstash) — 39.3k stars, injects real-time up-to-date library docs into prompts
   so Claude stops citing outdated APIs.
5. **Antigravity Awesome Skills** — 22k+ stars, one repo bundling 1,234+ skills.

**Token/cost-saving (matches the two reference videos' own topic directly):**
6. **Caveman** — forces terse, bulleted, no-fluff answers.
7. **Morph** — replaces expensive reasoning with fast code-based edits.
8. **CodeBurn** — live view of exactly what's burning token budget.

**Memory / context-persistence:**
9. **mcp-memory-keeper** — persistent memory across sessions.
10. **contextforge-mcp** — memory with semantic search + git sync + team collaboration.
11. **claude-context** (Zilliz) — makes an entire codebase searchable context.

**Testing / verification:**
12. **Playwright skill** — Claude writes and runs its own browser tests.
13. **Visual Review skill** — Claude screenshots and critiques its own UI output.

**Meta / curated-list format (recurring, easy to refresh):**
14. **awesome-claude-skills** (ComposioHQ) — ~67k stars, the largest single skills directory.
15. **"I installed the top 5 from the biggest awesome-list"** — format episode, not one tool.

**Specific-use-case:**
16. **Taste Skill** — 48k stars, aesthetic/design-judgment skill.
17. **Impeccable** — 40k stars, code-quality enforcement.
18. **An official Anthropic skill** (PDF/doc/spreadsheet handling) — always-real, safe source.

**Story/format, not tool-specific:**
19. **"9,000+ plugins in one year"** — ecosystem-growth-story episode.
20. **"How to tell a good skill from a trap"** — trust/evaluation angle, positions the channel
    as an authority rather than just a link-dispenser.

**Bonus (21), kept as a strong early candidate**: video-use / HyperFrames / Remotion skill —
the exact tools used to build the ViralRespin pipeline this session. Only topic here with
first-hand proof behind it rather than research alone. **Shipped as `sk1`, 2026-08-09.**

## Pillar 2 (40%, second pillar) — Tool Showdowns, locked idea bank, 2026-08-10

Category picks favor name recognition over completeness — the goal is a viewer already knowing
one side of the matchup before the hook finishes. **Not yet fact-checked against real output**
(pricing, feature specifics, which tool currently "wins" what) — that verification pass happens
per-episode, right before scripting, not here. Re-verify stats/rankings before using regardless
of how much time has passed; this space moves fast.

1. **AI Voiceover** — ElevenLabs vs. PlayHT
2. **AI Voiceover** — ElevenLabs vs. Murf
3. **AI Video Generation** — Google Veo 3 vs. Higgsfield
4. **AI Video Generation** — Kling AI vs. Runway Gen-4
5. **AI Image Generation** — Midjourney vs. Google's Nano Banana
6. **AI Avatar / Talking-head** — HeyGen vs. Synthesia
7. **AI Coding Assistants** — Cursor vs. Claude Code
8. **AI Chat / Reasoning** — ChatGPT vs. Claude vs. Gemini
9. **AI Music Generation** — Suno vs. Udio
10. **AI Presentation / Slides** — Gamma vs. Beautiful.ai
11. **AI Search** — Perplexity vs. ChatGPT Search
12. **AI Meeting Notes / Transcription** — Otter.ai vs. Fireflies

## Open items

- Visual system for Pillar 2 (main pillar): locked, see `CLAUDE.md` §6's 2026-08-10 entry.
- **New shared component needed for Tool Showdowns**: a general real-product-screenshot
  component (not `RepoScreenshot`, which assumes a github.com page + stars badge) — build before
  the first Showdown episode.
- CTA keyword per episode: pick per-topic, not a single fixed word across all episodes.
- What actually gets sent when someone comments the keyword (a doc? a direct repo link?
  a compiled list?): not yet decided, needs a real fulfillment plan before the first episode
  posts, not just the CTA mechanic.
- Which Showdown ships first: not yet decided.
