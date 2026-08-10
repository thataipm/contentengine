import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springIn } from "./motion";
import { BG, INK, DIM, ACCENT, F_DISPLAY, F_UI } from "./theme";

// Fourth pass (2026-08-06) at the "how LLMs work" hook concept, and the one
// that stuck: approved 2026-08-06, this is now the reference for the
// channel's standing visual direction (see docs/how_ai_works_content_plan.md
// §1 and CLAUDE.md). Show the REAL thing being talked about, not an
// abstraction for it — an LLM answering a prompt gets an actual (generic,
// unbranded) chat interface with the response really streaming in on
// screen; a server rack for infrastructure, a code editor for code, etc.
// Colors/fonts now come from theme.ts (locked, not local to this file
// anymore). Still hardcodes its own prompt/response content — generalize
// into a real reusable component (props for prompt/response/timing) before
// a second episode needs this same chat-interface set-piece.

const PANEL = "#111113";
const PANEL_BORDER = "#252528";
const USER_BUBBLE = "#1E1E22";

const PROMPT = "How does ChatGPT actually predict the next word?";
const RESPONSE_WORDS = [
  "I'm", "not", "thinking", "—", "I'm", "predicting", "the", "single", "most",
  "likely", "next", "word,", "one", "token", "at", "a", "time.",
];

// Word onset frames: a small "thinking" pause, then a fast, slightly
// uneven stream (real token generation isn't perfectly metronomic).
const WORD_BORN = (i: number) => 46 + i * 4 + (i % 3 === 0 ? 2 : 0);

export const HookPreview_ChatUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hookP = springIn(frame, fps, 0);
  const hookOpacity = interpolate(hookP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const hookY = interpolate(hookP, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  const panelP = springIn(frame, fps, 10);
  const panelOpacity = interpolate(panelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const panelY = interpolate(panelP, [0, 1], [26, 0], { extrapolateRight: "clamp" });

  const thinkOpacity = interpolate(frame, [30, 38, 44, 48], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotBounce = (offset: number) => Math.abs(Math.sin((frame + offset) / 4)) * -6;

  const lastWordBorn = WORD_BORN(RESPONSE_WORDS.length - 1);
  const cursorOn = Math.floor(frame / 6) % 2 === 0;

  const finalP = springIn(frame, fps, lastWordBorn + 6);
  const finalGlow = interpolate(finalP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* hook line */}
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 190,
          opacity: hookOpacity,
          transform: `translateY(${hookY}px)`,
          fontFamily: F_DISPLAY,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.15,
          letterSpacing: -1,
          color: INK,
        }}
      >
        It&rsquo;s not writing.
        <br />
        It&rsquo;s <span style={{ color: ACCENT }}>predicting</span>.
      </div>

      {/* generic dark chat interface */}
      <div
        style={{
          position: "absolute",
          left: 46,
          right: 46,
          top: 560,
          opacity: panelOpacity,
          transform: `translateY(${panelY}px)`,
          background: PANEL,
          border: `1px solid ${PANEL_BORDER}`,
          borderRadius: 26,
          padding: "40px 36px 40px",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
          <div style={{ fontFamily: F_UI, fontSize: 18, color: DIM, marginLeft: 10 }}>assistant</div>
        </div>

        <div
          style={{
            alignSelf: "flex-end",
            marginLeft: "auto",
            maxWidth: "84%",
            background: USER_BUBBLE,
            borderRadius: "18px 18px 4px 18px",
            padding: "18px 22px",
            marginBottom: 38,
          }}
        >
          <div style={{ fontFamily: F_UI, fontSize: 26, lineHeight: 1.45, color: INK }}>{PROMPT}</div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${ACCENT}, #1F8F6D)`,
            }}
          />
          <div style={{ fontFamily: F_UI, fontSize: 26, lineHeight: 1.6, color: INK, flex: 1 }}>
            <span style={{ opacity: thinkOpacity, display: "inline-flex", gap: 6, verticalAlign: "middle" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: DIM, display: "inline-block", transform: `translateY(${dotBounce(0)}px)` }} />
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: DIM, display: "inline-block", transform: `translateY(${dotBounce(4)}px)` }} />
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: DIM, display: "inline-block", transform: `translateY(${dotBounce(8)}px)` }} />
            </span>
            {RESPONSE_WORDS.map((w, i) => {
              const born = WORD_BORN(i);
              const p = springIn(frame, fps, born);
              const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
              const y = interpolate(p, [0, 1], [6, 0], { extrapolateRight: "clamp" });
              const isKeyWord = w === "predicting";
              return (
                <span
                  key={i}
                  style={{
                    opacity,
                    display: "inline-block",
                    transform: `translateY(${y}px)`,
                    color: isKeyWord ? ACCENT : INK,
                    fontWeight: isKeyWord ? 700 : 400,
                    marginRight: "0.32em",
                  }}
                >
                  {w}
                </span>
              );
            })}
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 26,
                verticalAlign: "middle",
                background: ACCENT,
                opacity: frame > lastWordBorn + 10 ? 0 : cursorOn ? 1 : 0,
                marginLeft: 2,
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 ${140 * finalGlow}px -40px ${ACCENT}55`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
