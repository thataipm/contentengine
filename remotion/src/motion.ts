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
// Continuous, subtle oscillation for holding an already-popped-in element
// alive during a long static stretch, the channel's own "Never Let a Frame
// Sit" rule (no static frame longer than 2s) needs a secondary motion cue
// on any beat that runs longer than that, added 2026-08-10 after a real
// episode held payoff cards fully static for 3-5s+ at a stretch. Returns a
// multiplier centered on 1 (e.g. 0.9-1.1 at amplitude 0.1), apply it to
// scale/glow/opacity on top of whatever pop-in animation already ran.
// Deliberately NOT frame-delay-gated (unlike springIn) so it runs for the
// element's entire remaining lifetime, not just its entrance.
export const breathe = (frame: number, period = 45, amplitude = 0.08) =>
  1 + amplitude * Math.sin((2 * Math.PI * frame) / period);

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
