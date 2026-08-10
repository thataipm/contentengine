import React from "react";

// A real HDR-emissive glow point through BloomRig, for ambient light behind
// DOM content (a hero number, an icon, a button) rather than a beam. Same
// bloom-tuning rules as GlowBeam3D — see that file's header comment.
export const GlowOrb3D: React.FC<{
  position: readonly [number, number, number];
  scale?: number;
  color?: string;
  intensity?: number;
  opacity?: number;
}> = ({ position, scale = 20, color = "#3ED9A6", intensity = 2, opacity = 1 }) => (
  <mesh position={position} scale={scale}>
    <sphereGeometry args={[1, 24, 24]} />
    <meshStandardMaterial color="#050506" emissive={color} emissiveIntensity={intensity} toneMapped={false} transparent opacity={opacity} />
  </mesh>
);
