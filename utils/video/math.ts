/**
 * Video math helpers shared by the timeline, editor and export layers.
 * Pure functions - no React, no native deps.
 */

export interface Vec2 {
  x: number;
  y: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function msToSeconds(ms: number): number {
  return ms / 1000;
}

export function secondsToMs(s: number): number {
  return s * 1000;
}

export function fitRect({
  srcWidth,
  srcHeight,
  targetWidth,
  targetHeight,
  fit = 'cover',
}: {
  srcWidth: number;
  srcHeight: number;
  targetWidth: number;
  targetHeight: number;
  fit?: 'cover' | 'contain';
}): { x: number; y: number; width: number; height: number } {
  const srcRatio = srcWidth / srcHeight;
  const targetRatio = targetWidth / targetHeight;

  let width = targetWidth;
  let height = targetHeight;

  if (fit === 'cover') {
    if (srcRatio > targetRatio) {
      width = targetHeight * srcRatio;
      height = targetHeight;
    } else {
      width = targetWidth;
      height = targetWidth / srcRatio;
    }
  } else {
    if (srcRatio > targetRatio) {
      width = targetWidth;
      height = targetWidth / srcRatio;
    } else {
      width = targetHeight * srcRatio;
      height = targetHeight;
    }
  }

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height,
  };
}

export function fpsToSecondsPerFrame(fps: number): number {
  return 1 / fps;
}

export function estimateSizeMassive(width: number, height: number, durationMs: number, fps: number, qualityBitsPerPixel = 0.1): number {
  return (width * height * fps * msToSeconds(durationMs) * qualityBitsPerPixel) / 8;
}

export function frameIndexAtMs(ms: number, fps: number): number {
  return Math.max(0, Math.floor(msToSeconds(ms) * fps));
}

export function applySpeed(msDuration: number, speed: number): number {
  return msDuration / Math.max(0.1, speed);
}