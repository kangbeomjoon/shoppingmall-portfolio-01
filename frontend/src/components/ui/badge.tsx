import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border-none font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-[#222222] text-[#FAFAFA] rounded-sm px-2 py-1 text-xs font-bold',
        brand: 'bg-[#4C38D6] text-white rounded-sm px-2 py-1 text-xs font-medium',
        success: 'bg-[#10b981] text-white rounded-sm px-2 py-1 text-xs font-medium',
        warning: 'bg-[#f59e0b] text-white rounded-sm px-2 py-1 text-xs font-medium',
        error: 'bg-[#ef4444] text-white rounded-sm px-2 py-1 text-xs font-medium',
        secondary: 'bg-gray-100 text-[#222222] rounded-sm px-2 py-1 text-xs font-normal',
        outline: 'bg-transparent border border-gray-300 text-[#222222] rounded-sm px-2 py-1 text-xs font-normal',
      },
      size: {
        default: 'px-2 py-1 text-xs',
        sm: 'px-1.5 py-0.5 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };