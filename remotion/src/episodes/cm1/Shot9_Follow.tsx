import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Captions } from "../../components/Captions";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, F_DISPLAY, INK, DIM, BG, ACCENT } from "../../theme";
import words from "./data/shot9_words.json";

// VO: "Follow for how AI actually works, before you ask it to spell
// anything else." (165 frames). Follow-only CTA, no comment-keyword gate
// (per direct instruction, holding off on that mechanic until there's an
// audience to drive it). Bigger title + button and a one-line recap so
// this closing shot uses the same top-to-bottom space as the rest of the
// episode. Tried a GlowOrb3D behind the button (2026-08-07) — it poked out
// below as a visible half-circle bump since the button's own shape isn't
// round. Reverted to the CSS box-shadow the button already had, which
// hugs its actual rounded-rect silhouette correctly.
export const Shot9_Follow: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = springIn(frame, fps, 4);
  const scale = interpolate(p, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame / 10) * 0.03;

  const recapP = springIn(frame, fps, 40);
  const recapOpacity = interpolate(recapP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <Audio src={staticFile("cm1/shot9_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 60, fontWeight: 700, color: INK, marginBottom: 50, letterSpacing: -1 }}>
          How AI Actually Works
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            background: ACCENT,
            borderRadius: 999,
            padding: "22px 50px",
            transform: `scale(${pulse})`,
            boxShadow: `0 20px 50px -12px ${ACCENT}99`,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke={BG} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: F_UI, fontSize: 30, fontWeight: 700, color: BG }}>Follow</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", opacity: recapOpacity }}>
        <div style={{ fontFamily: F_UI, fontSize: 22, color: DIM, letterSpacing: 0.5 }}>
          tokens, not letters &middot; episode 1 of Core Mechanics
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
