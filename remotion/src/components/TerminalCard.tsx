import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_UI, CARD_BG, CARD_BORDER, CARD_TEXT, CARD_DIM } from "../theme_skills";

// Recreated (not screen-recorded) dark terminal/app card, matching the two
// reference videos' shared mockup style: traffic-light dots, a small
// icon/mascot slot, monospace command lines. `lines` accepts either plain
// output text or `{ prompt: string }` for a "> " prefixed input line.
export const TerminalCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  lines: (string | { prompt: string })[];
  born: number;
  frame: number;
  fps: number;
  width?: number;
}> = ({ title, icon, lines, born, frame, fps, width = 860 }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });
  const breatheMul = breathe(frame - born, 70, 0.006) * p + (1 - p);
  // A real terminal cursor blinks -- literal, on-brand motion that stays
  // alive no matter how long this card holds on screen, instead of a
  // freeze-frame after the pop-in settles.
  const cursorOn = Math.floor((frame - born) / 15) % 2 === 0;

  return (
    <div
      style={{
        width,
        opacity,
        transform: `scale(${scale * breatheMul})`,
        borderRadius: 20,
        border: `1px solid ${CARD_BORDER}`,
        background: CARD_BG,
        boxShadow: "0 30px 70px -20px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 22px",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4A4A4A" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4A4A4A" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4A4A4A" }} />
        </div>
        {icon ? <div style={{ marginLeft: 16 }}>{icon}</div> : null}
        <div style={{ flex: 1, textAlign: icon ? "left" : "center", marginLeft: icon ? 10 : 0, fontFamily: F_UI, fontSize: 15, fontWeight: 700, color: CARD_TEXT, letterSpacing: 0.3 }}>
          {title}
        </div>
      </div>
      <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
        {lines.map((line, i) =>
          typeof line === "string" ? (
            <div key={i} style={{ fontFamily: "monospace", fontSize: 20, color: CARD_DIM, lineHeight: 1.5 }}>
              {line}
            </div>
          ) : (
            <div key={i} style={{ fontFamily: "monospace", fontSize: 20, color: CARD_TEXT, lineHeight: 1.5 }}>
              <span style={{ color: CARD_DIM, marginRight: 10 }}>&gt;</span>
              {line.prompt}
              {i === lines.length - 1 ? (
                <span style={{ marginLeft: 6, opacity: cursorOn ? 1 : 0, color: CARD_TEXT }}>&#9608;</span>
              ) : null}
            </div>
          ),
        )}
      </div>
    </div>
  );
};
