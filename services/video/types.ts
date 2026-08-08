/**
 * VideoProcessingService - the single abstraction for all native/FFmpeg video work.
 *
 * RULE (blueprint section 16/32): UI components must NEVER call FFmpeg directly.
 * Everything routes through this service so the native layer can be swapped
 * (ffmpeg-kit / Media3 transcoder / etc.) without touching screens.
 *
 * The initial implementation is a capability-tracked stub installed behind the
 * interface. Each method reports NOT_IMPLEMENTED cleanly so Phase 5 (Export
 * agent) can swap in a real, audited backend without UI changes.
 */

export type VideoOperation =
  | 'trim'
  | 'split'
  | 'merge'
  | 'crop'
  | 'resize'
  | 'rotate'
  | 'speed'
  | 'mute'
  | 'addAudio'
  | 'extractAudio'
  | 'compress'
  | 'export';

export interface TrimOptions {
  inputUri: string;
  startMs: number;
  endMs: number;
  outputUri: string;
}

export interface SplitOptions {
  inputUri: string;
  atMs: number;
  outputAloneUri?: string;
}

export interface MergeOptions {
  inputUris: string[];
  outputUri: string;
}

export interface CropOptions {
  inputUri: string;
  x: number;
  y: number;
  width: number;
  height: number;
  outputUri: string;
}

export interface ResizeOptions {
  inputUri: string;
  width: number;
  height: number;
  outputUri: string;
}

export interface RotateOptions {
  inputUri: string;
  degrees: 90 | 180 | 270;
  outputUri: string;
}

export interface SpeedOptions {
  inputUri: string;
  speed: number; // 0.5x .. 4x
  outputUri: string;
}

export interface MuteOptions {
  inputUri: string;
  outputUri: string;
}

export interface AddAudioOptions {
  videoUri: string;
  audioUri: string;
  volume?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
  outputUri: string;
}

export interface ExtractAudioOptions {
  inputUri: string;
  outputUri: string;
}

export interface CompressOptions {
  inputUri: string;
  outputUri: string;
  quality: 'low' | 'medium' | 'high';
  width?: number;
  height?: number;
  fps?: number;
}

export interface ExportParams {
  inputUris: string[];
  outputUri: string;
  width: number;
  height: number;
  fps: number;
  bitrate?: string;
  applyLayers?: boolean; // resolved by caller then handed to encoder
}

export interface ProcessingProgress {
  progress: number;
  status: string;
}

export interface VideoProcessingService {
  /** Features this build supports. Lets UI safely hide unsupported tools. */
  readonly capabilities: { readonly [K in VideoOperation]: boolean };
  trimVideo(options: TrimOptions, onProgress?: (p: ProcessingProgress) => void): Promise<string>;
  splitVideo(options: SplitOptions): Promise<string[]>;
  mergeVideos(options: MergeOptions, onProgress?: (p: ProcessingProgress) => void): Promise<string>;
  cropVideo(options: CropOptions): Promise<string>;
  resizeVideo(options: ResizeOptions): Promise<string>;
  rotateVideo(options: RotateOptions): Promise<string>;
  changeSpeed(options: SpeedOptions): Promise<string>;
  muteVideo(options: MuteOptions): Promise<string>;
  addAudio(options: AddAudioOptions, onProgress?: (p: ProcessingProgress) => void): Promise<string>;
  extractAudio(options: ExtractAudioOptions): Promise<string>;
  compressVideo(options: CompressOptions, onProgress?: (p: ProcessingProgress) => void): Promise<string>;
  exportVideo(options: ExportParams, onProgress?: (p: ProcessingProgress) => void): Promise<string>;
}