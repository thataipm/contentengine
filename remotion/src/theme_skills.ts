import { loadFont as loadAccentFont } from "@remotion/google-fonts/BricolageGrotesque";
import { F_DISPLAY, F_UI } from "./theme";

// Palette for ThatAIPM's Pillar 2 (trending Claude Code skills). Revised
// 2026-08-09 after reviewing a third reference video: dark canvas
// (matching how ALL of a talking-head reference's on-screen graphic beats
// actually read once you exclude the light-background transitions),
// colorful rotating accents kept on top -- "keep background dark, you can
// keep rest colorful" was the direct instruction. Grid-paper/light version
// retired; kept as a separate file from theme.ts so Pillar 1's black stays
// untouched and this pillar can keep evolving independently.
export { F_DISPLAY, F_UI };
export const { fontFamily: F_ACCENT } = loadAccentFont();

export const BG_DARK = "#0B0B0E";
export const INK_LIGHT = "#F5F5F2";
export const CARD_BG = "#17171B";
export const CARD_BORDER = "#2C2C32";
export const CARD_TEXT = "#F2F2F2";
export const CARD_DIM = "#9A9AA2";

// Rotates per accent word/beat/tool -- never a fixed single accent,
// matches the reference videos' habit of a different color per key phrase.
export const ACCENTS = ["#8C7CFF", "#6FE0A0", "#FF9B54", "#5FC4E0"] as const;

// Caption two-font pairing (point #2 of the 2026-08-09 feedback): plain
// spoken words in F_UI, emphasized words (numbers, tool names, keywords)
// in the rounder/bolder F_ACCENT face -- matches the weight-shift visible
// on the reference videos' own closing CTA text.
