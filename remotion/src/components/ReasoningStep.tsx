import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, INK, DIM, ACCENT } from "../theme";

// A single node in a vertical "flowchart building itself" reasoning chain
// (CLAUDE.md's literal-visualization rule for agent/decision content,
// repurposed here for arithmetic reasoning steps instead of agent
// decisions). A filled dot + connecting stem above (skipped for the first
// node) + label text, springing in at `born`.
export const ReasoningStep: React.FC<{
  text: string;
  born: number;
  frame: number;
  fps: number;
  first?: boolean;
  final?: boolean;
}> = ({ text, born, frame, fps, first = false, final = false }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const stemHeight = interpolate(p, [0, 1], [0, 56], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {!first ? <div style={{ width: 2, height: stemHeight, background: DIM }} /> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 22, opacity }}>
        <div
          style={{
            width: final ? 20 : 14,
            height: final ? 20 : 14,
            borderRadius: "50%",
            background: final ? ACCENT : INK,
            boxShadow: final ? `0 0 30px ${ACCENT}` : "none",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontFamily: F_UI,
            fontSize: final ? 46 : 34,
            fontWeight: 700,
            color: final ? ACCENT : INK,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
