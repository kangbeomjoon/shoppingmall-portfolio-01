// Prime Design System UI Component Types

export interface PrimeThemeColors {
  brand: {
    primary: string;
    light: string;
  };
  neutral: {
    white: string;
    background: string;
    backgroundSecondary: string;
    black: string;
    gray900: string;
    gray800: string;
    gray700: string;
    gray600: string;
    gray500: string;
    gray400: string;
    gray300: string;
    gray200: string;
    lightGray: string;
  };
  accent: {
    purple: string;
    overlay: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface PrimeButtonVariant {
  primary: 'primary';
  secondary: 'secondary';
  ghost: 'ghost';
  circular: 'circular';
  destructive: 'destructive';
}

export interface PrimeButtonSize {
  default: 'default';
  sm: 'sm';
  lg: 'lg';
  icon: 'icon';
  wide: 'wide';
}

export interface PrimeInputVariant {
  default: 'default';
  search: 'search';
  minimal: 'minimal';
}

export interface PrimeInputState {
  default: 'default';
  error: 'error';
  success: 'success';
}

export interface PrimeInputSize {
  default: 'default';
  sm: 'sm';
  lg: 'lg';
}

export interface PrimeCardVariant {
  product: 'product';
  productWithMargin: 'productWithMargin';
  default: 'default';
  minimal: 'minimal';
  elevated: 'elevated';
}

export interface PrimeCardSize {
  default: 'default';
  sm: 'sm';
  lg: 'lg';
  none: 'none';
}

export interface PrimeBadgeVariant {
  primary: 'primary';
  brand: 'brand';
  success: 'success';
  warning: 'warning';
  error: 'error';
  secondary: 'secondary';
  outline: 'outline';
}

export interface PrimeBadgeSize {
  default: 'default';
  sm: 'sm';
  lg: 'lg';
}

export interface PrimeAvatarSize {
  sm: 'sm';
  default: 'default';
  md: 'md';
  lg: 'lg';
  xl: 'xl';
}

export interface PrimeLinkVariant {
  default: 'default';
  primary: 'primary';
  brand: 'brand';
  muted: 'muted';
}

export interface PrimeLinkSize {
  sm: 'sm';
  base: 'base';
  lg: 'lg';
}

export interface PrimeTypographySize {
  xs: 'xs';
  sm: 'sm';
  base: 'base';
  lg: 'lg';
  xl: 'xl';
  '2xl': '2xl';
  '3xl': '3xl';
  '4xl': '4xl';
  '5xl': '5xl';
}

export interface PrimeTypographyColor {
  primary: 'primary';
  muted: 'muted';
  light: 'light';
  brand: 'brand';
}

// Product Types
export interface PrimeProduct {
  id: string;
  name: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  imageUrl: string;
  category?: string;
  isNew?: boolean;
  isSoldOut?: boolean;
  discount?: number;
}

// Navigation Types
export interface PrimeNavigationVariant {
  header: 'header';
  sidebar: 'sidebar';
  footer: 'footer';
}

export interface PrimeMenuDirection {
  horizontal: 'horizontal';
  vertical: 'vertical';
}

export interface PrimeMenuItemVariant {
  main: 'main';
  mainActive: 'mainActive';
  sub: 'sub';
  footer: 'footer';
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ComponentWithVariant<T> extends BaseComponentProps {
  variant?: keyof T;
}

export interface ComponentWithSize<T> extends BaseComponentProps {
  size?: keyof T;
}

export interface ComponentWithVariantAndSize<V, S> extends BaseComponentProps {
  variant?: keyof V;
  size?: keyof S;
}

// Design Token Types
export interface PrimeDesignTokens {
  colors: PrimeThemeColors;
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  interactions: {
    transitions: {
      default: string;
      hover: Record<string, string>;
    };
    hover: {
      opacity: number;
      transform: string;
    };
  };
  layout: {
    container: Record<string, string>;
    grid: Record<string, any>;
    sections: Record<string, Record<string, string>>;
  };
  breakpoints: Record<string, string>;
}

// Theme Configuration
export interface PrimeThemeConfig {
  siteInfo: {
    name: string;
    fullName: string;
    description: string;
    category: string;
    favicon: string;
  };
  designSystem: PrimeDesignTokens;
  components: {
    navigation: Record<string, any>;
    buttons: Record<string, any>;
    cards: Record<string, any>;
    images: Record<string, any>;
    typography: Record<string, any>;
  };
  branding: {
    logo: Record<string, any>;
    voice: Record<string, any>;
  };
  patterns: Record<string, any>;
  responsive: Record<string, any>;
  accessibility: Record<string, any>;
  performance: Record<string, any>;
}