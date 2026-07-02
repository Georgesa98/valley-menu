import { Slot, usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';

const tabs = [
  { name: 'menu', href: '/menu', label: 'القائمة', icon: 'restaurant-menu' },
  { name: 'admin', href: '/admin', label: 'لوحة التحكم', icon: 'settings' },
] as const;

export default function AppTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;

  const activeTab = tabs.find((t) => pathname.startsWith(t.href)) ?? tabs[0];

  return (
    <View style={styles.container}>
      <Slot />
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, Spacing.one) }]}>
        {tabs.map((tab) => {
          const focused = activeTab.name === tab.name;
          return (
            <Pressable
              key={tab.name}
              onPress={() => router.replace(tab.href)}
              style={styles.tabBtn}
            >
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={focused ? colors.accent : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? colors.accent : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundElement,
    borderTopWidth: 1,
    borderTopColor: Colors.light.accent + '20',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
    gap: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Cairo_600SemiBold',
  },
});
