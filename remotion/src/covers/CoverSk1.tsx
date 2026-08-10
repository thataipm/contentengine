import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { GridBackground } from "../components/GridBackground";
import { F_DISPLAY, F_UI, F_ACCENT, INK_LIGHT, CARD_DIM, CARD_BORDER, ACCENTS } from "../theme_skills";

// Instagram/LinkedIn/YouTube cover graphic for sk1, "3 Claude Code Skills
// That Turn It Into a Video Editor." Reuses the episode's own real assets
// (the three tools' real GitHub org logos, downloaded same session as the
// episode's screenshots) rather than a separate template, same rule as
// CoverCm1/CoverTn1. Rendered as a single settled still (frame 60), no
// timeline/audio needed.
export const CoverSk1: React.FC = () => {
  const tools = [
    { logo: staticFile("sk1/logos/browser-use.png"), accent: ACCENTS[0] },
    { logo: staticFile("sk1/logos/heygen.png"), accent: ACCENTS[2] },
    { logo: staticFile("sk1/logos/remotion.png"), accent: ACCENTS[3] },
  ];

  return (
    <AbsoluteFill>
      <GridBackground />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 200,
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

      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 36 }}>
        {tools.map((t, i) => (
          <div
            key={i}
            style={{
              width: 150,
              height: 150,
              borderRadius: 28,
              border: `2px solid ${t.accent}`,
              boxShadow: `0 0 50px -10px ${t.accent}99`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#101014",
            }}
          >
            <Img src={t.logo} style={{ width: 92, height: 92, borderRadius: 18 }} />
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center" }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 108, fontWeight: 700, color: INK_LIGHT, letterSpacing: -2, lineHeight: 1.05, padding: "0 60px" }}>
          3 Skills That Turn Claude Code Into a Video Editor
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", gap: 14 }}>
        {["video-use", "HyperFrames", "Remotion"].map((name, i) => (
          <div
            key={name}
            style={{
              fontFamily: F_ACCENT,
              fontSize: 24,
              fontWeight: 800,
              color: tools[i].accent,
              padding: "8px 20px",
              borderRadius: 999,
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            {name}
          </div>
        ))}
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
