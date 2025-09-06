// Common types used throughout the application

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  seller: string;
  sellerAvatar: string;
  sellerRating: number;
  condition: string;
  location: string;
  description: string;
  isVerified: boolean;
  listedDate: string;
  views: number;
  likes: number;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  verified: boolean;
  memberSince: string;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}

export interface Filter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular';
}

export interface Purchase {
  id: string;
  productId: number;
  title: string;
  price: number;
  imageUrl: string;
  seller: string;
  purchaseDate: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export interface Listing {
  id: string;
  productId: number;
  title: string;
  price: number;
  imageUrl: string;
  status: 'active' | 'sold' | 'draft' | 'removed';
  views: number;
  likes: number;
  listedDate: string;
}

// Re-export from auth context
export type { User } from '../contexts/AuthContext';
export type { CartItem } from '../contexts/CartContext';