import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChatWindow } from "../../components/ChatWindow";
import { Captions } from "../../components/Captions";
import { springIn, edgeFadeVolume } from "../../motion";
import { DEFAULT_TRANSITION_FRAMES } from "../../Episode";
import { F_UI, INK, DIM } from "../../theme";
import words from "./data/shot6_words.json";

// VO: "That one shift, real reasoning instead of autocomplete, is also why
// AI got so much better at code, logic, and planning. Not just math." (279
// frames). Real product pattern: a row of suggestion chips beneath a chat
// input (the same UI real chat apps show for "try asking about...") builds
// in as each skill is named (real word timing: code@189, logic@210,
// planning@228).
const ICONS: Record<string, React.ReactNode> = {
  code: (
    <path d="M7 5l-5 5 5 5M13 5l5 5-5 5" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  logic: <path d="M4 5h5l3 5-3 5H4M12 10h4M18 6v8" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  planning: (
    <>
      <rect x="4" y="4" width="12" height="12" rx="2" stroke={INK} strokeWidth="1.6" />
      <path d="M7 9l2 2 4-4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

const CHIPS = [
  { key: "code", label: "code", born: 185 },
  { key: "logic", label: "logic", born: 206 },
  { key: "planning", label: "planning", born: 224 },
];

export const Shot6_BeyondMath: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <Audio src={staticFile("tn1/shot6_vo.wav")} volume={edgeFadeVolume(frame, durationInFrames, DEFAULT_TRANSITION_FRAMES)} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}>
        <ChatWindow label="TODAY" born={0} frame={frame} fps={fps}>
          <div style={{ fontFamily: F_UI, fontSize: 16, color: DIM, marginBottom: 22, letterSpacing: 1, textTransform: "uppercase" }}>
            Also good at
          </div>
          <div style={{ display: "flex", gap: 16, height: 0 }}>
            {CHIPS.map((c, i) => {
              const p = springIn(frame, fps, c.born);
              const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
              const scale = interpolate(p, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
              return (
                <div
                  key={i}
                  style={{
                    opacity,
                    transform: `scale(${scale})`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${DIM}66`,
                    borderRadius: 999,
                    padding: "12px 22px",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {ICONS[c.key]}
                  </svg>
                  <div style={{ fontFamily: F_UI, fontSize: 22, fontWeight: 700, color: INK }}>{c.label}</div>
                </div>
              );
            })}
          </div>
        </ChatWindow>
      </div>

      <Captions words={words} frame={frame} />
    </AbsoluteFill>
  );
};
