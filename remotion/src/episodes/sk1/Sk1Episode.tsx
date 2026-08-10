import React from "react";
import { staticFile, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, ShotDef, totalEpisodeFrames } from "../../Episode";
import { FPS } from "../../theme";
import { INK_LIGHT } from "../../theme_skills";
import { Shot1_Hook } from "./Shot1_Hook";
import { Shot2_VideoUse } from "./Shot2_VideoUse";
import { Shot3_HyperFrames } from "./Shot3_HyperFrames";
import { Shot4_RemotionSkill } from "./Shot4_RemotionSkill";
import { Shot5_Close } from "./Shot5_Close";

// sk1: "3 Claude Code skills that turn it into a video editor" — ThatAIPM
// Pillar 2 (trending Claude Code skills), first episode. Light grid-paper
// visual system, distinct from Pillar 1's black How Actually Works look,
// modeled on two real reference videos analyzed frame-by-frame. Same
// channel (@thataipm), same voice clone, different visual identity per
// pillar.
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

export const calculateSk1Metadata: CalculateMetadataFunction<Props> = async () => {
  const [shot1, shot2, shot3, shot4, shot5] = await Promise.all([
    getAudioDurationInSeconds(staticFile("sk1/shot1_vo.wav")),
    getAudioDurationInSeconds(staticFile("sk1/shot2_vo.wav")),
    getAudioDurationInSeconds(staticFile("sk1/shot3_vo.wav")),
    getAudioDurationInSeconds(staticFile("sk1/shot4_vo.wav")),
    getAudioDurationInSeconds(staticFile("sk1/shot5_vo.wav")),
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
  { durationInFrames: frames.shot2, component: Shot2_VideoUse },
  { durationInFrames: frames.shot3, component: Shot3_HyperFrames },
  { durationInFrames: frames.shot4, component: Shot4_RemotionSkill },
  { durationInFrames: frames.shot5, component: Shot5_Close },
];

export const Sk1Episode: React.FC<Props> = ({ frames }) => (
  <Episode shots={buildShots(frames)} accentColor={INK_LIGHT} watermarkHandle="@thataipm" watermarkColor={INK_LIGHT} />
);
