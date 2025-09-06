const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// API client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    displayName: string;
    photoURL?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  // Product endpoints
  async getProducts(): Promise<Product[]> {
    return this.request('/products');
  }

  async getProduct(id: string): Promise<Product> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: CreateProductData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<CreateProductData>) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData: { displayName?: string; photoURL?: string }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Order endpoints
  async createOrder(orderData: { products: Array<{ product: string; quantity: number }>; shippingAddress: string }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async getAllOrders() {
    return this.request('/orders');
  }
}

// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  seller: {
    _id: string;
    displayName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}

export interface User {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Order {
  _id: string;
  user: string;
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// Export API client instance
export const api = new ApiClient(API_BASE_URL);

// Helper functions for transforming data between frontend and backend formats
export const transformProductToFrontend = (backendProduct: Product) => {
  const transformed = {
    id: backendProduct._id,
    title: backendProduct.name,
    price: backendProduct.price,
    category: backendProduct.category,
    imageUrl: backendProduct.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    seller: {
      name: backendProduct.seller.displayName || backendProduct.seller.email,
      rating: 4.8, // Default rating since backend doesn't have this yet
      verified: true,
    },
    condition: 'good' as const,
    location: 'Location not specified', // Default since backend doesn't have this
    timeAgo: new Date(backendProduct.createdAt).toLocaleDateString(),
    rating: 4.5, // Default rating
    stock: backendProduct.stock,
    description: backendProduct.description,
    images: [] as string[], // Add images array for compatibility
  };
  
  // Set images array
  transformed.images = [
    transformed.imageUrl,
    transformed.imageUrl,
    transformed.imageUrl
  ];
  
  return transformed;
};

export const transformProductToBackend = (frontendProduct: any): CreateProductData => {
  return {
    name: frontendProduct.title || frontendProduct.name,
    description: frontendProduct.description,
    price: frontendProduct.price,
    category: frontendProduct.category,
    imageUrl: frontendProduct.imageUrl,
    stock: frontendProduct.stock || 1,
  };
};

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);
