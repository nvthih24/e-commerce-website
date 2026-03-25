import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function Account() {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
      if (location.state?.tab) {
        setActiveTab(location.state.tab);
      }
    }, [location.state]);

  const { wishlist } = useWishlist();

  // Khởi tạo form với dữ liệu mặc định lấy từ user đang đăng nhập
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "0987654321", // Dữ liệu giả định
      address: "Trường ĐH HUTECH, Khu Công nghệ cao, TP.HCM", // Dữ liệu giả định
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const mockOrders = [
    {
      id: "DH-20260322-01",
      date: "22/03/2026",
      total: 24440000,
      status: "processing",
    },
    {
      id: "DH-20260315-88",
      date: "15/03/2026",
      total: 5490000,
      status: "delivered",
    },
    {
      id: "DH-20260228-42",
      date: "28/02/2026",
      total: 1250000,
      status: "cancelled",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
            ⏳ Đang xử lý
          </span>
        );
      case "delivered":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            ✅ Đã giao
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
            ❌ Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  // Hàm xử lý khi bấm Lưu thay đổi
  const onSubmitProfile = (data) => {
    // Cập nhật lại tên mới lên Header (chạy hàm login truyền data mới)
    login({ ...user, name: data.fullName, email: data.email });
    toast.success("Cập nhật thông tin cá nhân thành công! ✨");
  };

if (!user) {
    return <Navigate
      to="/login"
      replace
      state={{
        from: location.pathname,
        tab: location.state?.tab // Giữ lại thông tin tab (VD: 'wishlist')
      }}
    />;
  }

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Menu */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full shadow-sm"
              />
              <div>
                <p className="text-gray-500 text-sm">Tài khoản của</p>
                <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
              >
                👤 Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "orders" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
              >
                📦 Quản lý đơn hàng
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "wishlist" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
              >
                ❤️ Danh sách yêu thích
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full text-left px-4 py-3 rounded-xl font-medium transition-colors text-gray-600 hover:bg-gray-50"
              >
                🚪 Đăng xuất
              </button>
            </nav>
          </div>
        </div>

        {/* Khung nội dung */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full min-h-[500px]">
            {/* TAB: THÔNG TIN CÁ NHÂN */}
            {activeTab === "profile" && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Thông tin cá nhân
                </h2>

                {/* Khu vực đổi Avatar */}
                <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full shadow-sm border-2 border-white"
                  />
                  <div>
                    <div className="flex gap-3 mb-2">
                      <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        Đổi ảnh
                      </button>
                      <button className="bg-white border border-red-100 text-red-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                        Xóa
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Định dạng JPEG, PNG tối đa 2MB.
                    </p>
                  </div>
                </div>

                {/* Form nhập liệu */}
                <form
                  onSubmit={handleSubmit(onSubmitProfile)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ và tên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        {...register("fullName", {
                          required: "Vui lòng nhập họ tên",
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        {...register("phone", {
                          required: "Vui lòng nhập số điện thoại",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      disabled // Block không cho sửa email (chuẩn thực tế)
                      {...register("email")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Địa chỉ giao hàng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ giao hàng mặc định
                    </label>
                    <textarea
                      rows="3"
                      {...register("address", {
                        required: "Vui lòng nhập địa chỉ nhận hàng",
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white resize-none"
                    ></textarea>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            )}

            {/* TAB: QUẢN LÝ ĐƠN HÀNG */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>📦</span> Quản lý đơn hàng
                </h2>

                {/* Bọc bảng trong một thẻ div có overflow để responsive trên điện thoại */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                        <th className="p-4 font-medium">Mã đơn hàng</th>
                        <th className="p-4 font-medium">Ngày đặt</th>
                        <th className="p-4 font-medium">Tổng tiền</th>
                        <th className="p-4 font-medium">Trạng thái</th>
                        <th className="p-4 font-medium text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 font-semibold text-blue-600">
                            #{order.id}
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            {order.date}
                          </td>
                          <td className="p-4 font-bold text-red-500">
                            {formatPrice(order.total)}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors underline focus:outline-none">
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Phân trang (Pagination) giả lập cho sinh động */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                  <span>Hiển thị 1-3 của 3 đơn hàng</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 cursor-not-allowed opacity-50">
                      Trước
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 cursor-not-allowed opacity-50">
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DANH SÁCH YÊU THÍCH */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>❤️</span> Sản phẩm yêu thích
                </h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-gray-500">
                      Bạn chưa có sản phẩm yêu thích nào.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full transform transition-all scale-100">
            <div className="text-center">
              {/* Icon cảnh báo */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
                <span className="text-3xl">🚪</span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Bạn muốn đăng xuất?
              </h3>
              <p className="text-gray-500 mb-8 text-sm">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không? Các thay
                đổi chưa lưu có thể bị mất.
              </p>

              {/* Hai nút hành động */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)} // Tắt Modal
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Ở lại trang
                </button>
                <button
                  onClick={() => logout(true)}
                  className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
