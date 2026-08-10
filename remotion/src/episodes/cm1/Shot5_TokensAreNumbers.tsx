import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Captions } from "../../components/Captions";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, INK, DIM, ACCENT } from "../../theme";
import words from "./data/shot5_words.json";

// VO: "Models don't read words either. Every token turns into a number.
// As far as it's concerned, you never typed a word." (244 frames).
// Word-to-number conversion rows. Tried a GlowOrb3D behind each number
// (2026-08-07) — same problem as Shot1: a point light source sitting on
// top of readable text just looks like a ball covering part of a digit,
// not a backlight. Reverted to a CSS text-shadow glow on the number
// itself, which reads correctly at this compact a scale.
const STRAW_BORN = 14;
const STRAW_NUM_BORN = 90;
const BERRY_BORN = 118;
const BERRY_NUM_BORN = 175;

const ConversionRow: React.FC<{
  word: string;
  id: string;
  wordBorn: number;
  numBorn: number;
  top: number;
  frame: number;
  fps: number;
}> = ({ word, id, wordBorn, numBorn, top, frame, fps }) => {
  const wordP = springIn(frame, fps, wordBorn);
  const wordOpacity = interpolate(wordP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const wordX = interpolate(wordP, [0, 1], [-40, 0], { extrapolateRight: "clamp" });

  const arrowP = springIn(frame, fps, wordBorn + 14);
  const arrowOpacity = interpolate(arrowP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const numP = springIn(frame, fps, numBorn);
  const numOpacity = interpolate(numP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const numScale = interpolate(numP, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
        <div
          style={{
            fontFamily: F_UI,
            fontSize: 54,
            fontWeight: 700,
            color: INK,
            opacity: wordOpacity,
            transform: `translateX(${wordX}px)`,
            minWidth: 220,
            textAlign: "right",
          }}
        >
          {word}
        </div>
        <div style={{ fontFamily: F_UI, fontSize: 40, color: DIM, opacity: arrowOpacity }}>&rarr;</div>
        <div
          style={{
            fontFamily: F_UI,
            fontSize: 54,
            fontWeight: 700,
            color: ACCENT,
            textShadow: `0 0 40px ${ACCENT}88`,
            opacity: numOpacity,
            transform: `scale(${numScale})`,
            minWidth: 220,
            textAlign: "left",
          }}
        >
          {id}
        </div>
      </div>
    </>
  );
};

export const Shot5_TokensAreNumbers: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("cm1/shot5_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

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
        Every Token Becomes A Number
      </div>

      <ConversionRow word="straw" id="82019" wordBorn={STRAW_BORN} numBorn={STRAW_NUM_BORN} top={780} frame={frame} fps={fps} />
      <ConversionRow word="berry" id="40218" wordBorn={BERRY_BORN} numBorn={BERRY_NUM_BORN} top={920} frame={frame} fps={fps} />

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
