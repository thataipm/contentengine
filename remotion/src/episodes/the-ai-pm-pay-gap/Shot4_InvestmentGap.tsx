import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { RepoScreenshot } from "../../components/RepoScreenshot";
import { SourceIcon } from "../../components/SourceIcon";
import { DisparityBar } from "../../components/DisparityBar";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS } from "../../theme_skills";
import words from "./data/shot4_words.json";

// VO: "Eighty five percent of leadership is investing in AI tools, and
// only two percent are investing in the PMs who'd actually use them."
// (253 frames). Real screenshot of Productboard's CPO survey sentence,
// then the two real bars.
const BEAT_B = 130; // "and" landing, right after "tools,"
const BAR_B_BORN = 145; // "two"

export const Shot4_InvestmentGap: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot4_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="whoosh" at={BEAT_B} />
      <Sfx type="chime" at={BAR_B_BORN} />

      <ContentZone>
        {frame < BEAT_B ? (
          <RepoScreenshot
            image={staticFile("the-ai-pm-pay-gap/shots/productboard_stats.png")}
            icon={<SourceIcon />}
            url="productboard.com — CPO survey"
            starsBox={{ x: 340, y: 475, w: 940, h: 95 }}
            born={0}
            zoomStart={10}
            zoomEnd={120}
            frame={frame}
            fps={fps}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
            <DisparityBar label="Investing in AI tools" percent={85} accent={ACCENTS[2]} born={BEAT_B} frame={frame} fps={fps} />
            <DisparityBar label="Investing in the PMs who'd use them" percent={2} accent={ACCENTS[1]} born={BAR_B_BORN} frame={frame} fps={fps} />
          </div>
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
