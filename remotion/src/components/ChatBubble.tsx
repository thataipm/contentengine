import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, BG, INK, DIM, ACCENT } from "../theme";

const Avatar: React.FC<{ role: "user" | "assistant" }> = ({ role }) =>
  role === "assistant" ? (
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: INK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v16M2 10h16M4.5 4.5l11 11M15.5 4.5l-11 11" stroke={BG} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  ) : (
    <div style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${DIM}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6.5" r="3.5" stroke={DIM} strokeWidth="1.6" />
        <path d="M3 18c0-4 3-6.5 7-6.5s7 2.5 7 6.5" stroke={DIM} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );

const TypingDots: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", gap: 6, padding: "6px 2px" }}>
    {[0, 1, 2].map((i) => {
      const b = Math.sin(frame / 4 + i * 1.4) * 0.5 + 0.5;
      return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: DIM, opacity: 0.4 + b * 0.6 }} />;
    })}
  </div>
);

// A real chat-message row (avatar + rounded bubble), the literal unit this
// project's chat-interface visual language is built from. User bubbles are
// filled/solid (the way a real chat app distinguishes "you"); assistant
// bubbles are outlined. `pending` shows a bouncing-dots typing indicator
// instead of text (a real product's "thinking" state). `state` drives
// monochrome-only correct/wrong differentiation, same semantic as the rest
// of this episode: glyph + brightness, never hue.
export const ChatBubble: React.FC<{
  role: "user" | "assistant";
  born: number;
  frame: number;
  fps: number;
  text?: string;
  pending?: boolean;
  state?: "neutral" | "correct" | "wrong";
  fontSize?: number;
  mono?: boolean;
}> = ({ role, born, frame, fps, text, pending = false, state = "neutral", fontSize = 30, mono = false }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(p, [0, 1], [14, 0], { extrapolateRight: "clamp" });

  const isUser = role === "user";
  const textColor = isUser ? BG : state === "wrong" ? DIM : INK;
  const glyph = state === "correct" ? " ✓" : state === "wrong" ? " ✗" : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 16,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <Avatar role={role} />
      <div
        style={{
          maxWidth: 560,
          padding: "18px 26px",
          borderRadius: 18,
          background: isUser ? INK : "transparent",
          border: isUser ? "none" : `1.5px solid ${state === "correct" ? ACCENT : `${DIM}99`}`,
          fontFamily: mono ? "monospace" : F_UI,
          fontSize,
          fontWeight: 700,
          color: textColor,
          textDecoration: state === "wrong" ? "line-through" : "none",
          textShadow: state === "correct" ? `0 0 40px ${ACCENT}77` : "none",
        }}
      >
        {pending ? <TypingDots frame={frame} /> : `${text ?? ""}${glyph}`}
      </div>
    </div>
  );
};
