import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { CountUp } from "../../components/CountUp";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, CARD_DIM, ACCENTS } from "../../theme_skills";
import words from "./data/shot4_words.json";

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "Sixty eight skills, five hundred thirty GitHub stars, and it's
// Apache licensed and still shipping new updates." (216 frames). Real
// numbers, re-verified 2026-08-11 directly via `curl api.github.com/repos/
// product-on-purpose/pm-skills` right before this render. Dual stat
// callout (two numbers side by side) varies composition from
// the-karpathy-skill's single-number Shot4 layout per the "vary
// composition, not just motion" rule.
//
// Revised 2026-08-11: swapped the local static-pop StatCallout for the new shared
// components/CountUp.tsx (schema vocabulary addition) -- both numbers now roll up to their
// real value instead of just popping in, more weight for the shot's actual payoff beat.
export const Shot4_Stats: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot4_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="chime" at={27} />
      <Sfx type="tick" at={63} />
      <Sfx type="tick" at={137} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", gap: 70, alignItems: "flex-start" }}>
            <CountUp value={68} label="skills" accent={ACCENTS[1]} born={27} frame={frame} fps={fps} />
            <CountUp value={530} label="GitHub stars" accent={ACCENTS[3]} born={63} frame={frame} fps={fps} />
          </div>
          <SubLabel text="Apache licensed, still shipping new updates" born={137} frame={frame} fps={fps} />
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const SubLabel: React.FC<{ text: string; born: number; frame: number; fps: number }> = ({ text, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, fontFamily: F_UI, fontSize: 22, fontWeight: 600, color: CARD_DIM, textAlign: "center" }}>{text}</div>
  );
};
