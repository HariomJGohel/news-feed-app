import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

/**
 * Root stack — ArticleDetail lives here, above the tab navigator.
 * This means pressing back from the detail screen always returns to the
 * tab that initiated the navigation (Feed OR Bookmarks), not to a
 * fixed preceding stack screen.
 */
export type RootStackParamList = {
  Tabs: undefined;
  ArticleDetail: { articleId: number };
};

/** Bottom tab navigator — both tabs are leaf screens/stacks */
export type TabParamList = {
  Feed: undefined;
  Bookmarks: undefined;
};

/** Typed screen props */
export type ArticleListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Feed'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type ArticleDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;
export type BookmarksScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Bookmarks'>,
  NativeStackScreenProps<RootStackParamList>
>;
