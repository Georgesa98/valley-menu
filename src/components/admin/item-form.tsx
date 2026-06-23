import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { MenuItem } from '@/lib/types';

type Props = {
  visible: boolean;
  initial?: MenuItem;
  onSave: (data: Omit<MenuItem, 'id' | 'categoryId' | 'order'>) => void;
  onCancel: () => void;
};

export default function ItemForm({ visible, initial, onSave, onCancel }: Props) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [consumerPrice, setConsumerPrice] = useState('');
  const [financialPrice, setFinancialPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (visible) {
      setName(initial?.name ?? '');
      setDescription(initial?.description ?? '');
      setConsumerPrice(initial?.consumerPrice?.toString() ?? '');
      setFinancialPrice(initial?.financialPrice?.toString() ?? '');
      setIsAvailable(initial?.isAvailable ?? true);
    }
  }, [visible, initial]);

  const handleSave = () => {
    const cPrice = parseFloat(consumerPrice);
    const fPrice = parseFloat(financialPrice);
    if (!name.trim() || isNaN(cPrice) || isNaN(fPrice)) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      consumerPrice: cPrice,
      financialPrice: fPrice,
      isAvailable,
    });
  };

  const valid = name.trim() && !isNaN(parseFloat(consumerPrice)) && !isNaN(parseFloat(financialPrice));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.content, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {initial ? 'تعديل الصنف' : 'إضافة صنف'}
          </Text>

          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            placeholder="الاسم"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            placeholder="الوصف (اختياري)"
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>سعر المستهلك</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                value={consumerPrice}
                onChangeText={setConsumerPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.half}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>سعر المالية</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                value={financialPrice}
                onChangeText={setFinancialPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: theme.text }]}>متاح</Text>
            <Switch value={isAvailable} onValueChange={setIsAvailable} />
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={[styles.btn, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.btnText, { color: theme.textSecondary }]}>إلغاء</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!valid}
              style={[styles.btn, { backgroundColor: theme.text, opacity: valid ? 1 : 0.5 }]}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  half: {
    flex: 1,
    gap: Spacing.one,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
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
