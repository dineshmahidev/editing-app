import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/config/theme';
import { useEditorStore } from '@/store/editor/projectStore';

export default function NewProjectScreen() {
  const router = useRouter();
  const newProject = useEditorStore((s) => s.newProject);
  const [name, setName] = useState('Untitled Project');

  const create = () => {
    const project = newProject(name.trim() || 'Untitled Project');
    router.replace({ pathname: `/editor/${project.id}` } as any);
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.heading}>New Project</Text>
        <Text style={styles.subheading}>Start with a fresh canvas, then add your media.</Text>

        <Card style={styles.card}>
          <Text style={styles.label}>Project name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Untitled Project"
            placeholderTextColor={colors.textSecondary}
          />
          <Button
            title="Create project"
            onPress={create}
            icon={<Plus size={18} color="#fff" />}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  heading: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  card: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    padding: spacing.md,
    fontSize: 15,
  },
});