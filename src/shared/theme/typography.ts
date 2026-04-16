import { Platform } from 'react-native';

/**
 * Design token: typography scale.
 * Uses San Francisco on iOS and Roboto on Android via the system default.
 */
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const Typography = {
  fontFamily,

  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,

  // Line heights
  lineHeightSm: 18,
  lineHeightBase: 22,
  lineHeightMd: 26,
  lineHeightLg: 30,
} as const;

export default Typography;
