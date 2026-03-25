import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const {
    cart, removeFromCart, updateQuantity, cartTotal,
    toggleItemSelection, toggleAllSelection, isAllSelected, selectedItemsCount
  } = useCart();

  const { user } = useAuth(); // Lấy thông tin user để tự điền form
  const navigate = useNavigate();

  // State quản lý bật/tắt Modal Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Lọc ra danh sách các món đang được tick chọn
  const selectedItems = cart.filter(item => item.isSelected);

  // Khởi tạo Form Checkout
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      phone: '',
      address: '',
      paymentMethod: 'cod' // Mặc định thanh toán khi nhận hàng
    }
  });

// Hàm xử lý khi bấm nút Mua Hàng
  const handleCheckoutClick = () => {
    if (!user) {
      // Nếu chưa đăng nhập: Cảnh báo và chuyển hướng sang trang Login
      toast.error('Vui lòng đăng nhập tài khoản để tiến hành thanh toán! 🔒');
      navigate('/login', { state: { from: '/cart' } });
    } else {
      // Đã đăng nhập: Mở Modal Checkout bình thường
      setIsCheckoutOpen(true);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Hàm xử lý khi bấm XÁC NHẬN ĐẶT HÀNG
  const onCheckoutSubmit = (data) => {
    console.log("Dữ liệu đơn hàng:", { items: selectedItems, total: cartTotal, customer: data });

    // Đóng modal, báo thành công và có thể chuyển hướng về trang Account tab Đơn hàng
    setIsCheckoutOpen(false);
    toast.success('🎉 Đặt hàng thành công! Đơn hàng đang được xử lý.');
    reset();

    // (Tùy chọn) Chuyển hướng về trang quản lý đơn hàng sau 1.5s
    // setTimeout(() => navigate('/account', { state: { tab: 'orders' } }), 1500);
  };

  // Giao diện khi giỏ hàng trống
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">Hãy chọn thêm vài món đồ công nghệ xịn xò nhé!</p>
        <Link to="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10 relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Giỏ Hàng Của Bạn</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột trái: Danh sách sản phẩm (Giữ nguyên như cũ) */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 items-center">
              <div className="col-span-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleAllSelection(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span>Sản phẩm</span>
              </div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.id} className={`p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-colors ${item.isSelected ? 'bg-blue-50/30' : ''}`}>
                  <div className="col-span-1 md:col-span-6 flex gap-3 md:gap-4 items-center">
                    <input
                      type="checkbox"
                      checked={!!item.isSelected}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-50 border border-gray-100 shrink-0" />
                    <div>
                      <Link to={`/product/${item.id}`} className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                        {item.name}
                      </Link>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm mt-2 hover:underline flex items-center gap-1">
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 text-center md:text-gray-800 text-gray-500 font-medium">
                    <span className="md:hidden inline-block w-24 text-left">Đơn giá:</span>
                    {formatPrice(item.price)}
                  </div>

                  <div className="col-span-1 md:col-span-2 flex justify-center items-center">
                    <span className="md:hidden inline-block w-24 text-left text-gray-500 font-medium">Số lượng:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-lg">-</button>
                      <span className="w-10 text-center text-sm font-medium text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-lg">+</button>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 text-right font-bold text-red-600">
                    <span className="md:hidden inline-block w-24 text-left text-gray-500 font-medium font-normal">Tổng:</span>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Hóa đơn & Nút kích hoạt Modal */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Tóm tắt đơn hàng</h2>

            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính ({selectedItemsCount} sản phẩm)</span>
                <span className="font-medium text-gray-800">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span className="font-medium text-gray-800">Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button
              disabled={selectedItemsCount === 0}
              onClick={handleCheckoutClick}
              className={`w-full font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 ${selectedItemsCount === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
            >
              <span>💳</span> Mua Hàng ({selectedItemsCount})
            </button>

            {/* Thêm dòng cảnh báo nhẹ nhàng nếu chưa đăng nhập */}
                        {!user && selectedItemsCount > 0 && (
                          <p className="text-center text-sm text-red-500 mt-3 font-medium">
                            * Yêu cầu đăng nhập để thanh toán
                          </p>
                        )}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL CHECKOUT (Hiển thị lơ lửng khi bấm Mua Hàng) */}
      {/* ========================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all">

            {/* Phần Form thông tin (Bên trái) */}
            <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Thông tin giao hàng</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="md:hidden text-gray-400 hover:text-red-500 text-2xl">&times;</button>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                  <input type="text" placeholder="Nhập họ và tên"
                    {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-100`} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="text" placeholder="Nhập số điện thoại"
                    {...register("phone", {
                      required: "Vui lòng nhập số điện thoại",
                      pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                    })}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-100`} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng chi tiết</label>
                  <textarea rows="3" placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    {...register("address", { required: "Vui lòng nhập địa chỉ giao hàng" })}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'} resize-none focus:outline-none focus:ring-2 focus:ring-blue-100`}></textarea>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-blue-200 bg-blue-50 rounded-xl cursor-pointer">
                      <input type="radio" value="cod" {...register("paymentMethod")} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-3 font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                      <input type="radio" value="banking" {...register("paymentMethod")} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-3 font-medium text-gray-800">Chuyển khoản ngân hàng (VNPay / Momo)</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Phần Tóm tắt đơn hàng (Bên phải) */}
            <div className="w-full md:w-2/5 bg-gray-50 p-6 md:p-8 flex flex-col border-l border-gray-200">
              <button onClick={() => setIsCheckoutOpen(false)} className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>

              <h3 className="text-lg font-bold text-gray-800 mb-6">Đơn hàng của bạn ({selectedItemsCount})</h3>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar max-h-[300px]">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-white" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">SL: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-red-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 flex gap-3">
                <button onClick={() => setIsCheckoutOpen(false)} className="px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Hủy
                </button>
                <button type="submit" form="checkout-form" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors">
                  Xác Nhận Đặt Hàng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}