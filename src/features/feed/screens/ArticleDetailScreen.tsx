import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IonIcon from '@react-native-vector-icons/ionicons';

import type { ArticleDetailScreenProps } from '@/navigation/types';
import { Spacing, Typography, useTheme, ThemeColors } from '@/shared/theme';
import { useArticlesStore } from '../store/articlesStore';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { formatRelativeTime } from '@/shared/utils/dateUtils';
import { capitalizeFirstLetter } from '@/shared/utils/textUtils';
import AppHeader from '@/shared/components/AppHeader';
import { appAlertRef } from '@/shared/components/AppAlert';
import { Strings } from '@/shared/constants/Strings';

type Props = ArticleDetailScreenProps;

export default function ArticleDetailScreen({ route, navigation }: Props): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const { articleId } = route.params;

  const feedArticle = useArticlesStore(state => state.articles.find(a => a.id === articleId));
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  
  const article = feedArticle || bookmarks.find(a => a.id === articleId);
  const bookmarked = article ? isBookmarked(article.id) : false;
  const [faviconError, setFaviconError] = useState(false);

  const handleShare = useCallback(async () => {
    if (!article) return;
    try {
      await Share.share({ title: article.title, url: article.url, message: article.url });
    } catch { /* dismissed */ }
  }, [article]);

  const handleBookmark = useCallback(() => {
    if (!article) return;
    toggleBookmark(article);
  }, [article, toggleBookmark]);

  const handleOpenURL = useCallback(async () => {
    if (!article) return;
    try {
      await Linking.openURL(article.url);
    } catch {
      appAlertRef.current?.alert(Strings.detailErrorTitle, Strings.detailErrorOpenLink);
    }
  }, [article]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (!article) {
    return (
      <View style={[styles.container, styles.centered]}>
        <AppHeader showBack title={Strings.detailHeaderTitle} />
        <View style={styles.centered}>
          <IonIcon name="alert-circle-outline" size={56} color={colors.textMuted} />
          <Text style={styles.notFoundText}>{Strings.detailArticleNotFound}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom header */}
      <AppHeader
        showBack
        title=""
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <IonIcon name="share-social-outline" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBookmark} style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <IonIcon
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={bookmarked ? colors.accent : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ─── Hero section ─────────────────────────────── */}
        <View style={styles.hero}>
          {/* Source badge row */}
          <View style={styles.sourceBadge}>
            {faviconError ? (
              <View style={styles.heroBadgeFallback}>
                <IonIcon name="newspaper" size={14} color={colors.textMuted} />
              </View>
            ) : (
              <Image
                source={{ uri: article.faviconUrl }}
                style={styles.heroBadgeIcon}
                onError={() => setFaviconError(true)}
              />
            )}
            <Text style={styles.sourceDomain}>{article.domain}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

        </View>

        {/* ─── Divider ───────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ─── Article URL card ─────────────────────────── */}
        <Text style={styles.sectionLabel}>{Strings.detailSectionOriginalSource}</Text>

        <TouchableOpacity style={styles.urlCard} onPress={handleOpenURL} activeOpacity={0.75}>
          <View style={styles.urlCardLeft}>
            <Text style={styles.urlCardDomain}>{article.domain}</Text>
            <Text style={styles.urlCardUrl} numberOfLines={2}>
              {article.url}
            </Text>
          </View>
          <View style={styles.urlCardChevron}>
            <IonIcon name="open-outline" size={18} color={colors.accent} />
          </View>
        </TouchableOpacity>

        {/* ─── Info cards ────────────────────────────────── */}
        <Text style={styles.sectionLabel}>{Strings.detailSectionDetails}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <IonIcon name="arrow-up-circle" size={26} color={colors.accent} />
            <Text style={styles.infoValue}>{article.score}</Text>
            <Text style={styles.infoLabel}>{Strings.detailLabelUpvotes}</Text>
          </View>
          <View style={styles.infoCard}>
            <IonIcon name="person-circle-outline" size={26} color={colors.info} />
            <Text style={styles.infoValue} numberOfLines={1}>{capitalizeFirstLetter(article.author)}</Text>
            <Text style={styles.infoLabel}>{Strings.detailLabelPostedBy}</Text>
          </View>
          <View style={styles.infoCard}>
            <IonIcon name="time-outline" size={26} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{formatRelativeTime(article.time)}</Text>
            <Text style={styles.infoLabel}>{Strings.detailLabelPosted}</Text>
          </View>
        </View>


      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.base,
    },
    notFoundText: {
      color: colors.textSecondary,
      fontSize: Typography.base,
      fontFamily: Typography.fontFamily,
    },
    scroll: { flex: 1 },
    content: {
      padding: Spacing.base,
      paddingBottom: 100,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 4,
    },
    headerBtn: { padding: 6 },

    // ─── Hero ────────────────────────────────────────
    hero: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: Spacing.base,
      borderWidth: 1,
      borderColor: colors.border,
      gap: Spacing.md,
      marginBottom: Spacing.base,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    sourceBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    heroBadgeIcon: {
      width: 20,
      height: 20,
      borderRadius: 5,
      backgroundColor: colors.surfaceElevated,
    },
    heroBadgeFallback: {
      width: 20,
      height: 20,
      borderRadius: 5,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sourceDomain: {
      color: colors.accent,
      fontSize: Typography.xs,
      fontWeight: Typography.semiBold,
      fontFamily: Typography.fontFamily,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 19,
      fontWeight: Typography.bold,
      fontFamily: Typography.fontFamily,
      lineHeight: 27,
    },

    // ─── Divider ──────────────────────────────────────
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: Spacing.base,
    },

    // ─── Sections ──────────────────────────────────────
    sectionLabel: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: Typography.semiBold,
      fontFamily: Typography.fontFamily,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
    },

    // ─── URL card ─────────────────────────────────────
    urlCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.xl,
      gap: Spacing.md,
    },
    urlCardLeft: { flex: 1, gap: 3 },
    urlCardDomain: {
      color: colors.textSecondary,
      fontSize: Typography.xs,
      fontWeight: Typography.semiBold,
      fontFamily: Typography.fontFamily,
    },
    urlCardUrl: {
      color: colors.info,
      fontSize: Typography.xs,
      fontFamily: Typography.fontFamily,
      lineHeight: 17,
    },
    urlCardChevron: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ─── Info grid ────────────────────────────────────
    infoGrid: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    infoCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: Spacing.md,
      alignItems: 'center',
      gap: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoValue: {
      color: colors.textPrimary,
      fontSize: Typography.sm,
      fontWeight: Typography.bold,
      fontFamily: Typography.fontFamily,
      textAlign: 'center',
    },
    infoLabel: {
      color: colors.textMuted,
      fontSize: 10,
      fontFamily: Typography.fontFamily,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });
