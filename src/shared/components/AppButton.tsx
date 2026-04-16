import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, Animated } from 'react-native';
import { useTheme } from '@/shared/theme';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
}

export default function AppButton({ 
  title, 
  variant = 'primary', 
  loading = false, 
  disabled, 
  style, 
  ...rest 
}: AppButtonProps) {
  const { colors } = useTheme();

  let backgroundColor = colors.accent;
  let textColor = colors.white;
  let borderColor = colors.transparent;

  switch (variant) {
    case 'secondary':
      backgroundColor = colors.surfaceElevated;
      textColor = colors.textPrimary;
      break;
    case 'outline':
      backgroundColor = colors.transparent;
      textColor = colors.accent;
      borderColor = colors.accent;
      break;
    case 'danger':
      backgroundColor = colors.error;
      textColor = colors.white;
      break;
  }

  if (disabled) {
    backgroundColor = colors.border;
    textColor = colors.textMuted;
    borderColor = colors.transparent;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, borderWidth: variant === 'outline' ? 1.5 : 0 },
        style
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  }
});
