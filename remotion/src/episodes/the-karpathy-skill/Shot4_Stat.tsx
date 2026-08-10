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

// VO: "That's two hundred and one thousand stars, on a single markdown
// file, and it's still climbing." (189 frames). Real, live number
// (verified 2026-08-10 via `gh api repos/forrestchang/andrej-karpathy-skills`).
export const Shot4_Stat: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-karpathy-skill/shot4_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="chime" at={4} />
      <Sfx type="tick" at={100} />

      <ContentZone>
        <StatCallout value="201,077" label="GitHub stars" born={4} frame={frame} fps={fps} />
      </ContentZone>

      <SubLabel text="one markdown file, and it's still climbing" born={100} frame={frame} fps={fps} />

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const StatCallout: React.FC<{ value: string; label: string; born: number; frame: number; fps: number }> = ({ value, label, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ textAlign: "center", opacity, transform: `scale(${scale})` }}>
      <div style={{ fontFamily: F_ACCENT, fontSize: 104, fontWeight: 800, color: ACCENTS[1], textShadow: `0 0 50px ${ACCENTS[1]}55` }}>{value}</div>
      <div style={{ fontFamily: F_UI, fontSize: 30, fontWeight: 700, color: INK_LIGHT, marginTop: 8 }}>{label}</div>
    </div>
  );
};

const SubLabel: React.FC<{ text: string; born: number; frame: number; fps: number }> = ({ text, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity, fontFamily: F_UI, fontSize: 22, fontWeight: 600, color: CARD_DIM }}>
      {text}
    </div>
  );
};
