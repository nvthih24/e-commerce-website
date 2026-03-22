import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null nghĩa là chưa đăng nhập

  // Hàm xử lý đăng nhập (Sau này team J2EE sẽ ném JWT token vào đây)
  const login = (userData) => {
    setUser(userData);
  };

  // Hàm xử lý đăng xuất
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Tắt cảnh báo Fast Refresh
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
