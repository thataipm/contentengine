"""Build the LinkedIn carousel for "What AI Is Actually Doing to PM Hiring."
Five slides, one per shot beat (same order as the video), same visual system
(dark grid bg, theme_skills.ts colors, Bricolage Grotesque/Inter). All stats
are the re-verified figures from the rebuild -- see
../../the-ai-pm-pay-gap_script.md's "Verified facts" section, not the
dropped $245K/$123K claim.
"""
import base64
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SLUG = "the-ai-pm-pay-gap"
OUT_PDF = HERE / f"{SLUG}_linkedin_carousel.pdf"

BG_DARK = "#0B0B0E"
INK_LIGHT = "#F5F5F2"
CARD_BG = "#17171B"
CARD_BORDER = "#2C2C32"
CARD_DIM = "#9A9AA2"
ACCENTS = ["#8C7CFF", "#6FE0A0", "#FF9B54", "#5FC4E0"]

FONTS = "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Inter:wght@500;600;700&display=swap');"

GRID_BG = f"""
  background:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  background-color: {BG_DARK};
"""

BASE_STYLE = f"""
  {FONTS}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; {GRID_BG}
    position:relative; font-family:'Inter', sans-serif;
    display:flex; flex-direction:column; align-items:center;
  }}
  .eyebrow {{
    margin-top:64px; font-size:19px; font-weight:700; letter-spacing:4px;
    text-transform:uppercase; color:{CARD_DIM};
  }}
  .slidenum {{
    position:absolute; top:64px; right:70px; font-family:'Bricolage Grotesque', sans-serif;
    font-weight:800; font-size:19px; color:{CARD_DIM};
  }}
  .handle {{
    position:absolute; bottom:56px; font-family:'Bricolage Grotesque', sans-serif;
    font-weight:800; font-size:24px; color:{INK_LIGHT};
  }}
  .source {{
    position:absolute; bottom:96px; font-size:15px; color:{CARD_DIM}; text-align:center;
    padding:0 100px;
  }}
"""


def data_uri_svg_check() -> str:
    return ""  # no images needed this episode, stat-driven not tool-driven


def stat_pill(value: str, label: str, color: str) -> str:
    return f"""
    <div style="text-align:center;">
      <div style="font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:104px; color:{color}; text-shadow:0 0 50px {color}55;">{value}</div>
      <div style="font-size:22px; font-weight:600; color:{CARD_DIM}; margin-top:10px;">{label}</div>
    </div>"""


SLIDES = []

# Slide 1: Hook / cover
SLIDES.append(f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_STYLE}</style></head><body>
  <div class="eyebrow">AI PM &middot; Hiring Data</div>
  <div class="slidenum">1/5</div>
  <div style="margin-top:220px; padding:0 100px; text-align:center; font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:68px; color:{INK_LIGHT}; line-height:1.12; letter-spacing:-1px;">
    What AI Is Actually Doing to PM Hiring
  </div>
  <div style="margin-top:60px; padding:0 110px; text-align:center; font-size:28px; color:{CARD_DIM}; line-height:1.5;">
    If you're a mid-level product manager right now, hiring for your role just dropped double digits.
    <br/><br/>
    If you're senior and AI-fluent, it's never been better.
  </div>
  <div style="margin-top:70px; display:flex; gap:14px;">
    <div style="font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:22px; color:{ACCENTS[0]}; padding:10px 24px; border-radius:999px; border:1px solid {CARD_BORDER};">Real 2026 data</div>
    <div style="font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:22px; color:{ACCENTS[3]}; padding:10px 24px; border-radius:999px; border:1px solid {CARD_BORDER};">Not a claim from memory</div>
  </div>
  <div class="handle">@thataipm</div>
</body></html>""")

# Slide 2: hiring split
SLIDES.append(f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_STYLE}</style></head><body>
  <div class="eyebrow">The Hiring Split</div>
  <div class="slidenum">2/5</div>
  <div style="margin-top:280px; display:flex; gap:64px;">
    {stat_pill("+34%", "Senior AI-PM hiring", ACCENTS[1])}
    {stat_pill("-12%", "Junior/mid PM hiring", CARD_DIM)}
  </div>
  <div style="margin-top:80px; padding:0 110px; text-align:center; font-size:26px; color:{INK_LIGHT}; line-height:1.5; font-weight:600;">
    Senior AI-fluent PM hiring is up 34% this year. Junior and mid-level PM hiring dropped 12%
    over the same period.
  </div>
  <div class="source">Source: BCG's 2026 workforce-transformation report, via institutepm.com</div>
  <div class="handle">@thataipm</div>
</body></html>""")

