import { loadFont as loadDisplayFont } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadUIFont } from "@remotion/google-fonts/Inter";

// Visual direction locked 2026-08-06 after four hook-concept rounds (see
// docs/how_ai_works_content_plan.md §1): pure black background, real
// recognizable UI/hardware elements (chat interface, server rack, code
// editor) standing in for whatever the narration is literally about,
// rather than an abstract diagram. Fonts picked because they're what real
// interfaces actually use (Inter) and a confident display face for hook
// text (Bricolage Grotesque), not a brand exercise.
//
// Palette revised 2026-08-07, second time: retired the mint accent color
// entirely (matches the Google Flow/Veo reference clips the user shared —
// every one of those is pure black/white, zero hue anywhere). ACCENT is
// now white, same as INK — emphasis now comes from glow/weight/scale, not
// a color shift. Kept as a separate constant (not just reusing INK
// directly at call sites) so "this is the emphasized thing" stays a
// distinct semantic meaning in shot code, in case a deliberate one-off
// color moment is ever approved later — right now it resolves to white.

export const { fontFamily: F_DISPLAY } = loadDisplayFont();
export const { fontFamily: F_UI } = loadUIFont();

export const BG = "#000000";
export const INK = "#F2F2F3";
export const DIM = "#8B8B92";
export const ACCENT = "#FFFFFF";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Instagram Reels UI safe zone: IG's own overlay buttons cover roughly the
// right 120-150px and bottom 300-320px of the canvas. This is a platform
// constraint, not a style choice, so it survives the reset. Lay out
// load-bearing content inside these bounds, not the raw canvas edges.
export const SAFE_X0 = 70;
export const SAFE_X1 = 910;
export const SAFE_Y0 = 160;
export const SAFE_Y1 = 1650;
export const SAFE_W = SAFE_X1 - SAFE_X0;
