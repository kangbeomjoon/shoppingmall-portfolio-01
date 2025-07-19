import { DataTable } from '@/components/admin/data-table/data-table';
import { ProductTableColumns } from '@/components/admin/data-table/product-table-columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';

// Mock data
const products = [
  {
    id: '1',
    name: 'MacBook Pro 14"',
    category: '전자제품',
    price: 2490000,
    stock: 15,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    category: '전자제품',
    price: 1350000,
    stock: 8,
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Nike Air Max',
    category: '신발',
    price: 180000,
    stock: 25,
    status: 'active',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    category: '전자제품',
    price: 1200000,
    stock: 3,
    status: 'low_stock',
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'Adidas Ultraboost',
    category: '신발',
    price: 220000,
    stock: 0,
    status: 'out_of_stock',
    createdAt: '2024-01-11',
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            상품 관리
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            총 {products.length}개의 상품이 등록되어 있습니다
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          상품 추가
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="상품명으로 검색..."
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
        columns={ProductTableColumns}
        data={products}
      />
    </div>
  );
}