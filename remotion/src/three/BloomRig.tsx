import React from "react";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

// Bloom tuned to catch emissive rim-glow/specular highlights without
// washing out the Html-composited icon/title text past legibility — a
// named visual-inspection criterion at the Phase 1 checkpoint (directly
// tests CLAUDE.md's "literal over decorative" rule: illegible content fails
// regardless of how good the spheres/cards look). Wrap a shot's 3D content
// in this once, near the top of its tree (siblings of SceneRig's children).
//
// `vignette`/`chromaticAberration` (2026-08-06): optional cinematic polish,
// off by default so nothing existing changes. All effects share ONE
// EffectComposer (postprocessing effects compose as passes on a single
// composer, not one each) — add new passes here rather than mounting a
// second <EffectComposer>, which doesn't layer correctly with this one.
export const BloomRig: React.FC<{ vignette?: boolean; chromaticAberration?: boolean }> = ({
  vignette = false,
  chromaticAberration = false,
}) => (
  <EffectComposer>
    <Bloom
      intensity={0.55}
      luminanceThreshold={0.35}
      luminanceSmoothing={0.2}
      mipmapBlur
      radius={0.6}
    />
    {chromaticAberration ? (
      <ChromaticAberration offset={new Vector2(0.0006, 0.0006)} blendFunction={BlendFunction.NORMAL} />
    ) : (
      <></>
    )}
    {vignette ? <Vignette eskil={false} offset={0.25} darkness={0.65} /> : <></>}
  </EffectComposer>
);
