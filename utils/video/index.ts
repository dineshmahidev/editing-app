import type { Clip, TimelineModel } from '@/types/editor';

export interface ClipRenderIntent {
  clip: Clip;
  /** Total rendered length of the clip after speed applied (ms). */
  renderedMs: number;
  /** In-range length (ms) of the media segment used. */
  sourceMs: number;
  /** Playback speed. */
  speed: number;
}

export function getClipSourceMs(clip: Clip): number {
  return Math.max(0, clip.trimEndMs - clip.trimStartMs);
}

export function getClipRenderedMs(clip: Clip): number {
  const source = getClipSourceMs(clip);
  return source / Math.max(0.1, clip.speed);
}

export function clipRenderables(timeline: TimelineModel): ClipRenderIntent[] {
  return timeline.clips.map((clip) => ({
    clip,
    renderedMs: getClipRenderedMs(clip),
    sourceMs: getClipSourceMs(clip),
    speed: clip.speed,
  }));
}

export function timelineDurationMs(timeline: TimelineModel): number {
  const own = clipRenderables(timeline).reduce((sum, r) => sum + r.renderedMs, 0);
  const audioEnd = timeline.audioTracks.reduce((max, t) => {
    const end = t.startMs + (t.trimEndMs - t.trimStartMs);
    return Math.max(max, end);
  }, 0);
  return Math.max(own, audioEnd, 1);
}

/** Convert a rendered timeline position back to a clip-local source time. */
export function renderedToSourceMs(clip: Clip, renderedOffsetMs: number): number {
  return clip.trimStartMs + renderedOffsetMs * Math.max(0.1, clip.speed);
}

/** Split a clip at a rendered offset (0..renderedMs). Returns two new clips. */
export function splitClip(clip: Clip, renderedOffsetMs: number): Clip[] {
  const split = clampOffset(clip, renderedOffsetMs);
  if (split <= 0) return [clip];
  const sourceSplit = clip.trimStartMs + split * Math.max(0.1, clip.speed);
  const first: Clip = { ...clip, id: `${clip.id}_a`, trimEndMs: sourceSplit };
  const second: Clip = { ...clip, id: `${clip.id}_b`, trimStartMs: sourceSplit };
  return [first, second];
}

function clampOffset(clip: Clip, offsetMs: number): number {
  const total = getClipRenderedMs(clip);
  return Math.min(Math.max(0, offsetMs), total);
}

export function clipProgress(clip: Clip, playheadMs: number, clipStartMs: number): number {
  return playheadMs >= clipStartMs && playheadMs <= clipStartMs + getClipRenderedMs(clip)
    ? (playheadMs - clipStartMs) / getClipRenderedMs(clip)
    : 0;
}