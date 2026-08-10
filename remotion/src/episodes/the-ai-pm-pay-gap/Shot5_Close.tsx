import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CommentCTA } from "../../components/CommentCTA";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import words from "./data/shot5_words.json";

// VO: "Companies want AI-native PMs. They're just not building them,
// they're hiring for it instead. Comment AIPM and I'll send you where to
// start." (293 frames).
export const Shot5_Close: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot5_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="chime" at={14} />

      <ContentZone top={220} bottom={220}>
        <CommentCTA keyword="AIPM" born={14} frame={frame} fps={fps} />
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
