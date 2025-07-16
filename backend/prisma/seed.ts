import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '의류',
        slug: 'clothing',
      },
    }),
    prisma.category.create({
      data: {
        name: '전자제품',
        slug: 'electronics',
      },
    }),
    prisma.category.create({
      data: {
        name: '가방',
        slug: 'bags',
      },
    }),
    prisma.category.create({
      data: {
        name: '신발',
        slug: 'shoes',
      },
    }),
    prisma.category.create({
      data: {
        name: '액세서리',
        slug: 'accessories',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create products
  const products = await Promise.all([
    // 의류 상품
    prisma.product.create({
      data: {
        name: '클래식 화이트 셔츠',
        description: '편안한 착용감과 깔끔한 디자인의 기본 화이트 셔츠입니다.',
        price: 59000,
        stock: 50,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '데님 재킷',
        description: '트렌디한 디자인의 데님 재킷으로 어떤 스타일에도 잘 어울립니다.',
        price: 89000,
        stock: 30,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '편안한 기본 티셔츠',
        description: '부드러운 소재로 만든 데일리 착용하기 좋은 기본 티셔츠입니다.',
        price: 29000,
        stock: 100,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      },
    }),

    // 전자제품
    prisma.product.create({
      data: {
        name: '블루투스 헤드폰',
        description: '고음질 사운드와 뛰어난 노이즈 캔슬링 기능을 제공합니다.',
        price: 199000,
        stock: 25,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '스마트 워치',
        description: '건강 관리와 알림 기능을 갖춘 스마트 워치입니다.',
        price: 299000,
        stock: 15,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '무선 충전기',
        description: '빠르고 안전한 무선 충전을 제공하는 충전 패드입니다.',
        price: 45000,
        stock: 40,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
      },
    }),

    // 가방
    prisma.product.create({
      data: {
        name: '레더 백팩',
        description: '고급 가죽으로 제작된 실용적이고 세련된 백팩입니다.',
        price: 159000,
        stock: 20,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '캔버스 토트백',
        description: '일상 사용에 완벽한 넉넉한 사이즈의 캔버스 토트백입니다.',
        price: 69000,
        stock: 35,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      },
    }),

    // 신발
    prisma.product.create({
      data: {
        name: '클래식 스니커즈',
        description: '편안함과 스타일을 모두 갖춘 클래식 디자인의 스니커즈입니다.',
        price: 129000,
        stock: 45,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '러닝화',
        description: '쿠셔닝과 지지력이 뛰어난 전문 러닝화입니다.',
        price: 159000,
        stock: 30,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      },
    }),

    // 액세서리
    prisma.product.create({
      data: {
        name: '실버 목걸이',
        description: '심플하고 우아한 디자인의 실버 목걸이입니다.',
        price: 79000,
        stock: 25,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '선글라스',
        description: 'UV 차단 기능과 트렌디한 디자인을 갖춘 선글라스입니다.',
        price: 89000,
        stock: 40,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: '테스트 유저',
      phone: '010-1234-5678',
    },
  });

  console.log('✅ Test user created');

  console.log(`🎉 Seed completed successfully!`);
  console.log(`📊 Created:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - 1 test user (test@example.com / password123)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });