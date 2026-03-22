import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Provider để bọc các component khác
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Hàm thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Nếu có rồi thì tăng số lượng
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Nếu chưa có thì thêm mới vào mảng với quantity là 1
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Bật thông báo nhỏ cho ngầu (Sau này ông có thể thay bằng Toast UI)
    toast.success(`Đã thêm ${product.name} vào giỏ! 🛒`);
  };
  // Hàm xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.error("Đã xóa sản phẩm khỏi giỏ!");
  };

  // Hàm cập nhật số lượng (cộng/trừ)
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Không cho giảm xuống dưới 1
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
    toast.info("Đã cập nhật số lượng sản phẩm!");
  };

  // Tính tổng số lượng sản phẩm để hiển thị lên Header
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. Tạo custom hook để gọi cho lẹ
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
