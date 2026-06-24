import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { Category } from '@/lib/types';

type Props = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export default function CategoryPills({ categories, selectedId, onSelect }: Props) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={[
          styles.pill,
          { backgroundColor: selectedId === null ? theme.accent : theme.backgroundElement },
        ]}
      >
        <Text
          style={[
            styles.pillText,
            { color: selectedId === null ? theme.background : theme.textSecondary },
          ]}
        >
          الكل
        </Text>
      </Pressable>
      {categories.map((cat) => (
        <Pressable
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          style={[
            styles.pill,
            { backgroundColor: selectedId === cat.id ? theme.accent : theme.backgroundElement },
          ]}
        >
          <Text
            style={[
              styles.pillText,
              { color: selectedId === cat.id ? theme.background : theme.textSecondary },
            ]}
          >
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.one,
  },
  pill: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 100,
  },
  pillText: {
    fontSize: 15,
    fontFamily: 'Cairo_600SemiBold',
  },
});
