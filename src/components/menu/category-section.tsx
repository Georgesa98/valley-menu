import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import MenuItemCard from './menu-item-card';

type Props = {
  category: Category;
  items: MenuItem[];
  showFinancialPrice: boolean;
  onLayout?: (y: number) => void;
};

const CARD_GAP = Spacing.two;
const MIN_COL_WIDTH = 220;

export default function CategorySection({ category, items, showFinancialPrice, onLayout }: Props) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const numColumns = Math.max(1, Math.floor((screenWidth - Spacing.four * 2 + CARD_GAP) / (MIN_COL_WIDTH + CARD_GAP)));

  if (items.length === 0) return null;

  return (
    <View
      style={styles.section}
      onLayout={(e) => onLayout?.(e.nativeEvent.layout.y)}
    >
      <Text style={[styles.categoryName, { color: theme.text }]}>
        {category.name}
      </Text>
      <View style={[styles.grid, { gap: CARD_GAP }]}>
        {items.map((item) => (
          <View key={item.id} style={{ width: `${100 / numColumns}%` as unknown as number }}>
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
  },
  categoryName: {
    fontSize: 22,
    fontFamily: 'Cairo_700Bold',
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.four,
  },
});
