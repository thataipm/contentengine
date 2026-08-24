---
name: thataipm-distribute
description: "Take a finished, approved @thataipm episode render to publish-ready: cover still, genuinely distinct platform captions (Instagram/LinkedIn/YouTube), GitHub push, and Zernio scheduling. Use only after the video itself has been reviewed and approved. Always stops for explicit user confirmation before the actual Zernio schedule call — never auto-publishes."
---

# thataipm-distribute: cover, captions, push, schedule

## Hard gate — read this first

**Scheduling or publishing a post is a "send on the user's behalf" action.** Per
this project's own standing rule (`CLAUDE.md`'s Posting automation note), even a
fully automated pipeline prepares and queues, it does not fire without an explicit
go-ahead per post. Everything through step 4 below (cover, captions, git push, URL
verification) can run without asking. **Step 5 (the actual Zernio schedule call)
requires stating the exact post content, platforms, and scheduled time, then
waiting for explicit confirmation before running it.** This is not optional and
not implied by an earlier general approval — confirm per episode.

## Steps

1. **Only start once the video is approved.** Don't build distribution assets
   against a render that hasn't been reviewed yet — this channel's established
   pattern is video approval first, distribution second, as two separate gated
   steps.

2. **Design a real cover composition — never just grab a timeline frame.**
   (Standing rule, locked 2026-08-15, direct instruction: "enforce designing a
   creative cover for videos.") A frame lifted from the timeline is built to
   read as part of a moving sequence, not as a still — it's usually a mid-word
   caption, a half-landed reveal, or an otherwise arbitrary instant, and it
   never earns its own composition the way a real title card does.

   Build a dedicated, purpose-designed cover instead: real episode title
   (large, bold, one word accented in the episode's palette), a kicker line,
   real brand/product logos relevant to the episode content laid out in
   glowing bordered tiles (not a generic icon), and the comment-keyword CTA —
   composed as its own static beat, not sampled from motion. Concretely:
   1. Back up the project's `index.html` (it's the source for the real
      shipped video, don't lose it): `cp index.html index.html.bak`.
   2. Temporarily replace `index.html` with a small standalone composition
      (own `#root`, own `data-duration` ~1.5s, no `<template>` wrapper — see
      `hyperframes-core`'s standalone-root form) containing the real designed
      cover markup.
   3. Snapshot it: `npx hyperframes@<pinned-version> snapshot <project> --at 0.7 -o <project>/renders/cover_candidates --no-end`.
   4. Restore the real `index.html`: `mv index.html.bak index.html` —
      **always restore before doing anything else**, this file is the actual
      video's source of truth.
   5. Save the result as `episodes/<slug>/build/<slug>_cover.png`.

   This only touches `index.html` locally and briefly; the already-rendered
   `build/*.mp4` is unaffected either way. See
   `hyperframes-5-ways-to-make-money-with-ai`'s cover for a reference
   implementation (title + 5 real platform logo tiles + CTA).

3. **Write platform captions.** Three genuinely distinct sections in
   `episodes/<slug>/assets/captions.md` (`## Instagram`, `## LinkedIn`,
   `## YouTube (Shorts)`) — fresh copy per platform, not the VO script reused or
   paraphrased. Then lint:
   ```bash
   node .claude/skills/thataipm-distribute/scripts/lint_captions.mjs \
     --captions episodes/<slug>/assets/captions.md
   ```
   Checks, PASS/FAIL: zero em/en dashes anywhere, and pairwise word-overlap
   similarity between every platform pair under 50% (this channel's own standing
   rule — even paraphrasing the same sentences counts as "same"; this exact
   threshold has already caught a real too-similar Instagram/YouTube pair in a
   shipped episode, so trust a FAIL here). Rewrite the more similar one and
   re-run until PASS.

4. **Push and verify.** Force-add the episode's `build/*.mp4` + cover PNG despite
   `.gitignore` (Zernio needs a real public GitHub-raw URL), push, then run the real
   gate instead of an ad-hoc curl (this was a hand-typed step before 2026-08-24, now
   a script — same check, PASS/FAIL instead of eyeballing a status line):
   ```bash
   node CC-Agent/checks/check_raw_urls.mjs \
     --video-url <github-raw-mp4-url> --cover-url <github-raw-png-url>
   ```
   Zernio can't retry a broken URL later, so this must PASS before step 5. Untrack
   these files from git only once Zernio confirms the post as `published` (not just
   `scheduled`) in a later session, per `CLAUDE.md`'s data-removal practice — never
   before.

5. **STOP. State the plan, then wait for confirmation.** Before calling
   `automation/schedule_zernio_post.py`, tell the user exactly: which platforms,
   the scheduled date/time + timezone, the video/cover URLs, and a one-line
   summary of each platform's caption. Only after explicit confirmation, run:
   ```bash
   py automation/schedule_zernio_post.py \
     --video-url <github-raw-mp4-url> --cover-url <github-raw-png-url> \
     --ig-account-id <id> --ig-content-file <ig-caption-file> \
     --yt-account-id <id> --yt-content-file <yt-caption-file> \
     --yt-title "<title>" --yt-tags "<tags>" \
     --scheduled-for <naive-local-datetime> --timezone <IANA-tz>
   ```
   The script already encodes the real Zernio gotchas (naive local time + separate
   timezone field, `isDraft: false` sent explicitly, Instagram thumbnail nested
   under `platformSpecificData`, YouTube tags as a POST-level field). **Always**
   verify afterward with `GET /v1/posts?status=scheduled` — a 201 alone doesn't
   prove it didn't silently land as a draft.

6. **Log it.** Add an entry to `episodes/scheduled/` per that folder's README
   format, and remove it once every platform shows `published`.

## Non-goals

- Does not decide episode topics or run the Quality Gate — that's a separate,
  human-approved step per `docs/experiment_log.md`.
- Does not touch the render itself — that's `/thataipm-assemble`.
- Never runs the actual Zernio schedule call without a fresh, explicit
  confirmation for that specific episode.
