import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { PipelineFlow, PipelineNode } from "../../components/PipelineFlow";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_ACCENT, F_UI, INK_LIGHT, CARD_BG, CARD_BORDER, ACCENTS } from "../../theme_skills";
import words from "./data/shot2_words.json";

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "It's built around the real product lifecycle: thirty skills across
// six phases, discover, define, develop, deliver, measure, iterate, plus
// foundation, utility, and sprint toolkit skills that make up the rest of
// the sixty eight." (494 frames). Beat A (0-332) builds the 6 real phase
// names one at a time via PipelineFlow, synced to each word's own born
// frame (verified against the README's own TOC: Discover 5, Define 5,
// Develop 4, Deliver 6, Measure 6, Iterate 4 = 30). Beat B (from "plus" at
// frame 332) switches to the 3 remaining real categories as chips, closing
// on the "68" total -- varies composition from Shot1's screenshot card
// per the channel's "vary composition, not just motion" rule.
const BEAT_B = 332; // "plus"

const phaseNodes = (): PipelineNode[] => [
  { label: "Discover", accent: ACCENTS[0], born: 163 },
  { label: "Define", accent: ACCENTS[1], born: 198 },
  { label: "Develop", accent: ACCENTS[2], born: 224 },
  { label: "Deliver", accent: ACCENTS[3], born: 251 },
  { label: "Measure", accent: ACCENTS[0], born: 277 },
  { label: "Iterate", accent: ACCENTS[1], born: 299 },
];

export const Shot2_Lifecycle: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile(`${SLUG}/shot2_vo.wav`)} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={163} />
      <Sfx type="tick" at={198} />
      <Sfx type="tick" at={224} />
      <Sfx type="tick" at={251} />
      <Sfx type="tick" at={277} />
      <Sfx type="tick" at={299} />
      <Sfx type="whoosh" at={BEAT_B} />
      <Sfx type="chime" at={471} />

      <ContentZone top={220} bottom={560}>
        {frame < BEAT_B ? (
          <PipelineFlow nodes={phaseNodes()} frame={frame} fps={fps} />
        ) : (
          <RemainingCategories frame={frame} fps={fps} />
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const CATEGORY_CHIPS = [
  { label: "Foundation", born: 342, accent: ACCENTS[2] },
  { label: "Utility", born: 369, accent: ACCENTS[3] },
  { label: "Sprint Toolkit", born: 392, accent: ACCENTS[0] },
];

const RemainingCategories: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const totalP = springIn(frame, fps, 471);
  const totalOpacity = interpolate(totalP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const totalScale = interpolate(totalP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
        {CATEGORY_CHIPS.map((c) => {
          const p = springIn(frame, fps, c.born);
          const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(p, [0, 1], [16, 0], { extrapolateRight: "clamp" });
          return (
            <div
              key={c.label}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
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
      <div style={{ textAlign: "center", opacity: totalOpacity, transform: `scale(${totalScale})` }}>
        <div style={{ fontFamily: F_ACCENT, fontSize: 96, fontWeight: 800, color: ACCENTS[1], textShadow: `0 0 50px ${ACCENTS[1]}55` }}>68</div>
        <div style={{ fontFamily: F_UI, fontSize: 26, fontWeight: 700, color: INK_LIGHT, marginTop: 4 }}>skills total</div>
      </div>
    </div>
  );
};
