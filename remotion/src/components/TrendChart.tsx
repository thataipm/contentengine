import React from "react";
import { interpolate } from "remotion";
import { F_UI } from "../theme_skills";

// A single animated trend line, drawn stroke-by-stroke across
// [drawStart, drawEnd] with a glowing marker riding the tip -- literal
// visualization for "hiring went up/down," not a static chart image or a
// stat card that just pulses in place. `direction` picks a smooth
// ascending or descending cubic curve; the marker samples the same curve
// so it rides exactly on the line instead of drifting off it.
const P = {
  down: [
    [40, 120],
    [280, 150],
    [560, 260],
    [780, 340],
  ],
  up: [
    [40, 340],
    [280, 260],
    [560, 150],
    [780, 60],
  ],
} as const;

export const TrendChart: React.FC<{
  direction: "up" | "down";
  accent: string;
  label: string;
  frame: number;
  drawStart: number;
  drawEnd: number;
  width?: number;
  height?: number;
}> = ({ direction, accent, label, frame, drawStart, drawEnd, width = 820, height = 420 }) => {
  const progress = interpolate(frame, [drawStart, drawEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const [p0, p1, p2, p3] = P[direction];
  const pathD = `M ${p0[0]},${p0[1]} C ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`;

  const t = progress;
  const mt = 1 - t;
  const x = mt ** 3 * p0[0] + 3 * mt ** 2 * t * p1[0] + 3 * mt * t ** 2 * p2[0] + t ** 3 * p3[0];
  const y = mt ** 3 * p0[1] + 3 * mt ** 2 * t * p1[1] + 3 * mt * t ** 2 * p2[1] + t ** 3 * p3[1];

  const labelOpacity = interpolate(progress, [0, 0.12], [0, 1], { extrapolateRight: "clamp" });
  // Marker keeps a light idle pulse for the whole beat, not just while
  // drawing, so the frame never goes fully still even after the line
  // finishes drawing and holds on its endpoint.
  const pulse = 1 + 0.18 * Math.sin(frame / 5);

  return (
    <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontFamily: F_UI, fontSize: 24, fontWeight: 700, color: "#EDEDED", opacity: labelOpacity }}>{label}</div>
      <svg width={width} height={height} viewBox={`0 0 820 420`}>
        <path d={pathD} fill="none" stroke="#232328" strokeWidth={6} strokeLinecap="round" />
        <path
          d={pathD}
          fill="none"
          stroke={accent}
          strokeWidth={7}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 * (1 - progress)}
          style={{ filter: `drop-shadow(0 0 16px ${accent}aa)` }}
        />
        {progress > 0 ? (
          <circle cx={x} cy={y} r={12 * pulse} fill={accent} style={{ filter: `drop-shadow(0 0 24px ${accent})` }} />
        ) : null}
      </svg>
    </div>
  );
};
