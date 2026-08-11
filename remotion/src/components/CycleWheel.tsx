import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_ACCENT, CARD_BG, CARD_BORDER, CARD_DIM, INK_LIGHT } from "../theme_skills";

export type CycleNode = { label: string; accent: string; born: number };

// A literal cycle -- phases arranged in a ring, not a straight-line
// pipeline. Added 2026-08-11 after direct feedback ("real product lifecycle
// is a circle") on pm-skills's Shot2, which originally reused PipelineFlow
// (a linear left-to-right build) for something that structurally loops back
// on itself. The ring path draws itself clockwise from the first node
// through to `closeBorn` (one continuous SVG stroke reveal, same
// self-drawing technique as TrendChart's line), so the loop visibly closes
// instead of just arranging static nodes in a circle. A glowing marker
// keeps orbiting the closed ring afterward -- the shot's own idle motion,
// and the most literal way to say "this repeats."
export const CycleWheel: React.FC<{
  nodes: CycleNode[];
  frame: number;
  fps: number;
  closeBorn: number; // frame the ring finishes closing back on itself
  size?: number;
  // When set, every node's dim outline slot appears immediately at this frame instead of
  // waiting for its own `born` -- fixes the same dead-preamble gap PipelineFlow's own
  // `slotsVisibleFrom` was built for (see that component's comment).
  slotsVisibleFrom?: number;
}> = ({ nodes, frame, fps, closeBorn, size = 560, slotsVisibleFrom }) => {
  const n = nodes.length;
  const cx = size / 2;
  const cy = size / 2;
  const ringR = size / 2 - 90; // leaves room for node circles + labels outside the ring
  const nodeR = 42;
  const circumference = 2 * Math.PI * ringR;

  const preReveal = slotsVisibleFrom !== undefined;
  const slotsP = preReveal ? springIn(frame, fps, slotsVisibleFrom as number) : 0;
  const slotsOpacity = preReveal ? interpolate(slotsP, [0, 1], [0, 1], { extrapolateRight: "clamp" }) : 0;

  const drawP = interpolate(frame, [nodes[0].born, closeBorn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Marker keeps orbiting once the ring has closed instead of freezing on
  // its landing point.
  const ORBIT_PERIOD = 150;
  const orbitT = drawP >= 1 ? ((((frame - closeBorn) % ORBIT_PERIOD) + ORBIT_PERIOD) % ORBIT_PERIOD) / ORBIT_PERIOD : drawP;
  const markerAngle = -Math.PI / 2 + orbitT * 2 * Math.PI;
  const markerX = cx + ringR * Math.cos(markerAngle);
  const markerY = cy + ringR * Math.sin(markerAngle);
  const markerPulse = breathe(frame, 26, 0.18);

  const ringBaseOpacity = preReveal ? slotsOpacity : drawP > 0 ? 1 : 0;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={CARD_BORDER} strokeWidth={2} opacity={ringBaseOpacity} />
        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke={nodes[0].accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - drawP)}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.85}
        />
        <circle cx={markerX} cy={markerY} r={7 * markerPulse} fill={nodes[0].accent} opacity={drawP > 0 ? 1 : 0} />
      </svg>

      {nodes.map((node, i) => {
        const angle = -Math.PI / 2 + (i / n) * 2 * Math.PI;
        const nx = cx + ringR * Math.cos(angle);
        const ny = cy + ringR * Math.sin(angle);
        const labelR = ringR + 78;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);

        const p = springIn(frame, fps, node.born);
        const fillP = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const nodeOpacity = preReveal ? Math.max(fillP, slotsOpacity) : fillP;
        const scale = interpolate(preReveal ? Math.max(fillP, slotsP) : fillP, [0, 1], [0.5, 1], { extrapolateRight: "clamp" });
        const lit = fillP > 0.4;
        const waitPulse = !lit ? breathe(frame - i * 7, 44, 0.05) : 1;

        return (
          <React.Fragment key={node.label}>
            <div
              style={{
                position: "absolute",
                left: nx - nodeR,
                top: ny - nodeR,
                width: nodeR * 2,
                height: nodeR * 2,
                borderRadius: "50%",
                background: CARD_BG,
                border: `3px solid ${lit ? node.accent : CARD_BORDER}`,
                boxShadow: lit ? `0 0 30px -6px ${node.accent}aa` : "none",
                transform: `scale(${scale * waitPulse})`,
                opacity: nodeOpacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: lx,
                top: ly,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: fillP,
                fontFamily: F_ACCENT,
                fontSize: 27,
                fontWeight: 800,
                color: lit ? INK_LIGHT : CARD_DIM,
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {node.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
