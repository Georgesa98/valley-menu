import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Text, useColorScheme, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';

import AppTabs from '@/components/app-tabs';
import { ensureDefaults } from '@/lib/db/client';

SplashScreen.preventAutoHideAsync();

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false as boolean, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('[RootErrorBoundary]', error, info?.componentStack);
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
  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
    if (fontsLoaded) {
      ensureDefaults().catch((e) => console.error('[ensureDefaults]', e));
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootErrorBoundary>
        <AppTabs />
      </RootErrorBoundary>
    </ThemeProvider>
  );
}
