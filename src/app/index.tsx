import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import { loadData } from '@/lib/storage';
import { getSettings } from '@/lib/settings';
import CategoryPills from '@/components/menu/category-pills';
import CategorySection from '@/components/menu/category-section';

export default function MenuScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showFinancial, setShowFinancial] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sectionYRef = useRef<Record<string, number>>({});
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    (async () => {
      const cats = await loadData<Category[]>('menu_categories') ?? [];
      const allItems = await loadData<MenuItem[]>('menu_items') ?? [];
      setCategories(cats);
      setItems(allItems);

      const settings = await getSettings();
      setShowFinancial(settings.showFinancialPrice);
    })();
  }, []);

  const filteredItems = selectedCategory
    ? items.filter((i) => i.categoryId === selectedCategory && i.isAvailable)
    : items.filter((i) => i.isAvailable);

  const visibleCategories = categories
    .filter((c) => filteredItems.some((i) => i.categoryId === c.id))
    .sort((a, b) => a.order - b.order);

  const handlePillSelect = useCallback((catId: string | null) => {
    setSelectedCategory(catId);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {categories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>القائمة فارغة</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            يرجى العودة لاحقاً
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={{
            paddingTop: insets.top + Spacing.three,
            paddingBottom: BottomTabInset + Spacing.four,
          }}
        >
          <CategoryPills
            categories={categories}
            selectedId={selectedCategory}
            onSelect={handlePillSelect}
          />
          {visibleCategories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              items={filteredItems.filter((i) => i.categoryId === cat.id)}
              showFinancialPrice={showFinancial}
            />
          ))}
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
