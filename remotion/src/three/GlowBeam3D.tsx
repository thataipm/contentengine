import React from "react";

// A real HDR-emissive light beam through BloomRig (genuine light bleed,
// not a CSS gradient approximation) — built 2026-08-07 to match the
// "glowing lines slice text blocks" look in the Google Flow reference the
// user shared. `emissiveIntensity` pushed well past 1 and `toneMapped=false`
// so bloom's extraction pass actually sees it (see CLAUDE.md's bloom
// pitfall — a normal-brightness color barely triggers bloom at all).
export const GlowBeam3D: React.FC<{
  position: readonly [number, number, number];
  thickness?: number;
  length?: number;
  horizontal?: boolean;
  opacity?: number;
  intensity?: number;
  color?: string;
}> = ({ position, thickness = 3, length = 1900, horizontal = false, opacity = 1, intensity = 4, color = "#FFFFFF" }) => (
  <mesh position={position} scale={horizontal ? [length, thickness, 1] : [thickness, length, 1]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial
      color="#050506"
      emissive={color}
      emissiveIntensity={intensity}
      toneMapped={false}
      transparent
      opacity={opacity}
    />
  </mesh>
);
