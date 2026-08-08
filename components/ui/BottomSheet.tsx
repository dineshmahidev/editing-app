import { useEffect, type ReactNode, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '@/config/theme';

interface BottomSheetProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  snapPoint?: number;
  dismissOnTapOutside?: boolean;
}

/**
 * Lightweight modal bottom sheet. Smooth slide-in/slide-out via Reanimated.
 * Content scrolls internally; sheet collapses on drag-down.
 */
export function BottomSheet({
  visible,
  title,
  onClose,
  children,
  snapPoint = 480,
  dismissOnTapOutside = true,
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const [rendered, setRendered] = useState(visible);

  useEffect(() => {
    if (visible) setRendered(true);
    translateY.value = visible ? 0 : snapPoint;
  }, [visible, snapPoint, translateY]);

  const finishClose = () => {
    setRendered(false);
    onClose();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd(() => {
      if (translateY.value > 96) {
        runOnJS(finishClose)();
      } else {
        translateY.value = 0;
      }
    });

  if (!rendered) return null;

  return (
    <Modal transparent visible={rendered} animationType="fade" onRequestClose={finishClose}>
      <View style={styles.overlay}>
        {dismissOnTapOutside && (
          <Pressable style={StyleSheet.absoluteFill} onPress={finishClose} />
        )}
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.sheet,
              { bottom: insets.bottom, height: Math.min(snapPoint, height * 0.85) },
              animatedStyle,
            ]}
          >
            <View style={styles.handle} />
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <View style={{ flex: 1 }}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});