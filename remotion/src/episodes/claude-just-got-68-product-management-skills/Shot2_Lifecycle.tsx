import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { PipelineFlow, PipelineNode } from "../../components/PipelineFlow";
import { CountUp } from "../../components/CountUp";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, breathe, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, INK_LIGHT, CARD_BG, CARD_BORDER, ACCENTS } from "../../theme_skills";
import words from "./data/shot2_words.json";

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "It's built around the real product lifecycle: thirty skills across
// six phases, discover, define, develop, deliver, measure, iterate, plus
// foundation, utility, and sprint toolkit skills that make up the rest of
// the sixty eight." (455 frames). Beat A builds the 6 real phase names one
// at a time via PipelineFlow, synced to each word's own born frame
// (verified against the README's own TOC: Discover 5, Define 5, Develop 4,
// Deliver 6, Measure 6, Iterate 4 = 30). Beat B (from "plus") switches to
// the 3 remaining real categories as chips, closing on the "68" total --
// varies composition from Shot1's screenshot card per the channel's "vary
// composition, not just motion" rule.
//
// Retimed 2026-08-11 after direct feedback: the VO's own preamble ("It's
// built around the real product lifecycle...") runs ~5s before "discover"
// is even spoken, and the original version gated EVERY node's existence on
// its own born frame -- so nothing rendered in the content zone for that
// entire preamble, a real "Never Let a Frame Sit" violation (frames
// 0-~160 were background-only). Fixed with PipelineFlow's new
// `slotsVisibleFrom`: all 6 dim slots now appear together right after the
// shot starts, then light up individually at the same word-synced times as
// before.
const SLOTS_VISIBLE_FROM = 20;
const BEAT_B = 282; // "plus"

const phaseNodes = (): PipelineNode[] => [
  { label: "Discover", accent: ACCENTS[0], born: 159 },
  { label: "Define", accent: ACCENTS[1], born: 184 },
  { label: "Develop", accent: ACCENTS[2], born: 205 },
  { label: "Deliver", accent: ACCENTS[3], born: 224 },
  { label: "Measure", accent: ACCENTS[0], born: 246 },
  { label: "Iterate", accent: ACCENTS[1], born: 265 },
];

export const Shot2_Lifecycle: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot2_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={SLOTS_VISIBLE_FROM} />
      <Sfx type="tick" at={159} />
      <Sfx type="tick" at={184} />
      <Sfx type="tick" at={205} />
      <Sfx type="tick" at={224} />
      <Sfx type="tick" at={246} />
      <Sfx type="tick" at={265} />
      <Sfx type="whoosh" at={BEAT_B} />
      <Sfx type="chime" at={430} />

      <ContentZone top={220} bottom={560}>
        {frame < BEAT_B ? (
          <PipelineFlow nodes={phaseNodes()} frame={frame} fps={fps} slotsVisibleFrom={SLOTS_VISIBLE_FROM} />
        ) : (
          <RemainingCategories frame={frame} fps={fps} />
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const CATEGORY_CHIPS = [
  { label: "Foundation", born: 303, accent: ACCENTS[2] },
  { label: "Utility", born: 328, accent: ACCENTS[3] },
  { label: "Sprint Toolkit", born: 351, accent: ACCENTS[0] },
];

const RemainingCategories: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
        {CATEGORY_CHIPS.map((c) => {
          const p = springIn(frame, fps, c.born);
          const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(p, [0, 1], [16, 0], { extrapolateRight: "clamp" });
          // Settled chips otherwise sit pixel-frozen waiting for the "68" payoff below --
          // confirmed a real freeze via automation/check_static_frames.py, not just a hunch.
          const waitPulse = breathe(frame - c.born, 48, 0.02) * p + (1 - p);
          return (
            <div
              key={c.label}
              style={{
                opacity,
                transform: `translateY(${y}px) scale(${waitPulse})`,
                fontFamily: F_UI,
                fontSize: 26,
                fontWeight: 700,
                color: INK_LIGHT,
                padding: "14px 26px",
                borderRadius: 999,
                background: CARD_BG,
                border: `1.5px solid ${CARD_BORDER}`,
                borderBottom: `4px solid ${c.accent}`,
              }}
            >
              {c.label}
            </div>
          );
        })}
      </div>
      <CountUp value={68} label="skills total" accent={ACCENTS[1]} born={430} frame={frame} fps={fps} />
    </div>
  );
};
