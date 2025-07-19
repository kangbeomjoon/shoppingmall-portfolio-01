import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  BarChart3 
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant: 'default' | 'outline' | 'secondary';
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: '상품 추가',
    description: '새로운 상품을 등록하세요',
    icon: Plus,
    href: '/admin/products/new',
    variant: 'default',
  },
  {
    id: '2',
    title: '재고 관리',
    description: '상품 재고를 확인하고 관리하세요',
    icon: Package,
    href: '/admin/products?tab=inventory',
    variant: 'outline',
  },
  {
    id: '3',
    title: '고객 관리',
    description: '고객 정보를 조회하고 관리하세요',
    icon: Users,
    href: '/admin/users',
    variant: 'outline',
  },
  {
    id: '4',
    title: '보고서 생성',
    description: '매출 및 운영 보고서를 생성하세요',
    icon: FileText,
    href: '/admin/reports',
    variant: 'outline',
  },
  {
    id: '5',
    title: '분석 보기',
    description: '상세한 분석 데이터를 확인하세요',
    icon: BarChart3,
    href: '/admin/analytics',
    variant: 'outline',
  },
  {
    id: '6',
    title: '설정 관리',
    description: '시스템 설정을 변경하세요',
    icon: Settings,
    href: '/admin/settings',
    variant: 'secondary',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">빠른 작업</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className="h-auto flex flex-col items-start space-y-1 p-4"
              asChild
            >
              <a href={action.href}>
                <div className="flex items-center space-x-2 w-full">
                  <action.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <p className="text-xs text-left text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}