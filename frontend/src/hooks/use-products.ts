import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
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
      const response = await apiClient.getProducts(params);
      if (response.success && response.data) {
        return response.data as PaginatedResponse<Product>;
      }
      throw new Error(response.error || 'Failed to fetch products');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.getProduct(id);
      if (response.success && response.data) {
        return response.data as Product;
      }
      throw new Error(response.error || 'Failed to fetch product');
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.getCategories();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch categories');
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}