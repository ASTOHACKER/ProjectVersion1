'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// สร้าง context สำหรับตะกร้าสินค้า
const CartContext = createContext();

export function CartProvider({ children }) {
  // สร้าง state สำหรับเก็บรายการสินค้าในตะกร้า
  const [cartItems, setCartItems] = useState([]);

  // โหลดข้อมูลตะกร้าจาก localStorage เมื่อ component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // บันทึกข้อมูลตะกร้าลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // เพิ่มสินค้าลงในตะกร้า
  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    if (cartItems.length === 1) {
      localStorage.removeItem('cart');
    }
  };

  // อัพเดทจำนวนสินค้าในตะกร้า
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // ล้างตะกร้าสินค้าทั้งหมด
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // คำนวณราคารวมของสินค้าในตะกร้า
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // นับจำนวนสินค้าทั้งหมดในตะกร้า
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // สร้าง context provider พร้อมค่าที่จะส่งไปยัง consumer
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

// สร้าง custom hook สำหรับใช้งาน CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
