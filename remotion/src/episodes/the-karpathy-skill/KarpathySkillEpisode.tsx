import React from "react";
import { staticFile, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, ShotDef, totalEpisodeFrames } from "../../Episode";
import { FPS } from "../../theme";
import { INK_LIGHT } from "../../theme_skills";
import { Shot1_Hook } from "./Shot1_Hook";
import { Shot2_Karpathy } from "./Shot2_Karpathy";
import { Shot3_FourRules } from "./Shot3_FourRules";
import { Shot4_Stat } from "./Shot4_Stat";
import { Shot5_Close } from "./Shot5_Close";

// "The Karpathy Skill" — @thataipm Main pillar, Day 3. First new episode
// built under the full-slug naming convention throughout (top-level
// episodes/ folder AND these internal Remotion paths), since this one has
// no "already shipped under a short code" constraint the way sk1/sd1 do.
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

export const calculateKarpathySkillMetadata: CalculateMetadataFunction<Props> = async () => {
  const [shot1, shot2, shot3, shot4, shot5] = await Promise.all([
    getAudioDurationInSeconds(staticFile("the-karpathy-skill/shot1_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-karpathy-skill/shot2_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-karpathy-skill/shot3_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-karpathy-skill/shot4_vo.wav")),
    getAudioDurationInSeconds(staticFile("the-karpathy-skill/shot5_vo.wav")),
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
  { durationInFrames: frames.shot2, component: Shot2_Karpathy },
  { durationInFrames: frames.shot3, component: Shot3_FourRules },
  { durationInFrames: frames.shot4, component: Shot4_Stat },
  { durationInFrames: frames.shot5, component: Shot5_Close },
];

export const KarpathySkillEpisode: React.FC<Props> = ({ frames }) => (
  <Episode shots={buildShots(frames)} accentColor={INK_LIGHT} watermarkHandle="@thataipm" watermarkColor={INK_LIGHT} />
);
