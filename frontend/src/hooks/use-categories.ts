import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Category } from '@/types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.getCategories();
      if (response.success && response.data) {
        return response.data as Category[];
      }
      throw new Error(response.error || 'Failed to fetch categories');
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (cacheTime → gcTime으로 변경됨)
    retry: (failureCount, error) => {
      // 네트워크 오류의 경우 3회까지 재시도
      if (error instanceof Error && error.message.includes('네트워크 연결')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCategoryById(id: string) {
  return useQuery<Category>({
    queryKey: ['categories', id],
    queryFn: async () => {
      const response = await apiClient.getCategory(id);
      if (response.success && response.data) {
        return response.data as Category;
      }
      throw new Error(response.error || 'Failed to fetch category');
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category>({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      const response = await apiClient.getCategoryBySlug(slug);
      if (response.success && response.data) {
        return response.data as Category;
      }
      throw new Error(response.error || 'Failed to fetch category by slug');
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}