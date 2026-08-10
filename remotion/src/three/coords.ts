import { W, H } from "../theme";

// The orthographic camera in SceneRig.tsx is sized so 1 world unit = 1
// screen pixel, with the origin at canvas center (three.js convention) and
// Y pointing UP (three.js) instead of DOWN (screen/CSS convention). This
// helper converts from the same top-left-origin, Y-down pixel coordinates
// GlowCard already uses (x, y = top-left of a w-wide box) into a world-space
// CENTER point for a mesh of the given width/height, so shot files keep
// placing 3D content with the same numbers they already use for CSS cards.
export const pxToWorld = (x: number, y: number, w: number, h: number, z = 0) => {
  const worldX = x + w / 2 - W / 2;
  const worldY = H / 2 - (y + h / 2);
  return [worldX, worldY, z] as const;
};
