import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);
  // Hàm hỗ trợ format tiền tệ chuẩn VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Hình ảnh sản phẩm (Hiệu ứng zoom nhẹ khi hover) */}
      <Link
        to={`/product/${product.id}`}
        className="block overflow-hidden relative group"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300 bg-gray-50 object-center"
        />
        {/* Tag giảm giá */}
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            -{product.discount}%
          </span>
        )}
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-gray-800 font-medium text-base line-clamp-2 hover:text-blue-600 transition-colors h-12">
            {product.name}
          </h3>
        </Link>

        {/* Đánh giá sao (Giả lập) */}
        <div className="flex items-center mt-2 mb-3">
          <span className="text-yellow-400 text-sm">★★★★★</span>
          <span className="text-gray-400 text-xs ml-2">(12)</span>
        </div>

        {/* Cụm Giá & Nút Add to Cart ép nằm dưới cùng */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.oldPrice && (
              <span className="text-gray-400 text-sm line-through block mb-0.5">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-red-600 font-bold text-lg">
              {formatPrice(product.price)}
            </span>
          </div>
          {/* Cụm nút Yêu thích  */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault(); // Ngăn chặn nhảy trang
                toggleWishlist(product);
              }}
              className={`p-2.5 rounded-lg transition-colors border ${isFavorite ? "bg-red-50 text-red-500 border-red-100" : "bg-gray-50 text-gray-400 border-gray-100 hover:text-red-500 hover:bg-red-50"} focus:outline-none focus:ring-2 focus:ring-red-200`}
              title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
            {/* Gắn sự kiện onClick vào đây */}
            <button
              onClick={(e) => {
                e.preventDefault(); // Mẹo UX: Ngăn chặn click lan truyền (phòng hờ ông bọc thẻ Link bên ngoài sau này)
                addToCart(product);
              }}
              className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-300"
              title="Thêm vào giỏ hàng"
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
