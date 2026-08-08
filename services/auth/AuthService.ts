import { apiRequest, setApiToken } from '@/services/api/client';
import type { AuthResponse, LoginCredentials, RegisterPayload, UserProfile } from '@/types/auth';

export const AuthService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: payload,
    });
    setApiToken(data.token);
    return data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    setApiToken(data.token);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } catch {
      // still clear locally
    } finally {
      setApiToken(null);
    }
  },

  async me(): Promise<UserProfile> {
    return apiRequest<UserProfile>('/auth/me', { method: 'GET' });
  },
};