export function generateId(prefix = ''): string {
  const random = Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}_${random}` : random;
}

export function makeProjectId(): string {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getFileNameUriTail(uri: string): string {
  return uri.split('/').pop() ?? uri;
}

export function fileExtension(name: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(name);
  return match ? match[1].toLowerCase() : '';
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\s+/g, '_');
}

export function isSupportedVideo(mimeType?: string, uri?: string): boolean {
  if (mimeType) return mimeType.startsWith('video/');
  if (uri) return /\.(mp4|mov|mkv|avi|webm|3gp)$/i.test(uri);
  return false;
}

export function isSupportedImage(mimeType?: string, uri?: string): boolean {
  if (mimeType) return mimeType.startsWith('image/');
  if (uri) return /\.(jpg|jpeg|png|webp|gif|heic)$/i.test(uri);
  return false;
}

export function isSupportedAudio(mimeType?: string, uri?: string): boolean {
  if (mimeType) return mimeType.startsWith('audio/');
  if (uri) return /\.(mp3|m4a|aac|wav|ogg)$/i.test(uri);
  return false;
}