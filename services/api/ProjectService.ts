import { apiRequest } from '@/services/api/client';
import type { ProjectMeta } from '@/types/auth';

export const ProjectService = {
  /** Push only lightweight metadata (never media bytes) for cloud sync. */
  async syncProject(meta: ProjectMeta): Promise<void> {
    await apiRequest<void>('/projects/sync', {
      method: 'PUT',
      body: meta,
    });
  },

  async listProjects(): Promise<ProjectMeta[]> {
    return apiRequest<ProjectMeta[]>('/projects', { method: 'GET' });
  },

  async deleteRemote(id: string): Promise<void> {
    await apiRequest<void>(`/projects/${id}`, { method: 'DELETE' });
  },
};