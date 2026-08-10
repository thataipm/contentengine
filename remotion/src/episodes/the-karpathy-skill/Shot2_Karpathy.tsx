import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_ACCENT, F_UI, INK_LIGHT, CARD_BG, CARD_BORDER, CARD_DIM, ACCENTS } from "../../theme_skills";
import words from "./data/shot2_words.json";

// VO: "Andrej Karpathy, who built Tesla's Autopilot and co-founded
// OpenAI, posted about how AI coding agents keep making the same
// mistakes: guessing what you meant, and rewriting code nobody asked
// them to touch." (408 frames). Real GitHub avatar + role card, born
// early; the two specific complaints named in VO pop in as literal tags
// synced to their own words, a callback to Shot 1's opening problem line.
export const Shot2_Karpathy: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("the-karpathy-skill/shot2_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={4} />
      <Sfx type="tick" at={273} />
      <Sfx type="tick" at={331} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <KarpathyCard frame={frame} fps={fps} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <PainTag text="guessing what you meant" born={273} accent={ACCENTS[2]} frame={frame} fps={fps} />
            <PainTag text="rewriting code nobody asked for" born={331} accent={ACCENTS[0]} frame={frame} fps={fps} />
          </div>
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const KarpathyCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const p = springIn(frame, fps, 4);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  const subP = springIn(frame, fps, 60);
  const subOpacity = interpolate(subP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity, transform: `scale(${scale})` }}>
      <div style={{ width: 140, height: 140, borderRadius: "50%", overflow: "hidden", border: `3px solid ${ACCENTS[3]}`, boxShadow: `0 0 50px -8px ${ACCENTS[3]}88` }}>
        <Img src={staticFile("the-karpathy-skill/logos/karpathy.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontFamily: F_ACCENT, fontSize: 44, fontWeight: 800, color: INK_LIGHT, marginTop: 20 }}>Andrej Karpathy</div>
      <div style={{ fontFamily: F_UI, fontSize: 22, fontWeight: 600, color: CARD_DIM, marginTop: 6, opacity: subOpacity, textAlign: "center" }}>
        Built Tesla's Autopilot &middot; Co-founded OpenAI
      </div>
    </div>
  );
};

const PainTag: React.FC<{ text: string; born: number; accent: string; frame: number; fps: number }> = ({ text, born, accent, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(p, [0, 1], [-16, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        fontFamily: F_UI,
        fontSize: 22,
        fontWeight: 700,
        color: INK_LIGHT,
        padding: "10px 22px",
        borderRadius: 999,
        background: CARD_BG,
        border: `1.5px solid ${CARD_BORDER}`,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      {text}
    </div>
  );
};
