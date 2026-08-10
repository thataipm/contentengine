import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChatWindow } from "../../components/ChatWindow";
import { ChatBubble } from "../../components/ChatBubble";
import { Captions } from "../../components/Captions";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, DIM, INK } from "../../theme";
import words from "./data/shot2_words.json";

// VO: "Ask it to multiply two two-digit numbers, and it was right about one
// time in three." (165 frames). The question lands in the chat as it's
// spoken (real word timing: born 37), the assistant starts "typing" right
// after, and a real product-style metadata badge ("~29% correct") attaches
// to the reply exactly as "one time in three" lands (born 133).
const QUESTION_BORN = 37;
const TYPING_BORN = 62;
const BADGE_BORN = 133;

export const Shot2_OneInThree: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeP = springIn(frame, fps, BADGE_BORN);
  const badgeOpacity = interpolate(badgeP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("tn1/shot2_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}>
        <ChatWindow label="GPT-3 · 2020" born={0} frame={frame} fps={fps}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ChatBubble role="user" born={QUESTION_BORN} frame={frame} fps={fps} text="47 × 68 = ?" fontSize={30} mono />
            {frame >= TYPING_BORN ? <ChatBubble role="assistant" born={TYPING_BORN} frame={frame} fps={fps} pending /> : null}
          </div>
        </ChatWindow>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", opacity: badgeOpacity }}>
        <div
          style={{
            display: "inline-block",
            border: `1px solid ${DIM}66`,
            borderRadius: 999,
            padding: "10px 24px",
            fontFamily: F_UI,
            fontSize: 20,
            fontWeight: 700,
            color: INK,
          }}
        >
          correct about 1 in 3 times
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
