import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Download } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { IconButton } from '@/components/ui';
import { colors, spacing, typography } from '@/config/theme';
import { useEditorStore } from '@/store/editor/projectStore';
import { loadProject } from '@/services/storage/projects';
import { getProcessingService } from '@/services/video';
import { timelineDurationMs } from '@/utils/video';

export default function ExportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const project = useEditorStore((s) => s.project);
  const setProject = useEditorStore((s) => s.setProject);
  const service = getProcessingService();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!id) return;
      const loaded = await loadProject(id);
      if (cancelled) return;
      if (!loaded) setNotFound(true);
      else setProject(loaded);
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

  const canExport = service.capabilities.export;
  const durationMs = timelineDurationMs(project.timeline);
  const exportVideo = project.exportSettings.video ?? '1080p';
  const exportFps = project.exportSettings.fps ?? 30;
  const audioEnabled = project.exportSettings.audioEnabled ?? true;

  const onExport = () => {
    if (!canExport) {
      Alert.alert(
        'Export engine pending',
        'The FFmpeg/native export engine is wired as a service but not yet installed (Phase 5). UI works; processing follows in the Export agent build.',
      );
      return;
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.topBar}>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} />
        <Text style={styles.title}>Export</Text>
      </View>

      <View style={styles.preview}>
        <View style={styles.previewEmpty}>
          <Text style={styles.previewEmptyText}>Export preview</Text>
          <Text style={styles.previewHint}>Final video will render here with layers applied</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card
          title="Resolution"
          subtitle={`${project.canvas.width}×${project.canvas.height} · ${exportVideo}`}
        />
        <Card title="Frame rate" subtitle={`${exportFps} FPS`} />
        <Card
          title="Estimated size"
          subtitle={`≈ ${formatBytes(estimateDurationMB(durationMs, exportVideo))}`}
        />
        <Card title="Audio" subtitle={audioEnabled ? 'Enabled' : 'Muted'} />

        <Button
          title={canExport ? 'Export to gallery' : 'Export (Phase 5 pending)'}
          onPress={onExport}
          icon={<Download size={18} color="#fff" />}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.notes}>
          After export you will be able to Save to Gallery, Share, start a new project or keep editing.
        </Text>
      </ScrollView>
    </Screen>
  );
}

function estimateDurationMB(durationMs: number, preset: string): number {
  // rough conservative estimate: ~2 Mbps video peak for 1080p/720p preview
  const seconds = durationMs / 1000;
  const mbps = preset === '1080p' ? 2 : 1.2;
  return Math.round((seconds * mbps * 1024) / 8);
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '--';
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
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
  preview: {
    height: 240,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmpty: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  previewEmptyText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  previewHint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  notes: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm,
    textAlign: 'center',
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