"""Fetch real post-level analytics from Zernio for a given post, or list
all published posts with their analytics. Verified 2026-08-10 against
sd1's real published posts (see docs/experiment_log.md's Analytics
Capture Note for the full corrected finding): the main GET /v1/analytics
endpoint DOES return per-post `follows` and Instagram-specific average
watch time (`igReelsAvgWatchTime`, `igReelsVideoViewTotalTime`), not just
impressions/likes/comments/shares/saves/views -- this corrects an earlier,
overly pessimistic claim in this project's docs. YouTube's own watch-time/
retention data comes from a separate endpoint,
GET /v1/analytics/youtube/video-retention, which needs the video to have
enough views and waits out YouTube's own 2-3 day analytics-processing
delay before returning a non-empty curve.

Usage:
  py fetch_zernio_analytics.py --post-id <zernio_post_id>
  py fetch_zernio_analytics.py --list-published
  py fetch_zernio_analytics.py --youtube-retention <video_id> --account-id <account_id>
"""
import argparse
import json
import os
import urllib.parse
import urllib.request

BASE = "https://zernio.com/api/v1"


def _get(path: str, params: dict, api_key: str) -> dict:
    url = f"{BASE}{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {api_key}"})
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)


def fetch_post_analytics(post_id: str, api_key: str) -> dict:
    return _get("/analytics", {"postId": post_id}, api_key)


def list_published(api_key: str, limit: int = 20) -> dict:
    return _get("/posts", {"status": "published", "limit": limit}, api_key)


def fetch_youtube_retention(video_id: str, account_id: str, api_key: str) -> dict:
    return _get(
        "/analytics/youtube/video-retention",
        {"videoId": video_id, "accountId": account_id},
        api_key,
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--post-id", help="Zernio post ID to fetch analytics for")
    parser.add_argument("--list-published", action="store_true", help="List all published posts")
    parser.add_argument("--youtube-retention", metavar="VIDEO_ID", help="Fetch a YouTube video's retention curve")
    parser.add_argument("--account-id", help="Zernio account ID, required with --youtube-retention")
    args = parser.parse_args()

    api_key = os.environ.get("ZERNIO_API_KEY")
    if not api_key:
        raise SystemExit("Set ZERNIO_API_KEY in the environment (see .env)")

    if args.post_id:
        result = fetch_post_analytics(args.post_id, api_key)
        a = result.get("analytics", {})
        print(f"status: {result.get('status')}  synced: {result.get('syncStatus')}")
        print(f"published: {result.get('publishedAt')}")
        print(f"url: {result.get('platformPostUrl')}")
        print(json.dumps(a, indent=2))
    elif args.list_published:
        result = list_published(api_key)
        for p in result.get("posts", []):
            plats = [pl.get("platform") for pl in p.get("platforms", [])]
            print(p.get("_id"), plats, (p.get("content") or "")[:50])
    elif args.youtube_retention:
        if not args.account_id:
            raise SystemExit("--youtube-retention needs --account-id")
        result = fetch_youtube_retention(args.youtube_retention, args.account_id, api_key)
        print(json.dumps(result, indent=2))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
