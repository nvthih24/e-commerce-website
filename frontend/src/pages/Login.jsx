import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Hàm xử lý khi người dùng ấn Submit (và dữ liệu đã hợp lệ)
  const onSubmit = (data) => {
    if (isLogin) {
      // Giả lập dữ liệu trả về từ Backend. Tạm lấy tên là Thịnh cho chuẩn bài nhé!
      const mockUserData = {
        name: "Thịnh",
        email: data.email,
        avatar:
          "https://ui-avatars.com/api/?name=Thinh&background=0D8ABC&color=fff",
      };

      login(mockUserData); // Lưu vào Global State

      toast.success("Đăng nhập thành công! 🎉");
      const destination = location.state?.from || '/';
      setTimeout(() => navigate(destination, { state: location.state }), 1000);
    } else {
      // Logic đăng ký giữ nguyên
      toast.success("Đăng ký tài khoản thành công! 🚀");
      setIsLogin(true);
      reset();
    }
  };

  // Hàm toggle giữa Đăng nhập/Đăng ký (kèm reset lỗi)
  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset(); // Reset form để mất mấy câu báo lỗi đỏ đỏ đi
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Cột trái: Hình ảnh minh họa */}
        <div className="hidden md:block w-1/2 bg-blue-600 p-10 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-4">
              {isLogin ? "Chào mừng trở lại! 👋" : "Bắt đầu hành trình! 🚀"}
            </h2>
            <p className="text-blue-100 text-lg">
              {isLogin
                ? "Đăng nhập để xem các ưu đãi độc quyền và quản lý đơn hàng của bạn."
                : "Tạo tài khoản ngay hôm nay để trải nghiệm mua sắm thiết bị công nghệ đỉnh cao."}
            </p>
          </div>
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-indigo-500 rounded-full opacity-50 blur-2xl"></div>
        </div>

        {/* Cột phải: Form nhập liệu */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              {isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"}
            </h3>
            <p className="text-gray-500 mt-2">
              {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <button
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:underline focus:outline-none"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập tại đây"}
              </button>
            </p>
          </div>

          {/* Dùng handleSubmit của hook bọc quanh onSubmit của mình */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Input Họ Tên (Chỉ hiện khi Đăng Ký) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  {...register("fullName", {
                    required: "Vui lòng nhập họ và tên của bạn",
                  })}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            )}

            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                placeholder="Ex: thinh@example.com"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không đúng định dạng hợp lệ",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Mật khẩu */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                {isLogin && (
                  <a href="#" className="text-xs text-blue-600 hover:underline">
                    Quên mật khẩu?
                  </a>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải dài ít nhất 6 ký tự",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-4"
            >
              {isLogin ? "Đăng Nhập" : "Đăng Ký"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              &larr; Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
