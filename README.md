# 🛍️ E-Commerce Portfolio Platform

현대적인 기술 스택으로 구축된 풀스택 쇼핑몰 포트폴리오입니다.

## 📋 프로젝트 개요

실제 쇼핑몰 수준의 기능을 구현한 포트폴리오 프로젝트로, 사용자 인증, 상품 관리, 장바구니, 결제 시스템을 포함합니다.

### 🎯 주요 기능

- **🔐 사용자 인증**: JWT 기반 로그인/회원가입
- **📦 상품 관리**: 카테고리별 상품 조회, 검색, 필터링
- **🛒 장바구니**: 실시간 수량 조절, 로컬/서버 동기화
- **💳 결제 시스템**: 토스페이먼츠 연동
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **⚡ 성능 최적화**: 이미지 최적화, 코드 스플리팅

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI / Shadcn/ui

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Upload**: Cloudinary

### Infrastructure
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Supabase
- **Payment**: 토스페이먼츠

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js 18.x 이상
- npm 또는 yarn
- PostgreSQL 데이터베이스

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-username/ecommerce-portfolio.git
cd ecommerce-portfolio
```

### 2. 의존성 설치
```bash
# 프론트엔드
cd frontend
npm install

# 백엔드
cd ../backend
npm install
```

### 3. 환경 변수 설정

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

#### Backend (.env)
```env
# 데이터베이스
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce

# JWT 시크릿
JWT_SECRET=your_jwt_secret_key

# 토스페이먼츠
TOSS_SECRET_KEY=your_toss_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 이메일 (선택사항)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. 데이터베이스 설정
```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. 개발 서버 실행
```bash
# 백엔드 서버 (터미널 1)
cd backend
npm run dev

# 프론트엔드 서버 (터미널 2)
cd frontend
npm run dev
```

## 📁 프로젝트 구조

```
ecommerce-portfolio/
├── frontend/                 # Next.js 프론트엔드
│   ├── app/                 # App Router 페이지
│   │   ├── (auth)/         # 인증 관련 페이지
│   │   ├── products/       # 상품 관련 페이지
│   │   ├── cart/           # 장바구니 페이지
│   │   └── checkout/       # 주문/결제 페이지
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # 기본 UI 컴포넌트
│   │   ├── forms/          # 폼 컴포넌트
│   │   └── layouts/        # 레이아웃 컴포넌트
│   ├── lib/                # 유틸리티 함수
│   ├── hooks/              # 커스텀 훅
│   ├── stores/             # Zustand 스토어
│   └── types/              # TypeScript 타입 정의
├── backend/                 # Express.js 백엔드
│   ├── src/
│   │   ├── controllers/    # 컨트롤러
│   │   ├── middleware/     # 미들웨어
│   │   ├── routes/         # API 라우트
│   │   ├── services/       # 비즈니스 로직
│   │   ├── utils/          # 유틸리티 함수
│   │   └── types/          # TypeScript 타입
│   ├── prisma/             # Prisma 스키마 및 마이그레이션
│   └── uploads/            # 파일 업로드 임시 폴더
└── docs/                   # 문서화
```

## 🔧 개발 가이드

### 코딩 컨벤션
- **TypeScript**: 엄격 모드 사용
- **ESLint**: Airbnb 설정 기반
- **Prettier**: 코드 포맷팅
- **Husky**: Git 훅으로 코드 품질 관리

### 브랜치 전략
```
main      - 운영 환경 배포
develop   - 개발 통합 브랜치
feature/* - 기능 개발 브랜치
hotfix/*  - 긴급 수정 브랜치
```

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 업무 수정
```

## 🧪 테스트

### 테스트 실행
```bash
# 프론트엔드 테스트
cd frontend
npm run test

# 백엔드 테스트
cd backend
npm run test

# E2E 테스트
npm run test:e2e
```

### 테스트 커버리지
```bash
npm run test:coverage
```

## 📱 API 문서

### 인증 API
```
POST /api/auth/register  - 회원가입
POST /api/auth/login     - 로그인
POST /api/auth/logout    - 로그아웃
GET  /api/auth/me        - 현재 사용자 정보
```

### 상품 API
```
GET    /api/products           - 상품 목록 조회
GET    /api/products/:id       - 상품 상세 조회
GET    /api/categories         - 카테고리 목록
```

### 장바구니 API
```
GET    /api/cart               - 장바구니 조회
POST   /api/cart               - 장바구니 추가
PUT    /api/cart/:id           - 수량 변경
DELETE /api/cart/:id           - 상품 삭제
```

### 주문 API
```
POST   /api/orders             - 주문 생성
GET    /api/orders             - 주문 내역 조회
GET    /api/orders/:id         - 주문 상세 조회
```

## 🚀 배포

### 프론트엔드 배포 (Vercel)
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 배포
cd frontend
vercel --prod
```

### 백엔드 배포 (Railway)
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 프로젝트 배포
cd backend
railway login
railway deploy
```

## 📊 성능 최적화

### 프론트엔드
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 스플리팅**: 동적 import 활용
- **캐싱**: React Query로 서버 상태 관리
- **번들 최적화**: Webpack 설정 최적화

### 백엔드
- **데이터베이스 최적화**: 인덱스 설정, 쿼리 최적화
- **캐싱**: Redis 활용 (추후 적용)
- **압축**: gzip 압축 적용
- **로드 밸런싱**: PM2 클러스터 모드

## 🔐 보안 고려사항

- **인증/인가**: JWT 토큰 기반 인증
- **입력 검증**: Zod 스키마 검증
- **SQL Injection**: Prisma ORM 사용
- **XSS 방지**: 입력값 이스케이핑
- **CSRF 방지**: SameSite 쿠키 설정
- **HTTPS**: 운영 환경에서 강제 적용

## 📈 모니터링

### 성능 모니터링
- **Lighthouse**: 웹 성능 측정
- **Web Vitals**: 사용자 경험 지표
- **Bundle Analyzer**: 번들 크기 분석

### 에러 추적
- **Sentry**: 런타임 에러 추적
- **로그 관리**: Winston 로거 사용

## 🤝 기여 방법

1. Fork 프로젝트
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👤 개발자 정보

- **이름**: [Your Name]
- **이메일**: [your.email@example.com]
- **GitHub**: [https://github.com/yourusername]
- **LinkedIn**: [https://linkedin.com/in/yourprofile]

## 📞 문의사항

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록하거나 이메일로 연락주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!