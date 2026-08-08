export type MediaKind = 'video' | 'image' | 'audio';

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  uri: string;
  name: string;
  mimeType?: string;
  durationMs?: number;
  width?: number;
  height?: number;
  sizeBytes?: number;
  thumbnailUri?: string;
}

export type MediaFile = MediaAsset;

export interface PickedMediaInfo {
  asset: MediaAsset;
  durationText: string;
  resolutionText: string;
  sizeText: string;
}

export interface MediaSourceOptions {
  mediaTypes: MediaKind[];
  allowsMultipleSelection: boolean;
  videoMaxDuration?: number;
}

export type ImportMode = 'create' | 'trim' | 'compress' | 'merge' | 'gif' | 'audio' | 'mute' | 'resize';