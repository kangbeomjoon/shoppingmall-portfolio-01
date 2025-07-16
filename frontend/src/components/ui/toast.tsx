'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

const toastVariants = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-black',
};

export function Toast() {
  const { toast, hideToast } = useUIStore();

  if (!toast || !toast.isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg',
          toastVariants[toast.type]
        )}
      >
        <span className="text-sm font-medium">{toast.message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={hideToast}
          className="h-6 w-6 p-0 hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ToastProvider() {
  return <Toast />;
}