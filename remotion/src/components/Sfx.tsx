import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

// One-shot sound cue for a discrete visual event (card pop-in, camera push,
// stat-reveal payoff), per the channel's own "sound-synced beats" rule.
// `Sequence` makes `at` a shot-local frame offset, matching how
// `useCurrentFrame()` behaves everywhere else in a shot. Kept quiet
// (40-50%) per direct instruction -- these are accents under the VO, not a
// backing track. `tick` = small UI pop (card/chip/header appearing),
// `whoosh` = sustained camera-push motion, `chime` = payoff/reveal beat
// (a stat callout, the closing CTA).
const SFX_FILES = {
  tick: "sfx/tick_raw.mp3",
  whoosh: "sfx/whoosh_raw.mp3",
  chime: "sfx/chime_raw.mp3",
} as const;

const SFX_VOLUME: Record<keyof typeof SFX_FILES, number> = {
  tick: 0.4,
  whoosh: 0.45,
  chime: 0.5,
};

export const Sfx: React.FC<{ type: keyof typeof SFX_FILES; at: number }> = ({ type, at }) => (
  <Sequence from={at} durationInFrames={40} layout="none">
    <Audio src={staticFile(SFX_FILES[type])} volume={SFX_VOLUME[type]} />
  </Sequence>
);
