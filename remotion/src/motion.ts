import { spring, interpolate } from "remotion";

// Standard entrance spring for this theme: slight overshoot, settles fast.
// Use with interpolate(springIn(...), [0, 1], [from, to]) for opacity/scale/position.
// Tuned snappier 2026-08-10 after sd1 feedback -- kept as a genuine improvement (worth
// having regardless), but CORRECTION same day: the "pacing is slow" complaint turned out
// to be about VOICEOVER delivery speed, not visual motion/zoom timing. See
// automation/generate_vo.py and CLAUDE.md for the real fix (eleven_v3 audio tags like
// [rushed], not a code change here) -- don't assume this spring tuning alone addresses
// a future "still feels slow" report without checking VO pace first.
export const springIn = (frame: number, fps: number, delay: number) =>
  spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.5, stiffness: 220 } });

// Audio/video volume envelope for a shot living inside a <TransitionSeries>
// crossfade: ramps 0->1 over the shot's first `fadeFrames` and 1->0 over its
// last `fadeFrames` (local timeline, i.e. useCurrentFrame() inside that
// shot). TransitionSeries only fades the PICTURE during a transition, each
// shot's own <Audio>/<Video> keeps playing at full volume underneath, so
// without this two full-volume VO lines overlap at every cut (heard as
// "cropped"/rushed-sounding speech). Pass the result as the `volume` prop on
// that shot's <Audio>/<Video> element. `fadeFrames` should match (or be <=)
// the episode's transitionFrames (see Episode.tsx's DEFAULT_TRANSITION_FRAMES).
export const edgeFadeVolume = (frame: number, durationInFrames: number, fadeFrames: number) => {
  const fadeIn = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - fadeFrames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
};
