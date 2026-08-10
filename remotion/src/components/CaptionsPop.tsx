import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, F_ACCENT, INK_LIGHT, ACCENTS } from "../theme_skills";

export type CaptionWord = { word: string; start_frame: number; end_frame: number };

const EMPHASIZE_RE = /^[\d,$%]+|stars?\.?$|thousand\.?$|million\.?$|hours?\.?$|EDIT\.?$/i;

// Pillar 2's caption style, restyled 2026-08-09 ("style captions, they
// are looking so simple"): the current word pops in on a colored pill
// background with a scale-bounce, not just plain text. Only the current
// phrase window is ever on screen (no accumulating previously-spoken
// words), plain words in F_UI, emphasized words (numbers, stat units, the
// CTA keyword) in the rounder F_ACCENT face. bottom:380 (not the earlier
// 220) keeps this inside SAFE_Y1 with real margin -- 220 sat inside IG's
// own bottom UI overlay band and read as disconnected from the visual
// card above it ("subtitles blocking graphics... should come in visual
// area of viewer").
export const CaptionsPop: React.FC<{ words: CaptionWord[]; frame: number; fps: number; windowSize?: number }> = ({ words, frame, fps, windowSize = 3 }) => {
  const idx = words.findIndex((w) => frame >= w.start_frame && frame < w.end_frame);
  const activeIdx = idx >= 0 ? idx : words.findIndex((w) => frame < w.start_frame) - 1;
  if (activeIdx < 0) return null;

  const start = Math.max(0, activeIdx - (windowSize - 1));
  const visible = words.slice(start, activeIdx + 1);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 380,
        textAlign: "center",
        lineHeight: 1.6,
        padding: "0 90px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px 8px",
      }}
    >
      {visible.map((w, i) => {
        const emphasized = EMPHASIZE_RE.test(w.word);
        const isCurrent = i === visible.length - 1;
        const p = springIn(frame, fps, w.start_frame);
        const scale = interpolate(p, [0, 1], [0.5, 1], { extrapolateRight: "clamp" });
        const accent = ACCENTS[(start + i) % ACCENTS.length];

        return (
          <span
            key={start + i}
            style={{
              display: "inline-block",
              transform: isCurrent ? `scale(${scale})` : "scale(1)",
              fontFamily: emphasized ? F_ACCENT : F_UI,
              fontWeight: emphasized ? 800 : 700,
              fontSize: emphasized ? 42 : 34,
              color: isCurrent ? "#0B0B0E" : INK_LIGHT,
              padding: isCurrent ? "4px 14px" : "4px 2px",
              borderRadius: isCurrent ? 10 : 0,
              background: isCurrent ? accent : "transparent",
              boxShadow: isCurrent ? `0 6px 20px -6px ${accent}` : "none",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
