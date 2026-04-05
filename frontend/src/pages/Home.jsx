import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axiosClient from '../api/axiosClient';

// Dữ liệu giả cho Banner quảng cáo
const mockBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop',
    title: 'SIÊU TỐC ĐỘ - Laptop Gaming Giảm Tới 30%'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=2000&auto=format&fit=crop',
    title: 'TUẦN LỄ APPLE - Mua iPhone Tặng AirPods'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=2000&auto=format&fit=crop',
    title: 'PHỤ KIỆN CHÍNH HÃNG - Đồng Giá Từ 99K'
  }
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            // Chạy song song 2 API lấy Products và Categories cho lẹ
            const [productsData, categoriesData] = await Promise.all([
              axiosClient.get('/products'),
              axiosClient.get('/categories')
            ]);
            
            // 1. XỬ LÝ SẢN PHẨM: Trích xuất mảng từ thuộc tính 'content' (nếu có)
            const allProducts = productsData.content || productsData.data || productsData;
            
            // Ép kiểu chắc chắn là mảng, sau đó cắt lấy 8 sản phẩm đầu tiên làm Nổi bật
            if (Array.isArray(allProducts)) {
               setProducts(allProducts.slice(0, 8));
            } else {
               setProducts([]);
            }

            // 2. XỬ LÝ DANH MỤC: (Tương tự)
            const allCategories = categoriesData.content || categoriesData.data || categoriesData;
            setCategories(Array.isArray(allCategories) ? allCategories : []);

          } catch (error) {
            console.error("Lỗi lấy dữ liệu trang chủ:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }, []);

  // Hiệu ứng tự động chuyển Banner sau mỗi 4 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === mockBanners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer); // Xóa timer khi component bị hủy để tránh rò rỉ bộ nhớ
  }, []);

  // Các hàm điều khiển lật ảnh bằng tay
  const nextBanner = () => setCurrentBanner(prev => prev === mockBanners.length - 1 ? 0 : prev + 1);
  const prevBanner = () => setCurrentBanner(prev => prev === 0 ? mockBanners.length - 1 : prev - 1);

  const getIconForCategory = (name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('laptop') || lowerName.includes('máy tính')) return '💻';
      if (lowerName.includes('điện thoại') || lowerName.includes('phone')) return '📱';
      if (lowerName.includes('âm thanh') || lowerName.includes('tai nghe')) return '🎧';
      if (lowerName.includes('phụ kiện')) return '🖱️';
      return '🏷️';
    };

  return (
    <div className="pb-10">

      {/* 1. THANH TOP BANNER (Thông báo Sale Khủng) */}
      <div className="bg-red-600 text-white text-center py-2 px-4 rounded-lg mb-4 flex items-center justify-center gap-2 shadow-sm relative overflow-hidden">
        <span className="text-xl animate-pulse">🔥</span>
        <p className="font-bold text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
          NGÀY HỘI CÔNG NGHỆ 2026 - NHẬP MÃ <span className="text-yellow-300 font-black">TECH100</span> ĐỂ GIẢM NGAY 100K CHO ĐƠN TỪ 1 TRIỆU!
        </p>
        <span className="text-xl animate-pulse">🔥</span>
      </div>

      {/* 2. SLIDER BANNER CHÍNH */}
      <div className="relative w-full h-48 md:h-80 lg:h-[400px] rounded-2xl overflow-hidden shadow-lg mb-8 group bg-gray-100">

        {/* Khung chứa các ảnh (Sẽ trượt ngang) */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {mockBanners.map((banner) => (
            <div key={banner.id} className="min-w-full h-full relative">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover object-center" />
              {/* Lớp phủ đen Gradient mờ từ dưới lên để làm nổi bật chữ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
                <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-black mb-2 shadow-black drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {banner.title}
                </h2>
                <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold w-max mt-4 hover:bg-blue-600 hover:text-white transition-colors shadow-lg">
                  Khám Phá Ngay &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Nút Bấm Sang Trái / Phải (Chỉ hiện khi rê chuột vào banner) */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white backdrop-blur-sm text-gray-800 rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-all shadow-md"
        >
          &#10094;
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white backdrop-blur-sm text-gray-800 rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-all shadow-md"
        >
          &#10095;
        </button>

        {/* Dấu chấm điều hướng (Indicators) ở dưới cùng */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {mockBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`transition-all duration-300 rounded-full ${currentBanner === index ? 'bg-white w-8 h-2.5' : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>

     {/* HÀNG NÚT DANH MỤC LẤY TỪ API */}
           <div className="mb-12">
             <h2 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">Danh Mục Nổi Bật</h2>
             <div className="flex flex-wrap justify-center sm:justify-start gap-4">
               {categories.length > 0 ? (
                 categories.map((category) => (
                   <Link
                     key={category.id}
                     to={`/products?category=${category.id}`}
                     className="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md px-6 py-3.5 rounded-full font-medium text-gray-700 transition-all transform hover:-translate-y-1"
                   >
                     <span className="text-2xl">{getIconForCategory(category.name)}</span>
                     <span>{category.name}</span>
                   </Link>
                 ))
               ) : (
                  <p className="text-gray-400">Đang tải danh mục...</p>
               )}
             </div>
           </div>

           {/* DANH SÁCH SẢN PHẨM LẤY TỪ API */}
           <div className="mb-6 flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-800">Sản Phẩm Nổi Bật</h2>
             <Link to="/products" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">
               Xem tất cả &rarr;
             </Link>
           </div>

           {isLoading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
             </div>
           ) : products.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {products.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
                📭 Hiện chưa có sản phẩm nào trên Database của ông. Ông cần dùng Postman hoặc code giao diện Admin để thêm dữ liệu vào nhé!
             </div>
           )}

         </div>
  );
}