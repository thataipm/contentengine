"""Build the channel's profile picture (avatar) and YouTube banner using the
same visual system as the videos (dark grid bg, colorful ACCENTS, Bricolage
Grotesque/Inter). Not part of the Remotion pipeline -- a one-off design
asset, so plain Google Fonts CDN is fine here, same approach as the sk1
LinkedIn carousel build.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

OUT = Path(__file__).parent

ACCENT_PURPLE = "#8C7CFF"
BG_DARK = "#0B0B0E"
INK_LIGHT = "#F5F5F2"
CARD_DIM = "#9A9AA2"

FONTS = "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Inter:wght@500;600;700&display=swap');"

GRID_BG = f"""
  background:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  background-color: {BG_DARK};
"""

# --- Avatar: 800x800, must read clearly as a small circle (IG crops to
# circle; favicon/notification sizes go down to ~32px) -- kept to one bold
# glyph, no fine detail, no small text.
AVATAR_HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>
  {FONTS}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:800px; height:800px; {GRID_BG}
    display:flex; align-items:center; justify-content:center;
  }}
  .mark {{
    font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:340px;
    line-height:1; color:{ACCENT_PURPLE}; text-shadow:0 0 90px {ACCENT_PURPLE}aa, 0 0 30px {ACCENT_PURPLE}cc;
    transform: translate(-9px, -36px);
  }}
</style></head><body><div class="mark">&gt;_</div></body></html>"""

# --- Banner: 2560x1440 canvas. Only the centered 1546x423 "safe area" is
# guaranteed visible across TV/desktop/mobile/tablet crops -- essential
# content (handle, tagline) must stay inside it. Decorative texture can
# extend to the full canvas since it's non-essential if cropped.
SAFE_W, SAFE_H = 1546, 423
BANNER_HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>
  {FONTS}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:2560px; height:1440px; {GRID_BG}
    position:relative; font-family:'Inter', sans-serif;
  }}
  .glow {{ position:absolute; border-radius:50%; filter:blur(80px); opacity:0.35; }}
  .safe {{
    position:absolute; left:{(2560-SAFE_W)//2}px; top:{(1440-SAFE_H)//2}px;
    width:{SAFE_W}px; height:{SAFE_H}px;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px;
  }}
  .handle {{ font-family:'Bricolage Grotesque', sans-serif; font-weight:800; color:{INK_LIGHT}; font-size:88px; }}
  .tagline {{ color:{CARD_DIM}; font-size:32px; font-weight:600; letter-spacing:0.5px; }}
</style></head><body>
  <div class="glow" style="left:60px; top:120px; width:420px; height:420px; background:#8C7CFF;"></div>
  <div class="glow" style="right:80px; top:180px; width:380px; height:380px; background:#FF9B54;"></div>
  <div class="glow" style="left:200px; bottom:100px; width:340px; height:340px; background:#6FE0A0;"></div>
  <div class="glow" style="right:260px; bottom:80px; width:360px; height:360px; background:#5FC4E0;"></div>
  <div class="safe">
    <div class="handle">@thataipm</div>
    <div class="tagline">AI-native product thinking &middot; The AI PM Brief</div>
  </div>
</body></html>"""


def render(html: str, width: int, height: int, out_path: Path):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
        page.set_content(html, wait_until="networkidle")
        page.wait_for_timeout(200)
        page.screenshot(path=str(out_path))
        browser.close()
    print(f"wrote {out_path}")


def main():
    render(AVATAR_HTML, 800, 800, OUT / "avatar.png")
    render(BANNER_HTML, 2560, 1440, OUT / "youtube_banner.png")


if __name__ == "__main__":
    main()
