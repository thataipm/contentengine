import React from "react";
import { staticFile, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episode, ShotDef, totalEpisodeFrames } from "../../Episode";
import { FPS } from "../../theme";
import { INK_LIGHT } from "../../theme_skills";
import { Shot1_Hook } from "./Shot1_Hook";
import { Shot2_ElevenLabs } from "./Shot2_ElevenLabs";
import { Shot3_Murf } from "./Shot3_Murf";
import { Shot4_WellSaid } from "./Shot4_WellSaid";
import { Shot5_Close } from "./Shot5_Close";

// sd1: "Best AI Tools for Voiceovers" -- ThatAIPM
// Second pillar's first episode, first in the reframed listicle format
// (was a head-to-head "Tool Showdowns" pilot, discarded 2026-08-10).
// Structured as "best FOR a specific need" rather than a flat ranking --
// each of the 3 tools wins a different real, sourced use case. Reuses
// sk1's dark-grid visual system (theme_skills.ts) and production
// components (ProductScreenshot instead of RepoScreenshot, since these
// are commercial product pages, not GitHub repos).
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

export const calculateSd1Metadata: CalculateMetadataFunction<Props> = async () => {
  const [shot1, shot2, shot3, shot4, shot5] = await Promise.all([
    getAudioDurationInSeconds(staticFile("sd1/shot1_vo.wav")),
    getAudioDurationInSeconds(staticFile("sd1/shot2_vo.wav")),
    getAudioDurationInSeconds(staticFile("sd1/shot3_vo.wav")),
    getAudioDurationInSeconds(staticFile("sd1/shot4_vo.wav")),
    getAudioDurationInSeconds(staticFile("sd1/shot5_vo.wav")),
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
  { durationInFrames: frames.shot2, component: Shot2_ElevenLabs },
  { durationInFrames: frames.shot3, component: Shot3_Murf },
  { durationInFrames: frames.shot4, component: Shot4_WellSaid },
  { durationInFrames: frames.shot5, component: Shot5_Close },
];

export const Sd1Episode: React.FC<Props> = ({ frames }) => (
  <Episode shots={buildShots(frames)} accentColor={INK_LIGHT} watermarkHandle="@thataipm" watermarkColor={INK_LIGHT} />
);
