import * as React from 'react';
import NextLink from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const linkVariants = cva(
  'transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] focus-visible:ring-opacity-30 focus-visible:rounded-sm',
  {
    variants: {
      variant: {
        primary: 'text-[#f7f8f8] hover:text-[#5e6ad2] text-sm font-medium no-underline',
        accent: 'text-[#5e6ad2] hover:text-[#6b77d9] text-sm font-medium no-underline',
        muted: 'text-[#8a8f98] hover:text-[#f7f8f8] text-sm no-underline',
        underline: 'text-[#5e6ad2] hover:text-[#6b77d9] text-sm font-medium underline underline-offset-2',
        ghost: 'text-[#f7f8f8] hover:text-[#5e6ad2] hover:bg-white/5 px-2 py-1 rounded-md text-sm font-medium no-underline',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base',
        xl: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    const linkClassName = cn(linkVariants({ variant, size, className }));

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          className={linkClassName}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        className={linkClassName}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);
Link.displayName = 'Link';

export { Link, linkVariants };