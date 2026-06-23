import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import MenuItemCard from './menu-item-card';

type Props = {
  category: Category;
  items: MenuItem[];
  showFinancialPrice: boolean;
};

export default function CategorySection({ category, items, showFinancialPrice }: Props) {
  const theme = useTheme();

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.categoryName, { color: theme.text }]}>
        {category.name}
      </Text>
      <View>
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} showFinancialPrice={showFinancialPrice} />
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
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
});
