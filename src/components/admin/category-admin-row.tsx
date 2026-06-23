import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';

type Props = {
  category: Category;
  items: MenuItem[];
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
  onAddItem: () => void;
};

export default function CategoryAdminRow({
  category,
  items,
  onEditCategory,
  onDeleteCategory,
  onEditItem,
  onDeleteItem,
  onAddItem,
}: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const handleDeleteCategory = () => {
    Alert.alert('حذف القسم', `هل أنت متأكد من حذف "${category.name}"؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: onDeleteCategory },
    ]);
  };

  const handleDeleteItem = (item: MenuItem) => {
    Alert.alert('حذف الصنف', `هل أنت متأكد من حذف "${item.name}"؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => onDeleteItem(item) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
        <Text style={[styles.name, { color: theme.text }]}>{category.name}</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={onEditCategory} style={styles.iconBtn}>
            <Text style={styles.icon}>✏️</Text>
          </Pressable>
          <Pressable onPress={handleDeleteCategory} style={styles.iconBtn}>
            <Text style={styles.icon}>🗑️</Text>
          </Pressable>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>
            {expanded ? '▲' : '▼'}
          </Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.itemsList}>
          {items
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <View key={item.id} style={[styles.itemRow, { borderColor: theme.background }]}>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.itemPrices, { color: theme.textSecondary }]}>
                    مستهلك: {item.consumerPrice} ₪ | مالية: {item.financialPrice} ₪
                    {!item.isAvailable ? ` (غير متاح)` : ''}
                  </Text>
                  {item.description ? (
                    <Text style={[styles.itemDesc, { color: theme.textSecondary }]} numberOfLines={1}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.itemActions}>
                  <Pressable onPress={() => onEditItem(item)} style={styles.iconBtn}>
                    <Text style={styles.smallIcon}>✏️</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDeleteItem(item)} style={styles.iconBtn}>
                    <Text style={styles.smallIcon}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          <Pressable onPress={onAddItem} style={[styles.addItemBtn, { borderColor: theme.textSecondary }]}>
            <Text style={[styles.addItemText, { color: theme.textSecondary }]}>+ إضافة صنف</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Cairo_700Bold',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  iconBtn: {
    padding: Spacing.half,
  },
  icon: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 12,
    marginLeft: Spacing.one,
  },
  itemsList: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingVertical: Spacing.two,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontFamily: 'Cairo_600SemiBold',
  },
  itemPrices: {
    fontSize: 12,
    fontFamily: 'Cairo_400Regular',
    marginTop: 1,
  },
  itemDesc: {
    fontSize: 12,
    fontFamily: 'Cairo_400Regular',
    marginTop: 1,
  },
  itemActions: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  smallIcon: {
    fontSize: 14,
  },
  addItemBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  addItemText: {
    fontSize: 14,
    fontFamily: 'Cairo_600SemiBold',
  },
});
