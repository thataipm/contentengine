import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_UI, INK_LIGHT } from "../theme_skills";

const Star: React.FC<{ size: number; delay: number; twinklePeriod: number; frame: number; fps: number }> = ({ size, delay, twinklePeriod, frame, fps }) => {
  const p = springIn(frame, fps, delay);
  const scale = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  // Each star twinkles on its own period once settled, so the CTA card
  // (often held on screen the longest of any shot) never sits fully static.
  const twinkleMul = breathe(frame - delay, twinklePeriod, 0.14) * p + (1 - p);
  const glowMul = breathe(frame - delay, twinklePeriod, 0.4) * p + (1 - p);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `scale(${scale * twinkleMul})`, opacity, filter: `drop-shadow(0 0 ${14 * glowMul}px rgba(224,131,79,0.55))` }}>
      <path
        d="M12 1l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7L5.8 20l1.6-7L2 8.3l7.1-.7L12 1z"
        fill="url(#starGrad)"
      />
      <defs>
        <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD27A" />
          <stop offset="100%" stopColor="#E0834F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Closing "Comment [KEYWORD]" card, matching the two reference videos'
// shared close: a word plus a small glowing star cluster, plain light
// background (reuses GridBackground behind it, not drawn here).
export const CommentCTA: React.FC<{ keyword: string; born: number; frame: number; fps: number }> = ({ keyword, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(p, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: F_UI, fontSize: 46, fontWeight: 800, color: INK_LIGHT, marginBottom: 22 }}>
        Comment <span style={{ textDecoration: "underline" }}>{keyword}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <Star size={40} delay={born + 6} twinklePeriod={38} frame={frame} fps={fps} />
        <Star size={64} delay={born} twinklePeriod={52} frame={frame} fps={fps} />
        <Star size={40} delay={born + 6} twinklePeriod={44} frame={frame} fps={fps} />
      </div>
    </div>
  );
};
