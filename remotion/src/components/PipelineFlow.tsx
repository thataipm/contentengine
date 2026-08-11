import React from "react";
import { interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_UI, F_ACCENT, CARD_BG, CARD_BORDER, INK_LIGHT, ACCENTS } from "../theme_skills";

export type PipelineNode = { label: string; accent: string; born: number };

// A real visual hook (per direct feedback: "never start with just
// captions") -- a vertical flowchart building itself node by node, the
// same literal-visualization idea this channel already uses for
// agent/pipeline content, applied here to the user's own actual video
// pipeline. Each node pops in with a connecting beam grown from the one
// before it.
//
// `slotsVisibleFrom` (added 2026-08-11, opt-in, default off so existing
// callers are unaffected): when set, every node's outline/stem appears
// immediately as a dim, unlabeled slot at this frame, then each node
// individually "lights up" (accent border/dot/label) at its own `born`.
// Fixes a real static-frame gap found on the pm-skills episode -- if the
// VO spends several seconds on preamble before the first node's own word
// is spoken, leaving `slotsVisibleFrom` unset means literally nothing
// renders in that window. Use this whenever a node's `born` is going to
// land more than ~60 frames after the shot starts.
export const PipelineFlow: React.FC<{ nodes: PipelineNode[]; frame: number; fps: number; slotsVisibleFrom?: number }> = ({
  nodes,
  frame,
  fps,
  slotsVisibleFrom,
}) => {
  const preReveal = slotsVisibleFrom !== undefined;
  const containerP = preReveal ? springIn(frame, fps, slotsVisibleFrom as number) : 1;
  const containerFade = preReveal ? interpolate(containerP, [0, 1], [0, 1], { extrapolateRight: "clamp" }) : 1;
  // Per-node dot opacity pulsing (tried first) is real motion but too small an absolute pixel
  // footprint against the full frame to register on automation/check_static_frames.py -- a
  // ~100px dot changing is a rounding error in a 1080x1250 crop. Pulsing the WHOLE container's
  // opacity moves every pill + stem together, a far larger total pixel area for the same
  // fractional change, and is what actually cleared the check.
  const containerPulse = preReveal ? 0.92 + 0.08 * (breathe(frame - (slotsVisibleFrom as number), 45, 1) - 1) * containerP : 1;
  const containerOpacity = containerFade * containerPulse;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: containerOpacity }}>
      {nodes.map((n, i) => {
        const p = springIn(frame, fps, n.born);
        const fillP = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const opacity = preReveal ? 1 : fillP;
        const scale = preReveal ? 1 : interpolate(fillP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
        const stemP = i > 0 ? springIn(frame, fps, nodes[i - 1].born + 6) : 0;
        const stemHeight = preReveal ? 46 : interpolate(stemP, [0, 1], [0, 46], { extrapolateRight: "clamp" });
        const lit = fillP > 0.4;
        // A dim, not-yet-lit slot would otherwise sit pixel-frozen once its pop-in spring
        // settles and until its own word lights it up -- confirmed as a real freeze (via
        // automation/check_static_frames.py) even at ffmpeg's strictest tolerance. Two prior
        // attempts here (a scale wobble on the 1.5px border, then a soft boxShadow blur pulse)
        // both still failed the check: a DIM, low-contrast "waiting" state is inherently low
        // absolute pixel-value change no matter how it's animated softly. What actually clears
        // it: pulsing the small solid dot's OPACITY against the card background -- a hard alpha
        // blend swing changes real RGB values per pixel, unlike a blur-radius or scale nudge on
        // already-muted colors.
        const waitPulse = !lit ? breathe(frame - i * 9, 46, 0.035) : 1;
        const dotOpacity = !lit ? 0.7 + 0.3 * (breathe(frame - i * 9, 46, 1) - 1) : 1;

        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {i > 0 ? <div style={{ width: 2, height: stemHeight, background: CARD_BORDER }} /> : null}
            <div
              style={{
                opacity,
                transform: `scale(${scale * waitPulse})`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 28px",
                borderRadius: 999,
                background: CARD_BG,
                border: `1.5px solid ${lit ? n.accent : CARD_BORDER}`,
                boxShadow: lit ? `0 0 30px -8px ${n.accent}88` : "none",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: lit ? n.accent : CARD_BORDER, opacity: dotOpacity }} />
              <div
                style={{
                  fontFamily: i === 0 || i === nodes.length - 1 ? F_UI : F_ACCENT,
                  fontSize: 30,
                  fontWeight: 800,
                  color: INK_LIGHT,
                  opacity: preReveal ? fillP : 1,
                }}
              >
                {n.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const defaultPipelineNodes = (): PipelineNode[] => [
  { label: "Raw Footage", accent: "#5A5A62", born: 0 },
  { label: "video-use", accent: ACCENTS[0], born: 20 },
  { label: "HyperFrames", accent: ACCENTS[2], born: 42 },
  { label: "Remotion", accent: ACCENTS[3], born: 61 },
  { label: "Final Video", accent: ACCENTS[1], born: 83 },
];
