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
    // 의류 상품 - 다양한 아이템 추가
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
    prisma.product.create({
      data: {
        name: '울 니트 스웨터',
        description: '따뜻하고 부드러운 울 소재의 겨울용 니트 스웨터입니다.',
        price: 99000,
        stock: 40,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '슬랙스 바지',
        description: '정장과 캐주얼에 모두 어울리는 깔끔한 슬랙스입니다.',
        price: 79000,
        stock: 35,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1506629905607-d7103cf8cad0?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '후드 집업',
        description: '편안하고 따뜻한 후드 집업으로 캐주얼한 스타일을 완성하세요.',
        price: 69000,
        stock: 55,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '롱 코트',
        description: '세련되고 우아한 실루엣의 겨울용 롱 코트입니다.',
        price: 199000,
        stock: 20,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
      },
    }),

    // 전자제품 - 더 많은 아이템 추가
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
    prisma.product.create({
      data: {
        name: '게이밍 키보드',
        description: '기계식 스위치와 RGB 백라이팅을 갖춘 게이밍 키보드입니다.',
        price: 129000,
        stock: 30,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '무선 마우스',
        description: '정밀한 센서와 인체공학적 디자인의 무선 마우스입니다.',
        price: 59000,
        stock: 50,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '휴대용 스피커',
        description: '방수 기능과 긴 배터리 수명을 자랑하는 블루투스 스피커입니다.',
        price: 89000,
        stock: 35,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '웹캠',
        description: '4K 화질과 자동 초점 기능을 갖춘 고화질 웹캠입니다.',
        price: 79000,
        stock: 20,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '모바일 보조배터리',
        description: '20000mAh 대용량의 고속 충전 지원 보조배터리입니다.',
        price: 39000,
        stock: 60,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      },
    }),

    // 가방 - 더 많은 스타일 추가
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
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '크로스백',
        description: '가볍고 편리한 일상용 크로스백입니다.',
        price: 49000,
        stock: 45,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '여행용 캐리어',
        description: '내구성이 뛰어난 하드 케이스 여행용 캐리어입니다.',
        price: 199000,
        stock: 15,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '노트북 가방',
        description: '15인치 노트북까지 수납 가능한 전용 가방입니다.',
        price: 79000,
        stock: 30,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '스포츠 더플백',
        description: '운동할 때 필수품들을 수납할 수 있는 더플백입니다.',
        price: 59000,
        stock: 40,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '미니 핸드백',
        description: '컴팩트하고 세련된 디자인의 미니 핸드백입니다.',
        price: 89000,
        stock: 25,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      },
    }),

    // 신발 - 더 많은 상품 추가
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
    prisma.product.create({
      data: {
        name: '하이탑 캔버스 신발',
        description: '캐주얼하고 편안한 하이탑 스타일의 캔버스 신발입니다.',
        price: 89000,
        stock: 50,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '비즈니스 구두',
        description: '정장에 어울리는 클래식한 디자인의 가죽 구두입니다.',
        price: 199000,
        stock: 25,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '워킹 부츠',
        description: '견고하고 내구성이 뛰어난 워킹 부츠입니다.',
        price: 179000,
        stock: 20,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '농구화',
        description: '그립력과 쿠셔닝이 우수한 전문 농구화입니다.',
        price: 189000,
        stock: 15,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '슬립온 신발',
        description: '간편하게 신을 수 있는 편안한 슬립온 스타일입니다.',
        price: 79000,
        stock: 60,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '등산화',
        description: '아웃도어 활동에 최적화된 방수 등산화입니다.',
        price: 229000,
        stock: 18,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '댄스 신발',
        description: '유연성과 편안함을 겸비한 댄스용 신발입니다.',
        price: 119000,
        stock: 35,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '샌들',
        description: '통기성이 좋고 시원한 여름용 샌들입니다.',
        price: 59000,
        stock: 40,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400',
      },
    }),

    // 액세서리 - 더 다양한 아이템 추가
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
    prisma.product.create({
      data: {
        name: '가죽 벨트',
        description: '고급 가죽으로 제작된 클래식한 디자인의 벨트입니다.',
        price: 59000,
        stock: 30,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '손목시계',
        description: '세련되고 정확한 쿼츠 무브먼트 손목시계입니다.',
        price: 149000,
        stock: 20,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '실버 반지',
        description: '미니멀한 디자인의 925 실버 반지입니다.',
        price: 39000,
        stock: 45,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '스카프',
        description: '부드러운 실크 소재의 고급 스카프입니다.',
        price: 69000,
        stock: 35,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '귀걸이 세트',
        description: '데일리부터 파티까지 어울리는 귀걸이 세트입니다.',
        price: 49000,
        stock: 50,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: '모자',
        description: '자외선 차단과 스타일을 동시에 잡는 패션 모자입니다.',
        price: 39000,
        stock: 40,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400',
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: '관리자',
      phone: '010-0000-0000',
      isAdmin: true,
    },
  });

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: '테스트 유저',
      phone: '010-1234-5678',
    },
  });

  console.log('✅ Users created');

  console.log(`🎉 Seed completed successfully!`);
  console.log(`📊 Created:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - 1 admin user (admin@example.com / admin123)`);
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