import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_ACCENT, F_UI, CARD_BORDER, INK_LIGHT } from "../theme_skills";

// A labeled horizontal bar that fills from 0 to a real percent, literal
// visualization for "X% vs Y%" investment-gap style stats. Two stacked
// instances read as an unfair split at a glance.
export const DisparityBar: React.FC<{
  label: string;
  percent: number;
  accent: string;
  born: number;
  frame: number;
  fps: number;
  trackWidth?: number;
}> = ({ label, percent, accent, born, frame, fps, trackWidth = 640 }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const fillWidth = interpolate(p, [0, 1], [0, (percent / 100) * trackWidth], { extrapolateRight: "clamp" });
  const numberOpacity = interpolate(p, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ opacity, display: "flex", flexDirection: "column", gap: 10, width: trackWidth }}>
      <div style={{ fontFamily: F_UI, fontSize: 20, fontWeight: 700, color: INK_LIGHT }}>{label}</div>
      <div style={{ position: "relative", width: trackWidth, height: 34, borderRadius: 999, background: "#1B1B20", border: `1px solid ${CARD_BORDER}`, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: fillWidth,
            borderRadius: 999,
            background: accent,
            boxShadow: `0 0 24px -4px ${accent}`,
          }}
        />
      </div>
      <div style={{ fontFamily: F_ACCENT, fontSize: 30, fontWeight: 800, color: accent, opacity: numberOpacity }}>{percent}%</div>
    </div>
  );
};
