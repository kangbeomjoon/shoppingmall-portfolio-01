'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading';
import { ProductGrid } from '@/components/product/product-card';
import { Product } from '@/types';

// Mock data - 실제로는 API에서 가져올 예정
const mockProducts: Product[] = [
  {
    id: '1',
    name: '클래식 화이트 셔츠',
    description: '편안한 착용감과 깔끔한 디자인의 기본 화이트 셔츠입니다.',
    price: 59000,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400',
    categoryId: 'clothing',
    category: { id: 'clothing', name: '의류', slug: 'clothing' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: '블루투스 헤드폰',
    description: '고음질 사운드와 뛰어난 노이즈 캔슬링 기능을 제공합니다.',
    price: 199000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryId: 'electronics',
    category: { id: 'electronics', name: '전자제품', slug: 'electronics' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: '레더 백팩',
    description: '고급 가죽으로 제작된 실용적이고 세련된 백팩입니다.',
    price: 159000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    categoryId: 'bags',
    category: { id: 'bags', name: '가방', slug: 'bags' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    name: '클래식 스니커즈',
    description: '편안함과 스타일을 모두 갖춘 클래식 디자인의 스니커즈입니다.',
    price: 129000,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    categoryId: 'shoes',
    category: { id: 'shoes', name: '신발', slug: 'shoes' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '5',
    name: '데님 재킷',
    description: '트렌디한 디자인의 데님 재킷으로 어떤 스타일에도 잘 어울립니다.',
    price: 89000,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
    categoryId: 'clothing',
    category: { id: 'clothing', name: '의류', slug: 'clothing' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '6',
    name: '편안한 기본 티셔츠',
    description: '부드러운 소재로 만든 데일리 착용하기 좋은 기본 티셔츠입니다.',
    price: 29000,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    categoryId: 'clothing',
    category: { id: 'clothing', name: '의류', slug: 'clothing' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '7',
    name: '스마트 워치',
    description: '건강 관리와 알림 기능을 갖춘 스마트 워치입니다.',
    price: 299000,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoryId: 'electronics',
    category: { id: 'electronics', name: '전자제품', slug: 'electronics' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '8',
    name: '무선 충전기',
    description: '빠르고 안전한 무선 충전을 제공하는 충전 패드입니다.',
    price: 45000,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    categoryId: 'electronics',
    category: { id: 'electronics', name: '전자제품', slug: 'electronics' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

const categories = [
  { id: 'all', name: '전체', slug: 'all' },
  { id: 'clothing', name: '의류', slug: 'clothing' },
  { id: 'electronics', name: '전자제품', slug: 'electronics' },
  { id: 'bags', name: '가방', slug: 'bags' },
  { id: 'shoes', name: '신발', slug: 'shoes' },
];

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
  { value: 'name', label: '이름순' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('latest');
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 실제로는 API 호출: await apiClient.getProducts({ search: searchQuery, category: selectedCategory, sortBy })
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let filteredProducts = mockProducts;
        
        // Filter by search query
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Filter by category
        if (selectedCategory !== 'all') {
          filteredProducts = filteredProducts.filter(product =>
            product.categoryId === selectedCategory
          );
        }
        
        // Sort products
        filteredProducts.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'name':
              return a.name.localeCompare(b.name);
            case 'latest':
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">상품 목록</h1>
        <p className="text-muted-foreground">
          다양한 상품을 둘러보고 원하는 상품을 찾아보세요
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="상품 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>

        {/* Filter Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            필터 {showFilters ? '숨기기' : '보기'}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">필터</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-2">카테고리</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-medium mb-2">정렬</h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            총 {products.length}개 상품
          </span>
          {searchQuery && (
            <Badge variant="secondary">
              "{searchQuery}" 검색 결과
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary">
              {categories.find(c => c.id === selectedCategory)?.name}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {sortOptions.find(s => s.value === sortBy)?.label}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">검색 결과가 없습니다</p>
            <p className="text-sm">다른 검색어를 시도해보세요</p>
          </div>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            variant="outline"
          >
            전체 상품 보기
          </Button>
        </div>
      )}

      {/* Load More Button (if needed) */}
      {products.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            더 많은 상품 보기
          </Button>
        </div>
      )}
    </div>
  );
}