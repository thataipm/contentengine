import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { RepoScreenshot } from "../../components/RepoScreenshot";
import { SourceIcon } from "../../components/SourceIcon";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, breathe, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_ACCENT, F_UI, INK_LIGHT, ACCENTS } from "../../theme_skills";
import words from "./data/shot3_words.json";

// VO: "Sixty one percent of senior PM postings now require AI fluency,
// up from twenty three percent just last year." (231 frames). Real
// screenshot of the same institutepm.com stat-card row, zoomed on the
// third card (61%) this time, then the clean payoff.
const BEAT_B = 125; // "fluency," landing

export const Shot3_AiFluency: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-ai-pm-pay-gap/shot3_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="chime" at={BEAT_B} />

      <ContentZone>
        {frame < BEAT_B ? (
          <RepoScreenshot
            image={staticFile("the-ai-pm-pay-gap/shots/institutepm_stats.png")}
            icon={<SourceIcon />}
            url="institutepm.com — BCG 2026 workforce report"
            starsBox={{ x: 800, y: 350, w: 330, h: 195 }}
            born={0}
            zoomStart={40}
            zoomEnd={115}
            frame={frame}
            fps={fps}
          />
        ) : (
          <StatCallout value="61%" label="Senior PM postings requiring AI fluency" sublabel="up from 23% in 2024" born={BEAT_B} frame={frame} fps={fps} />
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const StatCallout: React.FC<{ value: string; label: string; sublabel: string; born: number; frame: number; fps: number }> = ({
  value,
  label,
  sublabel,
  born,
  frame,
  fps,
}) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  const breatheMul = breathe(frame - born);
  const liveScale = scale * (1 + (breatheMul - 1) * p);
  return (
    <div style={{ textAlign: "center", opacity, transform: `scale(${liveScale})`, maxWidth: 800 }}>
      <div style={{ fontFamily: F_ACCENT, fontSize: 104, fontWeight: 800, color: ACCENTS[0], textShadow: `0 0 ${50 * breatheMul}px ${ACCENTS[0]}55` }}>{value}</div>
      <div style={{ fontFamily: F_UI, fontSize: 26, fontWeight: 700, color: INK_LIGHT, marginTop: 8 }}>{label}</div>
      <div style={{ fontFamily: F_UI, fontSize: 20, fontWeight: 600, color: ACCENTS[0], marginTop: 10 }}>{sublabel}</div>
    </div>
  );
};
