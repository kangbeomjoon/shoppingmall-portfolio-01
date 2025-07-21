'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/use-products';
import { Category } from '@/types';

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">카테고리를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">카테고리</h1>
        <p className="text-muted-foreground">
          원하시는 카테고리를 선택하여 상품을 둘러보세요
        </p>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[4/3]" />
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group block"
            >
              <Card className="overflow-hidden h-full transition-all group-hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={getCategoryImage(category.slug)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-white/80 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-normal">
                      {getProductCount(category)} 상품
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      자세히 보기 →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && categories?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">
            등록된 카테고리가 없습니다.
          </p>
          <Link href="/products">
            <button className="text-primary hover:underline">
              전체 상품 보기
            </button>
          </Link>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-12 bg-muted/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">카테고리별 쇼핑의 장점</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium mb-2">🎯 쉬운 탐색</h3>
            <p className="text-sm text-muted-foreground">
              관심있는 카테고리의 상품만 모아서 볼 수 있어요
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">🔍 빠른 검색</h3>
            <p className="text-sm text-muted-foreground">
              카테고리 내에서 더 세부적인 검색이 가능해요
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">💡 새로운 발견</h3>
            <p className="text-sm text-muted-foreground">
              같은 카테고리의 다양한 상품을 발견할 수 있어요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get category image
function getCategoryImage(slug: string): string {
  const imageMap: Record<string, string> = {
    'clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    'bags': 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=800',
    'shoes': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
    'accessories': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    'home': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    'beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    'sports': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
  };
  
  return imageMap[slug] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800';
}

// Helper function to get product count
function getProductCount(category: Category): number {
  // This could be enhanced with actual product count from API
  // For now, we'll use a placeholder
  return Math.floor(Math.random() * 50) + 10;
}