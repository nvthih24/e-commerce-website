import { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Dùng useRef để reset ô input file dễ dàng
    const fileInputRef = useRef(null);

    // ==========================================
    // STATE QUẢN LÝ MODAL & FORM
    // ==========================================
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State cực kỳ quan trọng: null => Thêm mới, có object => Đang sửa sản phẩm đó
    const [editingProduct, setEditingProduct] = useState(null);

    const initialFormState = {
        name: '',
        price: '',
        stock: '',
        categoryId: '65f1a2b3c4d5e6f7a8b9c0d1', // Hardcode ID danh mục
        description: '',
        colors: '' // Nhập: Trắng, Đen
    };

    const [formData, setFormData] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
    try {
        setIsLoading(true);
        const productsData = await axiosClient.get('/products');
        setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
        toast.error("Lỗi tải sản phẩm");
    } finally { setIsLoading(false); }
};

    // ==========================================
    // HÀM MỞ MODAL (DÙNG CHUNG CHO THÊM/SỬA)
    // ==========================================
    const openModalForAdd = () => {
        setEditingProduct(null); // Đánh dấu là THÊM MỚI
        setFormData(initialFormState); // Reset form về rỗng
        setImageFile(null); // Xóa ảnh cũ trong state
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset ô input file UI
        setShowModal(true);
    };

    const openModalForEdit = (product) => {
        setEditingProduct(product); // Đánh dấu là ĐANG SỬA sản phẩm này
        
        // Điền dữ liệu cũ vào Form
        setFormData({
            name: product.name || '',
            price: product.price || '',
            stock: product.stock || '',
            categoryId: product.categoryId || '65f1a2b3c4d5e6f7a8b9c0d1',
            description: product.description || '',
            // Chuyển mảng ["Trắng", "Đen"] thành chuỗi "Trắng, Đen" để hiện lên input
            colors: (product.colors && product.colors.join(', ')) || '' 
        });
        setImageFile(null); // Khi sửa, User có thể không chọn ảnh mới, nên mặc định là null
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset ô input file UI
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        // Delay 1 chút để reset state sau khi modal đóng hẳn cho đẹp mắt
        setTimeout(() => setEditingProduct(null), 300); 
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // ==========================================
    // HÀM XỬ LÝ SUBMIT FORM (XỬ LÝ CẢ THÊM & SỬA)
    // ==========================================
    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    
    if (imageFile) {
        // 'image' phải trùng với upload.single('image') trong productRoutes.js
        submitData.append("image", imageFile); 
    }

    try {
        if (editingProduct) {
            // Dùng _id cho MongoDB
            await axiosClient.put(`/products/${editingProduct._id}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Cập nhật thành công!");
        } else {
            await axiosClient.post('/products', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Thêm thành công!");
        }
        closeModal();
        fetchProducts();
    } catch (error) {
        toast.error("Có lỗi xảy ra");
    } finally { setIsSubmitting(false); }
};

    // Hàm Xóa giữ nguyên
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await axiosClient.delete(`/products/${id}`);
                toast.success("Xóa thành công!");
                fetchProducts();
            } catch (error) {
                toast.error("Lỗi khi xóa sản phẩm");
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative min-h-[500px]">
            {/* TIÊU ĐỀ & NÚT THÊM */}
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
                <h2 className="text-2xl font-bold text-gray-800">📦 Quản lý Sản phẩm</h2>
                <button 
                    onClick={openModalForAdd} // Gọi hàm mở Modal ở chế độ Thêm
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    + Thêm Sản Phẩm Mới
                </button>
            </div>

            {/* BẢNG SẢN PHẨM */}
            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                <th className="p-4 font-semibold w-20">Ảnh</th>
                                <th className="p-4 font-semibold">Tên sản phẩm</th>
                                <th className="p-4 font-semibold">Giá bán</th>
                                <th className="p-4 font-semibold">Tồn kho</th>
                                <th className="p-4 font-semibold text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-400">Chưa có sản phẩm nào. Hãy bấm thêm mới!</td>
                                </tr>
                            ) : (
                                products.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <img 
                                                src={item.image ? `${import.meta.env.VITE_IMAGE_URL}${item.image}` : 'https://via.placeholder.com/100'} 
                                                alt={item.name} 
                                                className="w-14 h-14 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                        <td className="p-4 text-blue-600 font-semibold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {item.stock > 0 ? `Còn ${item.stock}` : 'Hết hàng'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* NÚT SỬA: Gọi hàm mở Modal Sửa và truyền dữ liệu sản phẩm vào */}
                                            <button 
                                                onClick={() => openModalForEdit(item)}
                                                className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition"
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)} 
                                                className="text-red-600 hover:text-red-800 font-medium transition"
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
            {/* MODAL THÊM/SỬA SẢN PHẨM */}
            {/* ========================================== */}
            {showModal && (
                // Lớp nền mờ (Backdrop): Dòng dưới đã sửa để không còn bị "Đen thui"
                // Đổi bg-black thành bg-black/50 (đen trong suốt 50%)
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
                    
                    {/* Thẻ chứa Form: Có thêm hiệu ứng bo góc tròn trịa giống image_1.png */}
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                        
                        {/* Header Modal: Sticky để luôn hiện tiêu đề khi cuộn form */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900">
                                {/* Tiêu đề thay đổi động dựa theo chế độ */}
                                {editingProduct ? `Sửa Sản Phẩm: ${editingProduct.name}` : 'Thêm Sản Phẩm Mới'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 text-3xl leading-none transition">&times;</button>
                        </div>
                        
                        {/* FORM DỮ LIỆU */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên sản phẩm *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-200 focus:border-blue-400 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 focus:bg-white" placeholder="VD: iPhone 15 Pro Max"/>
                                </div>
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục *</label>
                                <select 
                                    name="categoryId" 
                                    value={formData.categoryId} 
                                    onChange={handleInputChange} 
                                    className="w-full border border-gray-200 focus:border-blue-400 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 focus:bg-white"
                                >
                                    {categories.length === 0 ? (
                                        <option value="">Chưa có danh mục</option>
                                    ) : (
                                        categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá bán (VNĐ) *</label>
                                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border border-gray-200 focus:border-blue-400 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 focus:bg-white" placeholder="VD: 29900000"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng tồn kho *</label>
                                    <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border border-gray-200 focus:border-blue-400 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 focus:bg-white" placeholder="VD: 50"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Màu sắc (cách nhau dấu phẩy)</label>
                                    <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} className="w-full border border-gray-200 focus:border-blue-400 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 focus:bg-white" placeholder="VD: Trắng, Đen, Titan"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả sản phẩm</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full border border-gray-200 focus:border-blue-400 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 focus:bg-white resize-none" placeholder="Nhập mô tả chi tiết sản phẩm..."></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Ảnh sản phẩm {editingProduct ? '(Để trống nếu giữ ảnh cũ)' : '*'}
                                </label>
                                <input 
                                    ref={fileInputRef} // Gắn ref để reset ô input
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition"
                                />
                                {editingProduct && editingProduct.imageUrl && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                        <span>Ảnh hiện tại:</span>
                                        <img src={editingProduct.imageUrl} alt="Cũ" className="w-10 h-10 object-cover rounded border"/>
                                    </div>
                                )}
                            </div>

                            {/* NÚT HÀNH ĐỘNG */}
                            <div className="pt-5 flex justify-end space-x-3 border-t border-gray-100 mt-7">
                                <button type="button" onClick={closeModal} className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition">Hủy bỏ</button>
                                <button type="submit" disabled={isSubmitting} className={`px-6 py-3 text-white rounded-xl font-bold transition flex items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'}`}>
                                    {isSubmitting ? (
                                        <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang lưu...</>
                                    ) : (editingProduct ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}