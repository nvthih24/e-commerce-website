import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  // Lấy data và các hàm từ Context ra xài
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Nếu giỏ hàng trống, hiển thị UI kêu gọi mua hàng
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500 mb-8">
          Hãy chọn thêm vài món đồ công nghệ xịn xò nhé!
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  // Nếu có hàng, hiển thị Layout 2 cột
  return (
    <div className="pb-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Giỏ Hàng Của Bạn
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột trái: Danh sách sản phẩm */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header của bảng */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {/* Render từng món hàng */}
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  {/* Hình ảnh & Tên */}
                  <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-50 border border-gray-100"
                    />
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm mt-2 hover:underline flex items-center gap-1"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>

                  {/* Đơn giá */}
                  <div className="col-span-1 md:col-span-2 text-center md:text-gray-800 text-gray-500 font-medium">
                    <span className="md:hidden inline-block w-24 text-left">
                      Đơn giá:
                    </span>
                    {formatPrice(item.price)}
                  </div>

                  {/* Số lượng */}
                  <div className="col-span-1 md:col-span-2 flex justify-center items-center">
                    <span className="md:hidden inline-block w-24 text-left text-gray-500 font-medium">
                      Số lượng:
                    </span>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Tổng tiền của món đó */}
                  <div className="col-span-1 md:col-span-2 text-right font-bold text-red-600">
                    <span className="md:hidden inline-block w-24 text-left text-gray-500 font-medium font-normal">
                      Tổng:
                    </span>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Hóa đơn & Thanh toán */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-800">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span className="font-medium text-gray-800">Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <p className="text-right text-xs text-gray-500">
                (Đã bao gồm VAT nếu có)
              </p>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-200">
              <span>💳</span> Tiến Hành Thanh Toán
            </button>
            <Link
              to="/"
              className="block text-center mt-4 text-blue-600 hover:underline font-medium"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
