import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        fetchCart();
      } else {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
      }
    }
  }, [isAuthenticated, loading]);

  const fetchCart = async () => {
    try {
      const data = await api.getCart();
      setCartItems(data.cart.items || []);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const saveLocalCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const data = await api.addToCart(product._id || product, quantity);
        setCartItems(data.cart.items);
      } catch (error) {
        throw error;
      }
    } else {
      const newItems = [...cartItems];
      const existItem = newItems.find(x => (x.product._id || x.product) === (product._id || product));
      
      if (existItem) {
        existItem.quantity = quantity;
      } else {
        // Mock product detail for local storage
        newItems.push({ product, quantity });
      }
      saveLocalCart(newItems);
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const data = await api.removeFromCart(productId);
        setCartItems(data.cart.items);
      } catch (error) {
        throw error;
      }
    } else {
      const newItems = cartItems.filter(x => (x.product._id || x.product) !== productId);
      saveLocalCart(newItems);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    await addToCart(productId, quantity);
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.clearCart();
        setCartItems([]);
      } catch (error) {
        console.error(error);
      }
    } else {
      saveLocalCart([]);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
