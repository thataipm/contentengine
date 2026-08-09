"""
Generate VO audio via the ElevenLabs API using the channel's voice clone.

Usage:
    py generate_vo.py "text to speak" output.mp3
    py generate_vo.py --file script.txt output.mp3
    py generate_vo.py --file script.txt output.mp3 --timestamps

With --timestamps, uses the /with-timestamps endpoint instead of the plain
TTS endpoint and writes a companion output.timestamps.json with per-character
alignment (characters[], character_start_times_seconds[],
character_end_times_seconds[]) alongside the audio. Use this instead of
hand-estimating word timing from position-in-sentence / speaking pace, see
automation/derive_word_timing.py for turning this into shot-cut points and
per-word born frames.

Credentials come from .env at the repo root (ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID),
never hardcode them here.
"""

import argparse
import base64
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(REPO_ROOT / ".env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID")
MODEL_ID = "eleven_v3"


def generate_vo(text: str, output_path: Path, with_timestamps: bool = False) -> None:
    if not API_KEY or not VOICE_ID:
        sys.exit("Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env")

    suffix = "/with-timestamps" if with_timestamps else ""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}{suffix}"
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
    }
    body = {
        "text": text,
        "model_id": MODEL_ID,
    }

    response = requests.post(url, headers=headers, json=body, timeout=120)
    if response.status_code != 200:
        sys.exit(f"ElevenLabs API error {response.status_code}: {response.text[:500]}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if with_timestamps:
        data = response.json()
        audio_bytes = base64.b64decode(data["audio_base64"])
        output_path.write_bytes(audio_bytes)
        print(f"Wrote {output_path} ({len(audio_bytes)} bytes)")

        timestamps_path = output_path.with_suffix("").with_suffix(".timestamps.json")
        timestamps_path.write_text(json.dumps(data["alignment"], indent=2), encoding="utf-8")
        print(f"Wrote {timestamps_path}")
    else:
        output_path.write_bytes(response.content)
        print(f"Wrote {output_path} ({len(response.content)} bytes)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", dest="script_file", help="Read text from this file instead of the text argument")
    parser.add_argument("--timestamps", action="store_true", help="Fetch character-level alignment via /with-timestamps")
    parser.add_argument("text", nargs="?", help="Text to speak (omit if using --file)")
    parser.add_argument("output", help="Output audio path")
    args = parser.parse_args()

    if args.script_file:
        script_text = Path(args.script_file).read_text(encoding="utf-8")
    elif args.text:
        script_text = args.text
    else:
        sys.exit("Provide text as an argument, or use --file <path>")

    generate_vo(script_text, Path(args.output), with_timestamps=args.timestamps)
