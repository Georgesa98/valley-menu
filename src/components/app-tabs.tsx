import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';

const colors = Colors.light;

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="menu"
        options={{
          title: 'القائمة',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant-menu" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'لوحة التحكم',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
