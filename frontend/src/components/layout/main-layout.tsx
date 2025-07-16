import * as React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={cn('flex-1', className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}