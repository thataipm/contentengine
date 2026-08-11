# Scheduled episodes

One file per episode that currently has at least one platform post scheduled (but not yet
published) via Zernio — added 2026-08-11 so scheduled episodes are visible in one place instead
of having to query the Zernio API to check.

**This is an index, not storage.** These files are small manifests (schedule time, Zernio post
IDs, platform status, links back to the real episode). The actual episode folders
(`episodes/{slug}/`) stay exactly where they are — nothing gets moved here, since Zernio holds
the exact `raw.githubusercontent.com/.../episodes/{slug}/build/...` URL for each scheduled post
and needs it to keep resolving until the post actually fires. Moving a folder after scheduling
would break that.

**Lifecycle**: add a file here when a post is scheduled. Once every platform on that file's
episode shows `published` (not just `scheduled`) via `automation/fetch_zernio_analytics.py
--list-published` or a direct `GET /v1/posts?status=published` check, delete the file from
here — the episode's real record lives on in `docs/experiment_log.md` and the episode's own
folder, this index is only for "what's still coming up."

## Format

```
# {Episode title}

**Episode folder**: episodes/{slug}/
**Scheduled**: {local datetime} {timezone} ({UTC datetime})

| Platform | Zernio post ID | Status |
|---|---|---|
| Instagram | {id} | scheduled / published |
| YouTube | {id} | scheduled / published |
```
