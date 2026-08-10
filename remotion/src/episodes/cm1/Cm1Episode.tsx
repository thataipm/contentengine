import React from "react";
import { staticFile, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, ShotDef, totalEpisodeFrames } from "../../Episode";
import { FPS, ACCENT } from "../../theme";
import { Shot1_Hook } from "./Shot1_Hook";
import { Shot2_ChopBegins } from "./Shot2_ChopBegins";
import { Shot3_TokensNotLetters } from "./Shot3_TokensNotLetters";
import { Shot4_StrawberrySplits } from "./Shot4_StrawberrySplits";
import { Shot5_TokensAreNumbers } from "./Shot5_TokensAreNumbers";
import { Shot6_CostPerToken } from "./Shot6_CostPerToken";
import { Shot7_CantSeeLetters } from "./Shot7_CantSeeLetters";
import { Shot8_BlameEyesight } from "./Shot8_BlameEyesight";
import { Shot9_Follow } from "./Shot9_Follow";

// cm1: "Tokens: How AI Reads Text" — Pillar 1 (Core Mechanics), first real
// episode of "How AI Actually Works." No avatar footage (faceless channel),
// all 9 shots are VO-driven explainers, durations sourced from the real
// per-shot .wav files cut by automation/derive_word_timing.py.
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
    shot9: number;
  };
};

const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

export const calculateCm1Metadata: CalculateMetadataFunction<Props> = async () => {
  const [shot1, shot2, shot3, shot4, shot5, shot6, shot7, shot8, shot9] = await Promise.all([
    getAudioDurationInSeconds(staticFile("cm1/shot1_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot2_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot3_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot4_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot5_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot6_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot7_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot8_vo.wav")),
    getAudioDurationInSeconds(staticFile("cm1/shot9_vo.wav")),
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
    shot9: secondsToFrames(shot9),
  };

  return {
    props: { frames },
    durationInFrames: totalEpisodeFrames(buildShots(frames)),
  };
};

const buildShots = (frames: Props["frames"]): ShotDef[] => [
  { durationInFrames: frames.shot1, component: Shot1_Hook },
  { durationInFrames: frames.shot2, component: Shot2_ChopBegins },
  { durationInFrames: frames.shot3, component: Shot3_TokensNotLetters },
  { durationInFrames: frames.shot4, component: Shot4_StrawberrySplits },
  { durationInFrames: frames.shot5, component: Shot5_TokensAreNumbers },
  { durationInFrames: frames.shot6, component: Shot6_CostPerToken },
  { durationInFrames: frames.shot7, component: Shot7_CantSeeLetters },
  { durationInFrames: frames.shot8, component: Shot8_BlameEyesight },
  { durationInFrames: frames.shot9, component: Shot9_Follow },
];

export const Cm1Episode: React.FC<Props> = ({ frames }) => (
  <Episode shots={buildShots(frames)} accentColor={ACCENT} watermarkHandle="@thataipm" watermarkColor={ACCENT} />
);
