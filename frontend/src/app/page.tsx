import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/product/product-card';
import apiClient from '@/lib/api';
import { Product, Category } from '@/types';

// 서버에서 데이터 가져오기
async function getFeaturedProducts() {
  try {
    const response = await apiClient.getFeaturedProducts();
    if (response.success && response.data) {
      return response.data as Product[];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await apiClient.getCategories();
    if (response.success && response.data) {
      return response.data as Category[];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

const features = [
  {
    icon: ShoppingBag,
    title: '다양한 상품',
    description: '최신 트렌드부터 클래식까지 다양한 상품을 만나보세요.',
  },
  {
    icon: Truck,
    title: '빠른 배송',
    description: '전국 어디든 빠르고 안전한 배송 서비스를 제공합니다.',
  },
  {
    icon: Shield,
    title: '안전 결제',
    description: '다양한 결제 수단과 보안 시스템으로 안전하게 결제하세요.',
  },
  {
    icon: HeadphonesIcon,
    title: '고객 지원',
    description: '언제든지 도움이 필요하시면 고객센터로 연락주세요.',
  },
];

export default async function Home() {
  // 서버 컴포넌트에서 데이터 가져오기
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-16 text-white overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                새로운 쇼핑 경험을
                <br />
                시작하세요
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                최신 트렌드와 합리적인 가격으로 만나는 프리미엄 쇼핑몰
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="group">
                    상품 둘러보기
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline" className="border-white text-black bg-white hover:bg-gray-100">
                    카테고리 보기
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                alt="Shopping"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">카테고리</h2>
          <p className="text-muted-foreground">
            원하는 상품을 카테고리별로 쉽게 찾아보세요
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        category.slug === 'bags' ? '1553062407-98eeb64c6a62' :
                        category.slug === 'shoes' ? '1549298916-b41d501d3772' :
                        category.slug === 'accessories' ? '1515562141207-7a88fb7ce338' :
                        category.slug === 'clothing' ? '1445205170230-053b83016050' :
                        '1468495244123-6c6c332eeece'  // electronics
                      }?w=300`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">인기 상품</h2>
          <p className="text-muted-foreground">
            지금 가장 인기 있는 상품들을 확인해보세요
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline" className="group">
              더 많은 상품 보기
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">왜 개발자들의 쇼핑몰을 선택해야 할까요?</h2>
            <p className="text-muted-foreground">
              고객 만족을 위한 다양한 서비스를 제공합니다
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-none bg-transparent">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center bg-primary text-primary-foreground">
          <CardContent className="p-16">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              회원가입하고 특별한 혜택을 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  회원가입
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  쇼핑하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}