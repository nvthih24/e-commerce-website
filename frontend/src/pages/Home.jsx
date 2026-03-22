import ProductCard from "../components/ProductCard";

// Dữ liệu giả (Mock Data) để test UI
const mockProducts = [
  {
    id: 1,
    name: "Laptop Gaming Acer Nitro 5 Tiger (Intel Core i5)",
    price: 21990000,
    oldPrice: 24990000,
    discount: 12,
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Điện thoại iPhone 15 Pro Max 256GB Titan Tự Nhiên",
    price: 29500000,
    oldPrice: 34990000,
    discount: 15,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Tai nghe Bluetooth Apple AirPods Pro Gen 2",
    price: 5490000,
    oldPrice: null,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Chuột Không Dây Logitech MX Master 3S",
    price: 2450000,
    oldPrice: 2800000,
    discount: 12,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpKNELrjEsGON2GkDCwqsJoP8vskHbbaYXyA&s",
  },
];

export default function Home() {
  return (
    <div className="pb-10">
      {/* Banner Khuyến Mãi */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 mb-10 text-white flex flex-col items-center justify-center text-center shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4">
          Tuần Lễ Công Nghệ - Giảm Sâu Tới 50%
        </h1>
        <p className="text-lg opacity-90 mb-6">
          Săn ngay các thiết bị điện tử chính hãng với mức giá tốt nhất.
        </p>
        <button className="bg-white text-blue-700 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
          Khám Phá Ngay
        </button>
      </div>

      {/* Khu vực danh sách sản phẩm */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sản Phẩm Nổi Bật</h2>
        <a href="#" className="text-blue-600 hover:underline font-medium">
          Xem tất cả &rarr;
        </a>
      </div>

      {/* Grid Layout chia cột tự động (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
