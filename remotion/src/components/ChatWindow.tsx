import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, INK, DIM } from "../theme";

// A real, recognizable chat-app window (generic/unbranded), not a floating
// outline box — per this project's repeatedly-corrected standing rule: the
// visual must be the actual artifact a viewer recognizes (a chat UI), not
// an abstract stand-in for it, however clean. Traffic-light dots + a model
// label in the header, rounded panel, subtle border/fill so it reads as a
// real app surface.
export const ChatWindow: React.FC<{
  children: React.ReactNode;
  label: string;
  born: number;
  frame: number;
  fps: number;
  width?: number;
}> = ({ children, label, born, frame, fps, width = 780 }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width,
        opacity,
        transform: `scale(${scale})`,
        borderRadius: 20,
        border: `1px solid ${DIM}55`,
        background: "rgba(255,255,255,0.025)",
        overflow: "hidden",
        boxShadow: "0 40px 100px -30px rgba(0,0,0,0.8)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 24px",
          borderBottom: `1px solid ${DIM}33`,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: `${DIM}88` }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: `${DIM}88` }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: `${DIM}88` }} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontFamily: F_UI, fontSize: 16, fontWeight: 700, color: INK, letterSpacing: 1, marginRight: 42 }}>
          {label}
        </div>
      </div>
      <div style={{ padding: 28 }}>{children}</div>
    </div>
  );
};
