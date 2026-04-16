import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Spacing, ThemeColors, useTheme } from '@/shared/theme';

const ITEM_COUNT = 7;

function SkeletonItem({
  opacity,
  colors,
}: {
  opacity: Animated.Value;
  colors: ThemeColors;
}): React.ReactElement {
  const s = React.useMemo(() => getStyles(colors), [colors]);
  return (
    <Animated.View style={[s.card, { opacity }]}>
      {/* Top Header Row */}
      <View style={s.headerRow}>
        <View style={s.sourceInfo}>
          <View style={s.faviconPlaceholder} />
          <View style={[s.line, s.domainLine]} />
        </View>
        <View style={[s.line, s.timeLine]} />
      </View>

      {/* Main Title Lines */}
      <View style={s.titleBlock}>
        <View style={[s.line, s.titleLine1]} />
        <View style={[s.line, s.titleLine2]} />
      </View>

      {/* Footer Info */}
      <View style={s.footerRow}>
        <View style={[s.line, s.scorePill]} />
        <View style={[s.line, s.authorLine]} />
      </View>
    </Animated.View>
  );
}

export default function SkeletonLoader(): React.ReactElement {
  const { colors } = useTheme();
  const s = React.useMemo(() => getStyles(colors), [colors]);
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={s.container}>
      {Array.from({ length: ITEM_COUNT }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <SkeletonItem key={index} opacity={opacity} colors={colors} />
      ))}
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.md,
      padding: Spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    line: {
      borderRadius: 4,
      backgroundColor: colors.shimmerHighlight,
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
    },
    faviconPlaceholder: {
      width: 16,
      height: 16,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: colors.shimmerHighlight,
    },
    domainLine: { height: 10, width: '30%' },
    timeLine: { height: 10, width: 40 },
    titleBlock: {
      gap: 6,
      marginBottom: 14,
    },
    titleLine1: { height: 14, width: '90%' },
    titleLine2: { height: 14, width: '60%' },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    scorePill: {
      height: 20,
      width: 45,
      borderRadius: 6,
      marginRight: Spacing.sm,
    },
    authorLine: { height: 10, width: 80 },
  });
