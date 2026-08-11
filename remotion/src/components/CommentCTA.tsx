import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_UI, INK_LIGHT } from "../theme_skills";

const Star: React.FC<{ size: number; delay: number; twinklePeriod: number; frame: number; fps: number }> = ({ size, delay, twinklePeriod, frame, fps }) => {
  const p = springIn(frame, fps, delay);
  const scale = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  // Each star twinkles on its own period once settled, so the CTA card
  // (often held on screen the longest of any shot, and the whole video's last
  // beat) never sits fully static. Amplitudes bumped 2026-08-11: the original
  // 0.14/0.4 was real motion but too small to reliably clear
  // automation/check_static_frames.py's freeze detector near a sine
  // peak/trough, where three independently-timed sines can still all be
  // near-flat at once for a moment.
  const twinkleMul = breathe(frame - delay, twinklePeriod, 0.22) * p + (1 - p);
  const glowMul = breathe(frame - delay, twinklePeriod, 0.6) * p + (1 - p);
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
  // A different period from any of the three stars' own (38/44/52), so the whole card has an
  // independent motion source too -- makes it very unlikely every source is near-flat at once.
  const containerPulse = breathe(frame - born, 29, 0.012) * p + (1 - p);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity, transform: `translateY(${y}px) scale(${containerPulse})` }}>
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
