"""Schedule an Instagram CAROUSEL post (multiple images) via Zernio's direct API.

Deliberately a SEPARATE script from schedule_zernio_post.py -- does not import from or
modify it. That script is the proven, working single-video-post path; this one is new
and untested against a real carousel payload until the first real post confirms it.

Carousel is Instagram-only -- YouTube has no carousel/multi-image post format, so unlike
schedule_zernio_post.py there is no --yt-* half here.

Real API confirmed via docs.zernio.com/platforms/instagram (2026-08-26):
  mediaItems: [{ "type": "image", "url": "..." }, ...]   up to 10 items, image or video
  mixed, all items should share the same aspect ratio (the first item's ratio sets the
  carousel's presentation format -- this matters, don't mix aspect ratios).

Same standing gotchas as the video script, carried over deliberately:
- scheduledFor is a NAIVE local time string, paired with a separate timezone field.
- isDraft: false sent explicitly.
- Always verify with GET /v1/posts?status=scheduled after creating -- a 201 alone
  doesn't prove it didn't silently land as a draft.

Usage:
  py schedule_zernio_carousel_post.py \
    --image-url <url1> --image-url <url2> ... (2-10 times, in display order) \
    --ig-account-id <id> --ig-content-file <path to .txt> \
    --scheduled-for "2026-08-26T11:00:00" --timezone "Asia/Kolkata"
"""
import argparse
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

BASE = "https://zernio.com/api/v1"


def post(payload: dict, request_id: str, api_key: str) -> dict | None:
    req = urllib.request.Request(
        f"{BASE}/posts",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "x-request-id": request_id,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read())
            print(f"[{resp.status}] {payload['platforms'][0]['platform']}: post {body['post']['_id']}")
            return body
    except urllib.error.HTTPError as e:
        print(f"[{e.code}] {payload['platforms'][0]['platform']}: {e.read().decode()[:800]}")
        return None


def verify_scheduled(api_key: str):
    req = urllib.request.Request(f"{BASE}/posts?status=scheduled", headers={"Authorization": f"Bearer {api_key}"})
    with urllib.request.urlopen(req) as resp:
        body = json.load(resp)
    print("\nVerified scheduled posts:")
    for p in body.get("posts", []):
        plats = [pl.get("platform") for pl in p.get("platforms", [])]
        print(" ", p.get("_id"), plats, p.get("status"), p.get("scheduledFor"), p.get("timezone"),
              "items:", len(p.get("mediaItems", [])))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--image-url", action="append", required=True,
                         help="Repeatable, in display order. 2-10 total.")
    parser.add_argument("--ig-account-id", required=True)
    parser.add_argument("--ig-content-file", required=True)
    parser.add_argument("--scheduled-for", required=True, help='e.g. "2026-08-26T11:00:00"')
    parser.add_argument("--timezone", required=True, help='IANA name, e.g. "Asia/Kolkata"')
    args = parser.parse_args()

    api_key = os.environ.get("ZERNIO_API_KEY")
    if not api_key:
        raise SystemExit("Set ZERNIO_API_KEY in the environment (see .env)")

    if not (2 <= len(args.image_url) <= 10):
        raise SystemExit(f"Carousel needs 2-10 images, got {len(args.image_url)}")

    ig_content = open(args.ig_content_file, encoding="utf-8").read()

    post(
        {
            "content": ig_content,
            "mediaItems": [{"type": "image", "url": u} for u in args.image_url],
            "platforms": [{
                "platform": "instagram",
                "accountId": args.ig_account_id,
                "platformSpecificData": {"shareToFeed": True},
            }],
            "scheduledFor": args.scheduled_for,
            "timezone": args.timezone,
            "isDraft": False,
        },
        request_id=f"ig-carousel-{args.scheduled_for}",
        api_key=api_key,
    )

    verify_scheduled(api_key)


if __name__ == "__main__":
    main()
