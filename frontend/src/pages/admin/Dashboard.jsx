import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0
    });
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [statsRes, ordersRes] = await Promise.all([
                    axiosClient.get('/admin/stats'),
                    axiosClient.get('/orders/admin/all')
                ]);
                setStats(statsRes);
                setOrders(ordersRes.data || ordersRes || []);
            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Xử lý dữ liệu cho biểu đồ tròn (Trạng thái đơn hàng)
    const statusData = [
        { name: 'Chờ xử lý', value: orders.filter(o => o.status === 'PENDING').length, color: '#FBBF24' },
        { name: 'Đang giao', value: orders.filter(o => o.status === 'SHIPPING').length, color: '#3B82F6' },
        { name: 'Hoàn thành', value: orders.filter(o => o.status === 'DELIVERED').length, color: '#10B981' },
        { name: 'Đã hủy', value: orders.filter(o => o.status === 'CANCELLED').length, color: '#EF4444' },
    ].filter(item => item.value > 0);

    const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    if (isLoading) return <div className="p-10 text-center text-gray-500">Đang phân tích dữ liệu...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">📊 Tổng quan hệ thống</h2>

            {/* 1. HÀNG THẺ THỐNG KÊ NHANH */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng Doanh Thu" value={formatVND(stats.totalRevenue)} icon="💰" color="bg-emerald-500" />
                <StatCard title="Đơn Hàng" value={stats.totalOrders} icon="🛒" color="bg-blue-500" />
                <StatCard title="Sản Phẩm" value={stats.totalProducts} icon="📦" color="bg-orange-500" />
                <StatCard title="Người Dùng" value={stats.totalUsers} icon="👥" color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. BIỂU ĐỒ DOANH THU (BAR CHART) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>📈</span> Doanh thu theo đơn hàng (Gần đây)
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orders.slice(-10)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="id" hide />
                                <YAxis tickFormatter={(value) => `${value/1000000}M`} />
                                <Tooltip 
                                    formatter={(value) => formatVND(value)}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="totalAmount" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. BIỂU ĐỒ TRẠNG THÁI (PIE CHART) */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Trạng thái đơn hàng</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {statusData.map((item) => (
                            <div key={item.name} className="flex justify-between text-sm">
                                <span className="text-gray-500">{item.name}</span>
                                <span className="font-bold text-gray-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Component thẻ thống kê nhỏ
function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transform hover:scale-105 transition-all duration-300">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-gray-100`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h4 className="text-xl font-black text-gray-800">{value}</h4>
            </div>
        </div>
    );
}