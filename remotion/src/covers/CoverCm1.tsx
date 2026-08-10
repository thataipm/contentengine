import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneRig } from "../three/SceneRig";
import { GlowBeam3D } from "../three/GlowBeam3D";
import { GlowBox } from "../components/GlowBox";
import { pxToWorld } from "../three/coords";
import { F_DISPLAY, F_UI, INK, DIM } from "../theme";

// Instagram cover graphic for cm1, "Tokens: How AI Reads Text." Reuses the
// episode's own real visual language (GlowBox + real HDR GlowBeam3D slicing
// through "strawberry", the Shot2/3 motif) rather than inventing a separate
// template, per the channel's literal-real-UI rule extended to thumbnails.
// Rendered as a single settled still (frame 60, well past every element's
// spring-in), no timeline/audio needed.
export const CoverCm1: React.FC = () => {
  const frame = 60;
  const fps = 30;

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <SceneRig>
        <GlowBeam3D position={pxToWorld(540, 560, 0, 0)} thickness={4} length={420} opacity={1} intensity={4.5} />
      </SceneRig>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 200,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 22,
          color: DIM,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Core Mechanics &middot; Episode 1
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center" }}>
        <GlowBox born={0} frame={frame} fps={fps} fontSize={92}>
          strawberry
        </GlowBox>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center" }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 140, fontWeight: 700, color: INK, letterSpacing: -3, lineHeight: 1 }}>TOKENS</div>
        <div style={{ fontFamily: F_UI, fontSize: 44, fontWeight: 700, color: DIM, marginTop: 26 }}>How AI Reads Text</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 140,
          textAlign: "center",
          fontFamily: F_UI,
          fontSize: 26,
          fontWeight: 700,
          color: DIM,
          letterSpacing: 1,
        }}
      >
        @thataipm
      </div>
    </AbsoluteFill>
  );
};
