import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBackground } from "../../components/GridBackground";
import { TerminalCard } from "../../components/TerminalCard";
import { RepoScreenshot } from "../../components/RepoScreenshot";
import { ToolHeader } from "../../components/ToolHeader";
import { CaptionsPop } from "../../components/CaptionsPop";
import { ContentZone } from "../../components/ContentZone";
import { Sfx } from "../../components/Sfx";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, F_ACCENT, INK_LIGHT, CARD_DIM, ACCENTS } from "../../theme_skills";
import words from "./data/shot3_words.json";

// VO: "Step two: HyperFrames. I write plain HTML, and it renders real
// motion graphics, frame by frame, deterministic every time. Forty
// thousand stars, already running in production at companies like
// tldraw and TanStack." (423 frames).
const BEAT_B = 147; // "renders real motion graphics"
const BEAT_C = 272; // "Forty thousand"

export const Shot3_HyperFrames: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sk1/shot3_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="tick" at={42} />
      <Sfx type="whoosh" at={80} />
      <Sfx type="tick" at={BEAT_B} />
      <Sfx type="chime" at={BEAT_C} />

      <ToolHeader logo={staticFile("sk1/logos/heygen.png")} name="HyperFrames" frame={frame} fps={fps} />

      <ContentZone>
        {frame < BEAT_B ? (
          <RepoScreenshot
            image={staticFile("sk1/shots/hyperframes_full.png")}
            icon={<Img src={staticFile("sk1/logos/heygen.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            url="github.com/heygen-com/hyperframes"
            starsBox={{ x: 1090, y: 80, w: 190, h: 50 }}
            born={42}
            zoomStart={80}
            zoomEnd={BEAT_B - 10}
            frame={frame}
            fps={fps}
          />
        ) : frame < BEAT_C ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <TerminalCard
              title="hyperframes setup"
              icon={<Img src={staticFile("sk1/logos/heygen.png")} style={{ width: 22, height: 22, borderRadius: 5 }} />}
              born={BEAT_B}
              frame={frame}
              fps={fps}
              lines={[{ prompt: "npx skills add heygen-com/hyperframes" }, "capturing frames...", "render complete -> hook.mp4"]}
            />
            <WorksWith label="Works with: Claude Code, Cursor, Gemini CLI, Codex" born={BEAT_B + 40} frame={frame} fps={fps} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <StatCallout value="40,000" label="GitHub stars" born={BEAT_C} frame={frame} fps={fps} />
            <ProductionLine label="used in production at tldraw · TanStack" born={BEAT_C + 10} frame={frame} fps={fps} />
          </div>
        )}
      </ContentZone>

      <CaptionsPop words={words} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const StatCallout: React.FC<{ value: string; label: string; born: number; frame: number; fps: number }> = ({ value, label, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ textAlign: "center", opacity, transform: `scale(${scale})` }}>
      <div style={{ fontFamily: F_ACCENT, fontSize: 96, fontWeight: 800, color: ACCENTS[2], textShadow: `0 0 50px ${ACCENTS[2]}55` }}>{value}</div>
      <div style={{ fontFamily: F_UI, fontSize: 30, fontWeight: 700, color: INK_LIGHT, marginTop: 8 }}>{label}</div>
    </div>
  );
};

const WorksWith: React.FC<{ label: string; born: number; frame: number; fps: number }> = ({ label, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, fontFamily: F_UI, fontSize: 18, fontWeight: 600, color: CARD_DIM, textAlign: "center", maxWidth: 700 }}>{label}</div>
  );
};

const ProductionLine: React.FC<{ label: string; born: number; frame: number; fps: number }> = ({ label, born, frame, fps }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, textAlign: "center", fontFamily: F_UI, fontSize: 20, color: "#6BAED6", fontWeight: 700 }}>{label}</div>
  );
};
