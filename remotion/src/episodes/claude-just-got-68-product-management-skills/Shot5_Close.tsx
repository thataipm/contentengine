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

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "It works with Claude Code, Cursor, and Codex. Install it as a
// plugin, and every future PRD starts from real product thinking, not
// average. Comment PLAYBOOK and I'll send you the link." (399 frames).
// Beat A: real Claude Code, Cursor, Codex logos. Beat B: the real
// recommended install command from the README (two-line `/plugin`
// sequence, not the single-line curl karpathy used, since that's what
// this repo's own README actually recommends). Beat C: comment CTA,
// callback to Shot 1's "mediocre" hook via "not average."
const BEAT_B = 117; // "Install"
const BEAT_C = 315; // "Comment"

export const Shot5_Close: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot5_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={10} />
      <Sfx type="whoosh" at={BEAT_B} />
      <Sfx type="chime" at={BEAT_C} />

      <ContentZone>
        {frame < BEAT_B ? (
          <WorksWithLogos frame={frame} fps={fps} />
        ) : frame < BEAT_C ? (
          <TerminalCard
            title="Add to Claude Code"
            born={BEAT_B}
            frame={frame}
            fps={fps}
            lines={[
              { prompt: "/plugin marketplace add product-on-purpose/agent-plugins" },
              { prompt: "/plugin install pm-skills@product-on-purpose" },
            ]}
          />
        ) : (
          <CommentCTA keyword="PLAYBOOK" born={BEAT_C} frame={frame} fps={fps} />
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
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <Img src={staticFile(`${SLUG}/logos/claude-code.png`)} style={{ width: 84, height: 84, borderRadius: 18 }} />
        <div style={{ fontFamily: F_UI, fontSize: 30, fontWeight: 800, color: INK_LIGHT }}>+</div>
        <Img src={staticFile(`${SLUG}/logos/cursor.png`)} style={{ width: 84, height: 84, borderRadius: 18 }} />
        <div style={{ fontFamily: F_UI, fontSize: 30, fontWeight: 800, color: INK_LIGHT }}>+</div>
        <Img src={staticFile(`${SLUG}/logos/codex.png`)} style={{ width: 84, height: 84, borderRadius: 18 }} />
      </div>
    </div>
  );
};
