import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { KreamLink } from './typography';

// Navigation Container
const navigationVariants = cva(
  'w-full transition-all duration-200',
  {
    variants: {
      variant: {
        header: 'h-auto bg-transparent static p-0 shadow-none border-none',
        sidebar: 'h-full bg-white border-r border-gray-200',
        footer: 'bg-white border-t border-gray-200',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'header',
      padding: 'none',
    },
  }
);

// Menu Item Variants
const menuItemVariants = cva(
  'no-underline transition-all duration-200',
  {
    variants: {
      variant: {
        main: 'text-xl font-normal text-[#222222] p-0 hover:opacity-80',
        mainActive: 'text-xl font-bold text-[#222222] p-0',
        sub: 'text-xs text-[rgba(34,34,34,0.8)] font-normal hover:opacity-80',
        footer: 'text-sm text-[#222222] font-normal hover:opacity-80',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-xl',
      },
    },
    defaultVariants: {
      variant: 'main',
    },
  }
);

// Navigation Component
export interface NavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navigationVariants> {
  as?: 'nav' | 'header' | 'footer' | 'aside';
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, variant, padding, as = 'nav', ...props }, ref) => {
    const Component = as;
    
    return (
      <Component
        ref={ref}
        className={cn(navigationVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);
Navigation.displayName = 'Navigation';

// Menu Component
export interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {
  direction?: 'horizontal' | 'vertical';
  gap?: 'sm' | 'md' | 'lg';
}

const Menu = React.forwardRef<HTMLUListElement, MenuProps>(
  ({ className, direction = 'horizontal', gap = 'md', ...props }, ref) => {
    const gapClass = {
      sm: direction === 'horizontal' ? 'gap-4' : 'gap-2',
      md: direction === 'horizontal' ? 'gap-6' : 'gap-3',
      lg: direction === 'horizontal' ? 'gap-8' : 'gap-4',
    };

    return (
      <ul
        ref={ref}
        className={cn(
          'list-none m-0 p-0 flex',
          direction === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          gapClass[gap],
          className
        )}
        {...props}
      />
    );
  }
);
Menu.displayName = 'Menu';

// Menu Item Component
export interface MenuItemProps
  extends React.HTMLAttributes<HTMLLIElement> {
  href?: string;
  active?: boolean;
  variant?: 'main' | 'sub' | 'footer';
  external?: boolean;
}

const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  ({ className, href, active, variant = 'main', external, children, ...props }, ref) => {
    const itemVariant = active && variant === 'main' ? 'mainActive' : variant;
    
    return (
      <li
        ref={ref}
        className={cn('flex', className)}
        {...props}
      >
        {href ? (
          <KreamLink
            href={href}
            external={external}
            className={cn(menuItemVariants({ variant: itemVariant }))}
          >
            {children}
          </KreamLink>
        ) : (
          <span className={cn(menuItemVariants({ variant: itemVariant }))}>
            {children}
          </span>
        )}
      </li>
    );
  }
);
MenuItem.displayName = 'MenuItem';

// Logo Component
export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, href = '/', size = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-20 h-20',
      lg: 'w-24 h-24',
    };

    const LogoContent = (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center font-bold text-[#222222]',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children || 'KREAM'}
      </div>
    );

    if (href) {
      return (
        <KreamLink href={href} className="no-underline">
          {LogoContent}
        </KreamLink>
      );
    }

    return LogoContent;
  }
);
Logo.displayName = 'Logo';

// Breadcrumb Component
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator = '>', children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('flex items-center text-sm text-[rgba(34,34,34,0.8)]', className)}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="mx-2 text-[rgba(34,34,34,0.5)]">{separator}</span>
          )}
          {child}
        </React.Fragment>
      ))}
    </nav>
  )
);
Breadcrumb.displayName = 'Breadcrumb';

export { 
  Navigation, 
  Menu, 
  MenuItem, 
  Logo, 
  Breadcrumb,
  navigationVariants,
  menuItemVariants 
};