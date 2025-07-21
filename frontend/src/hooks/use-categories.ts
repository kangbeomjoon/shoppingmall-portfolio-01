import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Category } from '@/types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.getCategories();
      return response.data as Category[];
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (cacheTime → gcTime으로 변경됨)
  });
}

export function useCategoryById(id: string) {
  return useQuery<Category>({
    queryKey: ['categories', id],
    queryFn: async () => {
      const response = await apiClient.getCategory(id);
      return response.data as Category;
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
      return response.data as Category;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}