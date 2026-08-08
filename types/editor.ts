export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | 'original';

export type ToolId =
  | 'trim'
  | 'split'
  | 'speed'
  | 'crop'
  | 'rotate'
  | 'volume'
  | 'audio'
  | 'text'
  | 'sticker'
  | 'gif'
  | 'image'
  | 'filter'
  | 'caption'
  | 'transition'
  | 'canvas'
  | 'background';

export type FilterId =
  | 'none'
  | 'bright'
  | 'warm'
  | 'cool'
  | 'vintage'
  | 'cinematic'
  | 'bw'
  | 'cartoon'
  | 'soft'
  | 'highcontrast';

export interface Position {
  x: number;
  y: number;
}

export interface Transform {
  position: Position;
  scale: number;
  rotation: number;
  opacity: number;
}

export type TextPreset =
  | 'meme'
  | 'subtitle'
  | 'title'
  | 'neon'
  | 'minimal'
  | 'cartoon'
  | 'youtube'
  | 'reel';

export interface TextLayer extends Transform {
  id: string;
  text: string;
  fontSize: number;
  fontFamily?: string;
  bold: boolean;
  italic: boolean;
  color: string;
  backgroundColor?: string;
  outlineColor?: string;
  outlineWidth: number;
  shadow: boolean;
  alignment: 'left' | 'center' | 'right';
  preset?: TextPreset;
}

export interface StickerLayer extends Transform {
  id: string;
  uri: string;
  width: number;
  height: number;
  durationMs?: number;
  attribution?: string;
  type: 'gif' | 'sticker' | 'image' | 'emoji';
}

export interface Caption {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  positionY: 'top' | 'bottom' | 'middle';
}

export interface Clip {
  id: string;
  mediaFileId: string;
  startMs: number;
  endMs: number;
  trimStartMs: number;
  trimEndMs: number;
  speed: number;
  volume: number;
  muted: boolean;
  rotation: number;
  filter?: FilterId;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AudioTrack {
  id: string;
  uri: string;
  name: string;
  startMs: number;
  trimStartMs: number;
  trimEndMs: number;
  volume: number;
  fadeInMs: number;
  fadeOutMs: number;
}

export interface TimelineModel {
  clips: Clip[];
  audioTracks: AudioTrack[];
  playheadMs: number;
  zoom: number;
}

export interface LayerModel {
  textLayers: TextLayer[];
  stickerLayers: StickerLayer[];
  captions: Caption[];
}

export interface ExportPreset {
  width: number;
  height: number;
  fps: number;
  bitrate?: string;
}

export interface CanvasModel {
  aspectRatio: AspectRatio;
  backgroundColor: string;
  fit: 'fit' | 'crop';
  width: number;
  height: number;
}