import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import CategoryCard from './category-card';
import type { Category } from '@/lib/types';

type Props = {
  categories: Category[];
  itemCounts: Record<string, number>;
  onCategoryPress: (id: string) => void;
};

const TABLET_BREAKPOINT = 768;

export default function CategoryGrid({ categories, itemCounts, onCategoryPress }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const columns = isTablet ? 3 : 2;
  const gap = Spacing.three;
  const sidePadding = Spacing.four;
  const availableWidth = Math.min(MaxContentWidth, width) - sidePadding * 2;
  const cardWidth = (availableWidth - gap * (columns - 1)) / columns;

  return (
    <View style={[styles.grid, { paddingHorizontal: sidePadding }]}>
      {categories.map((cat, index) => (
        <View key={cat.id} style={{ width: cardWidth }}>
          <CategoryCard
            category={cat}
            itemCount={itemCounts[cat.id] ?? 0}
            index={index}
            onPress={onCategoryPress}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
});
