import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { ComparisonCard } from "../../components/ComparisonCard";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS, CARD_DIM } from "../../theme_skills";
import words from "./data/shot1_words.json";

// VO: "There are now two kinds of product managers, and one of them earns
// almost double the other's salary." (154 frames). Two identical, unlabeled
// PM cards appear immediately (hook lands in the first frame, no build-up),
// then physically diverge, one growing brighter and larger, the other
// dimming, as "earns almost double" plays. The disparity itself is the
// visual, not a diagram of it.
const DISPARITY_START = 88; // "earns"
const DISPARITY_END = 122; // end of "double"

export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const growProgress = interpolate(frame, [DISPARITY_START, DISPARITY_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="whoosh" at={DISPARITY_START} />
      <Sfx type="chime" at={DISPARITY_END} />

      <ContentZone>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <ComparisonCard
            label="PM"
            accent={ACCENTS[0]}
            scale={interpolate(growProgress, [0, 1], [1, 1.14])}
            glowStrength={interpolate(growProgress, [0, 1], [0.15, 0.9])}
            born={0}
            frame={frame}
            fps={fps}
          />
          <ComparisonCard
            label="PM"
            accent={CARD_DIM}
            scale={interpolate(growProgress, [0, 1], [1, 0.86])}
            glowStrength={interpolate(growProgress, [0, 1], [0.15, 0.05])}
            born={0}
            frame={frame}
            fps={fps}
          />
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
