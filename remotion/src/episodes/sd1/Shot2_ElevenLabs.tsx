import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { ContentZone } from "../../components/ContentZone";
import { ProductScreenshot } from "../../components/ProductScreenshot";
import { ToolHeader } from "../../components/ToolHeader";
import { CaptionsPop } from "../../components/CaptionsPop";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, F_ACCENT, INK_LIGHT, ACCENTS } from "../../theme_skills";
import words from "./data/shot2_words.json";

// VO: "If you want to clone your own voice, ElevenLabs is the easy pick,
// six dollars a month gets you instant cloning and commercial rights. No
// other tool on this list gets close to that price." (353 frames). Real
// pricing page (elevenlabs.io/pricing), zoomed into the $6/mo Starter
// tier's instant-cloning callout. Revised 2026-08-10 (direct feedback:
// "few frames that are blank... show as much screenshots as possible") --
// the screenshot now appears almost immediately (born=10, not gated on
// the tool's name being spoken) and STAYS on screen for the whole shot;
// the stat payoff overlays below it instead of replacing it, so there's
// never a text-only/blank stretch.
const SCREENSHOT_BORN = 10;
const ZOOM_START = 30;
const PRICE_BEAT = 138; // "six" -- zoom lands here, stat overlay appears here too

export const Shot2_ElevenLabs: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sd1/shot2_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="tick" at={SCREENSHOT_BORN} />
      <Sfx type="whoosh" at={ZOOM_START} />
      <Sfx type="chime" at={PRICE_BEAT} />

      <ToolHeader logo={staticFile("sd1/logos/elevenlabs.png")} name="ElevenLabs" frame={frame} fps={fps} />
      <BestFor label="Cloning your own voice" accent={ACCENTS[0]} born={20} frame={frame} fps={fps} />

      <ContentZone>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <ProductScreenshot
            image={staticFile("sd1/shots/elevenlabs_full.png")}
            icon={<Img src={staticFile("sd1/logos/elevenlabs.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            url="elevenlabs.io/pricing"
            highlightBox={{ x: 380, y: 445, w: 220, h: 90 }}
            born={SCREENSHOT_BORN}
            zoomStart={ZOOM_START}
            zoomEnd={PRICE_BEAT - 8}
            frame={frame}
            fps={fps}
          />
          {frame >= PRICE_BEAT ? (
            <StatCallout value="$6/mo" label="Instant voice cloning + commercial rights" accent={ACCENTS[0]} born={PRICE_BEAT} frame={frame} fps={fps} />
          ) : null}
        </div>
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

export const BestFor: React.FC<{ label: string; accent: string; born: number; frame: number; fps: number }> = ({ label, accent, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 260, display: "flex", justifyContent: "center", opacity }}>
      <div
        style={{
          padding: "8px 20px",
          borderRadius: 999,
          border: `1.5px solid ${accent}`,
          background: `${accent}22`,
          fontFamily: F_UI,
          fontSize: 18,
          fontWeight: 700,
          color: INK_LIGHT,
        }}
      >
        BEST FOR: {label}
      </div>
    </div>
  );
};

// Compact variant (2026-08-10 revision): sits BELOW the still-visible
// screenshot as an overlay/annotation, not a fullscreen replacement --
// smaller than the original standalone hero treatment so both fit
// together in ContentZone's flex column.
export const StatCallout: React.FC<{ value: string; label: string; accent: string; born: number; frame: number; fps: number }> = ({ value, label, accent, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ textAlign: "center", opacity, transform: `scale(${scale})`, maxWidth: 760 }}>
      <div style={{ fontFamily: F_ACCENT, fontSize: 64, fontWeight: 800, color: accent, textShadow: `0 0 40px ${accent}55` }}>{value}</div>
      <div style={{ fontFamily: F_UI, fontSize: 22, fontWeight: 700, color: INK_LIGHT, marginTop: 8 }}>{label}</div>
    </div>
  );
};
