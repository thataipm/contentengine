import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_ACCENT, F_UI, INK_LIGHT } from "../theme_skills";

// A number that rolls up to its real value instead of just popping in -- added 2026-08-11 to
// widen the shared schema vocabulary (per direct feedback: prefer a literal build/reveal
// device over another static stat card). Real target value only, matches
// `references/animation-library.md`'s "odometer" pattern from the karpathy-skill-adjacent
// reel-editor's schema catalog, adapted to this project's own component/timing conventions.
// For a beat under ~25 frames, counting reads as a blur -- use a plain pop-in instead (this
// component still works, it just won't visibly "count").
export const CountUp: React.FC<{
  value: number;
  label: string;
  accent: string;
  born: number;
  countDuration?: number; // frames the count itself takes, defaults to 20
  suffix?: string;
  frame: number;
  fps: number;
}> = ({ value, label, accent, born, countDuration = 20, suffix = "", frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  const countP = interpolate(frame, [born, born + countDuration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Ease out so the count settles into the real number rather than arriving at constant
  // speed, which reads as mechanical.
  const eased = 1 - Math.pow(1 - countP, 3);
  const displayed = Math.round(value * eased);
  const done = countP >= 1;
  const settlePulse = done ? breathe(frame - (born + countDuration), 55, 0.03) : 1;

  return (
    <div style={{ textAlign: "center", opacity, transform: `scale(${scale * settlePulse})` }}>
      <div style={{ fontFamily: F_ACCENT, fontSize: 96, fontWeight: 800, color: accent, textShadow: `0 0 50px ${accent}55` }}>
        {displayed.toLocaleString()}
        {suffix}
      </div>
      <div style={{ fontFamily: F_UI, fontSize: 24, fontWeight: 700, color: INK_LIGHT, marginTop: 6 }}>{label}</div>
    </div>
  );
};
