# Cline carousel test — scheduled

First real carousel post via `automation/schedule_zernio_carousel_post.py` (new, separate
script — does not touch `schedule_zernio_post.py`). Instagram only, 8 images.

**Scheduled**: 2026-08-26T11:00:00 Asia/Kolkata (2026-08-26T05:30:00.000Z)

| Platform | Zernio post ID | Status | Items |
|---|---|---|---|
| Instagram | 6a8d6bb58fe50ff5ca77c901 | scheduled | 8 |

Verified via `GET /v1/posts?status=scheduled` — real `scheduled` status, not a silent draft,
item count matches.
