import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { CycleWheel, CycleNode } from "../../components/CycleWheel";
import { GroupBucket } from "../../components/GroupBucket";
import { CountUp } from "../../components/CountUp";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS } from "../../theme_skills";
import words from "./data/shot2_words.json";

const SLUG = "claude-just-got-68-product-management-skills";

// VO: "It's built around the real product lifecycle: thirty skills across
// six phases, discover, define, develop, deliver, measure, iterate, plus
// foundation, utility, and sprint toolkit skills that make up the rest of
// the sixty eight." (455 frames). Beat A builds the 6 real phase names one
// at a time around a CycleWheel, synced to each word's own born frame
// (verified against the README's own TOC: Discover 5, Define 5, Develop 4,
// Deliver 6, Measure 6, Iterate 4 = 30). Beat B (from "plus") switches to
// the 3 remaining real categories as GroupBuckets, closing on the "68"
// total.
//
// Revised 2026-08-11, direct feedback ("real product lifecycle is a
// circle... not simple UI buttons"): the lifecycle is a loop, it ends back
// where it started, so a straight left-to-right PipelineFlow build was the
// wrong shape even though it was animated -- swapped for CycleWheel, a ring
// that draws itself closed. The three remaining categories are groupings
// that hold skills, not flat tag labels, so the pill chips are replaced
// with GroupBucket -- a labeled container items visibly drop into.
//
// Retimed 2026-08-11 after direct feedback: the VO's own preamble ("It's
// built around the real product lifecycle...") runs ~5s before "discover"
// is even spoken. Fixed with CycleWheel's own `slotsVisibleFrom`: the dim
// ring + node outline slots appear together right after the shot starts,
// then light up individually at the same word-synced times as before.
const SLOTS_VISIBLE_FROM = 20;
const BEAT_B = 282; // "plus"
const RING_CLOSE_BORN = 280; // ring finishes closing back on itself just before Beat B

const phaseNodes = (): CycleNode[] => [
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
      <Sfx type="chime" at={RING_CLOSE_BORN} />
      <Sfx type="whoosh" at={BEAT_B} />
      <Sfx type="chime" at={430} />

      <ContentZone top={220} bottom={560}>
        {frame < BEAT_B ? (
          <CycleWheel nodes={phaseNodes()} frame={frame} fps={fps} slotsVisibleFrom={SLOTS_VISIBLE_FROM} closeBorn={RING_CLOSE_BORN} />
        ) : (
          <RemainingCategories frame={frame} fps={fps} />
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const CATEGORY_BUCKETS = [
  { label: "Foundation", accent: ACCENTS[2], itemBorns: [292, 300, 308] },
  { label: "Utility", accent: ACCENTS[3], itemBorns: [320, 328, 336] },
  { label: "Sprint Toolkit", accent: ACCENTS[0], itemBorns: [348, 356, 364] },
];

const RemainingCategories: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
      <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
        {CATEGORY_BUCKETS.map((b) => (
          <GroupBucket key={b.label} label={b.label} accent={b.accent} itemBorns={b.itemBorns} frame={frame} fps={fps} />
        ))}
      </div>
      <CountUp value={68} label="skills total" accent={ACCENTS[1]} born={430} frame={frame} fps={fps} />
    </div>
  );
};
