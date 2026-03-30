import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Lấy thông tin user từ localStorage (nếu có)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('techstore_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // HÀM LOGIN ĐÃ NÂNG CẤP: Nhận thêm 'token' từ Backend trả về
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('techstore_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('techstore_token', token); // Lưu JWT Token
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('techstore_user');
    localStorage.removeItem('techstore_token'); // Xóa luôn JWT Token
    window.location.href = '/login'; // Ép tải lại trang về login cho sạch sẽ bộ nhớ
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);