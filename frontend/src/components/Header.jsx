import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 flex items-center gap-2"
        >
          <span>⚡</span> TechStore
        </Link>
        <nav className="space-x-4 md:space-x-6 flex items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition hidden sm:block"
          >
            Trang Chủ
          </Link>
          <Link
            to="/cart"
            className="text-gray-700 hover:text-green-600 font-medium transition flex items-center gap-1 inline-flex"
          >
            <span>Giỏ Hàng</span>
            {totalItems > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full shadow-sm"
              />
              <span className="hidden sm:block font-medium text-gray-700">
                Chào, {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:text-red-700 font-medium ml-2 border-l border-gray-200 pl-4"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors border border-blue-100"
            >
              👤 Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
