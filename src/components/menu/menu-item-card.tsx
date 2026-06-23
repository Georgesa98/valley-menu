import { StyleSheet, Text, View } from 'react-native';
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
    <View style={styles.row}>
      <Text style={[styles.nameAr, { color: theme.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.price, { color: theme.text }]}>
        {price} ل.س
      </Text>
      <Text style={[styles.nameEn, { color: theme.textSecondary }]} numberOfLines={1}>
        {item.nameEn || item.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
    minHeight: 48,
  },
  nameAr: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
    marginHorizontal: Spacing.two,
    minWidth: 80,
  },
  nameEn: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'left',
  },
});
