"""
Run ElevenLabs forced alignment on an ALREADY-CUT shot audio file against
its own known VO line, giving word-level timing local to that exact file
(no boundary-guessing needed, unlike aligning the continuous raw take and
trying to infer per-shot offsets).

Usage:
    py align_shot_audio.py <shot_audio.wav> "<vo line text>" <output.json> [--fps 30]

Requires the forced_alignment permission scope enabled on the API key.
"""

import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(REPO_ROOT / ".env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")


def align(audio_path: Path, text: str, fps: int) -> dict:
    if not API_KEY:
        sys.exit("Missing ELEVENLABS_API_KEY in .env")

    url = "https://api.elevenlabs.io/v1/forced-alignment"
    headers = {"xi-api-key": API_KEY}
    with open(audio_path, "rb") as f:
        files = {"file": (audio_path.name, f, "audio/mpeg")}
        data = {"text": text}
        response = requests.post(url, headers=headers, files=files, data=data, timeout=120)

    if response.status_code != 200:
        sys.exit(f"ElevenLabs API error {response.status_code}: {response.text[:500]}")

    result = response.json()
    words = [
        {
            "word": w["text"],
            "start_seconds": round(w["start"], 3),
            "end_seconds": round(w["end"], 3),
            "start_frame": round(w["start"] * fps),
            "end_frame": round(w["end"] * fps),
            "loss": round(w["loss"], 4),
        }
        for w in result["words"]
        if w["text"].strip()
    ]
    return {"loss": result["loss"], "words": words}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("audio_file")
    parser.add_argument("text")
    parser.add_argument("output_json")
    parser.add_argument("--fps", type=int, default=30)
    args = parser.parse_args()

    result = align(Path(args.audio_file), args.text, args.fps)
    Path(args.output_json).write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Wrote {args.output_json} (overall loss={result['loss']:.4f})")
    for w in result["words"]:
        print(f"  {w['word']!r}: frame {w['start_frame']}-{w['end_frame']} (loss={w['loss']})")
