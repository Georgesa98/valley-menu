import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';

const colors = Colors.light;

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={colors.background}
      disableIndicator
      iconColor={{ default: colors.textSecondary, selected: colors.accent }}
      labelStyle={{ selected: { color: colors.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>القائمة</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="restaurant_menu" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="admin">
        <NativeTabs.Trigger.Label>لوحة التحكم</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
