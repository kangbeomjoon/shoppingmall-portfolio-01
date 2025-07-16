import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  // Auth
  me: ['auth', 'me'] as const,
  
  // Products
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  productsByCategory: (categoryId: string) => ['products', 'category', categoryId] as const,
  searchProducts: (query: string) => ['products', 'search', query] as const,
  featuredProducts: ['products', 'featured'] as const,
  
  // Categories
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
  categoryBySlug: (slug: string) => ['categories', 'slug', slug] as const,
  
  // Cart
  cart: ['cart'] as const,
  
  // Orders
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
} as const;