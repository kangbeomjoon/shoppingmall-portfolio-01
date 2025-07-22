'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/admin/overview';
import { RecentOrders } from '@/components/admin/recent-orders';
import {
  Users,
  CreditCard,
  Package,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react';

const stats = [
  {
    title: '총 매출',
    value: '₩4,231,000',
    description: '+20.1% from last month',
    icon: CreditCard,
    trend: 'up',
  },
  {
    title: '신규 주문',
    value: '23',
    description: '+15% from last week',
    icon: ShoppingCart,
    trend: 'up',
  },
  {
    title: '회원 수',
    value: '1,234',
    description: '+12 new users',
    icon: Users,
    trend: 'up',
  },
  {
    title: '상품 재고',
    value: '45',
    description: '5 items low stock',
    icon: Package,
    trend: 'down',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        <p className="text-muted-foreground">
          쇼핑몰의 전반적인 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={cn(
                  "text-xs",
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>매출 현황</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            알림
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Package className="h-5 w-5 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">재고 부족 경고</p>
                <p className="text-sm text-muted-foreground">
                  5개 상품의 재고가 10개 미만입니다.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">매출 증가</p>
                <p className="text-sm text-muted-foreground">
                  이번 주 매출이 지난주 대비 15% 증가했습니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}