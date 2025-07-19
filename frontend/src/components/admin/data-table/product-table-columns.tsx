import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Column } from './data-table';
import { Edit, Eye, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock';
  createdAt: string;
}

function getStatusBadge(status: Product['status']) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">활성</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">비활성</Badge>;
    case 'low_stock':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">재고 부족</Badge>;
    case 'out_of_stock':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">재고 없음</Badge>;
    default:
      return <Badge>알 수 없음</Badge>;
  }
}

export const ProductTableColumns: Column<Product>[] = [
  {
    header: '상품명',
    accessorKey: 'name',
    cell: (value, row) => (
      <div className="font-medium text-gray-900 dark:text-white">
        {value}
      </div>
    ),
  },
  {
    header: '카테고리',
    accessorKey: 'category',
  },
  {
    header: '가격',
    accessorKey: 'price',
    cell: (value) => (
      <div className="font-medium">
        ₩{value.toLocaleString()}
      </div>
    ),
  },
  {
    header: '재고',
    accessorKey: 'stock',
    cell: (value, row) => (
      <div className={`font-medium ${
        row.stock === 0 ? 'text-red-600' : 
        row.stock < 10 ? 'text-yellow-600' : 
        'text-gray-900 dark:text-white'
      }`}>
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
    header: '등록일',
    accessorKey: 'createdAt',
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
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];