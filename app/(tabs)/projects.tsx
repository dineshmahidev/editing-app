import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { FolderOpen, Trash2, Image as ImageIcon } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/config/theme';
import {
  listProjectSummaries,
  deleteProject,
} from '@/services/storage/projects';
import type { ProjectSummary } from '@/types/project';
import { formatRelativeTime } from '@/utils/formatting';

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await listProjectSummaries();
    setProjects(list);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const onOpen = (id: string) => {
    router.push({ pathname: `/editor/${id}` } as any);
  };

  const onDelete = async (id: string) => {
    await deleteProject(id);
    await refresh();
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={projects}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.heading}>Projects</Text>}
        ListEmptyComponent={
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            message="Projects you create or edit are saved here, locally on your device. Cloud sync arrives with login."
          />
        }
        renderItem={({ item }) => (
          <ProjectCard project={item} onOpen={() => onOpen(item.id)} onDelete={() => onDelete(item.id)} />
        )}
      />
    </Screen>
  );
}

function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: ProjectSummary;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.thumb}>
        {project.thumbnailUri ? (
          <Image source={{ uri: project.thumbnailUri }} style={styles.thumbImg} />
        ) : (
          <ImageIcon size={22} color={colors.textSecondary} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {project.name}
        </Text>
        <Text style={styles.meta}>
          Edited {formatRelativeTime(project.updatedAt)} · {project.canvas.aspectRatio}
        </Text>
      </View>
      <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteBtn}>
        <Trash2 size={18} color={colors.danger} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  heading: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    padding: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
});