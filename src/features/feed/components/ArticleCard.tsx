import React, { memo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IonIcon from '@react-native-vector-icons/ionicons';
import type { Article } from '@/shared/types/article';
import { Spacing, Typography, useTheme, ThemeColors } from '@/shared/theme';
import { formatRelativeTime } from '@/shared/utils/dateUtils';
import { capitalizeFirstLetter } from '@/shared/utils/textUtils';
import { Strings } from '@/shared/constants/Strings';

import type { StyleProp, ViewStyle } from 'react-native';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Premium news article card redesign.
 * Adapts dynamically to title heights perfectly.
 */
function ArticleCard({ article, onPress, testID, style }: ArticleCardProps): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [faviconError, setFaviconError] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID ?? `article-card-${article.id}`}>
      
      {/* Top Meta info */}
      <View style={styles.headerRow}>
        <View style={styles.sourceInfo}>
          {faviconError ? (
            <View style={[styles.favicon, styles.faviconFallback]}>
               <IonIcon name="newspaper-outline" size={10} color={colors.textSecondary} />
            </View>
          ) : (
            <Image
              source={{ uri: article.faviconUrl }}
              style={styles.favicon}
              onError={() => setFaviconError(true)}
            />
          )}
          <Text style={styles.domainName} numberOfLines={1}>{article.domain}</Text>
        </View>
        <Text style={styles.timeText}>{formatRelativeTime(article.time)}</Text>
      </View>

      {/* Main Title */}
      <Text style={styles.title} numberOfLines={3}>
        {article.title}
      </Text>

      {/* Footer Info */}
      <View style={styles.footerRow}>
        <View style={styles.scorePill}>
          <IonIcon name="arrow-up" size={12} color={colors.accent} />
          <Text style={styles.scoreText}>{article.score}</Text>
        </View>
        <Text style={styles.authorText} numberOfLines={1}>{Strings.cardAuthorPrefix} {capitalizeFirstLetter(article.author)}</Text>
      </View>
      
    </TouchableOpacity>
  );
}

export default memo(ArticleCard);

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.md,
      padding: Spacing.md,
      borderRadius: 16,
      // Minimal, premium shadow
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sourceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: Spacing.sm,
    },
    favicon: {
      width: 16,
      height: 16,
      borderRadius: 4,
      marginRight: 6,
    },
    faviconFallback: {
      backgroundColor: colors.surfaceElevated,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    domainName: {
      fontSize: Typography.xs,
      color: colors.textSecondary,
      fontWeight: Typography.medium,
    },
    timeText: {
      fontSize: Typography.xs,
      color: colors.textMuted,
    },
    title: {
      fontSize: 16,
      fontWeight: Typography.bold,
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: 14,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    scorePill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accentDim,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginRight: Spacing.sm,
      gap: 3,
    },
    scoreText: {
      fontSize: Typography.xs,
      fontWeight: Typography.bold,
      color: colors.accent,
    },
    authorText: {
      fontSize: Typography.xs,
      color: colors.textSecondary,
      flex: 1,
    },
  });
