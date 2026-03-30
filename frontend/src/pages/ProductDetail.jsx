import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <-- Nhớ import thêm useNavigate
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { mockProducts } from '../data/mockData';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- Khởi tạo useNavigate
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = mockProducts.find((p) => p.id === parseInt(id));

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.variants?.length > 0) setSelectedVariant(product.variants[0]);
      if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-20 text-2xl font-bold text-gray-500">Sản phẩm không tồn tại! 🥲</div>;
  }

  const isWished = isInWishlist(product.id);
  const currentPrice = product.price + (selectedVariant ? selectedVariant.priceOffset : 0);
  const currentOldPrice = product.oldPrice ? product.oldPrice + (selectedVariant ? selectedVariant.priceOffset : 0) : null;
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Hàm 1: Chỉ Thêm vào giỏ hàng
  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      id: `${product.id}-${selectedVariant?.id}-${selectedColor?.id}`,
      name: `${product.name} (${selectedVariant?.name} - Màu ${selectedColor?.name})`,
      price: currentPrice
    };
    addToCart(cartItem);
  };

  // Hàm 2: Thêm vào giỏ xong bay thẳng ra trang Cart luôn
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="pb-16 pt-4 relative">
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-blue-600">
          {product.category === 'phone' ? 'Điện thoại' : product.category === 'laptop' ? 'Laptop' : 'Phụ kiện'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

          {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM */}
          <div className="w-full md:w-5/12 shrink-0">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative group overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  Giảm {product.discount}%
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
               {[1,2,3,4].map(i => (
                 <div key={i} className={`w-20 h-20 rounded-xl border-2 p-2 cursor-pointer bg-gray-50 shrink-0 ${i === 1 ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                   <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" />
                 </div>
               ))}
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN & MUA HÀNG */}
          <div className="w-full md:w-7/12 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <span className="text-blue-600 text-sm hover:underline cursor-pointer">(124 đánh giá)</span>
              <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-0.5 rounded-md">Còn hàng</span>
            </div>

            <div className="flex items-end gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-4xl font-black text-red-600 tracking-tight">{formatPrice(currentPrice)}</span>
              {currentOldPrice && (
                <span className="text-lg text-gray-400 line-through mb-1 font-medium">{formatPrice(currentOldPrice)}</span>
              )}
            </div>

            {/* LỰA CHỌN PHIÊN BẢN */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Phiên bản:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button key={variant.id} onClick={() => setSelectedVariant(variant)} className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${selectedVariant?.id === variant.id ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'}`}>
                      {variant.name}
                      <span className="block text-xs mt-0.5 opacity-80">{variant.priceOffset > 0 ? `+ ${formatPrice(variant.priceOffset)}` : 'Giá gốc'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LỰA CHỌN MÀU SẮC */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">
                  Màu sắc: <span className="text-blue-600 normal-case font-medium">{selectedColor?.name}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button key={color.id} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor?.id === color.id ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'}`} style={{ backgroundColor: color.hex, outline: '1px solid #e5e7eb' }} title={color.name}>
                      {selectedColor?.id === color.id && (
                        <span className={`text-sm ${['#ffffff', '#f2f1ed', '#d4d4d4'].includes(color.hex) ? 'text-black' : 'text-white'}`}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* NÚT ACTION (Đã thêm MUA NGAY) */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              {/* Nút Mua Ngay (Màu đỏ chói lóa) */}
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1 text-lg flex justify-center items-center gap-2"
              >
                <span>⚡</span> Mua Ngay
              </button>

              {/* Nút Thêm Giỏ Hàng (Viền xanh thanh lịch) */}
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-blue-600 text-blue-600 bg-white font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 text-lg flex justify-center items-center gap-2"
              >
                <span>🛒</span> Thêm Giỏ Hàng
              </button>

              {/* Nút Yêu Thích */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl border-2 transition-colors text-2xl ${isWished ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
              >
                {isWished ? '❤️' : '🤍'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* KHU VỰC MÔ TẢ & CẤU HÌNH RÚT GỌN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
           <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Đặc điểm nổi bật</h2>
           <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
           <img src={product.image} className="w-full rounded-2xl mb-6 bg-gray-50 border border-gray-100 object-cover h-64 mix-blend-multiply" />
           <p className="text-gray-600 leading-relaxed">Sản phẩm được tối ưu hóa để mang lại trải nghiệm tốt nhất cho người dùng...</p>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 self-start sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
            <span>⚙️</span> Thông số kỹ thuật
          </h2>
          <div className="space-y-0">
            {product.specs.slice(0, 5).map((spec, index) => (
              <div key={index} className={`flex flex-col sm:flex-row py-3 px-4 ${index % 2 === 0 ? 'bg-gray-50 rounded-xl' : ''}`}>
                <span className="sm:w-1/3 text-gray-500 text-sm font-medium">{spec.label}</span>
                <span className="sm:w-2/3 text-gray-800 text-sm font-medium mt-1 sm:mt-0">{spec.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsSpecsModalOpen(true)}
            className="w-full mt-6 py-3 border border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
          >
            Xem cấu hình chi tiết &rarr;
          </button>
        </div>
      </div>

      {/* MODAL CẤU HÌNH CHI TIẾT */}
      {isSpecsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsSpecsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col transform transition-all relative z-10 animate-slideUp">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0 sticky top-0 z-20">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2.5">
                <span className="text-2xl leading-none">⚙️</span>
                Thông số kỹ thuật {product.name}
              </h2>
              <button onClick={() => setIsSpecsModalOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-400 hover:bg-red-50 hover:text-red-500 text-3xl leading-none border border-gray-100 shadow-inner transition-colors">
                &times;
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-0">
                {product.specs.map((spec, index) => (
                  <div key={index} className={`flex flex-col sm:flex-row py-4 px-5 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50 rounded-xl' : 'bg-white'}`}>
                    <span className="sm:w-2/5 text-gray-500 text-sm font-medium pr-4">{spec.label}</span>
                    <span className="sm:w-3/5 text-gray-800 text-sm font-bold mt-1.5 sm:mt-0 leading-relaxed">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center shrink-0">
               <button onClick={() => setIsSpecsModalOpen(false)} className="px-10 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors shadow-sm">
                 Đóng lại
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}