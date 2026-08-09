"""
Generate a short SFX clip via ElevenLabs' sound-generation API.

Usage:
    py generate_sfx.py "a short, subtle digital UI tick" output.mp3 --duration 0.25

Credentials come from .env at the repo root (ELEVENLABS_API_KEY), never
hardcode them here.
"""

import argparse
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(REPO_ROOT / ".env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
URL = "https://api.elevenlabs.io/v1/sound-generation"


def generate_sfx(prompt: str, output_path: Path, duration_seconds: float | None, prompt_influence: float) -> None:
    if not API_KEY:
        sys.exit("Missing ELEVENLABS_API_KEY in .env")

    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    body = {
        "text": prompt,
        "duration_seconds": duration_seconds,
        "prompt_influence": prompt_influence,
    }

    response = requests.post(URL, headers=headers, json=body, timeout=60)
    if response.status_code != 200:
        sys.exit(f"ElevenLabs SFX API error {response.status_code}: {response.text[:500]}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(response.content)
    print(f"Wrote {output_path} ({len(response.content)} bytes)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", help="Text description of the sound effect")
    parser.add_argument("output", help="Output audio path")
    parser.add_argument("--duration", type=float, default=None, help="Duration in seconds (0.5-30), omit to auto-estimate")
    parser.add_argument("--prompt-influence", type=float, default=0.5, help="0-1, higher follows the prompt more strictly")
    args = parser.parse_args()

    generate_sfx(args.prompt, Path(args.output), args.duration, args.prompt_influence)
