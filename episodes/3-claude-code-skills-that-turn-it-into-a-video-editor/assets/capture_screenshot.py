"""Capture a real screenshot of a GitHub repo page and a zoomed crop of
the stars area, via Playwright (headless Chromium). Used for sk1's visual
material -- real screenshots of the actual tools discussed, not a
recreation, per direct instruction.
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

url = sys.argv[1]
out_full = Path(sys.argv[2])
out_zoom = Path(sys.argv[3])
zoom_box = tuple(int(x) for x in sys.argv[4].split(","))  # x,y,w,h

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(1000)
    out_full.parent.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(out_full))
    x, y, w, h = zoom_box
    page.screenshot(path=str(out_zoom), clip={"x": x, "y": y, "width": w, "height": h})
    browser.close()

print(f"wrote {out_full}")
print(f"wrote {out_zoom}")
