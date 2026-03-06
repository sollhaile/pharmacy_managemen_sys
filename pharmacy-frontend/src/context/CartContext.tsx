import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  batch_id: number;
  medicine_id: number;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  available_quantity: number;
  expiry_date: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (batchId: number) => void;
  updateQuantity: (batchId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.batch_id === item.batch_id);
      if (existing) {
        // Check if adding more would exceed available quantity
        const newQuantity = existing.quantity + item.quantity;
        if (newQuantity > item.available_quantity) {
          alert(`Only ${item.available_quantity} units available`);
          return prev;
        }
        return prev.map(i =>
          i.batch_id === item.batch_id
            ? { 
                ...i, 
                quantity: newQuantity,
                total_price: newQuantity * i.unit_price 
              }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (batchId: number) => {
    setItems(prev => prev.filter(i => i.batch_id !== batchId));
  };

  const updateQuantity = (batchId: number, quantity: number) => {
    setItems(prev =>
      prev.map(i =>
        i.batch_id === batchId
          ? { 
              ...i, 
              quantity, 
              total_price: quantity * i.unit_price 
            }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.total_price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
