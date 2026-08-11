import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_ACCENT, F_UI, CARD_DIM, CARD_BORDER } from "../theme_skills";

export type BarChartBar = { label: string; value: number; accent: string; born: number };

// Column bar chart -- bars grow from baseline on their own word-synced `born`, real values
// only. Added 2026-08-11 to widen the shared schema vocabulary beyond the same 3-4 repeated
// components (per direct feedback: reach for a literal chart TYPE before defaulting to
// another stat-card variant). Distinct from DisparityBar (a single horizontal fill, framed as
// "this much of a whole") -- this is for comparing several discrete real numbers side by side.
export const BarChart: React.FC<{
  bars: BarChartBar[];
  maxValue?: number; // defaults to the largest bar's value, so it always fills the chart
  frame: number;
  fps: number;
  width?: number;
  height?: number;
  valueSuffix?: string; // e.g. "%"
}> = ({ bars, maxValue, frame, fps, width = 760, height = 420, valueSuffix = "" }) => {
  const max = maxValue ?? Math.max(...bars.map((b) => b.value));
  const barWidth = width / bars.length - 24;

  return (
    <div style={{ width, height, display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: CARD_BORDER }} />
      {bars.map((b, i) => {
        const p = springIn(frame, fps, b.born);
        const fillP = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const barHeight = (b.value / max) * (height - 90) * fillP;
        // Idle shimmer once a bar has finished growing, so a chart held for several seconds
        // doesn't just sit there once every bar has landed.
        const shimmer = fillP > 0.98 ? breathe(frame - b.born, 55, 0.04) : 1;

        return (
          <div key={b.label} style={{ width: barWidth, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div
              style={{
                fontFamily: F_ACCENT,
                fontSize: 26,
                fontWeight: 800,
                color: b.accent,
                opacity: interpolate(fillP, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `scale(${shimmer})`,
              }}
            >
              {b.value}
              {valueSuffix}
            </div>
            <div
              style={{
                width: "100%",
                height: Math.max(barHeight, 0),
                background: b.accent,
                borderRadius: "10px 10px 0 0",
                boxShadow: `0 0 ${24 * shimmer}px -6px ${b.accent}`,
              }}
            />
            <div style={{ fontFamily: F_UI, fontSize: 18, fontWeight: 700, color: CARD_DIM, textAlign: "center" }}>{b.label}</div>
          </div>
        );
      })}
    </div>
  );
};
