import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, updateCartItem, removeCartItem, clearCartApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    setCartLoading(true);
    try {
      const { data } = await getCart();
      setCart(Array.isArray(data) ? data : []);
    } catch {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const existing = cart.find(i => i.productId === productId);
    const newQty = existing ? existing.quantity + quantity : quantity;
    await updateCartItem({ productId, quantity: newQty });
    await fetchCart();
  };

  const updateQuantity = async (productId, quantity) => {
    await updateCartItem({ productId, quantity });
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await removeCartItem(productId);
    await fetchCart();
  };

  const clearCart = async () => {
    await clearCartApi();
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
