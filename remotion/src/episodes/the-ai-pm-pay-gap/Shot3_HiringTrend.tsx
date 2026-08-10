import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { ComparisonCard } from "../../components/ComparisonCard";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS } from "../../theme_skills";
import words from "./data/shot3_words.json";

// VO: "Senior AI-PM hiring is up thirty four percent. Junior and mid-level
// PM hiring dropped twelve percent, same period." (270 frames). Same
// two-card grammar as Shot 2, now growth vs decline: green for the real
// gain, orange for the real drop.
const LEFT_LABEL_BORN = 3; // "Senior"
const LEFT_VALUE_BORN = 107; // "percent." (end of "thirty four")
const RIGHT_LABEL_BORN = 129; // "Junior"
const RIGHT_VALUE_BORN = 232; // "percent," (end of "twelve")

export const Shot3_HiringTrend: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftPop = interpolate(springIn(frame, fps, LEFT_LABEL_BORN), [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const rightPop = interpolate(springIn(frame, fps, RIGHT_LABEL_BORN), [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot3_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={LEFT_LABEL_BORN} />
      <Sfx type="chime" at={LEFT_VALUE_BORN} />
      <Sfx type="tick" at={RIGHT_LABEL_BORN} />
      <Sfx type="chime" at={RIGHT_VALUE_BORN} />

      <ContentZone>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <ComparisonCard
            label="Senior AI-PM hiring"
            value="+34%"
            accent={ACCENTS[1]}
            scale={interpolate(leftPop, [0, 1], [0.9, 1.1])}
            glowStrength={interpolate(leftPop, [0, 1], [0, 0.85])}
            born={LEFT_LABEL_BORN}
            valueBorn={LEFT_VALUE_BORN}
            frame={frame}
            fps={fps}
          />
          <ComparisonCard
            label="Junior/mid PM hiring"
            value="-12%"
            accent={ACCENTS[2]}
            scale={interpolate(rightPop, [0, 1], [0.9, 1.02])}
            glowStrength={interpolate(rightPop, [0, 1], [0, 0.5])}
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
