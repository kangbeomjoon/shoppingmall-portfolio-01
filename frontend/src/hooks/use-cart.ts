import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Product } from '@/types';

interface CartItemResponse {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

interface CartResponse {
  items: CartItemResponse[];
  totalItems: number;
  totalAmount: number;
}

export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { syncWithServer, addItem: addItemLocal, removeItem: removeItemLocal, updateQuantity: updateQuantityLocal } = useCartStore();
  const { showToast } = useUIStore();

  // 장바구니 조회
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await apiClient.get<CartResponse>('/cart');
      if (response.success && response.data) {
        // 서버 데이터로 로컬 상태 동기화
        syncWithServer(response.data.items);
        return response.data;
      }
      throw new Error('장바구니를 불러올 수 없습니다.');
    },
    enabled: isAuthenticated, // 로그인한 경우에만 조회
  });

  // 장바구니에 상품 추가
  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiClient.post('/cart', { productId, quantity });
      if (!response.success) {
        throw new Error(response.error?.message || '상품을 추가할 수 없습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast('장바구니에 추가되었습니다.', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });

  // 장바구니 아이템 수량 수정
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await apiClient.put(`/cart/${itemId}`, { quantity });
      if (!response.success) {
        throw new Error(response.error?.message || '수량을 변경할 수 없습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });

  // 장바구니에서 아이템 삭제
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiClient.delete(`/cart/${itemId}`);
      if (!response.success) {
        throw new Error(response.error?.message || '상품을 삭제할 수 없습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast('상품이 삭제되었습니다.', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });

  // 로그인하지 않은 경우 로컬 함수 사용
  const addItem = (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      addItemMutation.mutate({ productId: product.id, quantity });
    } else {
      addItemLocal(product, quantity);
      showToast('로그인하면 장바구니가 저장됩니다.', 'info');
    }
  };

  const updateQuantity = (itemId: string, productId: string, quantity: number) => {
    if (isAuthenticated) {
      updateQuantityMutation.mutate({ itemId, quantity });
    } else {
      updateQuantityLocal(productId, quantity);
    }
  };

  const removeItem = (itemId: string, productId: string) => {
    if (isAuthenticated) {
      removeItemMutation.mutate(itemId);
    } else {
      removeItemLocal(productId);
    }
  };

  return {
    cart: data,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    isAddingItem: addItemMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
  };
}