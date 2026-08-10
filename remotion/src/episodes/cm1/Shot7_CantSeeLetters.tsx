import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { SceneRig } from "../../three/SceneRig";
import { GlowBeam3D } from "../../three/GlowBeam3D";
import { Captions } from "../../components/Captions";
import { pxToWorld } from "../../three/coords";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, INK, DIM, ACCENT } from "../../theme";
import words from "./data/shot7_words.json";

// VO: "The model never actually sees the letters inside those chunks.
// It's not doing bad math. It's not doing math at all." (232 frames). A
// real bloom-lit vertical beam sweeps across the letters (genuine light
// moving through 3D space, not a CSS gradient position sweep), then they
// fail/vanish — same beats as before, real light doing the scanning now.
const SCAN_START = 40;
const SCAN_END = 95;
const FAIL_START = 178;
const FAIL_END = 218;
const LETTERS = ["b", "e", "r", "r", "y"];

export const Shot7_CantSeeLetters: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const scanX = interpolate(frame, [SCAN_START, SCAN_END], [200, 880], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanOpacity = frame >= SCAN_START && frame < FAIL_START ? 1 : 0;

  const failP = interpolate(frame, [FAIL_START, FAIL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = failP > 0 && failP < 1 ? Math.sin(frame * 3) * 8 * (1 - failP) : 0;
  const lettersOpacity = interpolate(failP, [0, 1], [1, 0]);
  const visibleCount = Math.round(interpolate(failP, [0, 1], [5, 0]));

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("cm1/shot7_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <SceneRig>
        <GlowBeam3D position={pxToWorld(scanX, 850, 0, 0)} horizontal={false} thickness={4} length={300} opacity={scanOpacity} intensity={3.4} />
      </SceneRig>

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
        Inside The Token &ldquo;berry&rdquo;
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 760,
          display: "flex",
          justifyContent: "center",
          gap: 34,
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {LETTERS.map((l, i) => (
          <div key={i} style={{ fontFamily: F_UI, fontSize: 92, fontWeight: 700, color: INK, opacity: lettersOpacity }}>
            {l}
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center" }}>
        <div style={{ fontFamily: F_UI, fontSize: 42, fontWeight: 700, color: visibleCount === 0 ? ACCENT : DIM }}>
          {visibleCount} letters visible
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
