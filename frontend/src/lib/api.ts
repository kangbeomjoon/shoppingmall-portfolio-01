const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// AuthStore를 동적으로 import하여 순환 참조 방지
let authStore: any = null;
const getAuthStore = async () => {
  if (!authStore) {
    const { useAuthStore } = await import('@/stores/auth-store');
    authStore = useAuthStore.getState();
  }
  return authStore;
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // 401 Unauthorized - 토큰이 만료되었거나 유효하지 않음
        if (response.status === 401) {
          const store = await getAuthStore();
          // 로그아웃 처리
          store.logout();
          // 로그인 페이지로 리다이렉트 (브라우저 환경에서만)
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic HTTP methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/api/products${query}`);
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  async getFeaturedProducts() {
    return this.request<any[]>('/api/products/featured');
  }

  async searchProducts(query: string) {
    return this.request(`/api/products/search?q=${encodeURIComponent(query)}`);
  }

  // Categories endpoints
  async getCategories() {
    return this.request<any[]>('/api/categories');
  }

  async getCategory(id: string) {
    return this.request(`/api/categories/${id}`);
  }

  async getCategoryBySlug(slug: string) {
    return this.request(`/api/categories/slug/${slug}`);
  }

  // Cart endpoints
  async getCart() {
    return this.request('/api/cart');
  }

  async addToCart(data: { productId: string; quantity: number }) {
    return this.request('/api/cart', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(id: string, quantity: number) {
    return this.request(`/api/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(id: string) {
    return this.request(`/api/cart/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async getOrders() {
    return this.request('/api/orders');
  }

  async createOrder(data: { shippingAddress: string; paymentMethod: string }) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrder(id: string) {
    return this.request(`/api/orders/${id}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;