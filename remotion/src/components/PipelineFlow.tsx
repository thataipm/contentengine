import React from "react";
import { interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, F_ACCENT, CARD_BG, CARD_BORDER, INK_LIGHT, ACCENTS } from "../theme_skills";

export type PipelineNode = { label: string; accent: string; born: number };

// A real visual hook (per direct feedback: "never start with just
// captions") -- a vertical flowchart building itself node by node, the
// same literal-visualization idea this channel already uses for
// agent/pipeline content, applied here to the user's own actual video
// pipeline. Each node pops in with a connecting beam grown from the one
// before it.
export const PipelineFlow: React.FC<{ nodes: PipelineNode[]; frame: number; fps: number }> = ({ nodes, frame, fps }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    {nodes.map((n, i) => {
      const p = springIn(frame, fps, n.born);
      const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
      const scale = interpolate(p, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
      const stemP = i > 0 ? springIn(frame, fps, nodes[i - 1].born + 6) : 0;
      const stemHeight = interpolate(stemP, [0, 1], [0, 46], { extrapolateRight: "clamp" });

      return (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {i > 0 ? <div style={{ width: 2, height: stemHeight, background: CARD_BORDER }} /> : null}
          <div
            style={{
              opacity,
              transform: `scale(${scale})`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 28px",
              borderRadius: 999,
              background: CARD_BG,
              border: `1.5px solid ${n.accent}`,
              boxShadow: `0 0 30px -8px ${n.accent}88`,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.accent }} />
            <div style={{ fontFamily: i === 0 || i === nodes.length - 1 ? F_UI : F_ACCENT, fontSize: 30, fontWeight: 800, color: INK_LIGHT }}>
              {n.label}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export const defaultPipelineNodes = (): PipelineNode[] => [
  { label: "Raw Footage", accent: "#5A5A62", born: 0 },
  { label: "video-use", accent: ACCENTS[0], born: 20 },
  { label: "HyperFrames", accent: ACCENTS[2], born: 42 },
  { label: "Remotion", accent: ACCENTS[3], born: 61 },
  { label: "Final Video", accent: ACCENTS[1], born: 83 },
];
