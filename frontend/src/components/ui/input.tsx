import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full border transition-all duration-200 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-300 rounded-sm px-4 py-3 text-sm text-[#222222] placeholder:text-[rgba(34,34,34,0.5)] focus:border-[#4C38D6] focus:ring-2 focus:ring-[#4C38D6]/10',
        search: 'bg-white border-gray-300 rounded-full px-4 py-2 text-sm text-[#222222] placeholder:text-[rgba(34,34,34,0.5)] focus:border-[#4C38D6] focus:ring-1 focus:ring-[#4C38D6]/20',
        minimal: 'bg-transparent border-b border-gray-300 rounded-none px-0 py-2 text-base text-[#222222] placeholder:text-[rgba(34,34,34,0.4)] focus:border-[#222222] focus:ring-0',
      },
      state: {
        default: '',
        error: 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10',
        success: 'border-[#10b981] focus:border-[#10b981] focus:ring-[#10b981]/10',
      },
      size: {
        default: 'h-12',
        sm: 'h-10 px-3 py-2 text-sm',
        lg: 'h-14 px-5 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, state, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, state, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };