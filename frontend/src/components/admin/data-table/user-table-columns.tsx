import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Column } from './data-table';
import { Edit, Eye, Mail, UserX } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastLogin: string;
}

function getStatusBadge(status: User['status']) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">활성</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">비활성</Badge>;
    case 'blocked':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">차단</Badge>;
    default:
      return <Badge>알 수 없음</Badge>;
  }
}

function getRoleBadge(role: User['role']) {
  switch (role) {
    case 'admin':
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">관리자</Badge>;
    case 'customer':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">고객</Badge>;
    default:
      return <Badge>알 수 없음</Badge>;
  }
}

export const UserTableColumns: Column<User>[] = [
  {
    header: '사용자',
    accessorKey: 'name',
    cell: (value, row) => (
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {value.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: '역할',
    accessorKey: 'role',
    cell: (value) => getRoleBadge(value),
  },
  {
    header: '상태',
    accessorKey: 'status',
    cell: (value) => getStatusBadge(value),
  },
  {
    header: '주문 수',
    accessorKey: 'totalOrders',
    cell: (value) => (
      <div className="text-center">
        {value}건
      </div>
    ),
  },
  {
    header: '총 구매액',
    accessorKey: 'totalSpent',
    cell: (value) => (
      <div className="font-medium">
        ₩{value.toLocaleString()}
      </div>
    ),
  },
  {
    header: '가입일',
    accessorKey: 'joinedAt',
    cell: (value) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(value).toLocaleDateString('ko-KR')}
      </div>
    ),
  },
  {
    header: '마지막 로그인',
    accessorKey: 'lastLogin',
    cell: (value) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(value).toLocaleDateString('ko-KR')}
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
          <Mail className="h-4 w-4" />
        </Button>
        {row.role !== 'admin' && (
          <Button size="sm" variant="ghost">
            <UserX className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
];