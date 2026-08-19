# HyperFrames Composition Project

**Trimmed 2026-08-20** — this file was mostly generic HyperFrames scaffold (skill-routing table,
command list, doc pointers) identical across every `hyperframes-<slug>/` project in this repo,
all reproducible via `/hyperframes` or `npx hyperframes docs`. It got reprinted into context 11
times during this one episode's build (a real forensic finding, see
`docs/hyperframes_production_notes.md`'s durable-pitfall entry) at ~7.2KB each. Kept below: only
what's genuinely project-specific or would break composition output if forgotten.

**Doing anything with HyperFrames and don't already know the right skill?** Start at
`/hyperframes` — routes any "make me a video/deck/composition" request to the right workflow.

> **`npm run dev` is a long-running server, not a one-shot command.** Always run it with
> `run_in_background: true` — as a foreground command it will time out and die.

> **Pinned CLI version.** These scripts pin an exact `hyperframes@X.Y.Z` so this project
> re-renders identically over time. To move up: `npx hyperframes@latest upgrade --project .
> --check` (shows the delta), then `npx hyperframes@latest upgrade --project .`.

## Key rules (break composition output if forgotten)

1. Every timed element needs `data-start`, `data-duration`, and `data-track-index`.
2. Elements with timing **MUST** have `class="clip"` — the framework uses this for visibility
   control.
3. Timelines must be paused and registered on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
4. Videos use `muted` with a separate `<audio>` element for the audio track.
5. Sub-compositions use `data-composition-src="compositions/file.html"`.
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches.

**Always run `npm run check` after editing any `.html` composition** — fix all errors before
considering a change done.
