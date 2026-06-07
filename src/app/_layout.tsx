import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

const DevMenuPreferences = requireOptionalNativeModule('DevMenuPreferences');

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    try {
      DevMenuPreferences?.setPreferencesAsync({
        showFloatingActionButton: false,
      });
    } catch (e) {
      console.warn('Could not disable DevMenu floating action button:', e);
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

