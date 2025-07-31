// Prime Design System - UI Components Index
// 중앙화된 컴포넌트 export

// Core UI Components
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

export { Input, inputVariants } from './input'; 
export type { InputProps } from './input';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants } from './card';
export type { CardProps } from './card';

export { Badge, badgeVariants } from './badge';
export type { BadgeProps } from './badge';

export { Avatar, AvatarFallback, AvatarImage, avatarVariants } from './avatar';
export type { AvatarProps } from './avatar';

// Prime Specific Components
export { Heading, Paragraph, Text, PrimeLink, headingVariants, paragraphVariants, linkVariants } from './typography';
export type { HeadingProps, ParagraphProps, TextProps, PrimeLinkProps } from './typography';

export { ProductCard } from './product-card';
export type { ProductCardProps } from './product-card';

export { Navigation, Menu, MenuItem, Logo, Breadcrumb, navigationVariants, menuItemVariants } from './navigation';
export type { NavigationProps, MenuProps, MenuItemProps, LogoProps, BreadcrumbProps } from './navigation';

// Complex Components (existing)
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

// Existing Components (unchanged)
export { Checkbox } from './checkbox';
export { ImageUpload } from './image-upload';
export { Label } from './label';
export { Loading } from './loading';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { Separator } from './separator';
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './table';
export { Textarea } from './textarea';
export { toast, useToast, Toaster } from './toast';

// Type Exports
export type {
  PrimeThemeColors,
  PrimeButtonVariant,
  PrimeButtonSize,
  PrimeInputVariant,
  PrimeInputState,
  PrimeInputSize,
  PrimeCardVariant,  
  PrimeCardSize,
  PrimeBadgeVariant,
  PrimeBadgeSize,
  PrimeAvatarSize,
  PrimeLinkVariant,
  PrimeLinkSize,
  PrimeTypographySize,
  PrimeTypographyColor,
  PrimeProduct,
  PrimeNavigationVariant,
  PrimeMenuDirection,
  PrimeMenuItemVariant,
  BaseComponentProps,
  ComponentWithVariant,
  ComponentWithSize,
  ComponentWithVariantAndSize,
  PrimeDesignTokens,
  PrimeThemeConfig,
} from '../types/ui';