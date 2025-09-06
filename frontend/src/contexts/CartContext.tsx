import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Cart item type
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  seller: string;
}

// Cart context type
interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    
    toast({
      title: "Added to Cart",
      description: `${newItem.title} has been added to your cart`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkout = async () => {
    try {
      const orderData = {
        products: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        shippingAddress: "Default shipping address" // In a real app, this would come from user input
      };

      await api.createOrder(orderData);
      
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and is being processed.",
      });
      
      clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    cartItems,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};