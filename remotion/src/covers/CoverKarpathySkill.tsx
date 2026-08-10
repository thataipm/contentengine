import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { GridBackground } from "../components/GridBackground";
import { F_DISPLAY, F_UI, F_ACCENT, INK_LIGHT, CARD_DIM, CARD_BORDER, ACCENTS } from "../theme_skills";

// Cover for "The Karpathy Skill" — reuses the episode's own real assets
// (Karpathy's and Forrest Chang's real GitHub avatars, the real star
// count) rather than a separate template, same rule as CoverSk1/CoverSd1.
// Single still, frame 60, no timeline/audio.
export const CoverKarpathySkill: React.FC = () => {
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
        Claude Code Skills
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", justifyContent: "center", gap: 30 }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: `3px solid ${ACCENTS[3]}`,
            boxShadow: `0 0 50px -10px ${ACCENTS[3]}99`,
            overflow: "hidden",
          }}
        >
          <Img src={staticFile("the-karpathy-skill/logos/karpathy.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: `3px solid ${ACCENTS[0]}`,
            boxShadow: `0 0 50px -10px ${ACCENTS[0]}99`,
            overflow: "hidden",
          }}
        >
          <Img src={staticFile("the-karpathy-skill/logos/forrestchang.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center" }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 112, fontWeight: 700, color: INK_LIGHT, letterSpacing: -2, lineHeight: 1.05, padding: "0 70px" }}>
          The 200,000-Star File That Fixes Your AI Agent
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", gap: 14 }}>
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
          CLAUDE.md
        </div>
        <div
          style={{
            fontFamily: F_ACCENT,
            fontSize: 26,
            fontWeight: 800,
            color: ACCENTS[2],
            padding: "10px 24px",
            borderRadius: 999,
            border: `1px solid ${CARD_BORDER}`,
          }}
        >
          201,077 stars
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
