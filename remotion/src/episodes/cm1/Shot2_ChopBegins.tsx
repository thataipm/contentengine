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
import words from "./data/shot2_words.json";

// VO: "Here's why. Every sentence you type gets sliced apart before the
// model ever reads it." (190 frames). The real HDR beam (via BloomRig)
// grows in right as "sliced apart" lands (real word timing: starts frame
// 113) — matches the Google Flow reference's "glowing lines slice text"
// look directly, now with genuine bloom instead of a CSS gradient sweep.
const BEAM_BORN = 108;

export const Shot2_ChopBegins: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beamP = springIn(frame, fps, BEAM_BORN);
  const beamOpacity = interpolate(beamP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const beamLength = interpolate(beamP, [0, 1], [0, 1900], { extrapolateRight: "clamp" });

  const barProgress = interpolate(frame, [0, BEAM_BORN + 20], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barLabel = beamP >= 1 ? "split into 2 chunks" : "processing input…";

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("cm1/shot2_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <SceneRig>
        <GlowBeam3D position={pxToWorld(540, 960, 0, 0)} thickness={3} length={beamLength} opacity={beamOpacity} intensity={4} />
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
        Before The Model Reads It
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center" }}>
        <GlowBox born={0} frame={frame} fps={fps} fontSize={90}>
          strawberry
        </GlowBox>
      </div>

      <div style={{ position: "absolute", left: 140, right: 140, top: 1080 }}>
        <div style={{ width: "100%", height: 10, borderRadius: 999, background: "#1E1E22", overflow: "hidden" }}>
          <div style={{ width: `${barProgress}%`, height: "100%", background: ACCENT, borderRadius: 999 }} />
        </div>
        <div style={{ fontFamily: F_UI, fontSize: 18, color: DIM, marginTop: 18, textAlign: "center", letterSpacing: 0.5 }}>
          {barLabel}
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
