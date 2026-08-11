import React from "react";
import { Img, interpolate } from "remotion";
import { springIn, breathe } from "../motion";
import { F_UI, CARD_BG, CARD_BORDER, CARD_DIM } from "../theme_skills";

// A REAL browser screenshot of the actual GitHub repo (captured via
// Playwright, see episodes/sk1/assets/capture_screenshot.py), not a
// recreation -- per direct feedback ("use original screenshot where its
// possible"). Shows the top of the real page in a browser-chrome frame,
// then zooms into the real star count in place, "camera push" style, via
// a CSS transform-origin anchored on the star badge's real pixel
// position in the source screenshot (captured at viewport 1280x900,
// device_scale_factor 2 for a crisp zoom).
export const RepoScreenshot: React.FC<{
  image: string;
  icon: React.ReactNode;
  url: string;
  starsBox: { x: number; y: number; w: number; h: number };
  born: number;
  zoomStart: number;
  zoomEnd: number;
  frame: number;
  fps: number;
  width?: number;
  cropHeight?: number;
  imgW?: number;
  imgH?: number;
}> = ({ image, icon, url, starsBox, born, zoomStart, zoomEnd, frame, fps, width = 860, cropHeight = 420, imgW = 1280, imgH = 900 }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = interpolate(p, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });

  const zoomP = interpolate(frame, [zoomStart, zoomEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Once the zoom finishes, the frame would otherwise sit perfectly frozen for however long
  // the shot holds afterward -- a subtle idle pulse (gated by zoomP so it only kicks in once
  // the push-in has actually landed) keeps it alive without fighting the zoom animation itself.
  // 2026-08-11: 0.02 amplitude measured (via automation/check_static_frames.py, ffmpeg
  // freezedetect) as mathematically present but too subtle to register as real motion --
  // this shot still flagged as frozen for 5+ seconds. Bumped until the same check passes.
  const idleBreathe = breathe(frame - zoomEnd, 60, 0.06);
  const zoomScale = (1 + zoomP * 2.2) * (1 + (idleBreathe - 1) * zoomP);

  // Scan sweep: 2026-08-11, direct instruction ("along with screenshots, let's not waste a
  // single frame"). A held real screenshot is real content, not a graphic we're building --
  // but it can still sit as static as any other beat. Rather than lean harder on a barely-
  // perceptible scale pulse, this reuses the channel's own literal-visualization rule
  // (CLAUDE.md 1: "attention = a moving spotlight sweeping across content") -- a soft light
  // band continuously sweeps the crop window, reads as "this evidence is being scanned,"
  // and gives large, unambiguous pixel-level motion regardless of tolerance/threshold.
  const SWEEP_PERIOD = 70;
  const sweepT = ((frame % SWEEP_PERIOD) + SWEEP_PERIOD) % SWEEP_PERIOD / SWEEP_PERIOD;
  const sweepX = interpolate(sweepT, [0, 1], [-width * 0.6, width * 1.3]);
  const sweepOpacity = zoomP;
  const originX = ((starsBox.x + starsBox.w / 2) / imgW) * 100;
  const originY = ((starsBox.y + starsBox.h / 2) / imgH) * 100;

  const displayScale = width / imgW;
  const windowHeight = cropHeight * displayScale;

  // The star badge sits off-center in the real page (top-right). Pan the
  // image as it zooms so the badge ends up centered in the crop window,
  // instead of just growing in place toward the corner.
  const originScreenX = (originX / 100) * imgW * displayScale;
  const originScreenY = (originY / 100) * imgH * displayScale;
  const panX = width / 2 - originScreenX;
  const panY = windowHeight / 2 - originScreenY;

  return (
    <div
      style={{
        width,
        opacity,
        transform: `scale(${cardScale})`,
        borderRadius: 20,
        border: `1px solid ${CARD_BORDER}`,
        background: CARD_BG,
        boxShadow: "0 30px 70px -20px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${CARD_BORDER}` }}>
        <div style={{ display: "flex", gap: 7 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4A4A4A" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4A4A4A" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4A4A4A" }} />
        </div>
        <div style={{ marginLeft: 14 }}>{icon}</div>
        <div style={{ fontFamily: F_UI, fontSize: 14, fontWeight: 700, color: CARD_DIM, marginLeft: 10 }}>{url}</div>
      </div>
      <div style={{ width, height: windowHeight, overflow: "hidden", position: "relative" }}>
        <Img
          src={image}
          style={{
            width: imgW,
            display: "block",
            transform: `translate(${panX * zoomP}px, ${panY * zoomP}px) scale(${displayScale * zoomScale})`,
            transformOrigin: `${originX}% ${originY}%`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -windowHeight * 0.5,
            left: sweepX,
            width: width * 0.3,
            height: windowHeight * 2,
            background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.14) 55%, transparent)",
            transform: "rotate(10deg)",
            opacity: sweepOpacity,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
