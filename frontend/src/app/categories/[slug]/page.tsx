'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/loading';
import { useCategories, useProducts } from '@/hooks/use-products';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  // Get all categories to find the current one
  const { data: categories } = useCategories();
  const currentCategory = categories?.find(cat => cat.slug === slug);
  
  // Get products for this category
  const { data: productsData, isLoading } = useProducts({
    categoryId: currentCategory?.id,
    limit: 20,
  });

  const products = productsData?.data || [];

  if (!currentCategory && categories) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">카테고리를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">
          요청하신 카테고리가 존재하지 않습니다.
        </p>
        <Button onClick={() => router.push('/categories')}>
          카테고리 목록으로
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0"
          onClick={() => router.push('/categories')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          카테고리
        </Button>
        <span>/</span>
        <span className="text-foreground">{currentCategory?.name || slug}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {currentCategory?.name || <Skeleton className="h-8 w-48 inline-block" />}
        </h1>
        {currentCategory?.description && (
          <p className="text-muted-foreground">
            {currentCategory.description}
          </p>
        )}
        <div className="mt-4">
          <span className="text-sm text-muted-foreground">
            총 {products.length}개의 상품
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-square mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">
            이 카테고리에는 아직 상품이 없습니다.
          </p>
          <Button onClick={() => router.push('/products')}>
            전체 상품 보기
          </Button>
        </div>
      )}

      {/* Related Categories */}
      {categories && categories.length > 1 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">다른 카테고리 둘러보기</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories
              .filter(cat => cat.id !== currentCategory?.id)
              .slice(0, 6)
              .map(category => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="h-auto py-4 px-4 flex-col"
                  onClick={() => router.push(`/categories/${category.slug}`)}
                >
                  <span className="font-medium">{category.name}</span>
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}