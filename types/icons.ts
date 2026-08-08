import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Type for a Lucide icon component (v1.30 dropped the `LucideIcon` export).
 * Icons accept `size`, `color`, `strokeWidth` and standard `style`.
 */
export type AppIcon = React.ComponentType<{
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  style?: StyleProp<ViewStyle>;
}>;