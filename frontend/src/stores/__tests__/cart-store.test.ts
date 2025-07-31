import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '../cart-store'
import { Product } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('CartStore', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    stock: 10,
    imageUrl: 'https://example.com/image.jpg',
    category: {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
    },
    categoryId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProduct2: Product = {
    id: '2',
    name: 'Test Product 2',
    description: 'Test description 2',
    price: 149.99,
    stock: 5,
    imageUrl: 'https://example.com/image2.jpg',
    category: {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
    },
    categoryId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.clearCart()
    })
    jest.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have empty cart initially', () => {
      const { result } = renderHook(() => useCartStore())
      
      expect(result.current.items).toEqual([])
      expect(result.current.totalItems).toBe(0)
      expect(result.current.totalAmount).toBe(0)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('addItem', () => {
    it('should add new item to cart', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].product).toEqual(mockProduct)
      expect(result.current.items[0].quantity).toBe(2)
      expect(result.current.totalItems).toBe(2)
      expect(result.current.totalAmount).toBe(199.98) // 99.99 * 2
    })

    it('should add item with default quantity of 1', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct)
      })

      expect(result.current.items[0].quantity).toBe(1)
      expect(result.current.totalItems).toBe(1)
      expect(result.current.totalAmount).toBe(99.99)
    })

    it('should update quantity when adding existing item', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
      })
      
      act(() => {
        result.current.addItem(mockProduct, 3)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(5)
      expect(result.current.totalItems).toBe(5)
      expect(result.current.totalAmount).toBe(499.95) // 99.99 * 5
    })

    it('should not exceed stock limit when adding item', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 15) // More than stock (10)
      })

      expect(result.current.items[0].quantity).toBe(10) // Limited to stock
      expect(result.current.totalItems).toBe(10)
    })

    it('should not exceed stock limit when updating existing item', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 8)
      })
      
      act(() => {
        result.current.addItem(mockProduct, 5) // Would exceed stock (10)
      })

      expect(result.current.items[0].quantity).toBe(10) // Limited to stock
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
        result.current.addItem(mockProduct2, 1)
      })

      expect(result.current.items).toHaveLength(2)

      act(() => {
        result.current.removeItem(mockProduct.id)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].product.id).toBe(mockProduct2.id)
      expect(result.current.totalItems).toBe(1)
      expect(result.current.totalAmount).toBe(149.99)
    })

    it('should handle removing non-existent item gracefully', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 1)
      })

      const initialState = {
        items: result.current.items,
        totalItems: result.current.totalItems,
        totalAmount: result.current.totalAmount,
      }

      act(() => {
        result.current.removeItem('non-existent-id')
      })

      expect(result.current.items).toEqual(initialState.items)
      expect(result.current.totalItems).toBe(initialState.totalItems)
      expect(result.current.totalAmount).toBe(initialState.totalAmount)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
      })

      act(() => {
        result.current.updateQuantity(mockProduct.id, 5)
      })

      expect(result.current.items[0].quantity).toBe(5)
      expect(result.current.totalItems).toBe(5)
      expect(result.current.totalAmount).toBe(499.95)
    })

    it('should remove item when quantity is set to 0', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
        result.current.addItem(mockProduct2, 1)
      })

      act(() => {
        result.current.updateQuantity(mockProduct.id, 0)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].product.id).toBe(mockProduct2.id)
    })

    it('should remove item when quantity is negative', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
      })

      act(() => {
        result.current.updateQuantity(mockProduct.id, -1)
      })

      expect(result.current.items).toHaveLength(0)
      expect(result.current.totalItems).toBe(0)
      expect(result.current.totalAmount).toBe(0)
    })

    it('should not exceed stock limit when updating quantity', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
      })

      act(() => {
        result.current.updateQuantity(mockProduct.id, 15) // More than stock (10)
      })

      expect(result.current.items[0].quantity).toBe(10) // Limited to stock
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
        result.current.addItem(mockProduct2, 3)
      })

      expect(result.current.items).toHaveLength(2)

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.items).toEqual([])
      expect(result.current.totalItems).toBe(0)
      expect(result.current.totalAmount).toBe(0)
    })
  })

  describe('getItemQuantity', () => {
    it('should return correct quantity for existing item', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 3)
      })

      const quantity = result.current.getItemQuantity(mockProduct.id)
      expect(quantity).toBe(3)
    })

    it('should return 0 for non-existent item', () => {
      const { result } = renderHook(() => useCartStore())
      
      const quantity = result.current.getItemQuantity('non-existent-id')
      expect(quantity).toBe(0)
    })
  })

  describe('setLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useCartStore())
      
      expect(result.current.isLoading).toBe(false)

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('total calculations', () => {
    it('should calculate totals correctly with multiple items', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2) // 99.99 * 2 = 199.98
        result.current.addItem(mockProduct2, 3) // 149.99 * 3 = 449.97
      })

      expect(result.current.totalItems).toBe(5)
      expect(result.current.totalAmount).toBe(649.95) // 199.98 + 449.97
    })

    it('should update totals when items are modified', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.addItem(mockProduct, 2)
        result.current.addItem(mockProduct2, 3)
      })

      act(() => {
        result.current.updateQuantity(mockProduct.id, 1) // Reduce first product
        result.current.removeItem(mockProduct2.id) // Remove second product
      })

      expect(result.current.totalItems).toBe(1)
      expect(result.current.totalAmount).toBe(99.99)
    })
  })
})