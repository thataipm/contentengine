import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { TrendChart } from "../../components/TrendChart";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS, CARD_DIM } from "../../theme_skills";
import words from "./data/shot1_words.json";

// VO: "If you're a mid-level product manager right now, hiring for your
// role just dropped double digits. If you're senior and AI-fluent, it's
// never been better." (264 frames). Two literal, genuinely distinct
// beats -- a downward hiring trend line drawing in real time for the
// first clause, a hard cut to an upward trend line for the second --
// instead of one pair of stat cards held on screen with a subtle pulse.
// Rebuilt 2026-08-10 after direct feedback that the pulse-only version
// just read as "cards jumping," not distinct visuals.
const DOWN_DRAW_START = 20;
const DOWN_DRAW_END = 146; // just before "digits." ends
const BEAT_SPLIT = 157; // end of "digits." -- hard cut to the up-trend beat
const UP_DRAW_START = 175; // "senior"
const UP_DRAW_END = 257; // end of "better."

export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="whoosh" at={BEAT_SPLIT} />
      <Sfx type="chime" at={UP_DRAW_END} />

      <ContentZone>
        {frame < BEAT_SPLIT ? (
          <TrendChart
            direction="down"
            accent={CARD_DIM}
            label="Mid-level PM hiring"
            frame={frame}
            drawStart={DOWN_DRAW_START}
            drawEnd={DOWN_DRAW_END}
          />
        ) : (
          <TrendChart
            direction="up"
            accent={ACCENTS[1]}
            label="Senior + AI-fluent PM hiring"
            frame={frame}
            drawStart={UP_DRAW_START}
            drawEnd={UP_DRAW_END}
          />
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
