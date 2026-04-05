import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-hot-toast';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ==========================================
    // STATE CHO POPUP XÁC NHẬN XÓA
    // ==========================================
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/admin/users');
            const data = res.content || res.data || res;
            
            // Lọc ra khách hàng (USER)
            const onlyUsers = data.filter(u => u.role !== 'ADMIN');
            setUsers(onlyUsers);
            
        } catch (error) {
            console.error("Lỗi lấy danh sách user:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm 1: Bấm nút Xóa ở bảng -> Mở Popup lên thay vì dùng window.confirm
    const openDeleteModal = (user) => {
        setDeleteModal({ isOpen: true, user: user });
    };

    // Hàm 2: Hủy xóa -> Đóng Popup
    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, user: null });
    };

    // Hàm 3: Xác nhận Xóa thật sự (Gọi API)
    const confirmDelete = async () => {
        if (!deleteModal.user) return;
        
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/admin/users/${deleteModal.user.id}`);
            toast.success("Đã xóa tài khoản thành công!");
            closeDeleteModal(); // Đóng popup
            fetchUsers(); // Tải lại bảng
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Lỗi khi xóa người dùng. Vui lòng thử lại!");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative min-h-[500px]">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
                <h2 className="text-2xl font-bold text-gray-800">👥 Quản lý Khách hàng</h2>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold">
                    Tổng cộng: {users.length} khách hàng
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                <th className="p-4 font-semibold w-16 text-center">STT</th>
                                <th className="p-4 font-semibold">Khách hàng</th>
                                <th className="p-4 font-semibold">Số điện thoại</th>
                                <th className="p-4 font-semibold">Địa chỉ</th>
                                <th className="p-4 font-semibold text-center">Vai trò</th>
                                <th className="p-4 font-semibold text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400">Chưa có khách hàng nào.</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4 text-center text-gray-500 font-medium">{index + 1}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{user.fullName || 'Chưa cập nhật'}</div>
                                                    <div className="text-sm text-gray-500">{user.email || 'Chưa có email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">{user.phone}</td>
                                        <td className="p-4 text-gray-600">{user.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* SỬA CHỖ NÀY: Gọi hàm mở Popup thay vì xóa luôn */}
                                            <button 
                                                onClick={() => openDeleteModal(user)}
                                                className="text-red-500 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ========================================== */}
            {/* POPUP XÁC NHẬN XÓA (Custom Modal) */}
            {/* ========================================== */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 p-6 text-center">
                        
                        {/* Icon cảnh báo */}
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa tài khoản</h3>
                        <p className="text-gray-500 mb-6">
                            Bạn có chắc chắn muốn xóa khách hàng <strong className="text-gray-800">{deleteModal.user?.fullName || 'này'}</strong> không? Hành động này không thể hoàn tác!
                        </p>
                        
                        {/* Nút hành động */}
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className={`px-6 py-2.5 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2 ${isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'}`}
                            >
                                {isDeleting ? (
                                    <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang xóa...</>
                                ) : (
                                    'Xác nhận Xóa'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}