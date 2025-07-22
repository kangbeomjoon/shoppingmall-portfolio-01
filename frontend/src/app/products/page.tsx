'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading';
import { ProductGrid } from '@/components/product/product-card';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
  { value: 'name', label: '이름순' },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(Number(searchParams.get('page')) || 1);
  const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = React.useState(searchParams.get('sortBy') || 'latest');
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Parse sort options
  const sortField = sortBy === 'price-low' || sortBy === 'price-high' ? 'price' : 
                    sortBy === 'name' ? 'name' : 'createdAt';
  const sortOrder = sortBy === 'price-low' ? 'asc' : 
                    sortBy === 'price-high' ? 'desc' : 
                    sortBy === 'name' ? 'asc' : 'desc';
  
  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page,
    limit: 12,
    categoryId: selectedCategory || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: sortField,
    sortOrder,
  });
  
  // Fetch categories
  const { data: categoriesData } = useCategories();

  // Update URL when filters change
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'latest') params.set('sortBy', sortBy);
    if (page > 1) params.set('page', page.toString());
    
    const currentParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentParams.toString()) {
      router.push(`/products?${params.toString()}`);
    }
  }, [selectedCategory, sortBy, page, router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.delete('page');
    setPage(1);
    router.push(`/products?${params.toString()}`);
  };
  
  const categories = React.useMemo(() => {
    if (!categoriesData) return [];
    return [{ id: '', name: '전체', slug: 'all' }, ...categoriesData];
  }, [categoriesData]);
  
  const products = productsData?.data || [];
  const pagination = productsData?.pagination;

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setPage(1);
                      }}
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
                      onClick={() => {
                        setSortBy(option.value);
                        setPage(1);
                      }}
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
            총 {pagination?.total || 0}개 상품
          </span>
          {searchParams.get('search') && (
            <Badge variant="secondary">
              "{searchParams.get('search')}" 검색 결과
            </Badge>
          )}
          {selectedCategory && (
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
      {productsLoading ? (
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
              router.push('/products');
            }}
            variant="outline"
          >
            전체 상품 보기
          </Button>
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevPage}
          >
            이전
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNumber;
              if (pagination.totalPages <= 5) {
                pageNumber = i + 1;
              } else if (page <= 3) {
                pageNumber = i + 1;
              } else if (page >= pagination.totalPages - 2) {
                pageNumber = pagination.totalPages - 4 + i;
              } else {
                pageNumber = page - 2 + i;
              }
              
              if (pageNumber < 1 || pageNumber > pagination.totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={page === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  className="w-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={!pagination.hasNextPage}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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
      </div>
    }>
      <ProductsContent />
    </React.Suspense>
  );
}