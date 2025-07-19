'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Tags,
  FileText,
} from 'lucide-react';

const navigation = [
  { name: '대시보드', href: '/admin', icon: LayoutDashboard },
  { name: '상품 관리', href: '/admin/products', icon: Package },
  { name: '주문 관리', href: '/admin/orders', icon: ShoppingCart },
  { name: '고객 관리', href: '/admin/users', icon: Users },
  { name: '카테고리', href: '/admin/categories', icon: Tags },
  { name: '분석', href: '/admin/analytics', icon: BarChart3 },
  { name: '보고서', href: '/admin/reports', icon: FileText },
  { name: '설정', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link
            href="/admin"
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Admin
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                )}
              />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex items-center px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                관리자
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}