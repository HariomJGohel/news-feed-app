import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IonIcon from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ArticleListScreenProps } from '@/navigation/types';
import type { Article, SortOrder } from '@/shared/types/article';
import { Spacing, Typography, useTheme, ThemeColors } from '@/shared/theme';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/ArticleCard';
import SkeletonLoader from '@/shared/components/SkeletonLoader';
import EmptyState from '@/shared/components/FeedbackState';
import { ErrorState } from '@/shared/components/FeedbackState';
import AppTextInput from '@/shared/components/AppTextInput';
import { Strings } from '@/shared/constants/Strings';

type Props = ArticleListScreenProps;

export default function ArticleListScreen({ navigation }: Props): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const {
    displayedArticles,
    status,
    error,
    sortOrder,
    scrollIndex,
    searchQuery,
    fetchArticles,
    refreshArticles,
    setSortOrder,
    setSearchQuery,
  } = useArticles();

  const flatListRef = useRef<FlatList<Article>>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  /** Stable renderItem reference — prevents ArticleCard re-renders on scroll */
  const renderItem = useCallback<ListRenderItem<Article>>(
    ({ item }) => (
      <ArticleCard
        article={item}
        onPress={() => navigation.push('ArticleDetail', { articleId: item.id })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Article) => item.id.toString(), []);

  const insets = useSafeAreaInsets();

  const handleSortPress = useCallback(
    (order: SortOrder) => {
      setSortOrder(order);
    },
    [setSortOrder],
  );

  // State machine rendering
  const renderContent = () => {
    if (status === 'loading') {
      return <SkeletonLoader />;
    }
    if (status === 'error') {
      return <ErrorState message={error ?? Strings.errorFallback} onRetry={fetchArticles} />;
    }
    if (displayedArticles.length === 0 && status === 'success') {
      return (
        <EmptyState
          message={
            searchQuery.trim().length > 0
              ? Strings.searchNoResults(searchQuery)
              : Strings.searchNoStories
          }
        />
      );
    }
    return (
      <FlatList
        ref={flatListRef}
        data={displayedArticles}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={status === 'refreshing'}
            onRefresh={refreshArticles}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>

      {/* Sleek App Header + Toolbar merged */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.appTitle}>{Strings.appNameHighlight}<Text style={{color: colors.textPrimary}}>{Strings.appNameSuffix}</Text></Text>
          <TouchableOpacity
            style={styles.searchIconBtn}
            onPress={() => setIsSearchVisible(v => !v)}
            activeOpacity={0.7}
          >
            <IonIcon
              name={isSearchVisible ? 'close-outline' : 'search-outline'}
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.toolbar}>
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.chip, sortOrder === 'score' && styles.chipActive]}
            onPress={() => handleSortPress('score')}
            activeOpacity={0.7}>
            <IonIcon
              name="arrow-up-circle-outline"
              size={14}
              color={sortOrder === 'score' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.chipText, sortOrder === 'score' && styles.chipTextActive]}>
              {Strings.sortByScore}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, sortOrder === 'time' && styles.chipActive]}
            onPress={() => handleSortPress('time')}
            activeOpacity={0.7}>
            <IonIcon
              name="time-outline"
              size={14}
              color={sortOrder === 'time' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.chipText, sortOrder === 'time' && styles.chipTextActive]}>
              {Strings.sortByTime}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>

      {/* Bonus: inline search bar */}
      {isSearchVisible && (
        <View style={{ paddingHorizontal: Spacing.base, marginTop: Spacing.sm }}>
          <AppTextInput
            icon="search-outline"
            placeholder={Strings.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      )}

      {renderContent()}
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 4,
      zIndex: 10,
    },
    headerTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    appTitle: {
      color: colors.accent,
      fontSize: 26,
      fontWeight: '800',
      fontFamily: Typography.fontFamily,
      letterSpacing: -0.5,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    sortRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceElevated,
    },
    chipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    chipText: {
      color: colors.textSecondary,
      fontSize: Typography.xs,
      fontWeight: Typography.medium,
      fontFamily: Typography.fontFamily,
    },
    chipTextActive: {
      color: colors.white,
    },
    searchIconBtn: {
      padding: Spacing.xs,
    },
    listContent: {
      paddingVertical: Spacing.sm,
      paddingBottom: 90,
    },
  });

