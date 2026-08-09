"""Build the sd1 LinkedIn carousel: 6 static slides reusing the video's own
visual system and real, sourced facts. Same technique as sk1's carousel
(episodes/sk1/assets/linkedin_carousel/build_slides.py) -- one-off design
asset, plain Google Fonts CDN, not part of the deterministic Remotion
pipeline.
"""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import PIL.JpegImagePlugin  # noqa: F401 -- registers the JPEG codec PdfImagePlugin needs internally

ROOT = Path(__file__).parent
LOGOS = ROOT.parent / "logos"
OUT = ROOT

ACCENT_PURPLE = "#8C7CFF"   # ElevenLabs
ACCENT_ORANGE = "#FF9B54"   # Murf
ACCENT_GREEN = "#6FE0A0"    # WellSaid / payoff
BG_DARK = "#0B0B0E"
INK_LIGHT = "#F5F5F2"
CARD_BG = "#17171B"
CARD_BORDER = "#2C2C32"
CARD_DIM = "#9A9AA2"


def logo_b64(name: str) -> str:
    data = (LOGOS / name).read_bytes()
    return f"data:image/png;base64,{base64.b64encode(data).decode()}"


BASE_CSS = f"""
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Inter:wght@500;600;700&display=swap');
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    width: 1080px; height: 1080px; overflow: hidden;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 64px 64px;
    background-color: {BG_DARK};
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif;
    position: relative;
  }}
  .accent {{ font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; }}
  .watermark {{
    position: absolute; left: 50%; bottom: 46px; transform: translateX(-50%);
    color: {CARD_DIM}; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;
  }}
  .pagebadge {{
    position: absolute; top: 46px; right: 56px;
    color: {CARD_DIM}; font-size: 20px; font-weight: 600;
  }}
  .bestfor {{
    padding: 8px 20px; border-radius: 999px; font-size: 18px; font-weight: 700; color: {INK_LIGHT};
  }}
"""


def slide(body_html: str, page_label: str = "") -> str:
    badge = f'<div class="pagebadge">{page_label}</div>' if page_label else ""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}</style></head>
<body>{badge}{body_html}<div class="watermark">@thataipm</div></body></html>"""


def tool_slide(page_no: int, logo_file: str, name: str, best_for: str, stat_value: str, stat_label: str, accent: str) -> str:
    return slide(f"""
      <div style="display:flex;flex-direction:column;align-items:center;gap:32px;width:900px;">
        <img src="{logo_b64(logo_file)}" style="width:72px;height:72px;border-radius:16px;" />
        <div class="accent" style="color:{INK_LIGHT};font-size:48px;">{name}</div>
        <div class="bestfor" style="border:1.5px solid {accent};background:{accent}22;">BEST FOR: {best_for}</div>
        <div style="text-align:center;margin-top:20px;">
          <div class="accent" style="color:{accent};font-size:84px;text-shadow:0 0 40px {accent}55;">{stat_value}</div>
          <div style="color:{INK_LIGHT};font-size:26px;font-weight:600;margin-top:10px;max-width:700px;">{stat_label}</div>
        </div>
      </div>
    """, page_label=f"{page_no} / 6")


SLIDES = []

# Slide 1: cover
SLIDES.append(slide(f"""
  <div style="display:flex;flex-direction:column;align-items:center;gap:28px;width:860px;text-align:center;">
    <div class="accent" style="color:{INK_LIGHT};font-size:60px;line-height:1.15;">Best AI Tools<br/>for <span style="color:{ACCENT_PURPLE};">Voiceovers</span></div>
    <div style="color:{CARD_DIM};font-size:26px;font-weight:600;">3 tools. 3 completely different reasons to pick one.</div>
    <div style="display:flex;gap:14px;margin-top:12px;">
      <img src="{logo_b64('elevenlabs.png')}" style="width:56px;height:56px;border-radius:12px;border:1px solid {CARD_BORDER};" />
      <img src="{logo_b64('murf.png')}" style="width:56px;height:56px;border-radius:12px;border:1px solid {CARD_BORDER};" />
      <img src="{logo_b64('wellsaid.png')}" style="width:56px;height:56px;border-radius:12px;border:1px solid {CARD_BORDER};" />
    </div>
    <div style="color:{CARD_DIM};font-size:22px;font-weight:600;margin-top:18px;">swipe for real pricing &rarr;</div>
  </div>
""", page_label="1 / 6"))

# Slide 2: ElevenLabs
SLIDES.append(tool_slide(2, "elevenlabs.png", "ElevenLabs", "Cloning your own voice", "$6/mo", "Instant voice cloning + commercial rights included", ACCENT_PURPLE))

# Slide 3: Murf
SLIDES.append(tool_slide(3, "murf.png", "Murf", "Studio-style control", "$1,000+/yr", "Voice cloning is Enterprise-only", ACCENT_ORANGE))

# Slide 4: WellSaid
SLIDES.append(tool_slide(4, "wellsaid.png", "WellSaid", "Budget pick, no cloning needed", "$10/mo", "Full commercial rights, hundreds of pre-built voices", ACCENT_GREEN))

# Slide 5: recap table
rows = [
    ("ElevenLabs", "Clone your voice", "$6/mo", ACCENT_PURPLE),
    ("Murf", "Studio control", "$1,000+/yr for cloning", ACCENT_ORANGE),
    ("WellSaid", "Budget, no cloning", "$10/mo", ACCENT_GREEN),
]
row_html = ""
for name, best, price, color in rows:
    row_html += f"""<div style="display:flex;align-items:center;justify-content:space-between;width:820px;padding:20px 28px;border-radius:16px;background:{CARD_BG};border:1px solid {CARD_BORDER};margin-bottom:16px;">
      <div class="accent" style="color:{color};font-size:28px;width:220px;">{name}</div>
      <div style="color:{INK_LIGHT};font-size:20px;font-weight:600;flex:1;text-align:center;">{best}</div>
      <div style="color:{color};font-size:22px;font-weight:800;width:200px;text-align:right;">{price}</div>
    </div>"""
SLIDES.append(slide(f"""
  <div style="display:flex;flex-direction:column;align-items:center;">
    <div class="accent" style="color:{INK_LIGHT};font-size:40px;margin-bottom:28px;">The recap</div>
    {row_html}
  </div>
""", page_label="5 / 6"))

# Slide 6: close / CTA
SLIDES.append(slide(f"""
  <div style="display:flex;flex-direction:column;align-items:center;gap:26px;text-align:center;">
    <div class="accent" style="color:{INK_LIGHT};font-size:52px;">Comment <span style="color:{ACCENT_GREEN};text-decoration:underline;">VOICES</span></div>
    <div style="color:{CARD_DIM};font-size:28px;font-weight:600;max-width:700px;line-height:1.5;">and I'll send you the full tier-by-tier breakdown for all three.</div>
    <div style="font-size:56px;">&#11088;</div>
  </div>
""", page_label="6 / 6"))


def main():
    png_paths = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 1080}, device_scale_factor=2)
        for i, html in enumerate(SLIDES, start=1):
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(200)
            out = OUT / f"slide{i}.png"
            page.screenshot(path=str(out))
            png_paths.append(out)
            print(f"wrote {out}")
        browser.close()

    images = []
    for p_ in png_paths:
        img = Image.open(p_).convert("RGB").resize((1080, 1080), Image.LANCZOS)
        img.save(p_)
        images.append(img)

    pdf_path = OUT / "sd1_linkedin_carousel.pdf"
    images[0].save(pdf_path, save_all=True, append_images=images[1:])
    print(f"wrote {pdf_path}")


if __name__ == "__main__":
    main()
