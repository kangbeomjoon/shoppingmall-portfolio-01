import { DataTable } from '@/components/admin/data-table/data-table';
import { UserTableColumns } from '@/components/admin/data-table/user-table-columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, UserPlus } from 'lucide-react';

// Mock data
const users = [
  {
    id: '1',
    name: '홍길동',
    email: 'hong@example.com',
    role: 'customer',
    status: 'active',
    totalOrders: 5,
    totalSpent: 3500000,
    joinedAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '김철수',
    email: 'kim@example.com',
    role: 'customer',
    status: 'active',
    totalOrders: 3,
    totalSpent: 1800000,
    joinedAt: '2024-01-05T00:00:00Z',
    lastLogin: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    name: '이영희',
    email: 'lee@example.com',
    role: 'customer',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 180000,
    joinedAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-12T16:45:00Z',
  },
  {
    id: '4',
    name: '박민수',
    email: 'park@example.com',
    role: 'customer',
    status: 'active',
    totalOrders: 8,
    totalSpent: 5200000,
    joinedAt: '2023-12-15T00:00:00Z',
    lastLogin: '2024-01-14T14:20:00Z',
  },
  {
    id: '5',
    name: '관리자',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    totalOrders: 0,
    totalSpent: 0,
    joinedAt: '2023-01-01T00:00:00Z',
    lastLogin: '2024-01-15T12:00:00Z',
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            고객 관리
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            총 {users.length}명의 사용자가 등록되어 있습니다
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          사용자 추가
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="이름 또는 이메일로 검색..."
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
        columns={UserTableColumns}
        data={users}
      />
    </div>
  );
}