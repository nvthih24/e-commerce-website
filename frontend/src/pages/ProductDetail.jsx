import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { mockProducts } from '../data/mockData';

export default function ProductDetail() {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const { addToCart } = useCart();

  const product = mockProducts.find(p => p.id === parseInt(id));

    if (!product) {
        return <div className="text-center py-20 text-2xl font-bold">Không tìm thấy sản phẩm! 😥</div>;
    }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="pb-10">
      {/* Breadcrumb (Đường dẫn điều hướng) */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Chi tiết sản phẩm</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-10">
        {/* Cột trái: Hình ảnh sản phẩm */}
        <div className="w-full md:w-1/2">
          <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          {/* Có thể thêm danh sách hình ảnh thu nhỏ (thumbnail) ở dưới đây sau */}
        </div>

        {/* Cột phải: Thông tin & Đặt hàng */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">★★★★★</div>
            <span className="text-gray-500 text-sm">(124 đánh giá)</span>
            <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-sm font-medium">
              Còn hàng
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through mb-1">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-2">
                  -{product.discount}%
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Cấu hình cơ bản */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">
              Thông số cơ bản:
            </h3>
            <ul className="space-y-2">
              {product.specs.map((spec, index) => (
                <li key={index} className="flex text-sm">
                  <span className="w-32 text-gray-500">{spec.label}:</span>
                  <span className="font-medium text-gray-800">
                    {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cụm nút bấm được ép xuống dưới cùng (mt-auto) */}
          <div className="mt-auto flex gap-4">
            <button
              onClick={() => addToCart(product)} // <-- Bắt sự kiện click ở đây
              className="flex-1 border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>🛒</span> Thêm vào giỏ
            </button>
            <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
