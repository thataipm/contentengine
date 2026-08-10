import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export const Watermark: React.FC<{ handle: string; color?: string; opacity?: number }> = ({
  handle,
  color = "#000",
  opacity = 0.25,
}) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      right: 70,
      color,
      opacity,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: 0.5,
    }}
  >
    {handle}
  </div>
);

export const ProgressBar: React.FC<{ color: string; track?: string }> = ({
  color,
  track = "rgba(0,0,0,0.08)",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const w = (frame / (durationInFrames - 1)) * width;
  return (
    <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 6, background: track }}>
      <div style={{ width: w, height: "100%", background: color }} />
    </div>
  );
};
