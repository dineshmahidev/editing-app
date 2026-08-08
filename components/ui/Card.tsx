import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/config/theme';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  onPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export function Card({ title, subtitle, icon, onPress, children, style, compact }: CardProps) {
  const inner = (
    <>
      {(title || icon) && (
        <View style={styles.header}>
          {icon}
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      )}
      {children}
    </>
  );

  const cardStyle = [styles.card, compact && styles.compact, style];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [cardStyle, pressed && styles.pressed]}>
        {inner}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compact: {
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});