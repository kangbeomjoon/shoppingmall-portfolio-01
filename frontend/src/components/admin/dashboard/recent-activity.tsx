import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Activity {
  id: string;
  type: 'order' | 'product' | 'user' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: '새로운 주문 생성',
    description: '홍길동님이 MacBook Pro를 주문했습니다.',
    timestamp: '2분 전',
    status: 'success',
  },
  {
    id: '2',
    type: 'product',
    title: '상품 재고 부족',
    description: 'iPhone 15 Pro의 재고가 10개 미만입니다.',
    timestamp: '15분 전',
    status: 'warning',
  },
  {
    id: '3',
    type: 'user',
    title: '신규 회원 가입',
    description: '김철수님이 회원가입을 완료했습니다.',
    timestamp: '1시간 전',
    status: 'info',
  },
  {
    id: '4',
    type: 'system',
    title: '시스템 백업 완료',
    description: '일일 데이터 백업이 성공적으로 완료되었습니다.',
    timestamp: '2시간 전',
    status: 'success',
  },
  {
    id: '5',
    type: 'order',
    title: '주문 취소',
    description: '이영희님이 주문을 취소했습니다.',
    timestamp: '3시간 전',
    status: 'error',
  },
];

function getStatusColor(status: Activity['status']) {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
}

function getTypeInitial(type: Activity['type']) {
  switch (type) {
    case 'order':
      return 'O';
    case 'product':
      return 'P';
    case 'user':
      return 'U';
    case 'system':
      return 'S';
    default:
      return 'A';
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getTypeInitial(activity.type)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}