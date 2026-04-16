/**
 * Design token: colour palette.
 *
 * Light: professional news-app blue accent (like BBC News / Google News)
 * Dark:  refined dark navy with coral accent
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentDim: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  overlay: string;
  shimmerBase: string;
  shimmerHighlight: string;
  white: string;
  black: string;
  transparent: string;
}

/**
 * Light palette — professional news-app feel.
 * Accent: deep blue #1A73E8 (Google News / BBC News standard).
 */
export const lightColors: ThemeColors = {
  background: '#F2F4F7',
  surface: '#FFFFFF',
  surfaceElevated: '#F7F9FC',
  border: '#DDE1E9',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  accent: '#1A73E8',       // Professional news blue
  accentLight: '#4A90E2',
  accentDim: 'rgba(26, 115, 232, 0.10)',
  success: '#188038',
  error: '#D93025',
  warning: '#F29900',
  info: '#1967D2',
  overlay: 'rgba(0, 0, 0, 0.45)',
  shimmerBase: '#E8EBF0',
  shimmerHighlight: '#F2F4F7',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

/**
 * Dark palette — deep navy with warm coral accent.
 */
export const darkColors: ThemeColors = {
  background: '#0D1117',
  surface: '#161B22',
  surfaceElevated: '#21262D',
  border: '#30363D',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#484F58',
  accent: '#58A6FF',       // Blue accent — readable on dark
  accentLight: '#79C0FF',
  accentDim: 'rgba(88, 166, 255, 0.15)',
  success: '#3FB950',
  error: '#F85149',
  warning: '#D29922',
  info: '#58A6FF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shimmerBase: '#21262D',
  shimmerHighlight: '#30363D',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Backwards compatibility alias
export const Colors = darkColors;
export type ColorKey = keyof ThemeColors;

