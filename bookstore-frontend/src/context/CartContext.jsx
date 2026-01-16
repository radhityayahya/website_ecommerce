import { createContext, useContext, useState } from "react";
const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: quantity } : item)));
  };
  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const checkItemExists = (id) => {
    return cart.some((item) => item.id === id);
  };
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, checkItemExists }}>
      {children}
    </CartContext.Provider>
  );
};