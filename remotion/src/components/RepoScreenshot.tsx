import React from "react";
import { Img, interpolate } from "remotion";
import { springIn } from "../motion";
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
  const zoomScale = 1 + zoomP * 2.2;
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
      </div>
    </div>
  );
};
