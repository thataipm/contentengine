"""Capture a real screenshot of a product's public page (a showcase/
gallery/pricing page, NOT a login-gated dashboard) via Playwright
(headless Chromium), plus an optional zoomed crop of one real detail
(a price, a rating, a generated-result thumbnail). Generalizes
episodes/sk1/assets/capture_screenshot.py (which was GitHub-specific) for
Tool Showdowns, where the subject is any product's own site.

This only reaches PUBLIC pages -- no login, no credentials, no scripted
interaction with an authenticated account. If the real content needed is
behind a login (e.g. an actual in-progress generation), that's a manual
capture: use the tool yourself and hand off the screenshot/recording.

Usage:
  py capture_product_screenshot.py <url> <out_full.png> [--zoom out_zoom.png --zoom-box x,y,w,h] [--wait ms]
"""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument("url", help="Public page URL to capture (no login required).")
parser.add_argument("out_full", help="Output path for the full-page screenshot.")
parser.add_argument("--zoom", help="Output path for a zoomed crop, if --zoom-box is also given.")
parser.add_argument("--zoom-box", help="Crop region as x,y,w,h in the captured page's own pixel coordinates.")
parser.add_argument("--wait", type=int, default=1000, help="Extra settle time in ms after page load, for animated/lazy content (default 1000).")
parser.add_argument("--viewport", default="1280,900", help="Viewport size as width,height (default 1280,900, matching sk1's existing captures).")
args = parser.parse_args()

vw, vh = (int(x) for x in args.viewport.split(","))
out_full = Path(args.out_full)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": vw, "height": vh}, device_scale_factor=2)
    try:
        page.goto(args.url, wait_until="networkidle", timeout=30000)
    except Exception:
        # Some sites (trackers, chat widgets, ongoing polling) never truly go
        # idle. Fall back to "load" plus the extra --wait settle time instead
        # of failing the whole capture.
        page.goto(args.url, wait_until="load", timeout=30000)
    page.wait_for_timeout(args.wait)
    out_full.parent.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(out_full))
    print(f"wrote {out_full}")

    if args.zoom and args.zoom_box:
        x, y, w, h = (int(v) for v in args.zoom_box.split(","))
        out_zoom = Path(args.zoom)
        out_zoom.parent.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(out_zoom), clip={"x": x, "y": y, "width": w, "height": h})
        print(f"wrote {out_zoom}")

    browser.close()
