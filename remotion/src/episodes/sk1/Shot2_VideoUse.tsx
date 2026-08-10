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
import { F_ACCENT, F_UI, INK_LIGHT, CARD_DIM, ACCENTS } from "../../theme_skills";
import words from "./data/shot2_words.json";

// VO: "Step one: video-use edits my raw footage. I just tell it what I
// want, cut clips, add captions, mix audio, all through conversation.
// Twenty thousand GitHub stars, built by the browser-use team." (373
// frames). Beat A shows the REAL github.com/browser-use/video-use page
// (Playwright screenshot) and zooms into its real star badge; beat B is
// the real terminal setup + which agents it works with; beat C is the
// stat callout.
const BEAT_B = 150; // "cut clips..."
const BEAT_C = 266; // "Twenty thousand..."

export const Shot2_VideoUse: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sk1/shot2_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="tick" at={33} />
      <Sfx type="whoosh" at={70} />
      <Sfx type="tick" at={BEAT_B} />
      <Sfx type="chime" at={BEAT_C} />

      <ToolHeader logo={staticFile("sk1/logos/browser-use.png")} name="video-use" frame={frame} fps={fps} />

      <ContentZone>
        {frame < BEAT_B ? (
          <RepoScreenshot
            image={staticFile("sk1/shots/video-use_full.png")}
            icon={<Img src={staticFile("sk1/logos/browser-use.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            url="github.com/browser-use/video-use"
            starsBox={{ x: 1090, y: 80, w: 190, h: 50 }}
            born={33}
            zoomStart={70}
            zoomEnd={BEAT_B - 10}
            frame={frame}
            fps={fps}
          />
        ) : frame < BEAT_C ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <TerminalCard
              title="video-use setup"
              icon={<Img src={staticFile("sk1/logos/browser-use.png")} style={{ width: 22, height: 22, borderRadius: 5 }} />}
              born={BEAT_B}
              frame={frame}
              fps={fps}
              lines={[{ prompt: "ln -sfn video-use ~/.claude/skills/video-use" }, "cutting silences...", "burning captions...", "done -> final.mp4"]}
            />
            <WorksWith label="Works with: Claude Code, Codex, Openclaw, any agent with shell access" born={BEAT_B + 40} frame={frame} fps={fps} />
          </div>
        ) : (
          <StatCallout value="20,000" label="GitHub stars" born={BEAT_C} frame={frame} fps={fps} />
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
      <div style={{ fontFamily: F_ACCENT, fontSize: 96, fontWeight: 800, color: ACCENTS[1], textShadow: `0 0 50px ${ACCENTS[1]}55` }}>{value}</div>
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
