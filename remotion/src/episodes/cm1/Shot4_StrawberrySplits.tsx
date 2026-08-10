import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneRig } from "../../three/SceneRig";
import { GlowBeam3D } from "../../three/GlowBeam3D";
import { GlowBox } from "../../components/GlowBox";
import { Captions } from "../../components/Captions";
import { pxToWorld } from "../../three/coords";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, DIM, ACCENT } from "../../theme";
import words from "./data/shot4_words.json";

// VO: "So 'strawberry' doesn't stay one word. It splits into pieces,
// something like 'straw' and 'berry,' two chunks that have never met."
// (246 frames). Real bloom beam grows horizontally between the two boxes
// as they drift apart on "never met" (real word timing: 219-233) — the
// beam widening IS the "distance apart," replacing the earlier plain
// number readout with something the light itself demonstrates.
const STRAW_BORN = 0;
const BERRY_BORN = 20;
const DRIFT_START = 210;
const DRIFT_END = 236;

export const Shot4_StrawberrySplits: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drift = interpolate(frame, [DRIFT_START, DRIFT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gap = 40 + drift * 220;
  const beamLength = 40 + drift * 220;
  const beamOpacity = interpolate(drift, [0, 0.15, 1], [0, 1, 1]);

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("cm1/shot4_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <SceneRig>
        <GlowBeam3D position={pxToWorld(540, 850, 0, 0)} horizontal thickness={2.5} length={beamLength} opacity={beamOpacity} intensity={3.4} color={ACCENT} />
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
        Two Chunks That Never Met
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap }}>
          <GlowBox tag="[01]" born={STRAW_BORN} frame={frame} fps={fps} fontSize={72} accent>
            straw
          </GlowBox>
          <GlowBox tag="[02]" tagAlign="right" born={BERRY_BORN} frame={frame} fps={fps} fontSize={72} accent>
            berry
          </GlowBox>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1220, textAlign: "center" }}>
        <div style={{ fontFamily: F_UI, fontSize: 42, fontWeight: 700, color: drift > 0 ? ACCENT : DIM }}>
          {Math.round(drift * 480)}px apart
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
