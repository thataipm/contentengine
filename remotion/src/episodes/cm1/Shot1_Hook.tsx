import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Captions } from "../../components/Captions";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, INK, DIM, ACCENT } from "../../theme";
import words from "./data/shot1_words.json";

// VO: "AI can write your wedding speech and pass the bar exam. Ask it to
// count letters in 'strawberry,' and it falls apart." (201 frames).
//
// Fourth pass (2026-08-07): tried a GlowOrb3D behind the word to match the
// bloom pipeline used elsewhere in this rebuild — looked wrong (a point
// light source can't evenly backlight a WIDE line of text, it just reads
// as a hard bright ball sitting on top of one letter). Reverted to plain
// color-shift text for this shot; the real bloom treatment is reserved for
// shots where the glow target is actually point/line-shaped (the beam in
// Shot2/4/7, the cost number in Shot6, the icon in Shot8, the button in
// Shot9) — matching the shape of the light source to the shape of the
// thing it's lighting, not applying bloom everywhere by default.
const WORD = "strawberry";
const TYPE_START = 6;
const TYPE_END = 130;

export const Shot1_Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typedCount = Math.round(
    interpolate(frame, [TYPE_START, TYPE_END], [0, WORD.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedText = WORD.slice(0, typedCount);
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  const glowP = springIn(frame, fps, 145);
  const glow = interpolate(glowP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const tagP = springIn(frame, fps, 0);
  const tagOpacity = interpolate(tagP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const statP = springIn(frame, fps, TYPE_START);
  const statOpacity = interpolate(statP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const tokenEstimateP = springIn(frame, fps, 148);
  const tokenEstimateOpacity = interpolate(tokenEstimateP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("cm1/shot1_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 260,
          textAlign: "center",
          opacity: tagOpacity,
          fontFamily: F_UI,
          fontSize: 20,
          color: DIM,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Core Mechanics &middot; Tokens
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 660, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: F_UI,
            fontSize: 96,
            fontWeight: 700,
            color: glow > 0.5 ? ACCENT : INK,
            textShadow: glow > 0.5 ? `0 0 60px ${ACCENT}66` : "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          {typedText}
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 84,
              marginLeft: 6,
              background: INK,
              opacity: cursorOn ? 1 : 0,
              verticalAlign: "-14px",
            }}
          />
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", gap: 70 }}>
        <div style={{ textAlign: "center", opacity: statOpacity }}>
          <div style={{ fontFamily: F_UI, fontSize: 46, fontWeight: 700, color: INK }}>{typedCount}</div>
          <div style={{ fontFamily: F_UI, fontSize: 16, color: DIM, letterSpacing: 1, textTransform: "uppercase", marginTop: 6 }}>
            characters
          </div>
        </div>
        <div style={{ textAlign: "center", opacity: tokenEstimateOpacity }}>
          <div style={{ fontFamily: F_UI, fontSize: 46, fontWeight: 700, color: ACCENT }}>?</div>
          <div style={{ fontFamily: F_UI, fontSize: 16, color: DIM, letterSpacing: 1, textTransform: "uppercase", marginTop: 6 }}>
            tokens
          </div>
        </div>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
