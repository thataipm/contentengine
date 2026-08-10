import React from "react";
import { BG_DARK } from "../theme_skills";

// Dark grid-paper background for ThatAIPM's Pillar 2, revised 2026-08-09
// ("keep background dark, you can keep rest colorful"). Subtle near-invisible
// grid on near-black keeps the paper-texture motif from the original
// reference videos without fighting the dark canvas. Cheap CSS
// repeating-gradient, fully deterministic (no images), same grid every frame.
export const GridBackground: React.FC<{ cell?: number }> = ({ cell = 64 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `
        linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
      `,
      backgroundSize: `${cell}px ${cell}px`,
      backgroundColor: BG_DARK,
    }}
  />
);
