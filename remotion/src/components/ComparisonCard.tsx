import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_ACCENT, F_UI, CARD_BG, INK_LIGHT } from "../theme_skills";

// A single side of a two-thing comparison (pay, hiring rate, anything with a
// "this one, not that one" shape). Color is fixed per card; the caller drives
// `scale`/`glowStrength` per frame, either continuously (a disparity growing
// live as the VO plays) or via a discrete springIn pop, so one component
// covers both an unfolding reveal and a settle-in-place stat card.
export const ComparisonCard: React.FC<{
  label?: string;
  value?: string;
  accent: string;
  scale: number;
  glowStrength: number;
  born: number;
  valueBorn?: number;
  frame: number;
  fps: number;
  width?: number;
}> = ({ label, value, accent, scale, glowStrength, born, valueBorn, frame, fps, width = 320 }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const valueP = valueBorn !== undefined ? springIn(frame, fps, valueBorn) : 1;
  const valueOpacity = interpolate(valueP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const valueScale = interpolate(valueP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });

  // Keep the card subtly alive for the rest of its on-screen life instead of
  // freezing once the pop-in spring settles (the "Never Let a Frame Sit"
  // rule). Gated by `p` so it ramps in with the entrance rather than
  // jittering before the card has even appeared.
  const breatheMul = breathe(frame - born);
  const liveScale = scale * (1 + (breatheMul - 1) * p);
  const liveGlow = glowStrength + (breatheMul - 1) * 0.4 * p;

  return (
    <div
      style={{
        width,
        opacity,
        transform: `scale(${liveScale})`,
        borderRadius: 20,
        border: `2px solid ${accent}`,
        borderColor: `rgba(${hexToRgb(accent)},${0.25 + liveGlow * 0.75})`,
        background: CARD_BG,
        boxShadow: liveGlow > 0.05 ? `0 0 ${40 * liveGlow}px -6px ${accent}${Math.round(Math.min(Math.max(liveGlow, 0), 1) * 153).toString(16).padStart(2, "0")}` : "none",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      {label ? (
        <div style={{ fontFamily: F_UI, fontSize: 20, fontWeight: 700, color: INK_LIGHT, textAlign: "center" }}>{label}</div>
      ) : null}
      {value ? (
        <div
          style={{
            fontFamily: F_ACCENT,
            fontSize: 40,
            fontWeight: 800,
            color: accent,
            opacity: valueOpacity,
            transform: `scale(${valueScale})`,
            textShadow: `0 0 30px ${accent}55`,
            textAlign: "center",
          }}
        >
          {value}
        </div>
      ) : null}
    </div>
  );
};

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
