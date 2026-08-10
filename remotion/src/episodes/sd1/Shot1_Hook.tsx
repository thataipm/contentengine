import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { ContentZone } from "../../components/ContentZone";
import { CaptionsPop } from "../../components/CaptionsPop";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_ACCENT, INK_LIGHT, ACCENTS } from "../../theme_skills";
import words from "./data/shot1_words.json";

// VO: "Three AI voice tools, three completely different reasons to pick
// one over the other." (152 frames). Three real tool logos pop in one at
// a time -- the literal visualization of "three tools," matching this
// channel's own established build/reveal rule, simpler than PipelineFlow
// since there's no process/sequence here, just three options.
const TOOLS = [
  { name: "ElevenLabs", logo: "sd1/logos/elevenlabs.png", accent: ACCENTS[0], born: 15 },
  { name: "Murf", logo: "sd1/logos/murf.png", accent: ACCENTS[2], born: 40 },
  { name: "WellSaid", logo: "sd1/logos/wellsaid.png", accent: ACCENTS[1], born: 65 },
];

export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sd1/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={15} />
      <Sfx type="tick" at={40} />
      <Sfx type="chime" at={65} />

      <ContentZone top={260} bottom={560}>
        <div style={{ display: "flex", gap: 28 }}>
          {TOOLS.map((t) => {
            const p = springIn(frame, fps, t.born);
            const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
            const scale = interpolate(p, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
            return (
              <div
                key={t.name}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  padding: "26px 22px",
                  borderRadius: 20,
                  background: "#17171B",
                  border: `1.5px solid ${t.accent}`,
                  boxShadow: `0 0 30px -8px ${t.accent}88`,
                }}
              >
                <Img src={staticFile(t.logo)} style={{ width: 56, height: 56, borderRadius: 12 }} />
                <div style={{ fontFamily: F_ACCENT, fontSize: 20, fontWeight: 800, color: INK_LIGHT }}>{t.name}</div>
              </div>
            );
          })}
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
