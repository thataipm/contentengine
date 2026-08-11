import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { GridBackground } from "../components/GridBackground";
import { F_DISPLAY, F_UI, F_ACCENT, INK_LIGHT, CARD_DIM, CARD_BORDER, ACCENTS } from "../theme_skills";

const SLUG = "claude-just-got-68-product-management-skills";

// Cover for "Claude Just Got 68 Product Management Skills" — reuses the
// episode's own real assets (the pm-skills org's real GitHub avatar, the
// real skill/star counts), same rule as CoverKarpathySkill. Single still,
// frame 60, no timeline/audio.
export const CoverPmSkills: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 170,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 22,
          color: CARD_DIM,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        AI Workflows &amp; Tools
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: `3px solid ${ACCENTS[1]}`,
            boxShadow: `0 0 50px -10px ${ACCENTS[1]}99`,
            overflow: "hidden",
          }}
        >
          <Img src={staticFile(`${SLUG}/logos/product-on-purpose.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center" }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 84, fontWeight: 700, color: INK_LIGHT, letterSpacing: -2, lineHeight: 1.05, padding: "0 70px" }}>
          Claude Just Got 68 Product Management Skills
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", gap: 14 }}>
        <div
          style={{
            fontFamily: F_ACCENT,
            fontSize: 26,
            fontWeight: 800,
            color: ACCENTS[1],
            padding: "10px 24px",
            borderRadius: 999,
            border: `1px solid ${CARD_BORDER}`,
          }}
        >
          68 skills
        </div>
        <div
          style={{
            fontFamily: F_ACCENT,
            fontSize: 26,
            fontWeight: 800,
            color: ACCENTS[3],
            padding: "10px 24px",
            borderRadius: 999,
            border: `1px solid ${CARD_BORDER}`,
          }}
        >
          530 stars
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 140,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 26,
          fontWeight: 700,
          color: CARD_DIM,
          letterSpacing: 1,
        }}
      >
        @thataipm
      </div>
    </AbsoluteFill>
  );
};
