import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, MaxContentWidth } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import MenuItemCard from './menu-item-card';

type Props = {
  category: Category;
  items: MenuItem[];
  showFinancialPrice: boolean;
};

const TABLET_BREAKPOINT = 768;

export default function CategorySection({ category, items, showFinancialPrice }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const cardWidth = isTablet ? Math.min(MaxContentWidth, width) / 2 - Spacing.three : undefined;

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.categoryName, { color: theme.text }]}>
        {category.name}
      </Text>
      <View style={[styles.cardsGrid, isTablet && styles.cardsGridTablet]}>
        {items.map((item) => (
          <View key={item.id} style={cardWidth ? { width: cardWidth } : undefined}>
            <MenuItemCard item={item} showFinancialPrice={showFinancialPrice} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  categoryName: {
    fontSize: 22,
    fontFamily: 'Cairo_700Bold',
    marginBottom: Spacing.three,
  },
  cardsGrid: {
    gap: Spacing.three,
  },
  cardsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
});
