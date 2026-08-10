import React from "react";
import { Img, interpolate } from "remotion";
import { springIn } from "../motion";
import { F_UI, CARD_BG, CARD_BORDER, CARD_DIM } from "../theme_skills";

// A REAL browser screenshot of an actual product page (captured via
// Playwright, see automation/capture_product_screenshot.py), not a
// recreation -- generalizes RepoScreenshot for Tool Showdowns, where the
// subject is a commercial product's public page (a showcase/gallery/
// pricing page), not a github.com repo with a stars badge. Shows the top
// of the real page in a browser-chrome frame, then zooms into whatever
// real detail matters for that beat (`highlightBox` -- a price, a rating,
// a generated-result thumbnail, a feature callout), "camera push" style,
// via a CSS transform-origin anchored on that detail's real pixel
// position in the source screenshot (captured at viewport 1280x900,
// device_scale_factor 2 for a crisp zoom -- same convention as sk1's
// GitHub captures, for a consistent grain/sharpness across both pillars).
export const ProductScreenshot: React.FC<{
  image: string;
  icon: React.ReactNode;
  url: string;
  highlightBox: { x: number; y: number; w: number; h: number };
  born: number;
  zoomStart: number;
  zoomEnd: number;
  frame: number;
  fps: number;
  width?: number;
  cropHeight?: number;
  imgW?: number;
  imgH?: number;
}> = ({ image, icon, url, highlightBox, born, zoomStart, zoomEnd, frame, fps, width = 860, cropHeight = 420, imgW = 1280, imgH = 900 }) => {
  const p = springIn(frame, fps, born);
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = interpolate(p, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });

  const zoomP = interpolate(frame, [zoomStart, zoomEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoomScale = 1 + zoomP * 2.2;
  const originX = ((highlightBox.x + highlightBox.w / 2) / imgW) * 100;
  const originY = ((highlightBox.y + highlightBox.h / 2) / imgH) * 100;

  const displayScale = width / imgW;
  const windowHeight = cropHeight * displayScale;

  // The highlighted detail rarely sits centered in the real page. Pan the
  // image as it zooms so it ends up centered in the crop window, instead
  // of just growing in place toward whatever corner it started in.
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
