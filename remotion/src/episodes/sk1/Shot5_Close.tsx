import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CommentCTA } from "../../components/CommentCTA";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";

// VO: "Comment EDIT and I'll send you my exact pipeline, all three
// links." (136 frames).
export const Shot5_Close: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sk1/shot5_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="chime" at={5} />

      <ContentZone top={220} bottom={220}>
        <CommentCTA keyword="EDIT" born={5} frame={frame} fps={fps} />
      </ContentZone>
    </AbsoluteFill>
  );
};
