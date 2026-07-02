import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { MenuItem } from '@/lib/types';

type Props = {
  item: MenuItem;
  showFinancialPrice: boolean;
};

export default function MenuItemCard({ item, showFinancialPrice }: Props) {
  const theme = useTheme();
  const price = showFinancialPrice ? item.financialPrice : item.consumerPrice;

  return (
    <Pressable style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.row}>
        <View style={styles.namesWrap}>
          <Text style={[styles.nameAr, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.nameEn, { color: theme.text }]} numberOfLines={1}>
            {item.nameEn || item.name}
          </Text>
        </View>
        <View style={[styles.priceBadge, { backgroundColor: theme.text }]}>
          <Text style={[styles.price, { color: theme.background }]}>
            {price.toLocaleString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  namesWrap: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  nameAr: {
    fontSize: 17,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  nameEn: {
    fontSize: 15,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right',
    writingDirection: 'ltr',
    opacity: 0.7,
  },
  priceBadge: {
    minWidth: 80,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one + Spacing.half,
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontFamily: 'Cairo_700Bold',
  },
});
