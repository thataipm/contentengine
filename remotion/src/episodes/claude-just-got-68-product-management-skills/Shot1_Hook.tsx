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

// VO: "Claude just got sixty eight real product management skills, because
// your PRDs deserve better than the same mediocre draft everyone else
// gets." (246 frames). Rewritten 2026-08-11 after direct feedback that the
// original problem-first hook buried the topic until ~9s in -- now leads
// with the actual subject ("sixty eight...skills") inside the first ~3s,
// contrast/problem follows as the reason it matters, not the opener. Zoom
// lands on the real skill-count badge right as "skills," pays off; a
// subtle idle pulse (RepoScreenshot's own breathe-gated zoom) keeps the
// remaining hold alive instead of freezing.
export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot1_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="whoosh" at={21} />
      <Sfx type="chime" at={90} />

      <ContentZone>
        <RepoScreenshot
          image={staticFile(`${SLUG}/shots/repo_full.png`)}
          icon={<Img src={staticFile(`${SLUG}/logos/product-on-purpose.png`)} style={{ width: 20, height: 20, borderRadius: 5 }} />}
          url="github.com/product-on-purpose/pm-skills"
          starsBox={{ x: 1130, y: 75, w: 190, h: 60 }}
          born={0}
          zoomStart={15}
          zoomEnd={90}
          frame={frame}
          fps={fps}
        />
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
