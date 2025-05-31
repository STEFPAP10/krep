import { createContext, useContext, useState } from "react";

// Δημιουργία του Context
const CartContext = createContext();

// Provider για τύλιγμα της εφαρμογής
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };
  const updateItemInCart = (updatedItem) => {
  setCart((prev) =>
    prev.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    )
  );
};


  const updateQuantity = (index, quantity) => {
    const updated = [...cart];
    if (updated[index]) {
      updated[index].quantity = quantity;
      setCart(updated);
    }
  };

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantityById = (productId, delta) => {
  setCart((prev) =>
    prev
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};


  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        updateQuantity,
        updateQuantityById,
        removeItem,
        clearCart,
        updateItemInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook για εύκολη πρόσβαση
export function useCart() {
  return useContext(CartContext);
}
