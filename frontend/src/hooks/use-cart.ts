import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Product } from '@/types';
import { useEffect } from 'react';

// Sync cart with server
export function useCartSync() {
  const { isAuthenticated } = useAuthStore();
  const { syncWithServer, items } = useCartStore();
  
  const { data: serverCart, isLoading } = useQuery({
    queryKey: queryKeys.cart,
    queryFn: async () => {
      const response = await apiClient.getCart();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sync cart when server data is available
  useEffect(() => {
    if (serverCart && isAuthenticated && !isLoading) {
      syncWithServer(serverCart.items);
    }
  }, [serverCart, isAuthenticated, isLoading, syncWithServer]);

  return { serverCart, isLoading };
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();
  const { addItem, setLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async ({ product, quantity = 1 }: { product: Product; quantity?: number }) => {
      if (isAuthenticated) {
        // If user is authenticated, sync with server
        return apiClient.addToCart({ productId: product.id, quantity });
      } else {
        // If user is not authenticated, store in local storage only
        return Promise.resolve();
      }
    },
    onMutate: ({ product, quantity = 1 }) => {
      setLoading(true);
      // Optimistically update local state
      addItem(product, quantity);
    },
    onSuccess: (_, { product }) => {
      showToast(`${product.name}이(가) 장바구니에 추가되었습니다`, 'success');
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
    onError: (error: any, { product }) => {
      showToast(error.message || '장바구니 추가에 실패했습니다', 'error');
      // Revert optimistic update on error
      // TODO: Implement revert logic
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Remove item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { removeItem, setLoading, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        // Find the cart item ID from the store
        const cartItem = items.find(item => item.product.id === productId);
        if (cartItem) {
          return apiClient.removeFromCart(cartItem.id);
        }
      }
      return Promise.resolve();
    },
    onMutate: (productId: string) => {
      setLoading(true);
      // Optimistically update local state
      removeItem(productId);
    },
    onSuccess: () => {
      showToast('상품이 장바구니에서 제거되었습니다', 'info');
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
    onError: (error: any) => {
      showToast(error.message || '장바구니에서 제거에 실패했습니다', 'error');
      // Revert optimistic update on error
      // TODO: Implement revert logic
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Update item quantity in cart
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  const { updateQuantity, setLoading, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (isAuthenticated) {
        // Find the cart item ID from the store
        const cartItem = items.find(item => item.product.id === productId);
        if (cartItem) {
          return apiClient.updateCartItem(cartItem.id, quantity);
        }
      }
      return Promise.resolve();
    },
    onMutate: ({ productId, quantity }) => {
      setLoading(true);
      // Optimistically update local state
      updateQuantity(productId, quantity);
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
    onError: (error: any) => {
      showToast(error.message || '수량 변경에 실패했습니다', 'error');
      // Revert optimistic update on error
      // TODO: Implement revert logic
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();
  const { clearCart, setLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        // In real app, this would be a server call to clear cart
        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    },
    onMutate: () => {
      setLoading(true);
      clearCart();
    },
    onSuccess: () => {
      showToast('장바구니가 비워졌습니다', 'info');
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
    onError: (error: any) => {
      showToast(error.message || '장바구니 비우기에 실패했습니다', 'error');
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}