"""Mechanically check a rendered episode against the channel's own "Never Let a Frame
Sit" rule (CLAUDE.md 1: no static frame longer than 2s) instead of relying on eyeballing
checkpoint stills, which has missed real violations more than once -- including twice on the
same episode (claude-just-got-68-product-management-skills, 2026-08-11): a 5+ second dead
zone with literally nothing rendered, and after fixing that, a still-frozen 4.6s stretch where
dim placeholder slots had popped in but weren't animating, invisible to eyeballing because
"there's a shot with motion in it" reads as fine even when a big chunk of that shot is static.

Uses ffmpeg's freezedetect filter, which measures actual pixel-level change between frames --
not "is there code that animates something," which can be true while the resulting motion is
too subtle to register as real (found the hard way: a breathe() amplitude of 0.02 on
RepoScreenshot was mathematically active but still read as frozen).

## Calibration notes (read before changing the defaults)

Two things had to be tuned together, both discovered by testing against this episode's own
real violations rather than guessing:

1. **Crop to the content zone first -- and get the bounds right.** This channel's whole visual
   style is a mostly-static dark background (by design) with a small centered content area that
   actually animates. Checking the full frame dilutes any real content motion against a huge
   area of pixels that are SUPPOSED to never change (background grid, watermark, progress bar).
   Default crop is top=150, height=1500 of a 1080x1920 frame -- wide enough to cover both
   ContentZone's typical bounds AND CaptionsPop (rendered at `bottom: 380`, i.e. roughly
   y=1440-1560). Get this wrong in the other direction and the tool produces confident, false
   failures: an earlier version cropped to height=1250 (excluding captions entirely) and
   reported a 4.6s "freeze" on a shot where the captions were changing every word the whole
   time -- several real-looking fix attempts went into the actual content before the crop
   itself turned out to be the bug. If a shot uses non-default ContentZone bounds or a
   repositioned CaptionsPop, override --crop rather than trust the default blindly.
2. **Use ffmpeg's own default noise threshold (-60dB), not a looser one.** Counter-intuitive:
   a MORE NEGATIVE dB value is STRICTER (requires near-pixel-identical frames to call
   "frozen"), a LESS negative value (e.g. -30dB) is LOOSER (calls frames "the same" even with
   real but subtle motion between them) -- backwards from what "loud vs quiet" intuition
   suggests. Testing against this episode found every violation flagged at -60dB (the strict
   end) held up on manual inspection as a genuine, unambiguous freeze; looser thresholds like
   -30dB/-40dB started flagging shots with real, deliberate, visible motion (a blinking
   terminal cursor, a breathing card) as "frozen" too, which isn't a useful signal to gate on.
   If a shot's motion is so subtle it doesn't register even at this loose-relative-to-strict
   default, that's still worth a manual second look, but don't lower the bar to -30dB and
   expect the result to mean the same thing as it did in earlier testing -- recalibrate against
   a known-real violation first, the same way this default was chosen.

Usage:
    py check_static_frames.py <path-to-rendered-mp4> [--threshold-seconds 2] [--noise -60dB]
        [--crop 1080:1250:0:150]

Exit code 0 if no violations found, 1 if any freeze >= threshold-seconds is detected (so this
can gate a "ready to show the user" step, not just advise).
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path


def check_static_frames(video_path: Path, threshold_seconds: float, noise: str, crop: str) -> list[dict]:
    vf = f"crop={crop},freezedetect=n={noise}:d={threshold_seconds}" if crop else f"freezedetect=n={noise}:d={threshold_seconds}"
    result = subprocess.run(
        ["ffmpeg", "-i", str(video_path), "-vf", vf, "-map", "0:v", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    output = result.stderr

    starts = [float(m) for m in re.findall(r"freeze_start:\s*([\d.]+)", output)]
    durations = [float(m) for m in re.findall(r"freeze_duration:\s*([\d.]+)", output)]
    ends = [float(m) for m in re.findall(r"freeze_end:\s*([\d.]+)", output)]

    # freezedetect only emits freeze_duration/freeze_end once the freeze actually ends: a
    # freeze still in progress at end-of-video only ever gets a freeze_start. Report those
    # too (duration = None) rather than silently dropping them.
    violations = []
    for i, start in enumerate(starts):
        if i < len(durations):
            violations.append({"start": start, "duration": durations[i], "end": ends[i]})
        else:
            violations.append({"start": start, "duration": None, "end": None})
    return violations


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("video", help="Path to the rendered .mp4")
    parser.add_argument("--threshold-seconds", type=float, default=2.0)
    parser.add_argument("--noise", default="-60dB", help="ffmpeg freezedetect noise tolerance; more negative = stricter. See module docstring before changing.")
    parser.add_argument("--crop", default="1080:1500:0:150", help="ffmpeg crop=w:h:x:y for the content zone; pass '' to check the full frame (not recommended, see docstring)")
    args = parser.parse_args()

    video_path = Path(args.video)
    if not video_path.exists():
        sys.exit(f"File not found: {video_path}")

    violations = check_static_frames(video_path, args.threshold_seconds, args.noise, args.crop)

    if not violations:
        print(f"PASS: no frame stayed static for {args.threshold_seconds}s+ (noise {args.noise}, crop {args.crop or 'full frame'}).")
        return

    print(f"FAIL: {len(violations)} static-frame violation(s) found (>= {args.threshold_seconds}s, noise {args.noise}, crop {args.crop or 'full frame'}):")
    for v in violations:
        if v["duration"] is not None:
            print(f"  {v['start']:.2f}s -> {v['end']:.2f}s ({v['duration']:.2f}s static)")
        else:
            print(f"  {v['start']:.2f}s -> (still static at end of clip)")
    sys.exit(1)


if __name__ == "__main__":
    main()
