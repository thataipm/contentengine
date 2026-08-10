import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneRig } from "../../three/SceneRig";
import { GlowOrb3D } from "../../three/GlowOrb3D";
import { Captions } from "../../components/Captions";
import { pxToWorld } from "../../three/coords";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, INK, DIM, ACCENT } from "../../theme";
import words from "./data/shot8_words.json";

// VO: "So next time AI botches something 'simple,' don't blame its
// intelligence. Blame its eyesight." (181 frames). The punchline, calling
// back to Shot1's "it literally can't see letters" framing.
//
// Fourth pass (2026-08-07): a real bloom-lit orb sits behind the eye icon
// now (genuine light, brightens on the strike landing) instead of relying
// on CSS alone for the "reveal" moment.
const OUTLINE_BORN = 14;
const PUPIL_BORN = 34;
const STRIKE_BORN = 156;

export const Shot8_BlameEyesight: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outlineP = springIn(frame, fps, OUTLINE_BORN);
  const outlineOpacity = interpolate(outlineP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const outlineScale = interpolate(outlineP, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const breathe = outlineP >= 1 ? 1 + Math.sin(frame / 16) * 0.02 : 1;

  const pupilP = springIn(frame, fps, PUPIL_BORN);
  const pupilOpacity = interpolate(pupilP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const strikeP = springIn(frame, fps, STRIKE_BORN);
  const strikeLength = interpolate(strikeP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const tagP = springIn(frame, fps, 0);
  const tagOpacity = interpolate(tagP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <Audio src={staticFile("cm1/shot8_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <SceneRig>
        <GlowOrb3D position={pxToWorld(540, 820, 0, 0)} scale={strikeLength > 0 ? 70 : 30} color={ACCENT} intensity={strikeLength > 0 ? 2.2 : 0.5} opacity={0.8} />
      </SceneRig>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          textAlign: "center",
          opacity: tagOpacity,
          fontFamily: F_UI,
          fontSize: 20,
          color: DIM,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        The Real Reason
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 650,
          display: "flex",
          justifyContent: "center",
          opacity: outlineOpacity,
          transform: `scale(${outlineScale * breathe})`,
        }}
      >
        <svg width="340" height="340" viewBox="0 0 140 140" fill="none">
          <path
            d="M20 70 C40 35, 100 35, 120 70 C100 105, 40 105, 20 70 Z"
            stroke={INK}
            strokeWidth="4"
            fill="none"
          />
          <circle cx="70" cy="70" r="18" stroke={INK} strokeWidth="4" fill="none" />
          <circle cx="70" cy="70" r="7" fill={INK} opacity={pupilOpacity} />
          {strikeLength > 0 ? (
            <line
              x1="14"
              y1="16"
              x2={14 + (126 - 14) * strikeLength}
              y2={16 + (124 - 16) * strikeLength}
              stroke={ACCENT}
              strokeWidth="6"
              strokeLinecap="round"
            />
          ) : null}
        </svg>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center" }}>
        <div style={{ fontFamily: F_UI, fontSize: 30, fontWeight: 700, color: strikeLength > 0 ? ACCENT : DIM }}>
          {strikeLength > 0 ? "eyesight, not intelligence" : "blame its…"}
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
