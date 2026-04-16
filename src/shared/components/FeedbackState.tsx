import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IonIcon from '@react-native-vector-icons/ionicons';
import { Colors, Spacing, Typography } from '@/shared/theme';
import { Strings } from '@/shared/constants/Strings';

type IonIconName = React.ComponentProps<typeof IonIcon>['name'];


interface EmptyStateProps {
  message?: string;
  icon?: IonIconName;
}

/**
 * Generic empty-state display.
 * Shown when the article list or bookmarks list has no items.
 * Single responsibility: purely presentational, no data fetching.
 */
export default function EmptyState({
  message = Strings.emptyDefault,
  icon = 'newspaper-outline',
}: EmptyStateProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <IonIcon name={icon} size={64} color={Colors.textMuted} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/**
 * Generic error state with a Retry CTA.
 * Single responsibility: display error message and surface retry action.
 */
export function ErrorState({ message, onRetry }: ErrorStateProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <IonIcon name="alert-circle-outline" size={64} color={Colors.error} />
      <Text style={styles.errorMessage}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
        <Text style={styles.retryText}>{Strings.retryButton}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.base,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    textAlign: 'center',
    fontFamily: Typography.fontFamily,
  },
  errorMessage: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    textAlign: 'center',
    fontFamily: Typography.fontFamily,
  },
  retryButton: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    fontFamily: Typography.fontFamily,
  },
});
