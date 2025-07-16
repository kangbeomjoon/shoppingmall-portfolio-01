'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    try {
      // TODO: Implement add to cart functionality
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock API call
      console.log('Added to cart:', product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${className}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Like Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={handleToggleLike}
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>

            {/* Stock Badge */}
            {isOutOfStock && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                품절
              </Badge>
            )}

            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 left-2"
            >
              {product.category.name}
            </Badge>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-muted-foreground">
                  재고: {product.stock}개
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            size="sm"
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                추가 중...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isOutOfStock ? '품절' : '장바구니'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

// Grid container for multiple product cards
export function ProductGrid({ 
  products, 
  className 
}: { 
  products: Product[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}