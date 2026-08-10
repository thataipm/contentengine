import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { RepoScreenshot } from "../../components/RepoScreenshot";
import { SourceIcon } from "../../components/SourceIcon";
import { ComparisonCard } from "../../components/ComparisonCard";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS, CARD_DIM } from "../../theme_skills";
import words from "./data/shot2_words.json";

// VO: "Senior AI-PM hiring is up thirty four percent this year. Junior
// and mid-level PM hiring dropped twelve percent." (246 frames). Beat A
// shows the REAL institutepm.com stat cards (BCG's 2026 workforce
// report) zoomed into the actual +34%/-12% figures, real evidence this
// number exists, not an assertion. Beat B is the clean payoff.
const BEAT_B = 95; // "year." landing

export const Shot2_SalaryGap: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rightPop = interpolate(springIn(frame, fps, 170), [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot2_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="chime" at={BEAT_B} />
      <Sfx type="tick" at={170} />

      <ContentZone>
        {frame < BEAT_B ? (
          <RepoScreenshot
            image={staticFile("the-ai-pm-pay-gap/shots/institutepm_stats.png")}
            icon={<SourceIcon />}
            url="institutepm.com — BCG 2026 workforce report"
            starsBox={{ x: 165, y: 350, w: 665, h: 195 }}
            born={0}
            zoomStart={10}
            zoomEnd={90}
            frame={frame}
            fps={fps}
          />
        ) : (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            <ComparisonCard
              label="Senior AI-PM hiring"
              value="+34%"
              accent={ACCENTS[1]}
              scale={1.1}
              glowStrength={0.85}
              born={BEAT_B}
              valueBorn={BEAT_B}
              frame={frame}
              fps={fps}
            />
            <ComparisonCard
              label="Junior/mid PM hiring"
              value="-12%"
              accent={CARD_DIM}
              scale={interpolate(rightPop, [0, 1], [0.9, 0.94])}
              glowStrength={0.15}
              born={170}
              valueBorn={225}
              frame={frame}
              fps={fps}
            />
          </div>
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
