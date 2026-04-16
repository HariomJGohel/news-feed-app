import React, { useCallback, useRef } from 'react';
import { Animated, FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IonIcon from '@react-native-vector-icons/ionicons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import type { Article } from '@/shared/types/article';
import { Spacing, Typography, useTheme, ThemeColors } from '@/shared/theme';
import { useBookmarks } from '../hooks/useBookmarks';
import EmptyState from '@/shared/components/FeedbackState';
import ArticleCard from '@/features/feed/components/ArticleCard';
import { appAlertRef } from '@/shared/components/AppAlert';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Strings } from '@/shared/constants/Strings';

/**
 * Bonus: Bookmarks tab screen.
 * Displays saved articles with swipe-to-delete.
 */
export default function BookmarksScreen(): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const { bookmarks, removeBookmark } = useBookmarks();
  // Typed to root stack so navigate('ArticleDetail') resolves correctly
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Tracks whether a swipe gesture is active.
  // Using a ref (not state) avoids re-renders and is safe to read synchronously
  // in onPress — the tap-up event fires on the same JS thread tick as swipe end.
  const isSwiping = useRef(false);

  const keyExtractor = useCallback((item: Article) => item.id.toString(), []);



  const renderItem = useCallback<ListRenderItem<Article>>(
    ({ item }) => {
      const confirmRemove = () => {
        appAlertRef.current?.alert(
          Strings.bookmarkRemoveTitle,
          Strings.bookmarkRemoveMessage(item.title),
          [
            { text: Strings.bookmarkRemoveCancel, style: 'cancel' },
            { text: Strings.bookmarkRemoveConfirm, style: 'destructive', onPress: () => removeBookmark(item.id) },
          ],
        );
      };

      const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
        const opacity = progress.interpolate({
          inputRange: [0, 0.1, 1],
          outputRange: [0, 1, 1],
        });

        return (
          <Animated.View style={[{ width: 80, opacity }]}>
            <TouchableOpacity
              style={styles.deleteAction}
              onPress={confirmRemove}
              activeOpacity={0.8}>
              <IonIcon name="trash-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        );
      };

      return (
        <Swipeable
          renderRightActions={renderRightActions}
          friction={2}
          onSwipeableWillOpen={() => { isSwiping.current = true; }}
          onSwipeableClose={() => {
            // Delay reset slightly so the finger-lift onPress is absorbed first
            setTimeout(() => { isSwiping.current = false; }, 50);
          }}
          containerStyle={{
            marginHorizontal: Spacing.base,
            marginBottom: Spacing.md,
            borderRadius: 16,
          }}
        >
          <ArticleCard
            article={item}
            onPress={() => {
              if (isSwiping.current) return;
              navigation.push('ArticleDetail', { articleId: item.id });
            }}
            style={{ marginHorizontal: 0, marginBottom: 0 }}
          />
        </Swipeable>
      );
    },
    [removeBookmark, navigation, styles.deleteAction],
  );

  if (bookmarks.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          message={Strings.bookmarkEmptyMessage}
          icon="bookmark-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.countLabel}>
        {bookmarks.length} {bookmarks.length === 1 ? Strings.bookmarkSavedSingular : Strings.bookmarkSavedPlural}
      </Text>
      <FlatList
        data={bookmarks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  countLabel: {
    color: colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    fontFamily: Typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  listContent: {
    paddingBottom: Spacing.base + 80, // account for animated tab bar
  },
  deleteAction: {
    flex: 1,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});
