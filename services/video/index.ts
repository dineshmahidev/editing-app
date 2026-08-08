import type {
  VideoProcessingService,
  VideoOperation,
  AddAudioOptions,
  CompressOptions,
  CropOptions,
  ExportParams,
  ExtractAudioOptions,
  MergeOptions,
  MuteOptions,
  ProcessingProgress,
  ResizeOptions,
  RotateOptions,
  SpeedOptions,
  SplitOptions,
  TrimOptions,
} from './types';

/**
 * Default/no-op implementation of VideoProcessingService.
 *
 * Every method reports cleanly that the native layer is not yet installed.
 * Phase 5 (Export agent) replaces this with a real FFmpeg-backed engine.
 * UI detects unsupported ops via `support` and degrades graciously per
 * blueprint sections 16/28/30 (no fake functionality, isolated behind service).
 */
export class NoopVideoProcessingService implements VideoProcessingService {
  capabilities = {
    trim: false,
    split: false,
    merge: false,
    crop: false,
    resize: false,
    rotate: false,
    speed: false,
    mute: false,
    addAudio: false,
    extractAudio: false,
    compress: false,
    export: false,
  } satisfies Record<VideoOperation, boolean>;

  private notReady(op: string): never {
    throw new Error(
      `${op}() is not available yet. Vixel Edit ships with the service interface until the native FFmpeg engine is wired in Phase 5.`,
    );
  }

  trimVideo(_o: TrimOptions, _p?: (p: ProcessingProgress) => void): Promise<string> {
    return Promise.reject(this.notReady('trimVideo'));
  }
  splitVideo(_o: SplitOptions): Promise<string[]> {
    return Promise.reject(this.notReady('splitVideo'));
  }
  mergeVideos(_o: MergeOptions, _p?: (p: ProcessingProgress) => void): Promise<string> {
    return Promise.reject(this.notReady('mergeVideos'));
  }
  cropVideo(_o: CropOptions): Promise<string> {
    return Promise.reject(this.notReady('cropVideo'));
  }
  resizeVideo(_o: ResizeOptions): Promise<string> {
    return Promise.reject(this.notReady('resizeVideo'));
  }
  rotateVideo(_o: RotateOptions): Promise<string> {
    return Promise.reject(this.notReady('rotateVideo'));
  }
  changeSpeed(_o: SpeedOptions): Promise<string> {
    return Promise.reject(this.notReady('changeSpeed'));
  }
  muteVideo(_o: MuteOptions): Promise<string> {
    return Promise.reject(this.notReady('muteVideo'));
  }
  addAudio(_o: AddAudioOptions, _p?: (p: ProcessingProgress) => void): Promise<string> {
    return Promise.reject(this.notReady('addAudio'));
  }
  extractAudio(_o: ExtractAudioOptions): Promise<string> {
    return Promise.reject(this.notReady('extractAudio'));
  }
  compressVideo(_o: CompressOptions, _p?: (p: ProcessingProgress) => void): Promise<string> {
    return Promise.reject(this.notReady('compressVideo'));
  }
  exportVideo(_o: ExportParams, _p?: (p: ProcessingProgress) => void): Promise<string> {
    return Promise.reject(this.notReady('export'));
  }
}

export function isProcessingSupported(
  service: VideoProcessingService,
  op: VideoOperation,
): boolean {
  return service.capabilities[op];
}

export function getProcessingService(): VideoProcessingService {
  return new NoopVideoProcessingService();
}