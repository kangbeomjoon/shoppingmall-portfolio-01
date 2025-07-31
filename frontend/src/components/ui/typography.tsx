import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Heading Variants
const headingVariants = cva(
  'font-bold text-[#222222] leading-normal m-0',
  {
    variants: {
      level: {
        h1: 'text-4xl', // 32px
        h2: 'text-3xl', // 24px  
        h3: 'text-2xl', // 20px
        h4: 'text-xl',  // 18px
        h5: 'text-lg',  // 16px
        h6: 'text-base', // 14px
      },
      responsive: {
        true: 'text-2xl md:text-4xl', // 모바일 24px, 데스크톱 32px
        false: '',
      },
    },
    defaultVariants: {
      level: 'h1',
      responsive: false,
    },
  }
);

// Paragraph Variants
const paragraphVariants = cva(
  'text-[#222222] m-0',
  {
    variants: {
      size: {
        large: 'text-5xl leading-[48px]', // 40px
        base: 'text-lg leading-[19.2px]',  // 16px
        small: 'text-xs leading-[14.4px]', // 12px
      },
      color: {
        primary: 'text-[#222222]',
        muted: 'text-[rgba(0,0,0,0.533)]',
        light: 'text-[rgba(34,34,34,0.8)]',
        brand: 'text-[#4C38D6]',
      },
    },
    defaultVariants: {
      size: 'base',
      color: 'primary',
    },
  }
);

// Link Variants  
const linkVariants = cva(
  'text-[rgba(34,34,34,0.8)] no-underline text-xs font-normal transition-opacity duration-200 hover:opacity-80',
  {
    variants: {
      variant: {
        default: 'text-[rgba(34,34,34,0.8)]',
        primary: 'text-[#222222]',
        brand: 'text-[#4C38D6]',
        muted: 'text-[rgba(34,34,34,0.5)]',
      },
      size: {
        sm: 'text-xs',
        base: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

// Heading Component
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, responsive, as, ...props }, ref) => {
    const Component = as || level || 'h1';
    
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ level: level || (as as any), responsive, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

// Paragraph Component
export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, size, color, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(paragraphVariants({ size, color, className }))}
      {...props}
    />
  )
);
Paragraph.displayName = 'Paragraph';

// Text Component (span)
export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof paragraphVariants> {}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, size, color, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(paragraphVariants({ size, color, className }))}
      {...props}
    />
  )
);
Text.displayName = 'Text';

// Link Component (updated from previous)
export interface PrimeLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  external?: boolean;
}

const PrimeLink = React.forwardRef<HTMLAnchorElement, PrimeLinkProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <a
        ref={ref}
        href={href}
        className={cn(linkVariants({ variant, size, className }))}
        {...linkProps}
        {...props}
      >
        {children}
      </a>
    );
  }
);
PrimeLink.displayName = 'PrimeLink';

export { Heading, Paragraph, Text, PrimeLink, headingVariants, paragraphVariants, linkVariants };