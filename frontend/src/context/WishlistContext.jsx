import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Hàm xử lý Thêm/Bỏ yêu thích
  const toggleWishlist = (product) => {
    // 1. Kiểm tra xem sản phẩm đã có trong danh sách chưa (Dùng biến wishlist hiện tại)
    const isExist = wishlist.find((item) => item.id === product.id);

    // 2. Tách phần hiện thông báo ra ngoài setWishlist
    if (isExist) {
      toast.error(`Đã bỏ ${product.name} khỏi danh sách yêu thích 💔`);
      // Xóa khỏi danh sách
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      toast.success(`Đã thêm ${product.name} vào danh sách yêu thích! ❤️`);
      // Thêm vào danh sách
      setWishlist([...wishlist, product]);
    }
  };

  // Hàm kiểm tra xem sản phẩm đã được tim chưa
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Tắt cảnh báo Fast Refresh
// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);
