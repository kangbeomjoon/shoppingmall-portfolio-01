'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { fetchUser, token } = useAuthStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage의 토큰을 확인하고 사용자 정보 복원
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      // 토큰이 있지만 store에 없는 경우 (새로고침 등)
      fetchUser();
    }
  }, [fetchUser, token]);

  return <>{children}</>;
}