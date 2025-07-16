import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { Product, ProductFilters, PaginationParams } from '@/types';

// Get products with filters and pagination
export function useProducts(
  filters?: ProductFilters & PaginationParams
) {
  return useQuery({
    queryKey: [...queryKeys.products, filters],
    queryFn: () => apiClient.getProducts(filters),
    select: (data) => data.data,
  });
}

// Get single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => apiClient.getProduct(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

// Get featured products
export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.featuredProducts,
    queryFn: () => apiClient.getFeaturedProducts(),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Search products
export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: queryKeys.searchProducts(query),
    queryFn: () => apiClient.searchProducts(query),
    select: (data) => data.data,
    enabled: !!query && query.length > 0,
  });
}

// Get products by category
export function useProductsByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.productsByCategory(categoryId),
    queryFn: () => apiClient.getProducts({ categoryId }),
    select: (data) => data.data,
    enabled: !!categoryId,
  });
}