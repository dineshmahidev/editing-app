import { apiRequest } from '@/services/api/client';
import type { UserProfile } from '@/types/auth';

export const UserService = {
  async getProfile(): Promise<UserProfile> {
    return apiRequest<UserProfile>('/user/me', { method: 'GET' });
  },

  async updateProfile(patch: Partial<Pick<UserProfile, 'name' | 'avatarUrl'>>): Promise<UserProfile> {
    return apiRequest<UserProfile>('/user/me', {
      method: 'PATCH',
      body: patch,
    });
  },

  async subscriptionStatus(): Promise<{ status: string; expiresAt?: string }> {
    return apiRequest<{ status: string; expiresAt?: string }>('/user/subscription', {
      method: 'GET',
    });
  },
};