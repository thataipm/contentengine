# Episode: "HyperFrames Had the Components I Hand-Built" (working title)

**Pillar**: Build in Public: The System (primary), also functions as an AI Tools & Agent
Spotlight — first episode produced under the revised positioning (see
`docs/thataipm_content_system_operating_spec_v2.md` §0, revised 2026-08-12).

**Production note**: this is the first episode built via HyperFrames instead of the existing
Remotion pipeline (`remotion/`). The Remotion engine is untouched — this is a new, separate
production path for episodes going forward, not a port of an existing one. Device candidates
below are proposed against HyperFrames' real registry catalog (fetched directly from
`registry.json`, not estimated) but are not final until confirmed during the actual HyperFrames
intent-interview/brief step, which may adjust specifics.

**Status**: NOT_PRODUCED. Script drafted 2026-08-12, awaiting approval before any build step.

## Sources (verified directly, not from memory)

- `heygen-com/hyperframes` GitHub repo, checked via `gh api`/direct fetch 2026-08-12:
  **40,680 stars, 3,873 forks**, Apache 2.0 license, created 2026-03-10, last pushed
  2026-08-12 (same day, actively maintained).
- `registry.json` fetched directly from
  `https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry/registry.json`,
  counted programmatically, not estimated: **380 total registry items** — 150
  `hyperframes:block`, 221 `hyperframes:component`, 9 `hyperframes:example`.
- Specific overlaps confirmed by name in the same registry pull: 14 `code-snippet-apple-terminal-*`
  variants, a component literally named `count-up`, and `scan-band`/`light-sweep-pass` —
  the same scan-sweep technique hand-built this session for `remotion/src/components/RepoScreenshot.tsx`.
- Specific gap confirmed: no ring/loop/cycle primitive exists anywhere in the 380 items — checked
  by reading the full name list, not assumed. This channel's own `remotion/src/components/CycleWheel.tsx`
  (built this session for the pm-skills episode's product-lifecycle shot) would still need to be
  hand-built even on HyperFrames.

No invented numbers. Anything not listed above as directly checked should not be said in the VO.

## VO script (~50s target, apply `[rushed]` per the established ElevenLabs v3 pacing tag)

**Shot 1 — Hook (0-4s)**
> [rushed] I wasted hours hand-building AI video components. A public registry already had three hundred eighty of them, ready to install.

*Revised 2026-08-12, direct feedback ("hook is not good"): the original saved the 380 number for
shot 3 and opened on the vague "video components" with no stakes. Leads with the real number and
"wasted hours" now, matching the standing rule that a hook must state the topic and the stakes
fast, not build up to them (same failure mode flagged before on pm-skills/the-ai-pm-pay-gap).*

**Shot 2 — The problem (4-16s)**
> Every shot needed its own device. A terminal card. A counting number. A container that holds items. I coded each one from scratch, in an engine I built myself.

**Shot 3 — The proof (16-32s)**
> It's called HyperFrames, forty thousand stars on GitHub. Fourteen terminal card styles. A count-up number, already built. Even the scanning light effect I invented by hand this session, already there.

**Shot 4 — The honest gap (32-42s)**
> One thing wasn't in it either: a circular loop diagram. Even the best library has real gaps. Check first. Don't assume.

**Shot 5 — Close / CTA (42-50s)**
> This channel is switching to it, starting with this video. If you're building your own AI systems, follow along, it's happening in public.

## Shot list (Concept → Real shape → Device → Why it matches)

**Shot 1 — Hook**
- Concept: hand-built vs. already-existed, the video's whole thesis
- Real shape: two piles of the same objects — one built one at a time, one already sitting there finished
- Device: a literal side-by-side split (registry has `comparison-split` and `before-after-wipe`) — our component icons popping in slowly on one side, a wall of ready tiles already sitting on the other
- Why it matches: shows the contrast in the first 3 seconds instead of narrating it

**Shot 2 — The problem**
- Concept: building each component alone, one at a time, real effort
- Real shape: an assembly line — distinct objects, each requiring separate manual work
- Device: our own real component names (TerminalCard, CountUp, GroupBucket, CycleWheel, AgentSpawn) appearing one at a time with a build/assemble motion (registry has `grid-card-assemble`, `stagger-cascade`)
- Why it matches: uses the actual real list of things we hand-built this session as the content, not a generic icon set

**Shot 3 — The proof**
- Concept: backing up the hook's 380 claim with the specific, checkable overlaps
- Real shape: the same object shown twice — our hand-built version next to the registry's version, for the same thing
- Device: a tile grid revealing named items (registry has `dynamic-grid`, `grid-pixelate-wipe`, `wordmark-tiles`) surfacing `code-snippet-apple-terminal-*`, `count-up`, and `scan-band` by name
- Why it matches: the hook already made the claim, this shot's job is proof, not a second reveal — showing the actual named overlaps is what makes 380 credible instead of just asserted

**Shot 4 — The honest gap**
- Concept: staying honest about what's still missing, not overselling the pivot
- Real shape: the one empty slot in an otherwise full wall
- Device: reuse Shot 3's grid device with one slot visibly empty where a cycle/loop icon would sit; our own `CycleWheel` makes a cameo labeled "still hand-built"
- Why it matches: shows the gap in the same visual system used to show abundance, rather than just stating it in voiceover

**Shot 5 — Close / CTA**
- Concept: the channel switching production tools, inviting people to follow the process
- Real shape: a handoff moment, old tool to new tool
- Device: a real follow-CTA primitive (`instagram-follow`, `cta-close`, `cta-lockup` are real registry items) rather than a generic text card
- Why it matches: matches the platform's own follow mechanic directly; **follow-only CTA, no comment-keyword gate** — per standing rule, this channel is effectively back at zero confirmed follows post-pivot, same condition that rule was written for

## Open decisions for the actual HyperFrames build step (not yet made)

- Exact registry item names to install (`hyperframes add <name>`) are proposed above, not confirmed — the intent-interview process may surface better-fitting options once it runs.
- Voice/VO generation path: confirm whether this episode reuses the existing ElevenLabs
  `.env` voice ID (same voice continuity as every prior episode) or HyperFrames' own TTS step —
  recommend keeping the existing voice for continuity, to be confirmed before recording.
- Aspect ratio / duration: 1080x1920 vertical, ~50s, matching every prior episode's spec — no
  reason to deviate.
