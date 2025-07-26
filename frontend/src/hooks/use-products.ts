import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';
import { PaginatedResponse } from '@/lib/api';

interface UseProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useProducts(params: UseProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      try {
        const response = await apiClient.getProducts(params);
        if (response.success && response.data) {
          return response.data as PaginatedResponse<Product>;
        }
        throw new Error(response.error || '상품 목록을 불러오는데 실패했습니다.');
      } catch (error) {
        console.error('Products fetch error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('네트워크 연결')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const response = await apiClient.getProduct(id);
        if (response.success && response.data) {
          return response.data as Product;
        }
        throw new Error(response.error || '상품 정보를 불러오는데 실패했습니다.');
      } catch (error) {
        console.error('Product fetch error:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('네트워크 연결')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

