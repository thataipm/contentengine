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
import { F_UI, DIM } from "../../theme";
import words from "./data/shot3_words.json";

// VO: "Not because it was calculating. It was guessing, one digit at a
// time, like autocomplete finishing a sentence." (202 frames). Continues
// the same chat thread from Shot2: the assistant's reply resolves from
// typing dots into digits that visibly jitter (a deterministic sine-hash
// of frame, not Math.random() per render) before settling on an
// illustrative wrong total right as "one digit at a time" lands. A real
// HDR beam sweeps across the reply at the settle moment.
const SETTLE = 122;

const jitterDigit = (frame: number, seed: number) => {
  const x = Math.sin(frame * 12.9898 + seed * 78.233) * 43758.5453;
  return Math.floor((x - Math.floor(x)) * 10);
};

export const Shot3_GuessingDigits: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const settled = frame >= SETTLE;
  const digits = settled ? "3841" : Array.from({ length: 4 }, (_, i) => jitterDigit(frame, i)).join("");

  const statP = springIn(frame, fps, SETTLE + 16);
  const statOpacity = interpolate(statP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const sweepP = interpolate(frame, [SETTLE, SETTLE + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweepX = interpolate(sweepP, [0, 1], [400, 700]);
  const sweepOpacity = interpolate(frame, [SETTLE, SETTLE + 4, SETTLE + 22, SETTLE + 30], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("tn1/shot3_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <SceneRig>
        <GlowBeam3D position={pxToWorld(sweepX, 760, 0, 0)} thickness={3} length={260} opacity={sweepOpacity} intensity={4} />
      </SceneRig>

      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <ChatWindow label="GPT-3 · 2020" born={0} frame={frame} fps={fps}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ChatBubble role="user" born={0} frame={frame} fps={fps} text="47 × 68 = ?" fontSize={30} mono />
            <ChatBubble
              role="assistant"
              born={0}
              frame={frame}
              fps={fps}
              text={`= ${digits}`}
              fontSize={30}
              mono
              state={settled ? "wrong" : "neutral"}
            />
          </div>
        </ChatWindow>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", opacity: statOpacity }}>
        <div style={{ fontFamily: F_UI, fontSize: 24, fontWeight: 700, color: DIM }}>
          2-digit multiplication: correct 29.2% of the time
        </div>
        <div style={{ fontFamily: F_UI, fontSize: 16, color: DIM, marginTop: 10, letterSpacing: 0.5 }}>
          Source: GPT-3 few-shot benchmark, Brown et al., 2020
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
