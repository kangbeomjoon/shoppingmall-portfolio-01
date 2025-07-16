import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Product } from '@/types';

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
  const { removeItem, setLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        // Find the cart item ID first (this would be handled differently in real app)
        // For now, using productId as cartItemId
        return apiClient.removeFromCart(productId);
      } else {
        return Promise.resolve();
      }
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
  const { updateQuantity, setLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (isAuthenticated) {
        return apiClient.updateCartItem(productId, quantity);
      } else {
        return Promise.resolve();
      }
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