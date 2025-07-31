import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { Text, PrimeLink } from './typography';
import { Badge } from './badge';

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: {
    id: string;
    name: string;
    brand?: string;
    price?: number;
    originalPrice?: number;
    imageUrl: string;
    category?: string;
    isNew?: boolean;
    isSoldOut?: boolean;
    discount?: number;
  };
  variant?: 'default' | 'withMargin';
  href?: string;
  showPriceInfo?: boolean;
  showBrand?: boolean;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ 
    className, 
    product, 
    variant = 'default', 
    href,
    showPriceInfo = true,
    showBrand = true,
    ...props 
  }, ref) => {
    const cardVariant = variant === 'withMargin' ? 'productWithMargin' : 'product';
    
    const CardContent = (
      <Card
        ref={ref}
        variant={cardVariant}
        size="none"
        className={cn('group cursor-pointer', className)}
        {...props}
      >
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="brand" size="sm">NEW</Badge>
            )}
            {product.discount && (
              <Badge variant="error" size="sm">{product.discount}%</Badge>
            )}
          </div>
          
          {/* Sold Out Overlay */}
          {product.isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" size="lg">SOLD OUT</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-3 space-y-1">
          {/* Brand */}
          {showBrand && product.brand && (
            <Text size="small" color="muted" className="uppercase font-medium">
              {product.brand}
            </Text>
          )}
          
          {/* Product Name */}
          <Text 
            size="small" 
            color="primary" 
            className="font-normal leading-tight line-clamp-2"
          >
            {product.name}
          </Text>

          {/* Price Info */}
          {showPriceInfo && product.price && (
            <div className="pt-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <Text size="small" color="primary" className="font-bold">
                  {product.price.toLocaleString()}원
                </Text>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Text size="small" color="muted" className="line-through">
                    {product.originalPrice.toLocaleString()}원
                  </Text>
                )}
              </div>
              
              {/* Price Change Indicator (예시) */}
              <div className="flex items-center gap-1">
                <Text size="small" color="muted">
                  즉시구매가
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    );

    // If href is provided, wrap in link
    if (href) {
      return (
        <PrimeLink href={href} className="block no-underline">
          {CardContent}
        </PrimeLink>
      );
    }

    return CardContent;
  }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };