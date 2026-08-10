import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, INK, DIM, ACCENT } from "../theme";

// tn1's equivalent of cm1's GlowBox: an outlined field showing a model
// label (top-left tag) and a math expression. Pure monochrome per the
// locked palette, no red/green — "wrong" reads via DIM + a struck-through
// glyph, "correct" reads via ACCENT + glow, never via hue.
export const MathField: React.FC<{
  label: string;
  expression: string;
  born: number;
  frame: number;
  fps: number;
  state?: "neutral" | "correct" | "wrong";
  fontSize?: number;
  answer?: React.ReactNode;
}> = ({ label, expression, born, frame, fps, state = "neutral", fontSize = 76, answer }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });

  const textColor = state === "wrong" ? DIM : INK;
  const glyph = state === "correct" ? "✓" : state === "wrong" ? "✗" : null;

  return (
    <div style={{ position: "relative", display: "inline-block", opacity, transform: `scale(${scale})` }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -34,
          fontFamily: F_UI,
          fontSize: 17,
          color: DIM,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: F_UI,
          fontSize,
          fontWeight: 700,
          color: textColor,
          border: `2px solid ${state === "correct" ? ACCENT : textColor}`,
          borderRadius: 6,
          padding: "26px 46px",
          background: "rgba(0,0,0,0.55)",
          textDecoration: state === "wrong" ? "line-through" : "none",
          textShadow: state === "correct" ? `0 0 60px ${ACCENT}88` : "none",
        }}
      >
        <span>{expression}</span>
        {answer}
        {glyph ? (
          <span style={{ textDecoration: "none", fontSize: fontSize * 0.7, color: state === "correct" ? ACCENT : DIM }}>
            {glyph}
          </span>
        ) : null}
      </div>
    </div>
  );
};
