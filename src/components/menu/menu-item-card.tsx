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
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
      {item.description ? (
        <Text style={[styles.desc, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}
      <Text style={[styles.price, { color: theme.text }]}>
        {price} ₪
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    minHeight: 56,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Cairo_700Bold',
  },
  desc: {
    fontSize: 13,
    fontFamily: 'Cairo_400Regular',
    marginTop: Spacing.half,
    lineHeight: 18,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Cairo_700Bold',
    marginTop: Spacing.two,
  },
});
