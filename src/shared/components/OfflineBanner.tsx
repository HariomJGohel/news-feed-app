import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import IonIcon from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { Colors, Spacing, Typography } from '@/shared/theme';
import { Strings } from '@/shared/constants/Strings';

const BANNER_HEIGHT = 36;

/**
 * Bonus: offline detection banner.
 * Renders at root level (App.tsx) so it appears on every screen.
 * Animates height from 0 → 36 below the safe area inset — never overlaps
 * the status bar. overflow:'hidden' clips content during the animation.
 */
export default function OfflineBanner(): React.ReactElement {
  const isConnected = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // null means NetInfo hasn't resolved yet — don't show the banner
    if (isConnected === null) return;

    Animated.timing(heightAnim, {
      toValue: isConnected ? 0 : BANNER_HEIGHT,
      duration: 300,
      useNativeDriver: false, // 'height' is a layout property, cannot use native driver
    }).start();
  }, [isConnected, heightAnim]);

  return (
    <Animated.View
      style={[styles.banner, { top: insets.top, height: heightAnim }]}>
      <IonIcon name="cloud-offline-outline" size={14} color={Colors.white} />
      <Text style={styles.text}>{Strings.offlineMessage}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden', // clips icon+text while height grows/shrinks
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    zIndex: 9999,
    elevation: 20,
  },
  text: {
    color: Colors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    fontFamily: Typography.fontFamily,
  },
});
