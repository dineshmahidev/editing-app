import { create } from 'zustand';
import type { Project } from '@/types/project';
import type { TimelineModel, LayerModel } from '@/types/editor';
import { makeProjectId } from '@/utils/file';
import {
  saveProject,
  loadProject as loadFromStorage,
} from '@/services/storage/projects';

interface EditorState {
  project: Project | null;
  projectId: string | null;
  isSaving: boolean;
  loadProject: (id: string) => Promise<boolean>;
  newProject: (name?: string) => Project;
  persistProject: (project: Project) => void;
  updateTimeline: (updater: (timeline: TimelineModel) => TimelineModel) => void;
  updateLayers: (updater: (layers: LayerModel) => LayerModel) => void;
  setProject: (project: Project) => void;
  renameProject: (name: string) => void;
  save: () => Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(get: () => EditorState): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void get().save();
  }, 800);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  projectId: null,
  isSaving: false,

  loadProject: async (id) => {
    const loaded = await loadFromStorage(id);
    if (!loaded) return false;
    set({ project: loaded, projectId: id });
    return true;
  },

  setProject: (project) => {
    set({ project, projectId: project.id });
  },

  persistProject: (project) => {
    set({ project, projectId: project.id });
    scheduleSave(get);
  },

  newProject: (name) => {
    const project: Project = {
      id: makeProjectId(),
      name: name ?? 'Untitled Project',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mediaFiles: [],
      timeline: { clips: [], audioTracks: [], playheadMs: 0, zoom: 1 },
      layers: { textLayers: [], stickerLayers: [], captions: [] },
      canvas: {
        aspectRatio: '9:16',
        backgroundColor: '#000000',
        fit: 'crop',
        width: 1080,
        height: 1920,
      },
      exportSettings: { video: '1080p', fps: 30, audioEnabled: true },
    };
    set({ project, projectId: project.id });
    return project;
  },

  updateTimeline: (updater) => {
    const { project } = get();
    if (!project) return;
    const timeline = updater(project.timeline);
    const next = {
      ...project,
      timeline,
      updatedAt: Date.now(),
    };
    get().persistProject(next);
  },

  updateLayers: (updater) => {
    const { project } = get();
    if (!project) return;
    const layers = updater(project.layers);
    const next = {
      ...project,
      layers,
      updatedAt: Date.now(),
    };
    get().persistProject(next);
  },

  renameProject: (name) => {
    const { project } = get();
    if (!project) return;
    get().persistProject({ ...project, name, updatedAt: Date.now() });
  },

  save: async () => {
    const { project } = get();
    if (!project) return;
    set({ isSaving: true });
    try {
      const next = { ...project, updatedAt: Date.now() };
      await saveProject(next);
      set({ project: next });
    } catch (error) {
      console.warn('Failed to save project', error);
    } finally {
      set({ isSaving: false });
    }
  },
}));