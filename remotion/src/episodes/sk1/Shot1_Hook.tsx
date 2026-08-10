import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { PipelineFlow, defaultPipelineNodes } from "../../components/PipelineFlow";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import words from "./data/shot1_words.json";

// VO: "I automated my entire video pipeline with three tools. Here's
// exactly how it works." (128 frames). Real visual hook per direct
// feedback ("never start a video with just captions") -- a flowchart
// builds itself node by node (Raw Footage -> video-use -> HyperFrames ->
// Remotion -> Final Video), the literal visualization this channel
// already uses for pipeline/agent content, synced to the real word
// timing that names each step.
export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sk1/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      {/* one tick per node popping in, chime on the final "Final Video" payoff */}
      <Sfx type="tick" at={0} />
      <Sfx type="tick" at={20} />
      <Sfx type="tick" at={42} />
      <Sfx type="tick" at={61} />
      <Sfx type="chime" at={83} />

      <ContentZone top={220} bottom={560}>
        <PipelineFlow nodes={defaultPipelineNodes()} frame={frame} fps={fps} />
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
