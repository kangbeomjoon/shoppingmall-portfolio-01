'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading';
import { ProductGrid } from '@/components/product/product-card';
import { useProducts } from '@/hooks/use-products';
import { useCategoryBySlug } from '@/hooks/use-categories';

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [page, setPage] = React.useState(1);
  
  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(slug);
  
  // Fetch products in category
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page,
    limit: 12,
    categoryId: category?.id,
  });
  
  const products = productsData?.data || [];
  const pagination = productsData?.pagination;
  
  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">카테고리를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-8">
            요청하신 카테고리가 존재하지 않습니다.
          </p>
          <Button onClick={() => router.push('/products')}>
            전체 상품 보기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/products')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          전체 상품으로 돌아가기
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground mt-2">
              총 {category._count?.products || 0}개의 상품
            </p>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            이 카테고리에는 아직 상품이 없습니다.
          </p>
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