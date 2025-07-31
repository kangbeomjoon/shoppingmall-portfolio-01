import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#4C38D6] focus-visible:ring-opacity-30 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-[#222222] text-[#FAFAFA] border-none rounded-none px-[14px] text-xs font-bold cursor-pointer hover:opacity-80 transition-all duration-200',
        secondary: 'bg-transparent text-[#222222] border-none rounded-sm px-[10px] py-[40px] text-[13.3333px] font-normal cursor-pointer hover:opacity-80 hover:bg-black/5 transition-opacity duration-200',
        ghost: 'bg-transparent text-[#222222] border-none rounded-none p-0 text-[13.3333px] font-normal cursor-pointer hover:opacity-80 transition-all duration-200',
        circular: 'bg-[#FFFFFF] text-[#222222] border-none rounded-3xl px-0 pt-1 pb-0 text-[13.3333px] font-normal',
        destructive: 'bg-[#ef4444] text-white border-none rounded-none px-[14px] text-xs font-bold cursor-pointer hover:opacity-80',
      },
      size: {
        default: 'h-auto py-2',
        sm: 'h-auto py-1.5 px-3 text-xs',
        lg: 'h-auto py-3 px-6 text-sm',
        icon: 'h-10 w-10 p-0',
        wide: 'py-[40px] px-[10px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };