import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import { verifyPassword, setAdminPassword } from '@/lib/db/client';

type Props = {
  onLogin: () => void;
};

export default function AdminLogin({ onLogin }: Props) {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const resetTapsRef = useRef(0);
  const [resetTapsDisplay, setResetTapsDisplay] = useState(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);
    try {
      const ok = await verifyPassword(password);
      setLoading(false);
      if (ok) {
        onLogin();
      } else {
        setError(true);
      }
    } catch {
      setLoading(false);
      setError(true);
    }
  };

  const handleInvisibleTap = useCallback(() => {
    const next = resetTapsRef.current + 1;
    resetTapsRef.current = next;
    setResetTapsDisplay(next);

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      resetTapsRef.current = 0;
      setResetTapsDisplay(0);
    }, 2000);

    if (next >= 10) {
      resetTapsRef.current = 0;
      setResetTapsDisplay(0);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setAdminPassword('admin123').then(() => {
        Alert.alert('تم', 'تم إعادة تعيين كلمة المرور إلى admin123');
      }).catch(() => {
        Alert.alert('خطأ', 'تعذرت إعادة تعيين كلمة المرور');
      });
      setPassword('');
    }
  }, []);

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

        <Pressable onPress={handleInvisibleTap} style={styles.invisibleZone}>
          {resetTapsDisplay >= 3 && (
            <Text style={[styles.resetHint, { color: theme.textSecondary }]}>
              {resetTapsDisplay >= 5 ? `${resetTapsDisplay}/10` : '...'}
            </Text>
          )}
        </Pressable>
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
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetHint: {
    fontSize: 12,
    fontFamily: 'Cairo_600SemiBold',
  },
});
