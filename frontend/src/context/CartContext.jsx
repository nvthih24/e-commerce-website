import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
      const savedCart = localStorage.getItem('techstore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    });

// Tự động lưu xuống localStorage mỗi khi biến 'cart' bị thay đổi
  useEffect(() => {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
  }, [cart]);

  // 1. Hàm thêm sản phẩm (mặc định cho nó được tick sẵn: isSelected = true)
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, isSelected: true }]; // <-- Thêm isSelected
    });
    toast.success(`Đã thêm ${product.name} vào giỏ! 🛒`);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) => prevCart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // 2. HÀM MỚI: Tick/Bỏ tick 1 sản phẩm
  const toggleItemSelection = (id) => {
    setCart((prevCart) => prevCart.map(item =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  // 3. HÀM MỚI: Tick/Bỏ tick TẤT CẢ sản phẩm
  const toggleAllSelection = (isSelectAll) => {
    setCart((prevCart) => prevCart.map(item => ({ ...item, isSelected: isSelectAll })));
  };

  // 4. TÍNH TOÁN LẠI:
  // Tổng số lượng hiển thị trên Header (vẫn tính tất cả món trong giỏ)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tổng tiền và Tổng số món ĐÃ ĐƯỢC TICK (Để thanh toán)
  const selectedItemsCount = cart.filter(item => item.isSelected).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.filter(item => item.isSelected).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Kiểm tra xem có phải đang tick chọn tất cả không
  const isAllSelected = cart.length > 0 && cart.every(item => item.isSelected);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      totalItems, cartTotal, selectedItemsCount,
      toggleItemSelection, toggleAllSelection, isAllSelected // <-- Nhớ xuất mấy biến mới ra
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);