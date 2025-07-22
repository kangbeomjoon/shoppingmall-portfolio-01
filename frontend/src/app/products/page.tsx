'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, X, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { RangeSlider } from '@/components/ui/range-slider';
import { ProductGrid } from '@/components/product/product-card';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { formatPrice } from '@/lib/utils';

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
  { value: 'name', label: '이름순' },
];

// 인기 검색어 예시 (실제로는 API에서 가져와야 함)
const popularSearches = ['노트북', '키보드', '마우스', '모니터', '헤드폰'];

// 최근 검색어를 로컬 스토리지에서 가져오는 함수
const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('recentSearches');
  return saved ? JSON.parse(saved) : [];
};

// 최근 검색어 저장 함수
const saveRecentSearch = (search: string) => {
  if (typeof window === 'undefined' || !search.trim()) return;
  
  const recent = getRecentSearches();
  const updated = [search, ...recent.filter(s => s !== search)].slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(updated));
};

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(Number(searchParams.get('page')) || 1);
  const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = React.useState(searchParams.get('sortBy') || 'latest');
  const [showFilters, setShowFilters] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000000]);
  const [showSearchSuggestions, setShowSearchSuggestions] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  
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
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000000 ? priceRange[1] : undefined,
  });
  
  // Fetch categories
  const { data: categoriesData } = useCategories();
  
  // Load recent searches on mount
  React.useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

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
      saveRecentSearch(searchInput);
      setRecentSearches(getRecentSearches());
    } else {
      params.delete('search');
    }
    params.delete('page');
    setPage(1);
    setShowSearchSuggestions(false);
    router.push(`/products?${params.toString()}`);
  };
  
  const handleSearchSuggestion = (suggestion: string) => {
    setSearchInput(suggestion);
    const params = new URLSearchParams(searchParams);
    params.set('search', suggestion);
    params.delete('page');
    setPage(1);
    setShowSearchSuggestions(false);
    saveRecentSearch(suggestion);
    setRecentSearches(getRecentSearches());
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
        <div className="relative max-w-md mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="상품 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              className="pl-10"
            />
            {searchInput && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setSearchInput('');
                  const params = new URLSearchParams(searchParams);
                  params.delete('search');
                  router.push(`/products?${params.toString()}`);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
          
          {/* Search Suggestions */}
          {showSearchSuggestions && (searchInput || recentSearches.length > 0 || popularSearches.length > 0) && (
            <Card className="absolute top-full mt-2 w-full z-50">
              <CardContent className="p-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && !searchInput && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      최근 검색어
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                        onClick={() => handleSearchSuggestion(search)}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Popular Searches */}
                {popularSearches.length > 0 && !searchInput && (
                  <div>
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      인기 검색어
                    </div>
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                        onClick={() => handleSearchSuggestion(search)}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

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
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">상세 필터</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('');
                    setSortBy('latest');
                    setPriceRange([0, 1000000]);
                    setPage(1);
                  }}
                >
                  초기화
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  카테고리
                </h3>
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
                      {category._count?.products && category.id && (
                        <Badge variant="secondary" className="ml-1">
                          {category._count.products}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium mb-3">가격 범위</h3>
                <div className="space-y-3">
                  <RangeSlider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000000}
                    step={10000}
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatPrice(priceRange[0])}
                    </span>
                    <span className="text-muted-foreground">
                      {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([0, 50000])}
                    >
                      ~5만원
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([50000, 100000])}
                    >
                      5~10만원
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([100000, 500000])}
                    >
                      10~50만원
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([500000, 1000000])}
                    >
                      50만원~
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />

              {/* Sort Options */}
              <div>
                <h3 className="font-medium mb-3">정렬</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy(option.value);
                        setPage(1);
                      }}
                      className="w-full"
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              총 <span className="font-semibold text-foreground">{pagination?.total || 0}</span>개 상품
            </span>
            {searchParams.get('search') && (
              <Badge 
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Search className="h-3 w-3" />
                "{searchParams.get('search')}"
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('search');
                    router.push(`/products?${params.toString()}`);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {categories.find(c => c.id === selectedCategory)?.name}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPage(1);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
              <Badge 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {formatPrice(priceRange[0])} ~ {formatPrice(priceRange[1])}
                <button
                  onClick={() => {
                    setPriceRange([0, 1000000]);
                    setPage(1);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {sortOptions.find(s => s.value === sortBy)?.label}로 정렬
          </div>
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
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">
              {searchParams.get('search') 
                ? `"${searchParams.get('search')}"에 대한 검색 결과가 없습니다`
                : '해당 조건에 맞는 상품이 없습니다'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              다른 검색어나 필터를 시도해보세요
            </p>
            
            {/* 추천 검색어 */}
            {searchParams.get('search') && popularSearches.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3">추천 검색어</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {popularSearches.slice(0, 3).map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearchSuggestion(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => {
                  setSearchInput('');
                  setSelectedCategory('');
                  setPriceRange([0, 1000000]);
                  setSortBy('latest');
                  router.push('/products');
                }}
              >
                전체 상품 보기
              </Button>
              {showFilters === false && (
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                >
                  필터 열기
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
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