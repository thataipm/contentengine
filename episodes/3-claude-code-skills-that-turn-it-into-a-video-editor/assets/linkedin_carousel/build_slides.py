"""Build the sk1 LinkedIn carousel: 6 static slides reusing the video's own
visual system (dark grid bg, per-tool accent colors, real tool logos,
same script copy/stats) and combine into one PDF -- LinkedIn's native
"document post" format is how carousels actually render there, each PDF
page becoming one swipeable card. Not part of the deterministic Remotion
pipeline (this is a one-off design asset), so plain Google Fonts CDN is
fine here.
"""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import PIL.JpegImagePlugin  # noqa: F401 -- registers the JPEG codec PdfImagePlugin needs internally; without this import, Image.SAVE["JPEG"] is missing and PDF export raises KeyError

ROOT = Path(__file__).parent
LOGOS = ROOT.parent / "logos"
OUT = ROOT

ACCENT_PURPLE = "#8C7CFF"   # video-use
ACCENT_ORANGE = "#FF9B54"   # HyperFrames
ACCENT_BLUE = "#5FC4E0"     # Remotion Skill
ACCENT_GREEN = "#6FE0A0"    # payoff / final / CTA
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
  .card {{
    border-radius: 24px; border: 1px solid {CARD_BORDER}; background: {CARD_BG};
    box-shadow: 0 30px 70px -20px rgba(0,0,0,0.5);
  }}
"""


def slide(body_html: str, page_label: str = "") -> str:
    badge = f'<div class="pagebadge">{page_label}</div>' if page_label else ""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}</style></head>
<body>{badge}{body_html}<div class="watermark">@thataipm</div></body></html>"""


def tool_slide(step_no: int, page_no: int, logo_file: str, name: str, one_liner: str, stat_value: str, stat_label: str, accent: str, command: str) -> str:
    return slide(f"""
      <div style="display:flex;flex-direction:column;align-items:center;gap:36px;width:900px;">
        <div style="display:flex;align-items:center;gap:20px;">
          <img src="{logo_b64(logo_file)}" style="width:64px;height:64px;border-radius:14px;" />
          <div>
            <div style="color:{CARD_DIM};font-size:22px;font-weight:700;">STEP {step_no}</div>
            <div class="accent" style="color:{INK_LIGHT};font-size:44px;">{name}</div>
          </div>
        </div>
        <div style="color:{INK_LIGHT};font-size:30px;line-height:1.5;text-align:center;font-weight:500;">{one_liner}</div>
        <div style="text-align:center;">
          <div class="accent" style="color:{accent};font-size:76px;text-shadow:0 0 40px {accent}55;">{stat_value}</div>
          <div style="color:{INK_LIGHT};font-size:24px;font-weight:700;margin-top:4px;">{stat_label}</div>
        </div>
        <div class="card" style="width:100%;padding:22px 28px;">
          <div style="display:flex;gap:7px;margin-bottom:14px;">
            <div style="width:10px;height:10px;border-radius:50%;background:#4A4A4A;"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:#4A4A4A;"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:#4A4A4A;"></div>
          </div>
          <div style="font-family:monospace;font-size:19px;color:{INK_LIGHT};"><span style="color:{CARD_DIM};margin-right:8px;">&gt;</span>{command}</div>
        </div>
      </div>
    """, page_label=f"{page_no} / 6")


SLIDES = []

# Slide 1: cover / hook
SLIDES.append(slide(f"""
  <div style="display:flex;flex-direction:column;align-items:center;gap:28px;width:860px;text-align:center;">
    <div class="accent" style="color:{INK_LIGHT};font-size:64px;line-height:1.15;">I automated my entire<br/>video pipeline with<br/><span style="color:{ACCENT_PURPLE};">Claude Code</span></div>
    <div style="color:{CARD_DIM};font-size:28px;font-weight:600;">3 skills. No editing software. No timeline.</div>
    <div style="display:flex;gap:14px;margin-top:12px;">
      <img src="{logo_b64('browser-use.png')}" style="width:56px;height:56px;border-radius:12px;border:1px solid {CARD_BORDER};" />
      <img src="{logo_b64('heygen.png')}" style="width:56px;height:56px;border-radius:12px;border:1px solid {CARD_BORDER};" />
      <img src="{logo_b64('remotion.png')}" style="width:56px;height:56px;border-radius:12px;border:1px solid {CARD_BORDER};" />
    </div>
    <div style="color:{CARD_DIM};font-size:22px;font-weight:600;margin-top:18px;">swipe for the exact pipeline &rarr;</div>
  </div>
""", page_label="1 / 6"))

