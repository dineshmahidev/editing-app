import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/config/theme';

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  padded?: boolean;
}

export function Screen({ children, scrollable, padded = true }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const baseStyle = [
    styles.base,
    { paddingTop: insets.top, paddingBottom: insets.bottom },
    padded && styles.padded,
  ];
  return <View style={baseStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  padded: {
    paddingHorizontal: 16,
  },
});