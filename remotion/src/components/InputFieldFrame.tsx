import React from "react";
import { F_UI, DIM } from "../theme";

const PANEL = "#111113";
const PANEL_BORDER = "#252528";

// Generic dark text-input chrome, cm1's literal element (a single piece of
// input text, not a conversation, so no chat bubbles here — see
// docs/how_ai_works_content_plan.md's cm1 entry). Sibling of the chat
// interface set-piece, same visual family (dark panel, subtle border,
// Inter labels) but deliberately simpler chrome for a different real thing.
//
// Second pass (2026-08-07): the first version was a small box floating in
// a lot of dead black space — user feedback: "so many blank spaces, I want
// constant visual on screen." `minHeight` now makes this genuinely tall
// (fills most of the space between the hook/caption zones, not just
// hugging its content), so shots read as "one substantial real interface,"
// not "a small card on an empty stage."
export const InputFieldFrame: React.FC<{
  children: React.ReactNode;
  top: number;
  minHeight?: number;
  glow?: number;
}> = ({ children, top, minHeight = 620, glow = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: 46,
      right: 46,
      top,
      minHeight,
      background: PANEL,
      border: `1px solid ${PANEL_BORDER}`,
      borderRadius: 30,
      padding: "44px 40px",
      boxShadow: `0 30px 80px -20px rgba(0,0,0,0.8), 0 0 ${60 * glow}px -10px #3ED9A6${Math.round(glow * 90)
        .toString(16)
        .padStart(2, "0")}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: DIM, opacity: 0.5 }} />
      <div style={{ fontFamily: F_UI, fontSize: 16, color: DIM, letterSpacing: 0.5 }}>input</div>
    </div>
    {children}
  </div>
);