# Slide 2: video-use
SLIDES.append(tool_slide(
    1, 2, "browser-use.png", "video-use",
    "I just tell it what I want &mdash; cut clips, add captions, mix audio, all through conversation.",
    "20,000+", "GitHub stars &middot; built by the browser-use team",
    ACCENT_PURPLE, "ln -sfn video-use ~/.claude/skills/video-use",
))

# Slide 3: HyperFrames
SLIDES.append(tool_slide(
    2, 3, "heygen.png", "HyperFrames",
    "I write plain HTML, and it renders real motion graphics, frame by frame, deterministic every time.",
    "40,000+", "GitHub stars &middot; used in production at tldraw &amp; TanStack",
    ACCENT_ORANGE, "npx skills add heygen-com/hyperframes",
))

# Slide 4: Remotion Skill
SLIDES.append(tool_slide(
    3, 4, "remotion.png", "Remotion Skill",
    "I describe the video I want in plain English, and it writes the actual code behind it.",
    "6M views", "on its own launch demo, in 48 hours",
    ACCENT_BLUE, "npx skills add remotion-dev/skills",
))

# Slide 5: pipeline recap (same literal-visualization idea as Shot1's PipelineFlow)
nodes = [
    ("Raw Footage", "#5A5A62"),
    ("video-use", ACCENT_PURPLE),
    ("HyperFrames", ACCENT_ORANGE),
    ("Remotion", ACCENT_BLUE),
    ("Final Video", ACCENT_GREEN),
]
node_html = ""
for i, (label, color) in enumerate(nodes):
    if i > 0:
        node_html += f'<div style="width:2px;height:34px;background:{CARD_BORDER};"></div>'
    node_html += f"""<div style="display:flex;align-items:center;gap:12px;padding:16px 30px;border-radius:999px;background:{CARD_BG};border:1.5px solid {color};box-shadow:0 0 30px -8px {color}88;">
      <div style="width:10px;height:10px;border-radius:50%;background:{color};"></div>
      <div class="accent" style="color:{INK_LIGHT};font-size:28px;">{label}</div>
    </div>"""
SLIDES.append(slide(f"""
  <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
    <div class="accent" style="color:{INK_LIGHT};font-size:40px;margin-bottom:28px;">The full pipeline</div>
    <div style="display:flex;flex-direction:column;align-items:center;">{node_html}</div>
  </div>
""", page_label="5 / 6"))

# Slide 6: close / CTA
SLIDES.append(slide(f"""
  <div style="display:flex;flex-direction:column;align-items:center;gap:26px;text-align:center;">
    <div class="accent" style="color:{INK_LIGHT};font-size:52px;">Comment <span style="color:{ACCENT_GREEN};text-decoration:underline;">EDIT</span></div>
    <div style="color:{CARD_DIM};font-size:28px;font-weight:600;max-width:700px;line-height:1.5;">and I'll send you my exact pipeline &mdash; all three links.</div>
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

    # downsample the 2x supersampled capture to a crisp 1080x1080 final
    images = []
    for p_ in png_paths:
        img = Image.open(p_).convert("RGB").resize((1080, 1080), Image.LANCZOS)
        img.save(p_)
        images.append(img)

    pdf_path = OUT / "sk1_linkedin_carousel.pdf"
    images[0].save(pdf_path, save_all=True, append_images=images[1:])
    print(f"wrote {pdf_path}")


if __name__ == "__main__":
    main()
