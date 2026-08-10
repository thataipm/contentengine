import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Watermark, ProgressBar } from "./components/Chrome";

export type ShotComponentProps = {
  // Local shot duration, in frames. Threaded in so a shot's own <Audio>/
  // <Video> can fade its volume in/out at the crossfade edges (see
  // edgeFadeVolume in motion.ts) — components that don't need it can ignore
  // it, existing zero-prop shot components remain valid ShotDef.component
  // values because of TS's normal excess/fewer-parameter function compat.
  durationInFrames: number;
};

export type ShotDef = {
  durationInFrames: number;
  component: React.ComponentType<ShotComponentProps>;
};

type EpisodeProps = {
  shots: ShotDef[];
  accentColor: string;
  // Watermark handle text and color, e.g. "@yourhandle". No default on
  // purpose (there's no channel identity baked into this reset engine) —
  // every caller must decide this explicitly.
  watermarkHandle: string;
  watermarkColor?: string;
  // Crossfade length between shots, in frames at the episode's fps.
  transitionFrames?: number;
};

// Bug found 2026-08-04: at 15 frames (0.5s), the crossfade overlapped real
// speech at both ends, not silence. Each shot's VO/avatar audio keeps
// playing in full during the TransitionSeries overlap window (only the
// picture fades, not the audio), so two different lines of dialogue played
// simultaneously at every cut, garbling both. Dropping to 5 frames narrowed
// the overlap window but didn't fix the root cause, both tracks still play
// at FULL volume during those 5 frames, so it still sounded rushed/garbled
// at some cuts (reported again after the first fix). The actual fix is
// `edgeFadeVolume()` in motion.ts: every shot with its own <Audio>/<Video>
// ramps its volume 0->1 / 1->0 across these `DEFAULT_TRANSITION_FRAMES`, so
// during the overlap one track is fading out while the other fades in
// instead of both blaring at once. Keep this at 5 frames (~0.17s), the cut
// audio files only carry ~0.03-0.05s of natural padding at each boundary,
// so a longer fade window would still eat into real speech on either side.
export const DEFAULT_TRANSITION_FRAMES = 5;

// Total on-screen duration once transitions are accounted for: each
// transition makes its two neighboring shots overlap by transitionFrames,
// so the episode is shorter than the raw sum of shot durations. Use this
// wherever an Episode's calculateMetadata needs durationInFrames, summing
// shot durations directly will overshoot and render blank at the tail.
export const totalEpisodeFrames = (
  shots: ShotDef[],
  transitionFrames = DEFAULT_TRANSITION_FRAMES,
) => {
  const raw = shots.reduce((sum, s) => sum + s.durationInFrames, 0);
  return raw - transitionFrames * Math.max(shots.length - 1, 0);
};

// Episode-level orchestrator, the Remotion equivalent of the old pipeline's
// render_episode.py. Sequences shots via <TransitionSeries> (a drop-in swap
// for plain <Series> that adds a crossfade between each pair of shots,
// 2026-08-04 addition, requested to smooth the avatar-to-animation cut).
// <TransitionSeries.Transition> handles the frame-offset math for the
// overlap internally, same as <Series> did for hard cuts, still no manual
// OFFSET/EPISODE_TOTAL bookkeeping needed.
//
// Watermark and ProgressBar are drawn ONCE here, outside the
// <TransitionSeries>, not per-shot. This is the actual fix for cross-shot
// progress-bar continuity: useCurrentFrame() inside a
// <TransitionSeries.Sequence> is re-based to be LOCAL to that shot (starts
// at 0 every shot), so a progress bar rendered inside a shot component has
// no way to know its true position in the episode without being told.
// Rendered here instead, ProgressBar sees this component's own
// useCurrentFrame(), which IS the true global frame across the whole
// episode, for free, no offset prop threading required.
export const Episode: React.FC<EpisodeProps> = ({
  shots,
  accentColor,
  watermarkHandle,
  watermarkColor = "#FFFFFF",
  transitionFrames = DEFAULT_TRANSITION_FRAMES,
}) => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {shots.map((shot, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={shot.durationInFrames}>
              <shot.component durationInFrames={shot.durationInFrames} />
            </TransitionSeries.Sequence>
            {i < shots.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: transitionFrames })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Watermark handle={watermarkHandle} color={watermarkColor} opacity={0.35} />
      <ProgressBar color={accentColor} track="rgba(255,255,255,0.08)" />
    </AbsoluteFill>
  );
};
