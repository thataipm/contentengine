import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneRig } from "../../three/SceneRig";
import { GlowBeam3D } from "../../three/GlowBeam3D";
import { ChatWindow } from "../../components/ChatWindow";
import { ChatBubble } from "../../components/ChatBubble";
import { Captions } from "../../components/Captions";
import { springIn, edgeFadeVolume } from "../../motion";
import { pxToWorld } from "../../three/coords";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_DISPLAY, INK } from "../../theme";
import words from "./data/shot4_words.json";

// VO: "Same question. Today." (81 frames) — the episode's pivot, still the
// sparsest shot by design. A full-height beam wipes across as the SAME
// chat window reappears with its header flipped to "TODAY" (real word
// timing: born 51), instead of a floating equation field.
const TEXT_BORN = 3;
const WINDOW_BORN = 51;

export const Shot4_SameQuestionToday: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textP = springIn(frame, fps, TEXT_BORN);
  const textOpacity = interpolate(textP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const textFade = interpolate(frame, [WINDOW_BORN - 4, WINDOW_BORN + 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wipeP = interpolate(frame, [WINDOW_BORN, WINDOW_BORN + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipeX = interpolate(wipeP, [0, 1], [80, 1000]);
  const wipeOpacity = interpolate(frame, [WINDOW_BORN, WINDOW_BORN + 3, WINDOW_BORN + 18, WINDOW_BORN + 24], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("tn1/shot4_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <SceneRig>
        <GlowBeam3D position={pxToWorld(wipeX, 960, 0, 0)} thickness={4} length={1920} opacity={wipeOpacity} intensity={4} />
      </SceneRig>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 860,
          textAlign: "center",
          fontFamily: F_DISPLAY,
          fontSize: 64,
          fontWeight: 700,
          color: INK,
          opacity: textOpacity * textFade,
        }}
      >
        Same question.
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center" }}>
        <ChatWindow label="TODAY" born={WINDOW_BORN} frame={frame} fps={fps}>
          <ChatBubble role="user" born={WINDOW_BORN} frame={frame} fps={fps} text="47 × 68 = ?" fontSize={30} mono />
        </ChatWindow>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
