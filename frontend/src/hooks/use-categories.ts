import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Category } from '@/types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await apiClient.getCategories();
        if (response.success && response.data) {
          return response.data as Category[];
        }
        throw new Error(response.error || '카테고리를 불러오는데 실패했습니다.');
      } catch (error) {
        console.error('Categories fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (cacheTime → gcTime으로 변경됨)
    retry: (failureCount, error) => {
      // 네트워크 오류의 경우 최대 3번 재시도
      if (error instanceof Error && error.message.includes('네트워크 연결')) {
        return failureCount < 3;
      }
      // 다른 오류의 경우 1번만 재시도
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCategoryById(id: string) {
  return useQuery<Category>({
    queryKey: ['categories', id],
    queryFn: async () => {
      try {
        const response = await apiClient.getCategory(id);
        if (response.success && response.data) {
          return response.data as Category;
        }
        throw new Error(response.error || '카테고리 정보를 불러오는데 실패했습니다.');
      } catch (error) {
        console.error('Category fetch error:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('네트워크 연결')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category>({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      try {
        const response = await apiClient.getCategoryBySlug(slug);
        if (response.success && response.data) {
          return response.data as Category;
        }
        throw new Error(response.error || '카테고리 정보를 불러오는데 실패했습니다.');
      } catch (error) {
        console.error('Category by slug fetch error:', error);
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('네트워크 연결')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}