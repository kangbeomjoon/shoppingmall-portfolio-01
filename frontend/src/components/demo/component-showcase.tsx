'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading, Paragraph, Text, PrimeLink } from '@/components/ui/typography';
import { ProductCard } from '@/components/ui/product-card';
import { Navigation, Menu, MenuItem, Logo } from '@/components/ui/navigation';
import { Heart, ShoppingCart, Star, User, Search, Filter } from 'lucide-react';

interface ComponentSectionProps {
  title: string;
  children: React.ReactNode;
}

function ComponentSection({ title, children }: ComponentSectionProps) {
  return (
    <div className="space-y-6">
      <Heading level="h2" className="text-2xl font-bold">{title}</Heading>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function DemoCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card variant="default" size="sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 items-center">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

// Sample product data
const sampleProducts = [
  {
    id: '1',
    name: 'Nike Air Jordan 1 Retro High OG "Chicago"',
    brand: 'Nike',
    price: 180000,
    originalPrice: 220000,
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
    isNew: true,
    discount: 18,
  },
  {
    id: '2',
    name: 'Adidas Yeezy Boost 350 V2 "Zebra"',
    brand: 'Adidas',
    price: 350000,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Off-White x Nike Air Force 1 Low "The Ten"',
    brand: 'Off-White',
    price: 1200000,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    isSoldOut: true,
  },
];

export function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading level="h1" responsive className="font-bold">
            Prime Design System
          </Heading>
          <Paragraph size="base" color="muted" className="max-w-2xl mx-auto">
            프리미엄 쇼핑몰을 위한 Prime 디자인 시스템으로 구성된 UI 컴포넌트 라이브러리입니다.
            깔끔하고 미니멀한 디자인으로 최적의 사용자 경험을 제공합니다.
          </Paragraph>
        </div>

        {/* Navigation */}
        <ComponentSection title="내비게이션 (Navigation)">
          <DemoCard 
            title="Header Navigation" 
            description="Prime 스타일 헤더 네비게이션"
          >
            <Navigation variant="header" className="w-full">
              <div className="flex items-center justify-between w-full">
                <Logo size="md" />
                <Menu direction="horizontal" gap="lg">
                  <MenuItem href="/shop" active>SHOP</MenuItem>
                  <MenuItem href="/style">STYLE</MenuItem>
                  <MenuItem href="/search">
                    <Search className="w-5 h-5" />
                  </MenuItem>
                </Menu>
              </div>
            </Navigation>
          </DemoCard>

          <DemoCard 
            title="Menu Items" 
            description="다양한 메뉴 아이템 스타일"
          >
            <Menu direction="vertical" gap="sm">
              <MenuItem variant="main" active>메인 메뉴 (활성)</MenuItem>
              <MenuItem variant="main">메인 메뉴</MenuItem>
              <MenuItem variant="sub">서브 메뉴</MenuItem>
              <MenuItem variant="footer">푸터 메뉴</MenuItem>
            </Menu>
          </DemoCard>
        </ComponentSection>

        {/* Buttons */}
        <ComponentSection title="버튼 (Buttons)">
          <DemoCard 
            title="Prime Button Variants" 
            description="Prime 스타일의 다양한 버튼들"
          >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary" size="wide">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="circular">Circular</Button>
            <Button variant="destructive">Destructive</Button>
          </DemoCard>

          <DemoCard 
            title="Button Sizes" 
            description="다양한 크기의 버튼들"
          >
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </DemoCard>
        </ComponentSection>

        {/* Typography */}
        <ComponentSection title="타이포그래피 (Typography)">
          <DemoCard 
            title="Headings" 
            description="다양한 크기의 제목들"
          >
            <div className="space-y-4">
              <Heading level="h1">Heading 1 (32px)</Heading>
              <Heading level="h2">Heading 2 (24px)</Heading>
              <Heading level="h3">Heading 3 (20px)</Heading>
              <Heading level="h4">Heading 4 (18px)</Heading>
            </div>
          </DemoCard>

          <DemoCard 
            title="Paragraphs & Text" 
            description="다양한 텍스트 스타일"
          >
            <div className="space-y-3">
              <Paragraph size="large">Large Text (40px)</Paragraph>
              <Paragraph size="base">Base Text (16px)</Paragraph>
              <Paragraph size="small">Small Text (12px)</Paragraph>
              <Text color="muted">Muted Text</Text>
              <Text color="brand">Brand Color Text</Text>
            </div>
          </DemoCard>

          <DemoCard 
            title="Links" 
            description="다양한 링크 스타일"
          >
            <div className="space-y-2">
              <div><PrimeLink href="#" variant="default">Default Link</PrimeLink></div>
              <div><PrimeLink href="#" variant="primary">Primary Link</PrimeLink></div>
              <div><PrimeLink href="#" variant="brand">Brand Link</PrimeLink></div>
              <div><PrimeLink href="#" variant="muted">Muted Link</PrimeLink></div>
            </div>
          </DemoCard>
        </ComponentSection>

        {/* Inputs */}
        <ComponentSection title="입력 필드 (Input Fields)">
          <DemoCard 
            title="Input Variants" 
            description="Prime 스타일 입력 필드"
          >
            <div className="space-y-3 w-full">
              <Input placeholder="기본 입력 필드" />
              <Input variant="search" placeholder="검색..." />
              <Input variant="minimal" placeholder="미니멀 스타일" />
            </div>
          </DemoCard>

          <DemoCard 
            title="Input States" 
            description="입력 필드의 다양한 상태"
          >
            <div className="space-y-3 w-full">
              <Input placeholder="일반 상태" />
              <Input state="error" placeholder="오류 상태" />
              <Input state="success" placeholder="성공 상태" />
              <Input disabled placeholder="비활성 상태" />
            </div>
          </DemoCard>
        </ComponentSection>

        {/* Product Cards */}
        <ComponentSection title="상품 카드 (Product Cards)">
          <DemoCard 
            title="Prime Product Cards" 
            description="Prime 스타일의 상품 카드들"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {sampleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={`/products/${product.id}`}
                />
              ))}
            </div>
          </DemoCard>

          <DemoCard 
            title="Product Card Variants" 
            description="다양한 상품 카드 스타일"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <ProductCard
                product={sampleProducts[0]}
                variant="default"
              />
              <ProductCard
                product={sampleProducts[1]}
                variant="withMargin"
              />
            </div>
          </DemoCard>
        </ComponentSection>

        {/* Cards */}
        <ComponentSection title="카드 (Cards)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default" size="default">
              <CardHeader>
                <CardTitle className="text-lg">Default Card</CardTitle>
                <CardDescription>기본 카드 스타일입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Paragraph size="small" color="muted">
                  Prime 스타일의 깔끔한 카드 디자인입니다.
                </Paragraph>
              </CardContent>
            </Card>

            <Card variant="minimal" size="sm">
              <CardHeader>
                <CardTitle className="text-lg">Minimal Card</CardTitle>
                <CardDescription>미니멀한 카드 스타일입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="primary">New</Badge>
                  <Badge variant="brand">Featured</Badge>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" size="default">
              <CardHeader>
                <CardTitle className="text-lg">Elevated Card</CardTitle>
                <CardDescription>그림자가 있는 카드입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="primary" size="sm">
                  구매하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </ComponentSection>

        {/* Badges */}
        <ComponentSection title="뱃지 (Badges)">
          <DemoCard 
            title="Prime Badge Variants" 
            description="Prime 스타일의 다양한 뱃지들"
          >
            <Badge variant="primary">Primary</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </DemoCard>

          <DemoCard 
            title="Badge Usage Examples" 
            description="실제 사용 예시"
          >
            <div className="flex flex-wrap gap-2">
              <Badge variant="error">한정판</Badge>
              <Badge variant="brand">NEW</Badge>
              <Badge variant="primary">BEST</Badge>
              <Badge variant="success">재입고</Badge>
              <Badge variant="warning">품절임박</Badge>
              <Badge variant="secondary" size="sm">무료배송</Badge>
            </div>
          </DemoCard>
        </ComponentSection>

        {/* Combined Examples */}
        <ComponentSection title="종합 예시 (Combined Examples)">
          <Card variant="elevated" size="lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Prime 쇼핑몰</CardTitle>
                  <CardDescription>프리미엄 쇼핑의 새로운 경험</CardDescription>
                </div>
                <Logo size="md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Search Section */}
                <div className="flex gap-3">
                  <Input 
                    variant="search" 
                    placeholder="브랜드, 상품, 프로필, 태그 등" 
                    className="flex-1"
                  />
                  <Button variant="primary">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Category Links */}
                <div className="flex flex-wrap gap-4">
                  <PrimeLink href="#" variant="primary">스니커즈</PrimeLink>
                  <PrimeLink href="#" variant="default">의류</PrimeLink>
                  <PrimeLink href="#" variant="default">가방</PrimeLink>
                  <PrimeLink href="#" variant="default">시계</PrimeLink>
                  <PrimeLink href="#" variant="default">테크</PrimeLink>
                </div>

                {/* Featured Products */}
                <div>
                  <Heading level="h3" className="mb-4">인기 상품</Heading>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sampleProducts.slice(0, 3).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        href={`/products/${product.id}`}
                        className="bg-white rounded-lg p-3"
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button variant="primary" size="lg">지금 쇼핑하기</Button>
                  <Button variant="secondary" size="lg">더 많은 상품 보기</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <Paragraph size="base" color="muted">
            Prime Design System for Shopping Mall Portfolio
          </Paragraph>
          <div className="flex justify-center gap-6 mt-4">
            <PrimeLink href="#" variant="muted">Documentation</PrimeLink>
            <PrimeLink href="#" variant="muted">GitHub</PrimeLink>
            <PrimeLink href="#" variant="muted">Support</PrimeLink>
          </div>
          <div className="mt-4">
            <Text size="small" color="muted">
              © 2024 Prime Design System. 프리미엄 쇼핑의 새로운 기준.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}