> **RETIRED 2026-08-10.** This entire pillar strategy (60% Trending Claude Code Skills / 40%
> Best AI Tools listicles) is superseded by **That AI PM: Content System Operating Spec v2.0**
> (`docs/thataipm_content_system_operating_spec_v2.md`). Kept in place for audit/history only,
> not deleted; do not use anything below as current strategy. See `CLAUDE.md` §7 for the full
> migration note.

# ThatAIPM — Content Pillars (locked 2-pillar system, 2026-08-10)

Originally locked 2026-08-09 after 6 educational "How AI Actually Works" videos didn't get the
traction expected. **Simplified to exactly 2 pillars 2026-08-10**: the educational pillar was
removed entirely (`how_ai_works_content_plan.md` deleted by the user), and the "Personal AI
takes" pillar (planned as a 20% slot, never built out) was also dropped in favor of a second
concrete pillar with its own locked idea bank, for a cleaner two-pillar system. This is still
the same **@thataipm** channel. See `CLAUDE.md` §1 for the original channel brief.

## Hook rule (both pillars), locked 2026-08-10

Flagged directly after sd1: a hook can have the right contrast/tension shape and still fail if
it doesn't say what the video is actually about. sd1's hook ("Three AI voice tools, three
completely different reasons to pick one over the other") didn't make the subject clear
enough, fast enough. Every hook from here forward needs BOTH a reason to keep watching
(contrast, stakes, a claim worth checking) AND a clear statement of the actual subject —
which tools, which category — within the first line or two. Test: if someone only heard the
hook line, would they know what the video covers? If not, rewrite it. Full writeup in
[[feedback-hook-must-state-topic]] memory.

## Rotation

- **60% — Main pillar: Trending Claude Code skills/plugins.** Sourced via continuous research
  (GitHub stars, community roundups, viral moments), not invented topics. Format modeled
  directly on two reference videos the user supplied and analyzed frame-by-frame (2026-08-09):
  hook-threat opener → per-tool beat (name, one-line value, real screenshot, concrete stat
  payoff) → "Comment [KEYWORD] and I'll send you the link" close. See
  [[feedback-follow-only-cta-until-followers]] memory — comment-gate CTA is back for this pillar
  specifically, reversing the earlier follow-only rule.
- **40% — Second pillar: Best AI Tools (listicle).** **Reframed 2026-08-10** from head-to-head
  "Tool Showdowns" (X vs Y) to ranked listicles ("Best AI Tools for Voiceovers," "Best AI Tools
  for Video Generation") — stronger for discovery (a genuine high-intent search pattern, unlike
  a narrower "vs" title), and more resilient: if one tool in a 5-item list dies (as just
  happened with PlayHT), you swap one entry instead of losing the whole video's premise. **List
  size varies by category** — however many genuinely strong, currently-live tools actually exist
  for that category, not a fixed count. Famous, widely-recognized consumer AI products, organized
  by industry category (voice, video gen, image gen, avatar, coding, chat, music, presentations,
  search, meetings) — not the dev-tool/GitHub-stars bank above, a deliberately different,
  broader-recognition angle. Locked category list below. **Shares the main pillar's practitioner
  voice and no-invented-claims discipline, but NOT its production components** — these are real
  commercial product UIs (a voice studio, a video generator), not GitHub repo pages, so
  `RepoScreenshot` (built specifically for github.com pages with a stars badge) doesn't fit; use
  `ProductScreenshot` instead (built 2026-08-10, see below). **Every tool in every list needs one
  real, verified differentiator before scripting** (a real price, a real feature gate, a real
  sourced stat) — not generic "great tool, 5 stars" filler, and not a claim from memory. Same
  discipline this channel already applies everywhere else (tn1's whole premise change existed
  specifically to avoid an unverifiable claim). **Also verify each tool is still live** before
  scripting — PlayHT's death mid-research on 2026-08-10 is exactly the failure mode this guards
  against.

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
first-hand proof behind it rather than research alone. **Shipped 2026-08-09 as
`episodes/3-claude-code-skills-that-turn-it-into-a-video-editor/`** (folder renamed from the
original short-code `sk1` on 2026-08-10 — see this doc's naming-convention note below).

## Pillar 2 (40%, second pillar) — Best AI Tools, locked category list, 2026-08-10

Reframed from head-to-head matchups (see git history for the discarded ElevenLabs-vs-Murf pilot,
originally at the short-lived folder `episodes/sd1` before it was deleted 2026-08-10) to
listicles. Categories favor name recognition over
completeness — a viewer should recognize at least one entry before the hook finishes. **Which
specific tools populate each list, and how many, is decided per-episode right before scripting**
— verify each candidate tool is actually still live (not another PlayHT) and has at least one
real, sourced differentiator worth including, not a fixed pre-picked roster locked in here.

1. **Best AI Tools for Voiceovers** — candidates seen so far: ElevenLabs, Murf (PlayHT confirmed
   dead 2026-08-10, do not include)
2. **Best AI Tools for Video Generation** — candidates seen so far: Google Veo 3, Higgsfield,
   Kling AI, Runway Gen-4
3. **Best AI Tools for Image Generation** — candidates seen so far: Midjourney, Google's Nano
   Banana
4. **Best AI Tools for Avatars / Talking-head Video** — candidates seen so far: HeyGen, Synthesia
5. **Best AI Coding Assistants** — candidates seen so far: Cursor, Claude Code
6. **Best AI Chatbots / Reasoning Models** — candidates seen so far: ChatGPT, Claude, Gemini
7. **Best AI Tools for Music Generation** — candidates seen so far: Suno, Udio
8. **Best AI Tools for Presentations/Slides** — candidates seen so far: Gamma, Beautiful.ai
9. **Best AI Search Tools** — candidates seen so far: Perplexity, ChatGPT Search
10. **Best AI Tools for Meeting Notes/Transcription** — candidates seen so far: Otter.ai,
    Fireflies

## Screenshot sourcing practice for Best AI Tools, locked 2026-08-10

Unlike the main pillar's GitHub repo pages (public, no login, consistent layout), most of these
products gate their actual interesting UI (a generation in progress, a real result) behind a
login. **No credential handling or scripted login of any kind** — that's a hard rule, not a
current limitation. Two tiers instead:

- **Tier A — public showcase pages (automatable, preferred)**: most of these tools have a public
  gallery/showcase/examples/pricing page with real, attributable content and no login required
  (Midjourney's showcase, Suno's public feed, HeyGen's examples, ElevenLabs' voice library,
  Runway/Kling's public generation feeds, Perplexity's shared answer pages). Capture via
  `automation/capture_product_screenshot.py` (Playwright, headless, generalized from the Claude
  Code skills episode's GitHub-specific `capture_screenshot.py`) into
  `components/ProductScreenshot.tsx` (same
  browser-chrome pan/zoom technique as `RepoScreenshot`, just not GitHub-specific — `highlightBox`
  instead of `starsBox`, zooms into whatever real detail matters for that beat: a price, a
  rating, a result thumbnail).
- **Tier B — hands-on product use (stays manual)**: if the compelling shot is genuinely "watching
  a prompt generate inside the tool," that's behind a login and stays a manual capture — actually
  use the tool and hand off the screenshot/recording, same pattern as any other real-asset
  gathering on this channel.
- Real logos still get downloaded the same way as the Claude Code skills episode
  (`github.com/<org>.png` where the tool has a GitHub org; otherwise the tool's own
  press-kit/favicon), into `episodes/{episode-slug}/assets/logos/{tool}.png`. Product
  screenshots go in `episodes/{episode-slug}/assets/shots/{tool}_{page}.png` — same convention,
  now using the full-title folder slug instead of a short code (locked 2026-08-10, see
  `CLAUDE.md` for the naming rule).

## Open items

- Visual system for Pillar 2 (main pillar): locked, see `CLAUDE.md` §6's 2026-08-10 entry.
- CTA keyword per episode: pick per-topic, not a single fixed word across all episodes.
- What actually gets sent when someone comments the keyword (a doc? a direct repo link?
  a compiled list?): not yet decided, needs a real fulfillment plan before the first episode
  posts, not just the CTA mechanic.
- **New listicle shot/list component needed**: the old plan assumed a 2-tool head-to-head verdict
  beat; a ranked list needs its own countdown/list structure instead (not yet designed).
- Which category ships first: not yet decided.
