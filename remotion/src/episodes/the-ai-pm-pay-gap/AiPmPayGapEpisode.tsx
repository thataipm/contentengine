import React from "react";
import { staticFile, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, ShotDef, totalEpisodeFrames } from "../../Episode";
import { FPS } from "../../theme";
import { INK_LIGHT } from "../../theme_skills";
import { Shot1_Hook } from "./Shot1_Hook";
import { Shot2_SalaryGap } from "./Shot2_SalaryGap";
import { Shot3_HiringTrend } from "./Shot3_HiringTrend";
import { Shot4_InvestmentGap } from "./Shot4_InvestmentGap";
import { Shot5_Close } from "./Shot5_Close";

// "The AI PM Pay Gap" — @thataipm v2.0, Batch 1 concept 1 of 2. AI PM
// pillar (authority), stat-driven, no product/tool to screenshot, so
// visuals are comparison cards and disparity bars instead of RepoScreenshot.
type Props = {
  frames: {
    shot1: number;
    shot2: number;
    shot3: number;
    shot4: number;
    shot5: number;
  };
};

const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

export const calculateAiPmPayGapMetadata: CalculateMetadataFunction<Props> = async () => {
  const [shot1, shot2, shot3, shot4, shot5] = await Promise.all([
    getAudioDurationInSeconds(staticFile("the-ai-pm-pay-gap/shot1_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-ai-pm-pay-gap/shot2_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-ai-pm-pay-gap/shot3_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-ai-pm-pay-gap/shot4_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-ai-pm-pay-gap/shot5_vo.wav")),
  ]);

  const frames = {
    shot1: secondsToFrames(shot1),
    shot2: secondsToFrames(shot2),
    shot3: secondsToFrames(shot3),
    shot4: secondsToFrames(shot4),
    shot5: secondsToFrames(shot5),
  };

  return {
    props: { frames },
    durationInFrames: totalEpisodeFrames(buildShots(frames)),
  };
};

const buildShots = (frames: Props["frames"]): ShotDef[] => [
  { durationInFrames: frames.shot1, component: Shot1_Hook },
  { durationInFrames: frames.shot2, component: Shot2_SalaryGap },
  { durationInFrames: frames.shot3, component: Shot3_HiringTrend },
  { durationInFrames: frames.shot4, component: Shot4_InvestmentGap },
  { durationInFrames: frames.shot5, component: Shot5_Close },
];

export const AiPmPayGapEpisode: React.FC<Props> = ({ frames }) => (
  <Episode shots={buildShots(frames)} accentColor={INK_LIGHT} watermarkHandle="@thataipm" watermarkColor={INK_LIGHT} />
);
