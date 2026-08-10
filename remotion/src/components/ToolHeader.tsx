import React from "react";
import { Img, interpolate } from "remotion";
import { springIn } from "../motion";
import { F_ACCENT, INK_LIGHT } from "../theme_skills";

// Real org logo (downloaded from the tool's own GitHub org avatar, see
// episodes/sk1/assets/logos/) + tool name, replacing the generic
// StepTracker bar per direct feedback ("don't show that step bar on
// top") -- this identifies WHICH tool is on screen instead of tracking
// abstract progress.
export const ToolHeader: React.FC<{ logo: string; name: string; frame: number; fps: number }> = ({ logo, name, frame, fps }) => {
  const p = springIn(frame, fps, 0);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(p, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 190, display: "flex", alignItems: "center", gap: 16, opacity, transform: `translateX(${x}px)` }}>
      <Img src={logo} style={{ width: 52, height: 52, borderRadius: 12 }} />
      <div style={{ fontFamily: F_ACCENT, fontSize: 34, fontWeight: 800, color: INK_LIGHT }}>{name}</div>
    </div>
  );
};
