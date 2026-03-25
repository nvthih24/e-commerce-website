import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockData';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Lấy chữ 'q' trên đường dẫn xuống

  // Lọc sản phẩm: Ép tất cả về chữ thường (toLowerCase) để tìm kiếm không phân biệt hoa thường
  const searchResults = mockProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pb-10 min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800">
          Kết quả tìm kiếm cho: <span className="font-bold text-blue-600">"{query}"</span>
        </h1>
        <p className="text-gray-500 mt-2">Tìm thấy {searchResults.length} sản phẩm phù hợp.</p>
      </div>

      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🕵️‍♂️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Rất tiếc, không tìm thấy kết quả nào!</h2>
          <p className="text-gray-500">Thử kiểm tra lại lỗi chính tả hoặc dùng từ khóa chung chung hơn nhé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}