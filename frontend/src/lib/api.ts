const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
console.log('🌍 Environment:', { 
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_BASE_URL,
  isClient: typeof window !== 'undefined'
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
    console.log('🔧 API Client initialized with baseUrl:', this.baseUrl);
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
      console.log('🔗 API Request:', { url, method: config.method || 'GET', headers: config.headers });
      const response = await fetch(url, config);
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        // 응답이 JSON이 아닌 경우 (HTML 에러 페이지 등)
        if (response.status >= 500) {
          throw new Error('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        throw new Error('서버로부터 잘못된 응답을 받았습니다.');
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
        
        // 상태 코드별 사용자 친화적 에러 메시지
        switch (response.status) {
          case 400:
            throw new Error(data?.error || '잘못된 요청입니다.');
          case 401:
            // 토큰이 만료되었거나 유효하지 않은 경우
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
          case 403:
            throw new Error('접근 권한이 없습니다.');
          case 404:
            throw new Error('요청한 리소스를 찾을 수 없습니다.');
          case 409:
            throw new Error(data?.error || '중복된 데이터입니다.');
          case 422:
            throw new Error(data?.error || '입력 데이터가 올바르지 않습니다.');
          case 429:
            throw new Error('너무 많은 요청입니다. 잠시 후 다시 시도해주세요.');
          case 500:
            throw new Error('서버 내부 오류가 발생했습니다.');
          case 502:
          case 503:
          case 504:
            throw new Error('서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
          default:
            throw new Error(errorMessage);
        }
      }

      return data;
    } catch (error) {
      console.error('API request failed:', { url, error });
      
      // 네트워크 에러나 다른 예외 상황 처리
      if (error instanceof Error) {
        // TypeError: Failed to fetch - 네트워크 연결 문제
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
          throw new Error('네트워크 연결을 확인해주세요. 서버에 연결할 수 없습니다.');
        }
        
        // 기타 에러는 그대로 전달
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