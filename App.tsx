/**
 * News Feed App — Entry point
 */
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootNavigator from '@/navigation/RootNavigator';
import { useBookmarksStore } from '@/features/bookmarks/store/bookmarksStore';
import { ThemeProvider, useTheme } from '@/shared/theme';
import AppAlert, { appAlertRef } from '@/shared/components/AppAlert';
import OfflineBanner from '@/shared/components/OfflineBanner';

function AppContent(): React.ReactElement {
  const hydrateFromStorage = useBookmarksStore(state => state.hydrateFromStorage);
  const { colors, theme } = useTheme();

  // Hydrate persisted bookmarks once on cold start — not inside the hook
  // to avoid re-reading AsyncStorage on every component that calls useBookmarks.
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
        translucent={false}
      />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <OfflineBanner />
      <AppAlert />
    </SafeAreaProvider>
  );
}

function App(): React.ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
