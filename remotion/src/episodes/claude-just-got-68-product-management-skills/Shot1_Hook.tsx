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

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "Ask Claude to write a PRD, and you'll get the same mediocre draft
// everyone else gets. This repo fixes that with sixty eight real product
// management skills." (282 frames). Problem-first hook (per
// feedback-hook-must-state-topic): the real repo card is visible from
// frame 0 while VO states the viewer's problem, then the zoom lands on
// the real "68 skills" line in the About panel right as "sixty eight"
// pays it off. Zoom window kept short (~80 frames) per the CLAUDE.md
// pitfall note.
export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot1_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="whoosh" at={130} />
      <Sfx type="chime" at={208} />

      <ContentZone>
        <RepoScreenshot
          image={staticFile(`${SLUG}/shots/repo_full.png`)}
          icon={<Img src={staticFile(`${SLUG}/logos/product-on-purpose.png`)} style={{ width: 20, height: 20, borderRadius: 5 }} />}
          url="github.com/product-on-purpose/pm-skills"
          starsBox={{ x: 1130, y: 75, w: 190, h: 60 }}
          born={0}
          zoomStart={130}
          zoomEnd={210}
          frame={frame}
          fps={fps}
        />
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
