import { SectionHeader } from '@/components/ui';
import { Screen } from '@/components/ui';
import { Button } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/config/theme';
import { HAS_GIPHY } from '@/config/constants';
import {
  Clapperboard,
  Music2,
  Type,
  Sparkles,
  AudioLines,
} from 'lucide-react-native';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AssetsScreen() {
  const openGiphy = () => {
    if (!HAS_GIPHY) {
      Alert.alert(
        'GIFs not configured',
        'Set EXPO_PUBLIC_GIPHY_API_KEY in your .env file to enable GIF and sticker search.',
      );
      return;
    }
    Alert.alert('GIPHY browse', 'Coming in the overlays phase - search trend GIFs and stickers.');
  };

  const openSfx = () => {
    Alert.alert('Sound Effects', 'Laugh, Pop, Boom and more licensed SFX coming soon.');
  };

  const openMusic = () => {
    Alert.alert('Music Library', 'Pick local audio and add to your timeline.');
  };

  const assets = [
    { id: 'gifs', label: 'GIFs', icon: Sparkles, onPress: openGiphy },
    { id: 'stickers', label: 'Stickers', icon: Sparkles, onPress: openGiphy },
    { id: 'music', label: 'Music', icon: Music2, onPress: openMusic },
    { id: 'sfx', label: 'Sound Effects', icon: AudioLines, onPress: openSfx },
    { id: 'fonts', label: 'Fonts', icon: Type, onPress: () => Alert.alert('Fonts', 'Bundled fonts preview coming soon.') },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Assets</Text>
        <Text style={styles.subheading}>
          GIFs, stickers, music and sound effects for your edits. GIPHY search requires a configured API key.
        </Text>

        <SectionHeader title="Libraries" />
        <View style={styles.grid}>
          {assets.map((a) => {
            const Icon = a.icon;
            return (
              <Pressable
                key={a.id}
                onPress={a.onPress}
                style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
              >
                <View style={styles.tileIconWrap}>
                  <Icon size={26} color={colors.primary} />
                </View>
                <Text style={styles.tileLabel}>{a.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
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
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  grid: {
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
    alignItems: 'center',
    gap: spacing.sm,
  },
  tileIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});