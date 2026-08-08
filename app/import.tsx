import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Film, Image as ImageIcon, Music, Upload } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { IconButton } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/config/theme';
import { pickMedia, describeAsset } from '@/services/media/picker';
import type { MediaAsset } from '@/types/media';
import type { Project } from '@/types/project';
import { ASPECT_RATIOS, DEFAULT_ASPECT_RATIO } from '@/config/constants';
import { useEditorStore } from '@/store/editor/projectStore';

export default function ImportScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const router = useRouter();
  const project = useEditorStore((s) => s.project);
  const persistProject = useEditorStore((s) => s.persistProject);

  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [aspect, setAspect] = useState<string>(
    mode === 'reel' ? '9:16' : DEFAULT_ASPECT_RATIO,
  );

  const isReel = mode === 'reel';
  const allowMultiple = !isReel;

  const pick = useCallback(async () => {
    const picked = await pickMedia({
      mediaTypes: isReel ? ['video'] : ['video', 'image'],
      allowsMultipleSelection: allowMultiple,
    });
    if (picked.length > 0) setMedia((prev) => [...prev, ...picked]);
  }, [isReel, allowMultiple]);

  const startEditing = () => {
    if (media.length === 0) {
      Alert.alert('No media', 'Pick at least one video or image to start.');
      return;
    }

    const now = Date.now();
    const base: Project = project ?? blankProject(now, aspect);
    const target: Project = {
      ...base,
      id: base.id ?? `proj_${now.toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name: base.name ?? 'Untitled Project',
      mediaFiles: [...base.mediaFiles, ...media],
      canvas: {
        ...base.canvas,
        aspectRatio: aspect as Project['canvas']['aspectRatio'],
        fit: 'crop',
      },
      updatedAt: now,
      timeline: {
        ...base.timeline,
        clips: [
          ...base.timeline.clips,
          ...media.map((asset) => {
            const sourceMs = asset.durationMs ?? 5000;
            return {
              id: `clip_${asset.id}`,
              mediaFileId: asset.id,
              startMs: 0,
              endMs: sourceMs,
              trimStartMs: 0,
              trimEndMs: sourceMs,
              speed: 1,
              volume: 1,
              muted: false,
              rotation: 0,
            };
          }),
        ],
      },
    };

    persistProject(target);
    router.replace({ pathname: `/editor/${target.id}` } as any);
  };

  return (
    <Screen padded={false}>
      <View style={styles.topBar}>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} />
        <Text style={styles.title}>{isReel ? 'New Reel' : 'Import Media'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Button
            title={media.length === 0 ? 'Pick media from library' : 'Add more'}
            onPress={() => void pick()}
            icon={<Upload size={18} color="#fff" />}
          />
          {isReel && (
            <Text style={styles.hint}>Reels default to 9:16. Video fits or crops to fill the canvas.</Text>
          )}
        </Card>

        {media.map((asset) => (
          <Card key={asset.id} compact style={styles.mediaCard}>
            <View style={styles.thumb}>
              {asset.thumbnailUri ? (
                <Image source={{ uri: asset.thumbnailUri }} style={styles.thumbImg} />
              ) : asset.kind === 'image' ? (
                <Image source={{ uri: asset.uri }} style={styles.thumbImg} />
              ) : (
                <Film size={20} color={colors.textSecondary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mediaName} numberOfLines={1}>
                {asset.name}
              </Text>
              <Text style={styles.mediaMeta}>{describeAsset(asset)}</Text>
            </View>
          </Card>
        ))}

        {media.length > 0 && (
          <Card title="Canvas">
            <Text style={styles.hint}>Aspect ratio</Text>
            <View style={styles.aspectRow}>
              {ASPECT_RATIOS.map((ratio) => (
                <Chip
                  key={ratio}
                  label={ratio}
                  active={aspect === ratio}
                  onPress={() => setAspect(ratio)}
                />
              ))}
            </View>
            <Button
              title={isReel ? 'Start Reel' : 'Start editing'}
              onPress={startEditing}
              style={{ marginTop: spacing.sm }}
            />
          </Card>
        )}

        {media.length === 0 && (
          <Text style={styles.emptyNote}>
            After picking media you will see its metadata and an aspect ratio picker, then start editing.
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
}

function blankProject(now: number, aspect: string): Project {
  return {
    id: '',
    name: '',
    createdAt: now,
    updatedAt: now,
    mediaFiles: [],
    timeline: { clips: [], audioTracks: [], playheadMs: 0, zoom: 1 },
    layers: { textLayers: [], stickerLayers: [], captions: [] },
    canvas: {
      aspectRatio: aspect as Project['canvas']['aspectRatio'],
      backgroundColor: '#000000',
      fit: 'crop',
      width: 1080,
      height: 1920,
    },
    exportSettings: { video: '1080p', fps: 30, audioEnabled: true },
  };
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function KindIcon({ kind }: { kind: string }) {
  if (kind === 'video') return <Film size={20} color={colors.textSecondary} />;
  if (kind === 'audio') return <Music size={20} color={colors.textSecondary} />;
  return <ImageIcon size={20} color={colors.textSecondary} />;
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  mediaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  mediaMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  aspectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: colors.white,
  },
  emptyNote: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
});