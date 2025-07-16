# 쇼핑몰 포트폴리오 PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 프로젝트 명
E-Commerce Portfolio Platform

### 프로젝트 목표
- 반응형 웹 쇼핑몰 포트폴리오 제작
- 실제 쇼핑몰 수준의 기능 구현
- 개발자 역량 증명을 위한 포트폴리오 완성

### 대상 사용자
- 온라인 쇼핑 고객
- 포트폴리오 검토자 (채용 담당자, 클라이언트)

## 2. 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI 또는 Shadcn/ui

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Upload**: Cloudinary (이미지 저장)

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: Supabase
- **Payment**: 토스페이먼츠 (테스트 환경)

## 3. 핵심 기능 명세

### 3.1 사용자 인증 시스템
**기능 요구사항:**
- 회원가입 (이메일, 비밀번호, 이름, 전화번호)
- 로그인/로그아웃
- JWT 토큰 기반 인증
- 비밀번호 찾기 (이메일 인증)
- 회원 정보 수정

**기술 명세:**
- 이메일 형식 검증
- 비밀번호 암호화 (bcrypt)
- 토큰 만료 시간 설정
- 로그인 상태 유지 (localStorage)

### 3.2 상품 관리 시스템
**기능 요구사항:**
- 상품 목록 조회 (페이지네이션)
- 상품 상세 정보 조회
- 카테고리별 상품 필터링
- 상품 검색 기능
- 상품 정렬 (가격순, 인기순, 최신순)

**기술 명세:**
- 무한 스크롤 또는 페이지네이션
- 검색 디바운싱 적용
- 이미지 최적화 (Next.js Image)
- 상품 데이터 캐싱

### 3.3 장바구니 시스템
**기능 요구사항:**
- 상품 장바구니 추가/제거
- 수량 변경
- 장바구니 총 금액 계산
- 로그인 시 장바구니 동기화
- 비회원 장바구니 (로컬스토리지)

**기술 명세:**
- 실시간 수량 업데이트
- 재고 수량 검증
- 장바구니 상태 관리 (Zustand)
- 가격 계산 로직

### 3.4 주문 및 결제 시스템
**기능 요구사항:**
- 주문서 작성 (배송지 정보)
- 결제 방법 선택
- 주문 완료 후 이메일 알림
- 주문 내역 조회
- 주문 상태 관리

**기술 명세:**
- 토스페이먼츠 연동
- 결제 검증 로직
- 주문 상태 업데이트
- 트랜잭션 처리

### 3.5 UI/UX 설계
**기능 요구사항:**
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 직관적인 네비게이션
- 로딩 상태 표시
- 에러 처리 및 알림
- 접근성 고려

**기술 명세:**
- Mobile-first 디자인
- CSS Grid/Flexbox 활용
- 스켈레톤 로딩
- 토스트 알림 시스템
- 키보드 네비게이션 지원

## 4. 페이지 구조

### 4.1 사용자 페이지
```
/                    - 홈페이지 (인기 상품, 카테고리)
/products           - 상품 목록
/products/[id]      - 상품 상세
/cart               - 장바구니
/checkout           - 주문서 작성
/order/complete     - 주문 완료
/login              - 로그인
/register           - 회원가입
/mypage             - 마이페이지
/mypage/orders      - 주문 내역
```

### 4.2 관리자 페이지 (추후 확장)
```
/admin              - 관리자 대시보드
/admin/products     - 상품 관리
/admin/orders       - 주문 관리
/admin/users        - 회원 관리
```

## 5. 데이터베이스 스키마

### 5.1 핵심 테이블
```sql
-- 사용자 테이블
users (id, email, password, name, phone, created_at, updated_at)

-- 상품 테이블
products (id, name, description, price, stock, category_id, image_url, created_at)

-- 카테고리 테이블
categories (id, name, slug)

-- 장바구니 테이블
cart_items (id, user_id, product_id, quantity, created_at)

-- 주문 테이블
orders (id, user_id, total_amount, status, shipping_address, created_at)

-- 주문 상품 테이블
order_items (id, order_id, product_id, quantity, price)
```

## 6. API 명세

### 6.1 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 6.2 상품 API
- `GET /api/products` - 상품 목록 조회
- `GET /api/products/:id` - 상품 상세 조회
- `GET /api/categories` - 카테고리 목록

### 6.3 장바구니 API
- `GET /api/cart` - 장바구니 조회
- `POST /api/cart` - 장바구니 추가
- `PUT /api/cart/:id` - 장바구니 수량 변경
- `DELETE /api/cart/:id` - 장바구니 삭제

### 6.4 주문 API
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 내역 조회
- `GET /api/orders/:id` - 주문 상세 조회

## 7. 개발 일정

### Phase 1: 기본 설정 (1주)
- 프로젝트 초기 설정
- 데이터베이스 설계
- 기본 UI 컴포넌트 제작

### Phase 2: 핵심 기능 개발 (2-3주)
- 사용자 인증 시스템
- 상품 목록/상세 페이지
- 장바구니 기능

### Phase 3: 결제 및 주문 (1-2주)
- 주문서 작성
- 결제 시스템 연동
- 주문 관리

### Phase 4: UI/UX 최적화 (1주)
- 반응형 디자인 완성
- 성능 최적화
- 테스트 및 버그 수정

## 8. 성능 및 품질 기준

### 8.1 성능 목표
- 초기 로딩 시간: 3초 이내
- 페이지 전환: 1초 이내
- 모바일 성능: 90점 이상 (Lighthouse)

### 8.2 품질 기준
- TypeScript 엄격 모드 사용
- ESLint/Prettier 적용
- 단위 테스트 커버리지 70% 이상
- 접근성 AA 등급 준수

## 9. 보안 고려사항

- SQL Injection 방지 (Parameterized Query)
- XSS 방지 (입력값 검증)
- CSRF 방지 (토큰 검증)
- 비밀번호 암호화 (bcrypt)
- HTTPS 적용
- 환경변수 관리

## 10. 추후 확장 가능성

- 관리자 페이지 추가
- 상품 리뷰 시스템
- 위시리스트 기능
- 쿠폰/할인 시스템
- 배송 추적 시스템
- 모바일 앱 (React Native)

## 11. 성공 지표

- 포트폴리오 완성도: 100%
- 기능 구현 완료율: 100%
- 반응형 대응: 완료
- 코드 품질: 우수
- 배포 성공: 완료