import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-hot-toast';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/categories');
            setCategories(res); // Hoặc res.data tùy cấu hình axios
        } catch (error) {
            toast.error("Không thể tải danh sách danh mục");
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (category = null) => {
        setEditingCategory(category);
        setFormData({ name: category ? category.name : '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await axiosClient.put(`/categories/${editingCategory.id}`, formData);
                toast.success("Cập nhật danh mục thành công!");
            } else {
                await axiosClient.post('/categories', formData);
                toast.success("Thêm danh mục thành công!");
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            toast.error("Lỗi khi lưu danh mục");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await axiosClient.delete(`/categories/${id}`);
                toast.success("Xóa thành công!");
                fetchCategories();
            } catch (error) {
                toast.error("Không thể xóa danh mục đang có sản phẩm!");
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative min-h-[500px]">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
                <h2 className="text-2xl font-bold text-gray-800">📑 Quản lý Danh mục</h2>
                <button 
                    onClick={() => openModal()} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    + Thêm Danh Mục
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                <th className="p-4 font-semibold">Tên danh mục</th>
                                <th className="p-4 font-semibold text-center w-40">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr><td colSpan="2" className="text-center py-8 text-gray-400">Chưa có danh mục nào.</td></tr>
                            ) : (
                                categories.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800 font-medium mr-4">Sửa</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium">Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên danh mục *</label>
                                <input required autoFocus type="text" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} className="w-full border border-gray-200 focus:border-blue-400 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 focus:bg-white" placeholder="VD: Điện thoại thông minh"/>
                            </div>
                            <div className="pt-2 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition">Hủy</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-white bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition">
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu Danh Mục'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}