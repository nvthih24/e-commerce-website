import axios from 'axios';
export const IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
// Khởi tạo trạm trung chuyển với đường dẫn lấy từ file .env
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// THÊM TOKEN TỰ ĐỘNG TRƯỚC KHI GỬI ĐI
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ LocalStorage (Lát nữa ở AuthContext mình sẽ lưu vào đây)
    const token = localStorage.getItem('techstore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn thẻ thông hành vào
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// XỬ LÝ LỖI TRẢ VỀ (Ví dụ: hết hạn token)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Chỉ lấy phần data, bỏ qua mấy thông tin thừa
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token hết hạn hoặc không hợp lệ. Cần đăng nhập lại.');
      // Xử lý đá văng ra log out ở đây nếu cần
    }
    return Promise.reject(error);
  }
);

export default axiosClient;