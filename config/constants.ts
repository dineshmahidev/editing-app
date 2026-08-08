export const APP_NAME = 'Vixel Edit';

export const GIPHY_API_KEY = process.env.EXPO_PUBLIC_GIPHY_API_KEY ?? '';
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export const HAS_GIPHY = GIPHY_API_KEY.length > 0;
export const HAS_BACKEND = API_URL.length > 0;

export const DEFAULT_ASPECT_RATIO = '9:16';

export const STORAGE_KEYS = {
  projectsIndex: 'vixel.projects.index',
  authToken: 'vixel.auth.token',
  authUser: 'vixel.auth.user',
  settings: 'vixel.settings',
} as const;

export const DB_NAME = 'vixel.db';

export const MAX_WARN_FILE_BYTES = 1.5 * 1024 * 1024 * 1024; // 1.5 GB

export const ASPECT_RATIOS = ['9:16', '16:9', '1:1', '4:5', 'original'] as const;

export const EXPORT_PRESETS: Record<
  '720p' | '1080p',
  { width: number; height: number }
> = {
  '720p': { width: 720, height: 1280 },
  '1080p': { width: 1080, height: 1920 },
};