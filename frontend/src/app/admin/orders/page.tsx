import { DataTable } from '@/components/admin/data-table/data-table';
import { OrderTableColumns } from '@/components/admin/data-table/order-table-columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download } from 'lucide-react';

// Mock data
const orders = [
  {
    id: 'ORD-001',
    customerName: '홍길동',
    email: 'hong@example.com',
    total: 2490000,
    status: 'completed',
    items: 1,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'ORD-002',
    customerName: '김철수',
    email: 'kim@example.com',
    total: 1530000,
    status: 'processing',
    items: 2,
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: 'ORD-003',
    customerName: '이영희',
    email: 'lee@example.com',
    total: 180000,
    status: 'shipped',
    items: 1,
    createdAt: '2024-01-14T16:45:00Z',
  },
  {
    id: 'ORD-004',
    customerName: '박민수',
    email: 'park@example.com',
    total: 400000,
    status: 'pending',
    items: 3,
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: 'ORD-005',
    customerName: '최수정',
    email: 'choi@example.com',
    total: 220000,
    status: 'cancelled',
    items: 1,
    createdAt: '2024-01-13T11:10:00Z',
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            주문 관리
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            총 {orders.length}개의 주문이 있습니다
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          주문 내역 다운로드
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="주문번호 또는 고객명으로 검색..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          필터
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={OrderTableColumns}
        data={orders}
      />
    </div>
  );
}