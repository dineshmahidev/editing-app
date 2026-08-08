import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { UserProfile } from '@/types/auth';
import { STORAGE_KEYS } from '@/config/constants';

interface UserState {
  user: UserProfile | null;
  token: string | null;
  signedIn: boolean;
  hydrated: boolean;
  setSession: (token: string, user: UserProfile) => Promise<void>;
  setToken: (token: string) => Promise<void>;
  setUser: (user: UserProfile) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  signedIn: false,
  hydrated: false,

  setSession: async (token, user) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.authToken, token],
      [STORAGE_KEYS.authUser, JSON.stringify(user)],
    ]);
    set({ token, user, signedIn: true });
  },

  setToken: async (token) => {
    await AsyncStorage.setItem(STORAGE_KEYS.authToken, token);
    set({ token, signedIn: true });
  },

  setUser: async (user) => {
    await AsyncStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
    set({ user });
  },

  signOut: async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.authToken, STORAGE_KEYS.authUser]);
    set({ token: null, user: null, signedIn: false });
  },

  hydrate: async () => {
    try {
      const [token, userRaw] = await AsyncStorage.multiGet([STORAGE_KEYS.authToken, STORAGE_KEYS.authUser]);
      const user = userRaw[1] ? (JSON.parse(userRaw[1]) as UserProfile) : null;
      set({
        token: token[1],
        user,
        signedIn: !!token?.[1],
        hydrated: true,
      });
    } catch (error) {
      console.warn('User hydrate failed', error);
      set({ hydrated: true });
    }
  },
}));