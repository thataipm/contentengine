import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneRig } from "../../three/SceneRig";
import { GlowBeam3D } from "../../three/GlowBeam3D";
import { GlowBox } from "../../components/GlowBox";
import { Captions } from "../../components/Captions";
import { pxToWorld } from "../../three/coords";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, DIM, ACCENT } from "../../theme";
import words from "./data/shot3_words.json";

// VO: "Not into letters. Into tokens: chunks of a few characters each."
// (145 frames). Vertical stack (straw above, berry below) joined by a
// real bloom-lit connecting beam — same shape as the previous DOM-only
// pass, now with genuine light instead of a CSS divider line. Builds in
// early (not waiting for "tokens:" at frame 61) so there's no dead runway.
const BOX1_BORN = 8;
const BOX2_BORN = 32;

export const Shot3_TokensNotLetters: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beamP = springIn(frame, fps, BOX1_BORN + 4);
  const beamOpacity = interpolate(beamP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const beamLength = interpolate(beamP, [0, 1], [0, 260], { extrapolateRight: "clamp" });

  const p2 = springIn(frame, fps, BOX2_BORN);
  const count = p2 >= 0.5 ? 2 : 1;

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("cm1/shot3_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <SceneRig>
        <GlowBeam3D position={pxToWorld(540, 850, 0, 0)} thickness={2.5} length={beamLength} opacity={beamOpacity} intensity={3.4} />
      </SceneRig>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 260,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 20,
          color: DIM,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Not Letters &middot; Tokens
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 90 }}>
        <GlowBox tag="[01]" born={BOX1_BORN} frame={frame} fps={fps} fontSize={70}>
          straw
        </GlowBox>
        <GlowBox tag="[02]" tagAlign="right" born={BOX2_BORN} frame={frame} fps={fps} fontSize={70}>
          berry
        </GlowBox>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center" }}>
        <div style={{ fontFamily: F_UI, fontSize: 40, fontWeight: 700, color: count > 0 ? ACCENT : DIM }}>{count} token{count === 1 ? "" : "s"} found</div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
