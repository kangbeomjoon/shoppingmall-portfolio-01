import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 보호된 경로 목록
  const protectedPaths = [
    '/cart',
    '/checkout', 
    '/orders',
    '/profile',
    '/admin'
  ];
  
  // 현재 경로가 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // 보호된 경로에 접근하려는 경우
  if (isProtectedPath) {
    // 쿠키에서 토큰 확인 (서버 컴포넌트에서는 localStorage 접근 불가)
    const token = request.cookies.get('token')?.value;
    
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // Admin 라우트는 추가 권한 검증 필요 (현재는 로그인만 체크)
    // TODO: JWT 디코드해서 role 확인하거나 API 호출로 권한 검증
    if (pathname.startsWith('/admin')) {
      // 임시로 모든 로그인 사용자가 admin 접근 가능
      // 실제로는 user.role === 'ADMIN' 체크 필요
    }
  }
  
  // 이미 로그인한 상태에서 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
  if ((pathname === '/login' || pathname === '/register')) {
    const token = request.cookies.get('token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
};