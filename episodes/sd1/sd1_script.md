# sd1 — "Best AI Tools for Voiceovers" (Second pillar, episode 1)

First episode of the reframed listicle format (was a head-to-head ElevenLabs-vs-Murf pilot,
discarded 2026-08-10 per direct instruction in favor of "best of" listicles). Structured as
"best FOR a specific need" rather than a flat 1-2-3 ranking — each tool actually wins a
different use case, which is a stronger and more specific angle than ranking them against each
other on the same axis.

## Candidates researched 2026-08-10 (re-verify if much time has passed)

- **PlayHT** — excluded, confirmed dead (`play.ht` doesn't resolve; consistent with Meta's July
  2025 acquisition of the similarly-named PlayAI).
- **Resemble AI** — excluded. Checked resemble.ai/pricing directly: the company has pivoted to
  "generative AI security" / deepfake detection, not voice generation for creators anymore. A
  real surprise, worth remembering before assuming any tool's old reputation still applies.
- **Speechify** — excluded from this list. Real and live, but it's a text-to-speech *reader*
  (listen to PDFs/articles/emails), not a voiceover-creation tool for video — different audience
  than this list is for.
- **ElevenLabs, Murf, WellSaid** — all verified live and creator-focused. Included below.

## Sourced facts

**ElevenLabs** (elevenlabs.io/pricing) — best for cloning your own voice:
- Free: $0/mo, 10,000 credits, no commercial use, no cloning
- Starter: $6/mo, 30,000 credits, **instant voice cloning + commercial rights**
- Creator: $22/mo, 121,000 credits, **professional voice cloning**

**Murf** (murf.ai/pricing, corroborated via aggregators — page is JS-rendered, spot-check before
a second Murf mention) — best for studio-style production control:
- Free: $0/mo, 10 min generation, no downloads, no commercial rights
- Creator: $29/mo ($19/mo annual), ~24 hrs/year, commercial rights, pitch/pause/emphasis controls
- Voice cloning is **Enterprise-only** (~$1,000-5,000+/year) — the real trade-off vs ElevenLabs

**WellSaid** (wellsaid.io/pricing, note: wellsaidlabs.com now redirects here — rebrand) — best
budget option with full commercial rights, no cloning:
- Free trial: 3 download minutes/month
- Starter: $10/mo ($120/year), 240 min/year, full commercial rights, 10 projects
- Pro: $33/mo, 2,160 min/year, unlimited projects
- **No voice cloning at all** — pre-built voices only, which is exactly why it's the cheapest
  real entry with full commercial rights from tier one

## VO script

Three AI voice tools, three completely different reasons to pick one over the other.

If you want to clone your own voice, ElevenLabs is the easy pick — six dollars a month gets you instant cloning and commercial rights. No other tool on this list gets close to that price.

If you want real studio control — pitch, pauses, emphasis — Murf is built for that. Just know voice cloning isn't included in any regular plan. That's Enterprise-only, over a thousand dollars a year.

And if you don't need cloning at all, WellSaid is the budget pick — ten dollars a month, full commercial rights, hundreds of pre-built voices, no drama.

Comment VOICES and I'll send you the full breakdown for all three.

## Shot plan

1. **Hook** — "Three AI voice tools, three completely different reasons to pick one" + the 3
   tool logos appearing.
2. **ElevenLabs beat** — `ProductScreenshot` of the real pricing page, zoomed into the $6/mo
   Starter tier's cloning callout.
3. **Murf beat** — `ProductScreenshot` of the real pricing page, zoomed into the Enterprise
   voice-cloning gate.
4. **WellSaid beat** — `ProductScreenshot` of the real pricing page, zoomed into the $10/mo
   Starter tier.
5. **Close** — `CommentCTA` with keyword "VOICES".

## Still needed before this renders

- Real screenshots of all three pricing pages via `automation/capture_product_screenshot.py`
  (confirm Murf's and WellSaid's JS-rendered pages actually show pricing content under headless
  Playwright, unlike the plain-HTML fetch used for research).
- Real logos for all three tools (same `github.com/<org>.png` / press-kit pattern as sk1 — none
  of these three are open-source dev tools, so likely no GitHub org; use press-kit/favicon
  instead).
- A listicle-appropriate shot structure — sk1's `ToolHeader`/`TerminalCard` assumed "here's how
  to install this," which doesn't fit a "here's the pricing page" beat. Reuse `ProductScreenshot`
  + a repositioned `ToolHeader`-style name card; no new component strictly required for a
  3-item list this size, but worth a "best for X" label element per beat.
