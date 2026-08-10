import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { DisparityBar } from "../../components/DisparityBar";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS } from "../../theme_skills";
import words from "./data/shot4_words.json";

// VO: "Eighty five percent of leadership is investing in AI tools, and only
// two percent are investing in the PMs who'd actually use them." (268
// frames). Two real bars, not a metaphor, the 85/2 gap fills as each half
// is spoken.
const BAR_A_BORN = 4; // "Eighty"
const BAR_B_BORN = 146; // "only"

export const Shot4_InvestmentGap: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot4_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="whoosh" at={BAR_A_BORN} />
      <Sfx type="chime" at={BAR_B_BORN} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <DisparityBar label="Investing in AI tools" percent={85} accent={ACCENTS[2]} born={BAR_A_BORN} frame={frame} fps={fps} />
          <DisparityBar label="Investing in the PMs who'd use them" percent={2} accent={ACCENTS[1]} born={BAR_B_BORN} frame={frame} fps={fps} />
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
