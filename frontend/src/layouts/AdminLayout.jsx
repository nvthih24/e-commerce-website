import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const navigate = useNavigate();
    // Lấy role từ localStorage 
    const role = localStorage.getItem('role');
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { logout } = useAuth();

    // Bảo mật FE: Nếu không phải ADMIN thì đá văng ra trang chủ
    if (role !== 'admin') {
        return <Navigate to="/" />;
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* Sidebar bên trái */}
            <div style={{ width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '20px' }}>
                <h2>Admin Panel</h2>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
                    <li style={{ marginBottom: '15px' }}><Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>📊 Dashboard</Link></li>
                    <li style={{ marginBottom: '15px' }}><Link to="/admin/categories" style={{ color: 'white', textDecoration: 'none' }}>📑 Quản lý Danh mục</Link></li> {/* Dòng mới */}
                    <li style={{ marginBottom: '15px' }}><Link to="/admin/products" style={{ color: 'white', textDecoration: 'none' }}>📦 Quản lý Sản phẩm</Link></li>
                    <li style={{ marginBottom: '15px' }}><Link to="/admin/orders" style={{ color: 'white', textDecoration: 'none' }}>🛒 Quản lý Đơn hàng</Link></li>
                    <li style={{ marginBottom: '15px' }}><Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>👥 Quản lý Người dùng</Link></li>
                </ul>
                <button 
                    onClick={() => setIsLogoutModalOpen(true)}
                    style={{ marginTop: '50px', padding: '10px', width: '100%', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Đăng xuất
                </button>
            </div>

            {/* MODAL ĐĂNG XUẤT */}
                  {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity px-4">
                      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full animate-fadeIn">
                        <div className="text-center">
                          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6"><span className="text-3xl">🚪</span></div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Bạn muốn đăng xuất?</h3>
                          <p className="text-gray-500 mb-8 text-sm">Bạn có chắc chắn muốn đăng xuất không?</p>
                          <div className="flex gap-3">
                            <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">Ở lại</button>
                            <button onClick={logout} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600">Đăng xuất</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

            {/* Nội dung bên phải (thay đổi theo route) */}
            <div style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;