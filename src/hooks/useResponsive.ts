import { Dimensions, PixelRatio } from "react-native";

// Ekran boyutları
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Breakpoints
export const BREAKPOINTS = {
  small: 375,
  medium: 768,
  large: 1024,
  extraLarge: 1200,
};

// Device türleri
export const isSmallDevice = SCREEN_WIDTH < BREAKPOINTS.small;
export const isMediumDevice =
  SCREEN_WIDTH >= BREAKPOINTS.small && SCREEN_WIDTH < BREAKPOINTS.medium;
export const isLargeDevice =
  SCREEN_WIDTH >= BREAKPOINTS.medium && SCREEN_WIDTH < BREAKPOINTS.large;
export const isExtraLargeDevice = SCREEN_WIDTH >= BREAKPOINTS.large;

// Tablet kontrolü
export const isTablet = SCREEN_WIDTH >= 768;
export const isPhone = SCREEN_WIDTH < 768;

// Responsive scaling fonksiyonları
export const scale = (size: number) => (SCREEN_WIDTH / 320) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / 568) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Pixel ratio bazlı scaling
export const scaleFont = (size: number) => size * PixelRatio.getFontScale();
export const scalePixel = (size: number) => size * PixelRatio.get();

// Responsive boyutlar
export const RESPONSIVE_DIMENSIONS = {
  // Padding & Margin
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),

  // Font sizes
  fontXS: moderateScale(10),
  fontSM: moderateScale(12),
  fontMD: moderateScale(14),
  fontLG: moderateScale(16),
  fontXL: moderateScale(18),
  fontXXL: moderateScale(20),
  fontTitle: moderateScale(24),
  fontLarge: moderateScale(32),

  // Border radius
  borderRadius: moderateScale(8),
  borderRadiusLG: moderateScale(12),
  borderRadiusXL: moderateScale(16),

  // Heights
  buttonHeight: verticalScale(48),
  inputHeight: verticalScale(44),
  headerHeight: verticalScale(60),

  // Icon sizes
  iconXS: moderateScale(12),
  iconSM: moderateScale(16),
  iconMD: moderateScale(20),
  iconLG: moderateScale(24),
  iconXL: moderateScale(32),
};

// Responsive width/height yüzdeleri
export const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
export const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

// Grid sistemi
export const getColumns = () => {
  if (isSmallDevice) return 1;
  if (isMediumDevice) return 2;
  if (isLargeDevice) return 3;
  return 4;
};

// Responsive container widths
export const getContainerWidth = () => {
  if (isSmallDevice) return wp(95);
  if (isMediumDevice) return wp(90);
  if (isLargeDevice) return wp(85);
  return wp(80);
};

// Responsive styles helper
export const createResponsiveStyle = (styles: any) => {
  return {
    small: isSmallDevice ? styles.small || {} : {},
    medium: isMediumDevice ? styles.medium || {} : {},
    large: isLargeDevice ? styles.large || {} : {},
    extraLarge: isExtraLargeDevice ? styles.extraLarge || {} : {},
  };
};

// Hook örneği (opsiyonel)
export const useResponsive = () => {
  return {
    isSmall: isSmallDevice,
    isMedium: isMediumDevice,
    isLarge: isLargeDevice,
    isExtraLarge: isExtraLargeDevice,
    isTablet,
    isPhone,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    scale,
    verticalScale,
    moderateScale,
    wp,
    hp,
    dimensions: RESPONSIVE_DIMENSIONS,
  };
};
