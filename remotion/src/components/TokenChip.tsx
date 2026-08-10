import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, INK, DIM, ACCENT } from "../theme";

const NEUTRAL_FILL = "#1E1E22";
const NEUTRAL_BORDER = "#333338";

type TokenChipProps = {
  text: string;
  born: number;
  frame: number;
  fps: number;
  emphasized?: boolean;
  // When set (with `emphasized`), the chip renders NEUTRAL from `born` and
  // only switches to the emphasized/accent styling at this later frame —
  // for "this chip has already been on screen, now the line calls it out
  // specifically" beats, instead of the chip not existing at all until the
  // callout (see the 2026-08-07 fix: chips were popping in from nothing
  // 5s into a shot, which read as blank dead time before that).
  emphasizedBorn?: number;
  sublabel?: string;
  // Sublabel can appear later than the chip itself (e.g. a chip lands, then
  // a data annotation like a token ID reveals underneath it a beat later).
  // Defaults to `born` (appears with the chip) when omitted.
  sublabelBorn?: number;
};

// A single token chunk, neutral by default (locked visual direction retired
// the old blue/amber/mint functional color grammar — one restrained accent
// only, used for emphasis, not category-coding). Set `emphasized` for the
// specific chip(s) a shot wants to draw the eye to.
//
// Continuous "breathing" scale once settled (2026-08-07, per "I want
// constant visual on screen" feedback) — a chip that's fully landed still
// shouldn't sit perfectly frozen for several seconds, so a slow, tiny
// (~1.5%) oscillation keeps every established chip almost imperceptibly
// alive rather than dead-static.
export const TokenChip: React.FC<TokenChipProps> = ({
  text,
  born,
  frame,
  fps,
  emphasized = false,
  emphasizedBorn,
  sublabel,
  sublabelBorn,
}) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(p, [0, 1], [16, 0], { extrapolateRight: "clamp" });
  const settleScale = interpolate(p, [0, 1], [0.82, 1], { extrapolateRight: "clamp" });
  const breathe = p >= 1 ? 1 + Math.sin((frame - born) / 14) * 0.015 : 1;

  const emphP = springIn(frame, fps, emphasizedBorn ?? born);
  const isEmphasizedNow = emphasized && emphP >= 0.5;
  const popScale = emphasizedBorn !== undefined ? interpolate(emphP, [0, 1], [1, 1.12], { extrapolateRight: "clamp" }) : 1;
  const scale = settleScale * breathe * (emphP < 1 ? popScale : 1);

  const subP = springIn(frame, fps, sublabelBorn ?? born);
  const subOpacity = interpolate(subP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(subP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", opacity, transform: `translateY(${y}px) scale(${scale})` }}>
      <div
        style={{
          fontFamily: F_UI,
          fontSize: 28,
          fontWeight: 600,
          padding: "12px 22px",
          borderRadius: 8,
          color: isEmphasizedNow ? "#08090c" : INK,
          background: isEmphasizedNow ? `linear-gradient(160deg, ${ACCENT}, ${ACCENT}CC)` : NEUTRAL_FILL,
          border: isEmphasizedNow ? "none" : `1px solid ${NEUTRAL_BORDER}`,
          boxShadow: isEmphasizedNow ? `0 10px 26px -8px ${ACCENT}99, inset 0 1px 0 0 #ffffff55` : "none",
        }}
      >
        {text}
      </div>
      {sublabel ? (
        <div
          style={{
            fontFamily: F_UI,
            fontSize: 14,
            color: DIM,
            marginTop: 8,
            letterSpacing: 0.5,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          {sublabel}
        </div>
      ) : null}
    </div>
  );
};
