import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LogIn, LogOut, UserPlus, CreditCard, Settings, Shield } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { SectionHeader } from '@/components/ui';
import { useUserStore } from '@/store/user/userStore';
import { AuthService } from '@/services/auth/AuthService';
import { colors, radius, spacing, typography } from '@/config/theme';
import { API_URL, HAS_BACKEND } from '@/config/constants';

export default function ProfileScreen() {
  const user = useUserStore((s) => s.user);
  const signedIn = useUserStore((s) => s.signedIn);
  const signOut = useUserStore((s) => s.signOut);
  const setSession = useUserStore((s) => s.setSession);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!signedIn) {
      // Fetch profile when signed in silently (bonus)
    }
  }, [signedIn]);

  const submit = async () => {
    if (!HAS_BACKEND) {
      Alert.alert('Backend not configured', 'Set EXPO_PUBLIC_API_URL in your .env file to enable login, signup and project sync. Editing still works fully offline.');
      return;
    }
    if (!email || !password) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      const auth = mode === 'login'
        ? await AuthService.login({ email: email.trim(), password })
        : await AuthService.register({ email: email.trim(), password, name: name.trim() || undefined });
      await setSession(auth.token, auth.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert(mode === 'login' ? 'Login failed' : 'Sign up failed', message);
    } finally {
      setBusy(false);
    }
  };

  const doSignOut = async () => {
    await signOut();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Profile</Text>

        {signedIn && user ? (
          <AccountView
            email={user.email}
            name={user.name}
            onSignOut={() => void doSignOut()}
          />
        ) : (
          <AuthView
            mode={mode}
            setMode={setMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            busy={busy}
            onSubmit={() => void submit()}
            backendConfigured={HAS_BACKEND}
          />
        )}

        <SectionHeader title="Preferences" />
        <Card title="Export settings" subtitle="Resolution, FPS and quality defaults" icon={<CreditCard size={18} color={colors.textSecondary} />} />
        <Card title="Privacy" subtitle="Local-first editing; only project metadata syncs when you log in" icon={<Shield size={18} color={colors.textSecondary} />} />
        <Card title="Settings" subtitle="Storage, cache and temporary file cleanup" icon={<Settings size={18} color={colors.textSecondary} />} />

        {!HAS_BACKEND && (
          <Text style={styles.hint}>
            Tip: set EXPO_PUBLIC_API_URL to connect the backend (auth + project metadata sync).
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
}

function AuthView({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  busy,
  onSubmit,
  backendConfigured,
}: {
  mode: 'login' | 'register';
  setMode: (m: 'login' | 'register') => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  busy: boolean;
  onSubmit: () => void;
  backendConfigured: boolean;
}) {
  return (
    <Card>
      <Text style={styles.cardTitle}>{mode === 'login' ? 'Welcome back' : 'Create account'}</Text>
      <Text style={styles.cardSubtitle}>
        Login is only needed for cloud features. All editing stays private and local.
      </Text>

      {mode === 'register' && (
        <Input placeholder="Name (optional)" value={name} onChangeText={setName} />
      )}
      <Input placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <Button
        title={mode === 'login' ? 'Login' : 'Sign up'}
        onPress={onSubmit}
        loading={busy}
        icon={mode === 'login' ? <LogIn size={18} color="#fff" /> : <UserPlus size={18} color="#fff" />}
        disabled={!backendConfigured}
      />

      <Text
        style={styles.switch}
        onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
      </Text>
    </Card>
  );
}

function AccountView({ email, name, onSignOut }: { email: string; name?: string; onSignOut: () => void }) {
  return (
    <Card>
      <Text style={styles.cardTitle}>{name || email}</Text>
      <Text style={styles.cardSubtitle}>{email}</Text>
      <View style={styles.nameRow}>
        <Button title="Sign out" variant="secondary" onPress={onSignOut} icon={<LogOut size={18} color={colors.text} />} />
      </View>
    </Card>
  );
}

function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  keyboardType?: 'email-address' | 'default';
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize ?? 'sentences'}
      keyboardType={keyboardType ?? 'default'}
      style={styles.input}
    />
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
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
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
  switch: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  nameRow: {
    marginTop: spacing.sm,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
});