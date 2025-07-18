# CLAUDE.md - 프론트엔드

이 파일은 Claude Code (claude.ai/code)가 프론트엔드 개발 작업을 할 때 참고할 수 있는 가이드를 제공합니다.

## 프론트엔드 개발 명령어

### 개발 환경 명령어
```bash
# Turbopack 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린터 실행
npm run lint
```

## 프론트엔드 아키텍처

### 기술 스택
- **프레임워크**: Next.js 15 with App Router and TypeScript
- **스타일링**: Tailwind CSS with Radix UI components
- **상태 관리**: Zustand (전역 상태), React Query (서버 상태)
- **폼 처리**: React Hook Form with Zod validation
- **API 통신**: TypeScript 인터페이스를 사용한 커스텀 ApiClient 클래스

### 파일 구조
```
frontend/
├── src/
│   ├── app/           # Next.js App Router 페이지 및 레이아웃
│   ├── components/    # 재사용 가능한 UI 컴포넌트
│   │   ├── layout/    # 레이아웃 컴포넌트
│   │   ├── product/   # 상품 관련 컴포넌트
│   │   ├── providers/ # 컨텍스트 프로바이더
│   │   └── ui/        # 공통 UI 컴포넌트
│   ├── stores/        # 인증, 장바구니, UI 상태용 Zustand 스토어
│   ├── hooks/         # 커스텀 React 훅
│   ├── lib/           # API 클라이언트 및 유틸리티
│   └── types/         # TypeScript 타입 정의
├── public/            # 정적 리소스
├── tailwind.config.ts # Tailwind CSS 설정
└── package.json
```

### 상태 관리 패턴
- **인증**: localStorage 지속성을 가진 Zustand 스토어
- **장바구니**: 로컬/서버 동기화를 사용한 Zustand 스토어
- **서버 데이터**: 캐싱 및 동기화를 위한 React Query
- **폼 상태**: Zod 검증 스키마와 함께 React Hook Form

### API 통신 패턴
- `src/lib/api.ts`의 ApiClient 클래스 사용
- JWT 토큰 자동 포함
- 타입 안전한 API 호출
- 에러 처리 및 로딩 상태 관리

## 개발 워크플로

### 새로운 페이지 추가
1. `src/app/`에 페이지 컴포넌트 생성
2. 필요시 레이아웃 컴포넌트 추가
3. API 데이터 페칭을 위한 커스텀 훅 생성
4. Tailwind CSS로 스타일링

### 새로운 컴포넌트 추가
1. `src/components/`에 컴포넌트 파일 생성
2. 적절한 props 타입 정의
3. Tailwind CSS 클래스 사용
4. 필요시 커스텀 훅 활용

### 상태 관리 추가
1. `src/stores/`에 Zustand 스토어 생성
2. 필요시 localStorage 지속성 추가
3. 컴포넌트에서 훅으로 상태 사용

### API 통신 추가
1. `src/lib/api.ts`에 API 메소드 추가
2. `src/hooks/`에 React Query 훅 생성
3. 컴포넌트에서 훅 사용하여 데이터 페칭

## 환경 변수 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## 주요 파일 위치

### 진입점
- `src/app/layout.tsx` - 프로바이더가 포함된 루트 레이아웃
- `src/app/page.tsx` - 홈 페이지

### API 통신
- `src/lib/api.ts` - 중앙집중식 API 통신
- `src/lib/query-client.ts` - React Query 클라이언트 설정

### 상태 관리
- `src/stores/auth-store.ts` - 인증 상태
- `src/stores/cart-store.ts` - 장바구니 상태
- `src/stores/ui-store.ts` - UI 상태

### 커스텀 훅
- `src/hooks/use-auth.ts` - 인증 관련 훅
- `src/hooks/use-cart.ts` - 장바구니 관련 훅
- `src/hooks/use-products.ts` - 상품 관련 훅

## 컴포넌트 구조

### 레이아웃 컴포넌트
- `src/components/layout/header.tsx` - 헤더
- `src/components/layout/footer.tsx` - 푸터
- `src/components/layout/main-layout.tsx` - 메인 레이아웃

### UI 컴포넌트
- `src/components/ui/` - 재사용 가능한 기본 UI 컴포넌트
- Radix UI 기반 컴포넌트 사용
- Tailwind CSS 스타일링

### 상품 관련 컴포넌트
- `src/components/product/product-card.tsx` - 상품 카드

## 스타일링 가이드

### Tailwind CSS
- 유틸리티 클래스 우선 사용
- 반응형 디자인 고려
- 일관된 색상 팔레트 사용
- 컴포넌트 베이스 스타일링

### 반응형 디자인
- 모바일 우선 접근법
- 적절한 브레이크포인트 사용
- 터치 친화적 UI 요소

## 일반적인 문제 및 해결방법

### Next.js App Router
- 서버 컴포넌트와 클라이언트 컴포넌트 구분
- 'use client' 지시어 적절히 사용
- 동적 라우팅 활용

### 상태 관리
- 클라이언트 사이드 상태와 서버 상태 분리
- localStorage 동기화 주의
- 하이드레이션 에러 방지

### API 통신
- 에러 처리 및 로딩 상태 관리
- 토큰 만료 처리
- 캐싱 전략 적용

## 코드 스타일 및 규칙

- TypeScript strict 모드 활성화
- Next.js 설정을 사용한 ESLint
- 경로 별칭 (`@/`)을 사용한 일관된 import 문
- 유틸리티 우선 접근 방식의 Tailwind CSS 스타일링
- 런타임 검증을 위한 Zod 스키마
- 비동기 작업을 위한 async/await 패턴
- 함수형 컴포넌트 사용
- 커스텀 훅을 통한 로직 재사용