"""
Turn ElevenLabs character-level alignment (from generate_vo.py --timestamps)
into exact per-shot audio cut points and per-word timing, replacing the old
silencedetect + distance-heuristic boundary matching and the hand-estimated
"word position in sentence / speaking pace" born-frame guesses.

Usage:
    py derive_word_timing.py <script.txt> <timestamps.json> <raw_vo.mp3> <output_dir> [--fps 30]

<script.txt> must be the exact same file passed to generate_vo.py --file,
shots separated by blank lines (one VO line per shot, matching this
project's da1_vo_script.txt convention).

Writes, into <output_dir>:
    shot{N}_vo.wav              - cut audio for that shot
    shot{N}_words.json          - [{word, start_frame, end_frame}, ...] LOCAL
                                   to that shot (frame 0 = shot start)
    shot_boundaries.json        - the raw global cut points, for reference
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def load_alignment(timestamps_path: Path):
    data = json.loads(timestamps_path.read_text(encoding="utf-8"))
    return data["characters"], data["character_start_times_seconds"], data["character_end_times_seconds"]


def split_shots(script_text: str):
    # Same convention as da1_vo_script.txt: one VO line per shot, blank
    # lines between. Keep track of each shot's character span WITHIN THE
    # EXACT TEXT STRING that was sent to the API (Path.read_text() of the
    # whole file, unmodified) so offsets line up with the alignment data.
    shots = []
    cursor = 0
    for line in script_text.split("\n"):
        stripped = line.strip()
        start_idx = script_text.index(line, cursor)
        if stripped:
            shots.append({"text": stripped, "char_start": start_idx, "char_end": start_idx + len(line)})
        cursor = start_idx + len(line) + 1
    return shots


def words_in_span(characters, starts, ends, char_start, char_end):
    """Group characters in [char_start, char_end) into words with start/end times."""
    words = []
    cur_word = ""
    cur_start = None
    for i in range(char_start, char_end):
        c = characters[i]
        if c.strip() == "":
            if cur_word:
                words.append({"word": cur_word, "start": cur_start, "end": ends[i - 1]})
                cur_word = ""
                cur_start = None
            continue
        if cur_start is None:
            cur_start = starts[i]
        cur_word += c
    if cur_word:
        words.append({"word": cur_word, "start": cur_start, "end": ends[char_end - 1]})
    return words


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("script_file")
    parser.add_argument("timestamps_file")
    parser.add_argument("raw_audio")
    parser.add_argument("output_dir")
    parser.add_argument("--fps", type=int, default=30)
    args = parser.parse_args()

    script_text = Path(args.script_file).read_text(encoding="utf-8")
    characters, starts, ends = load_alignment(Path(args.timestamps_file))
    shots = split_shots(script_text)

    if len(characters) != len(script_text):
        sys.exit(
            f"Character count mismatch: alignment has {len(characters)}, "
            f"script text has {len(script_text)}. The timestamps file probably "
            f"wasn't generated from this exact script file."
        )

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Global cut point for shot N = midpoint between shot N's last spoken
    # character's end time and shot N+1's first spoken character's start
    # time, so the natural pause between lines is split evenly rather than
    # all attributed to one side (matches how a human editor would cut on
    # a breath, and avoids clipping either shot's actual speech).
    boundaries = []
    for i, shot in enumerate(shots):
        shot_end_time = ends[shot["char_end"] - 1]
        if i + 1 < len(shots):
            next_start_time = starts[shots[i + 1]["char_start"]]
            cut_after = (shot_end_time + next_start_time) / 2
        else:
            cut_after = shot_end_time + 0.3  # tail padding on the last shot
        boundaries.append(cut_after)

    global_starts = [0.0] + boundaries[:-1]
    global_ends = boundaries

    boundary_report = []
    for i, shot in enumerate(shots):
        shot_num = i + 1
        g_start, g_end = global_starts[i], global_ends[i]
        duration = g_end - g_start

        out_wav = out_dir / f"shot{shot_num}_vo.wav"
        # -ss MUST be an input option (before -i), not an output option
        # (after -i, paired with -to). Confirmed by direct testing
        # (2026-08-05, ffmpeg 8.1.2): with -ss/-to as output options, the
        # afade filter's "st=" reads absolute input PTS, which output
        # seeking here does NOT reset to zero before the segment reaches
        # the filtergraph. So afade's fade-out window (st=duration-0.04,
        # a small number like 7.89s) falls due LONG before the real seeked
        # audio (e.g. starting at input t=37.93s) ever arrives, silencing
        # the entire segment for any shot far into the raw take. Input
        # seeking (-ss before -i) resets PTS correctly, so afade's
        # relative "st=" values land where intended. Use -t (duration),
        # not -to (absolute end time), to pair with input seeking.
        subprocess.run(
            [
                "ffmpeg", "-y", "-ss", f"{g_start:.3f}", "-i", args.raw_audio,
                "-t", f"{duration:.3f}",
                "-af", "afade=t=in:st=0:d=0.03,afade=t=out:st={:.3f}:d=0.04".format(max(duration - 0.04, 0)),
                str(out_wav),
            ],
            check=True, capture_output=True,
        )

        words = words_in_span(characters, starts, ends, shot["char_start"], shot["char_end"])
        local_words = [
            {
                "word": w["word"],
                "start_seconds": round(w["start"] - g_start, 3),
                "end_seconds": round(w["end"] - g_start, 3),
                "start_frame": round((w["start"] - g_start) * args.fps),
                "end_frame": round((w["end"] - g_start) * args.fps),
            }
            for w in words
        ]
        (out_dir / f"shot{shot_num}_words.json").write_text(json.dumps(local_words, indent=2), encoding="utf-8")

        boundary_report.append({
            "shot": shot_num, "text": shot["text"], "global_start": round(g_start, 3),
            "global_end": round(g_end, 3), "duration": round(duration, 3),
            "duration_frames": round(duration * args.fps),
        })
        print(f"shot{shot_num}: {duration:.3f}s ({round(duration*args.fps)} frames @ {args.fps}fps) -> {out_wav.name}")

    (out_dir / "shot_boundaries.json").write_text(json.dumps(boundary_report, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
