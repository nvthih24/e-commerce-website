import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { mockProducts, categories } from '../data/mockData';

export default function Products() {
  const [sortOption, setSortOption] = useState('newest');
const [searchParams] = useSearchParams();
const categoryFilter = searchParams.get('category');

  // Bước 1: Lọc sản phẩm theo danh mục (nếu có click chọn)
    let filteredProducts = mockProducts;
    if (categoryFilter) {
      filteredProducts = mockProducts.filter(p => p.category === categoryFilter);
    }

    // Bước 2: Sắp xếp các sản phẩm đã lọc
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return b.id - a.id;
    });

    // Tìm tên danh mục để in ra tiêu đề cho xịn
    const currentCategoryName = categoryFilter
      ? categories.find(c => c.id === categoryFilter)?.name
      : 'Tất Cả Sản Phẩm';

  return (
    <div className="pb-10">
      <nav className="text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
              <span className="mx-2">/</span>
              {/* Nếu có lọc thì in ra Tên Danh Mục, không thì in ra Tất cả sản phẩm */}
              {categoryFilter ? (
                <>
                  <Link to="/products" className="hover:text-blue-600 transition-colors">Tất cả sản phẩm</Link>
                  <span className="mx-2">/</span>
                  <span className="text-gray-800 font-medium">{currentCategoryName}</span>
                </>
              ) : (
                <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
              )}
            </nav>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          {/* Đổi Title động theo danh mục luôn */}
                    <h1 className="text-2xl font-bold text-gray-800">{currentCategoryName}</h1>
                    <p className="text-gray-500 mt-2">Hiển thị {sortedProducts.length} sản phẩm</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500 font-medium">Sắp xếp:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium cursor-pointer shadow-sm transition-all hover:border-blue-300"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}