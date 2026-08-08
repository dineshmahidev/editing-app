import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import type { MediaAsset, MediaKind, MediaSourceOptions } from '@/types/media';
import { generateId } from '@/utils/file';
import { formatBytes, formatDuration, formatResolution } from '@/utils/formatting';

type PermissionState = 'granted' | 'denied' | 'limited' | 'undetermined';

async function ensureLibraryPermission(): Promise<PermissionState> {
  const current = await MediaLibrary.getPermissionsAsync();
  if (current.status === 'undetermined') {
    const req = await MediaLibrary.requestPermissionsAsync();
    return req.granted ? 'granted' : 'denied';
  }
  return current.granted ? 'granted' : 'denied';
}

function pickerMediaType(kind: MediaKind): ImagePicker.MediaType | undefined {
  if (kind === 'video') return 'videos';
  if (kind === 'image') return 'images';
  return undefined; // audio handled separately below
}

function toKind(pickerType: ImagePicker.ImagePickerAsset['type']): MediaKind {
  if (pickerType === 'image') return 'image';
  return 'video';
}

export async function pickMedia(options: MediaSourceOptions): Promise<MediaAsset[]> {
  if (options.mediaTypes.includes('audio')) {
    Alert.alert('Audio import', 'Pick local audio from Assets > Music in the current build.');
    return [];
  }

  const permission = await ensureLibraryPermission();
  if (permission !== 'granted') {
    Alert.alert(
      'Media access needed',
      'Vixel Edit needs photos/video access to import media. Enable it in system Settings to continue.',
      [{ text: 'OK' }],
    );
    return [];
  }

  const chosenTypes = options.mediaTypes
    .map(pickerMediaType)
    .filter((t): t is ImagePicker.MediaType => t != null);

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: chosenTypes,
    allowsMultipleSelection: options.allowsMultipleSelection,
    videoMaxDuration: options.videoMaxDuration ?? 600,
    quality: 1,
  });

  if (result.canceled || result.assets.length === 0) return [];

  return result.assets.map((asset) => ({
    id: generateId('media'),
    kind: toKind(asset.type),
    uri: asset.uri,
    name: asset.fileName ?? asset.uri.split('/').pop() ?? 'Media',
    mimeType: asset.mimeType,
    durationMs: asset.duration && asset.duration > 0 ? Math.round(asset.duration) : undefined,
    width: asset.width,
    height: asset.height,
    sizeBytes: asset.fileSize ?? undefined,
    // No thumbnail from the picker; editors render a poster from the URI directly.
    thumbnailUri: undefined,
  }));
}

export function describeAsset(asset: MediaAsset): string {
  const parts: string[] = [];
  if (asset.durationMs != null) parts.push(formatDuration(asset.durationMs));
  if (asset.width && asset.height) parts.push(formatResolution(asset.width, asset.height));
  if (asset.sizeBytes != null) parts.push(formatBytes(asset.sizeBytes));
  return parts.join(' · ');
}

/** UI-compatible snapshot of picker metadata for picker cards. */
export function buildPickedInfo(asset: MediaAsset): {
  durationText: string;
  resolutionText: string;
  sizeText: string;
} {
  return {
    durationText: asset.durationMs != null ? formatDuration(asset.durationMs) : '--',
    resolutionText: asset.width && asset.height ? formatResolution(asset.width, asset.height) : '--',
    sizeText: asset.sizeBytes != null ? formatBytes(asset.sizeBytes) : '--',
  };
}