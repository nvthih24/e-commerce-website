import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { categories } from '../data/mockData';

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-2 lg:gap-4">

        {/* ========================================== */}
        {/* CỤM TRÁI: LOGO & DANH MỤC (Thả tự do chiều rộng) */}
        {/* ========================================== */}
        <div className="flex items-center gap-3 lg:gap-6 shrink-0">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <span>⚡</span> TechStore
          </Link>

          {/* NÚT DANH MỤC */}
          <div className="relative group hidden lg:block z-50">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap">
              <span className="text-xl leading-none">☰</span> Danh mục
            </button>

            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
              <div className="py-2">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    <span className="text-xl">{category.icon}</span>
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link to="/products" className="block px-5 py-3 text-center text-blue-600 hover:bg-blue-50 font-bold transition-colors">
                    Xem tất cả sản phẩm &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* CỤM GIỮA: THANH TÌM KIẾM (Tự động chiếm hết khoảng trống)  */}
        {/* ========================================== */}
        <div className="flex-1 max-w-3xl hidden md:block px-2 lg:px-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-20 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all shadow-inner"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">🔍</span>
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* ========================================== */}
        {/* CỤM PHẢI: YÊU THÍCH, GIỎ HÀNG, USER (Cấm rớt dòng) */}
        {/* ========================================== */}
        <nav className="flex items-center justify-end gap-4 lg:gap-6 shrink-0">

          {/* Gắn whitespace-nowrap để chữ Yêu thích luôn nằm trên 1 dòng */}
          <Link to="/account" state={{ tab: 'wishlist' }} className="text-gray-700 hover:text-red-500 font-medium transition flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-2xl leading-none">❤️</span>
            <span className="hidden lg:block">Yêu thích</span>
            {wishlist.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{wishlist.length}</span>
            )}
          </Link>

          {/* Gắn whitespace-nowrap cho Giỏ hàng */}
          <Link to="/cart" className="text-gray-700 hover:text-green-600 font-medium transition flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-2xl leading-none">🛒</span>
            <span className="hidden lg:block">Giỏ Hàng</span>
            {totalItems > 0 && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <Link to="/account" className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1.5 rounded-full transition-colors border border-transparent hover:border-gray-100 whitespace-nowrap">
              <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full shadow-sm border border-gray-200 bg-white shrink-0" />
              <span className="hidden sm:block font-bold text-gray-700">{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl font-bold transition-colors border border-blue-100 shadow-sm whitespace-nowrap">
              Đăng nhập
            </Link>
          )}

        </nav>

      </div>
    </header>
  );
}