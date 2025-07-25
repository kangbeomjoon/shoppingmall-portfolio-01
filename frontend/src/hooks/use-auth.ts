import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { LoginData, RegisterData } from '@/types';

// Get current user
export function useMe() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => apiClient.getMe(),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (data: LoginData) => apiClient.login(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      const { token, user } = response.data || {};
      if (token && user) {
        login(user, token);
        queryClient.setQueryData(queryKeys.me, user);
        showToast('로그인되었습니다', 'success');
        router.push('/');
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      showToast(error.message || '로그인에 실패했습니다', 'error');
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (data: RegisterData) => apiClient.register(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      const { token, user } = response.data || {};
      if (token && user) {
        login(user, token);
        queryClient.setQueryData(queryKeys.me, user);
        showToast('회원가입이 완료되었습니다', 'success');
        router.push('/');
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      showToast(error.message || '회원가입에 실패했습니다', 'error');
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      logout();
      queryClient.removeQueries({ queryKey: queryKeys.me });
      queryClient.removeQueries({ queryKey: queryKeys.cart });
      queryClient.removeQueries({ queryKey: queryKeys.orders });
      showToast('로그아웃되었습니다', 'info');
      router.push('/');
    },
    onError: () => {
      // Even if logout fails on server, we should logout on client
      logout();
      queryClient.removeQueries({ queryKey: queryKeys.me });
      showToast('로그아웃되었습니다', 'info');
      router.push('/');
    },
  });
}