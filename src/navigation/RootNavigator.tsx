import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { useTheme } from '@/shared/theme';
import TabNavigator from './TabNavigator';
import ArticleDetailScreen from '@/features/feed/screens/ArticleDetailScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root navigator — a NativeStack wrapper above the tabs.
 *
 * Why: ArticleDetail is shared between Feed and Bookmarks tabs.
 * By placing it here (not inside the Feed stack), React Navigation's
 * back gesture returns to whichever tab originally triggered the navigation.
 */
export default function RootNavigator(): React.ReactElement {
  const { colors } = useTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        // Slide-from-right is the default native transition — no extra config needed
      }}>
      {/* Tab navigator is a single root-stack screen */}
      <RootStack.Screen name="Tabs" component={TabNavigator} />

      {/* Detail screen — accessible from both Feed and Bookmarks */}
      <RootStack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    </RootStack.Navigator>
  );
}
