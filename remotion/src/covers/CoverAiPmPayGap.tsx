import React from "react";
import { AbsoluteFill } from "remotion";
import { GridBackground } from "../components/GridBackground";
import { F_DISPLAY, F_UI, F_ACCENT, INK_LIGHT, CARD_DIM, CARD_BORDER, ACCENTS } from "../theme_skills";

// Cover for "What AI Is Actually Doing to PM Hiring", v2.0 Batch 1.
// Rebuilt 2026-08-10 with real, source-verified stats after the original
// $245K/$123K comp figures were found unverifiable. Frame 60, no
// timeline/audio.
export const CoverAiPmPayGap: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 190,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 22,
          color: CARD_DIM,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        AI PM
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", justifyContent: "center", gap: 40 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F_ACCENT, fontSize: 72, fontWeight: 800, color: ACCENTS[1], textShadow: `0 0 40px ${ACCENTS[1]}88` }}>+34%</div>
          <div style={{ fontFamily: F_UI, fontSize: 18, fontWeight: 700, color: INK_LIGHT, marginTop: 8 }}>Senior AI-PM hiring</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F_ACCENT, fontSize: 72, fontWeight: 800, color: ACCENTS[2] }}>-12%</div>
          <div style={{ fontFamily: F_UI, fontSize: 18, fontWeight: 700, color: CARD_DIM, marginTop: 8 }}>Junior/mid PM hiring</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 92, fontWeight: 700, color: INK_LIGHT, letterSpacing: -2, lineHeight: 1.05, padding: "0 70px" }}>
          What AI Is Actually Doing to PM Hiring
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={{ fontFamily: F_ACCENT, fontSize: 26, fontWeight: 800, color: ACCENTS[0], padding: "10px 24px", borderRadius: 999, border: `1px solid ${CARD_BORDER}` }}>
          61% need AI fluency
        </div>
        <div style={{ fontFamily: F_ACCENT, fontSize: 26, fontWeight: 800, color: ACCENTS[2], padding: "10px 24px", borderRadius: 999, border: `1px solid ${CARD_BORDER}` }}>
          85% vs 2% investment
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
