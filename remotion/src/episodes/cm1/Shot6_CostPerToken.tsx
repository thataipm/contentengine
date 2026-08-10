import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GlowBox } from "../../components/GlowBox";
import { Captions } from "../../components/Captions";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, DIM, ACCENT } from "../../theme";
import words from "./data/shot6_words.json";

// VO: "That's also why AI charges you per token, not per word. Even your
// typos cost something." (205 frames). The running cost is the hero, chips
// are small supporting context underneath. Tried a GlowOrb3D behind the
// number (2026-08-07) — same failure as Shot1/Shot5, a round point light
// sitting on wide text just looks like a ball covering the digits.
// Reverted to CSS text-shadow, which works correctly at this scale.
const COST_START = 30;
const COST_END = 160;

export const Shot6_CostPerToken: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const costP = springIn(frame, fps, COST_START);
  const costOpacity = interpolate(costP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const cost = interpolate(frame, [COST_START, COST_END], [0, 0.00042], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("cm1/shot6_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 20,
          color: DIM,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Charged Per Token, Not Per Word
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", opacity: costOpacity }}>
        <div style={{ fontFamily: F_UI, fontSize: 104, fontWeight: 700, color: ACCENT, textShadow: `0 0 70px ${ACCENT}77` }}>
          ${cost.toFixed(5)}
        </div>
        <div style={{ fontFamily: F_UI, fontSize: 18, color: DIM, letterSpacing: 1, textTransform: "uppercase", marginTop: 12 }}>
          running cost
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1220, display: "flex", justifyContent: "center", gap: 20 }}>
        <GlowBox born={0} frame={frame} fps={fps} fontSize={32}>
          straw
        </GlowBox>
        <GlowBox born={0} frame={frame} fps={fps} fontSize={32}>
          berry
        </GlowBox>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
