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
import words from "./data/shot4_words.json";

// VO: "Step three: the official Remotion skill. I describe the video I
// want in plain English, and it writes the actual code behind it. Its
// own launch demo hit six million views in just forty eight hours." (357
// frames). Leads with the 6M-views stat rather than the repo's own
// smaller star count, which stays visible but secondary on the real
// screenshot.
const BEAT_B = 103; // "I describe the video"
const BEAT_C = 239; // "Its own launch demo"

export const Shot4_RemotionSkill: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <Audio src={staticFile("sk1/shot4_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <Sfx type="tick" at={0} />
      <Sfx type="tick" at={65} />
      <Sfx type="whoosh" at={80} />
      <Sfx type="tick" at={BEAT_B} />
      <Sfx type="chime" at={BEAT_C} />

      <ToolHeader logo={staticFile("sk1/logos/remotion.png")} name="Remotion Skill" frame={frame} fps={fps} />

      <ContentZone>
        {frame < BEAT_B ? (
          <RepoScreenshot
            image={staticFile("sk1/shots/remotion_full.png")}
            icon={<Img src={staticFile("sk1/logos/remotion.png")} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            url="github.com/remotion-dev/skills"
            starsBox={{ x: 1090, y: 80, w: 190, h: 50 }}
            born={65}
            zoomStart={80}
            zoomEnd={BEAT_B - 5}
            frame={frame}
            fps={fps}
          />
        ) : frame < BEAT_C ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <TerminalCard
              title="remotion skill"
              icon={<Img src={staticFile("sk1/logos/remotion.png")} style={{ width: 22, height: 22, borderRadius: 5 }} />}
              born={BEAT_B}
              frame={frame}
              fps={fps}
              lines={[{ prompt: "npx skills add remotion-dev/skills" }, "writing composition...", "done -> out.mp4"]}
            />
            <WorksWith label="Works with: Claude Code, Codex, Kimi Code, Cursor" born={BEAT_B + 30} frame={frame} fps={fps} />
          </div>
        ) : (
          <StatCallout value="6M views" label="on its launch demo, in 48 hours" born={BEAT_C} frame={frame} fps={fps} />
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
      <div style={{ fontFamily: F_ACCENT, fontSize: 88, fontWeight: 800, color: ACCENTS[3], textShadow: `0 0 50px ${ACCENTS[3]}55` }}>{value}</div>
      <div style={{ fontFamily: F_UI, fontSize: 26, fontWeight: 700, color: INK_LIGHT, marginTop: 10 }}>{label}</div>
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
