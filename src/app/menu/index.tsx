import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import { getCategories, getMenuItems } from '@/lib/db/client';
import CategoryGrid from '@/components/menu/category-grid';

export default function MenuScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCategories(getCategories().sort((a, b) => a.order - b.order));
      setItems(getMenuItems().filter((i) => i.isAvailable));
    }, []),
  );

  const itemCounts: Record<string, number> = {};
  for (const item of items) {
    itemCounts[item.categoryId] = (itemCounts[item.categoryId] ?? 0) + 1;
  }

  const visibleCategories = categories.filter(
    (c) => (itemCounts[c.id] ?? 0) > 0,
  );

  const handleCategoryPress = useCallback(
    (catId: string) => {
      router.push(`/menu/category/${catId}`);
    },
    [router],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {visibleCategories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>القائمة فارغة</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            يرجى العودة لاحقاً
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingTop: insets.top + Spacing.three,
            paddingBottom: BottomTabInset + Spacing.four,
          }}
        >
          <View style={styles.content}>
            <Image
              source={require('@/assets/images/rest_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <CategoryGrid
              categories={visibleCategories}
              itemCounts={itemCounts}
              onCategoryPress={handleCategoryPress}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  logo: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Cairo_700Bold',
    marginBottom: Spacing.two,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
  },
});
