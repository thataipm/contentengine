import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { TerminalCard } from "../../components/TerminalCard";
import { CommentCTA } from "../../components/CommentCTA";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, INK_LIGHT } from "../../theme_skills";
import words from "./data/shot5_words.json";

// VO: "It works with Claude Code and Cursor. Drop it in as your
// CLAUDE.md and the agent stops guessing. Comment KARPATHY and I'll send
// you the link." (309 frames). Beat A: real Claude Code + Cursor logos.
// Beat B: the real install command from the README. Beat C: comment CTA.
const BEAT_B = 87; // "Drop"
const BEAT_C = 215; // "Comment"

export const Shot5_Close: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-karpathy-skill/shot5_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={10} />
      <Sfx type="whoosh" at={BEAT_B} />
      <Sfx type="chime" at={BEAT_C} />

      <ContentZone>
        {frame < BEAT_B ? (
          <WorksWithLogos frame={frame} fps={fps} />
        ) : frame < BEAT_C ? (
          <TerminalCard
            title="Add to your project"
            born={BEAT_B}
            frame={frame}
            fps={fps}
            lines={[{ prompt: "curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md" }]}
          />
        ) : (
          <CommentCTA keyword="KARPATHY" born={BEAT_C} frame={frame} fps={fps} />
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const WorksWithLogos: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const p = springIn(frame, fps, 10);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity, transform: `scale(${scale})` }}>
      <div style={{ fontFamily: F_UI, fontSize: 24, fontWeight: 700, color: INK_LIGHT }}>Works with</div>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <Img src={staticFile("the-karpathy-skill/logos/claude-code.png")} style={{ width: 90, height: 90, borderRadius: 20 }} />
        <div style={{ fontFamily: F_UI, fontSize: 34, fontWeight: 800, color: INK_LIGHT }}>+</div>
        <Img src={staticFile("the-karpathy-skill/logos/cursor.png")} style={{ width: 90, height: 90, borderRadius: 20 }} />
      </div>
    </div>
  );
};
