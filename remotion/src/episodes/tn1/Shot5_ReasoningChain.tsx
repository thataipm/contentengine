import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatWindow } from "../../components/ChatWindow";
import { ChatBubble } from "../../components/ChatBubble";
import { ReasoningPanel } from "../../components/ReasoningPanel";
import { Captions } from "../../components/Captions";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import words from "./data/shot5_words.json";

// VO: "Because modern models don't guess. They reason through it, step by
// step, before they say a word." (191 frames). The real product pattern:
// a "Reasoning" drawer builds step by step above the final answer (real
// word timing: reason@81, step@112/127, before@139), then the answer
// bubble resolves once reasoning is marked done — mirrors how actual
// current chat products separate process from response.
const STEP1_BORN = 85;
const STEP2_BORN = 118;
const STEP3_BORN = 142;
const DONE_BORN = 165;

export const Shot5_ReasoningChain: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const done = frame >= DONE_BORN;

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("tn1/shot5_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}>
        <ChatWindow label="TODAY" born={0} frame={frame} fps={fps}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ChatBubble role="user" born={0} frame={frame} fps={fps} text="47 × 68 = ?" fontSize={30} mono />
            <ReasoningPanel
              steps={[
                { text: "47 × 60 = 2820", born: STEP1_BORN },
                { text: "47 × 8 = 376", born: STEP2_BORN },
                { text: "2820 + 376 = 3196", born: STEP3_BORN },
              ]}
              born={0}
              frame={frame}
              fps={fps}
              done={done}
            />
            {done ? <ChatBubble role="assistant" born={DONE_BORN} frame={frame} fps={fps} text="= 3196" fontSize={30} mono state="correct" /> : null}
          </div>
        </ChatWindow>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
