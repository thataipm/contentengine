"""Build the LinkedIn infographic for "The Karpathy Skill" episode. Single
image (not a carousel, per the user's choice of format for this legacy/
transition episode), same visual system as the video (dark grid bg,
theme_skills.ts colors, Bricolage Grotesque/Inter). Real four-rule text
quoted directly from the actual CLAUDE.md file (fetched 2026-08-10), real
avatars already downloaded for the episode's Remotion build.
"""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "the-karpathy-skill_linkedin_infographic.png"


def data_uri(path: Path) -> str:
    # Chromium blocks file:// loads from injected HTML (page.set_content
    # counts as an opaque origin) -- base64 sidesteps that entirely, fine
    # for a one-off static asset build (not a per-frame Remotion render,
    # where this cost would actually matter).
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode()

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

RULES = [
    ("Think Before Coding", "Don't assume. Don't hide confusion. Surface tradeoffs."),
    ("Simplicity First", "Minimum code that solves the problem. Nothing speculative."),
    ("Surgical Changes", "Touch only what you must. Clean up only your own mess."),
    ("Goal-Driven Execution", "Define success criteria. Loop until verified."),
]

rule_html = "".join(
    f"""
    <div class="rule">
      <div class="rule-num" style="background:{ACCENTS[i]}22;color:{ACCENTS[i]};border:1.5px solid {ACCENTS[i]};">{i+1}</div>
      <div class="rule-text">
        <div class="rule-name">{name}</div>
        <div class="rule-desc">{desc}</div>
      </div>
    </div>"""
    for i, (name, desc) in enumerate(RULES)
)

HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>
  {FONTS}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; {GRID_BG}
    position:relative; font-family:'Inter', sans-serif;
    display:flex; flex-direction:column; align-items:center;
  }}
  .eyebrow {{
    margin-top:70px; font-size:20px; font-weight:700; letter-spacing:4px;
    text-transform:uppercase; color:{CARD_DIM};
  }}
  .avatars {{ display:flex; gap:26px; margin-top:34px; }}
  .avatar {{
    width:96px; height:96px; border-radius:50%; overflow:hidden;
    display:flex; align-items:center; justify-content:center;
  }}
  .avatar img {{ width:100%; height:100%; object-fit:cover; }}
  .names {{ margin-top:16px; font-size:19px; font-weight:600; color:{CARD_DIM}; text-align:center; }}
  .title {{
    margin-top:34px; padding:0 90px; text-align:center;
    font-family:'Bricolage Grotesque', sans-serif; font-weight:800;
    font-size:56px; color:{INK_LIGHT}; line-height:1.08; letter-spacing:-1px;
  }}
  .stat-row {{ display:flex; gap:14px; margin-top:28px; }}
  .stat-pill {{
    font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:22px;
    padding:10px 22px; border-radius:999px; border:1px solid {CARD_BORDER};
  }}
  .rules {{ width:900px; margin-top:44px; display:flex; flex-direction:column; gap:16px; }}
  .rule {{
    display:flex; align-items:center; gap:22px;
    background:{CARD_BG}; border:1px solid {CARD_BORDER}; border-radius:16px;
    padding:20px 26px;
  }}
  .rule-num {{
    flex-shrink:0; width:44px; height:44px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:22px;
  }}
  .rule-name {{ font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:26px; color:{INK_LIGHT}; }}
  .rule-desc {{ font-size:17px; color:{CARD_DIM}; margin-top:4px; }}
  .footer {{
    margin-top:auto; margin-bottom:56px; display:flex; flex-direction:column;
    align-items:center; gap:10px;
  }}
  .install {{ font-family:monospace; font-size:16px; color:{CARD_DIM}; }}
  .handle {{ font-family:'Bricolage Grotesque', sans-serif; font-weight:800; font-size:24px; color:{INK_LIGHT}; }}
</style></head><body>
  <div class="eyebrow">Claude Code Skills</div>
  <div class="avatars">
    <div class="avatar" style="border:3px solid {ACCENTS[3]}; box-shadow:0 0 40px -8px {ACCENTS[3]}99;">
      <img src="{data_uri(HERE / 'logos' / 'karpathy.png')}" />
    </div>
    <div class="avatar" style="border:3px solid {ACCENTS[0]}; box-shadow:0 0 40px -8px {ACCENTS[0]}99;">
      <img src="{data_uri(HERE / 'logos' / 'forrestchang.png')}" />
    </div>
  </div>
  <div class="names">Andrej Karpathy &middot; Forrest Chang</div>
  <div class="title">One File. Four Rules. 201,077 GitHub Stars.</div>
  <div class="stat-row">
    <div class="stat-pill" style="color:{ACCENTS[1]};">CLAUDE.md</div>
    <div class="stat-pill" style="color:{ACCENTS[2]};">Zero code</div>
  </div>
  <div class="rules">{rule_html}</div>
  <div class="footer">
    <div class="install">curl -o CLAUDE.md .../forrestchang/andrej-karpathy-skills/main/CLAUDE.md</div>
    <div class="handle">@thataipm</div>
  </div>
</body></html>"""


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 1350}, device_scale_factor=2)
        page.set_content(HTML, wait_until="networkidle")
        page.wait_for_timeout(200)
        page.screenshot(path=str(OUT))
        browser.close()
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
