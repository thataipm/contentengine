import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatWindow } from "../../components/ChatWindow";
import { ChatBubble } from "../../components/ChatBubble";
import { Captions } from "../../components/Captions";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, DIM } from "../../theme";
import words from "./data/shot1_words.json";

// VO: "In 2020, GPT-3 could write you a sonnet, debate philosophy, hold a
// conversation good enough to fool people." (203 frames). Hook rewritten to
// lead with hyperbolic contrast (per the channel's proven hook formula),
// demonstrated literally: a real chat window with the assistant's reply
// actually streaming in clause by clause, synced to the real words that
// name each capability (sonnet@73, philosophy@105, conversation@150) — the
// demonstration itself IS the explanation, not a caption describing it.
const SEGMENTS = [
  { text: "I can write sonnets,", born: 73 },
  { text: " debate philosophy,", born: 105 },
  { text: " hold real conversations.", born: 150 },
];

export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visibleText = SEGMENTS.filter((s) => frame >= s.born)
    .map((s) => s.text)
    .join("");

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("tn1/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

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
        Then vs Now &middot; Reasoning
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <ChatWindow label="GPT-3 · 2020" born={2} frame={frame} fps={fps}>
          <ChatBubble role="assistant" born={2} frame={frame} fps={fps} text={visibleText} fontSize={32} />
        </ChatWindow>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
