import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { GridBackground } from "../components/GridBackground";
import { F_DISPLAY, F_UI, F_ACCENT, INK_LIGHT, CARD_DIM, CARD_BORDER, ACCENTS } from "../theme_skills";

// Instagram/LinkedIn/YouTube cover graphic for sd1, "Best AI Tools for
// Voiceovers." Reuses the episode's own real assets (the three tools'
// real logos), same rule as CoverSk1.
export const CoverSd1: React.FC = () => {
  const tools = [
    { logo: staticFile("sd1/logos/elevenlabs.png"), accent: ACCENTS[0], label: "ElevenLabs" },
    { logo: staticFile("sd1/logos/murf.png"), accent: ACCENTS[2], label: "Murf" },
    { logo: staticFile("sd1/logos/wellsaid.png"), accent: ACCENTS[1], label: "WellSaid" },
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
        AI Voiceover Tools
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
          Best AI Tools for Voiceovers
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", gap: 14 }}>
        {tools.map((t) => (
          <div
            key={t.label}
            style={{
              fontFamily: F_ACCENT,
              fontSize: 24,
              fontWeight: 800,
              color: t.accent,
              padding: "8px 20px",
              borderRadius: 999,
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            {t.label}
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
