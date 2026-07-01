import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Text, useColorScheme, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

console.log('[debug] RootLayout module loaded');

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false as boolean, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    console.error('[debug] RootErrorBoundary caught error:', error?.message ?? String(error));
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('[debug] RootErrorBoundary componentStack:', info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      SplashScreen.hideAsync();
      return (
        <View style={{ flex: 1, backgroundColor: 'red', padding: 24, justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Render error:</Text>
          <Text style={{ color: 'white', fontSize: 12, marginTop: 8 }}>
            {this.state.error?.message ?? String(this.state.error)}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log('[debug] RootLayout rendering');

  useEffect(() => {
    console.log('[debug] useEffect fired, hiding splash');
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootErrorBoundary>
        <AppTabs />
      </RootErrorBoundary>
    </ThemeProvider>
  );
}
