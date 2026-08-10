import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, INK, DIM } from "../theme";

// The real "thinking" drawer real chat products show above a final answer
// (Claude/ChatGPT-style extended reasoning panel) — used here instead of an
// abstract flowchart-node stack, per this channel's literal-real-UI rule.
// A shaded, bordered panel with a spinning-ring header icon and step lines
// that build in one at a time.
export const ReasoningPanel: React.FC<{
  steps: { text: string; born: number }[];
  born: number;
  frame: number;
  fps: number;
  done: boolean;
}> = ({ steps, born, frame, fps, done }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const spin = (frame * 9) % 360;

  return (
    <div
      style={{
        opacity,
        border: `1px solid ${DIM}44`,
        borderRadius: 14,
        background: "rgba(255,255,255,0.02)",
        padding: "20px 26px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        {done ? (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 10.5l4 4 8-9" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: `2px solid ${DIM}55`,
              borderTopColor: INK,
              transform: `rotate(${spin}deg)`,
            }}
          />
        )}
        <div style={{ fontFamily: F_UI, fontSize: 16, color: DIM, letterSpacing: 1.5, textTransform: "uppercase" }}>
          {done ? "Reasoned" : "Reasoning"}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map((s, i) => {
          const sp = springIn(frame, fps, s.born);
          const sOpacity = interpolate(sp, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const sx = interpolate(sp, [0, 1], [-10, 0], { extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                opacity: sOpacity,
                transform: `translateX(${sx}px)`,
                fontFamily: "monospace",
                fontSize: 26,
                color: INK,
              }}
            >
              {s.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
