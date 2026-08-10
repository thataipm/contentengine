import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatBubble } from "../../components/ChatBubble";
import { Captions } from "../../components/Captions";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, DIM } from "../../theme";
import words from "./data/shot7_words.json";

// VO: "So next time AI solves something instantly, remember: in 2020 it
// could write you a sonnet. It just couldn't count to a hundred." (247
// frames). Callback to the hook using the same ChatBubble unit the whole
// episode is built from (not a new shape), landing on the real words that
// name each half (sonnet@175, hundred@233).
const TOP_BORN = 168;
const BOTTOM_BORN = 226;

export const Shot7_SonnetNotMath: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("tn1/shot7_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

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
        2020, In Its Own Words
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center" }}>
        <ChatBubble role="assistant" born={TOP_BORN} frame={frame} fps={fps} text="wrote sonnets" fontSize={38} state="correct" />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center" }}>
        <ChatBubble role="assistant" born={BOTTOM_BORN} frame={frame} fps={fps} text="couldn't count to 100" fontSize={38} state="wrong" />
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
