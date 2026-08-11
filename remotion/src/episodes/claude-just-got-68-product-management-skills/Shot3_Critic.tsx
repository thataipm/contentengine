import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { AgentSpawn } from "../../components/AgentSpawn";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
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
// workflow claims, so they're deliberately left out of the VO.
//
// Revised 2026-08-11, direct feedback ("just a simple round icon, not a
// good graphic choice at all"): a subagent's real shape is a delegation --
// Claude spawns pm-critic, which goes and does independent work. Swapped
// the standalone shield-checkmark badge for AgentSpawn (parent node, a
// stem branching down, a spawn-burst landing) so the parent/child
// relationship is visible, and the child slot is now a literal PRD card
// getting scanned and flagged mid-review instead of a decorative icon --
// shows the actual verb ("adversarially reviews") rather than a generic
// checkmark standing in for "quality."
export const Shot3_Critic: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot3_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={4} />
      <Sfx type="whoosh" at={60} />
      <Sfx type="tick" at={232} />
      <Sfx type="chime" at={304} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <AgentSpawn parentLabel="Claude" accent={ACCENTS[2]} parentBorn={4} childBorn={60} frame={frame} fps={fps}>
            <PRDReviewCard flagBorn={232} frame={frame} fps={fps} />
          </AgentSpawn>
          <div style={{ fontFamily: F_ACCENT, fontSize: 34, fontWeight: 800, color: INK_LIGHT, opacity: labelOpacity(frame, fps) }}>pm-critic</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <PainTag text="reviews your PRD or hypothesis" born={232} accent={ACCENTS[2]} frame={frame} fps={fps} />
            <PainTag text="before stakeholders ever see it" born={304} accent={ACCENTS[0]} frame={frame} fps={fps} />
          </div>
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const labelOpacity = (frame: number, fps: number) => {
  const p = springIn(frame, fps, 60);
  return interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
};

// A generic PRD mockup (illustrative text bars, not a fabricated real
// document) that a continuous scan-sweep crosses, then two lines get a
// flag mark right at the "adversarially reviews" beat -- the literal
// action a critic subagent performs, not a static badge standing in for
// "reviews stuff."
const PRDReviewCard: React.FC<{ flagBorn: number; frame: number; fps: number }> = ({ flagBorn, frame, fps }) => {
  const width = 300;
  const height = 190;

  const SWEEP_PERIOD = 65;
  const sweepT = (((frame % SWEEP_PERIOD) + SWEEP_PERIOD) % SWEEP_PERIOD) / SWEEP_PERIOD;
  const sweepX = interpolate(sweepT, [0, 1], [-width * 0.6, width * 1.3]);

  const lines = [
    { w: 0.82, flagged: false },
    { w: 0.6, flagged: true },
    { w: 0.9, flagged: false },
    { w: 0.5, flagged: true },
  ];

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 16,
        background: CARD_BG,
        border: `1.5px solid ${CARD_BORDER}`,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 50px -18px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${CARD_BORDER}` }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: ACCENTS[2] }} />
        <div style={{ fontFamily: F_UI, fontSize: 14, fontWeight: 700, color: CARD_DIM }}>PRD_draft.md</div>
      </div>
      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {lines.map((line, i) => {
          const flagP = line.flagged ? springIn(frame, fps, flagBorn + i * 6) : 0;
          const flagOpacity = interpolate(flagP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const barColor = line.flagged && flagOpacity > 0.5 ? ACCENTS[2] : CARD_BORDER;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: `${line.w * 100}%`, height: 10, borderRadius: 4, background: barColor }} />
              {line.flagged ? (
                <div
                  style={{
                    opacity: flagOpacity,
                    fontFamily: F_UI,
                    fontSize: 13,
                    fontWeight: 800,
                    color: ACCENTS[2],
                    border: `1.5px solid ${ACCENTS[2]}`,
                    borderRadius: 5,
                    padding: "1px 5px",
                    flexShrink: 0,
                  }}
                >
                  !
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: -height * 0.5,
          left: sweepX,
          width: width * 0.3,
          height: height * 2,
          background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 55%, transparent)",
          transform: "rotate(10deg)",
          pointerEvents: "none",
        }}
      />
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
