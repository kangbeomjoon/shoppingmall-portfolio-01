'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

export function CartDropdown() {
  const { items, totalItems, totalAmount, removeItem, updateQuantity } = useCartStore();

  if (totalItems === 0) {
    return (
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4" />
            장바구니
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">장바구니가 비어있습니다</p>
            <Link href="/products">
              <Button variant="outline" size="sm" className="mt-3">
                상품 둘러보기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            장바구니
          </div>
          <Badge variant="secondary" className="text-xs">
            {totalItems}개
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 py-2">
            {/* Product Image */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={item.product.imageUrl || '/placeholder-product.jpg'}
                alt={item.product.name}
                fill
                className="object-cover rounded-md"
                sizes="48px"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-1 mb-1">
                {item.product.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {formatPrice(item.product.price)}
              </p>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="text-xs font-medium w-6 text-center">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
              onClick={() => removeItem(item.product.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>

      <Separator />
      
      {/* Total and Actions */}
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">총 금액</span>
          <span className="text-sm font-bold">
            {formatPrice(totalAmount)}
          </span>
        </div>
        
        <div className="space-y-2">
          <Link href="/cart" className="block">
            <Button variant="outline" className="w-full" size="sm">
              장바구니 보기
            </Button>
          </Link>
          <Link href="/checkout" className="block">
            <Button className="w-full" size="sm">
              주문하기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}