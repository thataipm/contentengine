import React, { Suspense } from "react";
import { ThreeCanvas } from "@remotion/three";
import { W, H } from "../theme";
import { EnvironmentSetter } from "./environment";
import { BloomRig } from "./BloomRig";

type SceneRigProps = {
  children: React.ReactNode;
  // Camera zoom, 1 = the default 1-world-unit-equals-1-pixel mapping (see
  // below). >1 pushes in. Use for a slow continuous cinematic drift instead
  // of a static frame — cheap, reusable "never let a frame sit" motion that
  // doesn't require animating individual objects.
  zoom?: number;
  vignette?: boolean;
  chromaticAberration?: boolean;
};

// Shared key/fill lighting, identical across every 3D shot (per-card colored
// rim light is added separately by GlossyCard3D via lighting.tsx's
// RimLight, since that color varies per card). Key: neutral/cool, upper
// left, establishes the base specular highlight shape. Fill: low intensity,
// opposite the key, keeps the shadow side from going fully black without
// flattening the card's depth.
const SceneLighting: React.FC = () => (
  <>
    <ambientLight intensity={0.25} />
    <directionalLight position={[-400, 500, 600]} intensity={1.4} color="#FFFFFF" />
    <directionalLight position={[350, -300, 300]} intensity={0.35} color="#8A8A96" />
  </>
);

// Per-shot 3D canvas wrapper. Orthographic camera: React Three Fiber's
// default orthographic frustum spans [-width/2, width/2] x [-height/2,
// height/2] at zoom=1, which (since ThreeCanvas is sized to the episode's
// own W x H) makes 1 world unit exactly equal 1 screen pixel already, no
// custom left/right/top/bottom needed. This is what lets coords.ts's
// pxToWorld() convert GlowCard-style top-left pixel coordinates directly,
// so shot files don't need to learn new 3D placement math. A perspective
// camera (closer to the reference clip's parallax feel) can be added later
// as an opt-in, not the default.
export const SceneRig: React.FC<SceneRigProps> = ({
  children,
  zoom = 1,
  vignette = false,
  chromaticAberration = false,
}) => {
  return (
    <ThreeCanvas
      width={W}
      height={H}
      orthographic
      camera={{ position: [0, 0, 500], near: 0.1, far: 5000, zoom }}
      gl={{ alpha: true }}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Suspense fallback={null}>
        <EnvironmentSetter />
        <SceneLighting />
        {children}
        <BloomRig vignette={vignette} chromaticAberration={chromaticAberration} />
      </Suspense>
    </ThreeCanvas>
  );
};
