import { StatsCard } from '@/components/admin/dashboard/stats-card';
import { RecentActivity } from '@/components/admin/dashboard/recent-activity';
import { QuickActions } from '@/components/admin/dashboard/quick-actions';
import { AnalyticsChart } from '@/components/admin/dashboard/analytics-chart';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp 
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          관리자 대시보드
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          쇼핑몰 운영 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 상품 수"
          value="1,234"
          change="+12%"
          changeType="positive"
          icon={Package}
        />
        <StatsCard
          title="주문 수"
          value="856"
          change="+8%"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatsCard
          title="고객 수"
          value="2,468"
          change="+15%"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="매출액"
          value="₩12,345,678"
          change="+23%"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AnalyticsChart />
          <QuickActions />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}