import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { TabParamList } from './types';
import { useTheme } from '@/shared/theme';
import AnimatedTabBar from './AnimatedTabBar';
import ArticleListScreen from '@/features/feed/screens/ArticleListScreen';
import BookmarksScreen from '@/features/bookmarks/screens/BookmarksScreen';

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Bottom tab navigator.
 * The Feed tab renders ArticleListScreen directly — ArticleDetail is no
 * longer nested here. It lives in the root stack so back from the detail
 * screen always returns to whichever tab opened it.
 */
export default function TabNavigator(): React.ReactElement {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={ArticleListScreen} options={{ title: 'Feed' }} />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          title: 'Bookmarks',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}
