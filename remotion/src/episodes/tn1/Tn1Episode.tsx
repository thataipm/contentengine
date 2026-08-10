import React from "react";
import { staticFile, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, ShotDef, totalEpisodeFrames } from "../../Episode";
import { FPS, ACCENT } from "../../theme";
import { Shot1_Hook } from "./Shot1_Hook";
import { Shot2_OneInThree } from "./Shot2_OneInThree";
import { Shot3_GuessingDigits } from "./Shot3_GuessingDigits";
import { Shot4_SameQuestionToday } from "./Shot4_SameQuestionToday";
import { Shot5_ReasoningChain } from "./Shot5_ReasoningChain";
import { Shot6_BeyondMath } from "./Shot6_BeyondMath";
import { Shot7_SonnetNotMath } from "./Shot7_SonnetNotMath";
import { Shot8_Follow } from "./Shot8_Follow";

// tn1: "AI Couldn't Do Math (2020 vs. Today)" — Pillar 2 (Then vs Now),
// first episode of this pillar. Real sourced comparison (GPT-3's own
// published 2020 arithmetic accuracy, Brown et al., arXiv:2005.14165), not
// a reproduced image, so this episode has zero copyright-reproduction risk.
// Visual design was decided per-script (not reusing cm1's token-chip visual
// language), per direct instruction.
type Props = {
  frames: {
    shot1: number;
    shot2: number;
    shot3: number;
    shot4: number;
    shot5: number;
    shot6: number;
    shot7: number;
    shot8: number;
  };
};

const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

export const calculateTn1Metadata: CalculateMetadataFunction<Props> = async () => {
  const [shot1, shot2, shot3, shot4, shot5, shot6, shot7, shot8] = await Promise.all([
    getAudioDurationInSeconds(staticFile("tn1/shot1_vo.wav")),
    getAudioDurationInSeconds(staticFile("tn1/shot2_vo.wav")),
    getAudioDurationInSeconds(staticFile("tn1/shot3_vo.wav")),
    getAudioDurationInSeconds(staticFile("tn1/shot4_vo.wav")),
    getAudioDurationInSeconds(staticFile("tn1/shot5_vo.wav")),
    getAudioDurationInSeconds(staticFile("tn1/shot6_vo.wav")),
    getAudioDurationInSeconds(staticFile("tn1/shot7_vo.wav")),
    getAudioDurationInSeconds(staticFile("tn1/shot8_vo.wav")),
  ]);

  const frames = {
    shot1: secondsToFrames(shot1),
    shot2: secondsToFrames(shot2),
    shot3: secondsToFrames(shot3),
    shot4: secondsToFrames(shot4),
    shot5: secondsToFrames(shot5),
    shot6: secondsToFrames(shot6),
    shot7: secondsToFrames(shot7),
    shot8: secondsToFrames(shot8),
  };

  return {
    props: { frames },
    durationInFrames: totalEpisodeFrames(buildShots(frames)),
  };
};

const buildShots = (frames: Props["frames"]): ShotDef[] => [
  { durationInFrames: frames.shot1, component: Shot1_Hook },
  { durationInFrames: frames.shot2, component: Shot2_OneInThree },
  { durationInFrames: frames.shot3, component: Shot3_GuessingDigits },
  { durationInFrames: frames.shot4, component: Shot4_SameQuestionToday },
  { durationInFrames: frames.shot5, component: Shot5_ReasoningChain },
  { durationInFrames: frames.shot6, component: Shot6_BeyondMath },
  { durationInFrames: frames.shot7, component: Shot7_SonnetNotMath },
  { durationInFrames: frames.shot8, component: Shot8_Follow },
];

export const Tn1Episode: React.FC<Props> = ({ frames }) => (
  <Episode shots={buildShots(frames)} accentColor={ACCENT} watermarkHandle="@thataipm" watermarkColor={ACCENT} />
);
