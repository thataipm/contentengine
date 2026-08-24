# CC-Agent

A library of standalone mechanical checks for the `@thataipm` HyperFrames pipeline.
**Not an orchestrator** — that part of this directory was archived 2026-08-24. See
"What changed" below before assuming anything about a `start`/`complete`/`status`
dispatch loop, approval tokens, or stage-agent contracts — none of that runs anymore.

## What's actually here

`checks/` — one script per mechanical rule, each independently runnable
(`node checks/<name>.mjs --project-dir hyperframes-<episode> [--docs-root <repo-root>]`).
Most of these are now called directly by
`.claude/skills/thataipm-assemble/scripts/pipeline.mjs`, the real pipeline that runs
every episode:

| Check | Wired into pipeline.mjs? |
|---|---|
| `check_caption_pill_format.mjs` | yes — step 5/20 |
| `check_caption_safe_zone.mjs` | yes — step 6/20 |
| `check_vo_model.mjs` | yes — step 2/20 |
| `check_audio_levels.mjs` | yes — step 2.5/20, warn-only (see its own header for why) |
| `check_transition_idempotency.mjs` | yes — step 8/20 |
| `check_device_variety.mjs` | yes — step 12/20 |
| `check_registry_ratio.mjs` | yes — step 13/20 |
| `check_speedup_applied.mjs` | yes — step 20/20, after the pipeline's own automated speedup |
| `check_raw_urls.mjs` | yes — referenced directly from `thataipm-distribute/SKILL.md` step 4 |

`rules/device-variety-allowlist.json` — the utility-device allowlist `check_device_variety.mjs`
depends on. Keep this in sync with real cross-cutting overlays/transitions as they're added.

## What changed, 2026-08-24

A full architecture and bug-history audit found this directory had grown two things at
once: a set of real, individually-correct mechanical checks, and an orchestrator (state
machine, stage-agent contracts, approval tokens, episode manifests) that no episode had
ever actually shipped through — git history shows every real episode going through
`.claude/skills/thataipm-*` and `pipeline.mjs` directly. A half-built parallel QA system
sitting unreferenced is worse than not building it: it creates the impression — for a
future session, or for anyone skimming this repo — that these checks are protecting
production when they aren't wired to anything that runs.

The decision: keep the individually-working checks, wire the ones worth gating on
directly into `pipeline.mjs` (the real spine), and archive the orchestrator machinery
that was never actually load-bearing. Nothing here was deleted — full content lives in
`archive/CC-Agent-orchestrator/`:

- `orchestrator/` — state machine, rules engine, manifest store (`start`/`complete`/`status`).
- `agents/` — the seven stage-agent contracts.
- `schema/` — manifest and rules-registry JSON Schemas.
- `manifests/` — real per-episode state records from its two proven runs (`topic_script`/`fact_check` stages only).
- `rules/rules.json` — the full rules registry (the individual check scripts above don't read this file at runtime; it only informed which checks got built).
- `docs/ARCHITECTURE.md` — the full original design doc.
- `checks/adapters/` — orchestrator-format adapters wrapping the real `thataipm-*` scripts.
- `checks/check_hyperframes_clean.mjs`, `check_sfx_presence.mjs` — standalone extractions of gates `pipeline.mjs` already runs natively; redundant outside the orchestrator's single-rule-call pattern.
- `checks/mint_approval_token.mjs` / `check_publish_approval.mjs`, `checks/mint_preview_approval.mjs` / `check_preview_reviewed.mjs` — a token-based confirmation lock, built for an *unattended* dispatcher. This channel's real publish gate is a human reading the stated plan in chat and replying — already used correctly every time this session — and `CLAUDE.md` §7 records that autonomous production automation was tried and explicitly stopped as a deliberate choice. These tokens solve a problem this project doesn't have yet; revisit if that changes.
- `checks/check_dense_frame_extraction.mjs` — honestly-scoped and well-designed (verifies a dense `/watch` pass happened at real density, not whether it was correct), but depends on `renders/dense_verification.json`, which nothing in the current `thataipm-*` workflow writes. Worth reviving once something writes that file — not wired in without it, since it would fail every real episode today for a missing file, not a real gap.
- `.claude/skills/cc-agent-stage/` — the dispatch procedure (`start`/dispatch subagent/`complete`) that drove the orchestrator above. Archived alongside it at `archive/CC-Agent-orchestrator/skills/cc-agent-stage/` since it has nothing left to dispatch to.

If this project's repackaging plan (see `CLAUDE.md`'s "Repackaging intent" note) reaches
the point of running unattended for other customers, the orchestrator and approval-token
machinery in `archive/CC-Agent-orchestrator/` is the right starting point — it was real,
working design, just built ahead of the need for it.

## Adding a new check

Follow the existing scripts' shape: `--project-dir` (+ `--docs-root` if it needs
`docs/hyperframes_production_notes.md`), plain stdout progress lines, `process.exit(0)`
on PASS / `process.exit(1)` on FAIL. Wire it into `pipeline.mjs` directly if it should
gate every episode; leave it standalone here if it's situational.
