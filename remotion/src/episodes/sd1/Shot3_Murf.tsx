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
import words from "./data/shot3_words.json";

// VO: "If you want real studio control, pitch, pauses, emphasis, Murf is
// built for that. Just know voice cloning isn't included in any regular
// plan. That's Enterprise only, over a thousand dollars a year." (422
// frames). Real pricing page (murf.ai/pricing), zoomed into the
// Enterprise-only voice-cloning gate. Revised 2026-08-10: screenshot
// appears near frame 0 and stays on screen the whole shot (was
// blank until "Murf" was spoken at frame 152 -- a ~5s dead stretch,
// flagged directly).
const SCREENSHOT_BORN = 10;
const ZOOM_START = 30;
const GATE_BEAT = 330; // "Enterprise" -- zoom lands here, stat overlay appears here too

export const Shot3_Murf: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sd1/shot3_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="tick" at={SCREENSHOT_BORN} />
      <Sfx type="whoosh" at={ZOOM_START} />
      <Sfx type="chime" at={GATE_BEAT} />

      <ToolHeader logo={staticFile("sd1/logos/murf.png")} name="Murf" frame={frame} fps={fps} />
      <BestFor label="Studio-style control" accent={ACCENTS[2]} born={20} frame={frame} fps={fps} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <ProductScreenshot
            image={staticFile("sd1/shots/murf_full.png")}
            icon={<Img src={staticFile("sd1/logos/murf.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            url="murf.ai/pricing"
            highlightBox={{ x: 370, y: 470, w: 220, h: 90 }}
            born={SCREENSHOT_BORN}
            zoomStart={ZOOM_START}
            zoomEnd={GATE_BEAT - 8}
            frame={frame}
            fps={fps}
          />
          {frame >= GATE_BEAT ? (
            <StatCallout value="$1,000+/yr" label="Voice cloning is Enterprise-only" accent={ACCENTS[2]} born={GATE_BEAT} frame={frame} fps={fps} />
          ) : null}
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
