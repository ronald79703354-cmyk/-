import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { CartItem, Product, CustomerInfo, Order, PaymentMethod } from '../types';

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number, sellingPrice: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  checkout: (customerInfo: CustomerInfo, paymentMethod: PaymentMethod) => Promise<Order>;
  itemCount: number;
  totalCost: number;
  totalRevenue: number;
  netProfit: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (e: any) {
      setError('Failed to fetch cart data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product, quantity: number, sellingPrice: number) => {
    setLoading(true);
    try {
      const updatedCart = await apiService.addToCart({ product, quantity, sellingPrice });
      setCart(updatedCart);
    } catch (e: any) {
      setError('Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    setLoading(true);
    try {
      const updatedCart = await apiService.updateCartItemQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (e: any) {
      setError('Failed to update item quantity.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    setLoading(true);
    try {
      const updatedCart = await apiService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (e: any) {
      setError('Failed to remove item from cart.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
      // In a real app this would call an API
      setCart([]);
  }

  const checkout = async (customerInfo: CustomerInfo, paymentMethod: PaymentMethod): Promise<Order> => {
      setLoading(true);
      try {
        const order = await apiService.checkout(customerInfo, cart, paymentMethod);
        setCart([]); // Clear cart on successful checkout
        return order;
      } catch (e: any) {
        setError('Checkout failed.');
        throw e;
      } finally {
        setLoading(false);
      }
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalRevenue = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const netProfit = totalRevenue - totalCost;

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    itemCount,
    totalCost,
    totalRevenue,
    netProfit,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};