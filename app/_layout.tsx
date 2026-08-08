import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { useUserStore } from '@/store/user/userStore';
import { setApiToken } from '@/services/api/client';
import { StyleSheet } from 'react-native';

function SessionBootstrap() {
  const hydrate = useUserStore((s) => s.hydrate);
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    setApiToken(token);
  }, [token]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SessionBootstrap />
      <Slot />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});