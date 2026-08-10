import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, INK, DIM, ACCENT } from "../theme";

// Outline-style box matching the Google Flow reference the user shared
// (2026-08-07): thin border, transparent/dark fill, bold crisp DOM text
// (never 3D — text stays DOM per this project's standing pitfall about
// Html-in-3D not surviving headless export), with an optional small
// corner tag like "[01]" for the reference's technical-detail flourish.
// Pair with `three/GlowBeam3D.tsx` / `GlowOrb3D.tsx` behind it in the same
// shot for real bloom-lit light — this component alone has no glow of its
// own, the light comes from the 3D layer behind it.
export const GlowBox: React.FC<{
  children: React.ReactNode;
  tag?: string;
  tagAlign?: "left" | "right";
  born: number;
  frame: number;
  fps: number;
  fontSize?: number;
  accent?: boolean;
}> = ({ children, tag, tagAlign = "left", born, frame, fps, fontSize = 84, accent = false }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.9, 1], { extrapolateRight: "clamp" });
  const color = accent ? ACCENT : INK;

  return (
    <div style={{ position: "relative", display: "inline-block", opacity, transform: `scale(${scale})` }}>
      {tag ? (
        <div
          style={{
            position: "absolute",
            [tagAlign]: -30,
            top: -14,
            fontFamily: F_UI,
            fontSize: 15,
            color: DIM,
          }}
        >
          {tag}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: F_UI,
          fontSize,
          fontWeight: 700,
          color,
          border: `2px solid ${color}`,
          borderRadius: 4,
          padding: "8px 40px",
          background: "rgba(0,0,0,0.55)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
