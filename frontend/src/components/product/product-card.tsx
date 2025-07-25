'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cart-store';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    try {
      // Add to Zustand cart store
      addItem(product, 1);
      console.log('Added to cart:', product.name);
      
      // Short delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
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
            {imageError || !product.imageUrl ? (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400">이미지 없음</p>
                </div>
              </div>
            ) : (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent" />
              ) : (
                <ShoppingCart className="h-4 w-4 text-gray-600" />
              )}
            </Button>

            {/* Like Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
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