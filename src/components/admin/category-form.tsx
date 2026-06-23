import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

type Props = {
  visible: boolean;
  initialName?: string;
  onSave: (name: string) => void;
  onCancel: () => void;
};

export default function CategoryForm({ visible, initialName, onSave, onCancel }: Props) {
  const theme = useTheme();
  const [name, setName] = useState(initialName ?? '');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.content, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {initialName ? 'تعديل القسم' : 'إضافة قسم'}
          </Text>

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.backgroundElement, color: theme.text },
            ]}
            placeholder="اسم القسم"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              style={[styles.btn, { backgroundColor: theme.backgroundElement }]}
            >
              <Text style={[styles.btnText, { color: theme.textSecondary }]}>إلغاء</Text>
            </Pressable>
            <Pressable
              onPress={() => name.trim() && onSave(name.trim())}
              style={[styles.btn, { backgroundColor: theme.text, opacity: name.trim() ? 1 : 0.5 }]}
              disabled={!name.trim()}
            >
              <Text style={[styles.btnText, { color: theme.background }]}>حفظ</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  btn: {
    flex: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
  },
});
