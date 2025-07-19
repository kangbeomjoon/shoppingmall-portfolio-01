import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Column } from './data-table';
import { Eye, Edit, Printer } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  items: number;
  createdAt: string;
}

function getStatusBadge(status: Order['status']) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">대기중</Badge>;
    case 'processing':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">처리중</Badge>;
    case 'shipped':
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">배송중</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">완료</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">취소</Badge>;
    default:
      return <Badge>알 수 없음</Badge>;
  }
}

export const OrderTableColumns: Column<Order>[] = [
  {
    header: '주문번호',
    accessorKey: 'id',
    cell: (value) => (
      <div className="font-medium text-gray-900 dark:text-white">
        {value}
      </div>
    ),
  },
  {
    header: '고객명',
    accessorKey: 'customerName',
    cell: (value, row) => (
      <div>
        <div className="font-medium text-gray-900 dark:text-white">
          {value}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.email}
        </div>
      </div>
    ),
  },
  {
    header: '주문 금액',
    accessorKey: 'total',
    cell: (value) => (
      <div className="font-medium">
        ₩{value.toLocaleString()}
      </div>
    ),
  },
  {
    header: '상품 수',
    accessorKey: 'items',
    cell: (value) => (
      <div className="text-center">
        {value}개
      </div>
    ),
  },
  {
    header: '상태',
    accessorKey: 'status',
    cell: (value) => getStatusBadge(value),
  },
  {
    header: '주문일',
    accessorKey: 'createdAt',
    cell: (value) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(value).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    ),
  },
  {
    header: '작업',
    accessorKey: 'id',
    cell: (value, row) => (
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];