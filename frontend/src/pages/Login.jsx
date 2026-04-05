import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
      setIsLoading(true);

      try {
        if (isLogin) {
          // ==========================================
          // 1. GỌI API ĐĂNG NHẬP
          // ==========================================
          const res = await axiosClient.post('/auth/login', {
            phone: data.phone,
            password: data.password
          });

          const token = res.accessToken;

          localStorage.setItem('techstore_token', token);

          const profile = await axiosClient.get('/user/profile');

          localStorage.setItem('role', profile.role);

          // Khởi tạo thông tin User để lưu vào Frontend
          const userData = {
            fullName: profile.fullName,
            phone: profile.phone,
            email: profile.email || '',
            role: profile.role,
            avatar: `https://ui-avatars.com/api/?name=${profile.fullName}&background=0D8ABC&color=fff`
          };

          login(userData, token); // Lưu vào Context
          toast.success('Đăng nhập thành công! 🎉');

          if (profile.role === 'ADMIN') {
            setTimeout(() => navigate('/admin'), 500); 
          } else {

          const destination = location.state?.from || '/';
          setTimeout(() => navigate(destination, { state: location.state }), 500);

          }

        } else {
          // ==========================================
          // 2. GỌI API ĐĂNG KÝ
          // ==========================================
          await axiosClient.post('/auth/register', {
            fullName: data.fullName,
            phone: data.phone,
            password: data.password,
            email: data.email
          });

          toast.success('Đăng ký thành công! Vui lòng đăng nhập lại. 🚀');
          setIsLogin(true);
          reset();
        }

      } catch (error) {
        console.error("Lỗi API:", error);
        let errorMsg = 'Sai thông tin hoặc có lỗi xảy ra!';

        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                            errorMsg = error.response.data;
                        } else if (error.response.data.message) {
                            errorMsg = error.response.data.message;
                        } else if (error.response.data.error) {
                            errorMsg = error.response.data.error;
                        }
        }
        toast.error(errorMsg);
      } finally {
        setIsLoading(false); // Tắt hiệu ứng xoay xoay
      }
    };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">

        {/* Lớp phủ Loading khi đang gọi API */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Tiêu đề & Nút chuyển đổi */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => { setIsLogin(true); reset(); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setIsLogin(false); reset(); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Đăng ký
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Chào mừng trở lại! 👋' : 'Tạo tài khoản mới 🚀'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Vui lòng nhập số điện thoại để tiếp tục mua sắm.' : 'Đăng ký bằng số điện thoại để nhận nhiều ưu đãi.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Form Đăng Ký thì hiện thêm ô Họ Tên */}
          {!isLogin && (
              <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors bg-gray-50 focus:bg-white`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                            <input
                              type="email"
                              placeholder="Ví dụ: email@techstore.com"
                              {...register("email", {
                                required: "Vui lòng nhập email",
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Email không hợp lệ"
                                }
                              })}
                              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                          </div>
                          </>
          )}

          {/* Ô SỐ ĐIỆN THOẠI (Dùng chung cho cả Đăng nhập & Đăng ký) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại của bạn"
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ (gồm 10 số)" }
              })}
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors bg-gray-50 focus:bg-white`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              {isLogin && <a href="#" className="text-xs text-blue-600 hover:underline font-medium">Quên mật khẩu?</a>}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
              })}
              className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors bg-gray-50 focus:bg-white`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-2"
          >
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </button>
        </form>

      </div>
    </div>
  );
}