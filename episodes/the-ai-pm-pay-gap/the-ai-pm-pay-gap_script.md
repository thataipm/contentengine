# What AI Is Actually Doing to PM Hiring: Script & Shot List

**Pillar**: AI PM (authority), v2.0 Batch 1, concept 1 of 2
**Status**: REBUILT 2026-08-10 after a factual error was caught and corrected. Originally
scripted around a $245K vs $123K compensation-gap claim from a research pass that bundled a
plausible-sounding but unverifiable figure alongside two real, sourced stats. Direct user
feedback on thin visuals prompted a source re-check, which found the compensation figures
don't appear on either cited source or anywhere else checkable. Rebuilt entirely around facts
that are independently confirmed against primary sources. See `CLAUDE.md` for the full
incident note.
**Target runtime**: ~35-40s

## Verified facts (re-verified 2026-08-10 directly against primary sources, not secondhand)

- Senior AI-PM hiring (Staff/Principal/Director level) up 34% in 2025; junior/mid-level PM
  hiring down 12% in 2025. Source: BCG's 2026 workforce-transformation report, as reported by
  institutepm.com. Confirmed verbatim on the page, with a real on-page stat-card display.
  https://www.institutepm.com/knowledge-hub/ai-reshaping-pm-role-2026
- Senior PM job postings requiring AI fluency: 61%, up from 23% in 2024. Same source, same
  stat-card display.
- 85% of respondents plan to invest in AI/ML tools over the next year; only 2% consider talent
  development their biggest focus. Source: Productboard's CPO survey.
  https://www.productboard.com/blog/ai-in-product-management-cpo-mandates-missteps/

**Explicitly dropped**: the $245,000 (AI-native PM) vs $123,000 (traditional PM) compensation
comparison from the first draft. Checked directly against both sources above and a fresh web
search; no source states these as actual reported figures. Do not reuse this claim.

## Script

**Shot 1 (Hook, ~5s)**
> "If you're a mid-level product manager right now, hiring for your role just dropped double
> digits. If you're senior and AI-fluent, it's never been better."

**Shot 2 (~7s)**
> "Senior AI-PM hiring is up thirty four percent this year. Junior and mid-level PM hiring
> dropped twelve percent."

**Shot 3 (~8s)**
> "Sixty one percent of senior PM postings now require AI fluency, up from twenty three
> percent just last year."

**Shot 4 (~9s)**
> "Eighty five percent of leadership is investing in AI tools, and only two percent are
> investing in the PMs who'd actually use them."

**Shot 5 (~8s, close)**
> "Companies want AI-native PMs. They're just not building them, they're hiring for it
> instead. Comment AIPM and I'll send you where to start."

## Notes

Ran through the `humanizer` skill's real audit twice (once on the original draft, once on
this rebuild). Second pass caught Shots 2 and 3 using the identical back-to-back "stat
sentence. stat sentence." structure, the same uniform-cadence issue flagged on the Karpathy
episode. Fixed by merging Shot 3 into one flowing sentence.

## Visual plan, revised after direct feedback ("too plain, no screenshots")

Original build used only abstract comparison cards, no real evidence. Rebuilt as two-beat
shots per the established RepoScreenshot pattern: each stat-bearing shot opens on the real
source page (proof the number is real, not asserted), then transitions to the clean
stat-card/bar payoff for legibility.
- Shot 1: unchanged, two neutral role cards diverging (no data yet, this is the hook).
- Shot 2: real institutepm.com screenshot zoomed on the actual +34%/-12% stat cards, then
  transitions to the clean ComparisonCard payoff.
- Shot 3: same real screenshot, zoomed on the 61% stat card, then a StatCallout payoff.
- Shot 4: real productboard.com screenshot zoomed on the actual 85%/2% sentence, then the
  DisparityBar payoff (reused from the original build, this part wasn't the problem).
- Shot 5: `CommentCTA`, unchanged.
