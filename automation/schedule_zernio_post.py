"""Schedule an Instagram Reel + YouTube Short post via Zernio's direct API.
Reusable version of the ad-hoc script hand-built twice now (sd1, then
the-karpathy-skill) -- see CLAUDE.md's "Zernio scheduling flow" note.

Gotchas this encodes so they don't get rediscovered:
- scheduledFor is a NAIVE local time string ("2026-08-11T09:00:00"), no
  "Z" suffix, paired with a separate `timezone` IANA name. Don't convert
  to UTC yourself, Zernio does that using the timezone field.
- isDraft: false is sent explicitly even though a fresh POST with
  scheduledFor set shouldn't default to draft, cheap insurance against
  the isDraft-omitted-stays-draft gotcha this project hit once already
  on a PUT (draft-promotion) call.
- mediaItems accepts arbitrary public URLs directly (confirmed against
  Zernio's own docs' `cdn.example.com` examples), no presigned-upload
  step required, our GitHub raw URLs work as-is.
- Instagram's Reel cover goes in platformSpecificData.instagramThumbnail
  (NOT a sibling of mediaItems' url like YouTube's thumbnail field).
- Always verify with GET /v1/posts?status=scheduled after creating,
  a 201 response alone doesn't prove it didn't silently land as draft.
- YouTube tags/keywords have NO field inside platforms[].platformSpecificData
  -- they're a POST-LEVEL `tags` array (sibling of `content`/`platforms`),
  confirmed 2026-08-10 after a real post shipped with title+description but
  an empty tags array. Always pass --yt-tags for a YouTube post; a `#hashtag`
  block at the end of the content field is a separate, additional thing
  (visible in the description) and does not substitute for this field.
- On PUT /v1/posts/{id} (editing an existing post), platforms[].accountId
  must be the plain account ID STRING (e.g. "6a79aacf..."), not the nested
  account object GET returns -- sending the object 400s with
  "expected string, received undefined".

Usage:
  py schedule_zernio_post.py \
    --video-url <github raw mp4 url> \
    --cover-url <github raw cover png url> \
    --ig-account-id <id> --ig-content-file <path to .txt> \
    --yt-account-id <id> --yt-content-file <path to .txt> --yt-title "..." \
    --yt-tags "Claude Code,Cursor AI,AI coding agent,..." \
    --scheduled-for "2026-08-11T09:00:00" --timezone "Asia/Kolkata"
"""
import argparse
import json
import os
import urllib.error
import urllib.request

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
        print(f"[{e.code}] {payload['platforms'][0]['platform']}: {e.read().decode()[:500]}")
        return None


def verify_scheduled(api_key: str):
    req = urllib.request.Request(f"{BASE}/posts?status=scheduled", headers={"Authorization": f"Bearer {api_key}"})
    with urllib.request.urlopen(req) as resp:
        body = json.load(resp)
    print("\nVerified scheduled posts:")
    for p in body.get("posts", []):
        plats = [pl.get("platform") for pl in p.get("platforms", [])]
        print(" ", p.get("_id"), plats, p.get("status"), p.get("scheduledFor"), p.get("timezone"))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--video-url", required=True)
    parser.add_argument("--cover-url", required=True)
    parser.add_argument("--ig-account-id")
    parser.add_argument("--ig-content-file")
    parser.add_argument("--yt-account-id")
    parser.add_argument("--yt-content-file")
    parser.add_argument("--yt-title")
    parser.add_argument("--yt-category-id", default="28")
    parser.add_argument("--yt-tags", help="Comma-separated SEO keyword phrases, no # prefix, <=500 chars combined")
    parser.add_argument("--scheduled-for", required=True, help='e.g. "2026-08-11T09:00:00"')
    parser.add_argument("--timezone", required=True, help='IANA name, e.g. "Asia/Kolkata"')
    args = parser.parse_args()

    api_key = os.environ.get("ZERNIO_API_KEY")
    if not api_key:
        raise SystemExit("Set ZERNIO_API_KEY in the environment (see .env)")

    if args.ig_account_id and args.ig_content_file:
        ig_content = open(args.ig_content_file, encoding="utf-8").read()
        post(
            {
                "content": ig_content,
                "mediaItems": [{"type": "video", "url": args.video_url}],
                "platforms": [{
                    "platform": "instagram",
                    "accountId": args.ig_account_id,
                    "platformSpecificData": {"shareToFeed": True, "instagramThumbnail": args.cover_url},
                }],
                "scheduledFor": args.scheduled_for,
                "timezone": args.timezone,
                "isDraft": False,
            },
            request_id=f"ig-schedule-{args.scheduled_for}",
            api_key=api_key,
        )

    if args.yt_account_id and args.yt_content_file:
        yt_content = open(args.yt_content_file, encoding="utf-8").read()
        if not args.yt_tags:
            print("WARNING: no --yt-tags passed -- the post will ship with an empty tags array (title/description alone, no SEO keywords).")
        tags = [t.strip() for t in args.yt_tags.split(",")] if args.yt_tags else []
        post(
            {
                "content": yt_content,
                "tags": tags,
                "mediaItems": [{"type": "video", "url": args.video_url, "thumbnail": args.cover_url}],
                "platforms": [{
                    "platform": "youtube",
                    "accountId": args.yt_account_id,
                    "platformSpecificData": {
                        "title": args.yt_title,
                        "visibility": "public",
                        "madeForKids": False,
                        "categoryId": args.yt_category_id,
                    },
                }],
                "scheduledFor": args.scheduled_for,
                "timezone": args.timezone,
                "isDraft": False,
            },
            request_id=f"yt-schedule-{args.scheduled_for}",
            api_key=api_key,
        )

    verify_scheduled(api_key)


if __name__ == "__main__":
    main()
