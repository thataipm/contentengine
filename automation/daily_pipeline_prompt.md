You are running the daily unattended production cycle for the @thataipm content pipeline
(That AI PM v2.0). CLAUDE.md and docs/thataipm_content_system_operating_spec_v2.md are already
in your context via project auto-discovery -- read them fully before doing anything else if you
haven't internalized them yet. This prompt gives today's specific task; the project files are
the source of truth for how to do it.

**You are running unattended. Nobody is watching this session and nobody can answer a
question. If you are genuinely blocked (a decision only a human can make, missing information
only the user has, e.g. the still-blocked SenseBug AI concept), stop, send ONE PushNotification
explaining the blocker, and end the session. Do not guess at things a human needs to decide.**

## Task

1. Read `docs/experiment_log.md`. Look for a concept in the current batch with
   `gate_result: PASS` that has not yet been produced (no episode folder / not marked produced
   in `next_action`). If one exists and isn't blocked on user-provided information, produce it
   (skip to step 3).

2. If nothing is ready, generate 2-3 fresh topic candidates:
   - Pull from `docs/experiment_log.md`'s "Notes" section reserve list first if anything there
     is still viable (re-verify facts, tools/products may have changed since it was reserved).
   - Otherwise research new candidates for whichever pillar has been produced least in the last
     30 days of episodes (check `episodes/` folder dates), per
     `docs/thataipm_content_system_operating_spec_v2.md` §3's 35/30/20/15 split.
   - Score every candidate against the Strategic Quality Gate (`docs/experiment_log.md`'s
     sub-schema: pillar_fit, audience_fit, 100k_test, pm_question, originality, payoff,
     brand_value, worth_producing, gate_result). Only proceed with a concept that scores PASS
     outright or PASS after a REFRAME. If everything you generate today fails the gate, do not
     lower the bar to hit the daily cadence -- treat that as the blocked case in the note above.
   - Do NOT pick "I built an AI tool because bug priority is political, not factual" (SenseBug
     AI) or any other concept explicitly marked as blocked on user-provided details in
     `docs/experiment_log.md` -- skip those, they need a live conversation with the user first.

3. **Before writing a single word of script, independently verify every specific statistic
   against its actual primary source.** WebFetch the real cited page and confirm the number is
   literally printed there -- a research pass's citation is not proof, see CLAUDE.md §7's
   "Fabricated-stat incident" for exactly what goes wrong when this step is skipped. Drop or
   reframe any claim that doesn't hold up under direct verification. A well-known,
   independently-checkable fact (a GitHub star count via `gh api`, a documented API behavior)
   doesn't need this treatment; a specific number from a research pass does.

4. Write the VO script. Run it through the `humanizer` skill's actual draft-audit-final loop
   (invoke the skill, don't just eyeball it) before locking it in. No em dashes, ever.

5. Produce the full episode against the approved script:
   - `automation/generate_vo.py --file <script> <output> --timestamps` (ElevenLabs)
   - `automation/derive_word_timing.py` to cut per-shot audio + word timing
   - Gather any real assets needed (`automation/capture_product_screenshot.py` for a real
     product page, real logos via `github.com/<org>.png` or press kit -- never a placeholder
     or invented number/screenshot)
   - Build Remotion shots reusing the established shared components in `remotion/src/components/`
     (`ComparisonCard`, `DisparityBar`, `TrendChart`, `RepoScreenshot`/`ProductScreenshot`,
     `CaptionsPop`, `ContentZone`, `Sfx`) and `motion.ts`'s `springIn`/`breathe`/`edgeFadeVolume`.
     Apply the channel's "Never Let a Frame Sit" (no static frame >2s) and "vary composition,
     not just motion" rules FROM THE START when designing each shot -- don't ship something
     static and wait for feedback to fix it, that lesson is already paid for, see the
     `feedback-vary-composition-not-just-motion` memory pattern documented in CLAUDE.md.
   - `npx tsc --noEmit` in `remotion/`, fix any type errors before rendering.
   - Render, verify via checkpoint stills at a few points (especially anything with a long VO
     beat -- confirm real motion, not a static hold).
   - `ffmpeg -af volumedetect -f null -` sanity check on the final audio (expect normal speech
     levels, not near-silence).
   - Render the cover image (`npx remotion still`).
   - Write `episodes/{slug}/assets/captions.md`: genuinely distinct copy per platform
     (Instagram/LinkedIn/YouTube), not the VO script reused or lightly paraphrased. YouTube needs
     real SEO-considered title/description AND a real tags list -- see
     `automation/schedule_zernio_post.py`'s docstring for the gotcha (tags are a post-level
     field, not inside platformSpecificData, and a `#hashtag` block in the description is a
     separate, additional thing).
   - Use the full-title slug convention for the episode folder and internal filenames
     (`episodes/{full-title-slug}/`, `remotion/src/episodes/{full-title-slug}/`,
     `remotion/public/{full-title-slug}/`), no short codes.

6. `git add`, commit (a real, specific commit message describing what was produced and why),
   and `git push origin main`. Verify the `raw.githubusercontent.com` URLs for the final video
   and cover actually serve the pushed files (`curl -I`, `Content-Length` matches the local file
   exactly) before considering the episode done.

7. Update `docs/experiment_log.md`: mark the concept produced, note it's ready for scheduling
   (not scheduled), and add its Quality Gate block if it was a freshly-generated concept from
   step 2.

8. **Do not call `automation/schedule_zernio_post.py`. Do not make any Zernio API call at all.**
   Publishing requires the user's explicit go-ahead in a live session, no exception, regardless
   of how good today's episode turned out.

9. Propose a suggested post time: pick a time inside a strong Instagram/YouTube Shorts
   engagement window -- roughly late morning (11am-1pm IST) or evening (7-9pm IST) on weekdays,
   landing off the exact hour/half-hour mark -- for the next day that doesn't already have a
   pending scheduled post (check `GET /v1/posts?status=scheduled` via the pattern in
   `automation/fetch_zernio_analytics.py`/`schedule_zernio_post.py` if credentials are
   available; otherwise just propose tomorrow at a reasonable slot).

10. Write exactly one line summarizing the outcome to `automation/logs/latest_result.txt`
    (overwrite any previous content -- this file is read by the wrapper script immediately
    after you exit, to show a Windows notification). Keep it under 200 characters, no markdown:
    - Success: "Episode ready: <short title>. Suggested post: <date/time>. Review before
      scheduling."
    - Blocked/nothing producible: a specific, actionable one-line reason (e.g., "No batch
      concept ready; 3 candidates researched today, all failed the Quality Gate on
      audience_fit" or "SenseBug AI still needs real details from you, nothing else was ready
      to produce").
    - This is the ONLY notification mechanism for this run -- do not also call the
      `PushNotification` tool, it's unreliable from an unattended headless session with no
      active Claude Code terminal or Remote Control connection.

## Hard limits (do not do these under any circumstances)

- Never call any Zernio endpoint that publishes or schedules a post.
- Never force-push, `git reset --hard`, or delete anything outside the episode folder you're
  actively producing.
- Never invent a statistic, screenshot, quote, or capability. If you can't verify it, cut it.
- Never lower the Strategic Quality Gate bar to force a daily output.
- Never touch `episodes/the-karpathy-skill/` or `episodes/the-ai-pm-pay-gap/` -- both are
  already produced/scheduled; this run is about the NEXT concept.