# Slide 3: AI fluency requirement
SLIDES.append(f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_STYLE}</style></head><body>
  <div class="eyebrow">The New Requirement</div>
  <div class="slidenum">3/5</div>
  <div style="margin-top:300px;">
    {stat_pill("61%", "Of senior PM postings now require AI fluency", ACCENTS[0])}
  </div>
  <div style="margin-top:60px; padding:0 130px; text-align:center; font-size:26px; color:{INK_LIGHT}; line-height:1.5; font-weight:600;">
    Up from just 23% in 2024. AI fluency went from a nice-to-have to the majority requirement
    in one year.
  </div>
  <div class="source">Source: BCG's 2026 workforce-transformation report, via institutepm.com</div>
  <div class="handle">@thataipm</div>
</body></html>""")

# Slide 4: investment gap
SLIDES.append(f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_STYLE}</style></head><body>
  <div class="eyebrow">The Real Story</div>
  <div class="slidenum">4/5</div>
  <div style="margin-top:250px; width:820px; display:flex; flex-direction:column; gap:40px;">
    <div>
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <div style="font-size:22px; font-weight:700; color:{INK_LIGHT};">Investing in AI tools</div>
        <div style="font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:30px; color:{ACCENTS[2]};">85%</div>
      </div>
      <div style="margin-top:10px; height:34px; border-radius:999px; background:#1B1B20; border:1px solid {CARD_BORDER}; overflow:hidden;">
        <div style="width:85%; height:100%; border-radius:999px; background:{ACCENTS[2]}; box-shadow:0 0 24px -4px {ACCENTS[2]};"></div>
      </div>
    </div>
    <div>
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <div style="font-size:22px; font-weight:700; color:{INK_LIGHT};">Investing in the PMs who'd use them</div>
        <div style="font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:30px; color:{ACCENTS[1]};">2%</div>
      </div>
      <div style="margin-top:10px; height:34px; border-radius:999px; background:#1B1B20; border:1px solid {CARD_BORDER}; overflow:hidden;">
        <div style="width:2%; height:100%; border-radius:999px; background:{ACCENTS[1]}; box-shadow:0 0 24px -4px {ACCENTS[1]};"></div>
      </div>
    </div>
  </div>
  <div style="margin-top:60px; padding:0 110px; text-align:center; font-size:26px; color:{INK_LIGHT}; line-height:1.5; font-weight:600;">
    85% of leadership is investing in AI tools. Only 2% names talent development as their
    biggest focus.
  </div>
  <div class="source">Source: Productboard's CPO survey</div>
  <div class="handle">@thataipm</div>
</body></html>""")

# Slide 5: takeaway / CTA
SLIDES.append(f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_STYLE}</style></head><body>
  <div class="eyebrow">The Takeaway</div>
  <div class="slidenum">5/5</div>
  <div style="margin-top:280px; padding:0 100px; text-align:center; font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:52px; color:{INK_LIGHT}; line-height:1.2; letter-spacing:-1px;">
    Companies want AI-native PMs.<br/>They're just not building them.<br/>They're hiring for it instead.
  </div>
  <div style="margin-top:70px; font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:28px; color:{ACCENTS[0]}; padding:14px 30px; border-radius:999px; border:1.5px solid {ACCENTS[0]};">
    Comment AIPM and I'll send you where to start
  </div>
  <div class="handle">@thataipm</div>
</body></html>""")


def main():
    png_paths = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for i, html in enumerate(SLIDES, start=1):
            page = browser.new_page(viewport={"width": 1080, "height": 1350}, device_scale_factor=2)
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(200)
            png_path = HERE / f"slide_{i}.png"
            page.screenshot(path=str(png_path))
            png_paths.append(png_path)
            page.close()
        browser.close()

    # PDF export internally re-encodes each page as JPEG; PIL's plugin registry is
    # lazy-populated and PdfImagePlugin can look up Image.SAVE["JPEG"] before the JPEG
    # plugin has registered itself, throwing KeyError. Force full plugin init first.
    Image.init()

    images = [Image.open(p).convert("RGB") for p in png_paths]
    images[0].save(OUT_PDF, save_all=True, append_images=images[1:])
    print(f"wrote {OUT_PDF} ({len(images)} slides)")

    for p in png_paths:
        p.unlink()


if __name__ == "__main__":
    main()
