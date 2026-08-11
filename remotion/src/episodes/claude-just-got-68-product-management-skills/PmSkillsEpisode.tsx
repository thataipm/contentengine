import React from "react";
import { staticFile, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, ShotDef, totalEpisodeFrames } from "../../Episode";
import { FPS } from "../../theme";
import { ACCENTS } from "../../theme_skills";
import { Shot1_Hook } from "./Shot1_Hook";
import { Shot2_Lifecycle } from "./Shot2_Lifecycle";
import { Shot3_Critic } from "./Shot3_Critic";
import { Shot4_Stats } from "./Shot4_Stats";
import { Shot5_Close } from "./Shot5_Close";

// "Claude Just Got 68 Product Management Skills" -- @thataipm AI Workflows &
// Tools pillar, Batch 2 (v2.0). Full-slug naming throughout, no short code.
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
const SLUG = "claude-just-got-68-product-management-skills";

export const calculatePmSkillsMetadata: CalculateMetadataFunction<Props> = async () => {
  const [shot1, shot2, shot3, shot4, shot5] = await Promise.all([
    getAudioDurationInSeconds(staticFile(`${SLUG}/shot1_vo.wav`)),
    getAudioDurationInSeconds(staticFile(`${SLUG}/shot2_vo.wav`)),
    getAudioDurationInSeconds(staticFile(`${SLUG}/shot3_vo.wav`)),
    getAudioDurationInSeconds(staticFile(`${SLUG}/shot4_vo.wav`)),
    getAudioDurationInSeconds(staticFile(`${SLUG}/shot5_vo.wav`)),
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
  { durationInFrames: frames.shot2, component: Shot2_Lifecycle },
  { durationInFrames: frames.shot3, component: Shot3_Critic },
  { durationInFrames: frames.shot4, component: Shot4_Stats },
  { durationInFrames: frames.shot5, component: Shot5_Close },
];

export const PmSkillsEpisode: React.FC<Props> = ({ frames }) => (
  <Episode shots={buildShots(frames)} accentColor={ACCENTS[0]} watermarkHandle="@thataipm" watermarkColor="#F5F5F2" />
);
