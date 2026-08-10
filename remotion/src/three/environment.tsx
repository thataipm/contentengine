import React, { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { PMREMGenerator } from "three";

// A local, deterministic environment map for realistic specular falloff on
// PBR materials (point/directional lights alone read as flat/plasticky, the
// exact "cheap" failure mode this whole change exists to avoid).
// Deliberately NOT drei's <Environment preset="..."> — that fetches an HDR
// file from a remote CDN at render time, a real determinism risk for a
// headless frame-by-frame export (flaky renders, or a different-looking
// environment months from now if the CDN asset changes). RoomEnvironment is
// bundled with three itself, generated once per render, zero network calls.
// Renders nothing itself, just assigns scene.environment so every material
// in the scene picks up reflections via its own envMapIntensity.
export const EnvironmentSetter: React.FC = () => {
  const { gl, scene } = useThree();

  const envTexture = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);

  useEffect(() => {
    scene.environment = envTexture;
    return () => {
      scene.environment = null;
    };
  }, [scene, envTexture]);

  return null;
};
