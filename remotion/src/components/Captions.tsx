import React from "react";
import { F_UI, INK, ACCENT, SAFE_X0, SAFE_X1 } from "../theme";

export type CaptionWord = {
  word: string;
  start_frame: number;
  end_frame: number;
};

type CaptionsProps = {
  words: CaptionWord[];
  frame: number;
};

// Standing karaoke-style subtitle system for every episode. Second pass
// (2026-08-07): the first version rendered the WHOLE line from frame 0,
// just dimming not-yet-spoken words — still fully readable at a glance,
// which defeats the point. User: "don't show the entire subtitle text on
// screen, run it with word pacing," plus "keep font a little smaller."
// Now only words that have actually started are rendered at all (a real
// typewriter-style build, not a dim preview), current word in ACCENT,
// already-spoken words in INK, font dropped from 42 to 32.
export const Captions: React.FC<CaptionsProps> = ({ words, frame }) => {
  const visible = words.filter((w) => frame >= w.start_frame);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X0,
        right: 1080 - SAFE_X1,
        bottom: 240,
        textAlign: "center",
        fontFamily: F_UI,
        fontSize: 32,
        fontWeight: 700,
        lineHeight: 1.4,
      }}
    >
      {visible.map((w, i) => {
        const isCurrent = frame >= w.start_frame && frame < w.end_frame;
        const color = isCurrent ? ACCENT : INK;
        return (
          <span
            key={i}
            style={{
              color,
              marginRight: "0.32em",
              display: "inline-block",
              textShadow: isCurrent ? `0 0 20px ${ACCENT}88` : "none",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
