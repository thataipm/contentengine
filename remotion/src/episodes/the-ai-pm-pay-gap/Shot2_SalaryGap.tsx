import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { ComparisonCard } from "../../components/ComparisonCard";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS, CARD_DIM } from "../../theme_skills";
import words from "./data/shot2_words.json";

// VO: "AI-native PMs are averaging around two hundred forty five thousand
// dollars. Traditional PMs, about one hundred twenty three thousand."
// (243 frames). Same two cards from Shot 1, now labeled and given their
// real numbers as each side is spoken.
const LEFT_LABEL_BORN = 6; // "AI-native"
const LEFT_VALUE_BORN = 124; // "dollars."
const RIGHT_LABEL_BORN = 141; // "Traditional"
const RIGHT_VALUE_BORN = 227; // "thousand."

export const Shot2_SalaryGap: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftPop = interpolate(springIn(frame, fps, LEFT_LABEL_BORN), [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const rightPop = interpolate(springIn(frame, fps, RIGHT_LABEL_BORN), [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot2_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={LEFT_LABEL_BORN} />
      <Sfx type="chime" at={LEFT_VALUE_BORN} />
      <Sfx type="tick" at={RIGHT_LABEL_BORN} />
      <Sfx type="chime" at={RIGHT_VALUE_BORN} />

      <ContentZone>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <ComparisonCard
            label="AI-Native PM"
            value="$245,000"
            accent={ACCENTS[0]}
            scale={interpolate(leftPop, [0, 1], [0.9, 1.1])}
            glowStrength={interpolate(leftPop, [0, 1], [0, 0.85])}
            born={LEFT_LABEL_BORN}
            valueBorn={LEFT_VALUE_BORN}
            frame={frame}
            fps={fps}
          />
          <ComparisonCard
            label="Traditional PM"
            value="$123,000"
            accent={CARD_DIM}
            scale={interpolate(rightPop, [0, 1], [0.9, 0.9])}
            glowStrength={interpolate(rightPop, [0, 1], [0, 0.1])}
            born={RIGHT_LABEL_BORN}
            valueBorn={RIGHT_VALUE_BORN}
            frame={frame}
            fps={fps}
          />
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
