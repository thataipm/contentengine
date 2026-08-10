import React from "react";

// Standing layout fix (2026-08-09): shot content divs used to anchor at a
// fixed `top` offset with no vertical centering, so anything shorter than
// the full remaining space just sat near the header, leaving ~700-800px of
// dead canvas above the captions (flagged directly from a real frame:
// "so much blank space available in the middle"). This centers children
// within the real available zone instead -- `top`/`bottom` mark the
// boundaries to stay clear of (header above, captions below), and content
// of any height centers inside that zone rather than hugging `top`.
export const ContentZone: React.FC<{ top?: number; bottom?: number; children: React.ReactNode }> = ({
  top = 260,
  bottom = 560,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top,
      bottom,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);
