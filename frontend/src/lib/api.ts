const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// 디버깅을 위한 환경 정보 출력
console.log('🔧 API Client Environment:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_BASE_URL,
  isClient: typeof window !== 'undefined',
  currentURL: typeof window !== 'undefined' ? window.location.href : 'server-side'
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    console.log('🏗️ ApiClient initialized:', {
      baseUrl: this.baseUrl,
      timestamp: new Date().toISOString()
    });
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
      console.log('🚀 Making request:', {
        url,
        method: config.method || 'GET',
        headers: config.headers,
        hasBody: !!config.body,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(url, config);
      
      console.log('📡 Response received:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });

      let data;
      try {
        data = await response.json();
        console.log('📦 Response data:', data);
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON response:', jsonError);
        throw new Error('서버로부터 잘못된 응답을 받았습니다.');
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('❌ API Error:', { status: response.status, errorMessage, data });
        throw new Error(errorMessage);
      }

      console.log('✅ Request successful:', { url, data });
      return data;
    } catch (error) {
      console.error('💥 API request failed:', { 
        url, 
        error: error instanceof Error ? error.message : error,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString()
      });
      
      // 네트워크 에러나 다른 예외 상황 처리
      if (error instanceof Error) {
        // TypeError는 주로 네트워크 연결 문제
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
          throw new Error('네트워크 연결을 확인해주세요. 서버에 연결할 수 없습니다.');
        }
        throw error;
      }
      
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<{ user: any; token: string }>('/api/auth/login', {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<PaginatedResponse<any>>(`/api/products${query}`);
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  async getFeaturedProducts() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any[]>('/api/products/featured');
  }

  async searchProducts(query: string) {
    return this.request(`/api/products/search?q=${encodeURIComponent(query)}`);
  }

  // Categories endpoints
  async getCategories() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Admin endpoints
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createProduct(data: any) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateProduct(id: string, data: any) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT', 
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Generic methods for flexibility
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;