"""Untrack an episode's build/*.mp4 + cover PNG from git once its Zernio posts have been
published for at least 2 days.

Added 2026-08-21, direct instruction ("automatically delete episodes from git after 2 days
of posting it"). This does the CHEAP, SAFE half of that ask: git rm --cached on files whose
Zernio posts confirm status=published and are 2+ days old. It does NOT rewrite git history --
untracking still leaves the old blob reachable in past commits (see CLAUDE.md's Data-removal
practice note). Reclaiming that space is a separate, heavier operation
(git filter-repo + force-push) that should stay a deliberate, occasional manual step, not
something this script re-runs on every scheduled trigger -- rewriting all commit hashes and
force-pushing on a recurring automated cadence would be far more disruptive than the git
history bloat it's solving. Run that manually every so often instead
(see the filter-repo invocation logged in git history around 2026-08-21).

Never assumes a post is published from time passing alone -- always confirmed against the
real Zernio API, same standing rule as the manual process this replaces.

Usage:
  py untrack_published_episodes.py                 # do it
  py untrack_published_episodes.py --dry-run        # report only, no git changes, no push
"""
import argparse
import json
import os
import re
import subprocess
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

import urllib.request

BASE = "https://zernio.com/api/v1"
REPO_ROOT = Path(__file__).resolve().parent.parent
GRACE_DAYS = 2


def zernio_get(path, api_key):
    req = urllib.request.Request(f"{BASE}{path}", headers={"Authorization": f"Bearer {api_key}"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def extract_slug(post):
    psd = post.get("platformSpecificData", {}) or {}
    candidates = [psd.get("instagramThumbnail") or ""]
    for m in post.get("mediaItems", []) or []:
        candidates.append(m.get("url") or "")
        candidates.append(m.get("instagramThumbnail") or "")
    for c in candidates:
        m = re.search(r"episodes/([^/]+)/", c)
        if m:
            return m.group(1)
    return None


def run(cmd, dry_run):
    print(f"  $ {' '.join(cmd)}")
    if dry_run:
        return
    subprocess.run(cmd, cwd=REPO_ROOT, check=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    api_key = os.environ.get("ZERNIO_API_KEY")
    if not api_key:
        raise SystemExit("Set ZERNIO_API_KEY in the environment (see .env)")

    data = zernio_get("/posts?status=published&limit=200", api_key)
    posts = data.get("posts", data.get("data", data if isinstance(data, list) else []))

    now = datetime.now(timezone.utc)
    slug_dates = defaultdict(list)
    for p in posts:
        slug = extract_slug(p)
        if not slug:
            continue
        sched = p.get("scheduledFor") or p.get("publishedAt")
        if not sched:
            continue
        try:
            pdate = datetime.fromisoformat(sched.replace("Z", "+00:00"))
        except ValueError:
            continue
        slug_dates[slug].append(pdate)

    eligible = []
    for slug, dates in slug_dates.items():
        # Use the MOST RECENT platform's publish date -- an episode isn't eligible until
        # every platform (not just the first one to post) has cleared the grace window.
        latest = max(dates)
        days_ago = (now - latest).days
        if days_ago >= GRACE_DAYS:
            eligible.append((slug, days_ago))

    if not eligible:
        print("No episodes past the 2-day grace window with tracked build files.")
        return

    any_changes = False
    for slug, days_ago in sorted(eligible, key=lambda x: -x[1]):
        build_dir = f"episodes/{slug}/build"
        tracked = subprocess.run(
            ["git", "ls-files", build_dir], cwd=REPO_ROOT, capture_output=True, text=True
        ).stdout.strip().splitlines()
        if not tracked:
            continue  # already untracked, nothing to do

        print(f"\n{slug} — published {days_ago}d ago, still tracked: {tracked}")
        run(["git", "rm", "--cached", *tracked], args.dry_run)
        any_changes = True

        scheduled_index = REPO_ROOT / "episodes" / "scheduled" / f"{slug}.md"
        if scheduled_index.exists():
            print(f"  removing stale scheduled-index entry: {scheduled_index}")
            if not args.dry_run:
                scheduled_index.unlink()
                run(["git", "add", f"episodes/scheduled/{slug}.md"], args.dry_run)

    if not any_changes:
        print("\nNothing to untrack -- every eligible episode is already clean.")
        return

    if args.dry_run:
        print("\n--dry-run: no commit, no push.")
        return

    run(
        ["git", "commit", "-m", "Untrack published episode build files past the 2-day grace window\n\nAutomated via automation/untrack_published_episodes.py."],
        args.dry_run,
    )
    run(["git", "push"], args.dry_run)
    print("\nDone.")


if __name__ == "__main__":
    sys.exit(main())
