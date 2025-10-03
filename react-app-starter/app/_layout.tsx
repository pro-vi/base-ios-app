import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FeatureFlagsProvider } from '@/features/settings';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MiniAppProvider, useMiniApp } from '@/lib/apps/app-provider';
import { AppStateProvider } from '@/lib/AppStateManager';
import { AuthProvider, useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { RevenueCatProvider, useRevenueCatInit } from '@/lib/revenuecat';
import Toast from 'react-native-toast-message';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { activeApp } = useMiniApp();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isNoteDetailScreen = segments[0] === 'note-detail';

    // Only redirect to welcome if user is not in auth screens AND not in tabs AND not in allowed screens
    // This allows users to browse tabs without authentication
    if (!user && !inAuthGroup && !inTabsGroup && !isNoteDetailScreen) {
      router.replace('/(auth)/welcome');
    } else if (user && inAuthGroup) {
      // If user is authenticated and still in auth screens, redirect to tabs
      router.replace('/(tabs)');
    }
    // If user is in tabs without auth, let them stay (preview mode)
  }, [user, loading, segments, router, activeApp]);

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="note-detail" options={{ headerShown: false }} />
      <Stack.Screen
        name="discover-detail"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="chat-detail"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="debug-settings"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootLayoutNav />
      <StatusBar style="auto" />
      <Toast />
    </NavigationThemeProvider>
  );
}

function AppWithRevenueCat() {
  // Initialize RevenueCat after providers are set up
  const { isInitialized, isLoading, error } = useRevenueCatInit();

  // Log RevenueCat initialization status
  useEffect(() => {
    if (!isLoading) {
      if (error) {
        logger.error('RevenueCat initialization failed', { error }, 'RevenueCat');
      } else if (isInitialized) {
        logger.info('RevenueCat initialized successfully', null, 'RevenueCat');
      } else {
        logger.info('RevenueCat initialization skipped', null, 'RevenueCat');
      }
    }
  }, [isInitialized, isLoading, error]);

  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MiniAppProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <RevenueCatProvider>
                <AppWithRevenueCat />
              </RevenueCatProvider>
            </AuthProvider>
          </FeatureFlagsProvider>
        </MiniAppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
