import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { RepoScreenshot } from "../../components/RepoScreenshot";
import { ToolHeader } from "../../components/ToolHeader";
import { PipelineFlow, PipelineNode } from "../../components/PipelineFlow";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS } from "../../theme_skills";
import words from "./data/shot3_words.json";

// VO: "A developer named Forrest Chang turned Karpathy's complaints into
// one file, CLAUDE.md, four rules long: think before coding, keep it
// simple, touch only what you're asked to touch, and define what done
// actually looks like." (481 frames). Beat A shows the REAL CLAUDE.md
// file on GitHub, zoomed into the real "forrestchang and claude" commit
// line, real attribution not a claim. Beat B (from "long:" at frame 241)
// switches to the four REAL named rules (Think Before Coding / Simplicity
// First / Surgical Changes / Goal-Driven Execution, verified 2026-08-10
// against the README) building one at a time via PipelineFlow, synced to
// each clause's own word-timing born frame.
const BEAT_B = 241; // "long:"

const ruleNodes = (): PipelineNode[] => [
  { label: "Think Before Coding", accent: ACCENTS[0], born: 245 },
  { label: "Simplicity First", accent: ACCENTS[1], born: 297 },
  { label: "Surgical Changes", accent: ACCENTS[2], born: 333 },
  { label: "Goal-Driven Execution", accent: ACCENTS[3], born: 408 },
];

export const Shot3_FourRules: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-karpathy-skill/shot3_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={8} />
      <Sfx type="tick" at={245} />
      <Sfx type="tick" at={297} />
      <Sfx type="tick" at={333} />
      <Sfx type="chime" at={408} />

      {frame < BEAT_B && (
        <ToolHeader logo={staticFile("the-karpathy-skill/logos/forrestchang.png")} name="Forrest Chang" frame={frame} fps={fps} />
      )}

      <ContentZone>
        {frame < BEAT_B ? (
          <RepoScreenshot
            image={staticFile("the-karpathy-skill/shots/claudemd_full.png")}
            icon={<Img src={staticFile("the-karpathy-skill/logos/forrestchang.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            url="CLAUDE.md"
            starsBox={{ x: 345, y: 250, w: 530, h: 40 }}
            born={8}
            zoomStart={60}
            zoomEnd={150}
            frame={frame}
            fps={fps}
          />
        ) : (
          <PipelineFlow nodes={ruleNodes()} frame={frame} fps={fps} />
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
