import React from "react";
import { AbsoluteFill } from "remotion";
import { ChatWindow } from "../components/ChatWindow";
import { ChatBubble } from "../components/ChatBubble";
import { F_DISPLAY, F_UI, INK, DIM, ACCENT } from "../theme";

// Instagram cover graphic for tn1, "AI Couldn't Do Math (2020 vs. Today)."
// Reuses the episode's own real chat-interface set-piece rather than a
// separate template, same rule as CoverCm1. Rendered as a single settled
// still (frame 60), no timeline/audio needed.
export const CoverTn1: React.FC = () => {
  const frame = 60;
  const fps = 30;

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 200,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 22,
          color: DIM,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Then vs Now &middot; Episode 1
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center" }}>
        <ChatWindow label="2020 → TODAY" born={0} frame={frame} fps={fps} width={720}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <ChatBubble role="user" born={0} frame={frame} fps={fps} text="47 × 68 = ?" fontSize={28} mono />
            <ChatBubble role="assistant" born={0} frame={frame} fps={fps} text="= 3196" fontSize={28} mono state="correct" />
          </div>
        </ChatWindow>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center" }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 92, fontWeight: 700, color: INK, letterSpacing: -2, lineHeight: 1.05 }}>
          AI Couldn&apos;t Do Math
        </div>
        <div style={{ fontFamily: F_UI, fontSize: 40, fontWeight: 700, color: ACCENT, marginTop: 22 }}>2020 vs. Today</div>
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
          color: DIM,
          letterSpacing: 1,
        }}
      >
        @thataipm
      </div>
    </AbsoluteFill>
  );
};
