import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
  Scissors,
  Split,
  Gauge,
  Crop,
  RotateCw,
  Volume2,
  Music2,
  Type,
  Sticker,
  Clapperboard,
  Image as ImageIcon,
  Palette,
  Captions,
  MoveHorizontal,
  Square as SquareIcon,
  LayoutGrid,
  ArrowLeft,
  Undo2,
  Redo2,
  Download,
} from 'lucide-react-native';
import type { AppIcon } from '@/types/icons';
import { Screen } from '@/components/ui';
import { IconButton } from '@/components/ui';
import { Button } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/config/theme';
import { useEditorStore } from '@/store/editor/projectStore';
import { loadProject } from '@/services/storage/projects';
import { timelineDurationMs, clipRenderables } from '@/utils/video';
import { formatDuration } from '@/utils/formatting';

type ToolId =
  | 'trim' | 'split' | 'speed' | 'crop' | 'rotate' | 'volume'
  | 'audio' | 'text' | 'sticker' | 'gif' | 'image' | 'filter'
  | 'caption' | 'transition' | 'canvas' | 'background';

const tools: { id: ToolId; label: string; icon: AppIcon }[] = [
  { id: 'trim', label: 'Trim', icon: Scissors },
  { id: 'split', label: 'Split', icon: Split },
  { id: 'speed', label: 'Speed', icon: Gauge },
  { id: 'crop', label: 'Crop', icon: Crop },
  { id: 'rotate', label: 'Rotate', icon: RotateCw },
  { id: 'volume', label: 'Volume', icon: Volume2 },
  { id: 'audio', label: 'Audio', icon: Music2 },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'sticker', label: 'Sticker', icon: Sticker },
  { id: 'gif', label: 'GIF', icon: Clapperboard },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'filter', label: 'Filter', icon: Palette },
  { id: 'caption', label: 'Caption', icon: Captions },
  { id: 'transition', label: 'Transition', icon: MoveHorizontal },
  { id: 'canvas', label: 'Canvas', icon: SquareIcon },
  { id: 'background', label: 'Background', icon: LayoutGrid },
];

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const project = useEditorStore((s) => s.project);
  const setProject = useEditorStore((s) => s.setProject);
  const [loading, setLoading] = useState(!project);
  const [notFound, setNotFound] = useState(false);

  const firstClip = useMemo(
    () => (project ? clipRenderables(project.timeline)[0] : null),
    [project],
  );
  const durationMs = useMemo(
    () => (project ? timelineDurationMs(project.timeline) : 0),
    [project],
  );
  const previewUri = firstClip
    ? project?.mediaFiles.find((m) => m.id === firstClip.clip.mediaFileId)?.uri
    : undefined;

  const player = useVideoPlayer(previewUri ? { uri: previewUri } : null, (p) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!id) return;
      const loaded = await loadProject(id);
      if (cancelled) return;
      if (!loaded) {
        setNotFound(true);
      } else {
        setProject(loaded);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, setProject]);

  if (notFound) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.missing}>Project not found.</Text>
          <Button title="Go back" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  if (loading || !project) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </Screen>
    );
  }

  const onTool = (toolId: ToolId) => {
    Alert.alert(
      toolLabel(toolId),
      `${toolLabel(toolId)} arrives in the next build phase. The toolbar and timeline are wired up; the processing engine follows.`,
    );
  };

  return (
    <Screen padded={false}>
      <View style={styles.topBar}>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} />
        <Text style={styles.projectName} numberOfLines={1}>
          {project.name}
        </Text>
        <IconButton icon={Undo2} />
        <IconButton icon={Redo2} />
        <IconButton
          icon={Download}
          onPress={() => router.push({ pathname: `/export/${project.id}` } as any)}
          color={colors.primary}
        />
      </View>

      <View style={styles.preview}>
        {previewUri ? (
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            nativeControls={false}
          />
        ) : (
          <View style={styles.previewEmpty}>
            <Text style={styles.previewEmptyText}>No media yet. Tap a tool below to add clips.</Text>
          </View>
        )}
        <View style={styles.durationPill}>
          <Text style={styles.durationText}>{formatDuration(durationMs)}</Text>
        </View>
      </View>

      <View style={styles.timelineArea}>
        <TimelinePlaceholder clipCount={project.timeline.clips.length} />
      </View>

      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarInner}>
          {tools.map((tool) => (
            <ToolButton key={tool.id} tool={tool} onPress={() => onTool(tool.id)} />
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

function toolLabel(id: ToolId): string {
  const found = tools.find((t) => t.id === id);
  return found?.label ?? id;
}

function ToolButton({ tool, onPress }: { tool: (typeof tools)[number]; onPress: () => void }) {
  const Icon = tool.icon;
  return (
    <View style={styles.toolButton}>
      <IconButton icon={Icon} onPress={onPress} />
      <Text style={styles.toolLabel}>{tool.label}</Text>
    </View>
  );
}

function TimelinePlaceholder({ clipCount }: { clipCount: number }) {
  return (
    <View style={styles.timeline}>
      <View style={styles.playhead} />
      <Text style={styles.timelineText}>
        {clipCount === 0
          ? 'Add media to start editing'
          : `${clipCount} clip${clipCount === 1 ? '' : 's'} on the timeline (full editor in Phase 2)`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
  },
  projectName: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    height: 260,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewEmpty: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  previewEmptyText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
  },
  durationPill: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.overlay,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  durationText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  timelineArea: {
    flex: 1,
    minHeight: 90,
    justifyContent: 'center',
  },
  timeline: {
    height: 90,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playhead: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.primary,
  },
  timelineText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  toolbar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  toolbarInner: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  toolButton: {
    alignItems: 'center',
    gap: 4,
    width: 52,
  },
  toolLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    color: colors.text,
    fontSize: 16,
  },
});