import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { Category } from '@/lib/types';

type Props = {
  category: Category;
  itemCount: number;
  index: number;
  onPress: (id: string) => void;
};

export default function CategoryCard({ category, itemCount, index, onPress }: Props) {
  const theme = useTheme();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      index * 50,
      withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      index * 50,
      withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        onPress={() => onPress(category.id)}
        onPressIn={() => { scale.value = withSpring(0.96); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.accent + '40' }]}
      >
        <Animated.Text
          sharedTransitionTag={`cat-name-${category.id}`}
          style={[styles.name, { color: theme.text }]}
          numberOfLines={2}
        >
          {category.name}
        </Animated.Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {itemCount} صنف
        </Text>
      </Pressable>
    </Animated.View>
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
