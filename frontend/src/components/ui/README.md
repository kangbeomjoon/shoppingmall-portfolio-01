# Linear Design System

Linear.app에서 영감을 받은 현대적이고 깔끔한 디자인 시스템입니다.

## 🎨 디자인 원칙

- **단순함**: 깔끔하고 미니멀한 디자인
- **일관성**: 모든 컴포넌트에서 일관된 시각적 언어
- **접근성**: WCAG 가이드라인을 준수하는 사용하기 쉬운 인터페이스
- **성능**: 빠른 로딩과 부드러운 애니메이션

## 🚀 빠른 시작

```tsx
import { Button, Card, CardContent, Badge } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button variant="primary">Click me</Button>
        <Badge variant="success">New</Badge>
      </CardContent>
    </Card>
  );
}
```

## 📦 컴포넌트

### 버튼 (Button)

```tsx
<Button variant="primary" size="default">Primary Button</Button>
<Button variant="secondary" size="sm">Secondary</Button>
<Button variant="ghost" size="lg">Ghost</Button>
```

**Variants**: `primary`, `secondary`, `ghost`, `destructive`, `outline`, `link`
**Sizes**: `xs`, `sm`, `default`, `lg`, `icon`

### 입력 필드 (Input)

```tsx
<Input placeholder="기본 입력" />
<Input variant="search" placeholder="검색..." />
<Input state="error" placeholder="오류 상태" />
```

**Variants**: `default`, `search`, `outline`
**States**: `default`, `error`, `success`
**Sizes**: `sm`, `default`, `lg`

### 카드 (Card)

```tsx
<Card variant="default">
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>
    카드 내용
  </CardContent>
</Card>
```

**Variants**: `default`, `compact`, `ghost`, `elevated`
**Sizes**: `sm`, `default`, `lg`, `none`

### 뱃지 (Badge)

```tsx
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
```

**Variants**: `primary`, `success`, `warning`, `error`, `info`, `secondary`, `outline`
**Sizes**: `sm`, `default`, `lg`

### 아바타 (Avatar)

```tsx
<Avatar size="md">
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**Sizes**: `sm`, `default`, `md`, `lg`, `xl`

### 링크 (Link)

```tsx
<Link href="/page" variant="primary">Primary Link</Link>
<Link href="/page" variant="accent" size="lg">Accent Link</Link>
<Link href="https://example.com" external>External Link</Link>
```

**Variants**: `primary`, `accent`, `muted`, `underline`, `ghost`
**Sizes**: `sm`, `default`, `lg`, `xl`

### 드롭다운 메뉴 (Dropdown Menu)

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 🎨 색상 시스템

### 기본 색상
- **Primary**: `#5e6ad2` (브랜드 메인 컬러)
- **Background**: `#08090a` (다크 배경)
- **Text**: `#f7f8f8` (메인 텍스트)
- **Muted**: `#8a8f98` (보조 텍스트)

### 상태 색상
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`

## 📏 타이포그래피

- **Font Family**: Inter Variable, SF Pro Display
- **Font Sizes**: 12px (xs) ~ 56px (6xl)
- **Font Weights**: 400 (normal), 510 (medium), 538 (semibold), 600 (bold)
- **Letter Spacing**: -1.82px (tight) ~ -0.182px (wide)

## 🌗 다크 테마

모든 컴포넌트는 다크 테마를 기본으로 디자인되었습니다.

```css
body {
  background-color: #08090a;
  color: #f7f8f8;
}
```

## 🔧 커스터마이징

### CSS 변수 사용

```css
:root {
  --color-accent-primary: #5e6ad2;
  --color-bg-primary: #08090a;
  --font-family-primary: "Inter Variable", sans-serif;
}
```

### Tailwind CSS 클래스

```tsx
<Button className="hover:shadow-lg transition-all duration-300">
  Custom Button
</Button>
```

## 📱 반응형 디자인

모든 컴포넌트는 모바일 우선으로 설계되었습니다.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Mobile: 1열, 태블릿: 2열, 데스크톱: 3열</Card>
</div>
```

## ♿ 접근성

- 키보드 네비게이션 지원
- ARIA 속성 포함
- 색상 대비 WCAG AA 준수
- 스크린 리더 지원

## 🧪 테스트

```bash
# 컴포넌트 테스트 실행
npm test

# 스토리북 실행 (개발 환경)
npm run storybook
```

## 📖 데모 페이지

전체 컴포넌트를 확인하려면 `/demo` 페이지를 방문하세요.

```bash
npm run dev
# http://localhost:3000/demo 접속
```

## 🤝 기여하기

1. 이슈 생성
2. 기능 브랜치 생성 (`git checkout -b feature/new-component`)
3. 변경사항 커밋 (`git commit -m 'feat: add new component'`)
4. 브랜치 푸시 (`git push origin feature/new-component`)
5. Pull Request 생성

## 📄 라이선스

MIT License - 자유롭게 사용하세요.

---

**Linear Design System** - Modern, Clean, Accessible UI Components