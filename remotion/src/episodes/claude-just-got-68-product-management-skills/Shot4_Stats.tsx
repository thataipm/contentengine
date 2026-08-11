import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_ACCENT, F_UI, INK_LIGHT, CARD_DIM, ACCENTS } from "../../theme_skills";
import words from "./data/shot4_words.json";

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "Sixty eight skills, five hundred thirty GitHub stars, and it's
// Apache licensed and still shipping new updates." (216 frames). Real
// numbers, re-verified 2026-08-11 directly via `curl api.github.com/repos/
// product-on-purpose/pm-skills` right before this render. Dual stat
// callout (two numbers side by side) varies composition from
// the-karpathy-skill's single-number Shot4 layout per the "vary
// composition, not just motion" rule.
export const Shot4_Stats: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot4_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="chime" at={6} />
      <Sfx type="tick" at={64} />
      <Sfx type="tick" at={134} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", gap: 70, alignItems: "flex-start" }}>
            <StatCallout value="68" label="skills" accent={ACCENTS[1]} born={6} frame={frame} fps={fps} />
            <StatCallout value="530" label="GitHub stars" accent={ACCENTS[3]} born={64} frame={frame} fps={fps} />
          </div>
          <SubLabel text="Apache licensed, still shipping new updates" born={134} frame={frame} fps={fps} />
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const StatCallout: React.FC<{ value: string; label: string; accent: string; born: number; frame: number; fps: number }> = ({
  value,
  label,
  accent,
  born,
  frame,
  fps,
}) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ textAlign: "center", opacity, transform: `scale(${scale})` }}>
      <div style={{ fontFamily: F_ACCENT, fontSize: 84, fontWeight: 800, color: accent, textShadow: `0 0 50px ${accent}55` }}>{value}</div>
      <div style={{ fontFamily: F_UI, fontSize: 24, fontWeight: 700, color: INK_LIGHT, marginTop: 6 }}>{label}</div>
    </div>
  );
};

const SubLabel: React.FC<{ text: string; born: number; frame: number; fps: number }> = ({ text, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, fontFamily: F_UI, fontSize: 22, fontWeight: 600, color: CARD_DIM, textAlign: "center" }}>{text}</div>
  );
};
