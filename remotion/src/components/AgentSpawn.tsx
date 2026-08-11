import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_UI, CARD_BG, CARD_BORDER, CARD_DIM } from "../theme_skills";

// A subagent literally spawns as a child process of a parent -- this shows
// that relationship directly (a parent node, a stem branching down, a
// child slot arriving with a one-time "spawn" burst ring) instead of a
// standalone badge icon with no parent context. Added 2026-08-11 after
// direct feedback on pm-skills's Shot3 ("just a simple round icon, not a
// good graphic choice"). The child slot is a render prop -- what the
// spawned agent is actually DOING (e.g. reviewing a document) belongs in
// the caller, not baked in here, since that's the part that varies per
// agent.
export const AgentSpawn: React.FC<{
  parentLabel: string;
  accent: string;
  parentBorn: number;
  childBorn: number;
  frame: number;
  fps: number;
  children: React.ReactNode;
}> = ({ parentLabel, accent, parentBorn, childBorn, frame, fps, children }) => {
  const parentP = springIn(frame, fps, parentBorn);
  const parentOpacity = interpolate(parentP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const parentScale = interpolate(parentP, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  const stemP = interpolate(frame, [parentBorn + 8, childBorn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stemHeight = interpolate(stemP, [0, 1], [0, 54], { extrapolateRight: "clamp" });

  const childP = springIn(frame, fps, childBorn);
  const childOpacity = interpolate(childP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const childScale = interpolate(childP, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const childBreathe = breathe(frame - childBorn, 50, 0.04) * childP + (1 - childP);

  // A one-time expanding ring right as the child lands reads as "a new process just spawned,"
  // not a generic pop-in.
  const burstP = interpolate(frame, [childBorn, childBorn + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burstScale = interpolate(burstP, [0, 1], [0.6, 2.4]);
  const burstOpacity = interpolate(burstP, [0, 1], [0.55, 0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          opacity: parentOpacity,
          transform: `scale(${parentScale})`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderRadius: 999,
          background: CARD_BG,
          border: `1.5px solid ${CARD_BORDER}`,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CARD_DIM }} />
        <div style={{ fontFamily: F_UI, fontSize: 20, fontWeight: 700, color: CARD_DIM }}>{parentLabel}</div>
      </div>

      <div style={{ width: 2, height: stemHeight, background: CARD_BORDER }} />

      <div style={{ position: "relative", opacity: childOpacity, transform: `scale(${childScale * childBreathe})` }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 160,
            height: 160,
            marginLeft: -80,
            marginTop: -80,
            borderRadius: "50%",
            border: `2px solid ${accent}`,
            opacity: burstOpacity,
            transform: `scale(${burstScale})`,
          }}
        />
        {children}
      </div>
    </div>
  );
};
