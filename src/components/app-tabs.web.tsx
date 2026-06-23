import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton tabName="menu" label="القائمة" />
          </TabTrigger>
          <TabTrigger name="admin" href="/admin" asChild>
            <TabButton tabName="admin" label="لوحة التحكم" />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

const iconMap: Record<string, React.ComponentProps<typeof MaterialIcons>['name']> = {
  menu: 'menu-book',
  admin: 'settings',
};

type TabButtonProps = TabTriggerSlotProps & {
  tabName: string;
  label: string;
};

export function TabButton({ isFocused, tabName, label, ...props }: TabButtonProps) {
  const colors = Colors.light;

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : undefined}
        style={styles.tabButtonView}>
        <MaterialIcons
          name={iconMap[tabName] ?? 'help-outline'}
          size={20}
          color={isFocused ? colors.accent : colors.textSecondary}
        />
        <ThemedText
          type="smallBold"
          themeColor={isFocused ? 'accent' : 'textSecondary'}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
