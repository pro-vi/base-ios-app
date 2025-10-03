/**
 * Centralized theme configuration
 * All colors and theme-related constants should be defined here
 */
import { Platform } from 'react-native';

// Base grayscale colors
export const GrayScale = {
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  black: '#000000',
} as const;

// Vibrant but balanced colors for cards and backgrounds
export const MutedColors = [
  '#FF6B6B', // Soft red
  '#FF9F70', // Soft orange
  '#FFD93D', // Soft yellow
  '#6BCF7F', // Soft green
  '#4ECDC4', // Soft teal
  '#5FA8D3', // Soft blue
  '#7B68EE', // Soft purple
  '#FF79CD', // Soft pink
  '#FFA07A', // Light salmon
  '#87CEEB', // Sky blue
  '#98D8C8', // Mint green
  '#F7B733', // Golden orange
] as const;

// Light theme colors
const lightTheme = {
  // Text colors
  text: GrayScale.gray900,
  textSecondary: GrayScale.gray600,
  textTertiary: GrayScale.gray500,
  textDisabled: GrayScale.gray400,

  // Background colors
  background: GrayScale.white,
  backgroundSecondary: GrayScale.gray50,
  backgroundTertiary: GrayScale.gray100,

  // UI elements
  card: GrayScale.gray50,
  cardHover: GrayScale.gray100,
  cardPressed: GrayScale.gray200,

  // Button colors
  buttonPrimary: GrayScale.gray800, // Dark buttons (auth buttons)
  buttonPrimaryBorder: '#3A3A3A', // Border for dark buttons
  buttonPrimaryText: GrayScale.white, // White text on dark buttons
  buttonDisabled: GrayScale.gray200, // Light gray for disabled
  buttonDisabledText: GrayScale.gray500, // Gray text for disabled

  // Borders
  border: GrayScale.gray200,
  borderLight: GrayScale.gray100,
  borderDark: GrayScale.gray300,

  // Navigation
  tint: GrayScale.gray900, // Changed from teal to dark gray
  icon: GrayScale.gray600,
  tabIconDefault: GrayScale.gray500,
  tabIconSelected: GrayScale.gray900, // Changed from teal to dark gray

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
} as const;

// Dark theme colors
const darkTheme = {
  // Text colors
  text: GrayScale.gray100,
  textSecondary: GrayScale.gray400,
  textTertiary: GrayScale.gray500,
  textDisabled: GrayScale.gray600,

  // Background colors
  background: GrayScale.gray900,
  backgroundSecondary: GrayScale.gray800,
  backgroundTertiary: GrayScale.gray700,

  // UI elements
  card: GrayScale.gray800,
  cardHover: GrayScale.gray700,
  cardPressed: GrayScale.gray600,

  // Button colors
  buttonPrimary: '#1A1A1A', // Very dark gray buttons
  buttonPrimaryBorder: '#2C2C2E', // Subtle border for dark buttons
  buttonPrimaryText: GrayScale.white, // White text on dark buttons
  buttonDisabled: '#3A3A3C', // Medium gray for disabled
  buttonDisabledText: GrayScale.gray400, // Lighter gray text for disabled

  // Borders
  border: GrayScale.gray700,
  borderLight: GrayScale.gray800,
  borderDark: GrayScale.gray600,

  // Navigation
  tint: GrayScale.gray100, // Changed from white to light gray for softer appearance
  icon: GrayScale.gray400,
  tabIconDefault: GrayScale.gray500,
  tabIconSelected: GrayScale.gray100, // Changed to match tint

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
} as const;

// Main Colors export
export const Colors = {
  // System colors
  primary: GrayScale.gray900,
  primaryLight: GrayScale.gray700,
  primaryDark: GrayScale.gray100,

  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',

  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',

  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',

  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',

  // Theme variants
  light: lightTheme,
  dark: darkTheme,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Typography scales
export const Typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },

  // Font weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

// Border radius scale
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Helper function to get random muted color
export const getRandomMutedColor = (): string => {
  return MutedColors[Math.floor(Math.random() * MutedColors.length)];
};

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Export type for theme
export type Theme = typeof lightTheme;
export type ThemeColors = keyof Theme;
