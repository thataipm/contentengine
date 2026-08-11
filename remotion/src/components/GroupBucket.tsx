import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_UI, CARD_BG, CARD_BORDER, INK_LIGHT } from "../theme_skills";

// A labeled container that items visibly drop into, for "this is a group/
// category holding several things" -- not a flat tag/pill. Added
// 2026-08-11 after direct feedback ("simple UI buttons" for Foundation/
// Utility/Sprint Toolkit on pm-skills's Shot2): a category is a bucket that
// holds items, not a rounded-pill label, so the device needed to visually
// hold something rather than just say a word. `itemBorns` are deliberately
// generic (not a claimed per-category count) -- real per-category skill
// counts weren't verified against a primary source, so this stays a
// stylized "multiple items belong here" cue, not a number claim.
export const GroupBucket: React.FC<{
  label: string;
  accent: string;
  itemBorns: number[]; // one born frame per falling item, staggered
  frame: number;
  fps: number;
  width?: number;
}> = ({ label, accent, itemBorns, frame, fps, width = 168 }) => {
  const bucketBorn = itemBorns[0] - 10;
  const bucketP = springIn(frame, fps, bucketBorn);
  const bucketOpacity = interpolate(bucketP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const bucketScale = interpolate(bucketP, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  const labelBorn = itemBorns[itemBorns.length - 1] + 6;
  const labelP = springIn(frame, fps, labelBorn);
  const labelOpacity = interpolate(labelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const filled = frame - labelBorn > 0;
  const idlePulse = filled ? breathe(frame - labelBorn, 52, 0.03) : 1;
  const height = 116;
  const itemSize = 26;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: bucketOpacity, transform: `scale(${bucketScale * idlePulse})` }}>
      <div style={{ position: "relative", width, height }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: height - 18,
            borderLeft: `2.5px solid ${CARD_BORDER}`,
            borderRight: `2.5px solid ${CARD_BORDER}`,
            borderBottom: `2.5px solid ${CARD_BORDER}`,
            borderRadius: "0 0 16px 16px",
            background: CARD_BG,
          }}
        />
        {itemBorns.map((born, i) => {
          const p = springIn(frame, fps, born);
          const dropP = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(dropP, [0, 1], [-70, height - 18 - itemSize - 12], { extrapolateRight: "clamp" });
          const x = width / 2 - itemSize / 2 + (i - (itemBorns.length - 1) / 2) * (itemSize + 8);
          const landed = dropP > 0.95;
          const landPulse = landed ? breathe(frame - born, 40, 0.05) : 1;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: itemSize,
                height: itemSize,
                borderRadius: 6,
                background: accent,
                opacity: dropP,
                boxShadow: `0 0 16px -4px ${accent}`,
                transform: `scale(${landPulse})`,
              }}
            />
          );
        })}
      </div>
      <div style={{ fontFamily: F_UI, fontSize: 24, fontWeight: 700, color: INK_LIGHT, opacity: labelOpacity, textAlign: "center" }}>{label}</div>
    </div>
  );
};
