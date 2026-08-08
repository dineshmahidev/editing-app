import type {
  AudioTrack,
  CanvasModel,
  Clip,
  LayerModel,
  TimelineModel,
} from './editor';
import type { MediaFile } from './media';

export interface ExportSettings {
  video: '720p' | '1080p' | 'original';
  fps: 24 | 25 | 30 | 60;
  quality: 'low' | 'medium' | 'high';
  audioEnabled: boolean;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnailUri?: string;
  mediaFiles: MediaFile[];
  timeline: TimelineModel;
  layers: LayerModel;
  canvas: CanvasModel;
  exportSettings: Partial<ExportSettings>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnailUri?: string;
  canvas: {
    aspectRatio: CanvasModel['aspectRatio'];
    backgroundColor: string;
    fit: CanvasModel['fit'];
    width: number;
    height: number;
  };
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnailUri?: string | null;
  data: Project;
}