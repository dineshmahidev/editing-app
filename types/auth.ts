export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  avatarUrl?: string;
  subscription?: {
    status: 'free' | 'premium' | 'none' | 'expired';
    expiresAt?: string;
  };
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginCredentials {
  name?: string;
}

export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt: number;
  thumbnailUri?: string;
}