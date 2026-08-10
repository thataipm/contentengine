import React from "react";
import { CARD_DIM } from "../theme_skills";

// Neutral "this is a cited source page" glyph for RepoScreenshot's icon
// slot when the subject is a research article/report rather than a
// product with its own brand mark, deliberately not pretending to be a
// site's real logo when we don't have a verified real asset for it.
export const SourceIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke={CARD_DIM} strokeWidth="1.6" />
    <line x1="7.5" y1="8" x2="16.5" y2="8" stroke={CARD_DIM} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="7.5" y1="12" x2="16.5" y2="12" stroke={CARD_DIM} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="7.5" y1="16" x2="13" y2="16" stroke={CARD_DIM} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
