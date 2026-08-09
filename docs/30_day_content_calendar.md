# 30-Day Posting Calendar — starts 2026-08-09

**Rebuilt 2026-08-10** for the 2-pillar system (`thataipm_pillar2_content_plan.md`): the
educational pillar and the "Personal AI takes" slot are both gone, replaced by 60% Main pillar
(Trending Claude Code skills/plugins) / 40% Best AI Tools (ranked listicles of famous consumer
AI products, by industry category). Day 1 (`sk1`) already shipped under the old 3-pillar plan
but happened to be a Main-pillar topic anyway, so it stays as-is — everything from Day 2 forward
follows the new split.

**Reframed again same day, 2026-08-10**: the second pillar started as head-to-head "Tool
Showdowns" (X vs Y), then got reframed to ranked listicles ("Best AI Tools for Voiceovers")
before any episode shipped — stronger for discovery, more resilient to any single tool dying
mid-cycle (see the PlayHT case below). Day 2's in-progress ElevenLabs-vs-Murf pilot was
discarded, not converted — that pillar's Day 2 entry starts fresh as a listicle.

Daily posting (one video/day, all 3 platforms). Repeating 5-day block (3 Main + 2 second-pillar)
for an exact 60/40 split (18 Main-pillar days / 12 second-pillar days over 30 days) —
interleaved, not run in visible streaks. Main-pillar picks pull from the locked 20-idea bank in
listed order, continuing right after `sk1` (bonus #21, already used). Second-pillar picks pull
from the locked 10-category list in listed order — **which specific tools populate each
category's list, and how many, is decided per-episode**, not fixed here.

**Status column**: only Day 1 is produced. Everything else is a planned slot — each still needs
script → real-asset sourcing/verification (including confirming every candidate tool is still
live) → VO → render → SFX → host → schedule on its day.

| Day | Date | Pillar | Topic | Status |
|---|---|---|---|---|
| 1 | 2026-08-09 | Main | sk1 — video-use / HyperFrames / Remotion skill | **Shipped** |
| 2 | 2026-08-10 | Second | Best AI Tools for Voiceovers | **In production** |
| 3 | 2026-08-11 | Main | The Karpathy skill (forrestchang/andrej-karpathy-skills) | Planned |
| 4 | 2026-08-12 | Second | Best AI Tools for Video Generation | Planned |
| 5 | 2026-08-13 | Main | Superpowers (obra/Jesse Vincent) | Planned |
| 6 | 2026-08-14 | Main | UI/UX Pro Max | Planned |
| 7 | 2026-08-15 | Second | Best AI Tools for Image Generation | Planned |
| 8 | 2026-08-16 | Main | Context7 (Upstash) | Planned |
| 9 | 2026-08-17 | Second | Best AI Tools for Avatars / Talking-head Video | Planned |
| 10 | 2026-08-18 | Main | Antigravity Awesome Skills | Planned |
| 11 | 2026-08-19 | Main | Caveman | Planned |
| 12 | 2026-08-20 | Second | Best AI Coding Assistants | Planned |
| 13 | 2026-08-21 | Main | Morph | Planned |
| 14 | 2026-08-22 | Second | Best AI Chatbots / Reasoning Models | Planned |
| 15 | 2026-08-23 | Main | CodeBurn | Planned |
| 16 | 2026-08-24 | Main | mcp-memory-keeper | Planned |
| 17 | 2026-08-25 | Second | Best AI Tools for Music Generation | Planned |
| 18 | 2026-08-26 | Main | contextforge-mcp | Planned |
| 19 | 2026-08-27 | Second | Best AI Tools for Presentations/Slides | Planned |
| 20 | 2026-08-28 | Main | claude-context (Zilliz) | Planned |
| 21 | 2026-08-29 | Main | Playwright skill | Planned |
| 22 | 2026-08-30 | Second | Best AI Search Tools | Planned |
| 23 | 2026-08-31 | Main | Visual Review skill | Planned |
| 24 | 2026-09-01 | Second | Best AI Tools for Meeting Notes/Transcription | Planned |
| 25 | 2026-09-02 | Main | awesome-claude-skills (ComposioHQ) | Planned |
| 26 | 2026-09-03 | Main | "Top 5 from the biggest awesome-list" (format episode) | Planned |
| 27 | 2026-09-04 | Second | Best AI Tools for Voiceovers, Part 2 (or a new category — bank is used up, see Reserve) | Planned |
| 28 | 2026-09-05 | Main | Taste Skill | Planned |
| 29 | 2026-09-06 | Second | New category needed (bank used up) | Planned |
| 30 | 2026-09-07 | Main | Impeccable | Planned |

## Reserve (not yet slotted)

Main-pillar bank items #18-20 (an official Anthropic skill, the "9,000+ plugins in one year"
ecosystem-story episode, "how to tell a good skill from a trap") carry over unused into the
next 30-day cycle. The second pillar's 10-category list runs out at Day 24 (10 categories used,
2 days early relative to its 12 originally-planned slots under the old matchup system) — Days 27
and 29 need either a revisit of an earlier category (a "Part 2" with different tools) or 2 new
categories added to the bank before those days arrive.

## Verified dead, 2026-08-10

**PlayHT (play.ht) is discontinued** — domain doesn't resolve (`curl: Could not resolve host:
play.ht`), consistent with Meta's July 2025 acquisition of the similarly-named PlayAI. Excluded
from the Voiceovers list. This is exactly the failure mode the listicle format (vs. a head-to-head
that lives or dies on one matchup) is meant to absorb — worth remembering why that reframe
happened when the next tool inevitably turns out to be dead or changed mid-research.

## Still open (blocks nothing here, but blocks scale)

- **New listicle shot/list component needed** — the second pillar's visual plan assumed a 2-tool
  head-to-head verdict beat; a ranked list needs its own countdown/list structure instead, not
  yet designed. (`ProductScreenshot`/`capture_product_screenshot.py`, the real-screenshot
  tooling itself, is already built and reusable regardless of matchup vs. listicle format.)
- **CTA fulfillment mechanic undecided** — every episode on both pillars ends on a comment-gate
  CTA but there's no actual fulfillment pipeline yet (auto-DM? manual reply? a link-in-bio
  page?). Fine at today's volume, won't hold at daily-post-with-real-engagement volume.
- **Every tool in every list needs a real, sourced differentiator before scripting** — not a
  claim from memory, same discipline as the rest of this channel.
