import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Video,
  RefreshCcw,
  FileVideo,
  ArrowLeftRight,
  Film,
  AudioLines,
  VolumeX,
  Maximize,
  Plus,
  History,
  Scissors,
} from 'lucide-react-native';
import type { AppIcon } from '@/types/icons';
import { Screen } from '@/components/ui';
import { SectionHeader } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/config/theme';
import { listProjectSummaries } from '@/services/storage/projects';
import type { ProjectSummary } from '@/types/project';
import { formatRelativeTime } from '@/utils/formatting';

const createTools: ToolDef[] = [
  { id: 'newVideo', label: 'New Video', icon: Video },
  { id: 'reel', label: 'Video to Reel', icon: RefreshCcw },
  { id: 'meme', label: 'Meme Video', icon: FileVideo },
  { id: 'gif', label: 'GIF Maker', icon: Film },
  { id: 'slideshow', label: 'Photo Slideshow', icon: ArrowLeftRight },
];

const quickTools: ToolDef[] = [
  { id: 'trim', label: 'Trim Video', icon: Scissors },
  { id: 'compress', label: 'Compress Video', icon: FileVideo },
  { id: 'merge', label: 'Merge Videos', icon: ArrowLeftRight },
  { id: 'videoToGif', label: 'Video → GIF', icon: Film },
  { id: 'extractAudio', label: 'Extract Audio', icon: AudioLines },
  { id: 'mute', label: 'Mute Video', icon: VolumeX },
  { id: 'resize', label: 'Resize Video', icon: Maximize },
];

interface ToolDef {
  id: string;
  label: string;
  icon: AppIcon;
}

enum HomeRoute {
  Import = 'import',
  New = 'new',
  Editor = 'editor',
}

export default function HomeScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  useFocusEffect(
    useCallback(() => {
      void listProjectSummaries().then(setProjects);
    }, []),
  );

  const openImport = (mode: string) => {
    router.push({ pathname: `/import`, params: { mode } } as any);
  };

  const openEditor = (id: string) => {
    router.push({ pathname: `/editor/${id}` } as any);
  };

  const newProject = () => {
    router.push(`/new` as any);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Create something quick</Text>

        <View style={styles.createGrid}>
          {createTools.map((tool) => (
            <ToolTile key={tool.id} tool={tool} onPress={() => openImport(tool.id)} />
          ))}
          <ToolTile
            tool={{ id: 'blank', label: 'New Project', icon: Plus }}
            onPress={newProject}
            featured
          />
        </View>

        <SectionHeader title="Quick Tools" />
        <View style={styles.grid2}>
          {quickTools.map((tool) => (
            <ToolTile key={tool.id} tool={tool} onPress={() => openImport(tool.id)} compact />
          ))}
        </View>

        <SectionHeader title="Recent Projects" />
        {projects.length === 0 ? (
          <Text style={styles.emptyText}>No projects yet. Tap a tool above to start.</Text>
        ) : (
          projects.map((p) => (
            <ProjectRow key={p.id} project={p} onPress={() => openEditor(p.id)} />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

function ToolTile({
  tool,
  onPress,
  featured,
  compact,
}: {
  tool: ToolDef;
  onPress: () => void;
  featured?: boolean;
  compact?: boolean;
}) {
  const Icon = tool.icon;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        compact ? styles.tileCompact : styles.tile,
        featured && styles.tileFeatured,
        pressed && styles.pressed,
      ]}
    >
      {Icon ? <Icon size={compact ? 18 : 24} color={featured ? colors.white : colors.primary} /> : null}
      <Text style={[styles.tileLabel, featured && styles.tileLabelFeatured]} numberOfLines={1}>
        {tool.label}
      </Text>
    </Pressable>
  );
}

function ProjectRow({
  project,
  onPress,
}: {
  project: ProjectSummary;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.projectRow, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.projectThumb}>
        {project.thumbnailUri ? (
          <Image source={{ uri: project.thumbnailUri }} style={styles.thumbImg} />
        ) : (
          <History size={20} color={colors.textSecondary} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.projectName} numberOfLines={1}>
          {project.name}
        </Text>
        <Text style={styles.projectMeta}>
          {formatRelativeTime(project.updatedAt)} · {project.canvas.aspectRatio}
        </Text>
      </View>
      <Text style={styles.continueLabel}>Continue</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  greeting: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
    paddingHorizontal: spacing.md,
  },
  createGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tile: {
    width: '31.5%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: spacing.sm,
  },
  tileFeatured: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tileCompact: {
    flex: 1,
    flexDirection: 'row',
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
  },
  tileLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  tileLabelFeatured: {
    color: colors.white,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  projectThumb: {
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
  projectName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  projectMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  continueLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});