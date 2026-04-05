import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-hot-toast';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            // Gọi API lấy toàn bộ đơn hàng cho Admin
            const res = await axiosClient.get('/orders/admin/all');
            // Đảo ngược mảng để đơn hàng mới nhất (vừa đặt) lên đầu tiên
            const data = res.data || res.content || res || [];
            setOrders(Array.isArray(data) ? data.reverse() : []);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
            toast.error("Không thể tải danh sách đơn hàng");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm gọi API cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axiosClient.put(`/orders/${orderId}/status?status=${newStatus}`);
            toast.success("Đã cập nhật trạng thái đơn hàng!");
            fetchOrders(); // Load lại bảng cho đồng bộ
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái!");
            console.error(error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    // Hàm render màu sắc cho trạng thái
    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Chờ xác nhận</span>;
            case 'SHIPPING':
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Đang giao</span>;
            case 'DELIVERED':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Đã hoàn thành</span>;
            case 'CANCELLED':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Đã hủy</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative min-h-[500px]">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
                <h2 className="text-2xl font-bold text-gray-800">🛒 Quản lý Đơn hàng</h2>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold">
                    Tổng: {orders.length} đơn
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                <th className="p-4 font-semibold">Mã ĐH / Ngày đặt</th>
                                <th className="p-4 font-semibold">Khách hàng</th>
                                <th className="p-4 font-semibold w-1/4">Sản phẩm</th>
                                <th className="p-4 font-semibold text-right">Tổng tiền</th>
                                <th className="p-4 font-semibold text-center">Trạng thái</th>
                                <th className="p-4 font-semibold text-center w-40">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400">Chưa có đơn hàng nào.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="font-mono text-xs text-gray-500 mb-1">{order.id}</div>
                                            <div className="font-medium text-gray-800">
                                                {new Date(order.createdAt).toLocaleString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{order.fullName}</div>
                                            <div className="text-sm text-gray-600">{order.phone}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-[150px]" title={order.address}>{order.address}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-2 max-h-24 overflow-y-auto custom-scrollbar pr-2">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2 items-center text-sm">
                                                        <img src={item.imageUrl || 'https://via.placeholder.com/40'} alt="img" className="w-8 h-8 rounded object-cover border"/>
                                                        <div className="flex-1 truncate" title={item.name}>{item.name}</div>
                                                        <div className="text-gray-500 font-medium">x{item.quantity}</div>
                                                    </div>
                                                ))} 
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-bold text-red-600">
                                            {formatPrice(order.totalAmount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* Dropdown để Admin chọn trạng thái mới */}
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="PENDING">Chờ xác nhận</option>
                                                <option value="SHIPPING">Đang giao</option>
                                                <option value="DELIVERED">Hoàn thành</option>
                                                <option value="CANCELLED">Hủy đơn</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}