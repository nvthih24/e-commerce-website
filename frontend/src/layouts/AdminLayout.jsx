import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();
    // Lấy role từ localStorage 
    const role = localStorage.getItem('role');

    // Bảo mật FE: Nếu không phải ADMIN thì đá văng ra trang chủ
    if (role !== 'ADMIN') {
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
                    onClick={handleLogout} 
                    style={{ marginTop: '50px', padding: '10px', width: '100%', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Đăng xuất
                </button>
            </div>

            {/* Nội dung bên phải (thay đổi theo route) */}
            <div style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;