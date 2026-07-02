import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import { getCategories, getMenuItems, getShowFinancialPrice } from '@/lib/db/client';
import MenuItemCard from '@/components/menu/menu-item-card';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showFinancial, setShowFinancial] = useState(false);

  useEffect(() => {
    const cats = getCategories();
    const cat = cats.find((c) => c.id === id);
    setCategory(cat ?? null);
    setItems(
      getMenuItems()
        .filter((i) => i.categoryId === id && i.isAvailable)
        .sort((a, b) => a.order - b.order),
    );
    setShowFinancial(getShowFinancialPrice());
  }, [id]);

  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>القسم غير موجود</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.three,
          paddingBottom: BottomTabInset + Spacing.four,
        }}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.backgroundElement }]}
          >
            <Text style={[styles.backText, { color: theme.text }]}>← رجوع</Text>
          </Pressable>
          <Text
            style={[styles.title, { color: theme.text }]}
            numberOfLines={2}
          >
            {category.name}
          </Text>
        </View>

        <View style={styles.list}>
          {items.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              لا توجد أصناف في هذا القسم
            </Text>
          ) : (
            items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                showFinancialPrice={showFinancial}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  backBtn: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginRight: Spacing.three,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Cairo_700Bold',
    flexShrink: 1,
  },
  list: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'center',
    paddingVertical: Spacing.six,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
    paddingTop: 100,
  },
});
