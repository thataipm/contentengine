import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { RepoScreenshot } from "../../components/RepoScreenshot";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import words from "./data/shot1_words.json";

// VO: "Your AI coding agent keeps rewriting code you never asked it to
// touch. This file, two hundred thousand GitHub stars, fixes exactly
// that." (273 frames). Problem-first hook per the 2026-08-10 Instagram
// hook research (feedback-hook-must-state-topic memory): the real repo
// card is visible from frame 0 as the "fix" being teased while VO states
// the viewer's problem, then the zoom lands on the real star count right
// as "fixes exactly that" pays it off. Zoom window kept to ~90 frames
// per the CLAUDE.md pitfall note (land right before the payoff, don't
// drift the whole shot).
export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-karpathy-skill/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="whoosh" at={130} />
      <Sfx type="chime" at={224} />

      <ContentZone>
        <RepoScreenshot
          image={staticFile("the-karpathy-skill/shots/repo_full.png")}
          icon={<Img src={staticFile("the-karpathy-skill/logos/multica-ai.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
          url="github.com/multica-ai/andrej-karpathy-skills"
          starsBox={{ x: 1130, y: 75, w: 150, h: 55 }}
          born={0}
          zoomStart={130}
          zoomEnd={221}
          frame={frame}
          fps={fps}
        />
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
