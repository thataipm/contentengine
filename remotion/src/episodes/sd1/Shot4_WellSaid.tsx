import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { ContentZone } from "../../components/ContentZone";
import { ProductScreenshot } from "../../components/ProductScreenshot";
import { ToolHeader } from "../../components/ToolHeader";
import { CaptionsPop } from "../../components/CaptionsPop";
import { Sfx } from "../../components/Sfx";
import { edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { ACCENTS } from "../../theme_skills";
import { BestFor, StatCallout } from "./Shot2_ElevenLabs";
import words from "./data/shot4_words.json";

// VO: "And if you don't need cloning at all, WellSaid is the budget
// pick, ten dollars a month, full commercial rights, hundreds of
// pre-built voices, no drama." (294 frames). Real pricing page
// (wellsaid.io/pricing), zoomed into the $10/mo Starter tier. Revised
// 2026-08-10: screenshot appears near frame 0 and stays visible for the
// whole shot instead of only appearing once "WellSaid" is spoken.
const SCREENSHOT_BORN = 10;
const ZOOM_START = 30;
const PRICE_BEAT = 133; // "ten" -- zoom lands here, stat overlay appears here too

export const Shot4_WellSaid: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sd1/shot4_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="tick" at={SCREENSHOT_BORN} />
      <Sfx type="whoosh" at={ZOOM_START} />
      <Sfx type="chime" at={PRICE_BEAT} />

      <ToolHeader logo={staticFile("sd1/logos/wellsaid.png")} name="WellSaid" frame={frame} fps={fps} />
      <BestFor label="Budget pick, no cloning needed" accent={ACCENTS[1]} born={20} frame={frame} fps={fps} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <ProductScreenshot
            image={staticFile("sd1/shots/wellsaid_full.png")}
            icon={<Img src={staticFile("sd1/logos/wellsaid.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            url="wellsaid.io/pricing"
            highlightBox={{ x: 440, y: 485, w: 200, h: 90 }}
            born={SCREENSHOT_BORN}
            zoomStart={ZOOM_START}
            zoomEnd={PRICE_BEAT - 5}
            frame={frame}
            fps={fps}
          />
          {frame >= PRICE_BEAT ? (
            <StatCallout value="$10/mo" label="Full commercial rights, no cloning drama" accent={ACCENTS[1]} born={PRICE_BEAT} frame={frame} fps={fps} />
          ) : null}
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
