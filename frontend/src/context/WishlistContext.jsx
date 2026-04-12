import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // 1. Khởi tạo danh sách từ Local Storage (nếu có), không có thì mảng rỗng
    const [wishlist, setWishlist] = useState(() => {
      const savedWishlist = localStorage.getItem('techstore_wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    // 2. Lắng nghe thay đổi: Hễ cứ thả tim hoặc bỏ tim là tự động lưu ngay xuống trình duyệt
    useEffect(() => {
      localStorage.setItem('techstore_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

  // Hàm xử lý Thêm/Bỏ yêu thích
  const toggleWishlist = (product) => {
     const targetId = product._id || product.id;

    // 1. Kiểm tra xem sản phẩm đã có trong danh sách chưa (Dùng biến wishlist hiện tại)
    const isExist = wishlist.find((item) => (item._id || item.id) === targetId);

    // 2. Tách phần hiện thông báo ra ngoài setWishlist
    if (isExist) {
      toast.error(`Đã bỏ ${product.name} khỏi danh sách yêu thích 💔`);
      // Xóa khỏi danh sách
      setWishlist(wishlist.filter((item) => (item._id || item.id) !== targetId));
    } else {
      toast.success(`Đã thêm ${product.name} vào danh sách yêu thích! ❤️`);
      // Thêm vào danh sách
      setWishlist([...wishlist, product]);
    }
  };

  // Hàm kiểm tra xem sản phẩm đã được tim chưa
  const isInWishlist = (id) => {
    return wishlist.some(item => (item._id || item.id) === id);
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
