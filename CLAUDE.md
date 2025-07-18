# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 수 있는 가이드를 제공합니다.

## 프로젝트 개요

현대적인 기술 스택으로 구축된 풀스택 이커머스 포트폴리오 프로젝트입니다. 사용자 인증, 상품 관리, 장바구니, 결제 연동을 포함한 완전한 쇼핑몰 구현을 보여줍니다.

## 프로젝트 구조

```
shoppingmall-portfolio-01/
├── frontend/          # Next.js 프론트엔드 애플리케이션
│   └── CLAUDE.md     # 프론트엔드 개발 가이드
├── backend/          # Express.js 백엔드 API
│   └── CLAUDE.md     # 백엔드 개발 가이드
├── docs/             # 프로젝트 문서
└── README.md         # 프로젝트 설명서
```

## 통합 개발 명령어

### 프로젝트 설정
```bash
# 모든 의존성 설치 (root, frontend, backend)
npm run install:all

# 프론트엔드와 백엔드를 개발 모드로 실행
npm run dev

# 프론트엔드와 백엔드 빌드
npm run frontend:build && npm run backend:build

# 프론트엔드와 백엔드 테스트 실행
npm test
```

### 개별 서비스 개발
각 서비스별 세부 개발 가이드는 해당 폴더의 CLAUDE.md 파일을 참고하세요:

- **백엔드 개발**: `backend/CLAUDE.md` 참고
- **프론트엔드 개발**: `frontend/CLAUDE.md` 참고

## 기술 스택 개요

### 백엔드 (backend/)
- **프레임워크**: Express.js with TypeScript
- **데이터베이스**: PostgreSQL with Prisma ORM
- **인증**: JWT 토큰 + bcrypt 비밀번호 해싱
- **API 구조**: 미들웨어 기반 RESTful API
- **보안**: Helmet, CORS, rate limiting, Zod 입력 검증

### 프론트엔드 (frontend/)
- **프레임워크**: Next.js 15 with App Router and TypeScript
- **스타일링**: Tailwind CSS with Radix UI components
- **상태 관리**: Zustand (전역 상태), React Query (서버 상태)
- **폼 처리**: React Hook Form with Zod validation
- **API 통신**: TypeScript 인터페이스를 사용한 커스텀 ApiClient 클래스

## 주요 기능

### 핵심 기능
- **사용자 인증**: JWT 기반 로그인/회원가입 시스템
- **상품 관리**: 카테고리별 상품 카탈로그 및 상세 정보
- **장바구니**: 로컬/서버 동기화 장바구니 기능
- **주문 관리**: 주문 처리 및 내역 관리

### 데이터 모델
- **User**: 사용자 정보 및 인증
- **Product**: 상품 정보 및 카테고리
- **Category**: 상품 분류
- **CartItem**: 장바구니 아이템
- **Order/OrderItem**: 주문 및 주문 상세

## 환경 설정

### 필수 환경 변수
- **백엔드**: `backend/.env` 파일 참고
- **프론트엔드**: `frontend/.env.local` 파일 참고

### 포트 설정
- **백엔드**: 5001번 포트 (충돌 방지)
- **프론트엔드**: 3000번 포트

## 개발 시작하기

1. **저장소 클론 및 의존성 설치**
   ```bash
   git clone <repository-url>
   cd shoppingmall-portfolio-01
   npm run install:all
   ```

2. **환경 변수 설정**
   - `backend/.env` 파일 생성 및 설정
   - `frontend/.env.local` 파일 생성 및 설정

3. **데이터베이스 설정**
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **개발 서버 실행**
   ```bash
   # 루트 디렉토리에서
   npm run dev
   ```

## 추가 정보

각 서비스별 상세한 개발 가이드는 다음을 참고하세요:

- **백엔드**: `backend/CLAUDE.md` - API 개발, 데이터베이스 관리, 인증 구현
- **프론트엔드**: `frontend/CLAUDE.md` - UI 개발, 상태 관리, 컴포넌트 구조

## 코드 스타일

- TypeScript strict 모드 활성화
- ESLint 규칙 준수
- 일관된 import 문 및 경로 별칭 사용
- Tailwind CSS 유틸리티 클래스 우선 사용
- Zod 스키마를 통한 런타임 검증