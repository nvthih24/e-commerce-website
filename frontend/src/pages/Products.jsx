import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axiosClient from '../api/axiosClient';

export default function Products() {
    const [sortOption, setSortOption] = useState('newest');
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            // Tạm thời gọi size=100 để lấy nhiều sản phẩm về FE tự lọc
            const [productsRes, categoriesRes] = await Promise.all([
              axiosClient.get('/products?size=100'),
              axiosClient.get('/categories')
            ]);

            // Backend mới trả về phân trang, nên danh sách nằm trong biến 'content'
            const allProducts = productsRes.content || productsRes || [];
            setProducts(allProducts);
            setCategories(categoriesRes || []);
          } catch (error) {
            console.error("Lỗi lấy dữ liệu trang Products:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }, []);

    let filteredProducts = products;
    if (categoryFilter) {
      filteredProducts = products.filter(p => p.category === categoryFilter);
    }

    // Bước 2: Sắp xếp các sản phẩm đã lọc
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return b.id > a.id ? 1 : -1;
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

{isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
           <span className="text-4xl block mb-4">📭</span>
           <p className="text-gray-600 font-medium text-lg">Chưa có sản phẩm nào trong danh mục này.</p>
           <Link to="/products" className="inline-block mt-4 text-blue-600 font-bold hover:underline">
             &larr; Xem tất cả sản phẩm
           </Link>
        </div>
      )}
    </div>
  );
}