import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { verifyPassword, setPassword as setAdminPassword } from '@/lib/settings';

type Props = {
  onLogin: () => void;
};

export default function AdminLogin({ onLogin }: Props) {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetTaps, setResetTaps] = useState(0);

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);
    const ok = await verifyPassword(password);
    setLoading(false);
    if (ok) {
      onLogin();
    } else {
      setError(true);
    }
  };

  const handleInvisibleTap = () => {
    const next = resetTaps + 1;
    setResetTaps(next);
    if (next >= 10) {
      setResetTaps(0);
      setAdminPassword('admin123');
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={[styles.title, { color: theme.text }]}>لوحة التحكم</Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: error ? '#e74c3c' : 'transparent' },
          ]}
          placeholder="كلمة المرور"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={(t) => { setPassword(t); setError(false); }}
          autoFocus
        />

        {error && (
          <Text style={styles.error}>كلمة المرور غير صحيحة</Text>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={loading || !password}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.text, opacity: pressed || loading || !password ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>
            {loading ? '...جاري' : 'دخول'}
          </Text>
        </Pressable>

        <Pressable onPress={handleInvisibleTap} style={styles.invisibleZone} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    gap: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  input: {
    borderWidth: 2,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    fontSize: 18,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
  },
  error: {
    color: '#e74c3c',
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Cairo_700Bold',
  },
  invisibleZone: {
    height: 1,
    width: '100%',
  },
});
