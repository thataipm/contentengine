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

// VO: "If you're a mid-level product manager right now, hiring for your
// role just dropped double digits. If you're senior and AI-fluent, it's
// never been better." (264 frames). Two identical PM cards diverge in two
// beats matching the two real clauses: the right card dims on "dropped
// double digits," the left card grows bright on "never been better."
const DIM_START = 112; // "dropped"
const DIM_END = 157; // end of "digits."
const GROW_START = 232; // "never"
const GROW_END = 257; // end of "better."

export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dimProgress = interpolate(frame, [DIM_START, DIM_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const growProgress = interpolate(frame, [GROW_START, GROW_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="whoosh" at={DIM_START} />
      <Sfx type="whoosh" at={GROW_START} />
      <Sfx type="chime" at={GROW_END} />

      <ContentZone>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <ComparisonCard
            label="Senior + AI-fluent PM"
            accent={ACCENTS[0]}
            scale={interpolate(growProgress, [0, 1], [1, 1.14])}
            glowStrength={interpolate(growProgress, [0, 1], [0.15, 0.9])}
            born={0}
            frame={frame}
            fps={fps}
          />
          <ComparisonCard
            label="Mid-level PM"
            accent={CARD_DIM}
            scale={interpolate(dimProgress, [0, 1], [1, 0.86])}
            glowStrength={interpolate(dimProgress, [0, 1], [0.15, 0.05])}
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
