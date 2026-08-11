import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, breathe, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_ACCENT, F_UI, INK_LIGHT, CARD_BG, CARD_BORDER, CARD_DIM, ACCENTS } from "../../theme_skills";
import words from "./data/shot3_words.json";

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "It also ships specialist sub agents that Claude can spawn on
// demand. One of them, the critic, adversarially reviews your PRD or
// your hypothesis before stakeholders ever see it." (391 frames). Only
// pm-critic is named (real, from the README's sub-agent table: "Adversarial
// quality reviewer... stress-test a PRD, hypothesis, or opportunity tree
// before sharing with stakeholders") -- the other 5 sub-agents are meta
// tooling for maintaining the pm-skills repo itself, not general PM
// workflow claims, so they're deliberately left out of the VO. No fabricated
// avatar: pm-critic is a software sub-agent, not a person, so the card uses
// an icon glyph instead of a photo.
export const Shot3_Critic: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot3_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={4} />
      <Sfx type="whoosh" at={225} />
      <Sfx type="chime" at={342} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <CriticCard frame={frame} fps={fps} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <PainTag text="reviews your PRD or hypothesis" born={225} accent={ACCENTS[2]} frame={frame} fps={fps} />
            <PainTag text="before stakeholders ever see it" born={320} accent={ACCENTS[0]} frame={frame} fps={fps} />
          </div>
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const CriticCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const p = springIn(frame, fps, 4);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
  const breatheMul = breathe(frame - 4, 50, 0.05) * p + (1 - p);

  const subP = springIn(frame, fps, 60);
  const subOpacity = interpolate(subP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity, transform: `scale(${scale * breatheMul})` }}>
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: CARD_BG,
          border: `3px solid ${ACCENTS[2]}`,
          boxShadow: `0 0 50px -8px ${ACCENTS[2]}88`,
        }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l8 3.5v6c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5v-6L12 2z"
            stroke={ACCENTS[2]}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 12.5l2 2 4-4.5" stroke={ACCENTS[2]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontFamily: F_ACCENT, fontSize: 40, fontWeight: 800, color: INK_LIGHT, marginTop: 20 }}>pm-critic</div>
      <div style={{ fontFamily: F_UI, fontSize: 21, fontWeight: 600, color: CARD_DIM, marginTop: 6, opacity: subOpacity, textAlign: "center" }}>
        Adversarial quality reviewer &middot; sub agent
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
