import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { Category } from '@/lib/types';

type Props = {
  category: Category;
  itemCount: number;
  index: number;
  onPress: (id: string) => void;
};

export default function CategoryCard({ category, itemCount, onPress }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => onPress(category.id)}
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.accent + '40' }]}
      >
        <Text
          style={[styles.name, { color: theme.text }]}
          numberOfLines={2}
        >
          {category.name}
        </Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {itemCount} صنف
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    borderWidth: 1.5,
    padding: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  count: {
    fontSize: 14,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'center',
  },
});
