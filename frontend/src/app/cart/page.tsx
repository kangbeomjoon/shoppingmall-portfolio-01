'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useCart } from '@/hooks/use-cart';
import { useCartStore } from '@/stores/cart-store';

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { cart, isLoading, updateQuantity, removeItem } = useCart();
  const { items: localItems, totalAmount: localTotalAmount } = useCartStore();

  useEffect(() => {
    // 클라이언트 사이드에서 추가 검증
    if (!isAuthenticated) {
      router.push('/login?from=/cart');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // 로그인한 경우 서버 데이터, 로그인하지 않은 경우 로컬 데이터 사용
  const items = isAuthenticated && cart ? cart.items : localItems;
  const totalAmount = isAuthenticated && cart ? cart.totalAmount : localTotalAmount;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">장바구니</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">장바구니</h1>
        
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              장바구니가 비어있습니다.
            </p>
            <Button asChild>
              <Link href="/products">쇼핑 계속하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">장바구니</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>상품 목록 ({items.length}개)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                const isOutOfStock = product.stock === 0;
                
                return (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={product.imageUrl || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            href={`/products/${product.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {product.category?.name}
                          </p>
                          {isOutOfStock && (
                            <Badge variant="destructive" className="mt-2">
                              품절
                            </Badge>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.id, product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, product.id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          
                          <span className="text-sm text-muted-foreground ml-2">
                            (재고: {product.stock}개)
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(product.price * item.quantity)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(product.price)} / 개
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        
        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">배송비</span>
                  <span>{totalAmount >= 50000 ? '무료' : formatPrice(3000)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>총 결제금액</span>
                  <span className="text-primary">
                    {formatPrice(totalAmount + (totalAmount >= 50000 ? 0 : 3000))}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">주문하기</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">쇼핑 계속하기</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}